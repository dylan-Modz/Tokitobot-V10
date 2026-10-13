/*
 * TOKITO BOT V10 - Batalhas Pokémon interativas
 * Dylan Modz. Sessões persistidas separadamente do RPG.
 * Sem IA externa: narrador por eventos reais de cada rodada.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const r = require('./index')
const p = require('./pokemon-core')
const imagensEtapas = require('../../INFO_DADOS/LOGOS/links_batalha_pokemon.json')

const ARQUIVO = path.join(__dirname, '../../database/jogos/batalhas-pokemon.json')
const CONVITE = 60 * 1000
const TURNO = 45 * 1000
const COOLDOWN = 10 * 60 * 1000
const MAX_TURNOS = 32
const sessoes = new Map()
const relogios = new Map()

try {
  const banco = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'))
  for (const [grupo, sessao] of Object.entries(banco || {}))
    if (sessao && typeof sessao === 'object' && sessao.fim > Date.now())
      sessoes.set(grupo, sessao)
} catch {}

const salvar = () => {
  try {
    fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true })
    const temp = ARQUIVO + '.tmp'
    fs.writeFileSync(temp, JSON.stringify(Object.fromEntries(sessoes), null, 2) + '\n')
    fs.renameSync(temp, ARQUIVO)
  } catch (e) {
    console.log('[POKEMON BATALHA SAVE]', e.message)
  }
}
const id = jid => String(jid || '').trim().toLowerCase()
const normal = (ctx, jid) => id(ctx.normalizar ? ctx.normalizar(jid) : jid)
const sorte = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const aleatorio = lista => lista[Math.floor(Math.random() * lista.length)]
const limite = (v, min, max) => Math.max(min, Math.min(max, Number(v) || 0))
const nome = j => '@' + String(j || '').split('@')[0].replace(/\D/g, '')
const arred = v => Math.round(Number(v) || 0)
const chave = ctx => String(ctx.from || '')
const dono = (ctx, jid) => {
  const num = String(jid || '').split('@')[0].replace(/\D/g, '')
  const d = String(ctx.ownerNumber || ctx.nmrdn || '').replace(/\D/g, '')
  return Boolean(num.length >= 10 && num === d && !ctx.isSubBot)
}
const apelido = (ctx, sessao, lado) => {
  const j = lado === 0 ? sessao.a : sessao.b
  if (dono(ctx, j)) return 'Dylan'
  return sessao.nomes?.[lado] || nome(j)
}
const barra = hp => {
  const n = Math.round(limite(hp, 0, 100) / 10)
  return (hp > 50 ? '🟩' : hp > 20 ? '🟨' : '🟥').repeat(n) + '▫️'.repeat(10 - n)
}
// O mesmo formatador de resultados usado pelos outros comandos Pokémon.
const placa = (titulo, linhas, emoji = '⚔️') =>
  p.compacto(null, emoji, titulo, (linhas || []).filter(Boolean))
const secs = fim => Math.max(0, Math.ceil((Number(fim) - Date.now()) / 1000))
const marca = s => [s.a, s.b]
const ultimo = ctx => String(ctx.selo?.key?.id || '')

const imagem = lutador => {
  if (!lutador?.id) return ''
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' +
    encodeURIComponent(String(lutador.id)) + '.png'
}
// Capas temáticas para cinco momentos da batalha, com arte do Pokémon
// como reserva para links externos que eventualmente saiam do ar.
const capa = (fase, mon) => ({
  url: imagensEtapas[fase] || '',
  reserva: imagem(mon)
})
const urlsDaCapa = figura => [...new Set((typeof figura === 'string'
  ? [figura]
  : [figura?.url, figura?.reserva]).filter(url => typeof url === 'string' && /^https?:\/\//.test(url)))]

// Mesmo protocolo de botões quick_reply usado pelo comando play.
async function enviar(ctx, mensagem, botoes = [], figura = '', mencoes = []) {
  const para = chave(ctx)
  const imagens = urlsDaCapa(figura)
  const citados = [...new Set(mencoes.filter(Boolean))]
  const info = typeof ctx.canalInfo === 'function'
    ? ctx.canalInfo(citados)
    : { mentionedJid: citados }

  if (botoes.length) {
    // Botões da batalha são indispensáveis: não dependem de isBotoes.
    // Nunca transformar IDs de quick_reply em linhas de texto.
    const i = ctx.proto?.Message?.InteractiveMessage
    if (i && typeof ctx.generateWAMessageFromContent === 'function' &&
        typeof ctx.tokito?.relayMessage === 'function') {
      const opcoes = botoes.map(b => ({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: String(b.texto),
          id: String(b.id)
        })
      }))
      let header
      if (typeof ctx.prepareWAMessageMedia === 'function') {
        for (const url of imagens) {
          try {
            const media = await ctx.prepareWAMessageMedia(
              { image: { url } },
              { upload: ctx.tokito.waUploadToServer }
            )
            if (media?.imageMessage) {
              header = i.Header.create({
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
              })
              break
            }
          } catch (e) {
            console.log('[POKEMON IMAGEM]', e.message)
          }
        }
      }
      // Primeiro tenta com a imagem; caso o WhatsApp não aceite,
      // reenvia somente o painel com botões, igual ao play.
      for (const media of (header ? [header, null] : [null])) {
        try {
          const dados = {
            contextInfo: info,
            body: i.Body.create({ text: mensagem }),
            footer: i.Footer.create({ text: '' }),
            nativeFlowMessage: i.NativeFlowMessage.create({ buttons: opcoes })
          }
          if (media) dados.header = media
          const msg = ctx.generateWAMessageFromContent(
            para,
            { interactiveMessage: i.create(dados) },
            { quoted: ctx.selo, userJid: ctx.tokito.user.id }
          )
          await ctx.tokito.relayMessage(para, msg.message, { messageId: msg.key.id })
          return true
        } catch (e) {
          console.log('[POKEMON BOTÕES NATIVOS]', e.message)
        }
      }
    }

    // Compatibilidade: se o cliente rejeitar NativeFlow, ainda tentamos
    // botões reais pelo sendMessage, sem mostrar comandos como texto.
    try {
      const classic = botoes.length <= 3
      if (classic) {
        await ctx.tokito.sendMessage(para, {
          text: mensagem,
          footer: '',
          buttons: botoes.map(b => ({
            buttonId: String(b.id),
            buttonText: { displayText: String(b.texto) },
            type: 1
          })),
          headerType: 1,
          mentions: citados,
          contextInfo: info
        }, { quoted: ctx.selo })
        return true
      }
    } catch (e) {
      console.log('[POKEMON BOTÕES CLÁSSICOS]', e.message)
    }

    // Não enviamos convite sem botões, nem comandos expostos na legenda.
    throw new Error('O WhatsApp não aceitou os botões da batalha Pokémon.')
  }

  for (const url of imagens) {
    try {
      return await ctx.tokito.sendMessage(para, {
        image: { url }, caption: mensagem,
        mentions: citados, contextInfo: info
      }, { quoted: ctx.selo })
    } catch {}
  }
  return ctx.tokito.sendMessage(para, {
    text: mensagem, mentions: citados, contextInfo: info
  }, { quoted: ctx.selo })
}

function expirar(ctx, sessao, aviso = true) {
  if (!sessao || sessao.fim > Date.now()) return false
  const grupo = chave(ctx)
  if (sessoes.get(grupo)?.id !== sessao.id) return false
  remover(grupo)
  const titulo = sessao.fase === 'convite' ? 'DESAFIO EXPIRADO' : 'BATALHA ENCERRADA'
  const texto = sessao.fase === 'convite'
    ? 'O treinador não aceitou em 60 segundos. Desafio cancelado!'
    : 'Um treinador não jogou em 45 segundos. Luta cancelada sem prêmio nem cooldown.'
  if (aviso) ctx.tokito.sendMessage(grupo, { text: placa(titulo, ['⏰ ' + texto]) }).catch(() => {})
  return true
}

function remover(grupo) {
  const timer = relogios.get(grupo)
  if (timer) clearTimeout(timer)
  relogios.delete(grupo)
  sessoes.delete(grupo)
  salvar()
}
function agendar(ctx, sessao) {
  const grupo = chave(ctx)
  if (relogios.has(grupo)) clearTimeout(relogios.get(grupo))
  if (!sessao) { relogios.delete(grupo); return }
  const tempo = Math.max(5, sessao.fim - Date.now() + 20)
  const timer = setTimeout(() => {
    relogios.delete(grupo)
    const atual = sessoes.get(grupo)
    if (atual?.id === sessao.id && atual?.fim === sessao.fim) expirar(ctx, atual)
  }, tempo)
  timer.unref?.()
  relogios.set(grupo, timer)
}
function atual(ctx, { avisar = true } = {}) {
  const s = sessoes.get(chave(ctx)) || null
  if (!s) return null
  if (expirar(ctx, s, avisar)) return null
  return s
}

function lutador(ctx, jid) {
  const st = p.principal(ctx, jid)
  if (!st?.pokemon) return null
  const mon = st.pokemon
  const sp = p.especie(mon.id) || p.especie(mon.tipo)
  return {
    uid: mon.uid, id: Number(mon.id), nome: mon.apelido || mon.nome || sp?.name || 'Pokémon',
    tipo: p.tipos(sp)[0] || 'Normal',
    tipos: p.tipos(sp), stats: mon.stats || {}, nivel: Number(mon.nivel || 1),
    afeto: Number(mon.afeto || 0), shiny: mon.shiny === true,
    forma: mon.forma, formaAte: mon.formaAte,
    hp: 100, defesa: false, especial: 3, curas: 0
  }
}
const ataqueEspecial = mon => {
  const tipo = mon.tipo || 'Normal'
  const golpes = p.GOLPES[tipo] || p.GOLPES.Normal
  return golpes?.[golpes.length - 1] || 'Golpe Especial'
}
const dadosTurno = s => {
  const lutador = s.pokemon[s.vez]
  const outro = s.pokemon[1 - s.vez]
  return { lutador, outro }
}
function quadro(s) {
  return [
    '🔴 ' + s.pokemon[0].nome + ' • ' + nome(s.a) + ' — *' + arred(s.pokemon[0].hp) + '/100 HP*',
    '🔋 HP ' + barra(s.pokemon[0].hp),
    '🔵 ' + s.pokemon[1].nome + ' • ' + nome(s.b) + ' — *' + arred(s.pokemon[1].hp) + '/100 HP*',
    '🔋 HP ' + barra(s.pokemon[1].hp)
  ]
}
function botoesDaVez(ctx, s) {
  const m = s.pokemon[s.vez]
  const prefix = ctx.prefix || '!'
  const base = prefix + 'batalhapokemon '
  return [
    { texto: '🌩️ ' + ataqueEspecial(m).slice(0, 19), id: base + 'especial ' + s.id + ' ' + s.jogadas },
    { texto: '⚔️ Ataque', id: base + 'ataque ' + s.id + ' ' + s.jogadas },
    { texto: '🛡️ Defender', id: base + 'defender ' + s.id + ' ' + s.jogadas },
    { texto: '🧪 Poção', id: base + 'pocao ' + s.id + ' ' + s.jogadas }
  ]
}
async function turno(ctx, s) {
  const m = s.pokemon[s.vez]
  const meu = s.vez === 0 ? s.a : s.b
  const st = p.estado(ctx, meu).st
  const pocao = Number(st.itens?.pocao || 0)
  const linha = s.historico?.length ? '📖 Última ação: ' + s.historico[s.historico.length - 1] : ''
  const texto = placa('Batalha Pokémon • Rodada ' + s.rodada, [
    ...quadro(s),
    '🎯 Vez de ' + nome(meu),
    '🌩️ Especial: ' + ataqueEspecial(m) + ' (' + m.especial + '/3)',
    '🧪 Poções: ' + pocao,
    '⏳ Tempo: ' + secs(s.fim) + ' segundos',
    linha,
    '📌 Escolha um dos quatro botões abaixo'
  ])
  return enviar(ctx, texto, botoesDaVez(ctx, s), capa('turnos', m), marca(s))
}

async function desafiar(ctx, alvo) {
  if (!ctx.isGroup) return ctx.reply(ctx.mess?.sogrupo?.() || 'Esse comando só funciona em grupos.')
  if (!r.ambos(ctx)) return ctx.reply(ctx.mess?.rpgCoinsDesativado?.(ctx.prefix) || 'Ative RPG e Coins no grupo.')
  const grupo = chave(ctx)
  if (atual(ctx)) return ctx.reply('⚠️ Já existe um desafio ou batalha Pokémon acontecendo neste grupo. Termine essa primeiro.')
  const a = normal(ctx, ctx.sender), b = normal(ctx, alvo)
  if (!b || b === a) return ctx.reply('⚔️ Marque outra pessoa! Exemplo: ' + (ctx.prefix || '!') + 'batalhapokemon @usuario')
  const pA = lutador(ctx, a), pB = lutador(ctx, b)
  if (!pA || !pB) return ctx.reply(p.compacto(ctx, '⚠️', 'Batalha Pokémon', [
    { emoji: '📌', texto: !pA ? 'Você precisa ter um Pokémon principal.' : 'O adversário precisa ter um Pokémon principal.' }
  ]))
  const uA = r.user(ctx, a), uB = r.user(ctx, b)
  for (const u of [uA, uB]) {
    const falta = COOLDOWN - (Date.now() - Number(u.pokemon?.ultimaBatalha || 0))
    if (falta > 0) return ctx.reply('⏳ Um dos treinadores está em descanso. Aguarde ' + Math.ceil(falta / 60000) + ' minuto(s).')
  }
  const sessao = {
    id: crypto.randomBytes(5).toString('hex'), grupo, fase: 'convite',
    a, b, nomes: [String(ctx.pushname || 'Treinador').slice(0, 30), nome(b)],
    pokemon: [pA, pB], vez: 0, rodada: 1, jogadas: 0,
    historico: [], fim: Date.now() + CONVITE
  }
  sessoes.set(grupo, sessao); salvar(); agendar(ctx, sessao)
  const prefix = ctx.prefix || '!'
  try {
    return await enviar(ctx, placa('Desafio Pokémon', [
    '🎯 ' + nome(a) + ' desafiou ' + nome(b) + '!',
    '🔴 ' + pA.nome + ' vs 🔵 ' + pB.nome,
    '⏳ O adversário tem *60 segundos* para aceitar ou recusar.',
    '💬 A luta não começa sem a confirmação do desafiado.',
    '📌 Apenas ' + nome(b) + ' pode responder.'
  ]), [
    { texto: '✅ Aceitar', id: prefix + 'batalhapokemon aceitar ' + sessao.id },
    { texto: '❌ Recusar', id: prefix + 'batalhapokemon recusar ' + sessao.id }
  ], capa('desafio', pA), [a, b])
  } catch (erro) {
    remover(grupo)
    console.log('[POKEMON DESAFIO]', erro.message)
    return ctx.reply('⚠️ Não consegui enviar os botões do desafio Pokémon. Verifique a compatibilidade do WhatsApp.')
  }
}

async function aceitar(ctx, s) {
  const quem = normal(ctx, ctx.sender)
  if (quem !== s.b) return ctx.reply('⚠️ Só o treinador desafiado pode aceitar ou recusar.')
  // Revalida os Pokémon no início, evitando uma batalha com Pokémon excluído.
  const a = lutador(ctx, s.a), b = lutador(ctx, s.b)
  if (!a || !b || a.uid !== s.pokemon[0].uid || b.uid !== s.pokemon[1].uid) {
    remover(chave(ctx))
    return ctx.reply('⚠️ Um dos Pokémon principais mudou. Desafio cancelado; façam outro.')
  }
  s.fase = 'luta';s.pokemon = [a,b];s.vez = Number(a.stats?.velocidade || 0) >= Number(b.stats?.velocidade || 0) ? 0 : 1
  s.fim = Date.now() + TURNO
  salvar(); agendar(ctx, s)
  await enviar(ctx, placa('Batalha Pokémon iniciada', [
    '🔥 ' + nome(s.b) + ' aceitou o desafio de ' + nome(s.a) + '!',
    '🔴 ' + a.nome + ' vs 🔵 ' + b.nome,
    '⚡ O Pokémon mais veloz começa.',
    '🎙️ TOKITO: "EITA PORRA, AGORA VAI! Quem vai cair primeiro, hein?!"',
    '🛡️ Cada jogador escolhe suas ações nos botões; HP e ataques aparecem por rodada.'
  ]), [], capa('turnos', b), marca(s))
  return turno(ctx, s)
}

function narracao(s, evento) {
  const x = s.pokemon[0], y = s.pokemon[1]
  const perdendo = [x, y].find(m => m.hp <= 20 && m.hp > 0)
  const treinador = s.nomes?.[s.vez] || 'meu parceiro'
  if (x.hp <= 35 && y.hp <= 35 && x.hp > 0 && y.hp > 0) return '🎙️ TOKITO: "CARALHO, ' + treinador.toUpperCase() + '! O ' + y.nome.toUpperCase() + ' TÁ COM ' + arred(y.hp) + ' DE VIDA, SEU MALUCO! MAS OLHA TEU ' + x.nome.toUpperCase() + ' TAMBÉM! NÃO VAI FAZER MERDA AGORA, HEIN?!"'
  if (evento.virada) return '🎙️ TOKITO: "NÃO É POSSÍVEL, CARALHO! ' + evento.nome.toUpperCase() + ' TAVA QUASE DE ARRASTA E VIROU ESSA PORRA! QUE LUTA!"'
  if (evento.derrota) return '🎙️ TOKITO: "CARALHOOOO! ' + evento.nome.toUpperCase() + ' ACERTOU O GOLPE FINAL! ACABOU, MEUS PARCEIROS!"'
  if (perdendo) return aleatorio([
    '🎙️ TOKITO: "EITA PORRA! O ' + perdendo.nome.toUpperCase() + ' TÁ COM SÓ ' + arred(perdendo.hp) + ' DE VIDA! SERÁ QUE AINDA CONSEGUE VIRAR?"',
    '🎙️ TOKITO: "RAPAZ, O ' + perdendo.nome.toUpperCase() + ' TÁ QUASE INDO DE ARRASTA! NÃO VACILA AGORA, HEIN?!"',
    '🎙️ TOKITO: "CARALHO, QUE SUSPENSE! TÁ TODO MUNDO POR UM FIO, SEUS MALUCOS!"'
  ])
  if (evento.critico) return '🎙️ TOKITO: "EITA CARALHO! CRÍTICO NA CARA! ISSO AÍ FOI PRA MACHUCAR, HEIN!"'
  if (evento.errou) return '🎙️ TOKITO: "KKKKKK, TU ERROU O GOLPE! O ADVERSÁRIO TÁ ATÉ RINDO!"'
  return aleatorio([
    '🎙️ TOKITO: "OLHA ESSA TROCA DE GOLPES! ESSE GRUPO VIROU UMA ARENA, PORRA!"',
    '🎙️ TOKITO: "A LUTA TÁ PEGANDO FOGO! VAMOS VER QUEM CONSEGUE AGUENTAR!"',
    '🎙️ TOKITO: "MANO, NÃO DÁ PRA PISCAR! A PRÓXIMA JOGADA PODE DECIDIR TUDO!"'
  ])
}

function finalizar(ctx, s, ladoVencedor, porLimite = false) {
  const grupo = chave(ctx)
  // Remove antes de creditar recompensa: não há duas premiações para a mesma sessão.
  remover(grupo)
  const a = s.pokemon[ladoVencedor], b = s.pokemon[1 - ladoVencedor]
  const vencedor = ladoVencedor === 0 ? s.a : s.b
  const perdedor = ladoVencedor === 0 ? s.b : s.a
  const dados = [[vencedor, a, true], [perdedor, b, false]]
  for (const [jid, mon, ganhou] of dados) {
    const st = p.estado(ctx, jid)
    const instancia = st.st.colecao.find(m => m.uid === mon.uid)
    if (instancia) {
      instancia.xp = Number(instancia.xp || 0) + (ganhou ? 70 : 30)
      instancia.nivel = 1 + Math.floor(instancia.xp / 100)
      instancia.hp = Math.max(1, arred(mon.hp))
      instancia.vitorias = Number(instancia.vitorias || 0) + (ganhou ? 1 : 0)
      instancia.derrotas = Number(instancia.derrotas || 0) + (ganhou ? 0 : 1)
      p.sincronizarLegacy(st.u, st.st)
    }
    st.u.pokemon ||= {}
    st.u.pokemon.ultimaBatalha = Date.now()
  }
  r.eco(ctx, vencedor).coins = Number(r.eco(ctx, vencedor).coins || 0) + 600
  r.salvar(ctx)
  return {
    texto: p.compacto(ctx, '⚔️', 'Batalha Pokémon', [
      { emoji: '🔴', texto: s.pokemon[0].nome + ' x ' + s.pokemon[1].nome },
      { emoji: '🏆', texto: 'Vencedor: ' + a.nome + ' • ' + nome(vencedor) },
      { emoji: '💔', texto: 'Derrotado: ' + b.nome + ' • ' + nome(perdedor) },
      { emoji: '❤️', texto: 'HP restante: ' + arred(a.hp) + '/100' },
      { emoji: '🧠', texto: '+70 XP para o vencedor • +30 XP para o perdedor' },
      { emoji: '🪙', texto: '+600 N-Coins para o vencedor' },
      porLimite ? { emoji: '⏳', texto: 'Limite de rodadas: maior HP venceu' } : null,
      { emoji: '🎙️', texto: 'Tokito: "QUE BATALHA, PORRA! A LUTA FOI INSANA! QUERO VER A REVANCHE!"' },
      { emoji: '🔒', texto: 'Novo desafio após 10 minutos' }
    ]),
    figura: imagem(a),
    mencoes: [vencedor, perdedor]
  }
}

async function acao(ctx, s, acao) {
  const jid = normal(ctx, ctx.sender)
  const esperado = s.vez === 0 ? s.a : s.b
  if (jid !== esperado) return ctx.reply('⌛ Não é tua vez, criatura! Espera ' + nome(esperado) + ' escolher a ação.')
  const { lutador: atk, outro: def } = dadosTurno(s)
  const ato = String(acao || '').toLowerCase()
  const permitidos = ['especial','ataque','defender','pocao','desistir']
  if (!permitidos.includes(ato)) return ctx.reply('⚠️ Escolhe um botão de ataque, defender ou poção.')
  let descricao = ''
  const evento = { nome: atk.nome, critico: false, errou: false, virada: false, derrota: false }
  if (ato === 'desistir') {
    const fim = finalizar(ctx, s, 1 - s.vez)
    fim.texto += '\n> 🏳️ ' + nome(jid) + ' desistiu da luta.'
    return enviar(ctx, fim.texto, [], fim.figura, fim.mencoes)
  }
  if (ato === 'pocao') {
    const dono = p.estado(ctx, jid)
    if (atk.hp >= 100) return ctx.reply('🧪 Seu Pokémon já está com HP cheio.')
    if (Number(dono.st.itens?.pocao || 0) < 1) return ctx.reply('🧪 Você não tem poção! Compre no mercado Pokémon.')
    dono.st.itens.pocao--
    const antes = atk.hp
    atk.hp = limite(atk.hp + 30, 0, 100)
    r.salvar(ctx)
    descricao = '🧪 ' + atk.nome + ' usou Poção: recuperou +' + arred(atk.hp - antes) + ' HP.'
  } else if (ato === 'defender') {
    atk.defesa = true
    descricao = '🛡️ ' + atk.nome + ' se protegeu! Próximo ataque recebido terá dano reduzido.'
  } else {
    if (ato === 'especial' && atk.especial <= 0) return ctx.reply('⚡ Acabaram os golpes especiais desta luta! Escolha Ataque.')
    if (ato === 'especial') atk.especial--
    const sucesso = Math.random() < (ato === 'especial' ? 0.82 : 0.96)
    if (!sucesso) {
      descricao = '💨 ' + atk.nome + ' tentou ' + (ato === 'especial' ? ataqueEspecial(atk) : 'Ataque') + ', mas ERROU!'
      evento.errou = true
    } else {
      const poder = p.poderPokemon(atk)
      const resistencia = p.poderPokemon(def)
      let dano = limite(Math.round(poder * 0.115 - resistencia * 0.035 + sorte(6, 12)), 7, 35)
      if (ato === 'especial') dano = Math.round(dano * 1.45)
      const vantagem = (p.VANTAGENS[atk.tipo] || []).some(t => def.tipos.includes(t))
      if (vantagem) dano = Math.round(dano * 1.5)
      evento.critico = Math.random() < 0.12
      if (evento.critico) dano = Math.round(dano * 1.5)
      if (def.defesa) { dano = Math.max(2, Math.round(dano * 0.45)); def.defesa = false }
      evento.virada = atk.hp <= 25 && Math.random() < 0.17
      if (evento.virada) dano = Math.round(dano * 1.4)
      dano = limite(dano, 2, 62)
      def.hp = Math.max(0, arred(def.hp - dano))
      evento.derrota = def.hp <= 0
      descricao = '⚡ ' + atk.nome + ' usou *' + (ato === 'especial' ? ataqueEspecial(atk) : 'Ataque') + '* e causou *-' + dano + ' HP*!' +
        (vantagem ? ' 🔥 Super efetivo!' : '') + (evento.critico ? ' 💥 CRÍTICO!' : '') +
        (evento.virada ? ' 🌪️ VIRADA ÉPICA!' : '')
    }
  }
  s.historico.push(descricao.replace(/\*/g, ''))
  if (s.historico.length > 8) s.historico.shift()
  s.jogadas++
  const relato = placa('Batalha Pokémon • Rodada ' + s.rodada, [
    descricao, ...quadro(s), narracao(s, evento)
  ])
  const foto = capa(evento.virada ? 'virada' : ato === 'especial' ? 'golpes' : 'narracao', atk)
  if (evento.derrota || s.jogadas >= MAX_TURNOS) {
    const venceu = evento.derrota ? s.vez : (s.pokemon[0].hp >= s.pokemon[1].hp ? 0 : 1)
    const fim = finalizar(ctx, s, venceu, !evento.derrota)
    await enviar(ctx, relato, [], foto, marca(s))
    return enviar(ctx, fim.texto, [], fim.figura, fim.mencoes)
  }
  s.vez = 1 - s.vez
  if (s.vez === 0) s.rodada++
  s.fim = Date.now() + TURNO
  salvar(); agendar(ctx, s)
  await enviar(ctx, relato, [], foto, marca(s))
  return turno(ctx, s)
}

