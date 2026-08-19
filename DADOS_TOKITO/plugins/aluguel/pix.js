/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const aluguel = require('../../sistemas/aluguel')

const {
  proto,
  generateWAMessageFromContent
} = require('@whiskeysockets/baileys')

async function enviarCopiarPix(ctx, codigo) {
  const pix = String(codigo || '').trim()
  if (!pix) return false

  try {
    const jid = ctx.from

    const interactiveMessage =
      proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({
          text: ''
        }),

        nativeFlowMessage:
          proto.Message.InteractiveMessage.NativeFlowMessage.create({
            messageParamsJson: JSON.stringify({
              fromMe: false,
              hasMediaAttachment: false
            }),

            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: '🧊﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐏𝐈𝐗﹙🧊',
                  id: `pix_${Date.now()}`,
                  copy_code: pix
                })
              }
            ]
          })
      })

    const content = {
      viewOnceMessage: {
        message: {
          interactiveMessage
        }
      }
    }

    const msg = generateWAMessageFromContent(
      jid,
      content,
      {
        userJid: ctx.tokito.user?.id,
        quoted: ctx.selo
      }
    )

    await ctx.tokito.relayMessage(
      jid,
      msg.message,
      {
        messageId: msg.key.id
      }
    )

    return true
  } catch (e) {
    console.log(
      '[COPIAR PIX]',
      e?.message || e
    )
    return false
  }
}

module.exports = {
  nome: 'pixalugar',

  comandos: [
    'pixalugar',
    'pixaluguel'
  ],

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

    if (!Number.isFinite(valor) || valor <= 0)
      return ctx.reply(
        ctx.mess.aluguelPlanoInvalido()
      )

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

      if (item.qr_code_base64) {
        const b64 = String(
          item.qr_code_base64
        ).replace(
          /^data:image\/\w+;base64,/,
          ''
        )

        await ctx.tokito.sendMessage(
          ctx.from,
          {
            image: Buffer.from(
              b64,
              'base64'
            ),
            caption,
            contextInfo:
              ctx.canalInfo([ctx.sender])
          },
          {
            quoted: ctx.selo
          }
        )
      } else {
        await ctx.reply(
          `${caption}\n\n${item.qr_code || ''}`
        )
      }

      if (item.qr_code) {
        await enviarCopiarPix(
          ctx,
          item.qr_code
        )
      }

      return true

    } catch (e) {
      if (
        e?.code === 'MP_TOKEN_NAO_CONFIGURADO' ||
        e?.message === 'MP_TOKEN_NAO_CONFIGURADO'
      ) {
        return ctx.reply(
          ctx.mess.tokenMpAusente()
        )
      }

      if (
        e?.message ===
        'PEDIDO_NAO_ENCONTRADO'
      ) {
        return ctx.reply(
          ctx.mess.aluguelSemPedido(
            ctx.prefix
          )
        )
      }

      if (
        e?.message ===
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