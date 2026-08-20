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

const aluguel = require('../../sistemas/aluguel')

module.exports = {
nome: 'alugarbot',
comandos: ['alugarbot', 'aluguelbot', 'lojinha', 'loja'],
categoria: 'aluguel',

info: {
descricao: 'Inicia a compra do aluguel para um grupo.',
uso: 'alugarbot link-do-grupo',
categoria: 'aluguel'
},

async executar(ctx) {
if (!ctx.nescessario.aluguel)
return ctx.reply(ctx.mess.aluguelDesativado())

/*
 * Loja sem link:
 * apenas mostra os planos disponíveis.
 */
if (['lojinha', 'loja'].includes(ctx.command)) {
const ps = aluguel.planos()

if (!ps.length)
return ctx.reply(ctx.mess.aluguelSemPlanos())

return ctx.reply(
ctx.mess.aluguelPedido(
'Escolha um plano',
'—',
ps,
ctx.prefix
)
)
}

const link = String(ctx.q || '').trim()
const code = aluguel.extrairInvite(link)

if (!code)
return ctx.reply(ctx.mess.aluguelUso(ctx.prefix))

/*
 * Verifica se já existe um pagamento aprovado
 * aguardando entrada neste usuário.
 */
const pendencias = aluguel.ler(
aluguel.arquivos.pendencias,
[]
)

const aguardando = pendencias.find(item =>
item?.comprador === ctx.sender &&
item?.status === 'approved_waiting_group'
)

if (aguardando) {
if (typeof ctx.mess.aluguelAguardandoGrupo === 'function')
return ctx.reply(
ctx.mess.aluguelAguardandoGrupo()
)

return ctx.reply(
'*⏳ | ᴊᴀ ᴇxɪsᴛᴇ ᴜᴍ ᴘᴀɢᴀᴍᴇɴᴛᴏ ᴀᴘʀᴏᴠᴀᴅᴏ ᴀɢᴜᴀʀᴅᴀɴᴅᴏ ᴀ ᴇɴᴛʀᴀᴅᴀ ᴅᴏ ʙᴏᴛ ɴᴏ ɢʀᴜᴘᴏ.*'
)
}

/*
 * Consulta o convite ANTES do pagamento.
 *
 * Isso é importante porque já salvamos o grupoId.
 * Assim, mesmo se o grupo exigir aprovação,
 * o sistema sabe exatamente qual grupo aguardar.
 */
let nome = 'Grupo privado'
let grupoId = ''

try {
const inf = await ctx.tokito.groupGetInviteInfo(code)

nome = String(
inf?.subject ||
inf?.name ||
nome
).trim()

grupoId = String(
inf?.id ||
inf?.jid ||
inf?.groupJid ||
''
).trim()

} catch (e) {
if (typeof ctx.mess.aluguelLinkInvalido === 'function')
return ctx.reply(
ctx.mess.aluguelLinkInvalido()
)

return ctx.reply(
'*❌ | ɴᴀᴏ ғᴏɪ ᴘᴏssɪᴠᴇʟ ɪᴅᴇɴᴛɪғɪᴄᴀʀ ᴇssᴇ ɢʀᴜᴘᴏ. ᴠᴇʀɪғɪǫᴜᴇ sᴇ ᴏ ʟɪɴᴋ ᴇsᴛᴀ ᴠᴀʟɪᴅᴏ.*'
)
}

/*
 * Se não conseguirmos descobrir o ID do grupo,
 * não deixamos continuar.
 *
 * O novo sistema depende do grupoId para saber
 * quando o bot realmente entrou.
 */
if (!grupoId) {
if (typeof ctx.mess.aluguelGrupoNaoIdentificado === 'function')
return ctx.reply(
ctx.mess.aluguelGrupoNaoIdentificado()
)

return ctx.reply(
'*❌ | ɴᴀᴏ ғᴏɪ ᴘᴏssɪᴠᴇʟ ɪᴅᴇɴᴛɪғɪᴄᴀʀ ᴏ ɪᴅ ᴅᴏ ɢʀᴜᴘᴏ.*'
)
}

/*
 * Salva todos os dados necessários para depois:
 *
 * - confirmar pagamento
 * - tentar entrar
 * - aguardar aprovação
 * - identificar quando realmente entrou
 * - ativar o aluguel
 */
aluguel.salvarPedido({
comprador: ctx.sender,
status: 'pendente',
linkGrupo: link,
inviteCode: code,
grupoId,
grupoNome: nome,
criadoPor: ctx.sender
})

const ps = aluguel.planos()

if (!ps.length)
return ctx.reply(ctx.mess.aluguelSemPlanos())

return ctx.reply(
ctx.mess.aluguelPedido(
nome,
link,
ps,
ctx.prefix
)
)
}
}