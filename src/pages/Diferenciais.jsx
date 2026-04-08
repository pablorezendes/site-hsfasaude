function Diferenciais() {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">Diferenciais</h1>
        </div>
      </div>
      {/* Page Header End */}

      {/* Diferenciais Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center text-md-start pb-5 pb-md-0 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '500px' }}>
            <p className="fs-5 fw-medium text-primary">HSFA-SAÚDE</p>
            <h1 className="display-5 mb-5"><i className="fas fa-medal me-2" style={{ fontSize: '0.85em', color: '#196F75' }}></i>DIFERENCIAIS</h1>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item rounded overflow-hidden pb-4">
                <img className="img-fluid mb-4" src="/diferenciais/planoSeguranca.jpg" alt="Plano de Segurança" />
                <h5><i className="fas fa-shield-alt me-2" style={{ color: '#196F75' }}></i>Plano de Segurança ao Paciente</h5>
                <span style={{ color: 'black' }}>
                  O Hospital possui o Plano de Segurança ao Paciente e Gestão de Riscos para prevenção de complicações decorrentes da hospitalização.
                </span>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item rounded overflow-hidden pb-4">
                <img className="img-fluid mb-4" src="/diferenciais/acomodacoes.jpg" alt="Acomodações" />
                <h5><i className="fas fa-bed me-2" style={{ color: '#196F75' }}></i>Acomodações</h5>
                <span style={{ color: 'black' }}>Contamos com leitos de enfermaria, apartamentos e UTI.</span>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item rounded overflow-hidden pb-4">
                <img className="img-fluid mb-4" src="/diferenciais/utiHumanizada.jpg" alt="UTI Humanizada" />
                <h5><i className="fas fa-heartbeat me-2" style={{ color: '#196F75' }}></i>UTI humanizada</h5>
                <span style={{ color: 'black' }}>
                  Como forma de valorizar o paciente, o Hospital São Francisco de Assis oferece uma UTI humanizada.
                </span>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item rounded overflow-hidden pb-4">
                <img className="img-fluid mb-4" src="/diferenciais/farmacia.png" alt="Farmácia Clínica" />
                <h5><i className="fas fa-pills me-2" style={{ color: '#196F75' }}></i>Farmácia Clínica</h5>
                <span style={{ color: 'black' }}>
                  Contamos com serviço de Farmácia Clínica para maior segurança do paciente.
                </span>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item rounded overflow-hidden pb-4">
                <img className="img-fluid mb-4" src="/diferenciais/equipeMultidiciplinar.jpg" alt="Equipe Multidisciplinar" />
                <h5><i className="fas fa-users me-2" style={{ color: '#196F75' }}></i>Equipe Multidisciplinar</h5>
                <span style={{ color: 'black' }}>
                  O grupo é composto por médicos, enfermeiros, nutricionistas, farmacêuticos, fisioterapeutas, entre outros profissionais da área da saúde.
                </span>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item rounded overflow-hidden pb-4">
                <img className="img-fluid mb-4" src="/diferenciais/prontoSocorro.jpg" alt="Pronto Socorro" />
                <h5><i className="fas fa-ambulance me-2" style={{ color: '#196F75' }}></i>Pronto Socorro 24 horas</h5>
                <span style={{ color: 'black' }}>
                  O pronto socorro de urgências e emergências do Hospital São Francisco de Assis funciona 24 horas por dia durante todos os dias da semana.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Diferenciais End */}
    </>
  )
}

export default Diferenciais

