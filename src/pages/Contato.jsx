import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { analytics } from '../hooks/useAnalytics'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    celular: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const recaptchaRef = useRef(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Obter token do reCAPTCHA
    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setMessage({ type: 'error', text: 'Por favor, confirme que você não é um robô.' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken })
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro ao enviar mensagem')
      }

      setMessage({
        type: 'success',
        text: data.message || 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      })
      setFormData({ nome: '', email: '', assunto: '', celular: '', message: '' })
      recaptchaRef.current?.reset()
      analytics.contatoEnviado()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao enviar mensagem. Por favor, tente novamente ou envie um e-mail para sac@hsfasaude.com.br'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">Fale Conosco</h1>
        </div>
      </div>
      {/* Page Header End */}

      {/* Contact Form Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <h1 className="display-5 mb-4"><i className="fas fa-comments me-2" style={{ color: '#196F75' }}></i>Faça seu Relato</h1>
              <p>
                Este é um canal exclusivo do Hospital São Francisco de Assis para você realizar o seu relato sobre nossos serviços,
                elogios, sugestões ou reclamações. A veracidade das informações providas é uma responsabilidade do relator.
              </p>
              <p>Se preferir, envie um e-mail para <i className="fas fa-envelope me-1"></i><strong>sac@hsfasaude.com.br.</strong></p>
              <a
                style={{ marginTop: '25px' }}
                className="d-inline-flex align-items-center rounded overflow-hidden border border-primary"
                href="tel:+556232218000"
              >
                <span className="btn-lg-square bg-primary" style={{ width: '55px', height: '55px' }}></span>
                <span className="fs-5 fw-medium mx-4"><i className="fas fa-phone-alt me-2"></i>+55 (62) 3221-8000</span>
              </a>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
              <form onSubmit={handleSubmit} noValidate={false}>
                <h2 className="mb-4"><i className="fas fa-paper-plane me-2" style={{ color: '#196F75' }}></i>Envie Sua Mensagem</h2>

                {message.text && (
                  <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
                    {message.text}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" name="nome" id="name" placeholder="Seu Nome" value={formData.nome} onChange={handleChange} maxLength={100} required />
                      <label htmlFor="name"><i className="fas fa-user me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Nome</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input type="email" className="form-control" name="email" id="mail" placeholder="Seu E-mail" value={formData.email} onChange={handleChange} maxLength={150} required />
                      <label htmlFor="mail"><i className="fas fa-envelope me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>E-mail</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" name="assunto" placeholder="Assunto" value={formData.assunto} onChange={handleChange} maxLength={200} required />
                      <label htmlFor="assunto"><i className="fas fa-tag me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Assunto</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" name="celular" id="mobile" placeholder="Celular" value={formData.celular} onChange={handleChange} maxLength={20} pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}" title="Formato: (XX) XXXXX-XXXX" required />
                      <label htmlFor="mobile"><i className="fas fa-mobile-alt me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Celular</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea className="form-control" placeholder="Deixe sua mensagem aqui" name="message" id="message" style={{ height: '130px' }} value={formData.message} onChange={handleChange} maxLength={2000} required></textarea>
                      <label htmlFor="message"><i className="fas fa-comment-dots me-2" style={{ color: '#196F75', opacity: 0.7 }}></i>Mensagem</label>
                    </div>
                  </div>
                  {/* reCAPTCHA v2 */}
                  <div className="col-12 d-flex justify-content-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      hl="pt-BR"
                    />
                  </div>
                  <div className="col-12 text-center">
                    <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...</>
                      ) : (
                        <><i className="fas fa-paper-plane me-2"></i>Enviar Mensagem</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form End */}
    </>
  )
}

export default Contato
