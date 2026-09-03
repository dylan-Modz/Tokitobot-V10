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

exports.onlyOwner = () => {
return `- 🧊 \`𝙰𝙲𝙴𝚂𝚂𝙾 𝙳𝙾 𝙳𝙾𝙽𝙾\`

> 🧊 ׄ ( ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ᴏ ᴍᴇᴜ ᴅᴏɴᴏ ᴜᴛɪʟɪᴢᴀʀ. 🙇‍♂️ )`
}

exports.commandNotFound = ({ prefix, command, nome, porcentagem, tempo }) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡❌｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾
├╾═╼･ﾟ𖤐ﾟ･｡⚠️｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ ❌ 𝙲𝙾𝙼𝙰𝙽𝙳𝙾: ${prefix}${command || 'desconhecido'}
┃࣪ ╎—̳͟͞͞ 🔎 𝙿𝙰𝚁𝙴𝙲𝙸𝙳𝙾: ${nome || 'Nenhum'}
┃࣪ ╎—̳͟͞͞ 📊 𝚂𝙴𝙼𝙴𝙻𝙷𝙰𝙽𝙲̧𝙰: ${porcentagem || '0%'}
┃࣪ ╎—̳͟͞͞ ⏱️ 𝚃𝙴𝙼𝙿𝙾: ${tempo || '0 ms'}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}
exports.sogrupo = () => {
return `- 👥 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙴𝙼 𝙶𝚁𝚄𝙿𝙾𝚂\`

> 👥 ׄ ( ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ sᴏ́ ᴘᴏᴅᴇ sᴇʀ ᴜᴛɪʟɪᴢᴀᴅᴏ ᴅᴇɴᴛʀᴏ ᴅᴇ ᴜᴍ ɢʀᴜᴘᴏ ᴅᴏ ᴡʜᴀᴛsᴀᴘᴘ. 🙇‍♂️ )`
}

exports.soadm = () => {
return `- 👑 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂\`

> 👑 ׄ ( ᴀᴘᴇɴᴀs ᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴅᴏ ɢʀᴜᴘᴏ ᴘᴏᴅᴇᴍ ᴜᴛɪʟɪᴢᴀʀ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ. 🙇‍♂️ )`
}

exports.botadm = () => {
return `- ⚙️ \`𝙱𝙾𝚃 𝚂𝙴𝙼 𝙰𝙳𝙼𝙸𝙽\`

> ⚙️ ׄ ( ᴇᴜ ᴘʀᴇᴄɪsᴏ sᴇʀ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴏ ɢʀᴜᴘᴏ ᴘᴀʀᴀ ᴄᴏɴsᴇɢᴜɪʀ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴀ ᴀᴄ̧ᴀ̃ᴏ. 🙇‍♂️ )`
}

exports.marque = () => {
return `- 👤 \`𝙼𝙰𝚁𝚀𝚄𝙴 𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

> 👤 ׄ ( ᴍᴀʀǫᴜᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴏᴜ ʀᴇsᴘᴏɴᴅᴀ ᴀ̀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴀ ᴘᴇssᴏᴀ ǫᴜᴇ ᴅᴇsᴇᴊᴀ sᴇʟᴇᴄɪᴏɴᴀʀ. 🙇‍♂️ )`
}

exports.nobot = () => {
return `- 🤖 \`𝙰𝙲̧𝙰̃𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙰\`

> 🤖 ׄ ( ᴇᴜ ɴᴀ̃ᴏ ᴘᴏssᴏ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴀ ᴀᴄ̧ᴀ̃ᴏ ᴄᴏᴍɪɢᴏ ᴍᴇsᴍᴏ. 🙇‍♂️ )`
}

exports.nodono = () => {
return `- 👑 \`𝙳𝙾𝙽𝙾 𝙿𝚁𝙾𝚃𝙴𝙶𝙸𝙳𝙾\`

> 👑 ׄ ( ɴᴀ̃ᴏ ᴇ́ ᴘᴏssɪ́ᴠᴇʟ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴀ ᴀᴄ̧ᴀ̃ᴏ ᴄᴏᴍ ᴜᴍ ᴅᴏs ᴅᴏɴᴏs ᴅᴏ ʙᴏᴛ. 🙇‍♂️ )`
}

