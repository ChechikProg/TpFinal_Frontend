import backendClient from '../api/backendClient.js'

export async function obtenerPerfil() {
  const { data } = await backendClient.get('/perfil')
  return data.perfil
}

// Se puede mandar solo lo que cambió: { nombre, bio, avatarUrl, plataformaPreferida, generosPreferidos }
export async function actualizarPerfil(cambios) {
  const { data } = await backendClient.patch('/perfil', cambios)
  return data.perfil
}
