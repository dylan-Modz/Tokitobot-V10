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

/*
* Mensagens globais utilizadas pela base.
* Author: dylan Modz.
*/
exports.onlyOwner = () => {
return `- 🧊 \`𝙰𝙲𝙴𝚂𝚂𝙾 𝙳𝙾 𝙳𝙾𝙽𝙾\`

> *『 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ᴏ ᴍᴇᴜ ᴅᴏɴᴏ ᴜᴛɪʟɪᴢᴀʀ. 🙇‍♂️*`
}

exports.commandNotFound = ({ prefix, command, nome, porcentagem, tempo }) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐶𝑂𝑀𝐴𝑁𝐷𝑂-𝐼𝑁𝑉𝐴́𝐿𝐼𝐷𝑂
┃࣪ ╎—̳͟͞͞ ❌̸ ᴄᴏᴍᴀɴᴅᴏ: ${prefix}${command || 'desconhecido'}
┃࣪ ╎—̳͟͞͞ 🔎̸ ᴘᴀʀᴇᴄɪᴅᴏ: ${nome || 'Nenhum'}
┃࣪ ╎—̳͟͞͞ 📊̸ sᴇᴍᴇʟʜᴀɴᴄ̧ᴀ: ${porcentagem || '0%'}
┃࣪ ╎—̳͟͞͞ ⚡̸ ᴠᴇʟᴏᴄɪᴅᴀᴅᴇ: ${tempo || '0 ms'}
┃࣪ ╎—̳͟͞͞ 🧊̸ ᴀᴊᴜᴅᴀ: ${prefix}menu
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.sogrupo = () => {
return `- 👥 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙴𝙼 𝙶𝚁𝚄𝙿𝙾𝚂\`

> *『 𝙶𝚁𝚄𝙿𝙾 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ sᴏ́ ᴘᴏᴅᴇ sᴇʀ ᴜᴛɪʟɪᴢᴀᴅᴏ ᴅᴇɴᴛʀᴏ ᴅᴇ ᴜᴍ ɢʀᴜᴘᴏ ᴅᴏ ᴡʜᴀᴛsᴀᴘᴘ. 🙇‍♂️*`
}

exports.soadm = () => {
return `- 👑 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂\`

> *『 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁 』— ᴀᴘᴇɴᴀs ᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴅᴏ ɢʀᴜᴘᴏ ᴘᴏᴅᴇᴍ ᴜᴛɪʟɪᴢᴀʀ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ. 🙇‍♂️*`
}

exports.botadm = () => {
return `- ⚙️ \`𝙱𝙾𝚃 𝚂𝙴𝙼 𝙰𝙳𝙼𝙸𝙽\`

> *『 𝙿𝙴𝚁𝙼𝙸𝚂𝚂𝙰̃𝙾 』— ᴇᴜ ᴘʀᴇᴄɪsᴏ sᴇʀ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴏ ɢʀᴜᴘᴏ ᴘᴀʀᴀ ᴄᴏɴsᴇɢᴜɪʀ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴀ ᴀᴄ̧ᴀ̃ᴏ. 🙇‍♂️*`
}

exports.marque = () => {
return `- 👤 \`𝙼𝙰𝚁𝚀𝚄𝙴 𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

> *『 @𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 』— ᴍᴀʀǫᴜᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴏᴜ ʀᴇsᴘᴏɴᴅᴀ ᴀ̀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴀ ᴘᴇssᴏᴀ ǫᴜᴇ ᴅᴇsᴇᴊᴀ sᴇʟᴇᴄɪᴏɴᴀʀ. 🙇‍♂️*`
}

exports.nobot = () => {
return `- 🤖 \`𝙰𝙲̧𝙰̃𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙰\`

> *『 𝙼𝙴𝚄 𝙽𝚄́𝙼𝙴𝚁𝙾 』— ᴇᴜ ɴᴀ̃ᴏ ᴘᴏssᴏ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴀ ᴀᴄ̧ᴀ̃ᴏ ᴄᴏᴍɪɢᴏ ᴍᴇsᴍᴏ. 🙇‍♂️*`
}

exports.nodono = () => {
return `- 👑 \`𝙳𝙾𝙽𝙾 𝙿𝚁𝙾𝚃𝙴𝙶𝙸𝙳𝙾\`

> *『 𝙳𝙾𝙽𝙾 𝙳𝙾 𝙱𝙾𝚃 』— ɴᴀ̃ᴏ ᴇ́ ᴘᴏssɪ́ᴠᴇʟ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴀ ᴀᴄ̧ᴀ̃ᴏ ᴄᴏᴍ ᴜᴍ ᴅᴏs ᴅᴏɴᴏs ᴅᴏ ʙᴏᴛ. 🙇‍♂️*`
}

