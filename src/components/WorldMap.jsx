import { useId } from 'react'
import { ORIGEN } from '../data/destinos'

/** Mapa con siluetas de continentes y ruta SCL → destino. */
export default function WorldMap({ pais, destino }) {
  const uid = useId().replace(/:/g, '')
  const dest = destino || (pais ? { mapX: pais.mapX, mapY: pais.mapY, ciudad: pais.nombre, codigo: '' } : null)

  const toSvg = (x, y) => ({ x: x * 10, y: y * 5 })
  const origen = toSvg(ORIGEN.mapX, ORIGEN.mapY)
  const llegada = toSvg(dest?.mapX ?? ORIGEN.mapX, dest?.mapY ?? ORIGEN.mapY)

  const arcY = Math.min(origen.y, llegada.y) - 40
  const midX = (origen.x + llegada.x) / 2

  return (
    <div className="world-map-wrap">
      <svg
        className="world-map"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`ocean-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8f0fe" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id={`land-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id={`route-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1b0088" />
            <stop offset="100%" stopColor="#e8114b" />
          </linearGradient>
          <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <rect width="1000" height="500" fill={`url(#ocean-${uid})`} rx="8" />

        {/* Siluetas de continentes (equirectangular simplificado) */}
        <g fill={`url(#land-${uid})`} stroke="#94a3b8" strokeWidth="1.2" strokeLinejoin="round">
          {/* Norteamérica */}
          <path d="M 80,95 130,70 210,65 290,80 340,110 360,150 330,185 280,200 230,195 180,210 140,200 100,170 75,130 Z" />
          {/* Groenlandia */}
          <path d="M 380,55 420,45 450,60 440,90 400,95 375,75 Z" />
          {/* Sudamérica */}
          <path d="M 290,235 330,220 360,250 370,310 355,380 330,420 300,410 285,360 275,300 280,250 Z" />
          {/* Europa */}
          <path d="M 470,95 520,85 560,100 570,130 550,155 510,160 480,145 465,120 Z" />
          {/* África */}
          <path d="M 480,165 540,155 580,180 590,240 575,320 545,360 510,350 485,300 475,220 Z" />
          {/* Asia */}
          <path d="M 560,75 680,60 780,75 860,100 920,130 900,180 820,200 720,185 640,170 580,150 555,120 Z" />
          {/* Sudeste asiático / Indonesia */}
          <path d="M 760,220 820,215 850,240 830,260 780,255 Z" />
          {/* Australia */}
          <path d="M 780,320 860,310 900,335 890,370 840,380 790,365 Z" />
          {/* Antártida (sutil) */}
          <path d="M 120,440 880,440 850,470 150,470 Z" opacity="0.5" />
        </g>

        {/* Meridianos decorativos */}
        {[200, 400, 600, 800].map((x) => (
          <line key={x} x1={x} y1="30" x2={x} y2="470" stroke="#cbd5e1" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.5" />
        ))}

        {dest && pais && (
          <>
            <path
              d={`M ${origen.x} ${origen.y} Q ${midX} ${arcY} ${llegada.x} ${llegada.y}`}
              fill="none"
              stroke={`url(#route-${uid})`}
              strokeWidth="3"
              strokeDasharray="8 6"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Avión en el arco */}
            <g transform={`translate(${midX}, ${arcY - 8})`} fill="#1b0088">
              <path d="M -10 0 L 10 0 L 0 -6 Z" />
            </g>
          </>
        )}

        {/* Origen Santiago */}
        <g filter={`url(#shadow-${uid})`}>
          <circle cx={origen.x} cy={origen.y} r="14" fill="#1b0088" opacity="0.12" />
          <circle cx={origen.x} cy={origen.y} r="7" fill="#1b0088" stroke="#fff" strokeWidth="2" />
        </g>
        <text x={origen.x} y={origen.y + 26} textAnchor="middle" fontSize="14" fill="#1b0088" fontWeight="800">
          SCL
        </text>
        <text x={origen.x} y={origen.y + 40} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
          Santiago
        </text>

        {dest && pais && (
          <g filter={`url(#shadow-${uid})`}>
            <circle cx={llegada.x} cy={llegada.y} r="16" fill="#e8114b" opacity="0.12" />
            <circle cx={llegada.x} cy={llegada.y} r="8" fill="#e8114b" stroke="#fff" strokeWidth="2" />
            <text x={llegada.x} y={llegada.y + 28} textAnchor="middle" fontSize="14" fill="#991b1b" fontWeight="800">
              {dest.codigo || pais.nombre.slice(0, 3).toUpperCase()}
            </text>
            <text x={llegada.x} y={llegada.y + 42} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
              {dest.ciudad || pais.nombre}
            </text>
          </g>
        )}
      </svg>

      {pais ? (
        <div className="world-map-legend">
          <span className="world-map-flag">{pais.bandera}</span>
          <span>
            {dest?.ciudad ? `${dest.ciudad}, ` : ''}
            {pais.nombre}
          </span>
        </div>
      ) : (
        <div className="world-map-legend world-map-legend-muted">
          Selecciona un país para ver la ruta desde Santiago
        </div>
      )}
    </div>
  )
}
