/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: printsite.js
 *  Função : Gerar print de site pela Tokito APIs
 *  Dev    : Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'printsite',
  comandos: ['printsite', 'print'],
  categoria: 'ferramentas',

  info: {
    descricao: 'Gera uma captura de tela de um site.',
    uso: 'printsite https://google.com',
    categoria: 'ferramentas'
  },

  async executar(ctx) {
    const {
      q,
      prefix,
      command,
      API_URL,
      API_KEY_TOKITO,
      tokito,
      from,
      sender,
      selo,
      info,
      canalInfo,
      reagir,
      reply
    } = ctx

    const site = String(q || '').trim()

    if (!site) {
      return reply(
        `- 🧊 \`𝙿𝚁𝙸𝙽𝚃 𝙳𝙾 𝚂𝙸𝚃𝙴\`\n\n` +
        `> *『 🌐 𝚄𝚂𝙾 』— ${prefix + command} https://google.com*`
      )
    }

    if (!API_KEY_TOKITO) {
      return reply(
        `- ❌ \`𝙿𝚁𝙸𝙽𝚃 𝙳𝙾 𝚂𝙸𝚃𝙴\`\n\n` +
        `> *『 🔑 𝙴𝚁𝚁𝙾 』— ᴛᴏᴋᴇɴ ᴅᴀ ᴛᴏᴋɪᴛᴏ ᴀᴘɪs ɴᴀ̃ᴏ ᴄᴏɴғɪɢᴜʀᴀᴅᴏ.*`
      )
    }

    await reagir(from, '⏳').catch(() => {})

    try {
      const base = String(
        API_URL || 'https://tokito-apis.com.br'
      ).replace(/\/+$/, '')

      /*
       * A rota /api/print-site retorna a imagem diretamente:
       *
       * return res.status(200).send(imagem)
       *
       * Por isso o Baileys pode usar a própria URL da rota.
       */
      const apiUrl =
        `${base}/api/print-site` +
        `?url=${encodeURIComponent(site)}` +
        `&apikey=${encodeURIComponent(String(API_KEY_TOKITO))}`

      const quoted = selo || info || undefined

      await tokito.sendMessage(
        from,
        {
          image: {
            url: apiUrl
          },

          caption:
            `- 🧊 \`𝙿𝚁𝙸𝙽𝚃 𝙳𝙾 𝚂𝙸𝚃𝙴\`\n\n` +
            `> *『 🌐 𝚂𝙸𝚃𝙴 』— ${site}*\n\n` +
            `> *『 ✅ 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘʀɪɴᴛ ɢᴇʀᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🧊*`,

          contextInfo:
            typeof canalInfo === 'function'
              ? canalInfo([sender])
              : {
                  mentionedJid: [sender].filter(Boolean)
                }
        },

        quoted
          ? {
              quoted
            }
          : {}
      )

      await reagir(from, '✅').catch(() => {})

      return true
    }
    catch (error) {
      console.log(
        '[PRINTSITE]',
        error?.response?.data ||
        error?.message ||
        error
      )

      await reagir(from, '❌').catch(() => {})

      return reply(
        `- ❌ \`𝙿𝚁𝙸𝙽𝚃 𝙳𝙾 𝚂𝙸𝚃𝙴\`\n\n` +
        `> *『 𝙴𝚁𝚁𝙾 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ɢᴇʀᴀʀ ᴏ ᴘʀɪɴᴛ.*\n\n` +
        `> *『 🌐 𝚄𝚁𝙻 』— ᴠᴇʀɪғɪǫᴜᴇ ᴏ ʟɪɴᴋ ᴇ ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
      )
    }
  }
})