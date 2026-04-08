import "dotenv/config";
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join, extname, resolve, basename } from 'path';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { sendContatoEmail, sendPesquisaEmail } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security: Disable X-Powered-By ---
app.disable('x-powered-by');

// --- Security: Trust proxy (platform nginx + Cloudflare = 2 hops) ---
app.set('trust proxy', 2);

// --- Security: Helmet with CSP ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://www.google.com", "https://www.gstatic.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "blob:", "https://www.gstatic.com", "https://www.google-analytics.com", "https://*.google-analytics.com"],
      connectSrc: ["'self'", "https://www.google.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://*.google-analytics.com", "https://*.analytics.google.com"],
      frameSrc: ["https://www.google.com", "https://www.recaptcha.net"],
      frameAncestors: ["'self'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'sameorigin' },
  noSniff: true,
  permittedCrossDomainPolicies: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  crossOriginEmbedderPolicy: { policy: 'credentialless' },
}));

// --- Security: Fallback middleware to explicitly set all security headers ---
// Ensures headers reach the browser even if Cloudflare or other proxies strip Helmet's headers
app.use((req, res, next) => {
  // HSTS - force HTTPS for 1 year with preload
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - restrict access to sensitive browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');

  // Cross-Origin policies
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');

  next();
});

// --- Security: CORS ---
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://hsfasaude.com.br', 'https://www.hsfasaude.com.br'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

// --- Security: Compression ---
app.use(compression());

// --- Security: Rate Limiting ---
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições. Tente novamente em 15 minutos.' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Limite de requisições atingido. Tente novamente em 15 minutos.' }
});

app.use(generalLimiter);
app.use('/assinaturas/api/', apiLimiter);

// --- Security: HTML escape utility ---
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// --- Security: Sanitize utility for log injection prevention ---
const sanitizeForLog = (str) => String(str).replace(/[\r\n\t]/g, ' ').substring(0, 200);

// --- Security: CSRF protection - reject non-JSON POST requests to API ---
app.use(['/api/', '/assinaturas/api/'], (req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(415).json({ success: false, message: 'Content-Type must be application/json' });
  }
  next();
});

// --- Security: Cache-Control for API responses ---
app.use(['/api/', '/assinaturas/api/'], (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// Middleware para parsing de JSON e FormData
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// --- Security: reCAPTCHA v2 verification ---
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET) {
    console.error('[RECAPTCHA] CRITICAL: Secret key não configurada - bloqueando requisição');
    return false;
  }
  if (!token) return false;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
    });
    const data = await response.json();
    if (!data.success) {
      console.warn('[RECAPTCHA] Falha na verificação:', data['error-codes']);
    }
    return data.success === true;
  } catch (error) {
    console.error('[RECAPTCHA] Erro ao verificar:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// API DE EMAIL - Contato (SAC) e Pesquisa de Satisfação
// ═══════════════════════════════════════════════════════════════

// Rate limiter específico para emails (mais restrito)
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Limite de envios atingido. Tente novamente em 15 minutos.' }
});

// POST /api/contato - Enviar mensagem do formulário de contato (S.A.C)
app.post('/api/contato', emailLimiter, async (req, res) => {
  try {
    const { nome, email, assunto, celular, message, recaptchaToken } = req.body;

    // Verificar reCAPTCHA
    const captchaValid = await verifyRecaptcha(recaptchaToken);
    if (!captchaValid) {
      return res.status(400).json({
        success: false,
        message: 'Verificação reCAPTCHA falhou. Por favor, tente novamente.'
      });
    }

    // Validações
    if (!nome || !email || !assunto || !celular || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios.'
      });
    }

    if (nome.length > 100 || email.length > 150 || assunto.length > 200 || celular.length > 20 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Um ou mais campos excedem o tamanho máximo permitido.'
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de e-mail inválido.'
      });
    }

    await sendContatoEmail({ nome, email, assunto, celular, message });

    console.log(`[CONTATO] Mensagem enviada por ${sanitizeForLog(nome)} (${sanitizeForLog(email)}) - Assunto: ${sanitizeForLog(assunto)}`);

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
    });
  } catch (error) {
    console.error('[CONTATO] Erro ao enviar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem. Tente novamente ou entre em contato pelo telefone (62) 3221-8000.'
    });
  }
});

