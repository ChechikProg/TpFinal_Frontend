import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{ padding: 48 }}>
      <h1 className="page-title">Página no encontrada</h1>
      <Link to="/" style={{ color: 'var(--color-accent)' }}>Volver al inicio</Link>
    </main>
  )
}
