const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto: mensagem, dinheiro } = require('../../sistemas/rpg/texto')
const idObjeto = valor => typeof valor === 'string' ? valor : valor?.id

const restante = (ultimo, cooldown) => {
  const falta = cooldown - (Date.now() - Number(ultimo || 0))
  return falta > 0 ? Math.ceil(falta / 1000) : 0
}

const valorDoTexto = texto => {
  const numeros = String(texto || '').replace(/@\S+/g, ' ').replace(/[^0-9]/g, '')
  return Number(numeros || 0)
}

const adicionarInventario = (usuario, id, quantidade = 1) => {
  if (!usuario.inventario || typeof usuario.inventario !== 'object')
    usuario.inventario = {}

  usuario.inventario[id] = Number(usuario.inventario[id] || 0) + quantidade

  if (usuario.inventario[id] <= 0)
    delete usuario.inventario[id]
}

const nomePropriedade = (valor, catalogo, vazio) => {
  if (!valor)
    return vazio

  if (typeof valor === 'object')
    return valor.nome || catalogo[valor.id]?.nome || vazio

  return catalogo[valor]?.nome || String(valor)
}

const tocarRpg = (ctx, xp = 0) => {
  if (!r.temRpg(ctx) || !xp)
    return

  const usuario = r.user(ctx)
  if (usuario.bloqueado)
    return

  usuario.xp = Number(usuario.xp || 0) + Number(xp || 0)
  usuario.level = r.nivelPorXp(usuario.xp)
  usuario.patente = r.patente(usuario.xp)
}


const exigirRegistro = (ctx, usuario, cidade) => {
  if (cidade.nome)
    return true

  ctx.reply(mensagem(ctx, '🏙️', 'Perfil não registrado', [
    { emoji: '📌', texto: `Use ${ctx.prefix}registrarcidade nome` }
  ]))
  return false
}

const exigirLivre = (ctx, cidade) => {
  if (Number(cidade.presoAte || 0) <= Date.now()) {
    cidade.presoAte = 0
    return true
  }

  const segundos = Math.ceil((cidade.presoAte - Date.now()) / 1000)
  ctx.reply(mensagem(ctx, '🔒', 'Você está preso', [
    { emoji: '⏳', texto: `Liberação em ${segundos}s` },
    { emoji: '💸', texto: `Use ${ctx.prefix}fiancacidade para sair antes` }
  ]))
  return false
}

const listarCatalogo = (ctx, emoji, titulo, catalogo, comando, detalhe = () => '') => {
  return mensagem(ctx, emoji, titulo, Object.entries(catalogo).map(([id, item]) => ({
    emoji: item.emoji || '•',
    texto: `${item.nome} • ${dinheiro(item.preco)}${detalhe(item)} • ${ctx.prefix}${comando} ${id}`
  })))
}

