/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "delvip",
  comandos: ["delvip"],
  categoria: "vip",
  info: {
    "descricao": "Executa o comando delvip.",
    "uso": "delvip",
    "categoria": "vip"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        let alvo = menc_os2 || String(q || '').replace(/\D/g, '')
        if (Array.isArray(alvo))
          alvo = alvo[0]
        alvo = normalizar(alvo)
        if (!String(alvo).includes('@'))
          alvo = `${String(alvo).replace(/\D/g, '')}@s.whatsapp.net`
        if (!alvo || alvo === '@s.whatsapp.net')
          return reply(`*❌ | ᴍᴀʀǫᴜᴇ ᴏ ᴜsᴜᴀʀɪᴏ ᴏᴜ ᴅɪɢɪᴛᴇ ᴏ ɴᴜᴍᴇʀᴏ.*\n\n> ${prefix + command} @usuario`)
        const indiceVip = vip.map(i => i.id).indexOf(alvo)
        if (indiceVip < 0)
          return reply('*❌ | ᴇssᴇ ᴜsᴜᴀʀɪᴏ ɴᴀᴏ ᴇsᴛᴀ ɴᴀ ʟɪsᴛᴀ ᴠɪᴘ.*')
        vip.splice(indiceVip, 1)
        fs.writeFileSync(caminhoVip, JSON.stringify(vip, null, 2))
        await tokito.sendMessage(from, {
          text: `*✅ | @${alvo.split('@')[0]} ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴀ ʟɪsᴛᴀ ᴠɪᴘ ᴄᴏᴍ sᴜᴄᴇssᴏ!*`,
          contextInfo: {
            ...newsletter,
            mentionedJid: [alvo]
          }
        }, { quoted: selo })
      }
    }
  }
}
