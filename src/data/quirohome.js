/** Catálogo y reservas Quirohome (kinesiología / quiropraxia). */

const KEY = 'totem-quirohome-v1'

export const SUCURSALES = [
  { id: 'chillan', nombre: 'Centro Quirohome Chillán', ciudad: 'Chillán' },
  { id: 'santiago', nombre: 'Centro QuiroHome Santiago', ciudad: 'Santiago' },
]

export const TIPOS_SERVICIO = [
  { id: 'masoterapia', nombre: 'Masoterapia' },
  { id: 'quiropraxia', nombre: 'Quiropraxia' },
]

export const SERVICIOS = {
  masoterapia: [
    {
      id: 'maso-descontracturante',
      nombre: 'Masaje Descontracturante / Relajación',
      duracion: '45 min',
      precio: 40000,
    },
    {
      id: 'maso-maxilofacial',
      nombre: 'Masoterapia Maxilofacial',
      duracion: '25 min',
      precio: 35000,
    },
    {
      id: 'maso-tren',
      nombre: 'Masaje Tren Superior o Inferior',
      duracion: '25 min',
      precio: 33000,
    },
  ],
  quiropraxia: [
    {
      id: 'quiro-ingreso',
      nombre: 'Quiropraxia Ingreso',
      detalle: 'Consulte valor promocional',
      duracion: '45 min',
      precio: 40000,
    },
    {
      id: 'quiro-control',
      nombre: 'Quiropraxia Control',
      duracion: '30 min',
      precio: 33000,
    },
    {
      id: 'quiro-raul',
      nombre: 'Quiropraxia Raúl Mancilla',
      duracion: '45 min',
      precio: 35000,
    },
  ],
}

export const PROFESIONALES = [
  { id: 'javiera', nombre: 'Klga. Javiera Segura', titulo: 'Kinesióloga' },
  { id: 'emilia', nombre: 'Klga. Emilia Cori', titulo: 'Kinesióloga' },
  { id: 'emilio', nombre: 'Klgo. Emilio Machuca', titulo: 'Kinesiólogo' },
  { id: 'fabian', nombre: 'Klgo. Fabian Barison Arias', titulo: 'Kinesiólogo' },
]

const HORARIOS_BASE = ['09:00', '09:45', '10:30', '11:15', '12:00', '15:00', '15:45', '16:30', '17:15', '18:00']

function seed(...parts) {
  return parts.join('').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

/** Próximos ~21 días con algunos no disponibles. */
export function diasCalendario(sucursalId, profesionalId) {
  const dias = []
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)
  const s = seed(sucursalId, profesionalId)

  while (dias.length < 21) {
    cursor.setDate(cursor.getDate() + 1)
    const dow = cursor.getDay()
    const bloqueado = dow === 0 || (s + cursor.getDate() + dow) % 6 === 0
    dias.push({
      fecha: new Date(cursor),
      disponible: !bloqueado,
    })
  }
  return dias
}

export function horariosParaDia(fecha, profesionalId) {
  const s = seed(profesionalId, fecha.toDateString())
  return HORARIOS_BASE.filter((_, i) => (s + i + fecha.getDate()) % 4 !== 0)
}

export function formatCLP(n) {
  return '$' + Math.round(n).toLocaleString('es-CL')
}

export function formatFechaCorta(date) {
  return date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatFechaLarga(date) {
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

function genCodigo() {
  return 'QH' + Math.random().toString(36).slice(2, 7).toUpperCase()
}

export function guardarReserva(datos) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY)) || []
    const reserva = { ...datos, codigo: genCodigo(), creada: new Date().toISOString() }
    list.push(reserva)
    localStorage.setItem(KEY, JSON.stringify(list))
    return reserva
  } catch {
    return { ...datos, codigo: genCodigo() }
  }
}

/** Índice del paso para el stepper (0–4). */
export const PASO_QUIROHOME = {
  sucursal: 0,
  servicio: 1,
  subServicio: 1,
  profesional: 2,
  calendario: 3,
  horario: 3,
  datos: 4,
  confirmacion: 4,
}
