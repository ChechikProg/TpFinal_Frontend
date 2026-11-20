import { GAME_STATUS_LABELS } from '../../utils/constants.js'
import './StatusSelector.css'

// Botonera con los 4 estados. El activo se pinta de celeste.
export default function StatusSelector({ valor, onCambiar, deshabilitado = false }) {
  return (
    <div className="selector-estado" role="radiogroup" aria-label="Estado del juego">
      {Object.entries(GAME_STATUS_LABELS).map(([estado, etiqueta]) => (
        <button
          key={estado}
          type="button"
          role="radio"
          aria-checked={valor === estado}
          className={valor === estado ? 'selector-estado__opcion selector-estado__opcion--activa' : 'selector-estado__opcion'}
          onClick={() => valor !== estado && onCambiar(estado)}
          disabled={deshabilitado}
        >
          {etiqueta}
        </button>
      ))}
    </div>
  )
}
