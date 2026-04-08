import { useState, useEffect } from 'react'
import { editaisService } from '../services/api'
import '../styles/Editais.css'

function Editais() {
  const [editais, setEditais] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEditais()
  }, [])

  const loadEditais = async () => {
    try {
      // Por enquanto, vamos usar dados estáticos
      // Em produção, descomente a linha abaixo
      // const response = await editaisService.getAll()
      // setEditais(response.data)
      
      // Dados estáticos baseados nos editais do PHP
      setEditais([
        {
          titulo: 'Relatório de Transparência e Igualdade Salarial de Mulheres e Homens',
          descricao: 'Visualize aqui o Relatório de Transparência e Igualdade Salarial de Mulheres e Homens - 1º Semestre 2025',
          cnpj: '01625151000106',
          arquivo: 'Relatorio_de_Transparencia_e_Igualdade_Salarial_de_Mulheres_e_Homens-1_Semestre_2025.pdf',
          tipo: 'pdf',
          periodo: '1º Semestre 2025'
        },
        {
          titulo: 'Relatório de Transparência e Igualdade Salarial de Mulheres e Homens',
          descricao: 'Visualize aqui o Relatório de Transparência e Igualdade Salarial de Mulheres e Homens - 2º Semestre 2025',
          cnpj: '01625151000106',
          arquivo: 'Relatorio_de_Transparencia_e_Igualdade_Salarial_de_Mulheres_e_Homens-2_Semestre_2025.pdf',
          tipo: 'pdf',
          periodo: '2º Semestre 2025'
        },
        {
          titulo: 'Relatório de Transparência e Igualdade Salarial de Mulheres e Homens',
          descricao: 'Visualize aqui o Relatório de Transparência e Igualdade Salarial de Mulheres e Homens - 1º Semestre 2024',
          cnpj: '01625151000106',
          arquivo: 'Relatorio_de_Transparencia_e_Igualdade_Salarial_de_Mulheres_e_Homens-1_Semestre_2024.jpeg',
          tipo: 'jpeg',
          periodo: '1º Semestre 2024'
        },
        {
          titulo: 'Relatório de Transparência e Igualdade Salarial de Mulheres e Homens',
          descricao: 'Visualize aqui o Relatório de Transparência e Igualdade Salarial de Mulheres e Homens - 2º Semestre 2024',
          cnpj: '01625151000106',
          arquivo: 'Relatorio_de_Transparencia_e_Igualdade_Salarial_de_Mulheres_e_Homens-2_Semestre_2024.pdf',
          tipo: 'pdf',
          periodo: '2º Semestre 2024'
        },
      ])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar editais:', error)
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
      {/* Editais Start */}
      <div className="container-xxl py-5">
        <div className="container">
          {/* Header Section */}
          <div className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
            <h1 className="display-5 mb-3" style={{ color: '#1C2035', fontWeight: '700' }}>
              <i className="fas fa-file-contract me-2" style={{ fontSize: '0.85em' }}></i>EDITAIS E RELATÓRIOS
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
            <p className="lead text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <i className="fas fa-info-circle me-1" style={{ color: '#196F75', opacity: 0.7 }}></i>Acesse os editais e relatórios de transparência do Hospital São Francisco de Assis
            </p>
          </div>

          {/* Editais Grid */}
          <div className="row g-4">
            {editais.map((edital, index) => (
              <div 
                key={index} 
                className="col-lg-12 col-md-12 wow fadeInUp" 
                data-wow-delay={`${0.1 + (index * 0.1)}s`}
              >
                <div className="edital-card">
                  <div className="edital-content">
                    {/* Ícone do Tipo */}
                    <div className="edital-icon-wrapper">
                      <div className={`edital-icon ${edital.tipo === 'pdf' ? 'pdf-icon' : 'image-icon'}`}>
                        {edital.tipo === 'pdf' ? (
                          <i className="fas fa-file-pdf"></i>
                        ) : (
                          <i className="fas fa-file-image"></i>
                        )}
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="edital-info">
                      <div className="edital-header">
                        <h5 className="edital-title">{edital.titulo}</h5>
                        {edital.periodo && (
                          <span className="edital-periodo">
                            <i className="fas fa-calendar-alt me-2"></i>
                            {edital.periodo}
                          </span>
                        )}
                      </div>
                      <p className="edital-descricao">{edital.descricao}</p>
                      <div className="edital-meta">
                        <span className="edital-cnpj">
                          <i className="fas fa-building me-2"></i>
                          CNPJ: {edital.cnpj}
                        </span>
                        <span className="edital-tipo">
                          <i className={`fas fa-${edital.tipo === 'pdf' ? 'file-pdf' : 'file-image'} me-2`}></i>
                          {edital.tipo.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Botão de Ação */}
                    <div className="edital-action">
                      <a 
                        href={`/administrar/foto_editais/${edital.arquivo}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-edital"
                      >
                        <i className="fas fa-eye me-2"></i>
                        Ver Relatório
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Editais End */}
    </>
  )
}

export default Editais
