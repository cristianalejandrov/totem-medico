/** Selector compacto Clínica ↔ Aeropuerto (abajo del tótem). */
export default function ThemeSwitcher({ tema, onChange }) {
  return (
    <div className="theme-switcher" role="group" aria-label="Modo del tótem">
      <button
        type="button"
        className={`theme-pill ${tema === 'clinica' ? 'active' : ''}`}
        onClick={() => onChange('clinica')}
      >
        <span className="theme-pill-icon" aria-hidden="true">✚</span>
        Clínica
      </button>
      <button
        type="button"
        className={`theme-pill ${tema === 'aeropuerto' ? 'active' : ''}`}
        onClick={() => onChange('aeropuerto')}
      >
        <span className="theme-pill-icon" aria-hidden="true">✈</span>
        Aeropuerto
      </button>
    </div>
  )
}