exports.jaadm = () => {
return `- 👑 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙹𝙰́ 𝙴́ 𝙰𝙳𝙼\`

> *『 𝙰𝙳𝙼𝙸𝙽 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴊᴀ́ ᴘᴏssᴜɪ ᴏ ᴄᴀʀɢᴏ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴏ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.naoadm = () => {
return `- 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙽𝙰̃𝙾 𝙴́ 𝙰𝙳𝙼\`

> *『 𝙼𝙴𝙼𝙱𝚁𝙾 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴏ ᴄᴀʀɢᴏ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴏ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.banido = alvo => {
return `- 🚫 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> *『 @${alvo.split('@')[0]} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴏ ɢʀᴜᴘᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.promovido = alvo => {
return `- 👑 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙿𝚁𝙾𝙼𝙾𝚅𝙸𝙳𝙾\`

> *『 @${alvo.split('@')[0]} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ᴘʀᴏᴍᴏᴠɪᴅᴏ ᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.rebaixado = alvo => {
return `- 📉 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝚁𝙴𝙱𝙰𝙸𝚇𝙰𝙳𝙾\`

> *『 @${alvo.split('@')[0]} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇʙᴀɪxᴀᴅᴏ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.falha = () => {
return `- ❌ \`𝙰𝙲̧𝙰̃𝙾 𝙵𝙰𝙻𝙷𝙾𝚄\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇxᴇᴄᴜᴛᴀʀ ᴀ ᴀᴄ̧ᴀ̃ᴏ sᴏʟɪᴄɪᴛᴀᴅᴀ, ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
}

exports.error = () => {
return `- ❌ \`𝙾𝙲𝙾𝚁𝚁𝙴𝚄 𝚄𝙼 𝙴𝚁𝚁𝙾\`

> *『 𝙴𝚁𝚁𝙾 𝙸𝙽𝙴𝚂𝙿𝙴𝚁𝙰𝙳𝙾 』— ᴏᴄᴏʀʀᴇᴜ ᴜᴍ ᴇʀʀᴏ ᴀᴏ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ, ᴠᴇʀɪғɪǫᴜᴇ ᴏs ᴅᴀᴅᴏs ᴇ ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
}

exports.wait = () => {
return `- ⏳ \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴 𝚄𝙼 𝙿𝙾𝚄𝙲𝙾\`

> *『 𝙿𝚁𝙾𝙲𝙴𝚂𝚂𝙰𝙽𝙳𝙾 』— ᴇsᴛᴏᴜ ᴘʀᴏᴄᴇssᴀɴᴅᴏ ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ, ᴀɢᴜᴀʀᴅᴇ ᴀᴛᴇ́ ǫᴜᴇ ᴛᴜᴅᴏ sᴇᴊᴀ ᴄᴏɴᴄʟᴜɪ́ᴅᴏ. 🙇‍♂️*`
}

exports.ownerSlotEmpty = () => {
return `- 👑 \`𝙴𝚂𝙿𝙰𝙲̧𝙾 𝚅𝙰𝚉𝙸𝙾\`

> *『 𝚂𝙴𝙼 𝙳𝙾𝙽𝙾 』— ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍ ᴅᴏɴᴏ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ ɴᴇssᴇ ᴇsᴘᴀᴄ̧ᴏ ᴘᴀʀᴀ sᴇʀ ʀᴇᴍᴏᴠɪᴅᴏ. 🙇‍♂️*`
}

exports.ownerRemoved = numero => {
return `- 👋 \`𝙳𝙾𝙽𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> *『 @${numero} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴛɪʀᴀᴅᴏ ᴅᴏ ᴛɪᴍᴇ ᴅᴏs ᴅᴏɴᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.ownerNumberRequired = () => {
return `- 📱 \`𝙽𝚄́𝙼𝙴𝚁𝙾 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`

> *『 @𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 』— ᴍᴇɴᴄɪᴏɴᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴏᴜ ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴄᴏᴍᴘʟᴇᴛᴏ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴄᴀᴅᴀsᴛʀᴀʀ. 🙇‍♂️*`
}

exports.ownerAdded = numero => {
return `- 👑 \`𝙽𝙾𝚅𝙾 𝙳𝙾𝙽𝙾\`

> *『 @${numero} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴀɢᴏʀᴀ ғᴀᴢ ᴘᴀʀᴛᴇ ᴅᴏ ᴛɪᴍᴇ ᴅᴏs ᴅᴏɴᴏs ᴅᴏ ʙᴏᴛ. 🙇‍♂️*`
}

exports.ownerSlotRequired = () => {
return `- 🔢 \`𝙴𝚂𝙲𝙾𝙻𝙷𝙰 𝙾 𝙴𝚂𝙿𝙰𝙲̧𝙾\`

> *『 1 𝙰 6 』— ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴇsᴘᴀᴄ̧ᴏ ᴅᴏ ᴅᴏɴᴏ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ʀᴇᴍᴏᴠᴇʀ. 🙇‍♂️*`
}

exports.ownerSlotInvalid = () => {
return `- ❌ \`𝙴𝚂𝙿𝙰𝙲̧𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> *『 1 𝙰 6 』— ɪɴғᴏʀᴍᴇ ᴜᴍ ɴᴜ́ᴍᴇʀᴏ ᴠᴀ́ʟɪᴅᴏ ᴅᴇɴᴛʀᴏ ᴅᴇssᴇ ɪɴᴛᴇʀᴠᴀʟᴏ. 🙇‍♂️*`
}

exports.ownerSlotNotRegistered = numero => {
return `- ❌ \`𝙳𝙾𝙽𝙾 𝙽𝙰̃𝙾 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾\`

> *『 𝙴𝚂𝙿𝙰𝙲̧𝙾 ${numero} 』— ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍ ᴅᴏɴᴏ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ ɴᴇssᴇ ᴇsᴘᴀᴄ̧ᴏ. 🙇‍♂️*`
}

exports.botNameRequired = prefix => {
return `- 🤖 \`𝙽𝙾𝚅𝙾 𝙽𝙾𝙼𝙴\`

> *『 ${prefix}nome-bot TOKITO BOT 』— ᴜsᴇ ᴏ ᴇxᴇᴍᴘʟᴏ ᴀᴏ ʟᴀᴅᴏ ᴇ ɪɴғᴏʀᴍᴇ ᴏ ɴᴏᴠᴏ ɴᴏᴍᴇ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴄᴏʟᴏᴄᴀʀ ɴᴏ ʙᴏᴛ. 🙇‍♂️*`
}

exports.botNameChanged = nome => {
return `- 🤖 \`𝙽𝙾𝙼𝙴 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾\`

> *『 ${nome} 』— ᴘʀᴏɴᴛᴏ ᴍᴇsᴛʀᴇ, ᴇssᴇ ᴀɢᴏʀᴀ ᴇ́ ᴏ ᴍᴇᴜ ɴᴏᴠᴏ ɴᴏᴍᴇ. 🙇‍♂️*`
}

exports.ownerNameRequired = prefix => {
return `- 👤 \`𝙽𝙾𝚅𝙾 𝙽𝙸𝙲𝙺\`

> *『 ${prefix}nome-dono dylan Modz 』— ᴜsᴇ ᴏ ᴇxᴇᴍᴘʟᴏ ᴀᴏ ʟᴀᴅᴏ ᴇ ɪɴғᴏʀᴍᴇ ᴏ ɴᴏᴠᴏ ɴɪᴄᴋ ᴅᴏ ᴅᴏɴᴏ. 🙇‍♂️*`
}

exports.ownerNameChanged = nome => {
return `- 👑 \`𝙽𝙸𝙲𝙺 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾\`

> *『 ${nome} 』— ᴄᴇʀᴛᴏ sᴇɴʜᴏʀ, ᴇssᴇ ᴀɢᴏʀᴀ ᴇ́ ᴏ ɴᴏᴠᴏ ɴɪᴄᴋ ᴅᴏ ᴅᴏɴᴏ. 🙇‍♂️*`
}

exports.mainOwnerRequired = prefix => {
return `- 👑 \`𝙽𝙾𝚅𝙾 𝙳𝙾𝙽𝙾 𝙿𝚁𝙸𝙽𝙲𝙸𝙿𝙰𝙻\`

> *『 ${prefix}numero-dono 5511999999999 』— ᴍᴀʀǫᴜᴇ ᴏ ɴᴏᴠᴏ ᴅᴏɴᴏ ᴏᴜ ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴄᴏᴍᴘʟᴇᴛᴏ. 🙇‍♂️*`
}

exports.mainOwnerChanged = numero => {
return `- 👑 \`𝙳𝙾𝙽𝙾 𝙿𝚁𝙸𝙽𝙲𝙸𝙿𝙰𝙻\`

> *『 @${numero} 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴀɢᴏʀᴀ ᴇ́ ᴏ ᴅᴏɴᴏ ᴘʀɪɴᴄɪᴘᴀʟ ᴅᴏ ʙᴏᴛ. 🙇‍♂️*`
}

exports.channelRequired = (prefix, command) => {
return `- 📢 \`𝙲𝙰𝙽𝙰𝙻 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`

> *『 ${prefix}${command} <link do canal> 』— ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ ᴏ ᴄᴀɴᴀʟ ɴᴀs ᴍᴇɴsᴀɢᴇɴs.*

> *『 ${prefix}${command} 0 』— ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴅᴇsᴀᴛɪᴠᴀʀ ᴏ ᴄᴀɴᴀʟ. 🙇‍♂️*`
}

exports.channelDisabled = () => {
return `- 🚫 \`𝙲𝙰𝙽𝙰𝙻 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏ ᴄᴀɴᴀʟ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ᴇ ɴᴀ̃ᴏ sᴇʀᴀ́ ᴍᴀɪs ᴍᴏsᴛʀᴀᴅᴏ ɴᴀs ᴍᴇɴsᴀɢᴇɴs. 🙇‍♂️*`
}

exports.channelEnabled = (jid, link) => {
return `- 📢 \`𝙲𝙰𝙽𝙰𝙻 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 ${jid} 』— ᴏ ᴄᴀɴᴀʟ ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ.*

> *『 ${link} 』— ᴇssᴇ ᴇ́ ᴏ ʟɪɴᴋ ᴅᴏ ᴄᴀɴᴀʟ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ. 🙇‍♂️*`
}

exports.prefixRequired = () => {
return `- 🧩 \`𝙽𝙾𝚅𝙾 𝙿𝚁𝙴𝙵𝙸𝚇𝙾\`

> *『 𝙿𝚁𝙴𝙵𝙸𝚇𝙾 』— ɪɴғᴏʀᴍᴇ ᴏ ɴᴏᴠᴏ ᴘʀᴇғɪxᴏ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴜᴛɪʟɪᴢᴀʀ ɴᴏs ᴄᴏᴍᴀɴᴅᴏs. 🙇‍♂️*`
}

exports.prefixChanged = prefix => {
return `- 💁‍♂️ \`𝙼𝙴𝚄 𝙿𝚁𝙴𝙵𝙸𝚇𝙾\`

> *『 ${prefix} 』— ᴇsᴛᴇ ᴇ́ ᴏ ᴍᴇᴜ ᴘʀᴇғɪxᴏ ᴀᴛᴜᴀʟ, ᴄᴏᴍ ᴇʟᴇ ᴠᴏᴄᴇ̂ ᴘᴏᴅᴇ ᴀᴄᴇssᴀʀ ᴛᴏᴅᴏs ᴏs ᴍᴇᴜs ᴄᴏᴍᴀɴᴅᴏs, ᴛᴀɴᴛᴏ ᴏs ᴀɴᴛɪɢᴏs ᴄᴏᴍᴏ ᴏs ɴᴏᴠᴏs. 🙇‍♂️*`
}

exports.menuMediaSaved = tipo => {
return `- ${tipo === 'video' ? '🎥' : '🖼️'} \`𝙼𝙸́𝙳𝙸𝙰 𝙳𝙾 𝙼𝙴𝙽𝚄\`

> *『 ${tipo === 'video' ? '𝚅𝙸́𝙳𝙴𝙾' : '𝙸𝙼𝙰𝙶𝙴𝙼'} 』— ᴀ ɴᴏᴠᴀ ᴍɪ́ᴅɪᴀ ᴅᴏ ᴍᴇɴᴜ ғᴏɪ sᴀʟᴠᴀ ʟᴏᴄᴀʟᴍᴇɴᴛᴇ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.menuMediaRequired = () => {
return `- 🖼️ \`𝙼𝙸́𝙳𝙸𝙰 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙰\`

> *『 𝙸𝙼𝙰𝙶𝙴𝙼 𝙾𝚄 𝚅𝙸́𝙳𝙴𝙾 』— ᴍᴀʀǫᴜᴇ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴏᴜ ᴜᴍ ᴠɪ́ᴅᴇᴏ ᴘᴀʀᴀ ᴅᴇғɪɴɪʀ ᴄᴏᴍᴏ ᴀ ɴᴏᴠᴀ ᴍɪ́ᴅɪᴀ ᴅᴏ ᴍᴇɴᴜ. 🙇‍♂️*`
}

exports.verifiedEnabled = () => {
return `- ✅ \`𝚂𝙴𝙻𝙾 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝚅𝙴𝚁𝙸𝙵𝙸𝙲𝙰𝙳𝙾 』— ᴏ sᴇʟᴏ ᴅᴇ ᴠᴇʀɪғɪᴄᴀᴅᴏ ɢʟᴏʙᴀʟ ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴇ sᴇʀᴀ́ ᴜᴛɪʟɪᴢᴀᴅᴏ ɴᴀs ʀᴇsᴘᴏsᴛᴀs ᴅᴏs ᴄᴏᴍᴀɴᴅᴏs. 🧊*`
}

exports.verifiedDisabled = () => {
return `- ❌ \`𝚂𝙴𝙻𝙾 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝚅𝙴𝚁𝙸𝙵𝙸𝙲𝙰𝙳𝙾 』— ᴏ sᴇʟᴏ ᴅᴇ ᴠᴇʀɪғɪᴄᴀᴅᴏ ɢʟᴏʙᴀʟ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴇ ɴᴀ̃ᴏ sᴇʀᴀ́ ᴍᴀɪs ᴜᴛɪʟɪᴢᴀᴅᴏ ɴᴀs ʀᴇsᴘᴏsᴛᴀs. 🧊*`
}

exports.reloadSuccess = arquivo => {
return `- ♻️ \`𝙰𝙻𝚃𝙴𝚁𝙰𝙲̧𝙾̃𝙴𝚂 𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙳𝙰𝚂\`

> *『 ${arquivo} 』— ᴀs ᴀʟᴛᴇʀᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ᴅᴇᴛᴇᴄᴛᴀᴅᴀs ᴇ ᴄᴀʀʀᴇɢᴀᴅᴀs ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.reloadError = arquivo => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝚁𝙴𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙼𝙴𝙽𝚃𝙾\`

> *『 ${arquivo} 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴀʀʀᴇɢᴀʀ ᴀs ᴀʟᴛᴇʀᴀᴄ̧ᴏ̃ᴇs ᴅᴇssᴇ ᴀʀǫᴜɪᴠᴏ.*`
}

exports.grupo = () => {
return `- 👥 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙴𝙼 𝙶𝚁𝚄𝙿𝙾𝚂\`

> *『 𝙶𝚁𝚄𝙿𝙾 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ sᴏ́ ᴘᴏᴅᴇ sᴇʀ ᴜᴛɪʟɪᴢᴀᴅᴏ ᴅᴇɴᴛʀᴏ ᴅᴇ ᴜᴍ ɢʀᴜᴘᴏ ᴅᴏ ᴡʜᴀᴛsᴀᴘᴘ. 🙇‍♂️*`
}

exports.adm = () => {
return `- 👑 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂\`

> *『 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁 』— ᴀᴘᴇɴᴀs ᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴅᴏ ɢʀᴜᴘᴏ ᴘᴏᴅᴇᴍ ᴜᴛɪʟɪᴢᴀʀ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ. 🙇‍♂️*`
}

exports.fechar = (prefix, hora) => {
if (hora) {
return `- 🔒 \`𝙵𝙴𝙲𝙷𝙰𝙼𝙴𝙽𝚃𝙾 𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝙳𝙾\`

> *『 ${hora} 』— ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴘʀᴏɢʀᴀᴍᴀᴅᴏ ᴘᴀʀᴀ ғᴇᴄʜᴀʀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ɴᴇssᴇ ʜᴏʀᴀ́ʀɪᴏ. 🙇‍♂️*`
}
return `- 🔒 \`𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝚁 𝙵𝙴𝙲𝙷𝙰𝙼𝙴𝙽𝚃𝙾\`

> *『 ${prefix}fechargp 22:00 』— ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴘʀᴏɢʀᴀᴍᴀʀ ᴏ ғᴇᴄʜᴀᴍᴇɴᴛᴏ ᴅᴏ ɢʀᴜᴘᴏ. ᴠᴏᴄᴇ̂ ᴛᴀᴍʙᴇ́ᴍ ᴘᴏᴅᴇ ᴍᴀʀᴄᴀʀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴏᴜ ᴠɪ́ᴅᴇᴏ. 🙇‍♂️*`
}

exports.abrir = (prefix, hora) => {
if (hora) {
return `- 🔓 \`𝙰𝙱𝙴𝚁𝚃𝚄𝚁𝙰 𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝙳𝙰\`

> *『 ${hora} 』— ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴘʀᴏɢʀᴀᴍᴀᴅᴏ ᴘᴀʀᴀ ᴀʙʀɪʀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ɴᴇssᴇ ʜᴏʀᴀ́ʀɪᴏ. 🙇‍♂️*`
}
return `- 🔓 \`𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝚁 𝙰𝙱𝙴𝚁𝚃𝚄𝚁𝙰\`

> *『 ${prefix}abrirgp 07:00 』— ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴘʀᴏɢʀᴀᴍᴀʀ ᴀ ᴀʙᴇʀᴛᴜʀᴀ ᴅᴏ ɢʀᴜᴘᴏ. ᴠᴏᴄᴇ̂ ᴛᴀᴍʙᴇ́ᴍ ᴘᴏᴅᴇ ᴍᴀʀᴄᴀʀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴏᴜ ᴠɪ́ᴅᴇᴏ. 🙇‍♂️*`
}

exports.fechado = (hora, grupo) => {
return `- 🔒 \`𝙶𝚁𝚄𝙿𝙾 𝙵𝙴𝙲𝙷𝙰𝙳𝙾\`

> *『 ${grupo} 』— ᴏ ɢʀᴜᴘᴏ ғᴏɪ ғᴇᴄʜᴀᴅᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ᴀ̀s 『 ${hora} 』. ᴀɢᴜᴀʀᴅᴇ ᴀᴛᴇ́ ᴏ ʜᴏʀᴀ́ʀɪᴏ ᴅᴇ ᴀʙᴇʀᴛᴜʀᴀ ᴘᴀʀᴀ ᴠᴏʟᴛᴀʀ ᴀ ᴇɴᴠɪᴀʀ ᴍᴇɴsᴀɢᴇɴs. 🙇‍♂️*`
}

exports.aberto = (hora, grupo) => {
return `- 🔓 \`𝙶𝚁𝚄𝙿𝙾 𝙰𝙱𝙴𝚁𝚃𝙾\`

> *『 ${grupo} 』— ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴀʙᴇʀᴛᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ᴀ̀s 『 ${hora} 』. ᴀɢᴏʀᴀ ᴛᴏᴅᴏs ᴏs ᴍᴇᴍʙʀᴏs ᴊᴀ́ ᴘᴏᴅᴇᴍ ᴠᴏʟᴛᴀʀ ᴀ ᴇɴᴠɪᴀʀ ᴍᴇɴsᴀɢᴇɴs ɴᴏ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.semhorario = () => {
return `- 🕒 \`𝙽𝙴𝙽𝙷𝚄𝙼 𝙷𝙾𝚁𝙰́𝚁𝙸𝙾\`

> *『 𝚂𝙴𝙼 𝙷𝙾𝚁𝙰́𝚁𝙸𝙾 』— ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍ ʜᴏʀᴀ́ʀɪᴏ ᴅᴇ ᴀʙᴇʀᴛᴜʀᴀ ᴏᴜ ғᴇᴄʜᴀᴍᴇɴᴛᴏ ᴘʀᴏɢʀᴀᴍᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.apagado = () => {
return `- 🗑️ \`𝙷𝙾𝚁𝙰́𝚁𝙸𝙾𝚂 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾𝚂\`

> *『 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾 』— ᴏs ʜᴏʀᴀ́ʀɪᴏs ᴅᴇ ᴀʙᴇʀᴛᴜʀᴀ ᴇ ғᴇᴄʜᴀᴍᴇɴᴛᴏ, ᴊᴜɴᴛᴀᴍᴇɴᴛᴇ ᴄᴏᴍ ᴀs ᴍɪ́ᴅɪᴀs sᴀʟᴠᴀs, ғᴏʀᴀᴍ ʀᴇᴍᴏᴠɪᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.donos = (nome, principal, extras = []) => {
let texto = `- 👑 \`𝚃𝙸𝙼𝙴 𝙳𝙾𝚂 𝙳𝙾𝙽𝙾𝚂\`

> *『 ${principal ? `@${principal}` : '𝙽𝙰̃𝙾 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾'} 』— ${principal ? `${nome || 'ᴅᴏɴᴏ'} ᴇ́ ᴏ ᴅᴏɴᴏ ᴘʀɪɴᴄɪᴘᴀʟ ᴅᴏ ʙᴏᴛ.` : 'ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ᴜᴍ ᴅᴏɴᴏ ᴘʀɪɴᴄɪᴘᴀʟ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ.'}*`
if (extras.length) {
texto += `\n\n- 👥 \`𝙳𝙾𝙽𝙾𝚂 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙸𝚂\`\n`
for (const dono of extras) {
texto += `\n> *『 ${dono.slot} 』— @${dono.numero}*`
}
}
else {
texto += `\n\n- 👥 \`𝙳𝙾𝙽𝙾𝚂 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙸𝚂\`\n\n> *『 0 』— ɴᴇɴʜᴜᴍ ᴅᴏɴᴏ ᴀᴅɪᴄɪᴏɴᴀʟ ғᴏɪ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ.*`
}
return texto
}

exports.bemvindo = ativo => {
return ativo
? `- ✅ \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ʙᴏᴀs-ᴠɪɴᴅᴀs ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
: `- ❌ \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ʙᴏᴀs-ᴠɪɴᴅᴀs ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.tags = (prefix, comando) => {
return `- 🏷️ \`𝚃𝙰𝙶𝚂 𝙳𝙰 𝙻𝙴𝙶𝙴𝙽𝙳𝙰\`

> *『 ${prefix}${comando} Bem-vindo #numero# ao #nomegrupo# 』— ɪɴғᴏʀᴍᴇ ᴀ ɴᴏᴠᴀ ʟᴇɢᴇɴᴅᴀ ᴜᴛɪʟɪᴢᴀɴᴅᴏ ᴀs ᴛᴀɢs ᴅɪsᴘᴏɴɪ́ᴠᴇɪs ᴀʙᴀɪxᴏ. 🙇‍♂️*

> *『 #numero# 』— ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ*
> *『 #numerodele# 』— ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ*
> *『 #nomegrupo# 』— ɴᴏᴍᴇ ᴅᴏ ɢʀᴜᴘᴏ*
> *『 #nomedogp# 』— ɴᴏᴍᴇ ᴅᴏ ɢʀᴜᴘᴏ*
> *『 #prefixo# 』— ᴘʀᴇғɪxᴏ ᴅᴏ ʙᴏᴛ*
> *『 #nomedobot# 』— ɴᴏᴍᴇ ᴅᴏ ʙᴏᴛ*
> *『 #hora# 』— ʜᴏʀᴀ́ʀɪᴏ ᴀᴛᴜᴀʟ*
> *『 #dia# 』— ᴅɪᴀ ᴅᴀ sᴇᴍᴀɴᴀ*
> *『 #data# 』— ᴅᴀᴛᴀ ᴀᴛᴜᴀʟ*
> *『 #ano# 』— ᴀɴᴏ ᴀᴛᴜᴀʟ*
> *『 #year# 』— ᴀɴᴏ ᴀᴛᴜᴀʟ*
> *『 #yeah# 』— ᴀɴᴏ ᴀᴛᴜᴀʟ*
> *『 #estado# 』— ᴇsᴛᴀᴅᴏ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ*
> *『 #membros# 』— ᴛᴏᴛᴀʟ ᴅᴇ ᴍᴇᴍʙʀᴏs*`
}

exports.legenda = tipo => {
return `- 📝 \`𝙻𝙴𝙶𝙴𝙽𝙳𝙰 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙰\`

> *『 ${tipo} 』— ᴀ ʟᴇɢᴇɴᴅᴀ ᴅᴇ ${tipo} ғᴏɪ ᴀʟᴛᴇʀᴀᴅᴀ ᴇ sᴀʟᴠᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.midia = () => {
return `- 🖼️ \`𝙼𝙸́𝙳𝙸𝙰 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙰\`

> *『 𝙸𝙼𝙰𝙶𝙴𝙼 𝙾𝚄 𝚅𝙸́𝙳𝙴𝙾 』— ᴍᴀʀǫᴜᴇ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴏᴜ ᴜᴍ ᴠɪ́ᴅᴇᴏ ᴘᴀʀᴀ sᴇʀ ᴜᴛɪʟɪᴢᴀᴅᴏ ᴄᴏᴍᴏ ғᴜɴᴅᴏ ᴅᴀ ᴍᴇɴsᴀɢᴇᴍ. 🙇‍♂️*`
}

exports.fundo = tipo => {
return `- 🖼️ \`𝙵𝚄𝙽𝙳𝙾 𝚂𝙰𝙻𝚅𝙾\`

> *『 ${tipo} 』— ᴏ ғᴜɴᴅᴏ ᴅᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ${tipo} ғᴏɪ sᴀʟᴠᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.fundos = () => {
return `- 🗑️ \`𝙵𝚄𝙽𝙳𝙾𝚂 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾𝚂\`

> *『 𝙴𝙽𝚃𝚁𝙰𝙳𝙰 𝙴 𝚂𝙰𝙸́𝙳𝙰 』— ᴏs ғᴜɴᴅᴏs ᴅᴀs ᴍᴇɴsᴀɢᴇɴs ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ᴇ sᴀɪ́ᴅᴀ ғᴏʀᴀᴍ ʀᴇᴍᴏᴠɪᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.funcaoUso = (emoji, titulo, prefix, comando, descricao) => {
return `- ${emoji} \`${titulo}\`

『 ✅ \`𝙰𝚃𝙸𝚅𝙰𝚁\` 』— ${prefix}${comando} 1
『 ❌ \`𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝚁\` 』— ${prefix}${comando} 0
『 ℹ️ \`𝙵𝚄𝙽𝙲̧𝙰̃𝙾\` 』— ${descricao}`
}

exports.funcaoAtivada = (emoji, titulo, descricao) => {
return `- ${emoji} \`${titulo}\`

『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— 🟢 ᴀᴛɪᴠᴀᴅᴏ
『 ℹ️ \`𝙵𝚄𝙽𝙲̧𝙰̃𝙾\` 』— ${descricao}`
}

exports.funcaoDesativada = (emoji, titulo, descricao) => {
return `- ${emoji} \`${titulo}\`

『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— 🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ
『 ℹ️ \`𝙵𝚄𝙽𝙲̧𝙰̃𝙾\` 』— ${descricao}`
}

exports.funcaoInvalida = (prefix, comando) => {
return `- ❌ \`𝙾𝙿𝙲̧𝙰̃𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\`

> *『 ${prefix}${comando} 1 』— ᴜsᴇ ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ.*
> *『 ${prefix}${comando} 0 』— ᴜsᴇ ᴘᴀʀᴀ ᴅᴇsᴀᴛɪᴠᴀʀ. 🙇‍♂️*`
}

exports.novaSolicitacao = (numero, grupo) => {
return `- 📥 \`𝙽𝙾𝚅𝙰 𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾\`

> *『 @${numero} 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴇsᴛᴀ́ sᴏʟɪᴄɪᴛᴀɴᴅᴏ ᴇɴᴛʀᴀᴅᴀ ɴᴏ ɢʀᴜᴘᴏ.*

> *『 ${grupo} 』— ᴇsᴄᴏʟʜᴀ ᴀʙᴀɪxᴏ sᴇ ᴅᴇsᴇᴊᴀ ᴀᴘʀᴏᴠᴀʀ ᴏᴜ ʀᴇᴄᴜsᴀʀ ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ. 🙇‍♂️*`
}

exports.semPedidos = () => {
return `- 📥 \`𝙽𝙴𝙽𝙷𝚄𝙼 𝙿𝙴𝙳𝙸𝙳𝙾\`

> *『 0 』— ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴘᴇɴᴅᴇɴᴛᴇ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.pedidoIndisponivel = numero => {
return `- ❌ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙸𝙽𝙳𝙸𝚂𝙿𝙾𝙽𝙸́𝚅𝙴𝙻\`

> *『 @${numero} 』— ᴇssᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴍᴀɪs ᴅɪsᴘᴏɴɪ́ᴠᴇʟ. 🙇‍♂️*`
}

exports.pedidoAprovado = numero => {
return `- ✅ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙰\`

> *『 @${numero} 』— ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.pedidoRecusado = numero => {
return `- ❌ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙰\`

> *『 @${numero} 』— ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ғᴏɪ ʀᴇᴄᴜsᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.aprovacaoAutomatica = quantidade => {
return `- ✅ \`𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

> *『 ${quantidade} 』— ${quantidade === 1 ? 'ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ' : 'sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ᴀᴘʀᴏᴠᴀᴅᴀs'} ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
}

exports.pedidosPendentes = pedidos => {
let texto = `- 📥 \`𝙿𝙴𝙳𝙸𝙳𝙾𝚂 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴𝚂\`

> *『 ${pedidos.length} 』— ${pedidos.length === 1 ? 'ᴇxɪsᴛᴇ ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴘᴇɴᴅᴇɴᴛᴇ.' : 'ᴇxɪsᴛᴇᴍ sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴘᴇɴᴅᴇɴᴛᴇs.'}*`
for (let i = 0; i < pedidos.length; i++)
texto += `\n\n> *『 ${i + 1} 』— @${String(pedidos[i].jid || '').split('@')[0]}*`
return texto
}

exports.todosAprovados = quantidade => {
return `- ✅ \`𝚃𝙾𝙳𝙾𝚂 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙾𝚂\`

> *『 ${quantidade} 』— ${quantidade === 1 ? 'ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ' : 'sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ᴀᴘʀᴏᴠᴀᴅᴀs'} ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.todosRecusados = quantidade => {
return `- ❌ \`𝚃𝙾𝙳𝙾𝚂 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾𝚂\`

> *『 ${quantidade} 』— ${quantidade === 1 ? 'ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ʀᴇᴄᴜsᴀᴅᴀ' : 'sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ʀᴇᴄᴜsᴀᴅᴀs'} ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.antilinkDetectado = (nivel, numero, removido = true) => {
const dados = {
easy: ['🛡️', '𝙰𝙽𝚃𝙸-𝙻𝙸𝙽𝙺 𝙴𝙰𝚂𝚈', 'ᴏ ʟɪɴᴋ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴏ ᴇ ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ'],
medium: ['🔒', '𝙰𝙽𝚃𝙸-𝙻𝙸𝙽𝙺 𝙼𝙴𝙳𝙸𝚄𝙼', 'ᴏ ʟɪɴᴋ ғᴏɪ ᴀᴘᴀɢᴀᴅᴏ, ᴏ ɢʀᴜᴘᴏ ғᴏɪ ғᴇᴄʜᴀᴅᴏ ᴇ ᴀʙᴇʀᴛᴏ ɴᴏᴠᴀᴍᴇɴᴛᴇ'],
hard: [
'🚫',
'𝙰𝙽𝚃𝙸-𝙻𝙸𝙽𝙺 𝙷𝙰𝚁𝙳',
removido ? 'ᴏ ʟɪɴᴋ ғᴏɪ ᴀᴘᴀɢᴀᴅᴏ, ᴏ ɢʀᴜᴘᴏ ғᴏɪ ғᴇᴄʜᴀᴅᴏ, ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴇ ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴀʙᴇʀᴛᴏ ɴᴏᴠᴀᴍᴇɴᴛᴇ' : 'ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ, ᴍᴀs ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇᴍᴏᴠᴇʀ ᴏ ᴜsᴜᴀ́ʀɪᴏ'
]
}
const atual = dados[nivel] || dados.easy
return `- ${atual[0]} \`${atual[1]}\`

> *『 @${numero} 』— ${atual[2]}. 🙇‍♂️*`
}

exports.detectorUso = prefix => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> *『 ${prefix}detector 5511999999999 』— ᴄᴏɴᴇᴄᴛᴀ ᴏ sᴇɢᴜɴᴅᴏ ɴᴜ́ᴍᴇʀᴏ ᴘᴏʀ ᴄᴏ́ᴅɪɢᴏ.*
> *『 ${prefix}detector status 』— ᴍᴏsᴛʀᴀ ᴏ ᴇsᴛᴀᴅᴏ ᴅᴀ sᴇssᴀ̃ᴏ ᴅᴇᴛᴇᴄᴛᴏʀᴀ.*
> *『 ${prefix}detector sair 』— ᴅᴇsᴄᴏɴᴇᴄᴛᴀ ᴇ ᴀᴘᴀɢᴀ ᴀ sᴇssᴀ̃ᴏ ᴅᴏ ᴅᴇᴛᴇᴄᴛᴏʀ.*

> *『 ᴀᴠɪsᴏ 』— ᴏ ɴᴜ́ᴍᴇʀᴏ ᴅᴇᴛᴇᴄᴛᴏʀ ᴅᴇᴠᴇ ғɪᴄᴀʀ ɴᴏ ɢʀᴜᴘᴏ ᴄᴏᴍᴏ ᴍᴇᴍʙʀᴏ ɴᴏʀᴍᴀʟ, sᴇᴍ ᴀᴅᴍ. 🙇‍♂️*`
}

exports.detectorNumero = prefix => {
return `- ❌ \`𝙽𝚄́𝙼𝙴𝚁𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> *『 ${prefix}detector 5511999999999 』— ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴄᴏᴍ ᴅᴅɪ + ᴅᴅᴅ + ɴᴜ́ᴍᴇʀᴏ. 🙇‍♂️*`
}

exports.detectorCodigo = (numero, codigo) => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> *『 ${numero} 』— ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴅᴇᴛᴇᴄᴛᴏʀ.*
> *『 ${codigo} 』— ᴄᴏ́ᴅɪɢᴏ ᴅᴇ ᴘᴀʀᴇᴀᴍᴇɴᴛᴏ.*

> *『 ᴄᴏᴍᴏ ᴄᴏɴᴇᴄᴛᴀʀ 』— ᴡʜᴀᴛsᴀᴘᴘ > ᴀᴘᴀʀᴇʟʜᴏs ᴄᴏɴᴇᴄᴛᴀᴅᴏs > ᴄᴏɴᴇᴄᴛᴀʀ ᴄᴏᴍ ɴᴜ́ᴍᴇʀᴏ ᴅᴇ ᴛᴇʟᴇғᴏɴᴇ.*
> *『 ɪᴍᴘᴏʀᴛᴀɴᴛᴇ 』— ᴅᴇᴘᴏɪs ᴄᴏʟᴏǫᴜᴇ ᴇssᴇ ɴᴜ́ᴍᴇʀᴏ ɴᴏ ɢʀᴜᴘᴏ ᴄᴏᴍᴏ ᴍᴇᴍʙʀᴏ ɴᴏʀᴍᴀʟ, sᴇᴍ ᴀᴅᴍ. 🙇‍♂️*`
}

exports.detectorStatus = dados => {
const ligado = dados?.conectado ? 'ᴄᴏɴᴇᴄᴛᴀᴅᴏ ✅' : dados?.registrado ? 'ʀᴇɢɪsᴛʀᴀᴅᴏ, ᴍᴀs ᴏғғʟɪɴᴇ ⚠️' : 'ɴᴀ̃ᴏ ᴄᴏɴᴇᴄᴛᴀᴅᴏ ❌'
const numero = dados?.numero || 'ɴᴀ̃ᴏ ɪᴅᴇɴᴛɪғɪᴄᴀᴅᴏ'
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> *『 sᴛᴀᴛᴜs 』— ${ligado}*
> *『 ɴᴜ́ᴍᴇʀᴏ 』— ${numero}*
> *『 ғᴜɴᴄ̧ᴀ̃ᴏ 』— ᴄᴀᴘᴛᴜʀᴀ ᴍᴇɴsᴀɢᴇɴs ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ ᴄᴏᴍᴏ ᴍᴇᴍʙʀᴏ ᴇ ᴇɴᴛʀᴇɢᴀ ᴀ ᴄʜᴀᴠᴇ ᴘᴀʀᴀ ᴀ ᴛᴏᴋɪᴛᴏ ᴀᴅᴍ.*`
}

exports.detectorConectado = (numero, conectado) => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> *『 ${numero || 'ᴅᴇᴛᴇᴄᴛᴏʀ'} 』— ${conectado ? 'ᴀ sᴇssᴀ̃ᴏ ᴊᴀ ᴇsᴛᴀ́ ᴄᴏɴᴇᴄᴛᴀᴅᴀ ✅' : 'ᴀ sᴇssᴀ̃ᴏ ᴊᴀ ᴇsᴛᴀ́ ʀᴇɢɪsᴛʀᴀᴅᴀ ᴇ ᴇsᴛᴀ́ ʀᴇᴄᴏɴᴇᴄᴛᴀɴᴅᴏ. ⚠️'}*`
}

exports.detectorSaiu = () => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> *『 sᴇssᴀ̃ᴏ 』— ᴏ ᴅᴇᴛᴇᴄᴛᴏʀ ғᴏɪ ᴅᴇsᴄᴏɴᴇᴄᴛᴀᴅᴏ ᴇ ᴀ sᴇssᴀ̃ᴏ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. ✅*`
}

exports.detectorErro = () => {
return `- ❌ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> *『 ᴇʀʀᴏ 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴᴇᴄᴛᴀʀ ᴏ ᴅᴇᴛᴇᴄᴛᴏʀ ᴀɢᴏʀᴀ. ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
}

exports.antiPayTextoEditado = () => {
return 'ᴀᴀᴀ ᴇᴜ ᴛᴇɴᴛᴇɪ ᴍᴀɴᴅᴀʀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ ᴍᴀs ᴇᴜ ᴛᴏᴍᴇɪ ʙᴀɴ'
}

exports.antiPayRemocao = (numero, removido = true) => {
return `- 💳 \`𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> *『 @${numero} 』— ${removido ? 'ᴇɴᴠɪᴏᴜ ᴜᴍᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ, ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ ᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ' : 'ᴇɴᴠɪᴏᴜ ᴜᴍᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ, ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ, ᴍᴀs ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇᴍᴏᴠᴇʀ ᴏ ᴜsᴜᴀ́ʀɪᴏ'}. 🙇‍♂️*`
}

exports.antiBloqueio = (emoji, titulo, numero, descricao) => {
return `- ${emoji} \`${titulo}\`

> *『 @${numero} 』— ${descricao} 🙇‍♂️*`
}

exports.antiRemocao = (emoji, titulo, numero, motivo, removido = true) => {
return `- ${emoji} \`${titulo}\`

> *『 @${numero} 』— ${removido ? `ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴘᴏʀ ${motivo}` : `ᴇɴᴠɪᴏᴜ ᴜᴍ ᴄᴏɴᴛᴇᴜ́ᴅᴏ ᴘʀᴏɪʙɪᴅᴏ, ᴍᴀs ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇᴍᴏᴠᴇʀ`}. 🙇‍♂️*`
}

exports.antiSpamEspera = (numero, segundos) => {
return `- ⏳ \`𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼\`

> *『 @${numero} 』— ᴀɢᴜᴀʀᴅᴇ ${segundos} sᴇɢᴜɴᴅᴏs ᴘᴀʀᴀ ᴜsᴀʀ ᴄᴏᴍᴀɴᴅᴏs ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
}

exports.antiSpamAdvertencia = (numero, advertencias, segundos, faltam) => {
return `- 🚨 \`𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼\`

> *『 @${numero} 』— ʀᴇᴄᴇʙᴇᴜ ${advertencias}/5 ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀ ᴘᴏʀ sᴘᴀᴍ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.*

> *『 ${segundos} 𝚂𝙴𝙶𝚄𝙽𝙳𝙾𝚂 』— ᴛᴇᴍᴘᴏ ᴅᴇ ʙʟᴏǫᴜᴇɪᴏ.*
> *『 ${faltam} 』— ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs ʀᴇsᴛᴀɴᴛᴇs ᴘᴀʀᴀ ᴀ ʀᴇᴍᴏᴄ̧ᴀ̃ᴏ. 🙇‍♂️*`
}

exports.antiSpamRemovido = numero => {
return `- 🚫 \`𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼\`

> *『 @${numero} 』— ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴘᴏʀ ᴀᴛɪɴɢɪʀ 5 ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs ᴅᴇ sᴘᴀᴍ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs. 🙇‍♂️*`
}

