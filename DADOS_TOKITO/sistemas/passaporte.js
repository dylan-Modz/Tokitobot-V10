/*
 * TOKITO V10 - Passaporte por grupo, sem dependencias extras.
 * Author: Dylan Modz
 */
const fs=require('fs'),path=require('path')
const {proto,generateWAMessageFromContent}=require('baileys')
const DIR=path.join(__dirname,'..','database','sistemas','passaporte')
const BT=String.fromCharCode(96)
const TIT='- 🪪 '+BT+'𝙿𝙰𝚂𝚂𝙰𝙿𝙾𝚁𝚃𝙴 𝚃𝙾𝙺𝙸𝚃𝙾'+BT
const OPCOES=['Anime','Jogos','Música','Futebol','Outros']
const clean=(v,n=160)=>String(v||'').replace(/[\x00-\x1f\x7f]/g,' ').replace(/\s+/g,' ').trim().slice(0,n)
const safe=v=>String(v||'').replace(/[^a-zA-Z0-9@._-]/g,'_').slice(0,160)
const jid=v=>{
  const s=String(v||'').trim().replace(/@c\.us$/,'@s.whatsapp.net')
  const p=s.split('@')
  return p.length===2?p[0].split(':')[0]+'@'+p[1]:''
}
const aliases=v=>typeof v==='string'?[jid(v)].filter(Boolean):
  [v?.phoneNumber,v?.participantAlt,v?.participantPn,v?.jid,v?.id,v?.lid,v?.participant].map(jid).filter(Boolean)
