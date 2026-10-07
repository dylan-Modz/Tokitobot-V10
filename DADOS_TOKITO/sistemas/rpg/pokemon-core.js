const r = require('./index')
const db = require('../../database/jogos/pokemon.json')
const { compacto, dinheiro, enviarComImagem } = require('./texto')

const norm = valor => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const agora = () => Date.now()
const sorte = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const escolha = lista => lista[Math.floor(Math.random() * lista.length)]
const clamp = (v, min, max) => Math.max(min, Math.min(max, Number(v || 0)))

const porId = new Map(db.map(p => [Number(p.id), p]))
const porNome = new Map(db.map(p => [norm(p.name), p]))

const BOLAS = {
  pokeball: { nome: 'Poké Ball', emoji: '🔴', preco: 300, mult: 1 },
  greatball: { nome: 'Great Ball', emoji: '🔵', preco: 800, mult: 1.5 },
  ultraball: { nome: 'Ultra Ball', emoji: '🟡', preco: 1500, mult: 2.2 },
  masterball: { nome: 'Master Ball', emoji: '🟣', preco: 50000, mult: 999 },
  safariball: { nome: 'Safari Ball', emoji: '🟢', preco: 0, mult: 1.3 }
}

const ITENS = {
  pocao: { nome: 'Poção', emoji: '🧪', preco: 500 },
  superpocao: { nome: 'Super Poção', emoji: '💊', preco: 1200 },
  revive: { nome: 'Revive', emoji: '✨', preco: 1800 },
  incenso: { nome: 'Incenso', emoji: '🪔', preco: 2500 },
  lure: { nome: 'Lure', emoji: '🧲', preco: 4000 },
  megapedra: { nome: 'Mega Pedra', emoji: '💎', preco: 12000 },
  dynamaxband: { nome: 'Dynamax Band', emoji: '🔴', preco: 14000 },
  teraorb: { nome: 'Tera Orb', emoji: '🔮', preco: 16000 },
  tmnormal: { nome: 'TM Normal', emoji: '💿', preco: 1800, tipo: 'Normal' },
  tmfogo: { nome: 'TM Fogo', emoji: '💿', preco: 2200, tipo: 'Fogo' },
  tmagua: { nome: 'TM Água', emoji: '💿', preco: 2200, tipo: 'Água' },
  tmplanta: { nome: 'TM Planta', emoji: '💿', preco: 2200, tipo: 'Planta' },
  tmeletrico: { nome: 'TM Elétrico', emoji: '💿', preco: 2200, tipo: 'Elétrico' },
  tmpsiquico: { nome: 'TM Psíquico', emoji: '💿', preco: 2600, tipo: 'Psíquico' }
}

const GOLPES = {
  Normal: ['Investida', 'Ataque Rápido', 'Golpe de Corpo', 'Hiper Raio'],
  Fogo: ['Brasa', 'Lança-Chamas', 'Giro de Fogo', 'Explosão de Fogo'],
  Água: ['Jato de Água', 'Bolhas', 'Surf', 'Hidro Bomba'],
  Planta: ['Chicote de Vinha', 'Folha Navalha', 'Mega Dreno', 'Raio Solar'],
  Elétrico: ['Choque do Trovão', 'Faísca', 'Raio', 'Trovão'],
  Psíquico: ['Confusão', 'Psybeam', 'Psíquico', 'Visão do Futuro'],
  Fantasma: ['Lambida', 'Sombra Noturna', 'Bola Sombria', 'Pesadelo'],
  Lutador: ['Chute Baixo', 'Soco Karate', 'Quebra-Telha', 'Combate Corpo a Corpo'],
  Voador: ['Ataque de Asa', 'Ás dos Ares', 'Furacão', 'Pássaro Bravo'],
  Veneno: ['Picada Venenosa', 'Ácido', 'Bomba de Lodo', 'Onda Tóxica'],
  Terra: ['Tapa de Lama', 'Magnitude', 'Escavação', 'Terremoto'],
  Pedra: ['Arremesso de Pedra', 'Tumba de Pedra', 'Deslizamento de Pedras', 'Gume de Pedra'],
  Gelo: ['Neve em Pó', 'Vento Gelado', 'Raio de Gelo', 'Nevasca'],
  Inseto: ['Picada', 'Cortador de Fúria', 'Tesoura X', 'Zumbido de Inseto'],
  Dragão: ['Fúria do Dragão', 'Sopro do Dragão', 'Garra de Dragão', 'Pulso do Dragão'],
  Sombrio: ['Mordida', 'Finta', 'Pulso Sombrio', 'Triturar'],
  Aço: ['Garra de Metal', 'Cabeça de Ferro', 'Canhão de Flash', 'Cauda de Ferro'],
  Fada: ['Vento de Fada', 'Beijo Drenante', 'Brilho Mágico', 'Explosão Lunar']
}

