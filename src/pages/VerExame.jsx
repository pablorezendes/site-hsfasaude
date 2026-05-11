import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { examesService } from '../services/api'

function VerExame() {
  const { id } = useParams()
  const [exame, setExame] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExame()
  }, [id])

  const loadExame = async () => {
    try {
      // Por enquanto, vamos usar dados estáticos
      // Em produção, descomente a linha abaixo
      // const response = await examesService.getById(id)
      // setExame(response.data)
      
      // Dados estáticos de exemplo
      const examesData = {
        29: { titulo: 'Tomografia Computadorizada', descricao: 'A Tomografia Computadorizada é um exame de imagem que utiliza raios-X para criar imagens detalhadas de estruturas internas do corpo. É amplamente utilizada para diagnosticar diversas condições médicas.', imagem: 'tc.jpg' },
        33: { titulo: 'Angiotomografia das Coronárias', descricao: 'A Angiotomografia das Coronárias é um exame não invasivo que avalia as artérias coronárias, permitindo identificar obstruções e doenças cardíacas.', imagem: 'angio.jpg' },
        28: { titulo: 'Ressonância Magnética', descricao: 'A Ressonância Magnética utiliza campos magnéticos e ondas de rádio para produzir imagens detalhadas de órgãos e tecidos do corpo, sem uso de radiação ionizante.', imagem: 'rm.jpg' },
        22: { titulo: 'Ecocardiograma', descricao: 'O Ecocardiograma é um exame de ultrassom do coração que avalia a estrutura e função cardíaca, sendo essencial para o diagnóstico de doenças cardíacas.', imagem: 'ecocardio.jpg' },
        30: { titulo: 'Ultrassom Geral', descricao: 'O Ultrassom Geral utiliza ondas sonoras de alta frequência para criar imagens de órgãos internos, sendo um exame seguro e não invasivo.', imagem: 'ultrassom_geral.jpg' },
        35: { titulo: 'Densitometria Óssea', descricao: 'A Densitometria Óssea é o exame padrão para avaliar a densidade mineral óssea e diagnosticar osteoporose e outras condições relacionadas aos ossos.', imagem: 'densitometria.jpg' },
        36: { titulo: 'Ultrassom Vascular (Doppler)', descricao: 'O Ultrassom Vascular com Doppler avalia o fluxo sanguíneo em artérias e veias, sendo fundamental para o diagnóstico de tromboses, varizes, aneurismas e outras alterações vasculares.', imagem: 'doppler.jpg' },
        37: { titulo: 'Eletrocardiograma', descricao: 'O Eletrocardiograma é um exame rápido e indolor que registra a atividade elétrica do coração, auxiliando no diagnóstico de arritmias, isquemias e outras doenças cardíacas.', imagem: 'eletrocardiograma.jpg' },
        38: { titulo: 'Vídeo Endoscopia', descricao: 'A Vídeo Endoscopia Digestiva Alta permite avaliar o esôfago, estômago e duodeno por meio de um aparelho com câmera, sendo essencial para o diagnóstico de gastrites, úlceras e outras alterações do trato digestivo.', imagem: 'endoscopia.jpg' },
        39: { titulo: 'Teste Ergométrico', descricao: 'O Teste Ergométrico avalia a resposta do coração ao esforço físico, sendo indicado para diagnóstico de doenças cardiovasculares, avaliação de aptidão física e acompanhamento de tratamentos.', imagem: 'ergometrico.jpg' },
        40: { titulo: 'Hemodinâmica', descricao: 'O setor de Hemodinâmica realiza procedimentos diagnósticos e terapêuticos minimamente invasivos do sistema cardiovascular, como cateterismo, angioplastia e implante de stents.', imagem: 'hemodinamica.jpg' },
        41: { titulo: 'Holter', descricao: 'O Holter é um exame que monitora continuamente o ritmo cardíaco por 24 horas ou mais, sendo indicado para investigação de palpitações, desmaios e arritmias intermitentes.', imagem: 'holter.jpg' },
      }
      
      setExame(examesData[id] || examesData[29])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar exame:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!exame) {
    return (
      <div className="container-xxl py-5">
        <div className="container text-center">
          <h2>Exame não encontrado</h2>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown"><i className="fas fa-microscope me-2"></i>Ver Exames</h1>
        </div>
      </div>
      {/* Page Header End */}

      {/* Content Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <img 
                className="img-fluid mb-4" 
                src={`/exames/${exame.imagem}`}
                alt={exame.titulo}
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', e.target.src)
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
              <h2 className="mb-4">{exame.titulo}</h2>
              <p>{exame.descricao}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Content End */}
    </>
  )
}

export default VerExame

