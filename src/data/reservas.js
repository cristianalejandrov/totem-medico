/** Reservas por RUT persistidas en localStorage (simula el backend del centro médico). */

const KEY = 'totem-reservas-v1';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function getReservas(rutClean) {
  return readAll()[rutClean] || [];
}

export function addReserva(rutClean, reserva) {
  const all = readAll();
  const list = all[rutClean] || [];
  list.push({ ...reserva, codigo: genCodigo(), creada: new Date().toISOString() });
  all[rutClean] = list;
  localStorage.setItem(KEY, JSON.stringify(all));
  return list[list.length - 1];
}

function genCodigo() {
  return 'CV-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
