import { useEffect, useState } from 'react';
import { PREVISIONES, formatCLP, formatFecha } from '../data/catalogo';
import { tts } from '../voice/tts';

export default function PagoScreen({ seleccion, onPagado, onBack }) {
  const { especialidad, doctor, slot } = seleccion;
  const [prevision, setPrevision] = useState(null);
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    tts.speak('Selecciona tu previsión de salud para calcular el valor de tu consulta.');
  }, []);

  const total = prevision
    ? Math.round(especialidad.precio * (1 - prevision.cobertura))
    : especialidad.precio;

  const pagar = () => {
    setPagando(true);
    tts.speak('Procesando tu pago, espera un momento por favor.');
    // Simulación de pasarela de pago (Webpay / Transbank / bono electrónico)
    setTimeout(() => onPagado({ prevision, total }), 2600);
  };

  if (pagando) {
    return (
      <div className="screen center">
        <span className="spinner big" aria-hidden="true" />
        <h1 className="title">Conectando con la pasarela de pago…</h1>
        <p className="subtitle">No retires tu tarjeta ni cierres esta pantalla</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1 className="title">Pago de tu consulta</h1>

      <div className="resumen">
        <div className="resumen-row">
          <span>Especialidad</span>
          <strong>{especialidad.nombre}</strong>
        </div>
        <div className="resumen-row">
          <span>Doctor</span>
          <strong>{doctor.nombre}</strong>
        </div>
        <div className="resumen-row">
          <span>Fecha</span>
          <strong>
            {formatFecha(slot.fecha)} · {slot.hora}
          </strong>
        </div>
      </div>

      <p className="subtitle left">Tu previsión</p>
      <div className="prevision-list">
        {PREVISIONES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`row-btn ${prevision?.id === p.id ? 'selected' : ''}`}
            onClick={() => setPrevision(p)}
          >
            <span className="row-main">
              <span className="row-title">{p.nombre}</span>
              <span className="row-sub">{p.detalle}</span>
            </span>
            <span className="radio" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="total-bar">
        <span>Total a pagar</span>
        <strong>{prevision ? formatCLP(total) : '—'}</strong>
      </div>

      <button type="button" className="btn-primary" disabled={!prevision} onClick={pagar}>
        Pagar {prevision ? formatCLP(total) : ''}
      </button>
      <button type="button" className="btn-ghost" onClick={onBack}>
        ← Volver a horarios
      </button>
    </div>
  );
}
