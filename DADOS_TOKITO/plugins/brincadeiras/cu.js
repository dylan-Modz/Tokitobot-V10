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

const links = require('../../INFO_DADOS/LOGOS/links_img.json')

module.exports = {
nome: 'cu',
comandos: ['cu', 'bozo', 'profundidade', 'medircu', 'cm'],
categoria: 'brincadeiras',
info: {
descricao: 'Brincadeira de medida aleatória.',
uso: 'cu [@usuario]',
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { isGroup, isModobn, reply, mess, prefix, sender_ou_n, sender, tokito, from, canalInfo, selo } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
const alvo = sender_ou_n || sender
const n = Math.floor(Math.random() * 111)
const caption = `📏 @${alvo.split('@')[0]} tirou *${n} cm* na brincadeira.`
const media = String(links.cu || '').trim()
if (media)
return tokito.sendMessage(from, {
image: { url: media },
caption,
contextInfo: canalInfo([alvo])
}, { quoted: selo })
return tokito.sendMessage(from, {
text: caption,
contextInfo: canalInfo([alvo])
}, { quoted: selo })
}
}
