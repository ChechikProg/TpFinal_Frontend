import './Charts.css'

// Barras horizontales: [{ nombre, valor }]. La primera se pinta celeste.
export default function BarList({ datos, sufijo = '', vacio = 'Todavía no hay datos' }) {
  if (datos.length === 0) return <p className="grafico__vacio">{vacio}</p>
  const maximo = Math.max(...datos.map((d) => d.valor), 1)

  return (
    <ul className="barras">
      {datos.map((d, i) => (
        <li key={d.nombre} className="barras__fila">
          <span className="barras__nombre">{d.nombre}</span>
          <div className="barras__pista">
            <div
              className={i === 0 ? 'barras__relleno barras__relleno--acento' : 'barras__relleno'}
              style={{ width: `${(d.valor / maximo) * 100}%` }}
            />
          </div>
          <span className="barras__valor">
            {d.valor}
            {sufijo}
          </span>
        </li>
      ))}
    </ul>
  )
}
