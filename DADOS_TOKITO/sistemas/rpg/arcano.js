/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Sistema : RPG de Magia
 *  Dev     : Dylan Modz
 * ============================================================
 */

const r = require('./index')
const mess = require('../../mensagens/magia')
const imagens = require('../../INFO_DADOS/LOGOS/links_magia.json')

const CLASSES = {
  arcano: { nome: 'Arcano', poder: 8, mana: 20, descricao: 'equilíbrio entre poder e mana' },
  elementalista: { nome: 'Elementalista', poder: 12, mana: 10, descricao: 'domínio dos elementos' },
  necromante: { nome: 'Necromante', poder: 15, mana: 5, descricao: 'magias sombrias e invocações' },
  druida: { nome: 'Druida', poder: 9, mana: 15, descricao: 'natureza, cura e familiares' },
  clerigo: { nome: 'Clérigo', poder: 7, mana: 25, descricao: 'luz, proteção e recuperação' },
  feiticeiro: { nome: 'Feiticeiro', poder: 14, mana: 8, descricao: 'alto dano mágico' }
}

const ELEMENTOS = {
  arcano: { nome: 'Arcano', poder: 5 },
  fogo: { nome: 'Fogo', poder: 9 },
  agua: { nome: 'Água', poder: 6 },
  gelo: { nome: 'Gelo', poder: 8 },
  terra: { nome: 'Terra', poder: 7 },
  vento: { nome: 'Vento', poder: 7 },
  raio: { nome: 'Raio', poder: 10 },
  luz: { nome: 'Luz', poder: 8 },
  trevas: { nome: 'Trevas', poder: 11 },
  natureza: { nome: 'Natureza', poder: 7 }
}

const FEITICOS = {
  faisca: { nome: 'Faísca Arcana', elemento: 'Arcano', custoMana: 8, poder: 18, preco: 0, raridade: 'Comum' },
  bolafogo: { nome: 'Bola de Fogo', elemento: 'Fogo', custoMana: 18, poder: 42, preco: 120, raridade: 'Comum' },
  rajadagelo: { nome: 'Rajada de Gelo', elemento: 'Gelo', custoMana: 20, poder: 45, preco: 140, raridade: 'Raro' },
  relampago: { nome: 'Relâmpago', elemento: 'Raio', custoMana: 24, poder: 55, preco: 180, raridade: 'Raro' },
  curaluz: { nome: 'Cura de Luz', elemento: 'Luz', custoMana: 22, poder: 38, preco: 200, raridade: 'Raro' },
  raizancestral: { nome: 'Raiz Ancestral', elemento: 'Natureza', custoMana: 25, poder: 58, preco: 230, raridade: 'Épico' },
  sombravazia: { nome: 'Sombra Vazia', elemento: 'Trevas', custoMana: 30, poder: 70, preco: 300, raridade: 'Épico' },
  tempestade: { nome: 'Tempestade', elemento: 'Vento', custoMana: 34, poder: 78, preco: 360, raridade: 'Épico' },
  prisaocristal: { nome: 'Prisão de Cristal', elemento: 'Terra', custoMana: 32, poder: 74, preco: 340, raridade: 'Épico' },
  meteoro: { nome: 'Meteoro Carmesim', elemento: 'Fogo', custoMana: 45, poder: 105, preco: 550, raridade: 'Lendário' },
  eclipse: { nome: 'Eclipse Sombrio', elemento: 'Trevas', custoMana: 50, poder: 120, preco: 700, raridade: 'Lendário' },
  singularidade: { nome: 'Singularidade Arcana', elemento: 'Arcano', custoMana: 65, poder: 155, preco: 1000, raridade: 'Mítico' }
}

const ARTEFATOS = {
  cajado: { nome: 'Cajado de Carvalho', preco: 180, poder: 12, raridade: 'Comum' },
  anel: { nome: 'Anel das Runas', preco: 300, poder: 20, raridade: 'Raro' },
  tomo: { nome: 'Tomo Antigo', preco: 500, poder: 32, raridade: 'Épico' },
  amuleto: { nome: 'Amuleto Lunar', preco: 750, poder: 45, raridade: 'Lendário' },
  coroa: { nome: 'Coroa Arcana', preco: 1200, poder: 70, raridade: 'Mítico' }
}

