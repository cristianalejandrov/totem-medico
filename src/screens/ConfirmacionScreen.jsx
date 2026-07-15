import { useEffect } from 'react';
import { formatCLP, formatFecha } from '../data/catalogo';
import { tts } from '../voice/tts';

export default function ConfirmacionScreen({ reserva, onFinish }) {
  useEffect(() => {
    tts.speak(
      `¡Listo! Tu hora quedó reservada para el ${formatFecha(new Date(reserva.fecha))} a las ${reserva.hora}. Retira tu comprobante y que estés muy bien.`,
    );
    const t = setTimeout(onFinish, 18000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="screen center">
      <div className="success-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="title">¡Hora reservada!</h1>
      <p className="subtitle">Código de reserva</p>
      <div className="codigo">{reserva.codigo}</div>

      <div className="resumen">
        <div className="resumen-row">
          <span>Especialidad</span>
          <strong>{reserva.especialidad}</strong>
        </div>
        <div className="resumen-row">
          <span>Doctor</span>
          <strong>{reserva.doctor}</strong>
        </div>
        <div className="resumen-row">
          <span>Fecha</span>
          <strong>
            {formatFecha(new Date(reserva.fecha))} · {reserva.hora}
          </strong>
        </div>
        <div className="resumen-row">
          <span>Pagado ({reserva.prevision})</span>
          <strong>{formatCLP(reserva.total)}</strong>
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={onFinish}>
        Finalizar
      </button>
    </div>
  );
}
