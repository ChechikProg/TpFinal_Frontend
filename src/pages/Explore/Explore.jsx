import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GameGrid from '../../components/games/GameGrid.jsx'
import Chip from '../../components/ui/Chip.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { useDebounce } from '../../hooks/useDebounce.js'
import { buscarJuegos, obtenerGeneros } from '../../services/games.service.js'
import { obtenerMensajeDeError } from '../../api/backendClient.js'
import { PLATAFORMAS, ORDENES } from '../../utils/constants.js'
import './Explore.css'

export default function Explore() {
  // Los filtros viven en la URL (?q=...&genero=...), así se pueden compartir
  // y se mantienen al volver desde el detalle de un juego.
  const [searchParams, setSearchParams] = useSearchParams()
  const genero = searchParams.get('genero') || ''
  const plataforma = searchParams.get('plataforma') || ''
  const orden = searchParams.get('orden') || ''

  const [texto, setTexto] = useState(searchParams.get('q') || '')
  const textoBuscado = useDebounce(texto)

  const [generos, setGeneros] = useState([])
  const [juegos, setJuegos] = useState([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [hayMas, setHayMas] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cambiarFiltro = (clave, valor) => {
    const nuevos = new URLSearchParams(searchParams)
    if (valor) nuevos.set(clave, valor)
    else nuevos.delete(clave)
    setSearchParams(nuevos, { replace: true })
  }

  // Pasamos el texto (ya "debounceado") a la URL
  useEffect(() => {
    cambiarFiltro('q', textoBuscado.trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textoBuscado])

  useEffect(() => {
    obtenerGeneros()
      .then(setGeneros)
      .catch(() => setGeneros([]))
  }, [])

  // Cada vez que cambia un filtro, volvemos a la página 1
  const q = searchParams.get('q') || ''
  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError('')
    setJuegos([])
    setPagina(1)

    buscarJuegos({ texto: q, genero, plataforma, orden, pagina: 1 })
      .then((resultado) => {
        if (cancelado) return
        setJuegos(resultado.juegos)
        setTotal(resultado.total)
        setHayMas(resultado.hayMas)
      })
      .catch((err) => !cancelado && setError(obtenerMensajeDeError(err)))
      .finally(() => !cancelado && setCargando(false))

    // Si cambian los filtros antes de que llegue la respuesta, la ignoramos
    return () => {
      cancelado = true
    }
  }, [q, genero, plataforma, orden])

  const cargarMas = async () => {
    const siguiente = pagina + 1
    setCargando(true)
    setError('')
    try {
      const resultado = await buscarJuegos({ texto: q, genero, plataforma, orden, pagina: siguiente })
      // Evitamos duplicados si la API repite algún juego entre páginas
      setJuegos((actuales) => {
        const ids = new Set(actuales.map((j) => j.idExterno))
        return [...actuales, ...resultado.juegos.filter((j) => !ids.has(j.idExterno))]
      })
      setHayMas(resultado.hayMas)
      setPagina(siguiente)
    } catch (err) {
      setError(obtenerMensajeDeError(err))
    } finally {
      setCargando(false)
    }
  }

  const sinResultados = !cargando && !error && juegos.length === 0

  return (
    <div className="explorar">
      <h1 className="page-title">Explorar</h1>

      <div className="explorar__buscador">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Buscar juegos por nombre"
          aria-label="Buscar juegos"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      <div className="explorar__filtros">
        <div className="explorar__generos" role="group" aria-label="Filtrar por género">
          <Chip activo={!genero} onClick={() => cambiarFiltro('genero', '')}>
            Todos
          </Chip>
          {generos.map((g) => (
            <Chip key={g.slug} activo={genero === g.slug} onClick={() => cambiarFiltro('genero', g.slug)}>
              {g.nombre}
            </Chip>
          ))}
        </div>

        <div className="explorar__selects">
          <Select
            label="Plataforma"
            opciones={PLATAFORMAS}
            value={plataforma}
            onChange={(e) => cambiarFiltro('plataforma', e.target.value)}
          />
          <Select
            label="Ordenar por"
            opciones={ORDENES}
            value={orden}
            onChange={(e) => cambiarFiltro('orden', e.target.value)}
          />
        </div>
      </div>

      {!cargando && !error && juegos.length > 0 && (
        <p className="explorar__total">
          {total.toLocaleString('es-AR')} resultados{q && ` para «${q}»`}
        </p>
      )}

      <Alert>{error}</Alert>

      {sinResultados && (
        <EmptyState titulo="No encontramos juegos">
          Probá con otro nombre o sacá algún filtro.
        </EmptyState>
      )}

      <GameGrid juegos={juegos} cargando={cargando} />

      {hayMas && !cargando && (
        <div className="explorar__mas">
          <Button variante="secundario" onClick={cargarMas}>
            Cargar más
          </Button>
        </div>
      )}
    </div>
  )
}
