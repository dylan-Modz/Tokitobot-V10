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

const dados = {
autodl: {
emoji: '📥',
titulo: '𝙰𝚄𝚃𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳',
descricao: 'ᴅᴇᴛᴇᴄᴛᴀ ʟɪɴᴋs sᴜᴘᴏʀᴛᴀᴅᴏs ᴇ ʙᴀɪxᴀ ᴀ ᴍɪ́ᴅɪᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'
},
autosticker: {
emoji: '🖼️',
titulo: '𝙰𝚄𝚃𝙾 𝚂𝚃𝙸𝙲𝙺𝙴𝚁',
descricao: 'ᴛʀᴀɴsғᴏʀᴍᴀ ɪᴍᴀɢᴇɴs ᴇ ᴠɪ́ᴅᴇᴏs ᴄᴜʀᴛᴏs ᴇᴍ ғɪɢᴜʀɪɴʜᴀs ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'
},
autortext: {
emoji: '🎙️',
titulo: '𝙰𝚄𝚃𝙾 𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾',
descricao: 'ᴛʀᴀɴsᴄʀᴇᴠᴇ ᴀ́ᴜᴅɪᴏs ᴇ ᴘᴛᴛs ᴇɴᴠɪᴀᴅᴏs ɴᴏ ɢʀᴜᴘᴏ.'
}
}

module.exports = {
nome: 'autodl',

comandos: [
'autodl',
'autosticker',
'autortext'
],

categoria: 'admin',

info: {
descricao: 'Ativa sistemas automáticos do grupo.',
uso: 'autodl 1/0',
permissao: 'ADM'
},

async executar(ctx) {
if (!ctx.isGroup) {
return ctx.reply(
ctx.mess.sogrupo()
)
}

if (!ctx.isGroupAdmins && !ctx.SoDono) {
return ctx.reply(
ctx.mess.soadm()
)
}

const configuracao = dados[ctx.command]
const acao = String(ctx.q || '').trim()

if (!['0', '1'].includes(acao)) {
return ctx.reply(
ctx.mess.funcaoUso(
configuracao.emoji,
configuracao.titulo,
ctx.prefix,
ctx.command,
configuracao.descricao
)
)
}

const ativado = acao === '1'
ctx.dataGp[0].funcoes[ctx.command] = ativado
ctx.setGp(ctx.dataGp)

await ctx.reagir(
ctx.from,
ativado ? '✅' : '❌'
).catch(() => {
})

return ctx.reply(
ativado
? ctx.mess.funcaoAtivada(
configuracao.emoji,
configuracao.titulo,
configuracao.descricao
)
: ctx.mess.funcaoDesativada(
configuracao.emoji,
configuracao.titulo,
configuracao.descricao
)
)
}
}
