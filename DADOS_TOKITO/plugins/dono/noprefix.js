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

module.exports = {
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
return ctx.reply(itens.length ? '🧊 *SYSTEM NO PREFIX*\n\n' + itens.map(([a, b]) => `• ${a} → ${b}`).join('\n') : '🧊 Nenhum comando sem prefixo registrado.')
}
const p = String(ctx.q || '').trim().split(/\s+/).filter(Boolean)
if (ctx.command === 'delcmd') {
const k = modulos.norm(p[0])
if (!k)
return ctx.reply(`Use *${ctx.prefix}delcmd palavra*.`)
if (!db[k])
return ctx.reply('❌ Esse gatilho não existe.')
delete db[k]
modulos.salvarNoPrefix(db)
return ctx.reply(`✅ Gatilho *${k}* removido.`)
}
const gatilho = modulos.norm(p.shift())
const real = cmdNorm(p.shift())
if (!gatilho || !real)
return ctx.reply(`Use *${ctx.prefix}rgcmd ban ban*.`)
if (!ctx.plugins.resolver(real))
return ctx.reply(`❌ O comando *${real}* não existe nos plugins.`)
db[gatilho] = real
modulos.salvarNoPrefix(db)
return ctx.reply(`✅ Agora *${gatilho}* executa *${ctx.prefix}${real}* sem precisar do prefixo.`)
}
}
