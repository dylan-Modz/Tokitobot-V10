/*
 * TOKITO BOT V10 — STATUS DE GRUPO
 * Author: Dylan Modz
 * Publica texto, imagem, vídeo ou áudio no Status do Grupo.
 */
'use strict'

const crypto = require('crypto')
const dylan = require('../../database/lib/comandos')

const desenrolar = entrada => {
  let msg = entrada
  for (let i = 0; i < 8 && msg; i++) {
    const dentro =
      msg.ephemeralMessage?.message ||
      msg.viewOnceMessage?.message ||
      msg.viewOnceMessageV2?.message ||
      msg.viewOnceMessageV2Extension?.message ||
      msg.documentWithCaptionMessage?.message
    if (!dentro) break
    msg = dentro
  }
  return msg || null
}

const obterCitada = ctx => {
  const msg = ctx.mensagem || ctx.info?.message || {}
  const info = ctx.ctxMsg ||
    msg.extendedTextMessage?.contextInfo ||
    msg.imageMessage?.contextInfo ||
    msg.videoMessage?.contextInfo ||
    msg.audioMessage?.contextInfo ||
    msg.documentMessage?.contextInfo ||
    {}
  return desenrolar(info.quotedMessage || null)
}

const uso = ctx => (
  '- 📢 \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`\n\n' +
  '> 📌 ׄ ( ᴜsᴇ: ' + ctx.prefix + 'mencstatus texto )\n' +
  '> 🖼️ ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍᴀ ғᴏᴛᴏ ᴏᴜ ᴠɪ́ᴅᴇᴏ ᴇ ᴜsᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ. )\n' +
  '> 🎵 ׄ ( ᴛᴀᴍʙᴇ́ᴍ ᴀᴄᴇɪᴛᴀ ᴀ́ᴜᴅɪᴏs ᴇ ᴍᴇɴsᴀɢᴇɴs ᴅᴇ ᴛᴇxᴛᴏ ᴄɪᴛᴀᴅᴀs. )'
)

const textoDaCitada = msg =>
  msg?.conversation || msg?.extendedTextMessage?.text || null

dylan.setCommand({
  nome: 'mencstatus',
  comandos: ['mencstatus', 'statusgp', 'testestatus'],
  categoria: 'admin',
  info: {
    descricao: 'Publica texto, foto, vídeo ou áudio como Status de Grupo.',
    uso: 'mencstatus texto ou responda uma mídia com mencstatus legenda',
    permissao: 'ADM',
    categoria: 'admin'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())

    const legenda = String(ctx.q || '').trim().slice(0, 4096)
    const citada = obterCitada(ctx)
    const midia = citada?.imageMessage
      ? { tipo: 'image', fonte: citada.imageMessage, chave: 'imageMessage' }
      : citada?.videoMessage
        ? { tipo: 'video', fonte: citada.videoMessage, chave: 'videoMessage' }
        : citada?.audioMessage
          ? { tipo: 'audio', fonte: citada.audioMessage, chave: 'audioMessage' }
          : null
    const textoCitado = textoDaCitada(citada)
    const texto = textoCitado
      ? (legenda ? textoCitado + '\n\n' + legenda : textoCitado)
      : legenda

    if (!midia && !texto) return ctx.reply(uso(ctx))

    const baileysDisponivel = (
      typeof ctx.generateWAMessageFromContent === 'function' &&
      typeof ctx.tokito?.relayMessage === 'function' &&
      (!midia || typeof ctx.prepareWAMessageMedia === 'function')
    )
    if (!baileysDisponivel)
      return ctx.reply('⚠️ A conexão atual não oferece suporte ao envio de Status de Grupo.')

    try {
      await ctx.reagir(ctx.from, '⏳').catch(() => {})

      const segredo = crypto.randomBytes(32)
      const contexto = {
        isGroupStatus: true,
        mentionedJid: [ctx.sender]
      }
      const interna = {
        messageContextInfo: { messageSecret: segredo }
      }

      if (midia) {
        const buffer = await ctx.getFileBuffer(midia.fonte, midia.tipo)
        if (!Buffer.isBuffer(buffer) || !buffer.length)
          throw new Error('O conteúdo da mídia citada não pôde ser lido.')

        const entrada = midia.tipo === 'audio'
          ? {
              audio: buffer,
              mimetype: midia.fonte.mimetype || 'audio/ogg; codecs=opus',
              ptt: midia.fonte.ptt === true
            }
          : { [midia.tipo]: buffer }

        const preparada = await ctx.prepareWAMessageMedia(
          entrada,
          { upload: ctx.tokito.waUploadToServer, logger: ctx.tokito.logger }
        )
        if (!preparada?.[midia.chave])
          throw new Error('Não foi possível preparar a mídia para envio.')

        interna[midia.chave] = {
          ...preparada[midia.chave],
          contextInfo: contexto,
          ...(midia.tipo === 'audio'
            ? {
                mimetype: midia.fonte.mimetype || preparada[midia.chave].mimetype || 'audio/ogg; codecs=opus',
                ptt: midia.fonte.ptt === true
              }
            : { caption: legenda })
        }
      } else {
        interna.extendedTextMessage = {
          text: texto.slice(0, 4096),
          contextInfo: contexto
        }
      }

      // O envelope groupStatusMessageV2 identifica um STATUS, não
      // uma mensagem comum enviada ao chat. A Stone WPP do Tokito
      // já inclui esse envelope no protocolo WhatsApp.
      const msg = ctx.generateWAMessageFromContent(ctx.from, {
        messageContextInfo: { messageSecret: segredo },
        groupStatusMessageV2: { message: interna }
      }, { userJid: ctx.tokito.user?.id })

      await ctx.tokito.relayMessage(ctx.from, msg.message, {
        messageId: msg.key.id
      })

      await ctx.reagir(ctx.from, '✅').catch(() => {})
      return ctx.reply(
        '- ✅ \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`\n\n' +
        '> 💚 ׄ ( sᴛᴀᴛᴜs ᴅᴏ ɢʀᴜᴘᴏ ᴇɴᴠɪᴀᴅᴏ ᴘᴇʟᴏ ᴛᴏᴋɪᴛᴏ. )'
      )
    } catch (error) {
      console.log('[TOKITO • STATUS DE GRUPO]', error?.message || error)
      await ctx.reagir(ctx.from, '❌').catch(() => {})
      return ctx.reply(
        '- ❌ \`𝙵𝙰𝙻𝙷𝙰 𝙽𝙾 𝚂𝚃𝙰𝚃𝚄𝚂\`\n\n' +
        '> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘᴜʙʟɪᴄᴀʀ ᴏ sᴛᴀᴛᴜs ᴅᴏ ɢʀᴜᴘᴏ. )'
      )
    }
  }
})
