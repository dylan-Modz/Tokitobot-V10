/* TOKITO V10 - Registro dos novos membros integrado ao perfil - Dylan Modz */
const fs=require('fs'), path=require('path')
const {proto,prepareWAMessageMedia,generateWAMessageFromContent}=require('baileys')
const ROOT=path.join(__dirname,'..','database','sistemas')
const DIR=path.join(ROOT,'registro'), OLD=path.join(ROOT,'passaporte')
const BT=String.fromCharCode(96)
const TIT='- 🧊 '+BT+'𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝙳𝙾 𝚃𝙾𝙺𝙸𝚃𝙾'+BT
const clean=(v,n=160)=>String(v||'').replace(/[\x00-\x1f\x7f]/g,' ').replace(/\s+/g,' ').trim().slice(0,n)
const safe=v=>String(v||'').replace(/[^a-zA-Z0-9@._-]/g,'_').slice(0,160)
const jid=v=>{
  const t=String(v||'').trim().replace(/@c\.us$/,'@s.whatsapp.net').split('@')
  return t.length===2?t[0].split(':')[0]+'@'+t[1]:''
}
const ids=v=>typeof v==='string'?[jid(v)].filter(Boolean):
  [v?.phoneNumber,v?.participantAlt,v?.participantPn,v?.jid,v?.id,v?.lid,v?.participant].map(jid).filter(Boolean)
const resolve=(v,membros=[])=>{
  const values=ids(v);if(!values.length)return ''
  const meta=membros.find(x=>ids(x).some(a=>values.includes(a)))
  const all=[...ids(meta),...values]
  return all.find(id=>id.endsWith('@s.whatsapp.net'))||all[0]||''
}
const local=(g,sub='',old=false)=>{
  if(!String(g||'').endsWith('@g.us'))throw Error('Grupo invalido')
  return path.join(old?OLD:DIR,safe(sub)||'principal',safe(g)+'.json')
}
const read=(g,sub='')=>{
  let a
  for(const file of [local(g,sub),local(g,sub,true)]){
    try{a=JSON.parse(fs.readFileSync(file,'utf8'));break}catch{}
  }
  const obj=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{}
  return {pendentes:obj(a?.pendentes),perfis:obj(a?.perfis),etapas:obj(a?.etapas)}
}
const save=(g,sub,data)=>{
  const file=local(g,sub),tmp=file+'.'+process.pid+'.tmp'
  fs.mkdirSync(path.dirname(file),{recursive:true})
  fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n')
  fs.renameSync(tmp,file)
}
const scope=ctx=>ctx?.runtimeSub?.isSubBot?String(ctx.runtimeSub.id||'sub'):''
const self=ctx=>resolve(ctx.sender,ctx.groupMembers||[])
const enabled=ctx=>ctx?.isGroup===true&&(
  typeof ctx?.dataGp?.[0]?.funcoes?.registrar==='boolean'?
  ctx.dataGp[0].funcoes.registrar:ctx?.dataGp?.[0]?.funcoes?.passaporte===true
)
const admin=ctx=>ctx.SoDono||ctx.isGroupAdmins||ctx?.info?.key?.fromMe===true
const pfx=ctx=>String(ctx.prefix||'!')
const mention=v=>'@'+String(v||'').split('@')[0]
const reply=(ctx,txt)=>ctx.reply(txt,ctx.sender?[ctx.sender]:[])
const PRAZO_MS = 10 * 60 * 1000
const PRAZO_MINUTOS = PRAZO_MS / 60000
const passos = ['nome', 'idade', 'cidade']
const proxima = { nome:'idade', idade:'cidade' }
const agora = () => Date.now()
const tempo = ms => {
  const segundos = Math.max(0, Math.ceil(ms / 1000))
  return String(Math.floor(segundos / 60)).padStart(2, '0') + ':' + String(segundos % 60).padStart(2, '0')
}
const pendencia = (data,id) => {
  const p = data.pendentes[id]
  if (!p) return null
  if (!Number.isFinite(Number(p.expiraEm))) {
    p.expiraEm = agora() + PRAZO_MS
    p.expirado = false
  }
  return p
}
const instrucoes = (fase,restante) => {
  const texto = {
    nome:'> 👤 1/3 — Qual é seu nome ou apelido?\n> Envie de 2 a 32 caracteres.',
    idade:'> 🎂 2/3 — Qual é sua idade?\n> Digite sua idade (13 a 120) ou *pular*.',
    cidade:'> 🌆 3/3 — Em qual cidade você mora?\n> Digite o nome da cidade ou *pular*.'
  }[fase] || ''
  return TIT + '\n\n' + texto + '\n\n> ⏳ Tempo restante: *' + tempo(restante) + '*'
}
const avisarExpiracao = (id) =>
  TIT + '\n\n> ⏰ Prazo de ' + PRAZO_MINUTOS + ' minutos encerrado, ' + mention(id) + '.' +
  '\n> 🔒 Seu cadastro ficou incompleto. Os comandos continuam bloqueados.' +
  '\n> 🔁 Use o botão REGISTRAR ou o comando de registro para começar novamente.'
