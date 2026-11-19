import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import backendClient from '../api/backendClient.js'
import * as authService from '../services/auth.service.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  // true mientras comprobamos si ya hay una sesión abierta al arrancar la app
  const [cargando, setCargando] = useState(true)
  const [sesionVencida, setSesionVencida] = useState(false)

  // Al arrancar: si la cookie con el token sigue siendo válida, recuperamos el usuario.
  useEffect(() => {
    authService
      .obtenerUsuarioActual()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false))
  }, [])

  // Si cualquier pedido al back responde 401 (token vencido o inválido),
  // cerramos la sesión local para que las rutas privadas manden al login.
  useEffect(() => {
    const interceptor = backendClient.interceptors.response.use(
      (respuesta) => respuesta,
      (error) => {
        const url = error.config?.url || ''
        const esRutaDeAuth = url.startsWith('/auth/')
        if (error.response?.status === 401 && !esRutaDeAuth) {
          setUsuario(null)
          setSesionVencida(true)
        }
        return Promise.reject(error)
      }
    )
    return () => backendClient.interceptors.response.eject(interceptor)
  }, [])

  const iniciarSesion = useCallback(async (datos) => {
    const usuarioLogueado = await authService.iniciarSesion(datos)
    setUsuario(usuarioLogueado)
    setSesionVencida(false)
    return usuarioLogueado
  }, [])

  const registrar = useCallback(async (datos) => {
    const usuarioNuevo = await authService.registrar(datos)
    setUsuario(usuarioNuevo)
    setSesionVencida(false)
    return usuarioNuevo
  }, [])

  const cerrarSesion = useCallback(async () => {
    try {
      await authService.cerrarSesion()
    } finally {
      // Aunque falle el pedido, borramos la sesión local.
      setUsuario(null)
    }
  }, [])

  const actualizarUsuario = useCallback((datos) => {
    setUsuario((actual) => (actual ? { ...actual, ...datos } : actual))
  }, [])

  const valor = useMemo(
    () => ({
      usuario,
      estaAutenticado: Boolean(usuario),
      cargando,
      sesionVencida,
      iniciarSesion,
      registrar,
      cerrarSesion,
      actualizarUsuario,
    }),
    [usuario, cargando, sesionVencida, iniciarSesion, registrar, cerrarSesion, actualizarUsuario]
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
