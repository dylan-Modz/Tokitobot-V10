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

dylan.setCommand({
nome: 'casalgif',
comandos: ['casalgif'],
categoria: 'brincadeiras',
info: {
descricao: 'Sorteia um casal e gera o card animado.',
uso: 'casalgif',
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { isGroup, isModobn, reply, mess, prefix, groupMembers, tokito, from, reagir, API_URL, API_KEY_TOKITO, canalInfo, selo } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
const membros = (groupMembers || []).map(x => x.id || x).filter(Boolean)
if (membros.length < 2)
return reply(mess.padraoAviso({
emoji: '💘',
titulo: 'MEMBROS INSUFICIENTES',
descricao: 'Preciso de pelo menos 2 membros no grupo.'
}))
await reagir(from, '💘').catch(() => {
})
const p1 = membros[Math.floor(Math.random() * membros.length)]
let p2 = p1
while (p2 === p1)
p2 = membros[Math.floor(Math.random() * membros.length)]
const n = Math.floor(Math.random() * 101)
const foto = async (j) => tokito.profilePictureUrl(j, 'image').catch(() => 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/747wlpa89.jpg')
const f1 = await foto(p1)
const f2 = await foto(p2)
const url = `${String(API_URL).replace(/\/$/, '')}/canvas/casal2-gif?foto1=${encodeURIComponent(f1)}&foto2=${encodeURIComponent(f2)}&porcentagem=${n}&apikey=${encodeURIComponent(API_KEY_TOKITO || '')}`
try {
return await tokito.sendMessage(from, {
video: { url },
mimetype: 'video/mp4',
gifPlayback: true,
caption: mess.padraoInfo({
emoji: '💘',
titulo: 'CASAL',
linhas: [
{ rotulo: '💞 𝙲𝙰𝚂𝙰𝙻', valor: `@${p1.split('@')[0]} + @${p2.split('@')[0]}` },
{ rotulo: '📊 𝙲𝙾𝙼𝙱𝙸𝙽𝙰𝙲̧𝙰̃𝙾', valor: `${n}%` }
]
}),
contextInfo: canalInfo([p1, p2])
}, { quoted: selo })
}
catch (error) {
console.log(
'[CASAL GIF API]',
ctx.modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
)

return reply(
mess.erroApi(API_URL)
)
}
}
}
)
