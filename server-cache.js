import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readFileSync, existsSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
  // Continuar sem cache se Redis não estiver disponível
});

redisClient.on('connect', () => {
  console.log('✅ Redis conectado');
});

// Tentar conectar ao Redis (não bloquear se não estiver disponível)
redisClient.connect().catch(() => {
  console.log('⚠️ Redis não disponível - continuando sem cache');
});

// Middleware para parsing de JSON e FormData
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Função helper para cache
async function getCached(key) {
  try {
    if (redisClient.isOpen) {
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    }
  } catch (error) {
    console.error('Erro ao buscar cache:', error);
  }
  return null;
}

async function setCache(key, value, ttl = 3600) {
  try {
    if (redisClient.isOpen) {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
}

// IMPORTANTE: Rotas específicas devem vir ANTES do express.static para evitar conflitos
// A rota /assinaturas é tratada pelo React Router, não servimos HTML diretamente aqui
// Apenas arquivos específicos como /assinaturas/carimbo.html são servidos diretamente

// API para obter o conteúdo HTML do carimbo (apenas o body)
app.get('/assinaturas/api/conteudo', async (req, res) => {
  try {
    const cacheKey = 'api:assinaturas:conteudo';
    
    // Tentar buscar do cache
    const cached = await getCached(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }
    
    // Verificar primeiro em dist (produção), depois em public (desenvolvimento)
    let carimboPath = join(__dirname, 'dist', 'assinatura', 'carimbo.html');
    if (!existsSync(carimboPath)) {
      carimboPath = join(__dirname, 'public', 'assinatura', 'carimbo.html');
    }
    
    if (!existsSync(carimboPath)) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo carimbo.html não encontrado'
      });
    }
    
    const content = readFileSync(carimboPath, 'utf-8');
    
    // Extrair apenas o conteúdo do body (sem as tags <body>)
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : content;
    
    // Remover scripts do bodyContent (serão adicionados separadamente)
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Extrair scripts do head e body
    const scripts = [];
    const scriptMatches = content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of scriptMatches) {
      scripts.push(match[0]);
    }
    
    // Extrair estilos do head para incluir no HTML
    let styles = [];
    const styleMatches = content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    for (const match of styleMatches) {
      let styleContent = match[1];
      
      // Escopar TODOS os seletores para dentro de #carimbo-content
      // Substituir seletores body e html por #carimbo-content
      styleContent = styleContent.replace(/^(\s*)body\s*\{/gm, '$1#carimbo-content {');
      styleContent = styleContent.replace(/^(\s*)html\s*\{/gm, '$1#carimbo-content {');
      
      // Remover regras que afetam html e body globalmente
      styleContent = styleContent.replace(/html\s*\{[^}]*\}/g, '');
      styleContent = styleContent.replace(/body\s*\{[^}]*\}/g, '');
      
      // Envolver todo o conteúdo de estilo em um escopo #carimbo-content
      // Isso garante que nenhum estilo afete o layout global
      styleContent = `#carimbo-content { ${styleContent} }`;
      
      styles.push(`<style>${styleContent}</style>`);
    }
    
    // Adicionar estilos ao início do bodyContent
    if (styles.length > 0) {
      bodyContent = styles.join('\n') + '\n' + bodyContent;
    }
    
    const responseData = {
      success: true,
      html: bodyContent,
      scripts: scripts
    };
    
    // Salvar no cache (cache por 5 minutos)
    await setCache(cacheKey, responseData, 300);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Cache', 'MISS');
    res.json(responseData);
  } catch (error) {
    console.error('Erro ao ler carimbo.html:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao carregar conteúdo'
    });
  }
});

