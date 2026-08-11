const modulos = require('../../sistemas/modulos')

module.exports = {
  nome: 'evento-autortext',
  categoria: 'eventos',

  async evento(ctx) {
    if (!ctx.isGroup) return false
    if (ctx.info?.key?.fromMe) return false
    if (!ctx.dataGp?.[0]?.funcoes?.autortext) return false

    const audio = modulos.audioAtual(ctx)

    if (!audio) return false

    await ctx.reagir(
      ctx.from,
      '🎙️'
    ).catch(() => {})

    try {
      const resultado = await modulos.transcrever(
        ctx,
        audio
      )

      await ctx.tokito.sendMessage(
        ctx.from,
        {
          text: ctx.mess.autortextResultado(
            ctx.sender,
            resultado
          ),

          contextInfo: ctx.canalInfo([
            ctx.sender
          ])
        },
        {
          quoted: ctx.info
        }
      )

      await ctx.reagir(
        ctx.from,
        '✅'
      ).catch(() => {})
    } catch (erro) {
      await ctx.reagir(
        ctx.from,
        '❌'
      ).catch(() => {})

      if (modulos.ehErroApi(erro, ctx.API_URL)) {
        await modulos.responderErroApi(
          ctx,
          erro,
          'AUTORTEXT API'
        )

        return false
      }

      console.log(
        '[ AUTORTEXT • TOKITO ]',
        modulos.sanitizarErro(
          erro,
          [ctx.API_KEY_TOKITO]
        )
      )

      await ctx.reply(
        ctx.mess.transcricaoFalhou()
      )
    }

    return false
  }
}