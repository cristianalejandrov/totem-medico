import { useEffect } from 'react';
import BackButton from '../components/BackButton';
import { DOCTORES } from '../data/catalogo';
import { tts } from '../voice/tts';

export default function DoctoresScreen({ especialidad, onSelect, onBack }) {
  const doctores = DOCTORES[especialidad.id] || [];

  useEffect(() => {
    tts.speak(
      `Estos son los doctores disponibles en ${especialidad.nombre}. Toca el que prefieras.`,
    );
  }, [especialidad]);

  return (
    <div className="screen">
      <BackButton onClick={onBack}>← Volver a especialidades</BackButton>
      <h1 className="title">Doctores disponibles</h1>
      <p className="subtitle">{especialidad.nombre}</p>

      <div className="list">
        {doctores.map((doc) => (
          <button key={doc.id} type="button" className="row-btn" onClick={() => onSelect(doc)}>
            <span className="doctor-avatar" aria-hidden="true">
              {doc.nombre
                .replace(/^Dr[a]?\.\s*/, '')
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')}
            </span>
            <span className="row-main">
              <span className="row-title">{doc.nombre}</span>
              <span className="row-sub">{doc.detalle}</span>
            </span>
            <span className="row-chevron" aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
