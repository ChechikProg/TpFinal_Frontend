import backendClient from '../api/backendClient.js'

// Si se pasa idExterno, cada colección trae `contieneJuego`
export async function obtenerColecciones(idExterno) {
  const { data } = await backendClient.get('/colecciones', { params: idExterno ? { idExterno } : {} })
  return data.colecciones
}

export async function obtenerColeccion(id) {
  const { data } = await backendClient.get(`/colecciones/${id}`)
  return data.coleccion
}

export async function crearColeccion({ nombre, descripcion }) {
  const { data } = await backendClient.post('/colecciones', { nombre, descripcion })
  return data.coleccion
}

export async function actualizarColeccion(id, cambios) {
  const { data } = await backendClient.patch(`/colecciones/${id}`, cambios)
  return data.coleccion
}

export async function borrarColeccion(id) {
  await backendClient.delete(`/colecciones/${id}`)
}

export async function agregarJuegoAColeccion(id, idExterno) {
  await backendClient.post(`/colecciones/${id}/juegos`, { idExterno })
}

export async function quitarJuegoDeColeccion(id, idExterno) {
  await backendClient.delete(`/colecciones/${id}/juegos/${idExterno}`)
}
