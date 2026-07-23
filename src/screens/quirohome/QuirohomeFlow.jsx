import { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/BackButton'
import Keypad from '../../components/Keypad'
import {
  PASO_QUIROHOME,
  PROFESIONALES,
  SERVICIOS,
  SUCURSALES,
  TIPOS_SERVICIO,
  diasCalendario,
  formatCLP,
  formatFechaCorta,
  formatFechaLarga,
  guardarReserva,
  horariosParaDia,
} from '../../data/quirohome'
import { cleanRut, formatRut, validateRut } from '../../utils/rut'
import { tts } from '../../voice/tts'

const PASOS = ['sucursal', 'servicio', 'subServicio', 'profesional', 'calendario', 'horario', 'datos', 'confirmacion']

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

  const dias = useMemo(() => {
    if (!sel.sucursal || !sel.profesional) return []
    return diasCalendario(sel.sucursal.id, sel.profesional.id)
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
          <div className="menu-options">
            {TIPOS_SERVICIO.map((t) => (
              <button
                key={t.id}
                type="button"
                className="card-btn card-btn-big"
                onClick={() => {
                  setSel((s) => ({ ...s, tipo: t }))
                  ir('subServicio', `Elige el tipo de ${t.nombre.toLowerCase()}.`)
                }}
              >
                <span className="card-btn-title">{t.nombre}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {paso === 'subServicio' && sel.tipo && (
        <>
          <h1 className="title title-sm">{sel.tipo.nombre}</h1>
          <p className="subtitle">Elige tu servicio</p>
          <div className="list">
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
          <div className="qh-calendario">
            {dias.map((d) => (
              <button
                key={d.fecha.toISOString()}
                type="button"
                disabled={!d.disponible}
                className={`qh-dia ${!d.disponible ? 'qh-dia-off' : ''} ${fechaSel?.toDateString() === d.fecha.toDateString() ? 'active' : ''}`}
                onClick={() => {
                  setFechaSel(d.fecha)
                  ir('horario', `Horarios disponibles para el ${formatFechaCorta(d.fecha)}.`)
                }}
              >
                <span className="qh-dia-num">{d.fecha.getDate()}</span>
                <span className="qh-dia-wd">
                  {d.fecha.toLocaleDateString('es-CL', { weekday: 'short' })}
                </span>
              </button>
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
