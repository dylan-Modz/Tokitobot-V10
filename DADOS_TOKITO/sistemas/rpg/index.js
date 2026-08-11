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

const pokemonImg = require('../../INFO_DADOS/LOGOS/links_pokemon.json')
const petsImg = require('../../INFO_DADOS/LOGOS/links_pets.json')
const levelImg = require('../../INFO_DADOS/LOGOS/links_level.json')

const POKEMON = {
pikachu: {
nome: 'Pikachu',
tipo: 'Elétrico',
raridade: 'Comum',
preco: 3000,
evolui: 'raichu',
nivel: 12,
habilidade: '⚡ chance extra de achar coins'
},
bulbasaur: {
nome: 'Bulbasaur',
tipo: 'Planta',
raridade: 'Comum',
preco: 2500,
evolui: 'venusaur',
nivel: 16,
habilidade: '🌿 recupera fome com mais facilidade'
},
squirtle: {
nome: 'Squirtle',
tipo: 'Água',
raridade: 'Comum',
preco: 2500,
evolui: 'blastoise',
nivel: 16,
habilidade: '💧 missões mais estáveis'
},
charmander: {
nome: 'Charmander',
tipo: 'Fogo',
raridade: 'Comum',
preco: 2800,
evolui: 'charizard',
nivel: 16,
habilidade: '🔥 ganha mais XP'
},
eevee: {
nome: 'Eevee',
tipo: 'Normal',
raridade: 'Comum',
preco: 4500,
evolui: 'umbreon',
nivel: 18,
habilidade: '🌙 afinidade sobe mais rápido'
},
charizard: {
nome: 'Charizard',
tipo: 'Fogo/Voador',
raridade: 'Raro',
preco: 22000,
habilidade: '🔥 bônus alto em batalha'
},
snorlax: {
nome: 'Snorlax',
tipo: 'Normal',
raridade: 'Raro',
preco: 21000,
habilidade: '😴 resiste mais tempo sem comida'
},
lucario: {
nome: 'Lucario',
tipo: 'Lutador/Aço',
raridade: 'Raro',
preco: 28000,
habilidade: '🥊 bônus em batalha e missão'
},
gengar: {
nome: 'Gengar',
tipo: 'Fantasma',
raridade: 'Raro',
preco: 30000,
habilidade: '👻 assusta rivais em eventos'
},
greninja: {
nome: 'Greninja',
tipo: 'Água/Sombrio',
raridade: 'Raro',
preco: 32000,
habilidade: '🌊 missões furtivas mais lucrativas'
},
mewtwo: {
nome: 'Mewtwo',
tipo: 'Psíquico',
raridade: 'Lendário',
preco: 50000,
habilidade: '🧠 altíssimo poder'
},
dragonite: {
nome: 'Dragonite',
tipo: 'Dragão/Voador',
raridade: 'Lendário',
preco: 42000,
habilidade: '🐉 mais coins em missões'
},
umbreon: {
nome: 'Umbreon',
tipo: 'Sombrio',
raridade: 'Evoluído',
preco: 15000,
habilidade: '🌑 afinidade e defesa elevadas'
},
blastoise: {
nome: 'Blastoise',
tipo: 'Água',
raridade: 'Evoluído',
preco: 14000,
habilidade: '💦 muito resistente'
},
venusaur: {
nome: 'Venusaur',
tipo: 'Planta/Veneno',
raridade: 'Evoluído',
preco: 14000,
habilidade: '🍃 equilíbrio em fome e XP'
},
raichu: {
nome: 'Raichu',
tipo: 'Elétrico',
raridade: 'Evoluído',
preco: 15000,
habilidade: '⚡ bônus em eventos'
}
}

const POKEMON_COMIDA = {
berry: {
nome: '🍓 Berry',
preco: 250,
fome: 25
},
superberry: {
nome: '🫐 Super Berry',
preco: 500,
fome: 45
},
racaoagua: {
nome: '💧 Ração Aquática',
preco: 700,
fome: 60
},
racaofogo: {
nome: '🔥 Ração Flamejante',
preco: 800,
fome: 60
},
racaoplanta: {
nome: '🌿 Ração Natural',
preco: 700,
fome: 60
},
racaolutador: {
nome: '🥊 Ração de Combate',
preco: 1200,
fome: 70
},
sonifero: {
nome: '😴 Sonífero Deluxe',
preco: 1500,
fome: 80
},
sombrio: {
nome: '🌑 Essência Sombria',
preco: 1800,
fome: 70
},
mente: {
nome: '🧠 Cápsula Mental',
preco: 2500,
fome: 90
},
dragao: {
nome: '🐉 Banquete do Dragão',
preco: 2200,
fome: 85
}
}

const PETS = {
gato: {
nome: 'Gato',
preco: 3000
},
cachorro: {
nome: 'Cachorro',
preco: 2000
},
jabuti: {
nome: 'Jabuti',
preco: 1000
},
periquito: {
nome: 'Periquito',
preco: 4000
},
dragao: {
nome: 'Dragão',
preco: 20000
},
dragaoDourado: {
nome: 'Dragão Dourado',
preco: 40000,
raro: true
},
fenix: {
nome: 'Fênix',
preco: 35000,
raro: true
},
demonios: {
nome: 'Demônios',
preco: 45000,
raro: true
},
grifo: {
nome: 'Grifo',
preco: 38000,
raro: true
},
axolote: {
nome: 'Axolote',
preco: 30000,
raro: true
}
}

