/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Painel da divulgação
 *  Dev    : Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')
const div = require('../../sistemas/div')
const msg = require('../../mensagens/div')

function curto(texto, max = 50) {
  const valor = String(texto || '').replace(/\s+/g, ' ').trim()

  return valor.length > max
    ? `${valor.slice(0, max - 3)}...`
    : valor
}

function somenteDono(ctx) {
  if (ctx.SoDono) return true

  ctx.reply(
    typeof ctx.mess?.onlyOwner === 'function'
      ? ctx.mess.onlyOwner()
      : msg.erro('ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴅᴏ ᴅᴏɴᴏ.')
  )

  return false
}

function menuGrupos(prefix, grupos, selecionados) {
  const marcados = new Set(selecionados.map(g => g.id))

  return {
    title: '「 📢 」𝐆𝐑𝐔𝐏𝐎𝐒 𝐃𝐀 𝐃𝐈𝐕𝐔𝐋𝐆𝐀𝐂̧𝐀̃𝐎',

    sections: [
      {
        title: '📋 SELECIONAR / REMOVER',

        highlight_label: `${selecionados.length} selecionado(s)`,

        rows: grupos.slice(0, 50).map((g, i) => ({
          title: `${marcados.has(g.id) ? '✅' : '▫️'} ${curto(g.nome)}`,

          description:
            `${Number.isFinite(g.participantes) ? `${g.participantes} membros • ` : ''}` +
            `${marcados.has(g.id) ? 'toque para remover' : 'toque para selecionar'}`,

          id: `${prefix}divselect ${i + 1}`
        }))
      }
    ]
  }
}

async function interativo(ctx, texto, botoes) {
  const msgGerada = ctx.generateWAMessageFromContent(
    ctx.from,

    {
      interactiveMessage: ctx.proto.Message.InteractiveMessage.create({
        contextInfo: ctx.selo?.message
          ? {
              quotedMessage: ctx.selo.message,
              participant:
                ctx.selo?.key?.participant ||
                ctx.selo?.key?.remoteJid ||
                ctx.sender,
              stanzaId: ctx.selo?.key?.id,
              remoteJid: ctx.selo?.key?.remoteJid || ctx.from
            }
          : {},

        body: ctx.proto.Message.InteractiveMessage.Body.create({
          text: texto
        }),

        footer: ctx.proto.Message.InteractiveMessage.Footer.create({
          text: ctx.NomeDoBot || 'Tokito Bot V10'
        }),

        nativeFlowMessage:
          ctx.proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: botoes,
            messageParamsJson: ''
          })
      })
    },

    {
      quoted: ctx.selo || ctx.info
    }
  )

  return ctx.tokito.relayMessage(
    ctx.from,
    msgGerada.message,
    { messageId: msgGerada.key.id }
  )
}

async function abrir(ctx) {
  const grupos = await div.carregarGrupos(ctx.tokito)
  const state = div.ler()

  const botoes = [
    {
      name: 'single_select',

      buttonParamsJson: JSON.stringify(
        menuGrupos(
          ctx.prefix || '.',
          grupos,
          state.grupos
        )
      )
    }
  ]

  if (state.grupos.length) {
    botoes.push({
      name: 'quick_reply',

      buttonParamsJson: JSON.stringify({
        display_text: '➡️ CONTINUAR',
        id: `${ctx.prefix || '.'}divcontinuar`
      })
    })

    botoes.push({
      name: 'quick_reply',

      buttonParamsJson: JSON.stringify({
        display_text: '🧹 LIMPAR',
        id: `${ctx.prefix || '.'}divlimpar`
      })
    })
  }

  return interativo(
    ctx,
    msg.painel(state.grupos.length),
    botoes
  )
}

async function aposSelecao(ctx, resultado) {
  const state = div.ler()

  return interativo(
    ctx,

    msg.selecionado(
      resultado.grupo.nome,
      resultado.ativo,
      resultado.total
    ),

    [
      {
        name: 'single_select',

        buttonParamsJson: JSON.stringify(
          menuGrupos(
            ctx.prefix || '.',
            div.catalogoAtual(),
            state.grupos
          )
        )
      },

      ...(state.grupos.length
        ? [
            {
              name: 'quick_reply',

              buttonParamsJson: JSON.stringify({
                display_text: '➡️ CONTINUAR',
                id: `${ctx.prefix || '.'}divcontinuar`
              })
            }
          ]
        : [])
    ]
  )
}

dylan.setCommand({
  nome: 'div',

  comandos: [
    'div',
    'divselect',
    'divcontinuar',
    'divlimpar',
    'divstatus',
    'divstop',
    'deivimento'
  ],

  categoria: 'dono',

  info: {
    descricao: 'Painel de divulgação.',
    uso: 'div',
    permissao: 'Dono',
    categoria: 'dono'
  },

  async executar(ctx) {
    if (!somenteDono(ctx)) return

    const command = String(ctx.command || '').trim().toLowerCase()

    try {
      switch (command) {
        case 'div':
          return abrir(ctx)

        case 'divselect': {
          if (!div.catalogoAtual().length) {
            await div.carregarGrupos(ctx.tokito)
          }

          const resultado = div.alternarGrupo(
            String(ctx.q || '').trim()
          )

          return aposSelecao(ctx, resultado)
        }

        case 'divcontinuar': {
          const state = div.ler()

          if (!state.grupos.length) {
            return abrir(ctx)
          }

          div.aguardar(
            ctx.sender,
            ctx.from,
            'texto'
          )

          return ctx.reply(
            msg.pedirTexto(state.grupos.length)
          )
        }

        case 'divlimpar':
          div.limparSelecao()
          div.limparEspera(ctx.sender, ctx.from)

          return abrir(ctx)

        case 'divstatus': {
          const estado = div.obterStatus()

          return ctx.reply(
            msg.status(
              estado.config,
              estado.runtime
            )
          )
        }

        case 'divstop':
          return ctx.reply(
            div.parar()
              ? msg.info('𝙿𝙰𝚁𝙰𝙽𝙳𝙾', 'ᴀ ᴘᴀʀᴀᴅᴀ ғᴏɪ sᴏʟɪᴄɪᴛᴀᴅᴀ.')
              : msg.info('𝙽𝙰𝙳𝙰 𝚁𝙾𝙳𝙰𝙽𝙳𝙾', 'ɴᴀ̃ᴏ ʜᴀ́ ᴇɴᴠɪᴏ ᴀᴛɪᴠᴏ.')
          )

        case 'deivimento': {
          const texto = String(ctx.q || '').trim()

          if (!texto) {
            return ctx.reply(
              msg.info(
                '𝙲𝙾𝙼𝙾 𝚄𝚂𝙰𝚁',
                `${ctx.prefix || '.'}deivimento texto`
              )
            )
          }

          await div.enviarPayment(
            ctx.tokito,
            ctx.from,
            texto,
            {
              marcarTodos: true,
              NomeDoBot: ctx.NomeDoBot
            }
          )

          return true
        }

        default:
          return abrir(ctx)
      }
    }
    catch (error) {
      console.log('[DIV]', error?.stack || error?.message || error)

      return ctx.reply(
        msg.erro(
          error?.message ||
          'ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇxᴇᴄᴜᴛᴀʀ.'
        )
      )
    }
  }
})
