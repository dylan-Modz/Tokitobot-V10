const pokemonImg = require('../../INFO_DADOS/LOGOS/links_pokemon.json')
const petsImg = require('../../INFO_DADOS/LOGOS/links_pets.json')
const levelImg = require('../../INFO_DADOS/LOGOS/links_level.json')

const POKEMON = {
  pikachu: { nome: 'Pikachu', tipo: 'Elétrico', raridade: 'Comum', preco: 3000, evolui: 'raichu', nivel: 12, habilidade: '⚡ chance extra de achar coins' },
  bulbasaur: { nome: 'Bulbasaur', tipo: 'Planta', raridade: 'Comum', preco: 2500, evolui: 'venusaur', nivel: 16, habilidade: '🌿 recupera fome com mais facilidade' },
  squirtle: { nome: 'Squirtle', tipo: 'Água', raridade: 'Comum', preco: 2500, evolui: 'blastoise', nivel: 16, habilidade: '💧 missões mais estáveis' },
  charmander: { nome: 'Charmander', tipo: 'Fogo', raridade: 'Comum', preco: 2800, evolui: 'charizard', nivel: 16, habilidade: '🔥 ganha mais XP' },
  eevee: { nome: 'Eevee', tipo: 'Normal', raridade: 'Comum', preco: 4500, evolui: 'umbreon', nivel: 18, habilidade: '🌙 afinidade sobe mais rápido' },
  charizard: { nome: 'Charizard', tipo: 'Fogo/Voador', raridade: 'Raro', preco: 22000, habilidade: '🔥 bônus alto em batalha' },
  snorlax: { nome: 'Snorlax', tipo: 'Normal', raridade: 'Raro', preco: 21000, habilidade: '😴 resiste mais tempo sem comida' },
  lucario: { nome: 'Lucario', tipo: 'Lutador/Aço', raridade: 'Raro', preco: 28000, habilidade: '🥊 bônus em batalha e missão' },
  gengar: { nome: 'Gengar', tipo: 'Fantasma', raridade: 'Raro', preco: 30000, habilidade: '👻 assusta rivais em eventos' },
  greninja: { nome: 'Greninja', tipo: 'Água/Sombrio', raridade: 'Raro', preco: 32000, habilidade: '🌊 missões furtivas mais lucrativas' },
  mewtwo: { nome: 'Mewtwo', tipo: 'Psíquico', raridade: 'Lendário', preco: 50000, habilidade: '🧠 altíssimo poder' },
  dragonite: { nome: 'Dragonite', tipo: 'Dragão/Voador', raridade: 'Lendário', preco: 42000, habilidade: '🐉 mais coins em missões' },
  umbreon: { nome: 'Umbreon', tipo: 'Sombrio', raridade: 'Evoluído', preco: 15000, habilidade: '🌑 afinidade e defesa elevadas' },
  blastoise: { nome: 'Blastoise', tipo: 'Água', raridade: 'Evoluído', preco: 14000, habilidade: '💦 muito resistente' },
  venusaur: { nome: 'Venusaur', tipo: 'Planta/Veneno', raridade: 'Evoluído', preco: 14000, habilidade: '🍃 equilíbrio em fome e XP' },
  raichu: { nome: 'Raichu', tipo: 'Elétrico', raridade: 'Evoluído', preco: 15000, habilidade: '⚡ bônus em eventos' }
}

const POKEMON_COMIDA = {
  berry: { nome: 'Berry', emoji: '🍓', preco: 250, fome: 25 },
  superberry: { nome: 'Super Berry', emoji: '🫐', preco: 500, fome: 45 },
  racaoagua: { nome: 'Ração Aquática', emoji: '💧', preco: 700, fome: 60 },
  racaofogo: { nome: 'Ração Flamejante', emoji: '🔥', preco: 800, fome: 60 },
  racaoplanta: { nome: 'Ração Natural', emoji: '🌿', preco: 700, fome: 60 },
  racaolutador: { nome: 'Ração de Combate', emoji: '🥊', preco: 1200, fome: 70 },
  sonifero: { nome: 'Sonífero Deluxe', emoji: '😴', preco: 1500, fome: 80 },
  sombrio: { nome: 'Essência Sombria', emoji: '🌑', preco: 1800, fome: 70 },
  mente: { nome: 'Cápsula Mental', emoji: '🧠', preco: 2500, fome: 90 },
  dragao: { nome: 'Banquete do Dragão', emoji: '🐉', preco: 2200, fome: 85 }
}