// API para salvar assinaturas (substitui o PHP)
app.post('/assinaturas/api/salvar', async (req, res) => {
  try {
    const { nome, cargo, empresa, registro, imagem } = req.body;
    
    // Validações
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome é obrigatório'
      });
    }
    
    if (!imagem || imagem.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Imagem da assinatura é obrigatória'
      });
    }
    
    // Diretório onde serão salvos os arquivos
    const diretorio = join(__dirname, 'dist', 'assinatura', 'assinatura');
    
    // Criar diretório se não existir
    if (!existsSync(diretorio)) {
      mkdirSync(diretorio, { recursive: true });
    }
    
    // Limpar o nome para usar como nome de arquivo
    const nomeArquivo = nome.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    
    // Adicionar timestamp para evitar sobrescrita
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const nomeArquivoFinal = `${nomeArquivo}_${timestamp}`;
    
    // Processar a imagem base64
    const imagemBase64 = imagem.replace(/^data:image\/\w+;base64,/, '');
    const imagemBuffer = Buffer.from(imagemBase64, 'base64');
    
    // Salvar a imagem PNG
    const caminhoImagem = join(diretorio, `${nomeArquivoFinal}.png`);
    writeFileSync(caminhoImagem, imagemBuffer);
    
    // Criar conteúdo do arquivo TXT
    const dataHora = new Date().toLocaleString('pt-BR');
    const conteudoTxt = `==============================================
       REGISTRO DE ASSINATURA DIGITAL
==============================================

STATUS: OK

DADOS DO REGISTRO:
----------------------------------------------
Nome: ${nome}
Cargo: ${cargo || 'Não informado'}
Empresa/Instituição: ${empresa || 'Não informado'}
Número de Registro: ${registro || 'Não informado'}
----------------------------------------------

INFORMAÇÕES TÉCNICAS:
----------------------------------------------
Data e Hora: ${dataHora}
Arquivo de Imagem: ${nomeArquivoFinal}.png
IP do Cliente: ${req.ip || req.connection.remoteAddress}
User Agent: ${req.get('user-agent') || 'Não informado'}
----------------------------------------------

Assinatura digital salva com sucesso!
==============================================
`;
    
    // Salvar o arquivo TXT
    const caminhoTxt = join(diretorio, `${nomeArquivoFinal}.txt`);
    writeFileSync(caminhoTxt, conteudoTxt, 'utf-8');
    
    // Invalidar cache relacionado
    try {
      if (redisClient.isOpen) {
        await redisClient.del('page:assinaturas');
      }
    } catch (error) {
      console.error('Erro ao invalidar cache:', error);
    }
    
    // Resposta de sucesso
    res.json({
      success: true,
      message: 'Assinatura salva com sucesso!',
      data: {
        nome_arquivo: nomeArquivoFinal,
        arquivo_imagem: `${nomeArquivoFinal}.png`,
        arquivo_txt: `${nomeArquivoFinal}.txt`,
        data_hora: dataHora,
        status: 'OK'
      }
    });
    
  } catch (error) {
    console.error('Erro ao salvar assinatura:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao salvar a assinatura'
    });
  }
});

// Servir arquivos específicos da pasta assinaturas (HTML, CSS, JS, imagens)
app.get('/assinaturas/:filename', async (req, res) => {
  // Excluir rotas da API
  if (req.path.startsWith('/assinaturas/api/')) {
    return res.status(404).send('API não encontrada');
  }
  
  const filename = req.params.filename;
  const fullPath = join(__dirname, 'dist', 'assinatura', filename);
  
  // Verificar se é um arquivo PHP
  if (filename.endsWith('.php')) {
    if (existsSync(fullPath)) {
      return res.status(503).send(`
        <html>
          <head><title>Arquivo PHP - Configuração Necessária</title></head>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1>⚠️ Arquivo PHP não pode ser executado pelo Node.js</h1>
            <p>Arquivos PHP devem ser servidos diretamente pelo servidor web (Apache/Nginx).</p>
            <p>Verifique a configuração do servidor web para servir arquivos PHP.</p>
            <p><small>Arquivo: ${filename}</small></p>
          </body>
        </html>
      `);
    } else {
      return res.status(404).send('Arquivo PHP não encontrado');
    }
  }
  
  // Cache para arquivos estáticos
  const cacheKey = `file:assinaturas:${filename}`;
  const cached = await getCached(cacheKey);
  
  if (cached) {
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader('X-Cache', 'HIT');
    return res.send(cached.content);
  }
  
  // Para outros arquivos (HTML, CSS, JS, imagens), tentar servir como arquivo estático
  if (existsSync(fullPath)) {
    const ext = extname(filename);
    let contentType = 'text/plain';
    
    if (ext === '.html' || ext === '.htm') {
      contentType = 'text/html';
    } else if (ext === '.css') {
      contentType = 'text/css';
    } else if (ext === '.js') {
      contentType = 'application/javascript';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    }
    
    try {
      const content = readFileSync(fullPath);
      
      // Salvar no cache (arquivos estáticos podem ser cacheados por mais tempo)
      await setCache(cacheKey, { content: content.toString('base64'), contentType }, 3600);
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('X-Cache', 'MISS');
      return res.send(content);
    } catch (error) {
      return res.status(500).send('Erro ao ler arquivo');
    }
  }
  
  return res.status(404).send('Arquivo não encontrado');
});

