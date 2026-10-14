/*
 * Tokito V10 — foto e link pessoal do WhatsApp de quem executou /wame.
 * Nunca tratar identificadores @lid como números de telefone.
 */
const dylan = require('../../database/lib/comandos')

const numeroPN = valor => {
  if (!valor || typeof valor !== 'string') return ''
  const entrada = valor.trim().replace(/:\d+(?=@)/, '')
  if (!entrada || entrada.endsWith('@lid') || entrada.endsWith('@g.us')) return ''
  if (entrada.includes('@') && !/@(?:s\.whatsapp\.net|c\.us)$/.test(entrada)) return ''
  if (!/^\+?[\d\s().-]+(?:@(?:s\.whatsapp\.net|c\.us))?$/.test(entrada)) return ''
  const numero = entrada.split('@')[0].replace(/\D/g, '')
  return /^\d{10,15}$/.test(numero) ? numero : ''
}

const telefoneDe = async ctx => {
  const k = ctx.info?.key || {}
  const membros = Array.isArray(ctx.groupMembers) ? ctx.groupMembers : []
  const sender = String(ctx.sender || '')
  const lid = [sender, k.participant, k.remoteJid, ctx.info?.participant]
    .find(id => String(id || '').endsWith('@lid')) || ''

  const candidatos = [
    ...(k.fromMe === true ? [ctx.botNumber, ctx.tokito?.user?.id] : []),
    k.participantAlt,
    k.senderAlt,
    ctx.info?.participantAlt,
    k.remoteJidAlt,
    ctx.senderNormalizado,
    sender,
    ...(ctx.isGroup ? [k.participant] : [k.remoteJid])
  ]

  if (lid && membros.length) {
    const membro = membros.find(m => {
      const ids = [m?.lid, m?.id, m?.jid, m?.participant]
      return ids.some(x => String(x || '').split(':')[0] === lid.split(':')[0] || String(x || '') === lid)
    })
    if (membro) {
      candidatos.push(membro.phoneNumber, membro.participantPn, membro.participantAlt, membro.jid, membro.id)
    }
  }

  for (const item of candidatos) {
    const numero = numeroPN(item)
    if (numero) return numero
  }

  if (lid && typeof ctx.tokito?.signalRepository?.lidMapping?.getPNForLID === 'function') {
    try {
      const pn = await ctx.tokito.signalRepository.lidMapping.getPNForLID(lid)
      return numeroPN(pn)
    } catch {}
  }
  return ''
}

const texto = numero => [
  '- 🧊 ' + '\`𝚂𝙴𝚄 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿\`',
  '',
  '> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @' + numero + ' )',
  '> 📱 ׄ ( ɴᴜ́ᴍᴇʀᴏ: ' + numero + ' )',
  '',
  '- 🔗 ' + '\`𝙻𝙸𝙽𝙺 𝙳𝙸𝚁𝙴𝚃𝙾\`',
  '',
  '> 🧊 ׄ ( https://wa.me/' + numero + ' )',
  '',
  '> 💙 ׄ ( ᴄʟɪǫᴜᴇ ɴᴏ ʟɪɴᴋ ᴘᴀʀᴀ ᴀʙʀɪʀ ᴏ ᴘʀɪᴠᴀᴅᴏ. )'
].join('\n')

const fotoUsuario = async (ctx, numero) => {
  if (typeof ctx.tokito?.profilePictureUrl !== 'function') return ''
  const pn = numero + '@s.whatsapp.net'
  const candidatos = [pn, ctx.sender].filter((id, i, lista) => id && lista.indexOf(id) === i)
  for (const jid of candidatos) {
    try {
      const foto = await ctx.tokito.profilePictureUrl(jid, 'image')
      if (typeof foto === 'string' && /^https?:\/\/\S+$/i.test(foto)) return foto
    } catch {}
  }
  return ''
}

dylan.setCommand({
  nome: 'wame',
  comandos: ['wame'],
  categoria: 'info',
  info: {
    descricao: 'Mostra sua foto de perfil e o link direto do seu WhatsApp.',
    uso: 'wame',
    categoria: 'info',
    permissao: 'Todos'
  },
  async executar(ctx) {
    const numero = await telefoneDe(ctx)
    if (!numero) {
      return ctx.reply(
        '- 🧊 ' + '\`𝚆𝙰𝙼𝙴\`' + '\n\n> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ɪᴅᴇɴᴛɪғɪᴄᴀʀ sᴇᴜ ɴᴜ́ᴍᴇʀᴏ ɴᴇsᴛᴀ ᴄᴏɴᴇxᴀ̃ᴏ. )\n> 🔒 ׄ ( ɴᴀ̃ᴏ ᴠᴏᴜ ᴄʀɪᴀʀ ᴜᴍ ʟɪɴᴋ ᴄᴏᴍ ɪᴅ ᴏᴄᴜʟᴛᴏ. )'
      )
    }

    const jid = numero + '@s.whatsapp.net'
    const mensagem = texto(numero)
    const foto = await fotoUsuario(ctx, numero)
    if (!foto) return ctx.reply(mensagem, [jid])

    try {
      return await ctx.tokito.sendMessage(ctx.from, {
        image: { url: foto },
        caption: mensagem,
        mentions: [jid],
        contextInfo: typeof ctx.canalInfo === 'function'
          ? ctx.canalInfo([jid])
          : { mentionedJid: [jid] }
      }, { quoted: ctx.selo })
    } catch (error) {
      console.log('[WAME] Falha ao enviar foto:', error?.message || String(error))
      return ctx.reply(mensagem, [jid])
    }
  }
})

module.exports = { numeroPN, telefoneDe, texto, fotoUsuario }
