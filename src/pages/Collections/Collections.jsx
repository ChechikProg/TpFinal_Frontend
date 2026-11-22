import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CollectionMosaic from '../../components/games/CollectionMosaic.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import * as collectionsService from '../../services/collections.service.js'
import { obtenerMensajeDeError, obtenerErroresDeCampos } from '../../api/backendClient.js'
import './Collections.css'

export default function Collections() {
  const [colecciones, setColecciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [erroresForm, setErroresForm] = useState({})
  const [creando, setCreando] = useState(false)
  const [borrando, setBorrando] = useState(null)

  useEffect(() => {
    collectionsService
      .obtenerColecciones()
      .then(setColecciones)
      .catch((err) => setError(obtenerMensajeDeError(err)))
      .finally(() => setCargando(false))
  }, [])

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErroresForm((er) => ({ ...er, [name]: undefined }))
  }

  const crear = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setErroresForm({ nombre: 'Poné un nombre para la colección' })
      return
    }
    setCreando(true)
    setError('')
    try {
      const nueva = await collectionsService.crearColeccion({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
      })
      setColecciones((lista) => [nueva, ...lista])
      setForm({ nombre: '', descripcion: '' })
    } catch (err) {
      const campos = obtenerErroresDeCampos(err)
      if (Object.keys(campos).length > 0) setErroresForm(campos)
      else setError(obtenerMensajeDeError(err))
    } finally {
      setCreando(false)
    }
  }

  const borrar = async (coleccion) => {
    if (!window.confirm(`¿Borrar la colección «${coleccion.nombre}»? Los juegos siguen en tu biblioteca.`)) return
    setBorrando(coleccion.id)
    setError('')
    try {
      await collectionsService.borrarColeccion(coleccion.id)
      setColecciones((lista) => lista.filter((c) => c.id !== coleccion.id))
    } catch (err) {
      setError(obtenerMensajeDeError(err))
    } finally {
      setBorrando(null)
    }
  }

  return (
    <div className="colecciones">
      <h1 className="page-title">Colecciones</h1>

      <form className="colecciones__crear" onSubmit={crear} noValidate>
        <Input
          label="Nombre de la nueva colección"
          name="nombre"
          value={form.nombre}
          onChange={manejarCambio}
          error={erroresForm.nombre}
          maxLength={80}
          placeholder="Ej: Co-op con amigos"
        />
        <Input
          label="Descripción (opcional)"
          name="descripcion"
          value={form.descripcion}
          onChange={manejarCambio}
          error={erroresForm.descripcion}
          maxLength={300}
        />
        <Button type="submit" cargando={creando}>
          + Crear colección
        </Button>
      </form>

      <Alert>{error}</Alert>

      {cargando ? null : colecciones.length === 0 ? (
        <EmptyState titulo="Todavía no tenés colecciones">
          Creá una para agrupar tus juegos como quieras: por género, para jugar con amigos, pendientes del verano...
        </EmptyState>
      ) : (
        <ul className="colecciones__grilla">
          {colecciones.map((c) => (
            <li key={c.id} className={borrando === c.id ? 'tarjeta-coleccion tarjeta-coleccion--borrando' : 'tarjeta-coleccion'}>
              <Link to={`/colecciones/${c.id}`} className="tarjeta-coleccion__link">
                <CollectionMosaic portadas={c.portadas} nombre={c.nombre} />
                <div className="tarjeta-coleccion__textos">
                  <span className="tarjeta-coleccion__nombre">{c.nombre}</span>
                  <span className="tarjeta-coleccion__cantidad">
                    {c.cantidadJuegos} {c.cantidadJuegos === 1 ? 'juego' : 'juegos'}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                className="tarjeta-coleccion__borrar"
                onClick={() => borrar(c)}
                disabled={borrando === c.id}
                aria-label={`Borrar la colección ${c.nombre}`}
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
