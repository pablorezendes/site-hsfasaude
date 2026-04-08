# HSFA Saúde - Site React

Site institucional do Hospital São Francisco de Assis convertido de PHP para React.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **Font Awesome** - Ícones
- **WOW.js** - Animações ao scroll

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

## 🏃 Executar em desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 📦 Build para produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

## 📁 Estrutura do Projeto

```
├── public_html/          # Assets do projeto original (imagens, CSS, etc)
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Layout.jsx
│   │   ├── Topbar.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── WhatsAppFloat.jsx
│   │   └── BackToTop.jsx
│   ├── pages/           # Páginas do site
│   │   ├── Home.jsx
│   │   ├── QuemSomos.jsx
│   │   ├── Exames.jsx
│   │   ├── VerExame.jsx
│   │   ├── Cirurgias.jsx
│   │   ├── VerCirurgia.jsx
│   │   ├── Diferenciais.jsx
│   │   ├── Editais.jsx
│   │   ├── Contato.jsx
│   │   └── PesquisaSatisfacao.jsx
│   ├── services/        # Serviços de API
│   │   └── api.js
│   ├── App.jsx         # Componente principal com rotas
│   ├── main.jsx        # Ponto de entrada
│   └── index.css       # Estilos globais
├── index.html
├── package.json
└── vite.config.js
```

## 🔌 Configuração da API

Para conectar com o backend PHP, crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost/api
```

Ou configure diretamente no arquivo `src/services/api.js`.

## 📝 Notas Importantes

1. **Assets**: As imagens e arquivos estáticos estão na pasta `public_html/`. Certifique-se de que o servidor está configurado para servir esses arquivos.

2. **Backend**: Atualmente, o projeto usa dados estáticos. Para usar dados reais do banco de dados, você precisa:
   - Criar endpoints API no backend PHP ou Node.js
   - Configurar a URL da API no arquivo `.env`
   - Descomentar as chamadas de API nos componentes

3. **WOW.js**: As animações WOW.js são carregadas via CDN no `index.html`. Certifique-se de que está funcionando corretamente.

## 🎨 Funcionalidades Implementadas

- ✅ Página inicial com carousel
- ✅ Página "Quem Somos"
- ✅ Listagem de exames
- ✅ Detalhes de exames
- ✅ Listagem de cirurgias
- ✅ Detalhes de cirurgias
- ✅ Página de diferenciais
- ✅ Página de editais
- ✅ Formulário de contato
- ✅ Navegação responsiva
- ✅ Botão flutuante do WhatsApp
- ✅ Botão "Voltar ao topo"
- ✅ Footer completo

## 🔄 Próximos Passos

- [ ] Conectar com backend PHP existente
- [ ] Implementar pesquisa de satisfação completa
- [ ] Adicionar área administrativa em React
- [ ] Otimizar imagens
- [ ] Implementar SEO
- [ ] Adicionar testes

## 📄 Licença

Este projeto foi desenvolvido para o Hospital São Francisco de Assis.