const PATENTES = [
[0, 'Bronze I'],
[100, 'Bronze II'],
[200, 'Bronze III'],
[300, 'Prata I'],
[400, 'Prata II'],
[500, 'Prata III'],
[600, 'Ouro I'],
[700, 'Ouro II'],
[800, 'Ouro III'],
[900, 'Ouro IV'],
[1200, 'Platina I'],
[1500, 'Platina II'],
[1800, 'Platina III'],
[2100, 'Platina IV'],
[2700, 'Diamante I'],
[3300, 'Diamante II'],
[3900, 'Diamante III'],
[4500, 'Diamante IV'],
[5000, 'Paladino I'],
[5500, 'Paladino II'],
[6500, 'Paladino III'],
[7500, 'Paladino IV'],
[9000, 'Mestre I'],
[10500, 'Mestre II'],
[12000, 'Mestre III'],
[13500, 'Mestre IV'],
[15000, 'Mestre V'],
[20000, 'Desafiante I'],
[25000, 'Desafiante II'],
[30000, 'Desafiante III'],
[35000, 'Desafiante IV'],
[40000, 'Desafiante V'],
[50000, 'Usuário Superior I'],
[60000, 'Usuário Superior II'],
[70000, 'Mestre Supremo I'],
[80000, 'Mestre Supremo II'],
[90000, 'Mestre Supremo III'],
[100000, 'Conquistador I'],
[150000, 'Conquistador II'],
[200000, 'Conquistador III'],
[300000, 'Desbravador I'],
[400000, 'Desbravador II'],
[500000, 'Desbravador III'],
[1000000, 'Grande Mestre I'],
[1500000, 'Grande Mestre II'],
[2000000, 'Grande Mestre III'],
[5000000, 'Legancy X'],
[10000000, 'Veterano']
]

const MARCOS = PATENTES.map(x => x[0]).filter(Boolean)

const garantir = ctx => {
const g = ctx.dataGp[0]
if (!g.economia || typeof g.economia !== 'object')
g.economia = { usuarios: {} }
if (!g.economia.usuarios)
g.economia.usuarios = {}
if (!g.rpg || typeof g.rpg !== 'object')
g.rpg = { usuarios: {} }
if (!g.rpg.usuarios)
g.rpg.usuarios = {}
return g
}

const eco = (ctx, jid = ctx.sender) => {
const g = garantir(ctx)
const id = ctx.normalizar(jid)
if (!g.economia.usuarios[id])
g.economia.usuarios[id] = {
coins: 0,
ultimoBonusDia: null,
chances: {
minerar: 0,
cassino: 0
},
ultimoMinerar: 0,
inventario: {},
cidade: {
nome: null,
cargo: 'Desempregado',
idCargo: 'desempregado',
bairro: 'centro',
reputacao: 0,
saldoBanco: 0,
energia: 100,
fome: 100,
saude: 100,
nivel: 1,
xp: 0,
casa: null,
veiculo: null,
combustivel: 0,
durabilidadeVeiculo: 100,
parceiro: null,
presoAte: 0
}
}
return g.economia.usuarios[id]
}

const user = (ctx, jid = ctx.sender) => {
const g = garantir(ctx)
const id = ctx.normalizar(jid)
if (!g.rpg.usuarios[id])
g.rpg.usuarios[id] = {
xp: 0,
level: 1,
patente: 'Bronze I',
pet: null,
pokemon: null,
inventarioPet: {},
inventarioPokemon: {}
}
return g.rpg.usuarios[id]
}

const salvar = ctx => ctx.setGp(ctx.dataGp)

const patente = xp => {
let p = 'Bronze I'
for (const [n, nome] of PATENTES)
if (xp >= n)
p = nome
else
break
return p
}

const imagemPet = tipo => petsImg.evoluidos?.[tipo] || petsImg.raros?.[tipo] || petsImg.comuns?.[tipo] || ''

const imagemPokemon = tipo => pokemonImg[tipo] || pokemonImg.pikachu || ''

const temRpg = ctx => Boolean(ctx.dataGp?.[0]?.funcoes?.modorpg)

const temCoins = ctx => Boolean(ctx.dataGp?.[0]?.funcoes?.modocoins)

const ambos = ctx => temRpg(ctx) && temCoins(ctx)

const nivelPorXp = xp => 1 + MARCOS.filter(n => xp >= n).length

const addXp = (ctx, qtd = 1, jid = ctx.sender) => {
const u = user(ctx, jid)
const antes = u.patente
u.xp = Number(u.xp || 0) + Number(qtd || 0)
u.level = nivelPorXp(u.xp)
u.patente = patente(u.xp)
salvar(ctx)
return {
u,
subiu: antes !== u.patente,
antes
}
}

const rank = (ctx, tipo = 'coins') => {
garantir(ctx)
const src = tipo === 'coins' ? ctx.dataGp[0].economia.usuarios : ctx.dataGp[0].rpg.usuarios
return Object.entries(src).map(([jid, u]) => ({
jid,
valor: tipo === 'coins' ? Number(u.coins || 0) : Number(u.xp || 0),
u
})).sort((a, b) => b.valor - a.valor)
}

module.exports = {
POKEMON,
POKEMON_COMIDA,
PETS,
PATENTES,
MARCOS,
pokemonImg,
petsImg,
levelImg,
garantir,
eco,
user,
salvar,
patente,
imagemPet,
imagemPokemon,
temRpg,
temCoins,
ambos,
nivelPorXp,
addXp,
rank
}
