import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import QuemSomos from './pages/QuemSomos'
import Exames from './pages/Exames'
import VerExame from './pages/VerExame'
import Cirurgias from './pages/Cirurgias'
import VerCirurgia from './pages/VerCirurgia'
import Diferenciais from './pages/Diferenciais'
import Editais from './pages/Editais'
import Contato from './pages/Contato'
import PesquisaSatisfacao from './pages/PesquisaSatisfacao'
import Assinaturas from './pages/Assinaturas'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/exames" element={<Exames />} />
          <Route path="/exames/:id" element={<VerExame />} />
          <Route path="/cirurgias" element={<Cirurgias />} />
          <Route path="/cirurgias/:id" element={<VerCirurgia />} />
          <Route path="/diferenciais" element={<Diferenciais />} />
          <Route path="/editais" element={<Editais />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/pesquisa-satisfacao" element={<PesquisaSatisfacao />} />
          <Route path="/assinaturas" element={<Assinaturas />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

