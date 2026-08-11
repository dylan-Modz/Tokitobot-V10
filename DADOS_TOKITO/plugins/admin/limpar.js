/* Limpeza visual do chat.
 * Dev: Dylan Modz
 */

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const clear = `🗑️${"\n".repeat(150)}🗑️
❲❗❳ *Lɪᴍᴘᴇᴢᴀ ᴅᴇ Cʜᴀᴛ* ✅`

module.exports = {
  nome: "limpar",

  comandos: [
    "limpar"
  ],

  categoria: "admin",

  info: {
    descricao: "Realiza uma limpeza visual no chat do grupo.",
    uso: "limpar",
    categoria: "admin"
  },

  async executar(ctx) {
    with (ctx) {
      if (!isGroup) {
        return reply(
          mess.onlyGroup()
        )
      }

      if (!isGroupAdmins) {
        return reply(
          mess.onlyAdmins()
        )
      }

      if (!isBotGroupAdmins) {
        return reply(
          mess.onlyBotAdmin()
        )
      }

      await reagir(
        from,
        "🗑️"
      )

      await reply(
        "*ʟɪᴍᴘᴇᴢᴀ ᴅᴇ ᴄʜᴀᴛ 💁‍♂️*"
      )

      await sleep(
        1000
      )

      for (
        let i = 0;
        i < 10;
        i++
      ) {
        await reply(
          clear
        )

        await sleep(
          300
        )
      }

      await reply(
        "*ᴘʀᴏɴᴛᴏ sᴇɴʜᴏʀ, ᴀᴄᴀʙᴇɪ ᴅᴇ ʟɪᴍᴘᴀʀ ᴏ ᴄʜᴀᴛ 🙇‍♂️*"
      )
    }
  }
}