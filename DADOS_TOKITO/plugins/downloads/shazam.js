/*
 * ============================================================
 *                         TOKITO BOT V10
 * ============================================================
 *  Arquivo: shazam.js
 *  Função : Identificar música através de áudio
 *  Dev    : Dylan Modz
 * ============================================================
 */

const nomeSeguro = valor => String(valor || 'musica')
  .replace(/[\\/:*?"<>|]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 100) || 'musica'

module.exports = {
  nome: 'shazam',
  comandos: ['shazam'],
  categoria: 'downloads',

  info: {
    descricao: 'Identifica uma música através de um áudio e tenta enviar o MP3.',
    uso: 'shazam (marcar áudio)',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      const audio = modulos.audioAtual(ctx)

      if (!audio) {
        return reply(mess.shazamUso(prefix))
      }

      await reagir(from, '🎛️').catch(() => {})
      await reply(mess.shazamAnalisando())

      let musica

      try {
        musica = await modulos.identificarMusica(ctx, audio)
      }
      catch (error) {
        await reagir(from, '❌').catch(() => {})

        if (error?.code === 'SHAZAM_ARQUIVO_GRANDE') {
          return reply(mess.shazamMidiaGrande())
        }

        if (error?.code === 'SHAZAM_LIMITE') {
          return reply(mess.shazamErro('Limite temporário do identificador. Tente novamente em instantes.'))
        }

        console.log(
          '[SHAZAM]',
          modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
        )

        return reply(mess.shazamErro())
      }

      if (!musica?.matched) {
        await reagir(from, '❌').catch(() => {})
        return reply(mess.shazamNaoEncontrada())
      }

      const texto = mess.shazamResultado(musica)
      const contexto = typeof canalInfo === 'function'
        ? canalInfo([sender])
        : { mentionedJid: [sender] }

      if (musica.capa) {
        try {
          await tokito.sendMessage(
            from,
            {
              image: { url: musica.capa },
              caption: texto,
              contextInfo: contexto
            },
            { quoted: selo }
          )
        }
        catch {
          await tokito.sendMessage(
            from,
            {
              text: texto,
              contextInfo: contexto
            },
            { quoted: selo }
          )
        }
      }
      else {
        await tokito.sendMessage(
          from,
          {
            text: texto,
            contextInfo: contexto
          },
          { quoted: selo }
        )
      }

      if (musica.audioUrl) {
        const arquivo = nomeSeguro(`${musica.titulo} - ${musica.artista}`)

        try {
          await tokito.sendMessage(
            from,
            {
              audio: { url: musica.audioUrl },
              mimetype: 'audio/mpeg',
              ptt: false,
              fileName: `${arquivo}.mp3`,
              contextInfo: contexto
            },
            { quoted: selo }
          )
        }
        catch (error) {
          console.log(
            '[SHAZAM AUDIO]',
            modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
          )

          await reply(mess.shazamErro('A música foi reconhecida, mas não consegui enviar o áudio.'))
        }
      }

      await reagir(from, '✅').catch(() => {})
      return true
    }
  }
}
