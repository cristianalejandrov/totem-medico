import { useEffect } from 'react'
import { formatRut } from '../../utils/rut'
import { tts } from '../../voice/tts'

export default function AeropuertoMenuScreen({ rut, onReservar, onMisVuelos, onSalir }) {
  useEffect(() => {
    tts.speak(
      'Bienvenido al aeropuerto. Puedes ver tus vuelos reservados o reservar un nuevo vuelo.',
    )
  }, [])

  return (
    <div className="screen">
      <h1 className="title">¿Qué deseas hacer?</h1>
      <p className="subtitle">
        Pasajero <strong>{formatRut(rut)}</strong>
      </p>

      <div className="menu-options">
        <button type="button" className="card-btn card-btn-big" onClick={onReservar}>
          <svg className="card-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M2 16h20M6 16l2-8h8l2 8M4 16v2h16v-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 2v4M8 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="card-btn-title">Reservar vuelo</span>
          <span className="card-btn-sub">Destino, fechas e ida o ida y vuelta</span>
        </button>

        <button type="button" className="card-btn card-btn-big" onClick={onMisVuelos}>
          <svg className="card-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 7h18v12H3zM7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path d="M12 11v4M10 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="card-btn-title">Ver mis vuelos</span>
          <span className="card-btn-sub">Consulta PNR, horarios y puertas</span>
        </button>
      </div>

      <button type="button" className="btn-ghost" onClick={onSalir}>
        No soy yo, volver al inicio
      </button>
    </div>
  )
}
