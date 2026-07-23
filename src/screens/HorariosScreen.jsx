import { useEffect, useMemo, useState } from 'react';
import BackButton from '../components/BackButton';
import { horariosPara, formatFecha } from '../data/catalogo';
import { tts } from '../voice/tts';

export default function HorariosScreen({ doctor, onSelect, onBack }) {
  const dias = useMemo(() => horariosPara(doctor.id), [doctor.id]);
  const [diaIdx, setDiaIdx] = useState(0);

  useEffect(() => {
    tts.speak('Selecciona el día y el horario que más te acomode.');
  }, [doctor]);

  const dia = dias[diaIdx];

  return (
    <div className="screen">
      <BackButton onClick={onBack}>← Volver a doctores</BackButton>
      <h1 className="title">Elige tu horario</h1>
      <p className="subtitle">{doctor.nombre}</p>

      <div className="day-tabs">
        {dias.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`day-tab ${i === diaIdx ? 'active' : ''}`}
            onClick={() => setDiaIdx(i)}
          >
            {formatFecha(d.fecha)}
          </button>
        ))}
      </div>

      <div className="slots">
        {dia.horas.map((hora) => (
          <button
            key={hora}
            type="button"
            className="slot"
            onClick={() => onSelect({ fecha: dia.fecha, hora })}
          >
            {hora}
          </button>
        ))}
      </div>
    </div>
  );
}
