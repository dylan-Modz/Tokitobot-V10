/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const scraper = require('../../scrapers/downloads/tiktoksearch')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'tiktoksearch',
  comandos: ['tiktoksearch'],
  categoria: 'downloads',
  info: {
    descricao: 'Pesquisa e envia um vídeo do TikTok.',
    uso: 'tiktoksearch',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        if (!q || !q.trim()) {
          return reply(mess.downloadUso({ tipo: 'VÍDEO', prefix, command, exemplo: 'edit tokito' }))
        }

        await reagir(from, '🔎')
        await reply(mess.wait())

        const dados = await scraper.buscar(q.trim())
        const lista = itens(dados)

        if (!lista.length) {
          await reagir(from, '❌')
          return reply(mess.downloadNaoEncontrado('VÍDEO'))
        }

        // Seleciona um único vídeo válido por pesquisa, sem enviar a lista inteira.
        const disponiveis = lista.filter(item =>
          achar(item?.video_sem_marca, item?.video, item?.download, item?.url, item?.data)
        )

        if (!disponiveis.length) {
          await reagir(from, '❌')
          return reply(mess.downloadSemMidia('VÍDEO'))
        }

        const item = disponiveis[Math.floor(Math.random() * disponiveis.length)]
        const link = achar(item?.video_sem_marca, item?.video, item?.download, item?.url, item?.data)
        const autor = item?.autor || item?.author || {}
        const musica = item?.musica_info || item?.music_info || {}
        const stats = item?.stats || {}

        const limpar = valor => String(valor ?? '').replace(/\s+/g, ' ').trim()
        const resumir = (valor, limite = 180) => {
          const texto = limpar(valor)
          return texto.length > limite ? texto.slice(0, limite - 3) + '...' : texto
        }
        const linha = (icone, rotulo, valor) => {
          const texto = limpar(valor)
          return texto ? '> ' + icone + ' ' + rotulo + ': ' + texto : null
        }

        const titulo = resumir(item?.titulo || item?.title || q.trim(), 180)
        const nomeAutor = resumir(
          autor?.nome || autor?.fullname || autor?.name || autor?.nickname || 'Desconhecido', 70
        )
        const usuario = resumir(autor?.usuario || autor?.username || autor?.unique_id || autor?.nickname, 50)
        const tituloMusica = resumir(item?.musica || musica?.titulo || musica?.title, 80)

        // Mesma identidade visual usada no comando Play do Tokito Bot V10.
        const legenda = [
          '• `𝚅𝙸́𝙳𝙴𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾` 🎬',
          '> ℹ️ `𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂`',
          linha('✏️', 'ᴛɪ́ᴛᴜʟᴏ', titulo),
          linha('⏱️', 'ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ', item?.duracao || item?.duration),
          linha('👥', 'ᴠɪᴇᴡs', item?.visualizacoes ?? stats?.views),
          linha('❤️', 'ᴄᴜʀᴛɪᴅᴀs', item?.curtidas ?? stats?.likes),
          linha('💬', 'ᴄᴏᴍᴇɴᴛᴀ́ʀɪᴏs', item?.comentarios ?? stats?.comment),
          linha('🔁', 'ᴄᴏᴍᴘᴀʀᴛɪʟʜᴀᴍᴇɴᴛᴏs', item?.compartilhamentos ?? stats?.share),
          linha('📥', 'ᴅᴏᴡɴʟᴏᴀᴅs', item?.downloads ?? stats?.download),
          linha('👨‍🎤', 'ᴀᴜᴛᴏʀ', nomeAutor),
          usuario ? linha('🆔', 'ᴜsᴜᴀ́ʀɪᴏ', '@' + usuario.replace(/^@/, '')) : null,
          linha('🎵', 'ᴍᴜ́sɪᴄᴀ', tituloMusica),
          linha('📅', 'ᴘᴜʙʟɪᴄᴀᴅᴏ', item?.data_publicacao || item?.taken_at),
          linha('🌎', 'ʀᴇɢɪᴀ̃ᴏ', item?.regiao || item?.region)
        ].filter(Boolean).join('\n')

        await tokito.sendMessage(from, {
          video: { url: link },
          mimetype: 'video/mp4',
          caption: legenda,
          contextInfo: {
            ...newsletter,
            mentionedJid: [sender]
          }
        }, { quoted: selo })

        await reagir(from, '✅')
      } catch (e) {
        console.log('[TIKTOK SEARCH]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
