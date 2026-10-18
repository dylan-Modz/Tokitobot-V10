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

const { jidNormalizedUser } = require('@stone-wpp/ofc')

const normal = value => String(value || '').trim().toLowerCase()
const exigir = (teste, mensagem) => { if (!teste) throw Error(mensagem) }
const texto = (titulo, linhas) => {
const marca = String.fromCharCode(96)
return ['- 🧊 '+marca+titulo+marca, '', ...linhas.map(l => '> '+l)].join('\n')
}
const responder = (ctx, titulo, linhas) => ctx.reply(texto(titulo, linhas))
const dono = ctx => exigir(ctx.SoDono, 'Somente o dono pode usar esse comando.')
const grupo = ctx => {
exigir(ctx.isGroup, 'Este comando funciona somente em grupos.')
exigir(ctx.isGroupAdmins || ctx.SoDono, 'Somente administradores podem usar este comando.')
exigir(ctx.isBotGroupAdmins, 'O Tokito precisa ser administrador do grupo.')
}
const metodo = (sock, nome) => {
exigir(typeof sock?.[nome] === 'function', nome + ' indisponível nesta conexão Stone WPP.')
return sock[nome].bind(sock)
}
const jidNormal = valor => {
try { return jidNormalizedUser(String(valor || '')) } catch { return String(valor || '').replace(/:\d+@/, '@') }
}
const citado = ctx => {
let c = ctx.ctxMsg?.stanzaId ? ctx.ctxMsg : null
if (!c) {
let msg = ctx.info?.message || {}
for (let i = 0; i < 4; i++) {
const proxima = msg.ephemeralMessage?.message || msg.viewOnceMessage?.message || msg.viewOnceMessageV2?.message || msg.documentWithCaptionMessage?.message
if (!proxima) break
msg = proxima
}
for (const tipo of ['extendedTextMessage','imageMessage','videoMessage','audioMessage','documentMessage','stickerMessage']) {
if (msg[tipo]?.contextInfo?.stanzaId) { c = msg[tipo].contextInfo; break }
}
}
exigir(c?.stanzaId, 'Responda à mensagem que deseja usar.')
const participante = c.participantAlt || c.participant || ''
const idsBot = [ctx.tokito?.user?.id, ctx.tokito?.user?.lid].filter(Boolean).map(jidNormal)
const deMim = !!participante && idsBot.includes(jidNormal(participante))
const key = { remoteJid:ctx.from, id:c.stanzaId, fromMe:deMim }
if (participante && ctx.isGroup) key.participant = participante
return { key, contexto:c, deMim }
}
const epoch = value => {
if (value && typeof value === 'object') value = value.low ?? value.toNumber?.()
const n = Number(value)
return Number.isSafeInteger(n) && n > 1000000000 && n <= Math.floor(Date.now()/1000)+300 ? n : null
}
const canalJid = async (sock, input) => {
const v = String(input || '').trim()
if (/^\d+@newsletter$/.test(v)) return v
const match = v.match(/(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i)
exigir(match, 'Informe o JID do canal ou o link do canal WhatsApp.')
const data = await metodo(sock,'newsletterMetadata')('invite',match[1])
const jid = data?.id || data?.jid || data?.metadata?.id
exigir(/^\d+@newsletter$/.test(String(jid || '')), 'Não foi possível identificar o canal através do link.')
return jid
}
const executar = async (ctx, acao) => {
const q = String(ctx.q || '').trim()
const args = q.split(/\s+/).filter(Boolean)
const sock = ctx.tokito
const from = ctx.from
const prefix = ctx.prefix
try {
if (['fixar','desfixar','tempmsg','rejeitarpedido'].includes(acao)) grupo(ctx)
else dono(ctx)
if (acao === 'fixar' || acao === 'desfixar') {
const tempos = {'24h':86400, '7d':604800, '30d':2592000}
const duracao = normal(q || '24h')
if (acao === 'fixar') exigir(Object.hasOwn(tempos,duracao), 'Responda a mensagem e use '+prefix+'fixar 24h, 7d ou 30d.')
else exigir(!q, 'Responda à mensagem fixada e use '+prefix+'desfixar.')
const msg = citado(ctx)
await sock.sendMessage(from,{pin:msg.key,type:acao==='fixar'?1:2,...(acao==='fixar'?{time:tempos[duracao]}:{})})
return responder(ctx, acao==='fixar'?'𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙵𝙸𝚇𝙰𝙳𝙰':'𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙳𝙴𝚂𝙵𝙸𝚇𝙰𝙳𝙰',['📌 ׄ ( '+(acao==='fixar'?'Mensagem fixada por '+duracao+'.':'Mensagem desafixada.')+' )'])
}
if (acao === 'estrela' || acao === 'tirarestrela') {
const msg = citado(ctx)
await metodo(sock,'star')(from,[{id:msg.key.id,fromMe:!!msg.key.fromMe}],acao==='estrela')
return responder(ctx,'𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙵𝙰𝚅𝙾𝚁𝙸𝚃𝙰',['⭐ ׄ ( '+(acao==='estrela'?'Mensagem marcada com estrela.':'Estrela removida.')+' )'])
}
if (acao === 'editarmsg') {
exigir(q.length>0 && q.length<=4096,'Responda à mensagem do bot e informe o novo texto (até 4096 caracteres).')
const msg=citado(ctx)
exigir(msg.deMim,'Só é permitido editar uma mensagem comprovadamente enviada pelo próprio bot.')
await sock.sendMessage(from,{text:q,edit:msg.key})
return responder(ctx,'𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙴𝙳𝙸𝚃𝙰𝙳𝙰',['✏️ ׄ ( Edição solicitada ao WhatsApp. )'])
}
if (acao === 'apagarme') {
const msg = citado(ctx)
const momento = epoch(msg.contexto?.quotedMessage?.messageTimestamp) || epoch(ctx.quoted?.messageTimestamp) || epoch(ctx.quotedMsg?.messageTimestamp) || epoch(q)
exigir(momento,'Responda a mensagem e informe o timestamp Unix original em segundos.')
await metodo(sock,'deleteMessageForMe')(from,msg.key,momento)
return responder(ctx,'𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙰',['🗑️ ׄ ( Exclusão solicitada apenas na conta do bot. )'])
}
if (acao === 'reacaocanal') {
let jid, id, emoji
if (/whatsapp\.com\/channel\//i.test(args[0] || '')) {
const match=args[0].match(/\/channel\/[A-Za-z0-9_-]+\/(\d+)/)
exigir(match && args.length>=2,'Use '+prefix+'reacaocanal <link-da-publicação> <emoji>.')
jid=await canalJid(sock,args[0]); id=match[1]; emoji=args.slice(1).join(' ')
} else {
exigir(args.length>=3,'Use '+prefix+'reacaocanal <jid@newsletter> <id> <emoji>.')
jid=await canalJid(sock,args[0]); id=args[1]; emoji=args.slice(2).join(' ')
}
exigir(/^\d+$/.test(id) && emoji.length>0 && emoji.length<=20, 'Informe um ID numérico da publicação e um emoji válido.')
await metodo(sock,'newsletterReactMessage')(jid,id,emoji)
return responder(ctx,'𝚁𝙴𝙰𝙲̧𝙰̃𝙾 𝙽𝙾 𝙲𝙰𝙽𝙰𝙻',['❤️ ׄ ( Reação enviada à publicação. )'])
}
if (acao === 'seguidores') {
exigir(args.length===1, 'Use '+prefix+'seguidores <jid@newsletter ou link do canal>.')
const jid=await canalJid(sock,args[0])
const dados=await metodo(sock,'newsletterSubscribers')(jid)
const total=dados?.subscribers ?? dados?.count ?? dados?.subscriberCount ?? dados?.total
return responder(ctx,'𝚂𝙴𝙶𝚄𝙸𝙳𝙾𝚁𝙴𝚂',['📊 ׄ ( '+(total==null?'Quantidade não disponibilizada pelo WhatsApp.':'Total: '+total)+' )'])
}
if (acao === 'linkchamada') {
const tipo=normal(q||'audio')
exigir(tipo==='audio'||tipo==='video', 'Use '+prefix+'linkchamada audio ou '+prefix+'linkchamada video.')
const token=await metodo(sock,'createCallLink')(tipo)
exigir(typeof token==='string'&&token.length>0,'WhatsApp não retornou o link da chamada.')
const link=token.startsWith('https://')?token:'https://call.whatsapp.com/'+token
return responder(ctx,'𝙻𝙸𝙽𝙺 𝙳𝙴 𝙲𝙷𝙰𝙼𝙰𝙳𝙰',['📞 ׄ ( '+(tipo==='audio'?'Áudio':'Vídeo')+' )','🔗 '+link])
}

if (acao === 'etiquetachat' || acao === 'etiquetamsg') {
const retirar=['off','remover'].includes(normal(args[0]))
const etiqueta=args[retirar?1:0]
exigir(etiqueta && /^[\w-]{1,80}$/.test(etiqueta) && args.length===(retirar?2:1), 'Use '+prefix+acao+' id ou '+prefix+acao+' off id.')
const nome=(retirar?'remove':'add')+(acao==='etiquetachat'?'Chat':'Message')+'Label'
const fn=metodo(sock,nome)
if (acao==='etiquetachat') await fn(from,etiqueta)
else await fn(from,citado(ctx).key.id,etiqueta)
return responder(ctx,'𝙴𝚃𝙸𝚀𝚄𝙴𝚃𝙰',['🏷️ ׄ ( Etiqueta '+(retirar?'removida':'aplicada')+' na '+(acao==='etiquetachat'?'conversa.':'mensagem.')+' )'])
}
if (acao==='rejeitarpedido') {
const resultado=await ctx.funcoes.aprovacao.decidir({tokito:sock,grupo:from,alvo:q,acao:'reject'})
if (resultado.vazio) return responder(ctx,'𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙾̃𝙴𝚂',['📭 ׄ ( Nenhuma solicitação pendente. )'])
if (resultado.indisponivel) return responder(ctx,'𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙾̃𝙴𝚂',['⚠️ ׄ ( Solicitação não encontrada. )'])
return responder(ctx,'𝙿𝙴𝙳𝙸𝙳𝙾 𝚁𝙴𝙹𝙴𝙸𝚃𝙰𝙳𝙾',['✅ ׄ ( Pedido rejeitado: '+resultado.jid+' )'])
}
if (acao==='tempmsg') {
const tempos={off:0,'24h':86400,'7d':604800,'90d':7776000}
const duracao=normal(q)
exigir(Object.hasOwn(tempos,duracao), 'Use '+prefix+'tempmsg off, 24h, 7d ou 90d.')
await metodo(sock,'groupToggleEphemeral')(from,tempos[duracao])
return responder(ctx,'𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙽𝚂 𝚃𝙴𝙼𝙿𝙾𝚁𝙰́𝚁𝙸𝙰𝚂',['⏳ ׄ ( Configuração definida para '+duracao+'. )'])
}
if (acao==='rotulomembro') {
exigir(ctx.isGroup, 'Use esse comando dentro do grupo.')
exigir(q.length>0 && q.length<=30, 'Use '+prefix+'rotulomembro <texto> com até 30 caracteres.')
await metodo(sock,'updateMemberLabel')(from,q)
return responder(ctx,'𝚁𝙾́𝚃𝚄𝙻𝙾 𝙳𝙴 𝙼𝙴𝙼𝙱𝚁𝙾',['🪪 ׄ ( Rótulo da conta conectada atualizado. )'])
}
if (acao==='privacidade') {
exigir(!q, 'Use somente '+prefix+'privacidade.')
const dados=await metodo(sock,'fetchPrivacySettings')()
const campos=['last','online','profile','status','readreceipts','groupadd','messages','calladd']
const linhas=campos.filter(k=>dados?.[k]!=null).map(k=>'🔒 ׄ ( '+k+': '+String(dados[k]).slice(0,50)+' )')
return responder(ctx,'𝙿𝚁𝙸𝚅𝙰𝙲𝙸𝙳𝙰𝙳𝙴',linhas.length?linhas:['🔒 ׄ ( O WhatsApp não retornou configurações. )'])
}
if (acao==='bloqueados') {
exigir(!q, 'Use somente '+prefix+'bloqueados.')
const lista=await metodo(sock,'fetchBlocklist')()
const total=Array.isArray(lista)?lista.filter(Boolean).length:0
return responder(ctx,'𝙲𝙾𝙽𝚃𝙰𝚃𝙾𝚂 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾𝚂',['🚫 ׄ ( Quantidade: '+total+'. Números ocultados. )'])
}
throw Error('Este recurso ainda não está implementado.')
} catch (error) {
console.log('[STONE RECURSOS]',acao,error?.message||error)
return responder(ctx,'𝙰𝚅𝙸𝚂𝙾 𝙳𝙰 𝚂𝚃𝙾𝙽𝙴',['⚠️ ׄ ( '+String(error?.message||error).slice(0,260)+' )'])
}
}
module.exports={executar,citado,canalJid}

