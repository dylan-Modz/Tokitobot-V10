const base = require('./sistema-base.js')

const arquivo = base.files.quizzes
const TEMPO = 30 * 1000
const timers = global.__TOKITO_QUIZZES_TIMERS__ ||= new Map()

const tipos = {
  pokemon: { titulo: '𝚀𝚄𝙸𝚉 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽', emoji: '🎮', arquivo: base.files.pokemon },
  calculadora: { titulo: '𝚀𝚄𝙸𝚉 𝙲𝙰𝙻𝙲𝚄𝙻𝙰𝙳𝙾𝚁𝙰', emoji: '🧮', imagem: 'https://img.gamepix.com/games/math-quiz-game/cover/math-quiz-game.png?ar=16%3A10&w=1200' },
  trivia: { titulo: '𝚀𝚄𝙸𝚉 𝚃𝚁𝙸𝚅𝙸𝙰', emoji: '🧠', arquivo: base.files.trivia, imagem: 'https://quiz-questions.uk/wp-content/uploads/2023/07/general-knowledge-quiz-1024x698.png' },
  geografia: { titulo: '𝚀𝚄𝙸𝚉 𝙶𝙴𝙾𝙶𝚁𝙰𝙵𝙸𝙰', emoji: '🌎', arquivo: base.files.geografia, imagem: 'https://webp-konwerter.incdn.pl/eyJmIjoiaHR0cHM6Ly9pbmZvci13ZWItc3RhdGljLWR6aWVubmlrLmluY2RuLnBsL2R6aWVubmlrL2RvY3VtZW50cy9GT0IwMDAwMDAwMDAwMDA3NTQ0NTgzL2ZpbGVzL3F1aXotZ2VvZ3JhZmljem55LXBhbnN0d28tcG8ta3N6dGFsY2llLTM5MDg0Njg0LnBuZyIsInciOjM4NDB9' },
  filme: { titulo: '𝚀𝚄𝙸𝚉 𝙵𝙸𝙻𝙼𝙴', emoji: '🎬', arquivo: base.files.filmes, imagem: 'https://townsquare.media/site/782/files/2024/08/attachment-Movie-Quote-Quiz-feature.jpg' }
}

const shuffle = lista => [...lista].sort(() => Math.random() - 0.5)
const norm = texto => base.norm(String(texto || '')).replace(/\s+/g, ' ')

function getGame(grupo) {
  const game = base.getGame(arquivo, grupo)
  if (!game) return null
  if (Number(game.expiraEm || 0) <= Date.now()) {
    base.removeGame(arquivo, grupo)
    return null
  }
  return game
}

const saveGame = game => base.saveGame(arquivo, game)

function removeGame(grupo) {
  const timer = timers.get(grupo)
  if (timer) clearTimeout(timer)
  timers.delete(grupo)
  return base.removeGame(arquivo, grupo)
}

function quatroOpcoes(item, lista) {
  const opcoes = Array.isArray(item.opcoes) ? [...item.opcoes] : []
  const pool = lista.map(x => x.resposta).filter(Boolean)
  for (const valor of shuffle(pool)) {
    if (opcoes.length >= 4) break
    if (!opcoes.some(x => norm(x) === norm(valor))) opcoes.push(valor)
  }
  return shuffle(opcoes.slice(0, 4))
}

function calc() {
  const divisao = Math.random() < 0.5
  let a, b, resposta, conta
  if (divisao) {
    b = Math.floor(Math.random() * 9) + 2
    resposta = Math.floor(Math.random() * 9) + 2
    a = b * resposta
    conta = `${a} ÷ ${b}`
  } else {
    a = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * 10) + 1
    resposta = a * b
    conta = `${a} × ${b}`
  }
  const opcoes = new Set([resposta])
  while (opcoes.size < 4) {
    const delta = Math.floor(Math.random() * 17) - 8
    const valor = Math.max(0, resposta + (delta || opcoes.size))
    opcoes.add(valor)
  }
  return { pergunta: conta, resposta: String(resposta), opcoes: shuffle([...opcoes].map(String)) }
}

