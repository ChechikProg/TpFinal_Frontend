import './Chip.css'

export default function Chip({ activo = false, children, ...props }) {
  return (
    <button
      type="button"
      className={activo ? 'chip chip--activo' : 'chip'}
      aria-pressed={activo}
      {...props}
    >
      {children}
    </button>
  )
}
