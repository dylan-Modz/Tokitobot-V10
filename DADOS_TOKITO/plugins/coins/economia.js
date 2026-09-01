const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

const restante = (ultimo, cooldown) => {
  const falta = cooldown - (Date.now() - Number(ultimo || 0))
  return falta > 0 ? Math.ceil(falta / 1000) : 0
}

const numeroTexto = texto => {
  const numeros = String(texto || '')
    .replace(/@\d+/g, ' ')
    .match(/\d+/g) || []

  return Number(numeros[0] || 0)
}

const alvo = async ctx => {
  const destino = await ctx.destino().catch(() => null)
  if (!destino?.mencao)
    return null

  return ctx.normalizar(destino.mencao)
}

const garantirItem = (usuario, id, quantidade = 1) => {
  if (!usuario.itensCoins || typeof usuario.itensCoins !== 'object')
    usuario.itensCoins = {}

  usuario.itensCoins[id] = Number(usuario.itensCoins[id] || 0) + quantidade

  if (usuario.itensCoins[id] <= 0)
    delete usuario.itensCoins[id]
}

const consumir = (usuario, id) => {
  if (Number(usuario.itensCoins?.[id] || 0) <= 0)
    return false

  garantirItem(usuario, id, -1)
  return true
}

const exigirCoins = ctx => {
  if (r.temCoins(ctx))
    return true

  ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
  return false
}

