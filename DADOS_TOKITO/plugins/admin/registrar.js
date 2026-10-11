/* TOKITO V10 - ativacao e inicio do cadastro - Dylan Modz */
const dylan=require('../../database/lib/comandos')
const registro=require('../../sistemas/registro')
dylan.setCommand({
  nome:'registrar',
  comandos:['registrar'],
  categoria:'grupo',
  info:{descricao:'Habilita o registro de novos membros.',uso:'registrar 1/0',categoria:'grupo'},
  async executar(ctx){
    if(!ctx.isGroup)return ctx.reply(ctx.mess?.sogrupo?.()||'Apenas em grupos.')
    const a=String(ctx.q||'').trim().toLowerCase()
    if(a==='1'||a==='0'){
      if(!ctx.isGroupAdmins&&!ctx.SoDono)
        return ctx.reply(ctx.mess?.soadm?.()||'Apenas administradores.')
      if(!ctx.dataGp[0].funcoes)ctx.dataGp[0].funcoes={}
      ctx.dataGp[0].funcoes.registrar=a==='1'
      ctx.dataGp[0].funcoes.passaporte=false
      ctx.setGp(ctx.dataGp)
      return ctx.reply('- 🧊 '+String.fromCharCode(96)+'𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾'+String.fromCharCode(96)+
        '\n\n> '+(a==='1'?'✅ Ativado':'❌ Desativado')+' no grupo.'+
        (a==='1'?'\n> ⏳ Prazo de 10 minutos para se apresentar.\n> 👤 Etapas: nome, idade e cidade.\n> Membros recebem o botão REGISTRAR ao entrar.':'\n> Comandos sem exigência de cadastro.'))
    }
    // Somente o botão da mensagem de entrada usa a ação interna iniciar.
    if(a==='iniciar')return registro.start(ctx)
    return ctx.reply('- ⚙️ '+String.fromCharCode(96)+'𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝚁'+String.fromCharCode(96)+
      '\n\n> ✅ '+ctx.prefix+'registrar 1\n> ❌ '+ctx.prefix+'registrar 0')
  }
})
