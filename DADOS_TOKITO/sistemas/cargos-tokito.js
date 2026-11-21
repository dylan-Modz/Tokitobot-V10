/* Tokito Bot V10 — cargos internos dos grupos */
const key = x => String(x||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'')
const normal = (x,fn) => {
const raw=typeof x==='object'&&x!==null?(x.phoneNumber||x.participantAlt||x.id||x.jid||x.lid):x
try {return String(fn?.(raw)||raw||'').trim().toLowerCase()} catch {return String(raw||'').trim().toLowerCase()}
}
const estado = gp => {
const f=gp?.[0]?.funcoes
if(!f||typeof f!=='object')return null
if(!f.cargosTokito||typeof f.cargosTokito!=='object')f.cargosTokito={cargos:{},membros:{}}
const s=f.cargosTokito
if(!s.cargos||typeof s.cargos!=='object')s.cargos={}
if(!s.membros||typeof s.membros!=='object')s.membros={}
return s
}
const cargo = (gp,user,fn) => {
const s=estado(gp),p=s?.membros?.[normal(user,fn)]
if(!p||p.expiraEm&&p.expiraEm<=Date.now())return null
return s.cargos[p.cargo]||null
}
module.exports={key,normal,estado,cargo,pode:(gp,user,permissao,fn)=>cargo(gp,user,fn)?.permissoes?.[permissao]===true}