// POST /api/pesquisa - Enviar pesquisa de satisfação
app.post('/api/pesquisa', emailLimiter, async (req, res) => {
  try {
    const { nome, email, celular, data, tipoPaciente, recaptchaToken } = req.body;

    // Verificar reCAPTCHA
    const captchaValid = await verifyRecaptcha(recaptchaToken);
    if (!captchaValid) {
      return res.status(400).json({
        success: false,
        message: 'Verificação reCAPTCHA falhou. Por favor, tente novamente.'
      });
    }

    // Validações mínimas
    if (!nome || !email || !celular || !data || !tipoPaciente) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não preenchidos.'
      });
    }

    if (nome.length > 100 || email.length > 150 || celular.length > 20 || data.length > 50 || tipoPaciente.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Um ou mais campos excedem o tamanho máximo permitido.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de e-mail inválido.'
      });
    }

    // --- Security: Only pass validated/expected fields to email service ---
    const {
      recomendariaHospital, justifiqueAtendimento, sugestaoReclamacao,
      notaAtendimento, notaLimpeza, notaAlimentacao, notaEnfermagem,
      notaMedicos, notaRecepcao, notaGeral,
      setorUrgencia, setorInternacao, setorCirurgia, setorExames,
      setorConsultorio, setorRecepcao
    } = req.body;

    await sendPesquisaEmail({
      nome, email, celular, data, tipoPaciente,
      recomendariaHospital, justifiqueAtendimento, sugestaoReclamacao,
      notaAtendimento, notaLimpeza, notaAlimentacao, notaEnfermagem,
      notaMedicos, notaRecepcao, notaGeral,
      setorUrgencia, setorInternacao, setorCirurgia, setorExames,
      setorConsultorio, setorRecepcao
    });

    console.log(`[PESQUISA] Avaliacao recebida de ${sanitizeForLog(nome)} (${sanitizeForLog(email)}) - NPS: ${sanitizeForLog(String(req.body.recomendariaHospital))}/10`);

    res.json({
      success: true,
      message: 'Pesquisa enviada com sucesso! Obrigado pela sua avaliação.'
    });
  } catch (error) {
    console.error('[PESQUISA] Erro ao enviar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar pesquisa. Tente novamente ou entre em contato pelo telefone (62) 3221-8000.'
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS DE ASSINATURAS
// ═══════════════════════════════════════════════════════════════

// IMPORTANTE: Rotas específicas devem vir ANTES do express.static para evitar conflitos

// API para obter o conteúdo HTML do carimbo (apenas o body)
app.get('/assinaturas/api/conteudo', (req, res) => {
  try {
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

    res.json({
      success: true,
      html: bodyContent,
      scripts: scripts
    });
  } catch (error) {
    console.error('Erro ao ler carimbo.html:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// API para salvar assinaturas (substitui o PHP)
app.post('/assinaturas/api/salvar', (req, res) => {
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

    // --- Security: Check base64 string length before decoding (prevents memory waste) ---
    if (imagem.length > 3 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Imagem base64 excede o tamanho máximo permitido'
      });
    }

    // --- Security: Input length limits ---
    if (nome.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Nome excede o limite de 200 caracteres'
      });
    }
    if (cargo && cargo.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Cargo excede o limite de 300 caracteres'
      });
    }
    if (empresa && empresa.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Empresa excede o limite de 300 caracteres'
      });
    }
    if (registro && registro.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Registro excede o limite de 300 caracteres'
      });
    }

    // Processar a imagem base64
    // Remover o prefixo "data:image/png;base64,"
    const imagemBase64 = imagem.replace(/^data:image\/\w+;base64,/, '');
    const imagemBuffer = Buffer.from(imagemBase64, 'base64');

    // --- Security: Validate decoded image size (max 2MB) ---
    if (imagemBuffer.length > 2 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Imagem excede o tamanho máximo de 2MB'
      });
    }

    // --- Security: Verify PNG magic bytes ---
    if (imagemBuffer.length < 4 ||
        imagemBuffer[0] !== 0x89 ||
        imagemBuffer[1] !== 0x50 ||
        imagemBuffer[2] !== 0x4E ||
        imagemBuffer[3] !== 0x47) {
      return res.status(400).json({
        success: false,
        message: 'Formato de imagem inválido. Apenas PNG é aceito.'
      });
    }

    // --- Security: Store signatures OUTSIDE web root ---
    const diretorio = join(__dirname, 'data', 'assinaturas');

    // Criar diretório se não existir
    if (!existsSync(diretorio)) {
      mkdirSync(diretorio, { recursive: true });
    }

    // Limpar o nome para usar como nome de arquivo
    const nomeArquivo = nome.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

    // Adicionar timestamp para evitar sobrescrita
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const nomeArquivoFinal = `${nomeArquivo}_${timestamp}`;

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
IP do Cliente: ${sanitizeForLog(req.ip || req.connection?.remoteAddress || 'N/A')}
User Agent: ${sanitizeForLog((req.get('user-agent') || 'Não informado').substring(0, 300))}
----------------------------------------------

