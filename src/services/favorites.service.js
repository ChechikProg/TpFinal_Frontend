import backendClient from '../api/backendClient.js'

export async function obtenerFavoritos() {
  const { data } = await backendClient.get('/favoritos')
  return data.favoritos
}

export async function esFavorito(idExterno) {
  const { data } = await backendClient.get(`/favoritos/${idExterno}`)
  return data.esFavorito
}

export async function agregarFavorito(idExterno) {
  await backendClient.put(`/favoritos/${idExterno}`)
}

export async function quitarFavorito(idExterno) {
  await backendClient.delete(`/favoritos/${idExterno}`)
}