const FAMILIARES = {
  corvo: { nome: 'Corvo Rúnico', poder: 8, raridade: 'Comum', chance: 0.72 },
  raposa: { nome: 'Raposa Mística', poder: 12, raridade: 'Comum', chance: 0.62 },
  lobo: { nome: 'Lobo Astral', poder: 18, raridade: 'Raro', chance: 0.48 },
  fada: { nome: 'Fada Lunar', poder: 20, raridade: 'Raro', chance: 0.44 },
  golem: { nome: 'Golem de Cristal', poder: 28, raridade: 'Épico', chance: 0.32 },
  grifo: { nome: 'Grifo Celestial', poder: 38, raridade: 'Épico', chance: 0.22 },
  fenix: { nome: 'Fênix Arcana', poder: 52, raridade: 'Lendário', chance: 0.13 },
  dragao: { nome: 'Dragão do Éter', poder: 75, raridade: 'Mítico', chance: 0.06 }
}

const POCOES = {
  mana: { nome: 'Poção de Mana', efeito: '+45 mana', cristais: 35 },
  foco: { nome: 'Poção de Foco', efeito: '+35 poder temporário', cristais: 55 },
  experiencia: { nome: 'Elixir de Experiência', efeito: '+80 XP', cristais: 75 }
}

const REINOS = {
  academia: { nome: 'Academia Arcana', custo: 0, nivel: 1 },
  floresta: { nome: 'Floresta Encantada', custo: 15, nivel: 2 },
  ruinas: { nome: 'Ruínas de Aether', custo: 22, nivel: 4 },
  abismo: { nome: 'Abismo Sombrio', custo: 35, nivel: 7 },
  celestial: { nome: 'Reino Celestial', custo: 45, nivel: 10 }
}

const INIMIGOS = [
  { nome: 'Slime Rúnico', poder: 35 },
  { nome: 'Esqueleto Feiticeiro', poder: 55 },
  { nome: 'Aranha do Vazio', poder: 75 },
  { nome: 'Golem de Pedra', poder: 105 },
  { nome: 'Cavaleiro Corrompido', poder: 145 },
  { nome: 'Hidra Arcana', poder: 200 }
]

const BOSSES = [
  { nome: 'Arquimago Caído', poder: 220 },
  { nome: 'Demônio do Eclipse', poder: 320 },
  { nome: 'Dragão Primordial', poder: 460 },
  { nome: 'Imperador do Vazio', poder: 650 }
]

const agora = () => Date.now()
const numero = v => Number(v || 0)
const chave = v => String(v || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '')

const aleatorio = (min, max) =>
  Math.floor(Math.random() * (Math.max(min, max) - Math.min(min, max) + 1)) + Math.min(min, max)

const pegar = (obj, valor) => obj[chave(valor)] || null

