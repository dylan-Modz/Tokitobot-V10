const store = require('./store')
const manager = require('./manager')
const ui = require('./ui')
const runtime = require('./runtime')
const path = require('path')
const { salvarTipo } = require('../sistemas/tipo-whatsapp')

const pending = new Map()

const key = (from, sender) => `${String(from || '')}|${store.normalize(sender)}`

const temPendente = (from, sender) => pending.has(key(from, sender))

const iniciar = async (ctx, plan, options = {}) => {
  if (runtime.isSubBot) return false
  if (!plan) throw new Error('PLANO_SUB_INVALIDO')
  pending.set(key(ctx.from, ctx.sender), {
    step: 'owner',
    plan,
    paid: options.paid === true,
    buyer: store.normalize(options.buyer || ctx.sender),
    createdAt: Date.now()
  })

  await ctx.reply(ui.textoDono(plan))
  return true
}

const iniciarPagamento = async (tokito, jid, plan, buyer) => {
  const chat = String(jid || '')
  const sender = store.normalize(buyer || jid)
  const k = key(chat, sender)
  pending.set(k, {
    step: 'owner',
    plan,
    paid: true,
    buyer: sender,
    createdAt: Date.now()
  })

  await tokito.sendMessage(chat, { text: ui.textoDono(plan), mentions: sender ? [`${sender}@s.whatsapp.net`] : [] }).catch(() => {})
  return true
}

const handle = async ctx => {
  if (runtime.isSubBot) return false
  const k = key(ctx.from, ctx.sender)
  const state = pending.get(k)
  if (!state) return false

  if (Date.now() - Number(state.createdAt || 0) > 10 * 60 * 1000) {
    pending.delete(k)
    await ctx.reply(`- ⏳ \`𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙾 𝙴𝚇𝙿𝙸𝚁𝙰𝙳𝙾\`\n\n> • ׄ ( Inicie novamente o cadastro do Sub Bot. )`)
    return true
  }

  const text = String(ctx.body || '').trim()
  if (!text) return true

  if (text.toLowerCase() === 'cancelar') {
    pending.delete(k)
    await ctx.reply(`- ❌ \`𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾\`\n\n> • ׄ ( Nenhuma sessão foi criada. )`)
    return true
  }

  if (state.step === 'tipo') {
    const tipo = text.toLowerCase()
    if (tipo !== 'normal' && tipo !== 'business') {
      return ctx.reply(`- 📱 \`𝚃𝙸𝙿𝙾 𝙳𝙴 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿\`\n\n> 📱 ׄ ( Digite normal para WhatsApp Normal. )\n> 💼 ׄ ( Digite business para WhatsApp Business. )`)
    }

    pending.delete(k)
    const atual = store.get(state.number)
    if (!atual) return ctx.reply('❌ Sub Bot não encontrado.')

    try {
      salvarTipo(path.join(store.ROOT, atual.number, 'qrcode'), tipo)
      const sub = store.update(atual.number, { tipo })

      await ctx.reply(`- 🧊 \`𝙿𝚁𝙴𝙿𝙰𝚁𝙰𝙽𝙳𝙾 𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> 📱 ׄ ( ${sub.number} — sessão sendo preparada. )\n> • ׄ ( Gerando código de conexão... )`)

      const result = manager.start(sub.number, {
        onCode: (code, current) => ui.enviarCodigoPrivado(ctx, current, code),
        onOnline: current => ui.enviarConectado({ ...ctx, from: String(current?.originChat || ctx.from) }, current),
        onError: error => ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
      })

      if (result.registered) {
        await ctx.reply(`- 🟡 \`𝚂𝙴𝚂𝚂𝙰̃𝙾 𝙹𝙰́ 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝙳𝙰\`\n\n> • ׄ ( Iniciando a sessão salva desse Sub Bot. )`)
      }
    } catch (error) {
      store.update(atual.number, { status: 'erro', lastError: String(error?.message || error) })
      await ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾 𝙰𝙾 𝙸𝙽𝙸𝙲𝙸𝙰𝚁\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
    }
    return true
  }

  const number = store.normalize(text)
  if (number.length < 10 || number.length > 15) {
    await ctx.reply(`- ⚠️ \`𝙽𝚄́𝙼𝙴𝚁𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`\n\n> • ׄ ( Envie DDI + DDD + número, somente números. )`)
    return true
  }

  if (state.step === 'owner') {
    state.owner = number
    state.step = 'bot'
    pending.set(k, state)
    await ctx.reply(ui.textoNumero(number, state.plan))
    return true
  }

  if (state.step === 'bot') {
    if (store.get(number)) {
      await ctx.reply(`- ⚠️ \`𝚂𝚄𝙱 𝙹𝙰́ 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾\`\n\n> • ׄ ( Esse número já possui um cadastro de Sub Bot. )`)
      return true
    }

    const sub = store.create({
      owner: state.owner, number, days: state.plan.dias, paid: state.paid,
      buyer: state.buyer, originChat: String(ctx.from || ''),
      originRequester: store.normalize(ctx.sender)
    })

    state.number = sub.number
    state.step = 'tipo'
    pending.set(k, state)

    await ctx.reply(`- 📱 \`𝚃𝙸𝙿𝙾 𝙳𝙴 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿\`\n\n> 📱 ׄ ( Digite normal para WhatsApp Normal. )\n> 💼 ׄ ( Digite business para WhatsApp Business. )\n\n> • ׄ ( Após escolher, enviarei o código no privado do dono. )`)
    return true
  }

  return true
}

module.exports = { pending, key, temPendente, iniciar, iniciarPagamento, handle }