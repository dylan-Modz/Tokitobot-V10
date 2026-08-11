const h = require('./_base')

const session = ctx => String(ctx.q || '').trim()

const dadosUsuario = ctx => ({
  NomeDoBot: ctx.NomeDoBot,
  pushname: ctx.pushname || 'Usuário'
})

module.exports = {
  nome: 'criarsala',
  comandos: ['criarsala', 'versala', 'jogadoressala', 'expulsarsala', 'iniciarsala', 'pararsala', 'statussalas'],
  categoria: 'freefire',
  info: {
    descricao: 'Cria e controla salas de Free Fire pela Tokito API.',
    uso: 'criarsala NOME|SENHA|JOGADORES|MODO|REGIÃO',
    categoria: 'freefire'
  },
  async executar(ctx) {
    const token = h.tokenSala(ctx)
    const base = `${ctx.API_URL}/api/salas`
    try {
      if (ctx.command === 'criarsala') {
        await ctx.reagir(ctx.from, '🎮')
        if (!ctx.q || !String(ctx.q).includes('|'))
          return ctx.reply(ctx.mess.ffSalaUso(ctx.prefix))
        const partes = String(ctx.q).split('|').map(v => v.trim())
        const roomName = partes[0]
        const roomPassword = partes[1]
        const maxPlayers = partes[2] || 12
        const mode = partes[3] || 1
        const region = partes[4] || 'BR'
        if (!roomName || !roomPassword)
          return ctx.reply(ctx.mess.ffErro('Informe o nome e a senha da sala.'))
        const { data } = await ctx.axios.get(`${base}/criar`, {
          params: {
            apikey: token,
            roomName,
            roomPassword,
            maxPlayers,
            mode,
            region
          },
          timeout: 60000
        })
        if (!data?.success || !data?.room)
          return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
        const sala = data.room
        const texto = ctx.mess.ffSalaCriada({
          ...dadosUsuario(ctx),
          sala,
          roomName,
          roomPassword,
          maxPlayers,
          mode,
          region,
          data
        })
        const sessionId = sala.sessionId || data.sessionId
        await ctx.reagir(ctx.from, '✅')
        return h.enviar(ctx, texto, h.botoesSala(ctx, sessionId), [ctx.sender])
      }
      if (ctx.command === 'versala') {
        await ctx.reagir(ctx.from, '🔎')
        const sessionId = session(ctx)
        if (!sessionId)
          return ctx.reply(ctx.mess.ffVerSalaUso(ctx.prefix))
        const { data } = await ctx.axios.get(`${base}/info`, {
          params: {
            apikey: token,
            sessionId
          },
          timeout: 60000
        })
        if (!data?.success || !data?.room)
          return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
        const sala = data.room
        const segundos = Number(sala.autoStart?.remainingSeconds || 0)
        const tempo = segundos > 0 ? `${Math.floor(segundos / 60)}m ${segundos % 60}s` : 'Iniciada'
        const texto = ctx.mess.ffSalaInfo({
          ...dadosUsuario(ctx),
          sala,
          tempo
        })
        await ctx.reagir(ctx.from, '✅')
        return h.enviar(ctx, texto, h.botoesSala(ctx, sessionId, ['jogadores', 'iniciar', 'parar']), [ctx.sender])
      }
      if (ctx.command === 'jogadoressala') {
        await ctx.reagir(ctx.from, '👥')
        const sessionId = session(ctx)
        if (!sessionId)
          return ctx.reply(ctx.mess.ffJogadoresUso(ctx.prefix))
        const { data } = await ctx.axios.get(`${base}/jogadores`, {
          params: {
            apikey: token,
            sessionId
          },
          timeout: 60000
        })
        if (!data?.success || !Array.isArray(data?.players))
          return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
        const texto = ctx.mess.ffJogadores({
          ...dadosUsuario(ctx),
          players: data.players,
          total: data.total
        })
        await ctx.reagir(ctx.from, '✅')
        return h.enviar(ctx, texto, h.botoesSala(ctx, sessionId, ['ver', 'iniciar', 'parar']), [ctx.sender])
      }
      if (ctx.command === 'expulsarsala') {
        await ctx.reagir(ctx.from, '🚫')
        if (!ctx.q || !String(ctx.q).includes('|'))
          return ctx.reply(ctx.mess.ffExpulsarUso(ctx.prefix))
        const [sessionId, targetUid] = String(ctx.q).split('|').map(v => v.trim())
        if (!sessionId || !targetUid)
          return ctx.reply(ctx.mess.ffErro('Informe o sessionId e o UID do jogador.'))
        const { data } = await ctx.axios.get(`${base}/expulsar`, {
          params: {
            apikey: token,
            sessionId,
            targetUid
          },
          timeout: 60000
        })
        if (!data?.success)
          return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
        await ctx.reagir(ctx.from, '✅')
        const texto = ctx.mess.ffExpulso({
          ...dadosUsuario(ctx),
          targetUid,
          message: data.message
        })
        return h.enviar(ctx, texto, h.botoesSala(ctx, sessionId, ['jogadores', 'ver']), [ctx.sender])
      }
      if (ctx.command === 'iniciarsala') {
        await ctx.reagir(ctx.from, '🚀')
        const sessionId = session(ctx)
        if (!sessionId)
          return ctx.reply(ctx.mess.ffIniciarUso(ctx.prefix))
        const { data } = await ctx.axios.get(`${base}/iniciar`, {
          params: {
            apikey: token,
            sessionId
          },
          timeout: 60000
        })
        if (!data?.success)
          return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
        await ctx.reagir(ctx.from, '✅')
        const texto = ctx.mess.ffSalaIniciada({
          ...dadosUsuario(ctx),
          sessionId,
          message: data.message
        })
        return h.enviar(ctx, texto, h.botoesSala(ctx, sessionId, ['ver', 'jogadores', 'parar']), [ctx.sender])
      }
      if (ctx.command === 'pararsala') {
        await ctx.reagir(ctx.from, '⛔')
        const sessionId = session(ctx)
        if (!sessionId)
          return ctx.reply(ctx.mess.ffPararUso(ctx.prefix))
        const { data } = await ctx.axios.get(`${base}/parar`, {
          params: {
            apikey: token,
            sessionId
          },
          timeout: 60000
        })
        if (!data?.success)
          return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
        await ctx.reagir(ctx.from, '✅')
        const texto = ctx.mess.ffSalaParada({
          ...dadosUsuario(ctx),
          sessionId,
          message: data.message
        })
        return h.enviar(ctx, texto, h.botoesSala(ctx, sessionId, ['ver', 'jogadores']), [ctx.sender])
      }
      if (ctx.command === 'statussalas') {
        await ctx.reagir(ctx.from, '📊')
        const { data } = await ctx.axios.get(`${base}/status`, {
          params: { apikey: token },
          timeout: 60000
        })
        if (!data?.success)
          return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
        await ctx.reagir(ctx.from, '✅')
        return ctx.reply(ctx.mess.ffStatusApi({
          ...dadosUsuario(ctx),
          data
        }), [ctx.sender])
      }
    }
    catch (error) {
      console.log('[FREE FIRE SALAS]', ctx.modulos.sanitizarErro(error, [ctx.API_KEY_TOKITO]))
      await ctx.reagir(ctx.from, '❌').catch(() => {
      })
      return ctx.reply(ctx.mess.erroApi(ctx.API_URL))
    }
  }
}
