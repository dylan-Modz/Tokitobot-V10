/* Lista de administradores do grupo.
 * Dev: Dylan Modz
 */

module.exports = {
  nome: "admins",

  comandos: [
    "admins",
    "adms"
  ],

  categoria: "grupo",

  info: {
    descricao: "Mostra todos os administradores do grupo.",
    uso: "admins",
    categoria: "grupo"
  },

  async executar(ctx) {
    with (ctx) {
      if (!isGroup) {
        return reply(
          mess.onlyGroup()
        )
      }

      try {
        await reagir(
          from,
          "👑"
        )

        const metadata = await tokito.groupMetadata(
          from
        )

        const participantes =
          metadata?.participants || []

        const administradores =
          participantes.filter(
            participante =>
              participante?.admin === "admin" ||
              participante?.admin === "superadmin"
          )

        if (!administradores.length) {
          return reply(
            "*❌ | Não encontrei administradores neste grupo.*"
          )
        }

        const mencoes = []

        const lista = administradores.map(
          (participante, index) => {
            const jid =
              participante?.phoneNumber ||
              participante?.id ||
              participante?.jid ||
              ""

            if (jid) {
              mencoes.push(
                jid
              )
            }

            const numero =
              String(jid)
                .split("@")[0]
                .replace(/\D/g, "")

            const cargo =
              participante?.admin === "superadmin"
                ? "👑"
                : "⭐"

            return `${cargo} ${index + 1}. @${numero}`
          }
        ).join(
          "\n"
        )

        const texto =
`- 👑 \`𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${metadata?.subject || "Grupo"}
『 👑 \`𝚃𝙾𝚃𝙰𝙻 𝙳𝙴 𝙰𝙳𝙼𝚂\` 』— ${administradores.length}

${lista}`

        await tokito.sendMessage(
          from,
          {
            text: texto,

            mentions: mencoes,

            contextInfo:
              typeof canalInfo === "function"
                ? canalInfo(
                    mencoes
                  )
                : {
                    mentionedJid:
                      mencoes
                  }
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
          "[ADMINS]",
          e?.message || e
        )

        return reply(
          "*❌ | Não consegui puxar os administradores do grupo.*"
        )
      }
    }
  }
}