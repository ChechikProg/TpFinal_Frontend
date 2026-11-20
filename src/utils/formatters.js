const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// "2017-09-29" -> "29 sep 2017"
export function formatearFecha(fechaIso) {
  if (!fechaIso) return 'Sin fecha'
  const [anio, mes, dia] = fechaIso.split('-').map(Number)
  return `${dia} ${MESES[mes - 1]} ${anio}`
}

export function obtenerAnio(fechaIso) {
  return fechaIso ? fechaIso.slice(0, 4) : ''
}

export function unirConPuntos(lista = [], maximo = 3) {
  return lista.slice(0, maximo).join(' · ')
}

// Las portadas de RAWG las pedimos a través de nuestro back, así se ven
// aunque la red bloquee media.rawg.io.
export function urlDePortada(url) {
  if (!url || !url.startsWith('https://media.rawg.io/')) return url
  return `${import.meta.env.VITE_API_URL}/juegos/imagen?url=${encodeURIComponent(url)}`
}
