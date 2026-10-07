const base = require('./sistema-base.js')
const mess = require('../../mensagens/mensagens.js')
const arquivo = base.files.anagrama
const getGame = grupo => base.getGame(arquivo, grupo)
const saveGame = game => base.saveGame(arquivo, game)
const removeGame = grupo => base.removeGame(arquivo, grupo)
function embaralharPalavra(palavra) {
const chars=[...String(palavra||'')]
if(chars.length<2) return palavra
let resultado=palavra
for(let tentativa=0; tentativa<8 && base.norm(resultado)===base.norm(palavra); tentativa++){
const copia=[...chars]
for(let i=copia.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copia[i],copia[j]]=[copia[j],copia[i]]}
resultado=copia.join('')
}
return resultado
}
function criarGame(grupo){
const lista=base.getList(base.files.anagramaBanco).filter(item=>item?.original&&item?.dica)
if(!lista.length)return null
const item=lista[Math.floor(Math.random()*lista.length)]
return {grupo,original:item.original,dica:item.dica,embaralhada:embaralharPalavra(item.original),iniciadoEm:base.now()}
}
async function enviar(ctx,game){return base.sendText(ctx,mess.jogoAnagrama(game),[],[{texto:'👀 Revelar',id:ctx.prefix+'revelaranagrama'}])}
async function iniciar(ctx){const game=criarGame(ctx.from);if(!game)return false;saveGame(game);await enviar(ctx,game);return true}
async function revelar(ctx){const game=getGame(ctx.from);if(!game)return false;removeGame(ctx.from);await base.sendText(ctx,mess.jogoAnagramaRevelado(game.original));setTimeout(()=>iniciar(ctx).catch(()=>{}),2200);return true}
async function auto(ctx){
const game=getGame(ctx.from);if(!game)return false
const texto=base.getBody(ctx);if(!texto||base.norm(texto)!==base.norm(game.original))return false
removeGame(ctx.from);await base.reactMsg(ctx,'🏆');await base.sendText(ctx,mess.jogoAnagramaAcertou(ctx.sender,game.original,base.mention),[ctx.sender]);setTimeout(()=>iniciar(ctx).catch(()=>{}),2200);return true
}
module.exports={getGame,saveGame,removeGame,criarGame,enviar,iniciar,revelar,auto}