exports.jaadm = () => {
return `- 👑 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙹𝙰́ 𝙴́ 𝙰𝙳𝙼\`

> 👑 ׄ ( ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴊᴀ́ ᴘᴏssᴜɪ ᴏ ᴄᴀʀɢᴏ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴏ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.naoadm = () => {
return `- 👤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙽𝙰̃𝙾 𝙴́ 𝙰𝙳𝙼\`

> 👤 ׄ ( ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴏ ᴄᴀʀɢᴏ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴏ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.banido = alvo => {
return `- 🚫 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> 🚫 ׄ ( @${alvo.split('@')[0]} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴏ ɢʀᴜᴘᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.promovido = alvo => {
return `- 👑 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙿𝚁𝙾𝙼𝙾𝚅𝙸𝙳𝙾\`

> 👑 ׄ ( @${alvo.split('@')[0]} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ᴘʀᴏᴍᴏᴠɪᴅᴏ ᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.rebaixado = alvo => {
return `- 📉 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝚁𝙴𝙱𝙰𝙸𝚇𝙰𝙳𝙾\`

> 📉 ׄ ( @${alvo.split('@')[0]} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇʙᴀɪxᴀᴅᴏ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.falha = () => {
return `- ❌ \`𝙰𝙲̧𝙰̃𝙾 𝙵𝙰𝙻𝙷𝙾𝚄\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇxᴇᴄᴜᴛᴀʀ ᴀ ᴀᴄ̧ᴀ̃ᴏ sᴏʟɪᴄɪᴛᴀᴅᴀ, ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️ )`
}

exports.error = () => {
return `- ❌ \`𝙾𝙲𝙾𝚁𝚁𝙴𝚄 𝚄𝙼 𝙴𝚁𝚁𝙾\`

> ❌ ׄ ( ᴏᴄᴏʀʀᴇᴜ ᴜᴍ ᴇʀʀᴏ ᴀᴏ ᴇxᴇᴄᴜᴛᴀʀ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ, ᴠᴇʀɪғɪǫᴜᴇ ᴏs ᴅᴀᴅᴏs ᴇ ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️ )`
}
const mensagensWait = [
  `- ⏳ \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴 𝚄𝙼 𝙿𝙾𝚄𝙲𝙾\`

> ⏳ ׄ ( ᴇsᴛᴏᴜ ᴘʀᴏᴄᴇssᴀɴᴅᴏ ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ, ᴀɢᴜᴀʀᴅᴇ ᴜᴍ ᴘᴏᴜǫᴜɪɴʜᴏ. 🙇‍♂️ )`,

  `- 📤 \`𝙴𝙽𝚅𝙸𝙰𝙽𝙳𝙾...\`

> 📤 ׄ ( ᴊᴀ́ ᴇsᴛᴏᴜ ᴘʀᴇᴘᴀʀᴀɴᴅᴏ ᴛᴜᴅᴏ ᴘʀᴀ ᴠᴏᴄᴇ̂, ᴀɢᴜᴀʀᴅᴀ ᴀɪ́. 📦 )`,

  `- 🚀 \`𝙹𝙰́ 𝙴𝚂𝚃𝙰́ 𝙸𝙽𝙳𝙾\`

> 🚀 ׄ ( ᴄᴀʟᴍᴀ ᴀɪ́ ǫᴜᴇ ᴇᴜ ᴊᴀ́ ᴛᴏ̂ ᴄᴏᴍ ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ ɴᴀ ᴍᴀ̃ᴏ. 😎 )`,

  `- 📦 \`𝙿𝚁𝙴𝙿𝙰𝚁𝙰𝙽𝙳𝙾 𝙾 𝙴𝙽𝚅𝙸𝙾\`

> 📦 ׄ ( ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ ᴇsᴛᴀ́ sᴇɴᴅᴏ ᴘʀᴇᴘᴀʀᴀᴅᴏ. 📤 )`,

  `- ⚡ \`𝚂𝙾́ 𝚄𝙼 𝙸𝙽𝚂𝚃𝙰𝙽𝚃𝙴\`

> ⚡ ׄ ( ᴇᴜ sᴏᴜ ʀᴀ́ᴘɪᴅᴏ, ᴍᴀs ɴᴀ̃ᴏ ғᴀᴄ̧ᴏ ᴍɪʟᴀɢʀᴇ ᴛᴀᴍʙᴇ́ᴍ ɴᴇ́. 😂 )`,

  `- 🎯 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝚁𝙴𝙲𝙴𝙱𝙸𝙳𝙾\`

> 🎯 ׄ ( ᴊᴀ́ ᴇɴᴛᴇɴᴅɪ ᴏ ǫᴜᴇ ᴠᴏᴄᴇ̂ ǫᴜᴇʀ, ᴀɢᴏʀᴀ ᴅᴇɪxᴀ ᴄᴏᴍɪɢᴏ. 😌 )`,

  `- 💨 \`𝙹𝙰́ 𝚅𝙾𝙻𝚃𝙾\`

> 💨 ׄ ( ɴᴀ̃ᴏ sᴀɪ́ ᴅᴏ ᴄʜᴀᴛ ɴᴀ̃ᴏ, ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ ᴊᴀ́ ᴠᴇᴍ. 👀 )`,

  `- 🛠️ \`𝚃𝚁𝙰𝙱𝙰𝙻𝙷𝙰𝙽𝙳𝙾 𝙽𝙸𝚂𝚂𝙾\`

> 🛠️ ׄ ( ᴛᴏ̂ ᴀǫᴜɪ ɴᴏs ʙᴀsᴛɪᴅᴏʀᴇs ғᴀᴢᴇɴᴅᴏ ᴀ ᴍᴀ́ɢɪᴄᴀ. ✨ )`,

  `- 🧠 \`𝙲𝙰𝙻𝙲𝚄𝙻𝙰𝙽𝙳𝙾...\`

> 🧠 ׄ ( ᴅᴇɪxᴀ ᴇᴜ ᴜsᴀʀ ᴍᴇᴜs 2 ɴᴇᴜʀᴏ̂ɴɪᴏs ᴀǫᴜɪ. 🤣 )`,

  `- 🤖 \`𝙱𝙾𝚃 𝙴𝙼 𝙰𝙲̧𝙰̃𝙾\`

> 🤖 ׄ ( ᴏ ʀᴏʙᴏ̂ ᴛᴀ́ ᴛʀᴀʙᴀʟʜᴀɴᴅᴏ, ɴᴀ̃ᴏ ᴅᴇsʟɪɢᴀ ᴇʟᴇ ᴀɢᴏʀᴀ. 😂 )`,

  `- ❤️ \`𝙼𝙾𝙳𝙾 𝙽𝙰𝙼𝙾𝚁𝙾\`

> ❤️ ׄ ( ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ ᴛᴀ́ ᴅᴇᴍᴏʀᴀɴᴅᴏ ᴍᴀɪs ǫᴜᴇ ᴠᴏᴄᴇ̂ ᴘʀᴀ ᴘᴇᴅɪʀ ᴀǫᴜᴇʟᴀ ᴘᴇssᴏᴀ ᴇᴍ ɴᴀᴍᴏʀᴏ. 😂❤️ )`,

  `- 💍 \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴...\`

> 💍 ׄ ( ᴇɴǫᴜᴀɴᴛᴏ ᴇᴜ ᴘʀᴏᴄᴇssᴏ ɪssᴏ, ᴊᴀ́ ᴠᴀɪ ᴇsᴄᴏʟʜᴇɴᴅᴏ ᴀ ᴀʟɪᴀɴᴄ̧ᴀ. 💍😂 )`,

  `- 💕 \`𝙲𝙰𝙻𝙼𝙰 𝙲𝙾𝚁𝙰𝙲̧𝙰̃𝙾\`

> 💕 ׄ ( ᴇᴜ sᴇɪ ǫᴜᴇ ᴠᴏᴄᴇ̂ ᴛᴀ́ ᴀɴsɪᴏsᴏ, ᴍᴀs ɴᴀ̃ᴏ ᴇ́ ᴜᴍ ᴘᴇᴅɪᴅᴏ ᴅᴇ ɴᴀᴍᴏʀᴏ ɴᴀ̃ᴏ. 😂 )`,

  `- 🥰 \`𝚄𝙼 𝙿𝙾𝚄𝚀𝚄𝙸𝙽𝙷𝙾...\`

> 🥰 ׄ ( sᴇ ᴀɴsɪᴇᴅᴀᴅᴇ ғᴏssᴇ ᴀᴍᴏʀ, ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴛᴀᴠᴀ ᴄᴀsᴀᴅᴏ. 🤣❤️ )`,

  `- 😏 \`𝙴𝚂𝙿𝙴𝚁𝙰 𝙰𝙸́...\`

> 😏 ׄ ( ᴠᴏᴄᴇ̂ ᴘᴏᴅᴇ ᴀᴛᴇ́ ᴇsᴛᴀʀ sᴏʟᴛᴇɪʀᴏ, ᴍᴀs sᴇᴜ ᴘᴇᴅɪᴅᴏ ɴᴀ̃ᴏ ᴠᴀɪ ғɪᴄᴀʀ sᴏᴢɪɴʜᴏ. 😏 )`,

  `- 😂 \`𝙼𝙾𝙳𝙾 𝙿𝙸𝙰𝙳𝙰\`

> 😂 ׄ ( ᴄᴀʟᴍᴀ, ᴏ sᴇʀᴠɪᴅᴏʀ ɴᴀ̃ᴏ ᴍᴏʀʀᴇᴜ... ᴇʟᴇ sᴏ́ ᴛᴀ́ ᴛɪʀᴀɴᴅᴏ ᴜᴍ ᴄᴏᴄʜɪʟᴏ. 🤣 )`,

  `- 🤣 \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴\`

> 🤣 ׄ ( sᴇ ᴅᴇᴍᴏʀᴀʀ ᴅᴇᴍᴀɪs, ᴘᴏᴅᴇ ᴄᴜʟᴘᴀʀ ᴀ ɪɴᴛᴇʀɴᴇᴛ ᴅᴏ ᴠɪᴢɪɴʜᴏ. 😂 )`,

  `- 🐌 \`𝚅𝙰𝙸 𝚂𝙰𝙸𝚁...\`

> 🐌 ׄ ( ᴏ ᴘᴇᴅɪᴅᴏ ᴛᴀ́ ᴠɪɴᴅᴏ ᴅᴇ ᴜʙᴇʀ ᴄᴏᴍ ᴏ ᴍᴏᴛᴏʀɪsᴛᴀ ᴀ ᴘᴇ́. 🤣 )`,

  `- 🗿 \`𝙲𝙰𝙻𝙼𝙰 𝙰𝙸́\`

> 🗿 ׄ ( ᴇᴜ ɴᴀ̃ᴏ sᴏᴜ ᴜᴍᴀ ᴄᴀʟᴄᴜʟᴀᴅᴏʀᴀ ᴄᴀsɪᴏ ɴᴀ̃ᴏ, ᴄʜᴇғᴇ. 😂 )`,

  `- ☕ \`𝙿𝚁𝙾𝙲𝙴𝚂𝚂𝙰𝙽𝙳𝙾\`

> ☕ ׄ ( ᴏ ʙᴏᴛ ᴛᴀ́ ᴛᴏᴍᴀɴᴅᴏ ᴜᴍ ᴄᴀғᴇᴢɪɴʜᴏ ᴘʀᴀ ᴛᴇʀᴍɪɴᴀʀ sᴇᴜ ᴘᴇᴅɪᴅᴏ. ☕😂 )`,

  `- 😴 \`𝙿𝙴𝚁𝙰 𝙰𝙸́...\`

> 😴 ׄ ( ᴇᴜ ᴊᴜʀᴏ ǫᴜᴇ ɴᴀ̃ᴏ ᴅᴏʀᴍɪ, sᴏ́ ᴛᴀᴠᴀ ᴄᴏᴍ ᴏs ᴏʟʜᴏs ғᴇᴄʜᴀᴅᴏs. 🤣 )`,

  `- 😎 \`𝙴𝙼 𝙱𝚁𝙴𝚅𝙴\`

> 😎 ׄ ( ᴏ ʙᴀɢᴜʟʜᴏ ᴛᴀ́ sᴇɴᴅᴏ, ᴄᴏɴғɪᴀ ɴᴏ ᴘᴀɪ. 😎 )`,

  `- 💌 \`𝙲𝙰𝙽𝚃𝙰𝙳𝙰 𝙳𝙾 𝙱𝙾𝚃\`

> 💌 ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴇ́ ᴡɪ-ғɪ, ᴍᴀs ᴇᴜ ᴊᴀ́ sᴇɴᴛɪ ᴜᴍᴀ ᴄᴏɴᴇxᴀ̃ᴏ ᴀǫᴜɪ. 😏❤️ )`,

  `- 😏 \`𝙲𝙰𝙽𝚃𝙰𝙳𝙰\`

> 😏 ׄ ( ᴠᴏᴄᴇ̂ ᴇ́ ᴜᴍ ᴄᴏᴍᴀɴᴅᴏ? ᴘᴏʀǫᴜᴇ ᴇᴜ ᴛᴏ̂ ǫᴜᴇʀᴇɴᴅᴏ ᴛᴇ ᴇxᴇᴄᴜᴛᴀʀ... ᴏᴘᴀ. 😂 )`,

  `- ❤️‍🔥 \`𝙲𝙰𝙻𝙼𝙰...\`

> ❤️‍🔥 ׄ ( ᴇᴜ ɴᴀ̃ᴏ sᴏᴜ ɢᴏᴏɢʟᴇ, ᴍᴀs ᴠᴏᴄᴇ̂ ᴛᴇᴍ ᴛᴜᴅᴏ ǫᴜᴇ ᴇᴜ ᴘʀᴏᴄᴜʀᴏ. 😏 )`,

  `- 🌹 \`𝙿𝙴𝚁𝙰 𝙰𝙸́\`

> 🌹 ׄ ( sᴇ ʙᴇʟᴇᴢᴀ ᴅᴇssᴇ ʙᴀɴ, ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴛᴀᴠᴀ ᴇᴍ ʙᴀɴɢᴘ. 😂🌹 )`,

  `- 💘 \`𝙿𝚁𝙾𝙲𝙴𝚂𝚂𝙰𝙽𝙳𝙾\`

> 💘 ׄ ( ᴠᴏᴄᴇ̂ ᴇ́ ᴀᴘɪᴋᴇʏ? ᴘᴏʀǫᴜᴇ sᴇᴍ ᴠᴏᴄᴇ̂ ᴇᴜ ɴᴀ̃ᴏ ғᴜɴᴄɪᴏɴᴏ. 😭❤️ )`,

  `- 🫶 \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴\`

> 🫶 ׄ ( ᴠᴏᴄᴇ̂ ᴇ́ ᴏ ᴘʀᴇғɪxᴏ ᴅᴏ ᴍᴇᴜ ʙᴏᴛ? ᴘᴏʀǫᴜᴇ sᴇᴍ ᴠᴏᴄᴇ̂ ᴇᴜ ɴᴇᴍ sᴇɪ ᴄᴏᴍᴏ ᴄᴏᴍᴇᴄ̧ᴀʀ. 😂❤️ )`,

  `- 📡 \`𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙽𝙳𝙾...\`

> 📡 ׄ ( ᴛᴏ̂ ʙᴜsᴄᴀɴᴅᴏ ᴛᴜᴅᴏ ᴘʀᴀ ᴠᴏᴄᴇ̂, sᴏ́ ᴍᴀɪs ᴜᴍ ᴘᴏᴜǫᴜɪɴʜᴏ. 📡 )`,

  `- 🔍 \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾...\`

> 🔍 ׄ ( ᴇᴜ ᴛᴏ̂ ᴘʀᴏᴄᴜʀᴀɴᴅᴏ ᴏ ǫᴜᴇ ᴠᴏᴄᴇ̂ ᴘᴇᴅɪᴜ. 🔎 )`,

  `- 🎵 \`𝙿𝚁𝙴𝙿𝙰𝚁𝙰𝙽𝙳𝙾...\`

> 🎵 ׄ ( ᴊᴀ́ ᴇsᴛᴏᴜ ᴘʀᴇᴘᴀʀᴀɴᴅᴏ ᴀ sᴜᴀ ᴍɪ́ᴅɪᴀ. 🎧 )`,

  `- 🎬 \`𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙽𝙳𝙾\`

> 🎬 ׄ ( ᴀɢᴜᴀʀᴅᴇ ᴜᴍ ᴘᴏᴜᴄᴏ ᴇɴǫᴜᴀɴᴛᴏ ᴘʀᴇᴘᴀʀᴏ ᴏ sᴇᴜ ᴠɪ́ᴅᴇᴏ. 🎥 )`,

  `- 🎧 \`𝙰𝚄́𝙳𝙸𝙾 𝙰 𝙲𝙰𝙼𝙸𝙽𝙷𝙾\`

> 🎧 ׄ ( ᴄᴏʟᴏᴄᴀ ᴏ ғᴏɴᴇ ᴀɪ́ ǫᴜᴇ ᴊᴀ́ ᴠᴇᴍ ʙᴀʀᴜʟʜᴏ. 😂🎧 )`,

  `- 🖼️ \`𝙿𝚁𝙴𝙿𝙰𝚁𝙰𝙽𝙳𝙾 𝙸𝙼𝙰𝙶𝙴𝙼\`

> 🖼️ ׄ ( ᴛᴏ̂ ᴅᴀɴᴅᴏ ᴜᴍ ᴛᴀᴘᴀ ɴᴀ ǫᴜᴀʟɪᴅᴀᴅᴇ ᴀǫᴜɪ. 😂 )`,

  `- 💾 \`𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙽𝙳𝙾...\`

> 💾 ׄ ( ᴇsᴛᴏᴜ ᴘʀᴇᴘᴀʀᴀɴᴅᴏ ᴏ ᴀʀǫᴜɪᴠᴏ ᴘᴀʀᴀ ᴏ ᴇɴᴠɪᴏ. 📁 )`,

  `- 📥 \`𝙱𝙰𝙸𝚇𝙰𝙽𝙳𝙾...\`

> 📥 ׄ ( ᴏ ᴄᴏɴᴛᴇᴜ́ᴅᴏ ᴊᴀ́ ᴇsᴛᴀ́ sᴇɴᴅᴏ ʙᴀɪxᴀᴅᴏ. 📥 )`,

  `- 📤 \`𝙵𝙰𝚂𝙴 𝙵𝙸𝙽𝙰𝙻\`

> 📤 ׄ ( ᴀɢᴏʀᴀ sᴏ́ ғᴀʟᴛᴀ ᴇɴᴠɪᴀʀ ᴘʀᴀ ᴠᴏᴄᴇ̂. 😎 )`,

  `- 🏃 \`𝙲𝙾𝚁𝚁𝙴𝙽𝙳𝙾 𝙰𝚀𝚄𝙸...\`

> 🏃 ׄ ( ᴇᴜ ᴛᴏ̂ ᴄᴏʀʀᴇɴᴅᴏ ᴘʀᴀ ɴᴀ̃ᴏ ᴛᴏᴍᴀʀ ᴜᴍ “ʙᴏᴛ ʟᴇɴᴛᴏ”. 😂 )`,

  `- 🫠 \`𝙽𝙰̃𝙾 𝙳𝙴𝚂𝙸𝚂𝚃𝙴 𝙳𝙴 𝙼𝙸𝙼\`

> 🫠 ׄ ( ᴇᴜ ᴇsᴛᴏᴜ ᴛᴇɴᴛᴀɴᴅᴏ, ᴊᴜʀᴏ. 🥲😂 )`,

  `- 👀 \`𝙾𝙻𝙷𝙰 𝙰𝙸́...\`

> 👀 ׄ ( ɴᴀ̃ᴏ ᴘʀᴇᴄɪsᴀ ғɪᴄᴀʀ ᴏʟʜᴀɴᴅᴏ ᴘʀᴀ ᴀ ᴛᴇʟᴀ, ᴇᴜ ɴᴀ̃ᴏ ᴠᴏᴜ ғᴜɢɪʀ. 😂 )`,

  `- 🔥 \`𝚃𝙰́ 𝚂𝙰𝙸𝙽𝙳𝙾\`

> 🔥 ׄ ( ᴇssᴇ ᴘᴇᴅɪᴅᴏ ᴛᴀ́ ǫᴜᴇɴᴛᴇ, ᴊᴀ́ ᴊᴀ́ ᴛᴀ́ ɴᴀ sᴜᴀ ᴛᴇʟᴀ. 🔥 )`,

  `- 🧑‍🍳 \`𝙲𝙾𝚉𝙸𝙽𝙷𝙰𝙽𝙳𝙾...\`

> 🧑‍🍳 ׄ ( ᴛᴏ̂ ᴄᴏᴢɪɴʜᴀɴᴅᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ. ᴇsᴘᴇʀᴀ ɴᴀ̃ᴏ ǫᴜᴇɪᴍᴀʀ. 😂 )`,

  `- 🧊 \`𝙲𝙰𝙻𝙼𝙰 𝙰𝙸́\`

> 🧊 ׄ ( ғɪᴄᴀ ғʀɪᴏ ᴀɪ́, ᴊᴀ́ ᴇsᴛᴏᴜ ғɪɴᴀʟɪᴢᴀɴᴅᴏ. 🧊 )`,

  `- 🛰️ \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾 𝚂𝙸𝙽𝙰𝙻\`

> 🛰️ ׄ ( ᴏ sᴀᴛᴇ́ʟɪᴛᴇ ᴊᴀ́ ʀᴇᴄᴇʙᴇᴜ ᴏ ᴘᴇᴅɪᴅᴏ. 😂🛰️ )`,

  `- 🫡 \`𝙾𝚁𝙳𝙴𝙼 𝚁𝙴𝙲𝙴𝙱𝙸𝙳𝙰\`

> 🫡 ׄ ( sɪᴍ sᴇɴʜᴏʀ, ᴊᴀ́ ᴇsᴛᴏᴜ ᴄᴜᴍᴘʀɪɴᴅᴏ ᴀ ᴍɪssᴀ̃ᴏ. 🫡 )`,

  `- 💻 \`𝙱𝙾𝚃 𝚃𝚁𝙰𝙱𝙰𝙻𝙷𝙰𝙽𝙳𝙾\`

> 💻 ׄ ( ᴇᴜ ᴛᴏ̂ ǫᴜᴀsᴇ ᴘᴇᴅɪɴᴅᴏ ʜᴏʀᴀ ᴇxᴛʀᴀ ᴀǫᴜɪ. 😂 )`,

  `- 🥹 \`𝙰𝙶𝚄𝙰𝚁𝙳𝙰 𝙴𝚄...\`

> 🥹 ׄ ( sᴇ ᴠᴏᴄᴇ̂ ᴄᴀɴᴄᴇʟᴀʀ ᴀɢᴏʀᴀ ᴇᴜ ᴠᴏᴜ ғɪᴄᴀʀ ᴛʀɪsᴛᴇ. 😭😂 )`,

  `- 💞 \`𝙰𝙼𝙾𝚁 𝙴𝙼 𝙿𝚁𝙾𝙲𝙴𝚂𝚂𝙾\`

> 💞 ׄ ( ᴀɢᴜᴀʀᴅᴀ ᴀɪ́, ᴘᴏʀǫᴜᴇ ᴅɪғᴇʀᴇɴᴛᴇ ᴅᴏ sᴇᴜ ᴄʀᴜsʜ, ᴇᴜ ᴠᴏᴜ ᴛᴇ ʀᴇsᴘᴏɴᴅᴇʀ. 😂❤️ )`,

  `- 💔 \`𝙲𝙰𝙻𝙼𝙰...\`

> 💔 ׄ ( ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ ɴᴀ̃ᴏ ᴛᴇ ᴅᴇɪxᴏᴜ ɴᴏ ᴠɪsᴛᴏ, ᴇʟᴇ sᴏ́ ᴛᴀ́ ᴘʀᴏᴄᴇssᴀɴᴅᴏ. 😂 )`,

  `- 😳 \`𝙲𝙰𝙽𝚃𝙰𝙳𝙰 𝙰𝙻𝙴𝙰𝚃𝙾́𝚁𝙸𝙰\`

> 😳 ׄ ( ᴠᴏᴄᴇ̂ ᴇ́ ᴜᴍ ʙᴜɢ? ᴘᴏʀǫᴜᴇ ᴅᴇsᴅᴇ ǫᴜᴇ ᴇᴜ ᴛᴇ ᴠɪ ᴍᴇᴜ sɪsᴛᴇᴍᴀ ᴘᴀʀᴏᴜ. 😳❤️ )`,

  `- 🤭 \`𝙲𝙰𝙽𝚃𝙰𝙳𝙰\`

> 🤭 ׄ ( ᴠᴏᴄᴇ̂ ᴅᴇᴠᴇ sᴇʀ ᴜᴍ ᴜᴘᴅᴀᴛᴇ, ᴘᴏʀǫᴜᴇ ᴅᴇᴘᴏɪs ǫᴜᴇ ᴠᴏᴄᴇ̂ ᴀᴘᴀʀᴇᴄᴇᴜ ᴛᴜᴅᴏ ғɪᴄᴏᴜ ᴍᴇʟʜᴏʀ. 😏 )`,

  `- 👑 \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴 𝙰𝙸́\`

> 👑 ׄ ( ᴘᴇᴅɪᴅᴏ ᴅᴇ ʀᴇɪ ᴍᴇʀᴇᴄᴇ ᴄᴀᴘʀɪᴄʜᴏ. 👑 )`,

  `- ✅ \`𝚀𝚄𝙰𝚂𝙴 𝙿𝚁𝙾𝙽𝚃𝙾\`

> ✅ ׄ ( ғᴀʟᴛᴀ ᴘᴏᴜᴄᴏ, ᴏ sᴇᴜ ᴘᴇᴅɪᴅᴏ ᴊᴀ́ ᴠᴀɪ sᴇʀ ᴇɴᴠɪᴀᴅᴏ. ✅ )`
]

exports.wait = () => {
  return mensagensWait[
    Math.floor(Math.random() * mensagensWait.length)
  ]
}

exports.ownerSlotEmpty = () => {
return `- 👑 \`𝙴𝚂𝙿𝙰𝙲̧𝙾 𝚅𝙰𝚉𝙸𝙾\`

> 👑 ׄ ( ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍ ᴅᴏɴᴏ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ ɴᴇssᴇ ᴇsᴘᴀᴄ̧ᴏ ᴘᴀʀᴀ sᴇʀ ʀᴇᴍᴏᴠɪᴅᴏ. 🙇‍♂️ )`
}

exports.ownerRemoved = numero => {
return `- 👋 \`𝙳𝙾𝙽𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> 👋 ׄ ( @${numero} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴛɪʀᴀᴅᴏ ᴅᴏ ᴛɪᴍᴇ ᴅᴏs ᴅᴏɴᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.ownerNumberRequired = () => {
return `- 📱 \`𝙽𝚄́𝙼𝙴𝚁𝙾 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`

> 📱 ׄ ( ᴍᴇɴᴄɪᴏɴᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴏᴜ ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴄᴏᴍᴘʟᴇᴛᴏ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴄᴀᴅᴀsᴛʀᴀʀ. 🙇‍♂️ )`
}

exports.ownerAdded = numero => {
return `- 👑 \`𝙽𝙾𝚅𝙾 𝙳𝙾𝙽𝙾\`

> 👑 ׄ ( @${numero} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴀɢᴏʀᴀ ғᴀᴢ ᴘᴀʀᴛᴇ ᴅᴏ ᴛɪᴍᴇ ᴅᴏs ᴅᴏɴᴏs ᴅᴏ ʙᴏᴛ. 🙇‍♂️ )`
}

exports.ownerSlotRequired = () => {
return `- 🔢 \`𝙴𝚂𝙲𝙾𝙻𝙷𝙰 𝙾 𝙴𝚂𝙿𝙰𝙲̧𝙾\`

> 🔢 ׄ ( ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴇsᴘᴀᴄ̧ᴏ ᴅᴏ ᴅᴏɴᴏ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ʀᴇᴍᴏᴠᴇʀ. 🙇‍♂️ )`
}

exports.ownerSlotInvalid = () => {
return `- ❌ \`𝙴𝚂𝙿𝙰𝙲̧𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> ❌ ׄ ( ɪɴғᴏʀᴍᴇ ᴜᴍ ɴᴜ́ᴍᴇʀᴏ ᴠᴀ́ʟɪᴅᴏ ᴅᴇɴᴛʀᴏ ᴅᴇssᴇ ɪɴᴛᴇʀᴠᴀʟᴏ. 🙇‍♂️ )`
}

exports.ownerSlotNotRegistered = numero => {
return `- ❌ \`𝙳𝙾𝙽𝙾 𝙽𝙰̃𝙾 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾\`

> ❌ ׄ ( ᴇsᴘᴀᴄ̧ᴏ ${numero} — ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍ ᴅᴏɴᴏ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ ɴᴇssᴇ ᴇsᴘᴀᴄ̧ᴏ. 🙇‍♂️ )`
}

exports.botNameRequired = prefix => {
return `- 🤖 \`𝙽𝙾𝚅𝙾 𝙽𝙾𝙼𝙴\`

> 🤖 ׄ ( ${prefix}nome-bot TOKITO BOT — ᴜsᴇ ᴏ ᴇxᴇᴍᴘʟᴏ ᴀᴏ ʟᴀᴅᴏ ᴇ ɪɴғᴏʀᴍᴇ ᴏ ɴᴏᴠᴏ ɴᴏᴍᴇ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴄᴏʟᴏᴄᴀʀ ɴᴏ ʙᴏᴛ. 🙇‍♂️ )`
}

exports.botNameChanged = nome => {
return `- 🤖 \`𝙽𝙾𝙼𝙴 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾\`

> 🤖 ׄ ( ${nome} — ᴘʀᴏɴᴛᴏ ᴍᴇsᴛʀᴇ, ᴇssᴇ ᴀɢᴏʀᴀ ᴇ́ ᴏ ᴍᴇᴜ ɴᴏᴠᴏ ɴᴏᴍᴇ. 🙇‍♂️ )`
}

exports.ownerNameRequired = prefix => {
return `- 👤 \`𝙽𝙾𝚅𝙾 𝙽𝙸𝙲𝙺\`

> 👤 ׄ ( ${prefix}nome-dono dylan Modz — ᴜsᴇ ᴏ ᴇxᴇᴍᴘʟᴏ ᴀᴏ ʟᴀᴅᴏ ᴇ ɪɴғᴏʀᴍᴇ ᴏ ɴᴏᴠᴏ ɴɪᴄᴋ ᴅᴏ ᴅᴏɴᴏ. 🙇‍♂️ )`
}

exports.ownerNameChanged = nome => {
return `- 👑 \`𝙽𝙸𝙲𝙺 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾\`

> 👑 ׄ ( ${nome} — ᴄᴇʀᴛᴏ sᴇɴʜᴏʀ, ᴇssᴇ ᴀɢᴏʀᴀ ᴇ́ ᴏ ɴᴏᴠᴏ ɴɪᴄᴋ ᴅᴏ ᴅᴏɴᴏ. 🙇‍♂️ )`
}

exports.mainOwnerRequired = prefix => {
return `- 👑 \`𝙽𝙾𝚅𝙾 𝙳𝙾𝙽𝙾 𝙿𝚁𝙸𝙽𝙲𝙸𝙿𝙰𝙻\`

> 👑 ׄ ( ${prefix}numero-dono 5511999999999 — ᴍᴀʀǫᴜᴇ ᴏ ɴᴏᴠᴏ ᴅᴏɴᴏ ᴏᴜ ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴄᴏᴍᴘʟᴇᴛᴏ. 🙇‍♂️ )`
}

exports.mainOwnerChanged = numero => {
return `- 👑 \`𝙳𝙾𝙽𝙾 𝙿𝚁𝙸𝙽𝙲𝙸𝙿𝙰𝙻\`

> 👑 ׄ ( @${numero} — ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴀɢᴏʀᴀ ᴇ́ ᴏ ᴅᴏɴᴏ ᴘʀɪɴᴄɪᴘᴀʟ ᴅᴏ ʙᴏᴛ. 🙇‍♂️ )`
}

exports.channelRequired = (prefix, command) => {
return `- 📢 \`𝙲𝙰𝙽𝙰𝙻 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`

> 📢 ׄ ( ${prefix}${command} <link do canal> — ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ ᴏ ᴄᴀɴᴀʟ ɴᴀs ᴍᴇɴsᴀɢᴇɴs. )

> 📢 ׄ ( ${prefix}${command} 0 — ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴅᴇsᴀᴛɪᴠᴀʀ ᴏ ᴄᴀɴᴀʟ. 🙇‍♂️ )`
}

exports.channelDisabled = () => {
return `- 🚫 \`𝙲𝙰𝙽𝙰𝙻 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 🚫 ׄ ( ᴏ ᴄᴀɴᴀʟ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ᴇ ɴᴀ̃ᴏ sᴇʀᴀ́ ᴍᴀɪs ᴍᴏsᴛʀᴀᴅᴏ ɴᴀs ᴍᴇɴsᴀɢᴇɴs. 🙇‍♂️ )`
}

exports.channelEnabled = (jid, link) => {
return `- 📢 \`𝙲𝙰𝙽𝙰𝙻 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 📢 ׄ ( ${jid} — ᴏ ᴄᴀɴᴀʟ ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )

> 📢 ׄ ( ${link} — ᴇssᴇ ᴇ́ ᴏ ʟɪɴᴋ ᴅᴏ ᴄᴀɴᴀʟ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ. 🙇‍♂️ )`
}

exports.prefixRequired = () => {
return `- 🧩 \`𝙽𝙾𝚅𝙾 𝙿𝚁𝙴𝙵𝙸𝚇𝙾\`

> 🧩 ׄ ( ɪɴғᴏʀᴍᴇ ᴏ ɴᴏᴠᴏ ᴘʀᴇғɪxᴏ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴜᴛɪʟɪᴢᴀʀ ɴᴏs ᴄᴏᴍᴀɴᴅᴏs. 🙇‍♂️ )`
}

exports.prefixChanged = prefix => {
return `- 💁‍♂️ \`𝙼𝙴𝚄 𝙿𝚁𝙴𝙵𝙸𝚇𝙾\`

> 💁‍♂️ ׄ ( ${prefix} — ᴇsᴛᴇ ᴇ́ ᴏ ᴍᴇᴜ ᴘʀᴇғɪxᴏ ᴀᴛᴜᴀʟ, ᴄᴏᴍ ᴇʟᴇ ᴠᴏᴄᴇ̂ ᴘᴏᴅᴇ ᴀᴄᴇssᴀʀ ᴛᴏᴅᴏs ᴏs ᴍᴇᴜs ᴄᴏᴍᴀɴᴅᴏs, ᴛᴀɴᴛᴏ ᴏs ᴀɴᴛɪɢᴏs ᴄᴏᴍᴏ ᴏs ɴᴏᴠᴏs. 🙇‍♂️ )`
}

exports.menuMediaSaved = tipo => {
return `- ${tipo === 'video' ? '🎥' : '🖼️'} \`𝙼𝙸́𝙳𝙸𝙰 𝙳𝙾 𝙼𝙴𝙽𝚄\`

> 🧊 ׄ ( ${tipo === 'video' ? '𝚅𝙸́𝙳𝙴𝙾' : '𝙸𝙼𝙰𝙶𝙴𝙼'} — ᴀ ɴᴏᴠᴀ ᴍɪ́ᴅɪᴀ ᴅᴏ ᴍᴇɴᴜ ғᴏɪ sᴀʟᴠᴀ ʟᴏᴄᴀʟᴍᴇɴᴛᴇ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.menuMediaRequired = () => {
return `- 🖼️ \`𝙼𝙸́𝙳𝙸𝙰 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙰\`

> 🖼️ ׄ ( ᴍᴀʀǫᴜᴇ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴏᴜ ᴜᴍ ᴠɪ́ᴅᴇᴏ ᴘᴀʀᴀ ᴅᴇғɪɴɪʀ ᴄᴏᴍᴏ ᴀ ɴᴏᴠᴀ ᴍɪ́ᴅɪᴀ ᴅᴏ ᴍᴇɴᴜ. 🙇‍♂️ )`
}

exports.verifiedEnabled = () => {
return `- ✅ \`𝚂𝙴𝙻𝙾 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> ✅ ׄ ( ᴏ sᴇʟᴏ ᴅᴇ ᴠᴇʀɪғɪᴄᴀᴅᴏ ɢʟᴏʙᴀʟ ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴇ sᴇʀᴀ́ ᴜᴛɪʟɪᴢᴀᴅᴏ ɴᴀs ʀᴇsᴘᴏsᴛᴀs ᴅᴏs ᴄᴏᴍᴀɴᴅᴏs. 🧊 )`
}

exports.verifiedDisabled = () => {
return `- ❌ \`𝚂𝙴𝙻𝙾 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> ❌ ׄ ( ᴏ sᴇʟᴏ ᴅᴇ ᴠᴇʀɪғɪᴄᴀᴅᴏ ɢʟᴏʙᴀʟ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴇ ɴᴀ̃ᴏ sᴇʀᴀ́ ᴍᴀɪs ᴜᴛɪʟɪᴢᴀᴅᴏ ɴᴀs ʀᴇsᴘᴏsᴛᴀs. 🧊 )`
}

exports.reloadSuccess = arquivo => {
return `- ♻️ \`𝙰𝙻𝚃𝙴𝚁𝙰𝙲̧𝙾̃𝙴𝚂 𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙳𝙰𝚂\`

> ♻️ ׄ ( ${arquivo} — ᴀs ᴀʟᴛᴇʀᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ᴅᴇᴛᴇᴄᴛᴀᴅᴀs ᴇ ᴄᴀʀʀᴇɢᴀᴅᴀs ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.reloadError = arquivo => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝚁𝙴𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙼𝙴𝙽𝚃𝙾\`

> ❌ ׄ ( ${arquivo} — ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴀʀʀᴇɢᴀʀ ᴀs ᴀʟᴛᴇʀᴀᴄ̧ᴏ̃ᴇs ᴅᴇssᴇ ᴀʀǫᴜɪᴠᴏ. )`
}

exports.grupo = () => {
return `- 👥 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙴𝙼 𝙶𝚁𝚄𝙿𝙾𝚂\`

> 👥 ׄ ( ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ sᴏ́ ᴘᴏᴅᴇ sᴇʀ ᴜᴛɪʟɪᴢᴀᴅᴏ ᴅᴇɴᴛʀᴏ ᴅᴇ ᴜᴍ ɢʀᴜᴘᴏ ᴅᴏ ᴡʜᴀᴛsᴀᴘᴘ. 🙇‍♂️ )`
}

exports.adm = () => {
return `- 👑 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂\`

> 👑 ׄ ( ᴀᴘᴇɴᴀs ᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴅᴏ ɢʀᴜᴘᴏ ᴘᴏᴅᴇᴍ ᴜᴛɪʟɪᴢᴀʀ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ. 🙇‍♂️ )`
}

exports.fechar = (prefix, hora) => {
if (hora) {
return `- 🔒 \`𝙵𝙴𝙲𝙷𝙰𝙼𝙴𝙽𝚃𝙾 𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝙳𝙾\`

> 🔒 ׄ ( ${hora} — ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴘʀᴏɢʀᴀᴍᴀᴅᴏ ᴘᴀʀᴀ ғᴇᴄʜᴀʀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ɴᴇssᴇ ʜᴏʀᴀ́ʀɪᴏ. 🙇‍♂️ )`
}
return `- 🔒 \`𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝚁 𝙵𝙴𝙲𝙷𝙰𝙼𝙴𝙽𝚃𝙾\`

> 🔒 ׄ ( ${prefix}fechargp 22:00 — ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴘʀᴏɢʀᴀᴍᴀʀ ᴏ ғᴇᴄʜᴀᴍᴇɴᴛᴏ ᴅᴏ ɢʀᴜᴘᴏ. ᴠᴏᴄᴇ̂ ᴛᴀᴍʙᴇ́ᴍ ᴘᴏᴅᴇ ᴍᴀʀᴄᴀʀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ, ᴀ́ᴜᴅɪᴏ ᴏᴜ ғɪɢᴜʀɪɴʜᴀ. 🙇‍♂️ )`
}

exports.abrir = (prefix, hora) => {
if (hora) {
return `- 🔓 \`𝙰𝙱𝙴𝚁𝚃𝚄𝚁𝙰 𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝙳𝙰\`

> 🔓 ׄ ( ${hora} — ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴘʀᴏɢʀᴀᴍᴀᴅᴏ ᴘᴀʀᴀ ᴀʙʀɪʀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ɴᴇssᴇ ʜᴏʀᴀ́ʀɪᴏ. 🙇‍♂️ )`
}
return `- 🔓 \`𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝚁 𝙰𝙱𝙴𝚁𝚃𝚄𝚁𝙰\`

> 🔓 ׄ ( ${prefix}abrirgp 07:00 — ᴜsᴇ ᴇssᴇ ғᴏʀᴍᴀᴛᴏ ᴘᴀʀᴀ ᴘʀᴏɢʀᴀᴍᴀʀ ᴀ ᴀʙᴇʀᴛᴜʀᴀ ᴅᴏ ɢʀᴜᴘᴏ. ᴠᴏᴄᴇ̂ ᴛᴀᴍʙᴇ́ᴍ ᴘᴏᴅᴇ ᴍᴀʀᴄᴀʀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ, ᴀ́ᴜᴅɪᴏ ᴏᴜ ғɪɢᴜʀɪɴʜᴀ. 🙇‍♂️ )`
}

exports.fechado = (hora, grupo) => {
return `- 🔒 \`𝙶𝚁𝚄𝙿𝙾 𝙵𝙴𝙲𝙷𝙰𝙳𝙾\`

> 🔒 ׄ ( ${grupo} — ᴏ ɢʀᴜᴘᴏ ғᴏɪ ғᴇᴄʜᴀᴅᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ᴀ̀s 『 ${hora} 』. ᴀɢᴜᴀʀᴅᴇ ᴀᴛᴇ́ ᴏ ʜᴏʀᴀ́ʀɪᴏ ᴅᴇ ᴀʙᴇʀᴛᴜʀᴀ ᴘᴀʀᴀ ᴠᴏʟᴛᴀʀ ᴀ ᴇɴᴠɪᴀʀ ᴍᴇɴsᴀɢᴇɴs. 🙇‍♂️ )`
}

exports.aberto = (hora, grupo) => {
return `- 🔓 \`𝙶𝚁𝚄𝙿𝙾 𝙰𝙱𝙴𝚁𝚃𝙾\`

> 🔓 ׄ ( ${grupo} — ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴀʙᴇʀᴛᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ᴀ̀s 『 ${hora} 』. ᴀɢᴏʀᴀ ᴛᴏᴅᴏs ᴏs ᴍᴇᴍʙʀᴏs ᴊᴀ́ ᴘᴏᴅᴇᴍ ᴠᴏʟᴛᴀʀ ᴀ ᴇɴᴠɪᴀʀ ᴍᴇɴsᴀɢᴇɴs ɴᴏ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.semhorario = () => {
return `- 🕒 \`𝙽𝙴𝙽𝙷𝚄𝙼 𝙷𝙾𝚁𝙰́𝚁𝙸𝙾\`

> 🕒 ׄ ( ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍ ʜᴏʀᴀ́ʀɪᴏ ᴅᴇ ᴀʙᴇʀᴛᴜʀᴀ ᴏᴜ ғᴇᴄʜᴀᴍᴇɴᴛᴏ ᴘʀᴏɢʀᴀᴍᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.apagado = () => {
return `- 🗑️ \`𝙷𝙾𝚁𝙰́𝚁𝙸𝙾𝚂 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾𝚂\`

> 🗑️ ׄ ( ᴏs ʜᴏʀᴀ́ʀɪᴏs ᴅᴇ ᴀʙᴇʀᴛᴜʀᴀ ᴇ ғᴇᴄʜᴀᴍᴇɴᴛᴏ, ᴊᴜɴᴛᴀᴍᴇɴᴛᴇ ᴄᴏᴍ ᴀs ᴍɪ́ᴅɪᴀs sᴀʟᴠᴀs, ғᴏʀᴀᴍ ʀᴇᴍᴏᴠɪᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.donos = (nome, principal, extras = []) => {
let texto = `- 👑 \`𝚃𝙸𝙼𝙴 𝙳𝙾𝚂 𝙳𝙾𝙽𝙾𝚂\`

> 👑 ׄ ( ${principal ? `@${principal}` : '𝙽𝙰̃𝙾 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾'} — ${principal ? `${nome || 'ᴅᴏɴᴏ'} ᴇ́ ᴏ ᴅᴏɴᴏ ᴘʀɪɴᴄɪᴘᴀʟ ᴅᴏ ʙᴏᴛ.` : 'ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ᴜᴍ ᴅᴏɴᴏ ᴘʀɪɴᴄɪᴘᴀʟ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ.'} )`
if (extras.length) {
texto += `\n\n- 👥 \`𝙳𝙾𝙽𝙾𝚂 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙸𝚂\`\n`
for (const dono of extras) {
texto += `\n> 👑 ׄ ( ${dono.slot} — @${dono.numero} )`
}
}
else {
texto += `\n\n- 👥 \`𝙳𝙾𝙽𝙾𝚂 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙸𝚂\`\n\n> 👑 ׄ ( ɴᴇɴʜᴜᴍ ᴅᴏɴᴏ ᴀᴅɪᴄɪᴏɴᴀʟ ғᴏɪ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ. )`
}
return texto
}

exports.bemvindo = ativo => {
return ativo
? `- ✅ \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> ✅ ׄ ( ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ʙᴏᴀs-ᴠɪɴᴅᴀs ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
: `- ❌ \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> ❌ ׄ ( ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ʙᴏᴀs-ᴠɪɴᴅᴀs ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.tags = (prefix, comando) => {
return `- 🏷️ \`𝚃𝙰𝙶𝚂 𝙳𝙰 𝙻𝙴𝙶𝙴𝙽𝙳𝙰\`

> 🏷️ ׄ ( ${prefix}${comando} Bem-vindo #numero# ao #nomegrupo# — ɪɴғᴏʀᴍᴇ ᴀ ɴᴏᴠᴀ ʟᴇɢᴇɴᴅᴀ ᴜᴛɪʟɪᴢᴀɴᴅᴏ ᴀs ᴛᴀɢs ᴅɪsᴘᴏɴɪ́ᴠᴇɪs ᴀʙᴀɪxᴏ. 🙇‍♂️ )

> #numero# ׄ ( ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ )
> #numerodele# ׄ ( ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ )
> #nomegrupo# ׄ ( ɴᴏᴍᴇ ᴅᴏ ɢʀᴜᴘᴏ )
> #nomedogp# ׄ ( ɴᴏᴍᴇ ᴅᴏ ɢʀᴜᴘᴏ )
> #prefixo# ׄ ( ᴘʀᴇғɪxᴏ ᴅᴏ ʙᴏᴛ )
> #nomedobot# ׄ ( ɴᴏᴍᴇ ᴅᴏ ʙᴏᴛ )
> #hora# ׄ ( ʜᴏʀᴀ́ʀɪᴏ ᴀᴛᴜᴀʟ )
> #dia# ׄ ( ᴅɪᴀ ᴅᴀ sᴇᴍᴀɴᴀ )
> #data# ׄ ( ᴅᴀᴛᴀ ᴀᴛᴜᴀʟ )
> #ano# ׄ ( ᴀɴᴏ ᴀᴛᴜᴀʟ )
> #year# ׄ ( ᴀɴᴏ ᴀᴛᴜᴀʟ )
> #yeah# ׄ ( ᴀɴᴏ ᴀᴛᴜᴀʟ )
> #estado# ׄ ( ᴇsᴛᴀᴅᴏ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ )
> #membros# ׄ ( ᴛᴏᴛᴀʟ ᴅᴇ ᴍᴇᴍʙʀᴏs )`
}

exports.legenda = tipo => {
return `- 📝 \`𝙻𝙴𝙶𝙴𝙽𝙳𝙰 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙰\`

> 📝 ׄ ( ${tipo} — ᴀ ʟᴇɢᴇɴᴅᴀ ᴅᴇ ${tipo} ғᴏɪ ᴀʟᴛᴇʀᴀᴅᴀ ᴇ sᴀʟᴠᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.midia = () => {
return `- 🖼️ \`𝙼𝙸́𝙳𝙸𝙰 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙰\`

> 🖼️ ׄ ( ᴍᴀʀǫᴜᴇ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴏᴜ ᴜᴍ ᴠɪ́ᴅᴇᴏ ᴘᴀʀᴀ sᴇʀ ᴜᴛɪʟɪᴢᴀᴅᴏ ᴄᴏᴍᴏ ғᴜɴᴅᴏ ᴅᴀ ᴍᴇɴsᴀɢᴇᴍ. 🙇‍♂️ )`
}

exports.fundo = tipo => {
return `- 🖼️ \`𝙵𝚄𝙽𝙳𝙾 𝚂𝙰𝙻𝚅𝙾\`

> 🖼️ ׄ ( ${tipo} — ᴏ ғᴜɴᴅᴏ ᴅᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ${tipo} ғᴏɪ sᴀʟᴠᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.fundos = () => {
return `- 🗑️ \`𝙵𝚄𝙽𝙳𝙾𝚂 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾𝚂\`

> 🗑️ ׄ ( ᴏs ғᴜɴᴅᴏs ᴅᴀs ᴍᴇɴsᴀɢᴇɴs ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ᴇ sᴀɪ́ᴅᴀ ғᴏʀᴀᴍ ʀᴇᴍᴏᴠɪᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}



function tituloMono(valor = '') {
const entrada = String(valor || '').toUpperCase()

return [...entrada].map(caractere => {
const codigo = caractere.codePointAt(0)

if (codigo >= 65 && codigo <= 90)
return String.fromCodePoint(0x1D670 + (codigo - 65))

if (codigo >= 48 && codigo <= 57)
return String.fromCodePoint(0x1D7F6 + (codigo - 48))

return caractere
}).join('')
}

function linhaPadrao(rotulo, valor) {
if (valor === undefined || valor === null || valor === '')
return ''

return `> 🗑️ ׄ ( ${rotulo} — ${valor} )`
}

exports.padraoUso = ({
emoji = '⚙️',
titulo = 'COMANDO',
uso = '',
descricao = '',
exemplos = []
} = {}) => {
const linhas = []

if (uso)
linhas.push(linhaPadrao('📌 𝚄𝚂𝙾', uso))

for (const exemplo of Array.isArray(exemplos) ? exemplos : [exemplos]) {
if (exemplo)
linhas.push(linhaPadrao('💡 𝙴𝚇𝙴𝙼𝙿𝙻𝙾', exemplo))
}

if (descricao)
linhas.push(linhaPadrao('ℹ️ 𝙸𝙽𝙵𝙾', descricao))

return `- ${emoji} \`${tituloMono(titulo)}\`\n\n${linhas.filter(Boolean).join('\n')}`
}

exports.padraoErro = ({
titulo = 'ERRO',
descricao = 'Não foi possível concluir esta ação.',
detalhe = ''
} = {}) => {
const linhas = [linhaPadrao('⚠️ 𝙴𝚁𝚁𝙾', descricao)]

if (detalhe)
linhas.push(linhaPadrao('ℹ️ 𝙳𝙴𝚃𝙰𝙻𝙷𝙴', detalhe))

return `- ❌ \`${tituloMono(titulo)}\`\n\n${linhas.filter(Boolean).join('\n')}`
}

exports.padraoAviso = ({
titulo = 'ATENÇÃO',
descricao = '',
detalhe = '',
emoji = '⚠️'
} = {}) => {
const linhas = []

if (descricao)
linhas.push(linhaPadrao('📌 𝙰𝚅𝙸𝚂𝙾', descricao))

if (detalhe)
linhas.push(linhaPadrao('ℹ️ 𝙳𝙴𝚃𝙰𝙻𝙷𝙴', detalhe))

return `- ${emoji} \`${tituloMono(titulo)}\`\n\n${linhas.filter(Boolean).join('\n')}`
}

exports.padraoSucesso = ({
titulo = 'CONCLUÍDO',
descricao = '',
detalhe = '',
emoji = '✅'
} = {}) => {
const linhas = []

if (descricao)
linhas.push(linhaPadrao('✅ 𝚂𝚃𝙰𝚃𝚄𝚂', descricao))

if (detalhe)
linhas.push(linhaPadrao('ℹ️ 𝙳𝙴𝚃𝙰𝙻𝙷𝙴', detalhe))

return `- ${emoji} \`${tituloMono(titulo)}\`\n\n${linhas.filter(Boolean).join('\n')}`
}

exports.padraoStatus = ({
emoji = '⚙️',
titulo = 'SISTEMA',
ativo = false,
descricao = ''
} = {}) => {
const linhas = [linhaPadrao('⚙️ 𝚂𝚃𝙰𝚃𝚄𝚂', ativo ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ')]

if (descricao)
linhas.push(linhaPadrao('ℹ️ 𝙵𝚄𝙽𝙲̧𝙰̃𝙾', descricao))

return `- ${emoji} \`${tituloMono(titulo)}\`\n\n${linhas.filter(Boolean).join('\n')}`
}

exports.padraoLista = ({
emoji = '📋',
titulo = 'LISTA',
itens = [],
vazio = 'Nenhum item encontrado.',
rodape = ''
} = {}) => {
const lista = Array.isArray(itens) ? itens.filter(Boolean) : []
const conteudo = lista.length
? lista.map((item, indice) => `> 🧊 ׄ ( ${indice + 1} — ${item} )`).join('\n')
: linhaPadrao('0', vazio)

const fim = rodape ? `\n${linhaPadrao('ℹ️ 𝙸𝙽𝙵𝙾', rodape)}` : ''

return `- ${emoji} \`${tituloMono(titulo)}\`\n\n${conteudo}${fim}`
}

exports.padraoInfo = ({
emoji = '🧊',
titulo = 'INFORMAÇÃO',
linhas = []
} = {}) => {
const itens = Array.isArray(linhas) ? linhas : []
const conteudo = itens
.filter(item => item && item.valor !== undefined && item.valor !== null && item.valor !== '')
.map(item => linhaPadrao(item.rotulo || 'ℹ️', item.valor))
.join('\n')

return `- ${emoji} \`${tituloMono(titulo)}\`\n\n${conteudo}`
}


exports.downloadUso = ({ tipo = 'conteúdo', prefix = '', command = '', exemplo = '' } = {}) => {
const uso = `${prefix}${command}${exemplo ? ` ${exemplo}` : ''}`.trim()

return exports.padraoUso({
emoji: '📥',
titulo: `DOWNLOAD ${tipo}`,
uso,
descricao: `Informe ${tipo.toLowerCase().startsWith('link') ? 'o' : 'o nome ou link do'} ${tipo.toLowerCase()} para continuar.`
})
}

exports.downloadNaoEncontrado = tipo => {
return exports.padraoAviso({
emoji: '🔎',
titulo: `${tipo || 'CONTEÚDO'} NÃO ENCONTRADO`,
descricao: `Não encontrei ${String(tipo || 'conteúdo').toLowerCase()} para este pedido.`
})
}

exports.downloadSemMidia = tipo => {
return exports.padraoErro({
titulo: `${tipo || 'MÍDIA'} INDISPONÍVEL`,
descricao: `A API não retornou ${String(tipo || 'mídia').toLowerCase()} para este pedido.`
})
}

exports.funcaoUso = (emoji, titulo, prefix, comando, descricao) => {
return `- ${emoji} \`${titulo}\`

> ✅ ׄ ( ᴀᴛɪᴠᴀʀ: ${prefix}${comando} 1 )
> ❌ ׄ ( ᴅᴇsᴀᴛɪᴠᴀʀ: ${prefix}${comando} 0 )
> 🧊 ׄ ( ɪ️ ғᴜɴᴄ̧ᴀ̃ᴏ: ${descricao} )`
}

exports.funcaoAtivada = (emoji, titulo, descricao) => {
return `- ${emoji} \`${titulo}\`

> 📌 ׄ ( sᴛᴀᴛᴜs: 🟢 ᴀᴛɪᴠᴀᴅᴏ )
> 🧊 ׄ ( ɪ️ ғᴜɴᴄ̧ᴀ̃ᴏ: ${descricao} )`
}

exports.funcaoDesativada = (emoji, titulo, descricao) => {
return `- ${emoji} \`${titulo}\`

> 📌 ׄ ( sᴛᴀᴛᴜs: 🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ )
> 🧊 ׄ ( ɪ️ ғᴜɴᴄ̧ᴀ̃ᴏ: ${descricao} )`
}

const emojisSlotsFreeFire = [
'1️⃣',
'2️⃣',
'3️⃣',
'4️⃣',
'5️⃣',
'6️⃣'
]

const jogadoresDaSalaFreeFire = sessao => Array.isArray(sessao?.jogadores)
? sessao.jogadores
: []

const nomeSlotFreeFire = jogador => {
const nome = String(jogador?.nome || '').trim()
return nome || 'ᴠᴀɢᴏ'
}

const linhaTimeFreeFire = (jogadores, inicio, quantidade) => {
const linhas = []

for (let indice = 0; indice < quantidade; indice++) {
const jogador = jogadores[inicio + indice]
linhas.push(`> ${emojisSlotsFreeFire[indice]} ׄ ( ${nomeSlotFreeFire(jogador)} )`)
}

return linhas.join('\n')
}

const modoSalaFreeFire = sessao => tituloMono(String(sessao?.modo || '1x1'))

exports.modoFreeFireDesligado = prefix => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

> 🔴 ׄ ( ᴏ ᴍᴏᴅᴏ ғʀᴇᴇ ғɪʀᴇ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )
> ✅ ׄ ( ᴀᴛɪᴠᴇ ᴄᴏᴍ: ${prefix}modofreefire 1 )`
}

exports.salaFreeFireUso = prefix => {
return `- 📋 \`𝙻𝙸𝚂𝚃𝙰 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

> 🎮 ׄ ( ${prefix}sala 1x1 )
> 🎮 ׄ ( ${prefix}sala 2x2 )
> 🎮 ׄ ( ${prefix}sala 3x3 )
> 🎮 ׄ ( ${prefix}sala 4x4 )
> 🎮 ׄ ( ${prefix}sala 5x5 )
> 🎮 ׄ ( ${prefix}sala 6x6 )

> 📝 ׄ ( ᴅᴇᴘᴏɪs, ᴏ ʀᴇsᴘᴏɴsᴀ́ᴠᴇʟ ᴇɴᴠɪᴀ ᴀᴘᴇɴᴀs ᴏs ɴᴏᴍᴇs. )`
}

exports.salaFreeFireLista = (sessao, finalizada = false) => {
const porTime = Math.max(1, Math.min(6, Number(sessao?.porTime || 1)))
const jogadores = jogadoresDaSalaFreeFire(sessao)
const total = porTime * 2
const preenchidos = Math.min(jogadores.length, total)
const responsavel = String(sessao?.criador || '').split('@')[0]
const timeUm = linhaTimeFreeFire(jogadores, 0, porTime)
const timeDois = linhaTimeFreeFire(jogadores, porTime, porTime)
const instrucao = finalizada
? '> ✅ ׄ ( ʟɪsᴛᴀ ғɪɴᴀʟɪᴢᴀᴅᴀ. ᴏ ɢʀᴜᴘᴏ sᴇʀᴀ́ ᴀʙᴇʀᴛᴏ. )'
: '> ✍️ ׄ ( ᴏ ʀᴇsᴘᴏɴsᴀ́ᴠᴇʟ ᴅᴇᴠᴇ ᴇɴᴠɪᴀʀ ᴀᴘᴇɴᴀs ᴏs ɴᴏᴍᴇs. )'

return `- 📋 \`𝙻𝙸𝚂𝚃𝙰 ${modoSalaFreeFire(sessao)}\`

> 🧊 ׄ ( ᴛɪᴍᴇ 𝟷 )
${timeUm}

> ⚔️ ׄ ( ᴠᴇʀsᴜs )

> 🔥 ׄ ( ᴛɪᴍᴇ 𝟸 )
${timeDois}

> 👥 ׄ ( ᴊᴏɢᴀᴅᴏʀᴇs: ${preenchidos}/${total} )
> 👑 ׄ ( ʀᴇsᴘᴏɴsᴀ́ᴠᴇʟ: @${responsavel || 'desconhecido'} )
${instrucao}`
}

exports.salaFreeFireChamada = sessao => {
const porTime = Math.max(1, Math.min(6, Number(sessao?.porTime || 1)))
const jogadores = jogadoresDaSalaFreeFire(sessao)
const timeUm = linhaTimeFreeFire(jogadores, 0, porTime)
const timeDois = linhaTimeFreeFire(jogadores, porTime, porTime)

return `- 📢 \`𝙲𝙷𝙰𝙼𝙰𝙳𝙰 ${modoSalaFreeFire(sessao)}\`

> 🧊 ׄ ( ᴛɪᴍᴇ 𝟷 )
${timeUm}

> ⚔️ ׄ ( ᴠᴇʀsᴜs )

> 🔥 ׄ ( ᴛɪᴍᴇ 𝟸 )
${timeDois}

> 📢 ׄ ( ᴊᴏɢᴀᴅᴏʀᴇs, ᴘʀᴇᴘᴀʀᴇᴍ-sᴇ. )
> ⚔️ ׄ ( ᴀ ᴘᴀʀᴛɪᴅᴀ ᴠᴀɪ ᴄᴏᴍᴇᴄ̧ᴀʀ. )`
}

exports.salaFreeFireResponsavel = responsavel => {
return `- 🔒 \`𝙻𝙸𝚂𝚃𝙰 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙰\`

> 👑 ׄ ( sᴏᴍᴇɴᴛᴇ @${String(responsavel || '').split('@')[0]} ᴘᴏᴅᴇ ᴄᴏɴᴛʀᴏʟᴀʀ ᴇsᴛᴀ ʟɪsᴛᴀ. )`
}

exports.salaFreeFireCancelada = () => {
return `- ❌ \`𝙻𝙸𝚂𝚃𝙰 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰\`

> 🔓 ׄ ( ᴀ ʟɪsᴛᴀ ғᴏɪ ᴇɴᴄᴇʀʀᴀᴅᴀ ᴇ ᴏ ɢʀᴜᴘᴏ ғᴏɪ ᴀʙᴇʀᴛᴏ. )`
}

exports.funcaoInvalida = (prefix, comando) => {
return `- ❌ \`𝙾𝙿𝙲̧𝙰̃𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\`

> ❌ ׄ ( ${prefix}${comando} 1 — ᴜsᴇ ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ. )
> ❌ ׄ ( ${prefix}${comando} 0 — ᴜsᴇ ᴘᴀʀᴀ ᴅᴇsᴀᴛɪᴠᴀʀ. 🙇‍♂️ )`
}

exports.novaSolicitacao = (numero, grupo) => {
return `- 📥 \`𝙽𝙾𝚅𝙰 𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾\`

> 📥 ׄ ( @${numero} — ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴇsᴛᴀ́ sᴏʟɪᴄɪᴛᴀɴᴅᴏ ᴇɴᴛʀᴀᴅᴀ ɴᴏ ɢʀᴜᴘᴏ. )

> 📥 ׄ ( ${grupo} — ᴇsᴄᴏʟʜᴀ ᴀʙᴀɪxᴏ sᴇ ᴅᴇsᴇᴊᴀ ᴀᴘʀᴏᴠᴀʀ ᴏᴜ ʀᴇᴄᴜsᴀʀ ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ. 🙇‍♂️ )`
}

exports.semPedidos = () => {
return `- 📥 \`𝙽𝙴𝙽𝙷𝚄𝙼 𝙿𝙴𝙳𝙸𝙳𝙾\`

> 📥 ׄ ( ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴇɴʜᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴘᴇɴᴅᴇɴᴛᴇ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.pedidoIndisponivel = numero => {
return `- ❌ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙸𝙽𝙳𝙸𝚂𝙿𝙾𝙽𝙸́𝚅𝙴𝙻\`

> ❌ ׄ ( @${numero} — ᴇssᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴍᴀɪs ᴅɪsᴘᴏɴɪ́ᴠᴇʟ. 🙇‍♂️ )`
}

exports.pedidoAprovado = numero => {
return `- ✅ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙰\`

> ✅ ׄ ( @${numero} — ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.pedidoRecusado = numero => {
return `- ❌ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙰\`

> ❌ ׄ ( @${numero} — ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ғᴏɪ ʀᴇᴄᴜsᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.aprovacaoAutomatica = quantidade => {
return `- ✅ \`𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

> ✅ ׄ ( ${quantidade} — ${quantidade === 1 ? 'ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ' : 'sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ᴀᴘʀᴏᴠᴀᴅᴀs'} ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ. 🙇‍♂️ )`
}

exports.pedidosPendentes = pedidos => {
let texto = `- 📥 \`𝙿𝙴𝙳𝙸𝙳𝙾𝚂 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴𝚂\`

> 📥 ׄ ( ${pedidos.length} — ${pedidos.length === 1 ? 'ᴇxɪsᴛᴇ ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴘᴇɴᴅᴇɴᴛᴇ.' : 'ᴇxɪsᴛᴇᴍ sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴘᴇɴᴅᴇɴᴛᴇs.'} )`
for (let i = 0; i < pedidos.length; i++)
texto += `\n\n> 📥 ׄ ( ${i + 1} — @${String(pedidos[i].jid || '').split('@')[0]} )`
return texto
}

exports.todosAprovados = quantidade => {
return `- ✅ \`𝚃𝙾𝙳𝙾𝚂 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙾𝚂\`

> ✅ ׄ ( ${quantidade} — ${quantidade === 1 ? 'ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ' : 'sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ᴀᴘʀᴏᴠᴀᴅᴀs'} ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.todosRecusados = quantidade => {
return `- ❌ \`𝚃𝙾𝙳𝙾𝚂 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾𝚂\`

> ❌ ׄ ( ${quantidade} — ${quantidade === 1 ? 'ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ʀᴇᴄᴜsᴀᴅᴀ' : 'sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ғᴏʀᴀᴍ ʀᴇᴄᴜsᴀᴅᴀs'} ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
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

> 🧊 ׄ ( @${numero} — ${atual[2]}. 🙇‍♂️ )`
}

exports.detectorUso = prefix => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> 👁️ ׄ ( ${prefix}detector 5511999999999 — ᴄᴏɴᴇᴄᴛᴀ ᴏ sᴇɢᴜɴᴅᴏ ɴᴜ́ᴍᴇʀᴏ ᴘᴏʀ ᴄᴏ́ᴅɪɢᴏ. )
> 👁️ ׄ ( ${prefix}detector status — ᴍᴏsᴛʀᴀ ᴏ ᴇsᴛᴀᴅᴏ ᴅᴀ sᴇssᴀ̃ᴏ ᴅᴇᴛᴇᴄᴛᴏʀᴀ. )
> 👁️ ׄ ( ${prefix}detector sair — ᴅᴇsᴄᴏɴᴇᴄᴛᴀ ᴇ ᴀᴘᴀɢᴀ ᴀ sᴇssᴀ̃ᴏ ᴅᴏ ᴅᴇᴛᴇᴄᴛᴏʀ. )

> 👁️ ׄ ( ᴏ ɴᴜ́ᴍᴇʀᴏ ᴅᴇᴛᴇᴄᴛᴏʀ ᴅᴇᴠᴇ ғɪᴄᴀʀ ɴᴏ ɢʀᴜᴘᴏ ᴄᴏᴍᴏ ᴍᴇᴍʙʀᴏ ɴᴏʀᴍᴀʟ, sᴇᴍ ᴀᴅᴍ. 🙇‍♂️ )`
}

exports.detectorNumero = prefix => {
return `- ❌ \`𝙽𝚄́𝙼𝙴𝚁𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> ❌ ׄ ( ${prefix}detector 5511999999999 — ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴄᴏᴍ ᴅᴅɪ + ᴅᴅᴅ + ɴᴜ́ᴍᴇʀᴏ. 🙇‍♂️ )`
}

exports.detectorCodigo = (numero, codigo) => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> 👁️ ׄ ( ${numero} — ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ᴅᴇᴛᴇᴄᴛᴏʀ. )
> 👁️ ׄ ( ${codigo} — ᴄᴏ́ᴅɪɢᴏ ᴅᴇ ᴘᴀʀᴇᴀᴍᴇɴᴛᴏ. )

> 👁️ ׄ ( ᴡʜᴀᴛsᴀᴘᴘ > ᴀᴘᴀʀᴇʟʜᴏs ᴄᴏɴᴇᴄᴛᴀᴅᴏs > ᴄᴏɴᴇᴄᴛᴀʀ ᴄᴏᴍ ɴᴜ́ᴍᴇʀᴏ ᴅᴇ ᴛᴇʟᴇғᴏɴᴇ. )
> 👁️ ׄ ( ᴅᴇᴘᴏɪs ᴄᴏʟᴏǫᴜᴇ ᴇssᴇ ɴᴜ́ᴍᴇʀᴏ ɴᴏ ɢʀᴜᴘᴏ ᴄᴏᴍᴏ ᴍᴇᴍʙʀᴏ ɴᴏʀᴍᴀʟ, sᴇᴍ ᴀᴅᴍ. 🙇‍♂️ )`
}

exports.detectorStatus = dados => {
const ligado = dados?.conectado ? 'ᴄᴏɴᴇᴄᴛᴀᴅᴏ ✅' : dados?.registrado ? 'ʀᴇɢɪsᴛʀᴀᴅᴏ, ᴍᴀs ᴏғғʟɪɴᴇ ⚠️' : 'ɴᴀ̃ᴏ ᴄᴏɴᴇᴄᴛᴀᴅᴏ ❌'
const numero = dados?.numero || 'ɴᴀ̃ᴏ ɪᴅᴇɴᴛɪғɪᴄᴀᴅᴏ'
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> 👁️ ׄ ( sᴛᴀᴛᴜs: ${ligado} )
> 👁️ ׄ ( ɴᴜ́ᴍᴇʀᴏ: ${numero} )
> 👁️ ׄ ( ᴄᴀᴘᴛᴜʀᴀ ᴍᴇɴsᴀɢᴇɴs ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ ᴄᴏᴍᴏ ᴍᴇᴍʙʀᴏ ᴇ ᴇɴᴛʀᴇɢᴀ ᴀ ᴄʜᴀᴠᴇ ᴘᴀʀᴀ ᴀ ᴛᴏᴋɪᴛᴏ ᴀᴅᴍ. )`
}

exports.detectorConectado = (numero, conectado) => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> 👁️ ׄ ( ${numero || 'ᴅᴇᴛᴇᴄᴛᴏʀ'} — ${conectado ? 'ᴀ sᴇssᴀ̃ᴏ ᴊᴀ ᴇsᴛᴀ́ ᴄᴏɴᴇᴄᴛᴀᴅᴀ ✅' : 'ᴀ sᴇssᴀ̃ᴏ ᴊᴀ ᴇsᴛᴀ́ ʀᴇɢɪsᴛʀᴀᴅᴀ ᴇ ᴇsᴛᴀ́ ʀᴇᴄᴏɴᴇᴄᴛᴀɴᴅᴏ. ⚠️'} )`
}

exports.detectorSaiu = () => {
return `- 👁️ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> 👁️ ׄ ( ᴏ ᴅᴇᴛᴇᴄᴛᴏʀ ғᴏɪ ᴅᴇsᴄᴏɴᴇᴄᴛᴀᴅᴏ ᴇ ᴀ sᴇssᴀ̃ᴏ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. ✅ )`
}

exports.detectorErro = () => {
return `- ❌ \`𝙳𝙴𝚃𝙴𝙲𝚃𝙾𝚁 𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴᴇᴄᴛᴀʀ ᴏ ᴅᴇᴛᴇᴄᴛᴏʀ ᴀɢᴏʀᴀ. ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️ )`
}

exports.antiPayTextoEditado = () => {
return 'ᴀᴀᴀ ᴇᴜ ᴛᴇɴᴛᴇɪ ᴍᴀɴᴅᴀʀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ ᴍᴀs ᴇᴜ ᴛᴏᴍᴇɪ ʙᴀɴ'
}

exports.antiPayRemocao = (numero, removido = true) => {
return `- 💳 \`𝙰𝙽𝚃𝙸-𝙿𝙰𝚈\`

> 💳 ׄ ( @${numero} — ${removido ? 'ᴇɴᴠɪᴏᴜ ᴜᴍᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ, ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ ᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ' : 'ᴇɴᴠɪᴏᴜ ᴜᴍᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ, ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ, ᴍᴀs ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇᴍᴏᴠᴇʀ ᴏ ᴜsᴜᴀ́ʀɪᴏ'}. 🙇‍♂️ )`
}

exports.antiBloqueio = (emoji, titulo, numero, descricao) => {
return `- ${emoji} \`${titulo}\`

> 🧊 ׄ ( @${numero} — ${descricao} 🙇‍♂️ )`
}

exports.antiRemocao = (emoji, titulo, numero, motivo, removido = true) => {
return `- ${emoji} \`${titulo}\`

> 🧊 ׄ ( @${numero} — ${removido ? `ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴘᴏʀ ${motivo}` : `ᴇɴᴠɪᴏᴜ ᴜᴍ ᴄᴏɴᴛᴇᴜ́ᴅᴏ ᴘʀᴏɪʙɪᴅᴏ, ᴍᴀs ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇᴍᴏᴠᴇʀ`}. 🙇‍♂️ )`
}

exports.antiSpamEspera = (numero, segundos) => {
return `- ⏳ \`𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼\`

> ⏳ ׄ ( @${numero} — ᴀɢᴜᴀʀᴅᴇ ${segundos} sᴇɢᴜɴᴅᴏs ᴘᴀʀᴀ ᴜsᴀʀ ᴄᴏᴍᴀɴᴅᴏs ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️ )`
}

exports.antiSpamAdvertencia = (numero, advertencias, segundos, faltam) => {
return `- 🚨 \`𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼\`

> 🚨 ׄ ( @${numero} — ʀᴇᴄᴇʙᴇᴜ ${advertencias}/5 ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀ ᴘᴏʀ sᴘᴀᴍ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs. )

> 🚨 ׄ ( ${segundos} sᴇɢᴜɴᴅᴏs — ᴛᴇᴍᴘᴏ ᴅᴇ ʙʟᴏǫᴜᴇɪᴏ. )
> 🚨 ׄ ( ${faltam} — ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs ʀᴇsᴛᴀɴᴛᴇs ᴘᴀʀᴀ ᴀ ʀᴇᴍᴏᴄ̧ᴀ̃ᴏ. 🙇‍♂️ )`
}

exports.antiSpamRemovido = numero => {
return `- 🚫 \`𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼\`

> 🚫 ׄ ( @${numero} — ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴘᴏʀ ᴀᴛɪɴɢɪʀ 5 ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs ᴅᴇ sᴘᴀᴍ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs. 🙇‍♂️ )`
}

exports.x9MensagemApagada = (autor, apagou, tipo, conteudo) => {
return `- 🗑️ \`𝚇𝟿 𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙰𝙿𝙰𝙶𝙰𝙳𝙰\`

> 🗑️ ׄ ( @${autor} — ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴇɴᴠɪᴏᴜ ᴀ ${tipo}. )
> 🗑️ ׄ ( @${apagou} — ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴀᴘᴀɢᴏᴜ ᴀ ᴍᴇɴsᴀɢᴇᴍ. )
> 🗑️ ׄ ( ${conteudo || 'sᴇᴍ ᴛᴇxᴛᴏ'} — ᴄᴏɴᴛᴇᴜ́ᴅᴏ ʀᴇᴄᴜᴘᴇʀᴀᴅᴏ. 🙇‍♂️ )`
}

exports.x9Enquete = (numero, enquete, opcoes, alterou = false) => {
return `- 🗳️ \`𝚇𝟿 ${alterou ? '𝚅𝙾𝚃𝙾 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾' : '𝙽𝙾𝚅𝙾 𝚅𝙾𝚃𝙾'}\`

> 🗳️ ׄ ( @${numero} — ${alterou ? 'ᴀʟᴛᴇʀᴏᴜ ᴏ ᴠᴏᴛᴏ' : 'ᴠᴏᴛᴏᴜ'} ɴᴀ ᴇɴǫᴜᴇᴛᴇ 『 ${enquete} 』. )
> 🗳️ ׄ ( ${opcoes || 'ɴᴇɴʜᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ'} — ᴏᴘᴄ̧ᴀ̃ᴏ sᴇʟᴇᴄɪᴏɴᴀᴅᴀ. 🙇‍♂️ )`
}

exports.x9Grupo = (emoji, titulo, autor, descricao, valor = '') => {
return `- ${emoji} \`𝚇𝟿 ${titulo}\`

> 🧊 ׄ ( @${autor} — ${descricao}${valor ? ` 『 ${valor} 』` : ''}. 🙇‍♂️ )`
}

exports.x9Participante = (emoji, titulo, autor, alvo, descricao) => {
return `- ${emoji} \`𝚇𝟿 ${titulo}\`

> 🧊 ׄ ( @${autor} — ${descricao} 『 @${alvo} 』. 🙇‍♂️ )`
}
exports.x9Saiu = numero => {
return `- 🚪 \`𝚇𝟿 𝙼𝙴𝙼𝙱𝚁𝙾 𝚂𝙰𝙸𝚄\`

> 🚪 ׄ ( @${numero} — sᴀɪᴜ ᴅᴏ ɢʀᴜᴘᴏ. 👋 )`
}
exports.reiniciarBot = () => {
return `- 🔄 \`𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾\`

> 🔄 ׄ ( ᴏᴋᴀʏ ᴍᴇsᴛʀᴇ, ɪʀᴇɪ ʀᴇɪɴɪᴄɪᴀʀ ᴏ ʙᴏᴛ. 🙇‍♂️ )`
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
return `> 🧊 ׄ ( ${prefix}play_audio ${url} — ᴜsᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴀᴏ ʟᴀᴅᴏ ᴘᴀʀᴀ ʙᴀɪxᴀʀ ᴇᴍ ᴀ́ᴜᴅɪᴏ. )
> 🧊 ׄ ( ${prefix}play_video ${url} — ᴜsᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴀᴏ ʟᴀᴅᴏ ᴘᴀʀᴀ ʙᴀɪxᴀʀ ᴇᴍ ᴠɪ́ᴅᴇᴏ. 🙇‍♂️ )`
}

exports.novaSolicitacaoSemBotoes = (n, g) => {
return `-  \`𝙽𝙾𝚅𝙰 𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${n} )
> 👥 ׄ ( ɢʀᴜᴘᴏ: ${g} )

> ✅ ׄ ( 1: ᴀᴘʀᴏᴠᴀʀ ᴇɴᴛʀᴀᴅᴀ )
> ❌ ׄ ( 2: ʀᴇᴄᴜsᴀʀ ᴇɴᴛʀᴀᴅᴀ )

> \`𝙽𝙾𝚅𝙰 ׄ ( ᴜᴍ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴇᴠᴇ ʀᴇsᴘᴏɴᴅᴇʀ ᴇsᴛᴀ ᴍᴇɴsᴀɢᴇᴍ ᴄᴏᴍ 1 ᴏᴜ 2. )`
}

exports.solicitacaoRespondida = (u, a, ok) => {
return ok
? `-  \`𝙽𝙾𝚅𝙾 𝙼𝙴𝙼𝙱𝚁𝙾 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙾\` 🎉

> 👤 ׄ ( ᴍᴇᴍʙʀᴏ: @${u} )
> 🛡️ ׄ ( ᴀᴘʀᴏᴠᴀᴅᴏ ᴘᴏʀ: @${a} )
> ✅ ׄ ( ᴇɴᴛʀᴀᴅᴀ ᴀᴜᴛᴏʀɪᴢᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )

> \`𝙽𝙾𝚅𝙾 ׄ ( sᴇᴊᴀ ʙᴇᴍ-ᴠɪɴᴅᴏ(ᴀ) ᴀᴏ ɢʀᴜᴘᴏ, @${u}! ᴇsᴘᴇʀᴀᴍᴏs ǫᴜᴇ ᴀᴘʀᴏᴠᴇɪᴛᴇ ᴇ ʀᴇsᴘᴇɪᴛᴇ ᴀs ʀᴇɢʀᴀs. 🧊✨ )`
: `-  \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙰\` ❌

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${u} )
> 🛡️ ׄ ( ʀᴇᴄᴜsᴀᴅᴏ ᴘᴏʀ: @${a} )
> ❌ ׄ ( sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ʀᴇᴄᴜsᴀᴅᴀ. )

> \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 ׄ ( ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴅᴇ @${u} ɴᴀ̃ᴏ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ ᴘᴇʟᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴄ̧ᴀ̃ᴏ. )`
}

exports.solicitacaoIndisponivel = u => {
return `-  \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙸𝙽𝙳𝙸𝚂𝙿𝙾𝙽𝙸́𝚅𝙴𝙻\` ⚠️

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${u} )
> ⚠️ ׄ ( ᴇsᴛᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴍᴀɪs ᴘᴇɴᴅᴇɴᴛᴇ. )

> \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 ׄ ( ᴇʟᴀ ᴘᴏᴅᴇ ᴛᴇʀ sɪᴅᴏ ᴀᴘʀᴏᴠᴀᴅᴀ, ʀᴇᴄᴜsᴀᴅᴀ ᴏᴜ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴀɴᴛᴇʀɪᴏʀᴍᴇɴᴛᴇ. )`
}
exports.modoJogosDescricao = () => {
return `ᴀᴛɪᴠᴀ ᴏs ᴊᴏɢᴏs ᴇ ᴀs ʀᴇsᴘᴏsᴛᴀs ᴀᴜᴛᴏᴍᴀ́ᴛɪᴄᴀs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.`
}

exports.modoJogosDesligadoDescricao = () => {
return `ᴅᴇsᴀᴛɪᴠᴀ ᴏs ᴊᴏɢᴏs ᴇ ᴀs ᴘᴀʀᴛɪᴅᴀs ᴀᴜᴛᴏᴍᴀ́ᴛɪᴄᴀs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.`
}

exports.modoJogosJaAtivado = () => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 🎮 ׄ ( ᴏ ᴍᴏᴅᴏ ᴊᴏɢᴏs ᴊᴀ́ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.modoJogosJaDesativado = () => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 🎮 ׄ ( ᴏ ᴍᴏᴅᴏ ᴊᴏɢᴏs ᴊᴀ́ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.modoJogosDesativado = prefix => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 🎮 ׄ ( ${prefix}modojogos 1 — ᴏ ᴍᴏᴅᴏ ᴊᴏɢᴏs ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ, ᴜᴍ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴅᴇᴠᴇ ᴜsᴀʀ ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴀᴏ ʟᴀᴅᴏ ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ. 🙇‍♂️ )`
}

exports.botoesUso = (prefix, command) => {
return `- 🧊 \`𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝚁 𝙱𝙾𝚃𝙾̃𝙴𝚂\`

> 🧊 ׄ ( ${prefix}${command} 1 — ᴀᴛɪᴠᴀ ᴏs ʙᴏᴛᴏ̃ᴇs ɴᴀs ᴍᴇɴsᴀɢᴇɴs ᴅᴏ ʙᴏᴛ. )
> 🧊 ׄ ( ${prefix}${command} 0 — ᴅᴇsᴀᴛɪᴠᴀ ᴏs ʙᴏᴛᴏ̃ᴇs ᴇ ᴍᴀɴᴛᴇ́ᴍ ᴀs ʀᴇsᴘᴏsᴛᴀs ɴᴏʀᴍᴀɪs. 🙇‍♂️ )`
}

exports.botoesAtivados = () => {
return `- ✅ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> ✅ ׄ ( ᴏs ʙᴏᴛᴏ̃ᴇs ғᴏʀᴀᴍ ᴀᴛɪᴠᴀᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ ᴇ ᴠᴏʟᴛᴀʀᴀ̃ᴏ ᴀ ᴀᴘᴀʀᴇᴄᴇʀ ɴᴀs ᴍᴇɴsᴀɢᴇɴs. 🙇‍♂️ )`
}

exports.botoesDesativados = () => {
return `- ❌ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> ❌ ׄ ( ᴏs ʙᴏᴛᴏ̃ᴇs ғᴏʀᴀᴍ ᴅᴇsᴀᴛɪᴠᴀᴅᴏs, ᴍᴀs ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴄᴏɴᴛɪɴᴜᴀᴍ ғᴜɴᴄɪᴏɴᴀɴᴅᴏ ɴᴏʀᴍᴀʟᴍᴇɴᴛᴇ. 🙇‍♂️ )`
}

exports.botoesJaAtivados = () => {
return `- ⚠️ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙹𝙰́ 𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> ⚠️ ׄ ( ᴏs ʙᴏᴛᴏ̃ᴇs ᴊᴀ́ ᴇsᴛᴀ̃ᴏ ᴀᴛɪᴠᴀᴅᴏs ɴᴏ ʙᴏᴛ. 🙇‍♂️ )`
}

exports.botoesJaDesativados = () => {
return `- ⚠️ \`𝙱𝙾𝚃𝙾̃𝙴𝚂 𝙹𝙰́ 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾𝚂\`

> ⚠️ ׄ ( ᴏs ʙᴏᴛᴏ̃ᴇs ᴊᴀ́ ᴇsᴛᴀ̃ᴏ ᴅᴇsᴀᴛɪᴠᴀᴅᴏs ɴᴏ ʙᴏᴛ. 🙇‍♂️ )`
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

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname || 'Usuário'} )
> 🏃‍♂️ ׄ ( ᴠᴇʟᴏᴄɪᴅᴀᴅᴇ: ${speedConverted} s )
> 🦾 ׄ ( ʟᴀᴛᴇ̂ɴᴄɪᴀ: ${latency} ᴍs )
> 🖥️ ׄ ( sɪsᴛᴇᴍᴀ: ${sistema} )
> 🧠 ׄ ( ᴍᴇᴍᴏ́ʀɪᴀ ʀᴀᴍ: ${ramUsada} ɢʙ / ${ramTotal} ɢʙ )
> ⚙️ ׄ ( ʙᴀɪʟᴇʏs: ${baileysV} )
> 💻 ׄ ( ᴄᴘᴜ: ${cpu}% )
> 📡 ׄ ( ɴᴏᴅᴇ.ᴊs: ${nodejs} )
> 👥 ׄ ( ɢʀᴜᴘᴏs ᴀᴛɪᴠᴏs: ${totalGrupos} )
> 📊 ׄ ( ᴄᴏᴍᴀɴᴅᴏs: ${totalCmd} )
> ⏰ ׄ ( ᴛᴇᴍᴘᴏ ᴏɴʟɪɴᴇ: ${tempoOnline} )`
}

exports.jogoTemaPadrao = () => {
return `ɢᴇʀᴀʟ`
}

exports.jogoDicaPadrao = () => {
return `sᴇᴍ ᴅɪᴄᴀ`
}

exports.jogoMarquePessoa = (prefix, comando) => {
return `- 👤 \`𝙼𝙰𝚁𝚀𝚄𝙴 𝙾 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

> 👤 ׄ ( ${prefix}${comando} @𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 — ᴍᴀʀǫᴜᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴏᴜ ʀᴇsᴘᴏɴᴅᴀ ᴀ̀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴀ ᴘᴇssᴏᴀ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴅᴇsᴀғɪᴀʀ. 🙇‍♂️ )`
}

exports.jogoNaoPodeDesafiar = () => {
return `- ❌ \`𝙳𝙴𝚂𝙰𝙵𝙸𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> ❌ ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sᴇ ᴅᴇsᴀғɪᴀʀ. 🙇‍♂️ )`
}

exports.jogoDesafioRecusado = alvo => {
return `- 😕 \`𝙳𝙴𝚂𝙰𝙵𝙸𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾\`

> 😕 ׄ ( ${alvo} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ʀᴇᴄᴜsᴏᴜ ᴏ ᴄᴏɴᴠɪᴛᴇ ᴘᴀʀᴀ ᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️ )`
}

exports.adivinheSemPartida = () => {
return `- ❌ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.adivinheCancelado = () => {
return `- ✅ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> ✅ ׄ ( ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.adivinheEmAndamento = () => {
return `- ⚠️ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.adivinheArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴀʟᴀᴠʀᴀ ᴠᴀ́ʟɪᴅᴀ ᴄᴏᴍ 5 ʟᴇᴛʀᴀs. 🙇‍♂️ )`
}

exports.adivinheErro = () => {
return `- ❌ \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴀᴅɪᴠɪɴʜᴇ ᴀ ᴘᴀʟᴀᴠʀᴀ. 🙇‍♂️ )`
}

exports.jogoAdivinhe = (game, jogador, mencionar) => {
let texto = `- 🧩 \`𝙰𝙳𝙸𝚅𝙸𝙽𝙷𝙴 𝙰 𝙿𝙰𝙻𝙰𝚅𝚁𝙰\`

> 🧩 ׄ ( ᴛᴇᴍᴀ: ${game.tema} )
> 🧩 ׄ ( ᴅɪᴄᴀ: ${game.dica} )
> 🧩 ׄ ( ᴛᴇɴᴛᴀᴛɪᴠᴀs: ${(game.tentativas || []).length}/6 )`
if (game.finalizado && game.venceu)
texto += `
> 🧩 ׄ ( sᴛᴀᴛᴜs: ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ )
> 🧩 ׄ ( ᴠᴇɴᴄᴇᴅᴏʀ: ${mencionar(jogador)} )
> 🧩 ׄ ( ᴘᴀʟᴀᴠʀᴀ: ${game.palavra.toUpperCase()} )`
else if (game.finalizado)
texto += `
> 🧩 ׄ ( sᴛᴀᴛᴜs: ᴠᴏᴄᴇ̂ ᴘᴇʀᴅᴇᴜ )
> 🧩 ׄ ( ᴘᴀʟᴀᴠʀᴀ ᴄᴏʀʀᴇᴛᴀ: ${game.palavra.toUpperCase()} )`
else
texto += `
> 🧩 ׄ ( sᴛᴀᴛᴜs: ᴊᴏɢᴏ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ )`
return texto
}

exports.quizSemPartida = () => {
return `- ❌ \`𝚀𝚄𝙸𝚉\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ǫᴜɪᴢ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.quizCancelado = () => {
return `- ✅ \`𝚀𝚄𝙸𝚉\`

> ✅ ׄ ( ᴏ ǫᴜɪᴢ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.quizEmAndamento = () => {
return `- ⚠️ \`𝚀𝚄𝙸𝚉\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍ ǫᴜɪᴢ ᴀᴛɪᴠᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.quizArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴇʀɢᴜɴᴛᴀ ᴠᴀ́ʟɪᴅᴀ. 🙇‍♂️ )`
}

exports.quizErro = () => {
return `- ❌ \`𝚀𝚄𝙸𝚉\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴏ ǫᴜɪᴢ. 🙇‍♂️ )`
}

exports.jogoQuiz = (game, estado, respondedor, mencionar) => {
let texto = `- 🧠 \`𝚀𝚄𝙸𝚉\`

> 🧠 ׄ ( ᴄᴀᴛᴇɢᴏʀɪᴀ: ${game.categoria} )`
if (estado === 'jogando')
texto += `
> 🧠 ׄ ( ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ )
> 🧠 ׄ ( ʀᴇsᴘᴏsᴛᴀ: 1, 2, 3 ᴏᴜ 4 )`
if (estado === 'acertou')
texto += `
> 🧠 ׄ ( ʀᴇsᴘᴏɴᴅᴇᴜ: ${mencionar(respondedor)} )
> 🧠 ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ʀᴇsᴘᴏsᴛᴀ ᴄᴏʀʀᴇᴛᴀ )`
if (estado === 'errou')
texto += `
> 🧠 ׄ ( ʀᴇsᴘᴏɴᴅᴇᴜ: ${mencionar(respondedor)} )
> 🧠 ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ʀᴇsᴘᴏsᴛᴀ ᴇʀʀᴀᴅᴀ )
> 🧠 ׄ ( ᴄᴏʀʀᴇᴛᴀ: ${game.correta} — ${game.opcoes[game.correta - 1]} )`
return texto
}

exports.jogoQuizFinalizado = () => {
return `- 🧠 \`𝚀𝚄𝙸𝚉\`

> 🧠 ׄ ( ᴛᴏᴅᴀs ᴀs ᴘᴇʀɢᴜɴᴛᴀs ᴅᴏ ǫᴜɪᴢ ᴊᴀ́ ғᴏʀᴀᴍ ᴜsᴀᴅᴀs. 🙇‍♂️ )`
}

exports.forcaSemPartida = () => {
return `- ❌ \`𝙵𝙾𝚁𝙲𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.forcaCancelada = () => {
return `- ✅ \`𝙵𝙾𝚁𝙲𝙰\`

> ✅ ׄ ( ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.forcaEmAndamento = () => {
return `- ⚠️ \`𝙵𝙾𝚁𝙲𝙰\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.forcaArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴀʟᴀᴠʀᴀ ᴠᴀ́ʟɪᴅᴀ. 🙇‍♂️ )`
}

exports.forcaErro = () => {
return `- ❌ \`𝙵𝙾𝚁𝙲𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ғᴏʀᴄᴀ. 🙇‍♂️ )`
}

exports.jogoForca = (game, palavraFormatada) => {
let texto = `- 🔤 \`𝙵𝙾𝚁𝙲𝙰\`

> 🔤 ׄ ( ᴘᴀʟᴀᴠʀᴀ: ${palavraFormatada} )
> 🔤 ׄ ( ᴛᴇᴍᴀ: ${game.tema} )
> 🔤 ׄ ( ᴅɪᴄᴀ: ${game.dica} )
> 🔤 ׄ ( ᴇʀʀᴏs: ${game.erros}/6 )
> 🔤 ׄ ( ᴇʀʀᴀᴅᴀs: ${game.letrasErradas.length ? game.letrasErradas.join(', ').toUpperCase() : 'ɴᴇɴʜᴜᴍᴀ'} )`
if (game.finalizado && game.venceu)
texto += `
> 🔤 ׄ ( sᴛᴀᴛᴜs: ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ )`
else if (game.finalizado)
texto += `
> 🔤 ׄ ( sᴛᴀᴛᴜs: ᴠᴏᴄᴇ̂ ᴘᴇʀᴅᴇᴜ )
> 🔤 ׄ ( ᴘᴀʟᴀᴠʀᴀ ᴄᴏʀʀᴇᴛᴀ: ${game.palavra.toUpperCase()} )`
else
texto += `
> 🔤 ׄ ( sᴛᴀᴛᴜs: ᴊᴏɢᴏ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ )`
return texto
}

exports.jogoLetraUsada = () => {
return `- 🔤 \`𝙵𝙾𝚁𝙲𝙰\`

> 🔤 ׄ ( ᴇssᴀ ʟᴇᴛʀᴀ ᴊᴀ́ ғᴏɪ ᴜsᴀᴅᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️ )`
}

exports.cacaSemPartida = () => {
return `- ❌ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.cacaCancelada = () => {
return `- ✅ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> ✅ ׄ ( ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.cacaEmAndamento = () => {
return `- ⚠️ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.cacaArquivoVazio = () => {
return `- ❌ \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝚅𝙰𝚉𝙸𝙾\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇɴʜᴜᴍᴀ ᴘᴀʟᴀᴠʀᴀ ᴠᴀ́ʟɪᴅᴀ. 🙇‍♂️ )`
}

exports.cacaErro = () => {
return `- ❌ \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴄᴀᴄ̧ᴀ-ᴘᴀʟᴀᴠʀᴀs. 🙇‍♂️ )`
}

exports.jogoCacaPalavras = (game, jogador, mencionar) => {
let texto = `- 🔎 \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> 🔎 ׄ ( ᴛᴇᴍᴀ: ${game.tema} )
> 🔎 ׄ ( ᴇɴᴄᴏɴᴛʀᴀᴅᴀs: ${game.encontradas.length}/${game.palavras.length} )`
if (game.finalizado)
texto += `
> 🔎 ׄ ( sᴛᴀᴛᴜs: ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ )
> 🔎 ׄ ( ᴠᴇɴᴄᴇᴅᴏʀ: ${mencionar(jogador)} )`
else
texto += `
> 🔎 ׄ ( sᴛᴀᴛᴜs: ᴊᴏɢᴏ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ )
> 🔎 ׄ ( ᴀ ᴘᴀʟᴀᴠʀᴀ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ )`
return texto
}

exports.jogoPalavraEncontrada = () => {
return `- 🔎 \`𝙲𝙰𝙲̧𝙰-𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂\`

> 🔎 ׄ ( ᴇssᴀ ᴘᴀʟᴀᴠʀᴀ ᴊᴀ́ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️ )`
}

exports.minesSemPartida = () => {
return `- ❌ \`𝙼𝙸𝙽𝙴𝚂\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴍɪɴᴇs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.minesCancelado = () => {
return `- ✅ \`𝙼𝙸𝙽𝙴𝚂\`

> ✅ ׄ ( ᴏ ᴍɪɴᴇs ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.minesEmAndamento = () => {
return `- ⚠️ \`𝙼𝙸𝙽𝙴𝚂\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴍɪɴᴇs ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.minesErro = () => {
return `- ❌ \`𝙼𝙸𝙽𝙴𝚂\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴍɪɴᴇs. 🙇‍♂️ )`
}

exports.jogoMines = (game, jogador, mencionar) => {
const totalSeguras = 25 - game.bombas.length
const abertasSeguras = game.abertas.filter(numero => !game.bombas.includes(numero)).length
let texto = `- 💣 \`𝙼𝙸𝙽𝙴𝚂\`

> 💣 ׄ ( ʙᴏᴍʙᴀs: ${game.bombas.length} )
> 💣 ׄ ( ᴀʙᴇʀᴛᴀs: ${abertasSeguras}/${totalSeguras} )`
if (game.finalizado && game.ganhou)
texto += `
> 💣 ׄ ( sᴛᴀᴛᴜs: ᴠᴏᴄᴇ̂ ᴠᴇɴᴄᴇᴜ )
> 💣 ׄ ( ᴠᴇɴᴄᴇᴅᴏʀ: ${mencionar(jogador)} )`
else if (game.finalizado)
texto += `
> 💣 ׄ ( sᴛᴀᴛᴜs: ᴠᴏᴄᴇ̂ ᴘᴇʀᴅᴇᴜ )
> 💣 ׄ ( ᴊᴏɢᴀᴅᴏʀ: ${mencionar(jogador)} )`
else
texto += `
> 💣 ׄ ( ᴘᴀʀᴛɪᴅᴀ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ )
> 💣 ׄ ( ᴜᴍ ɴᴜ́ᴍᴇʀᴏ ᴅᴇ 1 ᴀ 25 )`
return texto
}

exports.jogoCasaAberta = () => {
return `- 💣 \`𝙼𝙸𝙽𝙴𝚂\`

> 💣 ׄ ( ᴇssᴀ ᴄᴀsᴀ ᴊᴀ́ ғᴏɪ ᴀʙᴇʀᴛᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️ )`
}

exports.velhaSemPartida = () => {
return `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.velhaCancelada = () => {
return `- ✅ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> ✅ ׄ ( ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.velhaEmAndamento = () => {
return `- ⚠️ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.velhaErro = () => {
return `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ. 🙇‍♂️ )`
}

exports.jogoConviteVelha = (alvo, autor, prefix) => {
return `- 🎮 \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> 🎮 ׄ ( ${alvo} — ᴠᴏᴄᴇ̂ ʀᴇᴄᴇʙᴇᴜ ᴜᴍ ᴄᴏɴᴠɪᴛᴇ ᴅᴇ ${autor} ᴘᴀʀᴀ ᴊᴏɢᴀʀ ᴊᴏɢᴏ ᴅᴀ ᴠᴇʟʜᴀ. )
> 🎮 ׄ ( ᴜsᴇ ᴏs ʙᴏᴛᴏ̃ᴇs ᴏᴜ ᴅɪɢɪᴛᴇ s ᴘᴀʀᴀ ᴀᴄᴇɪᴛᴀʀ ᴇ ɴ ᴘᴀʀᴀ ʀᴇᴄᴜsᴀʀ. )
> 🎮 ׄ ( ${prefix}resetvelha — ${autor} ᴘᴏᴅᴇ ᴄᴀɴᴄᴇʟᴀʀ ᴏ ᴅᴇsᴀғɪᴏ. 🙇‍♂️ )`
}

exports.jogoVelha = (game, extra, mencionar) => {
const turno = game.turno === 'X' ? game.X : game.O
let texto = `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> ❌ ׄ ( ᴊᴏɢᴀᴅᴏʀ x: ${mencionar(game.X)} )
> ❌ ׄ ( ᴊᴏɢᴀᴅᴏʀ ᴏ: ${mencionar(game.O)} )`
if (extra)
texto += `
${extra}`
else
texto += `
> ❌ ׄ ( ᴠᴇᴢ ᴅᴇ: ${mencionar(turno)} )
> ❌ ׄ ( ᴘᴀʀᴛɪᴅᴀ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ )`
return texto
}

exports.jogoVelhaIniciada = () => {
return `> 🧊 ׄ ( sᴛᴀᴛᴜs: ᴘᴀʀᴛɪᴅᴀ ɪɴɪᴄɪᴀᴅᴀ )`
}

exports.jogoCasaEscolhida = () => {
return `- ❌ \`𝙹𝙾𝙶𝙾 𝙳𝙰 𝚅𝙴𝙻𝙷𝙰\`

> ❌ ׄ ( ᴇssᴀ ᴄᴀsᴀ ᴊᴀ́ ғᴏɪ ᴇsᴄᴏʟʜɪᴅᴀ ɴᴇssᴀ ᴘᴀʀᴛɪᴅᴀ. 🙇‍♂️ )`
}

exports.jogoVelhaEmpate = () => {
return `> 🧊 ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ᴇᴍᴘᴀᴛᴇ )
> 🧊 ׄ ( ᴘᴀʀᴛɪᴅᴀ ғɪɴᴀʟɪᴢᴀᴅᴀ )`
}

exports.jogoVelhaVencedor = jogador => {
return `> 🧊 ׄ ( ᴠᴇɴᴄᴇᴅᴏʀ: ${jogador} )
> 🧊 ׄ ( ᴘᴀʀᴛɪᴅᴀ ғɪɴᴀʟɪᴢᴀᴅᴀ )`
}

exports.damaSemPartida = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.damaCancelada = () => {
return `- ✅ \`𝙳𝙰𝙼𝙰\`

> ✅ ׄ ( ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🙇‍♂️ )`
}

exports.damaEmAndamento = () => {
return `- ⚠️ \`𝙳𝙰𝙼𝙰\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ ᴀᴛɪᴠᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.damaErro = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴀ ᴘᴀʀᴛɪᴅᴀ ᴅᴇ ᴅᴀᴍᴀ. 🙇‍♂️ )`
}

exports.jogoConviteDama = (alvo, autor, prefix) => {
return `- 🎮 \`𝙳𝙰𝙼𝙰\`

> 🎮 ׄ ( ${alvo} — ᴠᴏᴄᴇ̂ ʀᴇᴄᴇʙᴇᴜ ᴜᴍ ᴄᴏɴᴠɪᴛᴇ ᴅᴇ ${autor} ᴘᴀʀᴀ ᴊᴏɢᴀʀ ᴅᴀᴍᴀ. )
> 🎮 ׄ ( ᴜsᴇ ᴏs ʙᴏᴛᴏ̃ᴇs ᴏᴜ ᴅɪɢɪᴛᴇ s ᴘᴀʀᴀ ᴀᴄᴇɪᴛᴀʀ ᴇ ɴ ᴘᴀʀᴀ ʀᴇᴄᴜsᴀʀ. )
> 🎮 ׄ ( ${prefix}resetdama — ${autor} ᴘᴏᴅᴇ ᴄᴀɴᴄᴇʟᴀʀ ᴏ ᴅᴇsᴀғɪᴏ. 🙇‍♂️ )`
}

exports.jogoDama = (game, extra, mencionar) => {
const turno = game.turno === 'W' ? game.W : game.B
let texto = `- ⚫ \`𝙳𝙰𝙼𝙰\`

> ⚫ ׄ ( ʙʀᴀɴᴄᴏ: ${mencionar(game.W)} )
> ⚫ ׄ ( ᴘʀᴇᴛᴏ: ${mencionar(game.B)} )
> ⚫ ׄ ( ᴠᴇᴢ ᴅᴇ: ${mencionar(turno)} )`
if (extra)
texto += `
> ⚫ ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ${extra} )`
if (game.finalizado)
texto += `
> ⚫ ׄ ( ᴘᴀʀᴛɪᴅᴀ ғɪɴᴀʟɪᴢᴀᴅᴀ )`
else
texto += `
> ⚫ ׄ ( ᴘᴀʀᴛɪᴅᴀ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ )
> ⚫ ׄ ( ᴊᴏɢᴜᴇ ᴄᴏᴍ: ʙ6-ᴀ5 )`
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

> ❌ ׄ ( ᴇssᴀ ᴘᴇᴄ̧ᴀ ɴᴀ̃ᴏ ᴘᴇʀᴛᴇɴᴄᴇ ᴀ ᴠᴏᴄᴇ̂. 🙇‍♂️ )`
}

exports.jogoCasaOcupada = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> ❌ ׄ ( ᴀ ᴄᴀsᴀ ᴅᴇ ᴅᴇsᴛɪɴᴏ ᴇsᴛᴀ́ ᴏᴄᴜᴘᴀᴅᴀ. 🙇‍♂️ )`
}

exports.jogoMovimentoInvalido = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> ❌ ׄ ( ᴜsᴇ ᴜᴍ ᴍᴏᴠɪᴍᴇɴᴛᴏ ᴅɪᴀɢᴏɴᴀʟ ᴠᴀ́ʟɪᴅᴏ, ᴄᴏᴍᴏ ʙ6-ᴀ5. 🙇‍♂️ )`
}

exports.jogoSemInimigo = () => {
return `- ❌ \`𝙳𝙰𝙼𝙰\`

> ❌ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴇᴄ̧ᴀ ɪɴɪᴍɪɢᴀ ᴘᴀʀᴀ ᴄᴀᴘᴛᴜʀᴀʀ. 🙇‍♂️ )`
}

exports.onlyGroupFun = prefix => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> 🎮 ׄ ( ᴏ ᴍᴏᴅᴏ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )

> 🎮 ׄ ( ${prefix}modobn 1 — ᴜᴍ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴘʀᴇᴄɪsᴀ ᴀᴛɪᴠᴀʀ ᴏ ᴍᴏᴅᴏ. 🙇‍♂️ )`
}

exports.modoBnUso = (prefix, command) => {
return `- 🎮 \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> 🎮 ׄ ( ${prefix + command} 1 — ᴀᴛɪᴠᴀʀ ᴀs ʙʀɪɴᴄᴀᴅᴇɪʀᴀs. )

> 🎮 ׄ ( ${prefix + command} 0 — ᴅᴇsᴀᴛɪᴠᴀʀ ᴀs ʙʀɪɴᴄᴀᴅᴇɪʀᴀs. 🙇‍♂️ )`
}

exports.modoBnAtivado = () => {
return `- ✅ \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> ✅ ׄ ( ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴇ ʀᴀɴᴋs ғᴏʀᴀᴍ ʟɪʙᴇʀᴀᴅᴏs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.modoBnDesativado = () => {
return `- ❌ \`𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰𝚂\`

> ❌ ׄ ( ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴇ ʀᴀɴᴋs ғᴏʀᴀᴍ ʙʟᴏǫᴜᴇᴀᴅᴏs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.modoBnJaAtivado = () => {
return `- ⚠️ \`𝙼𝙾𝙳𝙾 𝙹𝙰́ 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> ⚠️ ׄ ( ᴏ ᴍᴏᴅᴏ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴊᴀ́ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}

exports.modoBnJaDesativado = () => {
return `- ⚠️ \`𝙼𝙾𝙳𝙾 𝙹𝙰́ 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> ⚠️ ׄ ( ᴏ ᴍᴏᴅᴏ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ᴊᴀ́ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`
}


// ============================================================
// MODO PARCERIA
// ============================================================

exports.modoParceriaUso = (prefix, command) => {
return `- 🤝 \`𝙼𝙾𝙳𝙾 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> ✅ ׄ ( ${prefix + command} 1 — ᴀᴛɪᴠᴀʀ ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴘᴀʀᴄᴇʀɪᴀs )
> ❌ ׄ ( ${prefix + command} 0 — ᴅᴇsᴀᴛɪᴠᴀʀ ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴘᴀʀᴄᴇʀɪᴀs )`
}

exports.modoParceriaAtivado = () => {
return `- ✅ \`𝙼𝙾𝙳𝙾 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 🤝 ׄ ( ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴘᴀʀᴄᴇʀɪᴀs ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.modoParceriaDesativado = () => {
return `- ❌ \`𝙼𝙾𝙳𝙾 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 🤝 ׄ ( ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴘᴀʀᴄᴇʀɪᴀs ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.modoParceriaJaAtivado = () => {
return `- ⚠️ \`𝙼𝙾𝙳𝙾 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> ✅ ׄ ( ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴘᴀʀᴄᴇʀɪᴀs ᴊᴀ́ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.modoParceriaJaDesativado = () => {
return `- ⚠️ \`𝙼𝙾𝙳𝙾 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> ❌ ׄ ( ᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴘᴀʀᴄᴇʀɪᴀs ᴊᴀ́ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.parceriaModoDesativado = prefix => {
return `- 🤝 \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙰𝚂\`

> ❌ ׄ ( ᴏ ᴍᴏᴅᴏ ᴘᴀʀᴄᴇʀɪᴀ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴀᴛɪᴠᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )
> ✅ ׄ ( ᴜsᴇ ${prefix}modoparceria 1 ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ. )`
}

exports.parceriaSolicitada = id => {
return `- 📨 \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙳𝙴 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 🆔 ׄ ( ɪᴅ: ${id} )
> ⏳ ׄ ( ᴀ sᴜᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ᴇɴᴠɪᴀᴅᴀ ᴘᴀʀᴀ ᴀɴᴀ́ʟɪsᴇ. )`
}

exports.parceriaAprovada = (numero, id) => {
return `- 🤝 \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙰\`

> 👤 ׄ ( @${String(numero).split('@')[0]} )
> 🆔 ׄ ( ɪᴅ: ${id || 'N/A'} )
> ✅ ׄ ( ᴀ ᴘᴀʀᴄᴇʀɪᴀ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )
> 🔗 ׄ ( ᴏ ᴘᴀʀᴄᴇɪʀᴏ ᴘᴏssᴜɪ ʟɪʙᴇʀᴀᴄ̧ᴀ̃ᴏ ɴᴏs sɪsᴛᴇᴍᴀs ᴅᴇ ᴀɴᴛɪ-ʟɪɴᴋ. )`
}

exports.parceriaRecusada = (numero, motivo = 'Sem motivo informado') => {
return `- ❌ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙰\`

> 👤 ׄ ( @${String(numero).split('@')[0]} )
> 📝 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo} )`
}

exports.parceriaRemovida = numero => {
return `- ❌ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙰\`

> 👤 ׄ ( @${String(numero).split('@')[0]} )
> 🚫 ׄ ( ᴏ ᴜsᴜᴀ́ʀɪᴏ ɴᴀ̃ᴏ ғᴀᴢ ᴍᴀɪs ᴘᴀʀᴛᴇ ᴅᴀs ᴘᴀʀᴄᴇʀɪᴀs ᴅᴏ ɢʀᴜᴘᴏ. )
> 🔗 ׄ ( ᴀ ʟɪʙᴇʀᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴀɴᴛɪ-ʟɪɴᴋ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴀ. )`
}

exports.parceriaSuspensa = numero => {
return `- ⏸️ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝚂𝚄𝚂𝙿𝙴𝙽𝚂𝙰\`

> 👤 ׄ ( @${String(numero).split('@')[0]} )
> ⏸️ ׄ ( ᴀ ᴘᴀʀᴄᴇʀɪᴀ ғᴏɪ sᴜsᴘᴇɴsᴀ ᴛᴇᴍᴘᴏʀᴀʀɪᴀᴍᴇɴᴛᴇ. )
> 🔗 ׄ ( ᴏ ʙʏᴘᴀss ᴅᴇ ᴀɴᴛɪ-ʟɪɴᴋ ғɪᴄᴀʀᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴀᴛᴇ́ ᴀ ʀᴇᴀᴛɪᴠᴀᴄ̧ᴀ̃ᴏ. )`
}

exports.parceriaReativada = numero => {
return `- ✅ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝚁𝙴𝙰𝚃𝙸𝚅𝙰𝙳𝙰\`

> 👤 ׄ ( @${String(numero).split('@')[0]} )
> 🤝 ׄ ( ᴀ ᴘᴀʀᴄᴇʀɪᴀ ғᴏɪ ʀᴇᴀᴛɪᴠᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )
> 🔗 ׄ ( ᴀ ʟɪʙᴇʀᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴀɴᴛɪ-ʟɪɴᴋ ᴠᴏʟᴛᴏᴜ ᴀ ғᴜɴᴄɪᴏɴᴀʀ. )`
}

exports.parceriaExpirada = (nome, id) => {
return `- ⏳ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝙴𝚇𝙿𝙸𝚁𝙰𝙳𝙰\`

> 🤝 ׄ ( ${nome || 'Parceria'} )
> 🆔 ׄ ( ɪᴅ: ${id || 'N/A'} )
> ⏳ ׄ ( ᴏ ᴘᴇʀɪ́ᴏᴅᴏ ᴅᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴄʜᴇɢᴏᴜ ᴀᴏ ғɪᴍ. )
> 🔗 ׄ ( ᴏ ʙʏᴘᴀss ᴅᴇ ᴀɴᴛɪ-ʟɪɴᴋ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ. )`
}

exports.parceriaRenovada = (nome, dias) => {
const validade = String(dias) === '∞'
? 'ᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴀɢᴏʀᴀ ᴇ́ ᴘᴇʀᴍᴀɴᴇɴᴛᴇ.'
: `ᴀ ᴘᴀʀᴄᴇʀɪᴀ ғᴏɪ ʀᴇɴᴏᴠᴀᴅᴀ ᴘᴏʀ ${dias} ᴅɪᴀs.`

return `- 🔄 \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝚁𝙴𝙽𝙾𝚅𝙰𝙳𝙰\`

> 🤝 ׄ ( ${nome || 'Parceria'} )
> 📅 ׄ ( ${validade} )
> 🔗 ׄ ( ᴏ ʙʏᴘᴀss ᴅᴇ ᴀɴᴛɪ-ʟɪɴᴋ ᴇsᴛᴀ́ ᴀᴛɪᴠᴏ. )`
}

exports.parceriaBypassAlterado = (numero, ativo) => {
return `- 🔗 \`𝙱𝚈𝙿𝙰𝚂𝚂 𝙳𝙴 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 👤 ׄ ( @${String(numero).split('@')[0]} )
> ${ativo ? '✅' : '❌'} ׄ ( ᴏ ʙʏᴘᴀss ᴅᴇ ᴀɴᴛɪ-ʟɪɴᴋ ғᴏɪ ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'}. )`
}

exports.parceriaNaoEncontrada = () => {
return `- ❌ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\`

> 🔎 ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇɴᴄᴏɴᴛʀᴀʀ ᴇssᴀ ᴘᴀʀᴄᴇʀɪᴀ. )`
}

exports.parceriaSemCadastradas = () => {
return `- 🤝 \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰𝚂\`

> 📭 ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴄᴀᴅᴀsᴛʀᴀᴅᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.parceriaLista = (lista, total) => {
return `- 🤝 \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰𝚂 𝙰𝚃𝙸𝚅𝙰𝚂\`

${lista}

> 📊 ׄ ( ᴛᴏᴛᴀʟ: ${total} )`
}

exports.parceriaPerfil = ({ id, nome, tipo, responsavel, nivel, status, bypass, validade }) => {
return `- 🤝 \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙳𝙰 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 🆔 ׄ ( ɪᴅ: ${id || 'N/A'} )
> 📛 ׄ ( ɴᴏᴍᴇ: ${nome || 'Sem nome'} )
> 📢 ׄ ( ᴛɪᴘᴏ: ${tipo || 'Não informado'} )
> 👤 ׄ ( ʀᴇsᴘᴏɴsᴀ́ᴠᴇʟ: @${String(responsavel || '').split('@')[0]} )
> ⭐ ׄ ( ɴɪ́ᴠᴇʟ: ${nivel || 'Padrão'} )
> ${status === 'ativo' ? '🟢' : '🔴'} ׄ ( sᴛᴀᴛᴜs: ${status || 'desconhecido'} )
> ${bypass ? '✅' : '❌'} ׄ ( ᴀɴᴛɪ-ʟɪɴᴋ: ${bypass ? 'ʟɪʙᴇʀᴀᴅᴏ' : 'ʙʟᴏǫᴜᴇᴀᴅᴏ'} )
> 📅 ׄ ( ᴠᴀʟɪᴅᴀᴅᴇ: ${validade || 'Permanente'} )`
}

exports.parceriaDivulgacao = ({ nome, tipo, descricao, link }) => {
return `- 🤝 \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝙾𝙵𝙸𝙲𝙸𝙰𝙻\`

> 📛 ׄ ( ${nome || 'Parceria'} )
> 📢 ׄ ( ${tipo || 'Parceiro'} )
> 📝 ׄ ( ${descricao || 'Sem descrição'} )
> 🔗 ׄ ( ${link || 'Link indisponível'} )`
}

exports.parceriaSolicitacoes = (lista, total) => {
return `- 📨 \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙴 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

${lista}

> 📊 ׄ ( ᴘᴇɴᴅᴇɴᴛᴇs: ${total} )`
}

exports.parceriaRegras = regras => {
return `- 📜 \`𝚁𝙴𝙶𝚁𝙰𝚂 𝙳𝙴 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

${regras}`
}



exports.parceriaCentral = prefix => {
return `- 🤝 \`𝙲𝙴𝙽𝚃𝚁𝙰𝙻 𝙳𝙴 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰𝚂\`

> 📨 ׄ ( ${prefix}solicitarparceria ɴᴏᴍᴇ | ᴛɪᴘᴏ | ʟɪɴᴋ | ᴅᴇsᴄʀɪᴄ̧ᴀ̃ᴏ )
> 🤝 ׄ ( ${prefix}parcerias — ᴠᴇʀ ᴘᴀʀᴄᴇʀɪᴀs ᴀᴛɪᴠᴀs )
> 👤 ׄ ( ${prefix}minhasparcerias — ᴠᴇʀ sᴜᴀs ᴘᴀʀᴄᴇʀɪᴀs )
> 🔎 ׄ ( ${prefix}perfilparceria P001 — ᴠᴇʀ ᴘᴇʀғɪʟ )
> 📢 ׄ ( ${prefix}divulgarparceria P001 — ᴅɪᴠᴜʟɢᴀʀ )
> 📜 ׄ ( ${prefix}regrasparceria — ᴠᴇʀ ᴀs ʀᴇɢʀᴀs )`
}

exports.parceriaAddUso = prefix => {
return `- 🤝 \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝚁 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 👤 ׄ ( ${prefix}addparceria @usuario | ɴᴏᴍᴇ | ᴛɪᴘᴏ | ʟɪɴᴋ | ᴅɪᴀs | ɴɪ́ᴠᴇʟ | ᴅᴇsᴄʀɪᴄ̧ᴀ̃ᴏ )
> 📅 ׄ ( ᴜsᴇ 0 ᴅɪᴀs ᴘᴀʀᴀ ᴅᴇɪxᴀʀ ᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴘᴇʀᴍᴀɴᴇɴᴛᴇ. )`
}

exports.parceriaSolicitarUso = prefix => {
return `- 📨 \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝚁 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 🤝 ׄ ( ${prefix}solicitarparceria ɴᴏᴍᴇ | ᴛɪᴘᴏ | ʟɪɴᴋ | ᴅᴇsᴄʀɪᴄ̧ᴀ̃ᴏ )
> 💡 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix}solicitarparceria ᴍᴇᴜ ᴄᴀɴᴀʟ | ᴄᴀɴᴀʟ | https://... | ᴅɪᴠᴜʟɢᴀᴄ̧ᴏ̃ᴇs )`
}

exports.parceriaAprovarUso = prefix => {
return `- ✅ \`𝙰𝙿𝚁𝙾𝚅𝙰𝚁 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 📨 ׄ ( ${prefix}aprovarparceria S001 30 ᴏғɪᴄɪᴀʟ )
> 📅 ׄ ( ᴜsᴇ 0 ɴᴏs ᴅɪᴀs ᴘᴀʀᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴘᴇʀᴍᴀɴᴇɴᴛᴇ. )`
}

exports.parceriaRecusarUso = prefix => {
return `- ❌ \`𝚁𝙴𝙲𝚄𝚂𝙰𝚁 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 📨 ׄ ( ${prefix}recusarparceria S001 ᴍᴏᴛɪᴠᴏ )`
}

exports.parceriaRenovarUso = prefix => {
return `- 🔄 \`𝚁𝙴𝙽𝙾𝚅𝙰𝚁 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 🤝 ׄ ( ${prefix}renovarparceria P001 30 )
> 📅 ׄ ( ᴜsᴇ 0 ᴘᴀʀᴀ ᴛᴏʀɴᴀʀ ᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴘᴇʀᴍᴀɴᴇɴᴛᴇ. )`
}

exports.parceriaBypassUso = prefix => {
return `- 🔗 \`𝙱𝚈𝙿𝙰𝚂𝚂 𝙳𝙴 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> ✅ ׄ ( ${prefix}bypassparceria P001 1 — ᴀᴛɪᴠᴀʀ )
> ❌ ׄ ( ${prefix}bypassparceria P001 0 — ᴅᴇsᴀᴛɪᴠᴀʀ )`
}

exports.parceriaTermoUso = (prefix, command) => {
return `- 🤝 \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 🆔 ׄ ( ${prefix}${command} P001 )
> 👤 ׄ ( ᴠᴏᴄᴇ̂ ᴛᴀᴍʙᴇ́ᴍ ᴘᴏᴅᴇ ᴍᴀʀᴄᴀʀ ᴏ ʀᴇsᴘᴏɴsᴀ́ᴠᴇʟ. )`
}

exports.parceriaJaCadastrada = id => {
return `- ⚠️ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝙹𝙰́ 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙰\`

> 🤝 ׄ ( ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴊᴀ́ ᴘᴏssᴜɪ ᴜᴍᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴀᴛɪᴠᴀ. )
> 🆔 ׄ ( ɪᴅ: ${id || 'N/A'} )`
}

exports.parceriaJaSuspensa = () => {
return `- ⚠️ \`𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰 𝙹𝙰́ 𝚂𝚄𝚂𝙿𝙴𝙽𝚂𝙰\`

> ⏸️ ׄ ( ᴇssᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴊᴀ́ ᴇsᴛᴀ́ sᴜsᴘᴇɴsᴀ. )`
}

exports.parceriaSolicitacaoJaExiste = id => {
return `- ⚠️ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴\`

> 📨 ׄ ( ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴘᴏssᴜɪ ᴜᴍᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴀɢᴜᴀʀᴅᴀɴᴅᴏ ᴀɴᴀ́ʟɪsᴇ. )
> 🆔 ׄ ( ɪᴅ: ${id || 'N/A'} )`
}

exports.parceriaSolicitacaoNaoEncontrada = () => {
return `- ❌ \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\`

> 🔎 ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇɴᴄᴏɴᴛʀᴀʀ ᴇssᴇ ᴘᴇᴅɪᴅᴏ ᴅᴇ ᴘᴀʀᴄᴇʀɪᴀ. )`
}

exports.parceriaSemSolicitacoes = () => {
return `- 📨 \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙴 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰\`

> 📭 ׄ ( ɴᴀ̃ᴏ ʜᴀ́ sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴘᴇɴᴅᴇɴᴛᴇs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.parceriaSemMinhas = () => {
return `- 🤝 \`𝙼𝙸𝙽𝙷𝙰𝚂 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰𝚂\`

> 📭 ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ɴᴇɴʜᴜᴍᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴄᴀᴅᴀsᴛʀᴀᴅᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.parceriaMinhas = (lista, total) => {
return `- 🤝 \`𝙼𝙸𝙽𝙷𝙰𝚂 𝙿𝙰𝚁𝙲𝙴𝚁𝙸𝙰𝚂\`

${lista}

> 📊 ׄ ( ᴛᴏᴛᴀʟ: ${total} )`
}

exports.parceriaDivulgacaoNegada = () => {
return `- 🚫 \`𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙰\`

> 🤝 ׄ ( ᴀᴘᴇɴᴀs ᴏ ʀᴇsᴘᴏɴsᴀ́ᴠᴇʟ ᴅᴀ ᴘᴀʀᴄᴇʀɪᴀ ᴏᴜ ᴜᴍ ᴀᴅᴍɪɴ ᴘᴏᴅᴇ ᴅɪᴠᴜʟɢᴀʀ. )`
}


// ============================================================
// MANUTENÇÃO DE COMANDOS
// ============================================================

exports.comandoManutencao = (prefix, comando, motivo = '') => {
const detalhe = String(motivo || '').trim()
? `\n> 📝 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo} )`
: ''

return `- 🛠️ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙴𝙼 𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

> ⚙️ ׄ ( ${prefix || '.'}${comando} ᴇsᴛᴀ́ ᴛᴇᴍᴘᴏʀᴀʀɪᴀᴍᴇɴᴛᴇ ɪɴᴅɪsᴘᴏɴɪ́ᴠᴇʟ. )
> 🔧 ׄ ( ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴇsᴛᴀ́ ᴇᴍ ᴍᴀɴᴜᴛᴇɴᴄ̧ᴀ̃ᴏ ᴇ ᴠᴏʟᴛᴀʀᴀ́ ᴀssɪᴍ ǫᴜᴇ ᴏ ᴘʀᴏʙʟᴇᴍᴀ ғᴏʀ ᴄᴏʀʀɪɢɪᴅᴏ. )${detalhe}`
}

exports.manutencaoAddUso = prefix => {
return `- 🛠️ \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝚁 𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

> ⚙️ ׄ ( ${prefix}addcmdmanu ᴄᴏᴍᴀɴᴅᴏ )
> 📝 ׄ ( ${prefix}addcmdmanu ᴄᴏᴍᴀɴᴅᴏ | ᴍᴏᴛɪᴠᴏ )`
}

exports.manutencaoDelUso = prefix => {
return `- 🛠️ \`𝚁𝙴𝙼𝙾𝚅𝙴𝚁 𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

> ⚙️ ׄ ( ${prefix}delcmdmanu ᴄᴏᴍᴀɴᴅᴏ )`
}

exports.manutencaoAdicionado = (comando, motivo = '') => {
const detalhe = String(motivo || '').trim()
? `\n> 📝 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo} )`
: ''

return `- ✅ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙴𝙼 𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

> 🛠️ ׄ ( ${comando} ғᴏɪ ᴀᴅɪᴄɪᴏɴᴀᴅᴏ ᴀ̀ ᴍᴀɴᴜᴛᴇɴᴄ̧ᴀ̃ᴏ. )${detalhe}`
}

exports.manutencaoRemovido = comando => {
return `- ✅ \`𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙰\`

> ⚙️ ׄ ( ${comando} ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴀ ʟɪsᴛᴀ ᴅᴇ ᴍᴀɴᴜᴛᴇɴᴄ̧ᴀ̃ᴏ. )
> ✅ ׄ ( ᴏ ᴄᴏᴍᴀɴᴅᴏ ᴠᴏʟᴛᴏᴜ ᴀ ғᴜɴᴄɪᴏɴᴀʀ ɴᴏʀᴍᴀʟᴍᴇɴᴛᴇ. )`
}

exports.manutencaoJaAdicionado = comando => {
return `- ⚠️ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙹𝙰́ 𝙴𝙼 𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

> 🛠️ ׄ ( ${comando} ᴊᴀ́ ᴇsᴛᴀ́ ᴍᴀʀᴄᴀᴅᴏ ᴄᴏᴍᴏ ᴇᴍ ᴍᴀɴᴜᴛᴇɴᴄ̧ᴀ̃ᴏ. )`
}

exports.manutencaoNaoAdicionado = comando => {
return `- ⚠️ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙵𝙾𝚁𝙰 𝙳𝙰 𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

> ⚙️ ׄ ( ${comando} ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ᴅᴇ ᴍᴀɴᴜᴛᴇɴᴄ̧ᴀ̃ᴏ. )`
}

exports.manutencaoComandoInexistente = comando => {
return `- ❌ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙸𝙽𝙴𝚇𝙸𝚂𝚃𝙴𝙽𝚃𝙴\`

> 🔎 ׄ ( ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴏ ᴄᴏᴍᴀɴᴅᴏ ${comando || 'informado'} ɴᴀ ʙᴀsᴇ. )`
}

exports.manutencaoListaVazia = () => {
return `- 🛠️ \`𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

> ✅ ׄ ( ɴᴇɴʜᴜᴍ ᴄᴏᴍᴀɴᴅᴏ ᴇsᴛᴀ́ ᴇᴍ ᴍᴀɴᴜᴛᴇɴᴄ̧ᴀ̃ᴏ ɴᴏ ᴍᴏᴍᴇɴᴛᴏ. )`
}

exports.manutencaoLista = (lista, total) => {
return `- 🛠️ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙴𝙼 𝙼𝙰𝙽𝚄𝚃𝙴𝙽𝙲̧𝙰̃𝙾\`

${lista}

> 📊 ׄ ( ᴛᴏᴛᴀʟ: ${total} )`
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

> ⚙️ ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> ⚙️ ׄ ( ɢʀᴜᴘᴏ: ${groupName || 'Grupo'} )
> ⚙️ ׄ ( ғᴜɴᴄ̧ᴏ̃ᴇs ᴀᴛɪᴠᴀs: ${totalAtivas}/${estados.length} )

- 📥 \`𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾\`

> ⚙️ ׄ ( ᴀᴘʀᴏᴠᴀᴄ̧ᴀ̃ᴏ: ${status(funcoes?.aprovacao)} )
> ⚙️ ׄ ( ᴀᴜᴛᴏᴀᴘʀᴏᴠᴀᴄ̧ᴀ̃ᴏ: ${status(funcoes?.autoaprovacao)} )

- 🛡️ \`𝙿𝚁𝙾𝚃𝙴𝙲̧𝙰̃𝙾\`

> ⚙️ ׄ ( ᴀɴᴛɪʟɪɴᴋ: ${antilinkAtivo ? `Ativado ✅ • ${nivelAntilink}` : 'Desativado ❌'} )
> ⚙️ ׄ ( x𝟿: ${status(funcoes?.x9)} )
> ⚙️ ׄ ( ᴀɴᴛɪᴘᴀʏ: ${status(funcoes?.antipay)} )
> ⚙️ ׄ ( ᴀɴᴛɪʙᴏᴛ: ${status(funcoes?.antibot)} )
> ⚙️ ׄ ( ᴀɴᴛɪsᴘᴀᴍ: ${status(funcoes?.antispam)} )
> ⚙️ ׄ ( ᴀɴᴛɪsᴛᴀᴛᴜs: ${status(funcoes?.antistatus)} )
> ⚙️ ׄ ( ᴀɴᴛɪᴍᴀʀᴄᴀᴄ̧ᴀ̃ᴏ: ${status(funcoes?.antimarcacao)} )
> ⚙️ ׄ ( ᴀɴᴛɪ-ғᴀᴋᴇ: ${status(funcoes?.antifake)} )
> ⚙️ ׄ ( ᴀɴᴛɪ-ᴅᴅᴅ: ${status(funcoes?.antiddd?.ativo)} )
> ⚙️ ׄ ( ᴀɴᴛɪʀʀᴏᴜʙᴏ: ${status(funcoes?.antirroubo)} )

- 📁 \`𝙼𝙸́𝙳𝙸𝙰𝚂\`

> ⚙️ ׄ ( ᴀɴᴛɪᴠɪ́ᴅᴇᴏ: ${status(funcoes?.antivideo)} )
> ⚙️ ׄ ( ᴀɴᴛɪғᴏᴛᴏ: ${status(funcoes?.antifoto)} )
> ⚙️ ׄ ( ᴀɴᴛɪᴠɪsᴜ: ${status(funcoes?.antivisu)} )
> ⚙️ ׄ ( ᴀɴᴛɪғɪɢᴜʀɪɴʜᴀ: ${status(funcoes?.antisticker)} )
> ⚙️ ׄ ( ᴀɴᴛɪᴄᴏɴᴛᴀᴛᴏ: ${status(funcoes?.anticontato)} )
> ⚙️ ׄ ( ᴀɴᴛɪʟᴏᴄᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ: ${status(funcoes?.antilocalizacao)} )
> ⚙️ ׄ ( ᴀɴᴛɪᴅᴏᴄᴜᴍᴇɴᴛᴏ: ${status(funcoes?.antidocumento)} )
> ⚙️ ׄ ( ᴀɴᴛɪᴀ́ᴜᴅɪᴏ: ${status(funcoes?.antiaudio)} )

- 🎮 \`𝙾𝚄𝚃𝚁𝙰𝚂 𝙵𝚄𝙽𝙲̧𝙾̃𝙴𝚂\`

> ⚙️ ׄ ( ʙᴇᴍ-ᴠɪɴᴅᴏ 1: ${status(isWelkom)} )
> ⚙️ ׄ ( ʙᴇᴍ-ᴠɪɴᴅᴏ 2: ${status(isWelkom2)} )
> ⚙️ ׄ ( ʙᴇᴍ-ᴠɪɴᴅᴏ 3: ${status(isWelkom3)} )
> ⚙️ ׄ ( ᴍᴏᴅᴏ ᴊᴏɢᴏs: ${status(funcoes?.modojogos)} )
> ⚙️ ׄ ( ᴍᴏᴅᴏ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs: ${status(isModobn)} )`
}

exports.perfilUsuario = ({ nick, numero, bio, cargo, vip, chat, grupo, nivelGado, celular, nivelPuta, gostosura, programa }) => {
return `- 👤 \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

> 👤 ׄ ( ɴɪᴄᴋ: ${nick} )
> 👤 ׄ ( ɴᴜ́ᴍᴇʀᴏ: ${numero} )
> 👤 ׄ ( ʙɪᴏ: ${bio} )
> 👤 ׄ ( ᴄᴀʀɢᴏ: ${cargo} )
> 👤 ׄ ( ᴠɪᴘ: ${vip} )
> 👤 ׄ ( ᴄʜᴀᴛ: ${chat} )
> 👤 ׄ ( ɢʀᴜᴘᴏ: ${grupo} )

> 🐂 ׄ ( ɴɪ́ᴠᴇʟ ɢᴀᴅᴏ: ${nivelGado}% )
> 📱 ׄ ( sᴇᴜ ᴄᴇʟᴜʟᴀʀ: ${celular} )
> 😈 ׄ ( ɴɪ́ᴠᴇʟ ᴘᴜᴛᴀ: ${nivelPuta}% )
> 🥵 ׄ ( ɴɪ́ᴠᴇʟ ᴅᴇ ɢᴏsᴛᴏsᴜʀᴀ: ${gostosura}% )
> 🍼 ׄ ( ᴘʀᴏɢʀᴀᴍᴀ: ʀ$ ${programa} )`
}

exports.figuQuantidade = ({ prefix, command }) => {
return `- 🧊 \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> ❌ ׄ ( ɪɴғᴏʀᴍᴇ ᴀ ǫᴜᴀɴᴛɪᴅᴀᴅᴇ ᴅᴇ ғɪɢᴜʀɪɴʜᴀs. )
> 📌 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix + command} 5 )
> 🔢 ׄ ( ᴍɪ́ɴɪᴍᴏ: 1 | ᴍᴀ́xɪᴍᴏ: 10 )`
}

exports.figuMinimo = () => {
return `- 🧊 \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> ❌ ׄ ( ᴀ ǫᴜᴀɴᴛɪᴅᴀᴅᴇ ᴍɪ́ɴɪᴍᴀ ᴇ́ 1 ғɪɢᴜʀɪɴʜᴀ. )`
}

exports.figuMaximo = () => {
return `- 🧊 \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> ❌ ׄ ( ᴏ ʟɪᴍɪᴛᴇ ᴍᴀ́xɪᴍᴏ ᴇ́ ᴅᴇ 10 ғɪɢᴜʀɪɴʜᴀs. )
> ⚠️ ׄ ( ᴇssᴇ ʟɪᴍɪᴛᴇ ᴇᴠɪᴛᴀ ғʟᴏᴏᴅ ɴᴏ ᴄʜᴀᴛ. )`
}

exports.figuCarregando = ({ quantidade, pacote, privado }) => {
return `- 🧊 \`𝙲𝙰𝚁𝚁𝙴𝙶𝙰𝙽𝙳𝙾\`

> 📦 ׄ ( ᴘᴀᴄᴏᴛᴇ: ${pacote} )
> 🔢 ׄ ( ǫᴜᴀɴᴛɪᴅᴀᴅᴇ: ${quantidade} )
> 📍 ׄ ( ᴅᴇsᴛɪɴᴏ: ${privado ? 'sᴇᴜ ᴘʀɪᴠᴀᴅᴏ' : 'ᴄʜᴀᴛ ᴀᴛᴜᴀʟ'} )

> 🧊 ׄ ( ⏳ ᴀɢᴜᴀʀᴅᴇ ᴇɴǫᴜᴀɴᴛᴏ ᴀs ғɪɢᴜʀɪɴʜᴀs sᴀ̃ᴏ ᴇɴᴠɪᴀᴅᴀs... )`
}

exports.figuSucesso = ({ quantidade, pacote, prefix, command, privado }) => {
return `- ✅ \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂 𝙴𝙽𝚅𝙸𝙰𝙳𝙰𝚂\`

> 📦 ׄ ( ᴘᴀᴄᴏᴛᴇ: ${pacote} )
> 🔢 ׄ ( ᴇɴᴠɪᴀᴅᴀs: ${quantidade} )
> 📍 ׄ ( ᴅᴇsᴛɪɴᴏ: ${privado ? 'sᴇᴜ ᴘʀɪᴠᴀᴅᴏ' : 'ᴄʜᴀᴛ ᴀᴛᴜᴀʟ'} )
> 🧊 ׄ ( ғᴏɴᴛᴇ: ᴛᴏᴋɪᴛᴏ ᴀᴘɪs )

> ✅ ׄ ( ᴘᴀʀᴀ ʀᴇᴄᴇʙᴇʀ ᴍᴀɪs, ᴜsᴇ: ${prefix + command} ${quantidade} )`
}

exports.figuErro = () => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙰𝚂 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇɴᴠɪᴀʀ ᴀs ғɪɢᴜʀɪɴʜᴀs. )
> 🔄 ׄ ( ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ᴀʟɢᴜɴs ɪɴsᴛᴀɴᴛᴇs. )`
}

exports.getUsuarioUso = ({ prefix, command }) => {
return `- 🌪️ \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙽𝙰̃𝙾 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙳𝙾\`

> 🌪️ ׄ ( ᴍᴀʀǫᴜᴇ ᴜᴍ ᴜsᴜᴀ́ʀɪᴏ ᴏᴜ ᴅɪɢɪᴛᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ. )
> 🌪️ ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix + command} 5511999999999 )`
}

exports.getBioCarregando = () => {
return `- ✨ \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾 𝙱𝙸𝙾\`

> ✨ ׄ ( ᴀɢᴜᴀʀᴅᴇ ᴇɴǫᴜᴀɴᴛᴏ ʙᴜsᴄᴏ ᴀ ʙɪᴏɢʀᴀғɪᴀ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ. )`
}

exports.getBioResultado = ({ numero, bio }) => {
return `- 🗿 \`𝙱𝙸𝙾𝙶𝚁𝙰𝙵𝙸𝙰 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

> 🗿 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> 🗿 ׄ ( ʙɪᴏ: ${bio} )`
}

exports.getPerfilCarregando = () => {
return `- 🙇‍♂️ \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾 𝙿𝙴𝚁𝙵𝙸𝙻\`

> 🙇‍♂️ ׄ ( ᴀɢᴜᴀʀᴅᴇ ᴇɴǫᴜᴀɴᴛᴏ ʙᴜsᴄᴏ ᴀ ғᴏᴛᴏ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ. )`
}

exports.getPerfilResultado = ({ numero, prefix }) => {
return `- ⚡ \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

> ⚡ ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> ⚡ ׄ ( ʙɪᴏɢʀᴀғɪᴀ: ᴜsᴇ ${prefix}getbio @${numero} )
> ⚡ ׄ ( ʙᴀɴɴᴇʀ: ᴜsᴇ ${prefix}getbanner @${numero} )`
}

exports.getBannerCarregando = () => {
return `- 🖼️ \`𝙱𝚄𝚂𝙲𝙰𝙽𝙳𝙾 𝙱𝙰𝙽𝙽𝙴𝚁\`

> 🖼️ ׄ ( ᴀɢᴜᴀʀᴅᴇ ᴇɴǫᴜᴀɴᴛᴏ ʙᴜsᴄᴏ ᴏ ʙᴀɴɴᴇʀ ᴅᴏ ᴜsᴜᴀ́ʀɪᴏ. )`
}

exports.getBannerResultado = ({ numero }) => {
return `- 🖼️ \`𝙱𝙰𝙽𝙽𝙴𝚁 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

> 🖼️ ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> 🖼️ ׄ ( ᴏʀɪɢᴇᴍ: ᴡʜᴀᴛsᴀᴘᴘ ʙᴜsɪɴᴇss )`
}

exports.getBannerNaoEncontrado = ({ numero }) => {
return `- ❌ \`𝙱𝙰𝙽𝙽𝙴𝚁 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`

> ❌ ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> ❌ ׄ ( ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴡʜᴀᴛsᴀᴘᴘ ʙᴜsɪɴᴇss. )`
}

exports.funcaoUsoSimples = (prefix, command) => {
return `- ⚙️ \`𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝙲̧𝙰̃𝙾\`

> ✅ ׄ ( ᴀᴛɪᴠᴀʀ: ${prefix}${command} 1 )
> ❌ ׄ ( ᴅᴇsᴀᴛɪᴠᴀʀ: ${prefix}${command} 0 )`
}

exports.funcaoAlterada = (nome, ativa) => {
return `- ${ativa ? '✅' : '❌'} \`${nome}\`

> 📌 ׄ ( sᴛᴀᴛᴜs: ${ativa ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )
> 👥 ׄ ( ᴄᴏɴғɪɢᴜʀᴀᴄ̧ᴀ̃ᴏ ᴀᴛᴜᴀʟɪᴢᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.dddUso = (prefix, command) => {
return `- 📱 \`𝙳𝙳𝙳 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`\n\n> 📱 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix + command} 11 )\n> 📱 ׄ ( ᴠᴀ́ʀɪᴏs: ${prefix + command} 11 21 31 )`
}

exports.dddJaCadastrado = ddds => {
return `- ⚠️ \`𝙳𝙳𝙳 𝙹𝙰́ 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾\`\n\n> ⚠️ ׄ ( ᴅᴅᴅ: ${ddds.join(', ')} )`
}

