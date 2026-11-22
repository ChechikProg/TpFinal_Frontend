import { GAME_STATUS_LABELS } from './constants.js'

// Convierte un registro de actividad del back en una frase para mostrar.
export function describirActividad({ tipo, juego, coleccion, detalle }) {
  const nombreJuego = juego?.titulo || 'un juego'
  const nombreColeccion = coleccion?.nombre || detalle?.nombre || 'una colección'

  switch (tipo) {
    case 'juego_agregado':
      return `Agregaste ${nombreJuego} a tu biblioteca`
    case 'juego_quitado':
      return `Quitaste ${nombreJuego} de tu biblioteca`
    case 'estado_cambiado':
      return `Pasaste ${nombreJuego} a ${GAME_STATUS_LABELS[detalle?.nuevo] || 'otro estado'}`
    case 'favorito_agregado':
      return `Marcaste ${nombreJuego} como favorito`
    case 'favorito_quitado':
      return `Sacaste ${nombreJuego} de favoritos`
    case 'juego_puntuado':
      return `Puntuaste ${nombreJuego} con ${detalle?.puntaje} ${detalle?.puntaje === 1 ? 'estrella' : 'estrellas'}`
    case 'resena_creada':
      return `Escribiste una reseña de ${nombreJuego}`
    case 'resena_editada':
      return `Editaste tu reseña de ${nombreJuego}`
    case 'coleccion_creada':
      return `Creaste la colección «${nombreColeccion}»`
    case 'coleccion_borrada':
      return `Borraste la colección «${nombreColeccion}»`
    case 'juego_agregado_a_coleccion':
      return `Agregaste ${nombreJuego} a «${nombreColeccion}»`
    case 'juego_quitado_de_coleccion':
      return `Quitaste ${nombreJuego} de «${nombreColeccion}»`
    case 'perfil_editado':
      return 'Editaste tu perfil'
    default:
      return 'Actividad'
  }
}
