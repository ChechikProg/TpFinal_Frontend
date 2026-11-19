import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import PantallaDeCarga from '../components/ui/PantallaDeCarga.jsx'

// Rutas privadas: si no hay sesión, manda al login y recuerda a dónde quería ir.
export default function ProtectedRoute() {
  const { estaAutenticado, cargando } = useAuth()
  const location = useLocation()

  if (cargando) return <PantallaDeCarga />
  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  }

  return <Outlet />
}
