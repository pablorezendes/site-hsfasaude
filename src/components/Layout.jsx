import { useEffect } from 'react'
import Topbar from './Topbar'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import BackToTop from './BackToTop'
import { useWOW } from '../hooks/useWOW'
import { usePageTracking } from '../hooks/useAnalytics'

function Layout({ children }) {
  useWOW()
  usePageTracking() // GA4: rastrear pageview a cada mudança de rota

  useEffect(() => {
    // Esconder spinner após carregamento
    const spinner = document.getElementById('spinner')
    if (spinner) {
      setTimeout(() => {
        spinner.classList.remove('show')
      }, 500)
    }

    // Inicializar Bootstrap tooltips e popovers se necessário
    if (window.bootstrap) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl)
      })
    }
  }, [])

  return (
    <>
      {/* Spinner */}
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
      </div>

      <Topbar />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  )
}

export default Layout

