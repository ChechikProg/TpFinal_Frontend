import './EmptyState.css'

export default function EmptyState({ titulo, children }) {
  return (
    <div className="estado-vacio">
      <p className="estado-vacio__titulo">{titulo}</p>
      {children && <p className="estado-vacio__texto">{children}</p>}
    </div>
  )
}