dylan.setCommand({
  nome: 'registrarcidade',
  comandos: [
    'registrarcidade', 'entrarnacidade', 'cidade', 'perfilcidade', 'cidadeperfil',
    'empregoscidade', 'trabalhoscidade', 'settrabalho', 'setemprego',
    'trabalharcidade', 'trabalhocidade', 'trabalhar', 'coletarsalario', 'salariocidade',
    'bancocidade', 'cidadebanco', 'banco', 'depositarcidade', 'depositarbank', 'depositar',
    'sacarcidade', 'sacarbanco', 'sacar', 'doarcidade', 'pixcidade',
    'lojacidade', 'lojaitenscidade', 'compraritemcidade', 'compraritenscidade',
    'inventariocidade', 'inventcidade', 'usaritemcidade',
    'mercadocidade', 'comidascidade', 'comercidade', 'restaurantecidade',
    'descansarcidade', 'hospitalcidade',
    'casascidade', 'lojacasas', 'comprarcasa', 'vendercasa', 'alugarcasa', 'coletaraluguel',
    'veiculoscidade', 'lojaveiculos', 'comprarveiculo', 'venderveiculo',
    'abastecercidade', 'abastecerveiculo', 'oficinacidade', 'repararveiculo',
    'empresascidade', 'lojaempresas', 'comprarempresa', 'venderempresa', 'lucroempresa',
    'assaltarcidade', 'crimecidade', 'fiancacidade',
    'corridacidade', 'apostacidade',
    'pescacidade', 'venderpeixes', 'buscarcidade',
    'casarcidade', 'divorciocidade',
    'rankcidade', 'rankingcidade'
  ],
  categoria: 'coins',
  info: {
    descricao: 'Sistema completo de cidade integrado aos N-Coins e ao RPG.',
    uso: 'cidade',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.temCoins(ctx))
      return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))

    const usuario = r.eco(ctx)
    const cidade = r.normalizarCidade(usuario)
    const comando = String(ctx.command || '').toLowerCase()
    const primeiro = String(ctx.args?.[0] || '').toLowerCase()

    if (['registrarcidade', 'entrarnacidade'].includes(comando) || (comando === 'cidade' && !cidade.nome)) {
      if (cidade.nome && comando !== 'cidade') {
        return ctx.reply(mensagem(ctx, '🏙️', 'Perfil já registrado', [
          { emoji: '👤', texto: `Cidadão: ${cidade.nome}` },
          { emoji: '📌', texto: `Use ${ctx.prefix}cidade para abrir seu perfil` }
        ]))
      }

      cidade.nome = String(ctx.q || ctx.pushname || 'Cidadão').trim().slice(0, 30)
      cidade.bairro = cidade.bairro || 'Centro'
      cidade.energia = 100
      cidade.fome = 100
      cidade.saude = 100
      tocarRpg(ctx, 10)
      r.salvar(ctx)
      return ctx.reply(ctx.mess.cidadeRegistrada(cidade.nome))
    }

    if (!exigirRegistro(ctx, usuario, cidade))
      return

    if (['perfilcidade', 'cidadeperfil', 'cidade'].includes(comando)) {
      let foto = 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/6604x2f6a.jpg'

      try {
        foto = await ctx.tokito.profilePictureUrl(ctx.sender, 'image')
      }
      catch {
      }

      const parceiro = cidade.parceiro ? `@${String(cidade.parceiro).split('@')[0]}` : 'Nenhum'
      const status = Number(cidade.presoAte || 0) > Date.now() ? 'Preso' : 'Livre'
      const nivel = Number(cidade.nivel || 1)
      const xp = Number(cidade.xp || 0)
      const xpmax = nivel * 100
      const patrimonio = r.patrimonioCidade(usuario)
      const casa = nomePropriedade(cidade.casa, r.CIDADE_CASAS, 'Nenhuma')
      const veiculo = nomePropriedade(cidade.veiculo, r.CIDADE_VEICULOS, 'Nenhum')

      const url = `${ctx.API_URL}/canvas/perfilcidade?apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}&foto=${encodeURIComponent(foto)}&nome=${encodeURIComponent(cidade.nome)}&bairro=${encodeURIComponent(cidade.bairro || 'Centro')}&cargo=${encodeURIComponent(cidade.cargo || 'Desempregado')}&carteira=${encodeURIComponent(usuario.coins || 0)}&banco=${encodeURIComponent(cidade.saldoBanco || 0)}&energia=${encodeURIComponent(cidade.energia || 0)}&fome=${encodeURIComponent(cidade.fome || 0)}&saude=${encodeURIComponent(cidade.saude || 0)}&casa=${encodeURIComponent(casa)}&veiculo=${encodeURIComponent(veiculo)}&combustivel=${encodeURIComponent(cidade.combustivel || 0)}&durabilidade=${encodeURIComponent(cidade.durabilidadeVeiculo ?? 100)}&reputacao=${encodeURIComponent(cidade.reputacao || 0)}&nivel=${encodeURIComponent(nivel)}&xp=${encodeURIComponent(xp)}&xpmax=${encodeURIComponent(xpmax)}&parceiro=${encodeURIComponent(parceiro)}&status=${encodeURIComponent(status)}&patrimonio=${encodeURIComponent(patrimonio)}`
      const caption = ctx.mess.cidadePerfil(ctx.sender, usuario, patrimonio)
      const mencoes = [ctx.sender, ...(cidade.parceiro ? [cidade.parceiro] : [])]

      try {
        return await ctx.tokito.sendMessage(ctx.from, {
          image: { url },
          caption,
          mentions: mencoes
        }, { quoted: ctx.selo })
      }
      catch {
        return ctx.reply(caption, mencoes)
      }
    }

    if (['empregoscidade', 'trabalhoscidade'].includes(comando)) {
      return ctx.reply(mensagem(ctx, '💼', 'Empregos da Cidade', Object.entries(r.CIDADE_EMPREGOS).map(([id, emprego]) => ({
        emoji: emprego.emoji,
        texto: `${emprego.nome} • ${dinheiro(emprego.salario[0])} a ${dinheiro(emprego.salario[1])} • ${ctx.prefix}settrabalho ${id}`
      }))))
    }

    if (['settrabalho', 'setemprego'].includes(comando)) {
      const emprego = r.CIDADE_EMPREGOS[primeiro]

      if (!emprego)
        return ctx.reply(mensagem(ctx, '💼', 'Escolha um emprego', [
          { emoji: '📌', texto: `Use ${ctx.prefix}empregoscidade` }
        ]))

      cidade.idCargo = primeiro
      cidade.cargo = emprego.nome
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, emprego.emoji, 'Emprego definido', [
        { emoji: emprego.emoji, texto: emprego.nome },
        { emoji: '💰', texto: `Pagamento por turno: ${dinheiro(emprego.salario[0])} a ${dinheiro(emprego.salario[1])}` },
        { emoji: '⚡', texto: `Custo de energia: ${emprego.energia}` }
      ]))
    }

    if (['trabalharcidade', 'trabalhocidade', 'trabalhar'].includes(comando)) {
      if (!exigirLivre(ctx, cidade))
        return

      if (cidade.idCargo === 'desempregado' || !r.CIDADE_EMPREGOS[cidade.idCargo]) {
        return ctx.reply(mensagem(ctx, '💼', 'Você está desempregado', [
          { emoji: '📌', texto: `Use ${ctx.prefix}empregoscidade e escolha uma profissão` }
        ]))
      }

      const emprego = r.CIDADE_EMPREGOS[cidade.idCargo]
      const cooldown = restante(cidade.ultimoTrabalho, 30 * 60 * 1000)

      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      if (Number(cidade.energia || 0) < emprego.energia) {
        return ctx.reply(mensagem(ctx, '😴', 'Energia insuficiente', [
          { emoji: '⚡', texto: `Você tem ${cidade.energia}% de energia` },
          { emoji: '🛌', texto: `Use ${ctx.prefix}descansarcidade` }
        ]))
      }

      const ganho = r.aleatorio(emprego.salario[0], emprego.salario[1])
      const evento = r.escolher(emprego.eventos)
      let reputacao = emprego.reputacao

      if (Math.random() < 0.12) {
        reputacao += 1
        cidade.saude = r.limitar(Number(cidade.saude || 100) - r.aleatorio(2, 8))
      }

      usuario.coins = Number(usuario.coins || 0) + ganho
      cidade.energia = r.limitar(Number(cidade.energia || 0) - emprego.energia)
      cidade.fome = r.limitar(Number(cidade.fome || 0) - r.aleatorio(5, 10))
      cidade.reputacao = Number(cidade.reputacao || 0) + reputacao
      cidade.xp = Number(cidade.xp || 0) + 20
      cidade.nivel = 1 + Math.floor(cidade.xp / 100)
      cidade.salarioPendente = Number(cidade.salarioPendente || 0) + Math.floor(ganho * 0.2)
      cidade.ultimoTrabalho = Date.now()
      tocarRpg(ctx, 12)
      r.salvar(ctx)

      return ctx.reply(ctx.mess.cidadeTrabalho(ganho, usuario.coins, {
        emoji: emprego.emoji,
        cargo: emprego.nome,
        evento,
        reputacao,
        energia: emprego.energia
      }))
    }

    if (['coletarsalario', 'salariocidade'].includes(comando)) {
      const valor = Number(cidade.salarioPendente || 0)

      if (valor <= 0) {
        return ctx.reply(mensagem(ctx, '💼', 'Sem salário pendente', [
          { emoji: '🕒', texto: `Trabalhe usando ${ctx.prefix}trabalhar` },
          { emoji: '💰', texto: 'Parte de cada turno acumula como salário extra' }
        ]))
      }

      usuario.coins = Number(usuario.coins || 0) + valor
      cidade.salarioPendente = 0
      cidade.ultimoSalario = Date.now()
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '💵', 'Salário coletado', [
        { emoji: '💼', texto: cidade.cargo },
        { emoji: '💰', texto: `+${dinheiro(valor)}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(usuario.coins)}` }
      ]))
    }

    if (['bancocidade', 'cidadebanco', 'banco'].includes(comando))
      return ctx.reply(ctx.mess.cidadeBanco(cidade.saldoBanco, usuario.coins))

    if (['depositarcidade', 'depositarbank', 'depositar'].includes(comando)) {
      const valor = valorDoTexto(ctx.q)

      if (!valor || Number(usuario.coins || 0) < valor)
        return ctx.reply(ctx.mess.cidadeBancoUso(ctx.prefix))

      usuario.coins -= valor
      cidade.saldoBanco = Number(cidade.saldoBanco || 0) + valor
      cidade.historicoBanco.unshift({ tipo: 'deposito', valor, em: Date.now() })
      cidade.historicoBanco = cidade.historicoBanco.slice(0, 10)
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '📥', 'Depósito concluído', [
        { emoji: '🏦', texto: `+${dinheiro(valor)} no banco` },
        { emoji: '💰', texto: `Carteira: ${dinheiro(usuario.coins)}` },
        { emoji: '🏛️', texto: `Banco: ${dinheiro(cidade.saldoBanco)}` }
      ]))
    }

    if (['sacarcidade', 'sacarbanco', 'sacar'].includes(comando)) {
      const valor = valorDoTexto(ctx.q)

      if (!valor || Number(cidade.saldoBanco || 0) < valor)
        return ctx.reply(ctx.mess.cidadeBancoUso(ctx.prefix))

      cidade.saldoBanco -= valor
      usuario.coins = Number(usuario.coins || 0) + valor
      cidade.historicoBanco.unshift({ tipo: 'saque', valor, em: Date.now() })
      cidade.historicoBanco = cidade.historicoBanco.slice(0, 10)
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '📤', 'Saque concluído', [
        { emoji: '💰', texto: `+${dinheiro(valor)} na carteira` },
        { emoji: '🏛️', texto: `Banco: ${dinheiro(cidade.saldoBanco)}` }
      ]))
    }

    if (['doarcidade', 'pixcidade'].includes(comando)) {
      const alvoBruto = (ctx.menc_jid2 || [])[0] || ctx.menc_prt
      const alvo = alvoBruto ? ctx.normalizar(alvoBruto) : null
      const valor = valorDoTexto(ctx.q)

      if (!alvo || alvo === ctx.normalizar(ctx.sender) || !valor) {
        return ctx.reply(mensagem(ctx, '💸', 'Pix da Cidade', [
          { emoji: '📌', texto: `${ctx.prefix}pixcidade 500 @usuario` }
        ]))
      }

      if (Number(cidade.saldoBanco || 0) < valor) {
        return ctx.reply(mensagem(ctx, '🏦', 'Saldo bancário insuficiente', [
          { emoji: '💰', texto: `Banco: ${dinheiro(cidade.saldoBanco)}` }
        ]))
      }

      const destinatario = r.eco(ctx, alvo)
      const cidadeDestino = r.normalizarCidade(destinatario)

      cidade.saldoBanco -= valor
      cidadeDestino.saldoBanco = Number(cidadeDestino.saldoBanco || 0) + valor
      cidade.historicoBanco.unshift({ tipo: 'pix_enviado', valor, alvo, em: Date.now() })
      cidadeDestino.historicoBanco.unshift({ tipo: 'pix_recebido', valor, origem: ctx.sender, em: Date.now() })
      cidade.historicoBanco = cidade.historicoBanco.slice(0, 10)
      cidadeDestino.historicoBanco = cidadeDestino.historicoBanco.slice(0, 10)
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '💸', 'Pix enviado', [
        { emoji: '👤', texto: `Para: @${alvo.split('@')[0]}` },
        { emoji: '🪙', texto: dinheiro(valor) },
        { emoji: '🏦', texto: `Banco: ${dinheiro(cidade.saldoBanco)}` }
      ]), [alvo])
    }

    if (['lojacidade', 'lojaitenscidade'].includes(comando))
      return ctx.reply(listarCatalogo(ctx, '🛍️', 'Loja da Cidade', r.CIDADE_ITENS, 'compraritemcidade'))

    if (['compraritemcidade', 'compraritenscidade'].includes(comando)) {
      const item = r.CIDADE_ITENS[primeiro]
      const quantidade = Math.max(1, Math.min(20, Number(ctx.args?.[1] || 1)))

      if (!item)
        return ctx.reply(listarCatalogo(ctx, '🛍️', 'Loja da Cidade', r.CIDADE_ITENS, 'compraritemcidade'))

      const total = item.preco * quantidade

      if (Number(usuario.coins || 0) < total)
        return ctx.reply(ctx.mess.coinsSemSaldo(total, usuario.coins))

      usuario.coins -= total
      adicionarInventario(usuario, primeiro, quantidade)
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, item.emoji, 'Compra realizada', [
        { emoji: item.emoji, texto: `${quantidade}x ${item.nome}` },
        { emoji: '💸', texto: dinheiro(total) },
        { emoji: '🎒', texto: `No inventário: ${usuario.inventario[primeiro]}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(usuario.coins)}` }
      ]))
    }

    if (['inventariocidade', 'inventcidade'].includes(comando)) {
      const itens = Object.entries(usuario.inventario || {}).filter(([, quantidade]) => Number(quantidade) > 0)
      const peixes = Object.entries(cidade.peixes || {}).filter(([, dados]) => Number(dados.qtd || 0) > 0)
      const linhas = []

      for (const [id, quantidade] of itens) {
        const item = r.CIDADE_ITENS[id]
        linhas.push({ emoji: item?.emoji || '📦', texto: `${item?.nome || id}: ${quantidade}x` })
      }

      for (const [id, dados] of peixes)
        linhas.push({ emoji: '🎣', texto: `${dados.nome || id}: ${dados.qtd}x • valor ${dinheiro(dados.valorTotal)}` })

      if (!linhas.length)
        linhas.push({ emoji: '📭', texto: 'Seu inventário está vazio' })

      return ctx.reply(mensagem(ctx, '🎒', 'Inventário da Cidade', linhas))
    }

    if (comando === 'usaritemcidade') {
      const item = r.CIDADE_ITENS[primeiro]

      if (!item || Number(usuario.inventario?.[primeiro] || 0) <= 0) {
        return ctx.reply(mensagem(ctx, '🎒', 'Item indisponível', [
          { emoji: '📌', texto: `Use ${ctx.prefix}inventariocidade` }
        ]))
      }

      if (item.tipo === 'equipamento') {
        return ctx.reply(mensagem(ctx, item.emoji, 'Equipamento permanente', [
          { emoji: item.emoji, texto: `${item.nome} já está disponível para suas atividades` }
        ]))
      }

      adicionarInventario(usuario, primeiro, -1)

      if (item.tipo === 'energia')
        cidade.energia = r.limitar(Number(cidade.energia || 0) + item.valor)
      if (item.tipo === 'saude')
        cidade.saude = r.limitar(Number(cidade.saude || 0) + item.valor)
      if (item.tipo === 'fome')
        cidade.fome = r.limitar(Number(cidade.fome || 0) + item.valor)

      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, item.emoji, 'Item utilizado', [
        { emoji: item.emoji, texto: item.nome },
        { emoji: '⚡', texto: `Energia ${cidade.energia}% • Fome ${cidade.fome}% • Saúde ${cidade.saude}%` }
      ]))
    }

    if (['mercadocidade', 'comidascidade'].includes(comando)) {
      return ctx.reply(mensagem(ctx, '🍽️', 'Comidas da Cidade', Object.entries(r.CIDADE_COMIDAS).map(([id, item]) => ({
        emoji: item.emoji,
        texto: `${item.nome} • ${dinheiro(item.preco)} • ${ctx.prefix}comercidade ${id}`
      }))))
    }

    if (['comercidade', 'restaurantecidade'].includes(comando)) {
      const comida = r.CIDADE_COMIDAS[primeiro]

      if (!comida) {
        return ctx.reply(mensagem(ctx, '🍽️', 'Escolha sua comida', [
          { emoji: '📌', texto: `Use ${ctx.prefix}mercadocidade` }
        ]))
      }

      if (Number(usuario.coins || 0) < comida.preco)
        return ctx.reply(ctx.mess.coinsSemSaldo(comida.preco, usuario.coins))

      usuario.coins -= comida.preco
      cidade.fome = r.limitar(Number(cidade.fome || 0) + Number(comida.fome || 0))
      cidade.energia = r.limitar(Number(cidade.energia || 0) + Number(comida.energia || 0))
      cidade.saude = r.limitar(Number(cidade.saude || 0) + Number(comida.saude || 0))
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, comida.emoji, 'Refeição concluída', [
        { emoji: comida.emoji, texto: comida.nome },
        { emoji: '🍔', texto: `Fome: ${cidade.fome}%` },
        { emoji: '⚡', texto: `Energia: ${cidade.energia}%` },
        { emoji: '💸', texto: `Custo: ${dinheiro(comida.preco)}` }
      ]))
    }

    if (comando === 'descansarcidade') {
      const cooldown = restante(cidade.ultimoDescanso, 20 * 60 * 1000)

      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      const casaId = idObjeto(cidade.casa)
      const casa = r.CIDADE_CASAS[casaId]
      const alugada = Boolean(cidade.casa && typeof cidade.casa === 'object' && cidade.casa.alugada)
      const ganho = alugada ? 20 : Number(casa?.descanso || 20)

      cidade.energia = r.limitar(Number(cidade.energia || 0) + ganho)
      cidade.saude = r.limitar(Number(cidade.saude || 0) + Math.floor(ganho / 5))
      cidade.ultimoDescanso = Date.now()
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🛌', 'Descanso concluído', [
        { emoji: '🏠', texto: alugada ? 'Seu imóvel está alugado; você descansou em uma pousada' : (casa?.nome || 'Pousada pública') },
        { emoji: '⚡', texto: `+${ganho} Energia • agora ${cidade.energia}%` },
        { emoji: '❤️', texto: `Saúde: ${cidade.saude}%` }
      ]))
    }

    if (comando === 'hospitalcidade') {
      const falta = 100 - Number(cidade.saude || 0)

      if (falta <= 0) {
        return ctx.reply(mensagem(ctx, '🏥', 'Você está saudável', [
          { emoji: '❤️', texto: 'Saúde: 100%' }
        ]))
      }

      const custo = Math.max(250, falta * 18)

      if (Number(usuario.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, usuario.coins))

      usuario.coins -= custo
      cidade.saude = 100
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🏥', 'Alta médica', [
        { emoji: '❤️', texto: 'Saúde restaurada para 100%' },
        { emoji: '💸', texto: `Tratamento: ${dinheiro(custo)}` }
      ]))
    }

    if (['casascidade', 'lojacasas'].includes(comando)) {
      return ctx.reply(listarCatalogo(ctx, '🏠', 'Imobiliária', r.CIDADE_CASAS, 'comprarcasa', item => ` • descanso +${item.descanso}`))
    }

    if (comando === 'comprarcasa') {
      const casa = r.CIDADE_CASAS[primeiro]

      if (!casa)
        return ctx.reply(listarCatalogo(ctx, '🏠', 'Imobiliária', r.CIDADE_CASAS, 'comprarcasa'))

      if (cidade.casa) {
        return ctx.reply(mensagem(ctx, '🏠', 'Você já possui um imóvel', [
          { emoji: '🏡', texto: nomePropriedade(cidade.casa, r.CIDADE_CASAS, 'Imóvel') },
          { emoji: '💡', texto: `Use ${ctx.prefix}vendercasa antes de comprar outro` }
        ]))
      }

      if (Number(usuario.coins || 0) < casa.preco)
        return ctx.reply(ctx.mess.coinsSemSaldo(casa.preco, usuario.coins))

      usuario.coins -= casa.preco
      cidade.casa = { id: primeiro, nome: casa.nome, preco: casa.preco, alugada: false, compradaEm: Date.now() }
      cidade.reputacao = Number(cidade.reputacao || 0) + 3
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, casa.emoji, 'Novo imóvel', [
        { emoji: casa.emoji, texto: casa.nome },
        { emoji: '💸', texto: dinheiro(casa.preco) },
        { emoji: '🛌', texto: `Bônus de descanso: +${casa.descanso}` },
        { emoji: '💎', texto: `Patrimônio: ${dinheiro(r.patrimonioCidade(usuario))}` }
      ]))
    }

    if (comando === 'vendercasa') {
      const casaId = idObjeto(cidade.casa)
      const casa = r.CIDADE_CASAS[casaId]

      if (!casa)
        return ctx.reply(mensagem(ctx, '🏠', 'Sem imóvel', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojacasas` }]))

      const valor = Math.floor(casa.preco * 0.65)
      usuario.coins = Number(usuario.coins || 0) + valor
      cidade.casa = null
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🏷️', 'Imóvel vendido', [
        { emoji: casa.emoji, texto: casa.nome },
        { emoji: '💰', texto: `Recebido: ${dinheiro(valor)}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(usuario.coins)}` }
      ]))
    }

    if (comando === 'alugarcasa') {
      const casaId = idObjeto(cidade.casa)
      const casa = r.CIDADE_CASAS[casaId]

      if (!casa)
        return ctx.reply(mensagem(ctx, '🏠', 'Sem imóvel', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojacasas` }]))

      if (typeof cidade.casa !== 'object')
        cidade.casa = { id: casaId, nome: casa.nome, preco: casa.preco, alugada: false }

      if (primeiro === 'cancelar') {
        cidade.casa.alugada = false
        r.salvar(ctx)
        return ctx.reply(mensagem(ctx, '🔑', 'Aluguel encerrado', [{ emoji: casa.emoji, texto: `${casa.nome} voltou para seu uso` }]))
      }

      cidade.casa.alugada = true
      cidade.ultimoAluguel = Date.now()
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🏘️', 'Imóvel colocado para aluguel', [
        { emoji: casa.emoji, texto: casa.nome },
        { emoji: '💰', texto: `Renda a cada 6h: cerca de ${dinheiro(casa.aluguel)}` },
        { emoji: '📌', texto: `Use ${ctx.prefix}coletaraluguel para receber` }
      ]))
    }

    if (comando === 'coletaraluguel') {
      const casaId = idObjeto(cidade.casa)
      const casa = r.CIDADE_CASAS[casaId]
      const alugada = Boolean(cidade.casa && typeof cidade.casa === 'object' && cidade.casa.alugada)

      if (!casa || !alugada)
        return ctx.reply(mensagem(ctx, '🏘️', 'Sem aluguel ativo', [{ emoji: '📌', texto: `Use ${ctx.prefix}alugarcasa` }]))

      const cooldown = restante(cidade.ultimoAluguel, 6 * 60 * 60 * 1000)
      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      const ganho = r.aleatorio(Math.floor(casa.aluguel * 0.85), Math.floor(casa.aluguel * 1.2))
      usuario.coins = Number(usuario.coins || 0) + ganho
      cidade.ultimoAluguel = Date.now()
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🏘️', 'Aluguel recebido', [
        { emoji: casa.emoji, texto: casa.nome },
        { emoji: '💰', texto: `+${dinheiro(ganho)}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(usuario.coins)}` }
      ]))
    }

    if (['veiculoscidade', 'lojaveiculos'].includes(comando)) {
      return ctx.reply(listarCatalogo(ctx, '🚗', 'Concessionária', r.CIDADE_VEICULOS, 'comprarveiculo', item => ` • velocidade ${item.velocidade}`))
    }

    if (comando === 'comprarveiculo') {
      const veiculo = r.CIDADE_VEICULOS[primeiro]

      if (!veiculo)
        return ctx.reply(listarCatalogo(ctx, '🚗', 'Concessionária', r.CIDADE_VEICULOS, 'comprarveiculo'))

      if (cidade.veiculo) {
        return ctx.reply(mensagem(ctx, '🚗', 'Você já possui um veículo', [
          { emoji: '📌', texto: `Use ${ctx.prefix}venderveiculo primeiro` }
        ]))
      }

      if (Number(usuario.coins || 0) < veiculo.preco)
        return ctx.reply(ctx.mess.coinsSemSaldo(veiculo.preco, usuario.coins))

      usuario.coins -= veiculo.preco
      cidade.veiculo = { id: primeiro, nome: veiculo.nome, preco: veiculo.preco, compradaEm: Date.now() }
      cidade.combustivel = veiculo.tanque
      cidade.durabilidadeVeiculo = 100
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, veiculo.emoji, 'Veículo adquirido', [
        { emoji: veiculo.emoji, texto: veiculo.nome },
        { emoji: '⛽', texto: `Tanque: ${veiculo.tanque}L` },
        { emoji: '🏁', texto: `Velocidade: ${veiculo.velocidade}` },
        { emoji: '💸', texto: dinheiro(veiculo.preco) }
      ]))
    }

    if (comando === 'venderveiculo') {
      const veiculoId = idObjeto(cidade.veiculo)
      const veiculo = r.CIDADE_VEICULOS[veiculoId]

      if (!veiculo)
        return ctx.reply(mensagem(ctx, '🚗', 'Sem veículo', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojaveiculos` }]))

      const fator = 0.45 + (Number(cidade.durabilidadeVeiculo || 0) / 100) * 0.25
      const valor = Math.floor(veiculo.preco * fator)
      usuario.coins = Number(usuario.coins || 0) + valor
      cidade.veiculo = null
      cidade.combustivel = 0
      cidade.durabilidadeVeiculo = 100
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🏷️', 'Veículo vendido', [
        { emoji: veiculo.emoji, texto: veiculo.nome },
        { emoji: '🔧', texto: `Condição considerada: ${Math.round(fator * 100)}% do cálculo` },
        { emoji: '💰', texto: `Recebido: ${dinheiro(valor)}` }
      ]))
    }

    if (['abastecercidade', 'abastecerveiculo'].includes(comando)) {
      const veiculoId = idObjeto(cidade.veiculo)
      const veiculo = r.CIDADE_VEICULOS[veiculoId]

      if (!veiculo)
        return ctx.reply(mensagem(ctx, '⛽', 'Sem veículo', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojaveiculos` }]))

      const espaco = Math.max(0, veiculo.tanque - Number(cidade.combustivel || 0))
      const litros = Math.min(espaco, Math.max(1, Number(ctx.args?.[0] || espaco)))
      const custo = litros * 8

      if (!espaco)
        return ctx.reply(mensagem(ctx, '⛽', 'Tanque cheio', [{ emoji: '⛽', texto: `${cidade.combustivel}/${veiculo.tanque}L` }]))

      if (Number(usuario.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, usuario.coins))

      usuario.coins -= custo
      cidade.combustivel = Number(cidade.combustivel || 0) + litros
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '⛽', 'Abastecimento concluído', [
        { emoji: veiculo.emoji, texto: veiculo.nome },
        { emoji: '⛽', texto: `+${litros}L • tanque ${cidade.combustivel}/${veiculo.tanque}L` },
        { emoji: '💸', texto: `Custo: ${dinheiro(custo)}` }
      ]))
    }

    if (['oficinacidade', 'repararveiculo'].includes(comando)) {
      const veiculoId = idObjeto(cidade.veiculo)
      const veiculo = r.CIDADE_VEICULOS[veiculoId]

      if (!veiculo)
        return ctx.reply(mensagem(ctx, '🔧', 'Sem veículo', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojaveiculos` }]))

      const dano = 100 - Number(cidade.durabilidadeVeiculo || 0)

      if (dano <= 0)
        return ctx.reply(mensagem(ctx, '🔧', 'Veículo em perfeito estado', [{ emoji: '✅', texto: 'Durabilidade: 100%' }]))

      const custo = Math.max(200, dano * 35)

      if (Number(usuario.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, usuario.coins))

      usuario.coins -= custo
      cidade.durabilidadeVeiculo = 100
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🔧', 'Reparo concluído', [
        { emoji: veiculo.emoji, texto: veiculo.nome },
        { emoji: '🛠️', texto: 'Durabilidade restaurada para 100%' },
        { emoji: '💸', texto: `Custo: ${dinheiro(custo)}` }
      ]))
    }

    if (['empresascidade', 'lojaempresas'].includes(comando)) {
      return ctx.reply(listarCatalogo(ctx, '🏢', 'Empresas da Cidade', r.CIDADE_EMPRESAS, 'comprarempresa'))
    }

    if (comando === 'comprarempresa') {
      const empresa = r.CIDADE_EMPRESAS[primeiro]

      if (!empresa)
        return ctx.reply(listarCatalogo(ctx, '🏢', 'Empresas da Cidade', r.CIDADE_EMPRESAS, 'comprarempresa'))

      if (cidade.empresa) {
        return ctx.reply(mensagem(ctx, '🏢', 'Você já possui uma empresa', [
          { emoji: '📌', texto: `Use ${ctx.prefix}venderempresa antes de comprar outra` }
        ]))
      }

      if (Number(usuario.coins || 0) < empresa.preco)
        return ctx.reply(ctx.mess.coinsSemSaldo(empresa.preco, usuario.coins))

      usuario.coins -= empresa.preco
      cidade.empresa = { id: primeiro, nome: empresa.nome, preco: empresa.preco, compradaEm: Date.now() }
      cidade.ultimoLucroEmpresa = Date.now()
      cidade.reputacao = Number(cidade.reputacao || 0) + 8
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, empresa.emoji, 'Empresa inaugurada', [
        { emoji: empresa.emoji, texto: empresa.nome },
        { emoji: '💸', texto: dinheiro(empresa.preco) },
        { emoji: '📈', texto: `Use ${ctx.prefix}lucroempresa para fechar o caixa` }
      ]))
    }

    if (comando === 'venderempresa') {
      const empresaId = idObjeto(cidade.empresa)
      const empresa = r.CIDADE_EMPRESAS[empresaId]

      if (!empresa)
        return ctx.reply(mensagem(ctx, '🏢', 'Sem empresa', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojaempresas` }]))

      const valor = Math.floor(empresa.preco * 0.6)
      usuario.coins = Number(usuario.coins || 0) + valor
      cidade.empresa = null
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🏷️', 'Empresa vendida', [
        { emoji: empresa.emoji, texto: empresa.nome },
        { emoji: '💰', texto: `Recebido: ${dinheiro(valor)}` }
      ]))
    }

    if (comando === 'lucroempresa') {
      const empresaId = idObjeto(cidade.empresa)
      const empresa = r.CIDADE_EMPRESAS[empresaId]

      if (!empresa)
        return ctx.reply(mensagem(ctx, '🏢', 'Sem empresa', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojaempresas` }]))

      const cooldown = restante(cidade.ultimoLucroEmpresa, 6 * 60 * 60 * 1000)
      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      const receita = r.aleatorio(empresa.receita[0], empresa.receita[1])
      const despesa = r.aleatorio(empresa.despesa[0], empresa.despesa[1])
      const lucro = receita - despesa

      usuario.coins = Math.max(0, Number(usuario.coins || 0) + lucro)
      cidade.ultimoLucroEmpresa = Date.now()
      cidade.reputacao = Number(cidade.reputacao || 0) + (lucro >= 0 ? 2 : -1)
      tocarRpg(ctx, lucro >= 0 ? 8 : 3)
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, empresa.emoji, lucro >= 0 ? 'Fechamento positivo' : 'Fechamento no vermelho', [
        { emoji: empresa.emoji, texto: empresa.nome },
        { emoji: '📈', texto: `Receita: ${dinheiro(receita)}` },
        { emoji: '📉', texto: `Despesas: ${dinheiro(despesa)}` },
        { emoji: lucro >= 0 ? '💰' : '💸', texto: `Resultado: ${lucro >= 0 ? '+' : ''}${dinheiro(lucro)}` }
      ]))
    }

    if (['assaltarcidade', 'crimecidade'].includes(comando)) {
      if (!exigirLivre(ctx, cidade))
        return

      const cooldown = restante(cidade.ultimoCrime, 30 * 60 * 1000)
      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      if (Number(cidade.energia || 0) < 20)
        return ctx.reply(mensagem(ctx, '😴', 'Sem energia para o crime', [{ emoji: '⚡', texto: `Energia: ${cidade.energia}%` }]))

      const temVeiculo = Boolean(cidade.veiculo)
      const capacete = Number(usuario.inventario?.capacete || 0) > 0
      const chance = 42 + (temVeiculo ? 8 : 0) + (capacete ? 3 : 0) - Math.min(12, Math.max(0, Number(cidade.reputacao || 0) / 10))
      const sucesso = Math.random() * 100 < chance

      cidade.ultimoCrime = Date.now()
      cidade.energia = r.limitar(Number(cidade.energia || 0) - 20)

      if (sucesso) {
        const ganho = r.aleatorio(900, 3200)
        usuario.coins = Number(usuario.coins || 0) + ganho
        cidade.reputacao = Number(cidade.reputacao || 0) - r.aleatorio(2, 5)
        tocarRpg(ctx, 6)
        r.salvar(ctx)

        return ctx.reply(mensagem(ctx, '🕶️', 'Assalto concluído', [
          { emoji: '💰', texto: `+${dinheiro(ganho)}` },
          { emoji: '⭐', texto: `Reputação: ${cidade.reputacao}` },
          { emoji: '🚔', texto: temVeiculo ? 'Fuga concluída usando seu veículo' : 'Você escapou pelas ruas da cidade' },
          { emoji: '⚡', texto: `Energia: ${cidade.energia}%` }
        ]))
      }

      const multa = Math.min(Number(usuario.coins || 0), r.aleatorio(500, 1800))
      const minutos = r.aleatorio(4, 12)
      usuario.coins = Math.max(0, Number(usuario.coins || 0) - multa)
      cidade.reputacao = Number(cidade.reputacao || 0) - r.aleatorio(3, 6)
      cidade.presoAte = Date.now() + minutos * 60 * 1000
      cidade.saude = r.limitar(Number(cidade.saude || 0) - r.aleatorio(2, 10))
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🚨', 'Assalto falhou', [
        { emoji: '👮', texto: 'Você foi pego pela polícia' },
        { emoji: '💸', texto: `Multa: -${dinheiro(multa)}` },
        { emoji: '⭐', texto: `Reputação: ${cidade.reputacao}` },
        { emoji: '🔒', texto: `Preso por ${minutos} minutos` }
      ]))
    }

    if (comando === 'fiancacidade') {
      if (Number(cidade.presoAte || 0) <= Date.now()) {
        cidade.presoAte = 0
        r.salvar(ctx)
        return ctx.reply(mensagem(ctx, '🔓', 'Você está livre', [{ emoji: '✅', texto: 'Não existe fiança pendente' }]))
      }

      const minutos = Math.ceil((cidade.presoAte - Date.now()) / 60000)
      const custo = Math.max(500, minutos * 220)

      if (Number(usuario.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, usuario.coins))

      usuario.coins -= custo
      cidade.presoAte = 0
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🔓', 'Fiança paga', [
        { emoji: '💸', texto: `Custo: ${dinheiro(custo)}` },
        { emoji: '🚪', texto: 'Você deixou a prisão' }
      ]))
    }

    if (['corridacidade', 'apostacidade'].includes(comando)) {
      if (!exigirLivre(ctx, cidade))
        return

      const veiculoId = idObjeto(cidade.veiculo)
      const veiculo = r.CIDADE_VEICULOS[veiculoId]

      if (!veiculo)
        return ctx.reply(mensagem(ctx, '🏁', 'Você precisa de um veículo', [{ emoji: '📌', texto: `Use ${ctx.prefix}lojaveiculos` }]))

      const cooldown = restante(cidade.ultimaCorrida, 15 * 60 * 1000)
      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      if (Number(cidade.combustivel || 0) < 8)
        return ctx.reply(mensagem(ctx, '⛽', 'Combustível insuficiente', [{ emoji: '📌', texto: `Use ${ctx.prefix}abastecerveiculo` }]))

      if (Number(cidade.durabilidadeVeiculo || 0) < 20)
        return ctx.reply(mensagem(ctx, '🔧', 'Veículo muito danificado', [{ emoji: '📌', texto: `Use ${ctx.prefix}repararveiculo` }]))

      const aposta = Math.max(100, Math.min(5000, valorDoTexto(ctx.q) || 500))
      if (Number(usuario.coins || 0) < aposta)
        return ctx.reply(ctx.mess.coinsSemSaldo(aposta, usuario.coins))

      const chance = Math.min(88, Math.max(42, veiculo.velocidade * 0.62 + Number(cidade.durabilidadeVeiculo || 0) * 0.2 - 20))
      const venceu = Math.random() * 100 < chance
      const dano = r.aleatorio(4, 10)

      usuario.coins -= aposta
      cidade.combustivel = Math.max(0, Number(cidade.combustivel || 0) - 8)
      cidade.durabilidadeVeiculo = r.limitar(Number(cidade.durabilidadeVeiculo || 0) - dano)
      cidade.ultimaCorrida = Date.now()

      if (venceu) {
        usuario.coins += aposta * 2
        cidade.reputacao = Number(cidade.reputacao || 0) + 2
        tocarRpg(ctx, 10)
      }
      else {
        cidade.reputacao = Number(cidade.reputacao || 0) - 1
      }

      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, venceu ? '🏆' : '🏁', venceu ? 'Vitória na corrida' : 'Corrida perdida', [
        { emoji: veiculo.emoji, texto: veiculo.nome },
        { emoji: venceu ? '💰' : '💸', texto: `${venceu ? '+' : '-'}${dinheiro(aposta)}` },
        { emoji: '⛽', texto: `Combustível: ${cidade.combustivel}L` },
        { emoji: '🔧', texto: `Durabilidade: ${cidade.durabilidadeVeiculo}%` }
      ]))
    }

    if (comando === 'pescacidade') {
      if (!exigirLivre(ctx, cidade))
        return

      if (Number(usuario.inventario?.vara || 0) <= 0) {
        return ctx.reply(mensagem(ctx, '🎣', 'Você precisa de uma vara', [
          { emoji: '🛍️', texto: `Compre em ${ctx.prefix}lojacidade` }
        ]))
      }

      const cooldown = restante(cidade.ultimaPesca, 5 * 60 * 1000)
      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      if (Number(cidade.energia || 0) < 8)
        return ctx.reply(mensagem(ctx, '😴', 'Energia insuficiente', [{ emoji: '⚡', texto: `Energia: ${cidade.energia}%` }]))

      const peixe = r.sortearPonderado(r.CIDADE_PEIXES)
      const pesoDecimos = r.aleatorio(peixe.peso[0], peixe.peso[1])
      const peso = pesoDecimos / 10
      const valor = Math.max(50, Math.floor(peso * peixe.valorKg))
      const id = peixe.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')
      const atual = cidade.peixes[id] || { nome: peixe.nome, qtd: 0, valorTotal: 0 }

      atual.qtd += 1
      atual.valorTotal += valor
      cidade.peixes[id] = atual
      cidade.energia = r.limitar(Number(cidade.energia || 0) - 8)
      cidade.ultimaPesca = Date.now()
      tocarRpg(ctx, peixe.raridade === 'Lendário' ? 25 : peixe.raridade === 'Épico' ? 15 : 5)
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🎣', 'Sua pesca', [
        { emoji: peixe.emoji, texto: peixe.nome },
        { emoji: '⚖️', texto: `${peso.toFixed(1).replace('.', ',')} kg` },
        { emoji: '💎', texto: `Raridade: ${peixe.raridade}` },
        { emoji: '💰', texto: `Valor estimado: ${dinheiro(valor)}` },
        { emoji: '🎒', texto: `Guardado no inventário de peixes` }
      ]))
    }

    if (comando === 'venderpeixes') {
      const peixes = Object.values(cidade.peixes || {})
      const quantidade = peixes.reduce((soma, peixe) => soma + Number(peixe.qtd || 0), 0)
      const valor = peixes.reduce((soma, peixe) => soma + Number(peixe.valorTotal || 0), 0)

      if (!quantidade || !valor)
        return ctx.reply(mensagem(ctx, '🎣', 'Sem peixes para vender', [{ emoji: '📌', texto: `Use ${ctx.prefix}pescacidade` }]))

      usuario.coins = Number(usuario.coins || 0) + valor
      cidade.peixes = {}
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '🐟', 'Venda no mercado', [
        { emoji: '🎣', texto: `${quantidade} peixe(s) vendidos` },
        { emoji: '💰', texto: `+${dinheiro(valor)}` },
        { emoji: '🪙', texto: `Saldo: ${dinheiro(usuario.coins)}` }
      ]))
    }

    if (comando === 'buscarcidade') {
      if (!exigirLivre(ctx, cidade))
        return

      const cooldown = restante(cidade.ultimaBusca, 10 * 60 * 1000)
      if (cooldown)
        return ctx.reply(ctx.mess.coinsCooldown(cooldown))

      cidade.ultimaBusca = Date.now()
      cidade.energia = r.limitar(Number(cidade.energia || 0) - 6)
      const sorteio = Math.random()

      if (sorteio < 0.28) {
        const ganho = r.aleatorio(120, 650)
        usuario.coins = Number(usuario.coins || 0) + ganho
        r.salvar(ctx)
        return ctx.reply(mensagem(ctx, '🔎', 'Achado na cidade', [
          { emoji: '💵', texto: `Você encontrou uma carteira com ${dinheiro(ganho)}` },
          { emoji: '⚡', texto: `Energia: ${cidade.energia}%` }
        ]))
      }

      if (sorteio < 0.5) {
        const id = r.escolher(Object.keys(r.CIDADE_ITENS))
        const item = r.CIDADE_ITENS[id]
        adicionarInventario(usuario, id, 1)
        r.salvar(ctx)
        return ctx.reply(mensagem(ctx, '🔎', 'Objeto encontrado', [
          { emoji: item.emoji, texto: item.nome },
          { emoji: '🎒', texto: 'Item adicionado ao inventário' }
        ]))
      }

      if (sorteio < 0.68) {
        const dano = r.aleatorio(4, 14)
        cidade.saude = r.limitar(Number(cidade.saude || 0) - dano)
        r.salvar(ctx)
        return ctx.reply(mensagem(ctx, '🚧', 'Exploração complicada', [
          { emoji: '🤕', texto: `Você sofreu um acidente e perdeu ${dano}% de saúde` },
          { emoji: '❤️', texto: `Saúde: ${cidade.saude}%` }
        ]))
      }

      if (sorteio < 0.84) {
        cidade.reputacao = Number(cidade.reputacao || 0) + 3
        tocarRpg(ctx, 6)
        r.salvar(ctx)
        return ctx.reply(mensagem(ctx, '🤝', 'Boa ação', [
          { emoji: '🧓', texto: 'Você ajudou um morador perdido' },
          { emoji: '⭐', texto: '+3 Reputação' }
        ]))
      }

      r.salvar(ctx)
      return ctx.reply(mensagem(ctx, '🌆', 'Passeio pela cidade', [
        { emoji: '🌙', texto: 'Nada raro apareceu desta vez' },
        { emoji: '⚡', texto: `Energia: ${cidade.energia}%` }
      ]))
    }

    if (comando === 'casarcidade') {
      const acao = primeiro
      const pendente = cidade.casamentoPendente ? ctx.normalizar(cidade.casamentoPendente) : null
      const citado = (ctx.menc_jid2 || [])[0] || ctx.menc_prt
      const alvo = citado ? ctx.normalizar(citado) : null

      if (['aceitar', 'sim'].includes(acao)) {
        const parceiro = pendente || alvo

        if (!parceiro)
          return ctx.reply(mensagem(ctx, '💍', 'Sem pedido pendente', [{ emoji: '📭', texto: 'Ninguém pediu sua mão ainda' }]))

        const outro = r.eco(ctx, parceiro)
        const cidadeOutro = r.normalizarCidade(outro)

        if (cidade.parceiro || cidadeOutro.parceiro)
          return ctx.reply(mensagem(ctx, '💍', 'Casamento indisponível', [{ emoji: '⚠️', texto: 'Um dos dois já possui parceiro' }]))

        cidade.parceiro = parceiro
        cidadeOutro.parceiro = ctx.normalizar(ctx.sender)
        cidade.casamentoPendente = null
        cidadeOutro.casamentoPendente = null
        cidade.reputacao = Number(cidade.reputacao || 0) + 2
        cidadeOutro.reputacao = Number(cidadeOutro.reputacao || 0) + 2
        r.salvar(ctx)

        return ctx.reply(mensagem(ctx, '💍', 'Casamento confirmado', [
          { emoji: '❤️', texto: `@${ctx.sender.split('@')[0]} + @${parceiro.split('@')[0]}` },
          { emoji: '🎉', texto: 'Agora vocês formam um casal na cidade' }
        ]), [ctx.sender, parceiro])
      }

      if (['recusar', 'nao', 'não'].includes(acao)) {
        cidade.casamentoPendente = null
        r.salvar(ctx)
        return ctx.reply(mensagem(ctx, '💔', 'Pedido recusado', [{ emoji: '✅', texto: 'O pedido pendente foi removido' }]))
      }

      if (!alvo || alvo === ctx.normalizar(ctx.sender)) {
        return ctx.reply(mensagem(ctx, '💍', 'Pedido de casamento', [
          { emoji: '📌', texto: `${ctx.prefix}casarcidade @usuario` },
          { emoji: '✅', texto: `${ctx.prefix}casarcidade aceitar` },
          { emoji: '❌', texto: `${ctx.prefix}casarcidade recusar` }
        ]))
      }

      if (cidade.parceiro)
        return ctx.reply(mensagem(ctx, '💍', 'Você já é casado', [{ emoji: '❤️', texto: `Parceiro: @${String(cidade.parceiro).split('@')[0]}` }]), [cidade.parceiro])

      const outro = r.eco(ctx, alvo)
      const cidadeOutro = r.normalizarCidade(outro)

      if (!cidadeOutro.nome)
        return ctx.reply(mensagem(ctx, '🏙️', 'Usuário fora da cidade', [{ emoji: '📌', texto: 'A outra pessoa precisa se registrar primeiro' }]))

      if (cidadeOutro.parceiro)
        return ctx.reply(mensagem(ctx, '💍', 'Essa pessoa já é casada', [{ emoji: '⚠️', texto: 'Escolha outro cidadão' }]))

      cidadeOutro.casamentoPendente = ctx.normalizar(ctx.sender)
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '💌', 'Pedido enviado', [
        { emoji: '💍', texto: `@${ctx.sender.split('@')[0]} pediu @${alvo.split('@')[0]} em casamento` },
        { emoji: '✅', texto: `@${alvo.split('@')[0]} pode usar ${ctx.prefix}casarcidade aceitar` }
      ]), [ctx.sender, alvo])
    }

    if (comando === 'divorciocidade') {
      const parceiro = cidade.parceiro ? ctx.normalizar(cidade.parceiro) : null

      if (!parceiro)
        return ctx.reply(mensagem(ctx, '💔', 'Sem casamento ativo', [{ emoji: '📭', texto: 'Você não possui parceiro na cidade' }]))

      const outro = r.eco(ctx, parceiro)
      const cidadeOutro = r.normalizarCidade(outro)
      cidade.parceiro = null

      if (ctx.normalizar(cidadeOutro.parceiro) === ctx.normalizar(ctx.sender))
        cidadeOutro.parceiro = null

      cidade.reputacao = Number(cidade.reputacao || 0) - 1
      r.salvar(ctx)

      return ctx.reply(mensagem(ctx, '💔', 'Divórcio concluído', [
        { emoji: '👤', texto: `@${ctx.sender.split('@')[0]}` },
        { emoji: '👤', texto: `@${parceiro.split('@')[0]}` },
        { emoji: '📄', texto: 'A união foi encerrada na cidade' }
      ]), [ctx.sender, parceiro])
    }

    if (['rankcidade', 'rankingcidade'].includes(comando)) {
      r.garantir(ctx)
      const lista = Object.entries(ctx.dataGp[0].economia.usuarios)
        .map(([jid, item]) => ({ jid, usuario: item, valor: r.patrimonioCidade(item) }))
        .filter(item => item.usuario.cidade?.nome)
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10)

      return ctx.reply(mensagem(ctx, '🏆', 'Ranking da Cidade', lista.length
        ? lista.map((item, indice) => ({
            emoji: ['🥇', '🥈', '🥉'][indice] || '🏅',
            texto: `${indice + 1}º @${item.jid.split('@')[0]} • ${dinheiro(item.valor)}`
          }))
        : [{ emoji: '📭', texto: 'Nenhum cidadão registrado ainda' }]
      ), lista.map(item => item.jid))
    }

    return ctx.reply(ctx.mess.cidadePerfil(ctx.sender, usuario, r.patrimonioCidade(usuario)), [ctx.sender])
  }
})
