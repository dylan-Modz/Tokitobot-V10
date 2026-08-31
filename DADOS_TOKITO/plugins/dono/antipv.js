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

const emoji = '🔒'
const titulo = '𝙰𝙽𝚃𝙸-𝙿𝚅'
const descricao = 'ɪɢɴᴏʀᴀ ᴛᴏᴅᴀs ᴀs ᴍᴇɴsᴀɢᴇɴs ᴘʀɪᴠᴀᴅᴀs ᴇɴǫᴜᴀɴᴛᴏ ᴇsᴛɪᴠᴇʀ ᴀᴛɪᴠᴏ.'

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'antipv',

comandos: [
'antipv'
],

categoria: 'dono',

info: {
descricao: 'Ativa ou desativa o bloqueio global de mensagens privadas.',
uso: 'antipv 1/0',
permissao: 'Dono'
},

async executar(ctx) {
if (!ctx.SoDono) {
return ctx.reply(ctx.mess.onlyOwner())
}

const valor = String(ctx.q || '').trim()

if (!['0', '1'].includes(valor)) {
return ctx.reply(
ctx.mess.funcaoUso(
emoji,
titulo,
ctx.prefix,
ctx.command,
descricao
)
)
}

const config = modulos.globalCfg()
config.antipv = valor === '1'
modulos.salvarGlobal(config)

return ctx.reply(
config.antipv
? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
: ctx.mess.funcaoDesativada(emoji, titulo, descricao)
)
}
}
)
