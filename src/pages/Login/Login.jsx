import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { obtenerMensajeDeError, obtenerErroresDeCampos } from '../../api/backendClient.js'

function validar({ email, contrasena }) {
  const errores = {}
  if (!email.trim()) errores.email = 'El correo es obligatorio'
  if (!contrasena) errores.contrasena = 'La contraseña es obligatoria'
  return errores
}

export default function Login() {
  const { iniciarSesion, sesionVencida } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setErrores((actual) => ({ ...actual, [name]: undefined }))
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(form)
    if (Object.keys(erroresLocales).length > 0) {
      setErrores(erroresLocales)
      return
    }

    setEnviando(true)
    try {
      await iniciarSesion(form)
      navigate(location.state?.desde || '/', { replace: true })
    } catch (error) {
      setErrores(obtenerErroresDeCampos(error))
      setErrorGeneral(obtenerMensajeDeError(error))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Iniciar sesión"
      subtitulo="Entrá para ver tu biblioteca, colecciones y estadísticas."
      pie={
        <>
          ¿No tenés cuenta? <Link to="/registro">Creá una</Link>
        </>
      }
    >
      {sesionVencida && !errorGeneral && (
        <Alert tipo="info">Tu sesión venció. Volvé a iniciar sesión.</Alert>
      )}
      <Alert>{errorGeneral}</Alert>

      <form className="auth__form" onSubmit={manejarEnvio} noValidate>
        <Input
          label="Correo"
          type="email"
          name="email"
          autoComplete="username"
          value={form.email}
          onChange={manejarCambio}
          error={errores.email}
        />
        <Input
          label="Contraseña"
          type="password"
          name="contrasena"
          autoComplete="current-password"
          value={form.contrasena}
          onChange={manejarCambio}
          error={errores.contrasena}
        />
        <Button type="submit" anchoCompleto cargando={enviando}>
          Iniciar sesión
        </Button>
      </form>
    </AuthLayout>
  )
}
