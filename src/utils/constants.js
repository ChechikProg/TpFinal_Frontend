export const GAME_STATUS = {
  WANT_TO_PLAY: 'quiero_jugar',
  PLAYING: 'jugando',
  FINISHED: 'terminado',
  DROPPED: 'abandonado',
}

export const GAME_STATUS_LABELS = {
  [GAME_STATUS.WANT_TO_PLAY]: 'Quiero jugar',
  [GAME_STATUS.PLAYING]: 'Jugando',
  [GAME_STATUS.FINISHED]: 'Terminado',
  [GAME_STATUS.DROPPED]: 'Abandonado',
}

// Plataformas "padre" de RAWG (agrupan, por ejemplo, PS4 y PS5 en PlayStation)
export const PLATAFORMAS = [
  { id: '', nombre: 'Todas' },
  { id: '1', nombre: 'PC' },
  { id: '2', nombre: 'PlayStation' },
  { id: '3', nombre: 'Xbox' },
  { id: '7', nombre: 'Nintendo' },
  { id: '4', nombre: 'iOS' },
  { id: '8', nombre: 'Android' },
]

export const ORDENES = [
  { id: '', nombre: 'Relevancia' },
  { id: '-added', nombre: 'Más populares' },
  { id: '-rating', nombre: 'Mejor puntuados' },
  { id: '-metacritic', nombre: 'Metacritic' },
  { id: '-released', nombre: 'Más nuevos' },
  { id: 'name', nombre: 'Nombre (A-Z)' },
]
