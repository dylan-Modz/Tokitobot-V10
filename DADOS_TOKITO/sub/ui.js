const fs = require('fs')
const path = require('path')
const { proto, prepareWAMessageMedia, generateWAMessageFromContent, jidNormalizedUser } = require('@stone-wpp/ofc')
const runtime = require('./runtime')
const store = require('./store')

const moeda = value => Number(value || 0).toFixed(2).replace('.', ',')
const dataBR = value => {
  const d = new Date(value || 0)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' })
}

const mediaMenu = async ctx => {
  const video = path.join(runtime.DADOS, 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
  const image = path.join(runtime.DADOS, 'INFO_DADOS', 'LOGOS', 'fotomenu.png')

  if (fs.existsSync(video)) {
    const media = await prepareWAMessageMedia({
      video: fs.readFileSync(video),
      gifPlayback: true,
      mimetype: 'video/mp4'
    }, { upload: ctx.tokito.waUploadToServer })
    return proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: true, videoMessage: media.videoMessage })
  }

  if (fs.existsSync(image)) {
    const media = await prepareWAMessageMedia({ image: fs.readFileSync(image) }, { upload: ctx.tokito.waUploadToServer })
    return proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: true, imageMessage: media.imageMessage })
  }

  return null
}

const botThumb = async ctx => {
  try {
    const jid = jidNormalizedUser(ctx.tokito.user?.id || '')
    if (!jid) return ''
    return await ctx.tokito.profilePictureUrl(jid, 'image').catch(() => '')
  } catch {
    return ''
  }
}

const contexto = async (ctx, mentions = []) => {
  const base = typeof ctx.canalInfo === 'function' ? ctx.canalInfo(mentions) : { mentionedJid: mentions }
  const foto = await botThumb(ctx)
  return {
    ...base,
    ...(foto ? {
      externalAdReply: {
        title: String(ctx.NomeDoBot || 'Tokito Bot'),
        body: 'Loja Tokito',
        thumbnailUrl: foto,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: false
      }
    } : {})
  }
}

const enviarInterativo = async (ctx, text, buttons = [], mentions = []) => {
  try {
    const header = await mediaMenu(ctx)
    const data = {
      contextInfo: await contexto(ctx, mentions),
      body: proto.Message.InteractiveMessage.Body.create({ text: String(text || ' ') }),
      footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
        messageParamsJson: JSON.stringify({}),
        buttons
      })
    }
    if (header) data.header = header

    const msg = generateWAMessageFromContent(ctx.from, {
      viewOnceMessage: {
        message: { interactiveMessage: proto.Message.InteractiveMessage.create(data) }
      }
    }, {
      quoted: ctx.selo,
      userJid: ctx.tokito.user?.id
    })

    await ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
    return true
  } catch (error) {
    console.log('[SUB UI]', error?.message || error)
    return false
  }
}

const lojaTexto = (ctx, planosGrupo = []) => {
  const subs = store.plans.map((p, i) => `> 『 \`${i + 1}°\` 』— 🤖 ${p.dias} dias — R$ ${moeda(p.valor)}`).join('\n')
  const grupos = (Array.isArray(planosGrupo) ? planosGrupo : []).map((p, i) =>
    `> 『 \`${store.plans.length + i + 1}°\` 』— 👥 ${p.nome || `Plano ${i + 1}`} — R$ ${moeda(p.preco)} • ${Number(p.dias || 0)} dias`
  ).join('\n') || '> • ׄ ( Nenhum plano de grupo cadastrado no momento. )'

  return `- 🛒 \`𝙻𝙾𝙹𝙰 𝚃𝙾𝙺𝙸𝚃𝙾\`\n\n- 🤖 \`𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n${subs}\n\n> • ׄ ( R$ 1,00 por dia. )\n> • ׄ ( Use ${ctx.prefix}sub dias para contratar. )\n\n- 👥 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙴𝙼 𝙶𝚁𝚄𝙿𝙾\`\n\n${grupos}\n\n> • ׄ ( Para grupo, use ${ctx.prefix}alugarbot link-do-grupo. )`
}

