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
const prompt=step=>({
  nome:TIT+'\n\n> 👤 1/6 — Qual nome você quer usar no perfil?\n> Digite seu nome ou apelido (2 a 32 caracteres).',
  idade:TIT+'\n\n> 🎂 2/6 — Qual sua idade?\n> Opcional. Digite uma idade válida ou *pular*.',
  genero:TIT+'\n\n> 👤 3/6 — Qual seu gênero?\n> Opcional. Digite sua resposta ou *pular*.',
  sexualidade:TIT+'\n\n> 💗 4/6 — Qual sua orientação sexual?\n> Opcional. Digite sua resposta ou *pular*.\n> ⚠️ Respostas enviadas aqui são visíveis no grupo.\n> Só aparecerá no perfil com sua autorização.',
  gostos:TIT+'\n\n> 🎮 5/6 — O que você gosta de fazer?\n> Exemplo: assistir anime e jogar Free Fire.',
  publicar:TIT+'\n\n> 🔐 6/6 — Autoriza mostrar idade, gênero e orientação sexual no perfil do grupo?\n> Digite *sim*, *não* ou *pular*.\n> Se não autorizar, esses dados não serão salvos.'
}[step]||'')
const next={nome:'idade',idade:'genero',genero:'sexualidade',sexualidade:'gostos',gostos:'publicar'}
async function start(ctx){
  const id=self(ctx),data=read(ctx.from,scope(ctx))
  if(!enabled(ctx))return reply(ctx,'> ⚠️ O registro está desativado neste grupo.')
  if(!id)return reply(ctx,'> ⚠️ Não consegui identificar seu número.')
  if(data.perfis[id]&&!data.pendentes[id])return reply(ctx,'> ✅ Você já tem dados no perfil. Use '+pfx(ctx)+'perfil.')
  if(!data.pendentes[id]&&!admin(ctx))return reply(ctx,'> ⚠️ O registro é para membros que acabaram de entrar no grupo.')
  data.etapas[id]={fase:'nome',comecouEm:Date.now()}
  save(ctx.from,scope(ctx),data)
  return reply(ctx,prompt('nome'))
}
async function answer(ctx){
  const id=self(ctx),data=read(ctx.from,scope(ctx)),d=data.etapas[id]
  if(!d||ctx.isCmd)return false
  const v=String(ctx.body||'').replace(/[\x00-\x1f\x7f]/g,' ').replace(/\s+/g,' ').trim()
  if(!v)return false
  const f=d.fase
  const skip=/^(pular|nao informar|não informar|prefiro não dizer|prefiro nao dizer)$/i.test(v)
  let error=''
  if(f==='nome'){
    if(v.length<2||v.length>32)error='Nome de 2 a 32 caracteres.'
    else d.nome=clean(v,32)
  }else if(f==='idade'){
    if(skip)d.idade=null
    else if(!/^\d{1,3}$/.test(v)||Number(v)<13||Number(v)>120)error='Idade de 13 a 120 ou pular.'
    else d.idade=String(Number(v))
  }else if(f==='genero'){
    if(skip)d.genero=null
    else if(v.length>40)error='Até 40 caracteres ou pular.'
    else d.genero=clean(v,40)
  }else if(f==='sexualidade'){
    if(skip)d.sexualidade=null
    else if(v.length>50)error='Até 50 caracteres ou pular.'
    else d.sexualidade=clean(v,50)
  }else if(f==='gostos'){
    if(skip||v.length<2||v.length>130)error='Escreva seus gostos de 2 a 130 caracteres.'
    else d.gostos=clean(v,130)
  }else if(f==='publicar'){
    if(/^(sim|s)$/i.test(v))d.publicar=true
    else if(/^(nao|não|n|pular)$/i.test(v))d.publicar=false
    else error='Responda sim, não ou pular.'
  }else return false
  if(error){await reply(ctx,'> ⚠️ '+error);return true}
  if(f==='publicar'){
    data.perfis[id]={
      nome:d.nome,gostos:d.gostos,
      ...(d.publicar?{idade:d.idade||null,genero:d.genero||null,
        sexualidade:d.sexualidade||null,publicar:true}:{}),
      criadoEm:Date.now()
    }
    delete data.etapas[id]
    delete data.pendentes[id]
    save(ctx.from,scope(ctx),data)
    await reply(ctx,TIT+'\n\n> ✅ Pronto, '+d.nome+'! Os comandos estão liberados.\n> 👤 Use '+pfx(ctx)+'perfil para ver seus dados.')
    return true
  }
  d.fase=next[f]
  save(ctx.from,scope(ctx),data)
  await reply(ctx,prompt(d.fase))
  return true
}
async function interceptar(ctx){
  if(!enabled(ctx))return false
  const id=self(ctx)
  if(!id)return false
  const data=read(ctx.from,scope(ctx))
  if(data.etapas[id]&&!ctx.isCmd)return answer(ctx)
  if(ctx.isCmd&&String(ctx.command||'')==='registrar')return false
  if(!admin(ctx)&&ctx.isCmd&&data.pendentes[id]&&!data.perfis[id]){
    await reply(ctx,TIT+'\n> 🔒 Use REGISTRAR para liberar os comandos.')
    return true
  }
  return false
}
async function entrada({tokito,grupo,participante,membros=[],prefix='!',sub=''}) {
  const id=resolve(participante,membros)
  if(!id)return false
  const meta=membros.find(m=>ids(m).includes(id))
  if(meta&&['admin','superadmin'].includes(meta.admin))return false
  const data=read(grupo,sub)
  if(data.pendentes[id]||data.perfis[id])return false
  data.pendentes[id]={em:Date.now()}
  save(grupo,sub,data)
  const txt=TIT+'\n\n> 👋 Bem-vindo(a), '+mention(id)+'!\n> 🪪 Seu cadastro está aguardando.\n> 🔒 Para usar comandos, faça seu registro.\n> 💬 Você pode conversar normalmente.\n\n> Toque no botão REGISTRAR.'
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
  if(!id)return null
  const p=data.perfis[id]
  if(!p)return null
  return {nome:clean(p.nome||p.apelido,32),gostos:clean(p.gostos||p.interesses,130),
    idade:p.publicar===true?clean(p.idade,3):null,
    genero:p.publicar===true?clean(p.genero,40):null,
    sexualidade:p.publicar===true?clean(p.sexualidade,50):null}
}
module.exports={enabled,interceptar,entrada,saida,start,perfil,read,save,resolve}
