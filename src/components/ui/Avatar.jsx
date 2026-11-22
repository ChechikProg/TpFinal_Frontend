import { useState } from 'react'
import { obtenerIniciales } from '../../utils/formatters.js'
import './Avatar.css'

export default function Avatar({ usuario, tamano = 40 }) {
  const [fallo, setFallo] = useState(false)
  const texto = usuario?.nombre || usuario?.nombreUsuario || ''
  const estilo = { width: tamano, height: tamano, fontSize: Math.round(tamano * 0.36) }

  return (
    <span className="avatar" style={estilo}>
      {usuario?.avatarUrl && !fallo ? (
        <img src={usuario.avatarUrl} alt="" onError={() => setFallo(true)} />
      ) : (
        obtenerIniciales(texto)
      )}
    </span>
  )
}
