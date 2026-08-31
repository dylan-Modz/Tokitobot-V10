/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const api = require('../../scrapers/downloads/pesquisas')
const { pedacos, texto } = require('./_novas_rotas')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'lyrics',
  comandos: ['lyrics', 'letra'],
  categoria: 'downloads',

  info: {
    descricao: 'Pesquisa a letra de uma música.',
    uso: 'lyrics Vem cá',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const busca = String(q || '').trim()

        if (!busca) {
          return reply(
            mess.downloadUso({
              tipo: 'LETRA DA MÚSICA',
              prefix,
              command,
              exemplo: 'Vem cá'
            })
          )
        }

        await reagir(from, '🎼')
        const dados = await api.lyrics(busca)
        const res = dados?.resultado

        if (!dados?.status || !res?.letra) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('LETRA'))
        }

        const cabecalho =
          `*🎼 | LETRA ENCONTRADA*\n\n` +
          `> 🎵 Título: *${texto(res?.titulo, busca)}*\n` +
          `> 🎤 Artista(s): ${texto(res?.artistas)}\n` +
          `> 💿 Álbum: ${texto(res?.album)}\n` +
          `> ⏱️ Duração: ${texto(res?.duracao)}\n\n`

        const partes = pedacos(`${cabecalho}${String(res.letra).trim()}`, 3500)

        for (let i = 0; i < partes.length; i++) {
          await tokito.sendMessage(
            from,
            {
              text: partes[i],
              contextInfo: {
                ...newsletter,
                mentionedJid: [sender]
              }
            },
            {
              quoted: i === 0 ? selo : undefined
            }
          )
        }

        await reagir(from, '✅')
      } catch (e) {
        console.log('[LYRICS]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
