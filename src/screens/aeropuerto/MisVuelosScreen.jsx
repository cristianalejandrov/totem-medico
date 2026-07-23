import { useEffect, useMemo } from 'react'
import { formatRut } from '../../utils/rut'
import { formatCLP, formatFechaLarga, getVuelosReservados } from '../../data/vuelos'
import { tts } from '../../voice/tts'

export default function MisVuelosScreen({ rut, onBack, onReservar }) {
  const vuelos = useMemo(() => getVuelosReservados(rut), [rut])

  useEffect(() => {
    if (vuelos.length > 0) {
      tts.speak(
        `Tienes ${vuelos.length === 1 ? 'un vuelo' : `${vuelos.length} vuelos`} reservado${vuelos.length === 1 ? '' : 's'}. Aquí están los detalles.`,
      )
    } else {
      tts.speak('No encontré vuelos asociados a tu identificación. ¿Quieres reservar uno?')
    }
  }, [])

  return (
    <div className="screen">
      <h1 className="title">Mis vuelos</h1>
      <p className="subtitle">
        Pasajero <strong>{formatRut(rut)}</strong>
      </p>

      <div className="list">
        {vuelos.length === 0 ? (
          <div className="empty-card">
            <span className="empty-icon" aria-hidden="true">✈</span>
            <p>No tienes vuelos reservados</p>
            <button type="button" className="btn-primary" onClick={onReservar}>
              Reservar vuelo
            </button>
          </div>
        ) : (
          vuelos.map((v) => (
            <div key={v.pnr} className="flight-card">
              <div className="flight-card-head">
                <span className="flight-pnr">{v.pnr}</span>
                <span className="chip chip-flight">{v.idaYVuelta ? 'Ida y vuelta' : 'Solo ida'}</span>
              </div>
              <div className="flight-route">
                <span className="flight-flag">{v.destino.bandera}</span>
                <div>
                  <strong>SCL → {v.destino.codigo}</strong>
                  <span className="row-sub">
                    {v.destino.region
                      ? `${v.destino.region} · ${v.destino.codigo}`
                      : `${v.destino.pais} · ${v.destino.codigo}`}
                  </span>
                </div>
              </div>
              <div className="flight-meta">
                <div>
                  <span className="meta-label">Ida</span>
                  <span>{formatFechaLarga(new Date(v.ida.fecha))}</span>
                  <span className="meta-strong">{v.ida.hora} · {v.ida.vuelo}</span>
                  <span className="row-sub">Puerta {v.ida.puerta} · {v.ida.terminal}</span>
                </div>
                {v.vuelta && (
                  <div>
                    <span className="meta-label">Vuelta</span>
                    <span>{formatFechaLarga(new Date(v.vuelta.fecha))}</span>
                    <span className="meta-strong">{v.vuelta.hora} · {v.vuelta.vuelo}</span>
                  </div>
                )}
              </div>
              <div className="flight-footer">
                {v.pasajeros} pasajero{v.pasajeros !== 1 ? 's' : ''} · {formatCLP(v.total)}
              </div>
            </div>
          ))
        )}
      </div>

      <button type="button" className="btn-ghost" onClick={onBack}>
        ← Volver
      </button>
    </div>
  )
}
