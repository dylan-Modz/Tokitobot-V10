module.exports = {
  nome: 'infobemvindos',
  comandos: ['infobemvindos'],
  categoria: 'admin',
  info: {
    descricao: 'Mostra como personalizar as legendas de boas-vindas.',
    uso: 'infobemvindos'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    const t = `🧊 *INFORMAÇÕES DE BOAS-VINDAS*

Use *${ctx.prefix}legendabv seu texto* para alterar a entrada.
Use *${ctx.prefix}legendasaiu seu texto* para alterar a saída.

*Hashtags suportadas pelo sistema:*
• #numero# → menciona o usuário
• #numerodele# → menciona o usuário (legado)
• #nomegrupo# → nome do grupo
• #nomedogp# → nome do grupo (legado)
• #prefixo# → prefixo atual
• #nomedobot# → nome do bot
• #hora# → hora atual
• #dia# → dia da semana
• #data# → data atual
• #ano# → ano atual
• #year# → ano atual
• #yeah# → ano atual (legado)
• #estado# → estado/DDD do número
• #membros# → quantidade de membros
• #descrição# → descrição do grupo

*Exemplo:*
${ctx.prefix}legendabv Bem-vindo #numero# ao #nomegrupo#! Agora somos #membros#. Use #prefixo#menu.`
    return ctx.reply(t)
  }
}
