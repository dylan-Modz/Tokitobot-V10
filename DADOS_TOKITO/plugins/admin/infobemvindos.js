/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
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
)
