import { useAuth } from '../../hooks/useAuth.js'

export default function Home() {
  const { usuario } = useAuth()
  return <h1 className="page-title">Hola, {usuario?.nombre || usuario?.nombreUsuario}</h1>
}