const PETS = {
  gato: { nome: 'Gato', emoji: '🐱', preco: 3000, raro: false },
  cachorro: { nome: 'Cachorro', emoji: '🐶', preco: 2000, raro: false },
  jabuti: { nome: 'Jabuti', emoji: '🐢', preco: 1000, raro: false },
  periquito: { nome: 'Periquito', emoji: '🐦', preco: 4000, raro: false },
  dragao: { nome: 'Dragão', emoji: '🐲', preco: 20000, raro: false },
  dragaodourado: { nome: 'Dragão Dourado', emoji: '🐉', preco: 40000, raro: true, imagemKey: 'dragaoDourado' },
  fenix: { nome: 'Fênix', emoji: '🔥', preco: 35000, raro: true },
  demonios: { nome: 'Demônios', emoji: '😈', preco: 45000, raro: true },
  grifo: { nome: 'Grifo', emoji: '🦅', preco: 38000, raro: true },
  axolote: { nome: 'Axolote', emoji: '🦎', preco: 30000, raro: true }
}

const PET_COMIDAS = {
  racao: { nome: 'Ração', emoji: '🍖', preco: 150, fome: 35, energia: 5, saude: 2, humor: 3 },
  premium: { nome: 'Ração Premium', emoji: '🥩', preco: 450, fome: 60, energia: 12, saude: 8, humor: 8 },
  petisco: { nome: 'Petisco', emoji: '🦴', preco: 250, fome: 20, energia: 3, saude: 1, humor: 15 },
  vitamina: { nome: 'Vitamina Pet', emoji: '🧃', preco: 650, fome: 15, energia: 15, saude: 25, humor: 5 }
}

const COINS_LOJA = {
  cerveja: { nome: 'Cerveja', emoji: '🍺', preco: 250, descricao: 'item de coleção da economia' },
  job: { nome: 'Passe Job', emoji: '💼', preco: 1800, descricao: 'bônus de 20% no próximo trabalho de coins' },
  bomba: { nome: 'Bomba', emoji: '💣', preco: 3200, descricao: 'bônus de 8% na próxima tentativa de roubo' },
  arma: { nome: 'Arma RPG', emoji: '🔫', preco: 5000, descricao: 'bônus de 12% na próxima tentativa de roubo' },
  pocao: { nome: 'Poção', emoji: '🧪', preco: 900, descricao: 'recupera saúde da cidade' },
  escudo: { nome: 'Escudo', emoji: '🛡️', preco: 2200, descricao: 'bloqueia uma tentativa de roubo contra você' }
}

