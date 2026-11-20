import { useState } from 'react'
import { urlDePortada } from '../../utils/formatters.js'
import './GameCover.css'

// Portada del juego. Si no hay imagen (o falla), muestra el título como en el Figma.
export default function GameCover({ titulo, portadaUrl, className = '' }) {
  const [fallo, setFallo] = useState(false)
  const mostrarImagen = portadaUrl && !fallo

  return (
    <div className={`portada ${className}`}>
      {mostrarImagen ? (
        <img
          src={urlDePortada(portadaUrl)}
          alt={`Portada de ${titulo}`}
          loading="lazy"
          onError={() => setFallo(true)}
        />
      ) : (
        <span className="portada__titulo">{titulo}</span>
      )}
    </div>
  )
}
