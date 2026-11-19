import backendClient from '../api/backendClient.js'

export async function registrar({ nombreUsuario, email, contrasena, confirmacion }) {
  const { data } = await backendClient.post('/auth/registro', {
    nombreUsuario,
    email,
    contrasena,
    confirmacion,
  })
  return data.usuario
}

export async function iniciarSesion({ email, contrasena }) {
  const { data } = await backendClient.post('/auth/login', { email, contrasena })
  return data.usuario
}

export async function cerrarSesion() {
  await backendClient.post('/auth/logout')
}

// Devuelve el usuario logueado o null si no hay sesión (o venció).
export async function obtenerUsuarioActual() {
  try {
    const { data } = await backendClient.get('/auth/yo')
    return data.usuario
  } catch (error) {
    if (error.response?.status === 401) return null
    throw error
  }
}
