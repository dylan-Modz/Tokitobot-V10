const r = require('../../sistemas/rpg/index')
const p = require('../../sistemas/rpg/pokemon-core')
const dylan = require('../../database/lib/comandos')

const comandos = [
  'pokedex','capturar','pokebolas','comprarbola','colecaopokemon','equipokemon','principalpokemon','soltarpokemon','favoritarpokemon','infopokemon',
  'statuspokemon','golpes','aprendergolpe','usartm','curarpokemon','revivepokemon','megaevoluirpokemon','dynamaxpokemon','terastalpokemon','tipospokemon',
  'mapapokemon','viajarpokemon','explorarpokemon','safaripokemon','pescarpokemon','expedicaopokemon','ginasiopokemon','insignias','elitefour','campeaopokemon',
  'pokemart','mochilapokemon','ovopokemon','chocadeira','breedingpokemon','incensopokemon','lurepokemon','trocapokemon','leilaopokemon','lancepokemon',
  'raidpokemon','lendariopokemon','dailypokemon','streakpokemon','conquistapokemon','titulopokemon'
]

const linhaPoke = x => {
  const estrela = x.shiny ? '✨ ' : ''
  const fav = x.favorito ? '⭐ ' : ''
  return fav + estrela + x.nome + ' • Nv.' + x.nivel + ' • ID ' + x.uid.slice(0, 8)
}

const alvo = async ctx => {
  const d = await ctx.destino().catch(() => null)
  return d && d.mencao ? ctx.normalizar(d.mencao) : null
}

const salvar = ctx => r.salvar(ctx)

const erroUso = (ctx, texto) => ctx.reply(p.compacto(ctx, '📌', 'Pokémon RPG', [{ emoji: '📌', texto }]))

async function mostrarInfo(ctx, sp, inst) {
  const s = sp.stats || {}
  const linhas = [
    { emoji: '🔢', texto: 'Pokédex #' + sp.id },
    { emoji: '🔴', texto: 'Nome: ' + sp.name },
    { emoji: '🧬', texto: 'Tipo: ' + p.tipos(sp).join(' / ') },
    { emoji: '💎', texto: 'Raridade: ' + p.raridade(sp) },
    { emoji: '❤️', texto: 'HP base: ' + Number(s.hp || 60) },
    { emoji: '⚔️', texto: 'Ataque: ' + Number(s.ataque || 60) + ' • Defesa: ' + Number(s.defesa || 60) },
    { emoji: '💨', texto: 'Velocidade: ' + Number(s.velocidade || 60) }
  ]
  if (inst) {
    linhas.push({ emoji: '⭐', texto: 'Nível: ' + inst.nivel + ' • XP: ' + inst.xp })
    linhas.push({ emoji: '🌿', texto: 'Natureza: ' + inst.natureza + (inst.shiny ? ' • SHINY' : '') })
  }
  return p.enviarComImagem(ctx, p.imagem(sp), p.compacto(ctx, '🔴', 'Info Pokémon', linhas))
}

