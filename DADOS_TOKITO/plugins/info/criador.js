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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "criador",
comandos: ["criador"],
categoria: "info",

info: {
descricao: "Mostra as informações do desenvolvedor do bot.",
uso: "criador",
categoria: "info"
},

async executar(ctx) {
with (ctx) {
{
const texto = `— *✨ ᴄᴏɴᴛᴀᴛᴏ ᴅᴏ ᴅᴇsᴇɴᴠᴏʟᴠᴇᴅᴏʀ*

> *👑 ᴄʀɪᴀᴅᴏʀ:* dylan Modz
> *📱 ᴄᴏɴᴛᴀᴛᴏ:* https://wa.me/5511975431163

•
— "ᴀʟɢᴜɴs ᴘʀᴏᴊᴇᴛᴏs ɴᴀsᴄᴇᴍ ᴅᴇ ᴜᴍᴀ ɪᴅᴇɪᴀ.
ᴏᴜᴛʀᴏs ɴᴀsᴄᴇᴍ ᴅᴀ ᴠᴏɴᴛᴀᴅᴇ ᴅᴇ ғᴀᴢᴇʀ ᴀʟɢᴏ ᴅɪғᴇʀᴇɴᴛᴇ."

•
- *${NomeDoBot} ғᴏɪ ᴄʀɪᴀᴅᴏ ᴄᴏᴍ ᴏ ᴏʙᴊᴇᴛɪᴠᴏ ᴅᴇ ᴇɴᴛʀᴇɢᴀʀ ᴜᴍᴀ ᴇxᴘᴇʀɪᴇ̂ɴᴄɪᴀ ᴄᴏᴍᴘʟᴇᴛᴀ, ʀᴀ́ᴘɪᴅᴀ ᴇ ᴅɪᴠᴇʀᴛɪᴅᴀ ᴘᴀʀᴀ ᴏs ᴜsᴜᴀ́ʀɪᴏs.*

- *ᴄᴀᴅᴀ ᴄᴏᴍᴀɴᴅᴏ, sɪsᴛᴇᴍᴀ ᴇ ғᴜɴᴄ̧ᴀ̃ᴏ ғᴏɪ ᴘᴇɴsᴀᴅᴏ ᴘᴀʀᴀ ᴅᴇɪxᴀʀ ᴏ ʙᴏᴛ ᴍᴀɪs ᴏʀɢᴀɴɪᴢᴀᴅᴏ, ᴇғɪᴄɪᴇɴᴛᴇ ᴇ ғᴀ́ᴄɪʟ ᴅᴇ ᴜsᴀʀ.*

- *ᴏ ᴘʀᴏᴊᴇᴛᴏ ᴄᴏɴᴛɪɴᴜᴀ ᴇᴠᴏʟᴜɪɴᴅᴏ ᴄᴏᴍ ɴᴏᴠᴀs ғᴜɴᴄ̧ᴏ̃ᴇs, ᴍᴇʟʜᴏʀɪᴀs ᴇ ᴄᴏʀʀᴇᴄ̧ᴏ̃ᴇs ᴘᴀʀᴀ ᴏғᴇʀᴇᴄᴇʀ ᴜᴍᴀ ᴇxᴘᴇʀɪᴇ̂ɴᴄɪᴀ ᴄᴀᴅᴀ ᴠᴇᴢ ᴍᴇʟʜᴏʀ.*

- *sᴇ ᴠᴏᴄᴇ ᴇsᴛᴀ́ ᴜsᴀɴᴅᴏ ${NomeDoBot}, ᴇsᴘᴇʀᴏ ǫᴜᴇ ᴀᴘʀᴏᴠᴇɪᴛᴇ ᴄᴀᴅᴀ ғᴜɴᴄ̧ᴀ̃ᴏ ᴇ ǫᴜᴇ ᴏ ᴘʀᴏᴊᴇᴛᴏ sᴇᴊᴀ ᴜ́ᴛɪʟ ᴘᴀʀᴀ ᴠᴏᴄᴇ. 🥇*

•
> *${NomeDoBot}*
> *ᴅᴇsᴇɴᴠᴏʟᴠɪᴅᴏ ᴘᴏʀ dylan Modz 🩵*`

await reply(texto)
}
}
}
}
)
