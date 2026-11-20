import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GameCover from '../../components/games/GameCover.jsx'
import StatusBadge from '../../components/games/StatusBadge.jsx'
import Chip from '../../components/ui/Chip.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import HeartIcon from '../../components/ui/HeartIcon.jsx'
import * as libraryService from '../../services/library.service.js'
import * as favoritesService from '../../services/favorites.service.js'
import { obtenerMensajeDeError } from '../../api/backendClient.js'
import { GAME_STATUS_LABELS } from '../../utils/constants.js'
import { unirConPuntos } from '../../utils/formatters.js'
import './Library.css'

const ORDENES = [
  { id: 'recientes', nombre: 'Agregados recientemente' },
  { id: 'titulo', nombre: 'Nombre (A-Z)' },
  { id: 'puntaje', nombre: 'Mi puntuación' },
  { id: 'horas', nombre: 'Horas jugadas' },
]

const OPCIONES_ESTADO = Object.entries(GAME_STATUS_LABELS).map(([id, nombre]) => ({ id, nombre }))

export default function Library() {
  const [estado, setEstado] = useState('') // '' = todos
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const [orden, setOrden] = useState('recientes')

  const [juegos, setJuegos] = useState([])
  const [conteo, setConteo] = useState({ quiero_jugar: 0, jugando: 0, terminado: 0, abandonado: 0 })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(null) // idExterno que se está guardando

  const cargar = useCallback(async () => {
    setError('')
    try {
      const datos = await libraryService.obtenerBiblioteca({ estado, soloFavoritos, orden })
      setJuegos(datos.juegos)
      setConteo(datos.conteo)
    } catch (err) {
      setError(obtenerMensajeDeError(err))
    } finally {
      setCargando(false)
    }
  }, [estado, soloFavoritos, orden])

  useEffect(() => {
    setCargando(true)
    cargar()
  }, [cargar])

  // Aplica un cambio y recarga la lista (así los contadores y filtros quedan bien)
  const modificar = async (idExterno, accion) => {
    setOcupado(idExterno)
    setError('')
    try {
      await accion()
      await cargar()
    } catch (err) {
      setError(obtenerMensajeDeError(err))
    } finally {
      setOcupado(null)
    }
  }

  const cambiarEstado = (juego, nuevoEstado) =>
    modificar(juego.idExterno, () => libraryService.actualizarJuego(juego.idExterno, { estado: nuevoEstado }))

  const alternarFavorito = (juego) =>
    modificar(juego.idExterno, () =>
      juego.esFavorito
        ? favoritesService.quitarFavorito(juego.idExterno)
        : favoritesService.agregarFavorito(juego.idExterno)
    )

  const quitar = (juego) => {
    if (!window.confirm(`¿Quitar ${juego.titulo} de tu biblioteca?`)) return
    modificar(juego.idExterno, () => libraryService.quitarJuego(juego.idExterno))
  }

  const total = Object.values(conteo).reduce((suma, n) => suma + n, 0)
  const pestanas = [{ id: '', nombre: 'Todos', cantidad: total }].concat(
    OPCIONES_ESTADO.map((o) => ({ ...o, cantidad: conteo[o.id] }))
  )

  return (
    <div className="biblioteca">
      <div className="biblioteca__encabezado">
        <h1 className="page-title">Biblioteca</h1>
        <Link to="/explorar">
          <Button tabIndex={-1}>+ Agregar juego</Button>
        </Link>
      </div>

      <div className="biblioteca__pestanas" role="tablist">
        {pestanas.map((p) => (
          <button
            key={p.id || 'todos'}
            role="tab"
            aria-selected={estado === p.id}
            className={estado === p.id ? 'biblioteca__pestana biblioteca__pestana--activa' : 'biblioteca__pestana'}
            onClick={() => setEstado(p.id)}
          >
            {p.nombre} <span className="biblioteca__contador">{p.cantidad}</span>
          </button>
        ))}
      </div>

      <div className="biblioteca__filtros">
        <Chip activo={soloFavoritos} onClick={() => setSoloFavoritos((v) => !v)}>
          <HeartIcon lleno={soloFavoritos} tamano={16} /> Solo favoritos
        </Chip>
        <Select label="Ordenar" opciones={ORDENES} value={orden} onChange={(e) => setOrden(e.target.value)} />
      </div>

      <Alert>{error}</Alert>

      {cargando ? (
        <div className="biblioteca__cargando" aria-label="Cargando" />
      ) : juegos.length === 0 ? (
        total === 0 ? (
          <EmptyState titulo="Tu biblioteca está vacía">
            Buscá juegos en <Link to="/explorar">Explorar</Link> y agregalos para seguir tu progreso.
          </EmptyState>
        ) : (
          <EmptyState titulo="No hay juegos con estos filtros">Probá con otro estado o sacá el filtro de favoritos.</EmptyState>
        )
      ) : (
        <ul className="biblioteca__lista">
          <li className="biblioteca__fila biblioteca__fila--encabezado" aria-hidden="true">
            <span>Juego</span>
            <span>Estado</span>
            <span>Puntuación</span>
            <span>Horas</span>
            <span>Fav.</span>
            <span />
          </li>
          {juegos.map((juego) => (
            <li key={juego.idExterno} className={ocupado === juego.idExterno ? 'biblioteca__fila biblioteca__fila--ocupada' : 'biblioteca__fila'}>
              <Link to={`/juego/${juego.idExterno}`} className="biblioteca__juego">
                <GameCover titulo={juego.titulo} portadaUrl={juego.portadaUrl} className="biblioteca__portada" />
                <div className="biblioteca__textos">
                  <span className="biblioteca__titulo">{juego.titulo}</span>
                  <span className="biblioteca__generos">{unirConPuntos(juego.generos, 2)}</span>
                </div>
              </Link>

              <div className="biblioteca__estado">
                <StatusBadge estado={juego.estado} />
                <select
                  aria-label={`Cambiar estado de ${juego.titulo}`}
                  value={juego.estado}
                  onChange={(e) => cambiarEstado(juego, e.target.value)}
                  disabled={ocupado === juego.idExterno}
                >
                  {OPCIONES_ESTADO.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {juego.puntaje ? (
                <span className="biblioteca__puntaje" aria-label={`${juego.puntaje} de 5 estrellas`}>
                  {'★'.repeat(juego.puntaje)}
                  {'☆'.repeat(5 - juego.puntaje)}
                </span>
              ) : (
                <span className="biblioteca__puntaje biblioteca__puntaje--vacio">Sin puntuar</span>
              )}

              <span className="biblioteca__horas">{juego.horasJugadas} h</span>

              <button
                type="button"
                className="biblioteca__icono"
                onClick={() => alternarFavorito(juego)}
                disabled={ocupado === juego.idExterno}
                aria-label={juego.esFavorito ? `Quitar ${juego.titulo} de favoritos` : `Marcar ${juego.titulo} como favorito`}
                aria-pressed={juego.esFavorito}
              >
                <HeartIcon lleno={juego.esFavorito} />
              </button>

              <button
                type="button"
                className="biblioteca__icono biblioteca__quitar"
                onClick={() => quitar(juego)}
                disabled={ocupado === juego.idExterno}
                aria-label={`Quitar ${juego.titulo} de la biblioteca`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
