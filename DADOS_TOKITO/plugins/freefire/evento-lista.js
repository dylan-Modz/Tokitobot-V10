/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const x4 = require('./x4')
const lista = require('./lista-sala')

module.exports = {
nome: 'evento-lista-freefire',
categoria: 'freefire',
fase: 'normal',
prioridade: 20,

async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isCmd)
return false

if (!x4.ativo(ctx))
return false

const sessao = lista.obter(ctx)

if (!sessao || !lista.ehCriador(ctx, sessao))
return false

const texto = String(ctx.body || '').trim()
const atalho = texto.toLowerCase()

if (!texto || ['a', 'f', 'm'].includes(atalho))
return false

const nomes = lista.separarNomes(texto)

if (!nomes.length)
return false

const resultado = lista.adicionar(sessao, nomes)

if (!resultado.adicionados.length) {
if (resultado.repetidos.length) {
await ctx.reply(ctx.mess.padraoAviso({
emoji: '👤',
titulo: 'JOGADOR REPETIDO',
descricao: `${resultado.repetidos[0]} já está na lista.`
}))
return true
}

return false
}

lista.salvar(ctx, sessao)
await ctx.reagir(ctx.from, '✅').catch(() => {})

if (!lista.completa(sessao)) {
await ctx.reply(
ctx.mess.salaFreeFireLista(sessao),
[sessao.criador]
)
return true
}

try {
await lista.concluir(ctx, sessao)
} catch {
await ctx.reply(ctx.mess.padraoErro({
titulo: 'NÃO CONSEGUI ABRIR O GRUPO',
descricao: `Use ${ctx.prefix}sala finalizar para tentar novamente.`
}))
}

return true
}
}
