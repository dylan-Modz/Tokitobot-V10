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
const semSala = ctx => ctx.reply('- 🎮 \x60𝚂𝙴𝙼 𝚂𝙰𝙻𝙰 𝙰𝚃𝙸𝚅𝙰\x60\n\n> ⚠️ ׄ ( ɴᴇɴʜᴜᴍᴀ sᴀʟᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )\n> 🎮 ׄ ( ᴜsᴇ '+ctx.prefix+'criarsala ᴘᴀʀᴀ ᴇsᴄᴏʟʜᴇʀ ᴏ ᴍᴏᴅᴏ. )')
const negado = ctx => ctx.reply('- ❌ \x60𝙰𝙲𝙴𝚂𝚂𝙾 𝙽𝙴𝙶𝙰𝙳𝙾\x60\n\n> 🔒 ׄ ( sᴏᴍᴇɴᴛᴇ ᴏ ᴄʀɪᴀᴅᴏʀ ᴅᴀ sᴀʟᴀ ᴘᴏᴅᴇ ɪɴɪᴄɪᴀʀ, ᴇɴᴄᴇʀʀᴀʀ ᴏᴜ ᴇxᴘᴜʟsᴀʀ. )')
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
const menuGerencia = (ctx,texto,sala=ativa(ctx)) => h.menuListaSala(ctx,texto,'Gerenciar sala',[
  {texto:'🔎⃞ ᴠᴇʀ sᴀʟᴀ',descricao:'🆔 ɪᴅ ᴇ ɪɴғᴏʀᴍᴀᴄ̧ᴏ̃ᴇs',id:ctx.prefix+'versala'},
  {texto:'👥⃞ ᴠᴇʀ ᴊᴏɢᴀᴅᴏʀᴇs',descricao:'👤 ɴɪᴄᴋs, ᴜɪᴅs ᴇ ᴇǫᴜɪᴘᴇs',id:ctx.prefix+'jogadoressala'},
  {texto:'🖼️⃞ ɪᴍᴀɢᴇᴍ ᴅᴀ sᴀʟᴀ',descricao:'🖼️ ǫᴜᴀᴅʀᴏ ᴘɴɢ',id:ctx.prefix+'imagensala'},
  ...(h.linkConviteSala(sala?.inviteLink)?[{texto:'🎮⃞ ᴇɴᴛʀᴀʀ ɴᴀ sᴀʟᴀ',descricao:'🌐 ʟɪɴᴋ ᴅᴏ ғʀᴇᴇ ғɪʀᴇ',id:ctx.prefix+'entrarsala'}]:[]),
  {texto:'🚀⃞ ɪɴɪᴄɪᴀʀ ᴘᴀʀᴛɪᴅᴀ',descricao:'🔒 sᴏᴍᴇɴᴛᴇ ᴏ ᴄʀɪᴀᴅᴏʀ',id:ctx.prefix+'iniciarsala'},
  {texto:'⛔⃞ ᴇɴᴄᴇʀʀᴀʀ sᴀʟᴀ',descricao:'🔒 sᴏᴍᴇɴᴛᴇ ᴏ ᴄʀɪᴀᴅᴏʀ',id:ctx.prefix+'pararsala'}
],{inviteLink:sala?.inviteLink})

