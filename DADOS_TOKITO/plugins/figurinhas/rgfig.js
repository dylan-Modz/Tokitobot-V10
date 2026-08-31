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

const sticker = ctx => ctx.ctxMsg?.quotedMessage?.stickerMessage || ctx.mensagem?.stickerMessage

const cmdNorm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c').replace(/^\W+/, '')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'rgfig',
comandos: ['rgfig', 'delfig', 'listafig'],
categoria: 'dono',
info: {
descricao: 'Mapeia uma figurinha para executar um comando.',
uso: 'rgfig ban',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
const db = modulos.figuras()
if (ctx.command === 'listafig') {
const a = Object.entries(db)
return ctx.reply(ctx.mess.padraoLista({
emoji: '🧊',
titulo: 'SYSTEM FIGURINHAS',
itens: a.map(([hash, comando]) => `${comando} — ${hash.slice(0, 12)}…`),
vazio: 'Nenhuma figurinha registrada.'
}))
}
const st = sticker(ctx)
const h = st?.fileSha256 ? Buffer.from(st.fileSha256).toString('base64') : ''
if (!h)
return ctx.reply(ctx.mess.padraoUso({
emoji: '🧊',
titulo: 'FIGURINHA NECESSÁRIA',
uso: `${ctx.prefix}${ctx.command}`,
descricao: 'Responda a uma figurinha para continuar.'
}))
if (ctx.command === 'delfig') {
if (!db[h])
return ctx.reply(ctx.mess.padraoAviso({
emoji: '🧊',
titulo: 'FIGURINHA NÃO REGISTRADA',
descricao: 'Essa figurinha não está registrada no sistema.'
}))
delete db[h]
modulos.salvarFiguras(db)
return ctx.reply(ctx.mess.padraoSucesso({
emoji: '🧊',
titulo: 'FIGURINHA REMOVIDA',
descricao: 'A figurinha foi removida do sistema.'
}))
}
const cmd = cmdNorm(String(ctx.q || '').split(/\s+/)[0])
if (!cmd)
return ctx.reply(ctx.mess.padraoUso({
emoji: '🧊',
titulo: 'REGISTRAR FIGURINHA',
uso: `${ctx.prefix}rgfig ban`,
descricao: 'Responda a uma figurinha e informe o comando que ela deve executar.'
}))
if (!ctx.plugins.resolver(cmd))
return ctx.reply(ctx.mess.padraoErro({
titulo: 'COMANDO NÃO ENCONTRADO',
descricao: `O comando ${cmd} não existe nos plugins.`
}))
db[h] = cmd
modulos.salvarFiguras(db)
return ctx.reply(ctx.mess.padraoSucesso({
emoji: '🧊',
titulo: 'FIGURINHA REGISTRADA',
descricao: `Essa figurinha agora executa ${ctx.prefix}${cmd}.`
}))
}
}
)
