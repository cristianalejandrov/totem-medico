import { ORIGEN } from '../data/destinos'

/** Mapa estilizado con ruta SCL → destino. */
export default function WorldMap({ pais, destino }) {
  const dest = destino || (pais ? { mapX: pais.mapX, mapY: pais.mapY, ciudad: pais.nombre } : null)
  const ox = ORIGEN.mapX
  const oy = ORIGEN.mapY
  const dx = dest?.mapX ?? ox
  const dy = dest?.mapY ?? oy

  const midX = (ox + dx) / 2
  const midY = Math.min(oy, dy) - 12

  return (
    <div className="world-map-wrap">
      <svg
        className="world-map"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#eef2ff" />
          </linearGradient>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1b0088" />
            <stop offset="100%" stopColor="#e8114b" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#oceanGrad)" rx="4" />

        {/* Continentes simplificados */}
        <g fill="#dbeafe" stroke="#bfdbfe" strokeWidth="0.3">
          <path d="M8 22 Q18 18 28 24 Q32 32 24 38 Q14 36 8 28 Z" />
          <path d="M14 38 Q22 34 30 42 Q28 52 18 54 Q10 48 14 38 Z" />
          <path d="M44 20 Q58 18 62 28 Q60 38 50 40 Q42 34 44 20 Z" />
          <path d="M48 38 Q58 36 64 44 Q62 54 52 56 Q46 48 48 38 Z" />
          <path d="M48 58 Q56 56 60 64 Q58 72 50 74 Q44 68 48 58 Z" />
          <path d="M68 28 Q78 26 82 34 Q80 44 72 46 Q66 38 68 28 Z" />
          <path d="M74 48 Q84 46 88 54 Q86 64 78 66 Q72 58 74 48 Z" />
          <path d="M82 68 Q90 66 94 74 Q90 82 84 80 Q78 74 82 68 Z" />
        </g>

        {/* Grilla sutil */}
        {[20, 40, 60, 80].map((n) => (
          <g key={n} stroke="#e2e8f0" strokeWidth="0.15" opacity="0.6">
            <line x1={n} y1="0" x2={n} y2="100" />
            <line x1="0" y1={n} x2="100" y2={n} />
          </g>
        ))}

        {dest && (
          <path
            d={`M ${ox} ${oy} Q ${midX} ${midY} ${dx} ${dy}`}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.85"
          />
        )}

        {/* Origen SCL */}
        <circle cx={ox} cy={oy} r="2.8" fill="#1b0088" opacity="0.15" />
        <circle cx={ox} cy={oy} r="1.4" fill="#1b0088" />
        <text x={ox} y={oy + 5} textAnchor="middle" fontSize="3.2" fill="#1b0088" fontWeight="700">
          SCL
        </text>

        {dest && (
          <>
            <circle cx={dx} cy={dy} r="3.2" fill="#e8114b" opacity="0.18" />
            <circle cx={dx} cy={dy} r="1.6" fill="#e8114b" />
            <text x={dx} y={dy + 5.2} textAnchor="middle" fontSize="3" fill="#991b1b" fontWeight="700">
              {dest.codigo || dest.ciudad?.slice(0, 3).toUpperCase()}
            </text>
          </>
        )}
      </svg>

      {pais && (
        <div className="world-map-legend">
          <span className="world-map-flag">{pais.bandera}</span>
          <span>
            {dest?.ciudad ? `${dest.ciudad}, ` : ''}
            {pais.nombre}
          </span>
        </div>
      )}
    </div>
  )
}
