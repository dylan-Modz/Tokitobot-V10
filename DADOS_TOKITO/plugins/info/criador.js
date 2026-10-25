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

const dylan = require('../../database/lib/comandos')

// Contato oficial do desenvolvedor no WhatsApp.
const nome = 'dylan [00]'
const numero = '559185731582'
const vcard = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:;;;;',
  `FN:${nome}`,
  `item1.TEL;waid=${numero}:+${numero}`,
  'item1.X-ABLabel:Celular',
  'END:VCARD'
].join('\n')

dylan.setCommand({
  nome: 'criador',
  comandos: ['criador'],
  categoria: 'info',
  info: {
    descricao: 'Compartilha o cartão de contato do desenvolvedor.',
    uso: 'criador',
    categoria: 'info'
  },
  async executar(ctx) {
    return ctx.tokito.sendMessage(ctx.from, {
      contacts: {
        displayName: nome,
        contacts: [{ displayName: nome, vcard }]
      }
    }, { quoted: ctx.selo })
  }
})
