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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'morte',
comandos: ['morte', 'death', 'morrer', 'preveridade', 'morteidade'],
categoria: 'brincadeiras',
info: {
descricao: 'Faz a brincadeira de previsão de idade pelo nome.',
uso: 'morte nome',
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { isGroup, isModobn, reply, mess, prefix, q, axios, tokito, from, canalInfo, sender, selo } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
const nome = String(q || '').trim().split(/\s+/)[0]
if (!nome)
return reply(mess.padraoUso({
emoji: '💀',
titulo: 'MORTE',
uso: `${prefix}${ctx.command} nome`,
descricao: 'Informe um nome para fazer a previsão da brincadeira.'
}))
let idade
try {
const r = await axios.get(`https://api.agify.io/?name=${encodeURIComponent(nome)}`, { timeout: 15000 })
idade = r?.data?.age
}
catch {
}
;
if (!idade)
idade = 40 + Math.floor(Math.random() * 61)
const caption = mess.padraoInfo({
emoji: '💀',
titulo: 'PREVISÃO DE IDADE',
linhas: [
{ rotulo: '👤 𝙽𝙾𝙼𝙴', valor: nome },
{ rotulo: '⌛ 𝙸𝙳𝙰𝙳𝙴', valor: `aproximadamente ${idade} anos` }
]
})
const media = String(links.deathcmd || '').trim()
if (media)
return tokito.sendMessage(from, {
video: { url: media },
gifPlayback: true,
caption,
contextInfo: canalInfo([sender])
}, { quoted: selo })
return reply(caption)
}
}
)
