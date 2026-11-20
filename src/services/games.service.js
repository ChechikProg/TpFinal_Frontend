import backendClient from '../api/backendClient.js'

// Los juegos se piden a nuestro back, que a su vez consulta RAWG.
// Así la key queda escondida en el servidor y la app funciona aunque
// la red bloquee RAWG.

// filtros: { texto, genero, plataforma, orden, pagina }
export async function buscarJuegos({ texto = '', genero = '', plataforma = '', orden = '', pagina = 1 } = {}) {
  const params = { pagina }
  if (texto.trim()) params.texto = texto.trim()
  if (genero) params.genero = genero
  if (plataforma) params.plataforma = plataforma
  if (orden) params.orden = orden

  const { data } = await backendClient.get('/juegos', { params })
  return data // { juegos, total, hayMas }
}

export async function obtenerJuego(idExterno) {
  const { data } = await backendClient.get(`/juegos/${idExterno}`)
  return data.juego
}

export async function obtenerGeneros() {
  const { data } = await backendClient.get('/juegos/generos')
  return data.generos
}
