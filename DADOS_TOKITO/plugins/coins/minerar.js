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

const PRECOS_PICARETA = {
  pedra: 2000,
  ferro: 6000,
  ouro: 14000,
  diamante: 30000
}

const ORDEM = ['madeira', 'pedra', 'ferro', 'ouro', 'diamante']
const dinheiro = valor => Number(valor || 0).toLocaleString('pt-BR')

const exigir = ctx => {
  if (r.temCoins(ctx))
    return true

  ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
  return false
}

const procurarMinerio = texto => {
  const chave = String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  return MINERIOS.find(item => {
    const nome = item.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')

    return item.id === chave || nome === chave
  })
}

const executarAuxiliares = async ctx => {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!exigir(ctx))
      return

    const comando = String(ctx.command || '').toLowerCase()
    const usuario = r.eco(ctx)
    const m = estado(usuario)

    if (['minerios', 'mineriosinventario'].includes(comando)) {
      const lista = MINERIOS
        .map(item => ({ ...item, qtd: Number(m.minerios[item.id] || 0) }))
        .filter(item => item.qtd > 0)

      if (!lista.length) {
        return ctx.reply(
`• \`𝙼𝙸𝙽𝙴́𝚁𝙸𝙾𝚂\` 💎
> Seu inventário de mineração está vazio.
- Comece minerando — ( \`${ctx.prefix}minerar ⛏️\` )`
        )
      }

      const total = lista.reduce((soma, item) => soma + item.qtd * item.valor, 0)

      return ctx.reply(
`• \`𝙼𝙸𝙽𝙴́𝚁𝙸𝙾𝚂\` 💎
> ${lista.map(item => `${item.qtd}x ${item.nome} ${item.emoji}`).join(' • ')}
- Valor estimado — ( \`${dinheiro(total)} N-Coins 🪙\` )
> Use ${ctx.prefix}venderminerios tudo para vender tudo.`
      )
    }

    if (['venderminerios', 'venderminerio'].includes(comando)) {
      const alvo = String(ctx.q || '').trim()

      if (!alvo) {
        return ctx.reply(
`• \`𝚅𝙴𝙽𝙳𝙴𝚁 𝙼𝙸𝙽𝙴́𝚁𝙸𝙾𝚂\` 💰
> Use ${ctx.prefix}venderminerios tudo ou ${ctx.prefix}venderminerios diamante.`
        )
      }

      let vendidos = []

      if (alvo.toLowerCase() === 'tudo') {
        vendidos = MINERIOS
          .map(item => ({ ...item, qtd: Number(m.minerios[item.id] || 0) }))
          .filter(item => item.qtd > 0)
      }
      else {
        const item = procurarMinerio(alvo)

        if (!item || Number(m.minerios[item.id] || 0) <= 0) {
          return ctx.reply(
`• \`𝚅𝙴𝙽𝙳𝙴𝚁 𝙼𝙸𝙽𝙴́𝚁𝙸𝙾𝚂\` 💰
> Você não possui esse minério no inventário.`
          )
        }

        vendidos = [{ ...item, qtd: Number(m.minerios[item.id] || 0) }]
      }

      if (!vendidos.length) {
        return ctx.reply(
`• \`𝚅𝙴𝙽𝙳𝙴𝚁 𝙼𝙸𝙽𝙴́𝚁𝙸𝙾𝚂\` 💰
> Você ainda não possui minérios para vender.`
        )
      }

      const valor = vendidos.reduce((soma, item) => soma + item.qtd * item.valor, 0)

      for (const item of vendidos)
        m.minerios[item.id] = 0

      usuario.coins = Number(usuario.coins || 0) + valor
      r.salvar(ctx)

      return ctx.reply(
`• \`𝚅𝙴𝙽𝙳𝙰 𝙲𝙾𝙽𝙲𝙻𝚄𝙸́𝙳𝙰\` 💰
> Você vendeu ${vendidos.map(item => `${item.qtd}x ${item.nome}`).join(', ')}.
- Recompensa — ( \`+${dinheiro(valor)} N-Coins 🪙\` )
> Saldo: ${dinheiro(usuario.coins)} N-Coins`
      )
    }

    if (comando === 'picareta') {
      const atual = PICARETAS[m.picareta] || PICARETAS.madeira
      const pos = ORDEM.indexOf(m.picareta)
      const proxima = ORDEM[pos + 1]

      return ctx.reply(
`• \`𝙿𝙸𝙲𝙰𝚁𝙴𝚃𝙰\` ⛏️
> Sua picareta atual é de ${atual.nome}.
- Mineração — ( \`Nível ${m.nivel} ⭐\` )
> XP: ${m.xp} • Total minerado: ${m.totalMinerado}${proxima ? ` • Próxima: ${PICARETAS[proxima].nome}` : ''}`
      )
    }

    if (comando === 'lojapicareta') {
      return ctx.reply(
`• \`𝙻𝙾𝙹𝙰 𝙳𝙴 𝙿𝙸𝙲𝙰𝚁𝙴𝚃𝙰𝚂\` ⛏️
> Pedra — ${dinheiro(PRECOS_PICARETA.pedra)} • Ferro — ${dinheiro(PRECOS_PICARETA.ferro)} • Ouro — ${dinheiro(PRECOS_PICARETA.ouro)} • Diamante — ${dinheiro(PRECOS_PICARETA.diamante)}
- Comprar — ( \`${ctx.prefix}comprarpicareta ferro\` )`
      )
    }

    if (['comprarpicareta', 'melhorarpicareta'].includes(comando)) {
      const atual = ORDEM.indexOf(m.picareta)
      let id = String(ctx.args?.[0] || '').toLowerCase()

      if (comando === 'melhorarpicareta')
        id = ORDEM[atual + 1]

      if (!id || !PRECOS_PICARETA[id] || ORDEM.indexOf(id) <= atual) {
        return ctx.reply(
`• \`𝙿𝙸𝙲𝙰𝚁𝙴𝚃𝙰\` ⛏️
> Escolha uma picareta superior.
- Loja — ( \`${ctx.prefix}lojapicareta 🛒\` )`
        )
      }

      const preco = PRECOS_PICARETA[id]

      if (Number(usuario.coins || 0) < preco)
        return ctx.reply(ctx.mess.coinsSemSaldo(preco, usuario.coins))

      usuario.coins -= preco
      m.picareta = id
      r.salvar(ctx)

      return ctx.reply(
`• \`𝙿𝙸𝙲𝙰𝚁𝙴𝚃𝙰 𝙼𝙴𝙻𝙷𝙾𝚁𝙰𝙳𝙰\` ⛏️
> Agora você possui uma Picareta de ${PICARETAS[id].nome}.
- Investimento — ( \`${dinheiro(preco)} N-Coins 🪙\` )
> Saldo: ${dinheiro(usuario.coins)} N-Coins`
      )
    }

    if (comando === 'minas') {
      const desbloqueadas = [
        'Mina Abandonada',
        m.nivel >= 3 ? 'Caverna de Ferro' : null,
        m.nivel >= 6 ? 'Mina de Ouro' : null,
        m.nivel >= 10 ? 'Caverna de Cristal' : null,
        m.nivel >= 15 ? 'Abismo de Obsidiana' : null
      ].filter(Boolean)

      return ctx.reply(
`• \`𝙼𝙸𝙽𝙰𝚂\` 🕳️
> ${desbloqueadas.join(' • ')}
- Progresso — ( \`Nível ${m.nivel} ⭐\` )
> Novas áreas são liberadas conforme você minera.`
      )
    }

    if (comando === 'explorarmina') {
      const eventos = [
        { texto: 'Você encontrou um veio escondido de Ouro.', id: 'ouro', qtd: 1 },
        { texto: 'Uma passagem secreta revelou uma Safira.', id: 'safira', qtd: 1 },
        { texto: 'Você encontrou Ferro entre os escombros.', id: 'ferro', qtd: 3 },
        { texto: 'Um pequeno baú estava enterrado na mina.', coins: 450 },
        { texto: 'A exploração não revelou nada raro desta vez.' }
      ]

      const evento = r.escolher(eventos)
      let complemento = 'Continue explorando para encontrar algo raro.'

      if (evento.id) {
        m.minerios[evento.id] = Number(m.minerios[evento.id] || 0) + evento.qtd
        complemento = `${evento.qtd}x ${MINERIOS.find(item => item.id === evento.id)?.nome || evento.id} enviado para o inventário.`
      }

      if (evento.coins) {
        usuario.coins = Number(usuario.coins || 0) + evento.coins
        complemento = `+${dinheiro(evento.coins)} N-Coins encontrados no baú.`
      }

      r.salvar(ctx)

      return ctx.reply(
`• \`𝙴𝚇𝙿𝙻𝙾𝚁𝙰𝙲̧𝙰̃𝙾 𝙳𝙰 𝙼𝙸𝙽𝙰\` 🧭
> ${evento.texto}
- Resultado — ( \`${complemento}\` )`
      )
    }

    if (comando === 'rankmineracao') {
      const grupo = r.garantir(ctx)
      const ranking = Object.entries(grupo.economia.usuarios || {})
        .map(([jid, dados]) => ({
          jid,
          total: Number(dados?.mineracao?.totalMinerado || 0)
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)

      return ctx.reply(
`• \`𝚁𝙰𝙽𝙺 𝙼𝙸𝙽𝙴𝚁𝙰𝙲̧𝙰̃𝙾\` 🏆
${ranking.length
  ? ranking.map((item, i) => `> ${i + 1}° @${item.jid.split('@')[0]} — ${item.total} minérios`).join('\n')
  : '> Ainda não há mineradores no ranking.'}`,
        ranking.map(item => item.jid)
      )
    }
}

dylan.setCommand({
  nome: 'minerar',
  comandos: ['minerar',
    'minerios', 'mineriosinventario', 'venderminerios', 'venderminerio', 'picareta', 'lojapicareta', 'comprarpicareta', 'melhorarpicareta', 'minas', 'explorarmina', 'rankmineracao'
  ],
  categoria: 'coins',
  info: {
    descricao: 'Minera recursos para vender por N-Coins.',
    uso: 'minerar',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },

  async executar(ctx) {
    if (String(ctx.command || '').toLowerCase() !== 'minerar')
      return executarAuxiliares(ctx)

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