const resolve=(v,membros=[])=>{
  const a=aliases(v)
  if(!a.length)return ''
  const membro=membros.find(m=>aliases(m).some(id=>a.includes(id)))
  const todos=[...aliases(membro),...a]
  return todos.find(id=>id.endsWith('@s.whatsapp.net'))||todos[0]||''
}
const location=(grupo,sub='')=>{
  if(!String(grupo||'').endsWith('@g.us'))throw Error('Grupo invalido')
  return path.join(DIR,safe(sub)||'principal',safe(grupo)+'.json')
}
const read=(g,s)=>{
  try{
    const a=JSON.parse(fs.readFileSync(location(g,s),'utf8'))
    return {pendentes:a.pendentes||{},perfis:a.perfis||{},etapas:a.etapas||{}}
  }catch{return {pendentes:{},perfis:{},etapas:{}}}
}
const save=(g,s,data)=>{
  const local=location(g,s)
  fs.mkdirSync(path.dirname(local),{recursive:true})
  const tmp=local+'.'+process.pid+'.tmp'
  fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n')
  fs.renameSync(tmp,local)
}
const scope=ctx=>ctx?.runtimeSub?.isSubBot?String(ctx.runtimeSub.id||'sub'):''
const membro=ctx=>resolve(ctx.sender,ctx.groupMembers||[])
const ativo=ctx=>ctx?.isGroup&&ctx?.dataGp?.[0]?.funcoes?.passaporte===true
const livre=ctx=>ctx?.SoDono||ctx?.isGroupAdmins||ctx?.info?.key?.fromMe===true
const prefix=ctx=>String(ctx.prefix||'!')
const citar=id=>'@'+String(id||'').split('@')[0]
const envio=async(ctx,text,botoes=[])=>{
  if(botoes.length&&typeof ctx.botaozin==='function')
    return ctx.botaozin(text,botoes,ctx.sender?[ctx.sender]:[])
  return ctx.reply(text,ctx.sender?[ctx.sender]:[])
}
const botoes=(ctx,labels)=>labels.map(([nome,args])=>({texto:nome,id:prefix(ctx)+'passaporte '+args}))
const mostra=(ctx,fase,d={})=>{
  if(fase==='apelido')return TIT+'\n\n> ✏️ Etapa 1/3 — Digite seu apelido (2 a 32 caracteres).\n> ❌ Para sair: '+prefix(ctx)+'passaporte cancelar'
  if(fase==='interesses')return TIT+'\n\n> 🎮 Etapa 2/3 — Escolha o que você curte.\n> Toque num botão ou escreva seus interesses.'
  if(fase==='frase')return TIT+'\n\n> 💬 Etapa 3/3 — Escreva uma frase curta para o grupo.\n> Não informe dados pessoais.'
  return TIT+'\n\n- '+BT+'𝙲𝙾𝙽𝙵𝙸𝚁𝙼𝙰𝚁'+BT+' ✅\n> 🏷️ Apelido: '+d.apelido+
    '\n> 🎮 Interesses: '+d.interesses+'\n> 📝 Apresentação: '+d.frase+'\n\n> Confirme para liberar os comandos.'
}
async function avancar(ctx,id,data,fase) {
  data.etapas[id].fase=fase
  save(ctx.from,scope(ctx),data)
  if(fase==='interesses')return envio(ctx,mostra(ctx,fase),
    botoes(ctx,[['🎌 Anime','interesse 0'],['🎮 Jogos','interesse 1'],
      ['🎵 Música','interesse 2'],['✨ Outros','interesse 4']]))
  if(fase==='confirmar')return envio(ctx,mostra(ctx,fase,data.etapas[id]),
    botoes(ctx,[['✅ Confirmar','confirmar'],['❌ Cancelar','cancelar']]))
  return envio(ctx,mostra(ctx,fase))
}
async function iniciar(ctx,editar=false) {
  const id=membro(ctx);if(!id)return ctx.reply('Não consegui identificar seu usuário.')
  const data=read(ctx.from,scope(ctx))
  if(!editar&&data.perfis[id])return ctx.reply(TIT+'\n> ✅ Seu passaporte já está pronto. Use '+prefix(ctx)+'passaporte editar.')
  const anterior=editar?data.perfis[id]:null
  data.etapas[id]={fase:'apelido',criadoEm:Date.now(),...(anterior?{anterior}: {})}
  return avancar(ctx,id,data,'apelido')
}
async function escolha(ctx,i){
  const id=membro(ctx),data=read(ctx.from,scope(ctx)),draft=data.etapas[id]
  if(!draft||draft.fase!=='interesses')return ctx.reply('Nenhuma escolha pendente.')
  const index=Number(i)
  if(!Number.isInteger(index)||index<0||index>=OPCOES.length)return ctx.reply('Opção inválida.')
  draft.interesses=OPCOES[index]
  return avancar(ctx,id,data,'frase')
}
async function confirmar(ctx){
  const id=membro(ctx),data=read(ctx.from,scope(ctx)),d=data.etapas[id]
  if(!d||d.fase!=='confirmar')return ctx.reply('Nenhum registro aguardando confirmação.')
  data.perfis[id]={apelido:d.apelido,interesses:d.interesses,frase:d.frase,registradoEm:Date.now()}
  delete data.etapas[id]
  delete data.pendentes[id]
  save(ctx.from,scope(ctx),data)
  return ctx.reply(TIT+'\n\n- '+BT+'𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝙲𝙾𝙽𝙲𝙻𝚄𝙸́𝙳𝙾'+BT+' ✅\n> 🏷️ '+d.apelido+
    '\n> 🎮 '+d.interesses+'\n> 📝 '+d.frase+'\n> 🔓 Comandos liberados neste grupo!')
}
async function cancelar(ctx){
  const id=membro(ctx),data=read(ctx.from,scope(ctx))
  delete data.etapas[id]
  save(ctx.from,scope(ctx),data)
  return ctx.reply(TIT+'\n> ❌ Apresentação cancelada. Recomece com '+prefix(ctx)+'passaporte iniciar.')
}
async function registrarTexto(ctx) {
  const id=membro(ctx),data=read(ctx.from,scope(ctx)),d=data.etapas[id]
  if(!d||ctx.isCmd)return false
  const raw=String(ctx.body||'').replace(/[\x00-\x1f\x7f]/g,' ').replace(/\s+/g,' ').trim()
  if(!raw)return false
  if(d.fase==='apelido'){
    if(raw.length<2||raw.length>32)return ctx.reply('> ⚠️ Apelido: 2 a 32 caracteres.').then(()=>true)
    d.apelido=clean(raw,32)
    await avancar(ctx,id,data,'interesses');return true
  }
  if(d.fase==='interesses'){
    if(raw.length<2||raw.length>70)return ctx.reply('> ⚠️ Interesses: 2 a 70 caracteres.').then(()=>true)
    d.interesses=clean(raw,70)
    await avancar(ctx,id,data,'frase');return true
  }
  if(d.fase==='frase'){
    if(raw.length<4||raw.length>160)return ctx.reply('> ⚠️ Apresentação: 4 a 160 caracteres.').then(()=>true)
    d.frase=clean(raw,160)
    await avancar(ctx,id,data,'confirmar');return true
  }
  if(d.fase==='confirmar'){
    await ctx.reply('> ✅ Digite '+prefix(ctx)+'passaporte confirmar ou '+prefix(ctx)+'passaporte cancelar.')
    return true
  }
  return false
}
async function interceptar(ctx){
  if(!ativo(ctx))return false
  const id=membro(ctx);if(!id)return false
  const data=read(ctx.from,scope(ctx))
  const pass=ctx.isCmd&&['passaporte','apresentar'].includes(String(ctx.command||''))
  if(pass)return false
  // Administradores tambem podem montar um perfil, embora nao precisem se registrar.
  if(data.etapas[id]&&!ctx.isCmd)return registrarTexto(ctx)
  if(livre(ctx))return false
  const pendente=Boolean(data.pendentes[id])&&!Boolean(data.perfis[id])
  if(pendente&&ctx.isCmd){
    await ctx.reply(TIT+'\n> 🔒 Faça seu registro para liberar comandos.\n> ✨ Use '+prefix(ctx)+'passaporte iniciar.')
    return true
  }
  return false
}
async function entrada({tokito,grupo,participante,membros=[],prefix='!',sub='',botoes=true}){
  const id=resolve(participante,membros);if(!id)return false
  const meta=membros.find(m=>aliases(m).includes(id))
  if(meta&&['admin','superadmin'].includes(meta.admin))return false
  const data=read(grupo,sub)
  if(data.pendentes[id]||data.perfis[id])return false
  data.pendentes[id]={entrouEm:Date.now()}
  save(grupo,sub,data)
  const msg=TIT+'\n\n> 👋 Bem-vindo(a), '+citar(id)+'!\n> 🪪 Registro: pendente\n> 🔒 Comandos bloqueados até a apresentação.\n> 💬 Você pode conversar normalmente.\n\n> Toque no botão ou digite '+prefix+'passaporte iniciar.'
  if(botoes){
    try{
      const wa=generateWAMessageFromContent(grupo,{interactiveMessage:proto.Message.InteractiveMessage.create({
        contextInfo:{mentionedJid:[id]},
        body:proto.Message.InteractiveMessage.Body.create({text:msg}),
        footer:proto.Message.InteractiveMessage.Footer.create({text:'Passaporte Tokito V10'}),
        nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.create({buttons:[{
          name:'quick_reply',buttonParamsJson:JSON.stringify({display_text:'🪪 Me apresentar',id:prefix+'passaporte iniciar'})
        }]})
      })},{userJid:tokito?.user?.id})
      await tokito.relayMessage(grupo,wa.message,{messageId:wa.key.id})
      return true
    }catch(err){console.log('[PASSAPORTE BOTAO]',err?.message||String(err))}
  }
  await tokito.sendMessage(grupo,{text:msg,mentions:[id]}).catch(err=>{
    console.log('[PASSAPORTE CONVITE]',err?.message||String(err))
  })
  return true
}
function saida({grupo,participante,membros=[],sub=''}){
  const id=resolve(participante,membros);if(!id)return false
  const data=read(grupo,sub)
  delete data.pendentes[id];delete data.perfis[id];delete data.etapas[id]
  save(grupo,sub,data);return true
}
function perfil(ctx,alvo){
  const id=alvo||membro(ctx),data=read(ctx.from,scope(ctx)),p=data.perfis[id]
  if(!p)return ctx.reply(TIT+'\n> 🪪 Perfil não encontrado neste grupo.')
  return ctx.reply(TIT+'\n\n> 👤 '+citar(id)+'\n> 🏷️ '+p.apelido+'\n> 🎮 '+p.interesses+
    '\n> 📝 '+p.frase+'\n> ✅ Registro concluído.',[id])
}
function apagar(ctx){
  const id=membro(ctx),data=read(ctx.from,scope(ctx))
  const pendente=Boolean(data.pendentes[id])
  delete data.etapas[id]
  delete data.perfis[id]
  // Apagar dados nao pode ser usado para burlar o bloqueio do cadastro.
  if(!pendente) delete data.pendentes[id]
  save(ctx.from,scope(ctx),data)
  return ctx.reply(TIT+'\n> 🗑️ Seus dados de apresentação foram apagados.'+
    (pendente?'\n> 🔒 O registro continua pendente. Use '+prefix(ctx)+'passaporte iniciar.':''))
}
function contar(ctx){
  const data=read(ctx.from,scope(ctx))
  return {perfis:Object.keys(data.perfis).length,
    pendentes:Object.keys(data.pendentes).filter(id=>!data.perfis[id]).length}
}
module.exports={ativo,interceptar,entrada,saida,iniciar,escolha,confirmar,cancelar,perfil,apagar,contar,read,save,membro}
