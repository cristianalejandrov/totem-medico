/** Catálogo simulado del centro médico: especialidades, médicos, horarios y previsiones. */

export const ESPECIALIDADES = [
  { id: 'medicina-general', nombre: 'Medicina General', precio: 25000, icono: 'stethoscope' },
  { id: 'cardiologia', nombre: 'Cardiología', precio: 45000, icono: 'heart' },
  { id: 'pediatria', nombre: 'Pediatría', precio: 35000, icono: 'baby' },
  { id: 'dermatologia', nombre: 'Dermatología', precio: 40000, icono: 'skin' },
  { id: 'traumatologia', nombre: 'Traumatología', precio: 42000, icono: 'bone' },
  { id: 'oftalmologia', nombre: 'Oftalmología', precio: 38000, icono: 'eye' },
];

export const DOCTORES = {
  'medicina-general': [
    { id: 'mg-1', nombre: 'Dra. Carolina Fuentes', detalle: 'Medicina Familiar · 12 años exp.' },
    { id: 'mg-2', nombre: 'Dr. Andrés Soto', detalle: 'Medicina Interna · 8 años exp.' },
  ],
  cardiologia: [
    { id: 'ca-1', nombre: 'Dr. Rodrigo Pérez', detalle: 'Cardiología Clínica · 15 años exp.' },
    { id: 'ca-2', nombre: 'Dra. María José Lagos', detalle: 'Ecocardiografía · 10 años exp.' },
  ],
  pediatria: [
    { id: 'pe-1', nombre: 'Dra. Valentina Rojas', detalle: 'Pediatría General · 9 años exp.' },
    { id: 'pe-2', nombre: 'Dr. Felipe Cárdenas', detalle: 'Neonatología · 11 años exp.' },
  ],
  dermatologia: [
    { id: 'de-1', nombre: 'Dra. Antonia Vidal', detalle: 'Dermatología Clínica · 7 años exp.' },
  ],
  traumatologia: [
    { id: 'tr-1', nombre: 'Dr. Ignacio Morales', detalle: 'Rodilla y cadera · 14 años exp.' },
    { id: 'tr-2', nombre: 'Dr. Pablo Herrera', detalle: 'Columna · 10 años exp.' },
  ],
  oftalmologia: [
    { id: 'of-1', nombre: 'Dra. Francisca Núñez', detalle: 'Oftalmología General · 6 años exp.' },
  ],
};

/** Genera horarios de los próximos 3 días hábiles para un doctor. */
export function horariosPara(doctorId) {
  const dias = [];
  const hoy = new Date();
  const cursor = new Date(hoy);
  while (dias.length < 3) {
    cursor.setDate(cursor.getDate() + 1);
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) dias.push(new Date(cursor));
  }
  // Horas pseudo-aleatorias pero estables por doctor y día
  const seedBase = [...doctorId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bloques = ['09:00', '09:40', '10:20', '11:00', '11:40', '15:00', '15:40', '16:20', '17:00'];
  return dias.map((fecha, di) => {
    const horas = bloques.filter((_, i) => (seedBase + di * 3 + i) % 3 !== 0);
    return { fecha, horas };
  });
}

export const PREVISIONES = [
  { id: 'fonasa', nombre: 'Fonasa', cobertura: 0.6, detalle: 'Bono electrónico · cobertura 60%' },
  { id: 'isapre', nombre: 'Isapre', cobertura: 0.5, detalle: 'Bono I-Med · cobertura 50%' },
  { id: 'particular', nombre: 'Particular', cobertura: 0, detalle: 'Sin convenio · paga el total' },
];

export function formatCLP(n) {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

export function formatFecha(date) {
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
}