exports.x9MensagemApagada = (autor, apagou, tipo, conteudo) => {
return `- 🗑️ \`𝚇𝟿 𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙰𝙿𝙰𝙶𝙰𝙳𝙰\`

> *『 @${autor} 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴇɴᴠɪᴏᴜ ᴀ ${tipo}.*
> *『 @${apagou} 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴀᴘᴀɢᴏᴜ ᴀ ᴍᴇɴsᴀɢᴇᴍ.*
> *『 ${conteudo || 'sᴇᴍ ᴛᴇxᴛᴏ'} 』— ᴄᴏɴᴛᴇᴜ́ᴅᴏ ʀᴇᴄᴜᴘᴇʀᴀᴅᴏ. 🙇‍♂️*`
}

exports.x9Enquete = (numero, enquete, opcoes, alterou = false) => {
return `- 🗳️ \`𝚇𝟿 ${alterou ? '𝚅𝙾𝚃𝙾 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾' : '𝙽𝙾𝚅𝙾 𝚅𝙾𝚃𝙾'}\`

> *『 @${numero} 』— ${alterou ? 'ᴀʟᴛᴇʀᴏᴜ ᴏ ᴠᴏᴛᴏ' : 'ᴠᴏᴛᴏᴜ'} ɴᴀ ᴇɴǫᴜᴇᴛᴇ 『 ${enquete} 』.*
> *『 ${opcoes || 'ɴᴇɴʜᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ'} 』— ᴏᴘᴄ̧ᴀ̃ᴏ sᴇʟᴇᴄɪᴏɴᴀᴅᴀ. 🙇‍♂️*`
}

exports.x9Grupo = (emoji, titulo, autor, descricao, valor = '') => {
return `- ${emoji} \`𝚇𝟿 ${titulo}\`

> *『 @${autor} 』— ${descricao}${valor ? ` 『 ${valor} 』` : ''}. 🙇‍♂️*`
}

exports.x9Participante = (emoji, titulo, autor, alvo, descricao) => {
return `- ${emoji} \`𝚇𝟿 ${titulo}\`

> *『 @${autor} 』— ${descricao} 『 @${alvo} 』. 🙇‍♂️*`
}

exports.reiniciarBot = () => {
return `- 🔄 \`𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾\`

> *『 𝙰𝙶𝚄𝙰𝚁𝙳𝙴 』— ᴏᴋᴀʏ ᴍᴇsᴛʀᴇ, ɪʀᴇɪ ʀᴇɪɴɪᴄɪᴀʀ ᴏ ʙᴏᴛ. 🙇‍♂️*`
}

exports.botaoAprovar = () => {
return `✅﹚𝐀𝐏𝐑𝐎𝐕𝐀𝐑﹙✅`
}

exports.botaoBaixarAudio = () => {
return `🎧﹚𝐁𝐀𝐈𝐗𝐀𝐑 𝐀́𝐔𝐃𝐈𝐎﹙🎧`
}

exports.botaoBaixarVideo = () => {
return `🎥﹚𝐁𝐀𝐈𝐗𝐀𝐑 𝐕𝐈́𝐃𝐄𝐎﹙🎥`
}

exports.playSemBotoes = (prefix, url) => {
return `> *『 ${prefix}play_audio ${url} 』— ᴜsᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴀᴏ ʟᴀᴅᴏ ᴘᴀʀᴀ ʙᴀɪxᴀʀ ᴇᴍ ᴀ́ᴜᴅɪᴏ.*
> *『 ${prefix}play_video ${url} 』— ᴜsᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴀᴏ ʟᴀᴅᴏ ᴘᴀʀᴀ ʙᴀɪxᴀʀ ᴇᴍ ᴠɪ́ᴅᴇᴏ. 🙇‍♂️*`
}

exports.novaSolicitacaoSemBotoes = (numero, grupo, prefix, jid) => {
return `${exports.novaSolicitacao(numero, grupo)}

> *『 ${prefix}aprovarpedido ${jid} 』— ᴀᴘʀᴏᴠᴀ ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ.*
> *『 ${prefix}recusarpedido ${jid} 』— ʀᴇᴄᴜsᴀ ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ. 🙇‍♂️*`
}
// =====================================================
// TEXTOS DO SISTEMA DE JOGOS
// =====================================================
exports.modoJogosDescricao = () => {
return `ᴀᴛɪᴠᴀ ᴏs ᴊᴏɢᴏs ᴇ ᴀs ʀᴇsᴘᴏsᴛᴀs ᴀᴜᴛᴏᴍᴀ́ᴛɪᴄᴀs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.`
}

exports.modoJogosDesligadoDescricao = () => {
return `ᴅᴇsᴀᴛɪᴠᴀ ᴏs ᴊᴏɢᴏs ᴇ ᴀs ᴘᴀʀᴛɪᴅᴀs ᴀᴜᴛᴏᴍᴀ́ᴛɪᴄᴀs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.`
}

exports.modoJogosJaAtivado = () => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏ ᴍᴏᴅᴏ ᴊᴏɢᴏs ᴊᴀ́ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.modoJogosJaDesativado = () => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏ ᴍᴏᴅᴏ ᴊᴏɢᴏs ᴊᴀ́ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.modoJogosDesativado = prefix => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 ${prefix}modojogos 1 』— ᴏ ᴍᴏᴅᴏ ᴊᴏɢᴏs ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ, ᴜᴍ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴇᴠᴇ ᴜsᴀʀ ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴀᴏ ʟᴀᴅᴏ ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ. 🙇‍♂️*`
}

exports.botoesUso = (prefix, command) => {
return `- 🧊 \`𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝚁 𝙱𝙾𝚃𝙾̃𝙴𝚂\`

> *『 ${prefix}${command} 1 』— ᴀᴛɪᴠᴀ ᴏs ʙᴏᴛᴏ̃ᴇs ɴᴀs ᴍᴇɴsᴀɢᴇɴs ᴅᴏ ʙᴏᴛ.*
> *『 ${prefix}${command} 0 』— ᴅᴇsᴀᴛɪᴠᴀ ᴏs ʙᴏᴛᴏ̃ᴇs ᴇ ᴍᴀɴᴛᴇ́ᴍ ᴀs ʀᴇsᴘᴏsᴛᴀs ɴᴏʀᴍᴀɪs. 🙇‍♂️*`
}

exports.botoesAtivados = () => {
return `- ✅ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> *『 𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏs ʙᴏᴛᴏ̃ᴇs ғᴏʀᴀᴍ ᴀᴛɪᴠᴀᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ ᴇ ᴠᴏʟᴛᴀʀᴀ̃ᴏ ᴀ ᴀᴘᴀʀᴇᴄᴇʀ ɴᴀs ᴍᴇɴsᴀɢᴇɴs. 🙇‍♂️*`
}

exports.botoesDesativados = () => {
return `- ❌ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏs ʙᴏᴛᴏ̃ᴇs ғᴏʀᴀᴍ ᴅᴇsᴀᴛɪᴠᴀᴅᴏs, ᴍᴀs ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴄᴏɴᴛɪɴᴜᴀᴍ ғᴜɴᴄɪᴏɴᴀɴᴅᴏ ɴᴏʀᴍᴀʟᴍᴇɴᴛᴇ. 🙇‍♂️*`
}

exports.botoesJaAtivados = () => {
return `- ⚠️ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙹𝙰́ 𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> *『 𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏs ʙᴏᴛᴏ̃ᴇs ᴊᴀ́ ᴇsᴛᴀ̃ᴏ ᴀᴛɪᴠᴀᴅᴏs ɴᴏ ʙᴏᴛ. 🙇‍♂️*`
}

exports.botoesJaDesativados = () => {
return `- ⚠️ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙹𝙰́ 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏs ʙᴏᴛᴏ̃ᴇs ᴊᴀ́ ᴇsᴛᴀ̃ᴏ ᴅᴇsᴀᴛɪᴠᴀᴅᴏs ɴᴏ ʙᴏᴛ. 🙇‍♂️*`
}

exports.botaoMenu = () => {
return `🧊﹚𝐌𝐄𝐍𝐔﹙🧊`
}

exports.botaoMenuAdm = () => {
return `🧊﹚𝐌𝐄𝐍𝐔 𝐀𝐃𝐌﹙🧊`
}

exports.botaoMenuDono = () => {
return `🧊﹚𝐌𝐄𝐍𝐔 𝐃𝐎𝐍𝐎﹙🧊`
}

exports.botaoMenuDownload = () => {
return `🧊﹚𝐌𝐄𝐍𝐔 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃﹙🧊`
}

exports.botaoMenuJogos = () => {
return `🎮﹚𝐌𝐄𝐍𝐔 𝐉𝐎𝐆𝐎𝐒﹙🎮`
}

exports.botaoMenuBrincadeiras = () => {
return `🎭﹚𝐁𝐑𝐈𝐍𝐂𝐀𝐃𝐄𝐈𝐑𝐀𝐒﹙🎭`
}

exports.botaoCancelar = () => {
return `❌﹚𝐂𝐀𝐍𝐂𝐄𝐋𝐀𝐑﹙❌`
}

exports.botaoAceitar = () => {
return `✅﹚𝐀𝐂𝐄𝐈𝐓𝐀𝐑﹙✅`
}

exports.botaoRecusar = () => {
return `❌﹚𝐑𝐄𝐂𝐔𝐒𝐀𝐑﹙❌`
}

exports.botaoQuiz = (numero, opcao) => {
return `${numero}️⃣﹚${String(opcao || '').slice(0, 20)}`
}

exports.ping = ({ NomeDoBot, pushname, speedConverted, latency, sistema, ramUsada, ramTotal, baileysV, cpu, nodejs, totalGrupos, totalCmd, tempoOnline }) => {
return `-  \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙾 𝙱𝙾𝚃\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname || 'Usuário'}
『 🏃‍♂️ \`𝚅𝙴𝙻𝙾𝙲𝙸𝙳𝙰𝙳𝙴\` 』— ${speedConverted} s
『 🦾 \`𝙻𝙰𝚃𝙴̂𝙽𝙲𝙸𝙰\` 』— ${latency} ms
『 🖥️ \`𝚂𝙸𝚂𝚃𝙴𝙼𝙰\` 』— ${sistema}
『 🧠 \`𝙼𝙴𝙼𝙾́𝚁𝙸𝙰 𝚁𝙰𝙼\` 』— ${ramUsada} GB / ${ramTotal} GB
『 ⚙️ \`𝙱𝙰𝙸𝙻𝙴𝚈𝚂\` 』— ${baileysV}
『 💻 \`𝙲𝙿𝚄\` 』— ${cpu}%
『 📡 \`𝙽𝙾𝙳𝙴.𝙹𝚂\` 』— ${nodejs}
『 👥 \`𝙶𝚁𝚄𝙿𝙾𝚂 𝙰𝚃𝙸𝚅𝙾𝚂\` 』— ${totalGrupos}
『 📊 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂\` 』— ${totalCmd}
『 ⏰ \`𝚃𝙴𝙼𝙿𝙾 𝙾𝙽𝙻𝙸𝙽𝙴\` 』— ${tempoOnline}`
}

exports.jogoTemaPadrao = () => {
return `ɢᴇʀᴀʟ`
}

exports.jogoDicaPadrao = () => {
return `sᴇᴍ ᴅɪᴄᴀ`
}

exports.jogoMarquePessoa = (prefix, comando) => {
return `- 👤 \`𝙼𝙰𝚁𝚀𝚄𝙴 𝙾 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

> *『 ${prefix}${comando} @𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 』— ᴍᴀʀǫᴜᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴏᴜ ʀᴇsᴘᴏɴᴅᴀ ᴀ̀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴀ ᴘᴇssᴏᴀ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴅᴇsᴀғɪᴀʀ. 🙇‍♂️*`
}

exports.jogoNaoPodeDesafiar = () => {
return `- ❌ \`𝙳𝙴𝚂𝙰𝙵𝙸𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> *『 𝚅𝙾𝙲𝙴̂ 𝙼𝙴𝚂𝙼𝙾 』— ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sᴇ ᴅᴇsᴀғɪᴀʀ. 🙇‍♂️*`
}

exports.jogoDesafioRecusado = alvo => {
return `- 😕 \`𝙳𝙴𝚂𝙰𝙵𝙸𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾\`

> *『 ${alvo} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ʀᴇᴄᴜsᴏᴜ ᴏ ᴄᴏɴᴠɪᴛᴇ ᴘᴀʀᴀ ᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️*`
}