Assinatura digital salva com sucesso!
==============================================
`;

    // Salvar o arquivo TXT
    const caminhoTxt = join(diretorio, `${nomeArquivoFinal}.txt`);
    writeFileSync(caminhoTxt, conteudoTxt, 'utf-8');

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
      message: 'Erro interno do servidor'
    });
  }
});

// --- Security: Method not allowed for API routes ---
app.all('/api/*', (req, res, next) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  next();
});

// Servir arquivos específicos da pasta assinaturas (HTML, CSS, JS, imagens)
// IMPORTANTE: Esta rota deve vir DEPOIS da rota da API para não capturar /api/salvar
app.get('/assinaturas/:filename', (req, res) => {
  // Excluir rotas da API
  if (req.path.startsWith('/assinaturas/api/')) {
    return res.status(404).send('API não encontrada');
  }

  const filename = req.params.filename;

  // --- Security: Path traversal prevention ---
  const safeName = basename(filename);
  const fullPath = join(__dirname, 'dist', 'assinatura', safeName);
  const resolvedPath = resolve(fullPath);
  const allowedDir = resolve(join(__dirname, 'dist', 'assinatura'));
  if (!resolvedPath.startsWith(allowedDir)) {
    return res.status(400).send('Acesso negado');
  }

  // Verificar se é um arquivo PHP
  if (safeName.endsWith('.php')) {
    if (existsSync(fullPath)) {
      // --- Security: XSS prevention with escapeHtml ---
      return res.status(503).send(`
        <html>
          <head><title>Arquivo PHP - Configuração Necessária</title></head>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1>⚠️ Arquivo PHP não pode ser executado pelo Node.js</h1>
            <p>Arquivos PHP devem ser servidos diretamente pelo servidor web (Apache/Nginx).</p>
            <p>Verifique a configuração do servidor web para servir arquivos PHP.</p>
            <p><small>Arquivo: ${escapeHtml(safeName)}</small></p>
          </body>
        </html>
      `);
    } else {
      return res.status(404).send('Arquivo PHP não encontrado');
    }
  }

  // Para outros arquivos (HTML, CSS, JS, imagens), tentar servir como arquivo estático
  if (existsSync(fullPath)) {
    const ext = extname(safeName);
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
      res.setHeader('Content-Type', contentType);
      return res.send(content);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      return res.status(500).send('Erro ao ler arquivo');
    }
  }

  // Se não encontrou, retornar 404 diretamente (não chamar next())
  return res.status(404).send('Arquivo não encontrado');
});

// Servir arquivos estáticos da pasta dist (depois das rotas específicas)
// IMPORTANTE: express.static não deve processar /assinaturas/ pois já foi tratado acima
const staticMiddleware = express.static(join(__dirname, 'dist'), {
  // Configurar tipos MIME corretos
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
  // IMPORTANTE: Desabilitar redirecionamento automático para diretórios
  redirect: false
});

// Usar uma função personalizada para filtrar requisições
app.use((req, res, next) => {
  // Se a requisição é para arquivos específicos de /assinaturas/ (como carimbo.html), não processar com express.static
  // Mas permitir que /assinaturas seja tratado pelo React Router
  const isAssinaturasFile = req.path.match(/^\/assinaturas\/[^/]+\.[a-zA-Z]+$/) &&
                            !req.path.startsWith('/assinaturas/api/');

  if (isAssinaturasFile) {
    // Pular completamente o express.static para arquivos específicos de /assinaturas/
    return next();
  }
  // Para outras rotas, usar express.static
  staticMiddleware(req, res, next);
});

// Para rotas que não são arquivos estáticos, servir o index.html (necessário para React Router)
app.get('*', (req, res, next) => {
  // Verificar se é um arquivo específico da pasta assinaturas (como carimbo.html)
  // Mas /assinaturas e /assinaturas/ devem ir para o React Router para ter o layout
  const isAssinaturasFile = req.path.match(/^\/assinaturas\/[^/]+\.[a-zA-Z]+$/) &&
                            !req.path.startsWith('/assinaturas/api/');

  if (isAssinaturasFile) {
    return next();
  }

  // Se a requisição é para um arquivo estático (tem extensão), não servir HTML
  const ext = extname(req.path);
  const isStaticFile = ext && ext.length > 0 && !['.html', '.htm'].includes(ext);

  if (isStaticFile) {
    // Se é um arquivo estático mas não foi encontrado pelo express.static, retornar 404
    return res.status(404).send('Arquivo não encontrado');
  }

  // Para rotas da aplicação React, servir index.html
  try {
    const indexPath = join(__dirname, 'dist', 'index.html');

    // Verificar se o arquivo existe antes de tentar ler
    if (!existsSync(indexPath)) {
      console.error(`Arquivo não encontrado: ${indexPath}`);
      // --- Security: Remove internal path disclosure ---
      return res.status(500).send(`
        <html>
          <head><title>Erro - Build Necessário</title></head>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1>⚠️ Erro: Build não encontrado</h1>
            <p>O arquivo <code>dist/index.html</code> não existe.</p>
            <p>Execute: <code>npm run build</code> para criar o build de produção.</p>
          </body>
        </html>
      `);
    }

    const indexContent = readFileSync(indexPath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.send(indexContent);
  } catch (error) {
    console.error('Erro ao servir index.html:', error);
    // --- Security: Do not leak error details ---
    res.status(500).send(`
      <html>
        <head><title>Erro do Servidor</title></head>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1>❌ Erro ao carregar a aplicação</h1>
          <p>Erro interno do servidor</p>
        </body>
      </html>
    `);
  }
});

// --- Security: Server timeouts ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
server.setTimeout(30000);
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
