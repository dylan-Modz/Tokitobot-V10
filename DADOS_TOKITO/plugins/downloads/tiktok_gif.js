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
        await reply(mess.wait())

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

        // Primeiro mostra o total; depois envia um GIF por vez, em ordem.
        await tokito.sendMessage(from, {
          text:
            '╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡\n' +
            '┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓\n' +
            '├╾═╼･ﾟ𖤐ﾟ･｡🎞️｡･ﾟ𖤐ﾟ･╾═╼┤\n' +
            '├─ ⊹ 𖤐  𝚃𝙸𝙺𝚃𝙾𝙺-𝙶𝙸𝙵\n' +
            '├╾═╼･ﾟ𖤐ﾟ･｡📥｡･ﾟ𖤐ﾟ･╾═╼┤\n' +
            '┃࣪ ╎—̳͟͞͞ 🎬 𝙰𝙽𝙸𝙼𝙰𝙲̧𝙾̃𝙴𝚂: ' + quantidade + '\n' +
            '┃࣪ ╎—̳͟͞͞ 📲 𝙵𝙾𝚁𝙼𝙰𝚃𝙾: 𝙶𝙸𝙵\n' +
            '┃࣪ ╎—̳͟͞͞ ⏳ 𝙴𝙽𝚅𝙸𝙰𝙽𝙳𝙾 𝚄𝙼 𝙿𝙾𝚁 𝚄𝙼\n' +
            '┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛\n' +
            '╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡',
          contextInfo: contexto
        }, { quoted: selo })

        let enviados = 0
        let falhas = 0

        for (let i = 0; i < quantidade; i++) {
          const item = animacoes[i]
          try {
            const arquivo = await scraper.baixar(item.download)
            // GIF no WhatsApp é enviado como MP4 com gifPlayback: true.
            await tokito.sendMessage(from, {
              video: arquivo,
              mimetype: 'video/mp4',
              gifPlayback: true,
              caption:
                '🎞️ *𝚃𝙸𝙺𝚃𝙾𝙺 𝙶𝙸𝙵*  ' + (i + 1) + '/' + quantidade +
                (item.duracao ? '\n⏱️ *𝙳𝚄𝚁𝙰𝙲̧𝙰̃𝙾:* ' + item.duracao : ''),
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
          return reply('❌ Não foi possível enviar nenhum GIF. Os links podem ter expirado; tente o comando novamente.')
        }

        await reagir(from, '✅').catch(() => {})
        if (falhas) {
          await reply('🎞️ *𝚃𝙸𝙺𝚃𝙾𝙺-𝙶𝙸𝙵*\n\n' +
            '✅ Enviados: *' + enviados + '/' + quantidade + '*\n' +
            '❌ Não enviados: *' + falhas + '*')
        }
      } catch (erro) {
        console.log('[TIKTOK GIF]', modulos.sanitizarErro(erro, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        if (erro?.response?.status === 404) {
          return reply(mess.downloadNaoEncontrado('GIFS ANIMADOS'))
        }
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
