import './PantallaDeCarga.css'

export default function PantallaDeCarga() {
  return (
    <div className="pantalla-carga" role="status" aria-label="Cargando">
      <span className="pantalla-carga__spinner" />
    </div>
  )
}
