import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GameCover from '../../components/games/GameCover.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import Input from '../../components/ui/Input.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PantallaDeCarga from '../../components/ui/PantallaDeCarga.jsx'
import * as collectionsService from '../../services/collections.service.js'
import * as libraryService from '../../services/library.service.js'
import { obtenerMensajeDeError, obtenerErroresDeCampos } from '../../api/backendClient.js'
import { formatearFecha } from '../../utils/formatters.js'
import './CollectionDetail.css'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [coleccion, setColeccion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(null)

  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [erroresForm, setErroresForm] = useState({})

  // Panel para agregar juegos desde la biblioteca
  const [agregando, setAgregando] = useState(false)
  const [biblioteca, setBiblioteca] = useState(null)

  const recargar = async () => setColeccion(await collectionsService.obtenerColeccion(id))

  useEffect(() => {
    setCargando(true)
    collectionsService
      .obtenerColeccion(id)
      .then(setColeccion)
      .catch((err) => setErrorCarga(obtenerMensajeDeError(err)))
      .finally(() => setCargando(false))
  }, [id])

  const abrirAgregar = async () => {
    setAgregando((v) => !v)
    if (biblioteca === null) {
      try {
        const datos = await libraryService.obtenerBiblioteca({ orden: 'titulo' })
        setBiblioteca(datos.juegos)
      } catch (err) {
        setError(obtenerMensajeDeError(err))
      }
    }
  }

  const ejecutar = async (clave, accion) => {
    setOcupado(clave)
    setError('')
    try {
      await accion()
    } catch (err) {
      setError(obtenerMensajeDeError(err))
    } finally {
      setOcupado(null)
    }
  }

  const agregar = (juego) =>
    ejecutar(`agregar-${juego.idExterno}`, async () => {
      await collectionsService.agregarJuegoAColeccion(id, juego.idExterno)
      await recargar()
    })

  const quitar = (juego) =>
    ejecutar(`quitar-${juego.idExterno}`, async () => {
      await collectionsService.quitarJuegoDeColeccion(id, juego.idExterno)
      setColeccion((c) => ({
        ...c,
        cantidadJuegos: c.cantidadJuegos - 1,
        juegos: c.juegos.filter((j) => j.idExterno !== juego.idExterno),
      }))
    })

  const empezarEdicion = () => {
    setForm({ nombre: coleccion.nombre, descripcion: coleccion.descripcion || '' })
    setErroresForm({})
    setEditando(true)
  }

  const guardarEdicion = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setErroresForm({ nombre: 'El nombre es obligatorio' })
      return
    }
    setOcupado('editar')
    try {
      const actualizada = await collectionsService.actualizarColeccion(id, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
      })
      setColeccion((c) => ({ ...c, nombre: actualizada.nombre, descripcion: actualizada.descripcion }))
      setEditando(false)
    } catch (err) {
      const campos = obtenerErroresDeCampos(err)
      if (Object.keys(campos).length > 0) setErroresForm(campos)
      else setError(obtenerMensajeDeError(err))
    } finally {
      setOcupado(null)
    }
  }

  const borrar = () => {
    if (!window.confirm(`¿Borrar la colección «${coleccion.nombre}»? Los juegos siguen en tu biblioteca.`)) return
    ejecutar('borrar', async () => {
      await collectionsService.borrarColeccion(id)
      navigate('/colecciones', { replace: true })
    })
  }

  if (cargando) return <PantallaDeCarga />

  if (errorCarga) {
    return (
      <div className="coleccion">
        <Alert>{errorCarga}</Alert>
        <Link to="/colecciones" className="coleccion__volver">
          ← Volver a Colecciones
        </Link>
      </div>
    )
  }

  const idsEnColeccion = new Set(coleccion.juegos.map((j) => j.idExterno))
  const disponibles = (biblioteca || []).filter((j) => !idsEnColeccion.has(j.idExterno))

  return (
    <div className="coleccion">
      <Link to="/colecciones" className="coleccion__volver">
        ← Colecciones
      </Link>

      <section className="coleccion__cabecera">
        {editando ? (
          <form className="coleccion__editar" onSubmit={guardarEdicion} noValidate>
            <Input
              label="Nombre"
              value={form.nombre}
              maxLength={80}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              error={erroresForm.nombre}
            />
            <Input
              label="Descripción"
              value={form.descripcion}
              maxLength={300}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              error={erroresForm.descripcion}
            />
            <div className="coleccion__acciones">
              <Button type="submit" variante="negro" cargando={ocupado === 'editar'}>
                Guardar
              </Button>
              <Button type="button" variante="borde-oscuro" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="coleccion__textos">
              <span className="coleccion__etiqueta">COLECCIÓN</span>
              <h1 className="page-title">{coleccion.nombre}</h1>
              {coleccion.descripcion && <p className="coleccion__descripcion">{coleccion.descripcion}</p>}
              <span className="coleccion__meta">
                {coleccion.cantidadJuegos} {coleccion.cantidadJuegos === 1 ? 'juego' : 'juegos'} · creada el{' '}
                {formatearFecha(coleccion.creadoEn.slice(0, 10))}
              </span>
            </div>
            <div className="coleccion__acciones">
              <Button variante="negro" onClick={abrirAgregar} aria-expanded={agregando}>
                {agregando ? 'Listo' : '+ Agregar juegos'}
              </Button>
              <Button variante="borde-oscuro" onClick={empezarEdicion}>
                Renombrar
              </Button>
              <Button variante="borde-oscuro" onClick={borrar} cargando={ocupado === 'borrar'}>
                Borrar colección
              </Button>
            </div>
          </>
        )}

        <Alert>{error}</Alert>

        {agregando && (
          <div className="coleccion__agregar">
            <h2>Juegos de tu biblioteca</h2>
            {biblioteca === null ? (
              <p className="coleccion__meta">Cargando...</p>
            ) : disponibles.length === 0 ? (
              <p className="coleccion__meta">
                {biblioteca.length === 0
                  ? 'Tu biblioteca está vacía. Agregá juegos desde Explorar.'
                  : 'Ya agregaste todos los juegos de tu biblioteca.'}
              </p>
            ) : (
              <ul className="coleccion__disponibles">
                {disponibles.map((j) => (
                  <li key={j.idExterno}>
                    <GameCover titulo={j.titulo} portadaUrl={j.portadaUrl} className="coleccion__mini" />
                    <span>{j.titulo}</span>
                    <Button
                      variante="negro"
                      onClick={() => agregar(j)}
                      cargando={ocupado === `agregar-${j.idExterno}`}
                      aria-label={`Agregar ${j.titulo} a la colección`}
                    >
                      Agregar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {coleccion.juegos.length === 0 ? (
          <EmptyState titulo="Esta colección está vacía">
            Tocá «Agregar juegos» o agregalos desde el detalle de cualquier juego.
          </EmptyState>
        ) : (
          <ul className="coleccion__juegos">
            {coleccion.juegos.map((j) => (
              <li key={j.idExterno} className={ocupado === `quitar-${j.idExterno}` ? 'coleccion__juego coleccion__juego--ocupado' : 'coleccion__juego'}>
                <Link to={`/juego/${j.idExterno}`}>
                  <GameCover titulo={j.titulo} portadaUrl={j.portadaUrl} />
                </Link>
                <div className="coleccion__juego-pie">
                  <Link to={`/juego/${j.idExterno}`} className="coleccion__juego-titulo">
                    {j.titulo}
                  </Link>
                  <button type="button" onClick={() => quitar(j)} disabled={Boolean(ocupado)}>
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
