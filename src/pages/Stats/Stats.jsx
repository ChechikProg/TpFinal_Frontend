import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import KpiCard from '../../components/stats/KpiCard.jsx'
import BarList from '../../components/stats/BarList.jsx'
import ColumnChart from '../../components/stats/ColumnChart.jsx'
import StackedBar from '../../components/stats/StackedBar.jsx'
import Panel from '../../components/ui/Panel.jsx'
import Alert from '../../components/ui/Alert.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PantallaDeCarga from '../../components/ui/PantallaDeCarga.jsx'
import GameCover from '../../components/games/GameCover.jsx'
import StatusBadge from '../../components/games/StatusBadge.jsx'
import { obtenerEstadisticas } from '../../services/stats.service.js'
import { obtenerMensajeDeError } from '../../api/backendClient.js'
import { formatearNumero, nombreDeMes } from '../../utils/formatters.js'
import { GAME_STATUS_LABELS } from '../../utils/constants.js'
import './Stats.css'

const COLORES_ESTADO = {
  terminado: 'var(--color-accent)',
  jugando: 'var(--color-text)',
  quiero_jugar: '#555555',
  abandonado: '#2a2a2a',
}

// Arma una frase que describe al jugador según sus datos
function perfilDeJugador(est) {
  const { resumen, generos, masJugados } = est
  const generoTop = generos[0]
  const titulo = generoTop ? `Tu género favorito: ${generoTop.nombre}` : 'Recién empezás'

  const frases = []
  if (generoTop && resumen.totalJuegos > 0) {
    const porcentaje = Math.round((generoTop.cantidad / resumen.totalJuegos) * 100)
    frases.push(`El ${porcentaje}% de tu biblioteca es de ${generoTop.nombre.toLowerCase()}.`)
  }
  if (masJugados[0]) frases.push(`Tu juego más jugado es ${masJugados[0].titulo}, con ${formatearNumero(masJugados[0].horas)} horas.`)
  if (resumen.puntajePromedio) {
    frases.push(resumen.puntajePromedio >= 4 ? 'Sos generoso con las estrellas.' : 'Sos exigente a la hora de puntuar.')
  }
  return { titulo, texto: frases.join(' ') || 'Agregá juegos a tu biblioteca para ver tu perfil de jugador.' }
}