const estado = (ctx, jid = ctx.sender) => {
  const u = r.user(ctx, jid)
  if (!u.magia || typeof u.magia !== 'object') {
    u.magia = {
      iniciado: false,
      classe: 'Arcano',
      classeId: 'arcano',
      elemento: 'Arcano',
      elementoId: 'arcano',
      nivel: 1,
      xp: 0,
      mana: 100,
      manaMax: 100,
      cristais: 250,
      ouroArcano: 500,
      grimorio: ['faisca'],
      equipadas: ['faisca'],
      niveisFeitico: { faisca: 1 },
      artefatos: [],
      artefato: null,
      encantos: {},
      pocoes: { mana: 1, foco: 0, experiencia: 0 },
      familiares: {},
      familiarAtivo: null,
      torre: 1,
      reino: 'academia',
      vitorias: 0,
      derrotas: 0,
      baus: 1,
      ultimoMana: agora(),
      ultimoDiario: 0,
      cooldowns: {},
      guilda: null,
      bonusFusao: 0,
      bonusFusaoAte: 0,
      bonusFoco: 0,
      bonusFocoAte: 0
    }
  }

  const m = u.magia
  const padrao = {
    iniciado: false, classe: 'Arcano', classeId: 'arcano',
    elemento: 'Arcano', elementoId: 'arcano', nivel: 1, xp: 0,
    mana: 100, manaMax: 100, cristais: 250, ouroArcano: 500,
    grimorio: ['faisca'], equipadas: ['faisca'], niveisFeitico: { faisca: 1 },
    artefatos: [], artefato: null, encantos: {},
    pocoes: { mana: 1, foco: 0, experiencia: 0 }, familiares: {},
    familiarAtivo: null, torre: 1, reino: 'academia',
    vitorias: 0, derrotas: 0, baus: 1, ultimoMana: agora(),
    ultimoDiario: 0, cooldowns: {}, guilda: null,
    bonusFusao: 0, bonusFusaoAte: 0, bonusFoco: 0, bonusFocoAte: 0
  }

  for (const [k, v] of Object.entries(padrao)) {
    if (m[k] === undefined)
      m[k] = Array.isArray(v) ? [...v] : (v && typeof v === 'object' ? { ...v } : v)
  }

  if (!Array.isArray(m.grimorio)) m.grimorio = ['faisca']
  if (!Array.isArray(m.equipadas)) m.equipadas = ['faisca']
  if (!Array.isArray(m.artefatos)) m.artefatos = []
  if (!m.niveisFeitico || typeof m.niveisFeitico !== 'object') m.niveisFeitico = { faisca: 1 }
  if (!m.pocoes || typeof m.pocoes !== 'object') m.pocoes = { mana: 1, foco: 0, experiencia: 0 }
  if (!m.familiares || typeof m.familiares !== 'object') m.familiares = {}
  if (!m.cooldowns || typeof m.cooldowns !== 'object') m.cooldowns = {}
  if (!m.encantos || typeof m.encantos !== 'object') m.encantos = {}

  regenerarMana(m)
  return m
}

const regenerarMana = m => {
  const ultima = numero(m.ultimoMana) || agora()
  const minutos = Math.floor((agora() - ultima) / 60000)
  if (minutos > 0) {
    m.mana = Math.min(numero(m.manaMax) || 100, numero(m.mana) + minutos)
    m.ultimoMana = ultima + minutos * 60000
  }
  return m.mana
}

const xpNecessario = nivel => 100 + Math.max(0, numero(nivel) - 1) * 60

const addXp = (m, qtd = 0) => {
  m.xp = numero(m.xp) + Math.max(0, numero(qtd))
  while (m.xp >= xpNecessario(m.nivel)) {
    m.xp -= xpNecessario(m.nivel)
    m.nivel = numero(m.nivel) + 1
    m.manaMax = numero(m.manaMax) + 10
    m.mana = m.manaMax
    m.cristais = numero(m.cristais) + 25
  }
  return m
}

const poder = m => {
  let total = numero(m.nivel) * 12
  total += numero(CLASSES[m.classeId]?.poder)
  total += numero(ELEMENTOS[m.elementoId]?.poder)

  for (const id of m.equipadas || []) {
    const f = FEITICOS[id]
    if (!f) continue
    const nv = Math.max(1, numero(m.niveisFeitico?.[id]) || 1)
    total += Math.floor(f.poder * (1 + (nv - 1) * 0.12))
  }

  const art = ARTEFATOS[m.artefato]
  if (art) total += art.poder + numero(m.encantos?.[m.artefato])

  const fam = FAMILIARES[m.familiarAtivo]
  if (fam) {
    const nv = Math.max(1, numero(m.familiares?.[m.familiarAtivo]?.nivel) || 1)
    total += fam.poder + (nv - 1) * 4
  }

  if (numero(m.bonusFusaoAte) > agora()) total += numero(m.bonusFusao)
  if (numero(m.bonusFocoAte) > agora()) total += numero(m.bonusFoco)

  return Math.max(1, Math.floor(total))
}

const rank = ctx => {
  const g = r.garantir(ctx)
  return Object.entries(g.rpg.usuarios || {})
    .map(([jid, u]) => ({ jid, m: estado(ctx, jid) }))
    .filter(x => x.m.iniciado)
    .map(x => ({ ...x, poder: poder(x.m) }))
    .sort((a, b) => b.poder - a.poder || b.m.nivel - a.m.nivel)
}

const guildas = ctx => {
  const g = r.garantir(ctx)
  if (!g.rpg.guildasMagia || typeof g.rpg.guildasMagia !== 'object')
    g.rpg.guildasMagia = {}
  return g.rpg.guildasMagia
}

