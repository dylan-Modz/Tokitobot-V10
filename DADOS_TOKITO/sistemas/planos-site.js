'use strict';

const axios = require('axios');
const { proto, generateWAMessageFromContent } = require('@stone-wpp/ofc');
const runtime = require('../sub/runtime');
const mensagens = require('../mensagens/mensagens.js');

// Reutiliza a chave de API já configurada no bot, sem variáveis/credenciais extras.
const token = () => {
  const value = String(runtime.config().API_KEY_TOKITO || '').trim();
  return value && !/^(TOKEN_API_TOKITO|SUA_CHAVE|API_KEY|TOKEN)$/i.test(value) ? value : '';
};
const origem = () => {
  const url = new URL(String(runtime.config().API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, ''));
  if (url.protocol !== 'https:') throw new Error('A Tokito APIs exige HTTPS.');
  return url.origin;
};
const configurado = () => !!token();
const numero = value => {
  const address = String(value || '').trim();
  if (address.includes('@') && !address.endsWith('@s.whatsapp.net')) return '';
  let digits = address.split('@')[0].split(':')[0].replace(/\D/g, '');
  if (/^\d{10,11}$/.test(digits) && !digits.startsWith('55')) digits = '55' + digits;
  return /^[1-9]\d{10,14}$/.test(digits) ? digits : '';
};
const ehDonoDaConta = sender => {
  const owner = numero(runtime.config().ownerNumber || '');
  return !!owner && owner === numero(sender);
};
const numeroDono = () => numero(runtime.config().ownerNumber || '');
const dinheiro = value => Number(value || 0).toFixed(2).replace('.', ',');
const confereTelefone = (conta, dono = numeroDono()) =>
  !conta?.telefoneConta || numero(conta.telefoneConta) === dono;

async function pedir(method, path, data) {
  const apikey = token();
  if (!apikey) throw new Error('Configure o token da Tokito APIs no bot.');
  try {
    const response = await axios({
      method,
      url: origem() + '/api/tokito-bot/' + path,
      ...(method === 'GET' ? { params: data || {} } : { data: data || {} }),
      headers: { Authorization: 'Bearer ' + apikey },
      timeout: 12000,
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 300
    });
    return response.data || {};
  } catch (error) {
    // Não incluir token nem conteúdo bruto da resposta em mensagens ou logs.
    const safe = String(error.response?.data?.mensagem || '').replace(/[\r\n]/g, ' ').slice(0, 160);
    throw new Error(safe || 'A Tokito APIs não respondeu no momento.');
  }
}
async function planos() {
  const result = await pedir('GET', 'planos');
  return Array.isArray(result.planos) ? result.planos : [];
}
async function conta() {
  return (await pedir('GET', 'conta')).account;
}
async function checkout(opts = {}) {
  return pedir('POST', 'checkout', { planoId: opts.planoId, invoiceId: opts.invoiceId });
}
async function avisos() {
  const result = await pedir('GET', 'avisos');
  return Array.isArray(result.avisos) ? result.avisos : [];
}
async function confirmarAviso(id) {
  return pedir('POST', 'avisos/confirmar', { id });
}
function formatos(planosAtuais = []) {
  return planosAtuais.slice(0, 20).map(plan => ({
    title: '💎 ' + String(plan.nome || 'Plano').slice(0, 35) + ' — R$ ' + dinheiro(plan.preco),
    description: String(plan.dias || 30) + ' dias • plano Tokito APIs',
    id: String(plan.id || '')
  })).filter(item => /^[a-z0-9_-]{1,60}$/i.test(item.id));
}
function dataBR(value) {
  const date = new Date(value || 0);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }) : '—';
}
async function enviarLink(ctx, url, content, label = '💎﹚𝐀𝐁𝐑𝐈𝐑 𝐏𝐀𝐆𝐀𝐌𝐄𝐍𝐓𝐎﹙💎') {
  if (!/^https:\/\//i.test(String(url || ''))) throw new Error('Link de pagamento indisponível.');
  try {
    const interactive = proto.Message.InteractiveMessage.create({
      body: proto.Message.InteractiveMessage.Body.create({ text: content }),
      footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
        messageParamsJson: JSON.stringify({}),
        buttons: [{ name: 'cta_url', buttonParamsJson: JSON.stringify({
          display_text: label, url: String(url), merchant_url: String(url)
        }) }]
      })
    });
    const msg = generateWAMessageFromContent(ctx.from, {
      viewOnceMessage: { message: { interactiveMessage: interactive } }
    }, { quoted: ctx.selo, userJid: ctx.tokito.user?.id });
    await ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id });
    return true;
  } catch (_) {
    await ctx.reply(content + '\n\n🔗 ' + url);
    return true;
  }
}

let socketAtual = null;
let timer = null;
let ocupado = false;
async function verificarAvisos() {
  if (ocupado || !socketAtual || !configurado()) return;
  const dono = numeroDono();
  if (!dono) return;
  ocupado = true;
  try {
    const lista = await avisos();
    for (const aviso of lista) {
      // O mesmo token identifica somente uma conta. Não enviar aviso a outro usuário.
      let estado;
      try { estado = await conta(); } catch (_) { continue; }
      if (!confereTelefone(estado, dono) ||
          !estado?.invoice || estado.invoice.id !== aviso.invoiceId ||
          estado.plan?.renewalPaid || estado.invoice.status === 'paid') continue;
      // O aviso abre o mesmo seletor de Pix, Mercado Pago e InfinitePay do site.
      // Não gera cobrança antecipada e a sessão do site confirma o titular.
      const url = origem() + '/pagamento/plano/' + encodeURIComponent(estado.plan.id);
      // Revalidar imediatamente antes de enviar: pode ter sido pago no site enquanto gerávamos o link.
      try {
        const atualizado = await conta();
        if (!atualizado?.invoice || atualizado.invoice.id !== aviso.invoiceId ||
            atualizado.plan?.renewalPaid || !confereTelefone(atualizado, dono)) continue;
      } catch (_) { continue; }

      const texto = mensagens.sitePlanoAviso({
        nome: aviso.plano, vencimento: dataBR(aviso.vencimento),
        dias: aviso.dias, valor: dinheiro(aviso.valor)
      });
      const jid = dono + '@s.whatsapp.net';
      const ctx = { from: jid, tokito: socketAtual, selo: null,
        reply: content => socketAtual.sendMessage(jid, { text: content }) };
      try {
        await enviarLink(ctx, url, texto, '💎﹚𝐑𝐄𝐍𝐎𝐕𝐀𝐑 𝐏𝐋𝐀𝐍𝐎﹙💎');
        await confirmarAviso(aviso.id);
      } catch (error) {
        console.log('[PLANOS SITE] Falha no envio do aviso:', error?.message || 'Indisponível.');
      }
    }
  } catch (error) {
    console.log('[PLANOS SITE] Avisos indisponíveis:', error?.message || 'Erro.');
  } finally {
    ocupado = false;
  }
}
function iniciar(tokito) {
  if (!tokito || !configurado()) return;
  socketAtual = tokito;
  setTimeout(() => verificarAvisos().catch(() => {}), 15000).unref?.();
  if (timer) return;
  timer = setInterval(() => verificarAvisos().catch(() => {}), 15 * 60 * 1000);
  timer.unref?.();
}
module.exports = {
  configurado, numero, numeroDono, ehDonoDaConta, confereTelefone,
  dinheiro, planos, conta, checkout, formatos, dataBR,
  enviarLink, iniciar, verificarAvisos
};
