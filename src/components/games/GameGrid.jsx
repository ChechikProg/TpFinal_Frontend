import GameCard from './GameCard.jsx'
import './GameGrid.css'

// Grilla de juegos. Mientras carga la primera página muestra tarjetas "fantasma".
export default function GameGrid({ juegos, cargando = false, cantidadFantasma = 8 }) {
  return (
    <div className="grilla-juegos">
      {juegos.map((juego) => (
        <GameCard key={juego.idExterno} juego={juego} />
      ))}
      {cargando &&
        Array.from({ length: cantidadFantasma }, (_, i) => (
          <div key={`fantasma-${i}`} className="grilla-juegos__fantasma" aria-hidden="true" />
        ))}
    </div>
  )
}
