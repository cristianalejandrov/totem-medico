import { useEffect } from 'react';
import { formatRut } from '../utils/rut';
import { tts } from '../voice/tts';

export default function MenuScreen({ rut, onPedirHora, onConsultar, onSalir }) {
  useEffect(() => {
    tts.speak('Gracias. ¿Qué deseas hacer hoy? Puedes pedir una hora médica o consultar tus reservas.');
  }, []);

  return (
    <div className="screen">
      <h1 className="title">¿Qué deseas hacer?</h1>
      <p className="subtitle">
        Paciente <strong>{formatRut(rut)}</strong>
      </p>

      <div className="menu-options">
        <button type="button" className="card-btn card-btn-big" onClick={onPedirHora}>
          <svg className="card-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 2v3M16 2v3M3.5 9h17M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 11.5v5M9.5 14h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="card-btn-title">Pedir hora médica</span>
          <span className="card-btn-sub">Agenda con nuestros especialistas</span>
        </button>

        <button type="button" className="card-btn card-btn-big" onClick={onConsultar}>
          <svg className="card-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16.5 16.5 4 4M8.5 11h5M11 8.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="card-btn-title">Consultar mis horas</span>
          <span className="card-btn-sub">Revisa tus reservas vigentes</span>
        </button>
      </div>

      <button type="button" className="btn-ghost" onClick={onSalir}>
        No soy yo, volver al inicio
      </button>
    </div>
  );
}
