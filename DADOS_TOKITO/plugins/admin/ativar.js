const modulos = require('../../sistemas/modulos')

const itens = [
  ['__bemvindo1', 'Bem-vindo 1'],
  ['__bemvindo2', 'Bem-vindo 2'],
  ['__bemvindo3', 'Bem-vindo 3'],
  ['aprovacao', 'Aprovação de entrada'],
  ['autoaprovacao', 'Auto Aprovação'],
  ['soadm', 'Só ADM'],
  ['__antilinkeasy', 'Anti Link Easy'],
  ['__antilinkmedium', 'Anti Link Medium'],
  ['__antilinkhard', 'Anti Link Hard'],
  ['antifake', 'Anti Fake'],
  ['__antiddd', 'Anti DDD'],
  ['antirroubo', 'Anti Roubo'],
  ['antinotas', 'Anti Notas'],
  ['antipalavra', 'Anti Palavras'],
  ['antipay', 'Anti Pagamento'],
  ['antibot', 'Anti Bot'],
  ['antivideo', 'Anti Vídeo'],
  ['antifoto', 'Anti Foto'],
  ['antivisu', 'Anti Visualização Única'],
  ['antisticker', 'Anti Sticker'],
  ['anticontato', 'Anti Contato'],
  ['antilocalizacao', 'Anti Localização'],
  ['antidocumento', 'Anti Documento'],
  ['antiaudio', 'Anti Áudio'],
  ['antispam', 'Anti Spam'],
  ['antistatus', 'Anti Status'],
  ['antimarcacao', 'Anti Marcação'],
  ['anticanal', 'Anti Canal'],
  ['autodl', 'Auto Download'],
  ['autosticker', 'Auto Sticker'],
  ['autortext', 'Auto Transcrição'],
  ['multiprefix', 'Multi-prefix'],
  ['modojogos', 'Modo Jogos'],
  ['__modobn', 'Modo Brincadeiras'],
  ['modorpg', 'Modo RPG'],
  ['modocoins', 'Modo Coins'],
  ['__modoia', 'Modo IA'],
  ['x9', 'X9']
]

const funcoes = ctx => {
  if (!ctx.dataGp?.[0]?.funcoes || typeof ctx.dataGp[0].funcoes !== 'object') {
    ctx.dataGp[0].funcoes = {}
  }

  return ctx.dataGp[0].funcoes
}

const ativo = (ctx, chave) => {
  const f = ctx.dataGp?.[0]?.funcoes || {}

  if (chave === '__bemvindo1') {
    return Boolean(ctx.dataGp?.[0]?.wellcome?.[0]?.bemvindo1)
  }

  if (chave === '__bemvindo2') {
    return Boolean(ctx.dataGp?.[0]?.wellcome?.[1]?.bemvindo2)
  }

  if (chave === '__bemvindo3') {
    return Boolean(ctx.dataGp?.[0]?.wellcome?.[2]?.bemvindo3)
  }

  if (chave === '__modobn') {
    return ctx.dataGp?.[0]?.jogos === true
  }

  if (chave === '__modoia') {
    return Boolean(f.modoia?.ativo)
  }

  if (chave === '__antiddd') {
    return Boolean(f.antiddd?.ativo)
  }

  if (chave.startsWith('__antilink')) {
    const nivel = chave.replace('__antilink', '')
    return Boolean(f.antilink?.ativo) && f.antilink?.nivel === nivel
  }

  return Boolean(f[chave])
}

const trocar = (ctx, chave) => {
  const f = funcoes(ctx)

  if (chave.startsWith('__bemvindo')) {
    const indice = Number(chave.replace('__bemvindo', '')) - 1
    const item = ctx.dataGp?.[0]?.wellcome?.[indice]

    if (!item) {
      return false
    }

    const campo = `bemvindo${indice + 1}`
    item[campo] = !Boolean(item[campo])
    return item[campo]
  }

  if (chave === '__modobn') {
    ctx.dataGp[0].jogos = !Boolean(ctx.dataGp[0].jogos)
    return ctx.dataGp[0].jogos
  }

  if (chave === '__modoia') {
    if (!f.modoia || typeof f.modoia !== 'object') {
      f.modoia = {
        ativo: false,
        tipo: 'texto'
      }
    }

    f.modoia.ativo = !Boolean(f.modoia.ativo)
    return f.modoia.ativo
  }

  if (chave === '__antiddd') {
    if (!f.antiddd || typeof f.antiddd !== 'object') {
      f.antiddd = {
        ativo: false,
        listaProibidos: []
      }
    }

    f.antiddd.ativo = !Boolean(f.antiddd.ativo)
    return f.antiddd.ativo
  }

  if (chave.startsWith('__antilink')) {
    const nivel = chave.replace('__antilink', '')

    if (!f.antilink || typeof f.antilink !== 'object') {
      f.antilink = {
        ativo: false,
        nivel: null
      }
    }

    const mesmo = f.antilink.ativo === true && f.antilink.nivel === nivel
    f.antilink.ativo = !mesmo
    f.antilink.nivel = mesmo ? null : nivel
    return f.antilink.ativo
  }

  f[chave] = !Boolean(f[chave])

  if (chave === 'multiprefix' && f[chave] && !f.prefixGrupo) {
    f.prefixGrupo = ctx.prefix
  }

  return f[chave]
}

const painel = ctx => {
  return ctx.mess.ativarPainel({
    itens,
    ativo: chave => ativo(ctx, chave)
  })
}

module.exports = {
  nome: 'ativar',

  comandos: [
    'ativar'
  ],

  categoria: 'admin',

  info: {
    descricao: 'Painel numerado para ativar/desativar sistemas do grupo.',
    uso: 'ativar',
    permissao: 'ADM'
  },

  itens,
  ativo,
  trocar,
  painel,

  async executar(ctx) {
    if (!ctx.isGroup) {
      return ctx.reply(
        ctx.mess.sogrupo()
      )
    }

    if (!ctx.isGroupAdmins && !ctx.SoDono) {
      return ctx.reply(
        ctx.mess.soadm()
      )
    }

    const chave = `${ctx.from}|${ctx.sender}`

    modulos.pendentesAtivar.set(chave, {
      expira: Date.now() + 120000
    })

    return ctx.reply(
      painel(ctx)
    )
  }
}
