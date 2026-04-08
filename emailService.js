/**
 * Email Service - Microsoft Graph API
 * Envia emails usando Azure AD / Microsoft 365 Graph API
 * Inicialização lazy para evitar crash se credenciais não estiverem prontas
 */

import { ConfidentialClientApplication } from '@azure/msal-node';

const GRAPH_API_URL = 'https://graph.microsoft.com/v1.0';

// ─── Lazy init: só cria o client quando for realmente usar ─────────────
let msalClient = null;

function getMsalClient() {
  if (msalClient) return msalClient;

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Credenciais Azure (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET) não configuradas no .env');
  }

  msalClient = new ConfidentialClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientSecret,
    },
  });

  console.log('[EMAIL] Microsoft Graph API client inicializado com sucesso');
  return msalClient;
}

// Getters lazy para variáveis de ambiente
const getConfig = () => ({
  fromAddress: process.env.EMAIL_FROM_ADDRESS || 'atendimento@hsfasaude.com.br',
  fromName: process.env.EMAIL_FROM_NAME || 'Hospital São Francisco de Assis',
  sacAddress: process.env.EMAIL_SAC_ADDRESS || 'sac@hsfasaude.com.br',
  logoUrl: process.env.EMAIL_LOGO_URL || 'https://hsfasaude.com.br/img/black-logo.png',
  baseUrl: process.env.APP_BASE_URL || 'https://hsfasaude.com.br',
  dryRun: process.env.EMAIL_DRY_RUN === 'true',
});

// ─── Obter token de acesso ─────────────────────────────────────────────
async function getAccessToken() {
  const client = getMsalClient();
  const result = await client.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });
  return result.accessToken;
}

