/** Catálogo de países, regiones chilenas y coordenadas para el mapa. */

export const ORIGEN = {
  codigo: 'SCL',
  ciudad: 'Santiago',
  pais: 'Chile',
  mapX: 28,
  mapY: 72,
}

/** @typedef {{ id: string, ciudad: string, codigo: string, region?: string, capital?: boolean }} Destino */
/** @typedef {{ id: string, nombre: string, bandera: string, mapX: number, mapY: number, destinos: Destino[], esNacional?: boolean }} Pais */

export const PAISES = [
  {
    id: 'cl',
    nombre: 'Chile',
    bandera: '🇨🇱',
    mapX: 28,
    mapY: 72,
    esNacional: true,
    destinos: [
      { id: 'cl-scl', ciudad: 'Santiago', region: 'Metropolitana', codigo: 'SCL', capital: true },
      { id: 'cl-ari', ciudad: 'Arica', region: 'Arica y Parinacota', codigo: 'ARI' },
      { id: 'cl-iqq', ciudad: 'Iquique', region: 'Tarapacá', codigo: 'IQQ' },
      { id: 'cl-anf', ciudad: 'Antofagasta', region: 'Antofagasta', codigo: 'ANF' },
      { id: 'cl-cjc', ciudad: 'Calama', region: 'Atacama', codigo: 'CJC' },
      { id: 'cl-lsc', ciudad: 'La Serena', region: 'Coquimbo', codigo: 'LSC' },
      { id: 'cl-vap', ciudad: 'Valparaíso', region: 'Valparaíso', codigo: 'VAP' },
      { id: 'cl-qrc', ciudad: 'Rancagua', region: "O'Higgins", codigo: 'QRC' },
      { id: 'cl-tlx', ciudad: 'Talca', region: 'Maule', codigo: 'TLX' },
      { id: 'cl-ccp', ciudad: 'Concepción', region: 'Biobío', codigo: 'CCP' },
      { id: 'cl-zco', ciudad: 'Temuco', region: 'La Araucanía', codigo: 'ZCO' },
      { id: 'cl-zal', ciudad: 'Valdivia', region: 'Los Ríos', codigo: 'ZAL' },
      { id: 'cl-pmc', ciudad: 'Puerto Montt', region: 'Los Lagos', codigo: 'PMC' },
      { id: 'cl-gxq', ciudad: 'Coyhaique', region: 'Aysén', codigo: 'GXQ' },
      { id: 'cl-puq', ciudad: 'Punta Arenas', region: 'Magallanes', codigo: 'PUQ' },
    ],
  },
  {
    id: 'ar',
    nombre: 'Argentina',
    bandera: '🇦🇷',
    mapX: 32,
    mapY: 78,
    destinos: [
      { id: 'ar-eze', ciudad: 'Buenos Aires', codigo: 'EZE', capital: true },
      { id: 'ar-cor', ciudad: 'Córdoba', codigo: 'COR' },
      { id: 'ar-mdz', ciudad: 'Mendoza', codigo: 'MDZ' },
    ],
  },
  {
    id: 'pe',
    nombre: 'Perú',
    bandera: '🇵🇪',
    mapX: 26,
    mapY: 58,
    destinos: [
      { id: 'pe-lim', ciudad: 'Lima', codigo: 'LIM', capital: true },
      { id: 'pe-cuz', ciudad: 'Cuzco', codigo: 'CUZ' },
    ],
  },
  {
    id: 'co',
    nombre: 'Colombia',
    bandera: '🇨🇴',
    mapX: 28,
    mapY: 52,
    destinos: [
      { id: 'co-bog', ciudad: 'Bogotá', codigo: 'BOG', capital: true },
      { id: 'co-med', ciudad: 'Medellín', codigo: 'MDE' },
    ],
  },
  {
    id: 'br',
    nombre: 'Brasil',
    bandera: '🇧🇷',
    mapX: 38,
    mapY: 62,
    destinos: [
      { id: 'br-gru', ciudad: 'São Paulo', codigo: 'GRU', capital: true },
      { id: 'br-gig', ciudad: 'Río de Janeiro', codigo: 'GIG' },
    ],
  },
  {
    id: 'mx',
    nombre: 'México',
    bandera: '🇲🇽',
    mapX: 18,
    mapY: 42,
    destinos: [
      { id: 'mx-mex', ciudad: 'Ciudad de México', codigo: 'MEX', capital: true },
      { id: 'mx-cun', ciudad: 'Cancún', codigo: 'CUN' },
    ],
  },
  {
    id: 'us',
    nombre: 'Estados Unidos',
    bandera: '🇺🇸',
    mapX: 20,
    mapY: 38,
    destinos: [
      { id: 'us-mia', ciudad: 'Miami', codigo: 'MIA' },
      { id: 'us-jfk', ciudad: 'Nueva York', codigo: 'JFK', capital: true },
      { id: 'us-lax', ciudad: 'Los Ángeles', codigo: 'LAX' },
    ],
  },
  {
    id: 'ca',
    nombre: 'Canadá',
    bandera: '🇨🇦',
    mapX: 22,
    mapY: 28,
    destinos: [{ id: 'ca-yyz', ciudad: 'Toronto', codigo: 'YYZ', capital: true }],
  },
  {
    id: 'es',
    nombre: 'España',
    bandera: '🇪🇸',
    mapX: 48,
    mapY: 36,
    destinos: [
      { id: 'es-mad', ciudad: 'Madrid', codigo: 'MAD', capital: true },
      { id: 'es-bcn', ciudad: 'Barcelona', codigo: 'BCN' },
    ],
  },
  {
    id: 'fr',
    nombre: 'Francia',
    bandera: '🇫🇷',
    mapX: 50,
    mapY: 34,
    destinos: [{ id: 'fr-cdg', ciudad: 'París', codigo: 'CDG', capital: true }],
  },
  {
    id: 'gb',
    nombre: 'Reino Unido',
    bandera: '🇬🇧',
    mapX: 48,
    mapY: 28,
    destinos: [{ id: 'gb-lhr', ciudad: 'Londres', codigo: 'LHR', capital: true }],
  },
  {
    id: 'de',
    nombre: 'Alemania',
    bandera: '🇩🇪',
    mapX: 52,
    mapY: 30,
    destinos: [{ id: 'de-fra', ciudad: 'Frankfurt', codigo: 'FRA', capital: true }],
  },
  {
    id: 'it',
    nombre: 'Italia',
    bandera: '🇮🇹',
    mapX: 54,
    mapY: 36,
    destinos: [{ id: 'it-fco', ciudad: 'Roma', codigo: 'FCO', capital: true }],
  },
  {
    id: 'pt',
    nombre: 'Portugal',
    bandera: '🇵🇹',
    mapX: 46,
    mapY: 38,
    destinos: [{ id: 'pt-lis', ciudad: 'Lisboa', codigo: 'LIS', capital: true }],
  },
  {
    id: 'jp',
    nombre: 'Japón',
    bandera: '🇯🇵',
    mapX: 88,
    mapY: 38,
    destinos: [
      { id: 'jp-nrt', ciudad: 'Tokio', codigo: 'NRT', capital: true },
      { id: 'jp-kix', ciudad: 'Osaka', codigo: 'KIX' },
    ],
  },
  {
    id: 'kr',
    nombre: 'Corea del Sur',
    bandera: '🇰🇷',
    mapX: 84,
    mapY: 36,
    destinos: [{ id: 'kr-icn', ciudad: 'Seúl', codigo: 'ICN', capital: true }],
  },
  {
    id: 'cn',
    nombre: 'China',
    bandera: '🇨🇳',
    mapX: 78,
    mapY: 40,
    destinos: [
      { id: 'cn-pvg', ciudad: 'Shanghái', codigo: 'PVG', capital: true },
      { id: 'cn-pek', ciudad: 'Pekín', codigo: 'PEK' },
    ],
  },
  {
    id: 'in',
    nombre: 'India',
    bandera: '🇮🇳',
    mapX: 72,
    mapY: 48,
    destinos: [{ id: 'in-del', ciudad: 'Nueva Delhi', codigo: 'DEL', capital: true }],
  },
  {
    id: 'ae',
    nombre: 'Emiratos Árabes',
    bandera: '🇦🇪',
    mapX: 64,
    mapY: 46,
    destinos: [{ id: 'ae-dxb', ciudad: 'Dubái', codigo: 'DXB', capital: true }],
  },
  {
    id: 'au',
    nombre: 'Australia',
    bandera: '🇦🇺',
    mapX: 86,
    mapY: 72,
    destinos: [
      { id: 'au-syd', ciudad: 'Sídney', codigo: 'SYD', capital: true },
      { id: 'au-mel', ciudad: 'Melbourne', codigo: 'MEL' },
    ],
  },
  {
    id: 'nz',
    nombre: 'Nueva Zelanda',
    bandera: '🇳🇿',
    mapX: 92,
    mapY: 78,
    destinos: [{ id: 'nz-akl', ciudad: 'Auckland', codigo: 'AKL', capital: true }],
  },
  {
    id: 'za',
    nombre: 'Sudáfrica',
    bandera: '🇿🇦',
    mapX: 56,
    mapY: 78,
    destinos: [{ id: 'za-jnb', ciudad: 'Johannesburgo', codigo: 'JNB', capital: true }],
  },
  {
    id: 'ec',
    nombre: 'Ecuador',
    bandera: '🇪🇨',
    mapX: 24,
    mapY: 54,
    destinos: [{ id: 'ec-uio', ciudad: 'Quito', codigo: 'UIO', capital: true }],
  },
  {
    id: 'uy',
    nombre: 'Uruguay',
    bandera: '🇺🇾',
    mapX: 34,
    mapY: 76,
    destinos: [{ id: 'uy-mvd', ciudad: 'Montevideo', codigo: 'MVD', capital: true }],
  },
  {
    id: 'pa',
    nombre: 'Panamá',
    bandera: '🇵🇦',
    mapX: 24,
    mapY: 48,
    destinos: [{ id: 'pa-pty', ciudad: 'Ciudad de Panamá', codigo: 'PTY', capital: true }],
  },
  {
    id: 'cr',
    nombre: 'Costa Rica',
    bandera: '🇨🇷',
    mapX: 22,
    mapY: 50,
    destinos: [{ id: 'cr-sjo', ciudad: 'San José', codigo: 'SJO', capital: true }],
  },
]

const destinoIndex = new Map()

for (const pais of PAISES) {
  for (const d of pais.destinos) {
    destinoIndex.set(d.id, {
      ...d,
      pais: pais.nombre,
      bandera: pais.bandera,
      mapX: pais.mapX,
      mapY: pais.mapY,
    })
  }
}

export function getPaisById(id) {
  return PAISES.find((p) => p.id === id)
}

export function getDestinoById(id) {
  return destinoIndex.get(id)
}

export function getCapital(pais) {
  return pais.destinos.find((d) => d.capital) || pais.destinos[0]
}
