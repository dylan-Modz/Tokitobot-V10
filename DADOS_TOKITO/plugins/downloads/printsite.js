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

const { urlValida } = require('./_novas_rotas')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'printsite',
  comandos: ['printsite', 'print-site', 'siteprint'],
  categoria: 'downloads',

  info: {
    descricao: 'Tira uma captura de tela de um site.',
    uso: 'printsite https://exemplo.com',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        let site = String(q || '').trim()

        if (!site) {
          return reply(
            mess.downloadUso({
              tipo: 'LINK DO SITE',
              prefix,
              command,
              exemplo: 'https://tokito-apis.com.br'
            })
          )
        }

        if (!/^https?:\/\//i.test(site)) {
          site = `https://${site}`
        }

        try {
          site = new URL(site).toString()
        } catch {
          return reply(
            mess.downloadUso({
              tipo: 'LINK DO SITE',
              prefix,
              command,
              exemplo: 'https://tokito-apis.com.br'
            })
          )
        }

        if (!API_KEY_TOKITO) {
          await reagir(from, '❌').catch(() => {})
          return reply('❌ | API_KEY_TOKITO não configurada.')
        }

        await reagir(from, '📸')
        await reply(mess.wait())

        const base = String(API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')

        const apiUrl =
          `${base}/api/print-site?url=${encodeURIComponent(site)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

        await tokito.sendMessage(
          from,
          {
            image: {
              url: apiUrl
            },
            caption:
              `*📸 | PRINT DO SITE*\n\n` +
              `> 🌐 Site: ${site}\n` +
              `> ✅ Status: print gerado com sucesso`,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          },
          {
            quoted: selo
          }
        )

        await reagir(from, '✅')
      } catch (e) {
        console.log('[PRINT SITE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})