const NATUREZAS = ['Audaz','Calma','Dócil','Firme','Gentil','Ingênua','Modesta','Ousada','Séria','Tímida']
const GINASIOS = [
  { nome: 'Brock', insignia: 'Pedra', poder: 85 },
  { nome: 'Misty', insignia: 'Cascata', poder: 110 },
  { nome: 'Lt. Surge', insignia: 'Trovão', poder: 140 },
  { nome: 'Erika', insignia: 'Arco-Íris', poder: 175 },
  { nome: 'Koga', insignia: 'Alma', poder: 215 },
  { nome: 'Sabrina', insignia: 'Pântano', poder: 260 },
  { nome: 'Blaine', insignia: 'Vulcão', poder: 310 },
  { nome: 'Giovanni', insignia: 'Terra', poder: 370 }
]

const VANTAGENS = {
  Fogo: ['Planta','Gelo','Inseto','Aço'],
  Água: ['Fogo','Terra','Pedra'],
  Planta: ['Água','Terra','Pedra'],
  Elétrico: ['Água','Voador'],
  Gelo: ['Planta','Terra','Voador','Dragão'],
  Lutador: ['Normal','Gelo','Pedra','Sombrio','Aço'],
  Veneno: ['Planta','Fada'],
  Terra: ['Fogo','Elétrico','Veneno','Pedra','Aço'],
  Voador: ['Planta','Lutador','Inseto'],
  Psíquico: ['Lutador','Veneno'],
  Inseto: ['Planta','Psíquico','Sombrio'],
  Pedra: ['Fogo','Gelo','Voador','Inseto'],
  Fantasma: ['Psíquico','Fantasma'],
  Dragão: ['Dragão'],
  Sombrio: ['Psíquico','Fantasma'],
  Aço: ['Gelo','Pedra','Fada'],
  Fada: ['Lutador','Dragão','Sombrio']
}

function especie(ref) {
  const txt = String(ref || '').trim()
  if (/^\d+$/.test(txt)) return porId.get(Number(txt)) || null
  return porNome.get(norm(txt)) || null
}

function chaveEspecie(p) {
  return norm(p && p.name)
}

function imagem(ref) {
  const p = typeof ref === 'object' ? ref : especie(ref)
  return p && p.id
    ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + p.id + '.png'
    : ''
}

function tipos(p) {
  return Array.isArray(p && p.tipos) && p.tipos.length ? p.tipos : ['Normal']
}

function raridade(p) {
  return p && p.raridade ? p.raridade : (Number(p && p.capture) <= 3 ? 'Lendário' : Number(p && p.capture) <= 45 ? 'Raro' : 'Comum')
}

function golpesPadrao(p) {
  const t = tipos(p)[0]
  const pool = GOLPES[t] || GOLPES.Normal
  return pool.slice(0, 2)
}

function instancia(p, extra) {
  extra = extra || {}
  const s = p.stats || {}
  const nivel = Number(extra.nivel || sorte(2, 8))
  return {
    uid: String(extra.uid || (p.id + '-' + agora().toString(36) + '-' + Math.random().toString(36).slice(2, 6))),
    id: Number(p.id),
    tipo: chaveEspecie(p),
    nome: p.name,
    apelido: extra.apelido || null,
    shiny: extra.shiny === true,
    natureza: extra.natureza || escolha(NATUREZAS),
    nivel,
    xp: Number(extra.xp || 0),
    hp: clamp(extra.hp === undefined ? 100 : extra.hp, 0, 100),
    fome: clamp(extra.fome === undefined ? 100 : extra.fome, 0, 100),
    energia: clamp(extra.energia === undefined ? 100 : extra.energia, 0, 100),
    saude: clamp(extra.saude === undefined ? 100 : extra.saude, 0, 100),
    afeto: Number(extra.afeto || 0),
    stats: {
      hp: Number(s.hp || 60), ataque: Number(s.ataque || 60), defesa: Number(s.defesa || 60),
      ataqueEspecial: Number(s.ataqueEspecial || 60), defesaEspecial: Number(s.defesaEspecial || 60), velocidade: Number(s.velocidade || 60)
    },
    golpes: Array.isArray(extra.golpes) && extra.golpes.length ? extra.golpes.slice(0, 4) : golpesPadrao(p),
    favorito: extra.favorito === true,
    origem: extra.origem || 'captura',
    capturadoEm: Number(extra.capturadoEm || agora()),
    vitorias: Number(extra.vitorias || 0),
    derrotas: Number(extra.derrotas || 0),
    forma: extra.forma || null,
    formaAte: Number(extra.formaAte || 0),
    status: extra.status || null
  }
}

