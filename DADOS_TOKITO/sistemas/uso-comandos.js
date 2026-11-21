/* Tokito — contagem agregada e leve de execuções de comandos */
const fs=require('fs'),path=require('path')
const arquivo=path.join(__dirname,'..','database','sistemas','uso-comandos.json')
let dados=null,alterado=false,timer=null
const carregar=()=>{
if(dados)return dados
try{const obj=JSON.parse(fs.readFileSync(arquivo,'utf8'));dados=obj&&typeof obj==='object'&&!Array.isArray(obj)?obj:{}}
catch{dados={}}
return dados
}
const salvar=()=>{
if(!alterado)return
alterado=false
try{fs.mkdirSync(path.dirname(arquivo),{recursive:true});fs.writeFileSync(arquivo+'.tmp',JSON.stringify(carregar())+'\n');fs.renameSync(arquivo+'.tmp',arquivo)}
catch(e){alterado=true;console.warn('[CMD TOP]',e?.code||'erro ao salvar')}
}
const contar=comando=>{
const nome=String(comando||'').trim().toLowerCase()
if(!/^[a-z0-9_-]{1,65}$/.test(nome))return
const obj=carregar()
obj[nome]=Math.min(2147483647,(Number(obj[nome])||0)+1)
alterado=true
if(!timer){timer=setTimeout(()=>{timer=null;salvar()},30000);timer.unref?.()}
}
const top=(qtd=10)=>Object.entries(carregar())
.filter(([k,n])=>/^[a-z0-9_-]{1,65}$/.test(k)&&Number.isFinite(n)&&n>0)
.sort((a,b)=>b[1]-a[1]).slice(0,qtd).map(([nome,total])=>({nome,total}))
process.once('exit',salvar)
module.exports={contar,top,salvar}