exports.adivinheSemPartida = () => {
return `- ❌ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> *『 𝚂𝙴𝙼 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.adivinheCancelado = () => {
return `- ✅ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> *『 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰 』— ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.adivinheEmAndamento = () => {
return `- ⚠️ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> *『 𝙴𝙼 𝙰𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾 』— ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.adivinheArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> *『 palavras_adivinhe.json 』— ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴀʟᴀᴠʀᴀ ᴠᴀ́ʟɪᴅᴀ ᴄᴏᴍ 5 ʟᴇᴛʀᴀs. 🙇‍♂️*`
}

exports.adivinheErro = () => {
return `- ❌ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ. 🙇‍♂️*`
}

exports.jogoAdivinhe = (game, jogador, mencionar) => {
let texto = `- 🧩 \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> *『 𝚃𝙴𝙼𝙰 』— ${game.tema}*
> *『 𝙳𝙸𝙲𝙰 』— ${game.dica}*
> *『 𝚃𝙴𝙽𝚃𝙰𝚃𝙸𝚅𝙰𝚂 』— ${(game.tentativas || []).length}/6*`
if (game.finalizado && game.venceu)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ*
> *『 𝚅𝙴𝙽𝙲𝙴𝙳𝙾𝚁 』— ${mencionar(jogador)}*
> *『 𝙿𝙰𝙻𝙰𝚅𝚁𝙰 』— ${game.palavra.toUpperCase()}*`
else if (game.finalizado)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴠᴏᴄᴇ̂ ᴘᴇʀᴅᴇᴜ*
> *『 𝙿𝙰𝙻𝙰𝚅𝚁𝙰 𝙲𝙾𝚁𝚁𝙴𝚃𝙰 』— ${game.palavra.toUpperCase()}*`
else
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴊᴏɢᴏ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ*`
return texto
}

exports.quizSemPartida = () => {
return `- ❌ \`𝚀𝚄𝙸𝚉\`

> *『 𝚂𝙴𝙼 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ǫᴜɪᴢ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.quizCancelado = () => {
return `- ✅ \`𝚀𝚄𝙸𝚉\`

> *『 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾 』— ᴏ ǫᴜɪᴢ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.quizEmAndamento = () => {
return `- ⚠️ \`𝚀𝚄𝙸𝚉\`

> *『 𝙴𝙼 𝙰𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾 』— ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍ ǫᴜɪᴢ ᴀᴛɪᴠᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.quizArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> *『 perguntas_quiz.json 』— ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴇʀɢᴜɴᴛᴀ ᴠᴀ́ʟɪᴅᴀ. 🙇‍♂️*`
}

exports.quizErro = () => {
return `- ❌ \`𝚀𝚄𝙸𝚉\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴏ ǫᴜɪᴢ. 🙇‍♂️*`
}

exports.jogoQuiz = (game, estado, respondedor, mencionar) => {
let texto = `- 🧠 \`𝚀𝚄𝙸𝚉\`

> *『 𝙲𝙰𝚃𝙴𝙶𝙾𝚁𝙸𝙰 』— ${game.categoria}*`
if (estado === 'jogando')
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ*
> *『 𝚁𝙴𝚂𝙿𝙾𝚂𝚃𝙰 』— 1, 2, 3 ᴏᴜ 4*`
if (estado === 'acertou')
texto += `
> *『 𝚁𝙴𝚂𝙿𝙾𝙽𝙳𝙴𝚄 』— ${mencionar(respondedor)}*
> *『 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾 』— ʀᴇsᴘᴏsᴛᴀ ᴄᴏʀʀᴇᴛᴀ*`
if (estado === 'errou')
texto += `
> *『 𝚁𝙴𝚂𝙿𝙾𝙽𝙳𝙴𝚄 』— ${mencionar(respondedor)}*
> *『 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾 』— ʀᴇsᴘᴏsᴛᴀ ᴇʀʀᴀᴅᴀ*
> *『 𝙲𝙾𝚁𝚁𝙴𝚃𝙰 』— ${game.correta} — ${game.opcoes[game.correta - 1]}*`
return texto
}

exports.jogoQuizFinalizado = () => {
return `- 🧠 \`𝚀𝚄𝙸𝚉\`

> *『 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙾 』— ᴛᴏᴅᴀs ᴀs ᴘᴇʀɢᴜɴᴛᴀs ᴅᴏ ǫᴜɪᴢ ᴊᴀ́ ғᴏʀᴀᴍ ᴜsᴀᴅᴀs. 🙇‍♂️*`
}

exports.forcaSemPartida = () => {
return `- ❌ \`𝙵𝙾𝚁𝙲𝙰\`

> *『 𝚂𝙴𝙼 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.forcaCancelada = () => {
return `- ✅ \`𝙵𝙾𝚁𝙲𝙰\`

> *『 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰 』— ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.forcaEmAndamento = () => {
return `- ⚠️ \`𝙵𝙾𝚁𝙲𝙰\`

> *『 𝙴𝙼 𝙰𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾 』— ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.forcaArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> *『 palavras.json 』— ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴀʟᴀᴠʀᴀ ᴠᴀ́ʟɪᴅᴀ. 🙇‍♂️*`
}

exports.forcaErro = () => {
return `- ❌ \`𝙵𝙾𝚁𝙲𝙰\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ. 🙇‍♂️*`
}

exports.jogoForca = (game, palavraFormatada) => {
let texto = `- 🔤 \`𝙵𝙾𝚁𝙲𝙰\`

> *『 𝙿𝙰𝙻𝙰𝚅𝚁𝙰 』— ${palavraFormatada}*
> *『 𝚃𝙴𝙼𝙰 』— ${game.tema}*
> *『 𝙳𝙸𝙲𝙰 』— ${game.dica}*
> *『 𝙴𝚁𝚁𝙾𝚂 』— ${game.erros}/6*
> *『 𝙴𝚁𝚁𝙰𝙳𝙰𝚂 』— ${game.letrasErradas.length ? game.letrasErradas.join(', ').toUpperCase() : 'ɴᴇɴʜᴜᴍᴀ'}*`
if (game.finalizado && game.venceu)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ*`
else if (game.finalizado)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴠᴏᴄᴇ̂ ᴘᴇʀᴅᴇᴜ*
> *『 𝙿𝙰𝙻𝙰𝚅𝚁𝙰 𝙲𝙾𝚁𝚁𝙴𝚃𝙰 』— ${game.palavra.toUpperCase()}*`
else
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴊᴏɢᴏ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ*`
return texto
}

exports.jogoLetraUsada = () => {
return `- 🔤 \`𝙵𝙾𝚁𝙲𝙰\`

> *『 𝙻𝙴𝚃𝚁𝙰 𝚄𝚂𝙰𝙳𝙰 』— ᴇssᴀ ʟᴇᴛʀᴀ ᴊᴀ́ ғᴏɪ ᴜsᴀᴅᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️*`
}

exports.cacaSemPartida = () => {
return `- ❌ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> *『 𝚂𝙴𝙼 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.cacaCancelada = () => {
return `- ✅ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> *『 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰 』— ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.cacaEmAndamento = () => {
return `- ⚠️ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> *『 𝙴𝙼 𝙰𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾 』— ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.cacaArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> *『 palavras_caca.json 』— ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴀʟᴀᴠʀᴀ ᴠᴀ́ʟɪᴅᴀ. 🙇‍♂️*`
}

exports.cacaErro = () => {
return `- ❌ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs. 🙇‍♂️*`
}

exports.jogoCacaPalavras = (game, jogador, mencionar) => {
let texto = `- 🔎 \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> *『 𝚃𝙴𝙼𝙰 』— ${game.tema}*
> *『 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰𝚂 』— ${game.encontradas.length}/${game.palavras.length}*`
if (game.finalizado)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ*
> *『 𝚅𝙴𝙽𝙲𝙴𝙳𝙾𝚁 』— ${mencionar(jogador)}*`
else
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴊᴏɢᴏ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ*
> *『 𝙴𝙽𝚅𝙸𝙴 』— ᴀ ᴘᴀʟᴀᴠʀᴀ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ*`
return texto
}

exports.jogoPalavraEncontrada = () => {
return `- 🔎 \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> *『 𝙹𝙰́ 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰 』— ᴇssᴀ ᴘᴀʟᴀᴠʀᴀ ᴊᴀ́ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️*`
}

exports.minesSemPartida = () => {
return `- ❌ \`𝙼𝙸𝙽𝙴𝚂\`

> *『 𝚂𝙴𝙼 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴍɪɴᴇs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.minesCancelado = () => {
return `- ✅ \`𝙼𝙸𝙽𝙴𝚂\`

> *『 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾 』— ᴏ ᴍɪɴᴇs ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.minesEmAndamento = () => {
return `- ⚠️ \`𝙼𝙸𝙽𝙴𝚂\`

> *『 𝙴𝙼 𝙰𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾 』— ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴍɪɴᴇs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.minesErro = () => {
return `- ❌ \`𝙼𝙸𝙽𝙴𝚂\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴍɪɴᴇs. 🙇‍♂️*`
}

exports.jogoMines = (game, jogador, mencionar) => {
const totalSeguras = 25 - game.bombas.length
const abertasSeguras = game.abertas.filter(numero => !game.bombas.includes(numero)).length
let texto = `- 💣 \`𝙼𝙸𝙽𝙴𝚂\`

> *『 𝙱𝙾𝙼𝙱𝙰𝚂 』— ${game.bombas.length}*
> *『 𝙰𝙱𝙴𝚁𝚃𝙰𝚂 』— ${abertasSeguras}/${totalSeguras}*`
if (game.finalizado && game.ganhou)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ*
> *『 𝚅𝙴𝙽𝙲𝙴𝙳𝙾𝚁 』— ${mencionar(jogador)}*`
else if (game.finalizado)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴠᴏᴄᴇ̂ ᴘᴇʀᴅᴇᴜ*
> *『 𝙹𝙾𝙶𝙰𝙳𝙾𝚁 』— ${mencionar(jogador)}*`
else
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘᴀʀᴛɪᴅᴀ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ*
> *『 𝙴𝙽𝚅𝙸𝙴 』— ᴜᴍ ɴᴜ́ᴍᴇʀᴏ ᴅᴇ 1 ᴀ 25*`
return texto
}

exports.jogoCasaAberta = () => {
return `- 💣 \`𝙼𝙸𝙽𝙴𝚂\`

> *『 𝙲𝙰𝚂𝙰 𝙰𝙱𝙴𝚁𝚃𝙰 』— ᴇssᴀ ᴄᴀsᴀ ᴊᴀ́ ғᴏɪ ᴀʙᴇʀᴛᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️*`
}

exports.velhaSemPartida = () => {
return `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> *『 𝚂𝙴𝙼 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.velhaCancelada = () => {
return `- ✅ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> *『 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰 』— ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.velhaEmAndamento = () => {
return `- ⚠️ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> *『 𝙴𝙼 𝙰𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾 』— ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.velhaErro = () => {
return `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ. 🙇‍♂️*`
}

exports.jogoConviteVelha = (alvo, autor, prefix) => {
return `- 🎮 \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> *『 ${alvo} 』— ᴠᴏᴄᴇ̂ ʀᴇᴄᴇʙᴇᴜ ᴜᴍ ᴄᴏɴᴠɪᴛᴇ ᴅᴇ ${autor} ᴘᴀʀᴀ ᴊᴏɢᴀʀ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ.*
> *『 𝚂 / 𝙽 』— ᴜsᴇ ᴏs ʙᴏᴛᴏ̃ᴇs ᴏᴜ ᴅɪɢɪᴛᴇ s ᴘᴀʀᴀ ᴀᴄᴇɪᴛᴀʀ ᴇ n ᴘᴀʀᴀ ʀᴇᴄᴜsᴀʀ.*
> *『 ${prefix}resetvelha 』— ${autor} ᴘᴏᴅᴇ ᴄᴀɴᴄᴇʟᴀʀ ᴏ ᴅᴇsᴀғɪᴏ. 🙇‍♂️*`
}

exports.jogoVelha = (game, extra, mencionar) => {
const turno = game.turno === 'X' ? game.X : game.O
let texto = `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> *『 𝙹𝙾𝙶𝙰𝙳𝙾𝚁 𝚇 』— ${mencionar(game.X)}*
> *『 𝙹𝙾𝙶𝙰𝙳𝙾𝚁 𝙾 』— ${mencionar(game.O)}*`
if (extra)
texto += `
${extra}`
else
texto += `
> *『 𝚅𝙴𝚉 𝙳𝙴 』— ${mencionar(turno)}*
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘᴀʀᴛɪᴅᴀ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ*`
return texto
}

exports.jogoVelhaIniciada = () => {
return `> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘᴀʀᴛɪᴅᴀ ɪɴɪᴄɪᴀᴅᴀ*`
}

exports.jogoCasaEscolhida = () => {
return `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> *『 𝙲𝙰𝚂𝙰 𝙾𝙲𝚄𝙿𝙰𝙳𝙰 』— ᴇssᴀ ᴄᴀsᴀ ᴊᴀ́ ғᴏɪ ᴇsᴄᴏʟʜɪᴅᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️*`
}

exports.jogoVelhaEmpate = () => {
return `> *『 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾 』— ᴇᴍᴘᴀᴛᴇ*
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘᴀʀᴛɪᴅᴀ ғɪɴᴀʟɪᴢᴀᴅᴀ*`
}

exports.jogoVelhaVencedor = jogador => {
return `> *『 𝚅𝙴𝙽𝙲𝙴𝙳𝙾𝚁 』— ${jogador}*
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘᴀʀᴛɪᴅᴀ ғɪɴᴀʟɪᴢᴀᴅᴀ*`
}

exports.damaSemPartida = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> *『 𝚂𝙴𝙼 𝙿𝙰𝚁𝚃𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.damaCancelada = () => {
return `- ✅ \`𝙳𝙰𝙼𝙰\`

> *『 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰 』— ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️*`
}

exports.damaEmAndamento = () => {
return `- ⚠️ \`𝙳𝙰𝙼𝙰\`

> *『 𝙴𝙼 𝙰𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾 』— ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.damaErro = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ. 🙇‍♂️*`
}

exports.jogoConviteDama = (alvo, autor, prefix) => {
return `- 🎮 \`𝙳𝙰𝙼𝙰\`

> *『 ${alvo} 』— ᴠᴏᴄᴇ̂ ʀᴇᴄᴇʙᴇᴜ ᴜᴍ ᴄᴏɴᴠɪᴛᴇ ᴅᴇ ${autor} ᴘᴀʀᴀ ᴊᴏɢᴀʀ ᴅᴀᴍᴀ.*
> *『 𝚂 / 𝙽 』— ᴜsᴇ ᴏs ʙᴏᴛᴏ̃ᴇs ᴏᴜ ᴅɪɢɪᴛᴇ s ᴘᴀʀᴀ ᴀᴄᴇɪᴛᴀʀ ᴇ n ᴘᴀʀᴀ ʀᴇᴄᴜsᴀʀ.*
> *『 ${prefix}resetdama 』— ${autor} ᴘᴏᴅᴇ ᴄᴀɴᴄᴇʟᴀʀ ᴏ ᴅᴇsᴀғɪᴏ. 🙇‍♂️*`
}

exports.jogoDama = (game, extra, mencionar) => {
const turno = game.turno === 'W' ? game.W : game.B
let texto = `- ⚫ \`𝙳𝙰𝙼𝙰\`

> *『 𝙱𝚁𝙰𝙽𝙲𝙾 』— ${mencionar(game.W)}*
> *『 𝙿𝚁𝙴𝚃𝙾 』— ${mencionar(game.B)}*
> *『 𝚅𝙴𝚉 𝙳𝙴 』— ${mencionar(turno)}*`
if (extra)
texto += `
> *『 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾 』— ${extra}*`
if (game.finalizado)
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘᴀʀᴛɪᴅᴀ ғɪɴᴀʟɪᴢᴀᴅᴀ*`
else
texto += `
> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘᴀʀᴛɪᴅᴀ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ*
> *『 𝙹𝙾𝙶𝚄𝙴 𝙲𝙾𝙼 』— B6-A5*`
return texto
}

exports.jogoDamaIniciada = () => {
return `ᴘᴀʀᴛɪᴅᴀ ɪɴɪᴄɪᴀᴅᴀ`
}

exports.jogoDamaVencedor = jogador => {
return `ᴠᴇɴᴄᴇᴅᴏʀ: ${jogador}`
}

exports.jogoDamaMovimento = movimento => {
return `ᴜ́ʟᴛɪᴍᴏ ᴍᴏᴠɪᴍᴇɴᴛᴏ: ${movimento}`
}

exports.jogoPecaNaoSua = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> *『 𝙿𝙴𝙲̧𝙰 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰 』— ᴇssᴀ ᴘᴇᴄ̧ᴀ ɴᴀ̃ᴏ ᴘᴇʀᴛᴇɴᴄᴇ ᴀ ᴠᴏᴄᴇ̂. 🙇‍♂️*`
}

exports.jogoCasaOcupada = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> *『 𝙳𝙴𝚂𝚃𝙸𝙽𝙾 𝙾𝙲𝚄𝙿𝙰𝙳𝙾 』— ᴀ ᴄᴀsᴀ ᴅᴇ ᴅᴇsᴛɪɴᴏ ᴇsᴛᴀ́ ᴏᴄᴜᴘᴀᴅᴀ. 🙇‍♂️*`
}

exports.jogoMovimentoInvalido = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> *『 𝙼𝙾𝚅𝙸𝙼𝙴𝙽𝚃𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾 』— ᴜsᴇ ᴜᴍ ᴍᴏᴠɪᴍᴇɴᴛᴏ ᴅɪᴀɢᴏɴᴀʟ ᴠᴀ́ʟɪᴅᴏ, ᴄᴏᴍᴏ B6-A5. 🙇‍♂️*`
}

exports.jogoSemInimigo = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> *『 𝙲𝙰𝙿𝚃𝚄𝚁𝙰 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰 』— ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴇᴄ̧ᴀ ɪɴɪᴍɪɢᴀ ᴘᴀʀᴀ ᴄᴀᴘᴛᴜʀᴀʀ. 🙇‍♂️*`
}

exports.onlyGroupFun = prefix => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏ ᴍᴏᴅᴏ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.*

> *『 ${prefix}modobn 1 』— ᴜᴍ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴘʀᴇᴄɪsᴀ ᴀᴛɪᴠᴀʀ ᴏ ᴍᴏᴅᴏ. 🙇‍♂️*`
}

exports.modoBnUso = (prefix, command) => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> *『 ${prefix + command} 1 』— ᴀᴛɪᴠᴀʀ ᴀs ʙʀɪɴᴄᴀᴅᴇɪʀᴀs.*

> *『 ${prefix + command} 0 』— ᴅᴇsᴀᴛɪᴠᴀʀ ᴀs ʙʀɪɴᴄᴀᴅᴇɪʀᴀs. 🙇‍♂️*`
}

exports.modoBnAtivado = () => {
return `- ✅ \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> *『 𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴇ ʀᴀɴᴋs ғᴏʀᴀᴍ ʟɪʙᴇʀᴀᴅᴏs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.modoBnDesativado = () => {
return `- ❌ \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 』— ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴇ ʀᴀɴᴋs ғᴏʀᴀᴍ ʙʟᴏǫᴜᴇᴀᴅᴏs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.modoBnJaAtivado = () => {
return `- ⚠️ \`𝙼𝙾𝙳𝙾 𝙹𝙰́ 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝙰𝚅𝙸𝚂𝙾 』— ᴏ ᴍᴏᴅᴏ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴊᴀ́ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.modoBnJaDesativado = () => {
return `- ⚠️ \`𝙼𝙾𝙳𝙾 𝙹𝙰́ 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝙰𝚅𝙸𝚂𝙾 』— ᴏ ᴍᴏᴅᴏ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴊᴀ́ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️*`
}

exports.statusFuncoes = (NomeDoBot, groupName, funcoes, isWelkom, isModobn, isWelkom2 = false, isWelkom3 = false) => {
const status = valor => valor === true ? '𝙰𝚃𝙸𝚅𝙰𝙳𝙾 ✅' : '𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾 ❌'
const nivelAntilink = {
easy: 'Fácil',
medium: 'Médio',
hard: 'Rígido'
}[funcoes?.antilink?.nivel] || 'Sem nível'
const antilinkAtivo = funcoes?.antilink?.ativo === true
const estados = [
funcoes?.aprovacao,
funcoes?.autoaprovacao,
antilinkAtivo,
funcoes?.x9,
funcoes?.antipay,
funcoes?.antibot,
funcoes?.antivideo,
funcoes?.antifoto,
funcoes?.antivisu,
funcoes?.antisticker,
funcoes?.anticontato,
funcoes?.antilocalizacao,
funcoes?.antidocumento,
funcoes?.antiaudio,
funcoes?.antispam,
funcoes?.antistatus,
funcoes?.antimarcacao,
funcoes?.antifake,
funcoes?.antiddd?.ativo,
funcoes?.antirroubo,
funcoes?.soadm,
funcoes?.modojogos,
isModobn,
isWelkom,
isWelkom2,
isWelkom3
]
const totalAtivas = estados.filter(valor => valor === true).length
return `- ⚙️ \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙰𝚂 𝙵𝚄𝙽𝙲̧𝙾̃𝙴𝚂\`

『 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${groupName || 'Grupo'}
『 \`𝙵𝚄𝙽𝙲̧𝙾̃𝙴𝚂 𝙰𝚃𝙸𝚅𝙰𝚂\` 』— ${totalAtivas}/${estados.length}

- 📥 \`𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾\`

『 \`𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾\` 』— ${status(funcoes?.aprovacao)}
『 \`𝙰𝚄𝚃𝙾𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾\` 』— ${status(funcoes?.autoaprovacao)}

- 🛡️ \`𝙿𝚁𝙾𝚃𝙴𝙲̧𝙰̃𝙾\`

『 \`𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺\` 』— ${antilinkAtivo ? `Ativado ✅ • ${nivelAntilink}` : 'Desativado ❌'}
『 \`𝚇𝟿\` 』— ${status(funcoes?.x9)}
『 \`𝙰𝙽𝚃𝙸𝙿𝙰𝚈\` 』— ${status(funcoes?.antipay)}
『 \`𝙰𝙽𝚃𝙸𝙱𝙾𝚃\` 』— ${status(funcoes?.antibot)}
『 \`𝙰𝙽𝚃𝙸𝚂𝙿𝙰𝙼\` 』— ${status(funcoes?.antispam)}
『 \`𝙰𝙽𝚃𝙸𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${status(funcoes?.antistatus)}
『 \`𝙰𝙽𝚃𝙸𝙼𝙰𝚁𝙲𝙰𝙲̧𝙰̃𝙾\` 』— ${status(funcoes?.antimarcacao)}
『 \`𝙰𝙽𝚃𝙸-𝙵𝙰𝙺𝙴\` 』— ${status(funcoes?.antifake)}
『 \`𝙰𝙽𝚃𝙸-𝙳𝙳𝙳\` 』— ${status(funcoes?.antiddd?.ativo)}
『 \`𝙰𝙽𝚃𝙸𝚁𝚁𝙾𝚄𝙱𝙾\` 』— ${status(funcoes?.antirroubo)}

- 📁 \`𝙼𝙸́𝙳𝙸𝙰𝚂\`

『 \`𝙰𝙽𝚃𝙸𝚅𝙸́𝙳𝙴𝙾\` 』— ${status(funcoes?.antivideo)}
『 \`𝙰𝙽𝚃𝙸𝙵𝙾𝚃𝙾\` 』— ${status(funcoes?.antifoto)}
『 \`𝙰𝙽𝚃𝙸𝚅𝙸𝚂𝚄\` 』— ${status(funcoes?.antivisu)}
『 \`𝙰𝙽𝚃𝙸𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰\` 』— ${status(funcoes?.antisticker)}
『 \`𝙰𝙽𝚃𝙸𝙲𝙾𝙽𝚃𝙰𝚃𝙾\` 』— ${status(funcoes?.anticontato)}
『 \`𝙰𝙽𝚃𝙸𝙻𝙾𝙲𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\` 』— ${status(funcoes?.antilocalizacao)}
『 \`𝙰𝙽𝚃𝙸𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃𝙾\` 』— ${status(funcoes?.antidocumento)}
『 \`𝙰𝙽𝚃𝙸𝙰́𝚄𝙳𝙸𝙾\` 』— ${status(funcoes?.antiaudio)}

- 🎮 \`𝙾𝚄𝚃𝚁𝙰𝚂 𝙵𝚄𝙽𝙲̧𝙾̃𝙴𝚂\`

『 \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 1\` 』— ${status(isWelkom)}
『 \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 2\` 』— ${status(isWelkom2)}
『 \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 3\` 』— ${status(isWelkom3)}
『 \`𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂\` 』— ${status(funcoes?.modojogos)}
『 \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\` 』— ${status(isModobn)}`
}

exports.perfilUsuario = ({ nick, numero, bio, cargo, vip, chat, grupo, nivelGado, celular, nivelPuta, gostosura, programa }) => {
return `- 👤 \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

『 \`𝙽𝙸𝙲𝙺\` 』— ${nick}
『 \`𝙽𝚄́𝙼𝙴𝚁𝙾\` 』— ${numero}
『 \`𝙱𝙸𝙾\` 』— ${bio}
『 \`𝙲𝙰𝚁𝙶𝙾\` 』— ${cargo}
『 \`𝚅𝙸𝙿\` 』— ${vip}
『 \`𝙲𝙷𝙰𝚃\` 』— ${chat}
『 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${grupo}

『 🐂 \`𝙽𝙸́𝚅𝙴𝙻 𝙶𝙰𝙳𝙾\` 』— ${nivelGado}%
『 📱 \`𝚂𝙴𝚄 𝙲𝙴𝙻𝚄𝙻𝙰𝚁\` 』— ${celular}
『 😈 \`𝙽𝙸́𝚅𝙴𝙻 𝙿𝚄𝚃𝙰\` 』— ${nivelPuta}%
『 🥵 \`𝙽𝙸́𝚅𝙴𝙻 𝙳𝙴 𝙶𝙾𝚂𝚃𝙾𝚂𝚄𝚁𝙰\` 』— ${gostosura}%
『 🍼 \`𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰\` 』— R$ ${programa}`
}

exports.figuQuantidade = ({ prefix, command }) => {
return `- 🧊 \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> *『 ❌ 』— ɪɴғᴏʀᴍᴇ ᴀ ǫᴜᴀɴᴛɪᴅᴀᴅᴇ ᴅᴇ ғɪɢᴜʀɪɴʜᴀs.*
> *『 📌 』— ᴇxᴇᴍᴘʟᴏ: ${prefix + command} 5*
> *『 🔢 』— ᴍɪ́ɴɪᴍᴏ: 1 | ᴍᴀ́xɪᴍᴏ: 10*`
}

exports.figuMinimo = () => {
return `- 🧊 \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> *『 ❌ 』— ᴀ ǫᴜᴀɴᴛɪᴅᴀᴅᴇ ᴍɪ́ɴɪᴍᴀ ᴇ́ 1 ғɪɢᴜʀɪɴʜᴀ.*`
}

exports.figuMaximo = () => {
return `- 🧊 \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> *『 ❌ 』— ᴏ ʟɪᴍɪᴛᴇ ᴍᴀ́xɪᴍᴏ ᴇ́ ᴅᴇ 10 ғɪɢᴜʀɪɴʜᴀs.*
> *『 ⚠️ 』— ᴇssᴇ ʟɪᴍɪᴛᴇ ᴇᴠɪᴛᴀ ғʟᴏᴏᴅ ɴᴏ ᴄʜᴀᴛ.*`
}

exports.figuCarregando = ({ quantidade, pacote, privado }) => {
return `- 🧊 \`𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙽𝙳𝙾\`

> *『 📦 』— ᴘᴀᴄᴏᴛᴇ: ${pacote}*
> *『 🔢 』— ǫᴜᴀɴᴛɪᴅᴀᴅᴇ: ${quantidade}*
> *『 📍 』— ᴅᴇsᴛɪɴᴏ: ${privado ? 'sᴇᴜ ᴘʀɪᴠᴀᴅᴏ' : 'ᴄʜᴀᴛ ᴀᴛᴜᴀʟ'}*

> *⏳ ᴀɢᴜᴀʀᴅᴇ ᴇɴǫᴜᴀɴᴛᴏ ᴀs ғɪɢᴜʀɪɴʜᴀs sᴀ̃ᴏ ᴇɴᴠɪᴀᴅᴀs...*`
}

exports.figuSucesso = ({ quantidade, pacote, prefix, command, privado }) => {
return `- ✅ \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂 𝙴𝙽𝚅𝙸𝙰𝙳𝙰𝚂\`

> *『 📦 』— ᴘᴀᴄᴏᴛᴇ: ${pacote}*
> *『 🔢 』— ᴇɴᴠɪᴀᴅᴀs: ${quantidade}*
> *『 📍 』— ᴅᴇsᴛɪɴᴏ: ${privado ? 'sᴇᴜ ᴘʀɪᴠᴀᴅᴏ' : 'ᴄʜᴀᴛ ᴀᴛᴜᴀʟ'}*
> *『 🧊 』— ғᴏɴᴛᴇ: ᴛᴏᴋɪᴛᴏ ᴀᴘɪs*

> *ᴘᴀʀᴀ ʀᴇᴄᴇʙᴇʀ ᴍᴀɪs, ᴜsᴇ: ${prefix + command} ${quantidade}*`
}

exports.figuErro = () => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙰𝚂 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> *『 ⚠️ 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇɴᴠɪᴀʀ ᴀs ғɪɢᴜʀɪɴʜᴀs.*
> *『 🔄 』— ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ᴀʟɢᴜɴs ɪɴsᴛᴀɴᴛᴇs.*`
}

exports.getUsuarioUso = ({ prefix, command }) => {
return `- 🌪️ \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙽𝙰̃𝙾 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙳𝙾\`

『 \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙰̃𝙾\` 』— Marque um usuário ou digite o número.
『 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— ${prefix + command} 5511999999999`
}

exports.getBioCarregando = () => {
return `- ✨ \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾 𝙱𝙸𝙾\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Aguarde enquanto busco a biografia do usuário.`
}

exports.getBioResultado = ({ numero, bio }) => {
return `- 🗿 \`𝙱𝙸𝙾𝙶𝚁𝙰𝙵𝙸𝙰 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${numero}
『 \`𝙱𝙸𝙾\` 』— ${bio}`
}

exports.getPerfilCarregando = () => {
return `- 🙇‍♂️ \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾 𝙿𝙴𝚁𝙵𝙸𝙻\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Aguarde enquanto busco a foto do usuário.`
}

exports.getPerfilResultado = ({ numero, prefix }) => {
return `- ⚡ \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${numero}
『 \`𝙱𝙸𝙾𝙶𝚁𝙰𝙵𝙸𝙰\` 』— Use ${prefix}getbio @${numero}
『 \`𝙱𝙰𝙽𝙽𝙴𝚁\` 』— Use ${prefix}getbanner @${numero}`
}

exports.getBannerCarregando = () => {
return `- 🖼️ \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾 𝙱𝙰𝙽𝙽𝙴𝚁\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Aguarde enquanto busco o banner do usuário.`
}

exports.getBannerResultado = ({ numero }) => {
return `- 🖼️ \`𝙱𝙰𝙽𝙽𝙴𝚁 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${numero}
『 \`𝙾𝚁𝙸𝙶𝙴𝙼\` 』— WhatsApp Business`
}

exports.getBannerNaoEncontrado = ({ numero }) => {
return `- ❌ \`𝙱𝙰𝙽𝙽𝙴𝚁 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${numero}
『 \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙰̃𝙾\` 』— Esse usuário não possui WhatsApp Business.`
}

exports.funcaoUsoSimples = (prefix, command) => {
return `- ⚙️ \`𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝙲̧𝙰̃𝙾\`

『 ✅ \`𝙰𝚃𝙸𝚅𝙰𝚁\` 』— ${prefix}${command} 1
『 ❌ \`𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝚁\` 』— ${prefix}${command} 0`
}

exports.funcaoAlterada = (nome, ativa) => {
return `- ${ativa ? '✅' : '❌'} \`${nome}\`

『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${ativa ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'}
『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ᴄᴏɴғɪɢᴜʀᴀᴄ̧ᴀ̃ᴏ ᴀᴛᴜᴀʟɪᴢᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ.`
}

exports.dddUso = (prefix, command) => {
return `- 📱 \`𝙳𝙳𝙳 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`\n\n> *『 𝙴𝚇𝙴𝙼𝙿𝙻𝙾 』— ${prefix + command} 11*\n> *『 𝚅𝙰́𝚁𝙸𝙾𝚂 』— ${prefix + command} 11 21 31*`
}

exports.dddJaCadastrado = ddds => {
return `- ⚠️ \`𝙳𝙳𝙳 𝙹𝙰́ 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾\`\n\n> *『 𝙳𝙳𝙳 』— ${ddds.join(', ')}*`
}

exports.dddNaoCadastrado = ddds => {
return `- ⚠️ \`𝙳𝙳𝙳 𝙽𝙰̃𝙾 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾\`\n\n> *『 𝙳𝙳𝙳 』— ${ddds.join(', ')}*`
}

exports.dddAdicionado = ddds => {
return `- ✅ \`𝙳𝙳𝙳 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾\`\n\n> *『 𝙳𝙳𝙳 』— ${ddds.join(', ')}*\n> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴀɢᴏʀᴀ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ᴅᴏ ᴀɴᴛɪ-ᴅᴅᴅ.*`
}