function padraoEstado() {
  return {
    colecao: [], principalUid: null, equipe: [], pokedex: { vistos: {}, capturados: {} },
    bolas: { pokeball: 5, greatball: 0, ultraball: 0, masterball: 0, safariball: 0 },
    itens: { pocao: 1, superpocao: 0, revive: 0, incenso: 0, lure: 0, megapedra: 0, dynamaxband: 0, teraorb: 0 },
    insignias: [], eliteVencida: false, campeao: false, regiao: 'Kanto',
    ovos: [], incubando: null, tituloAtivo: null, titulos: ['Treinador'],
    ultimoDaily: 0, streak: 0, ultimaExploracao: 0, ultimaExpedicao: 0, ultimoGinasio: 0,
    safariAte: 0, migradoLegacy: false
  }
}

function mundo(ctx) {
  const g = r.garantir(ctx)
  if (!g.rpg.pokemonMundo || typeof g.rpg.pokemonMundo !== 'object')
    g.rpg.pokemonMundo = { selvagem: null, ultimoSpawn: 0, lureAte: 0, trocas: [], leilao: null, raid: null }
  const m = g.rpg.pokemonMundo
  if (!Array.isArray(m.trocas)) m.trocas = []
  return m
}

function absorverLegacy(u, st) {
  if (!u.pokemon || !st.principalUid) return
  const p = st.colecao.find(x => x.uid === st.principalUid)
  if (!p) return
  for (const k of ['apelido','fome','energia','saude','xp','nivel','afeto','vitorias'])
    if (u.pokemon[k] !== undefined) p[k] = u.pokemon[k]
}

function sincronizarLegacy(u, st) {
  const p = st.colecao.find(x => x.uid === st.principalUid)
  if (!p) {
    u.pokemon = null
    return null
  }
  u.pokemon = Object.assign({}, u.pokemon || {}, {
    tipo: p.tipo, apelido: p.apelido, fome: p.fome, energia: p.energia, saude: p.saude,
    xp: p.xp, nivel: p.nivel, afeto: p.afeto, vitorias: p.vitorias,
    criadoEm: p.capturadoEm, ultimaComida: (u.pokemon && u.pokemon.ultimaComida) || agora(),
    ultimaMissao: (u.pokemon && u.pokemon.ultimaMissao) || 0
  })
  return p
}

function estado(ctx, jid) {
  const u = r.user(ctx, jid || ctx.sender)
  if (!u.pokemonRpg || typeof u.pokemonRpg !== 'object') u.pokemonRpg = padraoEstado()
  const st = u.pokemonRpg
  const pad = padraoEstado()
  for (const [k,v] of Object.entries(pad)) if (st[k] === undefined) st[k] = Array.isArray(v) ? [] : (v && typeof v === 'object' ? Object.assign({}, v) : v)
  if (!Array.isArray(st.colecao)) st.colecao = []
  if (!Array.isArray(st.equipe)) st.equipe = []
  if (!Array.isArray(st.insignias)) st.insignias = []
  if (!Array.isArray(st.ovos)) st.ovos = []
  st.pokedex = st.pokedex && typeof st.pokedex === 'object' ? st.pokedex : { vistos: {}, capturados: {} }
  st.pokedex.vistos = st.pokedex.vistos || {}
  st.pokedex.capturados = st.pokedex.capturados || {}
  st.bolas = Object.assign({}, pad.bolas, st.bolas || {})
  st.itens = Object.assign({}, pad.itens, st.itens || {})

  if (u.pokemon && !st.migradoLegacy) {
    const sp = especie(u.pokemon.tipo)
    if (sp) {
      const inst = instancia(sp, Object.assign({}, u.pokemon, { origem: 'legado' }))
      st.colecao.push(inst)
      st.principalUid = inst.uid
      st.equipe = [inst.uid]
      st.pokedex.vistos[sp.id] = agora()
      st.pokedex.capturados[sp.id] = agora()
    }
    st.migradoLegacy = true
  } else {
    absorverLegacy(u, st)
  }

  if (!st.principalUid && st.colecao.length) st.principalUid = st.colecao[0].uid
  st.equipe = st.equipe.filter(uid => st.colecao.some(p => p.uid === uid)).slice(0, 6)
  if (st.principalUid && !st.equipe.includes(st.principalUid)) st.equipe.unshift(st.principalUid)
  sincronizarLegacy(u, st)
  return { u, st }
}

