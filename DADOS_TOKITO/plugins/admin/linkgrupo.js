/* Link de convite do grupo.
 * Dev: Dylan Modz
 */

module.exports = {
  nome: "linkgrupo",

  comandos: [
    "linkgrupo",
    "linkgp"
  ],

  categoria: "grupo",

  info: {
    descricao: "Puxa o link de convite do grupo atual.",
    uso: "linkgrupo",
    categoria: "grupo"
  },

  async executar(ctx) {
    with (ctx) {
      if (!isGroup) {
        return reply(
          mess.onlyGroup()
        )
      }

      if (!isBotGroupAdmins) {
        return reply(
          mess.onlyBotAdmin()
        )
      }

      try {
        await reagir(
          from,
          "🔗"
        )

        const metadata = await tokito
          .groupMetadata(from)
          .catch(() => null)

        const nomeGrupo =
          metadata?.subject ||
          groupName ||
          "Grupo"

        const codigo = await tokito
          .groupInviteCode(from)

        if (!codigo) {
          return reply(
            "*❌ | Não consegui obter o link deste grupo.*"
          )
        }

        const link =
          `https://chat.whatsapp.com/${codigo}`

        const texto =
`- 🔗 \`𝙻𝙸𝙽𝙺 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${nomeGrupo}

『 🔗 \`𝙻𝙸𝙽𝙺\` 』
${link}

> *Toque no link acima para entrar no grupo.*`

        await tokito.sendMessage(
          from,
          {
            text: texto,

            contextInfo:
              typeof canalInfo === "function"
                ? canalInfo([])
                : {}
          },
          {
            quoted: selo
          }
        )

        await reagir(
          from,
          "✅"
        )
      }
      catch (e) {
        console.log(
          "[LINK GRUPO]",
          e?.message || e
        )

        return reply(
          "*❌ | Não consegui puxar o link do grupo.*"
        )
      }
    }
  }
}