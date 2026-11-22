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

// "Hace 5 minutos", "Ayer", "Hace 3 días", "12 oct 2026"
export function tiempoRelativo(fechaIso) {
  const fecha = new Date(fechaIso)
  const segundos = Math.floor((Date.now() - fecha.getTime()) / 1000)
  if (segundos < 60) return 'Recién'
  const minutos = Math.floor(segundos / 60)
  if (minutos < 60) return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`
  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'Ayer'
  if (dias < 30) return `Hace ${dias} días`
  return formatearFecha(fechaIso.slice(0, 10))
}

// "2026-10" -> "Oct"
export function nombreDeMes(anioMes) {
  const mes = Number(anioMes.slice(5, 7))
  const nombre = MESES[mes - 1]
  return nombre.charAt(0).toUpperCase() + nombre.slice(1)
}

export function formatearNumero(numero) {
  return Number(numero).toLocaleString('es-AR', { maximumFractionDigits: 1 })
}

export function obtenerIniciales(texto = '') {
  return texto
    .split(/[\s._]+/)
    .filter(Boolean)
    .map((parte) => parte[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
