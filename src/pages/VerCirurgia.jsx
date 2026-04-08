import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { cirurgiasService } from '../services/api'
import '../styles/VerCirurgia.css'

function VerCirurgia() {
  const { id } = useParams()
  const [cirurgia, setCirurgia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCirurgia()
  }, [id])

  const loadCirurgia = async () => {
    try {
      // Dados estáticos com informações detalhadas de cada cirurgia
      const cirurgiasData = {
        '1': {
          id: 1,
          imagem: '1.jpg',
          titulo: 'Cirurgia Bariatríca',
          descricao: 'Tratamento cirúrgico para obesidade com técnicas avançadas',
          introducao: 'A cirurgia bariátrica, normalmente, é indicada para pessoas com obesidade de grau 2, que não mostraram resultados após vários meses de tratamento com dieta adequada e prática de exercício físico regular.',
          indicacoes: [
            'IMC acima de 35 Kg/m², com complicações como apneia do sono, hipertensão arterial, diabetes, aumento de gorduras no sangue e problemas articulares',
            'IMC maior que 40 Kg/m², sem sucesso na perda de peso após dois anos de tratamento clínico (incluindo o uso de medicamentos)'
          ],
          vantagens: [
            'Perda significativa de peso',
            'Melhoria e cura de hipertensão arterial',
            'Melhoria de insuficiência cardíaca',
            'Melhoria de insuficiência respiratória',
            'Melhoria de asma',
            'Controle de diabetes',
            'Redução de colesterol alto',
            'Diminuição do risco de depressão',
            'Aumento da autoestima e mobilidade física'
          ],
          tipos: [
            {
              nome: 'Banda Gástrica',
              descricao: 'Tipo menos invasivo que consiste em colocar um anel em volta do estômago, diminuindo seu tamanho. Apresenta menos riscos e recuperação mais rápida.'
            },
            {
              nome: 'Bypass Gástrico',
              descricao: 'Cirurgia invasiva que retira uma grande parte do estômago e liga o intestino à porção restante. Permite perder até 70% do peso inicial.'
            },
            {
              nome: 'Gastrectomia Vertical',
              descricao: 'Remove parte do estômago mantendo a ligação natural ao intestino. Tem menos riscos que o bypass e permite perder cerca de 40% do peso inicial.'
            },
            {
              nome: 'Derivação Biliopancreática',
              descricao: 'Retira parte do estômago e maior parte do intestino delgado, reduzindo significativamente a absorção de nutrientes e calorias.'
            }
          ],
          idade: 'Entre 16 e 65 anos'
        },
        '2': {
          id: 2,
          imagem: '2.jpg',
          titulo: 'Cirurgia Geral',
          descricao: 'Especialidade que abrange cirurgia abdominal, videolaparoscópia e trauma',
          introducao: 'Cirurgia Geral é a área médica que abrange: Cirurgia Abdominal, Cirurgia videolaparoscópia e Cirurgia do Trauma. Esta especialidade médica estuda os mecanismos fisiopatológicos, diagnósticos e tratamentos de enfermidades passíveis de abordagem por procedimentos cirúrgicos.',
          procedimentos: [
            'Hérnia inguinal',
            'Hérnia umbilical',
            'Hérnia epigástrica',
            'Colelitíase (pedra na vesícula)',
            'Colecistite',
            'Hemorróidas',
            'Doenças diverticular dos cólons',
            'Diverticulite aguda',
            'Úlcera gástrica',
            'Traumas'
          ],
          areas: [
            {
              nome: 'Cirurgia Abdominal',
              descricao: 'Tratamento cirúrgico de afecções do abdômen'
            },
            {
              nome: 'Cirurgia Videolaparoscópia',
              descricao: 'Técnica minimamente invasiva com pequenos cortes'
            },
            {
              nome: 'Cirurgia do Trauma',
              descricao: 'Tratamento de lesões traumáticas'
            }
          ]
        },
        '3': {
          id: 3,
          imagem: '3.jpg',
          titulo: 'Cirurgia do Aparelho Digestivo',
          descricao: 'Procedimentos cirúrgicos no sistema gastrointestinal',
          introducao: 'As cirurgias do aparelho digestivo são procedimentos cirúrgicos realizados no sistema gastrointestinal para tratar uma variedade de condições médicas, que vão desde doenças benignas até condições mais graves.',
          procedimentos: [
            {
              nome: 'Apendicectomia',
              descricao: 'Remoção do apêndice, geralmente devido a uma inflamação aguda chamada apendicite'
            },
            {
              nome: 'Cirurgia de Hérnia Abdominal',
              descricao: 'Correção cirúrgica de hérnias (inguinal, umbilical, hiatal) para evitar complicações'
            },
            {
              nome: 'Colecistectomia',
              descricao: 'Remoção da vesícula biliar, geralmente devido a cálculos biliares que causam dor ou complicações'
            },
            {
              nome: 'Cirurgia de Refluxo Gastroesofágico',
              descricao: 'Correção de hérnia hiatal e redução do refluxo ácido crônico por meio de fundoplicatura'
            },
            {
              nome: 'Cirurgia do Intestino Delgado',
              descricao: 'Ressecção intestinal para tratar doenças como doença de Crohn ou câncer'
            },
            {
              nome: 'Cirurgia do Cólon e Reto',
              descricao: 'Remoção de pólipos, tratamento de doenças inflamatórias intestinais ou ressecção do cólon devido a câncer colorretal'
            }
          ]
        },
        '4': {
          id: 4,
          imagem: '4.jpg',
          titulo: 'Neurocirurgia',
          descricao: 'Especialidade responsável pelo diagnóstico e tratamento de lesões neurológicas',
          introducao: 'A neurocirurgia é a especialidade da área médica que está responsável pelo diagnóstico e tratamento de indivíduos que apresentem lesões ou patologias referentes ao cérebro, coluna, medula e nervos periféricos e das doenças da coluna vertebral de natureza degenerativa (como a hérnia discal), infeciosa ou tumoral.',
          caracteristicas: [
            'Tratamento cirúrgico e não cirúrgico',
            'Aplicação de técnicas de microcirurgia',
            'Suporte de tecnologias de neuro-localização e neuro-navegação',
            'Avaliação global e integrada de cada caso',
            'Articulação com outras especialidades médicas'
          ],
          especialidadesRelacionadas: [
            'Endocrinologia',
            'Neurologia',
            'Oncologia',
            'Otorrinolaringologia',
            'Oftalmologia'
          ],
          tratamentos: [
            'Lesões do cérebro',
            'Doenças da coluna vertebral',
            'Hérnia discal',
            'Lesões da medula espinhal',
            'Nervos periféricos',
            'Patologias infecciosas',
            'Tumores neurológicos'
          ]
        },
        '5': {
          id: 5,
          imagem: '5.jpg',
          titulo: 'Neurocirurgia',
          descricao: 'Tratamento cirúrgico e não cirúrgico de patologias neurológicas',
          introducao: 'Oficialmente, esta área é definida como a especialidade cirúrgica cujo tratamento pode ser cirúrgico ou não cirúrgico, não inclui somente a intervenção cirúrgica como tratamento, mas também a prevenção, o diagnóstico, a avaliação do paciente e a reabilitação.',
          caracteristicas: [
            'Prevenção de doenças neurológicas',
            'Diagnóstico preciso',
            'Avaliação completa do paciente',
            'Reabilitação neurológica',
            'Técnicas de microcirurgia avançadas',
            'Tecnologias de neuro-localização',
            'Neuro-navegação para máxima segurança'
          ],
          beneficios: [
            'Maior segurança do paciente',
            'Aumento da eficácia da intervenção',
            'Avaliação global e integrada',
            'Tratamento multidisciplinar'
          ]
        },
        '6': {
          id: 6,
          imagem: '6.jpg',
          titulo: 'Cirurgia Vascular',
          descricao: 'Tratamento de doenças vasculares com tecnologia avançada',
          introducao: 'O Hospital São Francisco de Assis conta com serviço de Cirurgia Vascular, que se compara aos mais avançados do mundo, pela qualidade de suas instalações e equipamentos.',
          equipe: [
            'Cirurgiões vasculares especializados',
            'Especialistas em cirurgia endovascular',
            'Especialistas em cirurgia de varizes a laser',
            'Profissionais de ultrassonografia',
            'Fisioterapeutas especializados'
          ],
          tratamentos: [
            'Varizes e vasinhos',
            'Doenças arteriais',
            'Doenças venosas',
            'Doenças linfáticas',
            'Cirurgia endovascular',
            'Tratamento a laser'
          ],
          sistemaCirculatorio: [
            {
              tipo: 'Artérias',
              descricao: 'Carregam o sangue do coração para os tecidos'
            },
            {
              tipo: 'Capilares',
              descricao: 'Vasos minúsculos que fazem a ligação entre artérias e veias'
            },
            {
              tipo: 'Veias',
              descricao: 'Fazem o caminho inverso e devolvem o sangue dos tecidos para o coração'
            }
          ],
          atendimento: [
            'Regime ambulatorial',
            'Internação',
            'Equipe multidisciplinar comprometida'
          ]
        }
      }

      const cirurgiaData = cirurgiasData[id] || { id, imagem: `${id}.jpg`, titulo: `Cirurgia ${id}` }
      setCirurgia(cirurgiaData)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar cirurgia:', error)
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

  if (!cirurgia) {
    return (
      <div className="container-xxl py-5">
        <div className="container text-center">
          <h2>Cirurgia não encontrada</h2>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">{cirurgia.titulo}</h1>
        </div>
      </div>
      {/* Page Header End */}

      {/* Content Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            {/* Imagem */}
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="cirurgia-image-wrapper">
                <img 
                  className="img-fluid rounded" 
                  src={`/cirurgias/${cirurgia.imagem}`}
                  alt={cirurgia.titulo}
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', e.target.src)
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="cirurgia-content">
                <h2 className="mb-4" style={{ color: '#196F75', fontWeight: '700' }}>
                  {cirurgia.titulo}
                </h2>
                
                {cirurgia.descricao && (
                  <p className="lead mb-4" style={{ color: '#666' }}>
                    {cirurgia.descricao}
                  </p>
                )}

                {cirurgia.introducao && (
                  <div className="mb-4">
                    <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', textAlign: 'justify' }}>
                      {cirurgia.introducao}
                    </p>
                  </div>
                )}

                {/* Indicacoes */}
                {cirurgia.indicacoes && (
                  <div className="info-card mb-4">
                    <h5 className="info-card-title">
                      <i className="fas fa-check-circle me-2"></i>
                      Indicações
                    </h5>
                    <ul className="info-list">
                      {cirurgia.indicacoes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Idade */}
                {cirurgia.idade && (
                  <div className="info-card mb-4">
                    <h5 className="info-card-title">
                      <i className="fas fa-user me-2"></i>
                      Faixa Etária
                    </h5>
                    <p className="mb-0">{cirurgia.idade}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vantagens */}
          {cirurgia.vantagens && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.4s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-star me-2"></i>
                    Vantagens da {cirurgia.titulo}
                  </h4>
                  <div className="row g-3">
                    {cirurgia.vantagens.map((vantagem, index) => (
                      <div key={index} className="col-md-6">
                        <div className="advantage-item">
                          <i className="fas fa-check text-success me-2"></i>
                          <span>{vantagem}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tipos de Cirurgia */}
          {cirurgia.tipos && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.5s">
                <h4 className="mb-4" style={{ color: '#196F75', fontWeight: '700' }}>
                  <i className="fas fa-list me-2"></i>
                  Tipos de {cirurgia.titulo}
                </h4>
                <div className="row g-4">
                  {cirurgia.tipos.map((tipo, index) => (
                    <div key={index} className="col-md-6">
                      <div className="type-card">
                        <h5 className="type-card-title">{tipo.nome}</h5>
                        <p className="type-card-desc">{tipo.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Procedimentos */}
          {cirurgia.procedimentos && Array.isArray(cirurgia.procedimentos) && cirurgia.procedimentos.length > 0 && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.6s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-procedures me-2"></i>
                    Procedimentos Realizados
                  </h4>
                  {typeof cirurgia.procedimentos[0] === 'string' ? (
                    <div className="row g-3">
                      {cirurgia.procedimentos.map((proc, index) => (
                        <div key={index} className="col-md-6">
                          <div className="procedure-item">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            <span>{proc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="row g-4">
                      {cirurgia.procedimentos.map((proc, index) => (
                        <div key={index} className="col-md-6">
                          <div className="type-card">
                            <h5 className="type-card-title">{proc.nome}</h5>
                            <p className="type-card-desc">{proc.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Áreas */}
          {cirurgia.areas && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.7s">
                <h4 className="mb-4" style={{ color: '#196F75', fontWeight: '700' }}>
                  <i className="fas fa-hospital me-2"></i>
                  Áreas de Atuação
                </h4>
                <div className="row g-4">
                  {cirurgia.areas.map((area, index) => (
                    <div key={index} className="col-md-4">
                      <div className="type-card">
                        <h5 className="type-card-title">{area.nome}</h5>
                        <p className="type-card-desc">{area.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Características */}
          {cirurgia.caracteristicas && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.8s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-cogs me-2"></i>
                    Características
                  </h4>
                  <div className="row g-3">
                    {cirurgia.caracteristicas.map((caracteristica, index) => (
                      <div key={index} className="col-md-6">
                        <div className="advantage-item">
                          <i className="fas fa-check text-success me-2"></i>
                          <span>{caracteristica}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tratamentos */}
          {cirurgia.tratamentos && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.9s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-stethoscope me-2"></i>
                    Tratamentos Oferecidos
                  </h4>
                  <div className="row g-3">
                    {cirurgia.tratamentos.map((tratamento, index) => (
                      <div key={index} className="col-md-6">
                        <div className="procedure-item">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <span>{tratamento}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Equipe */}
          {cirurgia.equipe && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="1s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-users me-2"></i>
                    Equipe Multidisciplinar
                  </h4>
                  <div className="row g-3">
                    {cirurgia.equipe.map((membro, index) => (
                      <div key={index} className="col-md-6">
                        <div className="advantage-item">
                          <i className="fas fa-user-md text-success me-2"></i>
                          <span>{membro}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sistema Circulatório */}
          {cirurgia.sistemaCirculatorio && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="1.1s">
                <h4 className="mb-4" style={{ color: '#196F75', fontWeight: '700' }}>
                  <i className="fas fa-heartbeat me-2"></i>
                  Sistema Circulatório
                </h4>
                <div className="row g-4">
                  {cirurgia.sistemaCirculatorio.map((sistema, index) => (
                    <div key={index} className="col-md-4">
                      <div className="type-card">
                        <h5 className="type-card-title">{sistema.tipo}</h5>
                        <p className="type-card-desc">{sistema.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Atendimento */}
          {cirurgia.atendimento && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="1.2s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-calendar-check me-2"></i>
                    Modalidades de Atendimento
                  </h4>
                  <div className="row g-3">
                    {cirurgia.atendimento.map((modalidade, index) => (
                      <div key={index} className="col-md-6">
                        <div className="advantage-item">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <span>{modalidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Especialidades Relacionadas */}
          {cirurgia.especialidadesRelacionadas && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="1.3s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-handshake me-2"></i>
                    Especialidades Relacionadas
                  </h4>
                  <div className="row g-3">
                    {cirurgia.especialidadesRelacionadas.map((especialidade, index) => (
                      <div key={index} className="col-md-6">
                        <div className="procedure-item">
                          <i className="fas fa-user-md text-success me-2"></i>
                          <span>{especialidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefícios */}
          {cirurgia.beneficios && (
            <div className="row mt-5">
              <div className="col-12 wow fadeInUp" data-wow-delay="1.4s">
                <div className="info-card">
                  <h4 className="info-card-title mb-4">
                    <i className="fas fa-heart me-2"></i>
                    Benefícios
                  </h4>
                  <div className="row g-3">
                    {cirurgia.beneficios.map((beneficio, index) => (
                      <div key={index} className="col-md-6">
                        <div className="advantage-item">
                          <i className="fas fa-check text-success me-2"></i>
                          <span>{beneficio}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações de Contato */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="contact-card">
                <h4 className="contact-card-title mb-4">
                  <i className="fas fa-phone-alt me-2"></i>
                  Entre em Contato
                </h4>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="contact-item">
                      <i className="fas fa-phone text-primary me-2"></i>
                      <span>(62) 3221-8000</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="contact-item">
                      <i className="fas fa-phone text-primary me-2"></i>
                      <span>(62) 3221-8084</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="contact-item">
                      <i className="fab fa-whatsapp text-success me-2"></i>
                      <span>(62) 99647-6186</span>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="contact-item">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      <span>R. 9-A - St. Aeroporto, Goiânia - GO, 74075-25</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content End */}
    </>
  )
}

export default VerCirurgia
