const modulos = require('../../sistemas/modulos')

const cmdNorm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c').replace(/^\W+/, '')

module.exports = {
  nome: 'rgcmd',
  comandos: ['rgcmd', 'delcmd', 'noprefix'],
  categoria: 'dono',
  info: {
    descricao: 'Registra comandos para funcionar sem prefixo.',
    uso: 'rgcmd palavra comando',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    const db = modulos.noPrefix()
    if (ctx.command === 'noprefix') {
      const itens = Object.entries(db)
      return ctx.reply(itens.length ? '🧊 *SYSTEM NO PREFIX*\n\n' + itens.map(([a, b]) => `• ${a} → ${b}`).join('\n') : '🧊 Nenhum comando sem prefixo registrado.')
    }
    const p = String(ctx.q || '').trim().split(/\s+/).filter(Boolean)
    if (ctx.command === 'delcmd') {
      const k = modulos.norm(p[0])
      if (!k)
        return ctx.reply(`Use *${ctx.prefix}delcmd palavra*.`)
      if (!db[k])
        return ctx.reply('❌ Esse gatilho não existe.')
      delete db[k]
      modulos.salvarNoPrefix(db)
      return ctx.reply(`✅ Gatilho *${k}* removido.`)
    }
    const gatilho = modulos.norm(p.shift())
    const real = cmdNorm(p.shift())
    if (!gatilho || !real)
      return ctx.reply(`Use *${ctx.prefix}rgcmd ban ban*.`)
    if (!ctx.plugins.resolver(real))
      return ctx.reply(`❌ O comando *${real}* não existe nos plugins.`)
    db[gatilho] = real
    modulos.salvarNoPrefix(db)
    return ctx.reply(`✅ Agora *${gatilho}* executa *${ctx.prefix}${real}* sem precisar do prefixo.`)
  }
}
