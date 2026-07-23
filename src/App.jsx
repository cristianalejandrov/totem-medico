import { useCallback, useEffect, useRef, useState } from 'react'
import AvatarStage from './components/AvatarStage'
import Stepper from './components/Stepper'
import ThemeSwitcher from './components/ThemeSwitcher'
import ThemeSplash from './components/ThemeSplash'
import RutScreen from './screens/RutScreen'
import MenuScreen from './screens/MenuScreen'
import EspecialidadesScreen from './screens/EspecialidadesScreen'
import DoctoresScreen from './screens/DoctoresScreen'
import HorariosScreen from './screens/HorariosScreen'
import PagoScreen from './screens/PagoScreen'
import ConfirmacionScreen from './screens/ConfirmacionScreen'
import ReservasScreen from './screens/ReservasScreen'
import AeropuertoMenuScreen from './screens/aeropuerto/AeropuertoMenuScreen'
import MisVuelosScreen from './screens/aeropuerto/MisVuelosScreen'
import ReservarVueloScreen from './screens/aeropuerto/ReservarVueloScreen'
import VueloConfirmacionScreen from './screens/aeropuerto/VueloConfirmacionScreen'
import QuirohomeFlow from './screens/quirohome/QuirohomeFlow'
import { addReserva } from './data/reservas'
import { getTema } from './data/temas'
import { tts } from './voice/tts'
import latamLogo from './assets/latam.png'
import quirohomeLogo from './assets/quirohome.webp'

const PASO_CLINICA = {
  rut: 0,
  menu: 1,
  especialidades: 1,
  doctores: 1,
  horarios: 1,
  pago: 2,
  confirmacion: 2,
  reservas: 1,
}

const PASO_AEROPUERTO = {
  rut: 0,
  menu: 1,
  reservar: 1,
  misVuelos: 1,
  confirmacion: 2,
}

const INACTIVIDAD_MS = 120000
const SPLASH_MIN_MS = 550
const SPLASH_FADE_MS = 420

function pantallaInicial(tema) {
  return tema === 'quirohome' ? 'quirohome' : 'rut'
}