async function executar(ctx) {
  if (!ctx.isGroup) return ctx.reply(ctx.mess?.sogrupo?.() || 'Só em grupos.')
  if (!r.ambos(ctx)) return ctx.reply(ctx.mess?.rpgCoinsDesativado?.(ctx.prefix) || 'Ative RPG e Coins primeiro.')
  const [primeiro = '', codigo = '', turnoBotao = ''] = ctx.args || []
  const comando = String(primeiro).toLowerCase()
  const acoes = ['aceitar','recusar','especial','ataque','defender','pocao','desistir']
  const s = atual(ctx)
  if (acoes.includes(comando)) {
    if (!s || codigo !== s.id) return ctx.reply('⌛ Esse botão expirou ou pertence a outra batalha. Comecem um novo desafio.')
    const quem = normal(ctx, ctx.sender)
    if (quem !== s.a && quem !== s.b) return ctx.reply('⚠️ Apenas os dois treinadores podem participar desta batalha.')
    if (comando === 'aceitar' || comando === 'recusar') {
      if (s.fase !== 'convite') return ctx.reply('⚠️ Esse desafio já começou.')
      if (quem !== s.b) return ctx.reply('⚠️ Só o adversário pode aceitar ou recusar.')
      if (comando === 'recusar') {
        remover(chave(ctx))
        return enviar(ctx, placa('Desafio Pokémon recusado', ['❌ ' + nome(s.b) + ' recusou a batalha.', '⏳ Nenhum cooldown foi aplicado.']), [], imagem(s.pokemon[1]), marca(s))
      }
      return aceitar(ctx, s)
    }
    if (s.fase !== 'luta') return ctx.reply('⌛ A batalha ainda não começou; aguardem a confirmação.')
    if (String(s.jogadas) !== String(turnoBotao))
      return ctx.reply('⌛ Esse botão é de uma rodada antiga! Use os botões da rodada atual.')
    return acao(ctx, s, comando)
  }
  if (comando === 'status') {
    if (!s) return ctx.reply('⚔️ Não há batalha ativa neste grupo. Use ' + (ctx.prefix || '!') + 'batalhapokemon @usuario.')
    agendar(ctx, s) // retoma o relógio também depois de reiniciar o bot
    if (s.fase === 'luta') return turno(ctx, s)
    return enviar(ctx, placa('BATALHA POKÉMON • STATUS', [
      ...quadro(s), '⏳ Aguardando ' + nome(s.b) + ' aceitar.',
      '⌛ Tempo restante: ' + secs(s.fim) + 's'
    ]), [
      {texto:'✅ Aceitar',id:(ctx.prefix || '!')+'batalhapokemon aceitar '+s.id},
      {texto:'❌ Recusar',id:(ctx.prefix || '!')+'batalhapokemon recusar '+s.id}
    ], imagem(s.pokemon[1]), marca(s))
  }
  const destino = await ctx.destino?.().catch(() => null)
  const jid = destino?.mencao || ctx.menc_jid2?.[0] || ctx.quotedParticipant
  if (!jid) return ctx.reply(placa('BATALHA POKÉMON', [
    '📌 Use ' + (ctx.prefix || '!') + 'batalhapokemon @usuario',
    '✅ O adversário tem 60 segundos para aceitar.',
    '⚡ Turnos de 45 segundos com botões de golpes, defesa e poção.',
    '📖 Para conferir a luta: ' + (ctx.prefix || '!') + 'batalhapokemon status'
  ]))
  return desafiar(ctx, jid)
}

module.exports = { executar, atual, expirar, enviar, quadro, ataqueEspecial, _estado: sessoes }