const enviarLoja = async (ctx, planosGrupo = []) => {
  try {
    const header = await mediaMenu(ctx)
    const subRows = store.plans.map(p => ({
      title: `🤖 ${p.dias} dias — R$ ${moeda(p.valor)}`,
      description: `Conectar seu próprio número como Sub Bot por ${p.dias} dias.`,
      id: `${ctx.prefix}sub ${p.dias}`
    }))

    const grupoRows = (Array.isArray(planosGrupo) ? planosGrupo : []).map((p, i) => ({
      title: `👥 ${p.nome || `Plano ${i + 1}`} — R$ ${moeda(p.preco)}`,
      description: `${Number(p.dias || 0)} dias • aluguel do Tokito dentro do seu grupo.`,
      id: `${ctx.prefix}alugarbot`
    }))

    const mkCard = (body, title, rows) => {
      const card = {
        header: { hasMediaAttachment: Boolean(header) },
        headerType: 'IMAGE',
        body: { text: body },
        footer: { text: 'ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄᴀᴏ ᴀʙᴀɪxᴏ' },
        nativeFlowMessage: {
          buttons: rows.length ? [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title,
              sections: [{ title, rows }]
            })
          }] : []
        }
      }
      if (header?.videoMessage) {
        card.header = { hasMediaAttachment: true, videoMessage: header.videoMessage }
        card.headerType = 'VIDEO'
      } else if (header?.imageMessage) {
        card.header = { hasMediaAttachment: true, imageMessage: header.imageMessage }
        card.headerType = 'IMAGE'
      }
      return card
    }

    const carouselMessage = {
      cards: [
        mkCard(
          `- 🤖 \`𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> 💸 ׄ ( R$ 1,00 por dia. )\n> 📱 ׄ ( Use seu próprio número como Tokito. )\n> 🔐 ׄ ( O código de conexão é enviado no privado do dono. )`,
          '🤖 Escolher plano do Sub Bot',
          subRows
        ),
        mkCard(
          `- 👥 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙴𝙼 𝙶𝚁𝚄𝙿𝙾\`\n\n> 🏠 ׄ ( O Tokito principal entra no seu grupo. )\n> 📦 ׄ ( Os planos abaixo usam o sistema de aluguel já cadastrado. )\n> 🔗 ׄ ( Depois envie o link do grupo. )`,
          '👥 Ver planos de grupo',
          grupoRows
        )
      ]
    }

    await ctx.tokito.relayMessage(ctx.from, {
      interactiveMessage: {
        contextInfo: {
          quotedMessage: ctx.selo?.message,
          ...(ctx.selo?.key?.participant ? { participant: ctx.selo.key.participant } : {}),
          ...(ctx.selo?.key?.id ? { stanzaId: ctx.selo.key.id } : {}),
          ...(ctx.selo?.key?.remoteJid ? { remoteJid: ctx.selo.key.remoteJid } : {}),
          mentionedJid: ctx.sender ? [ctx.sender] : []
        },
        body: { text: '*🛒⃞ ʟᴏᴊᴀ ᴛᴏᴋɪᴛᴏ ⃞🛒*' },
        carouselMessage
      }
    }, {})
    return true
  } catch (error) {
    console.log('[LOJA CARROSSEL]', error?.message || error)
    const text = lojaTexto(ctx, planosGrupo)
    return ctx.dylanModz ? ctx.dylanModz(text) : ctx.reply(text)
  }
}

const textoDono = plan => `- 🤖 \`𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙾 𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> 📦 ׄ ( ${plan.dias} dias — R$ ${moeda(plan.valor)}. )\n\n- 👤 \`𝙳𝙾𝙽𝙾\`\n\n> • ׄ ( Envie agora o número do dono do Sub Bot. )\n> • ׄ ( Use DDI + DDD + número. )\n> • ׄ ( Exemplo: 5598999999999. )\n\n> ❌ ׄ ( Digite cancelar para sair. )`

const textoNumero = (owner, plan) => `- ✅ \`𝙳𝙾𝙽𝙾 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝙳𝙾\`\n\n> 👤 ׄ ( ${owner} — dono do Sub Bot. )\n> 📦 ׄ ( ${plan.dias} dias — plano selecionado. )\n\n- 📱 \`𝙲𝙾𝙽𝙴𝚇𝙰̃𝙾\`\n\n> • ׄ ( Agora envie o número que será conectado como Sub Bot. )\n> • ׄ ( Use DDI + DDD + número. )\n> • ׄ ( Exemplo: 5511999999999. )\n\n> ❌ ׄ ( Digite cancelar para sair. )`

