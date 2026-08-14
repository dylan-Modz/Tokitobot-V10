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

    const dados = atividade.dados(mapa[jid])
    const numero = String(jid || '').split('@')[0] || 'desconhecido'

    return ctx.reply(
      ctx.mess.meAtividade(
        numero,
        dados.comandos,
        dados.audios,
        dados.figurinhas,
        dados.documentos,
        dados.fotos,
        dados.videos
      ),
      [jid]
    )
  }
}
