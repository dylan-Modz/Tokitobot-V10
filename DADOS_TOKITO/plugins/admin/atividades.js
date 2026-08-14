const atividade = require('../_atividade')

const blocoUsuario = (mess, item) => {
  const numero = String(item.j || '').split('@')[0] || 'desconhecido'

  const completo = mess.atividade(
    numero,
    item.comandos,
    item.audios,
    item.figurinhas,
    item.documentos,
    item.fotos,
    item.videos
  )

  const linhas = String(completo || '')
    .split('\n')
    .filter(linha => linha.startsWith('┃࣪'))

  return linhas.join('\n') || completo
}

module.exports = {
  nome: 'atividades',
  comandos: ['atividades', 'inativos'],
  categoria: 'admin',

  info: {
    descricao: 'Mostra as atividades do grupo e os membros inativos.',
    uso: 'atividades | inativos 5',
    permissao: 'ADM'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())

    const mapa =
      ctx.dataGp?.[0]?.atividades &&
      typeof ctx.dataGp[0].atividades === 'object' &&
      !Array.isArray(ctx.dataGp[0].atividades)
        ? ctx.dataGp[0].atividades
        : {}

    const atuais = [
      ...new Set(
        (ctx.groupMembers || [])
          .map(membro =>
            ctx.nJid(
              membro?.phoneNumber ||
              membro?.jid ||
              membro?.id ||
              membro?.participant ||
              membro
            )
          )
          .filter(Boolean)
      )
    ]

    const linhas = atuais.map(j => ({
      j,
      ...atividade.dados(mapa[j])
    }))

    if (ctx.command === 'atividades') {
      const ranking = linhas
        .sort((a, b) => b.pontos - a.pontos)
        .slice(0, 50)

      const paginas = atividade.paginar(ranking, 8)

      for (let i = 0; i < paginas.length; i++) {
        const itens = paginas[i]
        const conteudo = itens
          .map(item => blocoUsuario(ctx.mess, item))
          .filter(Boolean)
          .join('\n├╾═╼･ﾟ𖤐ﾟ･｡❄️｡･ﾟ𖤐ﾟ･╾═╼┤\n')

        await ctx.reply(
          ctx.mess.atividades(
            conteudo,
            i + 1,
            paginas.length
          ),
          itens.map(v => v.j)
        )
      }

      return
    }

    const limite = Math.max(
      0,
      Number(String(ctx.q || '0').replace(/\D/g, '')) || 0
    )

    const inativos = linhas
      .filter(v => v.pontos <= limite)
      .sort((a, b) => a.pontos - b.pontos)
      .slice(0, 50)

    const paginas = atividade.paginar(inativos, 8)

    for (let i = 0; i < paginas.length; i++) {
      const itens = paginas[i]
      const conteudo = itens
        .map(item => blocoUsuario(ctx.mess, item))
        .filter(Boolean)
        .join('\n├╾═╼･ﾟ𖤐ﾟ･｡❄️｡･ﾟ𖤐ﾟ･╾═╼┤\n')

      await ctx.reply(
        ctx.mess.inativos(
          conteudo,
          limite,
          i + 1,
          paginas.length
        ),
        itens.map(v => v.j)
      )
    }
  }
}