exports.dddNaoCadastrado = ddds => {
return `- ⚠️ \`𝙳𝙳𝙳 𝙽𝙰̃𝙾 𝙲𝙰𝙳𝙰𝚂𝚃𝚁𝙰𝙳𝙾\`\n\n> ⚠️ ׄ ( ᴅᴅᴅ: ${ddds.join(', ')} )`
}

exports.dddAdicionado = ddds => {
return `- ✅ \`𝙳𝙳𝙳 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾\`\n\n> ✅ ׄ ( ᴅᴅᴅ: ${ddds.join(', ')} )\n> ✅ ׄ ( ᴀɢᴏʀᴀ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ᴅᴏ ᴀɴᴛɪ-ᴅᴅᴅ. )`
}

exports.dddRemovido = ddds => {
return `- ✅ \`𝙳𝙳𝙳 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`\n\n> ✅ ׄ ( ᴅᴅᴅ: ${ddds.join(', ')} )\n> ✅ ׄ ( ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴀ ʟɪsᴛᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.dddLista = lista => {
const itens = lista.length ? lista.map((ddd, i) => `> 🧊 ׄ ( ${i + 1} — ${ddd} )`).join('\n') : '> 🧊 ׄ ( ɴᴇɴʜᴜᴍ ᴅᴅᴅ ᴘʀᴏɪʙɪᴅᴏ. )'
return `- 📱 \`𝙻𝙸𝚂𝚃𝙰 𝙳𝙾 𝙰𝙽𝚃𝙸-𝙳𝙳𝙳\`\n\n${itens}`
}

exports.listaNegraUso = (prefix, command) => {
return `- 🚫 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙽𝙴𝙲𝙴𝚂𝚂𝙰́𝚁𝙸𝙾\`\n\n> 🚫 ׄ ( ᴍᴀʀᴄᴀᴄ̧ᴀ̃ᴏ: ${prefix + command} @usuario )\n> 🚫 ׄ ( ɴᴜ́ᴍᴇʀᴏ: ${prefix + command} 5511999999999 )\n> 🚫 ׄ ( ʀᴇsᴘᴏsᴛᴀ: ʀᴇsᴘᴏɴᴅᴀ ᴀ̀ ᴍᴇɴsᴀɢᴇᴍ ᴇ ᴜsᴇ ${prefix + command} )`
}

exports.listaNegraJaExiste = alvo => {
return `- ⚠️ \`𝙹𝙰́ 𝙴𝚂𝚃𝙰́ 𝙽𝙰 𝙻𝙸𝚂𝚃𝙰\`\n\n> ⚠️ ׄ ( @${String(alvo).split('@')[0]} — ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ɴᴇɢʀᴀ. )`
}

exports.listaNegraNaoExiste = alvo => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙴𝚂𝚃𝙰́ 𝙽𝙰 𝙻𝙸𝚂𝚃𝙰\`\n\n> ⚠️ ׄ ( @${String(alvo).split('@')[0]} — ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ɴᴇɢʀᴀ. )`
}

exports.listaNegraAdicionado = alvo => {
return `- 🚫 \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾 𝙰̀ 𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n> 🚫 ׄ ( @${String(alvo).split('@')[0]} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ꜰᴏɪ ᴀᴅɪᴄɪᴏɴᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.listaNegraRemovido = alvo => {
return `- ✅ \`𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾 𝙳𝙰 𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n> ✅ ׄ ( @${String(alvo).split('@')[0]} — ᴏ ᴜsᴜᴀ́ʀɪᴏ ꜰᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.listaNegraLista = lista => {
const itens = lista.length ? lista.map((jid, i) => `> 🧊 ׄ ( ${i + 1} — @${String(jid).split('@')[0]} )`).join('\n') : '> 🧊 ׄ ( ɴᴇɴʜᴜᴍ ᴜsᴜᴀ́ʀɪᴏ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ. )'
return `- 🚫 \`𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n${itens}`
}

exports.blackListEntrada = numero => {
return `- 🚫 \`𝙻𝙸𝚂𝚃𝙰 𝙽𝙴𝙶𝚁𝙰\`\n\n> 🚫 ׄ ( @${numero} — ᴠᴏᴄᴇ̂ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ɴᴇɢʀᴀ ᴅᴇsᴛᴇ ɢʀᴜᴘᴏ ᴇ sᴇʀᴀ́ ʀᴇᴍᴏᴠɪᴅᴏ. )`
}

exports.antifakeEntrada = numero => {
return `- 🌍 \`𝙰𝙽𝚃𝙸-𝙵𝙰𝙺𝙴\`\n\n> 🌍 ׄ ( @${numero} — ɴᴜ́ᴍᴇʀᴏ ᴇsᴛʀᴀɴɢᴇɪʀᴏ ᴅᴇᴛᴇᴄᴛᴀᴅᴏ. ᴀ ᴇɴᴛʀᴀᴅᴀ ɴᴀ̃ᴏ ᴇ́ ᴘᴇʀᴍɪᴛɪᴅᴀ. )`
}

exports.antidddEntrada = (numero, ddd) => {
return `- 📱 \`𝙰𝙽𝚃𝙸-𝙳𝙳𝙳\`\n\n> 📱 ׄ ( @${numero} — ᴏ ᴅᴅᴅ ${ddd} ᴇsᴛᴀ́ ᴘʀᴏɪʙɪᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.antirrouboPromocao = (autor, alvos) => {
return `- 🛡️ \`𝙰𝙽𝚃𝙸𝚁𝚁𝙾𝚄𝙱𝙾 𝙰𝙲𝙸𝙾𝙽𝙰𝙳𝙾\`\n\n> 🛡️ ׄ ( ᴀᴜᴛᴏʀ: @${String(autor).split('@')[0]} )\n> 🛡️ ׄ ( ᴀᴄ̧ᴀ̃ᴏ: ᴛᴇɴᴛᴏᴜ ᴘʀᴏᴍᴏᴠᴇʀ ${alvos.map(jid => `@${String(jid).split('@')[0]}`).join(', ')} sᴇᴍ ᴀᴜᴛᴏʀɪᴢᴀᴄ̧ᴀ̃ᴏ. )\n> 🛡️ ׄ ( ᴏs ᴄᴀʀɢᴏs ꜰᴏʀᴀᴍ ʀᴇᴛɪʀᴀᴅᴏs ᴇ ᴏ ᴀᴜᴛᴏʀ ꜰᴏɪ ʀᴇʙᴀɪxᴀᴅᴏ. )`
}

exports.antirrouboRebaixamento = (autor, alvos) => {
return `- 🛡️ \`𝙰𝙽𝚃𝙸𝚁𝚁𝙾𝚄𝙱𝙾 𝙰𝙲𝙸𝙾𝙽𝙰𝙳𝙾\`\n\n> 🛡️ ׄ ( ᴀᴜᴛᴏʀ: @${String(autor).split('@')[0]} )\n> 🛡️ ׄ ( ᴀᴄ̧ᴀ̃ᴏ: ᴛᴇɴᴛᴏᴜ ʀᴇʙᴀɪxᴀʀ ${alvos.map(jid => `@${String(jid).split('@')[0]}`).join(', ')} sᴇᴍ ᴀᴜᴛᴏʀɪᴢᴀᴄ̧ᴀ̃ᴏ. )\n> 🛡️ ׄ ( ᴏ ᴀᴅᴍ ᴅᴀ ᴠɪ́ᴛɪᴍᴀ ꜰᴏɪ ᴅᴇᴠᴏʟᴠɪᴅᴏ ᴇ ᴏ ᴀᴜᴛᴏʀ ꜰᴏɪ ʀᴇʙᴀɪxᴀᴅᴏ. )`
}

exports.bemvindoModo = (modo, ativo) => {
return `- ${ativo ? '✅' : '❌'} \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 ${modo}\`\n\n> 🧊 ׄ ( sᴛᴀᴛᴜs: ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.legendaModo = (modo, tipo) => {
return `- ✅ \`𝙻𝙴𝙶𝙴𝙽𝙳𝙰 𝙳𝙾 𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 ${modo}\`\n\n> ✅ ׄ ( ᴛɪᴘᴏ: ${tipo} )\n> ✅ ׄ ( ᴀʟᴛᴇʀᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.usologo = (prefix, command) => {
return `- 🎨 \`𝙲𝚁𝙸𝙰𝙳𝙾𝚁 𝙳𝙴 𝙻𝙾𝙶𝙾\`

> 🎨 ׄ ( ᴄᴏᴍᴀɴᴅᴏ: ${prefix}${command} )
> 🎨 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix}${command} Tokito Bot )
> 🎨 ׄ ( ᴅɪɢɪᴛᴇ ᴏ ᴛᴇxᴛᴏ ǫᴜᴇ sᴇʀᴀ́ ᴄᴏʟᴏᴄᴀᴅᴏ ɴᴀ ʟᴏɢᴏ. )`
}

exports.usodupla = (prefix, command) => {
return `- 🎨 \`𝙻𝙾𝙶𝙾 𝙲𝙾𝙼 𝙳𝙾𝙸𝚂 𝚃𝙴𝚇𝚃𝙾𝚂\`

> 🎨 ׄ ( ᴄᴏᴍᴀɴᴅᴏ: ${prefix}${command} )
> 🎨 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix}${command} Tokito|Bot )
> 🎨 ׄ ( ᴜsᴇ ᴏ sɪ́ᴍʙᴏʟᴏ | ᴇɴᴛʀᴇ ᴏs ᴅᴏɪs ᴛᴇxᴛᴏs. )`
}

exports.logofeita = command => {
return `- 🎨 \`𝙻𝙾𝙶𝙾 𝙲𝚁𝙸𝙰𝙳𝙰\`

> 🎨 ׄ ( ᴇғᴇɪᴛᴏ: ${command} )
> 🎨 ׄ ( ᴄʀɪᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ ✅ )`
}

exports.bnBusca = (tipo, numero) => {
return `- 🔎 \`𝙿𝙴𝚂𝚀𝚄𝙸𝚂𝙰𝙽𝙳𝙾\`

> 🔎 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> 🔎 ׄ ( ғɪᴄʜᴀ: ${tipo} )
> 🔎 ׄ ( ᴀɢᴜᴀʀᴅᴇ ᴏ ʀᴇsᴜʟᴛᴀᴅᴏ... )`
}

exports.bnResultado = (emoji, titulo, numero, tipo, valor) => {
return `- ${emoji} \`${titulo}\`

> 🧊 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> 🧊 ׄ ( ᴘᴇʀɢᴜɴᴛᴀ: ᴏ ǫᴜᴀɴᴛᴏ ᴇssᴇ ᴜsᴜᴀ́ʀɪᴏ ᴘᴏᴅᴇ sᴇʀ ${tipo}? )
> 🧊 ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ${valor}% )`
}

exports.bnRank = (emoji, titulo, itens) => {
const lista = itens.map(item => `> 🧊 ׄ ( ${item.posicao}° — ${item.valor}% • @${item.numero} )`).join('\n')
return `- ${emoji} \`${titulo}\`

${lista}`
}

exports.afkAtivado = (motivo, prefix) => {
return `- 💤 \`𝙰𝙵𝙺 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 💤 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo} )
> 💤 ׄ ( ᴠᴏʟᴛᴀʀ: ᴜsᴇ ${prefix}on ᴏᴜ ᴀᴘᴇɴᴀs ᴍᴀɴᴅᴇ ᴜᴍᴀ ᴍᴇɴsᴀɢᴇᴍ ɴᴏ ɢʀᴜᴘᴏ. )`
}

exports.afkNaoAtivo = () => {
return `- ⚠️ \`𝙰𝙵𝙺\`

> ⚠️ ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴍᴀʀᴄᴀᴅᴏ ᴄᴏᴍᴏ ᴀᴜsᴇɴᴛᴇ. )`
}

exports.afkAviso = (jid, motivo, tempo) => {
return `- 💤 \`𝚄𝚂𝚄𝙰́𝚁𝙸𝙾 𝙰𝚄𝚂𝙴𝙽𝚃𝙴\`

> 💤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> 💤 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo || 'Sem motivo especificado'} )
> 💤 ׄ ( ᴛᴇᴍᴘᴏ: ${tempo} )`
}

exports.afkVoltou = (jid, tempo) => {
return `- 👋 \`𝙱𝙴𝙼-𝚅𝙸𝙽𝙳𝙾 𝙳𝙴 𝚅𝙾𝙻𝚃𝙰\`

> 👋 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> 👋 ׄ ( ᴀᴜsᴇɴᴛᴇ ᴘᴏʀ: ${tempo} )
> 👋 ׄ ( sᴜᴀ ᴀᴜsᴇ̂ɴᴄɪᴀ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ. )`
}

exports.namoroUso = (prefix, command) => {
return `- 💍 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙳𝙴 𝙽𝙰𝙼𝙾𝚁𝙾\`

> 💍 ׄ ( ᴜsᴏ: ${prefix}${command} @usuario )
> 💍 ׄ ( ᴍᴀʀǫᴜᴇ ᴀ ᴘᴇssᴏᴀ ǫᴜᴇ ᴠᴏᴄᴇ̂ ǫᴜᴇʀ ᴘᴇᴅɪʀ ᴇᴍ ɴᴀᴍᴏʀᴏ. )`
}

exports.namoroMesmo = () => {
return `- ❌ \`𝙽𝙰𝙼𝙾𝚁𝙾\`

> ❌ ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ ᴘᴇᴅɪʀ ɴᴀᴍᴏʀᴏ ᴘᴀʀᴀ sɪ ᴍᴇsᴍᴏ. )`
}

exports.namoroOcupado = jid => {
return `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾\`

> 💔 ׄ ( @${String(jid).split('@')[0]} — ᴊᴀ́ ᴇsᴛᴀ́ ᴇᴍ ᴜᴍ ʀᴇʟᴀᴄɪᴏɴᴀᴍᴇɴᴛᴏ. )`
}

exports.namoroPendente = jid => {
return `- 💌 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴\`

> 💌 ׄ ( @${String(jid).split('@')[0]} — ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴇɴᴠɪᴏᴜ ᴜᴍ ᴘᴇᴅɪᴅᴏ ᴘᴀʀᴀ ᴇssᴀ ᴘᴇssᴏᴀ. )`
}

exports.namoroSemPedido = () => {
return `- ⚠️ \`𝙿𝙴𝙳𝙸𝙳𝙾\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴇssᴇ ᴘᴇᴅɪᴅᴏ ᴅᴇ ɴᴀᴍᴏʀᴏ ᴘᴀʀᴀ ᴠᴏᴄᴇ̂. )`
}

exports.namoroIndisponivel = () => {
return `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾\`

> 💔 ׄ ( ᴜᴍ ᴅᴏs ᴜsᴜᴀ́ʀɪᴏs ᴊᴀ́ ᴇsᴛᴀ́ ᴇᴍ ᴏᴜᴛʀᴏ ʀᴇʟᴀᴄɪᴏɴᴀᴍᴇɴᴛᴏ. )`
}

exports.namoroAceito = (a, b) => {
return `- 💖 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙰𝙲𝙴𝙸𝚃𝙾\`

> 💖 ׄ ( ᴄᴀsᴀʟ: @${String(a).split('@')[0]} + @${String(b).split('@')[0]} )
> 💖 ׄ ( ᴀɢᴏʀᴀ ᴠᴏᴄᴇ̂s ᴇsᴛᴀ̃ᴏ ɴᴀᴍᴏʀᴀɴᴅᴏ. 💙 )`
}

exports.namoroRecusado = (a, b) => {
return `- 💔 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾\`

> 💔 ׄ ( ᴅᴇ: @${String(a).split('@')[0]} )
> 💔 ׄ ( ᴘᴏʀ: @${String(b).split('@')[0]} )`
}

exports.namoroSemEnvio = () => {
return `- ⚠️ \`𝙿𝙴𝙳𝙸𝙳𝙾\`

> ⚠️ ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴘᴇᴅɪᴅᴏ ᴅᴇ ɴᴀᴍᴏʀᴏ ᴇɴᴠɪᴀᴅᴏ. )`
}

exports.namoroCancelado = () => {
return `- ✅ \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾\`

> ✅ ׄ ( sᴇᴜ ᴘᴇᴅɪᴅᴏ ᴅᴇ ɴᴀᴍᴏʀᴏ ғᴏɪ ᴄᴀɴᴄᴇʟᴀᴅᴏ. )`
}

exports.namoroSolteiro = () => {
return `- 💙 \`𝙽𝙰𝙼𝙾𝚁𝙾\`

> 💙 ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀᴍᴏʀᴀɴᴅᴏ ɴɪɴɢᴜᴇ́ᴍ. )`
}

exports.namoroTerminar = prefix => {
return `- 💔 \`𝚃𝙴𝚁𝙼𝙸𝙽𝙰𝚁 𝙽𝙰𝙼𝙾𝚁𝙾\`

> 💔 ׄ ( ᴄᴏɴғɪʀᴍᴀʀ: ${prefix}terminar 1 )`
}

exports.namoroTerminou = (a, b) => {
return `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙾\`

> 💔 ׄ ( ᴄᴀsᴀʟ: @${String(a).split('@')[0]} + @${String(b).split('@')[0]} )
> 💔 ׄ ( ᴏ ʀᴇʟᴀᴄɪᴏɴᴀᴍᴇɴᴛᴏ ᴄʜᴇɢᴏᴜ ᴀᴏ ғɪᴍ. )`
}

exports.namoroCasal = (a, b, dias) => {
return `- 💞 \`𝙼𝙴𝚄 𝙲𝙰𝚂𝙰𝙻\`

> 💞 ׄ ( ᴘᴇssᴏᴀ 𝟷: @${String(a).split('@')[0]} )
> 💞 ׄ ( ᴘᴇssᴏᴀ 𝟸: @${String(b).split('@')[0]} )
> 💞 ׄ ( ᴛᴇᴍᴘᴏ: ${dias} ᴅɪᴀ(s) )`
}

exports.namoroSemCasais = () => {
return `- 💞 \`𝙲𝙰𝚂𝙰𝙸𝚂\`

> 💞 ׄ ( ᴀɪɴᴅᴀ ɴᴀ̃ᴏ ʜᴀ́ ᴄᴀsᴀɪs ʀᴇɢɪsᴛʀᴀᴅᴏs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.namoroLista = casais => {
const lista = casais.map((item, i) => `> 🧊 ׄ ( ${i + 1}° — @${String(item.a).split('@')[0]} + @${String(item.b).split('@')[0]} )`).join('\n')
return `- 💞 \`𝙲𝙰𝚂𝙰𝙸𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

${lista}`
}

exports.soadmUso = (prefix, command) => {
return `- 🛡️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

> 🛡️ ׄ ( ᴀᴛɪᴠᴀʀ: ${prefix}${command} 1 )
> 🛡️ ׄ ( ᴅᴇsᴀᴛɪᴠᴀʀ: ${prefix}${command} 0 )`
}

exports.soadmJaAtivo = () => {
return `- ⚠️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

> ⚠️ ׄ ( ᴏ ᴍᴏᴅᴏ sᴏ́ ᴀᴅᴍ ᴊᴀ́ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀᴅᴏ. )`
}

exports.soadmJaInativo = () => {
return `- ⚠️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

> ⚠️ ׄ ( ᴏ ᴍᴏᴅᴏ sᴏ́ ᴀᴅᴍ ᴊᴀ́ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ. )`
}

exports.soadmAlterado = ativo => {
return `- ${ativo ? '✅' : '❌'} \`𝚂𝙾́ 𝙰𝙳𝙼\`

> 🧊 ׄ ( sᴛᴀᴛᴜs: ${ativo ? 'Ativado' : 'Desativado'} ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.soadmBloqueado = () => {
return `- 🛡️ \`𝚂𝙾́ 𝙰𝙳𝙼\`

> 🛡️ ׄ ( ɴᴇsᴛᴇ ɢʀᴜᴘᴏ, sᴏᴍᴇɴᴛᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴘᴏᴅᴇᴍ ᴜsᴀʀ ᴄᴏᴍᴀɴᴅᴏs ᴅᴏ ʙᴏᴛ. )`
}
exports.infoComando = ({ nome, aliases = [], categoria = 'outros', descricao = 'Sem descrição.', uso = '', permissao = 'Todos', requisitos = '' }) => {
let texto = `- ℹ️ \`𝙸𝙽𝙵𝙾 𝙳𝙾 𝙲𝙾𝙼𝙰𝙽𝙳𝙾\`

> 🧊 ׄ ( ${nome} — ᴄᴏᴍᴀɴᴅᴏ. )
> 🧊 ׄ ( ${categoria} — ᴄᴀᴛᴇɢᴏʀɪᴀ. )
> 🧊 ׄ ( ${descricao} — ᴅᴇsᴄʀɪᴄ̧ᴀ̃ᴏ. )
> 🧊 ׄ ( ${uso || nome} — ᴍᴏᴅᴏ ᴅᴇ ᴜsᴏ. )
> 🧊 ׄ ( ${permissao} — ᴘᴇʀᴍɪssᴀ̃ᴏ. )`

if (requisitos) {
texto += `

> 🧊 ׄ ( ${requisitos} — ʀᴇǫᴜɪsɪᴛᴏs. )`
}

texto += `

> 🧊 ׄ ( ${aliases.length ? aliases.join(', ') : 'Nenhum'} — ᴀʟɪᴀs. )`

return texto
}

exports.infoUso = prefix => {
return `- ℹ️ \`𝙸𝙽𝙵𝙾\`

> 🧊 ׄ ( ᴜsᴏ: ${prefix}info comando )`
}

exports.infoNaoExiste = nome => {
return `- ❌ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`

> ❌ ׄ ( ${nome || 'desconhecido'} — ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ɴᴏ ʀᴇɢɪsᴛʀᴏ ᴅᴇ ᴘʟᴜɢɪɴs. )`
}

exports.totalcmd = ({ canonicos, aliases, total, NomeDoBot, prefix }) => {
return `- 📊 \`𝚃𝙾𝚃𝙰𝙻 𝙳𝙴 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂\`

> 🧩 ׄ ( ᴍᴏ́ᴅᴜʟᴏs: ${canonicos} )
> 🔁 ׄ ( ᴀʟɪᴀs: ${aliases} )
> 📦 ׄ ( ᴛᴏᴛᴀʟ ᴜᴛɪʟɪᴢᴀ́ᴠᴇʟ: ${total} )
> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> ⚙️ ׄ ( ᴘʀᴇғɪxᴏ: ${prefix} )`
}
exports.vipCmdUso = prefix => {
return `- 💎 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚅𝙸𝙿\`

> 💎 ׄ ( ᴜsᴏ: ${prefix}addcmdvip comando )`
}

exports.vipCmdAdicionado = nome => {
return `- 💎 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚅𝙸𝙿\`

> 💎 ׄ ( ${nome} — ᴀɢᴏʀᴀ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ᴠɪᴘ/ᴅᴏɴᴏ. )`
}

exports.vipCmdRemovido = nome => {
return `- ✅ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙻𝙸𝙱𝙴𝚁𝙰𝙳𝙾\`

> ✅ ׄ ( ${nome} — ɴᴀ̃ᴏ ᴇ́ ᴍᴀɪs ᴇxᴄʟᴜsɪᴠᴏ ᴅᴇ ᴠɪᴘ. )`
}

exports.vipCmdJa = nome => {
return `- ⚠️ \`𝙹𝙰́ 𝙴́ 𝚅𝙸𝙿\`

> ⚠️ ׄ ( ${nome} — ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ᴠɪᴘ. )`
}

exports.vipCmdNao = nome => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙴́ 𝚅𝙸𝙿\`

> ⚠️ ׄ ( ${nome} — ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ ᴠɪᴘ. )`
}

