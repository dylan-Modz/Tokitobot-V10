/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Dev: Dylan Modz
 * ============================================================
 */

const parcerias = require('../../sistemas/parcerias')
const dylan = require('../../database/lib/comandos')

const alvoDoContexto = ctx => {
  let alvo = ctx.menc_os2 || ctx.menc_prt || ''

  if (Array.isArray(alvo))
    alvo = alvo[0]

  return parcerias.normalizarUsuario(alvo)
}

const exigirAdm = async ctx => {
  if (!ctx.isGroup) {
    await ctx.reply(ctx.mess.sogrupo())
    return false
  }

  if (!ctx.isGroupAdmins && !ctx.SoDono) {
    await ctx.reply(ctx.mess.soadm())
    return false
  }

  if (!parcerias.modoAtivo(ctx.from)) {
    await ctx.reply(ctx.mess.parceriaModoDesativado(ctx.prefix))
    return false
  }

  return true
}

dylan.setCommand({
  nome: 'gerenciarparceria',
  comandos: [
    'addparceria',
    'adicionarparceria',
    'delparceria',
    'removerparceria',
    'suspenderparceria',
    'reativarparceria',
    'renovarparceria',
    'bypassparceria'
  ],
  categoria: 'admin',
  info: {
    descricao: 'Gerencia as parcerias do grupo.',
    uso: 'addparceria @usuario | Nome | Tipo | Link | Dias | Nível | Descrição',
    permissao: 'ADM',
    categoria: 'admin'
  },

  async executar(ctx) {
    if (!await exigirAdm(ctx))
      return

    const comandoAtual = String(ctx.command || '').toLowerCase()

    if (['addparceria', 'adicionarparceria'].includes(comandoAtual)) {
      const partes = String(ctx.q || '')
        .split('|')
        .map(item => item.trim())

      let responsavel = alvoDoContexto(ctx)

      if (responsavel && partes.length) {
        const primeiro = String(partes[0] || '').trim()
        const numeroPrimeiro = primeiro.replace(/\D/g, '')
        const numeroAlvo = responsavel.split('@')[0]

        if (primeiro.startsWith('@') || (numeroPrimeiro && numeroPrimeiro === numeroAlvo))
          partes.shift()
      }

      if (!responsavel) {
        responsavel = parcerias.normalizarUsuario(partes.shift())
      }

      const nome = partes.shift() || ''
      const tipo = partes.shift() || 'Parceiro'
      const link = partes.shift() || ''
      const diasTexto = partes.shift() || '0'
      const nivel = partes.shift() || 'Padrão'
      const descricao = partes.join(' | ')
      const dias = Number(diasTexto)

      if (!responsavel || !nome || !link || !Number.isInteger(dias) || dias < 0)
        return ctx.reply(ctx.mess.parceriaAddUso(ctx.prefix))

      const resultado = parcerias.adicionar({
        grupo: ctx.from,
        responsavel,
        nome,
        tipo,
        link,
        dias,
        nivel,
        descricao,
        bypass: true,
        criadoPor: ctx.sender
      })

      if (!resultado.ok && resultado.motivo === 'ja')
        return ctx.reply(ctx.mess.parceriaJaCadastrada(resultado.parceria?.id))

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaAddUso(ctx.prefix))

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaAprovada(resultado.parceria.responsavel, resultado.parceria.id),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [resultado.parceria.responsavel]
        }
      }, { quoted: ctx.selo })
    }

    if (['delparceria', 'removerparceria'].includes(comandoAtual)) {
      const termo = String(ctx.q || '').trim() || alvoDoContexto(ctx)

      if (!termo)
        return ctx.reply(ctx.mess.parceriaTermoUso(ctx.prefix, ctx.command))

      const resultado = parcerias.remover(ctx.from, termo)

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaNaoEncontrada())

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaRemovida(resultado.parceria.responsavel),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [resultado.parceria.responsavel]
        }
      }, { quoted: ctx.selo })
    }

    if (comandoAtual === 'suspenderparceria') {
      const termo = String(ctx.q || '').trim() || alvoDoContexto(ctx)

      if (!termo)
        return ctx.reply(ctx.mess.parceriaTermoUso(ctx.prefix, ctx.command))

      const resultado = parcerias.suspender(ctx.from, termo)

      if (!resultado.ok && resultado.motivo === 'nao')
        return ctx.reply(ctx.mess.parceriaNaoEncontrada())

      if (!resultado.ok && resultado.motivo === 'ja')
        return ctx.reply(ctx.mess.parceriaJaSuspensa())

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaSuspensa(resultado.parceria.responsavel),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [resultado.parceria.responsavel]
        }
      }, { quoted: ctx.selo })
    }

    if (comandoAtual === 'reativarparceria') {
      const termo = String(ctx.q || '').trim() || alvoDoContexto(ctx)

      if (!termo)
        return ctx.reply(ctx.mess.parceriaTermoUso(ctx.prefix, ctx.command))

      const resultado = parcerias.reativar(ctx.from, termo)

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaNaoEncontrada())

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaReativada(resultado.parceria.responsavel),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [resultado.parceria.responsavel]
        }
      }, { quoted: ctx.selo })
    }

    if (comandoAtual === 'renovarparceria') {
      const partes = String(ctx.q || '')
        .split(/[|\s]+/)
        .map(item => item.trim())
        .filter(Boolean)

      const termo = partes.shift() || ''
      const dias = Number(partes.shift())

      if (!termo || !Number.isInteger(dias) || dias < 0)
        return ctx.reply(ctx.mess.parceriaRenovarUso(ctx.prefix))

      const resultado = parcerias.renovar(ctx.from, termo, dias)

      if (!resultado.ok && resultado.motivo === 'nao')
        return ctx.reply(ctx.mess.parceriaNaoEncontrada())

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaRenovarUso(ctx.prefix))

      return ctx.reply(ctx.mess.parceriaRenovada(
        resultado.parceria.nome,
        dias === 0 ? '∞' : dias
      ))
    }

    if (comandoAtual === 'bypassparceria') {
      const partes = String(ctx.q || '')
        .split(/[|\s]+/)
        .map(item => item.trim())
        .filter(Boolean)

      const termo = partes.shift() || ''
      const valor = partes.shift() || ''

      if (!termo || !['0', '1'].includes(valor))
        return ctx.reply(ctx.mess.parceriaBypassUso(ctx.prefix))

      const resultado = parcerias.alterarBypass(ctx.from, termo, valor === '1')

      if (!resultado.ok)
        return ctx.reply(ctx.mess.parceriaNaoEncontrada())

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaBypassAlterado(resultado.parceria.responsavel, valor === '1'),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [resultado.parceria.responsavel]
        }
      }, { quoted: ctx.selo })
    }
  }
})
