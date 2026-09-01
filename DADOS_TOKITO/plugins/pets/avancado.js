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

const registrar = (pet, texto) => {
  if (!Array.isArray(pet.diario))
    pet.diario = []

  pet.diario.unshift({
    texto,
    em: Date.now()
  })

  pet.diario = pet.diario.slice(0, 8)
}

const nomePet = pet => {
  const dados = r.PETS[pet.tipo] || {}
  const base = pet.apelido || dados.nome || pet.tipo
  const evolucao = Number(pet.evolucao || 0)
  return evolucao ? `${base} +${evolucao}` : base
}

const CONSTRUCOES = {
  casinha: { nome: 'Casinha', emoji: '🏠', custo: 1200, xp: 70 },
  parque: { nome: 'Parque Pet', emoji: '🎡', custo: 2600, xp: 130 },
  jardim: { nome: 'Jardim', emoji: '🌷', custo: 1800, xp: 95 },
  castelo: { nome: 'Castelo Pet', emoji: '🏰', custo: 6500, xp: 260 }
}

dylan.setCommand({
  nome: 'petsavancado',
  comandos: [
    'comprarcomida', 'comprarcomidapet',
    'petmissao', 'missaopet',
    'petconstruir', 'construirpet',
    'petrealeza', 'realezapet',
    'petbatalha', 'batalhapet',
    'evoluirpet',
    'eventopet',
    'doarpet',
    'diariopet'
  ],
  categoria: 'pets',
  info: {
    descricao: 'Sistema avançado de pets do RPG.',
    uso: 'petmissao',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const comando = String(ctx.command || '').toLowerCase()
    const usuario = r.user(ctx)
    const economia = r.eco(ctx)
    const pet = usuario.pet

    if (['comprarcomida', 'comprarcomidapet'].includes(comando)) {
      const id = String(ctx.args?.[0] || '').toLowerCase()
      const item = r.PET_COMIDAS[id]
      const quantidade = Math.min(20, Math.max(1, Number(ctx.args?.[1] || 1)))

      if (!item)
        return ctx.reply(compacto(ctx, '🛒', 'Mercado Pet', Object.entries(r.PET_COMIDAS).map(([chave, comida]) => ({
          emoji: comida.emoji,
          texto: `${comida.nome} • ${dinheiro(comida.preco)} • ${ctx.prefix}comprarcomida ${chave}`
        }))))

      const total = item.preco * quantidade
      if (Number(economia.coins || 0) < total)
        return ctx.reply(ctx.mess.coinsSemSaldo(total, economia.coins))

      economia.coins -= total
      usuario.inventarioPet[id] = Number(usuario.inventarioPet[id] || 0) + quantidade
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, item.emoji, 'Compra Pet', [
        { emoji: item.emoji, texto: `${item.nome} x${quantidade}` },
        { emoji: '💸', texto: `Custo: ${dinheiro(total)}` },
        { emoji: '🎒', texto: `Inventário: ${usuario.inventarioPet[id]} unidade(s)` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(economia.coins)}` }
      ]))
    }

    if (!pet)
      return ctx.reply(ctx.mess.petNaoTem(ctx.prefix))

    r.normalizarPet(pet)

    if (['petmissao', 'missaopet'].includes(comando)) {
      if (pet.dormindo)
        return ctx.reply(compacto(ctx, '😴', 'Pet dormindo', [
          { emoji: '📌', texto: `Use ${ctx.prefix}acordarpet primeiro` }
        ]))

      const cd = restante(pet.ultimaMissao, 20 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      if (Number(pet.energia || 0) < 20 || Number(pet.fome || 0) < 15)
        return ctx.reply(compacto(ctx, '🐾', 'Pet sem disposição', [
          { emoji: '⚡', texto: `Energia: ${pet.energia}%` },
          { emoji: '🍖', texto: `Fome: ${pet.fome}%` }
        ]))

      const sucesso = Math.random() * 100 < Math.min(90, 60 + Number(pet.nivel || 1) * 2 + Math.min(15, Number(pet.afeto || 0) / 3))
      const ganho = sucesso ? r.aleatorio(260, 900) : 0
      const xp = sucesso ? r.aleatorio(35, 80) : r.aleatorio(10, 25)
      const evento = sucesso
        ? r.escolher(['Encontrou uma bolsa de moedas', 'Ajudou moradores da cidade', 'Explorou uma trilha escondida', 'Protegeu outro pet no caminho'])
        : r.escolher(['Voltou antes de completar a missão', 'Se perdeu e precisou retornar', 'Encontrou um obstáculo difícil demais'])

      economia.coins = Number(economia.coins || 0) + ganho
      pet.xp = Number(pet.xp || 0) + xp
      pet.nivel = 1 + Math.floor(pet.xp / 100)
      pet.energia = r.limitar(Number(pet.energia || 0) - r.aleatorio(18, 28))
      pet.fome = r.limitar(Number(pet.fome || 0) - r.aleatorio(10, 18))
      pet.missoes = Number(pet.missoes || 0) + 1
      pet.ultimaMissao = Date.now()
      registrar(pet, `${sucesso ? 'Missão concluída' : 'Missão falhou'}: ${evento}`)

      if (sucesso && !usuario.bloqueado)
        r.addXp(ctx, 7)
      else
        r.salvar(ctx)

      return ctx.reply(compacto(ctx, sucesso ? '🗺️' : '🌧️', 'Missão do Pet', [
        { emoji: '🐾', texto: nomePet(pet) },
        { emoji: sucesso ? '✅' : '⚠️', texto: evento },
        { emoji: '💰', texto: `+${dinheiro(ganho)}` },
        { emoji: '🧠', texto: `+${xp} XP do Pet` },
        { emoji: '⚡', texto: `Energia: ${pet.energia}%` }
      ]))
    }

    if (['petconstruir', 'construirpet'].includes(comando)) {
      const id = String(ctx.args?.[0] || '').toLowerCase()
      const obra = CONSTRUCOES[id]

      if (!obra)
        return ctx.reply(compacto(ctx, '🧱', 'Construções Pet', Object.entries(CONSTRUCOES).map(([chave, item]) => ({
          emoji: item.emoji,
          texto: `${item.nome} • ${dinheiro(item.custo)} • ${ctx.prefix}petconstruir ${chave}`
        }))))

      const cd = restante(pet.ultimaConstrucao, 60 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      if (Number(pet.nivel || 1) < 3)
        return ctx.reply(compacto(ctx, '🔒', 'Construção bloqueada', [
          { emoji: '⭐', texto: 'Seu pet precisa estar no nível 3 ou maior' }
        ]))

      if (Number(economia.coins || 0) < obra.custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(obra.custo, economia.coins))

      if (!pet.construcoesLista || typeof pet.construcoesLista !== 'object')
        pet.construcoesLista = {}

      economia.coins -= obra.custo
      pet.construcoesLista[id] = Number(pet.construcoesLista[id] || 0) + 1
      pet.construcoes = Number(pet.construcoes || 0) + 1
      pet.xp = Number(pet.xp || 0) + obra.xp
      pet.nivel = 1 + Math.floor(pet.xp / 100)
      pet.afeto = Number(pet.afeto || 0) + 5
      pet.ultimaConstrucao = Date.now()
      registrar(pet, `Construiu ${obra.nome}`)
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, obra.emoji, 'Construção concluída', [
        { emoji: obra.emoji, texto: obra.nome },
        { emoji: '🧠', texto: `+${obra.xp} XP do Pet` },
        { emoji: '💖', texto: '+5 Afeto' },
        { emoji: '🏗️', texto: `Construções totais: ${pet.construcoes}` }
      ]))
    }

    if (['petrealeza', 'realezapet'].includes(comando)) {
      const pontos = Number(pet.xp || 0) + Number(pet.afeto || 0) * 15 + Number(pet.vitorias || 0) * 80
      const titulo = pontos >= 6000 ? 'Imperador' : pontos >= 3000 ? 'Rei' : pontos >= 1500 ? 'Príncipe' : pontos >= 600 ? 'Nobre' : 'Aventureiro'

      return ctx.reply(compacto(ctx, '👑', 'Realeza Pet', [
        { emoji: '🐾', texto: nomePet(pet) },
        { emoji: '👑', texto: `Título: ${titulo}` },
        { emoji: '✨', texto: `Pontos de realeza: ${pontos}` },
        { emoji: '⚔️', texto: `Vitórias: ${Number(pet.vitorias || 0)}` },
        { emoji: '💖', texto: `Afeto: ${Number(pet.afeto || 0)}` }
      ]))
    }

    if (['petbatalha', 'batalhapet'].includes(comando)) {
      const jid = await destino(ctx)
      if (!jid)
        return ctx.reply(compacto(ctx, '⚔️', 'Batalha Pet', [
          { emoji: '📌', texto: `${ctx.prefix}petbatalha @usuario` }
        ]))

      if (jid === ctx.normalizar(ctx.sender))
        return ctx.reply(ctx.mess.coinsDoarMesmo())

      const adversario = r.user(ctx, jid)
      if (!adversario.pet)
        return ctx.reply(compacto(ctx, '⚔️', 'Adversário sem Pet', [
          { emoji: '👤', texto: `@${jid.split('@')[0]} não possui pet` }
        ]), [jid])

      const cd = restante(pet.ultimaBatalha, 10 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      r.normalizarPet(adversario.pet)
      const meuPoder = Number(pet.nivel || 1) * 15 + Number(pet.afeto || 0) + r.aleatorio(1, 80)
      const poderAlvo = Number(adversario.pet.nivel || 1) * 15 + Number(adversario.pet.afeto || 0) + r.aleatorio(1, 80)
      const venceu = meuPoder >= poderAlvo
      const ganho = venceu ? r.aleatorio(180, 550) : 0
      const xp = venceu ? 45 : 18

      pet.xp = Number(pet.xp || 0) + xp
      pet.nivel = 1 + Math.floor(pet.xp / 100)
      pet.energia = r.limitar(Number(pet.energia || 0) - 15)
      pet.ultimaBatalha = Date.now()

      if (venceu) {
        pet.vitorias = Number(pet.vitorias || 0) + 1
        economia.coins = Number(economia.coins || 0) + ganho
      }

      registrar(pet, `${venceu ? 'Venceu' : 'Perdeu'} batalha contra ${nomePet(adversario.pet)}`)
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, venceu ? '🏆' : '⚔️', 'Batalha Pet', [
        { emoji: '🐾', texto: `${nomePet(pet)} x ${nomePet(adversario.pet)}` },
        { emoji: venceu ? '🏆' : '💥', texto: venceu ? 'Você venceu a batalha' : 'Seu pet perdeu a batalha' },
        { emoji: '🧠', texto: `+${xp} XP` },
        { emoji: '💰', texto: `+${dinheiro(ganho)}` }
      ]), [jid])
    }

    if (comando === 'evoluirpet') {
      const atual = Number(pet.evolucao || 0)
      if (atual >= 3)
        return ctx.reply(compacto(ctx, '✨', 'Evolução máxima', [
          { emoji: '🐾', texto: `${nomePet(pet)} já atingiu a evolução máxima` }
        ]))

      const nivelNecessario = [5, 10, 20][atual]
      const custo = [1500, 3500, 7000][atual]

      if (Number(pet.nivel || 1) < nivelNecessario)
        return ctx.reply(compacto(ctx, '🔒', 'Evolução bloqueada', [
          { emoji: '⭐', texto: `Nível necessário: ${nivelNecessario}` },
          { emoji: '⭐', texto: `Seu nível: ${pet.nivel}` }
        ]))

      if (Number(economia.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, economia.coins))

      economia.coins -= custo
      pet.evolucao = atual + 1
      pet.afeto = Number(pet.afeto || 0) + 10
      pet.saude = 100
      pet.energia = 100
      registrar(pet, `Evoluiu para estágio ${pet.evolucao}`)
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '✨', 'Pet evoluiu', [
        { emoji: '🐾', texto: nomePet(pet) },
        { emoji: '🧬', texto: `Estágio de evolução: ${pet.evolucao}/3` },
        { emoji: '💖', texto: '+10 Afeto' },
        { emoji: '❤️', texto: 'Saúde e energia restauradas' }
      ]))
    }

    if (comando === 'eventopet') {
      const cd = restante(pet.ultimoEvento, 60 * 60 * 1000)
      if (cd)
        return ctx.reply(ctx.mess.coinsCooldown(cd))

      const eventos = [
        { emoji: '💎', texto: 'Encontrou moedas escondidas no parque', coins: [250, 700], xp: 25, humor: 8 },
        { emoji: '🎁', texto: 'Ganhou um presente de outro treinador', coins: [120, 350], xp: 20, humor: 15 },
        { emoji: '🌧️', texto: 'Pegou chuva no passeio e voltou cansado', coins: [0, 0], xp: 12, humor: -8 },
        { emoji: '🌟', texto: 'Virou atração da praça e recebeu carinho de todos', coins: [80, 220], xp: 35, humor: 20 }
      ]
      const evento = r.escolher(eventos)
      const ganho = r.aleatorio(evento.coins[0], evento.coins[1])

      economia.coins = Number(economia.coins || 0) + ganho
      pet.xp = Number(pet.xp || 0) + evento.xp
      pet.nivel = 1 + Math.floor(pet.xp / 100)
      pet.humor = r.limitar(Number(pet.humor || 0) + evento.humor)
      pet.ultimoEvento = Date.now()
      registrar(pet, evento.texto)
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, evento.emoji, 'Evento Pet', [
        { emoji: '🐾', texto: nomePet(pet) },
        { emoji: evento.emoji, texto: evento.texto },
        { emoji: '💰', texto: `+${dinheiro(ganho)}` },
        { emoji: '🧠', texto: `+${evento.xp} XP` },
        { emoji: '😊', texto: `Humor: ${pet.humor}%` }
      ]))
    }

    if (comando === 'doarpet') {
      const jid = await destino(ctx)
      if (!jid)
        return ctx.reply(compacto(ctx, '🎁', 'Doar Pet', [
          { emoji: '📌', texto: `${ctx.prefix}doarpet @usuario` }
        ]))

      if (jid === ctx.normalizar(ctx.sender))
        return ctx.reply(ctx.mess.coinsDoarMesmo())

      const receptor = r.user(ctx, jid)
      if (receptor.pet)
        return ctx.reply(compacto(ctx, '⚠️', 'Doação não concluída', [
          { emoji: '👤', texto: `@${jid.split('@')[0]} já possui um pet` }
        ]), [jid])

      const nome = nomePet(pet)
      receptor.pet = pet
      usuario.pet = null
      registrar(receptor.pet, `Foi doado por @${ctx.normalizar(ctx.sender).split('@')[0]}`)
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🎁', 'Pet doado', [
        { emoji: '🐾', texto: nome },
        { emoji: '👤', texto: `Novo dono: @${jid.split('@')[0]}` }
      ]), [jid, ctx.normalizar(ctx.sender)])
    }

    if (comando === 'diariopet') {
      const diario = Array.isArray(pet.diario) ? pet.diario.slice(0, 6) : []
      return ctx.reply(compacto(ctx, '📖', 'Diário do Pet', [
        { emoji: '🐾', texto: nomePet(pet) },
        { emoji: '🗺️', texto: `Missões: ${Number(pet.missoes || 0)}` },
        { emoji: '🏗️', texto: `Construções: ${Number(pet.construcoes || 0)}` },
        { emoji: '⚔️', texto: `Vitórias: ${Number(pet.vitorias || 0)}` },
        ...diario.map(item => ({
          emoji: '•',
          texto: item.texto
        }))
      ]))
    }
  }
})
