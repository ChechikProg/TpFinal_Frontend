import backendClient from '../api/backendClient.js'

// filtros: { estado, soloFavoritos, orden }
export async function obtenerBiblioteca({ estado = '', soloFavoritos = false, orden = 'recientes' } = {}) {
  const params = { orden }
  if (estado) params.estado = estado
  if (soloFavoritos) params.favoritos = 'true'

  const { data } = await backendClient.get('/biblioteca', { params })
  return data // { juegos, conteo }
}

// Devuelve el juego de la biblioteca o null si no está agregado
export async function obtenerItem(idExterno) {
  try {
    const { data } = await backendClient.get(`/biblioteca/${idExterno}`)
    return data.item
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}

export async function agregarJuego(idExterno, estado = 'quiero_jugar') {
  const { data } = await backendClient.post('/biblioteca', { idExterno, estado })
  return data.item
}

export async function actualizarJuego(idExterno, cambios) {
  const { data } = await backendClient.patch(`/biblioteca/${idExterno}`, cambios)
  return data.item
}

export async function quitarJuego(idExterno) {
  await backendClient.delete(`/biblioteca/${idExterno}`)
}
