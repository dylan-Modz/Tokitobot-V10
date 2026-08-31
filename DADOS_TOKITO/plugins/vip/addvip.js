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
nome: "addvip",
comandos: ["addvip"],
categoria: "vip",
info: {
"descricao": "Executa o comando addvip.",
"uso": "addvip",
"categoria": "vip"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
const barra = String(q || '').replace(/\s*\/\s*/g, '/')
let partesVip = barra.split('/')
let tempo50 = partesVip.length > 1 ? partesVip.pop() : ''
let nmr = partesVip.join('/')
if (!tempo50 && menc_os2 && /^\d+$/.test(barra)) {
tempo50 = barra
nmr = ''
}
const diasVip = Number(tempo50)
if (!menc_os2 && !nmr)
return reply(mess.padraoUso({
emoji: '👑',
titulo: 'ADICIONAR VIP',
uso: `${prefix}${command} @usuario/30`,
descricao: 'Marque o usuário que deseja adicionar ao VIP.'
}))
if (!Number.isInteger(diasVip) || diasVip < 0)
return reply(mess.padraoUso({
emoji: '👑',
titulo: 'TEMPO DO VIP',
uso: `${prefix}${command} @usuario/30`,
exemplos: [`${prefix}${command} @usuario/0`],
descricao: 'Use 0 dias para VIP infinito.'
}))
let usur = menc_os2 || nmr
if (Array.isArray(usur))
usur = usur[0]
usur = normalizar(usur)
if (!String(usur).includes('@'))
usur = `${String(usur).replace(/\D/g, '')}@s.whatsapp.net`
if (!usur || usur === '@s.whatsapp.net')
return reply(mess.padraoErro({
titulo: 'USUÁRIO INVÁLIDO',
descricao: 'Não foi possível identificar o usuário informado.'
}))
const indiceVip = vip.map(i => i.id).indexOf(usur)
const infinito = diasVip === 0
const agora = Date.now()
if (indiceVip >= 0) {
if (vip[indiceVip].infinito === true && !infinito)
return reply(mess.padraoAviso({
emoji: '👑',
titulo: 'VIP INFINITO',
descricao: 'Esse usuário já possui VIP infinito.'
}))
if (infinito) {
vip[indiceVip].infinito = true
vip[indiceVip].dias = 0
vip[indiceVip].expiraEm = null
}
else {
const expiracaoAtual = new Date(vip[indiceVip].expiraEm || 0).getTime()
const inicio = expiracaoAtual > agora ? expiracaoAtual : agora
vip[indiceVip].infinito = false
vip[indiceVip].expiraEm = new Date(inicio + diasVip * 86400000).toISOString()
vip[indiceVip].dias = Math.ceil((new Date(vip[indiceVip].expiraEm).getTime() - agora) / 86400000)
}
vip[indiceVip].save = Number(new Date().toLocaleDateString('pt-BR', {
timeZone: 'America/Sao_Paulo',
day: '2-digit'
}))
}
else {
vip.push({
id: usur,
dias: diasVip,
save: Number(new Date().toLocaleDateString('pt-BR', {
timeZone: 'America/Sao_Paulo',
day: '2-digit'
})),
infinito,
expiraEm: infinito ? null : new Date(agora + diasVip * 86400000).toISOString()
})
}
fs.writeFileSync(caminhoVip, JSON.stringify(vip, null, 2))
await tokito.sendMessage(from, {
text: mess.padraoSucesso({
emoji: '👑',
titulo: infinito ? 'VIP INFINITO' : 'VIP ADICIONADO',
descricao: infinito
? `@${usur.split('@')[0]} foi adicionado ao VIP infinito.`
: `${diasVip} dia${diasVip !== 1 ? 's' : ''} de VIP ${diasVip !== 1 ? 'foram adicionados' : 'foi adicionado'} a @${usur.split('@')[0]}.`
}),
contextInfo: {
...newsletter,
mentionedJid: [usur]
}
}, { quoted: selo })
}
}
}
}
)
