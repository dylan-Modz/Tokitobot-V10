const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const {
  compacto,
  dinheiro,
  enviarComImagem
} = require('../../sistemas/rpg/texto')

const idGuilda = nome => {
  return String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24)
}

const membrosValidos = guilda => {
  if (!Array.isArray(guilda.membros))
    guilda.membros = []

  guilda.membros = [...new Set(guilda.membros.filter(Boolean))]
  return guilda.membros
}

dylan.setCommand({
  nome: 'guilda',
  comandos: [
    'guilda',
    'criarguilda',
    'entrarguilda',
    'sairguilda',
    'rankguilda'
  ],
  categoria: 'rpg',
  info: {
    descricao: 'Criação, participação e ranking de guildas.',
    uso: 'criarguilda nome',
    requisitos: 'Modo RPG',
    categoria: 'rpg'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.temRpg(ctx))
      return ctx.reply(ctx.mess.rpgDesativado(ctx.prefix))

    const comando = String(ctx.command || '').toLowerCase()
    const grupo = r.garantir(ctx)
    const usuario = r.user(ctx)
    const aventura = r.normalizarAventura(usuario)
    const meuJid = ctx.normalizar(ctx.sender)

    if (!aventura.classe) {
      return ctx.reply(compacto(ctx, '🧭', 'Jornada não iniciada', [
        { emoji: '📌', texto: `Escolha sua classe com ${ctx.prefix}classe` }
      ]))
    }

    if (comando === 'rankguilda') {
      const ranking = Object.entries(grupo.rpg.guildas || {})
        .map(([id, guilda]) => ({
          id,
          guilda,
          pontos: Number(guilda.pontos || 0)
        }))
        .sort((a, b) => b.pontos - a.pontos)
        .slice(0, 10)

      const linhas = ranking.length
        ? ranking.map((item, indice) => ({
            emoji: indice === 0 ? '🥇' : indice === 1 ? '🥈' : indice === 2 ? '🥉' : '🏰',
            texto: `${indice + 1}º ${item.guilda.nome} • ${item.pontos} pontos • ${membrosValidos(item.guilda).length} membro(s) • ID ${item.id}`
          }))
        : [{ emoji: '📭', texto: 'Nenhuma guilda criada neste grupo' }]

      return enviarComImagem(
        ctx,
        r.imagemRpg('guildas'),
        compacto(ctx, '🏆', 'Ranking de Guildas', linhas)
      )
    }

    if (comando === 'criarguilda') {
      if (aventura.guilda) {
        return ctx.reply(compacto(ctx, '🏰', 'Você já possui guilda', [
          { emoji: '📌', texto: `Use ${ctx.prefix}guilda para consultar` }
        ]))
      }

      const nome = String(ctx.q || '').trim().replace(/\s+/g, ' ').slice(0, 30)
      const id = idGuilda(nome)

      if (nome.length < 3 || id.length < 3) {
        return ctx.reply(compacto(ctx, '🏰', 'Criar Guilda', [
          { emoji: '📌', texto: `${ctx.prefix}criarguilda Nome da Guilda` },
          { emoji: '📝', texto: 'Use um nome com pelo menos 3 caracteres' }
        ]))
      }

      if (grupo.rpg.guildas[id]) {
        return ctx.reply(compacto(ctx, '⚠️', 'Nome indisponível', [
          { emoji: '🏰', texto: 'Já existe uma guilda com esse nome neste grupo' }
        ]))
      }

      const custo = r.temCoins(ctx) ? 3000 : 0
      let economia = null

      if (custo) {
        economia = r.eco(ctx)

        if (Number(economia.coins || 0) < custo)
          return ctx.reply(ctx.mess.coinsSemSaldo(custo, economia.coins))

        economia.coins -= custo
      }

      grupo.rpg.guildas[id] = {
        id,
        nome,
        lider: meuJid,
        membros: [meuJid],
        pontos: 0,
        nivel: 1,
        emblema: r.imagemRpg('guildas'),
        criadaEm: Date.now()
      }

      aventura.guilda = id
      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        grupo.rpg.guildas[id].emblema,
        compacto(ctx, '🏰', 'Guilda criada', [
          { emoji: '🏰', texto: nome },
          { emoji: '🪪', texto: `ID: ${id}` },
          { emoji: '👑', texto: `Líder: @${meuJid.split('@')[0]}` },
          custo ? { emoji: '🪙', texto: `Custo: ${dinheiro(custo)}` } : null,
          { emoji: '📌', texto: `Outros jogadores entram com ${ctx.prefix}entrarguilda ${id}` }
        ]),
        [meuJid]
      )
    }

    if (comando === 'entrarguilda') {
      if (aventura.guilda) {
        return ctx.reply(compacto(ctx, '🏰', 'Você já possui guilda', [
          { emoji: '📌', texto: `Use ${ctx.prefix}sairguilda antes de entrar em outra` }
        ]))
      }

      const id = idGuilda(ctx.args?.[0])
      const guilda = grupo.rpg.guildas?.[id]

      if (!guilda) {
        return ctx.reply(compacto(ctx, '🔎', 'Guilda não encontrada', [
          { emoji: '📌', texto: `Veja as disponíveis com ${ctx.prefix}rankguilda` }
        ]))
      }

      const membros = membrosValidos(guilda)
      if (membros.length >= 30) {
        return ctx.reply(compacto(ctx, '🔒', 'Guilda lotada', [
          { emoji: '👥', texto: 'Limite de 30 membros atingido' }
        ]))
      }

      membros.push(meuJid)
      aventura.guilda = id
      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        guilda.emblema || r.imagemRpg('guildas'),
        compacto(ctx, '🤝', 'Entrada confirmada', [
          { emoji: '🏰', texto: guilda.nome },
          { emoji: '👥', texto: `Membros: ${guilda.membros.length}/30` },
          { emoji: '⚔️', texto: 'Suas vitórias agora ajudam a guilda' }
        ])
      )
    }

    if (comando === 'sairguilda') {
      const id = String(aventura.guilda || '')
      const guilda = grupo.rpg.guildas?.[id]

      if (!guilda) {
        aventura.guilda = null
        r.salvar(ctx)

        return ctx.reply(compacto(ctx, '📭', 'Sem guilda', [
          { emoji: '📌', texto: `Use ${ctx.prefix}rankguilda para encontrar uma` }
        ]))
      }

      const membros = membrosValidos(guilda)
      guilda.membros = membros.filter(jid => jid !== meuJid)

      if (guilda.lider === meuJid) {
        if (guilda.membros.length)
          guilda.lider = guilda.membros[0]
        else
          delete grupo.rpg.guildas[id]
      }

      aventura.guilda = null
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🚪', 'Você saiu da guilda', [
        { emoji: '🏰', texto: guilda.nome },
        guilda.membros.length
          ? { emoji: '👑', texto: `Novo líder: @${guilda.lider.split('@')[0]}` }
          : { emoji: '🗑️', texto: 'A guilda foi encerrada por não possuir membros' }
      ]), guilda.membros.length ? [guilda.lider] : [])
    }

    const guilda = r.guildaDoUsuario(ctx, usuario)

    if (!guilda) {
      aventura.guilda = null
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🏰', 'Você não possui guilda', [
        { emoji: '📌', texto: `${ctx.prefix}criarguilda Nome` },
        { emoji: '📌', texto: `${ctx.prefix}rankguilda` }
      ]))
    }

    membrosValidos(guilda)
    guilda.nivel = Math.max(1, 1 + Math.floor(Number(guilda.pontos || 0) / 1000))

    return enviarComImagem(
      ctx,
      guilda.emblema || r.imagemRpg('guildas'),
      compacto(ctx, '🏰', guilda.nome, [
        { emoji: '🪪', texto: `ID: ${guilda.id}` },
        { emoji: '👑', texto: `Líder: @${String(guilda.lider).split('@')[0]}` },
        { emoji: '👥', texto: `Membros: ${guilda.membros.length}/30` },
        { emoji: '⭐', texto: `Nível: ${guilda.nivel}` },
        { emoji: '🏆', texto: `Pontos: ${Number(guilda.pontos || 0)}` }
      ]),
      [guilda.lider]
    )
  }
})
