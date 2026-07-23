/** Catálogo y reservas de vuelos simuladas (localStorage). */

const KEY = 'totem-vuelos-v1'

export const DESTINOS = [
  { id: 'miami', pais: 'Estados Unidos', ciudad: 'Miami', codigo: 'MIA', bandera: '🇺🇸' },
  { id: 'madrid', pais: 'España', ciudad: 'Madrid', codigo: 'MAD', bandera: '🇪🇸' },
  { id: 'lima', pais: 'Perú', ciudad: 'Lima', codigo: 'LIM', bandera: '🇵🇪' },
  { id: 'bogota', pais: 'Colombia', ciudad: 'Bogotá', codigo: 'BOG', bandera: '🇨🇴' },
  { id: 'sydney', pais: 'Australia', ciudad: 'Sídney', codigo: 'SYD', bandera: '🇦🇺' },
  { id: 'cancun', pais: 'México', ciudad: 'Cancún', codigo: 'CUN', bandera: '🇲🇽' },
]

const HORARIOS = ['06:40', '09:15', '12:30', '15:45', '18:20', '21:10']

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function genPnr() {
  return 'INC' + Math.random().toString(36).slice(2, 7).toUpperCase()
}

function genVueloNum(destino, idx) {
  return `AI${100 + idx}${destino.codigo.slice(0, 1)}`
}

/** Genera opciones de vuelo para una fecha y destino. */
export function buscarVuelos({ destinoId, fechaIda, fechaVuelta, idaYVuelta }) {
  const destino = DESTINOS.find((d) => d.id === destinoId)
  if (!destino) return []

  const ida = new Date(fechaIda)
  return HORARIOS.slice(0, 4).map((hora, i) => {
    const base = 89000 + i * 12000 + destinoId.length * 3000
    const precio = idaYVuelta ? base * 1.75 : base
    return {
      id: `${destinoId}-${fechaIda}-${hora}`,
      destino,
      ida: {
        fecha: ida,
        hora,
        vuelo: genVueloNum(destino, i),
        terminal: i % 2 === 0 ? 'T1' : 'T2',
        puerta: String(10 + i * 3),
      },
      vuelta: idaYVuelta && fechaVuelta
        ? {
            fecha: new Date(fechaVuelta),
            hora: HORARIOS[(i + 2) % HORARIOS.length],
            vuelo: genVueloNum(destino, i + 4),
            terminal: 'T1',
            puerta: String(20 + i),
          }
        : null,
      idaYVuelta,
      precio,
      asientos: 12 + i * 3,
    }
  })
}

export function getVuelosReservados(rutClean) {
  return readAll()[rutClean] || []
}

export function reservarVuelo(rutClean, vuelo, pasajeros = 1) {
  const all = readAll()
  const list = all[rutClean] || []
  const reserva = {
    ...vuelo,
    pasajeros,
    pnr: genPnr(),
    total: vuelo.precio * pasajeros,
    creada: new Date().toISOString(),
  }
  list.push(reserva)
  all[rutClean] = list
  localStorage.setItem(KEY, JSON.stringify(all))
  return reserva
}

/** Próximos 14 días hábiles para selector táctil. */
export function proximosDias(cantidad = 14) {
  const dias = []
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)
  while (dias.length < cantidad) {
    cursor.setDate(cursor.getDate() + 1)
    const dow = cursor.getDay()
    if (dow !== 0 && dow !== 6) dias.push(new Date(cursor))
  }
  return dias
}

export function formatFechaVuelo(date) {
  return date.toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatFechaLarga(date) {
  return date.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatCLP(n) {
  return '$' + Math.round(n).toLocaleString('es-CL')
}