exports.vipCmdInexistente = nome => {
return `- ❌ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙸𝙽𝙴𝚇𝙸𝚂𝚃𝙴𝙽𝚃𝙴\`

> ❌ ׄ ( ${nome || '?'} — ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴇssᴇ ᴘʟᴜɢɪɴ. )`
}

exports.vipCmdLista = lista => {
return `- 💎 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝚅𝙸𝙿\`

${lista.length ? lista.map((x, i) => `> 💎 ׄ ( ${i + 1} — ${x} )`).join('\n') : '> 💎 ׄ ( ɴᴇɴʜᴜᴍ ᴄᴏᴍᴀɴᴅᴏ ᴠɪᴘ ᴄᴏɴғɪɢᴜʀᴀᴅᴏ. )'}`
}

exports.onlyVipCmd = nome => {
return `- 💎 \`𝙰𝙿𝙴𝙽𝙰𝚂 𝚅𝙸𝙿\`

> 💎 ׄ ( ${nome} — ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ᴜsᴜᴀ́ʀɪᴏs ᴠɪᴘ. )`
}
exports.blockCmdUso = prefix => {
return `- 🚫 \`𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝚁 𝙲𝙾𝙼𝙰𝙽𝙳𝙾\`

> 🚫 ׄ ( ᴜsᴏ: ${prefix}blockcmd comando )`
}

