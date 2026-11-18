'use strict';

const axios = require('axios');
const { proto, generateWAMessageFromContent } = require('@stone-wpp/ofc');
const mensagens = require('../mensagens/mensagens.js');

const secret = () => String(process.env.TOKITO_BOT_BRIDGE_SECRET || '').trim();
const origem = () => {
  const raw = String(process.env.TOKITO_BOT_BRIDGE_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '');
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('A integração com o site exige HTTPS.');
  return url.origin;
};
const configurado = () => secret().length >= 24;
const numero = jid => {
  const address = String(jid || '').trim().toLowerCase();
  if (!address.endsWith('@s.whatsapp.net')) return '';
  const digits = address.split('@')[0].split(':')[0];
  return /^[1-9]\d{10,14}$/.test(digits) ? digits : '';
};
const dinheiro = value => Number(value || 0).toFixed(2).replace('.', ',');

async function pedir(method, path, data) {
  if (!configurado()) throw new Error('A integração de planos ainda não foi configurada pelo proprietário.');
  try {
    const response = await axios({
      method, url: origem() + '/api/tokito-bot/' + path,
      ...(method === 'GET' ? { params: data || {} } : { data: data || {} }),
      headers: { Authorization: 'Bearer ' + secret() },
      timeout: 12000, maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 300
    });
    return response.data || {};
  } catch (error) {
    // Nunca exibir tokens, URLs internas ou dados brutos de erro na conversa.
    const message = String(error.response?.data?.mensagem || '').slice(0, 160);
    throw new Error(message || 'A Tokito APIs está indisponível no momento.');
  }
}
async function planos() {
  const result = await pedir('GET', 'planos');
  return Array.isArray(result.planos) ? result.planos : [];
}
async function conta(telefone) {
  const result = await pedir('GET', 'conta', { telefone });
  return result.account;
}
async function vincular(telefone, codigo) {
  return (await pedir('POST', 'vincular', { telefone, codigo })).account;
}
async function checkout(telefone, opts = {}) {
  return pedir('POST', 'checkout', { telefone, planoId: opts.planoId, invoiceId: opts.invoiceId });
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
async function enviarLink(ctx, url, text, label = '💎﹚𝐀𝐁𝐑𝐈𝐑 𝐏𝐀𝐆𝐀𝐌𝐄𝐍𝐓𝐎﹙💎') {
  if (!/^https:\/\//i.test(String(url || ''))) throw new Error('Link HTTPS de pagamento não disponível.');
  try {
    const interactive = proto.Message.InteractiveMessage.create({
      body: proto.Message.InteractiveMessage.Body.create({ text }),
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
  } catch (error) {
    return ctx.reply(text + '\n\n🔗 ' + url);
  }
}
let socketAtual = null;
let timer = null;
let ocupado = false;

async function verificarAvisos() {
  if (ocupado || !socketAtual || !configurado()) return;
  ocupado = true;
  try {
    const lista = await avisos();
    for (const aviso of lista) {
      const telefone = numero(String(aviso.telefone || '') + '@s.whatsapp.net');
      if (!telefone) continue;
      let estado;
      try { estado = await conta(telefone); } catch { continue; }
      if (!estado?.invoice || estado.invoice.id !== aviso.invoiceId ||
          estado.plan?.renewalPaid || estado.invoice.status === 'paid') continue;
      let url = origem() + '/painel/historico?fatura=' + encodeURIComponent(aviso.invoiceId);
      try {
        const pedido = await checkout(telefone, { invoiceId: aviso.invoiceId });
        if (pedido.checkoutUrl?.startsWith('https://')) url = pedido.checkoutUrl;
      } catch (_) {
        // Sem gateway por link, o usuário pode quitar a fatura autenticado no painel.
      }
      const texto = mensagens.sitePlanoAviso({
        nome: aviso.plano, vencimento: dataBR(aviso.vencimento),
        dias: aviso.dias, valor: dinheiro(aviso.valor)
      });
      const jid = telefone + '@s.whatsapp.net';
      const ctx = { from: jid, tokito: socketAtual, selo: null, reply: text => socketAtual.sendMessage(jid, { text }) };
      try {
        await enviarLink(ctx, url, texto, '💎﹚𝐑𝐄𝐍𝐎𝐕𝐀𝐑 𝐏𝐋𝐀𝐍𝐎﹙💎');
        await confirmarAviso(aviso.id);
      } catch (error) {
        console.log('[PLANOS SITE] Aviso não entregue:', error?.message || 'Falha no envio.');
      }
    }
  } catch (error) {
    console.log('[PLANOS SITE] Não foi possível consultar vencimentos:', error?.message || 'Indisponível.');
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
  configurado, numero, dinheiro, planos, conta, vincular, checkout,
  formatos, dataBR, enviarLink, iniciar, verificarAvisos
};
