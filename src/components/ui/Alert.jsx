import './Alert.css'

// tipo: 'error' o 'info'
export default function Alert({ tipo = 'error', children }) {
  if (!children) return null
  return (
    <div className={`alerta alerta--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
