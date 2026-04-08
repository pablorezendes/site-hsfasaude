import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { analytics } from '../hooks/useAnalytics'
import '../styles/PesquisaSatisfacao.css'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

function PesquisaSatisfacao() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef(null)
  const [formData, setFormData] = useState({
    // Etapa 1: Dados Pessoais
    nome: '',
    email: '',
    celular: '',
    // Etapa 2: Informações da Visita
    data: '',
    leito: '',
    medico: '',
    tipoPaciente: '',
    // Etapa 3: Avaliação Geral
    recomendariaHospital: '5',
    justifiqueAtendimento: '',
    // Etapa 4: Avaliação dos Setores
    notaProntoSocorro: 'Não Utilizei',
    notaRecepcao: 'Não Utilizei',
    notaCadastroInternacao: 'Não Utilizei',
    notaMedicos: 'Não Utilizei',
    notaEnfermagem: 'Não Utilizei',
    notaFisioterapia: 'Não Utilizei',
    notaNutricao: 'Não Utilizei',
    notaAssistenteSocial: 'Não Utilizei',
    notaDiagnosticoImagem: 'Não Utilizei',
    notaHemodinamica: 'Não Utilizei',
    notaCentroCirurgico: 'Não Utilizei',
    notaUti: 'Não Utilizei',
    notaFarmacia: 'Não Utilizei',
    notaHotelaria: 'Não Utilizei',
    notaMaqueiro: 'Não Utilizei',
    notaHigienizacao: 'Não Utilizei',
    notaSeguranca: 'Não Utilizei',
    notaInfraestrutura: 'Não Utilizei',
    // Etapa 5: Comentários Finais
    sugestaoReclamacao: ''
  })

  const totalSteps = 5

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const updateProgress = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100
  }

  const nextStep = () => {
    // Validação básica antes de avançar
    if (currentStep === 1) {
      if (!formData.nome || !formData.email || !formData.celular) {
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
      }
    } else if (currentStep === 2) {
      if (!formData.data || !formData.tipoPaciente) {
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
      }
    } else if (currentStep === 3) {
      if (!formData.justifiqueAtendimento) {
        alert('Por favor, explique o motivo da sua nota.')
        return
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar reCAPTCHA
    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      alert('Por favor, confirme que você não é um robô.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/pesquisa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken })
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro ao enviar pesquisa')
      }

      analytics.pesquisaEnviada(formData.recomendariaHospital)
      alert(data.message || 'Pesquisa enviada com sucesso! Obrigado pela sua avaliação.')
      navigate('/')
    } catch (error) {
      console.error('Erro ao enviar pesquisa:', error)
      alert(error.message || 'Erro ao enviar pesquisa. Tente novamente!')
      recaptchaRef.current?.reset()
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="progress mb-4" style={{ height: '10px', borderRadius: '5px' }}>
        <div 
          className="progress-bar" 
          role="progressbar" 
          style={{ 
            width: `${updateProgress()}%`,
            backgroundColor: '#196F75',
            transition: 'width 0.3s ease'
          }}
        ></div>
      </div>
    )
  }

  const renderStep1 = () => (
    <div className="form-step">
      <h4 className="mb-4"><i className="fas fa-user-circle me-2" style={{ color: '#196F75' }}></i>1. Dados Pessoais</h4>
      <div className="mb-3">
        <label className="form-label"><i className="fas fa-user me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Nome Completo *</label>
        <input
          type="text"
          className="form-control"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label"><i className="fas fa-envelope me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>E-mail *</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          maxLength={150}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label"><i className="fas fa-mobile-alt me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Celular *</label>
        <input
          type="tel"
          className="form-control"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          maxLength={20}
          pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}"
          title="Formato: (XX) XXXXX-XXXX"
          required
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Próximo
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="form-step">
      <h4 className="mb-4"><i className="fas fa-calendar-check me-2" style={{ color: '#196F75' }}></i>2. Informações da Visita</h4>
      <div className="mb-3">
        <label className="form-label"><i className="fas fa-calendar me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Data da Visita *</label>
        <input 
          type="date" 
          className="form-control" 
          name="data" 
          value={formData.data}
          onChange={handleChange}
          required 
        />
      </div>
      <div className="mb-3">
        <label className="form-label"><i className="fas fa-bed me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Leito</label>
        <input
          type="text"
          className="form-control"
          name="leito"
          value={formData.leito}
          onChange={handleChange}
          maxLength={50}
        />
      </div>
      <div className="mb-3">
        <label className="form-label"><i className="fas fa-stethoscope me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Médico Responsável</label>
        <input
          type="text"
          className="form-control"
          name="medico"
          value={formData.medico}
          onChange={handleChange}
          maxLength={150}
        />
      </div>
      <div className="mb-3">
        <label className="form-label"><i className="fas fa-id-badge me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Você é: *</label>
        <select 
          className="form-select" 
          name="tipoPaciente" 
          value={formData.tipoPaciente}
          onChange={handleChange}
          required
        >
          <option value="">Selecione...</option>
          <option value="Paciente">Paciente</option>
          <option value="Acompanhante">Acompanhante</option>
        </select>
      </div>
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
          Anterior
        </button>
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Próximo
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="form-step">
      <h4 className="mb-4"><i className="fas fa-star me-2" style={{ color: '#196F75' }}></i>3. Avaliação Geral</h4>
      <div className="mb-4">
        <label className="form-label">Você recomendaria nosso hospital? (0 a 10) *</label>
        <div className="rating-container" style={{ padding: '10px 0' }}>
          <div className="d-flex justify-content-between mb-2">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
          <input 
            type="range" 
            className="form-range" 
            min="0" 
            max="10" 
            name="recomendariaHospital" 
            value={formData.recomendariaHospital}
            onChange={handleChange}
            required 
          />
          <div className="text-center mt-2">
            <strong>Nota: {formData.recomendariaHospital}</strong>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Por que você deu essa nota? *</label>
        <textarea 
          className="form-control" 
          name="justifiqueAtendimento" 
          rows="3" 
          value={formData.justifiqueAtendimento}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
          Anterior
        </button>
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Próximo
        </button>
      </div>
    </div>
  )

  const renderSetorSelect = (label, name) => {
    const options = ['Não Utilizei', ...Array.from({ length: 11 }, (_, i) => i.toString())]
    return (
      <div className="setor-item mb-3" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <label className="form-label">{label}</label>
        <select 
          className="form-select" 
          name={name}
          value={formData[name]}
          onChange={handleChange}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    )
  }

  const renderStep4 = () => (
    <div className="form-step">
      <h4 className="mb-4"><i className="fas fa-clipboard-list me-2" style={{ color: '#196F75' }}></i>4. Avaliação dos Setores</h4>
      <p className="text-muted mb-4">Avalie os setores que você utilizou durante sua visita (0 a 10)</p>
      
      <div className="setores-grid">
        {/* Grupo: Atendimento */}
        <div className="setor-grupo mb-4">
          <h5 className="mb-3">Atendimento</h5>
          {renderSetorSelect('Pronto Socorro', 'notaProntoSocorro')}
          {renderSetorSelect('Recepção', 'notaRecepcao')}
          {renderSetorSelect('Cadastro/Internação', 'notaCadastroInternacao')}
        </div>

        {/* Grupo: Equipe Médica */}
        <div className="setor-grupo mb-4">
          <h5 className="mb-3">Equipe Médica e Assistencial</h5>
          {renderSetorSelect('Médicos', 'notaMedicos')}
          {renderSetorSelect('Enfermagem', 'notaEnfermagem')}
          {renderSetorSelect('Fisioterapia', 'notaFisioterapia')}
          {renderSetorSelect('Nutrição', 'notaNutricao')}
          {renderSetorSelect('Assistente Social', 'notaAssistenteSocial')}
        </div>

        {/* Grupo: Setores Específicos */}
        <div className="setor-grupo mb-4">
          <h5 className="mb-3">Setores Específicos</h5>
          {renderSetorSelect('Diagnóstico por Imagem', 'notaDiagnosticoImagem')}
          {renderSetorSelect('Hemodinâmica', 'notaHemodinamica')}
          {renderSetorSelect('Centro Cirúrgico', 'notaCentroCirurgico')}
          {renderSetorSelect('UTI', 'notaUti')}
        </div>

        {/* Grupo: Serviços de Apoio */}
        <div className="setor-grupo mb-4">
          <h5 className="mb-3">Serviços de Apoio</h5>
          {renderSetorSelect('Farmácia', 'notaFarmacia')}
          {renderSetorSelect('Hotelaria', 'notaHotelaria')}
          {renderSetorSelect('Maqueiro', 'notaMaqueiro')}
          {renderSetorSelect('Higienização', 'notaHigienizacao')}
          {renderSetorSelect('Segurança', 'notaSeguranca')}
          {renderSetorSelect('Infraestrutura', 'notaInfraestrutura')}
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
          Anterior
        </button>
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Próximo
        </button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="form-step">
      <h4 className="mb-4"><i className="fas fa-pencil-alt me-2" style={{ color: '#196F75' }}></i>5. Comentários Finais</h4>
      <div className="mb-4">
        <label className="form-label">Deixe aqui seus comentários, sugestões ou reclamações:</label>
        <textarea
          className="form-control"
          name="sugestaoReclamacao"
          rows="5"
          value={formData.sugestaoReclamacao}
          onChange={handleChange}
          maxLength={3000}
        ></textarea>
      </div>
      {/* reCAPTCHA v2 */}
      <div className="d-flex justify-content-center mb-4">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          hl="pt-BR"
        />
      </div>
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
          Anterior
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...</>
          ) : (
            <><i className="fas fa-paper-plane me-2"></i>Enviar Avaliação</>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">PESQUISA DE SATISFAÇÃO</h1>
        </div>
      </div>
      {/* Page Header End */}

      {/* Form Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
              <div className="card shadow-lg" style={{ border: 'none', borderRadius: '15px' }}>
                <div className="card-body p-5">
                  <h1 className="text-center mb-4"><i className="fas fa-chart-bar me-2" style={{ color: '#196F75' }}></i>Pesquisa de Satisfação</h1>
                  <p className="text-center text-muted mb-5">
                    <i className="fas fa-lightbulb me-1" style={{ color: '#196F75', opacity: 0.6 }}></i>Sua opinião é muito importante para continuarmos melhorando nossos serviços
                  </p>

                  <form id="pesquisaForm" onSubmit={handleSubmit}>
                    {renderStepIndicator()}

                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form End */}
    </>
  )
}

export default PesquisaSatisfacao
