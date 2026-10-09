/*
 * TOKITO BOT V10 — Fundos do card Bem-vindo 2
 * Author: Dylan Modz
 */
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'fundobv2',
comandos: ['fundobv2', 'fundosaiu2'],
categoria: 'grupo',
info: {
descricao: 'Personaliza o fundo dos cards de entrada e saída do Bem-vindo 2.',
uso: 'fundobv2 respondendo uma imagem | fundobv2 link | fundobv2 0',
permissao: 'ADM',
categoria: 'grupo'
},
async executar(ctx) {
try {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())
if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm())
const saida = String(ctx.command || '').toLowerCase() === 'fundosaiu2'
const campo = saida ? 'fundosaiu2' : 'fundobv2'
const titulo = saida ? 'FUNDO DO CARD DE SAÍDA' : 'FUNDO DO CARD DE ENTRADA'
const entrada = String(ctx.q || '').trim()
if (!Array.isArray(ctx.dataGp[0].wellcome)) ctx.dataGp[0].wellcome = []
const config = ctx.dataGp[0].wellcome[1] || { bemvindo2: false }
if (['0','reset','padrao','padrão'].includes(entrada.toLowerCase())) {
delete config[campo]
ctx.dataGp[0].wellcome[1] = config
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.padraoSucesso({ emoji:'🖼️', titulo, descricao:'Fundo padrão restaurado no card Canvas do Bem-vindo 2.' }))
}
let url = ''
if (/^https?:\/\//i.test(entrada)) {
const link = new URL(entrada)
if (link.protocol !== 'https:' || link.username || link.password || !link.hostname)
return ctx.reply('Envie uma URL HTTPS pública de imagem.')
url = link.toString()
} else {
const imagem = ctx.modulos.mediaAtual(ctx)?.image
if (!imagem) return ctx.reply(ctx.mess.padraoUso({
emoji:'🖼️',titulo,uso:`${ctx.prefix}${campo}`,
exemplos:[`${ctx.prefix}${campo} https://site.com/imagem.jpg`,`${ctx.prefix}${campo} 0`],
descricao:'Responda uma imagem ou informe um link HTTPS. Use 0 para restaurar o fundo padrão.'
}))
await ctx.reagir(ctx.from,'⏳').catch(()=>{})
const buffer = await ctx.getFileBuffer(imagem,'image')
const extensao = String(imagem.mimetype || '').includes('png') ? 'png' : 'jpg'
url = await ctx.modulos.uploadCatbox(buffer,extensao)
if (!/^https:\/\//i.test(String(url || ''))) throw new Error('Upload sem URL HTTPS')
}
config[campo] = url
ctx.dataGp[0].wellcome[1] = config
ctx.setGp(ctx.dataGp)
await ctx.reagir(ctx.from,'✅').catch(()=>{})
return ctx.reply(ctx.mess.padraoSucesso({ emoji:'🖼️', titulo, descricao:'Fundo do card Canvas do Bem-vindo 2 alterado com sucesso.' }))
} catch (e) {
console.log('[FUNDO BV2]',e?.message || e)
return ctx.reply(ctx.mess.error())
}
}
})
