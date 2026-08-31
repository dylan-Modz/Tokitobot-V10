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

const tempo = ms => {
const s = Math.max(0, Math.floor(Number(ms || 0) / 1000))
const d = Math.floor(s / 86400)
const h = Math.floor((s % 86400) / 3600)
const m = Math.floor((s % 3600) / 60)
const seg = s % 60
const lista = []
if (d)
lista.push(`${d}d`)
if (h)
lista.push(`${h}h`)
if (m)
lista.push(`${m}m`)
if (seg || !lista.length)
lista.push(`${seg}s`)
return lista.join(' ')
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
comandos: ['afk', 'off', 'ausente', 'on', 'ativo', 'voltei'],
async executar(ctx) {
const { command, q, sender, isGroup, dataGp, setGp, reply, mess, prefix } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!Array.isArray(dataGp[0].ausentes))
dataGp[0].ausentes = []
if (['afk', 'off', 'ausente'].includes(command)) {
const motivo = String(q || '').trim() || 'Sem motivo especificado'
const atual = dataGp[0].ausentes.find(item => item.id === sender)
if (atual) {
atual.msg = motivo
atual.hora = Date.now()
}
else {
dataGp[0].ausentes.push({
id: sender,
msg: motivo,
hora: Date.now()
})
}
setGp(dataGp)
return reply(mess.afkAtivado(motivo, prefix))
}
const indice = dataGp[0].ausentes.findIndex(item => item.id === sender)
if (indice < 0)
return reply(mess.afkNaoAtivo())
const item = dataGp[0].ausentes[indice]
const duracao = tempo(Date.now() - Number(item.hora || Date.now()))
dataGp[0].ausentes.splice(indice, 1)
setGp(dataGp)
return reply(mess.afkVoltou(sender, duracao), [sender])
},
async evento(ctx) {
const { isGroup, dataGp, setGp, sender, isCmd, command, menc_jid2, menc_prt, tokito, from, mess, canalInfo, selo } = ctx
if (!isGroup || !Array.isArray(dataGp?.[0]?.ausentes) || !dataGp[0].ausentes.length)
return
const lista = dataGp[0].ausentes
const vistos = new Set([...(menc_jid2 || []), ...(menc_prt ? [menc_prt] : [])].filter(Boolean))
for (const jid of [...vistos].slice(0, 3)) {
if (jid === sender)
continue
const item = lista.find(x => x.id === jid)
if (!item)
continue
const duracao = tempo(Date.now() - Number(item.hora || Date.now()))
await tokito.sendMessage(from, {
text: mess.afkAviso(jid, item.msg, duracao),
contextInfo: canalInfo([jid])
}, { quoted: selo }).catch(() => {
})
}
const eu = lista.find(x => x.id === sender)
if (!eu)
return
if (isCmd && ['afk', 'off', 'ausente'].includes(String(command || '')))
return
const duracao = tempo(Date.now() - Number(eu.hora || Date.now()))
dataGp[0].ausentes = lista.filter(x => x.id !== sender)
setGp(dataGp)
await tokito.sendMessage(from, {
text: mess.afkVoltou(sender, duracao),
contextInfo: canalInfo([sender])
}, { quoted: selo }).catch(() => {
})
}
}
)
