'use strict'
// Envia os projetos oficiais com suas próprias capas, respeitando o canal configurado.
// Não mexe na mídia do menu, nas credenciais ou em configurações do usuário.
const mensagens = require('../mensagens/projetos')

const BANNERS = Object.freeze({
  site: 'https://raw.githubusercontent.com/dylan-Modz/upload/main/midias/imagens/s3ie6.jpg',
  stone: 'https://raw.githubusercontent.com/dylan-Modz/upload/main/midias/imagens/z0knv.jpg'
})
const canalOficial = require('./canal-oficial')
const canalLigado = canalOficial.ativo

const linkCanal = async ctx => {
  const cfg = ctx.runtimeSub?.config?.() || ctx.setting || {}
  if (!canalLigado(cfg)) return ''
  const configurado = canalOficial.link(cfg)
  if (configurado) return configurado

  // Canais personalizados antigos podem ter apenas o JID salvo.
  const jid = [cfg.channeldl, cfg.channel]
    .map(value => String(value || '').trim())
    .find(value => /^\d+@newsletter$/.test(value) && value !== '0@newsletter')
  if (!jid || typeof ctx.tokito?.newsletterMetadata !== 'function') return ''
  try {
    const meta = await ctx.tokito.newsletterMetadata('jid', jid)
    const candidatos = [
      meta?.invite, meta?.inviteCode, meta?.inviteLink, meta?.link,
      meta?.metadata?.invite, meta?.metadata?.inviteCode
    ]
    for (const item of candidatos) {
      const valor = String(item || '').trim()
      const normalizado = /^https:\/\//i.test(valor)
        ? valor
        : /^[A-Za-z0-9_-]{15,}$/.test(valor)
          ? 'https://whatsapp.com/channel/' + valor
          : ''
      const link = canalOficial.link({ channel: normalizado, channeldl: jid })
      if (link) return link
    }
  } catch (e) {
    console.log('[PROJETOS CANAL]', e?.message || 'Não foi possível consultar o canal.')
  }
  return ''
}

const botaoUrl = (titulo, url) => ({
  name: 'cta_url',
  buttonParamsJson: JSON.stringify({ display_text: titulo, url, merchant_url: url })
})

const links = {
  gitbot: ['📥 GitHub do bot', 'https://github.com/dylan-Modz/Tokitobot-V10'],
  site: ['🌐 Acessar site', 'https://tokito-apis.com.br'],
  stone: ['💚 Stone WPP', 'https://stone-wpp.squareweb.app']
}

const prepararMidia = async (ctx, tipo) => {
  if (tipo === 'gitbot') return ctx.modulos?.midiaMenu?.(ctx.tokito) || null
  return ctx.prepareWAMessageMedia({
    image: { url: BANNERS[tipo] }
  }, { upload: ctx.tokito.waUploadToServer })
}

const enviarSimples = async (ctx, tipo, texto, media) => {
  const options = { quoted: ctx.selo }
  const contextInfo = typeof ctx.canalInfo === 'function'
    ? ctx.canalInfo([ctx.sender])
    : { mentionedJid: [ctx.sender] }
  if (tipo === 'gitbot') {
    if (media?.videoMessage || media?.imageMessage) {
      const payload = media.videoMessage
        ? { videoMessage: { ...media.videoMessage, caption: texto, contextInfo } }
        : { imageMessage: { ...media.imageMessage, caption: texto, contextInfo } }
      const msg = ctx.generateWAMessageFromContent(ctx.from, payload, {
        quoted: ctx.selo, userJid: ctx.tokito.user?.id
      })
      return ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
    }
  } else if (media?.imageMessage) {
    return ctx.tokito.sendMessage(ctx.from, {
      image: { url: BANNERS[tipo] }, caption: texto, mentions: [ctx.sender], contextInfo
    }, options)
  }
  return ctx.tokito.sendMessage(ctx.from, {
    text: texto, mentions: [ctx.sender], contextInfo
  }, options)
}

async function enviar(ctx, tipo) {
  const criar = mensagens[tipo]
  if (typeof criar !== 'function') throw new Error('Projeto oficial inválido.')
  let texto = criar(ctx)
  const canal = await linkCanal(ctx)
  // O acesso ao canal fica no botão cta_url, nunca como URL colada ao texto.
  const buttons = [botaoUrl(...links[tipo])]
  if (canal) buttons.push(botaoUrl('📢 Acessar canal', canal))
  ctx.reagir?.(ctx.from, tipo === 'stone' ? '💚' : '💙')?.catch?.(() => {})

  let media = null
  try { media = await prepararMidia(ctx, tipo) }
  catch (e) { console.log('[PROJETOS MÍDIA]', tipo, e?.message || 'Falha de mídia.') }

  if (ctx.isBotoes !== false && media && ctx.proto?.Message?.InteractiveMessage &&
      typeof ctx.generateWAMessageFromContent === 'function') {
    try {
      const i = ctx.proto.Message.InteractiveMessage
      const header = i.Header.create({
        hasMediaAttachment: true,
        ...(media.videoMessage ? { videoMessage: media.videoMessage } : { imageMessage: media.imageMessage })
      })
      const message = ctx.generateWAMessageFromContent(ctx.from, {
        interactiveMessage: i.create({
          contextInfo: typeof ctx.canalInfo === 'function'
            ? { ...ctx.canalInfo([ctx.sender]), mentionedJid: [ctx.sender] }
            : { mentionedJid: [ctx.sender] },
          header,
          body: i.Body.create({ text: texto }),
          footer: i.Footer.create({ text: '' }),
          nativeFlowMessage: i.NativeFlowMessage.create({ buttons, messageParamsJson: '{}' })
        })
      }, { quoted: ctx.selo, userJid: ctx.tokito.user?.id })
      return await ctx.tokito.relayMessage(ctx.from, message.message, { messageId: message.key.id })
    } catch (e) {
      console.log('[PROJETOS BOTÕES]', tipo, e?.message || 'Falha de botões.')
    }
  }
  try { return await enviarSimples(ctx, tipo, texto, media) }
  catch (e) {
    console.log('[PROJETOS ENVIO]', tipo, e?.message || 'Falha de envio.')
    return ctx.reply(texto, [ctx.sender])
  }
}

module.exports = { enviar, BANNERS, canalLigado, linkCanal }
