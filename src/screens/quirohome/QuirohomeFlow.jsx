import { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/BackButton'
import Keypad from '../../components/Keypad'
import {
  PASO_QUIROHOME,
  PROFESIONALES,
  SERVICIOS,
  SUCURSALES,
  TIPOS_SERVICIO,
  DIAS_SEMANA,
  calendarioPorMeses,
  formatCLP,
  formatFechaCorta,
  formatFechaLarga,
  guardarReserva,
  horariosParaDia,
} from '../../data/quirohome'
import { cleanRut, formatRut, validateRut } from '../../utils/rut'
import { tts } from '../../voice/tts'

const PASOS = ['sucursal', 'servicio', 'subServicio', 'profesional', 'calendario', 'horario', 'datos', 'confirmacion']

const QH_ICONS = {
  masaje: (
    <>
      <path
        d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 10c1.5-2 3.5-3 6-3s4.5 1 6 3M5 17l2-2M19 17l-2-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  columna: (
    <>
      <path
        d="M12 3v18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19.5" r="1.5" fill="currentColor" />
      <path
        d="M8.5 8.5 6 7M15.5 8.5 18 7M8.5 15.5 6 17M15.5 15.5 18 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  rostro: (
    <>
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9.5" cy="11" r="0.9" fill="currentColor" />
      <circle cx="14.5" cy="11" r="0.9" fill="currentColor" />
      <path
        d="M9.5 15.2c.8.8 1.9 1.3 2.5 1.3s1.7-.5 2.5-1.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  cuerpo: (
    <>
      <circle cx="12" cy="6.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 9v5M9 12h6M10 19l2-5 2 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  control: (
    <>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4l2.5 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  profesional: (
    <>
      <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 5.5 18 4M18.5 8h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
}

function QhIcon({ name, className = 'esp-icon qh-icon' }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24">{QH_ICONS[name] || QH_ICONS.masaje}</svg>
    </span>
  )
}

export default function QuirohomeFlow({ onFinish, onStepChange }) {
  const [paso, setPaso] = useState('sucursal')
  const [sel, setSel] = useState({})
  const [fechaSel, setFechaSel] = useState(null)
  const [form, setForm] = useState({ nombre: '', rut: '', correo: '', telefono: '' })
  const [reserva, setReserva] = useState(null)
  const [rutError, setRutError] = useState(false)

  useEffect(() => {
    tts.speak('Bienvenido a Quirohome. Selecciona la sucursal donde deseas atenderte.')
  }, [])

  useEffect(() => {
    onStepChange?.(PASO_QUIROHOME[paso] ?? 0)
  }, [paso, onStepChange])

  const mesesCal = useMemo(() => {
    if (!sel.sucursal || !sel.profesional) return []
    return calendarioPorMeses(sel.sucursal.id, sel.profesional.id)
  }, [sel.sucursal, sel.profesional])

  const horarios = useMemo(() => {
    if (!fechaSel || !sel.profesional) return []
    return horariosParaDia(fechaSel, sel.profesional.id)
  }, [fechaSel, sel.profesional])

  const ir = (p, msg) => {
    setPaso(p)
    if (msg) tts.speak(msg)
  }

  const volver = () => {
    const i = PASOS.indexOf(paso)
    if (i <= 0) {
      onFinish()
      return
    }
    const prev = PASOS[i - 1]
    if (paso === 'horario') setFechaSel(null)
    setPaso(prev)
  }

  const labelVolver =
    paso === 'sucursal' ? '← Salir' : '← Volver'

  const reservar = () => {
    if (!validateRut(form.rut)) {
      setRutError(true)
      tts.speak('El RUT ingresado no es válido.')
      return
    }
    if (!form.nombre.trim() || !form.correo.trim() || !form.telefono.trim()) {
      tts.speak('Completa todos tus datos para reservar.')
      return
    }
    const r = guardarReserva({
      ...sel,
      paciente: { ...form, rut: cleanRut(form.rut) },
      fecha: fechaSel.toISOString(),
      hora: sel.hora,
      total: sel.servicio.precio,
    })
    setReserva(r)
    setPaso('confirmacion')
    tts.speak(`Reserva confirmada. Tu código es ${r.codigo}. Te esperamos en Quirohome.`)
  }

  return (
    <div className="screen screen-scroll screen-quirohome">
      {paso !== 'confirmacion' && <BackButton onClick={volver}>{labelVolver}</BackButton>}

      {paso === 'sucursal' && (
        <>
          <h1 className="title title-sm">Elige sucursal</h1>
          <p className="subtitle">Centro de kinesiología y quiropraxia</p>
          <div className="list">
            {SUCURSALES.map((s) => (
              <button
                key={s.id}
                type="button"
                className="row-btn"
                onClick={() => {
                  setSel({ sucursal: s })
                  ir('servicio', `Elegiste ${s.nombre}. ¿Masoterapia o quiropraxia?`)
                }}
              >
                <div className="row-main">
                  <span className="row-title">{s.nombre}</span>
                  <span className="row-sub">{s.ciudad}</span>
                </div>
                <span className="row-chevron">›</span>
              </button>
            ))}
          </div>
        </>
      )}

      {paso === 'servicio' && (
        <>
          <h1 className="title title-sm">Selecciona consulta</h1>
          <p className="subtitle">{sel.sucursal?.nombre}</p>
          <div className="menu-options qh-tipos">
            {TIPOS_SERVICIO.map((t) => (
              <button
                key={t.id}
                type="button"
                className="card-btn card-btn-big qh-tipo-card"
                onClick={() => {
                  setSel((s) => ({ ...s, tipo: t }))
                  ir('subServicio', `Elige el tipo de ${t.nombre.toLowerCase()}.`)
                }}
              >
                <QhIcon name={t.icono} className="esp-icon qh-icon qh-icon-lg" />
                <div className="qh-tipo-text">
                  <span className="card-btn-title">{t.nombre}</span>
                  <span className="card-btn-sub">
                    {t.id === 'masoterapia' ? 'Masajes y relajación' : 'Ajustes y controles'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {paso === 'subServicio' && sel.tipo && (
        <>
          <h1 className="title title-sm">{sel.tipo.nombre}</h1>
          <p className="subtitle">Elige tu servicio</p>
          <div className="list qh-servicios">
            {SERVICIOS[sel.tipo.id].map((srv) => (
              <button
                key={srv.id}
                type="button"
                className="row-btn qh-servicio-row"
                onClick={() => {
                  setSel((s) => ({ ...s, servicio: srv }))
                  ir('profesional', 'Elige el profesional que te atenderá.')
                }}
              >
                <QhIcon name={srv.icono} />
                <div className="row-main">
                  <span className="row-title">{srv.nombre}</span>
                  <span className="row-sub">
                    {srv.duracion}
                    {srv.detalle ? ` · ${srv.detalle}` : ''}
                  </span>
                </div>
                <span className="qh-precio">{formatCLP(srv.precio)}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {paso === 'profesional' && (
        <>
          <h1 className="title title-sm">Elige profesional</h1>
          <p className="subtitle">
            {sel.servicio?.nombre} · {formatCLP(sel.servicio?.precio)}
          </p>
          <div className="list">
            {PROFESIONALES.map((p) => (
              <button
                key={p.id}
                type="button"
                className="row-btn"
                onClick={() => {
                  setSel((s) => ({ ...s, profesional: p }))
                  setFechaSel(null)
                  ir('calendario', 'Selecciona un día disponible en el calendario.')
                }}
              >
                <div className="doctor-avatar qh-avatar">{p.nombre.slice(0, 2).replace('.', '')}</div>
                <div className="row-main">
                  <span className="row-title">{p.nombre}</span>
                  <span className="row-sub">{p.titulo}</span>
                </div>
                <span className="row-chevron">›</span>
              </button>
            ))}
          </div>
        </>
      )}

      {paso === 'calendario' && (
        <>
          <h1 className="title title-sm">Elige el día</h1>
          <p className="subtitle">{sel.profesional?.nombre}</p>
          <div className="qh-calendarios">
            {mesesCal.map((mes) => (
              <div key={mes.key} className="qh-cal-wrap">
                <div className="qh-cal-header capitalize">{mes.label}</div>
                <div className="qh-cal-weekdays">
                  {DIAS_SEMANA.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                <div className="qh-cal-grid">
                  {mes.cells.map((cell, i) =>
                    cell.type === 'empty' ? (
                      <span key={`e-${mes.key}-${i}`} className="qh-cal-empty" aria-hidden="true" />
                    ) : (
                      <button
                        key={cell.fecha.toISOString()}
                        type="button"
                        disabled={!cell.disponible}
                        className={`qh-cal-day ${!cell.disponible ? 'qh-cal-day-off' : ''} ${fechaSel?.toDateString() === cell.fecha.toDateString() ? 'active' : ''}`}
                        onClick={() => {
                          setFechaSel(cell.fecha)
                          ir('horario', `Horarios disponibles para el ${formatFechaCorta(cell.fecha)}.`)
                        }}
                      >
                        {cell.fecha.getDate()}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {paso === 'horario' && fechaSel && (
        <>
          <h1 className="title title-sm">Elige horario</h1>
          <p className="subtitle capitalize">{formatFechaLarga(fechaSel)}</p>
          <div className="slots">
            {horarios.map((h) => (
              <button
                key={h}
                type="button"
                className="slot"
                onClick={() => {
                  setSel((s) => ({ ...s, hora: h }))
                  ir('datos', 'Ingresa tus datos de contacto para confirmar la reserva.')
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </>
      )}

      {paso === 'datos' && (
        <>
          <h1 className="title title-sm">Tus datos</h1>
          <p className="subtitle">Paciente · {sel.servicio?.nombre}</p>

          <label className="qh-field">
            <span className="field-label">Nombre completo</span>
            <input
              type="text"
              className="qh-input"
              value={form.nombre}
              placeholder="Ej. María González"
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            />
          </label>

          <label className="qh-field">
            <span className="field-label">RUT</span>
            <div className={`rut-display qh-rut ${rutError ? 'rut-error shake' : ''} ${form.rut ? '' : 'rut-empty'}`}>
              {form.rut ? formatRut(form.rut) : '12.345.678-9'}
            </div>
            <Keypad
              onKey={(k) => {
                setRutError(false)
                setForm((f) => ({ ...f, rut: cleanRut(f.rut + k) }))
              }}
              onDelete={() => setForm((f) => ({ ...f, rut: f.rut.slice(0, -1) }))}
              onClear={() => setForm((f) => ({ ...f, rut: '' }))}
            />
          </label>

          <label className="qh-field">
            <span className="field-label">Correo</span>
            <input
              type="email"
              className="qh-input"
              value={form.correo}
              placeholder="correo@ejemplo.cl"
              onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
            />
          </label>

          <label className="qh-field">
            <span className="field-label">Teléfono</span>
            <input
              type="tel"
              className="qh-input"
              value={form.telefono}
              placeholder="+56 9 1234 5678"
              onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            />
          </label>

          <div className="summary-card">
            <div className="summary-row">
              <span>Servicio</span>
              <strong>{sel.servicio?.nombre}</strong>
            </div>
            <div className="summary-row">
              <span>Profesional</span>
              <strong>{sel.profesional?.nombre}</strong>
            </div>
            <div className="summary-row">
              <span>Fecha</span>
              <strong>{formatFechaCorta(fechaSel)} · {sel.hora}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{formatCLP(sel.servicio?.precio)}</strong>
            </div>
          </div>

          <button type="button" className="btn-primary" onClick={reservar}>
            Reservar cita
          </button>
        </>
      )}

      {paso === 'confirmacion' && reserva && (
        <div className="screen center">
          <div className="success-badge">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="title title-sm">¡Cita reservada!</h1>
          <p className="codigo">{reserva.codigo}</p>
          <div className="summary-card">
            <div className="summary-row">
              <span>Sucursal</span>
              <strong>{reserva.sucursal.nombre}</strong>
            </div>
            <div className="summary-row">
              <span>Servicio</span>
              <strong>{reserva.servicio.nombre}</strong>
            </div>
            <div className="summary-row">
              <span>Profesional</span>
              <strong>{reserva.profesional.nombre}</strong>
            </div>
            <div className="summary-row">
              <span>Fecha</span>
              <strong>{formatFechaLarga(new Date(reserva.fecha))} · {reserva.hora}</strong>
            </div>
            <div className="summary-row">
              <span>Paciente</span>
              <strong>{reserva.paciente.nombre}</strong>
            </div>
          </div>
          <button type="button" className="btn-primary" onClick={onFinish}>
            Finalizar
          </button>
        </div>
      )}
    </div>
  )
}
