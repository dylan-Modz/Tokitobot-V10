/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "boton",
  comandos: ["boton", "botoff"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando boton.",
    "uso": "boton",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        if (!isBotoff) {
          nescessario.botoff = true
          fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
          await reagir(from, '🔴')
          await reply('*ᴏ ʙᴏᴛ ꜰᴏɪ ᴅᴇsʟɪɢᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ᴘʀᴀ ᴜsᴏ ᴅᴇ ᴍᴇᴍʙʀᴏs ᴇ ᴀᴅᴍs ᴅᴇ ɢʀᴜᴘᴏs 🙇🏻‍♂️*')
        }
        else {
          nescessario.botoff = false
          fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
          await reagir(from, '🟢')
          await reply('*ᴀᴛɪᴠᴀɴᴅᴏ ᴛᴏᴅᴏs ᴏs ꜰᴜɴᴄɪᴏɴᴀᴍᴇɴᴛᴏs ᴅᴏ ʙᴏᴛ ɴᴏᴠᴀᴍᴇɴᴛᴇ 🙇🏻‍♂️*')
        }
      }
    }
  }
}
