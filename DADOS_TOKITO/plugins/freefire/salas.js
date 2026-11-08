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

'use strict'
const crypto = require('crypto')
const h = require('./ffcore')
const dylan = require('../../database/lib/comandos')

const monitores = new Map()
const criando = new Set()
const MONITOR_MS = 5000
const PENDENTE_MS = 5 * 60 * 1000
let janelaConsultas=Date.now(),quantidadeConsultas=0
const podeConsultar=()=>{
  if(Date.now()-janelaConsultas>=60000){janelaConsultas=Date.now();quantidadeConsultas=0}
  if(quantidadeConsultas>=240)return false
  quantidadeConsultas++;return true
}
const modoPorId = id => h.MODOS_SALA.find(m=>m.id===id)
const destino = ctx => String(ctx.subId || ctx.tokito?.user?.id || 'principal')+'|'+String(ctx.from || '')
const usuario = ctx => typeof ctx.nJid==='function' ? ctx.nJid(ctx.sender) : String(ctx.sender || '')
const grupo = ctx => Array.isArray(ctx.dataGp) ? ctx.dataGp[0] : null
const ativa = ctx => grupo(ctx)?.salaApi?.sessionId ? grupo(ctx).salaApi : null
const gravar = (ctx, sala) => {
  const g=grupo(ctx)
  if (!g || typeof ctx.setGp!=='function') return false
  if (sala) g.salaApi=sala
  else delete g.salaApi
  ctx.setGp(ctx.dataGp)
  return true
}
const semSala = ctx => ctx.reply('- 🎮 *SEM SALA ATIVA*\n\n> ⚠️ Nenhuma sala foi criada neste grupo.\n> 🎮 Use '+ctx.prefix+'criarsala para selecionar o modo.')
const negado = ctx => ctx.reply('- ❌ *ACESSO NEGADO*\n\n> ⚠️ Somente quem criou esta sala neste grupo pode iniciar, encerrar ou expulsar jogadores.')
const donoDaSala = (ctx, sala) => Boolean(sala && sala.criador && sala.criador===usuario(ctx))
const urlBase = ctx => String(ctx.API_URL || '').replace(/\/+$/,'')+'/api/salas'
const reqSala = async (ctx,rota,params={}) => {
  const {data}=await ctx.axios.get(urlBase(ctx)+'/'+rota,{
    params:{apikey:h.tokenSala(ctx),...params},timeout:60000
  })
  if (!data?.success) {
    const e=new Error(h.retornoErro(data))
    e.status=Number(data?.statusCode || 502)
    throw e
  }
  return data
}
const menuGerencia = (ctx,texto) => h.menuListaSala(ctx,texto,'Gerenciar sala',[
  {texto:'🔎 Ver sala',descricao:'Detalhes da sala deste grupo',id:ctx.prefix+'versala'},
  {texto:'👥 Ver jogadores',descricao:'Nicks, UIDs e equipes',id:ctx.prefix+'jogadoressala'},
  {texto:'🖼️ Imagem dos jogadores',descricao:'Quadro da sala em PNG',id:ctx.prefix+'imagensala'},
  {texto:'🚀 Iniciar partida',descricao:'Exclusivo do criador',id:ctx.prefix+'iniciarsala'},
  {texto:'⛔ Encerrar sala',descricao:'Exclusivo do criador',id:ctx.prefix+'pararsala'}
])

