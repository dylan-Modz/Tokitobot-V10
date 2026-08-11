const ia = require('../../../ia')

module.exports = {
  nome: 'iaaudio',
  comandos: ['iaaudio', 'audioia', 'voz-ia'],
  categoria: 'ia',
  info: {
    descricao: 'Faz uma pergunta para a Tokito IA e recebe a resposta em voz.',
    uso: 'iaaudio pergunta',
    categoria: 'ia'
  },
  async executar(ctx) {
    if (!String(ctx.q || '').trim())
      return ctx.reply(`- 🎙️ \`𝙸𝙰 𝙴𝙼 𝚅𝙾𝚉\`\n\n> *『 𝚄𝚂𝙾 』— ${ctx.prefix}${ctx.command} sua pergunta*`)
    try {
      await ctx.reagir(ctx.from, '🎙️')
      await ctx.tokito.sendPresenceUpdate('recording', ctx.from).catch(() => {
      })
      const data = await ia.consultar(ctx, String(ctx.q).trim())
      const texto = String(data?.resposta || ia.textoResposta(data) || '').trim()
      if (!texto)
        return ctx.reply(ctx.mess.iaErro())
      await ia.enviarAudio(ctx, texto)
      await ctx.reagir(ctx.from, '✅')
    }
    catch (e) {
      await ctx.tokito.sendPresenceUpdate('paused', ctx.from).catch(() => {
      })

      if (ctx.modulos.ehErroApi(e, ctx.API_URL)) {
        return ctx.modulos.responderErroApi(ctx, e, 'IA AUDIO')
      }

      console.log(
        '[IA AUDIO]',
        ctx.modulos.sanitizarErro(e, [ctx.API_KEY_TOKITO]) || 'Erro sem detalhes'
      )

      return ctx.reply(ctx.mess.iaErro())
    }
  }
}
