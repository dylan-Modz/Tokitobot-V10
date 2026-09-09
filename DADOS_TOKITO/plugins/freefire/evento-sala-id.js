/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: evento-sala-id.js
 *  Função : Detectar ID/Senha de sala Free Fire
 *  Dev    : Dylan Modz
 * ============================================================
 */

module.exports = {
  nome: 'evento-sala-id',
  categoria: 'freefire',
  fase: 'normal',
  prioridade: 35,

  async evento(ctx) {
    if (!ctx.isGroup) return false
    if (ctx.info?.key?.fromMe) return false
    if (ctx.isCmd) return false

    const texto = String(ctx.body || '').trim()

    if (!texto) return false

    /*
     * ID REAL DA SALA:
     * - exatamente 9 dígitos
     *
     * Formatos aceitos:
     *
     * 123456789
     *
     * 123456789 999
     *
     * 123456789
     * 999
     *
     * A senha aceita de 1 a 6 dígitos.
     */

    const idSenha =
      texto.match(/^(\d{9})[ \t\r\n]+(\d{1,6})$/)

    const somenteId =
      texto.match(/^(\d{9})$/)

    if (!idSenha && !somenteId) {
      return false
    }

    const idSala = String(
      (idSenha || somenteId)[1]
    )

    const senhaSala = idSenha
      ? String(idSenha[2])
      : null

    const {
      tokito,
      from,
      sender,
      selo,
      canalInfo,
      NomeDoBot,
      proto,
      generateWAMessageFromContent
    } = ctx

    if (
      !tokito ||
      typeof tokito.relayMessage !== 'function' ||
      !proto?.Message?.InteractiveMessage ||
      typeof generateWAMessageFromContent !== 'function'
    ) {
      return false
    }

    const textoSala = senhaSala
      ? (
          `- 🎮 \`𝚂𝙰𝙻𝙰 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`\n\n` +
          `> *『 🆔 𝙸𝙳 』— ${idSala}*\n\n` +
          `> *『 🔐 𝚂𝙴𝙽𝙷𝙰 』— ${senhaSala}*`
        )
      : (
          `- 🎮 \`𝙸𝙳 𝙳𝙰 𝚂𝙰𝙻𝙰\`\n\n` +
          `> *『 🆔 𝙸𝙳 』— ${idSala}*`
        )

    const botoes = [
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: '🆔  ᴄᴏᴘɪᴀʀ ɪᴅ  ⟡',
          copy_code: idSala
        })
      }
    ]

    if (senhaSala) {
      botoes.push({
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: '🔐  ᴄᴏᴘɪᴀʀ sᴇɴʜᴀ  ⟡',
          copy_code: senhaSala
        })
      })
    }

    const contexto =
      typeof canalInfo === 'function'
        ? canalInfo([sender])
        : {
            mentionedJid: [sender].filter(Boolean)
          }

    const mensagem = generateWAMessageFromContent(
      from,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },

            interactiveMessage:
              proto.Message.InteractiveMessage.create({
                contextInfo: contexto,

                body:
                  proto.Message.InteractiveMessage.Body.create({
                    text: textoSala
                  }),

                footer:
                  proto.Message.InteractiveMessage.Footer.create({
                    text: NomeDoBot || 'Tokito'
                  }),

                nativeFlowMessage:
                  proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: botoes,
                    messageParamsJson: ''
                  })
              })
          }
        }
      },
      selo ? { quoted: selo } : {}
    )

    await tokito.relayMessage(
      from,
      mensagem.message,
      {
        messageId: mensagem.key.id
      }
    )

    return true
  }
}