exports.dddRemovido = ddds => {
return `- ✅ \`𝙳𝙳𝙳 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`\n\n> *『 𝙳𝙳𝙳 』— ${ddds.join(', ')}*\n> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴀ ʟɪsᴛᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.dddLista = lista => {
const itens = lista.length ? lista.map((ddd, i) => `> *『 ${i + 1} 』— ${ddd}*`).join('\n') : '> *『 𝚅𝙰𝚉𝙸𝙰 』— ɴᴇɴʜᴜᴍ ᴅᴅᴅ ᴘʀᴏɪʙɪᴅᴏ.*'
return `- 📱 \`𝙻𝙸𝚂𝚃𝙰 𝙳𝙾 𝙰𝙽𝚃𝙸-𝙳𝙳𝙳\`\n\n${itens}`
}

exports.listaNegraUso = (prefix, command) => {
return `- 🚫 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`\n\n> *『 𝙼𝙰𝚁𝙲𝙰𝙲̧𝙰̃𝙾 』— ${prefix + command} @usuario*\n> *『 𝙽𝚄́𝙼𝙴𝚁𝙾 』— ${prefix + command} 5511999999999*\n> *『 𝚁𝙴𝚂𝙿𝙾𝚂𝚃𝙰 』— responda à mensagem e use ${prefix + command}*`
}

exports.listaNegraJaExiste = alvo => {
return `- ⚠️ \`𝙹𝙰́ 𝙴𝚂𝚃𝙰́ 𝙽𝙰 𝙻𝙸𝚂𝚃𝙰\`\n\n> *『 @${String(alvo).split('@')[0]} 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ɴᴇɢʀᴀ.*`
}

exports.listaNegraNaoExiste = alvo => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙴𝚂𝚃𝙰́ 𝙽𝙰 𝙻𝙸𝚂𝚃𝙰\`\n\n> *『 @${String(alvo).split('@')[0]} 』— ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ɴᴇɢʀᴀ.*`
}

exports.listaNegraAdicionado = alvo => {
return `- 🚫 \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾 𝙰̀ 𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n> *『 @${String(alvo).split('@')[0]} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ꜰᴏɪ ᴀᴅɪᴄɪᴏɴᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.listaNegraRemovido = alvo => {
return `- ✅ \`𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾 𝙳𝙰 𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n> *『 @${String(alvo).split('@')[0]} 』— ᴏ ᴜsᴜᴀ́ʀɪᴏ ꜰᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.listaNegraLista = lista => {
const itens = lista.length ? lista.map((jid, i) => `> *『 ${i + 1} 』— @${String(jid).split('@')[0]}*`).join('\n') : '> *『 𝚅𝙰𝚉𝙸𝙰 』— ɴᴇɴʜᴜᴍ ᴜsᴜᴀ́ʀɪᴏ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ.*'
return `- 🚫 \`𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n${itens}`
}

exports.blackListEntrada = numero => {
return `- 🚫 \`𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n> *『 @${numero} 』— ᴠᴏᴄᴇ̂ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ɴᴇɢʀᴀ ᴅᴇsᴛᴇ ɢʀᴜᴘᴏ ᴇ sᴇʀᴀ́ ʀᴇᴍᴏᴠɪᴅᴏ.*`
}

exports.antifakeEntrada = numero => {
return `- 🌍 \`𝙰𝙽𝚃𝙸-𝙵𝙰𝙺𝙴\`\n\n> *『 @${numero} 』— ɴᴜ́ᴍᴇʀᴏ ᴇsᴛʀᴀɴɢᴇɪʀᴏ ᴅᴇᴛᴇᴄᴛᴀᴅᴏ. ᴀ ᴇɴᴛʀᴀᴅᴀ ɴᴀ̃ᴏ ᴇ́ ᴘᴇʀᴍɪᴛɪᴅᴀ.*`
}

exports.antidddEntrada = (numero, ddd) => {
return `- 📱 \`𝙰𝙽𝚃𝙸-𝙳𝙳𝙳\`\n\n> *『 @${numero} 』— ᴏ ᴅᴅᴅ ${ddd} ᴇsᴛᴀ́ ᴘʀᴏɪʙɪᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.*`
}

exports.antirrouboPromocao = (autor, alvos) => {
return `- 🛡️ \`𝙰𝙽𝚃𝙸𝚁𝚁𝙾𝚄𝙱𝙾 𝙰𝙲𝙸𝙾𝙽𝙰𝙳𝙾\`\n\n> *『 𝙰𝚄𝚃𝙾𝚁 』— @${String(autor).split('@')[0]}*\n> *『 𝙰𝙲̧𝙰̃𝙾 』— ᴛᴇɴᴛᴏᴜ ᴘʀᴏᴍᴏᴠᴇʀ ${alvos.map(jid => `@${String(jid).split('@')[0]}`).join(', ')} sᴇᴍ ᴀᴜᴛᴏʀɪᴢᴀᴄ̧ᴀ̃ᴏ.*\n> *『 𝙲𝙾𝚁𝚁𝙴𝙲̧𝙰̃𝙾 』— ᴏs ᴄᴀʀɢᴏs ꜰᴏʀᴀᴍ ʀᴇᴛɪʀᴀᴅᴏs ᴇ ᴏ ᴀᴜᴛᴏʀ ꜰᴏɪ ʀᴇʙᴀɪxᴀᴅᴏ.*`
}

exports.antirrouboRebaixamento = (autor, alvos) => {
return `- 🛡️ \`𝙰𝙽𝚃𝙸𝚁𝚁𝙾𝚄𝙱𝙾 𝙰𝙲𝙸𝙾𝙽𝙰𝙳𝙾\`\n\n> *『 𝙰𝚄𝚃𝙾𝚁 』— @${String(autor).split('@')[0]}*\n> *『 𝙰𝙲̧𝙰̃𝙾 』— ᴛᴇɴᴛᴏᴜ ʀᴇʙᴀɪxᴀʀ ${alvos.map(jid => `@${String(jid).split('@')[0]}`).join(', ')} sᴇᴍ ᴀᴜᴛᴏʀɪᴢᴀᴄ̧ᴀ̃ᴏ.*\n> *『 𝙲𝙾𝚁𝚁𝙴𝙲̧𝙰̃𝙾 』— ᴏ ᴀᴅᴍ ᴅᴀ ᴠɪ́ᴛɪᴍᴀ ꜰᴏɪ ᴅᴇᴠᴏʟᴠɪᴅᴏ ᴇ ᴏ ᴀᴜᴛᴏʀ ꜰᴏɪ ʀᴇʙᴀɪxᴀᴅᴏ.*`
}

exports.bemvindoModo = (modo, ativo) => {
return `- ${ativo ? '✅' : '❌'} \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 ${modo}\`\n\n> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.legendaModo = (modo, tipo) => {
return `- ✅ \`𝙻𝙴𝙶𝙴𝙽𝙳𝙰 𝙳𝙾 𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 ${modo}\`\n\n> *『 𝚃𝙸𝙿𝙾 』— ${tipo}*\n> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴀʟᴛᴇʀᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.usologo = (prefix, command) => {
return `- 🎨 \`𝙲𝚁𝙸𝙰𝙳𝙾𝚁 𝙳𝙴 𝙻𝙾𝙶𝙾\`

『 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾\` 』— ${prefix}${command}
『 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— ${prefix}${command} Tokito Bot
『 \`𝙰𝚅𝙸𝚂𝙾\` 』— Digite o texto que será colocado na logo.`
}

exports.usodupla = (prefix, command) => {
return `- 🎨 \`𝙻𝙾𝙶𝙾 𝙲𝙾𝙼 𝙳𝙾𝙸𝚂 𝚃𝙴𝚇𝚃𝙾𝚂\`

『 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾\` 』— ${prefix}${command}
『 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— ${prefix}${command} Tokito|Bot
『 \`𝚂𝙴𝙿𝙰𝚁𝙰𝙳𝙾𝚁\` 』— Use o símbolo | entre os dois textos.`
}

exports.logofeita = command => {
return `- 🎨 \`𝙻𝙾𝙶𝙾 𝙲𝚁𝙸𝙰𝙳𝙰\`

『 \`𝙴𝙵𝙴𝙸𝚃𝙾\` 』— ${command}
『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Criada com sucesso ✅`
}

exports.bnBusca = (tipo, numero) => {
return `- 🔎 \`𝙿𝙴𝚂𝚀𝚄𝙸𝚂𝙰𝙽𝙳𝙾\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${numero}
『 \`𝙵𝙸𝙲𝙷𝙰\` 』— ${tipo}
『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Aguarde o resultado...`
}

exports.bnResultado = (emoji, titulo, numero, tipo, valor) => {
return `- ${emoji} \`${titulo}\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${numero}
『 \`𝙿𝙴𝚁𝙶𝚄𝙽𝚃𝙰\` 』— O quanto esse usuário pode ser ${tipo}?
『 \`𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾\` 』— ${valor}%`
}

exports.bnRank = (emoji, titulo, itens) => {
const lista = itens.map(item => `『 \`${item.posicao}°\` 』— ${item.valor}% • @${item.numero}`).join('\n')
return `- ${emoji} \`${titulo}\`

${lista}`
}

exports.afkAtivado = (motivo, prefix) => {
return `- 💤 \`𝙰𝙵𝙺 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

『 \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${motivo}
『 \`𝚅𝙾𝙻𝚃𝙰𝚁\` 』— Use ${prefix}on ou apenas mande uma mensagem no grupo.`
}

exports.afkNaoAtivo = () => {
return `- ⚠️ \`𝙰𝙵𝙺\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Você não está marcado como ausente.`
}

exports.afkAviso = (jid, motivo, tempo) => {
return `- 💤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙰𝚄𝚂𝙴𝙽𝚃𝙴\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${motivo || 'Sem motivo especificado'}
『 \`𝚃𝙴𝙼𝙿𝙾\` 』— ${tempo}`
}

exports.afkVoltou = (jid, tempo) => {
return `- 👋 \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 𝙳𝙴 𝚅𝙾𝙻𝚃𝙰\`

『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 \`𝙰𝚄𝚂𝙴𝙽𝚃𝙴 𝙿𝙾𝚁\` 』— ${tempo}
『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Sua ausência foi removida automaticamente.`
}

exports.namoroUso = (prefix, command) => {
return `- 💍 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙳𝙴 𝙽𝙰𝙼𝙾𝚁𝙾\`

『 \`𝚄𝚂𝙾\` 』— ${prefix}${command} @usuario
『 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— Marque a pessoa que você quer pedir em namoro.`
}

exports.namoroMesmo = () => `- ❌ \`𝙽𝙰𝙼𝙾𝚁𝙾\`\n\n『 \`𝙰𝚅𝙸𝚂𝙾\` 』— Você não pode pedir namoro para si mesmo.`

exports.namoroOcupado = jid => `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾\`\n\n『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}\n『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Já está em um relacionamento.`

exports.namoroPendente = jid => `- 💌 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴\`\n\n『 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}\n『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Você já enviou um pedido para essa pessoa.`

// ===== NAMORO =====
exports.namoroSemPedido = () => {
return `- ⚠️ \`𝙿𝙴𝙳𝙸𝙳𝙾\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Não encontrei esse pedido de namoro para você.`
}

exports.namoroIndisponivel = () => {
return `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Um dos usuários já está em outro relacionamento.`
}

exports.namoroAceito = (a, b) => {
return `- 💖 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙰𝙲𝙴𝙸𝚃𝙾\`

『 \`𝙲𝙰𝚂𝙰𝙻\` 』— @${String(a).split('@')[0]} + @${String(b).split('@')[0]}
『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Agora vocês estão namorando. 💙`
}

exports.namoroRecusado = (a, b) => {
return `- 💔 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾\`

『 \`𝙳𝙴\` 』— @${String(a).split('@')[0]}
『 \`𝙿𝙾𝚁\` 』— @${String(b).split('@')[0]}`
}

exports.namoroSemEnvio = () => {
return `- ⚠️ \`𝙿𝙴𝙳𝙸𝙳𝙾\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Você não possui pedido de namoro enviado.`
}

exports.namoroCancelado = () => {
return `- ✅ \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Seu pedido de namoro foi cancelado.`
}

exports.namoroSolteiro = () => {
return `- 💙 \`𝙽𝙰𝙼𝙾𝚁𝙾\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Você não está namorando ninguém.`
}

exports.namoroTerminar = prefix => {
return `- 💔 \`𝚃𝙴𝚁𝙼𝙸𝙽𝙰𝚁 𝙽𝙰𝙼𝙾𝚁𝙾\`

『 \`𝙲𝙾𝙽𝙵𝙸𝚁𝙼𝙰𝚁\` 』— ${prefix}terminar 1`
}

exports.namoroTerminou = (a, b) => {
return `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙾\`

『 \`𝙲𝙰𝚂𝙰𝙻\` 』— @${String(a).split('@')[0]} + @${String(b).split('@')[0]}
『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— O relacionamento chegou ao fim.`
}

exports.namoroCasal = (a, b, dias) => {
return `- 💞 \`𝙼𝙴𝚄 𝙲𝙰𝚂𝙰𝙻\`

『 \`𝙿𝙴𝚂𝚂𝙾𝙰 𝟷\` 』— @${String(a).split('@')[0]}
『 \`𝙿𝙴𝚂𝚂𝙾𝙰 𝟸\` 』— @${String(b).split('@')[0]}
『 \`𝚃𝙴𝙼𝙿𝙾\` 』— ${dias} dia(s)`
}

exports.namoroSemCasais = () => {
return `- 💞 \`𝙲𝙰𝚂𝙰𝙸𝚂\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Ainda não há casais registrados neste grupo.`
}

exports.namoroLista = casais => {
const lista = casais.map((item, i) => `『 \`${i + 1}°\` 』— @${String(item.a).split('@')[0]} + @${String(item.b).split('@')[0]}`).join('\n')
return `- 💞 \`𝙲𝙰𝚂𝙰𝙸𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

${lista}`
}
// ===== SÓ ADM =====
exports.soadmUso = (prefix, command) => {
return `- 🛡️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

『 \`𝙰𝚃𝙸𝚅𝙰𝚁\` 』— ${prefix}${command} 1
『 \`𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝚁\` 』— ${prefix}${command} 0`
}

exports.soadmJaAtivo = () => {
return `- ⚠️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— O modo só ADM já está ativado.`
}

exports.soadmJaInativo = () => {
return `- ⚠️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— O modo só ADM já está desativado.`
}

exports.soadmAlterado = ativo => {
return `- ${ativo ? '✅' : '❌'} \`𝚂𝙾́ 𝙰𝙳𝙼\`

『 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${ativo ? 'Ativado' : 'Desativado'} com sucesso neste grupo.`
}

exports.soadmBloqueado = () => {
return `- 🛡️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

『 \`𝙰𝚅𝙸𝚂𝙾\` 』— Neste grupo, somente administradores podem usar comandos do bot.`
}
// ===== SISTEMAS MODULARES NOVOS =====
// ===== INFORMAÇÕES DE COMANDOS =====
exports.infoComando = ({ nome, aliases = [], categoria = 'outros', descricao = 'Sem descrição.', uso = '', permissao = 'Todos', requisitos = '' }) => {
return `- ℹ️ \`𝙸𝙽𝙵𝙾 𝙳𝙾 𝙲𝙾𝙼𝙰𝙽𝙳𝙾\`

『 🧩 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾\` 』— ${nome}
『 📂 \`𝙲𝙰𝚃𝙴𝙶𝙾𝚁𝙸𝙰\` 』— ${categoria}
『 📝 \`𝙳𝙴𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾\` 』— ${descricao}
『 ⚙️ \`𝚄𝚂𝙾\` 』— ${uso || nome}
『 👑 \`𝙿𝙴𝚁𝙼𝙸𝚂𝚂𝙰̃𝙾\` 』— ${permissao}
${requisitos ? `『 🔐 \`𝚁𝙴𝚀𝚄𝙸𝚂𝙸𝚃𝙾𝚂\` 』— ${requisitos}
` : ''}『 🔁 \`𝙰𝙻𝙸𝙰𝚂\` 』— ${aliases.length ? aliases.join(', ') : 'Nenhum'}`
}

exports.infoUso = prefix => {
return `- ℹ️ \`𝙸𝙽𝙵𝙾\`

> *『 𝚄𝚂𝙾 』— ${prefix}info comando*`
}

exports.infoNaoExiste = nome => {
return `- ❌ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`

> *『 ${nome || 'desconhecido'} 』— ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴏ ʀᴇɢɪsᴛʀᴏ ᴅᴇ ᴘʟᴜɢɪɴs.*`
}

exports.totalcmd = ({ canonicos, aliases, total, NomeDoBot, prefix }) => {
return `- 📊 \`𝚃𝙾𝚃𝙰𝙻 𝙳𝙴 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂\`

『 🧩 \`𝙼𝙾́𝙳𝚄𝙻𝙾𝚂\` 』— ${canonicos}
『 🔁 \`𝙰𝙻𝙸𝙰𝚂\` 』— ${aliases}
『 📦 \`𝚃𝙾𝚃𝙰𝙻 𝚄𝚃𝙸𝙻𝙸𝚉𝙰́𝚅𝙴𝙻\` 』— ${total}
『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 ⚙️ \`𝙿𝚁𝙴𝙵𝙸𝚇𝙾\` 』— ${prefix}`
}
// ===== COMANDOS VIP =====
exports.vipCmdUso = prefix => {
return `- 💎 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚅𝙸𝙿\`

> *『 𝚄𝚂𝙾 』— ${prefix}addcmdvip comando*`
}

exports.vipCmdAdicionado = nome => {
return `- 💎 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚅𝙸𝙿\`

> *『 ${nome} 』— ᴀɢᴏʀᴀ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ᴠɪᴘ/ᴅᴏɴᴏ.*`
}

exports.vipCmdRemovido = nome => {
return `- ✅ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙻𝙸𝙱𝙴𝚁𝙰𝙳𝙾\`

> *『 ${nome} 』— ɴᴀ̃ᴏ ᴇ́ ᴍᴀɪs ᴇxᴄʟᴜsɪᴠᴏ ᴅᴇ ᴠɪᴘ.*`
}

exports.vipCmdJa = nome => {
return `- ⚠️ \`𝙹𝙰́ 𝙴́ 𝚅𝙸𝙿\`

> *『 ${nome} 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ᴠɪᴘ.*`
}

exports.vipCmdNao = nome => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙴́ 𝚅𝙸𝙿\`

> *『 ${nome} 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ᴠɪᴘ.*`
}

exports.vipCmdInexistente = nome => {
return `- ❌ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙸𝙽𝙴𝚇𝙸𝚂𝚃𝙴𝙽𝚃𝙴\`

> *『 ${nome || '?'} 』— ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴇssᴇ ᴘʟᴜɢɪɴ.*`
}

exports.vipCmdLista = lista => {
return `- 💎 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝚅𝙸𝙿\`

${lista.length ? lista.map((x, i) => `『 ${i + 1} 』— ${x}`).join('\n') : '> *ɴᴇɴʜᴜᴍ ᴄᴏᴍᴀɴᴅᴏ ᴠɪᴘ ᴄᴏɴғɪɢᴜʀᴀᴅᴏ.*'}`
}

exports.onlyVipCmd = nome => {
return `- 💎 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝚅𝙸𝙿\`

> *『 ${nome} 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ᴜsᴜᴀ́ʀɪᴏs ᴠɪᴘ.*`
}
// ===== BLOQUEIO DE COMANDOS =====
exports.blockCmdUso = prefix => {
return `- 🚫 \`𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝚁 𝙲𝙾𝙼𝙰𝙽𝙳𝙾\`

> *『 𝚄𝚂𝙾 』— ${prefix}blockcmd comando*`
}

exports.blockCmdAdicionado = nome => {
return `- 🚫 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> *『 ${nome} 』— ɴᴀ̃ᴏ ᴘᴏᴅᴇʀᴀ́ sᴇʀ ᴜsᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.*`
}

exports.blockCmdRemovido = nome => {
return `- ✅ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙻𝙸𝙱𝙴𝚁𝙰𝙳𝙾\`

> *『 ${nome} 』— ᴠᴏʟᴛᴏᴜ ᴀ ғᴜɴᴄɪᴏɴᴀʀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.*`
}

exports.blockCmdJa = nome => {
return `- ⚠️ \`𝙹𝙰́ 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> *『 ${nome} 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴊᴀ́ ᴇsᴛᴀ́ ʙʟᴏǫᴜᴇᴀᴅᴏ.*`
}

exports.blockCmdNao = nome => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> *『 ${nome} 』— ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ʙʟᴏǫᴜᴇᴀᴅᴏ.*`
}

exports.blockCmdLista = lista => {
return `- 🚫 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾𝚂\`

${lista.length ? lista.map((x, i) => `『 ${i + 1} 』— ${x}`).join('\n') : '> *ɴᴇɴʜᴜᴍ ᴄᴏᴍᴀɴᴅᴏ ʙʟᴏǫᴜᴇᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.*'}`
}

exports.blockCmdNegado = nome => {
return `- 🚫 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> *『 ${nome} 』— ᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ʙʟᴏǫᴜᴇᴀʀᴀᴍ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.*`
}
// ===== ADVERTÊNCIAS =====
exports.advUso = prefix => {
return `- ⚠️ \`𝙰𝙳𝚅𝙴𝚁𝚃𝙴̂𝙽𝙲𝙸𝙰\`

> *『 𝚄𝚂𝙾 』— ${prefix}adv @usuario motivo*`
}

exports.advMesmo = () => {
return `- ❌ \`𝙰𝙳𝚅\`

> *ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sᴇ ᴀᴅᴠᴇʀᴛɪʀ.*`
}

exports.advAplicada = (jid, qtd, limite, motivo, removido = false) => {
return `- ⚠️ \`𝙰𝙳𝚅𝙴𝚁𝚃𝙴̂𝙽𝙲𝙸𝙰\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 📊 \`𝙰𝙳𝚅\` 』— ${qtd}/${limite}
『 📝 \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${motivo}
${removido ? '『 🚫 `𝚂𝚃𝙰𝚃𝚄𝚂` 』— ʀᴇᴍᴏᴠɪᴅᴏ ᴀᴏ ᴀᴛɪɴɢɪʀ ᴏ ʟɪᴍɪᴛᴇ.' : '『 ✅ `𝚂𝚃𝙰𝚃𝚄𝚂` 』— ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀ ʀᴇɢɪsᴛʀᴀᴅᴀ.'}`
}

exports.delAdvUso = prefix => {
return `- ⚠️ \`𝚁𝙴𝙼𝙾𝚅𝙴𝚁 𝙰𝙳𝚅\`

> *『 𝚄𝚂𝙾 』— ${prefix}deladv @usuario [tudo]*`
}

exports.advRemovida = (jid, qtd) => {
return `- ✅ \`𝙰𝙳𝚅 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙰\`

> *『 @${String(jid).split('@')[0]} 』— ᴀɢᴏʀᴀ ᴘᴏssᴜɪ ${qtd} ᴀᴅᴠ.*`
}

exports.advNenhuma = jid => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙰𝙳𝚅\`

> *『 @${String(jid).split('@')[0]} 』— ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs.*`
}

exports.advLista = lista => {
return `- ⚠️ \`𝙻𝙸𝚂𝚃𝙰 𝙳𝙴 𝙰𝙳𝚅\`

${lista.length ? lista.map((x, i) => `『 ${i + 1} 』— @${x.jid.split('@')[0]} • ${x.quantidade}/3`).join('\n') : '> *ɴᴇɴʜᴜᴍᴀ ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀ ʀᴇɢɪsᴛʀᴀᴅᴀ.*'}`
}

