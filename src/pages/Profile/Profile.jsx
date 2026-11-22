import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar.jsx'
import Panel from '../../components/ui/Panel.jsx'
import Input from '../../components/ui/Input.jsx'
import Chip from '../../components/ui/Chip.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import PantallaDeCarga from '../../components/ui/PantallaDeCarga.jsx'
import GameCover from '../../components/games/GameCover.jsx'
import ActivityList from '../../components/activity/ActivityList.jsx'
import * as profileService from '../../services/profile.service.js'
import * as favoritesService from '../../services/favorites.service.js'
import * as activityService from '../../services/activity.service.js'
import { useAuth } from '../../hooks/useAuth.js'
import { obtenerMensajeDeError, obtenerErroresDeCampos } from '../../api/backendClient.js'
import { formatearFecha } from '../../utils/formatters.js'
import { PLATAFORMAS_PERFIL, GENEROS_PERFIL } from '../../utils/constants.js'
import './Profile.css'

function aFormulario(perfil) {
  return {
    nombre: perfil.nombre || '',
    bio: perfil.bio || '',
    avatarUrl: perfil.avatarUrl || '',
    plataformaPreferida: perfil.plataformaPreferida || '',
    generosPreferidos: perfil.generosPreferidos || [],
  }
}

export default function Profile() {
  const { actualizarUsuario } = useAuth()

  const [perfil, setPerfil] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [actividad, setActividad] = useState([])
  const [errorCarga, setErrorCarga] = useState('')

  const [form, setForm] = useState(null)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([profileService.obtenerPerfil(), favoritesService.obtenerFavoritos(), activityService.obtenerActividad(8)])
      .then(([datosPerfil, datosFavoritos, datosActividad]) => {
        setPerfil(datosPerfil)
        setForm(aFormulario(datosPerfil))
        setFavoritos(datosFavoritos)
        setActividad(datosActividad)
      })
      .catch((err) => setErrorCarga(obtenerMensajeDeError(err)))
  }, [])

  const cambiar = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErrores((e) => ({ ...e, [campo]: undefined }))
    setMensaje('')
  }

  const alternarGenero = (genero) =>
    cambiar(
      'generosPreferidos',
      form.generosPreferidos.includes(genero)
        ? form.generosPreferidos.filter((g) => g !== genero)
        : [...form.generosPreferidos, genero]
    )

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    const erroresLocales = {}
    if (!form.nombre.trim()) erroresLocales.nombre = 'El nombre no puede quedar vacío'
    if (form.avatarUrl.trim() && !form.avatarUrl.trim().startsWith('https://')) {
      erroresLocales.avatarUrl = 'Tiene que empezar con https://'
    }
    if (Object.keys(erroresLocales).length > 0) {
      setErrores(erroresLocales)
      return
    }

    setGuardando(true)
    try {
      const actualizado = await profileService.actualizarPerfil({
        nombre: form.nombre.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl.trim(),
        plataformaPreferida: form.plataformaPreferida || null,
        generosPreferidos: form.generosPreferidos,
      })
      setPerfil(actualizado)
      setForm(aFormulario(actualizado))
      // Actualizamos el usuario de la sesión para que la navbar muestre el avatar nuevo
      actualizarUsuario({ nombre: actualizado.nombre, avatarUrl: actualizado.avatarUrl, bio: actualizado.bio })
      setActividad(await activityService.obtenerActividad(8))
      setMensaje('Cambios guardados')
    } catch (err) {
      setErrores(obtenerErroresDeCampos(err))
      setError(obtenerMensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  if (errorCarga) return <Alert>{errorCarga}</Alert>
  if (!perfil) return <PantallaDeCarga />

  return (
    <div className="perfil">
      <section className="perfil__cabecera">
        <Avatar usuario={perfil} tamano={128} />
        <div className="perfil__datos">
          <h1 className="page-title">{perfil.nombre || perfil.nombreUsuario}</h1>
          <p className="perfil__usuario">
            @{perfil.nombreUsuario} · Miembro desde {formatearFecha(perfil.creadoEn.slice(0, 10))}
          </p>
          {perfil.bio && <p className="perfil__bio">{perfil.bio}</p>}
          {(perfil.plataformaPreferida || perfil.generosPreferidos.length > 0) && (
            <div className="perfil__preferencias">
              {perfil.plataformaPreferida && <span className="perfil__pref perfil__pref--acento">{perfil.plataformaPreferida}</span>}
              {perfil.generosPreferidos.map((g) => (
                <span key={g} className="perfil__pref">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="perfil__columnas">
        <Panel titulo="Editar datos" className="perfil__form-panel">
          <form className="perfil__form" onSubmit={guardar} noValidate>
            <Input label="Nombre" value={form.nombre} maxLength={60} onChange={(e) => cambiar('nombre', e.target.value)} error={errores.nombre} />

            <div className="campo">
              <label className="campo__label" htmlFor="perfil-bio">
                Bio
              </label>
              <textarea
                id="perfil-bio"
                className="campo__input perfil__textarea"
                value={form.bio}
                maxLength={300}
                rows={3}
                onChange={(e) => cambiar('bio', e.target.value)}
              />
              <span className="perfil__contador">{form.bio.length} / 300</span>
              {errores.bio && <span className="campo__error">{errores.bio}</span>}
            </div>

            <Input
              label="Foto de perfil (link de imagen)"
              value={form.avatarUrl}
              placeholder="https://..."
              onChange={(e) => cambiar('avatarUrl', e.target.value)}
              error={errores.avatarUrl}
            />

            <div className="campo">
              <label className="campo__label" htmlFor="perfil-plataforma">
                Plataforma preferida
              </label>
              <select
                id="perfil-plataforma"
                className="campo__input"
                value={form.plataformaPreferida}
                onChange={(e) => cambiar('plataformaPreferida', e.target.value)}
              >
                <option value="">Sin elegir</option>
                {PLATAFORMAS_PERFIL.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <span className="campo__label">Géneros preferidos</span>
              <div className="perfil__generos">
                {GENEROS_PERFIL.map((g) => (
                  <Chip key={g} activo={form.generosPreferidos.includes(g)} onClick={() => alternarGenero(g)}>
                    {g}
                  </Chip>
                ))}
              </div>
              {errores.generosPreferidos && <span className="campo__error">{errores.generosPreferidos}</span>}
            </div>

            <Alert>{error}</Alert>
            <Alert tipo="info">{mensaje}</Alert>

            <Button type="submit" anchoCompleto cargando={guardando}>
              Guardar cambios
            </Button>
          </form>
        </Panel>

        <div className="perfil__derecha">
          <Panel titulo="Favoritos" accion={<Link to="/biblioteca">Ver biblioteca</Link>}>
            {favoritos.length === 0 ? (
              <p className="perfil__vacio">Marcá juegos como favoritos desde su detalle.</p>
            ) : (
              <ul className="perfil__favoritos">
                {favoritos.slice(0, 10).map((j) => (
                  <li key={j.idExterno}>
                    <Link to={`/juego/${j.idExterno}`} title={j.titulo}>
                      <GameCover titulo={j.titulo} portadaUrl={j.portadaUrl} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel titulo="Actividad">
            <ActivityList actividad={actividad} />
          </Panel>
        </div>
      </div>
    </div>
  )
}
