/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Playlist / Rádio automático.
 * Dev: Dylan Modz
 * ============================================================
 */

const playlist = require('../../sistemas/playlist')
const dylan = require('../../database/lib/comandos')

const separar = valor => String(valor || '')
  .split('|')
  .map(item => item.trim())

const tirarPrimeiraPalavra = valor => {
  const texto = String(valor || '').trim()
  const espaco = texto.indexOf(' ')

  if (espaco < 0)
    return ''

  return texto.slice(espaco + 1).trim()
}

const primeiraPalavra = valor => String(valor || '')
  .trim()
  .split(/\s+/)[0]
  .toLowerCase()

const referenciaPlaylist = valor => {
  const texto = String(valor || '').trim()

  if (/^global:/i.test(texto)) {
    return {
      global: true,
      nome: texto.replace(/^global:/i, '').trim()
    }
  }

  return {
    global: false,
    nome: texto
  }
}

const enviarComCapa = async (ctx, capa, legenda) => {
  const thumbnail = String(capa || '').trim()

  if (thumbnail) {
    try {
      return await ctx.tokito.sendMessage(
        ctx.from,
        {
          image: { url: thumbnail },
          caption: legenda
        }
      )
    }
    catch {}
  }

  return ctx.reply(legenda)
}

const responderDetalhes = async (ctx, item, global = false) => {
  const musicas = Array.isArray(item?.musicas) ? item.musicas : []
  const capa = musicas.find(musica => musica?.thumbnail)?.thumbnail || ''
  const legenda = ctx.mess.playlistDetalhes(item, global)

  return enviarComCapa(ctx, capa, legenda)
}

const responderStatus = async ctx => {
  const atual = playlist.status(ctx.from)

  if (!atual)
    return ctx.reply(ctx.mess.playlistSemSessao())

  return enviarComCapa(
    ctx,
    atual.atual?.thumbnail,
    ctx.mess.playlistStatus(atual)
  )
}

const podeControlar = ctx => playlist.podeControlar(
  ctx.from,
  ctx.sender,
  ctx.isGroupAdmins,
  ctx.SoDono
)

const sessaoBloqueadaPorOutro = ctx => {
  const atual = playlist.sessao(ctx.from)

  if (!atual)
    return false

  return !playlist.podeControlar(
    ctx.from,
    ctx.sender,
    ctx.isGroupAdmins,
    ctx.SoDono
  )
}

const tocarSalva = async (ctx, nomeRaw, forcarGlobal = false) => {
  const ref = referenciaPlaylist(nomeRaw)
  const global = Boolean(forcarGlobal || ref.global)
  const nome = ref.nome

  if (!nome)
    return ctx.reply(ctx.mess.playlistTocarUso(ctx.prefix))

  if (sessaoBloqueadaPorOutro(ctx))
    return ctx.reply(ctx.mess.playlistSemControle())

  const salva = playlist.obter(
    ctx.sender,
    nome,
    global
  )

  if (!salva)
    return ctx.reply(ctx.mess.playlistNaoExiste(nome, global))

  if (!Array.isArray(salva.musicas) || !salva.musicas.length)
    return ctx.reply(ctx.mess.playlistVazia(salva.nome))

  await playlist.iniciar({
    chatId: ctx.from,
    ownerId: ctx.sender,
    playlist: salva,
    tokito: ctx.tokito,
    apiUrl: ctx.API_URL,
    apiKey: ctx.API_KEY_TOKITO
  })

  return true
}

