/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Dev: Dylan Modz
 * ============================================================
 */

const parcerias = require('../../sistemas/parcerias')
const dylan = require('../../database/lib/comandos')

const exigirGrupoModo = async ctx => {
  if (!ctx.isGroup) {
    await ctx.reply(ctx.mess.sogrupo())
    return false
  }

  if (!parcerias.modoAtivo(ctx.from)) {
    await ctx.reply(ctx.mess.parceriaModoDesativado(ctx.prefix))
    return false
  }

  return true
}

const exigirAdm = async ctx => {
  if (!await exigirGrupoModo(ctx))
    return false

  if (!ctx.isGroupAdmins && !ctx.SoDono) {
    await ctx.reply(ctx.mess.soadm())
    return false
  }

  return true
}

dylan.setCommand({
  nome: 'solicitarparceria',
  comandos: [
    'solicitarparceria',
    'pedirparceria',
    'solicitacoesparceria',
    'aprovarparceria',
    'recusarparceria'
  ],
  categoria: 'admin',
  info: {
    descricao: 'Solicita e gerencia pedidos de parceria.',
    uso: 'solicitarparceria Nome | Tipo | Link | Descrição',
    categoria: 'admin'
  },

  async executar(ctx) {
    const comandoAtual = String(ctx.command || '').toLowerCase()

    if (['solicitarparceria', 'pedirparceria'].includes(comandoAtual)) {
      if (!await exigirGrupoModo(ctx))
        return

      const partes = String(ctx.q || '')
        .split('|')
        .map(item => item.trim())

      const nome = partes.shift() || ''
      const tipo = partes.shift() || 'Parceiro'
      const link = partes.shift() || ''
      const descricao = partes.join(' | ')

      if (!nome || !link)
        return ctx.reply(ctx.mess.parceriaSolicitarUso(ctx.prefix))

      const resultado = parcerias.solicitar({
        grupo: ctx.from,
        responsavel: ctx.sender,
        nome,
        tipo,
        link,
        descricao
      })

      if (!resultado.ok && resultado.motivo === 'ja')
        return ctx.reply(ctx.mess.parceriaSolicitacaoJaExiste(resultado.solicitacao?.id))

      if (!resultado.ok && resultado.motivo === 'parceiro')
        return ctx.reply(ctx.mess.parceriaJaCadastrada(resultado.parceria?.id))

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaSolicitarUso(ctx.prefix))

      return ctx.reply(ctx.mess.parceriaSolicitada(resultado.solicitacao.id))
    }

    if (comandoAtual === 'solicitacoesparceria') {
      if (!await exigirAdm(ctx))
        return

      const lista = parcerias.listarSolicitacoes(ctx.from)

      if (!lista.length)
        return ctx.reply(ctx.mess.parceriaSemSolicitacoes())

      const texto = lista
        .map(item =>
          `> 📨 ׄ ( ${item.id} — ${item.nome} — @${String(item.responsavel).split('@')[0]} )`
        )
        .join('\n')

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaSolicitacoes(texto, lista.length),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: lista.map(item => item.responsavel).filter(Boolean)
        }
      }, { quoted: ctx.selo })
    }

    if (comandoAtual === 'aprovarparceria') {
      if (!await exigirAdm(ctx))
        return

      const partes = String(ctx.q || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

      const id = partes.shift() || ''
      const diasTexto = partes.shift() || '0'
      const nivel = partes.join(' ') || 'Padrão'
      const dias = Number(diasTexto)

      if (!id || !Number.isInteger(dias) || dias < 0)
        return ctx.reply(ctx.mess.parceriaAprovarUso(ctx.prefix))

      const resultado = parcerias.aprovarSolicitacao(
        ctx.from,
        id,
        dias,
        nivel,
        ctx.sender
      )

      if (!resultado.ok && resultado.motivo === 'nao')
        return ctx.reply(ctx.mess.parceriaSolicitacaoNaoEncontrada())

      if (!resultado.ok && resultado.motivo === 'ja')
        return ctx.reply(ctx.mess.parceriaJaCadastrada(resultado.parceria?.id))

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaAprovarUso(ctx.prefix))

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaAprovada(resultado.parceria.responsavel, resultado.parceria.id),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [resultado.parceria.responsavel]
        }
      }, { quoted: ctx.selo })
    }

    if (comandoAtual === 'recusarparceria') {
      if (!await exigirAdm(ctx))
        return

      const partes = String(ctx.q || '').trim().split(/\s+/)
      const id = partes.shift() || ''
      const motivo = partes.join(' ').trim() || 'Sem motivo informado'

      if (!id)
        return ctx.reply(ctx.mess.parceriaRecusarUso(ctx.prefix))

      const resultado = parcerias.recusarSolicitacao(
        ctx.from,
        id,
        motivo,
        ctx.sender
      )

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaSolicitacaoNaoEncontrada())

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaRecusada(resultado.solicitacao.responsavel, motivo),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [resultado.solicitacao.responsavel]
        }
      }, { quoted: ctx.selo })
    }
  }
})