function principal(ctx, jid) {
  const e = estado(ctx, jid)
  return { ...e, pokemon: e.st.colecao.find(x => x.uid === e.st.principalUid) || null }
}

function resolverDaColecao(st, ref) {
  const txt = String(ref || '').trim()
  if (!txt) return st.colecao.find(x => x.uid === st.principalUid) || null
  let x = st.colecao.find(p => p.uid === txt || p.uid.startsWith(txt))
  if (x) return x
  if (/^\d+$/.test(txt)) {
    const n = Number(txt)
    x = st.colecao[n - 1] || st.colecao.find(p => p.id === n)
    if (x) return x
  }
  return st.colecao.find(p => norm(p.nome) === norm(txt) || norm(p.apelido) === norm(txt)) || null
}

function marcar(st, p, capturado) {
  st.pokedex.vistos[p.id] = agora()
  if (capturado) st.pokedex.capturados[p.id] = agora()
}

function adicionar(ctx, p, extra, jid) {
  const e = estado(ctx, jid)
  const inst = instancia(p, extra)
  e.st.colecao.push(inst)
  marcar(e.st, p, true)
  if (!e.st.principalUid) e.st.principalUid = inst.uid
  if (e.st.equipe.length < 6 && !e.st.equipe.includes(inst.uid)) e.st.equipe.push(inst.uid)
  sincronizarLegacy(e.u, e.st)
  r.salvar(ctx)
  return inst
}

function peso(p) {
  const rr = raridade(p)
  if (rr === 'Lendário') return 1
  if (rr === 'Mítico') return 0.5
  if (rr === 'Raro') return 7
  if (rr === 'Evoluído') return 20
  return 55
}

function sortearEspecie(st, filtroTipo) {
  const maxId = st && st.regiao === 'Johto' ? 200 : 151
  const minId = st && st.regiao === 'Johto' ? 152 : 1
  let pool = db.filter(p => p.id >= minId && p.id <= maxId)
  if (filtroTipo) pool = pool.filter(p => tipos(p).some(t => norm(t) === norm(filtroTipo)))
  if (!pool.length) pool = db.slice(0, 200)
  const total = pool.reduce((s,p) => s + peso(p), 0)
  let n = Math.random() * total
  for (const p of pool) {
    n -= peso(p)
    if (n <= 0) return p
  }
  return escolha(pool)
}

function spawn(ctx, opcoes) {
  opcoes = opcoes || {}
  const st = estado(ctx).st
  const m = mundo(ctx)
  const p = opcoes.id ? porId.get(Number(opcoes.id)) : sortearEspecie(st, opcoes.tipo)
  if (!p) return null
  const wild = {
    id: p.id, nome: p.name, nivel: Number(opcoes.nivel || sorte(3, 18)),
    shiny: opcoes.shiny === true || Math.random() < 1 / 512,
    hp: 100, apareceuEm: agora(), expiraEm: agora() + (opcoes.tempo || 2 * 60 * 1000),
    origem: opcoes.origem || 'selvagem'
  }
  m.selvagem = wild
  m.ultimoSpawn = agora()
  marcar(st, p, false)
  r.salvar(ctx)
  return wild
}

function limparSelvagem(ctx) {
  const m = mundo(ctx)
  if (m.selvagem && Number(m.selvagem.expiraEm || 0) <= agora()) m.selvagem = null
  return m.selvagem
}

function chanceCaptura(p, bola, hp) {
  if (bola === 'masterball') return 1
  const b = BOLAS[bola] || BOLAS.pokeball
  const taxa = clamp(Number(p.capture || 45) / 255, 0.06, 0.9)
  const vida = 1 + (100 - clamp(hp, 1, 100)) / 125
  return clamp(taxa * b.mult * vida, 0.06, 0.94)
}

