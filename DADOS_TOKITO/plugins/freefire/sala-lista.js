/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const x4 = require('./x4')
const lista = require('./lista-sala')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'sala',
comandos: ['sala', 'listaff'],
categoria: 'freefire',

info: {
descricao: 'Cria uma lista organizada de jogadores de 1x1 até 6x6.',
uso: 'sala 1x1 até 6x6',
permissao: 'ADM',
categoria: 'freefire'
},

async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!x4.ativo(ctx))
return ctx.reply(ctx.mess.modoFreeFireDesligado(ctx.prefix))

if (!x4.adm(ctx))
return ctx.reply(ctx.mess.soadm())

const entrada = String(ctx.q || '').trim()
const acao = entrada.toLowerCase()
const atual = lista.obter(ctx)

if (!entrada) {
if (!atual)
return ctx.reply(ctx.mess.salaFreeFireUso(ctx.prefix))

return ctx.reply(
ctx.mess.salaFreeFireLista(atual),
[atual.criador]
)
}

if (['cancelar', 'parar', 'encerrar'].includes(acao)) {
if (!atual)
return ctx.reply(ctx.mess.padraoAviso({
emoji: '📋',
titulo: 'SEM LISTA ATIVA',
descricao: `Crie uma lista com ${ctx.prefix}sala 4x4.`
}))

if (!lista.ehCriador(ctx, atual) && !ctx.SoDono)
return ctx.reply(
ctx.mess.salaFreeFireResponsavel(atual.criador),
[atual.criador]
)

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

try {
await lista.abrirGrupo(ctx)
lista.remover(ctx)
await ctx.reagir(ctx.from, '🔓').catch(() => {})
return ctx.reply(ctx.mess.salaFreeFireCancelada())
} catch {
return ctx.reply(ctx.mess.error())
}
}

if (acao === 'finalizar') {
if (!atual)
return ctx.reply(ctx.mess.padraoAviso({
emoji: '📋',
titulo: 'SEM LISTA ATIVA',
descricao: `Crie uma lista com ${ctx.prefix}sala 4x4.`
}))

if (!lista.ehCriador(ctx, atual) && !ctx.SoDono)
return ctx.reply(
ctx.mess.salaFreeFireResponsavel(atual.criador),
[atual.criador]
)

if (!lista.completa(atual))
return ctx.reply(ctx.mess.padraoAviso({
emoji: '👥',
titulo: 'LISTA INCOMPLETA',
descricao: `Ainda faltam ${atual.total - atual.jogadores.length} jogadores.`
}))

try {
return await lista.concluir(ctx, atual)
} catch {
return ctx.reply(ctx.mess.botadm())
}
}

const configuracao = lista.extrairModo(entrada)

if (!configuracao)
return ctx.reply(ctx.mess.salaFreeFireUso(ctx.prefix))

if (atual)
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '📋',
titulo: 'LISTA JÁ ATIVA',
descricao: `A lista ${atual.modo} ainda está sendo preenchida.`,
detalhe: `Use ${ctx.prefix}sala cancelar para encerrar.`
}),
[atual.criador]
)

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

const sessao = lista.novo(ctx, configuracao)

try {
await lista.fecharGrupo(ctx)
lista.salvar(ctx, sessao)
await ctx.reagir(ctx.from, '🔒').catch(() => {})

return ctx.reply(
ctx.mess.salaFreeFireLista(sessao),
[sessao.criador]
)
} catch {
lista.remover(ctx)
await lista.abrirGrupo(ctx).catch(() => {})
return ctx.reply(ctx.mess.error())
}
}
})