const CIDADE_EMPREGOS = {
  entregador: {
    nome: 'Entregador',
    emoji: '🛵',
    salario: [320, 620],
    energia: 12,
    reputacao: 1,
    eventos: [
      'Entregas concluídas sem atraso',
      'Pedido urgente entregue no centro',
      'Rota longa finalizada com sucesso'
    ]
  },
  mecanico: {
    nome: 'Mecânico',
    emoji: '🔧',
    salario: [480, 820],
    energia: 16,
    reputacao: 2,
    eventos: [
      'Motor recuperado na oficina',
      'Revisão completa concluída',
      'Pane difícil resolvida'
    ]
  },
  paramedico: {
    nome: 'Paramédico',
    emoji: '🚑',
    salario: [600, 980],
    energia: 18,
    reputacao: 3,
    eventos: [
      'Atendimento de emergência concluído',
      'Plantão movimentado finalizado',
      'Resgate realizado com sucesso'
    ]
  },
  policial: {
    nome: 'Policial',
    emoji: '👮',
    salario: [650, 1050],
    energia: 20,
    reputacao: 4,
    eventos: [
      'Patrulha noturna concluída',
      'Ocorrência controlada no centro',
      'Operação de segurança finalizada'
    ]
  },
  programador: {
    nome: 'Programador',
    emoji: '💻',
    salario: [700, 1200],
    energia: 14,
    reputacao: 2,
    eventos: [
      'Deploy concluído sem quebrar produção',
      'Bug crítico corrigido',
      'Projeto entregue antes do prazo'
    ]
  },
  chef: {
    nome: 'Chef',
    emoji: '👨‍🍳',
    salario: [500, 900],
    energia: 17,
    reputacao: 2,
    eventos: [
      'Serviço do restaurante finalizado',
      'Prato especial elogiado pelos clientes',
      'Cozinha fechou o turno sem atrasos'
    ]
  },
  piloto: {
    nome: 'Piloto',
    emoji: '🏎️',
    salario: [850, 1450],
    energia: 22,
    reputacao: 3,
    eventos: [
      'Corrida de teste concluída',
      'Volta rápida registrada',
      'Treino de pista finalizado'
    ]
  }
}

const CIDADE_ITENS = {
  energetico: { nome: 'Energético', emoji: '⚡', preco: 300, tipo: 'energia', valor: 35 },
  kitmedico: { nome: 'Kit Médico', emoji: '🩹', preco: 650, tipo: 'saude', valor: 45 },
  sanduiche: { nome: 'Sanduíche', emoji: '🥪', preco: 220, tipo: 'fome', valor: 30 },
  vara: { nome: 'Vara de Pesca', emoji: '🎣', preco: 1800, tipo: 'equipamento', valor: 1 },
  capacete: { nome: 'Capacete Reforçado', emoji: '⛑️', preco: 2400, tipo: 'equipamento', valor: 1 },
  mochila: { nome: 'Mochila Urbana', emoji: '🎒', preco: 1200, tipo: 'equipamento', valor: 1 }
}

const CIDADE_COMIDAS = {
  pastel: { nome: 'Pastel', emoji: '🥟', preco: 120, fome: 18, energia: 2 },
  pizza: { nome: 'Pizza', emoji: '🍕', preco: 260, fome: 35, energia: 4 },
  churrasco: { nome: 'Churrasco', emoji: '🥩', preco: 520, fome: 60, energia: 8 },
  salada: { nome: 'Salada', emoji: '🥗', preco: 220, fome: 25, saude: 8 },
  cafe: { nome: 'Café', emoji: '☕', preco: 90, fome: 5, energia: 15 }
}

const CIDADE_CASAS = {
  kitnet: { nome: 'Kitnet', emoji: '🏠', preco: 8000, descanso: 25, aluguel: 220 },
  apartamento: { nome: 'Apartamento', emoji: '🏢', preco: 18000, descanso: 38, aluguel: 520 },
  casa: { nome: 'Casa', emoji: '🏡', preco: 35000, descanso: 50, aluguel: 900 },
  cobertura: { nome: 'Cobertura', emoji: '🌇', preco: 75000, descanso: 65, aluguel: 1900 }
}

const CIDADE_VEICULOS = {
  moto: { nome: 'Moto', emoji: '🏍️', preco: 9000, tanque: 40, velocidade: 68 },
  carro: { nome: 'Carro', emoji: '🚗', preco: 22000, tanque: 60, velocidade: 78 },
  esportivo: { nome: 'Esportivo', emoji: '🏎️', preco: 65000, tanque: 75, velocidade: 94 },
  supercarro: { nome: 'Supercarro', emoji: '🚘', preco: 120000, tanque: 90, velocidade: 100 }
}