const executarControle = async (ctx, acao) => {
  const atual = playlist.status(ctx.from)

  if (!atual)
    return ctx.reply(ctx.mess.playlistSemSessao())

  if (!podeControlar(ctx))
    return ctx.reply(ctx.mess.playlistSemControle())

  if (acao === 'parar') {
    playlist.parar(ctx.from)
    return ctx.reply(ctx.mess.playlistParada())
  }

  if (acao === 'pausar' || acao === 'pausa') {
    if (!playlist.pausar(ctx.from))
      return ctx.reply(ctx.mess.playlistJaPausada())

    return ctx.reply(ctx.mess.playlistPausada())
  }

  if (acao === 'continuar' || acao === 'resume') {
    if (!playlist.continuar(ctx.from))
      return ctx.reply(ctx.mess.playlistNaoPausada())

    return ctx.reply(ctx.mess.playlistContinuada())
  }

  if (acao === 'proxima' || acao === 'next') {
    const resultado = await playlist.proxima(ctx.from)

    if (!resultado.ok) {
      if (resultado.motivo === 'fim-party')
        return ctx.reply(ctx.mess.partySemProximas())

      return ctx.reply(ctx.mess.playlistFimDaFila())
    }

    return ctx.reply(ctx.mess.playlistPulou('PRÓXIMA', resultado.status))
  }

  if (acao === 'anterior' || acao === 'prev') {
    const resultado = await playlist.anterior(ctx.from)

    if (!resultado.ok)
      return ctx.reply(ctx.mess.playlistInicioDaFila())

    return ctx.reply(ctx.mess.playlistPulou('ANTERIOR', resultado.status))
  }

  if (acao === 'loop') {
    const estado = playlist.alternarLoop(ctx.from)

    if (estado === null)
      return ctx.reply(ctx.mess.playlistLoopParty())

    return ctx.reply(ctx.mess.playlistLoop(estado))
  }

  if (acao === 'aleatorio' || acao === 'shuffle') {
    const estado = playlist.alternarAleatorio(ctx.from)

    if (estado === null)
      return ctx.reply(ctx.mess.playlistAleatorioParty())

    return ctx.reply(ctx.mess.playlistAleatorio(estado))
  }

  if (acao === 'status')
    return responderStatus(ctx)

  return false
}

const executarParty = async (ctx, restante) => {
  if (!ctx.isGroup)
    return ctx.reply(ctx.mess.sogrupo())

  const sub = primeiraPalavra(restante)
  const depois = tirarPrimeiraPalavra(restante)

  if (!sub || sub === 'ajuda' || sub === 'help')
    return ctx.reply(ctx.mess.partyAjuda(ctx.prefix))

  if (sub === 'iniciar' || sub === 'start') {
    if (sessaoBloqueadaPorOutro(ctx))
      return ctx.reply(ctx.mess.playlistSemControle())

    playlist.iniciarParty({
      chatId: ctx.from,
      ownerId: ctx.sender,
      tokito: ctx.tokito,
      apiUrl: ctx.API_URL,
      apiKey: ctx.API_KEY_TOKITO
    })

    return ctx.reply(ctx.mess.partyIniciada(ctx.prefix))
  }

  if (sub === 'add' || sub === 'adicionar') {
    const atual = playlist.status(ctx.from)

    if (!atual || atual.mode !== 'party')
      return ctx.reply(ctx.mess.partyInativa(ctx.prefix))

    if (!depois)
      return ctx.reply(ctx.mess.partyAddUso(ctx.prefix))

    try {
      const faixa = await playlist.buscarFaixa({
        entrada: depois,
        apiUrl: ctx.API_URL,
        apiKey: ctx.API_KEY_TOKITO
      })

      const resultado = await playlist.adicionarParty(
        ctx.from,
        faixa
      )

      if (!resultado.ok)
        return ctx.reply(ctx.mess.playlistErro('Não consegui adicionar essa música à fila Party.'))

      return ctx.reply(
        ctx.mess.partyAdicionada(
          resultado.faixa,
          resultado.total,
          ctx.sender
        )
      )
    }
    catch (error) {
      return ctx.reply(
        ctx.mess.playlistErro(
          error?.message || 'Não consegui localizar essa música.'
        )
      )
    }
  }

  if (sub === 'fila' || sub === 'queue' || sub === 'status') {
    const fila = playlist.filaParty(ctx.from)

    if (!fila)
      return ctx.reply(ctx.mess.partyInativa(ctx.prefix))

    return ctx.reply(ctx.mess.partyFila(fila))
  }

  if (sub === 'proxima' || sub === 'next')
    return executarControle(ctx, 'proxima')

  if (sub === 'pausar' || sub === 'pausa')
    return executarControle(ctx, 'pausar')

  if (sub === 'continuar' || sub === 'resume')
    return executarControle(ctx, 'continuar')

  if (sub === 'parar' || sub === 'stop')
    return executarControle(ctx, 'parar')

  return ctx.reply(ctx.mess.partyAjuda(ctx.prefix))
}

