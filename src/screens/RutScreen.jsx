import { useEffect, useRef, useState } from 'react';
import Keypad from '../components/Keypad';
import { cleanRut, formatRut, validateRut } from '../utils/rut';
import { tts } from '../voice/tts';

const MSG_BIENVENIDA =
  'Hola, bienvenido a Clínica Inclusive. Por favor, ingresa tu número de cédula con el teclado en pantalla. No te preocupes por los puntos ni el guion, se agregan automáticamente.';
const MSG_ERROR = 'El número de cédula es incorrecto.';
const MSG_AYUDA =
  'Revisa que el número y el dígito verificador estén bien escritos. El guion se agrega solo; escribe solo los números y la letra ka si corresponde.';

export default function RutScreen({ onValid }) {
  const [rut, setRut] = useState('');
  const [error, setError] = useState(false);
  const helpTimer = useRef(null);

  useEffect(() => {
    tts.speak(MSG_BIENVENIDA);
    return () => clearTimeout(helpTimer.current);
  }, []);

  const pressKey = (k) => {
    setError(false);
    setRut((r) => cleanRut(r + k));
  };

  const submit = async () => {
    clearTimeout(helpTimer.current);
    if (validateRut(rut)) {
      setError(false);
      onValid(rut);
    } else {
      setError(true);
      tts.speak(MSG_ERROR);
      // Tras unos segundos, el avatar entrega indicaciones más detalladas
      helpTimer.current = setTimeout(() => tts.speak(MSG_AYUDA), 3000);
    }
  };

  return (
    <div className="screen">
      <h1 className="title">Ingresa tu RUT</h1>
      <p className="subtitle">Usa el teclado en pantalla. Puntos y guion se agregan solos.</p>

      <div className={`rut-display ${error ? 'rut-error shake' : ''} ${rut ? '' : 'rut-empty'}`}>
        {rut ? formatRut(rut) : '12.345.678-9'}
      </div>
      {error && <div className="error-text">RUT incorrecto. Verifica el dígito verificador.</div>}

      <Keypad
        onKey={pressKey}
        onDelete={() => {
          setError(false);
          setRut((r) => r.slice(0, -1));
        }}
        onClear={() => setRut('')}
      />

      <button
        type="button"
        className="btn-primary"
        disabled={rut.length < 8}
        onClick={submit}
      >
        Continuar
      </button>
    </div>
  );
}
