import backendClient from '../api/backendClient.js'

export async function obtenerActividad(limite = 20) {
  const { data } = await backendClient.get('/actividad', { params: { limite } })
  return data.actividad
}
