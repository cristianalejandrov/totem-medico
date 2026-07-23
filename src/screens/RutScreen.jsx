import { useEffect, useRef, useState } from 'react';
import Keypad from '../components/Keypad';
import { cleanRut, formatRut, validateRut } from '../utils/rut';
import { tts } from '../voice/tts';

const COPY = {
  clinica: {
    title: 'Ingresa tu RUT',
    subtitle: 'Usa el teclado en pantalla. Puntos y guion se agregan solos.',
    bienvenida:
      'Hola, bienvenido a Clínica Inclusive. Por favor, ingresa tu número de cédula con el teclado en pantalla. No te preocupes por los puntos ni el guion, se agregan automáticamente.',
    error: 'El número de cédula es incorrecto.',
    ayuda:
      'Revisa que el número y el dígito verificador estén bien escritos. El guion se agrega solo; escribe solo los números y la letra ka si corresponde.',
    errorUi: 'RUT incorrecto. Verifica el dígito verificador.',
  },
  aeropuerto: {
    title: 'Identificación',
    subtitle: 'Ingresa tu RUT o documento de viaje',
    bienvenida:
      'Bienvenido a LATAM Airlines. Ingresa tu número de cédula o documento para consultar o reservar vuelos.',
    error: 'Identificación incorrecta.',
    ayuda:
      'Verifica tu número de documento. Si eres extranjero, ingresa tu RUT chileno o número de reserva asociado.',
    errorUi: 'Documento incorrecto. Verifica e intenta nuevamente.',
  },
};

export default function RutScreen({ tema = 'clinica', onValid }) {
  const c = COPY[tema] || COPY.clinica;
  const [rut, setRut] = useState('');
  const [error, setError] = useState(false);
  const helpTimer = useRef(null);

  useEffect(() => {
    tts.speak(c.bienvenida);
    return () => {
      clearTimeout(helpTimer.current);
      tts.cancel();
    };
  }, [tema, c.bienvenida]);

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
      tts.speak(c.error);
      helpTimer.current = setTimeout(() => tts.speak(c.ayuda), 3000);
    }
  };

  return (
    <div className="screen">
      <h1 className="title">{c.title}</h1>
      <p className="subtitle">{c.subtitle}</p>

      <div className={`rut-display ${error ? 'rut-error shake' : ''} ${rut ? '' : 'rut-empty'}`}>
        {rut ? formatRut(rut) : '12.345.678-9'}
      </div>
      {error && <div className="error-text">{c.errorUi}</div>}

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
