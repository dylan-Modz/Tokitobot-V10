/*
 * Tokito Bot V10 - Anti-Nuke
 * Author: Dylan Modz
 *
 * Proteção simples contra ações administrativas em massa.
 * Sem configuração de limite/lista pelo usuário: os limites ficam internos.
 */

const JANELA_MS = 10000
const BLOQUEIO_MS = 30000

// Pontuação necessária para disparar a proteção.
// Remover ADM pesa mais que uma ação administrativa comum.
const LIMITE = 4

const historico = new Map()
const bloqueados = new Map()

const chave = (grupo, autor) =>
`${String(grupo || '')}|${String(autor || '')}`

const limpar = agora => {
for (const [id, eventos] of historico.entries()) {
const vivos = eventos.filter(item => agora - item.tempo <= JANELA_MS)

if (vivos.length)
historico.set(id, vivos)
else
historico.delete(id)
}

for (const [id, expira] of bloqueados.entries()) {
if (expira <= agora)
bloqueados.delete(id)
}
}

const bloquearTemporariamente = (grupo, autor) => {
if (!grupo || !autor)
return

bloqueados.set(
chave(grupo, autor),
Date.now() + BLOQUEIO_MS
)
}

const estaBloqueado = (grupo, autor) => {
const agora = Date.now()
limpar(agora)

return (bloqueados.get(chave(grupo, autor)) || 0) > agora
}

const pesoDaAcao = ({ acao, alvos, admins }) => {
let peso = 0

for (const alvo of alvos) {
if (acao === 'remove') {
peso += admins.has(alvo) ? 2 : 1
continue
}

if (acao === 'promote' || acao === 'demote')
peso += 1
}

return peso
}

const registrar = ({
grupo,
autor,
acao,
alvos = [],
admins = new Set(),
protegidos = []
} = {}) => {
const agora = Date.now()
limpar(agora)

if (
!grupo ||
!autor ||
!['remove', 'promote', 'demote'].includes(acao)
) {
return {
disparou: false,
pontuacao: 0
}
}

if (protegidos.includes(autor)) {
return {
disparou: false,
pontuacao: 0,
protegido: true
}
}

if (estaBloqueado(grupo, autor)) {
return {
disparou: false,
pontuacao: 0,
bloqueado: true
}
}

const peso = pesoDaAcao({
acao,
alvos,
admins
})

if (peso <= 0) {
return {
disparou: false,
pontuacao: 0
}
}

const id = chave(grupo, autor)
const eventos = historico.get(id) || []

eventos.push({
tempo: agora,
peso,
acao
})

const recentes = eventos.filter(
item => agora - item.tempo <= JANELA_MS
)

historico.set(id, recentes)

const pontuacao = recentes.reduce(
(total, item) => total + Number(item.peso || 0),
0
)

const disparou = pontuacao >= LIMITE

if (disparou) {
historico.delete(id)
bloquearTemporariamente(grupo, autor)
}

return {
disparou,
pontuacao,
limite: LIMITE,
janelaMs: JANELA_MS
}
}

module.exports = {
JANELA_MS,
BLOQUEIO_MS,
LIMITE,
registrar,
bloquearTemporariamente,
estaBloqueado
}
