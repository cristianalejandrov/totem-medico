/** Catálogo de países, regiones chilenas y coordenadas para el mapa. */

export const ORIGEN = {
  codigo: 'SCL',
  ciudad: 'Santiago',
  pais: 'Chile',
  lat: -33.393,
  lng: -70.7858,
  mapX: 28,
  mapY: 72,
}

/** Coordenadas aeropuerto por destino [lat, lng]. */
const COORDS = {
  'cl-scl': [-33.393, -70.7858],
  'cl-ari': [-18.348, -70.339],
  'cl-iqq': [-20.535, -70.181],
  'cl-anf': [-23.444, -70.445],
  'cl-cjc': [-22.498, -68.904],
  'cl-lsc': [-29.916, -71.202],
  'cl-vap': [-33.046, -71.619],
  'cl-qrc': [-34.17, -70.775],
  'cl-tlx': [-35.426, -71.655],
  'cl-ccp': [-36.772, -73.063],
  'cl-zco': [-38.766, -72.637],
  'cl-zal': [-39.65, -73.086],
  'cl-pmc': [-41.438, -73.094],
  'cl-gxq': [-45.594, -72.106],
  'cl-puq': [-53.003, -70.854],
  'ar-eze': [-34.822, -58.536],
  'ar-cor': [-31.323, -64.208],
  'ar-mdz': [-32.832, -68.792],
  'pe-lim': [-12.022, -77.114],
  'pe-cuz': [-13.536, -71.939],
  'co-bog': [4.702, -74.147],
  'co-med': [6.165, -75.423],
  'br-gru': [-23.436, -46.473],
  'br-gig': [-22.809, -43.25],
  'mx-mex': [19.436, -99.072],
  'mx-cun': [21.037, -86.877],
  'us-mia': [25.793, -80.291],
  'us-jfk': [40.641, -73.778],
  'us-lax': [33.942, -118.408],
  'ca-yyz': [43.677, -79.624],
  'es-mad': [40.472, -3.561],
  'es-bcn': [41.297, 2.078],
  'fr-cdg': [49.01, 2.548],
  'gb-lhr': [51.47, -0.454],
  'de-fra': [50.037, 8.562],
  'it-fco': [41.8, 12.238],
  'pt-lis': [38.774, -9.134],
  'jp-nrt': [35.772, 140.392],
  'jp-kix': [34.434, 135.244],
  'kr-icn': [37.46, 126.441],
  'cn-pvg': [31.144, 121.808],
  'cn-pek': [40.08, 116.585],
  'in-del': [28.556, 77.1],
  'ae-dxb': [25.253, 55.366],
  'au-syd': [-33.946, 151.177],
  'au-mel': [-37.673, 144.843],
  'nz-akl': [-37.008, 174.792],
  'za-jnb': [-26.139, 28.246],
  'ec-uio': [-0.129, -78.358],
  'uy-mvd': [-34.838, -56.031],
  'pa-pty': [9.071, -79.383],
  'cr-sjo': [9.994, -84.209],
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
    const c = COORDS[d.id] || [0, 0]
    destinoIndex.set(d.id, {
      ...d,
      lat: c[0],
      lng: c[1],
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
  const cap = pais.destinos.find((d) => d.capital) || pais.destinos[0]
  return getDestinoById(cap.id) || cap
}
