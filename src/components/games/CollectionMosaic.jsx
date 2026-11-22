import GameCover from './GameCover.jsx'
import './CollectionMosaic.css'

// Mosaico de hasta 4 portadas para mostrar una colección
export default function CollectionMosaic({ portadas = [], nombre }) {
  const celdas = [0, 1, 2, 3].map((i) => portadas[i])

  return (
    <div className="mosaico" aria-hidden="true">
      {celdas.map((portada, i) =>
        portada ? (
          <GameCover key={i} titulo="" portadaUrl={portada} className="mosaico__celda" />
        ) : (
          <div key={i} className="mosaico__celda mosaico__celda--vacia">
            {i === 0 && portadas.length === 0 && <span>{nombre?.charAt(0)}</span>}
          </div>
        )
      )}
    </div>
  )
}