exports.advAutomatica = (jid, qtd, motivo) => {
return `- ⚠️ \`𝙰𝙳𝚅 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 📊 \`𝙰𝙳𝚅\` 』— ${qtd}/3
『 📝 \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${motivo}`
}
// ===== MUTE =====
exports.muteUso = prefix => {
return `- 🔇 \`𝙼𝚄𝚃𝙴\`

> *『 𝚂𝙸𝙻𝙴𝙽𝙲𝙸𝙰𝚁 』— ${prefix}mute @usuario silenciar*
> *『 𝙱𝙰𝙽 』— ${prefix}mute @usuario ban*`
}

exports.muteMesmo = () => {
return `- ❌ \`𝙼𝚄𝚃𝙴\`

> *ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sɪʟᴇɴᴄɪᴀʀ ᴀ sɪ ᴍᴇsᴍᴏ.*`
}

exports.muteAtivado = (jid, modo) => {
return `- 🔇 \`𝙼𝚄𝚃𝙴 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 ⚙️ \`𝙼𝙾𝙳𝙾\` 』— ${modo === 'ban' ? 'ʀᴇᴍᴏᴠᴇʀ ᴀᴏ ғᴀʟᴀʀ' : 'ᴀᴘᴀɢᴀʀ ᴍᴇɴsᴀɢᴇɴs'}`
}

exports.desmuteUso = prefix => {
return `- 🔊 \`𝙳𝙴𝚂𝙼𝚄𝚃𝙴\`

> *『 𝚄𝚂𝙾 』— ${prefix}desmute @usuario*`
}

exports.muteDesativado = jid => {
return `- 🔊 \`𝙼𝚄𝚃𝙴 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> *『 @${String(jid).split('@')[0]} 』— ᴘᴏᴅᴇ ᴠᴏʟᴛᴀʀ ᴀ ғᴀʟᴀʀ.*`
}

exports.muteNaoAtivo = jid => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙴𝚂𝚃𝙰́ 𝙼𝚄𝚃𝙰𝙳𝙾\`

> *『 @${String(jid).split('@')[0]} 』— ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ.*`
}

exports.muteLista = lista => {
return `- 🔇 \`𝙻𝙸𝚂𝚃𝙰 𝙳𝙴 𝙼𝚄𝚃𝙴\`

${lista.length ? lista.map((x, i) => `『 ${i + 1} 』— @${String(x.id).split('@')[0]} • ${x.modo}`).join('\n') : '> *ɴɪɴɢᴜᴇ́ᴍ sɪʟᴇɴᴄɪᴀᴅᴏ.*'}`
}

exports.muteBanDisparado = (jid, ok) => {
return `- 🚫 \`𝙼𝚄𝚃𝙴 𝙱𝙰𝙽\`

> *『 @${String(jid).split('@')[0]} 』— ${ok ? 'ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴀᴏ ᴛᴇɴᴛᴀʀ ғᴀʟᴀʀ.' : 'ᴛᴇɴᴛᴏᴜ ғᴀʟᴀʀ, ᴍᴀs ɴᴀ̃ᴏ ᴄᴏɴsᴇɢᴜɪ ʀᴇᴍᴏᴠᴇʀ.'}*`
}
// ===== MERCADO PAGO =====
exports.tokenMpUso = prefix => {
return `- 💳 \`𝙼𝙴𝚁𝙲𝙰𝙳𝙾 𝙿𝙰𝙶𝙾\`

> *『 𝚄𝚂𝙾 』— ${prefix}tokenmp ACCESS_TOKEN*`
}

exports.tokenMpPrivado = () => {
return `- 🔐 \`𝚂𝙴𝙶𝚄𝚁𝙰𝙽𝙲̧𝙰\`

> *ᴄᴏɴғɪɢᴜʀᴇ ᴏ ᴛᴏᴋᴇɴ ᴀᴘᴇɴᴀs ɴᴏ ᴘʀɪᴠᴀᴅᴏ ᴅᴏ ʙᴏᴛ.*`
}

exports.tokenMpSalvo = () => {
return `- ✅ \`𝙼𝙴𝚁𝙲𝙰𝙳𝙾 𝙿𝙰𝙶𝙾\`

> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴛᴏᴋᴇɴ sᴀʟᴠᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.tokenMpAusente = () => {
return `- 💳 \`𝙿𝙸𝚇 𝙽𝙰̃𝙾 𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝙳𝙾\`

> *ᴏ ᴅᴏɴᴏ ᴀɪɴᴅᴀ ɴᴀ̃ᴏ ᴄᴏɴғɪɢᴜʀᴏᴜ ᴏ ᴛᴏᴋᴇɴ ᴅᴏ ᴍᴇʀᴄᴀᴅᴏ ᴘᴀɢᴏ.*`
}
// ===== MODOS RPG / N-COINS =====
exports.modoRpgUso = prefix => {
return `- 🐉 \`𝙼𝙾𝙳𝙾 𝚁𝙿𝙶\`

> *『 𝙰𝚃𝙸𝚅𝙰𝚁 』— ${prefix}modorpg 1*
> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝚁 』— ${prefix}modorpg 0*`
}

exports.modoCoinsUso = prefix => {
return `- 🪙 \`𝙼𝙾𝙳𝙾 𝙲𝙾𝙸𝙽𝚂\`

> *『 𝙰𝚃𝙸𝚅𝙰𝚁 』— ${prefix}modocoins 1*
> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝚁 』— ${prefix}modocoins 0*`
}

exports.modoAlterado = (nome, ativo) => {
return `- ${ativo ? '✅' : '❌'} \`${nome}\`

> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.rpgDesativado = prefix => {
return `- 🐉 \`𝚁𝙿𝙶 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *ᴜsᴇ ${prefix}modorpg 1 ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ.*`
}

exports.coinsDesativado = prefix => {
return `- 🪙 \`𝙲𝙾𝙸𝙽𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *ᴜsᴇ ${prefix}modocoins 1 ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ.*`
}

exports.rpgCoinsDesativado = prefix => {
return `- 🔐 \`𝚁𝙿𝙶 + 𝙲𝙾𝙸𝙽𝚂\`

> *ᴘᴇᴛ/ᴘᴏᴋᴇ́ᴍᴏɴ ᴘʀᴇᴄɪsᴀᴍ ᴅᴇ ${prefix}modorpg 1 ᴇ ${prefix}modocoins 1.*`
}
// ===== MODO IA =====
exports.modoIaUso = prefix => {
return `- 🧠 \`𝙼𝙾𝙳𝙾 𝙸𝙰\`

> *『 𝚃𝙴𝚇𝚃𝙾 』— ${prefix}modoia 1 texto*
> *『 𝙰́𝚄𝙳𝙸𝙾 』— ${prefix}modoia 1 audio*
> *『 𝚃𝚁𝙾𝙲𝙰𝚁 』— ${prefix}modoia texto|audio*
> *『 𝙳𝙴𝚂𝙻𝙸𝙶𝙰𝚁 』— ${prefix}modoia 0*`
}

exports.modoIaAlterado = (ativo, tipo) => {
return `- 🧠 \`𝙼𝙾𝙳𝙾 𝙸𝙰\`

『 ⚙️ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'}
『 ${tipo === 'audio' ? '🎙️' : '⌨️'} \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${tipo}`
}

exports.iaFale = () => {
return `- 🧠 \`𝚃𝙾𝙺𝙸𝚃𝙾 𝙸𝙰\`

> *ᴍᴇ ғᴀʟᴀ ᴏ ǫᴜᴇ ᴠᴏᴄᴇ̂ ǫᴜᴇʀ ǫᴜᴇ ᴇᴜ ғᴀᴄ̧ᴀ.*`
}

exports.iaErro = () => {
return `- ❌ \`𝙼𝙾𝙳𝙾 𝙸𝙰\`

> *ᴅᴇᴜ ᴜᴍ ᴇʀʀᴏ ᴛᴇɴᴛᴀɴᴅᴏ ᴘᴇɴsᴀʀ ɴɪssᴏ.*`
}
// ===== ANTI CANAL =====
exports.antiCanalUso = prefix => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

> *『 𝙰𝚃𝙸𝚅𝙰𝚁 』— ${prefix}anticanal 1*
> *『 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝚁 』— ${prefix}anticanal 0*`
}

exports.antiCanalAlterado = ativo => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.antiCanalRemovido = jid => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

> *『 @${String(jid).split('@')[0]} 』— ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴘᴏʀ ᴇɴᴠɪᴀʀ/ᴇɴᴄᴀᴍɪɴʜᴀʀ ᴜᴍ ᴄᴀɴᴀʟ.*`
}
// ===== CARGOS DO GRUPO =====
exports.serAdmOk = jid => {
return `- 👑 \`𝚂𝙴𝚁 𝙰𝙳𝙼\`

> *『 @${String(jid).split('@')[0]} 』— ᴀɢᴏʀᴀ ᴇ́ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ.*`
}

exports.serMembroOk = jid => {
return `- 👤 \`𝚂𝙴𝚁 𝙼𝙴𝙼𝙱𝚁𝙾\`

> *『 @${String(jid).split('@')[0]} 』— ᴀɢᴏʀᴀ ᴇ́ ᴍᴇᴍʙʀᴏ ᴄᴏᴍᴜᴍ.*`
}
// ===== ALUGUEL =====
exports.aluguelModo = ativo => {
return `- 🏠 \`𝙼𝙾𝙳𝙾 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> *『 𝚂𝚃𝙰𝚃𝚄𝚂 』— ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ.*`
}

exports.aluguelDesativado = () => {
return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *ᴏ ᴍᴏᴅᴏ ᴀʟᴜɢᴜᴇʟ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴀᴛɪᴠᴏ.*`
}

exports.aluguelUso = prefix => {
return `- 🛒 \`𝙰𝙻𝚄𝙶𝙰𝚁 𝙱𝙾𝚃\`

> *『 𝚄𝚂𝙾 』— ${prefix}alugarbot https://chat.whatsapp.com/...*`
}

exports.aluguelPedido = (nome, link, planos, prefix) => {
return `- 🛒 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙳𝙾 𝙱𝙾𝚃\`

『 📍 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${nome}
『 🔗 \`𝙻𝙸𝙽𝙺\` 』— ${link}

${planos.map(p => `『 📦 \`${p.nome}\` 』— R$ ${Number(p.preco).toFixed(2)} • ${p.dias} dias
> ${prefix}pixalugar ${p.preco}`).join('\n\n')}`
}

exports.aluguelSemPlanos = () => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙿𝙻𝙰𝙽𝙾𝚂\`

> *ɴᴀ̃ᴏ ʜᴀ́ ᴘʟᴀɴᴏs ᴄᴀᴅᴀsᴛʀᴀᴅᴏs ᴇᴍ planos.json.*`
}

exports.aluguelSemPedido = prefix => {
return `- ❌ \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`

> *ᴜsᴇ ${prefix}alugarbot link-do-grupo ᴘʀɪᴍᴇɪʀᴏ.*`
}

exports.aluguelPlanoInvalido = () => {
return `- ❌ \`𝙿𝙻𝙰𝙽𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> *ᴇsᴄᴏʟʜᴀ ᴜᴍ ᴅᴏs ᴠᴀʟᴏʀᴇs ᴅᴏ ᴄᴀᴛᴀ́ʟᴏɢᴏ.*`
}

exports.aluguelPix = (item) => {
return `- 💳 \`𝙿𝙸𝚇 𝙳𝙾 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

『 📦 \`𝙿𝙻𝙰𝙽𝙾\` 』— ${item.plano.nome}
『 💸 \`𝚅𝙰𝙻𝙾𝚁\` 』— R$ ${Number(item.plano.preco).toFixed(2)}
『 ⏳ \`𝙳𝚄𝚁𝙰𝙲̧𝙰̃𝙾\` 』— ${item.plano.dias} dias
『 ⚙️ \`𝙸𝙳\` 』— ${item.id}
『 🪫 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— aguardando pagamento

> *ᴏ sɪsᴛᴇᴍᴀ ᴠᴇʀɪғɪᴄᴀ ᴀ ᴀᴘʀᴏᴠᴀᴄ̧ᴀ̃ᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.*`
}

exports.aluguelManualUso = prefix => {
return `- 🏠 \`𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝚁 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> *『 𝚄𝚂𝙾 』— ${prefix}rgaluguel dias [horas]*`
}

exports.aluguelManualOk = data => {
return `- ✅ \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> *『 𝚅𝙴𝙽𝙲𝙸𝙼𝙴𝙽𝚃𝙾 』— ${data}*`
}

exports.aluguelNaoTem = () => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> *ᴇsᴛᴇ ɢʀᴜᴘᴏ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴀʟᴜɢᴜᴇʟ ᴀᴛɪᴠᴏ.*`
}

exports.aluguelVer = g => {
const fim = new Date(g.expiraEm)
const diff = Math.max(0, fim - Date.now())
const d = Math.floor(diff / 86400000)
const h = Math.floor(diff / 3600000) % 24
const m = Math.floor(diff / 60000) % 60
return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙰𝚃𝙸𝚅𝙾\`

『 📦 \`𝙿𝙻𝙰𝙽𝙾\` 』— ${g.planoNome || 'Plano'}
『 📅 \`𝚅𝙴𝙽𝙲𝙴\` 』— ${fim.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
『 ⏳ \`𝚁𝙴𝚂𝚃𝙰\` 』— ${d}d ${h}h ${m}m`
}

exports.aluguelLista = lista => {
return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴́𝙸𝚂\`

${lista.length ? lista.map((g, i) => `『 ${i + 1} 』— ${g.id}
> ${g.ativo !== false ? '✅ ativo' : '❌ expirado'} • ${g.planoNome || 'Plano'} • ${g.expiraEm ? new Date(g.expiraEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'sem vencimento'}`).join('\n\n') : '> *ɴᴇɴʜᴜᴍ ᴀʟᴜɢᴜᴇʟ ʀᴇɢɪsᴛʀᴀᴅᴏ.*'}`
}

exports.aluguelRemovido = id => {
return `- 🗑️ \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> *『 ${id} 』— ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴏ sɪsᴛᴇᴍᴀ.*`
}
// ===== PROTEÇÕES / ADVERTÊNCIAS AUTOMÁTICAS =====
exports.antiCanalAdv = (jid, qtd, removido = false) => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 ⚠️ \`𝙰𝙳𝚅\` 』— ${qtd}/3
『 📝 \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— envio/divulgação de canal
『 🚫 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${removido ? 'removido ao atingir o limite' : 'mensagem apagada e advertência aplicada'}`
}

exports.aluguelBloqueado = prefix => {
return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙴𝚇𝙿𝙸𝚁𝙰𝙳𝙾\`

> *ᴇsᴛᴇ ɢʀᴜᴘᴏ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴀʟᴜɢᴜᴇʟ ᴀᴛɪᴠᴏ. ᴘᴀʀᴀ ᴄᴏᴍᴘʀᴀʀ ᴜsᴇ ${prefix}alugarbot ɴᴏ ᴘʀɪᴠᴀᴅᴏ ᴅᴏ ʙᴏᴛ.*`
}

exports.protecaoAdv = (emoji, titulo, jid, qtd, motivo, removido = false) => {
return `- ${emoji} \`${titulo}\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 ⚠️ \`𝙰𝙳𝚅\` 』— ${qtd}/3
『 📝 \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${motivo}
『 🚫 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${removido ? 'removido ao atingir 3 advertências' : 'mensagem apagada e advertência registrada'}`
}

exports.advAutomaticaDetalhe = (jid, qtd, motivo, removido = false) => {
return `- ⚠️ \`𝙰𝙳𝚅 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 📊 \`𝙰𝙳𝚅\` 』— ${qtd}/3
『 📝 \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${motivo}
『 🚫 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${removido ? 'removido ao atingir o limite' : 'advertência automática registrada'}`
}
// ===== RPG / N-COINS / PET / POKÉMON =====
// ===== N-COINS =====
exports.coinsSaldo = (jid, saldo) => {
return `- 🪙 \`𝙽-𝙲𝙾𝙸𝙽𝚂\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${String(jid).split('@')[0]}
『 💰 \`𝚂𝙰𝙻𝙳𝙾\` 』— ${Number(saldo || 0).toLocaleString('pt-BR')} N-Coins`
}

exports.coinsCooldown = s => {
return `- ⏳ \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴\`

> *ᴠᴏᴄᴇ̂ ᴘᴏᴅᴇ ᴜsᴀʀ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ${s}s.*`
}

exports.coinsMinerado = (jid, g, total) => {
return `- ⛏️ \`𝙼𝙸𝙽𝙴𝚁𝙰𝙲̧𝙰̃𝙾\`

『 👤 』— @${String(jid).split('@')[0]}
『 💎 \`𝙶𝙰𝙽𝙷𝙾\` 』— +${g} N-Coins
『 💰 \`𝚂𝙰𝙻𝙳𝙾\` 』— ${total}`
}

exports.coinsDoarUso = p => {
return `- 🪙 \`𝙳𝙾𝙰𝚁 𝙲𝙾𝙸𝙽𝚂\`

> *『 𝚄𝚂𝙾 』— ${p}doarcoins @usuario 100*`
}

exports.coinsDoarMesmo = () => {
return `- ❌ \`𝙳𝙾𝙰𝙲̧𝙰̃𝙾\`

> *ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ ᴅᴏᴀʀ ᴘᴀʀᴀ sɪ ᴍᴇsᴍᴏ.*`
}

exports.coinsSemSaldo = (v, s) => {
return `- 💸 \`𝚂𝙰𝙻𝙳𝙾 𝙸𝙽𝚂𝚄𝙵𝙸𝙲𝙸𝙴𝙽𝚃𝙴\`

『 💰 \`𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\` 』— ${v}
『 🪙 \`𝚂𝙴𝚄 𝚂𝙰𝙻𝙳𝙾\` 』— ${s}`
}

exports.coinsDoado = (a, b, v, s) => {
return `- ✅ \`𝚃𝚁𝙰𝙽𝚂𝙵𝙴𝚁𝙴̂𝙽𝙲𝙸𝙰\`

『 👤 \`𝙳𝙴\` 』— @${a.split('@')[0]}
『 👤 \`𝙿𝙰𝚁𝙰\` 』— @${b.split('@')[0]}
『 🪙 \`𝚅𝙰𝙻𝙾𝚁\` 』— ${v}
『 💰 \`𝚂𝙰𝙻𝙳𝙾\` 』— ${s}`
}

exports.coinsRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙽-𝙲𝙾𝙸𝙽𝚂\`

${l.length ? l.map((x, i) => `『 ${i + 1}° 』— @${x.jid.split('@')[0]} • ${x.valor.toLocaleString('pt-BR')}`).join('\n') : '> *sem usuários ainda.*'}`
}

exports.coinsGerenciarUso = (p, c) => {
return `- 🪙 \`𝙶𝙴𝚁𝙴𝙽𝙲𝙸𝙰𝚁 𝙲𝙾𝙸𝙽𝚂\`

> *${p}${c} @usuario 1000*`
}

exports.coinsGerenciado = (j, s, r) => {
return `- ${r ? '➖' : '➕'} \`𝙽-𝙲𝙾𝙸𝙽𝚂\`

> *@${j.split('@')[0]} agora possui ${s} N-Coins.*`
}
// ===== LEVEL =====
exports.levelPerfil = (j, u, pos) => {
return `- 🎖️ \`𝙻𝙴𝚅𝙴𝙻\`

『 👤 』— @${j.split('@')[0]}
『 ⭐ \`𝙻𝙴𝚅𝙴𝙻\` 』— ${u.level}
『 🧠 \`𝚇𝙿\` 』— ${u.xp}
『 🎖️ \`𝙿𝙰𝚃𝙴𝙽𝚃𝙴\` 』— ${u.patente}
『 🏆 \`𝚁𝙰𝙽𝙺\` 』— #${pos || '-'}`
}

exports.levelRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙻𝙴𝚅𝙴𝙻\`

${l.length ? l.map((x, i) => `『 ${i + 1}° 』— @${x.jid.split('@')[0]} • ${x.valor} XP • ${x.u.patente}`).join('\n') : '> *sem XP ainda.*'}`
}

exports.levelUp = (j, u) => {
return `- 🎉 \`𝙻𝙴𝚅𝙴𝙻 𝚄𝙿\`

> *@${j.split('@')[0]} desbloqueou a patente *${u.patente}* com ${u.xp} XP!*`
}

exports.levelGerenciarUso = (p, c) => {
return `- 🎖️ \`𝙶𝙴𝚁𝙴𝙽𝙲𝙸𝙰𝚁 𝚇𝙿\`

> *${p}${c} @usuario 100*`
}

exports.levelGerenciado = (j, u, r) => {
return `- ${r ? '➖' : '➕'} \`𝚇𝙿\`

> *@${j.split('@')[0]} • ${u.xp} XP • Level ${u.level} • ${u.patente}*`
}
// ===== PET =====
exports.petShop = (pets, p) => {
return `- 🐾 \`𝙿𝙴𝚃 𝚂𝙷𝙾𝙿\`

${Object.entries(pets).map(([k, v]) => `『 🐾 \`${v.nome}\` 』— ${v.preco} N-Coins
> ${p}comprarpet ${k}`).join('\n\n')}`
}

exports.petJaTem = () => {
return `- 🐾 \`𝙿𝙴𝚃\`

> *ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴘᴏssᴜɪ ᴜᴍ ᴘᴇᴛ.*`
}

exports.petNaoTem = p => {
return `- 🐾 \`𝚂𝙴𝙼 𝙿𝙴𝚃\`

> *ᴜsᴇ ${p}petshop ᴇ ${p}comprarpet.*`
}

exports.petComprado = (t, v, s) => {
return `- 🐾 \`𝙿𝙴𝚃 𝙰𝙳𝙾𝚃𝙰𝙳𝙾\`

『 🐾 \`𝚃𝙸𝙿𝙾\` 』— ${t}
『 💸 \`𝚅𝙰𝙻𝙾𝚁\` 』— ${v}
『 🪙 \`𝚂𝙰𝙻𝙳𝙾\` 』— ${s}`
}

exports.petPerfil = (j, p) => {
return `- 🐾 \`𝙼𝙴𝚄 𝙿𝙴𝚃\`

『 👤 』— @${j.split('@')[0]}
『 🐾 \`𝙽𝙾𝙼𝙴\` 』— ${p.apelido || p.tipo}
『 🍖 \`𝙵𝙾𝙼𝙴\` 』— ${p.fome}%
『 💖 \`𝙰𝙵𝙴𝚃𝙾\` 』— ${p.afeto || 0}
『 ⭐ \`𝙽𝙸́𝚅𝙴𝙻\` 』— ${p.nivel || 1}
『 🧠 \`𝚇𝙿\` 』— ${p.xp || 0}
『 😴 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${p.dormindo ? 'dormindo' : 'acordado'}`
}

exports.petAlimentado = (p, c) => {
return `- 🍖 \`𝙿𝙴𝚃 𝙰𝙻𝙸𝙼𝙴𝙽𝚃𝙰𝙳𝙾\`

> *${p.apelido || p.tipo} está com ${p.fome}% de fome. Custo: ${c} N-Coins.*`
}