const pararMonitor = ctx => {
  const key=destino(ctx),registro=monitores.get(key)
  if (registro?.timer) clearInterval(registro.timer)
  monitores.delete(key)
}
const alertarJogador = async (ctx, sala, player, total) => {
  const uid=String(player.uid || '').replace(/\D/g,'').slice(0,24)
  const nick=String(player.nickname || player.nick || 'Jogador').slice(0,75)
  const time=String(player.team || player.team_num || 'N/A').slice(0,25)
  const titulo='- 🎮 *NOVO JOGADOR NA SALA*'
  const mensagem=titulo+'\n\n> 👤 Nick: '+nick+
    '\n> 🆔 UID: '+(uid || 'Indisponível')+
    '\n> 🔵 Equipe: '+time+
    '\n> 🎯 Modo: '+(sala.modeName || sala.mode || 'Free Fire')+
    '\n> 👥 Jogadores: '+total+'/'+(sala.maxPlayers || 8)+
    (uid?'\n> 🔎 Perfil: '+ctx.prefix+'infoff '+uid:'')+
    '\n\n> 👥 Para ver a lista: '+ctx.prefix+'jogadoressala'
  const avatar=String(player.avatar || '')
  try {
    if (/^https:\/\/tokito-apis\.com\.br\/api\/v1\/player\/imagem\/\d{6,18}\.png$/i.test(avatar)) {
      await ctx.tokito.sendMessage(ctx.from,{image:{url:avatar},caption:mensagem},{quoted:ctx.selo})
      return
    }
  } catch (_) {}
  await ctx.tokito.sendMessage(ctx.from,{text:mensagem},{quoted:ctx.selo})
}
// O serviço de salas atual não oferece evento/webhook de entrada. O aviso usa
// consultas leves enquanto a sessão estiver ativa, sem propagandas de
// "instantâneo". Deixar um monitor por grupo e nenhuma consulta duplicada.
function monitorarSala(ctx, inicial=false) {
  if (!ctx?.isGroup || !ativa(ctx) || ativa(ctx).status !== 'active' || !ctx.axios?.get || !ctx.tokito?.sendMessage) return false
  const key=destino(ctx),sala=ativa(ctx),atual=monitores.get(key)
  if (atual && atual.sessionId===sala.sessionId) return true
  if (atual) pararMonitor(ctx)
  const registro={
    sessionId:sala.sessionId,seen:inicial?new Set():null,busy:false,errors:0,timer:null,
    ctx,sala
  }
  const verificar=async()=>{
    if (registro.busy || monitores.get(key)!==registro || !podeConsultar() || (registro.errors>0 && Date.now() < (registro.retryAfter||0))) return
    registro.busy=true
    try {
      const r=await ctx.axios.get(urlBase(ctx)+'/jogadores',{
        params:{apikey:h.tokenSala(ctx),sessionId:registro.sessionId},
        timeout:18000
      })
      const data=r.data
      if (!data?.success || !Array.isArray(data.players)) {
        if (data?.sessionEnded || Number(r.status)===404) pararMonitor(ctx)
        return
      }
      const players=data.players
      const atuais=new Set(players.map(p=>String(p.uid || '')).filter(Boolean))
      if (registro.seen!==null) {
        const novos=players.filter(p=>p.uid && !registro.seen.has(String(p.uid)))
        for (const jogador of novos.slice(0,5)) {
          try {await alertarJogador(ctx,registro.sala,jogador,players.length)}
          catch(e){console.log('[SALAS AVISO]',e?.message)}
        }
        if (novos.length>5) {
          try{await ctx.tokito.sendMessage(ctx.from,{
            text:'- 🎮 *JOGADORES NA SALA*\n\n> 👥 Mais '+(novos.length-5)+' jogador(es) entraram.\n> 🔎 Use '+ctx.prefix+'jogadoressala para ver todos.'
          })}catch(_){}
        }
      }
      registro.seen=atuais
      registro.errors=0
    } catch(error) {
      registro.errors++
      if ([404,410].includes(Number(error?.response?.status))) {
        pararMonitor(ctx)
        if (ativa(ctx)?.sessionId === registro.sessionId) gravar(ctx,null)
      }
      if (Number(error?.response?.status)===429){registro.errors=20;registro.retryAfter=Date.now()+60000}
      else registro.retryAfter=Date.now()+Math.min(30000,registro.errors*5000)
      if (registro.errors===5) console.log('[SALAS] Monitor de entradas sem resposta:',error?.message)
    } finally {registro.busy=false}
  }
  monitores.set(key,registro)
  registro.timer=setInterval(verificar,MONITOR_MS)
  registro.timer.unref?.()
  // Um novo grupo tem lista vazia; após reiniciar o bot cria baseline para
  // não anunciar falsamente todos os jogadores já presentes.
  verificar().catch(()=>{})
  return true
}

