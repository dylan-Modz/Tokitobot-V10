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

const cmdNorm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c').replace(/^\W+/, '')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'rgcmd',
comandos: ['rgcmd', 'delcmd', 'noprefix'],
categoria: 'dono',
info: {
descricao: 'Registra comandos para funcionar sem prefixo.',
uso: 'rgcmd palavra comando',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
const db = modulos.noPrefix()
if (ctx.command === 'noprefix') {
const itens = Object.entries(db)
return ctx.reply(ctx.mess.padraoLista({
emoji: '🧊',
titulo: 'SYSTEM NO PREFIX',
itens: itens.map(([gatilho, comando]) => `${gatilho} → ${comando}`),
vazio: 'Nenhum comando sem prefixo registrado.'
}))
}
const p = String(ctx.q || '').trim().split(/\s+/).filter(Boolean)
if (ctx.command === 'delcmd') {
const k = modulos.norm(p[0])
if (!k)
return ctx.reply(ctx.mess.padraoUso({
emoji: '🗑️',
titulo: 'REMOVER GATILHO',
uso: `${ctx.prefix}delcmd palavra`,
descricao: 'Informe o gatilho sem prefixo que deseja remover.'
}))
if (!db[k])
return ctx.reply(ctx.mess.padraoAviso({
titulo: 'GATILHO NÃO ENCONTRADO',
descricao: 'Esse gatilho não existe no sistema sem prefixo.'
}))
delete db[k]
modulos.salvarNoPrefix(db)
return ctx.reply(ctx.mess.padraoSucesso({
titulo: 'GATILHO REMOVIDO',
descricao: `O gatilho ${k} foi removido.`
}))
}
const gatilho = modulos.norm(p.shift())
const real = cmdNorm(p.shift())
if (!gatilho || !real)
return ctx.reply(ctx.mess.padraoUso({
emoji: '🧩',
titulo: 'REGISTRAR GATILHO',
uso: `${ctx.prefix}rgcmd ban ban`,
descricao: 'Informe o gatilho e o comando que ele deve executar.'
}))
if (!ctx.plugins.resolver(real))
return ctx.reply(ctx.mess.padraoErro({
titulo: 'COMANDO NÃO ENCONTRADO',
descricao: `O comando ${real} não existe nos plugins.`
}))
db[gatilho] = real
modulos.salvarNoPrefix(db)
return ctx.reply(ctx.mess.padraoSucesso({
titulo: 'GATILHO REGISTRADO',
descricao: `${gatilho} agora executa ${ctx.prefix}${real} sem precisar do prefixo.`
}))
}
}
)