exports.blockCmdAdicionado = nome => {
return `- 🚫 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> 🚫 ׄ ( ${nome} — ɴᴀ̃ᴏ ᴘᴏᴅᴇʀᴀ́ sᴇʀ ᴜsᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.blockCmdRemovido = nome => {
return `- ✅ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙻𝙸𝙱𝙴𝚁𝙰𝙳𝙾\`

> ✅ ׄ ( ${nome} — ᴠᴏʟᴛᴏᴜ ᴀ ғᴜɴᴄɪᴏɴᴀʀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}

exports.blockCmdJa = nome => {
return `- ⚠️ \`𝙹𝙰́ 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> ⚠️ ׄ ( ${nome} — ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴊᴀ́ ᴇsᴛᴀ́ ʙʟᴏǫᴜᴇᴀᴅᴏ. )`
}

exports.blockCmdNao = nome => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> ⚠️ ׄ ( ${nome} — ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ʙʟᴏǫᴜᴇᴀᴅᴏ. )`
}

exports.blockCmdLista = lista => {
return `- 🚫 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾𝚂\`

${lista.length ? lista.map((x, i) => `> 🚫 ׄ ( ${i + 1} — ${x} )`).join('\n') : '> 🚫 ׄ ( ɴᴇɴʜᴜᴍ ᴄᴏᴍᴀɴᴅᴏ ʙʟᴏǫᴜᴇᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )'}`
}

exports.blockCmdNegado = nome => {
return `- 🚫 \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙱𝙻𝙾𝚀𝚄𝙴𝙰𝙳𝙾\`

> 🚫 ׄ ( ${nome} — ᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ʙʟᴏǫᴜᴇᴀʀᴀᴍ ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. )`
}
exports.advUso = prefix => {
return `- ⚠️ \`𝙰𝙳𝚅𝙴𝚁𝚃𝙴̂𝙽𝙲𝙸𝙰\`

> ⚠️ ׄ ( ᴜsᴏ: ${prefix}adv @usuario motivo )`
}

exports.advMesmo = () => {
return `- ❌ \`𝙰𝙳𝚅\`

> ❌ ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sᴇ ᴀᴅᴠᴇʀᴛɪʀ. )`
}

exports.advAplicada = (jid, qtd, limite, motivo, removido = false) => {
return `- ⚠️ \`𝙰𝙳𝚅𝙴𝚁𝚃𝙴̂𝙽𝙲𝙸𝙰\`

> ⚠️ ׄ ( @${String(jid).split('@')[0]} — ᴜsᴜᴀ́ʀɪᴏ. )
> ⚠️ ׄ ( ${qtd}/${limite} — ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs. )
> ⚠️ ׄ ( ${motivo} — ᴍᴏᴛɪᴠᴏ. )
${removido ? '> 🚫 ׄ ( ʀᴇᴍᴏᴠɪᴅᴏ ᴀᴏ ᴀᴛɪɴɢɪʀ ᴏ ʟɪᴍɪᴛᴇ. )' : '> ✅ ׄ ( ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀ ʀᴇɢɪsᴛʀᴀᴅᴀ. )'}`
}

exports.delAdvUso = prefix => {
return `- ⚠️ \`𝚁𝙴𝙼𝙾𝚅𝙴𝚁 𝙰𝙳𝚅\`

> ⚠️ ׄ ( ᴜsᴏ: ${prefix}deladv @usuario [tudo] )`
}

exports.advRemovida = (jid, qtd) => {
return `- ✅ \`𝙰𝙳𝚅 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙰\`

> ✅ ׄ ( @${String(jid).split('@')[0]} — ᴀɢᴏʀᴀ ᴘᴏssᴜɪ ${qtd} ᴀᴅᴠ. )`
}

exports.advNenhuma = jid => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙰𝙳𝚅\`

> ⚠️ ׄ ( @${String(jid).split('@')[0]} — ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs. )`
}

exports.advLista = lista => {
return `- ⚠️ \`𝙻𝙸𝚂𝚃𝙰 𝙳𝙴 𝙰𝙳𝚅\`

${lista.length ? lista.map((x, i) => `> ⚠️ ׄ ( ${i + 1} — @${x.jid.split('@')[0]} • ${x.quantidade}/3 )`).join('\n') : '> ⚠️ ׄ ( ɴᴇɴʜᴜᴍᴀ ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀ ʀᴇɢɪsᴛʀᴀᴅᴀ. )'}`
}

exports.advAutomatica = (jid, qtd, motivo) => {
return `- ⚠️ \`𝙰𝙳𝚅 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> 📊 ׄ ( ᴀᴅᴠ: ${qtd}/3 )
> 📝 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo} )`
}
exports.muteUso = prefix => {
return `- 🔇 \`𝙼𝚄𝚃𝙴\`

> 🔇 ׄ ( sɪʟᴇɴᴄɪᴀʀ: ${prefix}mute @usuario silenciar )
> 🔇 ׄ ( ʙᴀɴ: ${prefix}mute @usuario ban )`
}

exports.muteMesmo = () => {
return `- ❌ \`𝙼𝚄𝚃𝙴\`

> ❌ ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sɪʟᴇɴᴄɪᴀʀ ᴀ sɪ ᴍᴇsᴍᴏ. )`
}

exports.muteAtivado = (jid, modo) => {
return `- 🔇 \`𝙼𝚄𝚃𝙴 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> ⚙️ ׄ ( ᴍᴏᴅᴏ: ${modo === 'ban' ? 'ʀᴇᴍᴏᴠᴇʀ ᴀᴏ ғᴀʟᴀʀ' : 'ᴀᴘᴀɢᴀʀ ᴍᴇɴsᴀɢᴇɴs'} )`
}

exports.desmuteUso = prefix => {
return `- 🔊 \`𝙳𝙴𝚂𝙼𝚄𝚃𝙴\`

> 🔊 ׄ ( ᴜsᴏ: ${prefix}desmute @usuario )`
}

exports.muteDesativado = jid => {
return `- 🔊 \`𝙼𝚄𝚃𝙴 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> 🔊 ׄ ( @${String(jid).split('@')[0]} — ᴘᴏᴅᴇ ᴠᴏʟᴛᴀʀ ᴀ ғᴀʟᴀʀ. )`
}

exports.muteNaoAtivo = jid => {
return `- ⚠️ \`𝙽𝙰̃𝙾 𝙴𝚂𝚃𝙰́ 𝙼𝚄𝚃𝙰𝙳𝙾\`

> ⚠️ ׄ ( @${String(jid).split('@')[0]} — ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴀ ʟɪsᴛᴀ. )`
}

exports.muteLista = lista => {
return `- 🔇 \`𝙻𝙸𝚂𝚃𝙰 𝙳𝙴 𝙼𝚄𝚃𝙴\`

${lista.length ? lista.map((x, i) => `> 🔇 ׄ ( ${i + 1} — @${String(x.id).split('@')[0]} • ${x.modo} )`).join('\n') : '> 🔇 ׄ ( ɴɪɴɢᴜᴇ́ᴍ sɪʟᴇɴᴄɪᴀᴅᴏ. )'}`
}

exports.muteBanDisparado = (jid, ok) => {
return `- 🚫 \`𝙼𝚄𝚃𝙴 𝙱𝙰𝙽\`

> 🚫 ׄ ( @${String(jid).split('@')[0]} — ${ok ? 'ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴀᴏ ᴛᴇɴᴛᴀʀ ғᴀʟᴀʀ.' : 'ᴛᴇɴᴛᴏᴜ ғᴀʟᴀʀ, ᴍᴀs ɴᴀ̃ᴏ ᴄᴏɴsᴇɢᴜɪ ʀᴇᴍᴏᴠᴇʀ.'} )`
}
exports.tokenMpUso = prefix => {
return `- 💳 \`𝙼𝙴𝚁𝙲𝙰𝙳𝙾 𝙿𝙰𝙶𝙾\`

> 💳 ׄ ( ᴜsᴏ: ${prefix}tokenmp ACCESS_TOKEN )`
}

exports.tokenMpPrivado = () => {
return `- 🔐 \`𝚂𝙴𝙶𝚄𝚁𝙰𝙽𝙲̧𝙰\`

> 🔐 ׄ ( ᴄᴏɴғɪɢᴜʀᴇ ᴏ ᴛᴏᴋᴇɴ ᴀᴘᴇɴᴀs ɴᴏ ᴘʀɪᴠᴀᴅᴏ ᴅᴏ ʙᴏᴛ. )`
}

exports.tokenMpSalvo = () => {
return `- ✅ \`𝙼𝙴𝚁𝙲𝙰𝙳𝙾 𝙿𝙰𝙶𝙾\`

> ✅ ׄ ( ᴛᴏᴋᴇɴ sᴀʟᴠᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.tokenMpAusente = () => {
return `- 💳 \`𝙿𝙸𝚇 𝙽𝙰̃𝙾 𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝙳𝙾\`

> 💳 ׄ ( ᴏ ᴅᴏɴᴏ ᴀɪɴᴅᴀ ɴᴀ̃ᴏ ᴄᴏɴғɪɢᴜʀᴏᴜ ᴏ ᴛᴏᴋᴇɴ ᴅᴏ ᴍᴇʀᴄᴀᴅᴏ ᴘᴀɢᴏ. )`
}
exports.modoRpgUso = prefix => {
return `- 🐉 \`𝙼𝙾𝙳𝙾 𝚁𝙿𝙶\`

> 🐉 ׄ ( ᴀᴛɪᴠᴀʀ: ${prefix}modorpg 1 )
> 🐉 ׄ ( ᴅᴇsᴀᴛɪᴠᴀʀ: ${prefix}modorpg 0 )`
}

exports.modoCoinsUso = prefix => {
return `- 🪙 \`𝙼𝙾𝙳𝙾 𝙲𝙾𝙸𝙽𝚂\`

> 🪙 ׄ ( ᴀᴛɪᴠᴀʀ: ${prefix}modocoins 1 )
> 🪙 ׄ ( ᴅᴇsᴀᴛɪᴠᴀʀ: ${prefix}modocoins 0 )`
}

exports.modoAlterado = (nome, ativo) => {
return `- ${ativo ? '✅' : '❌'} \`${nome}\`

> 🧊 ׄ ( sᴛᴀᴛᴜs: ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.rpgDesativado = prefix => {
return `- 🐉 \`𝚁𝙿𝙶 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 🐉 ׄ ( ᴜsᴇ ${prefix}modorpg 1 ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ. )`
}

exports.coinsDesativado = prefix => {
return `- 🪙 \`𝙲𝙾𝙸𝙽𝚂 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 🪙 ׄ ( ᴜsᴇ ${prefix}modocoins 1 ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ. )`
}

exports.rpgCoinsDesativado = prefix => {
return `- 🔐 \`𝚁𝙿𝙶 + 𝙲𝙾𝙸𝙽𝚂\`

> 🔐 ׄ ( ᴘᴇᴛ/ᴘᴏᴋᴇ́ᴍᴏɴ ᴘʀᴇᴄɪsᴀᴍ ᴅᴇ ${prefix}modorpg 1 ᴇ ${prefix}modocoins 1. )`
}
exports.modoIaUso = prefix => {
return `- 🧠 \`𝙼𝙾𝙳𝙾 𝙸𝙰\`

> 🧠 ׄ ( ᴛᴇxᴛᴏ: ${prefix}modoia 1 texto )
> 🧠 ׄ ( ᴀ́ᴜᴅɪᴏ: ${prefix}modoia 1 audio )
> 🧠 ׄ ( ᴛʀᴏᴄᴀʀ: ${prefix}modoia texto|audio )
> 🧠 ׄ ( ᴅᴇsʟɪɢᴀʀ: ${prefix}modoia 0 )
> 🧠 ׄ ( ᴇsᴘᴏɴᴛᴀ̂ɴᴇᴏ: ${prefix}modoia espontaneo 1/0 )`
}

exports.modoIaAlterado = (ativo, tipo) => {
return `- 🧠 \`𝙼𝙾𝙳𝙾 𝙸𝙰\`

> ⚙️ ׄ ( sᴛᴀᴛᴜs: ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )
> 🧠 ׄ ( ${tipo === 'audio' ? '🎙️' : '⌨️'} ғᴏʀᴍᴀᴛᴏ — ${tipo} )`
}

exports.iaFale = () => {
return `- 🧠 \`𝚃𝙾𝙺𝙸𝚃𝙾 𝙸𝙰\`

> 🧠 ׄ ( ᴍᴇ ғᴀʟᴀ ᴏ ǫᴜᴇ ᴠᴏᴄᴇ̂ ǫᴜᴇʀ ǫᴜᴇ ᴇᴜ ғᴀᴄ̧ᴀ. )`
}

exports.iaErro = () => {
return `- ❌ \`𝙼𝙾𝙳𝙾 𝙸𝙰\`

> ❌ ׄ ( ᴅᴇᴜ ᴜᴍ ᴇʀʀᴏ ᴛᴇɴᴛᴀɴᴅᴏ ᴘᴇɴsᴀʀ ɴɪssᴏ. )`
}
exports.antiCanalUso = prefix => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

> 📡 ׄ ( ᴀᴛɪᴠᴀʀ: ${prefix}anticanal 1 )
> 📡 ׄ ( ᴅᴇsᴀᴛɪᴠᴀʀ: ${prefix}anticanal 0 )`
}

exports.antiCanalAlterado = ativo => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

> 📡 ׄ ( sᴛᴀᴛᴜs: ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.antiCanalRemovido = jid => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

> 📡 ׄ ( @${String(jid).split('@')[0]} — ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴘᴏʀ ᴇɴᴠɪᴀʀ/ᴇɴᴄᴀᴍɪɴʜᴀʀ ᴜᴍ ᴄᴀɴᴀʟ. )`
}
exports.serAdmOk = jid => {
return `- 👑 \`𝚂𝙴𝚁 𝙰𝙳𝙼\`

> 👑 ׄ ( @${String(jid).split('@')[0]} — ᴀɢᴏʀᴀ ᴇ́ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ. )`
}

exports.serMembroOk = jid => {
return `- 👤 \`𝚂𝙴𝚁 𝙼𝙴𝙼𝙱𝚁𝙾\`

> 👤 ׄ ( @${String(jid).split('@')[0]} — ᴀɢᴏʀᴀ ᴇ́ ᴍᴇᴍʙʀᴏ ᴄᴏᴍᴜᴍ. )`
}
exports.grupoEntrou = ({ nome = 'Grupo', quantidade = 0, link = '', id = '' } = {}) => {
return `- 👥 \`𝙶𝚁𝚄𝙿𝙾 𝙰𝙲𝙴𝚂𝚂𝙰𝙳𝙾\`

> ✅ ׄ ( ᴇɴᴛʀᴇɪ ɴᴏ ɢʀᴜᴘᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )
> 🏷️ ׄ ( ɴᴏᴍᴇ: ${nome || 'Grupo'} )
> 👤 ׄ ( ᴍᴇᴍʙʀᴏs: ${Number(quantidade || 0)} )
> 🔗 ׄ ( ʟɪɴᴋ: ${link || 'Não informado'} )
${id ? `> 🆔 ׄ ( ɢʀᴜᴘᴏ: ${id} )\n` : ''}> 💾 ׄ ( ɢʀᴜᴘᴏ sᴀʟᴠᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ɴᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴀʟᴜɢᴜᴇʟ. )`
}

exports.aluguelSaveGp = ({ nome = 'Grupo', quantidade = 0, id = '', link = '' } = {}) => {
return `- 💾 \`𝚂𝙰𝚅𝙴𝙶𝙿\`

> ✅ ׄ ( ɢʀᴜᴘᴏ ʀᴇɢɪsᴛʀᴀᴅᴏ ɴᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴀʟᴜɢᴜᴇʟ. )
> 🏷️ ׄ ( ɴᴏᴍᴇ: ${nome || 'Grupo'} )
> 👤 ׄ ( ᴍᴇᴍʙʀᴏs: ${Number(quantidade || 0)} )
${id ? `> 🆔 ׄ ( ɢʀᴜᴘᴏ: ${id} )\n` : ''}${link ? `> 🔗 ׄ ( ʟɪɴᴋ: ${link} )\n` : ''}> ♾️ ׄ ( sᴇᴍ ᴠᴇɴᴄɪᴍᴇɴᴛᴏ (sᴀᴠᴇɢᴘ). )`
}

exports.aluguelModo = ativo => {
return `- 🏠 \`𝙼𝙾𝙳𝙾 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> 🏠 ׄ ( sᴛᴀᴛᴜs: ${ativo ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.aluguelDesativado = () => {
return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 🏠 ׄ ( ᴏ ᴍᴏᴅᴏ ᴀʟᴜɢᴜᴇʟ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴀᴛɪᴠᴏ. )`
}

exports.aluguelUso = prefix => {
return `- 🛒 \`𝙰𝙻𝚄𝙶𝙰𝚁 𝙱𝙾𝚃\`

> 🛒 ׄ ( ᴜsᴏ: ${prefix}alugarbot https://chat.whatsapp.com/... )`
}

exports.aluguelPedido = (nome, link, planos, prefix) => {
return `- 🛒 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙳𝙾 𝙱𝙾𝚃\`

> 🛒 ׄ ( ${nome} — ɢʀᴜᴘᴏ. )
> 🛒 ׄ ( ${link} — ʟɪɴᴋ. )

${planos.map(p => `> 🛒 ׄ ( ${p.nome} — ʀ$ ${Number(p.preco).toFixed(2)} • ${p.dias} ᴅɪᴀs )
> 🛒 ׄ ( ${prefix}pixalugar ${p.preco} — ɢᴇʀᴀʀ ᴘᴀɢᴀᴍᴇɴᴛᴏ. )`).join('\n\n')}`
}

exports.aluguelSemPlanos = () => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙿𝙻𝙰𝙽𝙾𝚂\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ʜᴀ́ ᴘʟᴀɴᴏs ᴄᴀᴅᴀsᴛʀᴀᴅᴏs ᴇᴍ ᴘʟᴀɴᴏs.ᴊsᴏɴ. )`
}

exports.aluguelSemPedido = prefix => {
return `- ❌ \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`

> ❌ ׄ ( ᴜsᴇ ${prefix}alugarbot ʟɪɴᴋ-ᴅᴏ-ɢʀᴜᴘᴏ ᴘʀɪᴍᴇɪʀᴏ. )`
}

exports.aluguelPlanoInvalido = () => {
return `- ❌ \`𝙿𝙻𝙰𝙽𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> ❌ ׄ ( ᴇsᴄᴏʟʜᴀ ᴜᴍ ᴅᴏs ᴠᴀʟᴏʀᴇs ᴅᴏ ᴄᴀᴛᴀ́ʟᴏɢᴏ. )`
}

exports.aluguelPix = (item) => {
return `- 💳 \`𝙿𝙸𝚇 𝙳𝙾 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> 📦 ׄ ( ᴘʟᴀɴᴏ: ${item.plano.nome} )
> 💸 ׄ ( ᴠᴀʟᴏʀ: ʀ$ ${Number(item.plano.preco).toFixed(2)} )
> ⏳ ׄ ( ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ${item.plano.dias} ᴅɪᴀs )
> ⚙️ ׄ ( ɪᴅ: ${item.id} )
> 🪫 ׄ ( ᴀɢᴜᴀʀᴅᴀɴᴅᴏ ᴘᴀɢᴀᴍᴇɴᴛᴏ )

> 💳 ׄ ( ᴏ sɪsᴛᴇᴍᴀ ᴠᴇʀɪғɪᴄᴀ ᴀ ᴀᴘʀᴏᴠᴀᴄ̧ᴀ̃ᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ. )`
}
exports.aluguelAguardandoGrupo = () => {
return `- ⏳ \`𝙰𝙶𝚄𝙰𝚁𝙳𝙰𝙽𝙳𝙾 𝙴𝙽𝚃𝚁𝙰𝙳𝙰\`

> ✅ ׄ ( ᴏ sᴇᴜ ᴘᴀɢᴀᴍᴇɴᴛᴏ ᴊᴀ́ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴏ. )

> 👥 ׄ ( ᴀɢᴜᴀʀᴅᴀɴᴅᴏ ᴀ ᴇɴᴛʀᴀᴅᴀ ᴅᴏ ʙᴏᴛ ɴᴏ ɢʀᴜᴘᴏ ᴘᴀʀᴀ ᴀᴛɪᴠᴀʀ ᴏ ᴀʟᴜɢᴜᴇʟ. )`
}

