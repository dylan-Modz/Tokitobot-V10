/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * TikTok GIF — envia cada Live Photo animada como GIF do WhatsApp.
 * Usa a Tokito APIs e a Stone WPP já configuradas no bot.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const scraper = require('../../scrapers/downloads/tiktok_gif')
const dylan = require('../../database/lib/comandos')

const PAUSA_ENTRE_GIFS = 400
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms))

dylan.setCommand({
  nome: 'tiktok-gif',
  comandos: ['tiktok-gif', 'ttgif'],
  categoria: 'downloads',

  info: {
    descricao: 'Baixa as animações originais de um TikTok e envia cada uma como GIF.',
    uso: 'tiktok-gif link',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const link = String(q || '').trim()
        if (!link) {
          return reply(mess.downloadUso({
            tipo: 'LINK TIKTOK',
            prefix,
            command,
            exemplo: 'https://vt.tiktok.com/ZSpkAcKeo'
          }))
        }

        await reagir(from, '🎞️').catch(() => {})
        await reply(
          '- 📡 `𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙽𝙳𝙾...`\n\n' +
          '> 📡 ׄ ( ᴛᴏ̂ ʙᴜsᴄᴀɴᴅᴏ ᴛᴜᴅᴏ ᴘʀᴀ ᴠᴏᴄᴇ̂, sᴏ́ ᴍᴀɪs ᴜᴍ ᴘᴏᴜǫᴜɪɴʜᴏ. 📡 )'
        )

        const { animacoes } = await scraper.consultar(link)
        const quantidade = animacoes.length

        if (!quantidade) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('GIFS ANIMADOS'))
        }

        const contexto = {
          ...newsletter,
          mentionedJid: [sender]
        }

        // Mesmo visual das mensagens do bot; o comando continua tiktok-gif.
        const titulo = '- 🎞️ `𝚃𝙸𝙺𝚃𝙾𝙺 𝙰𝙽𝙸𝙼𝙰𝙳𝙾`'
        await tokito.sendMessage(from, {
          text: titulo + '\n\n' +
            '> 🎬 ׄ ( ᴇɴᴄᴏɴᴛʀᴇɪ ' + quantidade + ' ᴀɴɪᴍᴀᴄ̧ᴏ̃ᴇs! )\n' +
            '> 📤 ׄ ( ᴠᴏᴜ ᴇɴᴠɪᴀʀ ᴜᴍᴀ ᴘᴏʀ ᴜᴍᴀ ᴘʀᴀ ᴠᴏᴄᴇ̂. )',
          contextInfo: contexto
        }, { quoted: selo })

        let enviados = 0
        let falhas = 0

        for (let i = 0; i < quantidade; i++) {
          const item = animacoes[i]
          try {
            let arquivo
            try {
              arquivo = await scraper.baixar(item.download)
            } catch (erroDownload) {
              // O link de cada MP4 é temporário. Se expirar durante o envio,
              // consulta uma única vez o mesmo TikTok e tenta o slide novamente.
              if (!/expirou|status code 410|status code 404/i.test(String(erroDownload?.message || ''))) {
                throw erroDownload
              }
              const novaConsulta = await scraper.consultar(link)
              const novoItem = novaConsulta.animacoes?.[i]
              if (!novoItem?.download) throw erroDownload
              arquivo = await scraper.baixar(novoItem.download)
            }
            // GIF no WhatsApp é enviado como MP4 com gifPlayback: true.
            await tokito.sendMessage(from, {
              video: arquivo,
              mimetype: 'video/mp4',
              gifPlayback: true,
              caption: titulo + '\n\n' +
                '> 🎬 ׄ ( ᴀɴɪᴍᴀᴄ̧ᴀ̃ᴏ ' + (i + 1) + '/' + quantidade + ' )' +
                (item.duracao ? '\n> ⏱️ ׄ ( ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + item.duracao + ' )' : ''),
              contextInfo: contexto
            }, { quoted: selo })
            enviados++
          } catch (erroItem) {
            falhas++
            console.log(
              '[TIKTOK GIF ' + (i + 1) + '/' + quantidade + ']',
              modulos.sanitizarErro(erroItem, [API_KEY_TOKITO])
            )
          }
          if (i + 1 < quantidade) await esperar(PAUSA_ENTRE_GIFS)
        }

        if (!enviados) {
          await reagir(from, '❌').catch(() => {})
          return reply('- ❌ `𝙵𝙰𝙻𝙷𝙰 𝙽𝙾 𝚃𝙸𝙺𝚃𝙾𝙺 𝙰𝙽𝙸𝙼𝙰𝙳𝙾`\n\n' +
            '> ⚠️ ׄ ( ɴᴀ̃ᴏ ᴄᴏɴsᴇɢᴜɪ ᴇɴᴠɪᴀʀ ɴᴇɴʜᴜᴍᴀ ᴀɴɪᴍᴀᴄ̧ᴀ̃ᴏ. ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. )')
        }

        await reagir(from, '✅').catch(() => {})
        if (falhas) {
          await reply(titulo + '\n\n' +
            '> ✅ ׄ ( ᴇɴᴠɪᴀᴅᴏs: ' + enviados + '/' + quantidade + ' )\n' +
            '> ❌ ׄ ( ɴᴀ̃ᴏ ᴇɴᴠɪᴀᴅᴏs: ' + falhas + ' )')
        }
      } catch (erro) {
        console.log('[TIKTOK GIF]', modulos.sanitizarErro(erro, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        if (erro?.response?.status === 404) {
          return reply('- 🎞️ `𝚃𝙸𝙺𝚃𝙾𝙺 𝙰𝙽𝙸𝙼𝙰𝙳𝙾`\n\n' +
            '> ⚠️ ׄ ( ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ᴀɴɪᴍᴀᴄ̧ᴏ̃ᴇs ɴᴇssᴇ ʟɪɴᴋ. )')
        }
        if (/link (do TikTok )?inválido|Informe um link/i.test(String(erro?.message || ''))) {
          return reply(mess.downloadUso({
            tipo: 'LINK TIKTOK', prefix, command,
            exemplo: 'https://vt.tiktok.com/ZSpkAcKeo'
          }))
        }
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
