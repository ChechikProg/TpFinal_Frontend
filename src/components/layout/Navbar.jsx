import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/explorar', label: 'Explorar' },
  { to: '/biblioteca', label: 'Biblioteca' },
  { to: '/colecciones', label: 'Colecciones' },
  { to: '/estadisticas', label: 'Estadísticas' },
]

function obtenerIniciales(texto = '') {
  return texto
    .split(/[\s._]+/)
    .filter(Boolean)
    .map((parte) => parte[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const manejarCerrarSesion = async () => {
    setMenuAbierto(false)
    await cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Logo />

        <nav className="navbar__links">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__usuario">
          <button
            className="navbar__avatar"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-expanded={menuAbierto}
            aria-label="Menú de usuario"
          >
            {usuario?.avatarUrl ? (
              <img src={usuario.avatarUrl} alt="" />
            ) : (
              obtenerIniciales(usuario?.nombre || usuario?.nombreUsuario)
            )}
          </button>

          {menuAbierto && (
            <div className="navbar__menu">
              <span className="navbar__menu-nombre">@{usuario?.nombreUsuario}</span>
              <Link to="/perfil" className="navbar__menu-item" onClick={() => setMenuAbierto(false)}>
                Mi perfil
              </Link>
              <button className="navbar__menu-item" onClick={manejarCerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
