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

module.exports = {
prioridade: 60,
nome: 'evento-autodl',
categoria: 'eventos',
async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || !ctx.dataGp?.[0]?.funcoes?.autodl || ctx.isCmd)
return false
const texto = String(ctx.body || '')
const url = (texto.match(/https?:\/\/[^\s]+/i) || [])[0]
if (!url)
return false
let cmd = ''
if (/tiktok\.com|vm\.tiktok/i.test(url))
cmd = 'tiktok'
else if (/instagram\.com/i.test(url))
cmd = 'instagram'
else if (/youtu\.be|youtube\.com/i.test(url))
cmd = 'play_audio'
else if (/kwai|kw\.ai/i.test(url))
cmd = 'kwai'
else if (/facebook\.com|fb\.watch|fb\.com/i.test(url))
cmd = 'facebook'
else if (/pinterest\.|pin\.it/i.test(url))
cmd = 'pinterestvideo'
if (!cmd || !ctx.plugins.resolver(cmd))
return false
const child = {
...ctx,
command: cmd,
q: url,
args: [url],
isCmd: true,
body: `${ctx.prefix}${cmd} ${url}`,
origemAutoDl: true
}
await ctx.plugins.executar(cmd, child).catch(e => console.log('[AUTODL]', e?.message || e))
return true
}
}
