import { useEffect } from 'react'

export const useWOW = () => {
  useEffect(() => {
    // Aguardar o carregamento do WOW.js
    const initWOW = () => {
      if (window.WOW && !window.wowInstance) {
        window.wowInstance = new window.WOW({
          boxClass: 'wow',
          animateClass: 'animated',
          offset: 0,
          mobile: true,
          live: true
        })
        window.wowInstance.init()
      }
    }

    // Tentar inicializar imediatamente
    initWOW()

    // Se não estiver disponível, tentar novamente após um delay
    if (!window.WOW) {
      const interval = setInterval(() => {
        if (window.WOW) {
          initWOW()
          clearInterval(interval)
        }
      }, 100)

      // Limpar intervalo após 5 segundos
      setTimeout(() => {
        clearInterval(interval)
      }, 5000)
    }
  }, [])
}

export default useWOW

