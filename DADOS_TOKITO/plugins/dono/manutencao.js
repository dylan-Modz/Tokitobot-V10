/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Dev: Dylan Modz
 * ============================================================
 */

const manutencao = require('../../sistemas/manutencao')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'manutencao',
  comandos: [
    'manutencao',
    'addcmdmanu',
    'addmanu',
    'delcmdmanu',
    'delmanu',
    'listcmdmanu',
    'listmanu'
  ],
  categoria: 'dono',
  info: {
    descricao: 'Gerencia comandos que estão em manutenção.',
    uso: 'addcmdmanu comando | motivo',
    permissao: 'Dono',
    categoria: 'dono'
  },

  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())

    const comandoAtual = String(ctx.command || '').toLowerCase()

    if (['manutencao', 'listcmdmanu', 'listmanu'].includes(comandoAtual)) {
      const lista = manutencao.listar()

      if (!lista.length)
        return ctx.reply(ctx.mess.manutencaoListaVazia())

      const texto = lista
        .map((item, indice) => {
          const motivo = item.motivo
            ? ` — ${item.motivo}`
            : ''

          return `> 🛠️ ׄ ( ${indice + 1}. ${ctx.prefix}${item.nome}${motivo} )`
        })
        .join('\n')

      return ctx.reply(ctx.mess.manutencaoLista(texto, lista.length))
    }

    if (['addcmdmanu', 'addmanu'].includes(comandoAtual)) {
      const partes = String(ctx.q || '').split('|')
      const nomeDigitado = String(partes.shift() || '').trim().split(/\s+/)[0]
      const motivo = partes.join('|').trim()

      if (!nomeDigitado)
        return ctx.reply(ctx.mess.manutencaoAddUso(ctx.prefix))

      const resolvido = ctx.plugins.resolver(nomeDigitado)

      if (!resolvido)
        return ctx.reply(ctx.mess.manutencaoComandoInexistente(nomeDigitado))

      const nome = resolvido.canonico
      const resultado = manutencao.adicionar(nome, motivo)

      if (!resultado.ok && resultado.motivo === 'ja')
        return ctx.reply(ctx.mess.manutencaoJaAdicionado(nome))

      return ctx.reply(ctx.mess.manutencaoAdicionado(nome, motivo))
    }

    if (['delcmdmanu', 'delmanu'].includes(comandoAtual)) {
      const nomeDigitado = String(ctx.q || '').trim().split(/\s+/)[0]

      if (!nomeDigitado)
        return ctx.reply(ctx.mess.manutencaoDelUso(ctx.prefix))

      const resolvido = ctx.plugins.resolver(nomeDigitado)
      const nome = resolvido?.canonico || manutencao.normalizar(nomeDigitado)
      const resultado = manutencao.remover(nome)

      if (!resultado.ok)
        return ctx.reply(ctx.mess.manutencaoNaoAdicionado(nome))

      return ctx.reply(ctx.mess.manutencaoRemovido(nome))
    }
  }
})