const pararMonitor = ctx => {
  const key=destino(ctx),registro=monitores.get(key)
  if (registro?.timer) clearInterval(registro.timer)
  monitores.delete(key)
}
const alertarJogador = async (ctx, sala, player, total) => {
  const uid=String(player.uid || '').replace(/\D/g,'').slice(0,24)
  const nick=String(player.nickname || player.nick || 'Jogador').slice(0,75)
  const time=String(player.team || player.team_num || 'N/A').slice(0,25)
  const titulo='- 🎮 \x60𝙽𝙾𝚅𝙾 𝙹𝙾𝙶𝙰𝙳𝙾𝚁 𝙽𝙰 𝚂𝙰𝙻𝙰\x60'
  const mensagem=titulo+'\n\n'+
    '> 👤 ׄ ( ɴɪᴄᴋ: '+nick+' )\n'+
    '> 🆔 ׄ ( ᴜɪᴅ: '+(uid || 'Indisponível')+' )\n'+
    '> 🔵 ׄ ( ᴇǫᴜɪᴘᴇ: '+time+' )\n'+
    '> 🎯 ׄ ( ᴍᴏᴅᴏ: '+(sala.modeName || sala.mode || 'Free Fire')+' )\n'+
    '> 👥 ׄ ( ᴊᴏɢᴀᴅᴏʀᴇs: '+total+'/'+(sala.maxPlayers || 8)+' )\n'+
    (uid?'> 🔎 ׄ ( ᴘᴇʀғɪʟ: '+ctx.prefix+'infoff '+uid+' )\n':'')+
    '\n> 📋 ׄ ( ʟɪsᴛᴀ ᴅᴀ sᴀʟᴀ: '+ctx.prefix+'jogadoressala )'
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
  comandos:['criarsala','versala','jogadoressala','imagensala','entrarsala','expulsarsala','iniciarsala','pararsala','statussalas'],
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
          if (salaAtiva && salaAtiva.status!=='started') return menuGerencia(ctx,
            '- 🎮 \x60𝚂𝙰𝙻𝙰 𝙰𝚃𝙸𝚅𝙰 𝙽𝙾 𝙶𝚁𝚄𝙿𝙾\x60\n\n> 🆔 ׄ ( ɪᴅ: '+(salaAtiva.roomId || 'N/A')+
            ' )\n> 🎯 ׄ ( ᴍᴏᴅᴏ: '+(salaAtiva.modeName || 'Free Fire')+
            ' )\n> 👤 ׄ ( ᴄʀɪᴀᴅᴏʀ: '+(salaAtiva.criadorNome || 'Jogador')+
            ' )\n\n> 📋 ׄ ( ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ ɴᴀ ʟɪsᴛᴀ. )')
          return h.menuListaSala(ctx,
            '- 🎮 \x60𝙲𝚁𝙸𝙰𝚁 𝚂𝙰𝙻𝙰 𝙵𝙵\x60\n\n> 🎯 ׄ ( ᴇsᴄᴏʟʜᴀ ᴏ ᴍᴏᴅᴏ ɴᴏ ᴍᴇɴᴜ ʟɪsᴛ. )\n> 📋 ׄ ( ᴅᴇᴘᴏɪs ᴄʟɪǫᴜᴇ ᴇᴍ *ᴄʀɪᴀʀ sᴀʟᴀ*. )',
            'Escolher modo',h.MODOS_SALA.map(m=>({
              texto:'🎮⃞ '+({ap_padrao:'ᴀᴘ ᴘᴀᴅʀᴀ̃ᴏ',gelo_inf:'ɢᴇʟᴏ ɪɴғɪɴɪᴛᴏ',tatico:'ᴍᴏᴅᴏ ᴛᴀ́ᴛɪᴄᴏ',ap_fullcapa:'ғᴜʟʟ ᴄᴀᴘᴀ',capa_3:'ᴄᴀᴘᴀ 3',ap_uxd:'ᴀᴘ ᴜxᴅ',ap_7r:'ᴀᴘ 7ʀ',br_padrao:'ʙᴀᴛᴛʟᴇ ʀᴏʏᴀʟᴇ'}[m.id]||m.nome),descricao:'👥 ᴀᴛᴇ́ '+m.limite+' ᴊᴏɢᴀᴅᴏʀᴇs',
              id:ctx.prefix+'criarsala selecionar '+m.id
            })))
        }
        if (args[0]==='selecionar') {
          if (salaAtiva && salaAtiva.status!=='started') return ctx.reply('- 🎮 Já existe uma sala neste grupo. Use '+ctx.prefix+'versala.')
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
          const resumo='- 🎮 \x60𝙲𝙾𝙽𝙵𝙸𝚁𝙼𝙰𝚁 𝚂𝙰𝙻𝙰\x60\n\n'+
            '> 🎯 ׄ ( ᴍᴏᴅᴏ: '+modo.nome+' )\n'+
            '> 👥 ׄ ( ᴠᴀɢᴀs: '+modo.limite+' ᴊᴏɢᴀᴅᴏʀᴇs )\n'+
            '> 🗺️ ׄ ( ᴍᴀᴘᴀ: ʙᴇʀᴍᴜᴅᴀ )\n'+
            '> 🌎 ׄ ( ʀᴇɢɪᴀ̃ᴏ: ʙʀ )\n'+
            '> ⏱️ ׄ ( ɪɴɪ́ᴄɪᴏ: 10 ᴍɪɴᴜᴛᴏs )\n'+
            '> 🔐 ׄ ( sᴇɴʜᴀ ɢᴇʀᴀᴅᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ )\n\n'+
            '> ✅ ׄ ( ᴄʟɪǫᴜᴇ ᴇᴍ ᴄʀɪᴀʀ sᴀʟᴀ ᴘᴀʀᴀ ᴄᴏɴғɪʀᴍᴀʀ. )\n'+
            '> 🎫 ׄ ( sᴏ́ ᴄᴏɴsᴏᴍᴇ sᴀʟᴅᴏ sᴇ ᴀ ᴀᴘɪ ᴄʀɪᴀʀ ᴀ sᴀʟᴀ. )'
          return h.menuListaSala(ctx,resumo,'Confirmar sala',[{
            texto:'✅ ᴄʀɪᴀʀ sᴀʟᴀ',descricao:'ᴄᴏɴғɪʀᴍᴀʀ ᴀ ᴄʀɪᴀᴄ̧ᴀ̃ᴏ',id:ctx.prefix+'criarsala confirmar '+nonce
          },{texto:'❌ ᴄᴀɴᴄᴇʟᴀʀ',descricao:'ɴᴇɴʜᴜᴍ ᴄʀᴇ́ᴅɪᴛᴏ ᴜsᴀᴅᴏ',id:ctx.prefix+'criarsala cancelar'}])
        }
        if (args[0]==='cancelar') {
          const g=grupo(ctx),u=usuario(ctx)
          if (g?.salaApiPendentes)delete g.salaApiPendentes[u]
          if(g)ctx.setGp(ctx.dataGp)
          return ctx.reply('- 🎮 \x60𝙲𝚁𝙸𝙰𝙲̧𝙰̃𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰\x60\n\n> ✅ ׄ ( ɴᴇɴʜᴜᴍᴀ sᴀʟᴀ ғᴏɪ ᴄʀɪᴀᴅᴀ. )')
        }
        if (args[0]==='confirmar') {
          const g=grupo(ctx),u=usuario(ctx),pendente=g?.salaApiPendentes?.[u]
          if(!pendente || pendente.nonce!==args[1] ||
            Date.now()-Number(pendente.criadoEm)>PENDENTE_MS)
            return ctx.reply('- ⚠️ \x60𝙲𝙾𝙽𝙵𝙸𝚁𝙼𝙰𝙲̧𝙰̃𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\x60\n\n> 🔒 ׄ ( ᴇsᴛᴀ ᴄᴏɴғɪʀᴍᴀᴄ̧ᴀ̃ᴏ ᴇxᴘɪʀᴏᴜ ᴏᴜ ɴᴀ̃ᴏ ᴇ́ sᴜᴀ. )\n> 🎮 ׄ ( ᴜsᴇ '+ctx.prefix+'criarsala ɴᴏᴠᴀᴍᴇɴᴛᴇ. )')
          const modo=modoPorId(pendente.modo)
          if(!modo) return ctx.reply(ctx.mess.ffSalaUso(ctx.prefix))
          const key=destino(ctx)
          if((ativa(ctx)&&ativa(ctx).status!=='started')||criando.has(key))return ctx.reply('- ⚠️ Já existe uma sala ativa ou em criação neste grupo.')
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
              region:'BR',status:'active',
              inviteLink:h.linkConviteSala(sala.inviteLink||data.inviteLink)||null,
              inviteCode:String(sala.inviteCode||'').slice(0,120)||null,
              criador:u,criadorNome:ctx.pushname||'Jogador',
              criadoEm:Date.now()
            }
            gravar(ctx,criada)
            if(g?.salaApiPendentes)delete g.salaApiPendentes[u]
            monitorarSala(ctx,true)
            await ctx.reagir(ctx.from,'✅').catch(()=>{})
            return menuGerencia(ctx,ctx.mess.ffSalaCriada({
              NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,
              sala:{...sala,inviteLink:criada.inviteLink,inviteCode:criada.inviteCode},roomName,
              roomPassword:criada.password,maxPlayers:criada.maxPlayers,
              mode:criada.modeName,region:'BR',data
            }),criada)
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
        const inviteLink=h.linkConviteSala(sala.inviteLink||salaAtiva.inviteLink)
        const convite={...salaAtiva,inviteLink:inviteLink||null,
          inviteCode:String(sala.inviteCode||salaAtiva.inviteCode||'').slice(0,120)||null}
        if (inviteLink && inviteLink!==salaAtiva.inviteLink) gravar(ctx,convite)
        const segundos=Number(sala.autoStart?.remainingSeconds||0)
        const tempo=segundos>0 ? Math.floor(segundos/60)+'m '+(segundos%60)+'s' :
          (sala.status==='started'?'Iniciada':'Aguardando')
        const texto=ctx.mess.ffSalaInfo({
          NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,
          sala:{...convite,...sala,roomId:sala.roomId||salaAtiva.roomId,
            inviteLink,modeName:sala.modeName||salaAtiva.modeName},tempo
        })
        return menuGerencia(ctx,texto,convite)
      }
      if(command==='entrarsala') {
        let link=h.linkConviteSala(salaAtiva.inviteLink)
        if(!link) {
          const info=await reqSala(ctx,'info',{sessionId:salaAtiva.sessionId})
          link=h.linkConviteSala(info.room?.inviteLink)
          if(link) gravar(ctx,{...salaAtiva,inviteLink:link})
        }
        if(!link) {
          return ctx.reply('- 🎮 \x60𝙴𝙽𝚃𝚁𝙰𝚁 𝙽𝙰 𝚂𝙰𝙻𝙰\x60\n\n'+
            '> ⚠️ ׄ ( ᴀ ᴀᴘɪ ɴᴀ̃ᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴜᴍ ʟɪɴᴋ ᴅᴇ ᴄᴏɴᴠɪᴛᴇ. )\n'+
            '> 🆔 ׄ ( ɪᴅ: '+(salaAtiva.roomId||'N/A')+' )\n'+
            '> 🔑 ׄ ( sᴇɴʜᴀ: '+(salaAtiva.password||'N/A')+' )\n'+
            '> 🎮 ׄ ( ᴇɴᴛʀᴇ ɴᴀ sᴀʟᴀ ᴘᴇʟᴏ ɪᴅ ɴᴏ ᴊᴏɢᴏ. )')
        }
        return ctx.reply(ctx.mess.ffConviteSala({
          roomId:salaAtiva.roomId,modeName:salaAtiva.modeName,link
        }))
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
          caption:ctx.mess.ffImagemSala({
            NomeDoBot:ctx.NomeDoBot,pushname:ctx.pushname,
            sala:salaAtiva,inviteLink:h.linkConviteSala(salaAtiva.inviteLink)
          })
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
        if(salaAtiva.status==='started')return ctx.reply('- 🚀 \x60𝙿𝙰𝚁𝚃𝙸𝙳𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙰\x60\n\n> ⚠️ ׄ ( ᴇsᴛᴀ ᴘᴀʀᴛɪᴅᴀ ᴊᴀ́ ғᴏɪ ɪɴɪᴄɪᴀᴅᴀ. )')
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
