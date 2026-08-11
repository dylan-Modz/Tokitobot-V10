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

const adv = require('../../sistemas/advertencias')

module.exports = {
nome: 'adv',
comandos: ['adv', 'advertir', 'advertencia'],
categoria: 'admin',
info: {
descricao: 'Aplica uma advertência a um membro. Com 3 advertências o membro é removido.',
uso: 'adv @usuario motivo',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
const { isGroup, isGroupAdmins, isBotGroupAdmins, SoDono, menc_jid2, menc_prt, q, sender, dataGp, setGp, reply, mess, tokito, from, canalInfo, selo, normalizar } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins && !SoDono)
return reply(mess.soadm())
if (!isBotGroupAdmins)
return reply(mess.botadm())
const alvo = normalizar((menc_jid2 || [])[0] || menc_prt || '')
if (!alvo)
return reply(mess.advUso(ctx.prefix))
if (alvo === sender)
return reply(mess.advMesmo())
const motivo = String(q || '').replace(/@\S+/g, '').trim() || 'Não informado'
const r = adv.adicionar({
dataGp,
setGp,
grupo: from,
jid: alvo,
motivo,
autor: sender
})
let removido = false
if (r.remove) {
try {
await tokito.groupParticipantsUpdate(from, [alvo], 'remove')
removido = true
}
catch {
}
}
await tokito.sendMessage(from, {
text: mess.advAplicada(alvo, r.quantidade, r.limite, motivo, removido),
contextInfo: canalInfo([alvo, sender])
}, { quoted: selo })
}
}