const CIDADE_EMPRESAS = {
  lanchonete: { nome: 'Lanchonete', emoji: '🍔', preco: 25000, receita: [1200, 2300], despesa: [450, 900] },
  oficina: { nome: 'Oficina', emoji: '🔧', preco: 42000, receita: [1900, 3400], despesa: [700, 1300] },
  mercado: { nome: 'Mercado', emoji: '🛒', preco: 65000, receita: [2800, 4800], despesa: [1100, 1900] },
  startup: { nome: 'Startup', emoji: '🚀', preco: 95000, receita: [3800, 7200], despesa: [1600, 3000] }
}

const CIDADE_PEIXES = [
  { nome: 'Tilápia', emoji: '🐟', raridade: 'Comum', peso: [8, 35], valorKg: 90, pesoChance: 48 },
  { nome: 'Tucunaré', emoji: '🐠', raridade: 'Incomum', peso: [12, 55], valorKg: 140, pesoChance: 28 },
  { nome: 'Dourado', emoji: '🐡', raridade: 'Raro', peso: [18, 75], valorKg: 230, pesoChance: 16 },
  { nome: 'Pirarucu', emoji: '🐋', raridade: 'Épico', peso: [45, 160], valorKg: 330, pesoChance: 7 },
  { nome: 'Peixe de Cristal', emoji: '💎', raridade: 'Lendário', peso: [10, 28], valorKg: 1200, pesoChance: 1 }
]

const MINERIOS = [
  { nome: 'Carvão', emoji: '🪨', raridade: 'Comum', ganho: [100, 220], pesoChance: 42 },
  { nome: 'Ferro', emoji: '⛓️', raridade: 'Comum', ganho: [180, 340], pesoChance: 30 },
  { nome: 'Ouro', emoji: '🥇', raridade: 'Raro', ganho: [350, 620], pesoChance: 18 },
  { nome: 'Diamante', emoji: '💎', raridade: 'Épico', ganho: [650, 1100], pesoChance: 8 },
  { nome: 'Cristal de Gelo', emoji: '🧊', raridade: 'Lendário', ganho: [1400, 2200], pesoChance: 2 }
]

const PATENTES = [
  [0, 'Bronze I'], [100, 'Bronze II'], [200, 'Bronze III'], [300, 'Prata I'], [400, 'Prata II'],
  [500, 'Prata III'], [600, 'Ouro I'], [700, 'Ouro II'], [800, 'Ouro III'], [900, 'Ouro IV'],
  [1200, 'Platina I'], [1500, 'Platina II'], [1800, 'Platina III'], [2100, 'Platina IV'],
  [2700, 'Diamante I'], [3300, 'Diamante II'], [3900, 'Diamante III'], [4500, 'Diamante IV'],
  [5000, 'Paladino I'], [5500, 'Paladino II'], [6500, 'Paladino III'], [7500, 'Paladino IV'],
  [9000, 'Mestre I'], [10500, 'Mestre II'], [12000, 'Mestre III'], [13500, 'Mestre IV'], [15000, 'Mestre V'],
  [20000, 'Desafiante I'], [25000, 'Desafiante II'], [30000, 'Desafiante III'], [35000, 'Desafiante IV'], [40000, 'Desafiante V'],
  [50000, 'Usuário Superior I'], [60000, 'Usuário Superior II'], [70000, 'Mestre Supremo I'], [80000, 'Mestre Supremo II'], [90000, 'Mestre Supremo III'],
  [100000, 'Conquistador I'], [150000, 'Conquistador II'], [200000, 'Conquistador III'],
  [300000, 'Desbravador I'], [400000, 'Desbravador II'], [500000, 'Desbravador III'],
  [1000000, 'Grande Mestre I'], [1500000, 'Grande Mestre II'], [2000000, 'Grande Mestre III'],
  [5000000, 'Legancy X'], [10000000, 'Veterano']
]

const MARCOS = PATENTES.map(item => item[0]).filter(Boolean)

