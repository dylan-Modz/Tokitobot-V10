/* TOKITO BOT V10 • Passaporte Tokito • Dev Dylan Modz */
const dylan=require('../../database/lib/comandos')
const passaporte=require('../../sistemas/passaporte')

const uso=(prefix='!')=>'- 🪪 '+String.fromCharCode(96)+'𝙿𝙰𝚂𝚂𝙰𝙿𝙾𝚁𝚃𝙴 𝚃𝙾𝙺𝙸𝚃𝙾'+String.fromCharCode(96)+
'\n\n> 👤 '+prefix+'passaporte iniciar — apresentar-se.'+
'\n> 📝 '+prefix+'passaporte editar — editar apresentação.'+
'\n> 🪪 '+prefix+'passaporte perfil — ver perfil.'+
'\n> 🗑️ '+prefix+'passaporte apagar — excluir seus dados.'+
'\n> ❌ '+prefix+'passaporte cancelar — interromper.'+
'\n\n- ⚙️ '+String.fromCharCode(96)+'𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙲̧𝙰̃𝙾'+String.fromCharCode(96)+
'\n> ✅ '+prefix+'passaporte on / off'+
'\n> 📊 '+prefix+'passaporte registros'

dylan.setCommand({
  nome:'passaporte',
  comandos:['passaporte','apresentar'],
  categoria:'grupo',
  info:{
    descricao:'Apresentação interativa, registro e liberação dos comandos.',
    uso:'passaporte iniciar | on | off | perfil | editar | cancelar | apagar | registros',
    categoria:'grupo'
  },
  async executar(ctx){
    if(!ctx.isGroup)return ctx.reply(ctx.mess?.sogrupo?.()||'Use este comando em um grupo.')
    const parts=String(ctx.q||'').trim().split(/\s+/).filter(Boolean)
    const acao=ctx.command==='apresentar' ? 'iniciar' : String(parts.shift()||'').toLowerCase()
    const isAdm=ctx.SoDono||ctx.isGroupAdmins
    const prefix=String(ctx.prefix||'!')
    const enabled=passaporte.ativo(ctx)

    try {
      if(['on','off','1','0'].includes(acao)){
        if(!isAdm)return ctx.reply(ctx.mess?.soadm?.()||'Somente administradores.')
        const novo=acao==='on'||acao==='1'
        if(!ctx.dataGp[0].funcoes)ctx.dataGp[0].funcoes={}
        ctx.dataGp[0].funcoes.passaporte=novo
        ctx.setGp(ctx.dataGp)
        return ctx.reply('- 🪪 '+String.fromCharCode(96)+'𝙿𝙰𝚂𝚂𝙰𝙿𝙾𝚁𝚃𝙴'+String.fromCharCode(96)+
          '\n> '+(novo?'✅ Ativado':'❌ Desativado')+' neste grupo.'+
          '\n> '+(novo?'Apenas novos membros precisarão se apresentar.':'Os comandos estão liberados para todos.'))
      }
      if(!acao||acao==='ajuda'||acao==='status')
        return ctx.reply(uso(prefix)+'\n\n> 📌 Estado: '+(enabled?'Ativado ✅':'Desativado ❌'))
      if(acao==='registros'){
        if(!isAdm)return ctx.reply(ctx.mess?.soadm?.()||'Somente administradores.')
        const r=passaporte.contar(ctx)
        return ctx.reply('- 📊 '+String.fromCharCode(96)+'𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾𝚂'+String.fromCharCode(96)+
          '\n> ✅ Apresentações: '+r.perfis+'\n> 📝 Pendentes: '+r.pendentes)
      }
      if(acao==='perfil'){
        const alvo=ctx.mentionedList?.[0]||ctx.menc_jid2?.[0]||null
        const id=alvo?ctx.nJid?.(alvo)||alvo:null
        return passaporte.perfil(ctx,id)
      }
      if(acao==='apagar')return passaporte.apagar(ctx)
      if(acao==='cancelar')return passaporte.cancelar(ctx)
      if(acao==='confirmar')return passaporte.confirmar(ctx)
      if(!enabled)return ctx.reply('> ⚠️ O Passaporte está desativado neste grupo. Um administrador pode usar '+prefix+'passaporte on.')
      if(acao==='interesse')return passaporte.escolha(ctx,parts[0])
      if(acao==='iniciar'||acao==='editar')return passaporte.iniciar(ctx,acao==='editar')
      return ctx.reply(uso(prefix))
    }catch(error){
      console.log('[PASSAPORTE]',error?.message||String(error))
      return ctx.reply('> ⚠️ Não consegui concluir o Passaporte. Tente novamente.')
    }
  }
})