const executarGlobal = async (ctx, restante) => {
  const sub = primeiraPalavra(restante)
  const depois = tirarPrimeiraPalavra(restante)

  if (!sub || sub === 'ajuda' || sub === 'help')
    return ctx.reply(ctx.mess.playlistGlobalAjuda(ctx.prefix, ctx.SoDono))

  if (sub === 'listar' || sub === 'lista') {
    const lista = playlist.listar(ctx.sender, true)
    return ctx.reply(ctx.mess.playlistLista(lista, true))
  }

  if (sub === 'ver') {
    if (!depois)
      return ctx.reply(ctx.mess.playlistVerUso(ctx.prefix, true))

    const item = playlist.obter(ctx.sender, depois, true)

    if (!item)
      return ctx.reply(ctx.mess.playlistNaoExiste(depois, true))

    return responderDetalhes(ctx, item, true)
  }

  if (sub === 'tocar' || sub === 'play')
    return tocarSalva(ctx, depois, true)

  if (!ctx.SoDono)
    return ctx.reply(ctx.mess.onlyOwner())

  if (sub === 'criar') {
    if (!depois)
      return ctx.reply(ctx.mess.playlistCriarUso(ctx.prefix, true))

    const resultado = playlist.criar(ctx.sender, depois, true)

    if (!resultado.ok) {
      if (resultado.motivo === 'existe')
        return ctx.reply(ctx.mess.playlistExiste(depois, true))

      if (resultado.motivo === 'limite')
        return ctx.reply(ctx.mess.playlistLimite(resultado.limite, true))

      return ctx.reply(ctx.mess.playlistErro('Nome de playlist inválido.'))
    }

    return ctx.reply(ctx.mess.playlistCriada(resultado.playlist, true))
  }

  if (sub === 'add' || sub === 'adicionar') {
    const [nome, busca] = separar(depois)

    if (!nome || !busca)
      return ctx.reply(ctx.mess.playlistAddUso(ctx.prefix, true))

    if (!playlist.obter(ctx.sender, nome, true))
      return ctx.reply(ctx.mess.playlistNaoExiste(nome, true))

    try {
      const faixa = await playlist.buscarFaixa({
        entrada: busca,
        apiUrl: ctx.API_URL,
        apiKey: ctx.API_KEY_TOKITO
      })

      const resultado = playlist.adicionarFaixa(
        ctx.sender,
        nome,
        faixa,
        true
      )

      if (!resultado.ok && resultado.motivo === 'duplicada')
        return ctx.reply(ctx.mess.playlistFaixaDuplicada(faixa.titulo))

      if (!resultado.ok && resultado.motivo === 'limite')
        return ctx.reply(ctx.mess.playlistLimiteFaixas(resultado.limite))

      if (!resultado.ok)
        return ctx.reply(ctx.mess.playlistErro('Não consegui adicionar a música.'))

      return ctx.reply(
        ctx.mess.playlistFaixaAdicionada(
          resultado.playlist.nome,
          resultado.faixa,
          resultado.total,
          true
        )
      )
    }
    catch (error) {
      return ctx.reply(ctx.mess.playlistErro(error?.message || 'Falha na busca da música.'))
    }
  }

  if (sub === 'importar') {
    const [nome, link] = separar(depois)

    if (!nome || !link)
      return ctx.reply(ctx.mess.playlistImportarUso(ctx.prefix, true))

    if (!playlist.obter(ctx.sender, nome, true))
      return ctx.reply(ctx.mess.playlistNaoExiste(nome, true))

    try {
      const importada = await playlist.importarYoutube(link)
      const resultado = playlist.adicionarVarias(
        ctx.sender,
        nome,
        importada.faixas,
        true
      )

      return ctx.reply(
        ctx.mess.playlistImportada(
          nome,
          importada,
          resultado,
          true
        )
      )
    }
    catch (error) {
      return ctx.reply(ctx.mess.playlistErro(error?.message || 'Falha ao importar a playlist.'))
    }
  }

  if (sub === 'remover') {
    const [nome, indice] = separar(depois)

    if (!nome || !indice)
      return ctx.reply(ctx.mess.playlistRemoverUso(ctx.prefix, true))

    const resultado = playlist.removerFaixa(ctx.sender, nome, indice, true)

    if (!resultado.ok && resultado.motivo === 'nao')
      return ctx.reply(ctx.mess.playlistNaoExiste(nome, true))

    if (!resultado.ok)
      return ctx.reply(ctx.mess.playlistIndiceInvalido())

    return ctx.reply(
      ctx.mess.playlistFaixaRemovida(
        resultado.playlist.nome,
        resultado.faixa,
        resultado.total
      )
    )
  }

  if (sub === 'limpar') {
    if (!depois)
      return ctx.reply(ctx.mess.playlistLimparUso(ctx.prefix, true))

    const resultado = playlist.limparPlaylist(ctx.sender, depois, true)

    if (!resultado.ok)
      return ctx.reply(ctx.mess.playlistNaoExiste(depois, true))

    return ctx.reply(ctx.mess.playlistLimpa(resultado.playlist.nome, resultado.removidas))
  }

  if (sub === 'apagar' || sub === 'deletar') {
    if (!depois)
      return ctx.reply(ctx.mess.playlistApagarUso(ctx.prefix, true))

    const resultado = playlist.apagar(ctx.sender, depois, true)

    if (!resultado.ok)
      return ctx.reply(ctx.mess.playlistNaoExiste(depois, true))

    return ctx.reply(ctx.mess.playlistApagada(resultado.playlist.nome, true))
  }

  if (sub === 'renomear') {
    const [atual, novo] = separar(depois)

    if (!atual || !novo)
      return ctx.reply(ctx.mess.playlistRenomearUso(ctx.prefix, true))

    const resultado = playlist.renomear(ctx.sender, atual, novo, true)

    if (!resultado.ok && resultado.motivo === 'nao')
      return ctx.reply(ctx.mess.playlistNaoExiste(atual, true))

    if (!resultado.ok && resultado.motivo === 'existe')
      return ctx.reply(ctx.mess.playlistExiste(novo, true))

    if (!resultado.ok)
      return ctx.reply(ctx.mess.playlistErro('Não consegui renomear essa playlist.'))

    return ctx.reply(ctx.mess.playlistRenomeada(atual, resultado.playlist.nome, true))
  }

  return ctx.reply(ctx.mess.playlistGlobalAjuda(ctx.prefix, ctx.SoDono))
}