export default function App() {
  const [temaId, setTemaId] = useState('clinica')
  const tema = getTema(temaId)
  const [screen, setScreen] = useState('rut')
  const [rut, setRut] = useState('')
  const [seleccion, setSeleccion] = useState({})
  const [reservaFinal, setReservaFinal] = useState(null)
  const [vueloFinal, setVueloFinal] = useState(null)
  const [caption, setCaption] = useState(null)
  const [avatarMapMode, setAvatarMapMode] = useState(false)
  const [quirohomePaso, setQuirohomePaso] = useState(0)
  const [quirohomeKey, setQuirohomeKey] = useState(0)
  const [showSplash, setShowSplash] = useState(true)
  const [splashPhase, setSplashPhase] = useState('in')
  const [sessionReady, setSessionReady] = useState(false)
  const [avatarReady, setAvatarReady] = useState(false)
  const splashTimer = useRef(null)

  useEffect(() => {
    tts.onCaption = setCaption
    return () => {
      tts.onCaption = null
      tts.cancel()
    }
  }, [])

  useEffect(() => {
    clearTimeout(splashTimer.current)
    setShowSplash(true)
    setSplashPhase('in')
    setSessionReady(false)
    setAvatarReady(false)
  }, [temaId])

  const handleAvatarReady = useCallback(() => {
    setAvatarReady(true)
  }, [])

  useEffect(() => {
    if (!showSplash || !avatarReady) return
    splashTimer.current = setTimeout(() => {
      setSplashPhase('out')
      splashTimer.current = setTimeout(() => {
        setShowSplash(false)
        setSessionReady(true)
      }, SPLASH_FADE_MS)
    }, SPLASH_MIN_MS)
    return () => clearTimeout(splashTimer.current)
  }, [showSplash, avatarReady])

  const reset = useCallback(() => {
    tts.cancel()
    setRut('')
    setSeleccion({})
    setReservaFinal(null)
    setVueloFinal(null)
    setAvatarMapMode(false)
    setQuirohomePaso(0)
    setQuirohomeKey((k) => k + 1)
    setScreen(pantallaInicial(temaId))
  }, [temaId])

  const handleMapModeChange = useCallback((activo) => {
    setAvatarMapMode(activo)
  }, [])

  const cambiarTema = (nuevo) => {
    if (nuevo === temaId) return
    tts.cancel()
    setTemaId(nuevo)
    setRut('')
    setSeleccion({})
    setReservaFinal(null)
    setVueloFinal(null)
    setAvatarMapMode(false)
    setQuirohomePaso(0)
    setQuirohomeKey((k) => k + 1)
    setScreen(pantallaInicial(nuevo))
  }

  const idleTimer = useRef(null)
  useEffect(() => {
    const arm = () => {
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        if (screen === 'confirmacion') return
        if (temaId === 'quirohome' && screen === 'quirohome') {
          setQuirohomeKey((k) => k + 1)
          setQuirohomePaso(0)
          return
        }
        if (screen !== 'rut') reset()
      }, INACTIVIDAD_MS)
    }
    arm()
    window.addEventListener('pointerdown', arm)
    return () => {
      clearTimeout(idleTimer.current)
      window.removeEventListener('pointerdown', arm)
    }
  }, [screen, reset, temaId])

  const confirmarPago = ({ prevision, total }) => {
    const { especialidad, doctor, slot } = seleccion
    const reserva = addReserva(rut, {
      especialidad: especialidad.nombre,
      doctor: doctor.nombre,
      fecha: slot.fecha.toISOString(),
      hora: slot.hora,
      prevision: prevision.nombre,
      total,
    })
    setReservaFinal(reserva)
    setScreen('confirmacion')
  }

  const paso =
    temaId === 'clinica'
      ? PASO_CLINICA[screen] ?? 0
      : temaId === 'aeropuerto'
        ? PASO_AEROPUERTO[screen] ?? 0
        : quirohomePaso

  return (
    <div className={`totem ${avatarMapMode ? 'avatar-mapa-mode' : ''}`} data-tema={temaId}>
      {showSplash && <ThemeSplash temaId={temaId} phase={splashPhase} />}

      <header className="totem-header">
        <div className="brand">
          {temaId === 'quirohome' ? (
            <img src={quirohomeLogo} alt="Quirohome" className="brand-logo-quirohome" />
          ) : temaId === 'aeropuerto' ? (
            <img src={latamLogo} alt="LATAM" className="brand-logo-latam" />
          ) : (
            <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21s-7.5-4.6-9.5-9A5.4 5.4 0 0 1 12 6.3 5.4 5.4 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 12h2.4l1.2-2.4 1.8 4.4 1.2-2h2.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {temaId !== 'aeropuerto' && temaId !== 'quirohome' && (
            <span className="brand-name">{tema.brand}</span>
          )}
        </div>
        <Stepper paso={paso} pasos={tema.pasos} />
      </header>

      <AvatarStage
        caption={caption}
        modelUrl={tema.avatarModel}
        key={temaId}
        compact={avatarMapMode}
        onReady={handleAvatarReady}
      />

      <main className="totem-panel">
        {screen === 'rut' && (
          <RutScreen
            tema={temaId}
            sessionReady={sessionReady}
            onValid={(r) => {
              setRut(r)
              setScreen('menu')
            }}
          />
        )}

        {temaId === 'clinica' && screen === 'menu' && (
          <MenuScreen
            rut={rut}
            onPedirHora={() => setScreen('especialidades')}
            onConsultar={() => setScreen('reservas')}
            onSalir={reset}
          />
        )}

        {temaId === 'clinica' && screen === 'especialidades' && (
          <EspecialidadesScreen
            onSelect={(especialidad) => {
              setSeleccion({ especialidad })
              setScreen('doctores')
            }}
            onBack={() => setScreen('menu')}
          />
        )}

        {temaId === 'clinica' && screen === 'doctores' && (
          <DoctoresScreen
            especialidad={seleccion.especialidad}
            onSelect={(doctor) => {
              setSeleccion((s) => ({ ...s, doctor }))
              setScreen('horarios')
            }}
            onBack={() => setScreen('especialidades')}
          />
        )}

        {temaId === 'clinica' && screen === 'horarios' && (
          <HorariosScreen
            doctor={seleccion.doctor}
            onSelect={(slot) => {
              setSeleccion((s) => ({ ...s, slot }))
              setScreen('pago')
            }}
            onBack={() => setScreen('doctores')}
          />
        )}

        {temaId === 'clinica' && screen === 'pago' && (
          <PagoScreen
            seleccion={seleccion}
            onPagado={confirmarPago}
            onBack={() => setScreen('horarios')}
          />
        )}

        {temaId === 'clinica' && screen === 'confirmacion' && reservaFinal && (
          <ConfirmacionScreen reserva={reservaFinal} onFinish={reset} />
        )}

        {temaId === 'clinica' && screen === 'reservas' && (
          <ReservasScreen
            rut={rut}
            onBack={() => setScreen('menu')}
            onPedirHora={() => setScreen('especialidades')}
          />
        )}

        {temaId === 'aeropuerto' && screen === 'menu' && (
          <AeropuertoMenuScreen
            rut={rut}
            onReservar={() => setScreen('reservar')}
            onMisVuelos={() => setScreen('misVuelos')}
            onSalir={reset}
          />
        )}

        {temaId === 'aeropuerto' && screen === 'misVuelos' && (
          <MisVuelosScreen
            rut={rut}
            onBack={() => setScreen('menu')}
            onReservar={() => setScreen('reservar')}
          />
        )}

        {temaId === 'aeropuerto' && screen === 'reservar' && (
          <ReservarVueloScreen
            rut={rut}
            onMapModeChange={handleMapModeChange}
            onReservado={(v) => {
              setVueloFinal(v)
              setAvatarMapMode(false)
              setScreen('confirmacion')
            }}
            onBack={() => {
              setAvatarMapMode(false)
              setScreen('menu')
            }}
          />
        )}

        {temaId === 'aeropuerto' && screen === 'confirmacion' && vueloFinal && (
          <VueloConfirmacionScreen reserva={vueloFinal} onFinish={reset} />
        )}

        {temaId === 'quirohome' && screen === 'quirohome' && (
          <QuirohomeFlow
            key={quirohomeKey}
            sessionReady={sessionReady}
            onStepChange={setQuirohomePaso}
            onFinish={() => {
              setQuirohomeKey((k) => k + 1)
              setQuirohomePaso(0)
            }}
          />
        )}
      </main>

      <ThemeSwitcher tema={temaId} onChange={cambiarTema} />
    </div>
  )
}
