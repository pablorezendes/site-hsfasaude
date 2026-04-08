import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { examesService } from '../services/api'
import '../styles/Exames.css'

function Exames() {
  const [exames, setExames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExames()
  }, [])

  const loadExames = async () => {
    try {
      // Por enquanto, vamos usar dados estáticos já que não temos backend configurado
      // Em produção, descomente a linha abaixo e configure o backend
      // const response = await examesService.getAll()
      // setExames(response.data)
      
      // Dados estáticos baseados nos exames da home
      // Usando as imagens da pasta /exames/ que existem e funcionam
      setExames([
        { id: 29, imagem: 'tc.jpg', titulo: 'Tomografia Computadorizada' },
        { id: 33, imagem: 'angio.jpg', titulo: 'Angiotomografia das Coronárias' },
        { id: 28, imagem: 'rm.jpg', titulo: 'Ressonância Magnética' },
        { id: 22, imagem: 'ecocardio.jpg', titulo: 'Ecocardiograma' },
        { id: 30, imagem: 'ultrassom_geral.jpg', titulo: 'Ultrassom Geral' },
        { id: 35, imagem: 'densitometria.jpg', titulo: 'Densitometria Óssea' },
      ])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar exames:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Exames Start */}
      <div className="container-xxl py-5">
        <div className="container">
          {/* Header Section */}
          <div className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
            <h1 className="display-5 mb-3" style={{ color: '#1C2035', fontWeight: '700' }}>
              <i className="fas fa-microscope me-2" style={{ fontSize: '0.85em' }}></i>NOSSOS EXAMES
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
              <i className="fas fa-info-circle me-1" style={{ color: '#196F75', opacity: 0.7 }}></i>Oferecemos uma ampla gama de exames diagnósticos com tecnologia de ponta e profissionais especializados
            </p>
          </div>

          {/* Exames Grid */}
          <div className="row g-4">
            {exames.map((exame, index) => (
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

export default Exames
