import './Panel.css'

// Caja oscura con título opcional y acción a la derecha (por ejemplo "Ver todos")
export default function Panel({ titulo, accion, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      {(titulo || accion) && (
        <div className="panel__encabezado">
          {titulo && <h2 className="panel__titulo">{titulo}</h2>}
          {accion}
        </div>
      )}
      {children}
    </section>
  )
}
