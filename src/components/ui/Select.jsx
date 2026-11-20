import { useId } from 'react'
import './Select.css'

// opciones: [{ id, nombre }]
export default function Select({ label, opciones, value, onChange, ...props }) {
  const id = useId()
  return (
    <div className="select">
      <label className="select__label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="select__control" value={value} onChange={onChange} {...props}>
        {opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {opcion.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}
