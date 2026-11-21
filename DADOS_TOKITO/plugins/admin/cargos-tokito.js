/* Tokito — cargos internos, sem promover no WhatsApp */
const dylan=require('../../database/lib/comandos')
const cargos=require('../../sistemas/cargos-tokito')
const aliases=['addcargo','delcargo','listacargo','setcargo','tirarcargo','vercargo','permcargo','cargotempo']
dylan.setCommand({nome:'addcargo',comandos:aliases,categoria:'admin',info:{descricao:'Gerencia cargos internos e a permissão de advertir.',uso:'addcargo Moderador | setcargo @usuario Moderador',permissao:'ADM'},
async executar(ctx){
if(!ctx.isGroup)return ctx.reply(ctx.mess.sogrupo())
const cmd=String(ctx.command||'').toLowerCase()
const adm=ctx.isGroupAdmins||ctx.SoDono
if(!adm&&!['vercargo','listacargo'].includes(cmd))return ctx.reply(ctx.mess.soadm())
const e=cargos.estado(ctx.dataGp)
if(!e)return ctx.reply(ctx.mess.padraoAviso({titulo:'CARGOS',descricao:'Dados do grupo indisponíveis.'}))
const q=String(ctx.q||'').trim(),parts=q.split(/\s+/).filter(Boolean)
const aviso=(titulo,descricao)=>ctx.reply(ctx.mess.padraoAviso({emoji:'🛡️',titulo,descricao}))
const sucesso=(titulo,descricao)=>ctx.reply(ctx.mess.padraoSucesso({emoji:'👑',titulo,descricao}))
const uso=ex=>ctx.reply(ctx.mess.padraoUso({emoji:'🛡️',titulo:'CARGOS',uso:(ctx.prefix||'#')+ex}))
const salvar=()=>ctx.setGp(ctx.dataGp)
if(cmd==='listacargo')return ctx.reply(ctx.mess.padraoLista({emoji:'👑',titulo:'CARGOS DO GRUPO',itens:Object.values(e.cargos).map(c=>c.nome),vazio:'Nenhum cargo criado.'}))
if(cmd==='addcargo'){
const k=cargos.key(q)
if(!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9_-]{1,29}$/.test(q)||!k||['constructor','prototype','__proto__'].includes(k))return uso('addcargo Moderador')
if(e.cargos[k])return aviso('CARGO EXISTENTE','Esse cargo já existe.')
if(Object.keys(e.cargos).length>=20)return aviso('LIMITE ATINGIDO','Máximo de 20 cargos neste grupo.')
e.cargos[k]={nome:q,permissoes:{}};salvar()
return sucesso('CARGO CRIADO','Cargo '+q+' criado sem permissões adicionais.')
}
if(cmd==='delcargo'){
const k=cargos.key(q)
if(!Object.hasOwn(e.cargos,k))return aviso('NÃO ENCONTRADO','Cargo inexistente.')
delete e.cargos[k]
for(const [id,m] of Object.entries(e.membros))if(m?.cargo===k)delete e.membros[id]
salvar();return sucesso('CARGO EXCLUÍDO','Cargo '+q+' e suas atribuições removidos.')
}
if(cmd==='permcargo'){
const [nome,permissao,ativo]=parts,k=cargos.key(nome)
if(!Object.hasOwn(e.cargos,k)||permissao!=='adv'||!['1','0'].includes(ativo))return uso('permcargo Moderador adv 1')
e.cargos[k].permissoes.adv=ativo==='1';salvar()
return sucesso('PERMISSÃO ALTERADA','Cargo: '+nome+' | Advertências: '+(ativo==='1'?'permitidas':'bloqueadas')+'.')
}
const marcado=ctx.menc_jid2?.[0]||ctx.menc_prt||''
const numero=String(parts[0]||'').replace(/\D/g,'')
const jid=marcado?cargos.normal(marcado,ctx.nJid):/^\d{10,15}$/.test(numero)?cargos.normal(numero+'@s.whatsapp.net',ctx.nJid):''
if(cmd==='vercargo'){
const user=jid||cargos.normal(ctx.sender,ctx.nJid)
const c=cargos.cargo(ctx.dataGp,user,ctx.nJid)
return sucesso('CARGO DO MEMBRO','@'+user.split('@')[0]+' | '+(c?.nome||'Sem cargo')+' | ADV: '+(c?.permissoes?.adv?'sim':'não'))
}
if(['setcargo','tirarcargo','cargotempo'].includes(cmd)){
if(!jid)return uso(cmd+' @usuario'+(cmd==='tirarcargo'?'':' Moderador'+(cmd==='cargotempo'?' 7d':'')))
let members=[]
try{members=(await ctx.tokito.groupMetadata(ctx.from))?.participants||[]}catch{return aviso('MEMBROS INDISPONÍVEIS','Não consegui confirmar os participantes do grupo.')}
const membro=members.find(p=>[p?.phoneNumber,p?.participantAlt,p?.id,p?.jid,p?.lid].filter(Boolean).some(id=>cargos.normal(id,ctx.nJid)===jid))
if(!membro)return aviso('MEMBRO AUSENTE','Marque um participante deste grupo.')
const id=cargos.normal(membro,ctx.nJid)
if(cmd==='tirarcargo'){
if(!e.membros[id])return aviso('SEM CARGO','Esse membro não tem um cargo interno.')
delete e.membros[id];salvar();return sucesso('CARGO REMOVIDO','Cargo de @'+id.split('@')[0]+' removido.')
}
const nome=parts[cmd==='cargotempo'?parts.length-2:parts.length-1],k=cargos.key(nome)
if(!Object.hasOwn(e.cargos,k))return aviso('CARGO INEXISTENTE','Crie primeiro com addcargo.')
let expiraEm=0
if(cmd==='cargotempo'){
const dur=/^([1-9]\d{0,2})(h|d)$/.exec(parts.at(-1)||'')
if(!dur)return uso('cargotempo @usuario Moderador 7d')
expiraEm=Date.now()+Number(dur[1])*(dur[2]==='h'?3600000:86400000)
}
e.membros[id]={cargo:k,expiraEm};salvar()
return sucesso('CARGO ATRIBUÍDO','@'+id.split('@')[0]+' recebeu '+e.cargos[k].nome+(expiraEm?' por '+parts.at(-1):'')+'.')
}
return uso('addcargo Moderador')
}})
