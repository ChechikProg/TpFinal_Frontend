import { useEffect, useState } from 'react'

// Devuelve el valor recién cuando el usuario deja de escribir por `demora` ms.
// Así no hacemos un pedido a la API por cada letra.
export function useDebounce(valor, demora = 400) {
  const [valorDemorado, setValorDemorado] = useState(valor)

  useEffect(() => {
    const timer = setTimeout(() => setValorDemorado(valor), demora)
    return () => clearTimeout(timer)
  }, [valor, demora])

  return valorDemorado
}