function poderPokemon(inst) {
  if (!inst) return 0
  const s = inst.stats || {}
  let poder = (Number(s.ataque||60)+Number(s.defesa||60)+Number(s.ataqueEspecial||60)+Number(s.defesaEspecial||60)+Number(s.velocidade||60))/5
  poder += Number(inst.nivel||1) * 4 + Number(inst.afeto||0) * 0.4
  if (inst.shiny) poder += 8
  if (inst.forma && inst.formaAte > agora()) poder *= inst.forma === 'Mega' ? 1.25 : inst.forma === 'Dynamax' ? 1.2 : 1.15
  return Math.round(poder)
}

function multiplicadorTipo(atacante, defensor) {
  const at = tipos(atacante)[0]
  const defs = tipos(defensor)
  return defs.some(d => (VANTAGENS[at] || []).includes(d)) ? 1.5 : 1
}

function golpeAleatorio(inst) {
  const p = porId.get(inst.id)
  const lista = Array.isArray(inst.golpes) && inst.golpes.length ? inst.golpes : golpesPadrao(p)
  return escolha(lista)
}

async function batalhaTreinadores(ctx, alvo) {
  const a = principal(ctx)
  const b = principal(ctx, alvo)
  if (!a.pokemon) return { ok:false, texto: compacto(ctx,'⚔️','Batalha Pokémon',[{emoji:'📌',texto:'Você não possui Pokémon principal'}]) }
  if (!b.pokemon) return { ok:false, texto: compacto(ctx,'⚔️','Batalha Pokémon',[{emoji:'📌',texto:'O adversário não possui Pokémon principal'}]) }

  const pa = porId.get(a.pokemon.id) || especie(a.pokemon.tipo)
  const pb = porId.get(b.pokemon.id) || especie(b.pokemon.tipo)
  let hpA=100, hpB=100
  const log=[]
  let turno=1
  while(hpA>0 && hpB>0 && turno<=12){
    const primeiro = Number(a.pokemon.stats.velocidade||0) >= Number(b.pokemon.stats.velocidade||0)
    const ordem = primeiro ? [[a.pokemon,pa,b.pokemon,pb,'A'],[b.pokemon,pb,a.pokemon,pa,'B']] : [[b.pokemon,pb,a.pokemon,pa,'B'],[a.pokemon,pa,b.pokemon,pb,'A']]
    for(const [atk,spAtk,def,spDef,lado] of ordem){
      if(hpA<=0 || hpB<=0) break
      const mov=golpeAleatorio(atk)
      const mult=multiplicadorTipo(spAtk,spDef)
      const crit=Math.random()<0.12 ? 1.5 : 1
      const base=Math.max(6,Math.round((poderPokemon(atk)*0.22 - poderPokemon(def)*0.08 + sorte(4,12))*mult*crit))
      if(lado==='A') hpB=clamp(hpB-base,0,100); else hpA=clamp(hpA-base,0,100)
      if(log.length<8) log.push((lado==='A' ? a.pokemon.nome : b.pokemon.nome)+' usou '+mov+' (-'+base+' HP)'+(mult>1?' super efetivo':'')+(crit>1?' crítico':''))
    }
    turno++
  }
  const venceuA = hpA >= hpB
  const vencedor = venceuA ? a : b
  const perdedor = venceuA ? b : a
  vencedor.pokemon.vitorias = Number(vencedor.pokemon.vitorias||0)+1
  perdedor.pokemon.derrotas = Number(perdedor.pokemon.derrotas||0)+1
  vencedor.pokemon.xp = Number(vencedor.pokemon.xp||0)+70
  perdedor.pokemon.xp = Number(perdedor.pokemon.xp||0)+30
  vencedor.pokemon.nivel = 1 + Math.floor(vencedor.pokemon.xp/100)
  perdedor.pokemon.nivel = 1 + Math.floor(perdedor.pokemon.xp/100)
  vencedor.pokemon.hp = Math.max(20, venceuA ? hpA : hpB)
  perdedor.pokemon.hp = Math.max(1, venceuA ? hpB : hpA)
  sincronizarLegacy(vencedor.u,vencedor.st)
  sincronizarLegacy(perdedor.u,perdedor.st)
  const ecoV = r.eco(ctx, venceuA ? ctx.sender : alvo)
  ecoV.coins = Number(ecoV.coins||0)+600
  r.salvar(ctx)
  return {
    ok:true,
    vencedor: venceuA ? ctx.sender : alvo,
    texto: compacto(ctx,'⚔️','Batalha Pokémon',[
      {emoji:'🔴',texto:a.pokemon.nome+' x '+b.pokemon.nome},
      ...log.map(x=>({emoji:'⚡',texto:x})),
      {emoji:'🏆',texto:'Vencedor: '+vencedor.pokemon.nome},
      {emoji:'🧠',texto:'+70 XP para o vencedor • +30 XP para o perdedor'},
      {emoji:'🪙',texto:'+600 N-Coins para o vencedor'}
    ])
  }
}

