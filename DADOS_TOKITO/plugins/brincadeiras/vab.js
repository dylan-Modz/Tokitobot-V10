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

const banco = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/brincadeiras/vab.json'), 'utf8'))

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'vab',
comandos: ['vab'],
categoria: 'brincadeiras',
info: {
descricao: 'Você Prefere com votação.',
uso: 'vab',
requisitos: 'Modo Brincadeiras',
categoria: 'brincadeiras'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isModobn)
return ctx.reply(ctx.mess.onlyGroupFun(ctx.prefix))
const grupos = banco.filter(x => Array.isArray(x.questions) && x.questions.length)
if (!grupos.length)
return ctx.reply(ctx.mess.padraoAviso({
emoji: '🎲',
titulo: 'BANCO VAZIO',
descricao: 'O banco de perguntas está vazio.'
}))
const g = grupos[Math.floor(Math.random() * grupos.length)]
const s = g.questions[Math.floor(Math.random() * g.questions.length)]
await ctx.reagir(ctx.from, '🎭').catch(() => {
})
return ctx.tokito.sendMessage(ctx.from, {
poll: {
name: `*🤔 ᴠᴏᴄᴇ ᴘʀᴇғᴇʀᴇ ⧽*\n•\n> 1️⃣ - ${s.pergunta1}\n-\n> 2️⃣ - ${s.pergunta2}\n•\n⚡ ᴇsᴄᴏʟʜᴀ ʙᴇᴍ...`,
values: ['✰ ᴏᴘᴄᴀᴏ 1 ✰', '✰ ᴏᴘᴄᴀᴏ 2 ✰'],
selectableCount: 1
}
}, { quoted: ctx.selo })
}
}
)