const numero = valor => Number.isFinite(Number(valor)) ? Number(valor) : 0
const limitar = (valor, min = 0, max = 100) => Math.min(max, Math.max(min, numero(valor)))
const aleatorio = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const escolher = lista => lista[Math.floor(Math.random() * lista.length)]

const sortearPonderado = lista => {
  const total = lista.reduce((soma, item) => soma + numero(item.pesoChance || item.peso || 1), 0)
  let sorteio = Math.random() * total

  for (const item of lista) {
    sorteio -= numero(item.pesoChance || item.peso || 1)
    if (sorteio <= 0)
      return item
  }

  return lista[lista.length - 1]
}

const cidadePadrao = () => ({
  nome: null,
  cargo: 'Desempregado',
  idCargo: 'desempregado',
  bairro: 'Centro',
  reputacao: 0,
  energia: 100,
  fome: 100,
  saude: 100,
  nivel: 1,
  xp: 0,
  saldoBanco: 0,
  casa: null,
  veiculo: null,
  combustivel: 0,
  durabilidadeVeiculo: 100,
  empresa: null,
  parceiro: null,
  casamentoPendente: null,
  presoAte: 0,
  ultimoTrabalho: 0,
  ultimoSalario: 0,
  salarioPendente: 0,
  ultimoAluguel: 0,
  ultimoLucroEmpresa: 0,
  ultimoCrime: 0,
  ultimaCorrida: 0,
  ultimaPesca: 0,
  ultimaBusca: 0,
  ultimoDescanso: 0,
  historicoBanco: [],
  peixes: {}
})

const normalizarCidade = usuario => {
  if (!usuario.cidade || typeof usuario.cidade !== 'object')
    usuario.cidade = cidadePadrao()

  const padrao = cidadePadrao()
  for (const [chave, valor] of Object.entries(padrao)) {
    if (usuario.cidade[chave] === undefined)
      usuario.cidade[chave] = Array.isArray(valor) ? [] : (valor && typeof valor === 'object' ? { ...valor } : valor)
  }

  if (!usuario.inventario || typeof usuario.inventario !== 'object')
    usuario.inventario = {}

  if (!usuario.cidade.peixes || typeof usuario.cidade.peixes !== 'object')
    usuario.cidade.peixes = {}

  if (!Array.isArray(usuario.cidade.historicoBanco))
    usuario.cidade.historicoBanco = []

  usuario.cidade.energia = limitar(usuario.cidade.energia)
  usuario.cidade.fome = limitar(usuario.cidade.fome)
  usuario.cidade.saude = limitar(usuario.cidade.saude)
  usuario.cidade.durabilidadeVeiculo = limitar(usuario.cidade.durabilidadeVeiculo)

  return usuario.cidade
}

const normalizarPet = pet => {
  if (!pet || typeof pet !== 'object')
    return pet

  const defaults = {
    apelido: null,
    fome: 100,
    energia: 100,
    saude: 100,
    limpeza: 100,
    humor: 70,
    xp: 0,
    nivel: 1,
    afeto: 0,
    dormindo: false,
    criadoEm: Date.now(),
    ultimaComida: Date.now(),
    ultimaAtualizacao: Date.now(),
    ultimoBanho: 0,
    ultimoPasseio: 0,
    ultimoCarinho: 0,
    dormiuEm: 0,
    ultimaMissao: 0,
    ultimaConstrucao: 0,
    ultimoEvento: 0,
    ultimaBatalha: 0,
    missoes: 0,
    construcoes: 0,
    vitorias: 0,
    evolucao: 0,
    diario: []
  }

  for (const [chave, valor] of Object.entries(defaults)) {
    if (pet[chave] === undefined)
      pet[chave] = valor
  }

  pet.fome = limitar(pet.fome)
  pet.energia = limitar(pet.energia)
  pet.saude = limitar(pet.saude)
  pet.limpeza = limitar(pet.limpeza)
  pet.humor = limitar(pet.humor)
  pet.nivel = 1 + Math.floor(numero(pet.xp) / 100)
  return pet
}

