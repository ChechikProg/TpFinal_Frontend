import { useEffect, useState } from 'react'
import StarRating from '../ui/StarRating.jsx'
import Button from '../ui/Button.jsx'
import Alert from '../ui/Alert.jsx'
import Avatar from '../ui/Avatar.jsx'
import * as ratingsService from '../../services/ratings.service.js'
import { obtenerMensajeDeError } from '../../api/backendClient.js'
import { tiempoRelativo } from '../../utils/formatters.js'
import './GameReviews.css'

const MAXIMO = 500

// Puntuación, formulario de reseña y reseñas de todos los usuarios de un juego
export default function GameReviews({ idExterno, titulo }) {
  const [miPuntaje, setMiPuntaje] = useState(null)
  const [resenas, setResenas] = useState([])
  const [texto, setTexto] = useState('')
  const [editando, setEditando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState('')
  const [error, setError] = useState('')

  const miResena = resenas.find((r) => r.esMia)

  const cargar = async () => {
    const datos = await ratingsService.obtenerValoraciones(idExterno)
    setMiPuntaje(datos.miPuntaje)
    setResenas(datos.resenas)
    return datos
  }

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    ratingsService
      .obtenerValoraciones(idExterno)
      .then((datos) => {
        if (cancelado) return
        setMiPuntaje(datos.miPuntaje)
        setResenas(datos.resenas)
        setTexto(datos.resenas.find((r) => r.esMia)?.texto || '')
        setEditando(false)
      })
      .catch((err) => !cancelado && setError(obtenerMensajeDeError(err)))
      .finally(() => !cancelado && setCargando(false))
    return () => {
      cancelado = true
    }
  }, [idExterno])

  const ejecutar = async (nombre, accion) => {
    setGuardando(nombre)
    setError('')
    try {
      await accion()
    } catch (err) {
      setError(obtenerMensajeDeError(err))
    } finally {
      setGuardando('')
    }
  }

  const puntuar = (puntaje) =>
    ejecutar('puntaje', async () => {
      await ratingsService.puntuar(idExterno, puntaje)
      await cargar() // el puntaje también aparece en mi reseña
    })

  const quitarPuntaje = () =>
    ejecutar('puntaje', async () => {
      await ratingsService.quitarPuntaje(idExterno)
      await cargar()
    })

  const publicar = (e) => {
    e.preventDefault()
    if (!texto.trim()) {
      setError('Escribí algo antes de publicar')
      return
    }
    ejecutar('resena', async () => {
      await ratingsService.guardarResena(idExterno, texto.trim())
      const datos = await cargar()
      setTexto(datos.resenas.find((r) => r.esMia)?.texto || '')
      setEditando(false)
    })
  }

  const borrar = () => {
    if (!window.confirm('¿Borrar tu reseña?')) return
    ejecutar('resena', async () => {
      await ratingsService.borrarResena(idExterno)
      await cargar()
      setTexto('')
      setEditando(false)
    })
  }

  if (cargando) return null

  const mostrarFormulario = !miResena || editando

  return (
    <>
      <div className="detalle__panel">
        <div className="resenas__puntaje">
          <h2 className="detalle__panel-titulo">Tu puntuación</h2>
          <div className="resenas__estrellas">
            <StarRating valor={miPuntaje || 0} onCambiar={puntuar} deshabilitado={guardando === 'puntaje'} />
            {miPuntaje && (
              <button type="button" className="resenas__link" onClick={quitarPuntaje} disabled={guardando === 'puntaje'}>
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="detalle__panel">
        <h2 className="detalle__panel-titulo">{miResena ? 'Tu reseña' : 'Escribir reseña'}</h2>
        <Alert>{error}</Alert>

        {mostrarFormulario ? (
          <form className="resenas__form" onSubmit={publicar}>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value.slice(0, MAXIMO))}
              placeholder={`¿Qué te pareció ${titulo}?`}
              aria-label="Tu reseña"
              rows={4}
            />
            <div className="resenas__form-pie">
              <span className={texto.length >= MAXIMO ? 'resenas__contador resenas__contador--limite' : 'resenas__contador'}>
                {texto.length} / {MAXIMO}
              </span>
              <div className="resenas__botones">
                {editando && (
                  <Button
                    type="button"
                    variante="texto"
                    onClick={() => {
                      setTexto(miResena.texto)
                      setEditando(false)
                    }}
                  >
                    Cancelar
                  </Button>
                )}
                <Button type="submit" cargando={guardando === 'resena'} disabled={!texto.trim()}>
                  {miResena ? 'Guardar cambios' : 'Publicar reseña'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="resenas__mia">
            <p className="resenas__texto">{miResena.texto}</p>
            <div className="resenas__botones">
              <Button variante="secundario" onClick={() => setEditando(true)}>
                Editar
              </Button>
              <Button variante="texto" onClick={borrar} cargando={guardando === 'resena'}>
                Borrar
              </Button>
            </div>
          </div>
        )}
      </div>

      <section className="resenas">
        <h2 className="detalle__panel-titulo">
          Reseñas {resenas.length > 0 && <span className="resenas__cantidad">{resenas.length}</span>}
        </h2>
        {resenas.length === 0 ? (
          <p className="detalle__aviso">Todavía nadie reseñó este juego. ¡Sé el primero!</p>
        ) : (
          <ul className="resenas__lista">
            {resenas.map((r) => (
              <li key={r.id} className={r.esMia ? 'resena resena--mia' : 'resena'}>
                <div className="resena__encabezado">
                  <div className="resena__autor">
                    <Avatar usuario={r.autor} tamano={32} />
                    <div>
                      <span className="resena__nombre">
                        {r.autor.nombre || r.autor.nombreUsuario}
                        {r.esMia && <span className="resena__vos"> (vos)</span>}
                      </span>
                      <span className="resena__fecha">
                        @{r.autor.nombreUsuario} · {tiempoRelativo(r.actualizadoEn)}
                      </span>
                    </div>
                  </div>
                  {r.puntaje && <StarRating valor={r.puntaje} tamano={14} />}
                </div>
                <p className="resenas__texto">{r.texto}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
