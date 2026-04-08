import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cirurgiasService } from '../services/api'
import '../styles/Exames.css'

function Cirurgias() {
  const [cirurgias, setCirurgias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCirurgias()
  }, [])

  const loadCirurgias = async () => {
    try {
      // Por enquanto, vamos usar dados estáticos
      // Em produção, descomente a linha abaixo
      // const response = await cirurgiasService.getAll()
      // setCirurgias(response.data)
      
      // Dados estáticos baseados nas cirurgias do PHP
      setCirurgias([
        { 
          id: 1, 
          imagem: '1.jpg', 
          titulo: 'Cirurgia Bariatríca',
          descricao: 'Tratamento cirúrgico para obesidade, indicado para pessoas com IMC acima de 35 Kg/m², com técnicas como bypass gástrico e gastrectomia vertical.'
        },
        { 
          id: 2, 
          imagem: '2.jpg', 
          titulo: 'Cirurgia Geral',
          descricao: 'Especialidade que abrange cirurgia abdominal, videolaparoscópia e trauma, tratando hérnias, colecistite, hemorróidas e outras afecções cirúrgicas comuns.'
        },
        { 
          id: 3, 
          imagem: '3.jpg', 
          titulo: 'Cirurgia do Aparelho Digestivo',
          descricao: 'Procedimentos cirúrgicos no sistema gastrointestinal, incluindo apendicectomia, colecistectomia, tratamento de hérnias abdominais e cirurgias intestinais.'
        },
        { 
          id: 4, 
          imagem: '4.jpg', 
          titulo: 'Neurocirurgia',
          descricao: 'Especialidade responsável pelo diagnóstico e tratamento de lesões do cérebro, coluna, medula e nervos periféricos, utilizando técnicas de microcirurgia avançadas.'
        },
        { 
          id: 5, 
          imagem: '5.jpg', 
          titulo: 'Neurocirurgia',
          descricao: 'Tratamento cirúrgico e não cirúrgico de patologias neurológicas, com suporte de tecnologias de neuro-localização e neuro-navegação para máxima segurança.'
        },
        { 
          id: 6, 
          imagem: '6.jpg', 
          titulo: 'Cirurgia Vascular',
          descricao: 'Tratamento de doenças vasculares incluindo varizes, cirurgia endovascular, tratamento a laser e procedimentos em artérias, veias e sistema linfático.'
        },
      ])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar cirurgias:', error)
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
      {/* Cirurgias Start */}
      <div className="container-xxl py-5">
        <div className="container">
          {/* Header Section */}
          <div className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
            <h1 className="display-5 mb-3" style={{ color: '#1C2035', fontWeight: '700' }}>
              <i className="fas fa-procedures me-2" style={{ fontSize: '0.85em' }}></i>NOSSAS CIRURGIAS
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
              <i className="fas fa-info-circle me-1" style={{ color: '#196F75', opacity: 0.7 }}></i>Realizamos diversos procedimentos cirúrgicos com tecnologia avançada e equipe médica especializada
            </p>
          </div>

          {/* Cirurgias Grid */}
          <div className="row g-4">
            {cirurgias.map((cirurgia, index) => (
              <div 
                key={cirurgia.id} 
                className="col-lg-4 col-md-6 wow fadeInUp" 
                data-wow-delay={`${0.1 + (index * 0.1)}s`}
              >
                <div className="exame-card">
                  <Link to={`/cirurgias/${cirurgia.id}`} className="exame-link">
                    <div className="exame-image-wrapper">
                      <img 
                        className="exame-image" 
                        src={`/cirurgias/${cirurgia.imagem}`}
                        alt={cirurgia.titulo || `Cirurgia ${cirurgia.id}`} 
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
                      <h5 className="exame-title">{cirurgia.titulo || `Cirurgia ${cirurgia.id}`}</h5>
                      {cirurgia.descricao && (
                        <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                          {cirurgia.descricao}
                        </p>
                      )}
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
      {/* Cirurgias End */}
    </>
  )
}

export default Cirurgias
