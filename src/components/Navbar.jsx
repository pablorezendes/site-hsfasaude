import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Header.css'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path ? 'active' : ''

  // Fechar menu ao navegar
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Bloquear scroll do body quando menu aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Fechar com ESC
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setMenuOpen(false)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen, handleKeyDown])

  const navLinks = [
    { to: '/', label: 'Início', icon: 'fas fa-home' },
    { to: '/quem-somos', label: 'O HSFA', icon: 'fas fa-hospital' },
    { to: '/editais', label: 'Editais', icon: 'fas fa-file-alt' },
    { to: '/exames', label: 'Exames', icon: 'fas fa-microscope' },
    { to: '/cirurgias', label: 'Cirurgias', icon: 'fas fa-procedures' },
    { to: 'https://observatorio.hsfasaude.com.br/', label: 'Observatório', icon: 'fas fa-chart-line', external: true, highlight: true },
    { to: 'https://pacs.hsfasaude.com.br/login', label: 'Resultados', icon: 'fas fa-clipboard-list', external: true },
    { to: '/contato', label: 'S.A.C', icon: 'fas fa-headset' },
    { to: '/pesquisa-satisfacao', label: 'Pesquisa', icon: 'fas fa-star' },
  ]

  return (
    <div className="navbar-wrapper">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="/" className="navbar-brand">
            <img src="/img/black-logo.png" height="70" alt="HSFA Saúde" className="navbar-logo" />
          </Link>

          {/* Botão hamburger - controlado por React */}
          <button
            type="button"
            className={`navbar-toggler d-lg-none ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Menu Desktop - Bootstrap normal */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarCollapse">
            <div className="navbar-nav ms-auto">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.to}
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`nav-link ${link.highlight ? 'nav-link-observatorio' : ''}`}
                    title={link.label}
                  >
                    {link.highlight && <i className={`${link.icon} me-1`}></i>}
                    {link.label}
                    {link.highlight && <span className="nav-badge">2025</span>}
                  </a>
                ) : (
                  <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to)}`}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Menu Mobile - Drawer controlado por React */}
          <div className={`mobile-menu-overlay d-lg-none ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />

          <div className={`mobile-menu d-lg-none ${menuOpen ? 'is-open' : ''}`}>
            {/* Header do menu */}
            <div className="mobile-menu-header">
              <img src="/img/black-logo.png" height="40" alt="HSFA Saúde" />
              <button
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Links */}
            <nav className="mobile-menu-nav">
              {navLinks.map((link, index) =>
                link.external ? (
                  <a
                    key={link.to}
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-nav-link"
                    style={{ animationDelay: menuOpen ? `${index * 0.04}s` : '0s' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className={link.icon}></i>
                    <span>{link.label}</span>
                    <i className="fas fa-external-link-alt mobile-nav-external"></i>
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`mobile-nav-link ${isActive(link.to) ? 'is-active' : ''}`}
                    style={{ animationDelay: menuOpen ? `${index * 0.04}s` : '0s' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className={link.icon}></i>
                    <span>{link.label}</span>
                    {isActive(link.to) && <div className="mobile-nav-active-dot" />}
                  </Link>
                )
              )}
            </nav>

            {/* Footer do menu com WhatsApp */}
            <div className="mobile-menu-footer">
              <a href="https://wa.me/5562996476186" target="_blank" rel="noopener noreferrer" className="mobile-menu-whatsapp">
                <i className="fab fa-whatsapp"></i>
                <span>Agendar pelo WhatsApp</span>
              </a>
              <div className="mobile-menu-contact">
                <span><i className="fas fa-phone-alt"></i> (62) 3221-8000</span>
                <span><i className="fas fa-envelope"></i> sac@hsfasaude.com.br</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
