const dylan=require('../../database/lib/comandos')
const jogo=require('./sistema-anagrama.js')
dylan.setCommand({nome:'anagrama',comandos:['anagrama'],categoria:'jogos',info:{descricao:'Descubra a palavra embaralhada pela dica.',uso:'anagrama',categoria:'jogos'},async executar(ctx){
if(!ctx.isGroup)return ctx.reply(ctx.mess.sogrupo())
if(!ctx.modoJogosAtivo(ctx.from,ctx.dataGp))return ctx.reply(ctx.mess.modoJogosDesativado(ctx.prefix))
const atual=jogo.getGame(ctx.from);if(atual)return jogo.enviar(ctx,atual)
await ctx.reagir(ctx.from,'🔤').catch(()=>{})
if(!await jogo.iniciar(ctx))return ctx.reply('O banco de anagramas está vazio.')
}})
