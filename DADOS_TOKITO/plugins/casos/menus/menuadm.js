/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "menuadm",
  comandos: ["menuadm"],
  categoria: "menus",
  info: {
    "descricao": "Executa o comando menuadm.",
    "uso": "menuadm",
    "categoria": "menus"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply('*❌ | ᴇsᴛᴇ ᴍᴇɴᴜ sᴏ ᴘᴏᴅᴇ sᴇʀ ᴀʙᴇʀᴛᴏ ᴇᴍ ɢʀᴜᴘᴏs.*')
        if (!isGroupAdmins)
          return reply('*❌ | ᴇsᴛᴇ ᴍᴇɴᴜ ᴇ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs.*')
        await dylanModz(linguagem.menuadm(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion), '🧊', [
          {
            texto: mess.botaoMenuDono(),
            id: `${prefix}menudono`
          }
        ])
      }
    }
  }
}
