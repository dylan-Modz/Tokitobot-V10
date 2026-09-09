/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: printsite.js
 *  Função : Gerar print de site pela Tokito APIs
 *  Dev    : Dylan Modz
 * ============================================================
 */

const axios = require('axios')
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

    await reagir(from, '⏳').catch(() => {})

    try {
      const base = String(
        API_URL || 'https://tokito-apis.com.br'
      ).replace(/\/+$/, '')

      const resposta = await axios.get(
        `${base}/api/print-site`,
        {
          params: {
            url: site,
            apikey: API_KEY_TOKITO
          },

          responseType: 'arraybuffer',
          timeout: 120000,
          maxRedirects: 10,

          headers: {
            Accept: 'image/png,image/jpeg,image/webp,image/*,*/*'
          },

          validateStatus: () => true
        }
      )

      const contentType = String(
        resposta.headers?.['content-type'] || ''
      ).toLowerCase()

      const imagem = Buffer.from(
        resposta.data || []
      )

      if (
        resposta.status !== 200 ||
        !contentType.includes('image') ||
        imagem.length < 1000
      ) {
        let detalhe =
          `HTTP ${resposta.status || 'desconhecido'}`

        try {
          const texto = imagem.toString('utf8').trim()

          if (texto) {
            try {
              const json = JSON.parse(texto)

              detalhe =
                json?.resultado ||
                json?.erro ||
                json?.error ||
                json?.message ||
                texto
            }
            catch {
              detalhe = texto
            }
          }
        }
        catch {}

        throw new Error(
          String(detalhe).slice(0, 500)
        )
      }

      const quoted = selo || info || undefined

      await tokito.sendMessage(
        from,
        {
          image: imagem,

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
        quoted ? { quoted } : {}
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
