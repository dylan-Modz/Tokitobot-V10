const dylan = require('../../database/lib/comandos')
const sistema = require('../../sub')
const fs = require('fs')
const path = require('path')
const { lerTipo, salvarTipo } = require('../../sistemas/tipo-whatsapp')

const escolher = ctx => {
  const args = String(ctx.q || '').trim().toLowerCase().split(/\s+/)
  const digitado = sistema.store.normalize(args.find(x => /^\d{10,15}$/.test(x)) || '')
  if (digitado) {
    const item = sistema.store.get(digitado)
    if (item && (ctx.SoDono || sistema.store.normalize(item.owner) === sistema.store.normalize(ctx.sender))) return item
  }
  const meus = sistema.store.byOwner(ctx.sender)
  return meus.length === 1 ? meus[0] : null
}

dylan.setCommand({
  nome: 'code',
  comandos: ['code'],
  categoria: 'sub',
  info: {
    descricao: 'Inicia/reconecta a sessão do próprio Sub Bot.',
    uso: 'code',
    categoria: 'sub'
  },
  async executar(ctx) {
    if (ctx.isGroup) return ctx.reply(`- 🔒 \`𝙿𝚁𝙸𝚅𝙰𝙳𝙾\`\n\n> • ׄ ( Use este comando no privado. )`)

    const sub = escolher(ctx)
    if (!sub) {
      const meus = sistema.store.byOwner(ctx.sender)
      if (meus.length > 1) {
        return ctx.reply(`- 🤖 \`𝚂𝙴𝚄𝚂 𝚂𝚄𝙱𝚂\`\n\n${meus.map(x => `> • ׄ ( ${x.number} — ${x.status}. )`).join('\n')}\n\n> • ׄ ( Informe o número depois de ${ctx.prefix}code. )`)
      }
      return ctx.reply(`- ⚠️ \`𝚂𝚄𝙱 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`\n\n> • ׄ ( Nenhum Sub Bot foi encontrado para você. )`)
    }

    const partes = String(ctx.q || '').trim().toLowerCase().split(/\s+/)
    const tipo = partes.find(x => x === 'normal' || x === 'business')
    const pasta = path.join(sistema.store.ROOT, sub.number, 'qrcode')
    const arquivo = path.join(pasta, 'tipo-whatsapp.json')

    if (!tipo && !fs.existsSync(arquivo)) {
      return ctx.reply(`- 📱 \`𝙲𝙾𝙽𝙴𝚇𝙰̃𝙾 𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> 📱 ׄ ( ${ctx.prefix}code ${sub.number} normal — WhatsApp Normal. )\n> 💼 ׄ ( ${ctx.prefix}code ${sub.number} business — WhatsApp Business. )\n\n> • ׄ ( Escolha o tipo da sua conta antes de conectar. )`)
    }

    const anterior = fs.existsSync(arquivo) ? lerTipo(pasta) : null
    if (tipo) {
      salvarTipo(pasta, tipo)
      sistema.store.update(sub.number, { tipo })
    }

    const handlers = {
      onCode: (code, atual) => sistema.ui.enviarCodigoPrivado(ctx, atual, code),
      onOnline: atual => sistema.ui.enviarConectado(ctx, atual),
      onError: error => ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
    }

    try {
      const mudar = tipo && anterior !== tipo && sistema.manager.workers.has(sub.number)
      const result = mudar
        ? await sistema.manager.restart(sub.number, handlers)
        : sistema.manager.start(sub.number, handlers)

      if (result.reused) {
        return ctx.reply(`- 🟢 \`𝚂𝚄𝙱 𝙰𝚃𝙸𝚅𝙾\`\n\n> • ׄ ( A sessão ${sub.number} já está em execução. )`)
      }

      if (result.registered) {
        return ctx.reply(`- 🟡 \`𝚂𝙴𝚂𝚂𝙰̃𝙾 𝚂𝙰𝙻𝚅𝙰\`\n\n> • ׄ ( Iniciando a sessão ${sub.number} sem gerar um novo código. )`)
      }

      return true
    } catch (error) {
      return ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
    }
  }
})