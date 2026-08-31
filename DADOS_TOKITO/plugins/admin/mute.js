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
nome: 'mute',
comandos: ['mute', 'silenciar'],
categoria: 'admin',
info: {
descricao: 'Silencia um membro ou remove ao tentar falar.',
uso: 'mute @usuario silenciar|ban',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
const { isGroup, isGroupAdmins, isBotGroupAdmins, SoDono, menc_jid2, menc_prt, q, dataGp, setGp, reply, mess, normalizar, sender } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins && !SoDono)
return reply(mess.soadm())
if (!isBotGroupAdmins)
return reply(mess.botadm())
const alvo = normalizar((menc_jid2 || [])[0] || menc_prt || '')
if (!alvo)
return reply(mess.muteUso(ctx.prefix))
if (alvo === sender)
return reply(mess.muteMesmo())
const modo = /\bban\b/i.test(String(q || '')) ? 'ban' : 'silenciar'
if (!Array.isArray(dataGp[0].silenciados))
dataGp[0].silenciados = []
const atual = dataGp[0].silenciados.find(x => x.id === alvo)
if (atual) {
atual.modo = modo
atual.por = sender
atual.desde = Date.now()
}
else
dataGp[0].silenciados.push({
id: alvo,
modo,
por: sender,
desde: Date.now()
})
setGp(dataGp)
return reply(mess.muteAtivado(alvo, modo), [alvo])
}
}
)
