import axios from 'axios'

// Configuração base da API
// Em produção, isso deve apontar para o backend PHP ou uma API Node.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Serviços de API
export const examesService = {
  getAll: () => api.get('/exames.php'),
  getById: (id) => api.get(`/exames.php?id=${id}`),
}

export const cirurgiasService = {
  getAll: () => api.get('/cirurgias.php'),
  getById: (id) => api.get(`/cirurgias.php?id=${id}`),
}

export const editaisService = {
  getAll: () => api.get('/editais.php'),
}

export const contatoService = {
  send: (data) => api.post('/enviaMensagem.php', data),
  sendPesquisa: (data) => api.post('/enviaPesquisa.php', data),
}

export default api