const normalizarPokemon = pokemon => {
  if (!pokemon || typeof pokemon !== 'object')
    return pokemon

  const defaults = {
    apelido: null,
    fome: 100,
    energia: 100,
    saude: 100,
    xp: 0,
    nivel: 1,
    afeto: 0,
    criadoEm: Date.now(),
    ultimaComida: Date.now(),
    ultimaMissao: 0,
    missoes: 0,
    vitorias: 0,
    ultimoBanho: 0,
    ultimoPasseio: 0,
    ultimoCarinho: 0,
    ultimoEvento: 0,
    ultimaBatalha: 0,
    dormindo: false,
    dormiuEm: 0,
    diario: []
  }

  for (const [chave, valor] of Object.entries(defaults)) {
    if (pokemon[chave] === undefined)
      pokemon[chave] = valor
  }

  pokemon.fome = limitar(pokemon.fome)
  pokemon.energia = limitar(pokemon.energia)
  pokemon.saude = limitar(pokemon.saude)
  pokemon.nivel = 1 + Math.floor(numero(pokemon.xp) / 100)
  return pokemon
}

const garantir = ctx => {
  const grupo = ctx.dataGp[0]

  if (!grupo.economia || typeof grupo.economia !== 'object')
    grupo.economia = { usuarios: {} }
  if (!grupo.economia.usuarios)
    grupo.economia.usuarios = {}

  if (!grupo.rpg || typeof grupo.rpg !== 'object')
    grupo.rpg = { usuarios: {} }
  if (!grupo.rpg.usuarios)
    grupo.rpg.usuarios = {}

  return grupo
}

const eco = (ctx, jid = ctx.sender) => {
  const grupo = garantir(ctx)
  const id = ctx.normalizar(jid)

  if (!grupo.economia.usuarios[id]) {
    grupo.economia.usuarios[id] = {
      coins: 0,
      ultimoBonusDia: null,
      chances: { minerar: 0, cassino: 0 },
      ultimoMinerar: 0,
      ultimoRoubo: 0,
      ultimoTrabalhoCoins: 0,
      ultimoCassino: 0,
      inventario: {},
      itensCoins: {},
      cidade: cidadePadrao()
    }
  }

  const usuario = grupo.economia.usuarios[id]

  if (!usuario.chances || typeof usuario.chances !== 'object')
    usuario.chances = { minerar: 0, cassino: 0 }

  if (usuario.coins === undefined)
    usuario.coins = 0

  if (usuario.ultimoMinerar === undefined)
    usuario.ultimoMinerar = 0
  if (usuario.ultimoRoubo === undefined)
    usuario.ultimoRoubo = 0
  if (usuario.ultimoTrabalhoCoins === undefined)
    usuario.ultimoTrabalhoCoins = 0
  if (usuario.ultimoCassino === undefined)
    usuario.ultimoCassino = 0
  if (!usuario.itensCoins || typeof usuario.itensCoins !== 'object')
    usuario.itensCoins = {}

  normalizarCidade(usuario)
  return usuario
}

const user = (ctx, jid = ctx.sender) => {
  const grupo = garantir(ctx)
  const id = ctx.normalizar(jid)

  if (!grupo.rpg.usuarios[id]) {
    grupo.rpg.usuarios[id] = {
      xp: 0,
      level: 1,
      patente: 'Bronze I',
      bloqueado: false,
      pet: null,
      pokemon: null,
      inventarioPet: {},
      inventarioPokemon: {}
    }
  }

  const usuario = grupo.rpg.usuarios[id]

  if (usuario.bloqueado === undefined)
    usuario.bloqueado = false

  if (!usuario.inventarioPet || typeof usuario.inventarioPet !== 'object')
    usuario.inventarioPet = {}
  if (!usuario.inventarioPokemon || typeof usuario.inventarioPokemon !== 'object')
    usuario.inventarioPokemon = {}

  if (usuario.pet)
    normalizarPet(usuario.pet)
  if (usuario.pokemon)
    normalizarPokemon(usuario.pokemon)

  return usuario
}

