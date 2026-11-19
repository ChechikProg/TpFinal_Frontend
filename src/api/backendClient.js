import axios from 'axios'

// Cliente para nuestro backend. withCredentials hace que el navegador
// mande la cookie con el JWT en cada pedido.
const backendClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
})

// Convierte cualquier error de Axios en un mensaje claro para mostrar en pantalla.
export function obtenerMensajeDeError(error) {
  if (error.response) {
    return error.response.data?.error || 'Ocurrió un error inesperado'
  }
  if (error.request) {
    return 'No se pudo conectar con el servidor. Revisá tu conexión.'
  }
  return 'Ocurrió un error inesperado'
}

// Errores de cada campo del formulario que devuelve el back ({ email: '...', ... })
export function obtenerErroresDeCampos(error) {
  return error.response?.data?.detalles || {}
}

export default backendClient
