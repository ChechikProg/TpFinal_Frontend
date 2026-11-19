import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import PantallaDeCarga from '../components/ui/PantallaDeCarga.jsx'

// Login y registro: si ya hay sesión, manda al inicio.
export default function PublicRoute() {
  const { estaAutenticado, cargando } = useAuth()

  if (cargando) return <PantallaDeCarga />
  if (estaAutenticado) return <Navigate to="/" replace />

  return <Outlet />
}
