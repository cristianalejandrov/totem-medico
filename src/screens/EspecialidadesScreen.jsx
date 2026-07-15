import { useEffect } from 'react'
import { ESPECIALIDADES } from '../data/catalogo'
import { tts } from '../voice/tts'

const ICONS = {
  stethoscope: (
    <>
      <path
        d="M6.5 3.5v7.2a5.5 5.5 0 0 0 11 0V3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 3.5h2.2M15.3 3.5h2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="17.5" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M17.5 10.7V14.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  heart: (
    <path
      d="M12 20s-7.2-4.4-9.2-8.2C1.2 8.6 2.6 5.5 5.7 5c1.8-.3 3.4.6 4.3 2 .9-1.4 2.5-2.3 4.3-2 3.1.5 4.5 3.6 2.9 6.8C19.2 15.6 12 20 12 20Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  ),
  baby: (
    <>
      <circle cx="12" cy="9" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 19.5c1.4-3.2 4-5 7.5-5s6.1 1.8 7.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10.2" cy="8.8" r="0.7" fill="currentColor" />
      <circle cx="13.8" cy="8.8" r="0.7" fill="currentColor" />
    </>
  ),
  skin: (
    <>
      <path
        d="M8 4.5h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="10" cy="10" r="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.2" cy="13.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  bone: (
    <>
      <path
        d="M7.2 7.2 16.8 16.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="6.2" cy="6.2" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.6" cy="5.2" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.8" cy="17.8" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="15.4" cy="18.8" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  eye: (
    <>
      <path
        d="M2.8 12s3.2-5.5 9.2-5.5S21.2 12 21.2 12s-3.2 5.5-9.2 5.5S2.8 12 2.8 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
}

function EspIcon({ name }) {
  return (
    <span className="esp-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">{ICONS[name] || ICONS.stethoscope}</svg>
    </span>
  )
}

export default function EspecialidadesScreen({ onSelect, onBack }) {
  useEffect(() => {
    tts.speak('Elige tu especialidad.')
  }, [])

  return (
    <div className="screen">
      <h1 className="title">Elige tu especialidad</h1>
      <p className="subtitle">Toca la especialidad que necesitas</p>

      <div className="grid-2">
        {ESPECIALIDADES.map((esp) => (
          <button
            key={esp.id}
            type="button"
            className="card-btn card-btn-esp"
            onClick={() => onSelect(esp)}
          >
            <EspIcon name={esp.icono} />
            <span className="card-btn-title">{esp.nombre}</span>
          </button>
        ))}
      </div>

      <button type="button" className="btn-ghost" onClick={onBack}>
        ← Volver
      </button>
    </div>
  )
}
