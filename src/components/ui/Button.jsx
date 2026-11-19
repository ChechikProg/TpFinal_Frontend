import './Button.css'

// variante: 'primario' (celeste), 'secundario' (borde blanco) o 'texto'
export default function Button({
  children,
  variante = 'primario',
  anchoCompleto = false,
  cargando = false,
  disabled,
  className = '',
  ...props
}) {
  const clases = [
    'btn',
    `btn--${variante}`,
    anchoCompleto ? 'btn--ancho-completo' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={clases} disabled={disabled || cargando} {...props}>
      {cargando ? <span className="btn__spinner" aria-label="Cargando" /> : children}
    </button>
  )
}