dylan.setCommand({
  nome: 'playlist',
  comandos: [
    'playlist',
    'playlists',
    'pl',
    'radio'
  ],
  categoria: 'downloads',

  info: {
    descricao: 'Cria playlists salvas e toca músicas automaticamente em sequência.',
    uso: 'playlist criar nome',
    categoria: 'downloads'
  },

  async executar(ctx) {
    const q = String(ctx.q || '').trim()
    const comando = String(ctx.command || '').toLowerCase()

    if (comando === 'radio') {
      const acaoRadio = primeiraPalavra(q)

      if ([
        'parar',
        'stop',
        'pausar',
        'pausa',
        'continuar',
        'resume',
        'proxima',
        'next',
        'anterior',
        'prev',
        'loop',
        'aleatorio',
        'shuffle',
        'status'
      ].includes(acaoRadio)) {
        return executarControle(ctx, acaoRadio)
      }

      if (!q)
        return ctx.reply(ctx.mess.playlistRadioUso(ctx.prefix))

      return tocarSalva(ctx, q)
    }

    const acao = primeiraPalavra(q)
    const restante = tirarPrimeiraPalavra(q)

    if (!acao || acao === 'ajuda' || acao === 'help')
      return ctx.reply(ctx.mess.playlistAjuda(ctx.prefix))

    if (acao === 'global')
      return executarGlobal(ctx, restante)

    if (acao === 'party')
      return executarParty(ctx, restante)

    if ([
      'config',
      'controle',
      'controles'
    ].includes(acao))
      return ctx.reply(ctx.mess.playlistConfigAjuda(ctx.prefix))

    if ([
      'editar',
      'gerenciar',
      'manage'
    ].includes(acao))
      return ctx.reply(ctx.mess.playlistEditarAjuda(ctx.prefix))

    if ([
      'parar',
      'stop',
      'pausar',
      'pausa',
      'continuar',
      'resume',
      'proxima',
      'next',
      'anterior',
      'prev',
      'loop',
      'aleatorio',
      'shuffle',
      'status'
    ].includes(acao)) {
      return executarControle(ctx, acao)
    }

    if (acao === 'listar' || acao === 'lista') {
      const lista = playlist.listar(ctx.sender, false)
      return ctx.reply(ctx.mess.playlistLista(lista, false))
    }

    if (acao === 'criar') {
      if (!restante)
        return ctx.reply(ctx.mess.playlistCriarUso(ctx.prefix, false))

      const resultado = playlist.criar(ctx.sender, restante, false)

      if (!resultado.ok) {
        if (resultado.motivo === 'existe')
          return ctx.reply(ctx.mess.playlistExiste(restante, false))

        if (resultado.motivo === 'limite')
          return ctx.reply(ctx.mess.playlistLimite(resultado.limite, false))

        return ctx.reply(ctx.mess.playlistErro('Nome de playlist inválido.'))
      }

      return ctx.reply(ctx.mess.playlistCriada(resultado.playlist, false))
    }

    if (acao === 'add' || acao === 'adicionar') {
      const [nome, busca] = separar(restante)

      if (!nome || !busca)
        return ctx.reply(ctx.mess.playlistAddUso(ctx.prefix, false))

      if (!playlist.obter(ctx.sender, nome, false))
        return ctx.reply(ctx.mess.playlistNaoExiste(nome, false))

      try {
        const faixa = await playlist.buscarFaixa({
          entrada: busca,
          apiUrl: ctx.API_URL,
          apiKey: ctx.API_KEY_TOKITO
        })

        const resultado = playlist.adicionarFaixa(
          ctx.sender,
          nome,
          faixa,
          false
        )

        if (!resultado.ok && resultado.motivo === 'duplicada')
          return ctx.reply(ctx.mess.playlistFaixaDuplicada(faixa.titulo))

        if (!resultado.ok && resultado.motivo === 'limite')
          return ctx.reply(ctx.mess.playlistLimiteFaixas(resultado.limite))

        if (!resultado.ok)
          return ctx.reply(ctx.mess.playlistErro('Não consegui adicionar a música.'))

        return ctx.reply(
          ctx.mess.playlistFaixaAdicionada(
            resultado.playlist.nome,
            resultado.faixa,
            resultado.total,
            false
          )
        )
      }
      catch (error) {
        return ctx.reply(ctx.mess.playlistErro(error?.message || 'Falha na busca da música.'))
      }
    }

    if (acao === 'importar') {
      const [nome, link] = separar(restante)

      if (!nome || !link)
        return ctx.reply(ctx.mess.playlistImportarUso(ctx.prefix, false))

      if (!playlist.obter(ctx.sender, nome, false))
        return ctx.reply(ctx.mess.playlistNaoExiste(nome, false))

      try {
        const importada = await playlist.importarYoutube(link)
        const resultado = playlist.adicionarVarias(
          ctx.sender,
          nome,
          importada.faixas,
          false
        )

        return ctx.reply(
          ctx.mess.playlistImportada(
            nome,
            importada,
            resultado,
            false
          )
        )
      }
      catch (error) {
        return ctx.reply(ctx.mess.playlistErro(error?.message || 'Falha ao importar a playlist.'))
      }
    }

    if (acao === 'ver') {
      if (!restante)
        return ctx.reply(ctx.mess.playlistVerUso(ctx.prefix, false))

      const ref = referenciaPlaylist(restante)
      const item = playlist.obter(ctx.sender, ref.nome, ref.global)

      if (!item)
        return ctx.reply(ctx.mess.playlistNaoExiste(ref.nome, ref.global))

      return responderDetalhes(ctx, item, ref.global)
    }

    if (acao === 'tocar' || acao === 'play')
      return tocarSalva(ctx, restante)

    if (acao === 'remover') {
      const [nome, indice] = separar(restante)

      if (!nome || !indice)
        return ctx.reply(ctx.mess.playlistRemoverUso(ctx.prefix, false))

      const resultado = playlist.removerFaixa(ctx.sender, nome, indice, false)

      if (!resultado.ok && resultado.motivo === 'nao')
        return ctx.reply(ctx.mess.playlistNaoExiste(nome, false))

      if (!resultado.ok)
        return ctx.reply(ctx.mess.playlistIndiceInvalido())

      return ctx.reply(
        ctx.mess.playlistFaixaRemovida(
          resultado.playlist.nome,
          resultado.faixa,
          resultado.total
        )
      )
    }

    if (acao === 'limpar') {
      if (!restante)
        return ctx.reply(ctx.mess.playlistLimparUso(ctx.prefix, false))

      const resultado = playlist.limparPlaylist(ctx.sender, restante, false)

      if (!resultado.ok)
        return ctx.reply(ctx.mess.playlistNaoExiste(restante, false))

      return ctx.reply(ctx.mess.playlistLimpa(resultado.playlist.nome, resultado.removidas))
    }

    if (acao === 'apagar' || acao === 'deletar') {
      if (!restante)
        return ctx.reply(ctx.mess.playlistApagarUso(ctx.prefix, false))

      const resultado = playlist.apagar(ctx.sender, restante, false)

      if (!resultado.ok)
        return ctx.reply(ctx.mess.playlistNaoExiste(restante, false))

      return ctx.reply(ctx.mess.playlistApagada(resultado.playlist.nome, false))
    }

    if (acao === 'renomear') {
      const [atual, novo] = separar(restante)

      if (!atual || !novo)
        return ctx.reply(ctx.mess.playlistRenomearUso(ctx.prefix, false))

      const resultado = playlist.renomear(ctx.sender, atual, novo, false)

      if (!resultado.ok && resultado.motivo === 'nao')
        return ctx.reply(ctx.mess.playlistNaoExiste(atual, false))

      if (!resultado.ok && resultado.motivo === 'existe')
        return ctx.reply(ctx.mess.playlistExiste(novo, false))

      if (!resultado.ok)
        return ctx.reply(ctx.mess.playlistErro('Não consegui renomear essa playlist.'))

      return ctx.reply(ctx.mess.playlistRenomeada(atual, resultado.playlist.nome, false))
    }

    return ctx.reply(ctx.mess.playlistAjuda(ctx.prefix))
  }
})
