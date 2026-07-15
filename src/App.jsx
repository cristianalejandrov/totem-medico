import { useCallback, useEffect, useRef, useState } from 'react';
import AvatarStage from './components/AvatarStage';
import Stepper from './components/Stepper';
import RutScreen from './screens/RutScreen';
import MenuScreen from './screens/MenuScreen';
import EspecialidadesScreen from './screens/EspecialidadesScreen';
import DoctoresScreen from './screens/DoctoresScreen';
import HorariosScreen from './screens/HorariosScreen';
import PagoScreen from './screens/PagoScreen';
import ConfirmacionScreen from './screens/ConfirmacionScreen';
import ReservasScreen from './screens/ReservasScreen';
import { addReserva } from './data/reservas';
import { tts } from './voice/tts';

const PASO_POR_PANTALLA = {
  rut: 0,
  menu: 1,
  especialidades: 1,
  doctores: 1,
  horarios: 1,
  pago: 2,
  confirmacion: 2,
  reservas: 1,
};

const INACTIVIDAD_MS = 120000;

export default function App() {
  const [screen, setScreen] = useState('rut');
  const [rut, setRut] = useState('');
  const [seleccion, setSeleccion] = useState({});
  const [reservaFinal, setReservaFinal] = useState(null);
  const [caption, setCaption] = useState(null);

  useEffect(() => {
    tts.onCaption = setCaption;
    return () => {
      tts.onCaption = null;
      tts.cancel();
    };
  }, []);

  const reset = useCallback(() => {
    tts.cancel();
    setRut('');
    setSeleccion({});
    setReservaFinal(null);
    setScreen('rut');
  }, []);

  // Vuelve al inicio tras 2 minutos sin toques (comportamiento típico de tótem)
  const idleTimer = useRef(null);
  useEffect(() => {
    const arm = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (screen !== 'rut' && screen !== 'confirmacion') reset();
      }, INACTIVIDAD_MS);
    };
    arm();
    window.addEventListener('pointerdown', arm);
    return () => {
      clearTimeout(idleTimer.current);
      window.removeEventListener('pointerdown', arm);
    };
  }, [screen, reset]);

  const confirmarPago = ({ prevision, total }) => {
    const { especialidad, doctor, slot } = seleccion;
    const reserva = addReserva(rut, {
      especialidad: especialidad.nombre,
      doctor: doctor.nombre,
      fecha: slot.fecha.toISOString(),
      hora: slot.hora,
      prevision: prevision.nombre,
      total,
    });
    setReservaFinal(reserva);
    setScreen('confirmacion');
  };

  return (
    <div className="totem">
      <header className="totem-header">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-9.5-9A5.4 5.4 0 0 1 12 6.3 5.4 5.4 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M7.5 12h2.4l1.2-2.4 1.8 4.4 1.2-2h2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="brand-name">Clínica Inclusive</span>
        </div>
        <Stepper paso={PASO_POR_PANTALLA[screen]} />
      </header>

      <AvatarStage caption={caption} />

      <main className="totem-panel">
        {screen === 'rut' && (
          <RutScreen
            onValid={(r) => {
              setRut(r);
              setScreen('menu');
            }}
          />
        )}

        {screen === 'menu' && (
          <MenuScreen
            rut={rut}
            onPedirHora={() => setScreen('especialidades')}
            onConsultar={() => setScreen('reservas')}
            onSalir={reset}
          />
        )}

        {screen === 'especialidades' && (
          <EspecialidadesScreen
            onSelect={(especialidad) => {
              setSeleccion({ especialidad });
              setScreen('doctores');
            }}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'doctores' && (
          <DoctoresScreen
            especialidad={seleccion.especialidad}
            onSelect={(doctor) => {
              setSeleccion((s) => ({ ...s, doctor }));
              setScreen('horarios');
            }}
            onBack={() => setScreen('especialidades')}
          />
        )}

        {screen === 'horarios' && (
          <HorariosScreen
            doctor={seleccion.doctor}
            onSelect={(slot) => {
              setSeleccion((s) => ({ ...s, slot }));
              setScreen('pago');
            }}
            onBack={() => setScreen('doctores')}
          />
        )}

        {screen === 'pago' && (
          <PagoScreen
            seleccion={seleccion}
            onPagado={confirmarPago}
            onBack={() => setScreen('horarios')}
          />
        )}

        {screen === 'confirmacion' && reservaFinal && (
          <ConfirmacionScreen reserva={reservaFinal} onFinish={reset} />
        )}

        {screen === 'reservas' && (
          <ReservasScreen
            rut={rut}
            onBack={() => setScreen('menu')}
            onPedirHora={() => setScreen('especialidades')}
          />
        )}
      </main>
    </div>
  );
}
