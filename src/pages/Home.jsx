import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Exames.css'
import '../styles/Carousel.css'
import '../styles/GuiaPaciente.css'

function Home() {
  useEffect(() => {
    // Inicializar carousel do Bootstrap
    const carouselElement = document.getElementById('header-carousel')
    if (carouselElement && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 10000,
        ride: 'carousel',
        pause: 'hover'
      })
    }
  }, [])

  return (
    <>
      {/* Carousel Start */}
      <div className="container-fluid px-0 mb-5">
        <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            {/* Primeiro Slide */}
            <div className="carousel-item active">
              <img className="w-100" src="/img/carousel-1.jpg" alt="Banner Principal HSFA" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7 text-start">
                      <p className="fs-4 text-white animated slideInLeft"></p>
                      <h1 className="display-1 text-white mb-5 animated slideInLeft"></h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Segundo Slide - Relatório de Sustentabilidade */}
            <div className="carousel-item">
              <img className="w-100" src="/diferenciais/relatorio-sustentabilidade-hsfa.jpg" alt="Relatório de Sustentabilidade" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-8 text-start">
                      <h2 className="display-3 text-white mb-4 animated slideInLeft">Relatório de Sustentabilidade 2024</h2>
                      <p className="fs-4 text-white mb-4 animated slideInLeft">Conheça nossas iniciativas e compromissos com a sustentabilidade</p>
                      <a 
                        href="https://observatoriohsfa.my.canva.site/relatorio-sustentabilidade-2024" 
                        className="btn btn-light py-3 px-5 animated slideInLeft" 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Acessar Relatório
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controles do Carousel */}
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Próximo</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}

      {/* Relatório de Sustentabilidade Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="position-relative">
                <img className="img-fluid" src="/diferenciais/relatorio-sustentabilidade-hsfa.jpg" alt="Relatório de Sustentabilidade HSFA" />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="h-100">
                <h1 className="display-6 mb-4"><i className="fas fa-leaf me-2" style={{ color: '#196F75' }}></i>Relatório de Sustentabilidade 2024</h1>
                <p className="mb-4">Conheça nossas iniciativas e compromissos com a sustentabilidade. O Hospital São Francisco de Assis apresenta suas ações e resultados voltados para o desenvolvimento sustentável, responsabilidade social e ambiental.</p>
                <p className="mb-4">Transparência e responsabilidade são valores fundamentais em nossa gestão. Acesse o relatório completo e saiba mais sobre nossas práticas sustentáveis.</p>
                <a 
                  className="btn btn-primary rounded-pill py-3 px-5" 
                  href="https://observatoriohsfa.my.canva.site/relatorio-sustentabilidade-2024" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-file-pdf me-2"></i>Acessar Relatório
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Relatório de Sustentabilidade End */}

      {/* Guia do Paciente Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="h-100">
                <h1 className="display-6 mb-4"><i className="fas fa-book-reader me-2" style={{ color: '#196F75' }}></i>Guia do Paciente</h1>
                <p className="mb-4">Conheça todas as informações importantes para seu atendimento no Hospital São Francisco de Assis. Nosso guia completo traz orientações sobre procedimentos, documentação necessária, horários de funcionamento e muito mais.</p>
                <p className="mb-4">Facilitamos seu acesso às informações essenciais para garantir um atendimento ágil e eficiente. Baixe o guia e tenha todas as informações em mãos.</p>
                <a 
                  className="btn btn-primary rounded-pill py-3 px-5" 
                  href="/public_html/guiaPaciente.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-file-pdf me-2"></i>Baixar Guia
                </a>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="position-relative">
                <div className="guia-card-wrapper">
                  <div className="guia-card-icon">
                    <i className="fas fa-book-medical"></i>
                  </div>
                  <div className="guia-card-content">
                    <h3 className="mb-3">Informações Essenciais</h3>
                    <ul className="guia-list">
                      <li><i className="fas fa-check-circle me-2"></i>Documentação necessária</li>
                      <li><i className="fas fa-check-circle me-2"></i>Horários de funcionamento</li>
                      <li><i className="fas fa-check-circle me-2"></i>Procedimentos e exames</li>
                      <li><i className="fas fa-check-circle me-2"></i>Orientações de atendimento</li>
                      <li><i className="fas fa-check-circle me-2"></i>Direitos e deveres do paciente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Guia do Paciente End */}

      {/* Diferenciais Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
            <h1 className="display-5 mb-3" style={{ color: '#1C2035', fontWeight: '700' }}>
              <i className="fas fa-medal me-2" style={{ fontSize: '0.8em' }}></i>DIFERENCIAIS
            </h1>
            <div className="divider-custom mb-4">
              <div className="divider-custom-line" style={{ 
                width: '100px', 
                height: '4px', 
                background: '#196F75', 
                margin: '0 auto',
                borderRadius: '2px'
              }}></div>
            </div>
            <p className="lead text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Conheça os diferenciais que fazem do Hospital São Francisco de Assis referência em atendimento médico-hospitalar
            </p>
          </div>

          <div className="row g-4">
            {[
              { 
                imagem: 'planoSeguranca.jpg', 
                titulo: 'Plano de Segurança ao Paciente', 
                descricao: 'O Hospital possui o Plano de Segurança ao Paciente e Gestão de Riscos para prevenção de complicações decorrentes da hospitalização.' 
              },
              { 
                imagem: 'acomodacoes.jpg', 
                titulo: 'Acomodações', 
                descricao: 'Contamos com leitos de enfermaria, apartamentos e UTI.' 
              },
              { 
                imagem: 'utiHumanizada.jpg', 
                titulo: 'UTI humanizada', 
                descricao: 'Como forma de valorizar o paciente, o Hospital São Francisco de Assis oferece uma UTI humanizada.' 
              },
              { 
                imagem: 'farmacia.png', 
                titulo: 'Farmácia Clínica', 
                descricao: 'Contamos com serviço de Farmácia Clínica para maior segurança do paciente.' 
              },
              { 
                imagem: 'equipeMultidiciplinar.jpg', 
                titulo: 'Equipe Multidisciplinar', 
                descricao: 'O grupo é composto por médicos, enfermeiros, nutricionistas, farmacêuticos, fisioterapeutas, entre outros profissionais da área da saúde.' 
              },
              { 
                imagem: 'prontoSocorro.jpg', 
                titulo: 'Pronto Socorro 24 horas', 
                descricao: 'O pronto socorro de urgências e emergências do Hospital São Francisco de Assis funciona 24 horas por dia durante todos os dias da semana.' 
              },
            ].map((diferencial, index) => (
              <div 
                key={index} 
                className="col-lg-4 col-md-6 wow fadeInUp" 
                data-wow-delay={`${0.1 + (index * 0.1)}s`}
              >
                <div className="exame-card">
                  <div className="exame-link" style={{ cursor: 'default' }}>
                    <div className="exame-image-wrapper">
                      <img 
                        className="exame-image" 
                        src={`/diferenciais/${diferencial.imagem}`}
                        alt={diferencial.titulo} 
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', e.target.src)
                          e.target.style.display = 'none'
                        }}
                      />
                      <div className="exame-overlay">
                        <div className="exame-overlay-content">
                          <i className="fas fa-star mb-2" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0 fw-bold">Diferencial HSFA</p>
                        </div>
                      </div>
                    </div>
                    <div className="exame-info">
                      <h5 className="exame-title">{diferencial.titulo}</h5>
                      <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        {diferencial.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Diferenciais End */}

      {/* CADI Start */}
      <div className="container-xxl">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <div style={{ height: '100px' }}></div>
              <img src="/img/imagem-cadi.jpg" className="img-fluid mb-4" alt="CADI" />
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
              <div style={{ height: '80px' }}></div>
              <h1 className="display-6 mb-4">
                <img src="/img/logo-cadi.png" height="80" alt="CADI" />
              </h1>
              <p className="mb-4">
                Através de uma tecnologia de ponta com técnica médica em ressonância nuclear magnética,
                realizamos os mais modernos e complexos exames de diagnóstico por imagem, proporcionando resultados
                precisos e um atendimento eficiente.
              </p>
              <a 
                className="btn btn-primary rounded-pill py-3 px-5" 
                target="_blank" 
                rel="noopener noreferrer"
                href="https://cadigoiania.com.br/"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* CADI End */}

      {/* Exames Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
            <h1 className="display-5 mb-3" style={{ color: '#1C2035', fontWeight: '700' }}>
              <i className="fas fa-microscope me-2" style={{ fontSize: '0.8em' }}></i>NOSSOS EXAMES
            </h1>
            <div className="divider-custom mb-4">
              <div className="divider-custom-line" style={{ 
                width: '100px', 
                height: '4px', 
                background: '#196F75', 
                margin: '0 auto',
                borderRadius: '2px'
              }}></div>
            </div>
            <p className="lead text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Oferecemos uma ampla gama de exames diagnósticos com tecnologia de ponta e profissionais especializados
            </p>
          </div>

          <div className="row g-4">
            {[
              { id: 29, imagem: 'tc.jpg', titulo: 'Tomografia Computadorizada' },
              { id: 33, imagem: 'angio.jpg', titulo: 'Angiotomografia das Coronárias' },
              { id: 28, imagem: 'rm.jpg', titulo: 'Ressonância Magnética' },
              { id: 22, imagem: 'ecocardio.jpg', titulo: 'Ecocardiograma' },
              { id: 30, imagem: 'ultrassom_geral.jpg', titulo: 'Ultrassom Geral' },
              { id: 35, imagem: 'densitometria.jpg', titulo: 'Densitometria Óssea' },
              { id: 36, imagem: 'doppler.jpg', titulo: 'Ultrassom Vascular (Doppler)' },
              { id: 37, imagem: 'eletrocardiograma.jpg', titulo: 'Eletrocardiograma' },
              { id: 38, imagem: 'endoscopia.jpg', titulo: 'Vídeo Endoscopia' },
              { id: 39, imagem: 'ergometrico.jpg', titulo: 'Teste Ergométrico' },
              { id: 40, imagem: 'hemodinamica.jpg', titulo: 'Hemodinâmica' },
              { id: 41, imagem: 'holter.jpg', titulo: 'Holter' },
              { id: 42, imagem: 'mapa.jpg', titulo: 'MAPA' },
            ].map((exame, index) => (
              <div 
                key={exame.id} 
                className="col-lg-4 col-md-6 wow fadeInUp" 
                data-wow-delay={`${0.1 + (index * 0.1)}s`}
              >
                <div className="exame-card">
                  <Link to={`/exames/${exame.id}`} className="exame-link">
                    <div className="exame-image-wrapper">
                      <img 
                        className="exame-image" 
                        src={`/exames/${exame.imagem}`}
                        alt={exame.titulo || 'Exame'} 
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', e.target.src)
                          e.target.style.display = 'none'
                        }}
                      />
                      <div className="exame-overlay">
                        <div className="exame-overlay-content">
                          <i className="fas fa-search-plus mb-2" style={{ fontSize: '2rem' }}></i>
                          <p className="mb-0 fw-bold">Ver Detalhes</p>
                        </div>
                      </div>
                    </div>
                    <div className="exame-info">
                      <h5 className="exame-title">{exame.titulo}</h5>
                      <div className="exame-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Exames End */}
    </>
  )
}

export default Home

