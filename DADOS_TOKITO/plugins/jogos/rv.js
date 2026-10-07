const dylan=require('../../database/lib/comandos')
const velha=require('./sistema-jogodavelha.js')
const velha2=require('./sistema-jogodavelha2.js')
const dama=require('./sistema-dama.js')
const forca=require('./sistema-forca.js')
const caca=require('./sistema-cacapalavras.js')
const adivinhe=require('./sistema-adivinhe.js')
const quiz=require('./sistema-quiz.js')
const mines=require('./sistema-mines.js')
const mapa={
velha:{nome:'Jogo da Velha',reset:grupo=>velha.removeGame(grupo)||velha2.removeGame(grupo)},
jogodavelha:{nome:'Jogo da Velha',reset:grupo=>velha.removeGame(grupo)||velha2.removeGame(grupo)},
dama:{nome:'Dama',reset:grupo=>dama.removeGame(grupo)},
forca:{nome:'Forca',reset:grupo=>forca.removeGame(grupo)},
caca:{nome:'Caca-palavras',reset:grupo=>caca.removeGame(grupo)},
cacapalavras:{nome:'Caca-palavras',reset:grupo=>caca.removeGame(grupo)},
adivinhe:{nome:'Adivinhe',reset:grupo=>adivinhe.removeGame(grupo)},
quiz:{nome:'Quiz',reset:grupo=>quiz.removeGame(grupo)},
mines:{nome:'Campo Minado',reset:grupo=>mines.removeGame(grupo)}
}
dylan.setCommand({nome:'rv',comandos:['rv','resetjogo','resetarjogo'],categoria:'jogos',info:{descricao:'Reseta uma partida pelo nome do jogo.',uso:'rv velha',categoria:'jogos'},async executar(ctx){
if(!ctx.isGroup)return ctx.reply(ctx.mess.sogrupo())
const nome=String(ctx.args?.[0]||'').trim().toLowerCase()
if(!nome||!mapa[nome])return ctx.reply(ctx.mess.jogoResetUso(ctx.prefix))
const item=mapa[nome],removeu=item.reset(ctx.from)
if(!removeu)return ctx.reply(ctx.mess.jogoResetVazio(item.nome))
await ctx.reagir(ctx.from,'♻️').catch(()=>{})
return ctx.reply(ctx.mess.jogoResetOk(item.nome))
}})