// Middleware para servir arquivos estáticos com cache
app.use(async (req, res, next) => {
  // Se a requisição é para /assinaturas, não processar com express.static
  if (req.path === '/assinaturas' || req.path === '/assinaturas/' || req.path.startsWith('/assinaturas/')) {
    return next();
  }
  
  // Cache para arquivos estáticos
  const cacheKey = `static:${req.path}`;
  const cached = await getCached(cacheKey);
  
  if (cached) {
    res.setHeader('Content-Type', cached.contentType || 'application/octet-stream');
    res.setHeader('X-Cache', 'HIT');
    return res.send(Buffer.from(cached.content, 'base64'));
  }
  
  // Para outras rotas, usar express.static
  express.static(join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
      const ext = extname(path);
      if (ext === '.jpg' || ext === '.jpeg') {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (ext === '.png') {
        res.setHeader('Content-Type', 'image/png');
      } else if (ext === '.gif') {
        res.setHeader('Content-Type', 'image/gif');
      } else if (ext === '.svg') {
        res.setHeader('Content-Type', 'image/svg+xml');
      } else if (ext === '.ico') {
        res.setHeader('Content-Type', 'image/x-icon');
      }
    },
    redirect: false
  })(req, res, async (err) => {
    if (!err && res.statusCode === 200) {
      // Salvar no cache se foi servido com sucesso
      const contentType = res.getHeader('Content-Type') || 'application/octet-stream';
      // Não cachear arquivos grandes
      if (res.getHeader('Content-Length') && parseInt(res.getHeader('Content-Length')) < 10485760) {
        // Cache por 1 hora para arquivos estáticos
        await setCache(cacheKey, { 
          content: res.body?.toString('base64'), 
          contentType 
        }, 3600);
      }
    }
    next();
  });
});

// Para rotas que não são arquivos estáticos, servir o index.html (necessário para React Router)
app.get('*', async (req, res, next) => {
  // Excluir apenas arquivos específicos de /assinaturas/ (como carimbo.html) do catch-all do React Router
  // Mas permitir que /assinaturas seja tratado pelo React Router
  const isAssinaturasFile = req.path.match(/^\/assinaturas\/[^/]+\.[a-zA-Z]+$/) &&
                            !req.path.startsWith('/assinaturas/api/');
  
  if (isAssinaturasFile) {
    return next();
  }
  
  // Cache para index.html
  const cacheKey = 'page:index';
  const cached = await getCached(cacheKey);
  
  if (cached) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Cache', 'HIT');
    return res.send(cached.content);
  }
  
  // Se a requisição é para um arquivo estático (tem extensão), não servir HTML
  const ext = extname(req.path);
  const isStaticFile = ext && ext.length > 0 && !['.html', '.htm'].includes(ext);
  
  if (isStaticFile) {
    return res.status(404).send('Arquivo não encontrado');
  }
  
  // Para rotas da aplicação React, servir index.html
  try {
    const indexPath = join(__dirname, 'dist', 'index.html');
    
    if (!existsSync(indexPath)) {
      console.error(`Arquivo não encontrado: ${indexPath}`);
      return res.status(500).send(`
        <html>
          <head><title>Erro - Build Necessário</title></head>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1>⚠️ Erro: Build não encontrado</h1>
            <p>O arquivo <code>dist/index.html</code> não existe.</p>
            <p>Execute: <code>npm run build</code> para criar o build de produção.</p>
            <p>Caminho esperado: <code>${indexPath}</code></p>
          </body>
        </html>
      `);
    }
    
    const indexContent = readFileSync(indexPath, 'utf-8');
    
    // Salvar no cache
    await setCache(cacheKey, { content: indexContent }, 300); // Cache por 5 minutos
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Cache', 'MISS');
    res.send(indexContent);
  } catch (error) {
    console.error('Erro ao servir index.html:', error);
    res.status(500).send(`
      <html>
        <head><title>Erro do Servidor</title></head>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1>❌ Erro ao carregar a aplicação</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Redis: ${redisClient.isOpen ? 'Conectado' : 'Não disponível (modo sem cache)'}`);
});

