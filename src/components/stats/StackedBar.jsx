import './Charts.css'

// Barra apilada: [{ nombre, valor, color }]
export default function StackedBar({ datos }) {
  const total = datos.reduce((suma, d) => suma + d.valor, 0)

  return (
    <div className="apilada">
      <div className="apilada__barra">
        {total === 0 ? (
          <div className="apilada__vacia" />
        ) : (
          datos
            .filter((d) => d.valor > 0)
            .map((d) => (
              <div
                key={d.nombre}
                title={`${d.nombre}: ${d.valor}`}
                style={{ width: `${(d.valor / total) * 100}%`, background: d.color }}
              />
            ))
        )}
      </div>
      <ul className="apilada__leyenda">
        {datos.map((d) => (
          <li key={d.nombre}>
            <i style={{ background: d.color }} />
            {d.nombre} · {d.valor}
          </li>
        ))}
      </ul>
    </div>
  )
}
