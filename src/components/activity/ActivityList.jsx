import { Link } from 'react-router-dom'
import { describirActividad } from '../../utils/actividad.js'
import { tiempoRelativo } from '../../utils/formatters.js'
import './ActivityList.css'

export default function ActivityList({ actividad, vacio = 'Todavía no hay actividad' }) {
  if (actividad.length === 0) return <p className="actividad__vacia">{vacio}</p>

  return (
    <ul className="actividad">
      {actividad.map((a) => (
        <li key={a.id} className="actividad__item">
          <span className="actividad__punto" aria-hidden="true" />
          <div className="actividad__textos">
            {a.juego ? (
              <Link to={`/juego/${a.juego.idExterno}`} className="actividad__texto">
                {describirActividad(a)}
              </Link>
            ) : (
              <span className="actividad__texto">{describirActividad(a)}</span>
            )}
            <time className="actividad__fecha" dateTime={a.creadoEn}>
              {tiempoRelativo(a.creadoEn)}
            </time>
          </div>
        </li>
      ))}
    </ul>
  )
}
