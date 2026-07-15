const PASOS = ['Identificación', 'Selección', 'Pago'];

/** Indicador de progreso del flujo (1 Identificación · 2 Selección · 3 Pago). */
export default function Stepper({ paso }) {
  return (
    <div className="stepper" aria-label={`Paso ${paso + 1} de ${PASOS.length}`}>
      {PASOS.map((nombre, i) => (
        <div key={nombre} className={`step ${i < paso ? 'done' : ''} ${i === paso ? 'active' : ''}`}>
          <span className="step-dot">{i < paso ? '✓' : i + 1}</span>
          <span className="step-label">{nombre}</span>
        </div>
      ))}
    </div>
  );
}
