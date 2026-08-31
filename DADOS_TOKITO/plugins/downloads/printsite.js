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
const { texto, urlValida } = require('./_novas_rotas')
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
        const site = String(q || '').trim()

        if (!site || !urlValida(site)) {
          return reply(
            mess.downloadUso({
              tipo: 'LINK DO SITE',
              prefix,
              command,
              exemplo: 'https://tokito-apis.com.br'
            })
          )
        }

        await reagir(from, '📸')
        await reply(mess.wait())

        const dados = await api.printSite(site)
        const arquivo = dados?.arquivo

        if (!arquivo || !urlValida(arquivo)) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('PRINT'))
        }

        await tokito.sendMessage(
          from,
          {
            image: {
              url: arquivo
            },
            caption:
              `*📸 | PRINT DO SITE*\n\n` +
              `> 🌐 Site: ${site}\n` +
              `> 📄 Tipo: ${texto(dados?.tipo, 'image/png')}\n` +
              `> 📦 Tamanho: ${Number(dados?.tamanho || 0).toLocaleString('pt-BR')} bytes`,
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
