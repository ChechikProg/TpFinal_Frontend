import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GameCover from '../../components/games/GameCover.jsx'
import GameCard from '../../components/games/GameCard.jsx'
import CollectionMosaic from '../../components/games/CollectionMosaic.jsx'
import KpiCard from '../../components/stats/KpiCard.jsx'
import ActivityList from '../../components/activity/ActivityList.jsx'
import Panel from '../../components/ui/Panel.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { buscarJuegos } from '../../services/games.service.js'
import { obtenerEstadisticas } from '../../services/stats.service.js'
import { obtenerBiblioteca } from '../../services/library.service.js'
import { obtenerActividad } from '../../services/activity.service.js'
import { obtenerColecciones } from '../../services/collections.service.js'
import { obtenerMensajeDeError } from '../../api/backendClient.js'
import { formatearNumero, obtenerAnio, unirConPuntos } from '../../utils/formatters.js'
import './Home.css'

// Cada parte carga por separado: si una falla (por ejemplo RAWG), el resto se muestra igual.
function useDatos(cargar) {
  const [estado, setEstado] = useState({ datos: null, error: '' })
  useEffect(() => {
    cargar()
      .then((datos) => setEstado({ datos, error: '' }))
      .catch((err) => setEstado({ datos: null, error: obtenerMensajeDeError(err) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return estado
}

export default function Home() {
  const { usuario } = useAuth()

  const destacados = useDatos(() => buscarJuegos({ orden: '-added' }))
  const estadisticas = useDatos(obtenerEstadisticas)
  const jugando = useDatos(() => obtenerBiblioteca({ estado: 'jugando', orden: 'horas' }))
  const actividad = useDatos(() => obtenerActividad(5))
  const colecciones = useDatos(() => obtenerColecciones())

  const juegosDestacados = destacados.datos?.juegos || []
  const principal = juegosDestacados[0]
  const tendencias = juegosDestacados.slice(1, 7)
  const resumen = estadisticas.datos?.resumen
  const estados = estadisticas.datos?.estados

  return (
    <div className="inicio">
      <h1 className="inicio__saludo">Hola, {usuario?.nombre || usuario?.nombreUsuario}</h1>

      <Alert>{destacados.error}</Alert>

      {principal && (
        <section className="destacado">
          <GameCover titulo={principal.titulo} portadaUrl={principal.portadaUrl} className="destacado__portada" />
          <div className="destacado__textos">
            <span className="destacado__etiqueta">DESTACADO</span>
            <h2 className="destacado__titulo">{principal.titulo}</h2>
            <p className="destacado__detalle">
              {[obtenerAnio(principal.fechaLanzamiento), unirConPuntos(principal.plataformas, 3)].filter(Boolean).join(' · ')}
            </p>
            <ul className="destacado__generos">
              {principal.generos.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <Link to={`/juego/${principal.idExterno}`}>
              <Button tabIndex={-1}>Ver detalle</Button>
            </Link>
          </div>
        </section>
      )}

      {tendencias.length > 0 && (
        <section className="inicio__seccion">
          <div className="inicio__titulo-seccion">
            <h2>Populares</h2>
            <Link to="/explorar?orden=-added">Ver más</Link>
          </div>
          <div className="inicio__tendencias">
            {tendencias.map((j) => (
              <GameCard key={j.idExterno} juego={j} />
            ))}
          </div>
        </section>
      )}

      {resumen && (
        <section className="inicio__seccion">
          <div className="inicio__titulo-seccion">
            <h2>Tu resumen</h2>
            <Link to="/estadisticas">Ver estadísticas</Link>
          </div>
          <div className="grilla-kpis">
            <KpiCard valor={resumen.favoritos} etiqueta="Favoritos" />
            <KpiCard valor={estados.jugando} etiqueta="Jugando ahora" variante="acento" />
            <KpiCard valor={resumen.terminados} etiqueta="Terminados" detalle={`${resumen.avance}% de tu biblioteca`} />
            <KpiCard valor={resumen.colecciones} etiqueta="Colecciones" variante="clara" />
          </div>
        </section>
      )}

      <div className="inicio__paneles">
        <Panel titulo="Jugando ahora" accion={<Link to="/biblioteca">Biblioteca</Link>}>
          {jugando.datos?.juegos.length === 0 && <p className="inicio__vacio">No estás jugando nada. Elegí algo de tu biblioteca.</p>}
          <ul className="inicio__jugando">
            {(jugando.datos?.juegos || []).slice(0, 4).map((j) => (
              <li key={j.idExterno}>
                <GameCover titulo={j.titulo} portadaUrl={j.portadaUrl} className="inicio__mini" />
                <div>
                  <Link to={`/juego/${j.idExterno}`} className="inicio__nombre">
                    {j.titulo}
                  </Link>
                  <span className="inicio__dato">{formatearNumero(j.horasJugadas)} h jugadas</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel titulo="Actividad reciente" accion={<Link to="/perfil">Ver todo</Link>}>
          {actividad.datos && <ActivityList actividad={actividad.datos} />}
        </Panel>

        <Panel titulo="Tus colecciones" accion={<Link to="/colecciones">Ver todas</Link>}>
          {colecciones.datos?.length === 0 && <p className="inicio__vacio">Todavía no creaste colecciones.</p>}
          <ul className="inicio__colecciones">
            {(colecciones.datos || []).slice(0, 3).map((c) => (
              <li key={c.id}>
                <Link to={`/colecciones/${c.id}`}>
                  <div className="inicio__mosaico">
                    <CollectionMosaic portadas={c.portadas} nombre={c.nombre} />
                  </div>
                  <div>
                    <span className="inicio__nombre">{c.nombre}</span>
                    <span className="inicio__dato">
                      {c.cantidadJuegos} {c.cantidadJuegos === 1 ? 'juego' : 'juegos'}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
