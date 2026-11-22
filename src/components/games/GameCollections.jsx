import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../ui/Alert.jsx'
import * as collectionsService from '../../services/collections.service.js'
import { obtenerMensajeDeError } from '../../api/backendClient.js'
import './GameCollections.css'

// Lista mis colecciones con un tilde para agregar o quitar este juego
export default function GameCollections({ idExterno }) {
  const [colecciones, setColecciones] = useState(null)
  const [ocupada, setOcupada] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelado = false
    collectionsService
      .obtenerColecciones(idExterno)
      .then((datos) => !cancelado && setColecciones(datos))
      .catch((err) => !cancelado && setError(obtenerMensajeDeError(err)))
    return () => {
      cancelado = true
    }
  }, [idExterno])

  const alternar = async (coleccion) => {
    setOcupada(coleccion.id)
    setError('')
    try {
      if (coleccion.contieneJuego) await collectionsService.quitarJuegoDeColeccion(coleccion.id, idExterno)
      else await collectionsService.agregarJuegoAColeccion(coleccion.id, idExterno)
      setColecciones((lista) =>
        lista.map((c) =>
          c.id === coleccion.id
            ? {
                ...c,
                contieneJuego: !c.contieneJuego,
                cantidadJuegos: c.cantidadJuegos + (c.contieneJuego ? -1 : 1),
              }
            : c
        )
      )
    } catch (err) {
      setError(obtenerMensajeDeError(err))
    } finally {
      setOcupada(null)
    }
  }

  return (
    <div className="detalle__panel">
      <h2 className="detalle__panel-titulo">Colecciones</h2>
      <Alert>{error}</Alert>
      {colecciones === null ? null : colecciones.length === 0 ? (
        <p className="detalle__aviso">
          Todavía no tenés colecciones. <Link to="/colecciones">Creá una</Link> para organizar tus juegos.
        </p>
      ) : (
        <ul className="colecciones-juego">
          {colecciones.map((c) => (
            <li key={c.id}>
              <label className={ocupada === c.id ? 'colecciones-juego__item colecciones-juego__item--ocupada' : 'colecciones-juego__item'}>
                <input
                  type="checkbox"
                  checked={c.contieneJuego}
                  onChange={() => alternar(c)}
                  disabled={ocupada === c.id}
                />
                <span className="colecciones-juego__nombre">{c.nombre}</span>
                <span className="colecciones-juego__cantidad">
                  {c.cantidadJuegos} {c.cantidadJuegos === 1 ? 'juego' : 'juegos'}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