const enviarCodigo = async (ctx, sub, code) => {
  const text = `- 🔐 \`𝙲𝙾́𝙳𝙸𝙶𝙾 𝙳𝙴 𝙲𝙾𝙽𝙴𝚇𝙰̃𝙾\`\n\n> 👤 ׄ ( ${sub.owner} — dono do Sub Bot. )\n> 📱 ׄ ( ${sub.number} — número do Sub Bot. )\n> 📦 ׄ ( ${sub.days} dias — plano ativo. )\n\n- 📲 \`𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝚁\`\n\n> • ׄ ( Abra o WhatsApp do número acima. )\n> • ׄ ( Vá em Aparelhos conectados. )\n> • ׄ ( Escolha Conectar com número de telefone. )\n\n> 🔑 ׄ ( \`${code}\` — código de conexão. )`

  const ok = await enviarInterativo(ctx, text, [{
    name: 'cta_copy',
    buttonParamsJson: JSON.stringify({
      display_text: '🔐﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐂𝐎́𝐃𝐈𝐆𝐎﹙🔐',
      id: `sub_code_${sub.number}_${Date.now()}`,
      copy_code: String(code)
    })
  }], [ctx.sender])

  if (!ok) return ctx.reply(`${text}\n\n${code}`)
  return true
}

const enviarCodigoPrivado = async (ctx, sub, code) => {
  const numeroDono = store.normalize(sub.owner)
  const ownerJid = `${numeroDono}@s.whatsapp.net`
  const text = `- 🔐 \`𝙲𝙾́𝙳𝙸𝙶𝙾 𝙳𝙴 𝙲𝙾𝙽𝙴𝚇𝙰̃𝙾\`\n\n> 👤 ׄ ( ${sub.owner} — dono do Sub Bot. )\n> 📱 ׄ ( ${sub.number} — número do Sub Bot. )\n> 📦 ׄ ( ${sub.days} dias — plano ativo. )\n> 📅 ׄ ( ${dataBR(sub.expiresAt)} — vencimento. )\n\n- 📲 \`𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝚁\`\n\n> • ׄ ( Abra o WhatsApp do número acima. )\n> • ׄ ( Vá em Aparelhos conectados. )\n> • ׄ ( Escolha Conectar com número de telefone. )\n\n> 🔑 ׄ ( \`${code}\` — código de conexão. )`

  let entregue = false
  let comBotao = false

  // O PV não pode reutilizar quote/selo/contexto originados do grupo.
  // Isso causava falha/ACK inválido em Native Flow para outro JID.
  try {
    const interactiveMessage = proto.Message.InteractiveMessage.create({
      body: proto.Message.InteractiveMessage.Body.create({ text }),
      footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
        messageParamsJson: JSON.stringify({}),
        buttons: [{
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '🔐﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐂𝐎́𝐃𝐈𝐆𝐎﹙🔐',
            id: `sub_code_${sub.number}_${Date.now()}`,
            copy_code: String(code)
          })
        }]
      })
    })

    const msg = generateWAMessageFromContent(ownerJid, {
      viewOnceMessage: { message: { interactiveMessage } }
    }, {
      userJid: ctx.tokito.user?.id
    })

    await ctx.tokito.relayMessage(ownerJid, msg.message, { messageId: msg.key.id })
    entregue = true
    comBotao = true
  } catch (error) {
    console.log('[SUB PV BOTAO]', error?.message || error)
  }

  // Se o cliente/servidor recusar o botão, o código ainda é entregue SOMENTE no PV.
  if (!entregue) {
    try {
      await ctx.tokito.sendMessage(ownerJid, { text })
      entregue = true
    } catch (error) {
      console.log('[SUB PV TEXTO]', error?.message || error)
    }
  }

  if (!entregue) {
    await ctx.reply(`- ❌ \`𝙲𝙾́𝙳𝙸𝙶𝙾 𝙽𝙰̃𝙾 𝙴𝙽𝚅𝙸𝙰𝙳𝙾\`\n\n> 👤 ׄ ( ${sub.owner} — não consegui entregar a mensagem no privado. )\n> 🔐 ׄ ( O código não será exibido neste grupo. )\n> • ׄ ( Confira o número do dono e gere um novo código. )`)
    return false
  }

  await ctx.reply(`- ✅ \`𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> 👤 ׄ ( Dono registrado com sucesso. )\n> 📱 ׄ ( Sessão preparada. )\n> 🔐 ׄ ( Código de conexão enviado no privado do dono${comBotao ? ' com botão para copiar' : ''}. )\n> 📦 ׄ ( ${sub.days} dias — plano selecionado. )`)
  return true
}

