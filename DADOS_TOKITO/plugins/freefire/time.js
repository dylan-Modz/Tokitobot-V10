/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const x4 = require('./_x4')

module.exports = {
nome: 'time',
comandos: ['time', 'lista'],
categoria: 'freefire',
info: {
descricao: 'Monta dois times de 3 jogadores para X4.',
uso: 'time jogador1,jogador2,jogador3,jogador4,jogador5,jogador6',
categoria: 'freefire'
},
async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!x4.ativo(ctx)) return ctx.reply(`- ⚠️ \`𝙼𝙾𝙳𝙾 𝚇𝟺\`\n\n> *ᴀᴛɪᴠᴇ ᴘʀɪᴍᴇɪʀᴏ ᴄᴏᴍ ${ctx.prefix}modox4 1.*`)

const nomes = String(ctx.q || '').split(',').map(v => v.trim()).filter(Boolean)
if (nomes.length != 6) return ctx.reply(`- ❌ \`𝚃𝙸𝙼𝙴 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`\n\n> *ɪɴғᴏʀᴍᴇ ᴇxᴀᴛᴀᴍᴇɴᴛᴇ 6 ɴᴏᴍᴇs sᴇᴘᴀʀᴀᴅᴏs ᴘᴏʀ ᴠɪ́ʀɢᴜʟᴀ.*`)

const a = nomes.slice(0, 3)
const b = nomes.slice(3, 6)

const texto = `『 🗝️✨ 𝐇𝐎𝐖𝐋'𝐒 𝐂𝐀𝐒𝐓𝐋𝐄 ✨🗝️ 』\n\n${a.map(v => `🗝️ › ${v}`).join('\n')}\n\n　　　　　𝐕𝐒\n\n${b.map(v => `✨ › ${v}`).join('\n')}\n\n👤 𝙇𝙀𝙊𝙉 • 𝘼𝙇𝙊𝙆 • 𝙆𝙀𝙇𝙇𝙔 • 𝙈𝘼𝙓𝙄𝙈 • 𝙈𝙊𝘾𝙊\n🚫 𝙋𝙀𝙏𝙎: 𝙀𝙏 & 𝘿𝙍𝘼𝙌𝙐𝙄𝙉𝙃𝙊\n\n🗝️ 𝑸𝙐𝙀 𝘼 𝙈𝘼𝙂𝙄𝘼 𝘿𝙀 𝙃𝙊𝙒𝙇 𝙂𝙐𝙄𝙀 𝙀𝙎𝙏𝘼 𝘽𝘼𝙏𝘼𝙇𝙃𝘼.\n✨ 𝙍𝙀𝙎𝙋𝙀𝙄𝙏𝙀𝙈 𝘼𝙎 𝙍𝙀𝙂𝙍𝘼𝙎 𝘿𝙊 𝙓𝟒.\n✨ 𝘽𝙊𝙈 𝙓𝟒 𝘼 𝙏𝙊𝘿𝙊𝙎.`

return ctx.reply(texto)
}
}
