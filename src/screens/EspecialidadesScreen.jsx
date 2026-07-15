import { useEffect } from 'react';
import { ESPECIALIDADES, formatCLP } from '../data/catalogo';
import { tts } from '../voice/tts';

export default function EspecialidadesScreen({ onSelect, onBack }) {
  useEffect(() => {
    tts.speak('Elige tu especialidad.');
  }, []);

  return (
    <div className="screen">
      <h1 className="title">Elige tu especialidad</h1>
      <p className="subtitle">Toca la especialidad que necesitas</p>

      <div className="grid-2">
        {ESPECIALIDADES.map((esp) => (
          <button key={esp.id} type="button" className="card-btn" onClick={() => onSelect(esp)}>
            <span className="chip">{formatCLP(esp.precio)}</span>
            <span className="card-btn-title">{esp.nombre}</span>
          </button>
        ))}
      </div>

      <button type="button" className="btn-ghost" onClick={onBack}>
        ← Volver
      </button>
    </div>
  );
}
