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
nome: cfg.comandos[0],
comandos: cfg.comandos,
categoria: 'brincadeiras',
info: {
descricao: cfg.descricao || `Brincadeira ${cfg.comandos[0]}.`,
uso: `${cfg.comandos[0]} @usuario`,
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { tokito, from, sender, isGroup, isModobn, prefix, reply, mess, menc_os2, menc_jid2, canalInfo, selo, reagir } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
const alvo = menc_os2 || (Array.isArray(menc_jid2) && menc_jid2[0])
if (!alvo || (Array.isArray(menc_jid2) && menc_jid2.length > 1))
return reply(cfg.erro || `- 👤 Marque uma pessoa.\n> ${prefix}${cfg.comandos[0]} @usuario`)
if (cfg.naoMesmo && alvo === sender)
return reply('- ❌ Escolha outra pessoa.')
await reagir(from, cfg.emoji || '🎭').catch(() => {
})
const numero = String(alvo).split('@')[0]
const autor = String(sender).split('@')[0]
const caption = typeof cfg.caption === 'function' ? cfg.caption({
numero,
autor,
ctx
}) : String(cfg.caption || `@${autor} usou ${cfg.comandos[0]} em @${numero}.`)
const media = String(links[cfg.img] || '').trim()
const mentions = [sender, alvo]
const base = { mentions, contextInfo: canalInfo(mentions) }
if (media) {
const campo = cfg.tipo === 'imagem' ? {
image: { url: media },
caption
} : {
video: { url: media },
gifPlayback: true,
caption
}
return tokito.sendMessage(from, {
...campo,
...base
}, { quoted: selo })
}
return tokito.sendMessage(from, {
text: caption,
...base
}, { quoted: selo })
}
})
