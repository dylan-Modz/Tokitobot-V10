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
      axios,
      API_URL,
      API_KEY_TOKITO,
      tokito,
      from,
      sender,
      selo,
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

    await reagir(from, '⏳').catch(() => {})

    try {
      const base = String(
        API_URL || 'https://tokito-apis.com.br'
      ).replace(/\/+$/, '')

      const { data } = await axios.get(
        `${base}/api/print-site`,
        {
          params: {
            url: site,
            apikey: API_KEY_TOKITO
          },
          timeout: 90000,
          headers: {
            Accept: 'application/json'
          },
          validateStatus: () => true
        }
      )

      const arquivo =
        data?.arquivo ||
        data?.resultado?.arquivo ||
        data?.result?.arquivo ||
        data?.url ||
        data?.resultado?.url

      if (
        !arquivo ||
        !/^https?:\/\//i.test(String(arquivo))
      ) {
        const detalhe =
          data?.erro ||
          data?.error ||
          data?.message ||
          data?.mensagem ||
          'A API não retornou o arquivo da imagem.'

        throw new Error(String(detalhe))
      }

      await tokito.sendMessage(
        from,
        {
          image: {
            url: String(arquivo)
          },

          caption:
            `- 🧊 \`𝙿𝚁𝙸𝙽𝚃 𝙳𝙾 𝚂𝙸𝚃𝙴\`\n\n` +
            `> *『 🌐 𝚂𝙸𝚃𝙴 』— ${site}*\n\n` +
            `> *『 ✅ 𝚂𝚃𝙰𝚃𝚄𝚂 』— ᴘʀɪɴᴛ ɢᴇʀᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ. 🧊*`,

          contextInfo:
            typeof canalInfo === 'function'
              ? canalInfo([sender])
              : { mentionedJid: [sender].filter(Boolean) }
        },
        selo ? { quoted: selo } : {}
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
