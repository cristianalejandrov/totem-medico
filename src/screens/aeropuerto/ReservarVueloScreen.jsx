import { useEffect, useMemo, useState } from 'react'
import WorldMap from '../../components/WorldMap'
import { getDestinoById, getPaisById, PAISES } from '../../data/destinos'
import {
  buscarVuelos,
  formatCLP,
  formatFechaVuelo,
  proximosDias,
  reservarVuelo,
} from '../../data/vuelos'
import { tts } from '../../voice/tts'

export default function ReservarVueloScreen({ rut, onReservado, onBack }) {
  const dias = useMemo(() => proximosDias(12), [])
  const [paso, setPaso] = useState(0)
  const [subDestino, setSubDestino] = useState('pais')
  const [paisId, setPaisId] = useState(null)
  const [destinoId, setDestinoId] = useState(null)
  const [idaYVuelta, setIdaYVuelta] = useState(false)
  const [fechaIda, setFechaIda] = useState(null)
  const [fechaVuelta, setFechaVuelta] = useState(null)
  const [vueloSel, setVueloSel] = useState(null)
  const [pasajeros, setPasajeros] = useState(1)

  const pais = getPaisById(paisId)
  const destino = getDestinoById(destinoId)

  useEffect(() => {
    tts.speak('Elige el país de destino. Si viajas dentro de Chile, podrás elegir la región.')
  }, [])

  const vuelos = useMemo(() => {
    if (!destinoId || !fechaIda) return []
    return buscarVuelos({
      destinoId,
      fechaIda: fechaIda.toISOString(),
      fechaVuelta: fechaVuelta?.toISOString(),
      idaYVuelta,
    })
  }, [destinoId, fechaIda, fechaVuelta, idaYVuelta])

  const irPaso = (n, msg) => {
    setPaso(n)
    if (msg) tts.speak(msg)
  }

  const elegirPais = (p) => {
    setPaisId(p.id)
    setDestinoId(null)
    if (p.esNacional || p.destinos.length > 1) {
      setSubDestino('ciudad')
      tts.speak(
        p.esNacional
          ? 'Elige la región de destino dentro de Chile.'
          : `Elige la ciudad en ${p.nombre}.`,
      )
    } else {
      setDestinoId(p.destinos[0].id)
      setSubDestino('ciudad')
    }
  }

  const confirmar = () => {
    if (!vueloSel) return
    const reserva = reservarVuelo(rut, vueloSel, pasajeros)
    tts.speak(`Listo. Tu reserva quedó confirmada. Código P N R ${reserva.pnr.split('').join(' ')}.`)
    onReservado(reserva)
  }

  const volverDestino = () => {
    if (paso > 0) {
      setPaso((p) => p - 1)
      return
    }
    if (subDestino === 'ciudad') {
      setSubDestino('pais')
      setPaisId(null)
      setDestinoId(null)
      tts.speak('Elige el país de destino.')
      return
    }
    onBack()
  }

  const labelVolver =
    paso > 0
      ? '← Volver'
      : subDestino === 'ciudad'
        ? '← Volver a países'
        : '← Volver al menú'

  return (
    <div className="screen screen-scroll">
      <h1 className="title">Reservar vuelo</h1>
      <p className="subtitle">
        {paso === 0 && subDestino === 'pais' && 'Selecciona el país de destino'}
        {paso === 0 && subDestino === 'ciudad' && pais?.esNacional && 'Elige región de destino'}
        {paso === 0 && subDestino === 'ciudad' && pais && !pais.esNacional && `Ciudad en ${pais.nombre}`}
        {paso === 1 && 'Tipo de viaje y fechas'}
        {paso === 2 && 'Elige tu horario'}
        {paso === 3 && 'Confirma tu reserva'}
      </p>

      {paso === 0 && subDestino === 'pais' && (
        <>
          <WorldMap />
          <div className="paises-grid">
            {PAISES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`card-btn card-btn-pais ${paisId === p.id ? 'selected' : ''}`}
                onClick={() => elegirPais(p)}
              >
                <span className="dest-flag">{p.bandera}</span>
                <span className="card-btn-title">{p.nombre}</span>
                <span className="card-btn-sub">
                  {p.esNacional
                    ? `${p.destinos.length} regiones`
                    : p.destinos.find((d) => d.capital)?.ciudad || p.destinos[0].ciudad}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {paso === 0 && subDestino === 'ciudad' && pais && (
        <>
          <WorldMap pais={pais} destino={destino} />

          <div className={pais.esNacional ? 'regiones-list' : 'grid-2 destinos-grid'}>
            {pais.destinos.map((d) => {
              const full = getDestinoById(d.id)
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`row-btn destino-row ${destinoId === d.id ? 'selected' : ''}`}
                  onClick={() => setDestinoId(d.id)}
                >
                  <div className="row-main">
                    <span className="row-title">
                      {d.ciudad}
                      {d.capital && !pais.esNacional && (
                        <span className="chip chip-capital">Capital</span>
                      )}
                    </span>
                    <span className="row-sub">
                      {d.region || full?.pais} · {d.codigo}
                    </span>
                  </div>
                  <span className="row-chevron">›</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="btn-primary"
            disabled={!destinoId}
            onClick={() =>
              irPaso(1, 'Indica si es solo ida o ida y vuelta, y elige las fechas.')
            }
          >
            Continuar
          </button>
        </>
      )}

      {paso === 1 && (
        <>
          {destino && (
            <div className="route-banner route-banner-light">
              <WorldMap pais={pais} destino={destino} />
              <span className="route-codes">SCL → {destino.codigo}</span>
              <span className="route-sub">
                {destino.ciudad}
                {destino.region ? ` · ${destino.region}` : ''}, {destino.pais}
              </span>
            </div>
          )}

          <div className="segmented">
            <button
              type="button"
              className={`segment ${!idaYVuelta ? 'active' : ''}`}
              onClick={() => {
                setIdaYVuelta(false)
                setFechaVuelta(null)
              }}
            >
              Solo ida
            </button>
            <button
              type="button"
              className={`segment ${idaYVuelta ? 'active' : ''}`}
              onClick={() => setIdaYVuelta(true)}
            >
              Ida y vuelta
            </button>
          </div>

          <p className="field-label">Fecha de ida</p>
          <div className="chip-row scroll-x">
            {dias.map((d) => (
              <button
                key={d.toISOString()}
                type="button"
                className={`chip-btn ${fechaIda?.toDateString() === d.toDateString() ? 'active' : ''}`}
                onClick={() => setFechaIda(d)}
              >
                {formatFechaVuelo(d)}
              </button>
            ))}
          </div>

          {idaYVuelta && (
            <>
              <p className="field-label">Fecha de vuelta</p>
              <div className="chip-row scroll-x">
                {dias
                  .filter((d) => !fechaIda || d > fechaIda)
                  .map((d) => (
                    <button
                      key={d.toISOString()}
                      type="button"
                      className={`chip-btn ${fechaVuelta?.toDateString() === d.toDateString() ? 'active' : ''}`}
                      onClick={() => setFechaVuelta(d)}
                    >
                      {formatFechaVuelo(d)}
                    </button>
                  ))}
              </div>
            </>
          )}

          <button
            type="button"
            className="btn-primary"
            disabled={!fechaIda || (idaYVuelta && !fechaVuelta)}
            onClick={() => irPaso(2, `Estos son los vuelos disponibles a ${destino?.ciudad}.`)}
          >
            Buscar vuelos
          </button>
        </>
      )}

      {paso === 2 && (
        <>
          <div className="route-banner route-banner-light">
            <span className="route-codes">SCL → {destino?.codigo}</span>
            <span className="route-sub">{destino?.ciudad}</span>
          </div>
          <div className="list">
            {vuelos.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`row-btn flight-option ${vueloSel?.id === v.id ? 'selected' : ''}`}
                onClick={() => setVueloSel(v)}
              >
                <div className="row-main">
                  <span className="row-title">
                    {v.ida.hora} · {v.ida.vuelo}
                  </span>
                  <span className="row-sub">
                    Puerta {v.ida.puerta} · {v.ida.terminal} · {v.asientos} asientos
                  </span>
                  {v.vuelta && (
                    <span className="row-sub">
                      Vuelta {v.vuelta.hora} · {v.vuelta.vuelo}
                    </span>
                  )}
                </div>
                <span className="flight-price">{formatCLP(v.precio)}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn-primary"
            disabled={!vueloSel}
            onClick={() => irPaso(3, 'Confirma el número de pasajeros y finaliza tu reserva.')}
          >
            Continuar
          </button>
        </>
      )}

      {paso === 3 && vueloSel && (
        <>
          <div className="summary-card">
            <div className="summary-row">
              <span>Ruta</span>
              <strong>
                SCL → {vueloSel.destino.codigo} · {vueloSel.destino.ciudad}
              </strong>
            </div>
            <div className="summary-row">
              <span>Ida</span>
              <strong>
                {formatFechaVuelo(vueloSel.ida.fecha)} · {vueloSel.ida.hora}
              </strong>
            </div>
            {vueloSel.vuelta && (
              <div className="summary-row">
                <span>Vuelta</span>
                <strong>
                  {formatFechaVuelo(vueloSel.vuelta.fecha)} · {vueloSel.vuelta.hora}
                </strong>
              </div>
            )}
            <div className="summary-row">
              <span>Pasajeros</span>
              <div className="stepper-mini">
                <button type="button" onClick={() => setPasajeros((p) => Math.max(1, p - 1))}>
                  −
                </button>
                <span>{pasajeros}</span>
                <button type="button" onClick={() => setPasajeros((p) => Math.min(6, p + 1))}>
                  +
                </button>
              </div>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{formatCLP(vueloSel.precio * pasajeros)}</strong>
            </div>
          </div>
          <button type="button" className="btn-primary" onClick={confirmar}>
            Confirmar reserva
          </button>
        </>
      )}

      <button type="button" className="btn-ghost" onClick={volverDestino}>
        {labelVolver}
      </button>
    </div>
  )
}