const guildaPoder = (ctx, guilda) =>
  (guilda?.membros || []).reduce((soma, jid) => soma + poder(estado(ctx, jid)), 0)

const idGuilda = nome => chave(nome).slice(0, 18)

const marcado = ctx => {
  const info = ctx.info || ctx.m || {}
  const mensagem = info.message || ctx.mensagem || {}
  const ext = mensagem.extendedTextMessage?.contextInfo || {}
  const img = mensagem.imageMessage?.contextInfo || {}
  const vid = mensagem.videoMessage?.contextInfo || {}
  const mencoes = [
    ...(Array.isArray(ctx.mentions) ? ctx.mentions : []),
    ...(Array.isArray(ctx.mencionados) ? ctx.mencionados : []),
    ...(Array.isArray(ext.mentionedJid) ? ext.mentionedJid : []),
    ...(Array.isArray(img.mentionedJid) ? img.mentionedJid : []),
    ...(Array.isArray(vid.mentionedJid) ? vid.mentionedJid : [])
  ]
  return mencoes.map(String).find(j => j.includes('@')) || null
}

const cooldown = (m, nome, duracao) => {
  const fim = numero(m.cooldowns?.[nome])
  if (fim > agora()) return fim - agora()
  m.cooldowns[nome] = agora() + duracao
  return 0
}

const limparCooldown = (m, nome) => {
  if (m.cooldowns) delete m.cooldowns[nome]
}

const salvar = ctx => r.salvar(ctx)

const guarda = async (ctx, exigirInicio = true) => {
  if (!ctx.isGroup) {
    const texto = typeof ctx.mess?.sogrupo === 'function'
      ? ctx.mess.sogrupo()
      : mess.magiaErro('ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ sᴏ́ ғᴜɴᴄɪᴏɴᴀ ᴇᴍ ɢʀᴜᴘᴏ.')
    await ctx.reply(texto)
    return null
  }

  if (!r.temRpg(ctx)) {
    const texto = typeof ctx.mess?.rpgDesativado === 'function'
      ? ctx.mess.rpgDesativado(ctx.prefix)
      : mess.magiaModoDesligado(ctx.prefix)
    await ctx.reply(texto)
    return null
  }

  const m = estado(ctx)
  if (exigirInicio && !m.iniciado) {
    await ctx.reply(mess.magiaNaoDesperta(ctx.prefix))
    return null
  }

  return m
}

const enviarImagem = async (ctx, nomeImagem, caption, mentions = [ctx.sender]) => {
  const url = imagens[nomeImagem]
  const contextInfo = typeof ctx.canalInfo === 'function'
    ? ctx.canalInfo(mentions.filter(Boolean))
    : { mentionedJid: mentions.filter(Boolean) }

  if (url) {
    try {
      return await ctx.tokito.sendMessage(
        ctx.from,
        { image: { url }, caption, contextInfo },
        { quoted: ctx.selo }
      )
    } catch {}
  }

  return ctx.reply(caption)
}

const consumirMana = (m, custo) => {
  regenerarMana(m)
  if (numero(m.mana) < numero(custo)) return false
  m.mana = numero(m.mana) - numero(custo)
  return true
}

const chanceVitoria = (meu, inimigo) => {
  const diferenca = numero(meu) - numero(inimigo)
  const chance = Math.max(0.18, Math.min(0.88, 0.52 + diferenca / 500))
  return Math.random() < chance
}

const recompensaCombate = dificuldade => {
  const d = Math.max(1, numero(dificuldade))
  return {
    xp: aleatorio(18 + d * 4, 30 + d * 7),
    cristais: aleatorio(8 + d * 2, 16 + d * 4),
    ouro: aleatorio(15 + d * 5, 30 + d * 8)
  }
}

module.exports = {
  r, mess, imagens,
  CLASSES, ELEMENTOS, FEITICOS, ARTEFATOS, FAMILIARES, POCOES, REINOS, INIMIGOS, BOSSES,
  chave, pegar, aleatorio, estado, regenerarMana, addXp, xpNecessario, poder, rank,
  guildas, guildaPoder, idGuilda, marcado, cooldown, limparCooldown, salvar,
  guarda, enviarImagem, consumirMana, chanceVitoria, recompensaCombate
}
