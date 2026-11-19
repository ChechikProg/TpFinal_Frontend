import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Alert from '../../components/ui/Alert.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { obtenerMensajeDeError, obtenerErroresDeCampos } from '../../api/backendClient.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USUARIO_REGEX = /^[a-zA-Z0-9_.]{3,30}$/

// Mismas reglas que valida el back, para avisar antes de enviar.
function validar({ nombreUsuario, email, contrasena, confirmacion }) {
  const errores = {}

  if (!nombreUsuario.trim()) {
    errores.nombreUsuario = 'El nombre de usuario es obligatorio'
  } else if (!USUARIO_REGEX.test(nombreUsuario.trim())) {
    errores.nombreUsuario = 'Entre 3 y 30 caracteres: letras, números, punto o guion bajo'
  }

  if (!email.trim()) {
    errores.email = 'El correo es obligatorio'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errores.email = 'El correo no es válido'
  }

  if (!contrasena) {
    errores.contrasena = 'La contraseña es obligatoria'
  } else if (contrasena.length < 8) {
    errores.contrasena = 'Tiene que tener al menos 8 caracteres'
  } else if (contrasena.length > 72) {
    errores.contrasena = 'No puede tener más de 72 caracteres'
  }

  if (!confirmacion) {
    errores.confirmacion = 'Confirmá la contraseña'
  } else if (confirmacion !== contrasena) {
    errores.confirmacion = 'Las contraseñas no coinciden'
  }

  return errores
}

export default function Register() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombreUsuario: '',
    email: '',
    contrasena: '',
    confirmacion: '',
  })
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
      await registrar(form)
      navigate('/', { replace: true })
    } catch (error) {
      setErrores(obtenerErroresDeCampos(error))
      setErrorGeneral(obtenerMensajeDeError(error))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Crear cuenta"
      subtitulo="Armá tu biblioteca de juegos y seguí tu progreso."
      pie={
        <>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </>
      }
    >
      <Alert>{errorGeneral}</Alert>

      <form className="auth__form" onSubmit={manejarEnvio} noValidate>
        <Input
          label="Nombre de usuario"
          name="nombreUsuario"
          autoComplete="nickname"
          value={form.nombreUsuario}
          onChange={manejarCambio}
          error={errores.nombreUsuario}
        />
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
          autoComplete="new-password"
          value={form.contrasena}
          onChange={manejarCambio}
          error={errores.contrasena}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          name="confirmacion"
          autoComplete="new-password"
          value={form.confirmacion}
          onChange={manejarCambio}
          error={errores.confirmacion}
        />
        <Button type="submit" anchoCompleto cargando={enviando}>
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  )
}
