import { useState } from 'react'
import './StarRating.css'

// Estrellas del 1 al 5. Si recibe onCambiar se puede hacer clic; si no, solo muestra.
export default function StarRating({ valor = 0, onCambiar, tamano = 24, deshabilitado = false }) {
  const [hover, setHover] = useState(0)
  const interactivo = Boolean(onCambiar)
  const mostrado = hover || valor || 0

  if (!interactivo) {
    return (
      <span className="estrellas" role="img" aria-label={`${valor} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Estrella key={n} llena={n <= mostrado} tamano={tamano} />
        ))}
      </span>
    )
  }

  return (
    <div className="estrellas" role="radiogroup" aria-label="Tu puntuación" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
          className="estrellas__boton"
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onCambiar(n)}
          disabled={deshabilitado}
        >
          <Estrella llena={n <= mostrado} tamano={tamano} />
        </button>
      ))}
    </div>
  )
}

function Estrella({ llena, tamano }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"
        fill={llena ? 'var(--color-accent)' : 'var(--color-border-strong)'}
      />
    </svg>
  )
}
