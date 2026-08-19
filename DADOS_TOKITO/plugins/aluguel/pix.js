/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 */

const aluguel = require('../../sistemas/aluguel')

module.exports = {
  nome: 'pixalugar',
  comandos: ['pixalugar', 'pixaluguel'],
  categoria: 'aluguel',

  info: {
    descricao: 'Gera o PIX do plano e inicia verificação automática.',
    uso: 'pixalugar valor',
    categoria: 'aluguel'
  },

  async executar(ctx) {
    if (!ctx.nescessario.aluguel)
      return ctx.reply(
        ctx.mess.aluguelDesativado()
      )

    if (!aluguel.tokenConfigurado())
      return ctx.reply(
        ctx.mess.tokenMpAusente()
      )

    const valor = Number(
      String(ctx.q || '').replace(',', '.')
    )

    if (
      !Number.isFinite(valor) ||
      valor <= 0
    ) {
      return ctx.reply(
        ctx.mess.aluguelPlanoInvalido()
      )
    }

    try {
      const item = await aluguel.criarPix(
        ctx.sender,
        valor
      )

      await ctx.reagir(
        ctx.from,
        '💵'
      )

      const caption =
        ctx.mess.aluguelPix(item)

      const pixCopiaCola =
        String(
          item.pix_copia_e_cola ||
          item.qr_code ||
          ''
        ).trim()

      const qrBase64 =
        String(
          item.qr_code_base64 || ''
        )
        .replace(
          /^data:image\/\w+;base64,/,
          ''
        )

      /*
       * Primeiro envia o QR Code.
       */
      if (qrBase64) {
        await ctx.tokito.sendMessage(
          ctx.from,
          {
            image: Buffer.from(
              qrBase64,
              'base64'
            ),
            caption,
            contextInfo:
              ctx.canalInfo([
                ctx.sender
              ])
          },
          {
            quoted: ctx.selo
          }
        )
      } else {
        await ctx.reply(
          caption
        )
      }

      /*
       * Mostra o Copia e Cola.
       */
      if (pixCopiaCola) {
        /*
         * Tenta usar o botão da própria base.
         *
         * O botão executa pixcodigo e passa
         * o ID do pagamento.
         */
        try {
          if (
            typeof ctx.botaozin === 'function'
          ) {
            await ctx.botaozin(
              '💳 PIX copia e cola',
              [
                {
                  texto: '📋 Copiar PIX',
                  id:
                    `${ctx.prefix}pixcodigo ${item.id}`
                }
              ],
              [ctx.sender]
            )

            return true
          }
        } catch (erro) {
          console.log(
            '[PIX ALUGUEL • BOTÃO]',
            erro?.message || erro
          )
        }

        /*
         * Fallback caso o sistema de botão
         * da base esteja indisponível.
         */
        return ctx.reply(
          `💳 *PIX COPIA E COLA*\n\n` +
          `\`${pixCopiaCola}\`\n\n` +
          `Copie o código acima e cole no seu aplicativo bancário.`
        )
      }

      /*
       * Se a API não retornou o código,
       * ainda informa o usuário.
       */
      return ctx.reply(
        `⚠️ O QR Code foi gerado, mas o ` +
        `Pix Copia e Cola não foi retornado ` +
        `pela API de pagamento.`
      )

    } catch (e) {
      if (
        e.code ===
          'MP_TOKEN_NAO_CONFIGURADO' ||
        e.message ===
          'MP_TOKEN_NAO_CONFIGURADO'
      ) {
        return ctx.reply(
          ctx.mess.tokenMpAusente()
        )
      }

      if (
        e.message ===
        'PEDIDO_NAO_ENCONTRADO'
      ) {
        return ctx.reply(
          ctx.mess.aluguelSemPedido(
            ctx.prefix
          )
        )
      }

      if (
        e.message ===
        'PLANO_NAO_ENCONTRADO'
      ) {
        return ctx.reply(
          ctx.mess.aluguelPlanoInvalido()
        )
      }

      console.log(
        '[PIX ALUGUEL]',
        e?.message || e
      )

      return ctx.reply(
        ctx.mess.error()
      )
    }
  }
}