/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Auto remoção de membros inativos.
 * Author: Dylan Modz
 * ============================================================
 */

const autoInativo = require('../../sistemas/autoinativo')
const dylan = require('../../database/lib/comandos')

const parseTempo = texto => {
const valor = String(texto || '').trim().toLowerCase()
const match = valor.match(/^(\d+)\s*(h|hora|horas|d|dia|dias)$/i)

if (!match) return 0

const quantidade = Number(match[1])
const unidade = match[2].startsWith('d') ? 'd' : 'h'
const ms = quantidade * (unidade === 'd' ? 86400000 : 3600000)

if (ms < autoInativo.TEMPO_MINIMO || ms > autoInativo.TEMPO_MAXIMO)
return 0

return ms
}

const garantir = ctx => {
if (!ctx.dataGp[0].funcoes || typeof ctx.dataGp[0].funcoes !== 'object')
ctx.dataGp[0].funcoes = {}

if (
!ctx.dataGp[0].funcoes.autoinativo ||
typeof ctx.dataGp[0].funcoes.autoinativo !== 'object'
) {
ctx.dataGp[0].funcoes.autoinativo = {
ativo: false,
tempoMs: autoInativo.TEMPO_PADRAO,
iniciadoEm: 0
}
}

if (!ctx.dataGp[0].atividades || typeof ctx.dataGp[0].atividades !== 'object')
ctx.dataGp[0].atividades = {}

return ctx.dataGp[0].funcoes.autoinativo
}

const jidMembro = (ctx, membro) => ctx.nJid(
membro?.phoneNumber ||
membro?.participantAlt ||
membro?.participantPn ||
membro?.jid ||
membro?.id ||
membro?.participant ||
membro?.lid ||
membro
)

const iniciarContagem = ctx => {
const agora = Date.now()

for (const membro of ctx.groupMembers || []) {
const jid = jidMembro(ctx, membro)
if (!jid) continue

const atual = ctx.dataGp[0].atividades[jid]
ctx.dataGp[0].atividades[jid] = {
...(atual && typeof atual === 'object' ? atual : {}),
total: Number(atual?.total || 0),
comandos: Number(atual?.comandos || 0),
figus: Number(atual?.figus || 0),
imagens: Number(atual?.imagens || 0),
videos: Number(atual?.videos || 0),
audios: Number(atual?.audios || 0),
documentos: Number(atual?.documentos || 0),
ultima: agora
}
}

return agora
}

const listaInativos = ctx => {
const cfg = garantir(ctx)
const agora = Date.now()
const inicio = Number(cfg.iniciadoEm || agora)
const atividades = ctx.dataGp[0].atividades || {}
const itens = []

for (const membro of ctx.groupMembers || []) {
if (['admin', 'superadmin'].includes(membro?.admin)) continue

const jid = jidMembro(ctx, membro)
if (!jid) continue

const numero = String(jid).split('@')[0].split(':')[0].replace(/\D/g, '')
if (!numero) continue

const ultima = Number(atividades[jid]?.ultima || inicio || agora)
itens.push({
jid,
numero,
ms: Math.max(0, agora - ultima)
})
}

return itens.sort((a, b) => b.ms - a.ms)
}

dylan.setCommand({
nome: 'autoinativo',
comandos: ['autoinativo', 'inativos'],
categoria: 'admin',

info: {
descricao: 'Remove automaticamente membros que ficam sem enviar mensagens no grupo.',
uso: 'autoinativo 1 | autoinativo 0 | autoinativo 3d | inativos',
permissao: 'ADM'
},

async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

if (ctx.command === 'inativos') {
const cfg = garantir(ctx)

if (!cfg.ativo)
return ctx.reply(ctx.mess.autoInativoDesativado(ctx.prefix))

const lista = listaInativos(ctx)
const limite = autoInativo.tempoSeguro(cfg.tempoMs)

return ctx.tokito.sendMessage(ctx.from, {
text: ctx.mess.autoInativoLista(
lista.slice(0, 25).map(item => ({
numero: item.numero,
tempo: autoInativo.textoTempo(item.ms)
})),
autoInativo.textoTempo(limite),
lista.length
),
mentions: lista.slice(0, 25).map(item => item.jid),
contextInfo: {
...ctx.canalInfo(lista.slice(0, 25).map(item => item.jid)),
mentionedJid: lista.slice(0, 25).map(item => item.jid)
}
}, { quoted: ctx.selo })
}

const cfg = garantir(ctx)
const acao = String(ctx.q || '').trim().toLowerCase()

if (!acao) {
return ctx.reply(
ctx.mess.autoInativoStatus(
cfg.ativo === true,
autoInativo.textoTempo(autoInativo.tempoSeguro(cfg.tempoMs)),
ctx.prefix
)
)
}

if (acao === '0') {
cfg.ativo = false
ctx.setGp(ctx.dataGp)

return ctx.reply(
ctx.mess.autoInativoStatus(
false,
autoInativo.textoTempo(autoInativo.tempoSeguro(cfg.tempoMs)),
ctx.prefix
)
)
}

if (acao === '1') {
cfg.tempoMs = autoInativo.tempoSeguro(cfg.tempoMs)
cfg.iniciadoEm = iniciarContagem(ctx)
cfg.ativo = true
ctx.setGp(ctx.dataGp)

return ctx.reply(
ctx.mess.autoInativoStatus(
true,
autoInativo.textoTempo(cfg.tempoMs),
ctx.prefix
)
)
}

const tempo = parseTempo(acao)

if (!tempo) {
return ctx.reply(
ctx.mess.autoInativoUso(ctx.prefix)
)
}

const jaEstavaAtivo = cfg.ativo === true
cfg.tempoMs = tempo
cfg.ativo = true

if (!jaEstavaAtivo)
cfg.iniciadoEm = iniciarContagem(ctx)
else if (!Number(cfg.iniciadoEm))
cfg.iniciadoEm = Date.now()

ctx.setGp(ctx.dataGp)

return ctx.reply(
ctx.mess.autoInativoStatus(
true,
autoInativo.textoTempo(tempo),
ctx.prefix
)
)
}
})
