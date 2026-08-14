const atividade = require('../_atividade')

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
          .map(membro => ctx.nJid(membro))
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

        await ctx.reply(
          ctx.mess.atividadePainel({
            titulo: '𝙰𝚃𝙸𝚅𝙸𝙳𝙰𝙳𝙴𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾',
            emoji: '📊',
            itens,
            pagina: i + 1,
            paginas: paginas.length,
            vazio: 'ɴᴇɴʜᴜᴍᴀ ᴀᴛɪᴠɪᴅᴀᴅᴇ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ.'
          }),
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

      await ctx.reply(
        ctx.mess.atividadePainel({
          titulo: `𝙸𝙽𝙰𝚃𝙸𝚅𝙾𝚂 • 𝙻𝙸𝙼𝙸𝚃𝙴 ${limite}`,
          emoji: '💤',
          itens,
          pagina: i + 1,
          paginas: paginas.length,
          vazio: 'ɴᴇɴʜᴜᴍ ᴍᴇᴍʙʀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.'
        }),
        itens.map(v => v.j)
      )
    }
  }
}
