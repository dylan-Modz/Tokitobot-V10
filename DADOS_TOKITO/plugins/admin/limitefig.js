/* Tokito V10 — limite personalizável de figurinhas, reaproveitando antifloodsticker */
const dylan=require('../../database/lib/comandos')
dylan.setCommand({nome:'limitefig',comandos:['limitefig'],categoria:'admin',
info:{descricao:'Configura a proteção de flood de figurinhas.',uso:'limitefig 5 30s | limitefig 0',permissao:'ADM'},
async executar(ctx){
if(!ctx.isGroup)return ctx.reply(ctx.mess.sogrupo())
if(!ctx.isGroupAdmins&&!ctx.SoDono)return ctx.reply(ctx.mess.soadm())
if(!ctx.isBotGroupAdmins)return ctx.reply(ctx.mess.botadm())
const f=ctx.dataGp?.[0]?.funcoes
if(!f)return ctx.reply(ctx.mess.padraoAviso({emoji:'🎭',titulo:'LIMITE DE FIGURINHAS',descricao:'Configuração do grupo indisponível.'}))
const q=String(ctx.q||'').trim()
const ok=(titulo,descricao)=>ctx.reply(ctx.mess.padraoSucesso({emoji:'🎭',titulo,descricao}))
if(!q){
const conf=f.limitefig||{}
return ctx.reply(ctx.mess.padraoStatus({emoji:'🎭',titulo:'LIMITE DE FIGURINHAS',
ativo:f.antifloodsticker===true,descricao:'Máximo: '+(conf.max||4)+' figurinhas em '+((conf.janelaMs||10000)/1000)+' segundos.'}))
}
if(q==='0'){
f.antifloodsticker=false
ctx.setGp(ctx.dataGp)
return ok('LIMITE DESATIVADO','Proteção de flood de figurinhas desativada.')
}
const m=/^([1-9]|1\d|20)\s+(5|[1-9]\d|1[01]\d|120)s$/.exec(q)
if(!m)return ctx.reply(ctx.mess.padraoUso({emoji:'🎭',titulo:'LIMITE DE FIGURINHAS',
uso:(ctx.prefix||'#')+'limitefig 5 30s',
descricao:'Informe 1 a 20 figurinhas e intervalo de 5 a 120 segundos. Ao ultrapassar o limite, aplica a punição atual do antifloodsticker.'}))
f.limitefig={max:Number(m[1]),janelaMs:Number(m[2])*1000}
f.antifloodsticker=true
ctx.setGp(ctx.dataGp)
return ok('LIMITE ATIVADO','Máximo de '+m[1]+' figurinhas a cada '+m[2]+' segundos. Proteção de flood ativada.')
}})
