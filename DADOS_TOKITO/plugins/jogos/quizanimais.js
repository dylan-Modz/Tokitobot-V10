const dylan=require('../../database/lib/comandos')
const jogo=require('./sistema-quizanimais.js')
dylan.setCommand({nome:'quizanimais',comandos:['quizanimais'],categoria:'jogos',info:{descricao:'Descubra o animal mostrado na imagem.',uso:'quizanimais',categoria:'jogos'},async executar(ctx){
if(!ctx.isGroup)return ctx.reply(ctx.mess.sogrupo())
if(!ctx.modoJogosAtivo(ctx.from,ctx.dataGp))return ctx.reply(ctx.mess.modoJogosDesativado(ctx.prefix))
const atual=jogo.getGame(ctx.from);if(atual)return jogo.enviar(ctx,atual)
await ctx.reagir(ctx.from,'🐾').catch(()=>{})
if(!await jogo.iniciar(ctx))return ctx.reply('Não consegui carregar uma imagem do Quiz Animais agora.')
}})
