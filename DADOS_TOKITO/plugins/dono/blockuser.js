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

const modulos = require('../../sistemas/modulos')

module.exports = {
nome: 'blockuser',
comandos: ['blockuser', 'unblockuser'],
categoria: 'dono',
info: {
descricao: 'Bloqueia ou desbloqueia um usuário globalmente no bot.',
uso: 'blockuser @usuario',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
const destino = await ctx.destino()
if (!destino)
return ctx.reply(ctx.mess.marque())
const alvo = ctx.normalizar(destino.mencao)
const bot = ctx.normalizar(ctx.botNumber)
if (alvo === bot || ctx.numerodono.includes(alvo)) {
return ctx.reply('❌ Não é possível bloquear o bot ou um dono.')
}
const config = modulos.globalCfg()
if (ctx.command === 'blockuser') {
if (!config.bloqueados.includes(alvo))
config.bloqueados.push(alvo)
modulos.salvarGlobal(config)
return ctx.reply(`🚫 @${destino.numero} bloqueado de usar o bot.`, [alvo])
}
config.bloqueados = config.bloqueados.filter(item => ctx.normalizar(item) !== alvo)
modulos.salvarGlobal(config)
return ctx.reply(`✅ @${destino.numero} desbloqueado.`, [alvo])
}
}
