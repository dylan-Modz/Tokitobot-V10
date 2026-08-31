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

const par = (l, j) => l.find(x => x.a === j || x.b === j)

const outro = (x, j) => x.a === j ? x.b : x.a

const foto = async (ctx, j) => {
try {
return await ctx.tokito.profilePictureUrl(j, 'image')
}
catch {
return 'https://files.catbox.moe/yet8m8.jpg'
}
}

const aceitar = async (ctx, de) => {
const d = ctx.dataGp[0].casamento
const p = d.pedidos.find(x => x.de === de && x.para === ctx.sender)
if (!p)
return ctx.reply(ctx.mess.casamentoSemPedido())
if (par(d.casais, de) || par(d.casais, ctx.sender))
return ctx.reply(ctx.mess.casamentoOcupado())
d.casais.push({
a: de,
b: ctx.sender,
desde: Date.now()
})
d.pedidos = d.pedidos.filter(x => ![de, ctx.sender].includes(x.de) && ![de, ctx.sender].includes(x.para))
ctx.setGp(ctx.dataGp)
const f1 = await foto(ctx, de)
const f2 = await foto(ctx, ctx.sender)
const url = `${ctx.API_URL}/canvas/casamento-aceito?foto1=${encodeURIComponent(f1)}&foto2=${encodeURIComponent(f2)}&nome1=${encodeURIComponent(de.split('@')[0])}&nome2=${encodeURIComponent(ctx.sender.split('@')[0])}&apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
const caption = ctx.mess.casamentoAceito(de, ctx.sender)
try {
return await ctx.tokito.sendMessage(ctx.from, {
image: { url },
caption,
contextInfo: ctx.canalInfo([de, ctx.sender])
}, { quoted: ctx.selo })
}
catch {
return ctx.reply(caption, [de, ctx.sender])
}
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'casar',
comandos: [
'casar',
'pedido',
'casamento',
'aceitarcasamento',
'recusarcasamento',
'cancelarcasar',
'cancelarpedidocasamento',
'divorciar',
'divorcio',
'meucasamento'
],
categoria: 'social',
info: {
descricao: 'Sistema de casamento com pedido, card, aceite e divórcio.',
uso: 'casar @usuario',
categoria: 'social'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
const d = ctx.dataGp[0].casamento || (ctx.dataGp[0].casamento = {
pedidos: [],
casais: []
})
if (['casar', 'pedido', 'casamento'].includes(ctx.command)) {
const a = ctx.normalizar((ctx.menc_jid2 || [])[0] || ctx.menc_prt || '')
if (!a)
return ctx.reply(ctx.mess.casamentoUso(ctx.prefix))
if (a === ctx.sender || a === ctx.botNumber)
return ctx.reply(ctx.mess.casamentoMesmo())
if (par(d.casais, a) || par(d.casais, ctx.sender))
return ctx.reply(ctx.mess.casamentoOcupado())
if (d.pedidos.some(x => x.para === a || x.de === ctx.sender))
return ctx.reply(ctx.mess.casamentoPendente())
d.pedidos.push({
de: ctx.sender,
para: a,
hora: Date.now()
})
ctx.setGp(ctx.dataGp)
const f1 = await foto(ctx, ctx.sender)
const f2 = await foto(ctx, a)
const url = `${ctx.API_URL}/canvas/casamento?foto1=${encodeURIComponent(f1)}&foto2=${encodeURIComponent(f2)}&nome1=${encodeURIComponent(ctx.pushname || ctx.sender.split('@')[0])}&nome2=${encodeURIComponent(a.split('@')[0])}&apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
const caption = ctx.mess.casamentoPedido(ctx.sender, a, ctx.prefix)
try {
return await ctx.tokito.sendMessage(ctx.from, {
image: { url },
caption,
contextInfo: ctx.canalInfo([ctx.sender, a])
}, { quoted: ctx.selo })
}
catch {
return ctx.reply(caption, [ctx.sender, a])
}
}
if (ctx.command === 'aceitarcasamento') {
const de = ctx.normalizar(String(ctx.q || '').replace(/\D/g, '')) || d.pedidos.find(x => x.para === ctx.sender)?.de
return aceitar(ctx, de)
}
if (ctx.command === 'recusarcasamento') {
const p = d.pedidos.find(x => x.para === ctx.sender)
if (!p)
return ctx.reply(ctx.mess.casamentoSemPedido())
d.pedidos = d.pedidos.filter(x => x !== p)
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.casamentoRecusado(p.de, ctx.sender), [p.de, ctx.sender])
}
if (['cancelarcasar', 'cancelarpedidocasamento'].includes(ctx.command)) {
const n = d.pedidos.length
d.pedidos = d.pedidos.filter(x => x.de !== ctx.sender)
if (n === d.pedidos.length)
return ctx.reply(ctx.mess.casamentoSemPedido())
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.casamentoCancelado())
}
if (['divorciar', 'divorcio'].includes(ctx.command)) {
const p = par(d.casais, ctx.sender)
if (!p)
return ctx.reply(ctx.mess.casamentoSolteiro())
const o = outro(p, ctx.sender)
d.casais = d.casais.filter(x => x !== p)
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.casamentoDivorcio(ctx.sender, o), [ctx.sender, o])
}
if (ctx.command === 'meucasamento') {
const p = par(d.casais, ctx.sender)
if (!p)
return ctx.reply(ctx.mess.casamentoSolteiro())
const o = outro(p, ctx.sender)
return ctx.reply(ctx.mess.casamentoPerfil(ctx.sender, o, ctx.mess.tempoRelacao(Date.now() - p.desde)), [ctx.sender, o])
}
},
async evento(ctx) {
if (!ctx.isGroup || !ctx.dataGp?.[0]?.casamento?.pedidos?.length)
return false
const p = ctx.dataGp[0].casamento.pedidos.find(x => x.para === ctx.sender)
if (!p)
return false
const t = String(ctx.body || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
if (['s', 'sim'].includes(t)) {
await aceitar(ctx, p.de)
return true
}
if (['n', 'nao'].includes(t)) {
ctx.dataGp[0].casamento.pedidos = ctx.dataGp[0].casamento.pedidos.filter(x => x !== p)
ctx.setGp(ctx.dataGp)
await ctx.reply(ctx.mess.casamentoRecusado(p.de, ctx.sender), [p.de, ctx.sender])
return true
}
return false
}
}
)
