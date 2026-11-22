import backendClient from '../api/backendClient.js'

export async function obtenerEstadisticas() {
  const { data } = await backendClient.get('/estadisticas')
  return data
}
