import { useEffect, useMemo, useState } from 'react'
import {
  DESTINOS,
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
  const [destinoId, setDestinoId] = useState(null)
  const [idaYVuelta, setIdaYVuelta] = useState(false)
  const [fechaIda, setFechaIda] = useState(null)
  const [fechaVuelta, setFechaVuelta] = useState(null)
  const [vueloSel, setVueloSel] = useState(null)
  const [pasajeros, setPasajeros] = useState(1)

  useEffect(() => {
    tts.speak('Elige tu destino para comenzar la reserva.')
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

  const destino = DESTINOS.find((d) => d.id === destinoId)

  const irPaso = (n, msg) => {
    setPaso(n)
    if (msg) tts.speak(msg)
  }

  const confirmar = () => {
    if (!vueloSel) return
    const reserva = reservarVuelo(rut, vueloSel, pasajeros)
    tts.speak(`Listo. Tu reserva quedó confirmada. Código P N R ${reserva.pnr.split('').join(' ')}.`)
    onReservado(reserva)
  }

  return (
    <div className="screen screen-scroll">
      <h1 className="title">Reservar vuelo</h1>
      <p className="subtitle">
        {paso === 0 && 'Selecciona país y ciudad de destino'}
        {paso === 1 && 'Tipo de viaje y fechas'}
        {paso === 2 && 'Elige tu horario'}
        {paso === 3 && 'Confirma tu reserva'}
      </p>

      {paso === 0 && (
        <>
          <div className="grid-2 destinos-grid">
            {DESTINOS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`card-btn card-btn-esp ${destinoId === d.id ? 'selected' : ''}`}
                onClick={() => setDestinoId(d.id)}
              >
                <span className="dest-flag">{d.bandera}</span>
                <span className="card-btn-title">{d.ciudad}</span>
                <span className="card-btn-sub">{d.pais} · {d.codigo}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn-primary"
            disabled={!destinoId}
            onClick={() => irPaso(1, 'Indica si es solo ida o ida y vuelta, y elige las fechas.')}
          >
            Continuar
          </button>
        </>
      )}

      {paso === 1 && (
        <>
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
          <div className="route-banner">
            <span>SCL → {destino?.codigo}</span>
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
                  <span className="row-title">{v.ida.hora} · {v.ida.vuelo}</span>
                  <span className="row-sub">
                    Puerta {v.ida.puerta} · {v.ida.terminal} · {v.asientos} asientos
                  </span>
                  {v.vuelta && (
                    <span className="row-sub">Vuelta {v.vuelta.hora} · {v.vuelta.vuelo}</span>
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
              <strong>SCL → {vueloSel.destino.codigo}</strong>
            </div>
            <div className="summary-row">
              <span>Ida</span>
              <strong>{formatFechaVuelo(vueloSel.ida.fecha)} · {vueloSel.ida.hora}</strong>
            </div>
            {vueloSel.vuelta && (
              <div className="summary-row">
                <span>Vuelta</span>
                <strong>{formatFechaVuelo(vueloSel.vuelta.fecha)} · {vueloSel.vuelta.hora}</strong>
              </div>
            )}
            <div className="summary-row">
              <span>Pasajeros</span>
              <div className="stepper-mini">
                <button type="button" onClick={() => setPasajeros((p) => Math.max(1, p - 1))}>−</button>
                <span>{pasajeros}</span>
                <button type="button" onClick={() => setPasajeros((p) => Math.min(6, p + 1))}>+</button>
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

      <button
        type="button"
        className="btn-ghost"
        onClick={() => {
          if (paso === 0) onBack()
          else setPaso((p) => p - 1)
        }}
      >
        ← Volver
      </button>
    </div>
  )
}