exports.aluguelLinkInvalido = () => {
return `- ❌ \`𝙻𝙸𝙽𝙺 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> 🔗 ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴀᴄᴇssᴀʀ ᴏ ʟɪɴᴋ ᴅᴏ ɢʀᴜᴘᴏ. ᴠᴇʀɪғɪǫᴜᴇ sᴇ ᴏ ʟɪɴᴋ ᴇ́ ᴠᴀ́ʟɪᴅᴏ. )`
}

exports.aluguelGrupoNaoIdentificado = () => {
return `- ⚠️ \`𝙶𝚁𝚄𝙿𝙾 𝙽𝙰̃𝙾 𝙸𝙳𝙴𝙽𝚃𝙸𝙵𝙸𝙲𝙰𝙳𝙾\`

> 👥 ׄ ( ᴏ ᴘᴀɢᴀᴍᴇɴᴛᴏ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴏ, ᴍᴀs ᴀɪɴᴅᴀ ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴғɪʀᴍᴀʀ ᴀ ᴇɴᴛʀᴀᴅᴀ ᴅᴏ ʙᴏᴛ. )`
}

exports.aluguelSolicitacaoEnviada = nome => {
return `- 📥 \`𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙰̃𝙾 𝙴𝙽𝚅𝙸𝙰𝙳𝙰\`

> 👥 ׄ ( ${nome || '𝙶𝚁𝚄𝙿𝙾'} — ᴏ ᴘᴀɢᴀᴍᴇɴᴛᴏ ғᴏɪ ᴀᴘʀᴏᴠᴀᴅᴏ. )

> ⏳ ׄ ( ᴀ sᴏʟɪᴄɪᴛᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴇɴᴛʀᴀᴅᴀ ғᴏɪ ᴇɴᴠɪᴀᴅᴀ. ᴏ ᴀʟᴜɢᴜᴇʟ sᴇʀᴀ́ ᴀᴛɪᴠᴀᴅᴏ ᴀssɪᴍ ǫᴜᴇ ᴏ ʙᴏᴛ ᴇɴᴛʀᴀʀ ɴᴏ ɢʀᴜᴘᴏ. )`
}

exports.aluguelAtivadoGrupo = (g, comprador) => {
const fim = new Date(g.expiraEm).toLocaleString(
'pt-BR',
{ timeZone: 'America/Sao_Paulo' }
)

return `- ✅ \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> 📦 ׄ ( ᴘʟᴀɴᴏ: ${g.planoNome || 'Plano'} )
> ⏳ ׄ ( ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ${g.duracaoDias || 0} ᴅɪᴀs )
> 📅 ׄ ( ᴠᴇɴᴄɪᴍᴇɴᴛᴏ: ${fim} )
> 👤 ׄ ( ᴄᴏᴍᴘʀᴀᴅᴏʀ: @${String(comprador || '').split('@')[0]} )

> 🧊 ׄ ( ᴏ ʙᴏᴛ ᴇɴᴛʀᴏᴜ ɴᴏ ɢʀᴜᴘᴏ ᴇ ᴏ ᴀʟᴜɢᴜᴇʟ ғᴏɪ ʀᴇɢɪsᴛʀᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}
exports.aluguelManualUso = prefix => {
return `- 🏠 \`𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝚁 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> 🏠 ׄ ( ᴜsᴏ: ${prefix}rgaluguel dias [horas] )`
}

exports.aluguelManualOk = data => {
return `- ✅ \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙰𝚃𝙸𝚅𝙰𝙳𝙾\`

> ✅ ׄ ( ᴠᴇɴᴄɪᴍᴇɴᴛᴏ: ${data} )`
}

exports.aluguelNaoTem = () => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> ⚠️ ׄ ( ᴇsᴛᴇ ɢʀᴜᴘᴏ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴀʟᴜɢᴜᴇʟ ᴀᴛɪᴠᴏ. )`
}

exports.aluguelVer = g => {
const permanente = !g.expiraEm
let vencimento = 'Sem vencimento'
let resta = '♾️ permanente'

if (!permanente) {
const fim = new Date(g.expiraEm)
const diff = Math.max(0, fim - Date.now())
const d = Math.floor(diff / 86400000)
const h = Math.floor(diff / 3600000) % 24
const min = Math.floor(diff / 60000) % 60

vencimento = fim.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
resta = `${d}d ${h}h ${min}m`
}

return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙰𝚃𝙸𝚅𝙾\`

> 📦 ׄ ( ᴘʟᴀɴᴏ: ${g.planoNome || 'Plano'} )
${g.grupoNome ? `> 🏷️ ׄ ( ɢʀᴜᴘᴏ: ${g.grupoNome} )\n` : ''}${g.quantidadeMembros ? `> 👤 ׄ ( ᴍᴇᴍʙʀᴏs: ${g.quantidadeMembros} )\n` : ''}> 📅 ׄ ( ᴠᴇɴᴄᴇ: ${vencimento} )
> ⏳ ׄ ( ʀᴇsᴛᴀ: ${resta} )`
}

exports.aluguelLista = lista => {
return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴́𝙸𝚂\`

${lista.length ? lista.map((g, i) => `> 🏠 ׄ ( ${i + 1} — ${g.id} )
> 🏠 ׄ ( ${g.ativo !== false ? '✅ ativo' : '❌ expirado'} — ${g.planoNome || 'Plano'} • ${g.expiraEm ? new Date(g.expiraEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'sem vencimento'} )`).join('\n\n') : '> 🏠 ׄ ( ɴᴇɴʜᴜᴍ ᴀʟᴜɢᴜᴇʟ ʀᴇɢɪsᴛʀᴀᴅᴏ. )'}`
}

exports.aluguelRemovido = id => {
return `- 🗑️ \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`

> 🗑️ ׄ ( ${id} — ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴏ sɪsᴛᴇᴍᴀ. )`
}
exports.antiCanalAdv = (jid, qtd, removido = false) => {
return `- 📡 \`𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> ⚠️ ׄ ( ᴀᴅᴠ: ${qtd}/3 )
> 📝 ׄ ( ᴇɴᴠɪᴏ/ᴅɪᴠᴜʟɢᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴄᴀɴᴀʟ )
> 🚫 ׄ ( sᴛᴀᴛᴜs: ${removido ? 'removido ao atingir o limite' : 'mensagem apagada e advertência aplicada'} )`
}

exports.aluguelBloqueado = prefix => {
return `- 🏠 \`𝙰𝙻𝚄𝙶𝚄𝙴𝙻 𝙴𝚇𝙿𝙸𝚁𝙰𝙳𝙾\`

> 🏠 ׄ ( ᴇsᴛᴇ ɢʀᴜᴘᴏ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴀʟᴜɢᴜᴇʟ ᴀᴛɪᴠᴏ. ᴘᴀʀᴀ ᴄᴏᴍᴘʀᴀʀ ᴜsᴇ ${prefix}alugarbot ɴᴏ ᴘʀɪᴠᴀᴅᴏ ᴅᴏ ʙᴏᴛ. )`
}

exports.protecaoAdv = (emoji, titulo, jid, qtd, motivo, removido = false) => {
return `- ${emoji} \`${titulo}\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> ⚠️ ׄ ( ᴀᴅᴠ: ${qtd}/3 )
> 📝 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo} )
> 🚫 ׄ ( sᴛᴀᴛᴜs: ${removido ? 'removido ao atingir 3 advertências' : 'mensagem apagada e advertência registrada'} )`
}

exports.advAutomaticaDetalhe = (jid, qtd, motivo, removido = false) => {
return `- ⚠️ \`𝙰𝙳𝚅 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> 📊 ׄ ( ᴀᴅᴠ: ${qtd}/3 )
> 📝 ׄ ( ᴍᴏᴛɪᴠᴏ: ${motivo} )
> 🚫 ׄ ( sᴛᴀᴛᴜs: ${removido ? 'removido ao atingir o limite' : 'advertência automática registrada'} )`
}
exports.coinsSaldo = (jid, saldo) => {
return `- 🪙 \`𝙽-𝙲𝙾𝙸𝙽𝚂\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${String(jid).split('@')[0]} )
> 💰 ׄ ( sᴀʟᴅᴏ: ${Number(saldo || 0).toLocaleString('pt-BR')} ɴ-ᴄᴏɪɴs )`
}

exports.coinsCooldown = s => {
return `- ⏳ \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴\`

> ⏳ ׄ ( ᴠᴏᴄᴇ̂ ᴘᴏᴅᴇ ᴜsᴀʀ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ${s}s. )`
}

exports.coinsMinerado = (jid, g, total) => {
return `- ⛏️ \`𝙼𝙸𝙽𝙴𝚁𝙰𝙲̧𝙰̃𝙾\`

> 👤 ׄ ( @${String(jid).split('@')[0]} )
> 💎 ׄ ( ɢᴀɴʜᴏ: +${g} ɴ-ᴄᴏɪɴs )
> 💰 ׄ ( sᴀʟᴅᴏ: ${total} )`
}

exports.coinsDoarUso = p => {
return `- 🪙 \`𝙳𝙾𝙰𝚁 𝙲𝙾𝙸𝙽𝚂\`

> 🪙 ׄ ( ᴜsᴏ: ${p}doarcoins @usuario 100 )`
}

exports.coinsDoarMesmo = () => {
return `- ❌ \`𝙳𝙾𝙰𝙲̧𝙰̃𝙾\`

> ❌ ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ ᴅᴏᴀʀ ᴘᴀʀᴀ sɪ ᴍᴇsᴍᴏ. )`
}

exports.coinsSemSaldo = (v, s) => {
return `- 💸 \`𝚂𝙰𝙻𝙳𝙾 𝙸𝙽𝚂𝚄𝙵𝙸𝙲𝙸𝙴𝙽𝚃𝙴\`

> 💰 ׄ ( ɴᴇᴄᴇssᴀ́ʀɪᴏ: ${v} )
> 🪙 ׄ ( sᴇᴜ sᴀʟᴅᴏ: ${s} )`
}

exports.coinsDoado = (a, b, v, s) => {
return `- ✅ \`𝚃𝚁𝙰𝙽𝚂𝙵𝙴𝚁𝙴̂𝙽𝙲𝙸𝙰\`

> 👤 ׄ ( ᴅᴇ: @${a.split('@')[0]} )
> 👤 ׄ ( ᴘᴀʀᴀ: @${b.split('@')[0]} )
> 🪙 ׄ ( ᴠᴀʟᴏʀ: ${v} )
> 💰 ׄ ( sᴀʟᴅᴏ: ${s} )`
}

exports.coinsRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙽-𝙲𝙾𝙸𝙽𝚂\`

${l.length ? l.map((x, i) => `> 🏆 ׄ ( ${i + 1}° — @${x.jid.split('@')[0]} • ${x.valor.toLocaleString('pt-BR')} )`).join('\n') : '> 🏆 ׄ ( sᴇᴍ ᴜsᴜᴀ́ʀɪᴏs ᴀɪɴᴅᴀ. )'}`
}

exports.coinsGerenciarUso = (p, c) => {
return `- 🪙 \`𝙶𝙴𝚁𝙴𝙽𝙲𝙸𝙰𝚁 𝙲𝙾𝙸𝙽𝚂\`

> 🪙 ׄ ( ${p}${c} @usuario 1000 )`
}

exports.coinsGerenciado = (j, s, r) => {
return `- ${r ? '➖' : '➕'} \`𝙽-𝙲𝙾𝙸𝙽𝚂\`

> 🧊 ׄ ( @${j.split('@')[0]} ᴀɢᴏʀᴀ ᴘᴏssᴜɪ ${s} ɴ-ᴄᴏɪɴs. )`
}
exports.levelPerfil = (j, u, pos) => {
return `- 🎖️ \`𝙻𝙴𝚅𝙴𝙻\`

> 👤 ׄ ( @${j.split('@')[0]} )
> ⭐ ׄ ( ʟᴇᴠᴇʟ: ${u.level} )
> 🧠 ׄ ( xᴘ: ${u.xp} )
> 🎖️ ׄ ( ᴘᴀᴛᴇɴᴛᴇ: ${u.patente} )
> 🏆 ׄ ( ʀᴀɴᴋ: #${pos || '-'} )`
}

exports.levelRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙻𝙴𝚅𝙴𝙻\`

${l.length ? l.map((x, i) => `> 🏆 ׄ ( ${i + 1}° — @${x.jid.split('@')[0]} • ${x.valor} xᴘ • ${x.u.patente} )`).join('\n') : '> 🏆 ׄ ( 0: sᴇᴍ xᴘ ᴀɪɴᴅᴀ. )'}`
}

exports.levelUp = (j, u) => {
return `- 🎉 \`𝙻𝙴𝚅𝙴𝙻 𝚄𝙿\`

> 🎉 ׄ ( @${j.split('@')[0]} ᴅᴇsʙʟᴏǫᴜᴇᴏᴜ ᴀ ᴘᴀᴛᴇɴᴛᴇ *${u.patente}* ᴄᴏᴍ ${u.xp} xᴘ! )`
}

exports.levelGerenciarUso = (p, c) => {
return `- 🎖️ \`𝙶𝙴𝚁𝙴𝙽𝙲𝙸𝙰𝚁 𝚇𝙿\`

> 🎖️ ׄ ( ${p}${c} @usuario 100 )`
}

exports.levelGerenciado = (j, u, r) => {
return `- ${r ? '➖' : '➕'} \`𝚇𝙿\`

> 🧊 ׄ ( @${j.split('@')[0]} • ${u.xp} xᴘ • ʟᴇᴠᴇʟ ${u.level} • ${u.patente} )`
}
exports.petShop = (pets, p) => {
return `- 🐾 \`𝙿𝙴𝚃 𝚂𝙷𝙾𝙿\`

${Object.entries(pets).map(([k, v]) => `> 🐾 ׄ ( ${v.nome} — ${v.preco} ɴ-ᴄᴏɪɴs )
> 🐾 ׄ ( ${p}comprarpet ${k} — ᴄᴏᴍᴘʀᴀʀ. )`).join('\n\n')}`
}

exports.petJaTem = () => {
return `- 🐾 \`𝙿𝙴𝚃\`

> 🐾 ׄ ( ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴘᴏssᴜɪ ᴜᴍ ᴘᴇᴛ. )`
}

exports.petNaoTem = p => {
return `- 🐾 \`𝚂𝙴𝙼 𝙿𝙴𝚃\`

> 🐾 ׄ ( ᴜsᴇ ${p}petshop ᴇ ${p}comprarpet. )`
}

exports.petComprado = (t, v, s) => {
return `- 🐾 \`𝙿𝙴𝚃 𝙰𝙳𝙾𝚃𝙰𝙳𝙾\`

> 🐾 ׄ ( ᴛɪᴘᴏ: ${t} )
> 💸 ׄ ( ᴠᴀʟᴏʀ: ${v} )
> 🪙 ׄ ( sᴀʟᴅᴏ: ${s} )`
}

exports.petPerfil = (j, p) => {
return `- 🐾 \`𝙼𝙴𝚄 𝙿𝙴𝚃\`

> 👤 ׄ ( @${j.split('@')[0]} )
> 🐾 ׄ ( ɴᴏᴍᴇ: ${p.apelido || p.tipo} )
> 🍖 ׄ ( ғᴏᴍᴇ: ${p.fome}% )
> 💖 ׄ ( ᴀғᴇᴛᴏ: ${p.afeto || 0} )
> ⭐ ׄ ( ɴɪ́ᴠᴇʟ: ${p.nivel || 1} )
> 🧠 ׄ ( xᴘ: ${p.xp || 0} )
> 😴 ׄ ( sᴛᴀᴛᴜs: ${p.dormindo ? 'dormindo' : 'acordado'} )`
}

exports.petAlimentado = (p, c) => {
return `- 🍖 \`𝙿𝙴𝚃 𝙰𝙻𝙸𝙼𝙴𝙽𝚃𝙰𝙳𝙾\`

> 🍖 ׄ ( ${p.apelido || p.tipo} está com ${p.fome}% de fome. Custo: ${c} N-Coins. )`
}

exports.petCuidado = (p, t) => {
return `- 🐾 \`𝙲𝚄𝙸𝙳𝙰𝙳𝙾 𝙳𝙾 𝙿𝙴𝚃\`

> 🐾 ׄ ( ${p.apelido || p.tipo} ${t} )`
}

exports.petApelidoUso = p => {
return `- 🐾 \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> 🐾 ׄ ( ${p}apelidopet nome )`
}

exports.petApelido = n => {
return `- ✅ \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> ✅ ׄ ( sᴇᴜ ᴘᴇᴛ ᴀɢᴏʀᴀ sᴇ ᴄʜᴀᴍᴀ ${n}. )`
}

exports.petVendido = (v, s) => {
return `- 💸 \`𝙿𝙴𝚃 𝚅𝙴𝙽𝙳𝙸𝙳𝙾\`

> 💸 ׄ ( ᴠᴏᴄᴇ̂ ʀᴇᴄᴇʙᴇᴜ ${v} ɴ-ᴄᴏɪɴs. sᴀʟᴅᴏ: ${s}. )`
}

exports.petRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙿𝙴𝚃𝚂\`

${l.length ? l.map((x, i) => `> 🏆 ׄ ( ${i + 1}° — @${x.jid.split('@')[0]} • ${x.pet.apelido || x.pet.tipo} • ${x.pet.xp || 0} xᴘ )`).join('\n') : '> 🏆 ׄ ( 0: sᴇᴍ ᴘᴇᴛs ᴀɪɴᴅᴀ. )'}`
}

exports.pokemonShop = (itens, p, raro) => {
return `- ${raro ? '🌌' : '🏪'} \`${raro ? '𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝚁𝙰𝚁𝙾𝚂' : '𝙻𝙾𝙹𝙰 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽'}\`

${itens.map(([k, v]) => `> 🧊 ׄ ( ${v.nome} — ${v.tipo} )
> 🧊 ׄ ( ${v.preco} ɴ-ᴄᴏɪɴs — ᴘʀᴇᴄ̧ᴏ. )
> 🧊 ׄ ( ${v.habilidade} — ʜᴀʙɪʟɪᴅᴀᴅᴇ. )
> 🧊 ׄ ( ${p}comprarpokemon ${k} — ᴄᴏᴍᴘʀᴀʀ. )`).join('\n\n')}`
}

exports.pokemonInvalido = p => {
return `- ❌ \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> ❌ ׄ ( ᴜsᴇ ${p}lojapokemon. )`
}

exports.pokemonJaTem = () => {
return `- ⚠️ \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

> ⚠️ ׄ ( ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴘᴏssᴜɪ ᴜᴍ ᴘᴏᴋᴇ́ᴍᴏɴ. )`
}

exports.pokemonNaoTem = p => {
return `- ⚠️ \`𝚂𝙴𝙼 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

> ⚠️ ׄ ( ᴜsᴇ ${p}lojapokemon ᴘᴀʀᴀ ᴄᴏᴍᴘʀᴀʀ. )`
}

exports.pokemonComprado = (p, s) => {
return `- ✅ \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝙲𝙾𝙼𝙿𝚁𝙰𝙳𝙾\`

> ⚪ ׄ ( ${p.nome} )
> 💸 ׄ ( ${p.preco} N-Coins )
> 🪙 ׄ ( sᴀʟᴅᴏ: ${s} )`
}

exports.pokemonPerfil = (j, p, d) => {
return `- ⚡ \`𝙼𝙴𝚄 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

> 👤 ׄ ( @${j.split('@')[0]} )
> ⚪ ׄ ( ɴᴏᴍᴇ: ${p.apelido || d.nome || p.tipo} )
> 🔮 ׄ ( ᴛɪᴘᴏ: ${d.tipo || '-'} )
> 👑 ׄ ( ʀᴀʀɪᴅᴀᴅᴇ: ${d.raridade || '-'} )
> 🍓 ׄ ( ғᴏᴍᴇ: ${p.fome}% )
> 💖 ׄ ( ᴀғᴇᴛᴏ: ${p.afeto || 0} )
> ⭐ ׄ ( ɴɪ́ᴠᴇʟ: ${p.nivel || 1} )
> 🧠 ׄ ( xᴘ: ${p.xp || 0} )
> ✨ ׄ ( ʜᴀʙɪʟɪᴅᴀᴅᴇ: ${d.habilidade || '-'} )`
}

exports.pokemonComidas = (c, p) => {
return `- 🍓 \`𝙲𝙾𝙼𝙸𝙳𝙰𝚂 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

${Object.entries(c).map(([k, v]) => `> 🍓 ׄ ( ${v.nome} — ${v.preco} • +${v.fome}% )
> 🍓 ׄ ( ${p}alimentarpokemon ${k} — ᴀʟɪᴍᴇɴᴛᴀʀ. )`).join('\n\n')}`
}

exports.pokemonAlimentado = (c, p, s) => {
return `- 🍓 \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝙰𝙻𝙸𝙼𝙴𝙽𝚃𝙰𝙳𝙾\`

> 🍓 ׄ ( ${c.nome} ᴜsᴀᴅᴏ. ғᴏᴍᴇ: ${p.fome}% • xᴘ: ${p.xp} • sᴀʟᴅᴏ: ${s}. )`
}

exports.pokemonApelidoUso = p => {
return `- ⚡ \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> ⚡ ׄ ( ${p}apelidopokemon nome )`
}

exports.pokemonApelido = n => {
return `- ✅ \`𝙰𝙿𝙴𝙻𝙸𝙳𝙾\`

> ✅ ׄ ( sᴇᴜ ᴘᴏᴋᴇ́ᴍᴏɴ ᴀɢᴏʀᴀ sᴇ ᴄʜᴀᴍᴀ ${n}. )`
}

exports.pokemonNaoEvolui = () => {
return `- ⚠️ \`𝙴𝚅𝙾𝙻𝚄𝙲̧𝙰̃𝙾\`

> ⚠️ ׄ ( ᴇsᴛᴇ ᴘᴏᴋᴇ́ᴍᴏɴ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴇᴠᴏʟᴜᴄ̧ᴀ̃ᴏ ᴅɪsᴘᴏɴɪ́ᴠᴇʟ. )`
}

exports.pokemonNivelEvoluir = n => {
return `- 🔒 \`𝙴𝚅𝙾𝙻𝚄𝙲̧𝙰̃𝙾\`

> 🔒 ׄ ( sᴇᴜ ᴘᴏᴋᴇ́ᴍᴏɴ ᴘʀᴇᴄɪsᴀ ᴇsᴛᴀʀ ɴᴏ ɴɪ́ᴠᴇʟ ${n}. )`
}

exports.pokemonEvoluiu = (a, b) => {
return `- ✨ \`𝙴𝚅𝙾𝙻𝚄𝙲̧𝙰̃𝙾\`

> ✨ ׄ ( ${a} ᴇᴠᴏʟᴜɪᴜ ᴘᴀʀᴀ ${b}! )`
}

exports.pokemonMissao = (p, g, x, s) => {
return `- 🗺️ \`𝙼𝙸𝚂𝚂𝙰̃𝙾 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

> 🗺️ ׄ ( ${p.apelido || p.tipo} voltou com +${g} N-Coins e +${x} XP. Saldo: ${s}. )`
}

exports.pokemonVendido = (v, s) => {
return `- 💸 \`𝙿𝙾𝙺𝙴́𝙼𝙾𝙽 𝚅𝙴𝙽𝙳𝙸𝙳𝙾\`

> 💸 ׄ ( ᴠᴏᴄᴇ̂ ʀᴇᴄᴇʙᴇᴜ ${v} ɴ-ᴄᴏɪɴs. sᴀʟᴅᴏ: ${s}. )`
}

exports.pokemonRank = l => {
return `- 🏆 \`𝚁𝙰𝙽𝙺 𝙿𝙾𝙺𝙴́𝙼𝙾𝙽\`

${l.length ? l.map((x, i) => `> 🏆 ׄ ( ${i + 1}° — @${x.jid.split('@')[0]} • ${x.pokemon.apelido || x.pokemon.tipo} • ${x.pokemon.xp || 0} xᴘ )`).join('\n') : '> 🏆 ׄ ( sᴇᴍ ᴘᴏᴋᴇ́ᴍᴏɴ ᴀɪɴᴅᴀ. )'}`
}

exports.cidadeRegistrada = n => {
return `- 🌆 \`𝙲𝙸𝙳𝙰𝙳𝙴\`

> 🌆 ׄ ( ᴄɪᴅᴀᴅᴀ̃ᴏ ${n} ʀᴇɢɪsᴛʀᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.cidadePerfil = (j, u) => {
return `- 🌆 \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙲𝙸𝙳𝙰𝙳𝙴\`

> 👤 ׄ ( @${j.split('@')[0]} )
> 🪪 ׄ ( ${u.cidade?.nome || 'Sem nome'} )
> 💼 ׄ ( ${u.cidade?.cargo || 'Desempregado'} )
> 💰 ׄ ( ᴄᴀʀᴛᴇɪʀᴀ: ${u.coins || 0} )
> 🏦 ׄ ( ʙᴀɴᴄᴏ: ${u.cidade?.saldoBanco || 0} )
> ⚡ ׄ ( ${u.cidade?.energia || 100} )
> 🍔 ׄ ( ${u.cidade?.fome || 100} )
> ❤️ ׄ ( ${u.cidade?.saude || 100} )`
}

exports.cidadeTrabalho = (g, s) => {
return `- 💼 \`𝚃𝚁𝙰𝙱𝙰𝙻𝙷𝙾\`

> 💼 ׄ ( ᴠᴏᴄᴇ̂ ᴛʀᴀʙᴀʟʜᴏᴜ ᴇ ʀᴇᴄᴇʙᴇᴜ ${g} ɴ-ᴄᴏɪɴs. sᴀʟᴅᴏ: ${s}. )`
}

exports.cidadeBancoUso = p => {
return `- 🏦 \`𝙱𝙰𝙽𝙲𝙾\`

> 🏦 ׄ ( ${p}depositar 100 | ${p}sacar 100 )`
}

exports.cidadeBanco = (b, c) => {
return `- 🏦 \`𝙱𝙰𝙽𝙲𝙾\`

> 🏛️ ׄ ( sᴀʟᴅᴏ ʙᴀɴᴄᴏ: ${b} )
> 💰 ׄ ( ᴄᴀʀᴛᴇɪʀᴀ: ${c} )`
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

> 🤖 ׄ ( ᴇᴜ sᴏᴜ ᴏ ʙᴏᴛ 😅 ᴘᴇᴄ̧ᴀ ᴀʟɢᴜᴇ́ᴍ ʀᴇᴀʟ ᴇᴍ ɴᴀᴍᴏʀᴏ. )`
}

exports.namoroPrivadoTerminou = j => {
return `- 💔 \`𝙽𝙰𝙼𝙾𝚁𝙾 𝙴𝙽𝙲𝙴𝚁𝚁𝙰𝙳𝙾\`

> 💔 ׄ ( @${j.split('@')[0]} ᴛᴇʀᴍɪɴᴏᴜ ᴏ ʀᴇʟᴀᴄɪᴏɴᴀᴍᴇɴᴛᴏ. )`
}

exports.minhaDupla = (a, b, t) => {
return `- ❤️ \`𝙼𝙸𝙽𝙷𝙰 𝙳𝚄𝙿𝙻𝙰\`

> 💙 ׄ ( @${a.split('@')[0]} + @${b.split('@')[0]} )
> ⏳ ׄ ( ᴛᴇᴍᴘᴏ: ${t} )`
}

exports.casamentoUso = p => {
return `- 💍 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> 💍 ׄ ( ${p}casar @usuario )`
}

exports.casamentoMesmo = () => {
return `- ❌ \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> ❌ ׄ ( ᴇssᴇ ᴘᴇᴅɪᴅᴏ ɴᴀ̃ᴏ ᴇ́ ᴘᴏssɪ́ᴠᴇʟ. )`
}

exports.casamentoOcupado = () => {
return `- 💍 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> 💍 ׄ ( ᴜᴍ ᴅᴏs ᴜsᴜᴀ́ʀɪᴏs ᴊᴀ́ ᴇsᴛᴀ́ ᴄᴀsᴀᴅᴏ. )`
}

exports.casamentoPendente = () => {
return `- 💌 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴\`

> 💌 ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍ ᴘᴇᴅɪᴅᴏ ᴘᴇɴᴅᴇɴᴛᴇ. )`
}

exports.casamentoPedido = (a, b, p) => {
return `- 💍 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙳𝙴 𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> 👤 ׄ ( ᴅᴇ: @${a.split('@')[0]} )
> 💖 ׄ ( ᴘᴀʀᴀ: @${b.split('@')[0]} )

> 💍 ׄ ( ʀᴇsᴘᴏɴᴅᴀ s/sɪᴍ ᴘᴀʀᴀ ᴀᴄᴇɪᴛᴀʀ ᴏᴜ ɴ/ɴᴀ̃ᴏ ᴘᴀʀᴀ ʀᴇᴄᴜsᴀʀ. )`
}

exports.casamentoSemPedido = () => {
return `- ⚠️ \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴜᴍ ᴘᴇᴅɪᴅᴏ ᴘᴇɴᴅᴇɴᴛᴇ. )`
}

exports.casamentoAceito = (a, b) => {
return `- 💒 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾 𝙰𝙲𝙴𝙸𝚃𝙾\`

> 💒 ׄ ( @${a.split('@')[0]} ᴇ @${b.split('@')[0]} ᴀɢᴏʀᴀ ᴇsᴛᴀ̃ᴏ ᴄᴀsᴀᴅᴏs! 💍 )`
}

exports.casamentoRecusado = (a, b) => {
return `- 💔 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝚁𝙴𝙲𝚄𝚂𝙰𝙳𝙾\`

> 💔 ׄ ( @${b.split('@')[0]} ʀᴇᴄᴜsᴏᴜ ᴏ ᴘᴇᴅɪᴅᴏ ᴅᴇ @${a.split('@')[0]}. )`
}

exports.casamentoCancelado = () => {
return `- ✅ \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾\`

> ✅ ׄ ( ᴘᴇᴅɪᴅᴏ ᴅᴇ ᴄᴀsᴀᴍᴇɴᴛᴏ ᴄᴀɴᴄᴇʟᴀᴅᴏ. )`
}

exports.casamentoSolteiro = () => {
return `- 💍 \`𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> 💍 ׄ ( ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴄᴀsᴀᴅᴏ. )`
}

exports.casamentoDivorcio = (a, b) => {
return `- 💔 \`𝙳𝙸𝚅𝙾́𝚁𝙲𝙸𝙾\`

> 💔 ׄ ( @${a.split('@')[0]} ᴇ @${b.split('@')[0]} ɴᴀ̃ᴏ ᴇsᴛᴀ̃ᴏ ᴍᴀɪs ᴄᴀsᴀᴅᴏs. )`
}

exports.casamentoPerfil = (a, b, t) => {
return `- 💒 \`𝙼𝙴𝚄 𝙲𝙰𝚂𝙰𝙼𝙴𝙽𝚃𝙾\`

> 💍 ׄ ( @${a.split('@')[0]} + @${b.split('@')[0]} )
> ⏳ ׄ ( ${t} )`
}
exports.namoroPedido = (de, para, prefix, botoesAtivos = true) => {
return `- 💌 \`𝙿𝙴𝙳𝙸𝙳𝙾 𝙳𝙴 𝙽𝙰𝙼𝙾𝚁𝙾\`

> 💞 ׄ ( ᴘᴀʀᴀ: @${String(para).split('@')[0]} )
> 💌 ׄ ( *❤️ | ᴜᴍ ᴄᴏʀᴀᴄ̧ᴀ̃ᴏ ᴇsᴛᴀ́ ᴘᴇɴsᴀɴᴅᴏ ᴇᴍ ᴠᴏᴄᴇ̂…* ↴ )

> 💘 ׄ ( ᴅᴇ: @${String(de).split('@')[0]} )

${botoesAtivos
      ? '> 💌 ׄ ( ᴇsᴄᴏʟʜᴀ ᴀʙᴀɪxᴏ sᴇ ᴅᴇsᴇᴊᴀ ᴀᴄᴇɪᴛᴀʀ ᴏᴜ ʀᴇᴄᴜsᴀʀ ᴇsᴛᴇ ᴘᴇᴅɪᴅᴏ. )'
      : '*_ʀᴇsᴘᴏɴᴅᴀ 『 s / sɪᴍ 』 ᴘᴀʀᴀ ᴀᴄᴇɪᴛᴀʀ ᴏᴜ 『 n / ɴᴀ̃ᴏ 』 ᴘᴀʀᴀ ʀᴇᴄᴜsᴀʀ._*'}

> 🕊️ ׄ ( ᴄᴀɴᴄᴇʟᴀʀ: @${String(de).split('@')[0]} ᴘᴏᴅᴇ ᴜsᴀʀ ${prefix}cancelar )`
}
exports.grupoUso = prefix => {
return `- 👥 \`𝙶𝚁𝚄𝙿𝙾\`

> 🔓 ׄ ( ᴀʙʀɪʀ: ${prefix}grupo a )
> 🔒 ׄ ( ғᴇᴄʜᴀʀ: ${prefix}grupo f )

> 👥 ׄ ( ᴜsᴇ 『 ᴀ 』 ᴘᴀʀᴀ ᴀʙʀɪʀ ᴇ 『 ғ 』 ᴘᴀʀᴀ ғᴇᴄʜᴀʀ ᴏ ɢʀᴜᴘᴏ. )`
}

exports.grupoAlterado = aberto => {
return `- ${aberto ? '🔓' : '🔒'} \`𝙶𝚁𝚄𝙿𝙾 ${aberto ? '𝙰𝙱𝙴𝚁𝚃𝙾' : '𝙵𝙴𝙲𝙷𝙰𝙳𝙾'}\`

> 📌 ׄ ( sᴛᴀᴛᴜs: ${aberto ? 'Todos os membros podem enviar mensagens.' : 'Somente administradores podem enviar mensagens.'} )`
}
exports.ffSalaUso = prefix => {
return `- 🎮 \`𝙲𝚁𝙸𝙰𝚁 𝚂𝙰𝙻𝙰 𝙵𝙵\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}criarsala NOME|SENHA|JOGADORES|MODO|REGIÃO )
> 💡 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix}criarsala TESTE|1234|12|1|BR )`
}

exports.ffSalaCriada = ({ NomeDoBot, pushname, sala, roomName, roomPassword, maxPlayers, mode, region, data }) => {
return `- 🎮 \`𝚂𝙰𝙻𝙰 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴 𝙲𝚁𝙸𝙰𝙳𝙰\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🏷️ ׄ ( ɴᴏᴍᴇ: ${sala?.roomName || roomName} )
> 🆔 ׄ ( ʀᴏᴏᴍ ɪᴅ: ${sala?.roomId || 'Indisponível'} )
> 🔐 ׄ ( sᴇssɪᴏɴ ɪᴅ: ${sala?.sessionId || 'Indisponível'} )
> 🔑 ׄ ( sᴇɴʜᴀ: ${sala?.password || roomPassword} )
> 🎯 ׄ ( ᴍᴏᴅᴏ: ${sala?.modeName || mode} )
> 👥 ׄ ( ᴊᴏɢᴀᴅᴏʀᴇs: ${maxPlayers} )
> 🌎 ׄ ( ʀᴇɢɪᴀ̃ᴏ: ${region} )

> 📊 ׄ ( ʀᴇsᴛᴀɴᴛᴇs: ${data?.limite?.restantes ?? 'N/A'} )
> 📈 ׄ ( ᴜsᴀᴅᴀs: ${data?.limite?.usadas ?? 'N/A'} )

> 🎮 ׄ ( ✅ sᴀʟᴀ ᴄʀɪᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ! )`
}

exports.ffVerSalaUso = prefix => {
return `- 🔎 \`𝚅𝙴𝚁 𝚂𝙰𝙻𝙰 𝙵𝙵\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}versala SESSION_ID )`
}

exports.ffSalaInfo = ({ NomeDoBot, pushname, sala, tempo }) => {
return `- 🔎 \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙰 𝚂𝙰𝙻𝙰\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🆔 ׄ ( ʀᴏᴏᴍ ɪᴅ: ${sala?.roomId || 'Indisponível'} )
> 📡 ׄ ( sᴛᴀᴛᴜs: ${sala?.status || 'Indisponível'} )
> ⏱️ ׄ ( ɪɴɪ́ᴄɪᴏ: ${tempo} )
> 🚀 ׄ ( ᴀᴜᴛᴏ sᴛᴀʀᴛ: ${sala?.autoStart ? 'Ativado' : 'Desativado'} )

> 🔎 ׄ ( ✅ sᴀʟᴀ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ! )`
}

exports.ffJogadoresUso = prefix => {
return `- 👥 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁𝙴𝚂 𝙳𝙰 𝚂𝙰𝙻𝙰\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}jogadoressala SESSION_ID )`
}

exports.ffJogadores = ({ NomeDoBot, pushname, players, total }) => {
return `- 👥 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁𝙴𝚂 𝙳𝙰 𝚂𝙰𝙻𝙰\`

> 👥 ׄ ( ${NomeDoBot} — ʙᴏᴛ. )
> 👥 ׄ ( ${pushname} — ᴜsᴜᴀ́ʀɪᴏ. )
> 👥 ׄ ( ${total ?? players.length} — ᴛᴏᴛᴀʟ. )

${players.length ? players.map((p, i) => `> 👥 ׄ ( ${i + 1}° — ${p.nickname || 'Sem nome'} )
> 👥 ׄ ( ${p.uid || 'N/A'} — ᴜɪᴅ • ᴛɪᴍᴇ ${p.team || 'N/A'} )`).join('\n\n') : '> 👥 ׄ ( ɴᴇɴʜᴜᴍ ᴊᴏɢᴀᴅᴏʀ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ. )'}`
}

exports.ffExpulsarUso = prefix => {
return `- 🚫 \`𝙴𝚇𝙿𝚄𝙻𝚂𝙰𝚁 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}expulsarsala SESSION_ID|UID )`
}

