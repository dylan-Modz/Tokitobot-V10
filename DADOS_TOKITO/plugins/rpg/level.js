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

const r = require('../../sistemas/rpg/index')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'level',
comandos: ['level', 'patente', 'nivel'],
categoria: 'rpg',
info: {
descricao: 'Mostra seu Level, XP, patente e ranking.',
uso: 'level',
requisitos: 'Modo RPG',
categoria: 'rpg'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!r.temRpg(ctx))
return ctx.reply(ctx.mess.rpgDesativado(ctx.prefix))
const u = r.user(ctx)
const rank = r.rank(ctx, 'xp')
const pos = rank.findIndex(x => x.jid === ctx.sender) + 1
r.salvar(ctx)
let foto = r.levelImg.perfilPadrao
try {
foto = await ctx.tokito.profilePictureUrl(ctx.sender, 'image')
}
catch {
}
const texto = ctx.mess.levelPerfil(ctx.sender, u, pos)
const url = `${ctx.API_URL}/canvas/levelcard?apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}&foto=${encodeURIComponent(foto)}&nome=${encodeURIComponent(ctx.pushname || 'Usuário')}&xp_before=${u.xp}&xp_after=${u.xp}&level=${u.level}&ranking=${pos}&patente=${encodeURIComponent(u.patente)}&fundo=${encodeURIComponent(r.levelImg.fundo || '')}`
try {
return await ctx.tokito.sendMessage(ctx.from, {
image: { url },
caption: texto,
contextInfo: ctx.canalInfo([ctx.sender])
}, { quoted: ctx.selo })
}
catch (error) {
console.log(
'[LEVEL CARD API]',
ctx.modulos.sanitizarErro(error, [ctx.API_KEY_TOKITO]) || 'Erro sem detalhes'
)

return ctx.reply(
ctx.mess.erroApi(ctx.API_URL)
)
}
}
}
)
