import { Link } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
  return (
    <>
      {/* Footer principal */}
      <div className="footer-main">
        <div className="container">
          <div className="row g-4">
            {/* Coluna de Localização */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-title">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Localização
                </h4>
                <div className="footer-content">
                  <div className="footer-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>R. 9-A, 110 - St. Aeroporto<br />Goiânia - GO, 74075-250</span>
                  </div>
                  <div className="footer-item">
                    <i className="fas fa-phone-alt"></i>
                    <span>(62) 3221-8000</span>
                  </div>
                  <div className="footer-item">
                    <i className="fas fa-envelope"></i>
                    <span>sac@hsfasaude.com.br</span>
                  </div>
                  
                  {/* Redes Sociais */}
                  <div className="footer-social">
                    <a 
                      className="social-btn" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://www.instagram.com/hospitalsaofranciscodeassis/"
                      aria-label="Instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a 
                      className="social-btn" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://web.facebook.com/hospitalsaofranciscodeassisgoiania"
                      aria-label="Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a 
                      className="social-btn" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://www.linkedin.com/company/hospitalsaofranciscodeassis"
                      aria-label="LinkedIn"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna de Links Rápidos */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-title">
                  <i className="fas fa-link me-2"></i>
                  Links Rápidos
                </h4>
                <div className="footer-content">
                  <Link to="/quem-somos" className="footer-link">
                    <i className="fas fa-chevron-right me-2"></i>
                    Quem Somos
                  </Link>
                  <Link to="/exames" className="footer-link">
                    <i className="fas fa-chevron-right me-2"></i>
                    Exames
                  </Link>
                  <Link to="/cirurgias" className="footer-link">
                    <i className="fas fa-chevron-right me-2"></i>
                    Cirurgias
                  </Link>
                  <Link to="/editais" className="footer-link">
                    <i className="fas fa-chevron-right me-2"></i>
                    Editais
                  </Link>
                  <Link to="/contato" className="footer-link">
                    <i className="fas fa-chevron-right me-2"></i>
                    Contato
                  </Link>
                  <Link to="/pesquisa-satisfacao" className="footer-link">
                    <i className="fas fa-chevron-right me-2"></i>
                    Pesquisa de Satisfação
                  </Link>
                </div>
              </div>
            </div>

            {/* Coluna de Horários */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-title">
                  <i className="fas fa-clock me-2"></i>
                  Horários de Atendimento
                </h4>
                <div className="footer-content">
                  <div className="schedule-item">
                    <div className="schedule-days">Segunda a Sexta</div>
                    <div className="schedule-time">
                      <i className="fas fa-check-circle me-2"></i>
                      24 horas
                    </div>
                  </div>
                  <div className="schedule-item">
                    <div className="schedule-days">Sábado e Domingo</div>
                    <div className="schedule-time">
                      <i className="fas fa-check-circle me-2"></i>
                      24 horas
                    </div>
                  </div>
                  <div className="schedule-note">
                    <i className="fas fa-info-circle me-2"></i>
                    Atendimento contínuo
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna do Canal de Denúncia */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-title">
                  <i className="fas fa-shield-alt me-2"></i>
                  Canal de Denúncia
                </h4>
                <div className="footer-content">
                  <p className="footer-text">
                    Ambiente seguro e confidencial para relatar irregularidades de forma anônima.
                  </p>
                  <a 
                    href="https://denuncias.hsfasaude.com.br/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-denuncia"
                  >
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Acessar Canal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA WhatsApp */}
      <div className="footer-cta">
        <div className="container">
          <div className="footer-cta-inner">
            <div className="footer-cta-text">
              <h5><i className="fab fa-whatsapp me-2"></i>Agende pelo WhatsApp</h5>
              <p>Exames, consultas e informações com atendimento rápido</p>
            </div>
            <a
              href="https://wa.me/5562996476186"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-cta-btn"
            >
              <i className="fab fa-whatsapp me-2"></i>
              Fale Conosco
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <div className="container">
          <div className="copyright-content">
            <span className="copyright-text">
              &copy; {new Date().getFullYear()} <strong>HSFA Saúde</strong> — Todos os direitos reservados
            </span>
            <span className="copyright-dev">
              Desenvolvido por <strong>Pablo de Rezende</strong>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
