import './KpiCard.css'

// variante: 'oscura' (por defecto), 'acento' (celeste) o 'clara' (blanca)
export default function KpiCard({ valor, etiqueta, detalle, variante = 'oscura' }) {
  return (
    <div className={`kpi kpi--${variante}`}>
      <span className="kpi__valor">{valor}</span>
      <div className="kpi__textos">
        <span className="kpi__etiqueta">{etiqueta}</span>
        {detalle && <span className="kpi__detalle">{detalle}</span>}
      </div>
    </div>
  )
}