exports.ffExpulso = ({ NomeDoBot, pushname, targetUid, message }) => {
return `- 🚫 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁 𝙴𝚇𝙿𝚄𝙻𝚂𝙾\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🆔 ׄ ( ᴜɪᴅ: ${targetUid} )

> 🚫 ׄ ( ✅ ${message || 'Kick enviado com sucesso!'} )`
}

exports.ffIniciarUso = prefix => {
return `- 🚀 \`𝙸𝙽𝙸𝙲𝙸𝙰𝚁 𝚂𝙰𝙻𝙰\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}iniciarsala SESSION_ID )`
}

exports.ffSalaIniciada = ({ NomeDoBot, pushname, sessionId, message }) => {
return `- 🚀 \`𝚂𝙰𝙻𝙰 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙰\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🔐 ׄ ( sᴇssɪᴏɴ ɪᴅ: ${sessionId} )

> 🚀 ׄ ( ✅ ${message || 'Sala iniciada com sucesso!'} )`
}

exports.ffPararUso = prefix => {
return `- ⛔ \`𝙿𝙰𝚁𝙰𝚁 𝚂𝙰𝙻𝙰\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}pararsala SESSION_ID )`
}

exports.ffSalaParada = ({ NomeDoBot, pushname, sessionId, message }) => {
return `- ⛔ \`𝚂𝙰𝙻𝙰 𝙿𝙰𝚁𝙰𝙳𝙰\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🔐 ׄ ( sᴇssɪᴏɴ ɪᴅ: ${sessionId} )

> ⛔ ׄ ( ✅ ${message || 'Sala parada com sucesso!'} )`
}

exports.ffStatusApi = ({ NomeDoBot, pushname, data }) => {
return `- 📊 \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙰 𝙰𝙿𝙸 𝙵𝙵\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🛠️ ׄ ( ᴍᴀɴᴜᴛᴇɴᴄ̧ᴀ̃ᴏ: ${data?.service?.maintenance_mode ? 'Ativada' : 'Desativada'} )
> 🎮 ׄ ( sᴀʟᴀs ʀᴇsᴛᴀɴᴛᴇs: ${data?.key?.rooms_remaining ?? 'N/A'} )
> ♾️ ׄ ( ʟɪғᴇᴛɪᴍᴇ: ${data?.key?.lifetime ? 'Sim' : 'Não'} )

> 📊 ׄ ( ✅ sᴇʀᴠɪᴄ̧ᴏ ᴏɴʟɪɴᴇ! )`
}
exports.ffLikesUso = prefix => {
return `- ❤️ \`𝙻𝙸𝙺𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}likes UID )
> 💡 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix}likes 32793023 )`
}

exports.ffLikesSucesso = ({ NomeDoBot, pushname, player_id, data }) => {
const c = data?.data?.conta
const l = data?.data?.likes
return `- ❤️ \`𝙻𝙸𝙺𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🏷️ ׄ ( ɴɪᴄᴋ: ${c?.nickname || 'N/A'} )
> 🆔 ׄ ( ᴜɪᴅ: ${c?.uid || player_id} )
> 🌎 ׄ ( ʀᴇɢɪᴀ̃ᴏ: ${c?.region || 'N/A'} )
> 📊 ׄ ( ʟᴇᴠᴇʟ: ${c?.level || 'N/A'} )

> ❤️ ׄ ( ᴀɴᴛᴇs: ${l?.antes || 0} )
> ➕ ׄ ( ᴀᴅɪᴄɪᴏɴᴀᴅᴏs: ${l?.adicionados || 0} )
> 📈 ׄ ( ᴅᴇᴘᴏɪs: ${l?.depois || 0} )

> ❤️ ׄ ( ✅ ${data?.message || 'Likes enviados com sucesso!'} )`
}

exports.ffCotaLikes = ({ NomeDoBot, pushname, data, reset, expira }) => {
return `- 📊 \`𝙲𝙾𝚃𝙰 𝙳𝙴 𝙻𝙸𝙺𝙴𝚂 𝙵𝙵\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> ❤️ ׄ ( ᴅɪᴀ́ʀɪᴏ: ${data?.daily_limit ?? 'N/A'} )
> 📤 ׄ ( ᴜsᴀᴅᴏs ʜᴏᴊᴇ: ${data?.used_today ?? 'N/A'} )
> 📥 ׄ ( ʀᴇsᴛᴀɴᴛᴇs: ${data?.remaining_today ?? 'N/A'} )
> ⏱️ ׄ ( ʀᴇsᴇᴛ: ${reset} )
> ⌛ ׄ ( ᴄᴏᴏʟᴅᴏᴡɴ: ${data?.cooldown_hours || 0} ʜᴏʀᴀs )
> ❤️ ׄ ( ᴍᴀ́xɪᴍᴏ: ${data?.max_likes_per_send || 'N/A'} )
> 🔑 ׄ ( ᴇxᴘɪʀᴀ: ${expira} )`
}

exports.ffPlayerUso = prefix => {
return `- 🔎 \`𝙲𝙾𝙽𝚂𝚄𝙻𝚃𝙰𝚁 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}player UID )`
}

exports.ffPlayer = ({ NomeDoBot, pushname, uid, conta }) => {
return `- 🔎 \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂 𝙳𝙾 𝙹𝙾𝙶𝙰𝙳𝙾𝚁\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🏷️ ׄ ( ɴᴏᴍᴇ: ${conta?.nome_conta || 'N/A'} )
> 🆔 ׄ ( ᴜɪᴅ: ${conta?.id_conta || uid} )
> 🌎 ׄ ( ʀᴇɢɪᴀ̃ᴏ: ${conta?.region || 'N/A'} )
> 📊 ׄ ( ʟᴇᴠᴇʟ: ${conta?.level || 'N/A'} )
> ✨ ׄ ( xᴘ: ${conta?.experiencia || 'N/A'} )
> ❤️ ׄ ( ʟɪᴋᴇs: ${conta?.likes || 0} )
> 🛡️ ׄ ( ᴄʀᴇᴅɪʙɪʟɪᴅᴀᴅᴇ: ${conta?.credibilidade || 'N/A'} )

> 🏆 ׄ ( ʀᴀɴᴋ ʙʀ: ${conta?.rank_br?.rank || 'N/A'} • ${conta?.rank_br?.pontos || 'N/A'} ᴘᴏɴᴛᴏs )
> ⚔️ ׄ ( ʀᴀɴᴋ ᴄs: ${conta?.rank_cs?.rank || 'N/A'} • ${conta?.rank_cs?.pontos || 'N/A'} ᴘᴏɴᴛᴏs )`
}

exports.ffStatusLikesUso = prefix => {
return `- 📦 \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙾 𝙿𝙴𝙳𝙸𝙳𝙾\`

> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${prefix}statuslikes ORDER_ID )`
}

exports.ffStatusLikes = ({ NomeDoBot, pushname, orderId, pedido }) => {
return `- 📦 \`𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙾 𝙿𝙴𝙳𝙸𝙳𝙾 𝙻𝙸𝙺𝙴𝚂\`

> 🤖 ׄ ( ʙᴏᴛ: ${NomeDoBot} )
> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: ${pushname} )
> 🆔 ׄ ( ᴘᴇᴅɪᴅᴏ: ${pedido?.orderId || orderId} )
> 📌 ׄ ( sᴛᴀᴛᴜs: ${pedido?.status || 'N/A'} )
> 🎮 ׄ ( ᴜɪᴅ: ${pedido?.playerId || 'N/A'} )
> 🏷️ ׄ ( ɴɪᴄᴋ: ${pedido?.conta?.nickname || 'N/A'} )
> ❤️ ׄ ( ᴀɴᴛᴇs: ${pedido?.likes?.antes || 0} )
> ➕ ׄ ( ᴀᴅɪᴄɪᴏɴᴀᴅᴏs: ${pedido?.likes?.adicionados || 0} )
> 📈 ׄ ( ᴅᴇᴘᴏɪs: ${pedido?.likes?.depois || 0} )`
}

exports.ffListaLikes = data => {
return `- 📦 \`𝙿𝙴𝙳𝙸𝙳𝙾𝚂 𝙳𝙴 𝙻𝙸𝙺𝙴𝚂 𝙵𝙵\`

> 📦 ׄ ( ${data?.total || 0} — ᴛᴏᴛᴀʟ. )
> 📦 ׄ ( ${data?.orders?.length || 0} — ᴍᴏsᴛʀᴀɴᴅᴏ. )

${(data?.orders || []).map((p, i) => `> 📦 ׄ ( ${i + 1}° — ${p.orderId || p.order_id || 'N/A'} )
> 📦 ׄ ( ${p.playerId || 'N/A'} — ᴜɪᴅ • ${p.status || 'N/A'} )
> ❤️ ׄ ( ${p.likes?.antes || 0} → +${p.likes?.adicionados || 0} → ${p.likes?.depois || 0} )`).join('\n\n') || '> 📦 ׄ ( ɴᴇɴʜᴜᴍ ᴘᴇᴅɪᴅᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ. )'}`
}

exports.ffErro = msg => {
return `- ❌ \`𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴\`

> ⚠️ ׄ ( ᴇʀʀᴏ: ${msg || 'Não foi possível concluir a solicitação.'} )`
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
exports.coinsBonusDiario = (jid, saldo, prefix) => {
return `- 💫 \`𝙱𝙾̂𝙽𝚄𝚂 𝙳𝙸𝙰́𝚁𝙸𝙾\`

> 💫 ׄ ( @${String(jid).split('@')[0]} — ᴜsᴜᴀ́ʀɪᴏ ǫᴜᴇ ʀᴇᴄᴇʙᴇᴜ ᴏ ʙᴏ̂ɴᴜs. )
> +50 ׄ ( ʀᴇᴄᴏᴍᴘᴇɴsᴀ ᴅᴀ ᴘʀɪᴍᴇɪʀᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴏ ᴅɪᴀ. )
> 💫 ׄ ( ${Number(saldo || 0).toLocaleString('pt-BR')} ɴ-ᴄᴏɪɴs — sᴀʟᴅᴏ ᴀᴛᴜᴀʟ. )

> 💫 ׄ ( ᴜsᴇ ${prefix}coins ᴘᴀʀᴀ ᴠᴇʀ sᴇᴜ sᴀʟᴅᴏ. )`
}

exports.coinsCard = (jid, saldo, banco, minerar, cassino, prefix) => {
return `- 🏦 \`𝙱𝙰𝙽𝙲𝙾 𝙳𝙴 𝙽-𝙲𝙾𝙸𝙽𝚂\`

> 🏦 ׄ ( @${String(jid).split('@')[0]} — ᴜsᴜᴀ́ʀɪᴏ. )
> 🏦 ׄ ( ${Number(saldo || 0).toLocaleString('pt-BR')} ɴ-ᴄᴏɪɴs — ᴄᴀʀᴛᴇɪʀᴀ. )
> 🏦 ׄ ( ${Number(banco || 0).toLocaleString('pt-BR')} ɴ-ᴄᴏɪɴs — ʙᴀɴᴄᴏ. )
> 🏦 ׄ ( ${Number(minerar || 0)} — ᴛᴇɴᴛᴀᴛɪᴠᴀ(s) ᴅᴇ ᴍɪɴᴇʀᴀᴄ̧ᴀ̃ᴏ. )
> 🏦 ׄ ( ${Number(cassino || 0)} — ᴛᴇɴᴛᴀᴛɪᴠᴀ(s) ᴅᴇ ᴄᴀssɪɴᴏ. )

> 🏦 ׄ ( ᴜsᴇ ${prefix}menucoins ᴘᴀʀᴀ ᴠᴇʀ ᴏ sɪsᴛᴇᴍᴀ. )`
}

exports.erroApi = (site = 'https://tokito-apis.com.br') => {
let link = 'https://tokito-apis.com.br'

try {
link = new URL(String(site || link)).origin
}
catch {
}

return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙰 𝙰𝙿𝙸\`

> 🔑 ׄ ( ᴠᴇʀɪғɪǫᴜᴇ sᴇ sᴜᴀ ᴋᴇʏ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀ. )
> 👤 ׄ ( ᴄᴏɴғɪʀᴀ sᴇ sᴜᴀ ᴄᴏɴᴛᴀ ᴇsᴛᴀ́ ᴀᴛɪᴠᴀ ᴇ sᴇᴍ ʙʟᴏǫᴜᴇɪᴏs. )
> 🌐 ׄ ( sɪᴛᴇ: ${link} )

> ❌ ׄ ( ᴀᴄᴇssᴇ ᴏ sɪᴛᴇ ᴀᴄɪᴍᴀ ᴇ ᴠᴇʀɪғɪǫᴜᴇ sᴜᴀ ᴄᴏɴᴛᴀ ᴇ ᴀ sᴜᴀ ᴋᴇʏ. sᴇ ᴇsᴛɪᴠᴇʀ ᴛᴜᴅᴏ ɴᴏʀᴍᴀʟ, ᴛᴇɴᴛᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ɴᴏᴠᴀᴍᴇɴᴛᴇ. )`
}

exports.ativarPainel = ({ itens = [], ativo = () => false } = {}) => {
const secoes = [
['✨', '𝙼𝙸́𝙳𝙸𝙰𝚂', 0, 5],
['🔗', '𝙻𝙸𝙽𝙺𝚂', 6, 9],
['👥', '𝚂𝙴𝙶𝚄𝚁𝙰𝙽𝙲̧𝙰', 10, 16],
['⚡', '𝙰𝚄𝚃𝙾𝙼𝙰𝙲̧𝙰̃𝙾', 17, itens.length - 1]
]

const item = i => {
if (!itens[i]) return ''
const [chave, nome] = itens[i]
const status = ativo(chave) ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'
return `> 🧊 ׄ ( ${i + 1} — ${nome} • ${status} )`
}

const painel = secoes.map(([emoji, titulo, inicio, fim]) => {
const lista = []
for (let i = inicio; i <= fim && i < itens.length; i++) {
const linha = item(i)
if (linha) lista.push(linha)
}
return lista.length ? `- ${emoji} \`${titulo}\`\n\n${lista.join('\n')}` : ''
}).filter(Boolean).join('\n\n')

return `- ⚙️ \`𝙰𝚃𝙸𝚅𝙰𝚁 𝚂𝙸𝚂𝚃𝙴𝙼𝙰𝚂\`

${painel}

> ⚙️ ׄ ( ᴄᴀɴᴄᴇʟᴀʀ ᴏ ᴘᴀɪɴᴇʟ. )

> ⚙️ ׄ ( ᴅɪɢɪᴛᴇ ᴀᴘᴇɴᴀs ᴏ ɴᴜ́ᴍᴇʀᴏ ᴅᴏ sɪsᴛᴇᴍᴀ. )`
}

exports.ativarAlterado = (nome, ativo, painel) => {
const emoji = ativo ? '✅' : '❌'
const status = ativo ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'

return `- ${emoji} \`𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝙰𝙻𝚃𝙴𝚁𝙰𝙳𝙾\`

> 🧊 ׄ ( ${nome} — ${status}. )

${painel}`
}

exports.ativarCancelado = () => {
return `- ❌ \`𝙰𝚃𝙸𝚅𝙰𝙲̧𝙰̃𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰\`

> ❌ ׄ ( ᴏ ᴘᴀɪɴᴇʟ ғᴏɪ ᴇɴᴄᴇʀʀᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.idadeUso = prefix => {
return `- 🎂 \`𝙸𝙳𝙰𝙳𝙴 𝙳𝙾 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾\`

> 📅 ׄ ( ғᴏʀᴍᴀᴛᴏ: ᴅᴅ/ᴍᴍ/ᴀᴀᴀᴀ )
> 🧩 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix}idade 23/12/2007 )`
}

exports.idadeInvalida = () => {
return `- ❌ \`𝙳𝙰𝚃𝙰 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\`

> 📅 ׄ ( ɪɴғᴏʀᴍᴇ ᴜᴍᴀ ᴅᴀᴛᴀ ᴅᴇ ɴᴀsᴄɪᴍᴇɴᴛᴏ ᴠᴀ́ʟɪᴅᴀ. )`
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

> 📅 ׄ ( ɴᴀsᴄɪᴍᴇɴᴛᴏ: ${nascimento} )
> 🎈 ׄ ( ɪᴅᴀᴅᴇ: ${anos} ᴀɴᴏs, ${meses} ᴍᴇsᴇs ᴇ ${dias} ᴅɪᴀs )
> 🗓️ ׄ ( ᴅɪᴀs ᴠɪᴠɪᴅᴏs: ${Number(diasVividos || 0).toLocaleString('pt-BR')} )
> ⏰ ׄ ( ʜᴏʀᴀs ᴠɪᴠɪᴅᴀs: ${Number(horasVividas || 0).toLocaleString('pt-BR')} )
> ⏱️ ׄ ( ᴍɪɴᴜᴛᴏs ᴠɪᴠɪᴅᴏs: ${Number(minutosVividos || 0).toLocaleString('pt-BR')} )
> 🎉 ׄ ( ᴘʀᴏ́xɪᴍᴏ ᴀɴɪᴠᴇʀsᴀ́ʀɪᴏ: ${faltam <= 0 ? 'hoje' : `em ${faltam} dia(s)`} )`
}

exports.totextSemAudio = prefix => {
return `- 🎙️ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾\`

> 🎧 ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍ ᴀ́ᴜᴅɪᴏ ᴏᴜ ᴘᴛᴛ. )
> 🧩 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${prefix}totext )`
}

exports.totextResultado = ({ texto, idioma, duracao, confidence } = {}) => {
const detalhes = [
idioma ? `> 🌐 ׄ ( ɪᴅɪᴏᴍᴀ: ${idioma} )` : '',
duracao ? `> ⏱️ ׄ ( ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ${duracao} )` : '',
confidence != null ? `> 📊 ׄ ( ᴄᴏɴғɪᴀɴᴄ̧ᴀ: ${confidence} )` : ''
].filter(Boolean).join('\n')

return `- 🎙️ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾 𝙳𝙾 𝙰́𝚄𝙳𝙸𝙾\`

> 📝 ׄ ( ᴛᴇxᴛᴏ: ${texto || 'Nenhum texto identificado.'}${detalhes ? `\n\n${detalhes}` : ''} )`
}

exports.autortextResultado = (jid, resultado = {}) => {
const numero = String(jid || '').split('@')[0]

return `- 🎙️ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> 📝 ׄ ( ᴛᴇxᴛᴏ: ${resultado.texto || 'Nenhum texto identificado.'} )`
}

exports.transcricaoFalhou = () => {
return `- ❌ \`𝚃𝚁𝙰𝙽𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾 𝙵𝙰𝙻𝙷𝙾𝚄\`

> 🎧 ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘʀᴏᴄᴇssᴀʀ ᴇssᴇ ᴀ́ᴜᴅɪᴏ ᴀɢᴏʀᴀ. )

> ❌ ׄ ( ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴄᴏᴍ ᴏᴜᴛʀᴏ ᴀ́ᴜᴅɪᴏ ᴏᴜ ᴘᴛᴛ. )`
}
exports.updateNotPublished = () => {
return `- 🧊 \`𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

> ✅ ׄ ( ɴᴇɴʜᴜᴍᴀ ɴᴏᴠᴀ ᴠᴇʀsᴀ̃ᴏ ғᴏɪ ᴘᴜʙʟɪᴄᴀᴅᴀ. )`
}

exports.updateCheckError = () => {
return `- ⚠️ \`𝙴𝚁𝚁𝙾 𝙽𝙰 𝚅𝙴𝚁𝙸𝙵𝙸𝙲𝙰𝙲̧𝙰̃𝙾\`

> 🌐 ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴsᴜʟᴛᴀʀ ɴᴏᴠᴀs ᴀᴛᴜᴀʟɪᴢᴀᴄ̧ᴏ̃ᴇs. )
> 🔄 ׄ ( ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ᴀʟɢᴜɴs ɪɴsᴛᴀɴᴛᴇs. )`
}

exports.updateEmptyFiles = versao => {
return `- ❌ \`𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾 𝙸𝙽𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙰\`

> ❌ ׄ ( ${versao || '—'} — ᴠᴇʀsᴀ̃ᴏ ᴘᴜʙʟɪᴄᴀᴅᴀ sᴇᴍ ᴀʀǫᴜɪᴠᴏs ᴘᴀʀᴀ ɪɴsᴛᴀʟᴀʀ. )
> 🛡️ ׄ ( ᴀ ᴠᴇʀsᴀ̃ᴏ ᴀᴛᴜᴀʟ ɴᴀ̃ᴏ ғᴏɪ ᴀʟᴛᴇʀᴀᴅᴀ. )`
}

exports.updateInfo = ({
instalada,
disponivel,
canal,
modo,
disponivelAgora,
changelog,
arquivos,
removidos,
prefix
}) => {
const listaArquivos = Array.isArray(arquivos) ? arquivos.filter(Boolean) : []
const listaRemovidos = Array.isArray(removidos) ? removidos.filter(Boolean) : []
const totalArquivos = listaArquivos.length + listaRemovidos.length
const atualizacaoCompleta = String(modo || '').toLowerCase() === 'clean'

const alteracoes = Array.isArray(changelog) && changelog.length
? changelog.map(item => `> • ׄ ( ${item} )`).join('\n')
: '> • ׄ ( ɴᴇɴʜᴜᴍᴀ ɴᴏᴠᴀ ᴀʟᴛᴇʀᴀᴄ̧ᴀ̃ᴏ ɪɴғᴏʀᴍᴀᴅᴀ. )'

const arquivosTexto = totalArquivos
? `

- 📦 \`𝙰𝚁𝚀𝚄𝙸𝚅𝙾𝚂\`

${listaArquivos.slice(0, 8).map(item => {
const caminho = typeof item === 'object' ? item.path : item
return `> • ׄ ( ${String(caminho || '').split('/').pop()} )`
}).join('\n')}${listaRemovidos.length
? `\n> 🗑️ ׄ ( ${listaRemovidos.length} ᴀʀǫᴜɪᴠᴏ(s) sᴇʀᴀ̃ᴏ ʀᴇᴍᴏᴠɪᴅᴏ(s). )`
: ''}`
: ''

const instalar = disponivelAgora
? `

> 📥 ׄ ( ᴜsᴇ ${prefix}update sᴛᴀʀᴛ ᴘᴀʀᴀ ɪɴsᴛᴀʟᴀʀ. )`
: ''

return `- 🧊 \`𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

> 🧊 ׄ ( ${instalada} — ᴠᴇʀsᴀ̃ᴏ ɪɴsᴛᴀʟᴀᴅᴀ. )
> 🧊 ׄ ( ${disponivel} — ${disponivelAgora ? 'ɴᴏᴠᴀ ᴠᴇʀsᴀ̃ᴏ ᴅɪsᴘᴏɴɪ́ᴠᴇʟ.' : 'ᴠᴇʀsᴀ̃ᴏ ᴍᴀɪs ʀᴇᴄᴇɴᴛᴇ.'} )
> 🧊 ׄ ( ${atualizacaoCompleta ? 'COMPLETA' : totalArquivos} — ${atualizacaoCompleta ? 'ɴᴏᴠᴀ ᴇsᴛʀᴜᴛᴜʀᴀ ᴏғɪᴄɪᴀʟ ᴅᴀ ᴛᴏᴋɪᴛᴏ.' : 'ᴀʀǫᴜɪᴠᴏ(s) ᴀʟᴛᴇʀᴀᴅᴏ(s).'} )

- 📝 \`𝙰𝙻𝚃𝙴𝚁𝙰𝙲̧𝙾̃𝙴𝚂\`

${alteracoes}${arquivosTexto}${instalar}`
}

exports.updatePreparing = () => {
return `- ⏳ \`𝙿𝚁𝙴𝙿𝙰𝚁𝙰𝙽𝙳𝙾 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

> 💾 ׄ ( ᴄʀɪᴀɴᴅᴏ ʙᴀᴄᴋᴜᴘ ᴅᴀ ᴠᴇʀsᴀ̃ᴏ ᴀᴛᴜᴀʟ. )
> 📦 ׄ ( ᴘʀᴇᴘᴀʀᴀɴᴅᴏ ᴏs ɴᴏᴠᴏs ᴀʀǫᴜɪᴠᴏs. )
> ⚠️ ׄ ( ɴᴀ̃ᴏ ᴅᴇsʟɪɢᴜᴇ ᴏ ʙᴏᴛ ᴅᴜʀᴀɴᴛᴇ ᴏ ᴘʀᴏᴄᴇssᴏ. )`
}

exports.updateAlreadyLatest = versao => {
return `- ✅ \`𝙱𝙾𝚃 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙾\`

> ✅ ׄ ( ${versao} — ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴇsᴛᴀ́ ᴜsᴀɴᴅᴏ ᴀ ᴠᴇʀsᴀ̃ᴏ ᴍᴀɪs ʀᴇᴄᴇɴᴛᴇ. )`
}

exports.updateSuccess = (
anterior,
nova,
arquivos = 0,
removidos = 0
) => {
let texto = `- ✅ \`𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾 𝙲𝙾𝙽𝙲𝙻𝚄𝙸́𝙳𝙰\`

> ✅ ׄ ( ${anterior} → ${nova} — ᴠᴇʀsᴀ̃ᴏ ᴀᴛᴜᴀʟɪᴢᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )
> ✅ ׄ ( ${Number(arquivos || 0)} — ᴀʀǫᴜɪᴠᴏ(s) ᴀᴛᴜᴀʟɪᴢᴀᴅᴏ(s). )`

if (Number(removidos || 0) > 0) {
texto += `

> ✅ ׄ ( ${Number(removidos || 0)} — ᴀʀǫᴜɪᴠᴏ(s) ʀᴇᴍᴏᴠɪᴅᴏ(s). )`
}

texto += `

> 🔄 ׄ ( ᴏ ʙᴏᴛ sᴇʀᴀ́ ʀᴇɪɴɪᴄɪᴀᴅᴏ ᴀɢᴏʀᴀ. )`

return texto
}

exports.updateError = () => {
return `- ❌ \`𝙵𝙰𝙻𝙷𝙰 𝙽𝙰 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴᴄʟᴜɪʀ ᴀ ᴀᴛᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ. )
> 🔄 ׄ ( ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ᴀʟɢᴜɴs ɪɴsᴛᴀɴᴛᴇs. )`
}

exports.updateRollbackSuccess = versao => {
return `- ↩️ \`𝙱𝙰𝙲𝙺𝚄𝙿 𝚁𝙴𝚂𝚃𝙰𝚄𝚁𝙰𝙳𝙾\`

> ↩️ ׄ ( ${versao} — ᴠᴇʀsᴀ̃ᴏ ʀᴇsᴛᴀᴜʀᴀᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )
> 🔄 ׄ ( ᴏ ʙᴏᴛ sᴇʀᴀ́ ʀᴇɪɴɪᴄɪᴀᴅᴏ ᴀɢᴏʀᴀ. )`
}

exports.updateRollbackError = () => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝙱𝙰𝙲𝙺𝚄𝙿\`

> 💾 ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇsᴛᴀᴜʀᴀʀ ᴏ ʙᴀᴄᴋᴜᴘ. )
> 🔄 ׄ ( ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ᴀʟɢᴜɴs ɪɴsᴛᴀɴᴛᴇs. )`
}

exports.updateUsage = prefix => {
return `- ⚙️ \`𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙳𝙴 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾\`

> ⚙️ ׄ ( ${prefix}update check — ᴠᴇʀɪғɪᴄᴀʀ ɴᴏᴠᴀs ᴠᴇʀsᴏ̃ᴇs. )
> ⚙️ ׄ ( ${prefix}update info — ᴠᴇʀ ɪɴғᴏʀᴍᴀᴄ̧ᴏ̃ᴇs. )
> ⚙️ ׄ ( ${prefix}update start — ɪɴsᴛᴀʟᴀʀ ᴀ ᴀᴛᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ. )
> ⚙️ ׄ ( ${prefix}update rollback — ʀᴇsᴛᴀᴜʀᴀʀ ᴏ ʙᴀᴄᴋᴜᴘ. )`
}

exports.gerarLinkSemMidia = prefix => {
return `- 🔗 \`𝙶𝙴𝚁𝙰𝚁 𝙻𝙸𝙽𝙺\`

> 📎 ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ, ᴀ́ᴜᴅɪᴏ, sᴛɪᴄᴋᴇʀ ᴏᴜ ᴅᴏᴄᴜᴍᴇɴᴛᴏ. )
> ⚙️ ׄ ( ᴜsᴏ: ${prefix}gerarlink )`
}

exports.gerarLinkResultado = (tipo, ext, url) => {
return `- 🔗 \`𝙻𝙸𝙽𝙺 𝙶𝙴𝚁𝙰𝙳𝙾\`

> 📁 ׄ ( ᴛɪᴘᴏ: ${tipo} )
> 🧩 ׄ ( ғᴏʀᴍᴀᴛᴏ: ${String(ext || 'bin').toUpperCase()} )
> 🔗 ׄ ( ᴜʀʟ: ${url} )

> 🔗 ׄ ( ᴏ ʟɪɴᴋ ғᴏɪ ɢᴇʀᴀᴅᴏ ᴀᴛʀᴀᴠᴇ́s ᴅᴏ sᴇʀᴠɪᴅᴏʀ ᴛᴇᴍᴘᴏʀᴀ́ʀɪᴏ ᴜsᴀᴅᴏ ᴘᴇʟᴏ ᴛᴏᴋɪᴛᴏ. )`
}

exports.gerarLinkFalhou = () => {
return `- ❌ \`𝙵𝙰𝙻𝙷𝙰 𝙰𝙾 𝙶𝙴𝚁𝙰𝚁 𝙻𝙸𝙽𝙺\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʜᴏsᴘᴇᴅᴀʀ ᴇsᴛᴇ ᴀʀǫᴜɪᴠᴏ ᴀɢᴏʀᴀ. )
> 🔄 ׄ ( ᴀɢᴜᴀʀᴅᴇ ᴀʟɢᴜɴs ɪɴsᴛᴀɴᴛᴇs ᴇ ʀᴇᴘɪᴛᴀ ᴏ ᴄᴏᴍᴀɴᴅᴏ. )`
}

exports.infoplanos = prefix => {
return `- 🛒 \`𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝚁 𝙿𝙻𝙰𝙽𝙾𝚂\`

> 👀 ׄ ( ᴠᴇʀ ᴘʟᴀɴᴏs )
> 🛒 ׄ ( ${prefix}plans )

> 💸 ׄ ( ᴀʟᴛᴇʀᴀʀ ᴘʀᴇᴄ̧ᴏ )
> 🛒 ׄ ( ${prefix}plans preco 1 10 )

> 📦 ׄ ( ᴀʟᴛᴇʀᴀʀ ɴᴏᴍᴇ )
> 🛒 ׄ ( ${prefix}plans nome 1 Plano Semanal )

> ⏳ ׄ ( ᴀʟᴛᴇʀᴀʀ ᴅɪᴀs )
> 🛒 ׄ ( ${prefix}plans dias 1 7 )

> 📝 ׄ ( ᴀʟᴛᴇʀᴀʀ ᴛᴇxᴛᴏ )
> 🛒 ׄ ( ${prefix}plans texto 1 Use a Tokito no seu grupo por 7 dias. )

> ➕ ׄ ( ᴀᴅɪᴄɪᴏɴᴀʀ ᴘʟᴀɴᴏ )
> 🛒 ׄ ( ${prefix}plans add Plano Mensal|15|30|Use a Tokito por 30 dias. )

> 🗑️ ׄ ( ʀᴇᴍᴏᴠᴇʀ ᴘʟᴀɴᴏ )
> 🛒 ׄ ( ${prefix}plans del 1 )

> 🛒 ׄ ( ᴏ ɴᴜ́ᴍᴇʀᴏ ʀᴇᴘʀᴇsᴇɴᴛᴀ ᴀ ᴘᴏsɪᴄ̧ᴀ̃ᴏ ᴍᴏsᴛʀᴀᴅᴀ ɴᴏ ᴄᴏᴍᴀɴᴅᴏ ${prefix}plans. )
> 🛒 ׄ ( ᴛᴏᴅᴀs ᴀs ᴀʟᴛᴇʀᴀᴄ̧ᴏ̃ᴇs sᴀ̃ᴏ sᴀʟᴠᴀs ᴅɪʀᴇᴛᴀᴍᴇɴᴛᴇ ɴᴏ ᴘʟᴀɴᴏs.ᴊsᴏɴ ᴜsᴀᴅᴏ ᴘᴇʟᴏ sɪsᴛᴇᴍᴀ ᴅᴇ ᴀʟᴜɢᴜᴇʟ. )`
}


exports.atividade = (
numero,
comandos,
audios,
figurinhas,
documentos,
fotos,
videos
) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡📊｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝙰𝚃𝙸𝚅𝙸𝙳𝙰𝙳𝙴
├╾═╼･ﾟ𖤐ﾟ･｡🧊｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 👤 @${numero}
┃࣪ ╎—̳͟͞͞ ⚙️ 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂: ${comandos}
┃࣪ ╎—̳͟͞͞ 🎧 𝙰́𝚄𝙳𝙸𝙾𝚂: ${audios}
┃࣪ ╎—̳͟͞͞ 🧊 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂: ${figurinhas}
┃࣪ ╎—̳͟͞͞ 📄 𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃𝙾𝚂: ${documentos}
┃࣪ ╎—̳͟͞͞ 🖼️ 𝙵𝙾𝚃𝙾𝚂: ${fotos}
┃࣪ ╎—̳͟͞͞ 🎥 𝚅𝙸́𝙳𝙴𝙾𝚂: ${videos}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}


exports.atividades = (
conteudo,
pagina = 1,
paginas = 1
) => {
const paginaTexto = paginas > 1
? `\n├╾═╼･ﾟ𖤐ﾟ･｡📄｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 📄 𝙿𝙰́𝙶𝙸𝙽𝙰: ${pagina}/${paginas}`
: ''

return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡📊｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝙰𝚃𝙸𝚅𝙸𝙳𝙰𝙳𝙴𝚂
├╾═╼･ﾟ𖤐ﾟ･｡🧊｡･ﾟ𖤐ﾟ･╾═╼┤
${conteudo || '┃࣪ ╎—̳͟͞͞ 💤 ɴᴇɴʜᴜᴍᴀ ᴀᴛɪᴠɪᴅᴀᴅᴇ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ.'}${paginaTexto}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}


exports.inativos = (
conteudo,
limite,
pagina = 1,
paginas = 1
) => {
const paginaTexto = paginas > 1
? `\n├╾═╼･ﾟ𖤐ﾟ･｡📄｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 📄 𝙿𝙰́𝙶𝙸𝙽𝙰: ${pagina}/${paginas}`
: ''

return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡💤｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝙼𝙴𝙼𝙱𝚁𝙾𝚂 𝙸𝙽𝙰𝚃𝙸𝚅𝙾𝚂
├╾═╼･ﾟ𖤐ﾟ･｡🧊｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 📉 𝙻𝙸𝙼𝙸𝚃𝙴: ${limite}
├╾═╼･ﾟ𖤐ﾟ･｡❄️｡･ﾟ𖤐ﾟ･╾═╼┤
${conteudo || '┃࣪ ╎—̳͟͞͞ ✅ ɴᴇɴʜᴜᴍ ᴍᴇᴍʙʀᴏ ɪɴᴀᴛɪᴠᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.'}${paginaTexto}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}


exports.meAtividade = (
numero,
comandos,
audios,
figurinhas,
documentos,
fotos,
videos
) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡👤｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝙼𝙸𝙽𝙷𝙰 𝙰𝚃𝙸𝚅𝙸𝙳𝙰𝙳𝙴
├╾═╼･ﾟ𖤐ﾟ･｡🧊｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 👤 @${numero}
┃࣪ ╎—̳͟͞͞ ⚙️ 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂: ${comandos}
┃࣪ ╎—̳͟͞͞ 🎧 𝙰́𝚄𝙳𝙸𝙾𝚂: ${audios}
┃࣪ ╎—̳͟͞͞ 🧊 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂: ${figurinhas}
┃࣪ ╎—̳͟͞͞ 📄 𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃𝙾𝚂: ${documentos}
┃࣪ ╎—̳͟͞͞ 🖼️ 𝙵𝙾𝚃𝙾𝚂: ${fotos}
┃࣪ ╎—̳͟͞͞ 🎥 𝚅𝙸́𝙳𝙴𝙾𝚂: ${videos}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.solicitacoesPendentes = (total, prefix) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡📥｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙾̃𝙴𝚂
├╾═╼･ﾟ𖤐ﾟ･｡🧊｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 👥 𝙿𝙴𝙽𝙳𝙴𝙽𝚃𝙴𝚂: ${total}
┃࣪ ╎—̳͟͞͞ ✅ 𝙰𝙿𝚁𝙾𝚅𝙰𝚁: ${prefix}soli quantidade
┃࣪ ╎—̳͟͞͞ 📌 𝙴𝚇𝙴𝙼𝙿𝙻𝙾: ${prefix}soli 20
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.solicitacoesAprovadas = (solicitadas, aprovadas, restantes) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡✅｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙲̧𝙾̃𝙴𝚂 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙰𝚂
├╾═╼･ﾟ𖤐ﾟ･｡🧊｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 🔢 𝚂𝙾𝙻𝙸𝙲𝙸𝚃𝙰𝙳𝙰𝚂: ${solicitadas}
┃࣪ ╎—̳͟͞͞ ✅ 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙰𝚂: ${aprovadas}
┃࣪ ╎—̳͟͞͞ 👥 𝚁𝙴𝚂𝚃𝙰𝙽𝚃𝙴𝚂: ${restantes}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.solicitacoesQuantidadeInvalida = prefix => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡❌｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝚀𝚄𝙰𝙽𝚃𝙸𝙳𝙰𝙳𝙴 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰
├╾═╼･ﾟ𖤐ﾟ･｡🧊｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 🔢 𝙳𝙸𝙶𝙸𝚃𝙴 𝚄𝙼 𝙽𝚄́𝙼𝙴𝚁𝙾 𝙼𝙰𝙸𝙾𝚁 𝚀𝚄𝙴 𝟶
┃࣪ ╎—̳͟͞͞ 📌 𝙴𝚇𝙴𝙼𝙿𝙻𝙾: ${prefix}soli 20
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}
exports.toimgUso = prefix => {
return `- 🖼️ \`𝚃𝙾𝙸𝙼𝙶\`

> 📌 ׄ ( ᴜsᴏ: ${prefix}toimg respondendo uma figurinha )
> 🖼️ ׄ ( ᴄᴏɴᴠᴇʀᴛᴇ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴘᴀʀᴀ ɪᴍᴀɢᴇᴍ ᴘɴɢ. )`
}

