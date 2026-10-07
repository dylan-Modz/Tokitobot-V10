
const fs = require('fs')
const path = require('path')
const { proto, prepareWAMessageMedia } = require('baileys')
const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

const mediaMenu = async ctx => {
  const video = path.join(__dirname, '..', '..', 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
  const image = path.join(__dirname, '..', '..', 'INFO_DADOS', 'LOGOS', 'fotomenu.png')

  if (fs.existsSync(video)) {
    const media = await prepareWAMessageMedia({
      video: fs.readFileSync(video),
      gifPlayback: true,
      mimetype: 'video/mp4'
    }, { upload: ctx.tokito.waUploadToServer })

    return proto.Message.InteractiveMessage.Header.create({
      hasMediaAttachment: true,
      videoMessage: media.videoMessage
    })
  }

  if (fs.existsSync(image)) {
    const media = await prepareWAMessageMedia({
      image: fs.readFileSync(image)
    }, { upload: ctx.tokito.waUploadToServer })

    return proto.Message.InteractiveMessage.Header.create({
      hasMediaAttachment: true,
      imageMessage: media.imageMessage
    })
  }

  return null
}

const listaPokemon = raro => Object.entries(r.POKEMON)
  .filter(([, x]) => raro ? x.raridade !== 'Comum' : x.raridade === 'Comum')
  .sort((a, b) => Number(a[1].id || 0) - Number(b[1].id || 0))

const textoPagina = (ctx, todos, pagina, raro = false) => {
  const porPagina = 15
  const totalPaginas = Math.max(1, Math.ceil(todos.length / porPagina))
  const atual = Math.min(Math.max(1, Number(pagina || 1)), totalPaginas)
  const itens = todos.slice((atual - 1) * porPagina, atual * porPagina)

  const linhas = itens.map(([id, x]) => ({
    emoji: x.raridade === 'Lendário' ? '✨'
      : x.raridade === 'Mítico' ? '🌌'
      : x.raridade === 'Raro' ? '💎'
      : x.raridade === 'Evoluído' ? '🔵'
      : '🔴',
    texto: '#' + x.id + ' ' + x.nome + ' • ' + x.tipo + ' • ' + x.raridade + ' • ' + dinheiro(x.preco) + ' • comprar: ' + ctx.prefix + 'comprarpokemon ' + id
  }))

  linhas.push({
    emoji: '📄',
    texto: 'Página ' + atual + '/' + totalPaginas + ' • ' + todos.length + ' Pokémon nesta loja'
  })

  if (atual < totalPaginas) {
    linhas.push({
      emoji: '➡️',
      texto: 'Próxima: ' + ctx.prefix + (raro ? 'lojararospokemon ' : 'lojapokemon ') + (atual + 1)
    })
  }

  return compacto(
    ctx,
    raro ? '💎' : '🔴',
    raro ? 'Loja Pokémon Raros' : 'Loja Pokémon',
    linhas
  )
}

const enviarCarrossel = async ctx => {
  const todos = listaPokemon(false)
  const porPagina = 15
  const totalPaginas = Math.ceil(todos.length / porPagina)
  const header = await mediaMenu(ctx)

  const mkCard = (itens, pagina) => {
    const rows = itens.map(([id, x]) => ({
      title: `🔴 #${x.id} ${x.nome} • ${dinheiro(x.preco)}`,
      description: `${x.tipo} • ${x.raridade} • comprar este Pokémon`,
      id: `${ctx.prefix}comprarpokemon ${id}`
    }))

    const lista = itens.map(([, x]) =>
      `> 🔴 #${x.id} • ${x.nome} • ${x.tipo} • ${dinheiro(x.preco)}`
    ).join('\n')

    const card = {
      header: { hasMediaAttachment: Boolean(header) },
      headerType: 'IMAGE',
      body: {
        text: `- 🔴 ` + String.fromCharCode(96) + `𝙻𝙾𝙹𝙰 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 • 𝙿𝙰́𝙶𝙸𝙽𝙰 ${pagina}` + String.fromCharCode(96) + `\n\n${lista}\n\n> 📄 ׄ ( Página ${pagina}/${totalPaginas}. )`
      },
      footer: {
        text: 'ᴇsᴄᴏʟʜᴀ ᴜᴍ ᴘᴏᴋᴇᴍᴏɴ ᴀʙᴀɪxᴏ'
      },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: `🔴 Escolher Pokémon • Página ${pagina}`,
            sections: [{
              title: `🔴 Loja Pokémon • Página ${pagina}`,
              rows
            }]
          })
        }]
      }
    }

    if (header?.videoMessage) {
      card.header = {
        hasMediaAttachment: true,
        videoMessage: header.videoMessage
      }
      card.headerType = 'VIDEO'
    } else if (header?.imageMessage) {
      card.header = {
        hasMediaAttachment: true,
        imageMessage: header.imageMessage
      }
      card.headerType = 'IMAGE'
    }

    return card
  }

  const cards = []

  for (let i = 0; i < totalPaginas; i++) {
    const inicio = i * porPagina
    const itens = todos.slice(inicio, inicio + porPagina)
    cards.push(mkCard(itens, i + 1))
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
      body: {
        text: '*🔴⃞ ʟᴏᴊᴀ ᴘᴏᴋᴇᴍᴏɴ ⃞🔴*'
      },
      carouselMessage: { cards }
    }
  }, {})

  return true
}

dylan.setCommand({
  nome: 'lojapokemon',
  comandos: ['lojapokemon', 'lojapoke', 'pokeshop', 'lojararospokemon', 'lojararospoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Mostra a loja de Pokémon em carrossel com quatro páginas.',
    uso: 'lojapokemon | lojararospokemon 1',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const cmd = String(ctx.command || '').toLowerCase()
    const raro = cmd.includes('raros')

    if (raro) {
      const todos = listaPokemon(true)
      const pagina = Math.max(1, Number(ctx.args?.[0] || 1))
      return ctx.reply(textoPagina(ctx, todos, pagina, true))
    }

    try {
      return await enviarCarrossel(ctx)
    } catch (error) {
      console.log('[LOJA POKEMON CARROSSEL]', error?.message || error)
      const todos = listaPokemon(false)
      const pagina = Math.max(1, Number(ctx.args?.[0] || 1))
      return ctx.reply(textoPagina(ctx, todos, pagina, false))
    }
  }
})
