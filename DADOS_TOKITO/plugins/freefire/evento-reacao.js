/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */
const normalizar = texto => String(texto || '')
.toLowerCase()
.normalize('NFD')
.replace(/[\u0300-\u036f]/g, '')
.replace(/\s+/g, ' ')
.trim()

const escapar = texto => String(texto || '')
.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const contemNome = (texto, nome) => {
const alvo = normalizar(nome)
const base = normalizar(texto)

if (!alvo || !base)
return false

const seguro = escapar(alvo)
const regex = new RegExp(`(^|[^a-z0-9])${seguro}(?=[^a-z0-9]|$)`, 'i')

return regex.test(base)
}
module.exports = {
nome: 'evento-reacao-nome',
categoria: 'freefire',
fase: 'normal',

async evento(ctx) {
if (!ctx.isGroup)
return false

if (ctx.info?.key?.fromMe)
return false

if (ctx.isCmd)
return false

const texto = String(ctx.body || '').trim()

if (!texto)
return false

const lista = ctx.dataGp?.[0]?.funcoes?.reacoesNome

if (!Array.isArray(lista) || !lista.length)
return false

// Aceita tanto os registros atuais (chave) quanto registros antigos
// que tenham somente nome/palavra/texto salvo no JSON do grupo.
const regra = lista.find(item => {
if (!item || !item.emoji)
return false

const alvo = item.chave || item.nome || item.palavra || item.texto
return Boolean(alvo) && contemNome(texto, alvo)
})

if (!regra)
return false

try {
await ctx.tokito.sendMessage(ctx.from, {
react: {
text: String(regra.emoji),
key: ctx.info.key
}
})

return true
} catch {
return false
}
}
}