dylan.setCommand({
  nome: 'pokemonrpg',
  comandos,
  categoria: 'pokemon',
  info: {
    descricao: 'Expansão completa do RPG Pokémon.',
    uso: 'pokedex | capturar | colecaopokemon | ginasiopokemon | raidpokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },

  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!r.ambos(ctx)) return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const cmd = String(ctx.command || '').toLowerCase()
    const eu = p.estado(ctx)
    const eco = r.eco(ctx)
    const principal = () => p.resolverDaColecao(eu.st, eu.st.principalUid)

    if (cmd === 'pokedex') {
      const ref = ctx.args && ctx.args.length ? ctx.args.join(' ') : ''
      if (ref) {
        const sp = p.especie(ref)
        if (!sp) return erroUso(ctx, 'Pokémon não encontrado entre os 200 cadastrados.')
        return mostrarInfo(ctx, sp, eu.st.colecao.find(x => x.id === sp.id))
      }
      const vistos = Object.keys(eu.st.pokedex.vistos || {}).length
      const capturados = Object.keys(eu.st.pokedex.capturados || {}).length
      return ctx.reply(p.compacto(ctx, '📕', 'Pokédex', [
        { emoji: '👀', texto: 'Vistos: ' + vistos + '/200' },
        { emoji: '🔴', texto: 'Capturados: ' + capturados + '/200' },
        { emoji: '📊', texto: 'Progresso: ' + Math.floor(capturados / 200 * 100) + '%' },
        { emoji: '📌', texto: 'Use ' + ctx.prefix + 'pokedex nome ou ID para ver um Pokémon' }
      ]))
    }

    if (cmd === 'capturar') {
      const m = p.mundo(ctx)
      const wild = p.limparSelvagem(ctx)
      if (!wild) return erroUso(ctx, 'Não há Pokémon selvagem no grupo agora.')
      const bola = p.norm(ctx.args && ctx.args[0] || 'pokeball')
      if (!p.BOLAS[bola]) return erroUso(ctx, 'Bola inválida: pokeball, greatball, ultraball, masterball ou safariball.')
      if (Number(eu.st.bolas[bola] || 0) <= 0) return erroUso(ctx, 'Você não possui ' + p.BOLAS[bola].nome + '.')
      eu.st.bolas[bola]--
      const sp = p.especie(wild.id)
      const chance = p.chanceCaptura(sp, bola, wild.hp)
      const pegou = Math.random() <= chance
      if (!pegou) {
        wild.hp = p.clamp(wild.hp - p.sorte(8, 22), 10, 100)
        salvar(ctx)
        return ctx.reply(p.compacto(ctx, '💥', 'Captura falhou', [
          { emoji: p.BOLAS[bola].emoji, texto: p.BOLAS[bola].nome + ' foi usada' },
          { emoji: '🏃', texto: wild.nome + ' escapou da bola, mas continua por perto' },
          { emoji: '❤️', texto: 'Resistência: ' + wild.hp + '%' }
        ]))
      }
      const inst = p.adicionar(ctx, sp, { shiny: wild.shiny, nivel: wild.nivel, origem: wild.origem })
      m.selvagem = null
      salvar(ctx)
      return p.enviarComImagem(ctx, p.imagem(sp), p.compacto(ctx, '🎉', 'Pokémon capturado', [
        { emoji: wild.shiny ? '✨' : '🔴', texto: sp.name + (wild.shiny ? ' SHINY' : '') },
        { emoji: '⭐', texto: 'Nível: ' + inst.nivel },
        { emoji: '🆔', texto: 'ID: ' + inst.uid.slice(0, 8) },
        { emoji: '📕', texto: 'Adicionado à coleção e à Pokédex' }
      ]))
    }

    if (cmd === 'pokebolas') {
      return ctx.reply(p.compacto(ctx, '🔴', 'Pokébolas', Object.entries(p.BOLAS).map(([id,b]) => ({
        emoji: b.emoji, texto: b.nome + ': ' + Number(eu.st.bolas[id] || 0) + (b.preco ? ' • ' + p.dinheiro(b.preco) : '')
      }))))
    }

    if (cmd === 'comprarbola') {
      const id = p.norm(ctx.args && ctx.args[0])
      const qtd = Math.min(50, Math.max(1, Number(ctx.args && ctx.args[1] || 1)))
      const b = p.BOLAS[id]
      if (!b || !b.preco) return erroUso(ctx, 'Use ' + ctx.prefix + 'comprarbola pokeball/greatball/ultraball/masterball quantidade')
      const total = b.preco * qtd
      if (Number(eco.coins || 0) < total) return ctx.reply(ctx.mess.coinsSemSaldo(total, eco.coins))
      eco.coins -= total
      eu.st.bolas[id] = Number(eu.st.bolas[id] || 0) + qtd
      salvar(ctx)
      return ctx.reply(p.compacto(ctx, b.emoji, 'Compra de Pokébolas', [
        { emoji: b.emoji, texto: b.nome + ' x' + qtd },
        { emoji: '🪙', texto: 'Custo: ' + p.dinheiro(total) },
        { emoji: '🎒', texto: 'Agora você tem: ' + eu.st.bolas[id] }
      ]))
    }

    if (cmd === 'colecaopokemon') {
      const pagina = Math.max(1, Number(ctx.args && ctx.args[0] || 1))
      const ini = (pagina - 1) * 10
      const itens = eu.st.colecao.slice(ini, ini + 10)
      if (!itens.length) return erroUso(ctx, 'Sua coleção está vazia ou essa página não existe.')
      return ctx.reply(p.compacto(ctx, '🗃️', 'Coleção Pokémon', [
        { emoji: '📦', texto: 'Total: ' + eu.st.colecao.length + ' Pokémon • Página ' + pagina },
        ...itens.map((x,i) => ({ emoji: x.uid === eu.st.principalUid ? '👑' : '🔴', texto: (ini+i+1) + '. ' + linhaPoke(x) }))
      ]))
    }

    if (cmd === 'equipokemon') {
      const acao = p.norm(ctx.args && ctx.args[0] || 'ver')
      if (acao === 'ver') {
        const time = eu.st.equipe.map(uid => eu.st.colecao.find(x => x.uid === uid)).filter(Boolean)
        return ctx.reply(p.compacto(ctx, '👥', 'Equipe Pokémon', time.length ? time.map((x,i) => ({emoji:'🔴',texto:(i+1)+'. '+linhaPoke(x)})) : [{emoji:'📭',texto:'Equipe vazia'}]))
      }
      const poke = p.resolverDaColecao(eu.st, ctx.args && ctx.args[1])
      if (!poke) return erroUso(ctx, 'Informe o ID do Pokémon da sua coleção.')
      if (acao === 'add') {
        if (eu.st.equipe.includes(poke.uid)) return erroUso(ctx, 'Esse Pokémon já está na equipe.')
        if (eu.st.equipe.length >= 6) return erroUso(ctx, 'Sua equipe já tem 6 Pokémon.')
        eu.st.equipe.push(poke.uid)
      } else if (acao === 'del' || acao === 'remover') {
        eu.st.equipe = eu.st.equipe.filter(x => x !== poke.uid)
      } else return erroUso(ctx, 'Use equipokemon ver, equipokemon add ID ou equipokemon del ID.')
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'👥','Equipe Pokémon',[{emoji:'✅',texto:'Equipe atualizada com sucesso'}]))
    }

    if (cmd === 'principalpokemon') {
      const poke = p.resolverDaColecao(eu.st, ctx.args && ctx.args[0])
      if (!poke) return erroUso(ctx, 'Informe o ID de um Pokémon da sua coleção.')
      eu.st.principalUid = poke.uid
      if (!eu.st.equipe.includes(poke.uid)) eu.st.equipe.unshift(poke.uid)
      eu.st.equipe = eu.st.equipe.slice(0,6)
      p.sincronizarLegacy(eu.u, eu.st)
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'👑','Pokémon principal',[{emoji:'🔴',texto:poke.nome+' agora é seu Pokémon principal'}]))
    }

    if (cmd === 'soltarpokemon') {
      const poke = p.resolverDaColecao(eu.st, ctx.args && ctx.args[0])
      if (!poke) return erroUso(ctx, 'Informe o ID do Pokémon.')
      if (poke.favorito) return erroUso(ctx, 'Esse Pokémon está favoritado. Desfavorite antes de soltar.')
      eu.st.colecao = eu.st.colecao.filter(x => x.uid !== poke.uid)
      eu.st.equipe = eu.st.equipe.filter(x => x !== poke.uid)
      if (eu.st.principalUid === poke.uid) eu.st.principalUid = eu.st.colecao[0] && eu.st.colecao[0].uid || null
      p.sincronizarLegacy(eu.u, eu.st)
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🕊️','Pokémon solto',[{emoji:'👋',texto:poke.nome+' voltou para a natureza'}]))
    }

    if (cmd === 'favoritarpokemon') {
      const poke = p.resolverDaColecao(eu.st, ctx.args && ctx.args[0])
      if (!poke) return erroUso(ctx, 'Informe o ID do Pokémon.')
      poke.favorito = !poke.favorito
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'⭐','Favorito Pokémon',[{emoji:'⭐',texto:poke.nome+(poke.favorito?' foi favoritado':' saiu dos favoritos')}]))
    }

    if (cmd === 'infopokemon') {
      const ref = ctx.args && ctx.args.join(' ')
      const own = p.resolverDaColecao(eu.st, ref)
      const sp = own ? p.especie(own.id) : p.especie(ref)
      if (!sp) return erroUso(ctx, 'Pokémon não encontrado.')
      return mostrarInfo(ctx, sp, own)
    }

    if (cmd === 'statuspokemon') {
      const poke = principal()
      if (!poke) return erroUso(ctx, 'Você ainda não possui Pokémon.')
      return ctx.reply(p.compacto(ctx,'📊','Status Pokémon',[
        {emoji:poke.shiny?'✨':'🔴',texto:poke.nome+' • Nv.'+poke.nivel},
        {emoji:'❤️',texto:'HP: '+poke.hp+'% • Saúde: '+poke.saude+'%'},
        {emoji:'⚡',texto:'Energia: '+poke.energia+'% • Fome: '+poke.fome+'%'},
        {emoji:'🌿',texto:'Natureza: '+poke.natureza},
        {emoji:'⚔️',texto:'Poder: '+p.poderPokemon(poke)},
        {emoji:'🏆',texto:'Vitórias: '+poke.vitorias+' • Derrotas: '+poke.derrotas}
      ]))
    }

    if (cmd === 'golpes') {
      const poke = p.resolverDaColecao(eu.st, ctx.args && ctx.args[0]) || principal()
      if (!poke) return erroUso(ctx, 'Você ainda não possui Pokémon.')
      return ctx.reply(p.compacto(ctx,'💥','Golpes Pokémon',[
        {emoji:'🔴',texto:poke.nome},
        ...poke.golpes.map((g,i)=>({emoji:'⚡',texto:(i+1)+'. '+g}))
      ]))
    }

    if (cmd === 'aprendergolpe') {
      const poke = principal()
      if (!poke) return erroUso(ctx, 'Você ainda não possui Pokémon.')
      const sp = p.especie(poke.id)
      const pool = p.GOLPES[p.tipos(sp)[0]] || p.GOLPES.Normal
      const nome = ctx.args && ctx.args.join(' ')
      if (!nome) return ctx.reply(p.compacto(ctx,'📚','Aprender golpe',pool.map(x=>({emoji:'⚡',texto:x}))))
      const golpe = Object.values(p.GOLPES).flat().find(x=>p.norm(x)===p.norm(nome))
      if (!golpe) return erroUso(ctx, 'Golpe não reconhecido.')
      if (poke.golpes.some(x=>p.norm(x)===p.norm(golpe))) return erroUso(ctx, 'Seu Pokémon já conhece esse golpe.')
      const custo=800
      if (eco.coins<custo) return ctx.reply(ctx.mess.coinsSemSaldo(custo,eco.coins))
      eco.coins-=custo
      if(poke.golpes.length>=4) poke.golpes.shift()
      poke.golpes.push(golpe)
      p.sincronizarLegacy(eu.u,eu.st); salvar(ctx)
      return ctx.reply(p.compacto(ctx,'📚','Novo golpe',[{emoji:'⚡',texto:poke.nome+' aprendeu '+golpe},{emoji:'🪙',texto:'Custo: '+p.dinheiro(custo)}]))
    }

    if (cmd === 'usartm') {
      const id=p.norm(ctx.args && ctx.args[0])
      const item=p.ITENS[id]
      const poke=principal()
      if(!poke) return erroUso(ctx,'Você ainda não possui Pokémon.')
      if(!item || !item.tipo) return erroUso(ctx,'Use uma TM válida da mochila.')
      if(Number(eu.st.itens[id]||0)<1) return erroUso(ctx,'Você não possui '+item.nome+'.')
      const pool=p.GOLPES[item.tipo]||p.GOLPES.Normal
      const golpe=pool[pool.length-1]
      eu.st.itens[id]--
      if(poke.golpes.length>=4) poke.golpes.shift()
      poke.golpes.push(golpe)
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'💿','TM utilizada',[{emoji:'⚡',texto:poke.nome+' aprendeu '+golpe}]))
    }

    if (cmd === 'curarpokemon') {
      const poke=p.resolverDaColecao(eu.st,ctx.args && ctx.args[0])||principal()
      if(!poke) return erroUso(ctx,'Pokémon não encontrado.')
      const custo=300
      if(eco.coins<custo) return ctx.reply(ctx.mess.coinsSemSaldo(custo,eco.coins))
      eco.coins-=custo; poke.hp=100; poke.saude=100; poke.energia=Math.max(poke.energia,70)
      p.sincronizarLegacy(eu.u,eu.st); salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🏥','Centro Pokémon',[{emoji:'❤️',texto:poke.nome+' foi totalmente recuperado'},{emoji:'🪙',texto:'Custo: '+p.dinheiro(custo)}]))
    }

    if (cmd === 'revivepokemon') {
      const poke=p.resolverDaColecao(eu.st,ctx.args && ctx.args[0])||principal()
      if(!poke) return erroUso(ctx,'Pokémon não encontrado.')
      if(Number(eu.st.itens.revive||0)<1) return erroUso(ctx,'Você não possui Revive. Compre no PokéMart.')
      eu.st.itens.revive--; poke.hp=Math.max(50,poke.hp); poke.saude=Math.max(60,poke.saude)
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'✨','Revive',[{emoji:'❤️',texto:poke.nome+' voltou com pelo menos 50% de HP'}]))
    }

    if (['megaevoluirpokemon','dynamaxpokemon','terastalpokemon'].includes(cmd)) {
      const poke=principal()
      if(!poke) return erroUso(ctx,'Você ainda não possui Pokémon.')
      const cfg=cmd==='megaevoluirpokemon'?['megapedra','Mega']:cmd==='dynamaxpokemon'?['dynamaxband','Dynamax']:['teraorb','Tera']
      if(Number(eu.st.itens[cfg[0]]||0)<1) return erroUso(ctx,'Você precisa do item '+p.ITENS[cfg[0]].nome+' do PokéMart.')
      poke.forma=cfg[1]; poke.formaAte=Date.now()+10*60*1000
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'✨',cfg[1]+' Pokémon',[{emoji:'🔴',texto:poke.nome+' ativou '+cfg[1]+' por 10 minutos'},{emoji:'⚔️',texto:'O bônus é aplicado nas batalhas'}]))
    }

    if (cmd === 'tipospokemon') {
      return ctx.reply(p.compacto(ctx,'🧬','Tipos Pokémon',[
        {emoji:'🔥',texto:'Fogo > Planta, Gelo, Inseto e Aço'},
        {emoji:'💧',texto:'Água > Fogo, Terra e Pedra'},
        {emoji:'🌿',texto:'Planta > Água, Terra e Pedra'},
        {emoji:'⚡',texto:'Elétrico > Água e Voador'},
        {emoji:'❄️',texto:'Gelo > Planta, Terra, Voador e Dragão'},
        {emoji:'🥊',texto:'Lutador > Normal, Gelo, Pedra, Sombrio e Aço'},
        {emoji:'🧠',texto:'Psíquico > Lutador e Veneno'},
        {emoji:'🌑',texto:'Sombrio > Psíquico e Fantasma'}
      ]))
    }

    if (cmd === 'mapapokemon') {
      return ctx.reply(p.compacto(ctx,'🗺️','Mapa Pokémon',[
        {emoji:eu.st.regiao==='Kanto'?'📍':'🗺️',texto:'Kanto • Pokémon #1–151'},
        {emoji:eu.st.regiao==='Johto'?'📍':'🗺️',texto:'Johto • Pokémon #152–200'},
        {emoji:'📌',texto:'Região atual: '+eu.st.regiao}
      ]))
    }

    if (cmd === 'viajarpokemon') {
      const reg=String(ctx.args && ctx.args[0]||'').toLowerCase()
      const nome=reg==='kanto'?'Kanto':reg==='johto'?'Johto':null
      if(!nome) return erroUso(ctx,'Use viajarpokemon kanto ou viajarpokemon johto.')
      const custo=500
      if(eco.coins<custo) return ctx.reply(ctx.mess.coinsSemSaldo(custo,eco.coins))
      eco.coins-=custo; eu.st.regiao=nome; salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🗺️','Viagem Pokémon',[{emoji:'📍',texto:'Você chegou em '+nome},{emoji:'🪙',texto:'Custo: '+p.dinheiro(custo)}]))
    }

    if (cmd === 'explorarpokemon') {
      const falta=3*60*1000-(Date.now()-Number(eu.st.ultimaExploracao||0))
      if(falta>0) return ctx.reply(ctx.mess.coinsCooldown(Math.ceil(falta/1000)))
      eu.st.ultimaExploracao=Date.now()
      if(Math.random()<0.45){
        const wild=p.spawn(ctx,{origem:'exploracao'})
        const sp=p.especie(wild.id)
        salvar(ctx)
        return p.enviarComImagem(ctx,p.imagem(sp),p.compacto(ctx,'🌲','Exploração Pokémon',[
          {emoji:wild.shiny?'✨':'👀',texto:'Você encontrou '+wild.nome+(wild.shiny?' SHINY':'')},
          {emoji:'⭐',texto:'Nível selvagem: '+wild.nivel},
          {emoji:'🔴',texto:'Use '+ctx.prefix+'capturar para tentar capturar'}
        ]))
      }
      const ganho=p.sorte(150,550); eco.coins+=ganho
      if(Math.random()<0.3) eu.st.bolas.pokeball++
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🌲','Exploração Pokémon',[{emoji:'🪙',texto:'Você encontrou '+p.dinheiro(ganho)},{emoji:'🎒',texto:'Continue explorando para encontrar Pokémon selvagens'}]))
    }

    if (cmd === 'safaripokemon') {
      const custo=1000
      if(eco.coins<custo) return ctx.reply(ctx.mess.coinsSemSaldo(custo,eco.coins))
      eco.coins-=custo; eu.st.bolas.safariball=Number(eu.st.bolas.safariball||0)+5; eu.st.safariAte=Date.now()+10*60*1000
      const wild=p.spawn(ctx,{origem:'safari'})
      salvar(ctx)
      return p.enviarComImagem(ctx,p.imagem(wild.id),p.compacto(ctx,'🦒','Safari Pokémon',[
        {emoji:'🟢',texto:'Você recebeu 5 Safari Balls'},
        {emoji:'👀',texto:'Um '+wild.nome+' apareceu na Safari Zone'},
        {emoji:'⏱️',texto:'Acesso especial por 10 minutos'}
      ]))
    }

    if (cmd === 'pescarpokemon') {
      const wild=p.spawn(ctx,{tipo:'Água',origem:'pesca'})
      salvar(ctx)
      return p.enviarComImagem(ctx,p.imagem(wild.id),p.compacto(ctx,'🎣','Pesca Pokémon',[
        {emoji:'💧',texto:'Você fisgou um '+wild.nome},
        {emoji:'⭐',texto:'Nível: '+wild.nivel},
        {emoji:'🔴',texto:'Use '+ctx.prefix+'capturar para tentar capturar'}
      ]))
    }

    if (cmd === 'expedicaopokemon') {
      const poke=principal()
      if(!poke) return erroUso(ctx,'Você precisa de um Pokémon principal.')
      const cd=15*60*1000-(Date.now()-Number(eu.st.ultimaExpedicao||0))
      if(cd>0) return ctx.reply(ctx.mess.coinsCooldown(Math.ceil(cd/1000)))
      eu.st.ultimaExpedicao=Date.now()
      const xp=p.sorte(80,160), ganho=p.sorte(350,900)
      poke.xp+=xp; poke.nivel=1+Math.floor(poke.xp/100); eco.coins+=ganho
      if(Math.random()<0.25) eu.st.itens.pocao=Number(eu.st.itens.pocao||0)+1
      p.sincronizarLegacy(eu.u,eu.st); salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🧭','Expedição Pokémon',[{emoji:'🔴',texto:poke.nome+' voltou da expedição'},{emoji:'🧠',texto:'+'+xp+' XP'},{emoji:'🪙',texto:'+'+p.dinheiro(ganho)}]))
    }

    if (cmd === 'ginasiopokemon') {
      if(eu.st.insignias.length>=8) return erroUso(ctx,'Você já conquistou as 8 insígnias de Kanto.')
      const cd=5*60*1000-(Date.now()-Number(eu.st.ultimoGinasio||0))
      if(cd>0) return ctx.reply(ctx.mess.coinsCooldown(Math.ceil(cd/1000)))
      const lider=p.GINASIOS[eu.st.insignias.length]
      const poder=p.equipePoder(ctx)
      eu.st.ultimoGinasio=Date.now()
      const venceu=poder+p.sorte(0,120)>=lider.poder
      if(venceu){
        eu.st.insignias.push(lider.insignia)
        const premio=1200+eu.st.insignias.length*300; eco.coins+=premio
        salvar(ctx)
        return ctx.reply(p.compacto(ctx,'🏅','Ginásio Pokémon',[{emoji:'🏆',texto:'Você derrotou '+lider.nome},{emoji:'🏅',texto:'Insígnia '+lider.insignia+' conquistada'},{emoji:'🪙',texto:'Prêmio: '+p.dinheiro(premio)}]))
      }
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'💥','Ginásio Pokémon',[{emoji:'❌',texto:'Sua equipe perdeu para '+lider.nome},{emoji:'⚔️',texto:'Poder da equipe: '+poder+' • Recomendado: '+lider.poder}]))
    }

    if (cmd === 'insignias') {
      return ctx.reply(p.compacto(ctx,'🏅','Insígnias Pokémon',eu.st.insignias.length?eu.st.insignias.map((x,i)=>({emoji:'🏅',texto:(i+1)+'. '+x})):[{emoji:'📭',texto:'Você ainda não possui insígnias'}]))
    }

    if (cmd === 'elitefour') {
      if(eu.st.insignias.length<8) return erroUso(ctx,'Conquiste as 8 insígnias antes de enfrentar a Elite Four.')
      if(eu.st.eliteVencida) return erroUso(ctx,'Você já venceu a Elite Four.')
      const poder=p.equipePoder(ctx)
      const venceu=poder+p.sorte(0,180)>=520
      if(venceu){eu.st.eliteVencida=true;eco.coins+=5000}
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🏛️','Elite Four',[{emoji:venceu?'🏆':'💥',texto:venceu?'Você venceu a Elite Four!':'Sua equipe foi derrotada pela Elite Four'},{emoji:'⚔️',texto:'Poder da equipe: '+poder},{emoji:'🪙',texto:venceu?'Prêmio: '+p.dinheiro(5000):'Treine e tente novamente'}]))
    }

    if (cmd === 'campeaopokemon') {
      if(!eu.st.eliteVencida) return erroUso(ctx,'Vença a Elite Four primeiro.')
      if(eu.st.campeao) return erroUso(ctx,'Você já possui o título de Campeão Pokémon.')
      const poder=p.equipePoder(ctx), venceu=poder+p.sorte(0,200)>=650
      if(venceu){eu.st.campeao=true;eco.coins+=10000}
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'👑','Campeão Pokémon',[{emoji:venceu?'👑':'💥',texto:venceu?'Você se tornou Campeão Pokémon!':'O Campeão atual venceu sua equipe'},{emoji:'⚔️',texto:'Poder da equipe: '+poder},{emoji:'🪙',texto:venceu?'Prêmio: '+p.dinheiro(10000):'Aumente sua equipe e tente novamente'}]))
    }

    if (cmd === 'pokemart') {
      const acao=p.norm(ctx.args && ctx.args[0])
      if(acao==='comprar'){
        const id=p.norm(ctx.args && ctx.args[1]); const qtd=Math.min(20,Math.max(1,Number(ctx.args && ctx.args[2]||1))); const item=p.ITENS[id]
        if(!item) return erroUso(ctx,'Item inválido. Use pokemart para ver a loja.')
        const total=item.preco*qtd
        if(eco.coins<total) return ctx.reply(ctx.mess.coinsSemSaldo(total,eco.coins))
        eco.coins-=total; eu.st.itens[id]=Number(eu.st.itens[id]||0)+qtd; salvar(ctx)
        return ctx.reply(p.compacto(ctx,item.emoji,'PokéMart',[{emoji:item.emoji,texto:item.nome+' x'+qtd},{emoji:'🪙',texto:'Custo: '+p.dinheiro(total)}]))
      }
      return ctx.reply(p.compacto(ctx,'🏪','PokéMart',[
        ...Object.entries(p.ITENS).map(([id,x])=>({emoji:x.emoji,texto:id+' — '+x.nome+' • '+p.dinheiro(x.preco)})),
        {emoji:'📌',texto:'Comprar: '+ctx.prefix+'pokemart comprar item quantidade'}
      ]))
    }

    if (cmd === 'mochilapokemon') {
      const linhas=[]
      for(const [id,b] of Object.entries(p.BOLAS)) if(Number(eu.st.bolas[id]||0)>0) linhas.push({emoji:b.emoji,texto:b.nome+' x'+eu.st.bolas[id]})
      for(const [id,it] of Object.entries(p.ITENS)) if(Number(eu.st.itens[id]||0)>0) linhas.push({emoji:it.emoji,texto:it.nome+' x'+eu.st.itens[id]})
      return ctx.reply(p.compacto(ctx,'🎒','Mochila Pokémon',linhas.length?linhas:[{emoji:'📭',texto:'Mochila vazia'}]))
    }

    if (cmd === 'ovopokemon') {
      const ovos=eu.st.ovos || []
      const linhas=ovos.map((x,i)=>({emoji:'🥚',texto:(i+1)+'. Ovo #'+x.id+' • '+(x.pai1||'?')+' + '+(x.pai2||'?')}))
      if(eu.st.incubando) linhas.unshift({emoji:'🔥',texto:'Incubando ovo #'+eu.st.incubando.id+' • falta '+Math.max(0,Math.ceil((eu.st.incubando.chocaEm-Date.now())/60000))+' min'})
      return ctx.reply(p.compacto(ctx,'🥚','Ovos Pokémon',linhas.length?linhas:[{emoji:'📭',texto:'Você não possui ovos'}]))
    }

    if (cmd === 'chocadeira') {
      if(eu.st.incubando){
        if(Date.now()<eu.st.incubando.chocaEm) return erroUso(ctx,'O ovo ainda está incubando. Faltam '+Math.ceil((eu.st.incubando.chocaEm-Date.now())/60000)+' minutos.')
        const egg=eu.st.incubando; eu.st.incubando=null
        const sp=p.especie(egg.id); const baby=p.adicionar(ctx,sp,{nivel:1,origem:'ovo',shiny:Math.random()<1/256})
        salvar(ctx)
        return p.enviarComImagem(ctx,p.imagem(sp),p.compacto(ctx,'🐣','Ovo chocado',[{emoji:baby.shiny?'✨':'🐣',texto:'Nasceu '+sp.name+(baby.shiny?' SHINY':'')},{emoji:'⭐',texto:'Nível 1'}]))
      }
      if(!eu.st.ovos.length) return erroUso(ctx,'Você não possui ovos para incubar.')
      const egg=eu.st.ovos.shift(); eu.st.incubando=Object.assign({},egg,{chocaEm:Date.now()+10*60*1000}); salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🥚','Chocadeira',[{emoji:'🔥',texto:'O ovo começou a incubar'},{emoji:'⏱️',texto:'Volte em aproximadamente 10 minutos'}]))
    }

    if (cmd === 'breedingpokemon') {
      const a=p.resolverDaColecao(eu.st,ctx.args && ctx.args[0]), b=p.resolverDaColecao(eu.st,ctx.args && ctx.args[1])
      if(!a||!b||a.uid===b.uid) return erroUso(ctx,'Use breedingpokemon ID1 ID2 com dois Pokémon diferentes da sua coleção.')
      if(eu.st.ovos.length>=5) return erroUso(ctx,'Você já possui 5 ovos aguardando incubação.')
      const custo=2500
      if(eco.coins<custo) return ctx.reply(ctx.mess.coinsSemSaldo(custo,eco.coins))
      eco.coins-=custo
      const escolhido=Math.random()<0.5?a:b
      eu.st.ovos.push({id:escolhido.id,pai1:a.nome,pai2:b.nome,criadoEm:Date.now()})
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🥚','Breeding Pokémon',[{emoji:'🥚',texto:'Um novo ovo foi gerado'},{emoji:'🔴',texto:a.nome+' + '+b.nome},{emoji:'🪙',texto:'Custo: '+p.dinheiro(custo)}]))
    }

    if (cmd === 'incensopokemon') {
      if(Number(eu.st.itens.incenso||0)<1) return erroUso(ctx,'Compre um Incenso no PokéMart.')
      eu.st.itens.incenso--
      const wild=p.spawn(ctx,{origem:'incenso'})
      salvar(ctx)
      return p.enviarComImagem(ctx,p.imagem(wild.id),p.compacto(ctx,'🪔','Incenso Pokémon',[{emoji:'👀',texto:wild.nome+' foi atraído pelo incenso'},{emoji:'🔴',texto:'Use '+ctx.prefix+'capturar'}]))
    }

    if (cmd === 'lurepokemon') {
      if(Number(eu.st.itens.lure||0)<1) return erroUso(ctx,'Compre um Lure no PokéMart.')
      eu.st.itens.lure--; p.mundo(ctx).lureAte=Date.now()+30*60*1000; salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🧲','Lure Pokémon',[{emoji:'⏱️',texto:'A chance de spawn selvagem foi aumentada no grupo por 30 minutos'}]))
    }

    if (cmd === 'trocapokemon') {
      const m=p.mundo(ctx)
      const acao=p.norm(ctx.args && ctx.args[0])
      if(acao==='aceitar'||acao==='recusar'){
        const pend=m.trocas.find(x=>x.para===ctx.normalizar(ctx.sender))
        if(!pend) return erroUso(ctx,'Você não possui troca pendente.')
        m.trocas=m.trocas.filter(x=>x!==pend)
        if(acao==='recusar'){salvar(ctx);return ctx.reply(p.compacto(ctx,'❌','Troca Pokémon',[{emoji:'❌',texto:'Troca recusada'}]))}
        const donoA=p.estado(ctx,pend.de), donoB=p.estado(ctx,pend.para)
        const pa=donoA.st.colecao.find(x=>x.uid===pend.uidA), pb=donoB.st.colecao.find(x=>x.uid===pend.uidB)
        if(!pa||!pb) return erroUso(ctx,'A troca expirou porque um dos Pokémon não está mais disponível.')
        donoA.st.colecao=donoA.st.colecao.filter(x=>x.uid!==pa.uid); donoB.st.colecao=donoB.st.colecao.filter(x=>x.uid!==pb.uid)
        pa.uid=pa.id+'-'+Date.now().toString(36)+'-a'; pb.uid=pb.id+'-'+Date.now().toString(36)+'-b'
        donoA.st.colecao.push(pb); donoB.st.colecao.push(pa)
        donoA.st.principalUid=donoA.st.colecao[0]&&donoA.st.colecao[0].uid||null; donoB.st.principalUid=donoB.st.colecao[0]&&donoB.st.colecao[0].uid||null
        p.sincronizarLegacy(donoA.u,donoA.st);p.sincronizarLegacy(donoB.u,donoB.st);salvar(ctx)
        return ctx.reply(p.compacto(ctx,'🔄','Troca Pokémon',[{emoji:'✅',texto:pa.nome+' e '+pb.nome+' foram trocados com sucesso'}]))
      }
      const jid=await alvo(ctx)
      if(!jid||jid===ctx.normalizar(ctx.sender)) return erroUso(ctx,'Use trocapokemon @usuario SEU_ID ID_DELE.')
      const ids=(ctx.args||[]).filter(x=>!String(x).startsWith('@'))
      const meu=p.resolverDaColecao(eu.st,ids[0]); const outroEstado=p.estado(ctx,jid); const dele=p.resolverDaColecao(outroEstado.st,ids[1])
      if(!meu||!dele) return erroUso(ctx,'Não encontrei um dos Pokémon informados.')
      m.trocas=m.trocas.filter(x=>x.para!==jid)
      m.trocas.push({de:ctx.normalizar(ctx.sender),para:jid,uidA:meu.uid,uidB:dele.uid,criadaEm:Date.now()}); salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🔄','Proposta de troca',[{emoji:'👤',texto:'@'+ctx.normalizar(ctx.sender).split('@')[0]+' oferece '+meu.nome},{emoji:'👤',texto:'Por '+dele.nome+' de @'+jid.split('@')[0]},{emoji:'✅',texto:'O destinatário usa '+ctx.prefix+'trocapokemon aceitar'}]),[ctx.sender,jid])
    }

    if (cmd === 'leilaopokemon') {
      const m=p.mundo(ctx)
      if(m.leilao && Number(m.leilao.terminaEm||0)>Date.now()) return erroUso(ctx,'Já existe um leilão ativo neste grupo.')
      const poke=p.resolverDaColecao(eu.st,ctx.args && ctx.args[0]); const minimo=Math.max(100,Number(ctx.args && ctx.args[1]||0))
      if(!poke||!minimo) return erroUso(ctx,'Use leilaopokemon ID valorMinimo.')
      m.leilao={vendedor:ctx.normalizar(ctx.sender),uid:poke.uid,nome:poke.nome,minimo,maior:null,terminaEm:Date.now()+10*60*1000}; salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🔨','Leilão Pokémon',[{emoji:'🔴',texto:poke.nome},{emoji:'🪙',texto:'Lance mínimo: '+p.dinheiro(minimo)},{emoji:'⏱️',texto:'Duração: 10 minutos'},{emoji:'📌',texto:'Use '+ctx.prefix+'lancepokemon valor'}]))
    }

    if (cmd === 'lancepokemon') {
      const m=p.mundo(ctx), l=m.leilao, valor=Number(ctx.args && ctx.args[0]||0)
      if(!l||l.terminaEm<=Date.now()) return erroUso(ctx,'Não existe leilão ativo.')
      if(l.vendedor===ctx.normalizar(ctx.sender)) return erroUso(ctx,'O vendedor não pode dar lance no próprio Pokémon.')
      const minimo=l.maior?l.maior.valor+100:l.minimo
      if(valor<minimo) return erroUso(ctx,'O lance mínimo agora é '+p.dinheiro(minimo)+'.')
      if(eco.coins<valor) return ctx.reply(ctx.mess.coinsSemSaldo(valor,eco.coins))
      l.maior={jid:ctx.normalizar(ctx.sender),valor}; salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🔨','Novo lance',[{emoji:'🪙',texto:'Maior lance: '+p.dinheiro(valor)},{emoji:'👤',texto:'@'+ctx.normalizar(ctx.sender).split('@')[0]}]),[ctx.sender])
    }

    if (cmd === 'raidpokemon') {
      const m=p.mundo(ctx)
      if(!m.raid||m.raid.terminaEm<=Date.now()){
        const id=p.escolha([144,145,146,150,151]); const sp=p.especie(id)
        m.raid={id,nome:sp.name,hp:5000,maxHp:5000,terminaEm:Date.now()+20*60*1000,danos:{},ultimoAtaque:{}}; salvar(ctx)
        return p.enviarComImagem(ctx,p.imagem(sp),p.compacto(ctx,'🐉','Raid Pokémon',[{emoji:'✨',texto:sp.name+' lendário apareceu!'},{emoji:'❤️',texto:'HP: 5000/5000'},{emoji:'⚔️',texto:'Use '+ctx.prefix+'raidpokemon novamente para atacar'}]))
      }
      const raid=m.raid, jid=ctx.normalizar(ctx.sender)
      const falta=60*1000-(Date.now()-Number(raid.ultimoAtaque[jid]||0))
      if(falta>0) return ctx.reply(ctx.mess.coinsCooldown(Math.ceil(falta/1000)))
      const poder=Math.max(20,Math.round(p.equipePoder(ctx)*0.25+p.sorte(10,50)))
      raid.ultimoAtaque[jid]=Date.now(); raid.danos[jid]=Number(raid.danos[jid]||0)+poder; raid.hp=Math.max(0,raid.hp-poder)
      if(raid.hp<=0){
        const top=Object.entries(raid.danos).sort((a,b)=>b[1]-a[1])[0]
        const vencedor=top&&top[0]; const sp=p.especie(raid.id)
        if(vencedor){
          const ev=r.eco(ctx,vencedor); ev.coins=Number(ev.coins||0)+5000
          p.adicionar(ctx,sp,{nivel:30,origem:'raid',shiny:Math.random()<1/64},vencedor)
        }
        m.raid=null; salvar(ctx)
        return ctx.reply(p.compacto(ctx,'🏆','Raid concluída',[{emoji:'🏆',texto:'O grupo derrotou '+sp.name},{emoji:'👑',texto:vencedor?'Maior dano: @'+vencedor.split('@')[0]:'Raid finalizada'},{emoji:'🎁',texto:vencedor?'O MVP recebeu o lendário + 5.000 N-Coins':'Recompensas distribuídas'}]),vencedor?[vencedor]:[])
      }
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🐉','Raid Pokémon',[{emoji:'⚔️',texto:'Você causou '+poder+' de dano'},{emoji:'❤️',texto:raid.nome+': '+raid.hp+'/'+raid.maxHp+' HP'}]))
    }

    if (cmd === 'lendariopokemon') {
      const lend=p.db.filter(x=>p.raridade(x)==='Lendário'||p.raridade(x)==='Mítico')
      const raid=p.mundo(ctx).raid
      return ctx.reply(p.compacto(ctx,'✨','Lendários Pokémon',[
        ...lend.slice(0,12).map(x=>({emoji:'✨',texto:'#'+x.id+' '+x.name})),
        {emoji:'🐉',texto:raid?'Raid ativa: '+raid.nome+' • '+raid.hp+' HP':'Nenhuma raid lendária ativa'}
      ]))
    }

    if (cmd === 'dailypokemon') {
      const hoje=new Date().toISOString().slice(0,10)
      const ultimo=eu.st.ultimoDaily?new Date(eu.st.ultimoDaily).toISOString().slice(0,10):''
      if(ultimo===hoje) return erroUso(ctx,'Você já coletou o bônus Pokémon de hoje.')
      const ontem=new Date(Date.now()-86400000).toISOString().slice(0,10)
      eu.st.streak=ultimo===ontem?Number(eu.st.streak||0)+1:1; eu.st.ultimoDaily=Date.now()
      const bolas=3+Math.min(7,eu.st.streak); const ganho=300+eu.st.streak*75
      eu.st.bolas.pokeball+=bolas; eco.coins+=ganho
      if(eu.st.streak%7===0) eu.st.bolas.ultraball++
      salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🎁','Daily Pokémon',[{emoji:'🔥',texto:'Streak: '+eu.st.streak+' dia(s)'},{emoji:'🔴',texto:'+'+bolas+' Poké Balls'},{emoji:'🪙',texto:'+'+p.dinheiro(ganho)},{emoji:'🟡',texto:eu.st.streak%7===0?'Bônus: +1 Ultra Ball':'Bônus semanal no 7º dia'}]))
    }

    if (cmd === 'streakpokemon') {
      return ctx.reply(p.compacto(ctx,'🔥','Streak Pokémon',[{emoji:'🔥',texto:'Sequência atual: '+Number(eu.st.streak||0)+' dia(s)'},{emoji:'🎁',texto:'Use '+ctx.prefix+'dailypokemon todos os dias'}]))
    }

    if (cmd === 'conquistapokemon') {
      const lista=p.conquistas(eu.st)
      return ctx.reply(p.compacto(ctx,'🏆','Conquistas Pokémon',lista.length?lista.map(x=>({emoji:'🏆',texto:x})):[{emoji:'📭',texto:'Nenhuma conquista desbloqueada ainda'}]))
    }

    if (cmd === 'titulopokemon') {
      const lista=p.titulos(eu.st); const nome=ctx.args && ctx.args.join(' ')
      if(!nome) return ctx.reply(p.compacto(ctx,'🎖️','Títulos Pokémon',[...lista.map(x=>({emoji:x===eu.st.tituloAtivo?'👑':'🎖️',texto:x})),{emoji:'📌',texto:'Use titulopokemon nome para equipar'}]))
      const achou=lista.find(x=>p.norm(x)===p.norm(nome))
      if(!achou) return erroUso(ctx,'Você ainda não desbloqueou esse título.')
      eu.st.tituloAtivo=achou; salvar(ctx)
      return ctx.reply(p.compacto(ctx,'🎖️','Título equipado',[{emoji:'👑',texto:achou}]))
    }
  }
})
