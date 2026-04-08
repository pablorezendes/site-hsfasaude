/**
 * Google Analytics 4 - Hook para rastreamento em SPA (React Router)
 * Dispara pageview a cada mudança de rota + eventos customizados
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_ID = 'G-YL9QTP6MZW'

// Verificar se gtag está disponível
function gtag() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...arguments)
  }
}

/**
 * Hook: rastreia pageview a cada mudança de rota
 */
export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    gtag('config', GA_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    })
  }, [location])
}

/**
 * Enviar evento customizado para o GA4
 * @param {string} eventName - Nome do evento (ex: 'form_submit', 'whatsapp_click')
 * @param {object} params - Parâmetros extras
 */
export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, params)
}

// Eventos pré-definidos para o site HSFA
export const analytics = {
  // Formulários
  contatoEnviado: () => trackEvent('form_submit', {
    form_name: 'contato_sac',
    form_destination: 'sac@hsfasaude.com.br',
  }),

  pesquisaEnviada: (nps) => trackEvent('form_submit', {
    form_name: 'pesquisa_satisfacao',
    nps_score: nps,
  }),

  // WhatsApp
  whatsappClick: (origin) => trackEvent('whatsapp_click', {
    click_origin: origin, // 'float_button', 'footer', 'menu_mobile'
  }),

  // Navegação
  exameViewed: (exameName) => trackEvent('view_item', {
    item_category: 'exame',
    item_name: exameName,
  }),

  cirurgiaViewed: (surgeryName) => trackEvent('view_item', {
    item_category: 'cirurgia',
    item_name: surgeryName,
  }),

  // Downloads
  guiaPacienteDownload: () => trackEvent('file_download', {
    file_name: 'guia_paciente',
    file_extension: 'pdf',
  }),

  relatorioViewed: (periodo) => trackEvent('file_download', {
    file_name: 'relatorio_transparencia',
    file_extension: 'pdf',
    periodo: periodo,
  }),

  // Assinaturas
  assinaturaSalva: () => trackEvent('form_submit', {
    form_name: 'assinatura_digital',
  }),

  // Resultados externos
  resultadosClick: () => trackEvent('outbound_link', {
    link_url: 'https://pacs.hsfasaude.com.br',
    link_text: 'Resultados Online',
  }),
}

export default usePageTracking
