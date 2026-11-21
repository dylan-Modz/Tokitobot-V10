/* Tokito — backup local de configurações de grupos (sem chaves nem sessões) */
const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto')
const dylan=require('../../database/lib/comandos')
const root=path.resolve(__dirname,'..','..','..')
const pasta=path.join(root,'DADOS_TOKITO','database','sistemas','backups-bot')
const grupos=path.join(root,'DADOS_TOKITO','database','grupos')
const maximo=15*1024*1024
const seguro=nome=>/^tokito-[0-9]{8}-[a-f0-9]{8}$/.test(String(nome||''))
const caminho=id=>path.join(pasta,id+'.json.gz')
const permitido=rel=>rel==='DADOS_TOKITO/INFO_DADOS/manutencao.json'||/^DADOS_TOKITO\/database\/grupos\/(?:[A-Za-z0-9@_.-]+\/){0,2}[A-Za-z0-9@_.-]+\.json$/.test(rel)
const coletar=(dir,lista=[])=>{
if(!fs.existsSync(dir))return lista
for(const e of fs.readdirSync(dir,{withFileTypes:true})){
if(e.isSymbolicLink())continue
const local=path.join(dir,e.name)
if(e.isDirectory()){if(lista.length<300)coletar(local,lista);continue}
if(!e.isFile()||!e.name.endsWith('.json'))continue
const rel=path.relative(root,local).replace(/\\/g,'/')
if(permitido(rel))lista.push(rel)
if(lista.length>=300)break
}
return lista
}
const criar=()=>{
const paths=coletar(grupos)
const manut='DADOS_TOKITO/INFO_DADOS/manutencao.json'
if(fs.existsSync(path.join(root,manut)))paths.push(manut)
const arquivos=[],agora=new Date().toISOString()
let total=0
for(const rel of paths){
const absolute=path.join(root,rel)
const st=fs.statSync(absolute)
if(st.size>1024*1024)continue
const data=fs.readFileSync(absolute)
total+=data.length
if(total>maximo)throw Error('Limite de 15 MB do backup ultrapassado.')
JSON.parse(data.toString('utf8'))
arquivos.push({path:rel,content:data.toString('base64'),sha256:crypto.createHash('sha256').update(data).digest('hex')})
}
if(!arquivos.length)throw Error('Nenhuma configuração de grupo disponível.')
const snapshot={tipo:'tokito-grupos-v1',criadoEm:agora,arquivos}
const buffer=zlib.gzipSync(Buffer.from(JSON.stringify(snapshot),'utf8'),{level:6})
if(buffer.length>maximo)throw Error('Backup compactado excedeu 15 MB.')
const id='tokito-'+agora.slice(0,10).replace(/-/g,'')+'-'+crypto.randomBytes(4).toString('hex')
fs.mkdirSync(pasta,{recursive:true})
fs.writeFileSync(caminho(id),buffer,{flag:'wx',mode:0o600})
return {id,arquivos:arquivos.length,tamanho:buffer.length,criadoEm:agora}
}
const listar=()=>{
if(!fs.existsSync(pasta))return []
return fs.readdirSync(pasta).filter(f=>f.endsWith('.json.gz')&&seguro(f.slice(0,-8)))
.map(f=>{const st=fs.statSync(path.join(pasta,f));return {id:f.slice(0,-8),tamanho:st.size,data:st.mtimeMs}})
.sort((a,b)=>b.data-a.data).slice(0,50)
}
const ler=id=>{
if(!seguro(id)||!fs.existsSync(caminho(id)))throw Error('Backup não encontrado.')
const st=fs.statSync(caminho(id));if(st.size>maximo)throw Error('Backup muito grande.')
const text=zlib.gunzipSync(fs.readFileSync(caminho(id)),{maxOutputLength:30*1024*1024}).toString('utf8')
const data=JSON.parse(text)
if(data.tipo!=='tokito-grupos-v1'||!Array.isArray(data.arquivos))throw Error('Formato inválido.')
let total=0
const arquivos=[]
for(const item of data.arquivos){
if(!permitido(item.path)||!item.content||!item.sha256)throw Error('Arquivo não permitido.')
const bytes=Buffer.from(item.content,'base64')
total+=bytes.length
if(total>maximo||crypto.createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw Error('Integridade inválida.')
JSON.parse(bytes.toString('utf8'))
arquivos.push({path:item.path,bytes})
}
if(!arquivos.length)throw Error('Backup vazio.')
return {criadoEm:data.criadoEm,arquivos}
}
dylan.setCommand({nome:'backupbot',comandos:['backupbot','listabackup','backupinfo','delbackup','restaurarbot'],categoria:'dono',
info:{descricao:'Backups locais de configurações dos grupos, sem sessões ou chaves.',uso:'backupbot | listabackup | backupinfo ID | restaurarbot ID confirmar',permissao:'Dono'},
async executar(ctx){
if(!ctx.SoDono)return ctx.reply(ctx.mess.onlyOwner())
const cmd=String(ctx.command||''),partes=String(ctx.q||'').trim().split(/\s+/)
const ok=(titulo,descricao)=>ctx.reply(ctx.mess.padraoSucesso({emoji:'📦',titulo,descricao}))
const aviso=(titulo,descricao)=>ctx.reply(ctx.mess.padraoAviso({emoji:'📦',titulo,descricao}))
try{
if(cmd==='backupbot'){
const r=criar()
return ok('BACKUP CRIADO',r.id+' | '+r.arquivos+' arquivos de configuração salvos localmente.')
}
if(cmd==='listabackup')return ctx.reply(ctx.mess.padraoLista({emoji:'📦',titulo:'BACKUPS DO BOT',itens:listar().map(x=>x.id+' — '+Math.ceil(x.tamanho/1024)+' KB'),vazio:'Ainda não existe backup local.'}))
const id=partes[0]
if(!seguro(id))return aviso('INFORME O BACKUP','Utilize '+(ctx.prefix||'#')+cmd+' tokito-AAAAMMDD-xxxxxxxx'+(cmd==='backupinfo'?'':' confirmar')+'.')
if(cmd==='backupinfo'){
const r=ler(id);return ok('DETALHES DO BACKUP',id+' | '+r.arquivos.length+' arquivos | '+r.criadoEm+'.')
}
if(partes[1]!=='confirmar')return aviso('CONFIRMAÇÃO OBRIGATÓRIA','Repita com '+(ctx.prefix||'#')+cmd+' '+id+' confirmar.')
if(cmd==='delbackup'){
if(!fs.existsSync(caminho(id)))return aviso('NÃO ENCONTRADO','Esse backup não existe.')
fs.unlinkSync(caminho(id));return ok('BACKUP EXCLUÍDO',id+' removido.')
}
if(cmd==='restaurarbot'){
const r=ler(id)
const seguranca=criar()
for(const item of r.arquivos){
const destino=path.join(root,item.path)
fs.mkdirSync(path.dirname(destino),{recursive:true})
fs.writeFileSync(destino+'.restore-tmp',item.bytes,{mode:0o600})
fs.renameSync(destino+'.restore-tmp',destino)
}
return ok('BACKUP RESTAURADO',r.arquivos.length+' configurações restauradas. Cópia de segurança anterior: '+seguranca.id+'. Reinicie o bot para recarregar os dados.')
}
return aviso('USO','Use backupbot, listabackup, backupinfo, restaurarbot ou delbackup.')
}catch(e){console.warn('[BACKUP BOT]',e?.code||e?.message);return ctx.reply(ctx.mess.padraoErro({titulo:'BACKUP DO BOT',descricao:'Não foi possível concluir a operação. Confira os registros locais.'}))}
}})
