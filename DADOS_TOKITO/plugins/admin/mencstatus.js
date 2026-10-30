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
      msg.documentWithCaptionMessage?.message ||
      msg.associatedChildMessage?.message ||
      msg.editedMessage?.message ||
      msg.groupStatusMessageV2?.message ||
      msg.groupStatusMessage?.message
    if (!dentro) break
    msg = dentro
  }
  return msg || null
}

const obterCitada = ctx => {
  const msg = ctx.mensagem || ctx.info?.message || {}
  const info = (ctx.ctxMsg?.quotedMessage ? ctx.ctxMsg : null) ||
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
  '> 🎬 ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍ ᴠɪ́ᴅᴇᴏ ᴄᴏᴍ ᴏ ᴄᴏᴍᴀɴᴅᴏ. )\n' +
  '> 🎵 ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍ ᴀ́ᴜᴅɪᴏ ᴄᴏᴍ ᴏ ᴄᴏᴍᴀɴᴅᴏ. )\n' +
  '> 🖼️ ׄ ( ғᴏᴛᴏs ᴇ ᴛᴇxᴛᴏs ᴄᴏɴᴛɪɴᴜᴀᴍ ᴅɪsᴘᴏɴɪ́ᴠᴇɪs. )'
)

const textoDaCitada = msg =>
  msg?.conversation || msg?.extendedTextMessage?.text || null