exports.petCuidado = (p, t) => {
return `- 🐾 \`𝙲𝚄𝙸𝙳𝙰𝙳𝙾 𝙳𝙾 𝙿𝙴𝚃\`

> *${p.apelido || p.tipo} ${t}*`
}

exports.petApelidoUso = p => {
return `- 🐾 \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> *${p}apelidopet nome*`
}

exports.petApelido = n => {
return `- ✅ \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> *Seu pet agora se chama ${n}.*`
}

exports.petVendido = (v, s) => {
return `- 💸 \`𝙿𝙴𝚃 𝚅𝙴𝙽𝙳𝙸𝙳𝙾\`

> *Você recebeu ${v} N-Coins. Saldo: ${s}.*`
}

exports.petRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙿𝙴𝚃𝚂\`

${l.length ? l.map((x, i) => `『 ${i + 1}° 』— @${x.jid.split('@')[0]} • ${x.pet.apelido || x.pet.tipo} • ${x.pet.xp || 0} XP`).join('\n') : '> *sem pets ainda.*'}`
}
// ===== POKÉMON =====
exports.pokemonShop = (itens, p, raro) => {
return `- ${raro ? '🌌' : '🏪'} \`${raro ? '𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝚁𝙰𝚁𝙾𝚂' : '𝙻𝙾𝙹𝙰 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽'}\`

${itens.map(([k, v]) => `『 ⚪ \`${v.nome}\` 』— ${v.tipo}
『 💸 』— ${v.preco} N-Coins
『 ✨ 』— ${v.habilidade}
> ${p}comprarpokemon ${k}`).join('\n\n')}`
}

exports.pokemonInvalido = p => {
return `- ❌ \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> *ᴜsᴇ ${p}lojapokemon.*`
}

exports.pokemonJaTem = () => {
return `- ⚠️ \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

> *ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴘᴏssᴜɪ ᴜᴍ ᴘᴏᴋᴇ́ᴍᴏɴ.*`
}

exports.pokemonNaoTem = p => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

> *ᴜsᴇ ${p}lojapokemon ᴘᴀʀᴀ ᴄᴏᴍᴘʀᴀʀ.*`
}

exports.pokemonComprado = (p, s) => {
return `- ✅ \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝙲𝙾𝙼𝙿𝚁𝙰𝙳𝙾\`

『 ⚪ 』— ${p.nome}
『 💸 』— ${p.preco} N-Coins
『 🪙 \`𝚂𝙰𝙻𝙳𝙾\` 』— ${s}`
}

exports.pokemonPerfil = (j, p, d) => {
return `- ⚡ \`𝙼𝙴𝚄 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

『 👤 』— @${j.split('@')[0]}
『 ⚪ \`𝙽𝙾𝙼𝙴\` 』— ${p.apelido || d.nome || p.tipo}
『 🔮 \`𝚃𝙸𝙿𝙾\` 』— ${d.tipo || '-'}
『 👑 \`𝚁𝙰𝚁𝙸𝙳𝙰𝙳𝙴\` 』— ${d.raridade || '-'}
『 🍓 \`𝙵𝙾𝙼𝙴\` 』— ${p.fome}%
『 💖 \`𝙰𝙵𝙴𝚃𝙾\` 』— ${p.afeto || 0}
『 ⭐ \`𝙽𝙸́𝚅𝙴𝙻\` 』— ${p.nivel || 1}
『 🧠 \`𝚇𝙿\` 』— ${p.xp || 0}
『 ✨ \`𝙷𝙰𝙱𝙸𝙻𝙸𝙳𝙰𝙳𝙴\` 』— ${d.habilidade || '-'}`
}

exports.pokemonComidas = (c, p) => {
return `- 🍓 \`𝙲𝙾𝙼𝙸𝙳𝙰𝚂 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

${Object.entries(c).map(([k, v]) => `『 ${v.nome} 』— ${v.preco} • +${v.fome}%
> ${p}alimentarpokemon ${k}`).join('\n\n')}`
}

exports.pokemonAlimentado = (c, p, s) => {
return `- 🍓 \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝙰𝙻𝙸𝙼𝙴𝙽𝚃𝙰𝙳𝙾\`

> *${c.nome} usado. Fome: ${p.fome}% • XP: ${p.xp} • saldo: ${s}.*`
}

exports.pokemonApelidoUso = p => {
return `- ⚡ \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> *${p}apelidopokemon nome*`
}

exports.pokemonApelido = n => {
return `- ✅ \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> *Seu Pokémon agora se chama ${n}.*`
}

exports.pokemonNaoEvolui = () => {
return `- ⚠️ \`𝙴𝚅𝙾𝙻𝚄𝙲̧𝙰̃𝙾\`

> *Este Pokémon não possui evolução disponível.*`
}

exports.pokemonNivelEvoluir = n => {
return `- 🔒 \`𝙴𝚅𝙾𝙻𝚄𝙲̧𝙰̃𝙾\`

> *Seu Pokémon precisa estar no nível ${n}.*`
}

exports.pokemonEvoluiu = (a, b) => {
return `- ✨ \`𝙴𝚅𝙾𝙻𝚄𝙲̧𝙰̃𝙾\`

> *${a} evoluiu para ${b}!*`
}

exports.pokemonMissao = (p, g, x, s) => {
return `- 🗺️ \`𝙼𝙸𝚂𝚂𝙰̃𝙾 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

> *${p.apelido || p.tipo} voltou com +${g} N-Coins e +${x} XP. Saldo: ${s}.*`
}

exports.pokemonVendido = (v, s) => {
return `- 💸 \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝚅𝙴𝙽𝙳𝙸𝙳𝙾\`

> *Você recebeu ${v} N-Coins. Saldo: ${s}.*`
}

exports.pokemonRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

${l.length ? l.map((x, i) => `『 ${i + 1}° 』— @${x.jid.split('@')[0]} • ${x.pokemon.apelido || x.pokemon.tipo} • ${x.pokemon.xp || 0} XP`).join('\n') : '> *sem Pokémon ainda.*'}`
}

exports.cidadeRegistrada = n => {
return `- 🌆 \`𝙲𝙸𝙳𝙰𝙳𝙴\`

> *Cidadão ${n} registrado com sucesso.*`
}

exports.cidadePerfil = (j, u) => {
return `- 🌆 \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙲𝙸𝙳𝙰𝙳𝙴\`

『 👤 』— @${j.split('@')[0]}
『 🪪 』— ${u.cidade?.nome || 'Sem nome'}
『 💼 』— ${u.cidade?.cargo || 'Desempregado'}
『 💰 \`𝙲𝙰𝚁𝚃𝙴𝙸𝚁𝙰\` 』— ${u.coins || 0}
『 🏦 \`𝙱𝙰𝙽𝙲𝙾\` 』— ${u.cidade?.saldoBanco || 0}
『 ⚡ 』— ${u.cidade?.energia || 100}
『 🍔 』— ${u.cidade?.fome || 100}
『 ❤️ 』— ${u.cidade?.saude || 100}`
}

exports.cidadeTrabalho = (g, s) => {
return `- 💼 \`𝚃𝚁𝙰𝙱𝙰𝙻𝙷𝙾\`

> *Você trabalhou e recebeu ${g} N-Coins. Saldo: ${s}.*`
}

exports.cidadeBancoUso = p => {
return `- 🏦 \`𝙱𝙰𝙽𝙲𝙾\`

> *${p}depositar 100 | ${p}sacar 100*`
}

exports.cidadeBanco = (b, c) => {
return `- 🏦 \`𝙱𝙰𝙽𝙲𝙾\`

『 🏛️ \`𝚂𝙰𝙻𝙳𝙾 𝙱𝙰𝙽𝙲𝙾\` 』— ${b}
『 💰 \`𝙲𝙰𝚁𝚃𝙴𝙸𝚁𝙰\` 』— ${c}`
}

exports.tempoRelacao = ms => {
const s = Math.max(0, Math.floor(Number(ms || 0) / 1000))
const d = Math.floor(s / 86400)
const h = Math.floor(s % 86400 / 3600)
const m = Math.floor(s % 3600 / 60)
return `${d}d ${h}h ${m}m`
}

exports.namoroBot = () => {
return `- 🤖 \`𝙽𝙰𝙼𝙾𝚁𝙾\`

> *ᴇᴜ sᴏᴜ ᴏ ʙᴏᴛ 😅 ᴘᴇᴄ̧ᴀ ᴀʟɢᴜᴇ́ᴍ ʀᴇᴀʟ ᴇᴍ ɴᴀᴍᴏʀᴏ.*`
}

exports.namoroPrivadoTerminou = j => {
return `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾 𝙴𝙽𝙲𝙴𝚁𝚁𝙰𝙳𝙾\`

> *@${j.split('@')[0]} terminou o relacionamento.*`
}

exports.minhaDupla = (a, b, t) => {
return `- ❤️ \`𝙼𝙸𝙽𝙷𝙰 𝙳𝚄𝙿𝙻𝙰\`

『 💙 』— @${a.split('@')[0]} + @${b.split('@')[0]}
『 ⏳ \`𝚃𝙴𝙼𝙿𝙾\` 』— ${t}`
}

exports.casamentoUso = p => {
return `- 💍 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> *${p}casar @usuario*`
}

exports.casamentoMesmo = () => {
return `- ❌ \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> *ᴇssᴇ ᴘᴇᴅɪᴅᴏ ɴᴀ̃ᴏ ᴇ́ ᴘᴏssɪ́ᴠᴇʟ.*`
}

exports.casamentoOcupado = () => {
return `- 💍 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> *ᴜᴍ ᴅᴏs ᴜsᴜᴀ́ʀɪᴏs ᴊᴀ́ ᴇsᴛᴀ́ ᴄᴀsᴀᴅᴏ.*`
}

exports.casamentoPendente = () => {
return `- 💌 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴\`

> *ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍ ᴘᴇᴅɪᴅᴏ ᴘᴇɴᴅᴇɴᴛᴇ.*`
}

exports.casamentoPedido = (a, b, p) => {
return `- 💍 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙳𝙴 𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

『 👤 \`𝙳𝙴\` 』— @${a.split('@')[0]}
『 💖 \`𝙿𝙰𝚁𝙰\` 』— @${b.split('@')[0]}

> *Responda S/SIM para aceitar ou N/NÃO para recusar.*`
}

exports.casamentoSemPedido = () => {
return `- ⚠️ \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> *ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴜᴍ ᴘᴇᴅɪᴅᴏ ᴘᴇɴᴅᴇɴᴛᴇ.*`
}

exports.casamentoAceito = (a, b) => {
return `- 💒 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾 𝙰𝙲𝙴𝙸𝚃𝙾\`

> *@${a.split('@')[0]} e @${b.split('@')[0]} agora estão casados! 💍*`
}

exports.casamentoRecusado = (a, b) => {
return `- 💔 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾\`

> *@${b.split('@')[0]} recusou o pedido de @${a.split('@')[0]}.*`
}

exports.casamentoCancelado = () => {
return `- ✅ \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾\`

> *pedido de casamento cancelado.*`
}

exports.casamentoSolteiro = () => {
return `- 💍 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> *ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴄᴀsᴀᴅᴏ.*`
}

exports.casamentoDivorcio = (a, b) => {
return `- 💔 \`𝙳𝙸𝚅𝙾́𝚁𝙲𝙸𝙾\`

> *@${a.split('@')[0]} e @${b.split('@')[0]} não estão mais casados.*`
}

exports.casamentoPerfil = (a, b, t) => {
return `- 💒 \`𝙼𝙴𝚄 𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

『 💍 』— @${a.split('@')[0]} + @${b.split('@')[0]}
『 ⏳ 』— ${t}`
}
// ===== NAMORO COM BOTÕES / RESPOSTA =====
exports.namoroPedido = (de, para, prefix, botoesAtivos = true) => {
return `- 💌 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙳𝙴 𝙽𝙰𝙼𝙾𝚁𝙾\`

『 💞 \`𝙿𝙰𝚁𝙰\` 』— @${String(para).split('@')[0]}
> *❤️ | ᴜᴍ ᴄᴏʀᴀᴄ̧ᴀ̃ᴏ ᴇsᴛᴀ́ ᴘᴇɴsᴀɴᴅᴏ ᴇᴍ ᴠᴏᴄᴇ̂…* ↴

『 💘 \`𝙳𝙴\` 』— @${String(de).split('@')[0]}

${botoesAtivos
      ? '> *ᴇsᴄᴏʟʜᴀ ᴀʙᴀɪxᴏ sᴇ ᴅᴇsᴇᴊᴀ ᴀᴄᴇɪᴛᴀʀ ᴏᴜ ʀᴇᴄᴜsᴀʀ ᴇsᴛᴇ ᴘᴇᴅɪᴅᴏ.*'
      : '*_ʀᴇsᴘᴏɴᴅᴀ 『 s / sɪᴍ 』 ᴘᴀʀᴀ ᴀᴄᴇɪᴛᴀʀ ᴏᴜ 『 n / ɴᴀ̃ᴏ 』 ᴘᴀʀᴀ ʀᴇᴄᴜsᴀʀ._*'}

『 🕊️ \`𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝚁\` 』— @${String(de).split('@')[0]} pode usar ${prefix}cancelar`
}
// ===== GRUPO ABRIR / FECHAR AGORA =====
exports.grupoUso = prefix => {
return `- 👥 \`𝙶𝚁𝚄𝙿𝙾\`

『 🔓 \`𝙰𝙱𝚁𝙸𝚁\` 』— ${prefix}grupo a
『 🔒 \`𝙵𝙴𝙲𝙷𝙰𝚁\` 』— ${prefix}grupo f

> *ᴜsᴇ 『 a 』 ᴘᴀʀᴀ ᴀʙʀɪʀ ᴇ 『 f 』 ᴘᴀʀᴀ ғᴇᴄʜᴀʀ ᴏ ɢʀᴜᴘᴏ.*`
}

exports.grupoAlterado = aberto => {
return `- ${aberto ? '🔓' : '🔒'} \`𝙶𝚁𝚄𝙿𝙾 ${aberto ? '𝙰𝙱𝙴𝚁𝚃𝙾' : '𝙵𝙴𝙲𝙷𝙰𝙳𝙾'}\`

『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${aberto ? 'Todos os membros podem enviar mensagens.' : 'Somente administradores podem enviar mensagens.'}`
}
// ===== FREE FIRE / SALAS =====
exports.ffSalaUso = prefix => {
return `- 🎮 \`𝙲𝚁𝙸𝙰𝚁 𝚂𝙰𝙻𝙰 𝙵𝙵\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}criarsala NOME|SENHA|JOGADORES|MODO|REGIÃO
『 💡 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— ${prefix}criarsala TESTE|1234|12|1|BR`
}

exports.ffSalaCriada = ({ NomeDoBot, pushname, sala, roomName, roomPassword, maxPlayers, mode, region, data }) => {
return `- 🎮 \`𝚂𝙰𝙻𝙰 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴 𝙲𝚁𝙸𝙰𝙳𝙰\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🏷️ \`𝙽𝙾𝙼𝙴\` 』— ${sala?.roomName || roomName}
『 🆔 \`𝚁𝙾𝙾𝙼 𝙸𝙳\` 』— ${sala?.roomId || 'Indisponível'}
『 🔐 \`𝚂𝙴𝚂𝚂𝙸𝙾𝙽 𝙸𝙳\` 』— ${sala?.sessionId || 'Indisponível'}
『 🔑 \`𝚂𝙴𝙽𝙷𝙰\` 』— ${sala?.password || roomPassword}
『 🎯 \`𝙼𝙾𝙳𝙾\` 』— ${sala?.modeName || mode}
『 👥 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁𝙴𝚂\` 』— ${maxPlayers}
『 🌎 \`𝚁𝙴𝙶𝙸𝙰̃𝙾\` 』— ${region}

『 📊 \`𝚁𝙴𝚂𝚃𝙰𝙽𝚃𝙴𝚂\` 』— ${data?.limite?.restantes ?? 'N/A'}
『 📈 \`𝚄𝚂𝙰𝙳𝙰𝚂\` 』— ${data?.limite?.usadas ?? 'N/A'}

> *✅ Sala criada com sucesso!*`
}

exports.ffVerSalaUso = prefix => {
return `- 🔎 \`𝚅𝙴𝚁 𝚂𝙰𝙻𝙰 𝙵𝙵\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}versala SESSION_ID`
}

exports.ffSalaInfo = ({ NomeDoBot, pushname, sala, tempo }) => {
return `- 🔎 \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙰 𝚂𝙰𝙻𝙰\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🆔 \`𝚁𝙾𝙾𝙼 𝙸𝙳\` 』— ${sala?.roomId || 'Indisponível'}
『 📡 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${sala?.status || 'Indisponível'}
『 ⏱️ \`𝙸𝙽𝙸́𝙲𝙸𝙾\` 』— ${tempo}
『 🚀 \`𝙰𝚄𝚃𝙾 𝚂𝚃𝙰𝚁𝚃\` 』— ${sala?.autoStart ? 'Ativado' : 'Desativado'}

> *✅ Sala encontrada com sucesso!*`
}

exports.ffJogadoresUso = prefix => {
return `- 👥 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁𝙴𝚂 𝙳𝙰 𝚂𝙰𝙻𝙰\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}jogadoressala SESSION_ID`
}

exports.ffJogadores = ({ NomeDoBot, pushname, players, total }) => {
return `- 👥 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁𝙴𝚂 𝙳𝙰 𝚂𝙰𝙻𝙰\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 📊 \`𝚃𝙾𝚃𝙰𝙻\` 』— ${total ?? players.length}

${players.length ? players.map((p, i) => `『 ${i + 1}° 』— ${p.nickname || 'Sem nome'}
> 🆔 ${p.uid || 'N/A'} • 🏳️ Time ${p.team || 'N/A'}`).join('\n\n') : '> *Nenhum jogador encontrado.*'}`
}

exports.ffExpulsarUso = prefix => {
return `- 🚫 \`𝙴𝚇𝙿𝚄𝙻𝚂𝙰𝚁 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}expulsarsala SESSION_ID|UID`
}

exports.ffExpulso = ({ NomeDoBot, pushname, targetUid, message }) => {
return `- 🚫 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁 𝙴𝚇𝙿𝚄𝙻𝚂𝙾\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🆔 \`𝚄𝙸𝙳\` 』— ${targetUid}

> *✅ ${message || 'Kick enviado com sucesso!'}*`
}

exports.ffIniciarUso = prefix => {
return `- 🚀 \`𝙸𝙽𝙸𝙲𝙸𝙰𝚁 𝚂𝙰𝙻𝙰\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}iniciarsala SESSION_ID`
}

exports.ffSalaIniciada = ({ NomeDoBot, pushname, sessionId, message }) => {
return `- 🚀 \`𝚂𝙰𝙻𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙰\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🔐 \`𝚂𝙴𝚂𝚂𝙸𝙾𝙽 𝙸𝙳\` 』— ${sessionId}

> *✅ ${message || 'Sala iniciada com sucesso!'}*`
}

exports.ffPararUso = prefix => {
return `- ⛔ \`𝙿𝙰𝚁𝙰𝚁 𝚂𝙰𝙻𝙰\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}pararsala SESSION_ID`
}

exports.ffSalaParada = ({ NomeDoBot, pushname, sessionId, message }) => {
return `- ⛔ \`𝚂𝙰𝙻𝙰 𝙿𝙰𝚁𝙰𝙳𝙰\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🔐 \`𝚂𝙴𝚂𝚂𝙸𝙾𝙽 𝙸𝙳\` 』— ${sessionId}

> *✅ ${message || 'Sala parada com sucesso!'}*`
}

exports.ffStatusApi = ({ NomeDoBot, pushname, data }) => {
return `- 📊 \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙰 𝙰𝙿𝙸 𝙵𝙵\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🛠️ \`𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\` 』— ${data?.service?.maintenance_mode ? 'Ativada' : 'Desativada'}
『 🎮 \`𝚂𝙰𝙻𝙰𝚂 𝚁𝙴𝚂𝚃𝙰𝙽𝚃𝙴𝚂\` 』— ${data?.key?.rooms_remaining ?? 'N/A'}
『 ♾️ \`𝙻𝙸𝙵𝙴𝚃𝙸𝙼𝙴\` 』— ${data?.key?.lifetime ? 'Sim' : 'Não'}

> *✅ Serviço online!*`
}
// ===== FREE FIRE / LIKES =====
exports.ffLikesUso = prefix => {
return `- ❤️ \`𝙻𝙸𝙺𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}likes UID
『 💡 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— ${prefix}likes 32793023`
}

exports.ffLikesSucesso = ({ NomeDoBot, pushname, player_id, data }) => {
const c = data?.data?.conta
const l = data?.data?.likes
return `- ❤️ \`𝙻𝙸𝙺𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🏷️ \`𝙽𝙸𝙲𝙺\` 』— ${c?.nickname || 'N/A'}
『 🆔 \`𝚄𝙸𝙳\` 』— ${c?.uid || player_id}
『 🌎 \`𝚁𝙴𝙶𝙸𝙰̃𝙾\` 』— ${c?.region || 'N/A'}
『 📊 \`𝙻𝙴𝚅𝙴𝙻\` 』— ${c?.level || 'N/A'}

『 ❤️ \`𝙰𝙽𝚃𝙴𝚂\` 』— ${l?.antes || 0}
『 ➕ \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾𝚂\` 』— ${l?.adicionados || 0}
『 📈 \`𝙳𝙴𝙿𝙾𝙸𝚂\` 』— ${l?.depois || 0}

> *✅ ${data?.message || 'Likes enviados com sucesso!'}*`
}

exports.ffCotaLikes = ({ NomeDoBot, pushname, data, reset, expira }) => {
return `- 📊 \`𝙲𝙾𝚃𝙰 𝙳𝙴 𝙻𝙸𝙺𝙴𝚂 𝙵𝙵\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 ❤️ \`𝙳𝙸𝙰́𝚁𝙸𝙾\` 』— ${data?.daily_limit ?? 'N/A'}
『 📤 \`𝚄𝚂𝙰𝙳𝙾𝚂 𝙷𝙾𝙹𝙴\` 』— ${data?.used_today ?? 'N/A'}
『 📥 \`𝚁𝙴𝚂𝚃𝙰𝙽𝚃𝙴𝚂\` 』— ${data?.remaining_today ?? 'N/A'}
『 ⏱️ \`𝚁𝙴𝚂𝙴𝚃\` 』— ${reset}
『 ⌛ \`𝙲𝙾𝙾𝙻𝙳𝙾𝚆𝙽\` 』— ${data?.cooldown_hours || 0} horas
『 ❤️ \`𝙼𝙰́𝚇𝙸𝙼𝙾\` 』— ${data?.max_likes_per_send || 'N/A'}
『 🔑 \`𝙴𝚇𝙿𝙸𝚁𝙰\` 』— ${expira}`
}

exports.ffPlayerUso = prefix => {
return `- 🔎 \`𝙲𝙾𝙽𝚂𝚄𝙻𝚃𝙰𝚁 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}player UID`
}

