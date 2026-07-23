import { useEffect } from 'react'
import latamLogo from '../../assets/latam.png'
import { formatCLP, formatFechaLarga } from '../../data/vuelos'
import { tts } from '../../voice/tts'

export default function VueloConfirmacionScreen({ reserva, onFinish }) {
  useEffect(() => {
    tts.speak(
      `Tu vuelo quedó reservado. Presenta el código ${reserva.pnr} en mostrador o app. Buen viaje.`,
    )
  }, [reserva.pnr])

  return (
    <div className="screen center">
      <div className="boarding-pass">
        <div className="boarding-head">
          <img src={latamLogo} alt="LATAM" className="boarding-logo" />
          <span className="boarding-pnr">{reserva.pnr}</span>
        </div>
        <div className="boarding-route">
          <div>
            <span className="boarding-code">SCL</span>
            <span className="boarding-city">Santiago</span>
          </div>
          <span className="boarding-plane" aria-hidden="true">
            ✈
          </span>
          <div>
            <span className="boarding-code">{reserva.destino.codigo}</span>
            <span className="boarding-city">{reserva.destino.ciudad}</span>
          </div>
        </div>
        <div className="boarding-details">
          <div>
            <span className="meta-label">Ida</span>
            <strong>{formatFechaLarga(new Date(reserva.ida.fecha))}</strong>
            <span>
              {reserva.ida.hora} · {reserva.ida.vuelo}
            </span>
            <span className="row-sub">
              Puerta {reserva.ida.puerta} · {reserva.ida.terminal}
            </span>
          </div>
          {reserva.vuelta && (
            <div>
              <span className="meta-label">Vuelta</span>
              <strong>{formatFechaLarga(new Date(reserva.vuelta.fecha))}</strong>
              <span>
                {reserva.vuelta.hora} · {reserva.vuelta.vuelo}
              </span>
            </div>
          )}
        </div>
        <div className="boarding-footer">
          {reserva.pasajeros} pasajero{reserva.pasajeros !== 1 ? 's' : ''} · {formatCLP(reserva.total)}
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={onFinish}>
        Finalizar
      </button>
    </div>
  )
}