export default function Stats() {
  const [est, setEst] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerEstadisticas()
      .then(setEst)
      .catch((err) => setError(obtenerMensajeDeError(err)))
  }, [])

  if (error) return <Alert>{error}</Alert>
  if (!est) return <PantallaDeCarga />

  const { resumen, estados, generos, plataformas, puntajes, actividadMensual, masJugados } = est
  const perfil = perfilDeJugador(est)
  const mesActual = actividadMensual.length ? nombreDeMes(actividadMensual[actividadMensual.length - 1].mes) : null

  return (
    <div className="estadisticas">
      <div className="estadisticas__encabezado">
        <h1 className="page-title">Estadísticas</h1>
        <p className="estadisticas__subtitulo">Se calculan en el momento con los datos de tu biblioteca.</p>
      </div>

      {resumen.totalJuegos === 0 && (
        <EmptyState titulo="Todavía no hay datos">
          Agregá juegos desde <Link to="/explorar">Explorar</Link>, cambiales el estado y puntualos para ver tus estadísticas.
        </EmptyState>
      )}

      <div className="grilla-kpis">
        <KpiCard valor={resumen.terminados} etiqueta="Juegos terminados" detalle={`de ${resumen.totalJuegos} en tu biblioteca`} />
        <KpiCard valor={`${formatearNumero(resumen.horasTotales)} h`} etiqueta="Tiempo de juego" variante="acento" />
        <KpiCard
          valor={resumen.puntajePromedio ? formatearNumero(resumen.puntajePromedio) : '—'}
          etiqueta="Puntuación promedio"
          detalle={`${resumen.puntuaciones} ${resumen.puntuaciones === 1 ? 'juego puntuado' : 'juegos puntuados'}`}
        />
        <KpiCard valor={`${resumen.avance}%`} etiqueta="Avance de biblioteca" detalle="juegos terminados" variante="clara" />
        <KpiCard valor={`${resumen.tasaAbandono}%`} etiqueta="Tasa de abandono" detalle="de los juegos empezados" />
        <KpiCard valor={resumen.resenas} etiqueta="Reseñas escritas" />
        <KpiCard valor={resumen.favoritos} etiqueta="Favoritos" />
        <KpiCard valor={resumen.diasActivos} etiqueta="Días activo" detalle="en los últimos 30 días" />
      </div>

      <div className="estadisticas__fila">
        <Panel titulo="Géneros favoritos">
          <BarList datos={generos.map((g) => ({ nombre: g.nombre, valor: g.cantidad }))} />
        </Panel>
        <Panel titulo="Actividad de los últimos 6 meses">
          <ColumnChart
            datos={actividadMensual.map((m) => ({ etiqueta: nombreDeMes(m.mes), agregados: m.agregados, terminados: m.terminados }))}
            series={[
              { clave: 'agregados', nombre: 'Agregados', color: 'var(--color-text)' },
              { clave: 'terminados', nombre: 'Terminados', color: 'var(--color-accent)' },
            ]}
          />
          {mesActual && <span className="estadisticas__nota">Incluye {mesActual}, el mes actual</span>}
        </Panel>
      </div>

      <div className="estadisticas__fila estadisticas__fila--tres">
        <Panel titulo="Estado de la biblioteca">
          <StackedBar
            datos={Object.entries(GAME_STATUS_LABELS).map(([clave, nombre]) => ({
              nombre,
              valor: estados[clave],
              color: COLORES_ESTADO[clave],
            }))}
          />
        </Panel>
        <Panel titulo="Plataformas más usadas">
          <BarList datos={plataformas.slice(0, 5).map((p) => ({ nombre: p.nombre, valor: p.cantidad }))} />
        </Panel>
        <Panel titulo="Tus puntuaciones">
          <ColumnChart
            alto={150}
            datos={puntajes.map((p) => ({ etiqueta: `${p.puntaje}★`, cantidad: p.cantidad }))}
            series={[{ clave: 'cantidad', nombre: 'Juegos', color: 'var(--color-text)' }]}
            destacar={puntajes.length ? `${puntajes.reduce((a, b) => (b.cantidad > a.cantidad ? b : a)).puntaje}★` : null}
          />
        </Panel>
      </div>

      <Panel titulo="Más jugados">
        {masJugados.length === 0 ? (
          <p className="estadisticas__nota">Cargá las horas jugadas desde el detalle de cada juego.</p>
        ) : (
          <ol className="mas-jugados">
            {masJugados.map((j, i) => (
              <li key={j.idExterno}>
                <span className="mas-jugados__puesto">{i + 1}</span>
                <GameCover titulo={j.titulo} portadaUrl={j.portadaUrl} className="mas-jugados__portada" />
                <Link to={`/juego/${j.idExterno}`} className="mas-jugados__titulo">
                  {j.titulo}
                </Link>
                <StatusBadge estado={j.estado} />
                <span className="mas-jugados__horas">{formatearNumero(j.horas)} h</span>
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <section className="resumen-jugador">
        <div className="resumen-jugador__textos">
          <span className="resumen-jugador__etiqueta">TU PERFIL DE JUGADOR</span>
          <h2>{perfil.titulo}</h2>
          <p>{perfil.texto}</p>
        </div>
        <div className="resumen-jugador__datos">
          <div>
            <strong>{resumen.colecciones}</strong>
            <span>Colecciones</span>
          </div>
          <div>
            <strong>{estados.jugando}</strong>
            <span>Jugando ahora</span>
          </div>
          <div>
            <strong>{estados.quiero_jugar}</strong>
            <span>Pendientes</span>
          </div>
        </div>
      </section>
    </div>
  )
}
