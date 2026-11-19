import Logo from '../layout/Logo.jsx'
import './AuthLayout.css'

// Caja centrada que comparten Login y Registro.
export default function AuthLayout({ titulo, subtitulo, children, pie }) {
  return (
    <main className="auth">
      <div className="auth__caja">
        <Logo />
        <div className="auth__encabezado">
          <h1 className="auth__titulo">{titulo}</h1>
          {subtitulo && <p className="auth__subtitulo">{subtitulo}</p>}
        </div>
        {children}
        {pie && <p className="auth__pie">{pie}</p>}
      </div>
    </main>
  )
}
