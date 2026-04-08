import '../styles/QuemSomos.css'

function QuemSomos() {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">Quem Somos</h1>
        </div>
      </div>
      {/* Page Header End */}

      {/* História Section Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-12 wow fadeInUp" data-wow-delay="0.1s">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="card-body p-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-box me-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #196F75 0%, #91c6ce 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '28px'
                    }}>
                      <i className="fas fa-hospital"></i>
                    </div>
                    <h2 className="mb-0" style={{ color: '#196F75', fontWeight: '600' }}>
                      Nossa História
                    </h2>
                  </div>
                  
                  <div className="content-text" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555' }}>
                    <p className="mb-4">
                      O <strong style={{ color: '#196F75' }}>Hospital São Francisco de Assis</strong> foi fundado em <strong>1968</strong>, com o objetivo de humanizar o atendimento de seus pacientes e clientes.
                      Desde então, atuamos nas mais diferentes áreas médicas através de consultas, exames e cirurgias e com profissionais especializados.
                    </p>

                    <p className="mb-4">
                      Atualmente, contamos com profissionais especializados nas mais variadas áreas médicas. Além disso, oferecemos o que há de mais moderno
                      e eficiente em equipamentos, bem como em serviços de UTI e pronto-atendimento 24 horas.
                    </p>

                    <p className="mb-0">
                      Essas conquistas representam nosso constante avanço e compromisso com inovação, segurança e qualidade. <strong style={{ color: '#196F75' }}>Tudo pensando em você.</strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-top">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-award me-2" style={{ color: '#196F75', fontSize: '1.5rem' }}></i>
                      <div>
                        <h5 className="mb-1" style={{ color: '#196F75', fontWeight: '600' }}>
                          Hospital São Francisco de Assis 50 anos
                        </h5>
                        <p className="mb-0" style={{ fontSize: '1.1rem', color: '#666', fontStyle: 'italic' }}>
                          Uma história de vidas!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* História Section End */}

      {/* Missão, Visão e Valores Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            {/* Negócio Card */}
            <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="card border-0 shadow-sm h-100" style={{ 
                borderRadius: '15px', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(25, 111, 117, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="icon-box-small me-3" style={{
                      width: '50px',
                      height: '50px',
                      background: '#196F75',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div>
                      <h4 className="mb-2" style={{ color: '#196F75', fontWeight: '600', fontSize: '1.5rem' }}>
                        NEGÓCIO
                      </h4>
                      <p className="mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#555' }}>
                        Prestar assistência médico hospitalar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Missão Card */}
            <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
              <div className="card border-0 shadow-sm h-100" style={{ 
                borderRadius: '15px', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(25, 111, 117, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="icon-box-small me-3" style={{
                      width: '50px',
                      height: '50px',
                      background: '#196F75',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-bullseye"></i>
                    </div>
                    <div>
                      <h4 className="mb-2" style={{ color: '#196F75', fontWeight: '600', fontSize: '1.5rem' }}>
                        MISSÃO
                      </h4>
                      <p className="mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#555' }}>
                        Cuidar de vidas por meio de um atendimento médico-hospitalar humanizado, com foco na excelência e na sustentabilidade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visão Card */}
            <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="card border-0 shadow-sm h-100" style={{ 
                borderRadius: '15px', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(25, 111, 117, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="icon-box-small me-3" style={{
                      width: '50px',
                      height: '50px',
                      background: '#196F75',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-eye"></i>
                    </div>
                    <div>
                      <h4 className="mb-2" style={{ color: '#196F75', fontWeight: '600', fontSize: '1.5rem' }}>
                        VISÃO
                      </h4>
                      <p className="mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#555' }}>
                        Ser reconhecido nacionalmente pela excelência no atendimento médico-hospitalar, através da qualidade, da gestão e do crescimento continuo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Valores Card */}
            <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.4s">
              <div className="card border-0 shadow-sm h-100" style={{ 
                borderRadius: '15px', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(25, 111, 117, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
              }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="icon-box-small me-3" style={{
                      width: '50px',
                      height: '50px',
                      background: '#196F75',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-heart"></i>
                    </div>
                    <div>
                      <h4 className="mb-3" style={{ color: '#196F75', fontWeight: '600', fontSize: '1.5rem' }}>
                        VALORES
                      </h4>
                      <div className="values-list">
                        <div className="row g-2">
                          {['Ética', 'Sustentabilidade', 'Foco nos Resultados', 'Competência', 'Humanização', 'Bom senso', 'Trabalho em equipe'].map((valor, index) => (
                            <div key={index} className="col-12 col-sm-6">
                              <div className="value-item d-flex align-items-center" style={{
                                padding: '8px 12px',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                marginBottom: '8px'
                              }}>
                                <i className="fas fa-check-circle me-2" style={{ color: '#196F75', fontSize: '0.9rem' }}></i>
                                <span style={{ fontSize: '0.95rem', color: '#555' }}>{valor}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Missão, Visão e Valores End */}
    </>
  )
}

export default QuemSomos
