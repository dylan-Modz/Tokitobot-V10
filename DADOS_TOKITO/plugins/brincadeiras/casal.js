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

module.exports = {
nome: 'casal',
comandos: ['casal'],
categoria: 'brincadeiras',
info: {
descricao: 'Sorteia um casal do grupo e mostra a compatibilidade.',
uso: 'casal',
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { isGroup, isModobn, reply, mess, prefix, groupMembers, tokito, from, reagir, API_URL, canalInfo, selo, NomeDoBot } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
const membros = (groupMembers || []).map(x => x.id || x).filter(Boolean)
if (membros.length < 2)
return reply('- ❌ Preciso de pelo menos 2 membros.')
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
const url = `${String(API_URL).replace(/\/$/, '')}/canvas/casal2?foto1=${encodeURIComponent(f1)}&foto2=${encodeURIComponent(f2)}&porcentagem=${n}`
const cap = `「💘」 ᴄᴀsᴀʟ sᴏʀᴛᴇᴀᴅᴏ\n\n『💞』 @${p1.split('@')[0]}\n『💞』 @${p2.split('@')[0]}\n\n*_📊 | ᴄᴏᴍᴘᴀᴛɪʙɪʟɪᴅᴀᴅᴇ: ${n}%_*\n\n> 🌫️ | ${NomeDoBot}`
try {
return await tokito.sendMessage(from, {
image: { url },
caption: cap,
contextInfo: canalInfo([p1, p2])
}, { quoted: selo })
}
catch (error) {
console.log(
'[CASAL API]',
ctx.modulos.sanitizarErro(error, [ctx.API_KEY_TOKITO]) || 'Erro sem detalhes'
)

return reply(
mess.erroApi(API_URL)
)
}
}
}
