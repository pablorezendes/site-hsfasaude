import '../styles/Header.css'

function Topbar() {
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-content">
          {/* Informações */}
          <div className="topbar-left">
            <div className="topbar-info">
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>R. 9-A - St. Aeroporto, Goiânia - GO</span>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <span>sac@hsfasaude.com.br</span>
              </div>
              <div className="info-item">
                <i className="fas fa-phone-alt"></i>
                <span>(62) 3221-8000</span>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="topbar-right">
            <div className="social-links">
              <a 
                className="social-link" 
                target="_blank" 
                rel="noopener noreferrer"
                href="https://web.facebook.com/hospitalsaofranciscodeassisgoiania?_rdc=1&_rdr"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                className="social-link" 
                target="_blank" 
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/hospitalsaofranciscodeassis"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a 
                className="social-link" 
                target="_blank" 
                rel="noopener noreferrer"
                href="https://www.instagram.com/hospitalsaofranciscodeassis/"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