function criarGame(grupo, tipo) {
  const cfg = tipos[tipo]
  if (!cfg) return null
  let pergunta, resposta, opcoes, imagem = cfg.imagem || ''
  if (tipo === 'calculadora') {
    ({ pergunta, resposta, opcoes } = calc())
  } else if (tipo === 'pokemon') {
    const lista = base.getList(cfg.arquivo)
    if (!lista.length) return null
    const item = lista[Math.floor(Math.random() * lista.length)]
    pergunta = 'Qual é o nome desse Pokémon?'
    resposta = item.name
    imagem = item.photo || ('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + item.id + '.png')
    opcoes = shuffle([item.name, ...shuffle(lista.filter(x => x.id !== item.id).map(x => x.name)).slice(0, 3)])
  } else {
    const lista = base.getList(cfg.arquivo)
    if (!lista.length) return null
    const item = lista[Math.floor(Math.random() * lista.length)]
    pergunta = item.pergunta
    resposta = item.resposta
    opcoes = quatroOpcoes(item, lista)
  }
  const correta = opcoes.findIndex(x => norm(x) === norm(resposta)) + 1
  const agora = Date.now()
  return {
    id: `${agora}-${Math.random().toString(36).slice(2, 8)}`,
    grupo, tipo, titulo: cfg.titulo, emoji: cfg.emoji,
    pergunta, resposta, opcoes, correta, imagem,
    iniciadoEm: agora, expiraEm: agora + TEMPO, atualizadoEm: agora
  }
}

function textoPergunta(game) {
  const linhas = game.opcoes.map((x, i) => `> ${['1️⃣','2️⃣','3️⃣','4️⃣'][i]} ׄ ( ${x} )`).join('\n')
  if (game.tipo === 'pokemon') return `- ${game.emoji} \`${game.titulo}\`\n\n> 🎮 ׄ ( ᴏʙsᴇʀᴠᴇ ᴀ ɪᴍᴀɢᴇᴍ ᴀᴄɪᴍᴀ )\n> 🎮 ׄ ( ǫᴜᴀʟ ᴇ́ ᴏ ɴᴏᴍᴇ ᴅᴇssᴇ ᴘᴏᴋᴇ́ᴍᴏɴ? )\n\n${linhas}\n\n> ⏱️ ׄ ( ᴛᴇᴍᴘᴏ: 30 sᴇɢᴜɴᴅᴏs )\n> 💬 ׄ ( ʀᴇsᴘᴏɴᴅᴀ 1, 2, 3, 4 ᴏᴜ ᴏ ɴᴏᴍᴇ )`
  if (game.tipo === 'calculadora') return `- 🧮 \`${game.titulo}\`\n\n> 🧮 ׄ ( ʀᴇsᴏʟᴠᴀ ᴀ ᴄᴏɴᴛᴀ )\n> ➗ ׄ ( ${game.pergunta} )\n\n${linhas}\n\n> ⏱️ ׄ ( ᴛᴇᴍᴘᴏ: 30 sᴇɢᴜɴᴅᴏs )\n> 💬 ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴄᴏᴍ ᴀ ᴀʟᴛᴇʀɴᴀᴛɪᴠᴀ ᴏᴜ ᴏ ʀᴇsᴜʟᴛᴀᴅᴏ )`
  return `- ${game.emoji} \`${game.titulo}\`\n\n> ${game.emoji} ׄ ( ${game.pergunta} )\n\n${linhas}\n\n> ⏱️ ׄ ( ᴛᴇᴍᴘᴏ: 30 sᴇɢᴜɴᴅᴏs )\n> 💬 ׄ ( ʀᴇsᴘᴏɴᴅᴀ 1, 2, 3, 4 ᴏᴜ ᴀ ʀᴇsᴘᴏsᴛᴀ )`
}

function textoAcertou(game, sender) {
  const tempo = ((Date.now() - game.iniciadoEm) / 1000).toFixed(1)
  return `- 🏆 \`${game.titulo}\`\n\n> 👤 ׄ ( ʀᴇsᴘᴏɴᴅᴇᴜ: ${base.mention(sender)} )\n> ✅ ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ʀᴇsᴘᴏsᴛᴀ ᴄᴏʀʀᴇᴛᴀ )\n> 🎯 ׄ ( ᴄᴏʀʀᴇᴛᴀ: ${game.correta} — ${game.resposta} )\n> ⏱️ ׄ ( ʀᴇsᴘᴏɴᴅᴇᴜ ᴇᴍ: ${tempo}s )`
}

function textoTempo(game) {
  return `- ⏰ \`${game.titulo}\`\n\n> ❌ ׄ ( ɴɪɴɢᴜᴇ́ᴍ ᴀᴄᴇʀᴛᴏᴜ ᴀ ᴛᴇᴍᴘᴏ )\n> 🎯 ׄ ( ʀᴇsᴘᴏsᴛᴀ: ${game.resposta} )`
}

async function expirar(ctx, id) {
  const atual = base.getGame(arquivo, ctx.from)
  if (!atual || atual.id !== id) return
  removeGame(ctx.from)
  await base.sendText(ctx, textoTempo(atual)).catch(() => {})
}

function agendar(ctx, game) {
  const antigo = timers.get(game.grupo)
  if (antigo) clearTimeout(antigo)
  const timer = setTimeout(() => expirar(ctx, game.id), Math.max(0, game.expiraEm - Date.now()))
  timer.unref?.()
  timers.set(game.grupo, timer)
}

async function enviarPergunta(ctx, game) {
  const texto = textoPergunta(game)

  if (!game.imagem)
    return base.sendText(ctx, texto)

  try {
    return await base.sendImage(ctx, game.imagem, texto)
  }
  catch (error) {
    if (game.tipo === 'pokemon')
      throw error

    console.log(`[QUIZ ${game.tipo.toUpperCase()}] Falha na capa; enviando somente texto:`, error?.message || error)
    return base.sendText(ctx, texto)
  }
}

async function iniciar(ctx, tipo) {
  const existente = getGame(ctx.from)
  if (existente) return { ok: false, motivo: 'andamento', game: existente }

  const game = criarGame(ctx.from, tipo)
  if (!game) return { ok: false, motivo: 'vazio' }

  await base.reactMsg(ctx, game.emoji)

  try {
    await enviarPergunta(ctx, game)
    saveGame(game)
    agendar(ctx, game)
    return { ok: true, game }
  }
  catch (error) {
    removeGame(ctx.from)
    throw error
  }
}

function interpretar(game, texto) {
  const bruto = String(texto || '').trim()
  const n = bruto.match(/^(?:op(?:c|ç)[aã]o\s*)?([1-4])$/i)
  if (n) return Number(n[1])
  const letra = bruto.match(/^[abcd]$/i)
  if (letra) return 'abcd'.indexOf(letra[0].toLowerCase()) + 1
  const idx = game.opcoes.findIndex(x => norm(x) === norm(bruto))
  if (idx >= 0) return idx + 1
  if (game.tipo === 'calculadora' && /^-?\d+(?:[.,]\d+)?$/.test(bruto))
    return norm(bruto.replace(',', '.')) === norm(game.resposta) ? game.correta : -1
  return 0
}

async function auto(ctx) {
  const game = getGame(ctx.from)
  if (!game) return false
  const resposta = interpretar(game, base.getBody(ctx))
  if (!resposta) return false
  if (resposta !== game.correta) {
    await base.reactMsg(ctx, '❌')
    return true
  }
  removeGame(ctx.from)
  await base.reactMsg(ctx, '🏆')
  await base.sendText(ctx, textoAcertou(game, ctx.sender), [ctx.sender])
  return true
}

module.exports = { getGame, removeGame, iniciar, auto }
