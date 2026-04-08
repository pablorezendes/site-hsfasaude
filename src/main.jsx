import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './styles/Buttons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Aguardar o DOM estar pronto antes de renderizar
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error('Elemento #root não encontrado!');
}

