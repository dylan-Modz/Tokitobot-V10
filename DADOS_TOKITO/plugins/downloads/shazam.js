/*
 * ============================================================
 *                         TOKITO BOT V10
 * ============================================================
 *  Arquivo: shazam.js
 *  Função : Identificar música através de áudio ou vídeo
 *  Dev    : Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

const nomeSeguro = valor => String(valor || 'musica')
  .replace(/[\\/:*?"<>|]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 100) || 'musica'

const comTimeout = (promessa, tempo, mensagem) => {
  let timer = null

  const limite = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(mensagem)), tempo)
  })

  return Promise.race([promessa, limite])
    .finally(() => {
      if (timer) clearTimeout(timer)
    })
}

dylan.setCommand({
  nome: 'shazam',
  comandos: ['shazam'],
  categoria: 'downloads',

  info: {
    descricao: 'Identifica uma música respondendo a um áudio, voz ou vídeo.',
    uso: 'shazam (responder áudio ou vídeo)',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      const midias = modulos.mediaAtual(ctx)
      const alvo = midias?.audio
        ? { tipo: 'audio', midia: midias.audio }
        : midias?.video
          ? { tipo: 'video', midia: midias.video }
          : null

      if (!alvo) {
        return reply(mess.shazamUso(prefix))
      }

      await reagir(from, '🎛️').catch(() => {})
      await reply(mess.shazamAnalisando())

      let musica

      try {
        musica = await modulos.identificarMusica(ctx, alvo)
      }
      catch (error) {
        await reagir(from, '❌').catch(() => {})

        if (error?.code === 'SHAZAM_SEM_MIDIA') {
          return reply(mess.shazamUso(prefix))
        }

        if (error?.code === 'SHAZAM_ARQUIVO_GRANDE') {
          return reply(
            mess.shazamErro(
              'A mídia ultrapassa 10 MB. Responda um trecho menor da música.'
            )
          )
        }

        if (
          error?.code === 'SHAZAM_TIMEOUT_DOWNLOAD' ||
          error?.code === 'SHAZAM_TIMEOUT_RECONHECER'
        ) {
          return reply(
            mess.shazamErro(
              'A análise demorou demais e foi cancelada. Tente um áudio ou vídeo menor.'
            )
          )
        }

        if (error?.code === 'SHAZAM_DOWNLOAD') {
          return reply(
            mess.shazamErro(
              'Não consegui baixar a mídia respondida. Tente reenviar um trecho menor.'
            )
          )
        }

        if (error?.code === 'SHAZAM_LIMITE') {
          return reply(
            mess.shazamErro(
              'Limite temporário do identificador. Tente novamente em instantes.'
            )
          )
        }

        if (error?.code === 'SHAZAM_SERVICO') {
          console.log(
            '[SHAZAM SERVIÇO]',
            modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
          )

          return reply(
            mess.shazamErro(
              'O serviço de reconhecimento não respondeu corretamente. Tente novamente.'
            )
          )
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

      // Primeiro entrega o resultado. Assim uma falha posterior no MP3
      // nunca prende nem apaga o reconhecimento já concluído.
      await reply(mess.shazamResultado(musica, prefix))
      await reagir(from, '✅').catch(() => {})

      let audioInfo = null

      try {
        audioInfo = await modulos.buscarAudioShazam(ctx, musica)
      }
      catch (error) {
        console.log(
          '[SHAZAM AUDIO]',
          modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
        )

        await reply(
          mess.shazamErro(
            'A música foi identificada, mas o MP3 não ficou disponível agora.'
          )
        )

        return true
      }

      if (!audioInfo?.url) {
        return true
      }

      const arquivo = nomeSeguro(
        `${audioInfo.titulo || musica.titulo} - ${audioInfo.artista || musica.artista}`
      )

      try {
        await comTimeout(
          tokito.sendMessage(
            from,
            {
              audio: { url: audioInfo.url },
              mimetype: 'audio/mpeg',
              ptt: false,
              fileName: `${arquivo}.mp3`
            },
            { quoted: selo }
          ),
          60000,
          'Tempo esgotado ao enviar o MP3.'
        )
      }
      catch (error) {
        console.log(
          '[SHAZAM ENVIO]',
          modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
        )

        await reply(
          mess.shazamErro(
            'A música foi identificada, mas não consegui enviar o MP3.'
          )
        )
      }

      return true
    }
  }
})
