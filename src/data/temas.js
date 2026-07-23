/** Configuración visual y de flujo por modo de tótem. */

export const TEMAS = {
  clinica: {
    id: 'clinica',
    label: 'Clínica',
    brand: 'Clínica Inclusive',
    avatarModel: '/models/haru/haru_greeter_t03.clinica.model3.json',
    pasos: ['Identificación', 'Selección', 'Pago'],
    icon: 'medical',
  },
  aeropuerto: {
    id: 'aeropuerto',
    label: 'Aeropuerto',
    brand: 'Aeropuerto Inclusive',
    avatarModel: '/models/haru/haru_greeter_t03.model3.json',
    pasos: ['Identificación', 'Reserva', 'Confirmación'],
    icon: 'flight',
  },
}

export function getTema(id) {
  return TEMAS[id] || TEMAS.clinica
}
