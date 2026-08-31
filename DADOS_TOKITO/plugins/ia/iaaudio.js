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

const ia = require('../../ia/index')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'iaaudio',
comandos: ['iaaudio', 'audioia', 'voz-ia'],
categoria: 'ia',
info: {
descricao: 'Faz uma pergunta para a Tokito IA e recebe a resposta em voz.',
uso: 'iaaudio pergunta',
categoria: 'ia'
},
async executar(ctx) {
if (!String(ctx.q || '').trim())
return ctx.reply(`- 🎙️ \`𝙸𝙰 𝙴𝙼 𝚅𝙾𝚉\`\n\n> *『 𝚄𝚂𝙾 』— ${ctx.prefix}${ctx.command} sua pergunta*`)
try {
ctx.tokito.sendPresenceUpdate('recording', ctx.from).catch(() => {})
const data = await ia.consultar(ctx, String(ctx.q).trim())
const texto = String(data?.resposta || ia.textoResposta(data) || '').trim()
if (!texto)
return ctx.reply(ctx.mess.iaErro())
await ia.enviarAudio(ctx, texto)
}
catch (e) {
ctx.tokito.sendPresenceUpdate('paused', ctx.from).catch(() => {})

if (ctx.modulos.ehErroApi(e, ctx.API_URL)) {
return ctx.modulos.responderErroApi(ctx, e, 'IA AUDIO')
}

console.log(
'[IA AUDIO]',
ctx.modulos.sanitizarErro(e, [ctx.API_KEY_TOKITO]) || 'Erro sem detalhes'
)

return ctx.reply(ctx.mess.iaErro())
}
}
}
)
