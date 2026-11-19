import { useId } from 'react'
import './Input.css'

export default function Input({ label, error, ...props }) {
  const id = useId()
  const idError = `${id}-error`

  return (
    <div className="campo">
      <label className="campo__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={error ? 'campo__input campo__input--error' : 'campo__input'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        {...props}
      />
      {error && (
        <span id={idError} className="campo__error">
          {error}
        </span>
      )}
    </div>
  )
}