function equipePoder(ctx, jid) {
  const e=estado(ctx,jid)
  const time=e.st.equipe.map(uid=>e.st.colecao.find(p=>p.uid===uid)).filter(Boolean)
  return time.reduce((s,p)=>s+poderPokemon(p),0)
}

function conquistas(st) {
  const capturados=Object.keys(st.pokedex.capturados||{}).length
  const shinies=st.colecao.filter(p=>p.shiny).length
  const out=[]
  if(capturados>=1) out.push('Primeira Captura')
  if(capturados>=10) out.push('Colecionador I')
  if(capturados>=50) out.push('Colecionador II')
  if(capturados>=100) out.push('Mestre da Pokédex')
  if(shinies>=1) out.push('Caçador Shiny')
  if(st.insignias.length>=8) out.push('Mestre de Ginásio')
  if(st.eliteVencida) out.push('Elite Four')
  if(st.campeao) out.push('Campeão Pokémon')
  return out
}

function titulos(st) {
  const lista=['Treinador']
  if(st.colecao.length>=10) lista.push('Colecionador')
  if(st.colecao.some(p=>p.shiny)) lista.push('Caçador Shiny')
  if(st.insignias.length>=8) lista.push('Mestre de Ginásio')
  if(st.eliteVencida) lista.push('Elite')
  if(st.campeao) lista.push('Campeão')
  return [...new Set(lista)]
}

function finalizarLeilao(ctx) {
  const m=mundo(ctx)
  const l=m.leilao
  if(!l || Number(l.terminaEm||0)>agora()) return null
  m.leilao=null
  if(!l.maior || !l.maior.jid){ r.salvar(ctx); return {vendido:false,texto:'Leilão encerrado sem lances.'} }
  const vend=estado(ctx,l.vendedor), comp=estado(ctx,l.maior.jid)
  const poke=vend.st.colecao.find(p=>p.uid===l.uid)
  const ecV=r.eco(ctx,l.vendedor), ecC=r.eco(ctx,l.maior.jid)
  if(!poke || Number(ecC.coins||0)<l.maior.valor){ r.salvar(ctx); return {vendido:false,texto:'Leilão cancelado porque a transferência não pôde ser concluída.'} }
  ecC.coins-=l.maior.valor; ecV.coins=Number(ecV.coins||0)+l.maior.valor
  vend.st.colecao=vend.st.colecao.filter(p=>p.uid!==poke.uid)
  vend.st.equipe=vend.st.equipe.filter(x=>x!==poke.uid)
  if(vend.st.principalUid===poke.uid) vend.st.principalUid=vend.st.colecao[0]?.uid||null
  poke.uid=poke.id+'-'+agora().toString(36)+'-'+Math.random().toString(36).slice(2,6)
  poke.origem='leilao'
  comp.st.colecao.push(poke); marcar(comp.st,porId.get(poke.id),true)
  sincronizarLegacy(vend.u,vend.st); sincronizarLegacy(comp.u,comp.st); r.salvar(ctx)
  return {vendido:true,texto:'Leilão finalizado: '+poke.nome+' foi vendido por '+dinheiro(l.maior.valor)+'.'}
}

module.exports = {
  db, BOLAS, ITENS, GOLPES, GINASIOS, VANTAGENS, norm, especie, imagem, tipos, raridade,
  instancia, estado, principal, resolverDaColecao, sincronizarLegacy, marcar, adicionar, mundo,
  spawn, limparSelvagem, chanceCaptura, poderPokemon, equipePoder, golpesPadrao, batalhaTreinadores,
  conquistas, titulos, finalizarLeilao, sorte, escolha, clamp, compacto, dinheiro, enviarComImagem
}