dylan.setCommand({
  nome: 'mencstatus',
  comandos: ['mencstatus', 'statusgp', 'statusgrupo', 'testestatus'],
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
    // Mensagens respondidas têm prioridade, inclusive status de grupo citado.
    const origem = citada || desenrolar(ctx.info?.message || ctx.mensagem || {})
    const midia = origem?.imageMessage
      ? { tipo: 'image', fonte: origem.imageMessage, chave: 'imageMessage' }
      : origem?.videoMessage
        ? { tipo: 'video', fonte: origem.videoMessage, chave: 'videoMessage' }
        : origem?.audioMessage
          ? { tipo: 'audio', fonte: origem.audioMessage, chave: 'audioMessage' }
          : null
    const textoCitado = citada ? textoDaCitada(citada) : null
    const texto = textoCitado
      ? (legenda ? textoCitado + '\n\n' + legenda : textoCitado)
      : legenda

    if (!midia && !texto) return ctx.reply(uso(ctx))

    const baileysDisponivel = (
      typeof ctx.generateWAMessageFromContent === 'function' &&
      typeof ctx.tokito?.relayMessage === 'function' &&
      (!midia || (typeof ctx.prepareWAMessageMedia === 'function' &&
        typeof ctx.tokito?.waUploadToServer === 'function' &&
        typeof ctx.getFileBuffer === 'function'))
    )
    if (!baileysDisponivel)
      return ctx.reply('⚠️ A conexão atual não oferece suporte ao envio de Status de Grupo.')

    let etapa = 'inicialização'
    try {
      await ctx.reagir(ctx.from, '⏳').catch(() => {})

      const segredo = crypto.randomBytes(32)
      const autorJid = ctx.tokito.user?.lid || ctx.tokito.user?.id
      const tipoGrupo = ctx.proto?.StatusAttribution?.Type?.GROUP_STATUS ?? 5
      const contexto = {
        isGroupStatus: true,
        ...(autorJid ? {
          statusAttributions: [{
            type: tipoGrupo,
            groupStatus: { authorJid: autorJid }
          }]
        } : {})
      }
      const interna = {
        messageContextInfo: { messageSecret: segredo }
      }

      if (midia) {
        etapa = 'baixar mídia respondida'
        const buffer = await ctx.getFileBuffer(midia.fonte, midia.tipo)
        if (!Buffer.isBuffer(buffer) || buffer.length === 0)
          throw new Error('Mídia citada sem bytes disponíveis.')

        etapa = 'preparar e reenviar mídia'
        const origem = midia.fonte
        const segundos = Number(origem.seconds || 0)
        const temSegundos = Number.isFinite(segundos) && segundos > 0
        const mime = String(origem.mimetype ||
          (midia.tipo === 'audio' ? 'audio/ogg; codecs=opus' :
            midia.tipo === 'video' ? 'video/mp4' : 'image/jpeg'))
        const entrada = {
          [midia.tipo]: buffer,
          mimetype: mime,
          ...(temSegundos ? { seconds: segundos } : {}),
          ...(midia.tipo === 'audio' ? { ptt: origem.ptt === true } : {}),
          ...(midia.tipo === 'video' ? {
            gifPlayback: origem.gifPlayback === true
          } : {}),
          ...((midia.tipo === 'video' || midia.tipo === 'image') &&
            origem.jpegThumbnail ? { jpegThumbnail: origem.jpegThumbnail } : {}),
          ...((midia.tipo === 'video' || midia.tipo === 'image') &&
            Number(origem.width) > 0 ? { width: Number(origem.width) } : {}),
          ...((midia.tipo === 'video' || midia.tipo === 'image') &&
            Number(origem.height) > 0 ? { height: Number(origem.height) } : {})
        }

        // Para publicar em status, a mídia deve ser baixada e enviada com
        // uma nova mediaKey; reutilizar a URL criptografada do citado não serve.
        const preparada = await ctx.prepareWAMessageMedia(entrada, {
          upload: ctx.tokito.waUploadToServer,
          logger: ctx.tokito.logger
        })
        if (!preparada?.[midia.chave]?.mediaKey ||
            !preparada?.[midia.chave]?.directPath)
          throw new Error('O WhatsApp não retornou mediaKey/directPath da mídia.')

        interna[midia.chave] = {
          ...preparada[midia.chave],
          contextInfo: contexto,
          ...(midia.tipo === 'audio' ? {
            mimetype: mime,
            ptt: origem.ptt === true
          } : {
            mimetype: mime,
            caption: legenda || origem.caption || ''
          })
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
      etapa = 'montar status de grupo'
      const msg = ctx.generateWAMessageFromContent(ctx.from, {
        messageContextInfo: { messageSecret: segredo },
        groupStatusMessageV2: { message: interna }
      }, { userJid: ctx.tokito.user?.id })

      if (!msg.message?.groupStatusMessageV2)
        throw new Error('O protocolo não gerou groupStatusMessageV2.')

      etapa = 'enviar status ao WhatsApp'
      // A Stone identifica o mediatype de mensagens comuns, mas o
      // groupStatusMessageV2 envolve a mídia em outro nível. Informamos
      // explicitamente o tipo no stanza do envio ao grupo.
      const atributos = midia?.tipo === 'audio'
        ? { type: 'text' }
        : midia?.tipo
          ? { type: 'media', mediatype: midia.tipo === 'video' && midia.fonte?.gifPlayback
            ? 'gif' : midia.tipo }
          : undefined
      await ctx.tokito.relayMessage(ctx.from, msg.message, {
        messageId: msg.key.id,
        ...(atributos ? { additionalAttributes: atributos } : {})
      })

      await ctx.reagir(ctx.from, '✅').catch(() => {})
      return ctx.reply(
        '- ✅ \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`\n\n' +
        '> 💚 ׄ ( ᴘᴜʙʟɪᴄᴀᴄ̧ᴀ̃ᴏ ᴇɴᴠɪᴀᴅᴀ; ᴄᴏɴғɪʀᴀ ᴏ sᴛᴀᴛᴜs ɴᴏ ɢʀᴜᴘᴏ. )'
      )
    } catch (error) {
      console.log('[TOKITO • STATUS DE GRUPO]', etapa, error?.stack || error?.message || error)
      await ctx.reagir(ctx.from, '❌').catch(() => {})
      return ctx.reply(
        '- ❌ \`𝙵𝙰𝙻𝙷𝙰 𝙽𝙾 𝚂𝚃𝙰𝚃𝚄𝚂\`\n\n' +
        '> ⚠️ ׄ ( ғᴀʟʜᴀ ᴀᴏ ' + etapa + '. ᴄᴏɴғɪʀᴀ ᴏ ʟᴏɢ ᴅᴏ ʙᴏᴛ. )'
      )
    }
  }
})