const salvar = ctx => ctx.setGp(ctx.dataGp)

const patente = xp => {
  let atual = 'Bronze I'
  for (const [marco, nome] of PATENTES) {
    if (xp >= marco)
      atual = nome
    else
      break
  }
  return atual
}

const resolverPet = tipo => {
  const chave = String(tipo || '').toLowerCase().replace(/[\s_-]+/g, '')
  return PETS[chave] ? [chave, PETS[chave]] : null
}

const imagemPet = tipo => {
  const resolvido = resolverPet(tipo)
  const chave = resolvido?.[1]?.imagemKey || resolvido?.[0] || tipo
  return petsImg.evoluidos?.[chave] || petsImg.raros?.[chave] || petsImg.comuns?.[chave] || ''
}

const imagemPokemon = tipo => pokemonImg[tipo] || pokemonImg.pikachu || ''
const temRpg = ctx => Boolean(ctx.dataGp?.[0]?.funcoes?.modorpg)
const temCoins = ctx => Boolean(ctx.dataGp?.[0]?.funcoes?.modocoins)
const ambos = ctx => temRpg(ctx) && temCoins(ctx)
const nivelPorXp = xp => 1 + MARCOS.filter(marco => xp >= marco).length

const addXp = (ctx, qtd = 1, jid = ctx.sender) => {
  const usuario = user(ctx, jid)
  if (usuario.bloqueado)
    return { u: usuario, subiu: false, antes: usuario.patente, bloqueado: true }

  const antes = usuario.patente
  usuario.xp = numero(usuario.xp) + numero(qtd)
  usuario.level = nivelPorXp(usuario.xp)
  usuario.patente = patente(usuario.xp)
  salvar(ctx)
  return { u: usuario, subiu: antes !== usuario.patente, antes }
}

const rank = (ctx, tipo = 'coins') => {
  garantir(ctx)
  const origem = tipo === 'coins' ? ctx.dataGp[0].economia.usuarios : ctx.dataGp[0].rpg.usuarios

  return Object.entries(origem)
    .map(([jid, usuario]) => ({
      jid,
      valor: tipo === 'coins' ? numero(usuario.coins) : numero(usuario.xp),
      u: usuario
    }))
    .sort((a, b) => b.valor - a.valor)
}

const valorObjeto = (objeto, catalogo) => {
  if (!objeto)
    return 0

  const id = typeof objeto === 'string' ? objeto : objeto.id
  return numero(catalogo[id]?.preco)
}

const patrimonioCidade = usuario => {
  const cidade = normalizarCidade(usuario)
  let total = numero(usuario.coins) + numero(cidade.saldoBanco)
  total += valorObjeto(cidade.casa, CIDADE_CASAS)
  total += valorObjeto(cidade.veiculo, CIDADE_VEICULOS)
  total += valorObjeto(cidade.empresa, CIDADE_EMPRESAS)

  for (const [id, quantidade] of Object.entries(usuario.inventario || {}))
    total += numero(CIDADE_ITENS[id]?.preco) * numero(quantidade)

  return Math.floor(total)
}

module.exports = {
  POKEMON,
  POKEMON_COMIDA,
  PETS,
  PET_COMIDAS,
  COINS_LOJA,
  CIDADE_EMPREGOS,
  CIDADE_ITENS,
  CIDADE_COMIDAS,
  CIDADE_CASAS,
  CIDADE_VEICULOS,
  CIDADE_EMPRESAS,
  CIDADE_PEIXES,
  MINERIOS,
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
  resolverPet,
  imagemPet,
  imagemPokemon,
  temRpg,
  temCoins,
  ambos,
  nivelPorXp,
  addXp,
  rank,
  normalizarCidade,
  normalizarPet,
  normalizarPokemon,
  patrimonioCidade,
  limitar,
  aleatorio,
  escolher,
  sortearPonderado
}
