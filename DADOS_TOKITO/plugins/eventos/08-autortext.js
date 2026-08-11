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
nome: 'evento-autortext',
categoria: 'eventos',

async evento(ctx) {
if (!ctx.isGroup) return false
if (ctx.info?.key?.fromMe) return false
if (!ctx.dataGp?.[0]?.funcoes?.autortext) return false

const audio = modulos.audioAtual(ctx)

if (!audio) return false

await ctx.reagir(
ctx.from,
'🎙️'
).catch(() => {})

try {
const resultado = await modulos.transcrever(
ctx,
audio
)

await ctx.tokito.sendMessage(
ctx.from,
{
text: ctx.mess.autortextResultado(
ctx.sender,
resultado
),

contextInfo: ctx.canalInfo([
ctx.sender
])
},
{
quoted: ctx.info
}
)

await ctx.reagir(
ctx.from,
'✅'
).catch(() => {})
} catch (erro) {
await ctx.reagir(
ctx.from,
'❌'
).catch(() => {})

if (modulos.ehErroApi(erro, ctx.API_URL)) {
await modulos.responderErroApi(
ctx,
erro,
'AUTORTEXT API'
)

return false
}

console.log(
'[ AUTORTEXT • TOKITO ]',
modulos.sanitizarErro(
erro,
[ctx.API_KEY_TOKITO]
)
)

await ctx.reply(
ctx.mess.transcricaoFalhou()
)
}

return false
}
}