dylan.setCommand({
  nome: 'economiacoins',
  comandos: [
    'trabalharcoins', 'jobcoins',
    'roubarcoins', 'rouboncoins',
    'cassino', 'cassinocoins', 'apostarcoins',
    'dadoapostado',
    'slot', 'slotcoins',
    'lojacoins', 'lojancoins',
    'inventariocoins', 'invcoins',
    'comprarcerveja', 'comprarjob', 'comprarbomba', 'comprararma',
    'pocao', 'comprarpocao', 'escudo', 'comprarescudo'
  ],
  categoria: 'coins',
  info: {
    descricao: 'Economia avançada de N-Coins: trabalho, roubo, cassino e loja.',
    uso: 'cassino 500',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!exigirCoins(ctx))
      return

    const comando = String(ctx.command || '').toLowerCase()
    const eu = r.eco(ctx)

    if (['trabalharcoins', 'jobcoins'].includes(comando)) {
      const cd = restante(eu.ultimoTrabalhoCoins, 10 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      let ganho = r.aleatorio(280, 720)
      let bonus = false

      if (consumir(eu, 'job')) {
        ganho = Math.floor(ganho * 1.2)
        bonus = true
      }

      eu.coins = Number(eu.coins || 0) + ganho
      eu.ultimoTrabalhoCoins = Date.now()

      if (r.temRpg(ctx))
        r.addXp(ctx, r.aleatorio(5, 12))
      else
        r.salvar(ctx)

      return ctx.reply(compacto(ctx, '💼', 'Trabalho N-Coins', [
        { emoji: '💰', texto: `Recebido: +${dinheiro(ganho)}` },
        bonus ? { emoji: '🎫', texto: 'Passe Job usado • bônus de 20%' } : null,
        { emoji: '🪙', texto: `Saldo: ${dinheiro(eu.coins)}` }
      ]))
    }

    if (['roubarcoins', 'rouboncoins'].includes(comando)) {
      const jid = await alvo(ctx)
      if (!jid)
        return ctx.reply(compacto(ctx, '🥷', 'Roubar Coins', [
          { emoji: '📌', texto: `${ctx.prefix}roubarcoins @usuario` }
        ]))

      const meuJid = ctx.normalizar(ctx.sender)
      if (jid === meuJid)
        return ctx.reply(ctx.mess.coinsDoarMesmo())

      const cd = restante(eu.ultimoRoubo, 30 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      const vitima = r.eco(ctx, jid)

      if (consumir(vitima, 'escudo')) {
        eu.ultimoRoubo = Date.now()
        r.salvar(ctx)
        return ctx.reply(compacto(ctx, '🛡️', 'Roubo bloqueado', [
          { emoji: '👤', texto: `@${jid.split('@')[0]} estava protegido por um escudo` },
          { emoji: '💥', texto: 'O escudo foi consumido' }
        ]), [jid])
      }

      let chance = 45
      let itemUsado = ''

      if (consumir(eu, 'arma')) {
        chance += 12
        itemUsado = 'Arma RPG'
      }
      else if (consumir(eu, 'bomba')) {
        chance += 8
        itemUsado = 'Bomba'
      }

      const sucesso = Math.random() * 100 < chance
      eu.ultimoRoubo = Date.now()

      if (sucesso && Number(vitima.coins || 0) > 0) {
        const porcentagem = r.aleatorio(5, 18) / 100
        const valor = Math.max(20, Math.min(2500, Math.floor(Number(vitima.coins || 0) * porcentagem)))
        const roubado = Math.min(valor, Number(vitima.coins || 0))

        vitima.coins -= roubado
        eu.coins = Number(eu.coins || 0) + roubado

        if (r.temRpg(ctx))
          r.addXp(ctx, 10)
        else
          r.salvar(ctx)

        return ctx.reply(compacto(ctx, '🥷', 'Roubo concluído', [
          { emoji: '👤', texto: `Alvo: @${jid.split('@')[0]}` },
          { emoji: '💰', texto: `Roubado: +${dinheiro(roubado)}` },
          itemUsado ? { emoji: '🎒', texto: `${itemUsado} usado na tentativa` } : null,
          { emoji: '🪙', texto: `Saldo: ${dinheiro(eu.coins)}` }
        ]), [jid])
      }

      const multa = Math.min(Number(eu.coins || 0), r.aleatorio(80, 350))
      eu.coins -= multa
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🚨', 'Roubo falhou', [
        { emoji: '👤', texto: `Alvo: @${jid.split('@')[0]}` },
        { emoji: '💸', texto: `Prejuízo: -${dinheiro(multa)}` },
        itemUsado ? { emoji: '🎒', texto: `${itemUsado} foi consumido` } : null
      ]), [jid])
    }

    if (['cassino', 'cassinocoins', 'apostarcoins'].includes(comando)) {
      const aposta = numeroTexto(ctx.q)
      if (!aposta || aposta < 50)
        return ctx.reply(compacto(ctx, '🎰', 'Cassino', [
          { emoji: '📌', texto: `${ctx.prefix}cassino 500` },
          { emoji: '💰', texto: 'Aposta mínima: 50 N-Coins' }
        ]))

      if (Number(eu.coins || 0) < aposta)
        return ctx.reply(ctx.mess.coinsSemSaldo(aposta, eu.coins))

      const cd = restante(eu.ultimoCassino, 8 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      eu.ultimoCassino = Date.now()
      const sorte = Math.random()
      let retorno = 0
      let resultado = 'A banca venceu'

      if (sorte < 0.08) {
        retorno = aposta * 4
        resultado = 'Jackpot • 4x'
      }
      else if (sorte < 0.34) {
        retorno = aposta * 2
        resultado = 'Vitória • 2x'
      }

      eu.coins = Number(eu.coins || 0) - aposta + retorno
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, retorno ? '🎉' : '🎰', 'Cassino', [
        { emoji: '🎟️', texto: `Aposta: ${dinheiro(aposta)}` },
        { emoji: retorno ? '🏆' : '💥', texto: resultado },
        { emoji: '💰', texto: `Retorno: ${dinheiro(retorno)}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(eu.coins)}` }
      ]))
    }

    if (comando === 'dadoapostado') {
      const palpite = Number(ctx.args?.[0] || 0)
      const aposta = Number(ctx.args?.[1] || 0)

      if (palpite < 1 || palpite > 6 || aposta < 50)
        return ctx.reply(compacto(ctx, '🎲', 'Dado Apostado', [
          { emoji: '📌', texto: `${ctx.prefix}dadoapostado 4 500` },
          { emoji: '🎲', texto: 'Escolha um número de 1 a 6' }
        ]))

      if (Number(eu.coins || 0) < aposta)
        return ctx.reply(ctx.mess.coinsSemSaldo(aposta, eu.coins))

      const saiu = r.aleatorio(1, 6)
      const ganhou = saiu === palpite
      const retorno = ganhou ? aposta * 5 : 0

      eu.coins = Number(eu.coins || 0) - aposta + retorno
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, ganhou ? '🎉' : '🎲', 'Dado Apostado', [
        { emoji: '🎯', texto: `Seu palpite: ${palpite}` },
        { emoji: '🎲', texto: `Dado: ${saiu}` },
        { emoji: ganhou ? '🏆' : '💸', texto: ganhou ? `Você recebeu ${dinheiro(retorno)}` : `Você perdeu ${dinheiro(aposta)}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(eu.coins)}` }
      ]))
    }

    if (['slot', 'slotcoins'].includes(comando)) {
      const aposta = Math.max(50, numeroTexto(ctx.q) || 100)
      if (Number(eu.coins || 0) < aposta)
        return ctx.reply(ctx.mess.coinsSemSaldo(aposta, eu.coins))

      const simbolos = ['🍒', '🍋', '🔔', '💎', '7️⃣']
      const giro = [r.escolher(simbolos), r.escolher(simbolos), r.escolher(simbolos)]
      let multiplicador = 0

      if (giro[0] === giro[1] && giro[1] === giro[2])
        multiplicador = giro[0] === '7️⃣' ? 8 : giro[0] === '💎' ? 6 : 4
      else if (giro[0] === giro[1] || giro[1] === giro[2] || giro[0] === giro[2])
        multiplicador = 1.5

      const retorno = Math.floor(aposta * multiplicador)
      eu.coins = Number(eu.coins || 0) - aposta + retorno
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🎰', 'Slot N-Coins', [
        { emoji: '🎰', texto: giro.join('  ') },
        { emoji: '🎟️', texto: `Aposta: ${dinheiro(aposta)}` },
        { emoji: retorno ? '🏆' : '💥', texto: retorno ? `Retorno: ${dinheiro(retorno)}` : 'Sem prêmio neste giro' },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(eu.coins)}` }
      ]))
    }

    if (['lojacoins', 'lojancoins'].includes(comando)) {
      return ctx.reply(compacto(ctx, '🛒', 'Loja N-Coins', Object.entries(r.COINS_LOJA).map(([id, item]) => ({
        emoji: item.emoji,
        texto: `${item.nome} • ${dinheiro(item.preco)} • ${item.descricao} • ${ctx.prefix}${id === 'pocao' || id === 'escudo' ? id : `comprar${id}`}`
      }))))
    }

    if (['inventariocoins', 'invcoins'].includes(comando)) {
      const itens = Object.entries(eu.itensCoins || {}).filter(([, qtd]) => Number(qtd) > 0)
      return ctx.reply(compacto(ctx, '🎒', 'Inventário N-Coins', itens.length
        ? itens.map(([id, qtd]) => ({
            emoji: r.COINS_LOJA[id]?.emoji || '📦',
            texto: `${r.COINS_LOJA[id]?.nome || id} x${qtd}`
          }))
        : [{ emoji: '📭', texto: 'Seu inventário está vazio' }]
      ))
    }

    const compraMap = {
      comprarcerveja: 'cerveja',
      comprarjob: 'job',
      comprarbomba: 'bomba',
      comprararma: 'arma',
      pocao: 'pocao',
      comprarpocao: 'pocao',
      escudo: 'escudo',
      comprarescudo: 'escudo'
    }

    const id = compraMap[comando]
    if (id) {
      const item = r.COINS_LOJA[id]
      if (Number(eu.coins || 0) < item.preco)
        return ctx.reply(ctx.mess.coinsSemSaldo(item.preco, eu.coins))

      eu.coins -= item.preco

      if (id === 'pocao') {
        const cidade = r.normalizarCidade(eu)
        cidade.saude = r.limitar(Number(cidade.saude || 0) + 45)
      }
      else {
        garantirItem(eu, id, 1)
      }

      r.salvar(ctx)
      return ctx.reply(compacto(ctx, item.emoji, 'Compra concluída', [
        { emoji: item.emoji, texto: item.nome },
        { emoji: '💸', texto: `Custo: ${dinheiro(item.preco)}` },
        id === 'pocao' ? { emoji: '❤️', texto: `Saúde da cidade: ${eu.cidade.saude}%` } : { emoji: '🎒', texto: `No inventário: ${Number(eu.itensCoins[id] || 0)}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(eu.coins)}` }
      ]))
    }
  }
})