const marcarExpirado = (data,id) => {
  const p = pendencia(data,id)
  if (!p || p.expirado || Number(p.expiraEm) > agora()) return false
  p.expirado = true
  delete data.etapas[id]
  return true
}
async function start(ctx) {
  if (!enabled(ctx)) return reply(ctx,'> ⚠️ O registro está desativado neste grupo.')
  const id=self(ctx),data=read(ctx.from,scope(ctx))
  if (!id) return reply(ctx,'> ⚠️ Não consegui identificar seu número.')
  if (data.perfis[id] && !data.pendentes[id])
    return reply(ctx,'> ✅ Você já tem dados no perfil. Use '+pfx(ctx)+'perfil.')
  if (!data.pendentes[id] && !admin(ctx))
    return reply(ctx,'> ⚠️ O registro é para membros que acabaram de entrar no grupo.')
  if (!data.pendentes[id] && admin(ctx)) {
    const em=agora()
    data.pendentes[id]={em,expiraEm:em+PRAZO_MS,expirado:false}
  }
  const p = pendencia(data,id)
  if (p && (p.expirado || Number(p.expiraEm) <= agora())) {
    p.expiraEm = agora() + PRAZO_MS
    p.expirado = false
    p.em = agora()
  }
  // Reabrir o formulário não prolonga a contagem de uma tentativa ativa.
  const restante = p ? Number(p.expiraEm) - agora() : PRAZO_MS
  data.etapas[id] = {fase:'nome',comecouEm:agora()}
  save(ctx.from,scope(ctx),data)
  return reply(ctx,instrucoes('nome',restante))
}
async function answer(ctx) {
  const id=self(ctx),data=read(ctx.from,scope(ctx))
  const d=data.etapas[id],p=pendencia(data,id)
  if (!d || !p || ctx.isCmd) return false
  if (marcarExpirado(data,id)) {
    save(ctx.from,scope(ctx),data)
    await reply(ctx,avisarExpiracao(id))
    return true
  }
  if (p.expirado) return false
  const v=String(ctx.body||'').replace(/[\x00-\x1f\x7f]/g,' ').replace(/\s+/g,' ').trim()
  if (!v) return false
  const skip=/^(pular|nao informar|não informar|prefiro não dizer|prefiro nao dizer)$/i.test(v)
  // Sessões de versões antigas passam a usar a apresentação curta.
  if (!passos.includes(d.fase)) {
    d.fase='nome'
    save(ctx.from,scope(ctx),data)
    await reply(ctx,instrucoes('nome',Number(p.expiraEm)-agora()))
    return true
  }
  let erro = ''
  if (d.fase==='nome') {
    if (v.length<2||v.length>32) erro='Informe um nome de 2 a 32 caracteres.'
    else d.nome=clean(v,32)
  } else if (d.fase==='idade') {
    if (skip) d.idade=null
    else if (!/^\d{1,3}$/.test(v)||Number(v)<13||Number(v)>120)
      erro='Digite uma idade entre 13 e 120 ou *pular*.'
    else d.idade=String(Number(v))
  } else if (d.fase==='cidade') {
    if (skip) d.cidade=null
    else if (v.length<2||v.length>45) erro='Cidade de 2 a 45 caracteres ou *pular*.'
    else d.cidade=clean(v,45)
  }
  if (erro) {
    await reply(ctx,'> ⚠️ '+erro+'\n> ⏳ Restam '+tempo(Number(p.expiraEm)-agora())+'.')
    return true
  }
  if (d.fase==='cidade') {
    // Confere novamente o prazo antes de salvar o perfil.
    if (marcarExpirado(data,id)) {
      save(ctx.from,scope(ctx),data)
      await reply(ctx,avisarExpiracao(id))
      return true
    }
    data.perfis[id]={
      nome:d.nome,idade:d.idade||null,cidade:d.cidade||null,
      publicar:true,criadoEm:agora()
    }
    delete data.etapas[id]
    delete data.pendentes[id]
    save(ctx.from,scope(ctx),data)
    await reply(ctx,TIT+'\n\n> ✅ Apresentação concluída, '+d.nome+'!' +
      '\n> 🔓 Comandos liberados.\n> 👤 Use '+pfx(ctx)+'perfil para ver os dados.')
    return true
  }
  d.fase=proxima[d.fase]
  save(ctx.from,scope(ctx),data)
  await reply(ctx,instrucoes(d.fase,Number(p.expiraEm)-agora()))
  return true
}
async function interceptar(ctx) {
  if (!enabled(ctx)) return false
  const id=self(ctx)
  if (!id) return false
  const data=read(ctx.from,scope(ctx)),p=pendencia(data,id)
  if (p && marcarExpirado(data,id)) {
    save(ctx.from,scope(ctx),data)
    await reply(ctx,avisarExpiracao(id))
    if (!ctx.isCmd || String(ctx.command||'')!=='registrar') return true
  }
  if (data.etapas[id] && !ctx.isCmd) return answer(ctx)
  if (ctx.isCmd && String(ctx.command||'')==='registrar') return false
  if (!admin(ctx) && ctx.isCmd && p && !data.perfis[id]) {
    await reply(ctx,TIT+'\n> 🔒 Conclua sua apresentação para usar comandos.'+
      '\n> ⏳ '+(p.expirado?'Prazo encerrado. Use '+pfx(ctx)+'registrar iniciar para recomeçar.':
      'Restam '+tempo(Number(p.expiraEm)-agora())+'.'))
    return true
  }
  return false
}
let vigia = null
function iniciarPrazos(tokito,{sub='',prefix='!',habilitado=()=>true}={}) {
  if (vigia) clearInterval(vigia)
  // Também limpa um intervalo antigo caso o módulo tenha sido recarregado.
  if (global.__TOKITO_REGISTRO_TIMER__) clearInterval(global.__TOKITO_REGISTRO_TIMER__)
  let ativo = false
  const verificar = async () => {
    if (ativo) return
    ativo = true
    try {
      const pasta=path.join(DIR,safe(sub)||'principal')
      if (!fs.existsSync(pasta)) return
      for (const arq of fs.readdirSync(pasta).filter(v=>v.endsWith('@g.us.json'))) {
        const grupo=arq.slice(0,-5)
        if (!habilitado(grupo)) continue
        const data=read(grupo,sub)
        let mudou=false
        const avisos=[]
        for (const id of Object.keys(data.pendentes)) {
          if (data.perfis[id]) continue
          const anterior=JSON.stringify(data.pendentes[id])
          const venceu=marcarExpirado(data,id)
          if (venceu) avisos.push(id)
          if (anterior!==JSON.stringify(data.pendentes[id])) mudou=true
        }
        if (mudou) save(grupo,sub,data)
        for (const id of avisos) {
          await tokito.sendMessage(grupo,{
            text:avisarExpiracao(id)+'\n> 🔁 Comando: '+(typeof prefix==='function'?prefix(grupo):prefix)+'registrar iniciar',
            mentions:[id]
          }).catch(e=>console.log('[REGISTRO PRAZO]',e?.message||e))
        }
      }
    } catch(e) {
      console.log('[REGISTRO PRAZO]',e?.message||e)
    } finally { ativo=false }
  }
  vigia=setInterval(()=>{void verificar()},30000)
  vigia.unref?.()
  global.__TOKITO_REGISTRO_TIMER__=vigia
  void verificar()
  return true
}
async function entrada({tokito,grupo,participante,membros=[],prefix='!',sub=''}) {
  const id=resolve(participante,membros)
  if(!id)return false
  const meta=membros.find(m=>ids(m).includes(id))
  if(meta&&['admin','superadmin'].includes(meta.admin))return false
  const data=read(grupo,sub)
  if(data.pendentes[id]||data.perfis[id])return false
  const em=agora()
  data.pendentes[id]={em,expiraEm:em+PRAZO_MS,expirado:false}
  save(grupo,sub,data)
  const txt=TIT+'\n\n> 👋 Bem-vindo(a), '+mention(id)+'!'+
    '\n> ⏳ Você tem *'+PRAZO_MINUTOS+' minutos* para se apresentar.'+
    '\n> 👤 Serão só 3 etapas: *nome, idade e cidade*.'+
    '\n> 🔒 Comandos liberados após concluir.'+
    '\n> 💬 Idade e cidade podem ser puladas, pois as respostas são visíveis no grupo.'+
    '\n\n> Toque em REGISTRAR para começar.'
  const fallback='Se o botão não aparecer, digite '+prefix+'registrar iniciar.'
  let foto=null
  try{foto=await tokito.profilePictureUrl(id,'image')}catch{}
  const btn=[{name:'quick_reply',buttonParamsJson:JSON.stringify({
    display_text:'🪪 REGISTRAR',id:prefix+'registrar iniciar'
  })}]
  try {
    let header
    if(foto){
      const media=await prepareWAMessageMedia({image:{url:foto}},{upload:tokito.waUploadToServer})
      header=proto.Message.InteractiveMessage.Header.create({hasMediaAttachment:true,
        imageMessage:media.imageMessage})
    }
    const obj={
      contextInfo:{mentionedJid:[id]},
      body:proto.Message.InteractiveMessage.Body.create({text:txt}),
      footer:proto.Message.InteractiveMessage.Footer.create({text:''}),
      nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.create({buttons:btn})
    }
    if(header)obj.header=header
    const msg=generateWAMessageFromContent(grupo,{
      interactiveMessage:proto.Message.InteractiveMessage.create(obj)
    },{userJid:tokito.user.id})
    await tokito.relayMessage(grupo,msg.message,{messageId:msg.key.id})
    return true
  }catch(e){console.log('[REGISTRO BOTAO]',e?.message||String(e))}
  const payload=foto?{image:{url:foto},caption:txt+'\n'+fallback,mentions:[id]}:
    {text:txt+'\n'+fallback,mentions:[id]}
  await tokito.sendMessage(grupo,payload).catch(e=>console.log('[REGISTRO CONVITE]',e?.message||String(e)))
  return true
}
function saida({grupo,participante,membros=[],sub=''}) {
  const id=resolve(participante,membros)
  if(!id)return false
  const data=read(grupo,sub)
  delete data.pendentes[id];delete data.perfis[id];delete data.etapas[id]
  save(grupo,sub,data);return true
}
function perfil(group,alvo,sub='',members=[]) {
  const data=read(group,sub),id=resolve(alvo,members)
  if (!id) return null
  const p=data.perfis[id]
  if (!p) return null
  return {
    nome:clean(p.nome||p.apelido,32),
    idade:p.publicar===true?clean(p.idade,3):null,
    cidade:p.publicar===true?clean(p.cidade,45):null,
    gostos:clean(p.gostos||p.interesses,130),
    genero:p.publicar===true?clean(p.genero,40):null,
    sexualidade:p.publicar===true?clean(p.sexualidade,50):null
  }
}
module.exports={enabled,interceptar,entrada,saida,start,perfil,read,save,resolve,iniciarPrazos,PRAZO_MINUTOS}
