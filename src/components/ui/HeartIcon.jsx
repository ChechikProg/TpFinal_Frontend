// Corazón lleno (favorito) o vacío
export default function HeartIcon({ lleno = false, tamano = 18 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.5-9.3C1 8.2 3.3 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.7 0 6 3.7 4.5 7.2C19.5 16.4 12 21 12 21z"
        fill={lleno ? 'var(--color-accent)' : 'none'}
        stroke={lleno ? 'var(--color-accent)' : 'currentColor'}
        strokeWidth="2"
      />
    </svg>
  )
}
