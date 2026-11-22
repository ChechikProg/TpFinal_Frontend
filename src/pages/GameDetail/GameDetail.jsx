import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GameCover from '../../components/games/GameCover.jsx'
import StatusSelector from '../../components/games/StatusSelector.jsx'
import GameReviews from '../../components/games/GameReviews.jsx'
import GameCollections from '../../components/games/GameCollections.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import HeartIcon from '../../components/ui/HeartIcon.jsx'
import PantallaDeCarga from '../../components/ui/PantallaDeCarga.jsx'
import { obtenerJuego } from '../../services/games.service.js'
import * as libraryService from '../../services/library.service.js'
import * as favoritesService from '../../services/favorites.service.js'
import { obtenerMensajeDeError } from '../../api/backendClient.js'
import { formatearFecha, obtenerAnio } from '../../utils/formatters.js'
import './GameDetail.css'

export default function GameDetail() {
  const { id } = useParams()
  const idExterno = Number(id)
  const navigate = useNavigate()

  const [juego, setJuego] = useState(null)
  const [item, setItem] = useState(null) // el juego en mi biblioteca (o null)
  const [esFavorito, setEsFavorito] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorAccion, setErrorAccion] = useState('')
  const [guardando, setGuardando] = useState('') // qué acción se está guardando
  const [descripcionCompleta, setDescripcionCompleta] = useState(false)
  const [horas, setHoras] = useState('')

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError('')
    setErrorAccion('')
    setJuego(null)

    // Pedimos todo en paralelo: datos del juego, si está en la biblioteca y si es favorito
    Promise.all([
      obtenerJuego(idExterno),
      libraryService.obtenerItem(idExterno),
      favoritesService.esFavorito(idExterno),
    ])
      .then(([datosJuego, datosItem, favorito]) => {
        if (cancelado) return
        setJuego(datosJuego)
        setItem(datosItem)
        setHoras(datosItem ? String(datosItem.horasJugadas) : '')
        setEsFavorito(favorito)
      })
      .catch((err) => !cancelado && setError(obtenerMensajeDeError(err)))
      .finally(() => !cancelado && setCargando(false))

    return () => {
      cancelado = true
    }
  }, [idExterno])

  // Ejecuta una acción mostrando "guardando" y el error si falla
  const ejecutar = async (nombre, accion) => {
    setGuardando(nombre)
    setErrorAccion('')
    try {
      await accion()
    } catch (err) {
      setErrorAccion(obtenerMensajeDeError(err))
    } finally {
      setGuardando('')
    }
  }

  const agregarABiblioteca = () =>
    ejecutar('biblioteca', async () => {
      const nuevo = await libraryService.agregarJuego(idExterno)
      setItem(nuevo)
      setHoras(String(nuevo.horasJugadas))
    })

  const quitarDeBiblioteca = () =>
    ejecutar('biblioteca', async () => {
      await libraryService.quitarJuego(idExterno)
      setItem(null)
      setHoras('')
    })

  const cambiarEstado = (estado) =>
    ejecutar('estado', async () => {
      setItem(await libraryService.actualizarJuego(idExterno, { estado }))
    })

  const guardarHoras = (e) => {
    e.preventDefault()
    const valor = Number(horas)
    if (horas === '' || Number.isNaN(valor) || valor < 0) {
      setErrorAccion('Las horas tienen que ser un número mayor o igual a 0')
      return
    }
    ejecutar('horas', async () => {
      const actualizado = await libraryService.actualizarJuego(idExterno, { horasJugadas: valor })
      setItem(actualizado)
      setHoras(String(actualizado.horasJugadas))
    })
  }

  const alternarFavorito = () =>
    ejecutar('favorito', async () => {
      if (esFavorito) await favoritesService.quitarFavorito(idExterno)
      else await favoritesService.agregarFavorito(idExterno)
      setEsFavorito(!esFavorito)
    })

  if (cargando) return <PantallaDeCarga />

  if (error) {
    return (
      <div className="detalle">
        <Alert>{error}</Alert>
        <Link to="/explorar" className="detalle__volver">
          ← Volver a Explorar
        </Link>
      </div>
    )
  }

  const subtitulo = [juego.desarrolladores[0], obtenerAnio(juego.fechaLanzamiento)]
    .filter(Boolean)
    .join(' · ')

  const metadatos = [
    { etiqueta: 'Lanzamiento', valor: formatearFecha(juego.fechaLanzamiento) },
    { etiqueta: 'Plataformas', valor: juego.plataformasDetalle.join(', ') || '—' },
    { etiqueta: 'Desarrollador', valor: juego.desarrolladores.join(', ') || '—' },
    { etiqueta: 'Editor', valor: juego.editores.join(', ') || '—' },
    { etiqueta: 'Duración media', valor: juego.duracionPromedio ? `${juego.duracionPromedio} h` : '—' },
    { etiqueta: 'Metacritic', valor: juego.metacritic ?? '—' },
    { etiqueta: 'Clasificación', valor: juego.clasificacion || '—' },
  ]

  const descripcionLarga = juego.descripcion.length > 600

  return (
    <div className="detalle">
      <button type="button" className="detalle__volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detalle__contenido">
        <aside className="detalle__lateral">
          <GameCover titulo={juego.titulo} portadaUrl={juego.portadaUrl} className="detalle__portada" />

          {item ? (
            <Button variante="secundario" anchoCompleto cargando={guardando === 'biblioteca'} onClick={quitarDeBiblioteca}>
              Quitar de la biblioteca
            </Button>
          ) : (
            <Button anchoCompleto cargando={guardando === 'biblioteca'} onClick={agregarABiblioteca}>
              + Agregar a biblioteca
            </Button>
          )}

          <Button
            variante="secundario"
            anchoCompleto
            cargando={guardando === 'favorito'}
            onClick={alternarFavorito}
            aria-pressed={esFavorito}
          >
            <HeartIcon lleno={esFavorito} />
            {esFavorito ? 'En favoritos' : 'Marcar como favorito'}
          </Button>
        </aside>

        <section className="detalle__info">
          <div className="detalle__encabezado">
            <h1 className="page-title">{juego.titulo}</h1>
            {subtitulo && <p className="detalle__subtitulo">{subtitulo}</p>}
          </div>

          {juego.generos.length > 0 && (
            <ul className="detalle__etiquetas">
              {juego.generos.map((genero) => (
                <li key={genero} className="detalle__etiqueta">
                  {genero}
                </li>
              ))}
            </ul>
          )}

          {juego.descripcion && (
            <div>
              <p className={descripcionCompleta ? 'detalle__descripcion' : 'detalle__descripcion detalle__descripcion--corta'}>
                {juego.descripcion}
              </p>
              {descripcionLarga && (
                <button
                  type="button"
                  className="detalle__ver-mas"
                  onClick={() => setDescripcionCompleta((v) => !v)}
                >
                  {descripcionCompleta ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}

          <dl className="detalle__metadatos">
            {metadatos.map((dato) => (
              <div key={dato.etiqueta} className="detalle__dato">
                <dt>{dato.etiqueta}</dt>
                <dd>{dato.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="detalle__panel">
            <h2 className="detalle__panel-titulo">Tu estado</h2>
            <Alert>{errorAccion}</Alert>

            {item ? (
              <>
                <StatusSelector
                  valor={item.estado}
                  onCambiar={cambiarEstado}
                  deshabilitado={guardando === 'estado'}
                />
                <form className="detalle__horas" onSubmit={guardarHoras}>
                  <label htmlFor="horas-jugadas">Horas jugadas</label>
                  <input
                    id="horas-jugadas"
                    type="number"
                    min="0"
                    step="0.5"
                    value={horas}
                    onChange={(e) => setHoras(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variante="secundario"
                    cargando={guardando === 'horas'}
                    disabled={String(item.horasJugadas) === horas}
                  >
                    Guardar
                  </Button>
                </form>
              </>
            ) : (
              <p className="detalle__aviso">
                Agregá el juego a tu biblioteca para elegir su estado y registrar las horas jugadas.
              </p>
            )}
          </div>

          <GameCollections idExterno={idExterno} />
          <GameReviews idExterno={idExterno} titulo={juego.titulo} />
        </section>
      </div>
    </div>
  )
}
