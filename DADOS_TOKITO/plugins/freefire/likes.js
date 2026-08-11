const h = require('./_base')
const auto = require('../../sistemas/autolike')

const headers = ctx => ({
  'x-api-key': h.tokenLikes(ctx),
  'Content-Type': 'application/json'
})

module.exports = {
  nome: 'likes',
  comandos: ['likes', 'autolike'],
  categoria: 'freefire',
  info: {
    descricao: 'Likes imediatos e Auto Like diário do Free Fire.',
    uso: 'likes UID | autolike UID | autolike del UID'
  },
  async executar(ctx) {
    try {
      if (ctx.command === 'autolike') {
        const p = String(ctx.q || '').trim().split(/\s+/)
        if (p[0]?.toLowerCase() === 'del') {
          const uid = String(p[1] || '').replace(/\D/g, '')
          if (!uid)
            return ctx.reply(`Use *${ctx.prefix}autolike del UID*.`)
          return ctx.reply(auto.remover(ctx.sender, uid) ? `✅ Auto Like removido do UID *${uid}*.` : '❌ Esse UID não estava no seu Auto Like.')
        }
        const uid = String(p[0] || '').replace(/\D/g, '')
        if (!uid)
          return ctx.reply(`Use *${ctx.prefix}autolike UID*.`)
        auto.registrar(ctx.sender, ctx.from, uid)
        auto.processar().catch(() => {
        })
        return ctx.reply(`❤️ Auto Like ativado para *${uid}*.\nO sistema tenta enviar uma vez por dia e não duplica após reiniciar.`)
      }
      const player_id = String(ctx.q || '').trim()
      if (!player_id)
        return ctx.reply(ctx.mess.ffLikesUso(ctx.prefix))
      await ctx.reagir(ctx.from, '❤️')
      const { data } = await ctx.axios.post(`${ctx.API_URL}/api/v1/likes`, { player_id }, {
        headers: headers(ctx),
        timeout: 90000
      })
      if (!data?.success)
        return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
      await ctx.reagir(ctx.from, '✅')
      return ctx.reply(ctx.mess.ffLikesSucesso({
        NomeDoBot: ctx.NomeDoBot,
        pushname: ctx.pushname || 'Usuário',
        player_id,
        data
      }), [ctx.sender])
    }
    catch (error) {
      console.log('[FREE FIRE LIKES]', ctx.modulos.sanitizarErro(error, [ctx.API_KEY_TOKITO]))
      await ctx.reagir(ctx.from, '❌').catch(() => {
      })
      return ctx.reply(ctx.mess.erroApi(ctx.API_URL))
    }
  }
}
