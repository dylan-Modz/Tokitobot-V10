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

module.exports = cfg => ({
nome: cfg.nomeComando || cfg.comandos[0],
comandos: cfg.comandos,
categoria: 'brincadeiras',
info: {
descricao: cfg.descricao || `Mostra o ${cfg.titulo}.`,
uso: cfg.comandos[0],
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { tokito, from, isGroup, isModobn, prefix, reply, mess, canalInfo, selo, membrosGrupo, groupMembers } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
const base = (membrosGrupo?.length ? membrosGrupo : (groupMembers || []).map(x => x.id || x)).filter(Boolean)
const membros = [...new Set(base)].sort(() => Math.random() - 0.5).slice(0, Math.min(5, base.length))
if (!membros.length)
return reply(mess.error())
const itens = membros.map((membro, i) => ({
numero: String(membro).split('@')[0],
posicao: i + 1,
valor: Math.floor(Math.random() * 101)
}))
const caption = mess.bnRank(cfg.emoji || '🏆', cfg.titulo, itens)
const media = String(links[cfg.img] || '').trim()
if (media)
return tokito.sendMessage(from, {
image: { url: media },
caption,
contextInfo: canalInfo(membros)
}, { quoted: selo })
return tokito.sendMessage(from, {
text: caption,
contextInfo: canalInfo(membros)
}, { quoted: selo })
}
})
