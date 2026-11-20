import { Link } from 'react-router-dom'
import GameCover from './GameCover.jsx'
import { obtenerAnio, unirConPuntos } from '../../utils/formatters.js'
import './GameCard.css'

export default function GameCard({ juego }) {
  const detalle = [obtenerAnio(juego.fechaLanzamiento), unirConPuntos(juego.generos, 2)]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link to={`/juego/${juego.idExterno}`} className="tarjeta-juego">
      <GameCover titulo={juego.titulo} portadaUrl={juego.portadaUrl} className="tarjeta-juego__portada" />
      <div className="tarjeta-juego__cuerpo">
        <span className="tarjeta-juego__titulo">{juego.titulo}</span>
        <span className="tarjeta-juego__detalle">{detalle}</span>
        {juego.plataformas.length > 0 && (
          <span className="tarjeta-juego__plataformas">{unirConPuntos(juego.plataformas, 3)}</span>
        )}
      </div>
    </Link>
  )
}
