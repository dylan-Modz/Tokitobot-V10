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

const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')

const MINERIOS = [
  { id: 'carvao', nome: 'Carvão', emoji: '🪨', raridade: 'Comum', valor: 90, peso: 34 },
  { id: 'cobre', nome: 'Cobre', emoji: '🟤', raridade: 'Comum', valor: 140, peso: 26 },
  { id: 'ferro', nome: 'Ferro', emoji: '⛓️', raridade: 'Comum', valor: 210, peso: 20 },
  { id: 'ouro', nome: 'Ouro', emoji: '🥇', raridade: 'Raro', valor: 430, peso: 10 },
  { id: 'ametista', nome: 'Ametista', emoji: '🟣', raridade: 'Raro', valor: 560, peso: 5 },
  { id: 'safira', nome: 'Safira', emoji: '🔷', raridade: 'Épico', valor: 850, peso: 2.5 },
  { id: 'rubi', nome: 'Rubi', emoji: '🔴', raridade: 'Épico', valor: 980, peso: 1.5 },
  { id: 'diamante', nome: 'Diamante', emoji: '💎', raridade: 'Épico', valor: 1450, peso: 0.8 },
  { id: 'obsidiana', nome: 'Obsidiana', emoji: '⚫', raridade: 'Lendário', valor: 2300, peso: 0.15 },
  { id: 'cristalvazio', nome: 'Cristal do Vazio', emoji: '🔮', raridade: 'Lendário', valor: 5200, peso: 0.05 }
]

const PICARETAS = {
  madeira: { nome: 'Madeira', bonus: 0, max: 2 },
  pedra: { nome: 'Pedra', bonus: 4, max: 2 },
  ferro: { nome: 'Ferro', bonus: 10, max: 3 },
  ouro: { nome: 'Ouro', bonus: 18, max: 3 },
  diamante: { nome: 'Diamante', bonus: 30, max: 3 }
}

const estado = usuario => {
  if (!usuario.mineracao || typeof usuario.mineracao !== 'object')
    usuario.mineracao = {}

  const m = usuario.mineracao

  if (!m.minerios || typeof m.minerios !== 'object')
    m.minerios = {}
  if (!m.picareta)
    m.picareta = 'madeira'
  if (!m.nivel)
    m.nivel = 1
  if (!m.xp)
    m.xp = 0
  if (!m.totalMinerado)
    m.totalMinerado = 0

  return m
}

const sortear = bonus => {
  const ajustados = MINERIOS.map(item => ({
    ...item,
    pesoChance: item.raridade === 'Comum'
      ? Math.max(1, item.peso - bonus / 5)
      : item.peso + bonus / 20
  }))

  return r.sortearPonderado(ajustados)
}

dylan.setCommand({
  nome: 'minerar',
  comandos: ['minerar', 'mine'],
  categoria: 'coins',
  info: {
    descricao: 'Minera recursos para vender por N-Coins.',
    uso: 'minerar',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.temCoins(ctx))
      return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))

    const usuario = r.eco(ctx)
    const m = estado(usuario)
    const agora = Date.now()
    const cooldown = 5 * 60 * 1000

    if (agora - Number(usuario.ultimoMinerar || 0) < cooldown)
      return ctx.reply(ctx.mess.coinsCooldown(Math.ceil((cooldown - (agora - usuario.ultimoMinerar)) / 1000)))

    const picareta = PICARETAS[m.picareta] || PICARETAS.madeira
    const quantidade = r.aleatorio(1, picareta.max)
    const encontrados = []

    for (let i = 0; i < quantidade; i++) {
      const item = sortear(picareta.bonus)
      const qtd = item.raridade === 'Comum'
        ? r.aleatorio(1, 4)
        : item.raridade === 'Raro'
          ? r.aleatorio(1, 2)
          : 1

      m.minerios[item.id] = Number(m.minerios[item.id] || 0) + qtd
      m.totalMinerado += qtd
      encontrados.push({ ...item, qtd })
    }

    m.xp += encontrados.reduce((total, item) => {
      if (item.raridade === 'Lendário') return total + 40
      if (item.raridade === 'Épico') return total + 20
      if (item.raridade === 'Raro') return total + 10
      return total + 5
    }, 0)

    m.nivel = 1 + Math.floor(m.xp / 100)
    usuario.ultimoMinerar = agora
    usuario.chances.minerar = Number(usuario.chances.minerar || 0) + 1
    r.salvar(ctx)

    const resumo = encontrados
      .map(item => `${item.qtd}x ${item.nome} ${item.emoji}`)
      .join(', ')

    const raro = [...encontrados].sort((a, b) => b.valor - a.valor)[0]
    const estimado = encontrados.reduce((total, item) => total + item.valor * item.qtd, 0)

    return ctx.reply(
`• \`𝙼𝙸𝙽𝙴𝚁𝙰𝙲̧𝙰̃𝙾\` ⛏️
> Você minerou ${resumo}.
- Achado raro — ( \`${raro.nome} ${raro.emoji}\` )
> Raridade: ${raro.raridade} • Valor estimado: ${estimado.toLocaleString('pt-BR')} N-Coins`
    )
  }
})

module.exports = {
  MINERIOS,
  PICARETAS,
  estado
}
