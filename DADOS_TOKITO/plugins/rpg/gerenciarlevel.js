const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto } = require('../../sistemas/rpg/texto')

const destino = async ctx => {
  const dados = await ctx.destino().catch(() => null)

  if (!dados?.mencao)
    return null

  return ctx.normalizar(dados.mencao)
}

dylan.setCommand({
  nome: 'gerenciarlevel',
  comandos: [
    'rank',
    'blocklevel',
    'unblocklevel'
  ],
  categoria: 'rpg',
  info: {
    descricao: 'Ranking geral e bloqueio de ganho de XP do RPG.',
    uso: 'rank',
    requisitos: 'Modo RPG',
    categoria: 'rpg'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.temRpg(ctx))
      return ctx.reply(ctx.mess.rpgDesativado(ctx.prefix))

    const comando = String(ctx.command || '').toLowerCase()

    if (comando === 'rank') {
      const lista = r.rank(ctx, 'xp').slice(0, 10)

      return ctx.reply(
        ctx.mess.levelRank(lista),
        lista.map(item => item.jid)
      )
    }

    if (!ctx.SoDono && !ctx.isGroupAdmins)
      return ctx.reply(ctx.mess.soadm())

    const jid = await destino(ctx)

    if (!jid) {
      return ctx.reply(compacto(ctx, '🎖️', 'Gerenciar Level', [
        {
          emoji: '📌',
          texto: `${ctx.prefix}${comando} @usuario`
        }
      ]))
    }

    const usuario = r.user(ctx, jid)
    const bloquear = comando === 'blocklevel'

    usuario.bloqueado = bloquear
    r.salvar(ctx)

    return ctx.reply(compacto(
      ctx,
      bloquear ? '🔒' : '🔓',
      bloquear ? 'Level bloqueado' : 'Level desbloqueado',
      [
        {
          emoji: '👤',
          texto: `@${jid.split('@')[0]}`
        },
        {
          emoji: bloquear ? '⛔' : '✅',
          texto: bloquear
            ? 'O usuário não receberá XP pelos novos sistemas RPG'
            : 'O ganho de XP foi liberado novamente'
        }
      ]
    ), [jid])
  }
})
