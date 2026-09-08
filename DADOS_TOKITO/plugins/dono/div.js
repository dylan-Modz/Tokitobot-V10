/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Comandos da divulgação
 *  Dev    : Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')
const div = require('../../sistemas/div')
const msg = require('../../mensagens/div')

function cortar(texto, max = 70) {
  const t = String(texto || '')
    .replace(/\s+/g, ' ')
    .trim()

  return t.length > max
    ? `${t.slice(0, max - 3)}...`
    : t
}

function limites() {
  return {
    maxPorRodada: div.MAX_POR_RODADA,
    minIntervalo: div.MIN_INTERVALO,
    maxIntervalo: div.MAX_INTERVALO
  }
}

dylan.setCommand({
  nome: 'div',

  comandos: [
    'div',
    'divgrupos',
    'divadd',
    'divrm',
    'divlista',
    'divmsg',
    'divpreview',
    'divintervalo',
    'divenviar',
    'divstatus',
    'divstop',
    'divlimpar',
    'deivimento'
  ],

  categoria: 'dono',

  info: {
    descricao: 'Sistema de divulgação do Tokito.',
    uso: 'div',
    permissao: 'Dono',
    categoria: 'dono'
  },

  async executar(ctx) {
    if (!ctx.SoDono) {
      if (
        ctx.mess &&
        typeof ctx.mess.onlyOwner === 'function'
      ) {
        return ctx.reply(
          ctx.mess.onlyOwner()
        )
      }

      return ctx.reply(
        msg.erro(
          'ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴅᴏ ᴅᴏɴᴏ.'
        )
      )
    }

    const {
      tokito,
      from,
      q,
      reply
    } = ctx

    const prefix =
      ctx.prefix || '.'

    const command =
      String(ctx.command || '')
        .trim()
        .toLowerCase()

    try {
      switch (command) {
        case 'div':
          return reply(
            msg.painel(
              prefix,
              limites()
            )
          )

        case 'divgrupos': {
          const grupos =
            await div.carregarGrupos(
              tokito
            )

          const state =
            div.ler()

          const selecionados =
            new Set(
              state.grupos.map(
                g => g.id
              )
            )

          return reply(
            msg.grupos(
              grupos,
              selecionados,
              grupos.length
            )
          )
        }

        case 'divadd': {
          if (
            !div.catalogoAtual().length
          ) {
            await div.carregarGrupos(
              tokito
            )
          }

          const chaves =
            String(q || '')
              .trim()
              .split(/[\s,]+/)
              .filter(Boolean)

          if (!chaves.length) {
            return reply(
              msg.uso(
                prefix,
                'divadd',
                '1 3'
              )
            )
          }

          const resultado =
            div.adicionar(chaves)

          return reply(
            msg.selecao(
              resultado.adicionados.length,
              resultado.ignorados.length,
              div.ler().grupos.length
            )
          )
        }

        case 'divrm': {
          if (
            !div.catalogoAtual().length
          ) {
            await div.carregarGrupos(
              tokito
            )
          }

          const chaves =
            String(q || '')
              .trim()
              .split(/[\s,]+/)
              .filter(Boolean)

          if (!chaves.length) {
            return reply(
              msg.uso(
                prefix,
                'divrm',
                '1'
              )
            )
          }

          const resultado =
            div.remover(chaves)

          return reply(
            msg.removidos(
              resultado.removidos.length,
              resultado.ignorados.length,
              div.ler().grupos.length
            )
          )
        }

        case 'divlista': {
          const state =
            div.ler()

          if (!state.grupos.length) {
            return reply(
              msg.info(
                '𝙽𝙴𝙽𝙷𝚄𝙼 𝙶𝚁𝚄𝙿𝙾 𝚂𝙴𝙻𝙴𝙲𝙸𝙾𝙽𝙰𝙳𝙾',
                'ᴀᴅɪᴄɪᴏɴᴇ ᴜᴍ ɢʀᴜᴘᴏ ᴄᴏᴍ ᴅɪᴠᴀᴅᴅ.'
              )
            )
          }

          const corpo = []

          state.grupos.forEach(
            (g, i) => {
              corpo.push(
                `${i + 1}. ${cortar(g.nome, 55)}`
              )
              corpo.push(g.id)
            }
          )

          corpo.push(
            `ᴛᴏᴛᴀʟ: ${state.grupos.length}`
          )

          return reply(
            msg.sucesso(
              '𝙶𝚁𝚄𝙿𝙾𝚂 𝚂𝙴𝙻𝙴𝙲𝙸𝙾𝙽𝙰𝙳𝙾𝚂',
              corpo
            )
          )
        }

        case 'divmsg': {
          const texto =
            String(q || '').trim()

          if (!texto) {
            return reply(
              msg.uso(
                prefix,
                'divmsg',
                'sua divulgação'
              )
            )
          }

          if (
            texto.length > 3500
          ) {
            return reply(
              msg.erro(
                'ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴘᴏᴅᴇ ᴛᴇʀ ɴᴏ ᴍᴀ́xɪᴍᴏ 3500 ᴄᴀʀᴀᴄᴛᴇʀᴇs.'
              )
            )
          }

          div.definirTexto(texto)

          return reply(
            msg.salva(
              cortar(
                texto,
                450
              )
            )
          )
        }

        case 'divpreview': {
          await div.preview(
            tokito,
            from
          )

          return true
        }

        case 'deivimento': {
          const texto =
            String(q || '').trim()

          if (!texto) {
            return reply(
              msg.uso(
                prefix,
                'deivimento',
                'seu texto'
              )
            )
          }

          await div.enviarPayment(
            tokito,
            from,
            texto,
            ctx.info || null
          )

          return true
        }

        case 'divintervalo': {
          const state =
            div.definirIntervalo(
              String(q || '').trim()
            )

          return reply(
            msg.sucesso(
              '𝙸𝙽𝚃𝙴𝚁𝚅𝙰𝙻𝙾 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙾',
              `ɴᴏᴠᴏ ɪɴᴛᴇʀᴠᴀʟᴏ: ${state.intervalo}s`
            )
          )
        }

        case 'divenviar': {
          const quantidade =
            Number(
              String(q || '').trim()
            )

          if (
            !Number.isInteger(
              quantidade
            )
          ) {
            return reply(
              msg.uso(
                prefix,
                'divenviar',
                '5'
              )
            )
          }

          await reply(
            msg.info(
              '𝙲𝙰𝙼𝙿𝙰𝙽𝙷𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙰',
              [
                `ǫᴜᴀɴᴛɪᴅᴀᴅᴇ: ${quantidade}`,
                `ɪɴᴛᴇʀᴠᴀʟᴏ: ${div.ler().intervalo}s`,
                `ᴘᴀʀᴀ ᴘᴀʀᴀʀ: ${prefix}divstop`
              ]
            )
          )

          const resultado =
            await div.enviar(
              tokito,
              quantidade
            )

          const s =
            resultado.runtime

          return reply(
            msg.sucesso(
              '𝙲𝙰𝙼𝙿𝙰𝙽𝙷𝙰 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙰',
              [
                `ᴇɴᴠɪᴀᴅᴏs: ${s.enviados}`,
                `ғᴀʟʜᴀs: ${s.falhas}`,
                `ʀᴇsᴛᴀɴᴛᴇs: ${s.restantes}`
              ]
            )
          )
        }

        case 'divstatus': {
          const {
            config,
            runtime
          } = div.obterStatus()

          return reply(
            msg.status(
              config,
              runtime
            )
          )
        }

        case 'divstop': {
          const ok =
            div.parar()

          return reply(
            ok
              ? msg.sucesso(
                  '𝙲𝙰𝙼𝙿𝙰𝙽𝙷𝙰 𝙿𝙰𝚁𝙰𝙽𝙳𝙾',
                  'ᴀ ᴘᴀʀᴀᴅᴀ ғᴏɪ sᴏʟɪᴄɪᴛᴀᴅᴀ.'
                )
              : msg.info(
                  '𝙽𝙴𝙽𝙷𝚄𝙼𝙰 𝙲𝙰𝙼𝙿𝙰𝙽𝙷𝙰',
                  'ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ᴄᴀᴍᴘᴀɴʜᴀ ʀᴏᴅᴀɴᴅᴏ.'
                )
          )
        }

        case 'divlimpar': {
          div.limpar()

          return reply(
            msg.sucesso(
              '𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾 𝙻𝙸𝙼𝙿𝙰',
              'ᴀ ᴄᴏɴғɪɢᴜʀᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ʟɪᴍᴘᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ.'
            )
          )
        }

        default:
          return reply(
            msg.painel(
              prefix,
              limites()
            )
          )
      }
    }
    catch (error) {
      console.log(
        '[DIV]',
        error?.stack ||
        error?.message ||
        error
      )

      return reply(
        msg.erro(
          error?.message ||
          'ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇxᴇᴄᴜᴛᴀʀ ᴏ ᴄᴏᴍᴀɴᴅᴏ.'
        )
      )
    }
  }
})
