const dylan = require('../../database/lib/comandos')
const jogo = require('./sistema-doulingo.js')
dylan.setCommand({
nome:'doulingo',comandos:['doulingo','duolingo'],categoria:'jogos',
info:{descricao:'Quiz de tradução do inglês para português.',uso:'doulingo',categoria:'jogos'},
async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!ctx.modoJogosAtivo(ctx.from, ctx.dataGp)) return ctx.reply(ctx.mess.modoJogosDesativado(ctx.prefix))
const atual=jogo.getGame(ctx.from)
if (atual) return jogo.enviar(ctx, atual)
await ctx.reagir(ctx.from,'🟩').catch(()=>{})
if (!await jogo.iniciar(ctx)) return ctx.reply('Não há perguntas disponíveis no Doulingo.')
}
})
