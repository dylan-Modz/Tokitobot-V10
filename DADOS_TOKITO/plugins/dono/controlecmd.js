/* Tokito V10 — controle e métricas de comandos */
const dylan=require('../../database/lib/comandos')
const manutencao=require('../../sistemas/manutencao')
const uso=require('../../sistemas/uso-comandos')
const protegidos=new Set(['update','manutencao','pausacmd','backupbot','addcargo','liberacmd'])
dylan.setCommand({nome:'pausacmd',comandos:['pausacmd','liberacmd','cmdtop'],categoria:'dono',
info:{descricao:'Pausa temporariamente comandos e consulta ranking.',uso:'pausacmd play 2h | liberacmd play | cmdtop',permissao:'Dono'},
async executar(ctx){
if(!ctx.SoDono)return ctx.reply(ctx.mess.onlyOwner())
const cmd=String(ctx.command||''),q=String(ctx.q||'').trim()
const aviso=(titulo,descricao)=>ctx.reply(ctx.mess.padraoAviso({emoji:'🛠️',titulo,descricao}))
const sucesso=(titulo,descricao)=>ctx.reply(ctx.mess.padraoSucesso({emoji:'👑',titulo,descricao}))
const usoCmd=texto=>ctx.reply(ctx.mess.padraoUso({emoji:'👑',titulo:'CONTROLE DE COMANDOS',uso:(ctx.prefix||'#')+texto}))
if(cmd==='cmdtop'){
const lista=uso.top(15)
return ctx.reply(ctx.mess.padraoLista({emoji:'🏆',titulo:'COMANDOS MAIS USADOS',itens:lista.map(x=>(ctx.prefix||'#')+x.nome+' — '+x.total+' usos'),vazio:'O ranking começa a contabilizar comandos a partir desta versão.'}))
}
const partes=q.split(/\s+/),nomeDigitado=partes[0]
if(!nomeDigitado)return usoCmd(cmd==='pausacmd'?'pausacmd play 2h':'liberacmd play')
const plugins=ctx.plugins
const achado=plugins?.resolver?.(nomeDigitado)
const nome=achado?.canonico||manutencao.normalizar(nomeDigitado)
if(cmd==='liberacmd'){
if(!manutencao.remover(nome).ok)return aviso('COMANDO NÃO PAUSADO','Não existe pausa ativa para '+nome+'.')
return sucesso('COMANDO LIBERADO',(ctx.prefix||'#')+nome+' está disponível novamente.')
}
if(!achado)return aviso('COMANDO INEXISTENTE','Nenhum comando encontrado com esse nome.')
if(protegidos.has(nome)||String(achado.mod?.categoria||'').toLowerCase()==='dono')
return aviso('COMANDO PROTEGIDO','Não é permitido pausar comandos exclusivos do dono ou comandos essenciais.')
if(manutencao.obter(nome))return aviso('JÁ EM MANUTENÇÃO','Esse comando já está suspenso.')
const dur=/^([1-9]\d{0,2})(m|h|d)$/.exec(partes[1]||'')
if(!dur)return usoCmd('pausacmd play 2h')
const multiplicador={m:60000,h:3600000,d:86400000}[dur[2]]
const expiraEm=Date.now()+Number(dur[1])*multiplicador
if(expiraEm-Date.now()>30*86400000)return aviso('PRAZO EXCESSIVO','O máximo permitido é 30 dias.')
const r=manutencao.adicionar(nome,'Pausa temporária do dono',expiraEm)
if(!r.ok)return aviso('NÃO FOI POSSÍVEL','Falha ao registrar a pausa.')
return sucesso('COMANDO PAUSADO',(ctx.prefix||'#')+nome+' ficará suspenso por '+partes[1]+' e voltará automaticamente.')
}})