exports.ffPlayer = ({ NomeDoBot, pushname, uid, conta }) => {
return `- 🔎 \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙾 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🏷️ \`𝙽𝙾𝙼𝙴\` 』— ${conta?.nome_conta || 'N/A'}
『 🆔 \`𝚄𝙸𝙳\` 』— ${conta?.id_conta || uid}
『 🌎 \`𝚁𝙴𝙶𝙸𝙰̃𝙾\` 』— ${conta?.region || 'N/A'}
『 📊 \`𝙻𝙴𝚅𝙴𝙻\` 』— ${conta?.level || 'N/A'}
『 ✨ \`𝚇𝙿\` 』— ${conta?.experiencia || 'N/A'}
『 ❤️ \`𝙻𝙸𝙺𝙴𝚂\` 』— ${conta?.likes || 0}
『 🛡️ \`𝙲𝚁𝙴𝙳𝙸𝙱𝙸𝙻𝙸𝙳𝙰𝙳𝙴\` 』— ${conta?.credibilidade || 'N/A'}

『 🏆 \`𝚁𝙰𝙽𝙺 𝙱𝚁\` 』— ${conta?.rank_br?.rank || 'N/A'} • ${conta?.rank_br?.pontos || 'N/A'} pontos
『 ⚔️ \`𝚁𝙰𝙽𝙺 𝙲𝚂\` 』— ${conta?.rank_cs?.rank || 'N/A'} • ${conta?.rank_cs?.pontos || 'N/A'} pontos`
}

exports.ffStatusLikesUso = prefix => {
return `- 📦 \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙾 𝙿𝙴𝙳𝙸𝙳𝙾\`

『 📋 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— ${prefix}statuslikes ORDER_ID`
}

exports.ffStatusLikes = ({ NomeDoBot, pushname, orderId, pedido }) => {
return `- 📦 \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙾 𝙿𝙴𝙳𝙸𝙳𝙾 𝙻𝙸𝙺𝙴𝚂\`

『 🤖 \`𝙱𝙾𝚃\` 』— ${NomeDoBot}
『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— ${pushname}
『 🆔 \`𝙿𝙴𝙳𝙸𝙳𝙾\` 』— ${pedido?.orderId || orderId}
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${pedido?.status || 'N/A'}
『 🎮 \`𝚄𝙸𝙳\` 』— ${pedido?.playerId || 'N/A'}
『 🏷️ \`𝙽𝙸𝙲𝙺\` 』— ${pedido?.conta?.nickname || 'N/A'}
『 ❤️ \`𝙰𝙽𝚃𝙴𝚂\` 』— ${pedido?.likes?.antes || 0}
『 ➕ \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾𝚂\` 』— ${pedido?.likes?.adicionados || 0}
『 📈 \`𝙳𝙴𝙿𝙾𝙸𝚂\` 』— ${pedido?.likes?.depois || 0}`
}

exports.ffListaLikes = data => {
return `- 📦 \`𝙿𝙴𝙳𝙸𝙳𝙾𝚂 𝙳𝙴 𝙻𝙸𝙺𝙴𝚂 𝙵𝙵\`

『 📊 \`𝚃𝙾𝚃𝙰𝙻\` 』— ${data?.total || 0}
『 📄 \`𝙼𝙾𝚂𝚃𝚁𝙰𝙽𝙳𝙾\` 』— ${data?.orders?.length || 0}

${(data?.orders || []).map((p, i) => `『 ${i + 1}° 』— ${p.orderId || p.order_id || 'N/A'}
> 🎮 ${p.playerId || 'N/A'} • 📌 ${p.status || 'N/A'}
> ❤️ ${p.likes?.antes || 0} → +${p.likes?.adicionados || 0} → ${p.likes?.depois || 0}`).join('\n\n') || '> *Nenhum pedido encontrado.*'}`
}

exports.ffErro = msg => {
return `- ❌ \`𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

『 ⚠️ \`𝙴𝚁𝚁𝙾\` 』— ${msg || 'Não foi possível concluir a solicitação.'}`
}

exports.botaoVerSala = () => {
return `🔎﹚𝐕𝐄𝐑 𝐒𝐀𝐋𝐀﹙🔎`
}

exports.botaoJogadoresSala = () => {
return `👥﹚𝐉𝐎𝐆𝐀𝐃𝐎𝐑𝐄𝐒﹙👥`
}

exports.botaoIniciarSala = () => {
return `🚀﹚𝐈𝐍𝐈𝐂𝐈𝐀𝐑﹙🚀`
}

exports.botaoPararSala = () => {
return `⛔﹚𝐏𝐀𝐑𝐀𝐑﹙⛔`
}
// ===== N-COINS: CARDS E BÔNUS DIÁRIO =====
exports.coinsBonusDiario = (jid, saldo, prefix) => {
return `- *💫 | 𝐁𝐎̂𝐍𝐔𝐒 𝐃𝐈𝐀́𝐑𝐈𝐎*

- *👤 | 𝚄𝚂𝚄Á𝚁𝙸𝙾* → *@${String(jid).split('@')[0]}*
- *🎁 | 𝚁𝙴𝙲𝙾𝙼𝙿𝙴𝙽𝚂𝙰* → *+50 N-Coins*
- *⚙️ | 𝚃𝙸𝙿𝙾* → 𝙿𝚁𝙸𝙼𝙴𝙸𝚁𝙰 𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙳𝙾 𝙳𝙸𝙰
- *💰 | 𝚂𝙰𝙻𝙳𝙾* → *${Number(saldo || 0).toLocaleString('pt-BR')} N-Coins*
- *✨ | 𝚂𝚃𝙰𝚃𝚄𝚂* → 𝙱𝙾̂𝙽𝚄𝚂 𝚁𝙴𝚂𝙶𝙰𝚃𝙰𝙳𝙾

> Use *${prefix}coins* para ver seu saldo.`
}

exports.coinsCard = (jid, saldo, banco, minerar, cassino, prefix) => {
return `- *🏦 | 𝐁𝐀𝐍𝐂𝐎 𝐃𝐄 𝐍-𝐂𝐎𝐈𝐍𝐒*

- *👤 | 𝚄𝚂𝚄Á𝚁𝙸𝙾* → *@${String(jid).split('@')[0]}*
- *💰 | 𝙲𝙰𝚁𝚃𝙴𝙸𝚁𝙰* → *${Number(saldo || 0).toLocaleString('pt-BR')} N-Coins*
- *🏛️ | 𝙱𝙰𝙽𝙲𝙾* → *${Number(banco || 0).toLocaleString('pt-BR')} N-Coins*
- *⛏️ | 𝙼𝙸𝙽𝙴𝚁𝙰𝚁* → *${Number(minerar || 0)} tentativas*
- *🎰 | 𝙲𝙰𝚂𝚂𝙸𝙽𝙾* → *${Number(cassino || 0)} tentativas*

> Use *${prefix}menucoins* para ver o sistema.`
}

// ===== MENSAGENS CENTRALIZADAS — API / ATIVAÇÕES / TRANSCRIÇÃO / IDADE =====
exports.erroApi = (site = 'https://tokito-apis.com.br') => {
let link = 'https://tokito-apis.com.br'

try {
link = new URL(String(site || link)).origin
}
catch {
}

return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙰 𝙰𝙿𝙸\`

『 🔑 \`𝙲𝙷𝙰𝚅𝙴\` 』— ᴠᴇʀɪғɪǫᴜᴇ sᴇ sᴜᴀ ᴋᴇʏ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀ.
『 👤 \`𝙲𝙾𝙽𝚃𝙰\` 』— ᴄᴏɴғɪʀᴀ sᴇ sᴜᴀ ᴄᴏɴᴛᴀ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀ ᴇ sᴇᴍ ʙʟᴏǫᴜᴇɪᴏs.
『 🌐 \`𝚂𝙸𝚃𝙴\` 』— ${link}

> *ᴀᴄᴇssᴇ ᴏ sɪᴛᴇ ᴀᴄɪᴍᴀ ᴇ ᴠᴇʀɪғɪǫᴜᴇ sᴜᴀ ᴄᴏɴᴛᴀ ᴇ ᴀ sᴜᴀ ᴋᴇʏ. sᴇ ᴇsᴛɪᴠᴇʀ ᴛᴜᴅᴏ ɴᴏʀᴍᴀʟ, ᴛᴇɴᴛᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ɴᴏᴠᴀᴍᴇɴᴛᴇ.*`
}

exports.ativarPainel = ({ itens = [], ativo = () => false } = {}) => {
const secoes = [
['✨ → 𝐌𝐈𝐃𝐈𝐀𝐒', 0, 5],
['🔗 → 𝐋𝐈𝐍𝐊𝐒', 6, 9],
['👥 → 𝐒𝐄𝐆𝐔𝐑𝐀𝐍𝐂𝐀', 10, 16],
['⚡ → 𝐀𝐔𝐓𝐎𝐌𝐀𝐂𝐀𝐎', 17, itens.length - 1]
]

const item = (i) => {
if (!itens[i]) return ''
const [chave, nome] = itens[i], status = ativo(chave) ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'
return `[ ${i + 1} ] ▸ ${nome} • ${status}`
}

const painel = secoes.map(([titulo, inicio, fim]) => {
const lista = []
for (let i = inicio; i <= fim && i < itens.length; i++) {
const linha = item(i)
if (linha) lista.push(linha)
}
return lista.length ? `${titulo}\n${lista.join('\n')}` : ''
}).filter(Boolean).join('\n─────────────────────\n')

return `\`\`\`⚙️ 𝙰𝚃𝙸𝚅𝙰𝚁 𝚂𝙸𝚂𝚃𝙴𝙼𝙰𝚂\`\`\`
😻 *ᴇsᴄᴏʟʜᴀ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴅᴏ sɪsᴛᴇᴍᴀ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴀʟᴛᴇʀᴀʀ.*

> 🟢 ᴀᴛɪᴠᴀᴅᴏ • 🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ
─────────────────────
${painel}
─────────────────────
[ 0 ] ▸ ❌ ᴄᴀɴᴄᴇʟᴀʀ

> *ᴅɪɢɪᴛᴇ ᴀᴘᴇɴᴀs ᴏ ɴᴜ́ᴍᴇʀᴏ • ᴜsᴇ 0 ᴘᴀʀᴀ ᴄᴀɴᴄᴇʟᴀʀ.*`
}

exports.ativarAlterado = (nome, ativo, painel) => {
const emoji = ativo ? '✅' : '❌', status = ativo ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'

return `\`\`\`${emoji} 𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾\`\`\`
『 ⚙️ \`𝚂𝙸𝚂𝚃𝙴𝙼𝙰\` 』— ${nome} • ${status}

${painel}`
}

exports.ativarCancelado = () => {
return `\`\`\`❌ 𝙰𝚃𝙸𝚅𝙰𝙲̧𝙰̃𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰\`\`\`
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ᴘᴀɪɴᴇʟ ᴇɴᴄᴇʀʀᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ.`
}

exports.idadeUso = prefix => {
return `- 🎂 \`𝙸𝙳𝙰𝙳𝙴 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

『 📅 \`𝙵𝙾𝚁𝙼𝙰𝚃𝙾\` 』— DD/MM/AAAA
『 🧩 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— ${prefix}idade 23/12/2007`
}

exports.idadeInvalida = () => {
return `- ❌ \`𝙳𝙰𝚃𝙰 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\`

『 📅 \`𝙽𝙰𝚂𝙲𝙸𝙼𝙴𝙽𝚃𝙾\` 』— ɪɴғᴏʀᴍᴇ ᴜᴍᴀ ᴅᴀᴛᴀ ᴅᴇ ɴᴀsᴄɪᴍᴇɴᴛᴏ ᴠᴀ́ʟɪᴅᴀ.`
}

exports.idadeResultado = ({
nascimento,
anos,
meses,
dias,
diasVividos,
horasVividas,
minutosVividos,
faltam
}) => {
return `- 🎂 \`𝙸𝙳𝙰𝙳𝙴 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

『 📅 \`𝙽𝙰𝚂𝙲𝙸𝙼𝙴𝙽𝚃𝙾\` 』— ${nascimento}
『 🎈 \`𝙸𝙳𝙰𝙳𝙴\` 』— ${anos} anos, ${meses} meses e ${dias} dias
『 🗓️ \`𝙳𝙸𝙰𝚂 𝚅𝙸𝚅𝙸𝙳𝙾𝚂\` 』— ${Number(diasVividos || 0).toLocaleString('pt-BR')}
『 ⏰ \`𝙷𝙾𝚁𝙰𝚂 𝚅𝙸𝚅𝙸𝙳𝙰𝚂\` 』— ${Number(horasVividas || 0).toLocaleString('pt-BR')}
『 ⏱️ \`𝙼𝙸𝙽𝚄𝚃𝙾𝚂 𝚅𝙸𝚅𝙸𝙳𝙾𝚂\` 』— ${Number(minutosVividos || 0).toLocaleString('pt-BR')}
『 🎉 \`𝙿𝚁𝙾́𝚇𝙸𝙼𝙾 𝙰𝙽𝙸𝚅𝙴𝚁𝚂𝙰́𝚁𝙸𝙾\` 』— ${faltam <= 0 ? 'hoje' : `em ${faltam} dia(s)`}`
}

exports.totextSemAudio = prefix => {
return `- 🎙️ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾\`

『 🎧 \`𝙰́𝚄𝙳𝙸𝙾\` 』— ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍ ᴀ́ᴜᴅɪᴏ ᴏᴜ ᴘᴛᴛ.
『 🧩 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾\` 』— ${prefix}totext`
}

exports.totextResultado = ({ texto, idioma, duracao, confidence } = {}) => {
const detalhes = [
idioma ? `『 🌐 \`𝙸𝙳𝙸𝙾𝙼𝙰\` 』— ${idioma}` : '',
duracao ? `『 ⏱️ \`𝙳𝚄𝚁𝙰𝙲̧𝙰̃𝙾\` 』— ${duracao}` : '',
confidence != null ? `『 📊 \`𝙲𝙾𝙽𝙵𝙸𝙰𝙽𝙲̧𝙰\` 』— ${confidence}` : ''
].filter(Boolean).join('\n')

return `- 🎙️ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾 𝙳𝙾 𝙰́𝚄𝙳𝙸𝙾\`

『 📝 \`𝚃𝙴𝚇𝚃𝙾\` 』— ${texto || 'Nenhum texto identificado.'}${detalhes ? `\n\n${detalhes}` : ''}`
}

exports.autortextResultado = (jid, resultado = {}) => {
const numero = String(jid || '').split('@')[0]

return `- 🎙️ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

『 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\` 』— @${numero}
『 📝 \`𝚃𝙴𝚇𝚃𝙾\` 』— ${resultado.texto || 'Nenhum texto identificado.'}`
}

exports.transcricaoFalhou = () => {
return `- ❌ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾 𝙵𝙰𝙻𝙷𝙾𝚄\`

『 🎧 \`𝙰́𝚄𝙳𝙸𝙾\` 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴇssᴇ ᴀ́ᴜᴅɪᴏ ᴀɢᴏʀᴀ.

> *ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴄᴏᴍ ᴏᴜᴛʀᴏ ᴀ́ᴜᴅɪᴏ ᴏᴜ ᴘᴛᴛ.*`
}
exports.updateNotPublished = () => {
return `-  \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙰 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 🧊 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Nenhuma nova versão publicada
『 🤖 \`𝙱𝙾𝚃\` 』— Tokito Bot V10
『 ✅ \`𝚂𝙸𝚃𝚄𝙰𝙲̧𝙰̃𝙾\` 』— Você já pode continuar usando a versão atual normalmente`
}

exports.updateCheckError = () => {
return `-  \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙰 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 ⚠️ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Verificação indisponível
『 🌐 \`𝚂𝙴𝚁𝚅𝙸𝙳𝙾𝚁\` 』— Não foi possível consultar novas atualizações
『 🤖 \`𝙱𝙾𝚃\` 』— Continuará funcionando normalmente
『 🔄 \`𝚃𝙴𝙽𝚃𝙴 𝙽𝙾𝚅𝙰𝙼𝙴𝙽𝚃𝙴\` 』— Aguarde alguns instantes`
}

exports.updateEmptyFiles = versao => {
return `-  \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙰 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Atualização incompleta
『 🆕 \`𝚅𝙴𝚁𝚂𝙰̃𝙾\` 』— ${versao || '—'}
『 📦 \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾𝚂\` 』— Nenhum arquivo disponível para instalar
『 🛡️ \`𝙿𝚁𝙾𝚃𝙴𝙲̧𝙰̃𝙾\` 』— A versão atual do bot não foi alterada`
}

exports.updateInfo = ({
instalada,
disponivel,
canal,
disponivelAgora,
changelog,
arquivos,
removidos,
prefix
}) => {
const status = disponivelAgora
? 'Atualização disponível'
: 'Bot atualizado'

const listaArquivos = Array.isArray(arquivos)
? arquivos.filter(Boolean)
: []

const listaRemovidos = Array.isArray(removidos)
? removidos.filter(Boolean)
: []

const totalArquivos = listaArquivos.length + listaRemovidos.length

const alteracoes = Array.isArray(changelog) && changelog.length
? changelog.map(item => `╰➤ ${item}`).join('\n')
: '╰➤ Nenhuma nova alteração informada'

const arquivosTexto = totalArquivos
? `

『 📦 \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾𝚂 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾𝚂\` 』— ${totalArquivos}

${listaArquivos.slice(0, 8).map(item => {
const caminho = typeof item === 'object'
? item.path
: item

return `╰➤ ${String(caminho || '').split('/').pop()}`
}).join('\n')}${listaRemovidos.length
? `\n╰➤ ${listaRemovidos.length} arquivo(s) removido(s)`
: ''}`
: ''

const instalar = disponivelAgora
? `

『 ⚙️ \`𝙸𝙽𝚂𝚃𝙰𝙻𝙰𝚁\` 』— ${prefix}update start`
: ''

return `-  \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙰 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 🤖 \`𝙱𝙾𝚃\` 』— Tokito Bot V10
『 🧊 \`𝚅𝙴𝚁𝚂𝙰̃𝙾 𝙰𝚃𝚄𝙰𝙻\` 』— ${instalada}
『 🆕 \`𝙽𝙾𝚅𝙰 𝚅𝙴𝚁𝚂𝙰̃𝙾\` 』— ${disponivel}
『 📡 \`𝙲𝙰𝙽𝙰𝙻\` 』— ${canal}
『 📊 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${status}
『 📦 \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾𝚂\` 』— ${totalArquivos}

『 📝 \`𝙰𝙻𝚃𝙴𝚁𝙰𝙲̧𝙾̃𝙴𝚂\` 』
${alteracoes}${arquivosTexto}${instalar}`
}

exports.updatePreparing = () => {
return `-  \`𝙿𝚁𝙴𝙿𝙰𝚁𝙰𝙽𝙳𝙾 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 ⏳ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Preparando instalação
『 💾 \`𝙱𝙰𝙲𝙺𝚄𝙿\` 』— Criando cópia da versão atual
『 📦 \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾𝚂\` 』— Preparando novos arquivos
『 🛡️ \`𝙿𝚁𝙾𝚃𝙴𝙲̧𝙰̃𝙾\` 』— Seus dados e sessão serão preservados
『 ⚠️ \`𝙰𝚅𝙸𝚂𝙾\` 』— Não desligue o bot durante o processo`
}

exports.updateAlreadyLatest = versao => {
return `-  \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙰 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 🤖 \`𝙱𝙾𝚃\` 』— Tokito Bot V10
『 🧊 \`𝚅𝙴𝚁𝚂𝙰̃𝙾\` 』— ${versao}
『 ✅ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Você já está usando a versão mais recente
『 📡 \`𝙲𝙰𝙽𝙰𝙻\` 』— Stable`
}

exports.updateSuccess = (
anterior,
nova,
arquivos = 0,
removidos = 0
) => {
return `-  \`𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾 𝙲𝙾𝙽𝙲𝙻𝚄𝙸́𝙳𝙰\`

『 🤖 \`𝙱𝙾𝚃\` 』— Tokito Bot V10
『 📥 \`𝚅𝙴𝚁𝚂𝙰̃𝙾 𝙰𝙽𝚃𝙴𝚁𝙸𝙾𝚁\` 』— ${anterior}
『 🆕 \`𝙽𝙾𝚅𝙰 𝚅𝙴𝚁𝚂𝙰̃𝙾\` 』— ${nova}
『 📦 \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾𝚂 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙾𝚂\` 』— ${Number(arquivos || 0)}
『 🗑️ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾𝚂 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾𝚂\` 』— ${Number(removidos || 0)}
『 ✅ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Instalação concluída com sucesso
『 🔄 \`𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾\` 』— O bot será reiniciado agora`
}

exports.updateError = () => {
return `-  \`𝙵𝙰𝙻𝙷𝙰 𝙽𝙰 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Não foi possível concluir a atualização
『 🛡️ \`𝙿𝚁𝙾𝚃𝙴𝙲̧𝙰̃𝙾\` 』— Seus dados e sessão foram preservados
『 🔄 \`𝚃𝙴𝙽𝚃𝙴 𝙽𝙾𝚅𝙰𝙼𝙴𝙽𝚃𝙴\` 』— Aguarde alguns instantes e repita o comando`
}

exports.updateRollbackSuccess = versao => {
return `-  \`𝙱𝙰𝙲𝙺𝚄𝙿 𝚁𝙴𝚂𝚃𝙰𝚄𝚁𝙰𝙳𝙾\`

『 🤖 \`𝙱𝙾𝚃\` 』— Tokito Bot V10
『 ↩️ \`𝚅𝙴𝚁𝚂𝙰̃𝙾\` 』— ${versao}
『 ✅ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Backup restaurado com sucesso
『 🔄 \`𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾\` 』— O bot será reiniciado agora`
}

exports.updateRollbackError = () => {
return `-  \`𝙱𝙰𝙲𝙺𝚄𝙿 𝙸𝙽𝙳𝙸𝚂𝙿𝙾𝙽𝙸́𝚅𝙴𝙻\`

『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Não foi possível restaurar o backup
『 💾 \`𝙱𝙰𝙲𝙺𝚄𝙿\` 』— Nenhuma restauração foi aplicada
『 🔄 \`𝚃𝙴𝙽𝚃𝙴 𝙽𝙾𝚅𝙰𝙼𝙴𝙽𝚃𝙴\` 』— Aguarde alguns instantes e tente novamente`
}

exports.updateUsage = prefix => {
return `-  \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙳𝙴 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

『 🔎 \`𝚅𝙴𝚁𝙸𝙵𝙸𝙲𝙰𝚁\` 』— ${prefix}update check
『 📋 \`𝙸𝙽𝙵𝙾\` 』— ${prefix}update info
『 📥 \`𝙸𝙽𝚂𝚃𝙰𝙻𝙰𝚁\` 』— ${prefix}update start
『 ↩️ \`𝚁𝙴𝚂𝚃𝙰𝚄𝚁𝙰𝚁\` 』— ${prefix}update rollback`
}