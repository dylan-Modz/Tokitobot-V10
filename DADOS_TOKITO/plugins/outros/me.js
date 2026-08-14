const atividade = require('../_atividade')

module.exports = {
  nome: 'me',
  comandos: ['me'],
  categoria: 'outros',
  info: {
    descricao: 'Mostra somente a sua atividade no grupo.',
    uso: 'me',
    permissao: 'Todos'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    const jid = ctx.normalizar(ctx.sender)

    const mapa =
      ctx.dataGp?.[0]?.atividades &&
      typeof ctx.dataGp[0].atividades === 'object' &&
      !Array.isArray(ctx.dataGp[0].atividades)
        ? ctx.dataGp[0].atividades
        : {}

    const item = {
      j: jid,
      ...atividade.dados(mapa[jid])
    }

    return ctx.reply(
      ctx.mess.atividadePainel({
        titulo: '𝙼𝙸𝙽𝙷𝙰 𝙰𝚃𝙸𝚅𝙸𝙳𝙰𝙳𝙴',
        emoji: '👤',
        itens: [item]
      }),
      [jid]
    )
  }
}
