/** Teclado numérico táctil para ingreso de RUT (incluye K y borrar). */
export default function Keypad({ onKey, onDelete, onClear }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'K', '0'];
  return (
    <div className="keypad">
      {keys.map((k) => (
        <button key={k} type="button" className="key" onClick={() => onKey(k)}>
          {k}
        </button>
      ))}
      <button
        type="button"
        className="key key-delete"
        onClick={onDelete}
        onDoubleClick={onClear}
        aria-label="Borrar"
      >
        ⌫
      </button>
    </div>
  );
}
