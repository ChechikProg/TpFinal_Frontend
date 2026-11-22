import backendClient from '../api/backendClient.js'

// Mi puntaje y todas las reseñas de un juego
export async function obtenerValoraciones(idExterno) {
  const { data } = await backendClient.get(`/valoraciones/${idExterno}`)
  return data // { miPuntaje, resenas }
}

export async function puntuar(idExterno, puntaje) {
  await backendClient.put(`/valoraciones/${idExterno}/puntaje`, { puntaje })
}

export async function quitarPuntaje(idExterno) {
  await backendClient.delete(`/valoraciones/${idExterno}/puntaje`)
}

export async function guardarResena(idExterno, texto) {
  await backendClient.put(`/valoraciones/${idExterno}/resena`, { texto })
}

export async function borrarResena(idExterno) {
  await backendClient.delete(`/valoraciones/${idExterno}/resena`)
}
