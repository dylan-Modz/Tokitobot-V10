const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

const restante = (ultimo, cooldown) => {
  const falta = cooldown - (Date.now() - Number(ultimo || 0))
  return falta > 0 ? Math.ceil(falta / 1000) : 0
}

const destino = async ctx => {
  const d = await ctx.destino().catch(() => null)
  return d?.mencao ? ctx.normalizar(d.mencao) : null
}

const registrar = (pokemon, texto) => {
  if (!Array.isArray(pokemon.diario))
    pokemon.diario = []

  pokemon.diario.unshift({
    texto,
    em: Date.now()
  })

  pokemon.diario = pokemon.diario.slice(0, 8)
}

const nomePokemon = pokemon => {
  const dados = r.POKEMON[pokemon.tipo] || {}
  return pokemon.apelido || dados.nome || pokemon.tipo
}

dylan.setCommand({
  nome: 'pokemoncuidados',
  comandos: [
    'banhopokemon', 'banhopoke',
    'passearpokemon', 'passearpoke',
    'carinhopokemon', 'carinhopoke',
    'dormirpokemon', 'dormirpoke',
    'acordarpokemon', 'acordarpoke',
    'diariopokemon', 'diariopoke',
    'eventopokemon', 'eventopoke',
    'batalhapokemon', 'batalhapoke',
    'realezapokemon', 'pokerealeza'
  ],
  categoria: 'pokemon',
  info: {
    descricao: 'Cuidados, batalha, eventos e realeza do Pokémon.',
    uso: 'carinhopokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const comando = String(ctx.command || '').toLowerCase()
    const usuario = r.user(ctx)
    const economia = r.eco(ctx)
    const pokemon = usuario.pokemon

    if (!pokemon)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))

    r.normalizarPokemon(pokemon)
    const dados = r.POKEMON[pokemon.tipo] || {}
    const agora = Date.now()

    if (['carinhopokemon', 'carinhopoke'].includes(comando)) {
      if (pokemon.dormindo)
        return ctx.reply(compacto(ctx, '😴', 'Pokémon dormindo', [
          { emoji: '💤', texto: `${nomePokemon(pokemon)} está descansando` }
        ]))

      const cd = restante(pokemon.ultimoCarinho, 2 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      pokemon.afeto = Number(pokemon.afeto || 0) + 5
      pokemon.energia = r.limitar(Number(pokemon.energia || 0) + 3)
      pokemon.ultimoCarinho = agora
      registrar(pokemon, 'Recebeu carinho do treinador')
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '💖', 'Carinho Pokémon', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: '💖', texto: `Afeto: ${pokemon.afeto}` },
        { emoji: '⚡', texto: `Energia: ${pokemon.energia}%` }
      ]))
    }

    if (['banhopokemon', 'banhopoke'].includes(comando)) {
      const cd = restante(pokemon.ultimoBanho, 30 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      pokemon.saude = r.limitar(Number(pokemon.saude || 0) + 8)
      pokemon.afeto = Number(pokemon.afeto || 0) + 3
      pokemon.ultimoBanho = agora
      registrar(pokemon, 'Tomou banho e ficou renovado')
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🛁', 'Banho Pokémon', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: '❤️', texto: `Saúde: ${pokemon.saude}%` },
        { emoji: '💖', texto: '+3 Afeto' }
      ]))
    }

    if (['passearpokemon', 'passearpoke'].includes(comando)) {
      if (pokemon.dormindo)
        return ctx.reply(compacto(ctx, '😴', 'Pokémon dormindo', [
          { emoji: '📌', texto: `Use ${ctx.prefix}acordarpokemon primeiro` }
        ]))

      const cd = restante(pokemon.ultimoPasseio, 15 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      if (Number(pokemon.energia || 0) < 15)
        return ctx.reply(compacto(ctx, '⚡', 'Pokémon cansado', [
          { emoji: '⚡', texto: `Energia: ${pokemon.energia}%` }
        ]))

      const xp = r.aleatorio(15, 35)
      pokemon.energia = r.limitar(Number(pokemon.energia || 0) - 15)
      pokemon.fome = r.limitar(Number(pokemon.fome || 0) - 8)
      pokemon.afeto = Number(pokemon.afeto || 0) + 3
      pokemon.xp = Number(pokemon.xp || 0) + xp
      pokemon.nivel = 1 + Math.floor(pokemon.xp / 100)
      pokemon.ultimoPasseio = agora
      registrar(pokemon, 'Passeou pela cidade e ganhou experiência')
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🚶', 'Passeio Pokémon', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: '🧠', texto: `+${xp} XP` },
        { emoji: '💖', texto: '+3 Afeto' },
        { emoji: '⚡', texto: `Energia: ${pokemon.energia}%` }
      ]))
    }

    if (['dormirpokemon', 'dormirpoke'].includes(comando)) {
      if (pokemon.dormindo)
        return ctx.reply(compacto(ctx, '😴', 'Já está dormindo', [
          { emoji: '💤', texto: `${nomePokemon(pokemon)} continua descansando` }
        ]))

      pokemon.dormindo = true
      pokemon.dormiuEm = agora
      registrar(pokemon, 'Foi dormir')
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '😴', 'Hora de dormir', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: '💤', texto: 'A energia será recuperada enquanto dorme' }
      ]))
    }

    if (['acordarpokemon', 'acordarpoke'].includes(comando)) {
      if (!pokemon.dormindo)
        return ctx.reply(compacto(ctx, '☀️', 'Pokémon acordado', [
          { emoji: '⚪', texto: `${nomePokemon(pokemon)} já está acordado` }
        ]))

      const minutos = Math.max(1, Math.floor((agora - Number(pokemon.dormiuEm || agora)) / 60000))
      const energia = Math.min(70, Math.max(8, Math.floor(minutos / 2)))

      pokemon.dormindo = false
      pokemon.energia = r.limitar(Number(pokemon.energia || 0) + energia)
      pokemon.saude = r.limitar(Number(pokemon.saude || 0) + Math.min(12, Math.floor(energia / 5)))
      pokemon.dormiuEm = 0
      registrar(pokemon, 'Acordou descansado')
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '☀️', 'Pokémon acordou', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: '⚡', texto: `+${energia} Energia • agora ${pokemon.energia}%` },
        { emoji: '❤️', texto: `Saúde: ${pokemon.saude}%` }
      ]))
    }

    if (['eventopokemon', 'eventopoke'].includes(comando)) {
      const cd = restante(pokemon.ultimoEvento, 60 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      const eventos = [
        { emoji: '💎', texto: 'Encontrou um cristal raro na cidade', coins: [350, 850], xp: [25, 55], saude: 0 },
        { emoji: '🏆', texto: 'Venceu um desafio de treinador', coins: [500, 1100], xp: [40, 75], saude: -5 },
        { emoji: '🌧️', texto: 'Pegou uma tempestade no caminho', coins: [0, 100], xp: [12, 25], saude: -8 },
        { emoji: '🎁', texto: 'Recebeu uma recompensa surpresa', coins: [200, 650], xp: [18, 45], saude: 4 }
      ]
      const evento = r.escolher(eventos)
      const ganho = r.aleatorio(evento.coins[0], evento.coins[1])
      const xp = r.aleatorio(evento.xp[0], evento.xp[1])

      economia.coins = Number(economia.coins || 0) + ganho
      pokemon.xp = Number(pokemon.xp || 0) + xp
      pokemon.nivel = 1 + Math.floor(pokemon.xp / 100)
      pokemon.saude = r.limitar(Number(pokemon.saude || 0) + evento.saude)
      pokemon.ultimoEvento = agora
      registrar(pokemon, evento.texto)
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, evento.emoji, 'Evento Pokémon', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: evento.emoji, texto: evento.texto },
        { emoji: '💰', texto: `+${dinheiro(ganho)}` },
        { emoji: '🧠', texto: `+${xp} XP` },
        { emoji: '❤️', texto: `Saúde: ${pokemon.saude}%` }
      ]))
    }

    if (['batalhapokemon', 'batalhapoke'].includes(comando)) {
      const jid = await destino(ctx)
      if (!jid)
        return ctx.reply(compacto(ctx, '⚔️', 'Batalha Pokémon', [
          { emoji: '📌', texto: `${ctx.prefix}batalhapokemon @usuario` }
        ]))

      if (jid === ctx.normalizar(ctx.sender))
        return ctx.reply(ctx.mess.coinsDoarMesmo())

      const adversario = r.user(ctx, jid)
      if (!adversario.pokemon)
        return ctx.reply(compacto(ctx, '⚔️', 'Adversário sem Pokémon', [
          { emoji: '👤', texto: `@${jid.split('@')[0]} não possui Pokémon` }
        ]), [jid])

      const cd = restante(pokemon.ultimaBatalha, 10 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      r.normalizarPokemon(adversario.pokemon)
      const dadosAlvo = r.POKEMON[adversario.pokemon.tipo] || {}
      const bonusRaridade = dados.raridade === 'Lendário' ? 35 : dados.raridade === 'Raro' ? 20 : dados.raridade === 'Evoluído' ? 15 : 0
      const bonusAlvo = dadosAlvo.raridade === 'Lendário' ? 35 : dadosAlvo.raridade === 'Raro' ? 20 : dadosAlvo.raridade === 'Evoluído' ? 15 : 0
      const meuPoder = Number(pokemon.nivel || 1) * 18 + Number(pokemon.afeto || 0) + bonusRaridade + r.aleatorio(1, 100)
      const poderAlvo = Number(adversario.pokemon.nivel || 1) * 18 + Number(adversario.pokemon.afeto || 0) + bonusAlvo + r.aleatorio(1, 100)
      const venceu = meuPoder >= poderAlvo
      const ganho = venceu ? r.aleatorio(300, 950) : 0
      const xp = venceu ? 65 : 25

      pokemon.xp = Number(pokemon.xp || 0) + xp
      pokemon.nivel = 1 + Math.floor(pokemon.xp / 100)
      pokemon.energia = r.limitar(Number(pokemon.energia || 0) - 18)
      pokemon.saude = r.limitar(Number(pokemon.saude || 0) - (venceu ? 4 : 10))
      pokemon.ultimaBatalha = agora

      if (venceu) {
        pokemon.vitorias = Number(pokemon.vitorias || 0) + 1
        economia.coins = Number(economia.coins || 0) + ganho
      }

      registrar(pokemon, `${venceu ? 'Venceu' : 'Perdeu'} batalha contra ${nomePokemon(adversario.pokemon)}`)
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, venceu ? '🏆' : '⚔️', 'Batalha Pokémon', [
        { emoji: '🔴', texto: `${nomePokemon(pokemon)} x ${nomePokemon(adversario.pokemon)}` },
        { emoji: venceu ? '🏆' : '💥', texto: venceu ? 'Você venceu a batalha' : 'Seu Pokémon perdeu a batalha' },
        { emoji: '🧠', texto: `+${xp} XP` },
        { emoji: '💰', texto: `+${dinheiro(ganho)}` },
        { emoji: '❤️', texto: `Saúde: ${pokemon.saude}%` }
      ]), [jid])
    }

    if (['realezapokemon', 'pokerealeza'].includes(comando)) {
      const raridade = dados.raridade || 'Comum'
      const bonus = raridade === 'Lendário' ? 3000 : raridade === 'Raro' ? 1600 : raridade === 'Evoluído' ? 900 : 0
      const pontos = Number(pokemon.xp || 0) + Number(pokemon.afeto || 0) * 20 + Number(pokemon.vitorias || 0) * 120 + bonus
      const titulo = pontos >= 9000 ? 'Lenda Suprema' : pontos >= 5000 ? 'Rei Pokémon' : pontos >= 2500 ? 'Elite' : pontos >= 1000 ? 'Campeão' : 'Treinando'

      return ctx.reply(compacto(ctx, '👑', 'Realeza Pokémon', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: '👑', texto: `Título: ${titulo}` },
        { emoji: '✨', texto: `Pontos: ${pontos}` },
        { emoji: '🔮', texto: `Raridade: ${raridade}` },
        { emoji: '⚔️', texto: `Vitórias: ${Number(pokemon.vitorias || 0)}` }
      ]))
    }

    if (['diariopokemon', 'diariopoke'].includes(comando)) {
      const diario = Array.isArray(pokemon.diario) ? pokemon.diario.slice(0, 6) : []
      return ctx.reply(compacto(ctx, '📖', 'Diário Pokémon', [
        { emoji: '⚪', texto: nomePokemon(pokemon) },
        { emoji: '🗺️', texto: `Missões: ${Number(pokemon.missoes || 0)}` },
        { emoji: '⚔️', texto: `Vitórias: ${Number(pokemon.vitorias || 0)}` },
        { emoji: '⭐', texto: `Nível ${pokemon.nivel} • ${pokemon.xp} XP` },
        ...diario.map(item => ({ emoji: '•', texto: item.texto }))
      ]))
    }
  }
})
