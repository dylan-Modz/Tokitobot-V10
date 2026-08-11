/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "limparvip",
  comandos: ["limparvip", "clearvip", "resetvip"],
  categoria: "vip",
  info: {
    "descricao": "Executa o comando limparvip.",
    "uso": "limparvip",
    "categoria": "vip"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        if (!vip.length)
          return reply('*❌ | ᴀ ʟɪsᴛᴀ ᴠɪᴘ ᴊᴀ ᴇsᴛᴀ ᴠᴀᴢɪᴀ.*')
        const totalVip = vip.length
        vip.splice(0, vip.length)
        fs.writeFileSync(caminhoVip, JSON.stringify(vip, null, 2))
        await tokito.sendMessage(from, {
          text: `*✅ | @${sender.split('@')[0]} ʟɪᴍᴘᴏᴜ ᴛᴏᴅᴀ ᴀ ʟɪsᴛᴀ ᴠɪᴘ!*\n\n*📊 | ᴛᴏᴛᴀʟ ʀᴇᴍᴏᴠɪᴅᴏ: ${totalVip} ᴜsᴜᴀʀɪᴏ${totalVip !== 1 ? 's' : ''}.*`,
          contextInfo: {
            ...newsletter,
            mentionedJid: [sender]
          }
        }, { quoted: selo })
      }
    }
  }
}
