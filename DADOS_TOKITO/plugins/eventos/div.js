/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Captura texto/quantidade sem prefixo
 *  Dev    : Dylan Modz
 * ============================================================
 */

const div = require('../../sistemas/div')
const msg = require('../../mensagens/div')

module.exports = {
  nome: 'div-input',
  categoria: 'eventos',
  prioridade: 15,

  async evento(ctx) {
    if (!ctx.SoDono) return false
    if (ctx.isCmd) return false

    const aguardando = div.espera(
      ctx.sender,
      ctx.from
    )

    if (!aguardando) {
      return false
    }

    const texto = String(
      ctx.body ||
      ctx.budy ||
      ''
    ).trim()

    if (!texto) {
      return true
    }

    try {
      if (aguardando.etapa === 'texto') {
        if (texto.length > 3500) {
          await ctx.reply(
            msg.erro(
              'ᴀ ᴅɪᴠᴜʟɢᴀᴄ̧ᴀ̃ᴏ ᴘᴏᴅᴇ ᴛᴇʀ ɴᴏ ᴍᴀ́xɪᴍᴏ 3500 ᴄᴀʀᴀᴄᴛᴇʀᴇs.'
            )
          )

          return true
        }

        const state = div.definirTexto(texto)
        const maximo = Math.min(
          state.grupos.length,
          div.MAX_POR_RODADA
        )

        div.aguardar(
          ctx.sender,
          ctx.from,
          'quantidade'
        )

        await ctx.reply(
          msg.textoSalvo(
            texto.length > 450
              ? `${texto.slice(0, 447)}...`
              : texto,
            maximo
          )
        )

        return true
      }

      if (aguardando.etapa === 'quantidade') {
        if (!/^\d+$/.test(texto)) {
          const total = Math.min(
            div.ler().grupos.length,
            div.MAX_POR_RODADA
          )

          await ctx.reply(
            msg.erro(
              `ᴅɪɢɪᴛᴇ sᴏ́ ᴜᴍ ɴᴜ́ᴍᴇʀᴏ ᴅᴇ 1 ᴀᴛᴇ́ ${total}.`
            )
          )

          return true
        }

        const state = div.definirQuantidade(
          Number(texto)
        )

        div.limparEspera(
          ctx.sender,
          ctx.from
        )

        await ctx.reply(
          msg.iniciando(
            state.quantidade
          )
        )

        const resultado = await div.enviar(
          ctx.tokito,
          {
            NomeDoBot: ctx.NomeDoBot
          }
        )

        await ctx.reply(
          msg.concluido(
            resultado.runtime
          )
        )

        return true
      }

      div.limparEspera(
        ctx.sender,
        ctx.from
      )

      return false
    }
    catch (error) {
      console.log(
        '[DIV INPUT]',
        error?.stack ||
        error?.message ||
        error
      )

      await ctx.reply(
        msg.erro(
          error?.message ||
          'ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴᴛɪɴᴜᴀʀ.'
        )
      )

      return true
    }
  }
}
