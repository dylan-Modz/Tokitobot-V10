'use strict'
// Restaura o monitor das salas ativas após reiniciar o bot.
// Inicia no primeiro evento recebido no grupo e não interfere na mensagem.
const salas=require('./salas')

module.exports={
  nome:'evento-sala-monitor',
  categoria:'freefire',
  fase:'normal',
  prioridade:25,
  async evento(ctx){
    if(!ctx?.isGroup || ctx.info?.key?.fromMe) return false
    salas.monitorarSala(ctx,false)
    return false
  }
}
