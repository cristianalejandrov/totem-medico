import { useEffect, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { getReservas } from '../data/reservas';
import { formatCLP, formatFecha } from '../data/catalogo';
import { formatRut } from '../utils/rut';
import { tts } from '../voice/tts';

export default function ReservasScreen({ rut, onBack, onPedirHora }) {
  const reservas = useMemo(() => getReservas(rut), [rut]);

  useEffect(() => {
    if (reservas.length > 0) {
      tts.speak(
        `Encontré ${reservas.length === 1 ? 'una reserva' : `${reservas.length} reservas`} asociada${reservas.length === 1 ? '' : 's'} a tu RUT. Aquí están los detalles.`,
      );
    } else {
      tts.speak('No encontré reservas asociadas a tu RUT. ¿Quieres pedir una hora médica?');
    }
  }, []);

  return (
    <div className="screen">
      <BackButton onClick={onBack}>← Volver al menú</BackButton>
      <h1 className="title">Tus reservas</h1>
      <p className="subtitle">
        Paciente <strong>{formatRut(rut)}</strong>
      </p>

      {reservas.length === 0 ? (
        <div className="empty-state">
          <p>No tienes reservas vigentes.</p>
          <button type="button" className="btn-primary" onClick={onPedirHora}>
            Pedir hora médica
          </button>
        </div>
      ) : (
        <div className="list">
          {reservas.map((r) => (
            <div key={r.codigo} className="reserva-card">
              <div className="reserva-head">
                <strong>{r.especialidad}</strong>
                <span className="chip">{r.codigo}</span>
              </div>
              <div className="reserva-body">
                <span>{r.doctor}</span>
                <span>
                  {formatFecha(new Date(r.fecha))} · {r.hora}
                </span>
                <span className="row-sub">
                  {r.prevision} · pagado {formatCLP(r.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