dylan.setCommand({
  nome:'criarsala',
  comandos:['criarsala','versala','jogadoressala','imagensala','expulsarsala','iniciarsala','pararsala','statussalas'],
  categoria:'freefire',
  info:{descricao:'Cria e gerencia salas no próprio grupo, por lista de modos.',uso:'criarsala',categoria:'freefire'},
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    const command=String(ctx.command || '').toLowerCase()
    const argumento=String(ctx.q || '').trim()
    const salaAtiva=ativa(ctx)
    if (salaAtiva) monitorarSala(ctx,false)
    try {
      if (command==='criarsala') {
        await ctx.reagir(ctx.from,'🎮').catch(()=>{})
        const args=argumento.split(/\s+/)
        if (!argumento) {
          if (salaAtiva) return menuGerencia(ctx,
            '- 🎮 *SALA ATIVA NESTE GRUPO*\n\n> 🆔 ID: '+(salaAtiva.roomId || 'N/A')+
            '\n> 🎯 Modo: '+(salaAtiva.modeName || 'Free Fire')+
            '\n> 👤 Criador: '+(salaAtiva.criadorNome || 'Jogador')+
            '\n\n> 📋 Escolha uma opção na lista.')
          return h.menuListaSala(ctx,
            '- 🎮 *CRIAR SALA FREE FIRE*\n\n> 🎯 Escolha um dos modos para criar uma sala neste grupo.\n> 📋 A criação só acontece depois de apertar *Criar sala*.',
            'Escolher modo',h.MODOS_SALA.map(m=>({
              texto:'🎮 '+m.nome,descricao:'Até '+m.limite+' jogadores',
              id:ctx.prefix+'criarsala selecionar '+m.id
            })))
        }
        if (args[0]==='selecionar') {
          if (salaAtiva) return ctx.reply('- 🎮 Já existe uma sala neste grupo. Use '+ctx.prefix+'versala.')
          const modo=modoPorId(args[1])
          if (!modo) return ctx.reply(ctx.mess.ffSalaUso(ctx.prefix))
          const u=usuario(ctx),g=grupo(ctx),nonce=crypto.randomBytes(8).toString('hex')
          if (!u||!g) return ctx.reply(ctx.mess.ffErro('Grupo não identificado.'))
          const pendentes=g.salaApiPendentes && typeof g.salaApiPendentes==='object'?g.salaApiPendentes:{}
          for(const [jid,item] of Object.entries(pendentes)){
            if(Date.now()-Number(item?.criadoEm)>PENDENTE_MS)delete pendentes[jid]
          }
          pendentes[u]={modo:modo.id,nonce,criadoEm:Date.now()}
          g.salaApiPendentes=pendentes
          ctx.setGp(ctx.dataGp)
          const resumo='- 🎮 *CONFIRMAR CRIAÇÃO DE SALA*\n\n> 🎯 Modo: '+modo.nome+
            '\n> 👥 Capacidade: '+modo.limite+' jogadores'+
            '\n> 🗺️ Mapa: Bermuda\n> 🌎 Região: BR\n> ⏱️ Início automático: 10 minutos'+
            '\n> 🔑 Senha: gerada automaticamente\n\n> ✅ Aperte *Criar sala* para confirmar. Será consumido um crédito apenas se a criação for confirmada.'
          if (!ctx.isBotoes) return ctx.reply(resumo+'\n\n> Para confirmar: '+ctx.prefix+'criarsala confirmar '+nonce)
          return h.enviar(ctx,resumo,[{
            texto:'✅ Criar sala',id:ctx.prefix+'criarsala confirmar '+nonce
          },{texto:'❌ Cancelar',id:ctx.prefix+'criarsala cancelar'}],[ctx.sender])
        }
        if (args[0]==='cancelar') {
          const g=grupo(ctx),u=usuario(ctx)
          if (g?.salaApiPendentes)delete g.salaApiPendentes[u]
          if(g)ctx.setGp(ctx.dataGp)
          return ctx.reply('- 🎮 *CRIAÇÃO CANCELADA*\n\n> Nenhuma sala foi criada.')
        }
        if (args[0]==='confirmar') {
          const g=grupo(ctx),u=usuario(ctx),pendente=g?.salaApiPendentes?.[u]
          if(!pendente || pendente.nonce!==args[1] ||
            Date.now()-Number(pendente.criadoEm)>PENDENTE_MS)
            return ctx.reply('- ⚠️ Esta confirmação expirou ou pertence a outro jogador.\n> Use '+ctx.prefix+'criarsala novamente.')
          const modo=modoPorId(pendente.modo)
          if(!modo) return ctx.reply(ctx.mess.ffSalaUso(ctx.prefix))
          const key=destino(ctx)
          if(ativa(ctx)||criando.has(key))return ctx.reply('- ⚠️ Já existe uma sala ativa ou em criação neste grupo.')
          criando.add(key)
          try {
            const roomName=String(ctx.groupName || 'Sala Tokito').replace(/[<>]/g,'').slice(0,40)
            const roomPassword=String(crypto.randomInt(1000,10000))
            const data=await reqSala(ctx,'criar',{
              roomName,roomPassword,configType:modo.id,mapName:'Bermuda',
              startDelayMinutes:10,region:'BR',...(modo.id==='br_padrao'?{equipe:'squad',espectadores:30}:{})
            })
            const sala=data.room||{}
            const sessionId=String(sala.sessionId || data.sessionId || '')
            if (!sessionId) return ctx.reply(ctx.mess.ffErro('A API não retornou uma sessão válida. Confira sua sala no painel.'))
            const criada={
              sessionId,roomId:String(sala.roomId || ''),roomName,
              password:String(sala.password || roomPassword),mode:modo.id,
              modeName:String(sala.modeName || modo.nome),
              maxPlayers:Number(sala.maxPlayers || modo.limite),mapName:'Bermuda',
              region:'BR',status:'active',criador:u,criadorNome:ctx.pushname||'Jogador',
              criadoEm:Date.now()
            }
            gravar(ctx,criada)
            if(g?.salaApiPendentes)delete g.salaApiPendentes[u]
            monitorarSala(ctx,true)
            await ctx.reagir(ctx.from,'✅').catch(()=>{})
            return menuGerencia(ctx,ctx.mess.ffSalaCriada({
              NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,sala,roomName,
              roomPassword:criada.password,maxPlayers:criada.maxPlayers,
              mode:criada.modeName,region:'BR',data
            }))
          } finally {criando.delete(key)}
        }
        return ctx.reply(ctx.mess.ffSalaUso(ctx.prefix))
      }

      if (command==='statussalas') {
        const data=await reqSala(ctx,'status')
        return ctx.reply(ctx.mess.ffStatusApi({NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,data}))
      }
      if (!salaAtiva) return semSala(ctx)
      if (['iniciarsala','pararsala','expulsarsala'].includes(command) && !donoDaSala(ctx,salaAtiva))
        return negado(ctx)

      if(command==='versala') {
        const data=await reqSala(ctx,'info',{sessionId:salaAtiva.sessionId})
        const sala=data.room||{}
        const segundos=Number(sala.autoStart?.remainingSeconds||0)
        const tempo=segundos>0 ? Math.floor(segundos/60)+'m '+(segundos%60)+'s' :
          (sala.status==='started'?'Iniciada':'Aguardando')
        const texto=ctx.mess.ffSalaInfo({
          NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,
          sala:{...sala,roomId:sala.roomId||salaAtiva.roomId,
            modeName:sala.modeName||salaAtiva.modeName},tempo
        })
        return menuGerencia(ctx,texto)
      }
      if(command==='jogadoressala') {
        const data=await reqSala(ctx,'jogadores',{sessionId:salaAtiva.sessionId})
        const players=Array.isArray(data.players)?data.players:[]
        const texto=ctx.mess.ffJogadores({
          NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,players,
          total:data.memberCount ?? data.total ?? players.length
        })
        return h.enviar(ctx,texto,h.botoesSala(ctx,'active',['imagem','ver','iniciar']),[ctx.sender])
      }
      if(command==='imagensala') {
        const response=await ctx.axios.get(urlBase(ctx)+'/jogadores/imagem',{
          params:{apikey:h.tokenSala(ctx),sessionId:salaAtiva.sessionId},
          responseType:'arraybuffer',timeout:60000,maxContentLength:12*1024*1024
        })
        const imagem=Buffer.from(response.data || [])
        if (imagem.length<8 || imagem[0]!==137 || imagem[1]!==80 ||
            imagem[2]!==78 || imagem[3]!==71) throw Error('A API não retornou um PNG válido.')
        return ctx.tokito.sendMessage(ctx.from,{
          image:imagem,mimetype:'image/png',
          caption:'- 🖼️ *JOGADORES DA SALA*\n\n> 🆔 ID: '+(salaAtiva.roomId||'N/A')+
            '\n> 🎯 Modo: '+salaAtiva.modeName
        },{quoted:ctx.selo})
      }
      if(command==='expulsarsala') {
        const targetUid=argumento.replace(/\D/g,'')
        if (!/^\d{5,24}$/.test(targetUid)||argumento!==targetUid)
          return ctx.reply(ctx.mess.ffExpulsarUso(ctx.prefix))
        const data=await reqSala(ctx,'expulsar',{sessionId:salaAtiva.sessionId,targetUid})
        return ctx.reply(ctx.mess.ffExpulso({
          NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,targetUid,message:data.message
        }))
      }
      if(command==='iniciarsala') {
        if(salaAtiva.status==='started')return ctx.reply('- 🚀 Esta partida já foi iniciada.')
        const data=await reqSala(ctx,'iniciar',{sessionId:salaAtiva.sessionId})
        gravar(ctx,{...salaAtiva,status:'started'})
        pararMonitor(ctx)
        return ctx.reply(ctx.mess.ffSalaIniciada({
          NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,
          sessionId:salaAtiva.sessionId,message:data.message
        }))
      }
      if(command==='pararsala') {
        await reqSala(ctx,'parar',{sessionId:salaAtiva.sessionId})
        pararMonitor(ctx)
        gravar(ctx,null)
        return ctx.reply(ctx.mess.ffSalaParada({
          NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,
          sessionId:salaAtiva.sessionId
        }))
      }
    }catch(error){
      console.log('[FREE FIRE SALAS]',h.apiErro(error))
      await ctx.reagir(ctx.from,'❌').catch(()=>{})
      if ([404,410].includes(Number(error?.response?.status))) {
        return ctx.reply('- ⚠️ A sessão desta sala não está mais disponível na API.')
      }
      return ctx.reply(ctx.mess.ffErro(h.apiErro(error)))
    }
  }
})
module.exports={monitorarSala,pararMonitor}
