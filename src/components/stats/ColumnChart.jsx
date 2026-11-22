import './Charts.css'

// Columnas verticales. series: [{ clave, nombre, color }], datos: [{ etiqueta, [clave]: número }]
export default function ColumnChart({ datos, series, alto = 180, destacar }) {
  const maximo = Math.max(1, ...datos.flatMap((d) => series.map((s) => d[s.clave])))

  return (
    <div className="columnas">
      {series.length > 1 && (
        <div className="columnas__leyenda">
          {series.map((s) => (
            <span key={s.clave}>
              <i style={{ background: s.color }} /> {s.nombre}
            </span>
          ))}
        </div>
      )}
      <div className="columnas__area" style={{ height: alto }}>
        {datos.map((d) => (
          <div key={d.etiqueta} className="columnas__grupo">
            <div className="columnas__barras">
              {series.map((s) => (
                <div key={s.clave} className="columnas__col">
                  <span className="columnas__numero">{d[s.clave]}</span>
                  <div
                    className="columnas__barra"
                    title={`${s.nombre}: ${d[s.clave]}`}
                    style={{
                      height: `${(d[s.clave] / maximo) * (alto - 48)}px`,
                      background: destacar && destacar === d.etiqueta ? 'var(--color-accent)' : s.color,
                    }}
                  />
                </div>
              ))}
            </div>
            <span className="columnas__etiqueta">{d.etiqueta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