const enviarConectado = async (ctx, sub) => {
  const cfgFile = path.join(store.ROOT, sub.number, 'config.json')
  let cfg = { prefix: '!' }
  try { cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8')) } catch {}

  const destino = String(sub.originChat || ctx.from || '').trim()
  const text = `- ✅ \`𝚂𝚄𝙱 𝙱𝙾𝚃 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾\`\n\n> 👤 ׄ ( ${sub.owner} — dono. )\n> 📱 ׄ ( ${sub.number} — número conectado. )\n> 🟢 ׄ ( Online — status atual. )\n> ⚙️ ׄ ( ${String(cfg.prefix || '!')} — prefixo atual. )\n> 📦 ׄ ( ${sub.days} dias — plano ativo. )\n> 📅 ׄ ( ${dataBR(sub.expiresAt)} — validade. )\n\n> • ׄ ( Seu Sub Bot já está pronto para uso. )`

  if (!destino) return false
  try {
    // Aviso deliberadamente simples: sem quote, selo, thumbnail ou Native Flow.
    // Isso evita incompatibilidade de contexto quando o evento vem do processo filho.
    const contextInfo = typeof ctx.canalInfo === 'function' ? ctx.canalInfo([]) : undefined
    await ctx.tokito.sendMessage(destino, { text, ...(contextInfo ? { contextInfo } : {}) })
    return true
  } catch (error) {
    console.log('[SUB CONECTADO GRUPO]', error?.message || error)
    return false
  }
}

const pixCaption = item => `- 💳 \`𝙿𝙸𝚇 𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> 🤖 ׄ ( Sub Bot — ${item.plan.dias} dias. )\n> 💸 ׄ ( R$ ${moeda(item.plan.valor)} — valor. )\n> ⏳ ׄ ( O pagamento será verificado automaticamente. )\n\n> • ׄ ( Depois da aprovação, eu vou pedir o número do dono e o número do Sub Bot. )`

const enviarPix = async (ctx, item) => {
  const code = String(item.pix_copia_e_cola || item.qr_code || '').trim()
  const b64 = String(item.qr_code_base64 || '').replace(/^data:image\/\w+;base64,/i, '').trim()
  const caption = pixCaption(item)

  if (!b64) return ctx.reply(code ? `${caption}\n\n\`${code}\`` : caption)

  try {
    const media = await prepareWAMessageMedia({ image: Buffer.from(b64, 'base64') }, { upload: ctx.tokito.waUploadToServer })
    const msg = generateWAMessageFromContent(ctx.from, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            contextInfo: await contexto(ctx, [ctx.sender]),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: true, imageMessage: media.imageMessage }),
            body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              messageParamsJson: JSON.stringify({}),
              buttons: code ? [{
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: '🧊﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐏𝐈𝐗﹙🧊',
                  id: `sub_pix_${Date.now()}`,
                  copy_code: code
                })
              }] : []
            })
          })
        }
      }
    }, { quoted: ctx.selo, userJid: ctx.tokito.user?.id })
    await ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
    return true
  } catch {
    await ctx.tokito.sendMessage(ctx.from, { image: Buffer.from(b64, 'base64'), caption }, { quoted: ctx.selo })
    if (code) await ctx.reply(`- 💳 \`𝙿𝙸𝚇 𝙲𝙾𝙿𝙸𝙰 𝙴 𝙲𝙾𝙻𝙰\`\n\n\`${code}\``)
    return true
  }
}

module.exports = {
  moeda,
  dataBR,
  lojaTexto,
  enviarLoja,
  textoDono,
  textoNumero,
  enviarCodigo,
  enviarCodigoPrivado,
  enviarConectado,
  enviarPix,
  enviarInterativo
}