exports.toimgErro = () => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝚃𝙾𝙸𝙼𝙶\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴᴠᴇʀᴛᴇʀ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴇᴍ ɪᴍᴀɢᴇᴍ. )
> 🔄 ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴇ ᴇxᴇᴄᴜᴛᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ɴᴏᴠᴀᴍᴇɴᴛᴇ. )`
}

exports.togifUso = prefix => {
return `- 🎞️ \`𝚃𝙾𝙶𝙸𝙵\`

> 📌 ׄ ( ᴜsᴏ: ${prefix}togif respondendo uma figurinha animada )
> 🎬 ׄ ( ᴄᴏɴᴠᴇʀᴛᴇ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴀɴɪᴍᴀᴅᴀ ᴘᴀʀᴀ ᴠɪ́ᴅᴇᴏ/ɢɪғ. )`
}

exports.togifNaoAnimada = prefix => {
return `- ⚠️ \`𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰 𝙽𝙰̃𝙾 𝙰𝙽𝙸𝙼𝙰𝙳𝙰\`

> 🎞️ ׄ ( ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴘʀᴇᴄɪsᴀ ᴅᴇ ᴜᴍᴀ ғɪɢᴜʀɪɴʜᴀ ᴀɴɪᴍᴀᴅᴀ. )
> 🖼️ ׄ ( ᴅɪᴄᴀ: ᴘᴀʀᴀ ғɪɢᴜʀɪɴʜᴀ ᴇsᴛᴀ́ᴛɪᴄᴀ, ᴜsᴇ ${prefix}toimg. )`
}

exports.togifErro = () => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝚃𝙾𝙶𝙸𝙵\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴏɴᴠᴇʀᴛᴇʀ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴀɴɪᴍᴀᴅᴀ. )
> 🔄 ׄ ( ʀᴇsᴘᴏɴᴅᴀ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴇ ᴇxᴇᴄᴜᴛᴇ ᴏ ᴄᴏᴍᴀɴᴅᴏ ɴᴏᴠᴀᴍᴇɴᴛᴇ. )`
}
exports.figPerfilGrupo = () => {
return `- ❌ \`𝙵𝙸𝙶𝙿𝙴𝚁𝙵𝙸𝙻\`

> 👥 ׄ ( ᴇsᴛᴇ ᴄᴏᴍᴀɴᴅᴏ sᴏ́ ᴘᴏᴅᴇ sᴇʀ ᴜsᴀᴅᴏ ᴇᴍ ɢʀᴜᴘᴏs. )`
}

exports.figPerfilSemFoto = numero => {
return `- 🖼️ \`𝙵𝙸𝙶𝙿𝙴𝚁𝙵𝙸𝙻\`

> ❌ ׄ ( ғᴏᴛᴏ: ᴀ ᴘᴇssᴏᴀ @${numero} ɴᴀ̃ᴏ ᴘᴏssᴜɪ ғᴏᴛᴏ ᴅᴇ ᴘᴇʀғɪʟ ᴏᴜ ᴇʟᴀ ᴇsᴛᴀ́ ᴘʀɪᴠᴀᴅᴀ. )`
}

exports.figPerfilGerando = numero => {
return `- 🖼️ \`𝙵𝙸𝙶𝙿𝙴𝚁𝙵𝙸𝙻\`

> 👤 ׄ ( ᴜsᴜᴀ́ʀɪᴏ: @${numero} )
> ⚙️ ׄ ( ɢᴇʀᴀɴᴅᴏ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴅᴀ ғᴏᴛᴏ ᴅᴇ ᴘᴇʀғɪʟ... )`
}

exports.figPerfilErro = () => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝙵𝙸𝙶𝙿𝙴𝚁𝙵𝙸𝙻\`

> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ɢᴇʀᴀʀ ᴀ ғɪɢᴜʀɪɴʜᴀ ᴅᴀ ғᴏᴛᴏ ᴅᴇ ᴘᴇʀғɪʟ. )
> 🔄 ׄ ( ᴍᴀʀǫᴜᴇ ᴜᴍᴀ ᴘᴇssᴏᴀ ᴏᴜ ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇʟᴀ ᴇ ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. )`
}

// ============================================================
// PLAYLIST / RÁDIO
// Dev: Dylan Modz
// ============================================================

const formatarTempoPlaylist = segundos => {
const total = Math.max(0, Math.floor(Number(segundos || 0)))
const horas = Math.floor(total / 3600)
const minutos = Math.floor((total % 3600) / 60)
const seg = total % 60

if (horas > 0)
return `${horas}h ${String(minutos).padStart(2, '0')}min`

return `${minutos}:${String(seg).padStart(2, '0')}`
}

const formatarDataPlaylist = valor => {
if (!valor)
return 'não informada'

const data = new Date(valor)

if (Number.isNaN(data.getTime()))
return 'não informada'

return data.toLocaleDateString('pt-BR')
}

const duracaoTotalPlaylist = musicas => (Array.isArray(musicas) ? musicas : [])
.reduce((total, musica) => total + Math.max(0, Number(musica?.duracaoSegundos || 0)), 0)

const barraPlaylist = (decorrido, duracao, tamanho = 14) => {
const total = Math.max(1, Number(duracao || 0))
const atual = Math.max(0, Math.min(total, Number(decorrido || 0)))
const preenchidos = Math.max(0, Math.min(tamanho, Math.round((atual / total) * tamanho)))

return `${'━'.repeat(preenchidos)}●${'─'.repeat(Math.max(0, tamanho - preenchidos))}`
}

exports.playlistAjuda = prefix => {
return `- 🎶 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 / 𝚁𝙰́𝙳𝙸𝙾\`

> ➕ ׄ ( ${prefix}playlist criar <nome> )
> 🎵 ׄ ( ${prefix}playlist add <nome> | <música> )
> ▶️ ׄ ( ${prefix}playlist tocar <nome> )
> 📋 ׄ ( ${prefix}playlist listar )
> 👀 ׄ ( ${prefix}playlist ver <nome> )
> 📻 ׄ ( ${prefix}radio <nome> )

> ⚙️ ׄ ( ${prefix}playlist config — ᴄᴏɴᴛʀᴏʟᴇs )
> ✏️ ׄ ( ${prefix}playlist editar — ɢᴇʀᴇɴᴄɪᴀʀ )
> 🎉 ׄ ( ${prefix}playlist party — ғɪʟᴀ ᴅᴏ ɢʀᴜᴘᴏ )
> 🌐 ׄ ( ${prefix}playlist global — ᴘʟᴀʏʟɪsᴛs ɢʟᴏʙᴀɪs )`
}

exports.playlistConfigAjuda = prefix => {
return `- ⚙️ \`𝙲𝙾𝙽𝚃𝚁𝙾𝙻𝙴𝚂 𝙳𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> ⏸️ ׄ ( ${prefix}playlist pausar )
> ▶️ ׄ ( ${prefix}playlist continuar )
> ⏭️ ׄ ( ${prefix}playlist proxima )
> ⏮️ ׄ ( ${prefix}playlist anterior )
> 🔁 ׄ ( ${prefix}playlist loop )
> 🔀 ׄ ( ${prefix}playlist aleatorio )
> 📊 ׄ ( ${prefix}playlist status )
> ⏹️ ׄ ( ${prefix}playlist parar )`
}

exports.playlistEditarAjuda = prefix => {
return `- ✏️ \`𝙶𝙴𝚁𝙴𝙽𝙲𝙸𝙰𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📥 ׄ ( ${prefix}playlist importar <nome> | <link> )
> 🗑️ ׄ ( ${prefix}playlist remover <nome> | <número> )
> 🧹 ׄ ( ${prefix}playlist limpar <nome> )
> ✏️ ׄ ( ${prefix}playlist renomear <atual> | <novo> )
> ❌ ׄ ( ${prefix}playlist apagar <nome> )`
}

exports.playlistRadioUso = prefix => {
return `- 📻 \`𝚁𝙰́𝙳𝙸𝙾 𝚃𝙾𝙺𝙸𝚃𝙾\`

> 🎶 ׄ ( ᴜsᴇ: ${prefix}radio <nome-da-playlist> )
> ⚙️ ׄ ( ᴄᴏɴᴛʀᴏʟᴇ ᴄᴏᴍ: ${prefix}playlist config )`
}

exports.playlistGlobalAjuda = (prefix, isOwner = false) => {
const dono = isOwner
? `\n\n> 👑 ׄ ( ɢᴇʀᴇɴᴄɪᴀᴍᴇɴᴛᴏ ᴅᴏ ᴅᴏɴᴏ )\n> ➕ ׄ ( ${prefix}playlist global criar <nome> )\n> 🎵 ׄ ( ${prefix}playlist global add <nome> | <música> )\n> 📥 ׄ ( ${prefix}playlist global importar <nome> | <link> )\n> ❌ ׄ ( ${prefix}playlist global apagar <nome> )`
: ''

return `- 🌐 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃𝚂 𝙶𝙻𝙾𝙱𝙰𝙸𝚂\`

> 📋 ׄ ( ${prefix}playlist global listar )
> 👀 ׄ ( ${prefix}playlist global ver <nome> )
> ▶️ ׄ ( ${prefix}playlist global tocar <nome> )${dono}`
}

exports.playlistCriarUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global criar` : `${prefix}playlist criar`
return `- ➕ \`𝙲𝚁𝙸𝙰𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📌 ׄ ( ᴜsᴇ: ${base} <nome-da-playlist> )`
}

exports.playlistAddUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global add` : `${prefix}playlist add`
return `- 🎵 \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝚁 𝙼𝚄́𝚂𝙸𝙲𝙰\`

> 📌 ׄ ( ᴜsᴇ: ${base} <playlist> | <música-ou-link> )
> 💡 ׄ ( ᴇxᴇᴍᴘʟᴏ: ${base} academia | vem ca )`
}

exports.playlistImportarUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global importar` : `${prefix}playlist importar`
return `- 📥 \`𝙸𝙼𝙿𝙾𝚁𝚃𝙰𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📌 ׄ ( ᴜsᴇ: ${base} <nome> | <link-da-playlist-do-youtube> )`
}

exports.playlistVerUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global ver` : `${prefix}playlist ver`
return `- 👀 \`𝚅𝙴𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📌 ׄ ( ᴜsᴇ: ${base} <nome> )`
}

exports.playlistTocarUso = prefix => {
return `- ▶️ \`𝚃𝙾𝙲𝙰𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📌 ׄ ( ᴜsᴇ: ${prefix}playlist tocar <nome> )
> 🌐 ׄ ( ɢʟᴏʙᴀʟ: ${prefix}playlist tocar global:<nome> )`
}

exports.playlistRemoverUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global remover` : `${prefix}playlist remover`
return `- 🗑️ \`𝚁𝙴𝙼𝙾𝚅𝙴𝚁 𝙼𝚄́𝚂𝙸𝙲𝙰\`

> 📌 ׄ ( ᴜsᴇ: ${base} <nome> | <número-da-música> )`
}

exports.playlistLimparUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global limpar` : `${prefix}playlist limpar`
return `- 🧹 \`𝙻𝙸𝙼𝙿𝙰𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📌 ׄ ( ᴜsᴇ: ${base} <nome> )`
}

exports.playlistApagarUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global apagar` : `${prefix}playlist apagar`
return `- ❌ \`𝙰𝙿𝙰𝙶𝙰𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📌 ׄ ( ᴜsᴇ: ${base} <nome> )`
}

exports.playlistRenomearUso = (prefix, global = false) => {
const base = global ? `${prefix}playlist global renomear` : `${prefix}playlist renomear`
return `- ✏️ \`𝚁𝙴𝙽𝙾𝙼𝙴𝙰𝚁 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📌 ׄ ( ᴜsᴇ: ${base} <nome-atual> | <novo-nome> )`
}

exports.playlistCriada = (item, global = false) => {
return `- ✅ \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙲𝚁𝙸𝙰𝙳𝙰\`

> 🎶 ׄ ( ${item?.nome || 'Playlist'} )
> ${global ? '🌐' : '👤'} ׄ ( ${global ? 'ᴘʟᴀʏʟɪsᴛ ɢʟᴏʙᴀʟ.' : 'ᴘʟᴀʏʟɪsᴛ sᴀʟᴠᴀ ɴᴏ sᴇᴜ ᴘᴇʀғɪʟ.'} )
> ➕ ׄ ( ᴀɢᴏʀᴀ ᴜsᴇ ᴘʟᴀʏʟɪsᴛ ᴀᴅᴅ ᴘᴀʀᴀ ᴄᴏʟᴏᴄᴀʀ ᴍᴜ́sɪᴄᴀs. )`
}

exports.playlistExiste = (nome, global = false) => {
return `- ⚠️ \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙹𝙰́ 𝙴𝚇𝙸𝚂𝚃𝙴\`

> 🎶 ׄ ( ${nome} )
> ${global ? '🌐' : '👤'} ׄ ( ᴇsᴄᴏʟʜᴀ ᴏᴜᴛʀᴏ ɴᴏᴍᴇ. )`
}

exports.playlistNaoExiste = (nome, global = false) => {
return `- ❌ \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\`

> 🎶 ׄ ( ${nome || 'Playlist'} )
> ${global ? '🌐' : '👤'} ׄ ( ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴇssᴀ ᴘʟᴀʏʟɪsᴛ. )`
}

exports.playlistLimite = (limite, global = false) => {
return `- ⚠️ \`𝙻𝙸𝙼𝙸𝚃𝙴 𝙳𝙴 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃𝚂\`

> 📦 ׄ ( ʟɪᴍɪᴛᴇ: ${limite} ᴘʟᴀʏʟɪsᴛs ${global ? 'ɢʟᴏʙᴀɪs' : 'ᴘᴏʀ ᴜsᴜᴀ́ʀɪᴏ'}. )`
}

exports.playlistLimiteFaixas = limite => {
return `- ⚠️ \`𝙻𝙸𝙼𝙸𝚃𝙴 𝙳𝙴 𝙼𝚄́𝚂𝙸𝙲𝙰𝚂\`

> 🎵 ׄ ( ᴇssᴀ ᴘʟᴀʏʟɪsᴛ ᴊᴀ́ ᴄʜᴇɢᴏᴜ ᴀᴏ ʟɪᴍɪᴛᴇ ᴅᴇ ${limite} ᴍᴜ́sɪᴄᴀs. )`
}

exports.playlistLista = (lista = [], global = false) => {
const itens = Array.isArray(lista) ? lista : []

if (!itens.length) {
return `- 📋 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃𝚂 ${global ? '𝙶𝙻𝙾𝙱𝙰𝙸𝚂' : '𝚂𝙰𝙻𝚅𝙰𝚂'}\`

> 🎶 ׄ ( ɴᴇɴʜᴜᴍᴀ ᴘʟᴀʏʟɪsᴛ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ. )`
}

const linhas = itens.slice(0, 30).map((item, indice) => {
const musicas = Array.isArray(item?.musicas) ? item.musicas : []
const duracao = formatarTempoPlaylist(duracaoTotalPlaylist(musicas))
return `> 🎵 ׄ ( ${indice + 1}. ${item.nome} — ${musicas.length} música(s) — ${duracao} )`
}).join('\n')

return `- 📋 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃𝚂 ${global ? '𝙶𝙻𝙾𝙱𝙰𝙸𝚂' : '𝚂𝙰𝙻𝚅𝙰𝚂'}\`

${linhas}`
}

exports.playlistDetalhes = (item, global = false) => {
const musicas = Array.isArray(item?.musicas) ? item.musicas : []
const totalSegundos = duracaoTotalPlaylist(musicas)
const limite = 25
const linhas = musicas.slice(0, limite).map((musica, indice) =>
`> ${String(indice + 1).padStart(2, '0')}. 🎵 ${musica.titulo}\n>     ⏱️ ${musica.duracao || '0:00'}${musica.autor ? ` • ${musica.autor}` : ''}`
).join('\n')
const resto = musicas.length > limite
? `\n> ➕ ׄ ( +${musicas.length - limite} música(s) não exibida(s). )`
: ''

return `- 🎶 \`𝙼𝙸𝙽𝙷𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 📂 ׄ ( ɴᴏᴍᴇ: ${item?.nome || 'Playlist'} )
> ${global ? '🌐' : '👤'} ׄ ( ᴛɪᴘᴏ: ${global ? 'ɢʟᴏʙᴀʟ' : 'ᴘᴇssᴏᴀʟ'} )
> 🎵 ׄ ( ᴍᴜ́sɪᴄᴀs: ${musicas.length} )
> ⏱️ ׄ ( ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ ᴛᴏᴛᴀʟ: ${formatarTempoPlaylist(totalSegundos)} )
> 📅 ׄ ( ᴄʀɪᴀᴅᴀ ᴇᴍ: ${formatarDataPlaylist(item?.criadoEm)} )${linhas ? `\n\n${linhas}` : '\n\n> 🎵 ׄ ( ᴘʟᴀʏʟɪsᴛ ᴠᴀᴢɪᴀ. )'}${resto}`
}

exports.playlistFaixaAdicionada = (nome, faixa, total, global = false) => {
return `- ✅ \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙰\`

> 🎶 ׄ ( ᴘʟᴀʏʟɪsᴛ: ${nome} ${global ? '🌐' : ''} )
> 🎵 ׄ ( ${faixa?.titulo || 'Música'} )
> 👨‍🎤 ׄ ( ${faixa?.autor || 'Desconhecido'} )
> ⏱️ ׄ ( ${faixa?.duracao || '0:00'} )
> 🔢 ׄ ( ᴛᴏᴛᴀʟ: ${total} )`
}

exports.playlistFaixaDuplicada = titulo => {
return `- ⚠️ \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙹𝙰́ 𝚂𝙰𝙻𝚅𝙰\`

> 🎵 ׄ ( ${titulo || 'Essa música'} )
> 📌 ׄ ( ᴇssᴀ ᴍᴜ́sɪᴄᴀ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴀ ᴘʟᴀʏʟɪsᴛ. )`
}

exports.playlistFaixaRemovida = (nome, faixa, total) => {
return `- 🗑️ \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙰\`

> 🎶 ׄ ( ᴘʟᴀʏʟɪsᴛ: ${nome} )
> 🎵 ׄ ( ${faixa?.titulo || 'Música'} )
> 🔢 ׄ ( ʀᴇsᴛᴀᴍ: ${total} )`
}

exports.playlistIndiceInvalido = () => {
return `- ❌ \`𝙿𝙾𝚂𝙸𝙲̧𝙰̃𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\`

> 🔢 ׄ ( ᴜsᴇ ᴏ ɴᴜ́ᴍᴇʀᴏ ᴅᴀ ᴍᴜ́sɪᴄᴀ ǫᴜᴇ ᴀᴘᴀʀᴇᴄᴇ ᴇᴍ ᴘʟᴀʏʟɪsᴛ ᴠᴇʀ. )`
}

exports.playlistImportada = (nome, importada, resultado, global = false) => {
return `- 📥 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙸𝙼𝙿𝙾𝚁𝚃𝙰𝙳𝙰\`

> 🎶 ׄ ( ᴅᴇsᴛɪɴᴏ: ${nome} ${global ? '🌐' : ''} )
> ▶️ ׄ ( ʏᴏᴜᴛᴜʙᴇ: ${importada?.titulo || 'Playlist'} )
> ✅ ׄ ( ᴀᴅɪᴄɪᴏɴᴀᴅᴀs: ${resultado?.adicionadas?.length || 0} )
> ⏭️ ׄ ( ɪɢɴᴏʀᴀᴅᴀs/ᴅᴜᴘʟɪᴄᴀᴅᴀs: ${resultado?.ignoradas || 0} )
> 🔢 ׄ ( ᴛᴏᴛᴀʟ sᴀʟᴠᴏ: ${resultado?.total || 0} )`
}

exports.playlistVazia = nome => {
return `- 🎶 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝚅𝙰𝚉𝙸𝙰\`

> 🎵 ׄ ( ${nome || 'Playlist'} )
> ➕ ׄ ( ᴀᴅɪᴄɪᴏɴᴇ ᴘᴇʟᴏ ᴍᴇɴᴏs ᴜᴍᴀ ᴍᴜ́sɪᴄᴀ ᴀɴᴛᴇs ᴅᴇ ᴛᴏᴄᴀʀ. )`
}

exports.playlistApagada = (nome, global = false) => {
return `- 🗑️ \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙰𝙿𝙰𝙶𝙰𝙳𝙰\`

> 🎶 ׄ ( ${nome} ${global ? '🌐' : ''} )
> ✅ ׄ ( ʀᴇᴍᴏᴠɪᴅᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ. )`
}

exports.playlistRenomeada = (antigo, novo, global = false) => {
return `- ✏️ \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝚁𝙴𝙽𝙾𝙼𝙴𝙰𝙳𝙰\`

> 📝 ׄ ( ${antigo} → ${novo} ${global ? '🌐' : ''} )`
}

exports.playlistLimpa = (nome, removidas) => {
return `- 🧹 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙻𝙸𝙼𝙿𝙰\`

> 🎶 ׄ ( ${nome} )
> 🗑️ ׄ ( ${removidas} música(s) removida(s). )`
}

exports.playlistIniciada = status => {
return `- 🎶 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙰\`

> 📂 ׄ ( ɴᴏᴍᴇ: ${status?.nome || 'Playlist'} )
> 🎵 ׄ ( ᴍᴜ́sɪᴄᴀs: ${status?.total || 0} )
> ⏱️ ׄ ( ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ ᴛᴏᴛᴀʟ: ${status?.duracaoTotal || formatarTempoPlaylist(status?.duracaoTotalSegundos)} )
> 📅 ׄ ( ᴄʀɪᴀᴅᴀ ᴇᴍ: ${formatarDataPlaylist(status?.criadoEm)} )
> 🔁 ׄ ( ʟᴏᴏᴘ: ${status?.loop ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )
> 🔀 ׄ ( ᴀʟᴇᴀᴛᴏ́ʀɪᴏ: ${status?.aleatorio ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )

> ▶️ ׄ ( ɪɴɪᴄɪᴀɴᴅᴏ ᴀ ᴘʟᴀʏʟɪsᴛ... )`
}

exports.playlistAgoraTocando = status => {
return `- 🎧 \`𝙰𝙶𝙾𝚁𝙰 𝚃𝙾𝙲𝙰𝙽𝙳𝙾\`

> 🎵 ׄ ( ${status?.atual?.titulo || 'Música'} )
> 👤 ׄ ( ${status?.atual?.autor || 'Desconhecido'} )
> ⏱️ ׄ ( ${status?.atual?.duracao || '0:00'} )
> 📂 ׄ ( ${status?.nome || 'Playlist'} )
> 🔢 ׄ ( ${status?.posicao || 0}/${status?.total || 0} )
> 🔁 ׄ ( ʟᴏᴏᴘ: ${status?.loop ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )
> 🔀 ׄ ( ᴀʟᴇᴀᴛᴏ́ʀɪᴏ: ${status?.aleatorio ? 'ᴀᴛɪᴠᴀᴅᴏ' : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )

> ⏭️ ׄ ( ᴘʀᴏ́xɪᴍᴀ: ${status?.proxima?.titulo || 'fim da fila'} )`
}

exports.playlistFaixaFinalizada = dados => {
return `- ✅ \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙰\`

> 🎵 ׄ ( ${dados?.faixa?.titulo || 'Música'} )
> ⏱️ ׄ ( ${dados?.faixa?.duracao || '0:00'} )
> ✅ ׄ ( ${dados?.posicao || 0}/${dados?.total || 0} ᴄᴏɴᴄʟᴜɪ́ᴅᴀ )
> ⏭️ ׄ ( ${dados?.proxima?.titulo ? `ᴘʀᴏ́xɪᴍᴀ: ${dados.proxima.titulo}` : 'ғɪᴍ ᴅᴀ ғɪʟᴀ'} )`
}

exports.playlistSemSessao = () => {
return `- 📻 \`𝙽𝙴𝙽𝙷𝚄𝙼𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝚃𝙾𝙲𝙰𝙽𝙳𝙾\`

> 🎶 ׄ ( ɪɴɪᴄɪᴇ ᴜᴍᴀ ᴘʟᴀʏʟɪsᴛ ᴏᴜ ᴜᴍᴀ ғɪʟᴀ ᴘᴀʀᴛʏ ᴘʀɪᴍᴇɪʀᴏ. )`
}

exports.playlistSemControle = () => {
return `- 🔒 \`𝙲𝙾𝙽𝚃𝚁𝙾𝙻𝙴 𝙳𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 🔒 ׄ ( ᴀ ʀᴇᴘʀᴏᴅᴜᴄ̧ᴀ̃ᴏ ᴀᴛᴜᴀʟ ғᴏɪ ɪɴɪᴄɪᴀᴅᴀ ᴘᴏʀ ᴏᴜᴛʀᴏ ᴜsᴜᴀ́ʀɪᴏ. )
> 🛡️ ׄ ( ᴏ ᴄʀɪᴀᴅᴏʀ ᴅᴀ ғɪʟᴀ, ᴀᴅᴍ ᴏᴜ ᴅᴏɴᴏ ᴘᴏᴅᴇ ᴄᴏɴᴛʀᴏʟᴀʀ. )`
}

exports.playlistPausada = () => {
return `- ⏸️ \`𝙵𝙸𝙻𝙰 𝙿𝙰𝚄𝚂𝙰𝙳𝙰\`

> ⏸️ ׄ ( ᴏ ᴛᴇᴍᴘᴏʀɪᴢᴀᴅᴏʀ ᴅᴀ ᴘʀᴏ́xɪᴍᴀ ᴍᴜ́sɪᴄᴀ ғᴏɪ ᴘᴀᴜsᴀᴅᴏ. )
> ℹ️ ׄ ( ᴏ ᴀ́ᴜᴅɪᴏ ǫᴜᴇ ᴊᴀ́ ғᴏɪ ᴇɴᴠɪᴀᴅᴏ ᴄᴏɴᴛɪɴᴜᴀ ɴᴏ ᴡʜᴀᴛsᴀᴘᴘ. )`
}

exports.playlistJaPausada = () => {
return `- ⏸️ \`𝙵𝙸𝙻𝙰 𝙹𝙰́ 𝙿𝙰𝚄𝚂𝙰𝙳𝙰\`

> 📌 ׄ ( ᴜsᴇ ᴘʟᴀʏʟɪsᴛ ᴄᴏɴᴛɪɴᴜᴀʀ ᴘᴀʀᴀ ʀᴇᴛᴏᴍᴀʀ. )`
}

exports.playlistNaoPausada = () => {
return `- ▶️ \`𝙵𝙸𝙻𝙰 𝙹𝙰́ 𝙰𝚃𝙸𝚅𝙰\`

> 📌 ׄ ( ᴀ ғɪʟᴀ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴘᴀᴜsᴀᴅᴀ. )`
}

exports.playlistContinuada = () => {
return `- ▶️ \`𝙵𝙸𝙻𝙰 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙰𝙳𝙰\`

> 🎶 ׄ ( ᴏ ᴛᴇᴍᴘᴏʀɪᴢᴀᴅᴏʀ ᴅᴀ ᴘʀᴏ́xɪᴍᴀ ᴍᴜ́sɪᴄᴀ ғᴏɪ ʀᴇᴛᴏᴍᴀᴅᴏ. )`
}

exports.playlistParada = () => {
return `- ⏹️ \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙿𝙰𝚁𝙰𝙳𝙰\`

> ⏹️ ׄ ( ᴏ ᴇɴᴠɪᴏ ᴀᴜᴛᴏᴍᴀ́ᴛɪᴄᴏ ᴅᴇ ᴍᴜ́sɪᴄᴀs ғᴏɪ ᴇɴᴄᴇʀʀᴀᴅᴏ. )`
}

exports.playlistPulou = (tipo, status) => {
return `- ${tipo === 'ANTERIOR' ? '⏮️' : '⏭️'} \`${tipo === 'ANTERIOR' ? '𝙼𝚄́𝚂𝙸𝙲𝙰 𝙰𝙽𝚃𝙴𝚁𝙸𝙾𝚁' : '𝙿𝚁𝙾́𝚇𝙸𝙼𝙰 𝙼𝚄́𝚂𝙸𝙲𝙰'}\`

> 🎵 ׄ ( ${status?.atual?.titulo || 'Música'} )
> 🔢 ׄ ( ${status?.posicao || 0}/${status?.total || 0} )`
}

exports.playlistFimDaFila = () => {
return `- 🏁 \`𝙵𝙸𝙼 𝙳𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 🎶 ׄ ( ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ᴏᴜᴛʀᴀ ᴍᴜ́sɪᴄᴀ ɴᴀ ғɪʟᴀ. )`
}

exports.playlistInicioDaFila = () => {
return `- ⏮️ \`𝙸𝙽𝙸́𝙲𝙸𝙾 𝙳𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 🎶 ׄ ( ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴀ ᴘʀɪᴍᴇɪʀᴀ ᴍᴜ́sɪᴄᴀ. )`
}

exports.playlistLoop = ativo => {
return `- 🔁 \`𝙻𝙾𝙾𝙿 𝙳𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 🔁 ׄ ( sᴛᴀᴛᴜs: ${ativo ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )`
}

exports.playlistAleatorio = ativo => {
return `- 🔀 \`𝙼𝙾𝙳𝙾 𝙰𝙻𝙴𝙰𝚃𝙾́𝚁𝙸𝙾\`

> 🔀 ׄ ( sᴛᴀᴛᴜs: ${ativo ? '🟢 ᴀᴛɪᴠᴀᴅᴏ' : '🔴 ᴅᴇsᴀᴛɪᴠᴀᴅᴏ'} )`
}

exports.playlistLoopParty = () => {
return `- 🎉 \`𝙼𝙾𝙳𝙾 𝙿𝙰𝚁𝚃𝚈\`

> 🔁 ׄ ( ᴏ ʟᴏᴏᴘ ɴᴀ̃ᴏ ᴇ́ ᴜsᴀᴅᴏ ɴᴀ ғɪʟᴀ ᴘᴀʀᴛʏ. )`
}

exports.playlistAleatorioParty = () => {
return `- 🎉 \`𝙼𝙾𝙳𝙾 𝙿𝙰𝚁𝚃𝚈\`

> 🔀 ׄ ( ᴀ ғɪʟᴀ ᴘᴀʀᴛʏ ᴍᴀɴᴛᴇ́ᴍ ᴀ ᴏʀᴅᴇᴍ ᴇᴍ ǫᴜᴇ ᴀs ᴍᴜ́sɪᴄᴀs ғᴏʀᴀᴍ ᴀᴅɪᴄɪᴏɴᴀᴅᴀs. )`
}

exports.playlistStatus = status => {
if (!status)
return exports.playlistSemSessao()

const decorrido = Math.max(0, Number(status.decorridoSegundos || 0))
const duracao = Math.max(0, Number(status.duracaoAtualSegundos || status.atual?.duracaoSegundos || 0))
const restante = Math.max(0, Number(status.restanteSegundos || 0))
const barra = barraPlaylist(decorrido, duracao)

return `- 🎧 \`𝙿𝙻𝙰𝚈𝙴𝚁 𝙳𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> 🎵 ׄ ( ${status.atual?.titulo || 'aguardando música'} )
> 👤 ׄ ( ${status.atual?.autor || 'Desconhecido'} )
> 📂 ׄ ( ${status.nome || 'Playlist'} )
> 🔢 ׄ ( ${status.posicao}/${status.total} )
> ⏱️ ׄ ( ${formatarTempoPlaylist(decorrido)} / ${status.atual?.duracao || formatarTempoPlaylist(duracao)} )
> ⏳ ׄ ( ғᴀʟᴛᴀᴍ: ${formatarTempoPlaylist(restante)} )
> ▶️ ׄ ( ${barra} )
> ⏭️ ׄ ( ᴘʀᴏ́xɪᴍᴀ: ${status.proxima?.titulo || 'nenhuma'} )
> 🔁 ׄ ( ʟᴏᴏᴘ: ${status.loop ? 'on' : 'off'} )
> 🔀 ׄ ( ᴀʟᴇᴀᴛᴏ́ʀɪᴏ: ${status.aleatorio ? 'on' : 'off'} )
> ⚡ ׄ ( ᴘʀᴇ́-ᴄᴀʀɢᴀ: ${status.preload ? 'ativa' : 'aguardando'} )`
}

exports.playlistFinalizada = dados => {
const nome = typeof dados === 'string' ? dados : dados?.nome
const total = typeof dados === 'object' ? dados?.total : 0
const duracao = typeof dados === 'object' ? dados?.duracaoTotal : ''

return `- 🏁 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙰\`

> 📂 ׄ ( ${nome || 'Playlist'} )${total ? `\n> 🎵 ׄ ( ${total} ᴍᴜ́sɪᴄᴀs ᴛᴏᴄᴀᴅᴀs )` : ''}${duracao ? `\n> ⏱️ ׄ ( ${duracao} )` : ''}
> ✅ ׄ ( ᴛᴏᴅᴀs ᴀs ᴍᴜ́sɪᴄᴀs ғᴏʀᴀᴍ ᴇɴᴠɪᴀᴅᴀs. )`
}

exports.playlistFaixaPulada = titulo => {
return `- ⚠️ \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙿𝚄𝙻𝙰𝙳𝙰\`

> 🎵 ׄ ( ${titulo || 'Música'} )
> ⏭️ ׄ ( ɴᴀ̃ᴏ ᴄᴏɴsᴇɢᴜɪ ᴇɴᴠɪᴀʀ ᴇssᴀ ғᴀɪxᴀ; ᴛᴇɴᴛᴀɴᴅᴏ ᴀ ᴘʀᴏ́xɪᴍᴀ. )`
}

exports.playlistInterrompidaErro = () => {
return `- ❌ \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙸𝙽𝚃𝙴𝚁𝚁𝙾𝙼𝙿𝙸𝙳𝙰\`

> ⚠️ ׄ ( ᴛʀᴇ̂s ᴍᴜ́sɪᴄᴀs sᴇɢᴜɪᴅᴀs ғᴀʟʜᴀʀᴀᴍ; ᴀ ғɪʟᴀ ғᴏɪ ᴇɴᴄᴇʀʀᴀᴅᴀ. )`
}

exports.playlistErro = detalhe => {
return `- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙰 𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃\`

> ⚠️ ׄ ( ${detalhe || 'Não foi possível concluir esta ação.'} )`
}

exports.partyAjuda = prefix => {
return `- 🎉 \`𝙿𝙻𝙰𝚈𝙻𝙸𝚂𝚃 𝙿𝙰𝚁𝚃𝚈\`

> ▶️ ׄ ( ${prefix}playlist party iniciar )
> ➕ ׄ ( ${prefix}playlist party add <música> )
> 📋 ׄ ( ${prefix}playlist party fila )
> ⏭️ ׄ ( ${prefix}playlist party proxima )
> ⏸️ ׄ ( ${prefix}playlist party pausar )
> ▶️ ׄ ( ${prefix}playlist party continuar )
> ⏹️ ׄ ( ${prefix}playlist party parar )`
}

exports.partyIniciada = prefix => {
return `- 🎉 \`𝙿𝙰𝚁𝚃𝚈 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙰\`

> 👥 ׄ ( ᴀ ғɪʟᴀ ᴄᴏʟᴀʙᴏʀᴀᴛɪᴠᴀ ᴇsᴛᴀ́ ᴀʙᴇʀᴛᴀ. )
> ➕ ׄ ( ᴀᴅɪᴄɪᴏɴᴇ: ${prefix}playlist party add <música> )
> ▶️ ׄ ( ᴀ ᴘʀɪᴍᴇɪʀᴀ ᴍᴜ́sɪᴄᴀ ᴀᴅɪᴄɪᴏɴᴀᴅᴀ ᴄᴏᴍᴇᴄ̧ᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ. )`
}

exports.partyInativa = prefix => {
return `- 🎉 \`𝙿𝙰𝚁𝚃𝚈 𝙸𝙽𝙰𝚃𝙸𝚅𝙰\`

> 📌 ׄ ( ɪɴɪᴄɪᴇ ᴄᴏᴍ: ${prefix}playlist party iniciar )`
}

exports.partyAddUso = prefix => {
return `- ➕ \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝚁 𝙽𝙰 𝙿𝙰𝚁𝚃𝚈\`

> 📌 ׄ ( ᴜsᴇ: ${prefix}playlist party add <música-ou-link> )`
}

exports.partyAdicionada = (faixa, total, sender) => {
return `- 🎉 \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙽𝙰 𝙵𝙸𝙻𝙰\`

> 🎵 ׄ ( ${faixa?.titulo || 'Música'} )
> 👤 ׄ ( ᴀᴅɪᴄɪᴏɴᴀᴅᴀ ᴘᴏʀ @${String(sender || '').split('@')[0]} )
> 🔢 ׄ ( ᴛᴏᴛᴀʟ ᴅᴀ ᴘᴀʀᴛʏ: ${total} )`
}

exports.partyFila = fila => {
const proximas = Array.isArray(fila?.proximas) ? fila.proximas : []
const linhas = proximas.slice(0, 15).map((faixa, indice) =>
`> 🎵 ׄ ( ${indice + 1}. ${faixa.titulo} — ${faixa.duracao || '0:00'} )`
).join('\n')
const resto = proximas.length > 15
? `\n> ➕ ׄ ( +${proximas.length - 15} na fila. )`
: ''

return `- 🎉 \`𝙵𝙸𝙻𝙰 𝙿𝙰𝚁𝚃𝚈\`

> 🎧 ׄ ( ᴀɢᴏʀᴀ: ${fila?.atual?.titulo || 'aguardando música'} )
> 🔢 ׄ ( ᴛᴏᴛᴀʟ: ${fila?.total || 0} )${linhas ? `\n\n${linhas}` : '\n\n> 📭 ׄ ( ɴᴇɴʜᴜᴍᴀ ᴍᴜ́sɪᴄᴀ ᴀɢᴜᴀʀᴅᴀɴᴅᴏ. )'}${resto}`
}

exports.partySemProximas = () => {
return `- 📭 \`𝙵𝙸𝙻𝙰 𝙿𝙰𝚁𝚃𝚈 𝚅𝙰𝚉𝙸𝙰\`

> 🎉 ׄ ( ɴᴀ̃ᴏ ᴛᴇᴍ ᴏᴜᴛʀᴀ ᴍᴜ́sɪᴄᴀ ᴀɢᴜᴀʀᴅᴀɴᴅᴏ. )`
}