// ─── Enviar email via Graph API ────────────────────────────────────────
async function sendEmail({ to, subject, htmlBody, replyTo }) {
  const cfg = getConfig();

  if (cfg.dryRun) {
    console.log('[EMAIL DRY_RUN] Para:', to, '| Assunto:', subject);
    return { success: true, dryRun: true };
  }

  const token = await getAccessToken();

  const message = {
    message: {
      subject,
      body: {
        contentType: 'HTML',
        content: htmlBody,
      },
      from: {
        emailAddress: { address: cfg.fromAddress, name: cfg.fromName },
      },
      toRecipients: (Array.isArray(to) ? to : [to]).map(addr => ({
        emailAddress: { address: addr },
      })),
    },
    saveToSentItems: true,
  };

  if (replyTo) {
    message.message.replyTo = [{
      emailAddress: { address: replyTo },
    }];
  }

  const response = await fetch(`${GRAPH_API_URL}/users/${cfg.fromAddress}/sendMail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Sem detalhes');
    console.error(`[EMAIL] Erro ${response.status}:`, errorBody);
    throw new Error(`Falha ao enviar email: ${response.status}`);
  }

  console.log(`[EMAIL] Enviado para ${to} | Assunto: ${subject}`);
  return { success: true };
}

// ─── Template HTML base ────────────────────────────────────────────────
function emailTemplate({ title, bodyContent, cfg: cfgOverride }) {
  const cfg = cfgOverride || getConfig();
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#f4f6f7; font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f7; padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#196F75,#00565b); padding:28px 32px; text-align:center;">
              <img src="${cfg.logoUrl}" alt="HSFA Saúde" height="45" style="height:45px; margin-bottom:12px; filter:brightness(0) invert(1);" />
              <h1 style="color:#ffffff; margin:0; font-size:20px; font-weight:600; letter-spacing:-0.01em;">${title}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafa; padding:20px 32px; border-top:1px solid #e9ecef;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px; color:#6f797a; line-height:1.6;">
                    <strong style="color:#196F75;">Hospital São Francisco de Assis</strong><br>
                    R. 9-A, 110 - St. Aeroporto, Goiânia - GO<br>
                    (62) 3221-8000 | sac@hsfasaude.com.br
                  </td>
                  <td style="text-align:right; font-size:11px; color:#9ca3af;">
                    <a href="${cfg.baseUrl}" style="color:#196F75; text-decoration:none;">hsfasaude.com.br</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="font-size:11px; color:#9ca3af; margin-top:16px;">
          Este é um email automático. Por favor, não responda diretamente.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Criar campo de tabela ─────────────────────────────────────────────
function tableRow(label, value) {
  if (!value || value === 'Não Utilizei') return '';
  return `
    <tr>
      <td style="padding:10px 12px; font-weight:600; color:#196F75; font-size:13px; border-bottom:1px solid #f0f0f0; width:40%; vertical-align:top;">${label}</td>
      <td style="padding:10px 12px; color:#333; font-size:13px; border-bottom:1px solid #f0f0f0;">${escapeHtml(String(value))}</td>
    </tr>`;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function sectionTitle(icon, text) {
  return `<h3 style="color:#196F75; font-size:16px; font-weight:700; margin:24px 0 12px 0; padding-bottom:8px; border-bottom:2px solid #e9ecef;">
    ${icon} ${text}
  </h3>`;
}

// ─── Enviar email de Contato (SAC) ─────────────────────────────────────
export async function sendContatoEmail({ nome, email, assunto, celular, message: msg }) {
  const bodyContent = `
    ${sectionTitle('💬', 'Nova Mensagem - S.A.C')}
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
      ${tableRow('Nome', nome)}
      ${tableRow('E-mail', email)}
      ${tableRow('Celular', celular)}
      ${tableRow('Assunto', assunto)}
    </table>
    ${sectionTitle('📝', 'Mensagem')}
    <div style="background:#f8fafa; padding:16px; border-radius:8px; border-left:3px solid #196F75; color:#333; font-size:14px; line-height:1.7;">
      ${escapeHtml(msg).replace(/\n/g, '<br>')}
    </div>
    <p style="margin-top:20px; font-size:12px; color:#6f797a;">
      Responder para: <a href="mailto:${escapeHtml(email)}" style="color:#196F75;">${escapeHtml(email)}</a>
    </p>`;

  const htmlBody = emailTemplate({
    title: `S.A.C - ${escapeHtml(assunto)}`,
    bodyContent,
  });

  // Enviar para o SAC
  await sendEmail({
    to: getConfig().sacAddress,
    subject: `[S.A.C] ${assunto} - ${nome}`,
    htmlBody,
    replyTo: email,
  });

  // Email de confirmação para o remetente
  const confirmBody = emailTemplate({
    title: 'Recebemos sua mensagem!',
    bodyContent: `
      <p style="color:#333; font-size:15px; line-height:1.7;">
        Olá <strong>${escapeHtml(nome)}</strong>,
      </p>
      <p style="color:#555; font-size:14px; line-height:1.7;">
        Sua mensagem sobre "<strong>${escapeHtml(assunto)}</strong>" foi recebida com sucesso pelo nosso S.A.C.
        Nossa equipe analisará seu relato e retornará em até <strong>48 horas úteis</strong>.
      </p>
      <div style="background:#f0faf9; padding:16px; border-radius:8px; border-left:3px solid #196F75; margin:20px 0;">
        <p style="margin:0; font-size:13px; color:#555;">
          <strong style="color:#196F75;">Protocolo:</strong> SAC-${Date.now().toString(36).toUpperCase()}<br>
          <strong style="color:#196F75;">Data:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <p style="color:#555; font-size:13px;">
        Em caso de urgência, entre em contato pelo telefone <strong>(62) 3221-8000</strong>.
      </p>`,
  });

  await sendEmail({
    to: email,
    subject: `Recebemos sua mensagem - HSFA Saúde`,
    htmlBody: confirmBody,
  });

  return { success: true };
}

// ─── Enviar email de Pesquisa de Satisfação ─────────────────────────────
export async function sendPesquisaEmail(data) {
  const {
    nome, email, celular, data: dataVisita, leito, medico, tipoPaciente,
    recomendariaHospital, justifiqueAtendimento, sugestaoReclamacao,
    ...setores
  } = data;

  // Montar avaliações dos setores
  const setorLabels = {
    notaProntoSocorro: 'Pronto Socorro',
    notaRecepcao: 'Recepção',
    notaCadastroInternacao: 'Cadastro/Internação',
    notaMedicos: 'Médicos',
    notaEnfermagem: 'Enfermagem',
    notaFisioterapia: 'Fisioterapia',
    notaNutricao: 'Nutrição',
    notaAssistenteSocial: 'Assistente Social',
    notaDiagnosticoImagem: 'Diagnóstico por Imagem',
    notaHemodinamica: 'Hemodinâmica',
    notaCentroCirurgico: 'Centro Cirúrgico',
    notaUti: 'UTI',
    notaFarmacia: 'Farmácia',
    notaHotelaria: 'Hotelaria',
    notaMaqueiro: 'Maqueiro',
    notaHigienizacao: 'Higienização',
    notaSeguranca: 'Segurança',
    notaInfraestrutura: 'Infraestrutura',
  };

  let setoresRows = '';
  for (const [key, label] of Object.entries(setorLabels)) {
    const valor = data[key];
    if (valor && valor !== 'Não Utilizei') {
      const nota = parseInt(valor);
      const cor = nota >= 8 ? '#198754' : nota >= 5 ? '#ffc107' : '#dc3545';
      setoresRows += `
        <tr>
          <td style="padding:8px 12px; font-size:13px; color:#555; border-bottom:1px solid #f0f0f0;">${label}</td>
          <td style="padding:8px 12px; text-align:center; border-bottom:1px solid #f0f0f0;">
            <span style="display:inline-block; background:${cor}; color:white; padding:2px 10px; border-radius:12px; font-size:13px; font-weight:600;">${valor}</span>
          </td>
        </tr>`;
    }
  }

  // NPS score color
  const nps = parseInt(recomendariaHospital) || 0;
  const npsColor = nps >= 9 ? '#198754' : nps >= 7 ? '#ffc107' : '#dc3545';
  const npsLabel = nps >= 9 ? 'Promotor' : nps >= 7 ? 'Neutro' : 'Detrator';

  const bodyContent = `
    ${sectionTitle('📊', 'Pesquisa de Satisfação')}

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef; border-radius:8px; overflow:hidden; margin-bottom:20px;">
      ${tableRow('Nome', nome)}
      ${tableRow('E-mail', email)}
      ${tableRow('Celular', celular)}
      ${tableRow('Data da Visita', dataVisita)}
      ${tableRow('Leito', leito)}
      ${tableRow('Médico Responsável', medico)}
      ${tableRow('Tipo', tipoPaciente)}
    </table>

    ${sectionTitle('⭐', 'Avaliação Geral (NPS)')}
    <div style="text-align:center; padding:20px; background:#f8fafa; border-radius:8px; margin-bottom:20px;">
      <div style="font-size:48px; font-weight:800; color:${npsColor}; line-height:1;">${nps}</div>
      <div style="font-size:12px; color:#6f797a; margin-top:4px;">de 10 — <strong style="color:${npsColor};">${npsLabel}</strong></div>
    </div>

    ${justifiqueAtendimento ? `
    <div style="background:#f8fafa; padding:14px; border-radius:8px; border-left:3px solid #196F75; margin-bottom:20px; font-size:13px; color:#333; line-height:1.6;">
      <strong style="color:#196F75;">Justificativa:</strong><br>
      ${escapeHtml(justifiqueAtendimento).replace(/\n/g, '<br>')}
    </div>` : ''}

    ${setoresRows ? `
    ${sectionTitle('🏥', 'Avaliação dos Setores')}
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
      <tr style="background:#f8fafa;">
        <td style="padding:10px 12px; font-weight:600; color:#196F75; font-size:12px; text-transform:uppercase;">Setor</td>
        <td style="padding:10px 12px; font-weight:600; color:#196F75; font-size:12px; text-transform:uppercase; text-align:center;">Nota</td>
      </tr>
      ${setoresRows}
    </table>` : ''}

    ${sugestaoReclamacao ? `
    ${sectionTitle('💬', 'Comentários Finais')}
    <div style="background:#f8fafa; padding:14px; border-radius:8px; border-left:3px solid #196F75; font-size:13px; color:#333; line-height:1.6;">
      ${escapeHtml(sugestaoReclamacao).replace(/\n/g, '<br>')}
    </div>` : ''}

    <p style="margin-top:20px; font-size:12px; color:#6f797a;">
      Recebido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
    </p>`;

  const htmlBody = emailTemplate({
    title: `Pesquisa de Satisfação — NPS ${nps}/10`,
    bodyContent,
  });

  // Enviar para o SAC
  await sendEmail({
    to: getConfig().sacAddress,
    subject: `[Pesquisa] NPS ${nps}/10 - ${nome} (${tipoPaciente || 'N/I'})`,
    htmlBody,
    replyTo: email,
  });

  // Confirmação para o paciente
  const confirmBody = emailTemplate({
    title: 'Obrigado pela sua avaliação!',
    bodyContent: `
      <p style="color:#333; font-size:15px; line-height:1.7;">
        Olá <strong>${escapeHtml(nome)}</strong>,
      </p>
      <p style="color:#555; font-size:14px; line-height:1.7;">
        Agradecemos por dedicar seu tempo para avaliar nossos serviços. Sua opinião é fundamental para continuarmos melhorando o atendimento do Hospital São Francisco de Assis.
      </p>
      <div style="background:#f0faf9; padding:16px; border-radius:8px; text-align:center; margin:20px 0;">
        <p style="margin:0 0 4px 0; font-size:13px; color:#6f797a;">Sua nota geral</p>
        <p style="margin:0; font-size:36px; font-weight:800; color:${npsColor};">${nps}<span style="font-size:16px; color:#999;">/10</span></p>
      </div>
      <p style="color:#555; font-size:13px;">
        Caso precise de atendimento, entre em contato: <strong>(62) 3221-8000</strong> ou <a href="mailto:sac@hsfasaude.com.br" style="color:#196F75;">sac@hsfasaude.com.br</a>
      </p>`,
  });

  await sendEmail({
    to: email,
    subject: 'Obrigado pela sua avaliação - HSFA Saúde',
    htmlBody: confirmBody,
  });

  return { success: true };
}

export default { sendContatoEmail, sendPesquisaEmail };
