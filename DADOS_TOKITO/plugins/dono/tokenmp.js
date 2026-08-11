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

const fs = require('fs')
const path = require('path')

module.exports = {
nome: 'tokenmp',
comandos: ['tokenmp', 'settokenmp'],
categoria: 'dono',
info: {
descricao: 'Configura o Access Token do Mercado Pago.',
uso: 'tokenmp ACCESS_TOKEN',
permissao: 'Dono/privado',
categoria: 'dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
if (ctx.isGroup)
return ctx.reply(ctx.mess.tokenMpPrivado())
const token = String(ctx.q || '').trim()
if (!token)
return ctx.reply(ctx.mess.tokenMpUso(ctx.prefix))
const arq = path.join(ctx.__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'config-all.json')
const cfg = JSON.parse(fs.readFileSync(arq, 'utf8'))
cfg.MP_TOKEN = token
const tmp = arq + '.tmp'
fs.writeFileSync(tmp, JSON.stringify(cfg, null, 2) + '\n')
fs.renameSync(tmp, arq)
if (ctx.setting && typeof ctx.setting === 'object')
ctx.setting.MP_TOKEN = token
return ctx.reply(ctx.mess.tokenMpSalvo())
}
}
