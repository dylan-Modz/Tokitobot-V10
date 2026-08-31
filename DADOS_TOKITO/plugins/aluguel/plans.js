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

const aluguel = require('../../sistemas/aluguel/index')

const moeda = valor => Number(valor || 0).toFixed(2).replace('.', ',')

const lerPlanos = () => {
  const dados = aluguel.ler(aluguel.arquivos.planos, [])
  return Array.isArray(dados) ? dados.filter(item => item && typeof item === 'object') : []
}

const salvarPlanos = planos => { aluguel.salvar(aluguel.arquivos.planos, planos); return planos }

const acharPlano = (planos, numero) => {
  const indice = Number(numero) - 1
  if (!Number.isInteger(indice) || indice < 0 || indice >= planos.length) return null
  return { indice, plano: planos[indice] }
}

const painel = (ctx, planos) => {
  if (!planos.length) return `- ⚠️ \`𝙿𝙻𝙰𝙽𝙾𝚂 𝙳𝙴 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

> *ɴᴀ̃ᴏ ʜᴀ́ ɴᴇɴʜᴜᴍ ᴘʟᴀɴᴏ ᴄᴀᴅᴀsᴛʀᴀᴅᴏ ɴᴏ ᴍᴏᴍᴇɴᴛᴏ.*`

  const lista = planos.map((plano, i) => {
    const descricao = String(plano.descricao || plano.texto || '').trim()
    return `『 \`${i + 1}°\` 』— 📦 ${plano.nome || `Plano ${i + 1}`}
『 💸 \`𝚅𝙰𝙻𝙾𝚁\` 』— R$ ${moeda(plano.preco)}
『 ⏳ \`𝙳𝚄𝚁𝙰𝙲̧𝙰̃𝙾\` 』— ${Number(plano.dias || 0)} dias${descricao ? `\n> ${descricao}` : ''}`
  }).join('\n\n')

  return `- 🛒 \`𝙿𝙻𝙰𝙽𝙾𝚂 𝙳𝙴 𝙰𝙻𝚄𝙶𝚄𝙴𝙻\`

${lista}

> *Para alugar, use ${ctx.prefix}alugarbot link-do-grupo.*`
}

const idPlano = (planos, dias) => {
  const base = `${Number(dias)}d`
  return !planos.some(plano => String(plano.id || '') === base) ? base : `${base}-${Date.now().toString(36).slice(-5)}`
}

const opcaoInvalida = ctx => `- ❌ \`𝙾𝙿𝙲̧𝙰̃𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\`

> *Use ${ctx.prefix}infoplanos para ver como editar os planos.*`

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'plans', comandos: ['plans', 'planos'], categoria: 'aluguel',

  info: {
    descricao: 'Mostra e permite ao dono personalizar os planos de aluguel.', uso: 'plans', categoria: 'aluguel'
  },

  async executar(ctx) {
    const entrada = String(ctx.q || '').trim(), planos = lerPlanos()

    if (!entrada) return ctx.reply(painel(ctx, planos))
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())

    const partes = entrada.split(/\s+/), acao = String(partes.shift() || '').toLowerCase()

    if (acao === 'add') {
      const bruto = entrada.slice(acao.length).trim()
      const [nome, precoTxt, diasTxt, ...descricaoPartes] = bruto.split('|').map(valor => valor.trim())
      const preco = Number(String(precoTxt || '').replace(',', '.')), dias = Number(diasTxt), descricao = descricaoPartes.join('|').trim()

      if (!nome || !Number.isFinite(preco) || preco <= 0 || !Number.isInteger(dias) || dias <= 0) return ctx.reply(opcaoInvalida(ctx))

      if (planos.some(plano => Number(plano.preco) === preco)) return ctx.reply(ctx.mess.padraoAviso({
titulo: 'VALOR EM USO',
descricao: `Já existe um plano com o valor R$ ${moeda(preco)}.`
}))

      planos.push({ id: idPlano(planos, dias), nome, preco, dias, descricao })
      salvarPlanos(planos)

      return ctx.reply(ctx.mess.padraoSucesso({
emoji: '🛒',
titulo: 'PLANO ADICIONADO',
descricao: `${nome} — R$ ${moeda(preco)} • ${dias} dias.`
}))
    }

    const numero = partes.shift(), achado = acharPlano(planos, numero)

    if (!achado) return ctx.reply(ctx.mess.padraoUso({
emoji: '🛒',
titulo: 'PLANO INVÁLIDO',
uso: `${ctx.prefix}plans`,
exemplos: [`${ctx.prefix}infoplanos`],
descricao: 'Confira a numeração dos planos e as opções de edição.'
}))

    const { indice, plano } = achado, valor = partes.join(' ').trim()

    if (acao === 'preco') {
      const novo = Number(String(valor).replace(',', '.'))

      if (!Number.isFinite(novo) || novo <= 0) return ctx.reply(ctx.mess.padraoErro({
titulo: 'PREÇO INVÁLIDO',
descricao: 'Informe um preço válido.'
}))

      if (planos.some((item, i) => i !== indice && Number(item.preco) === novo)) return ctx.reply(ctx.mess.padraoAviso({
titulo: 'VALOR EM USO',
descricao: `Já existe outro plano com o valor R$ ${moeda(novo)}.`
}))

      plano.preco = novo

    } else if (acao === 'nome') {
      if (!valor) return ctx.reply(ctx.mess.padraoErro({
titulo: 'NOME INVÁLIDO',
descricao: 'Informe o novo nome do plano.'
}))

      plano.nome = valor.slice(0, 100)

    } else if (acao === 'dias') {
      const novo = Number(valor)

      if (!Number.isInteger(novo) || novo <= 0) return ctx.reply(ctx.mess.padraoErro({
titulo: 'DIAS INVÁLIDOS',
descricao: 'Informe uma quantidade de dias válida.'
}))

      plano.dias = novo

    } else if (acao === 'texto' || acao === 'descricao') {
      plano.descricao = ['.', '-', 'off'].includes(valor.toLowerCase()) ? '' : valor.slice(0, 600)

    } else if (acao === 'del' || acao === 'delete' || acao === 'remover') {
      const removido = planos.splice(indice, 1)[0]
      salvarPlanos(planos)

      return ctx.reply(ctx.mess.padraoSucesso({
emoji: '🗑️',
titulo: 'PLANO REMOVIDO',
descricao: `${removido.nome || numero} foi removido com sucesso.`
}))

    } else return ctx.reply(opcaoInvalida(ctx))

    salvarPlanos(planos)

    return ctx.reply(ctx.mess.padraoSucesso({
emoji: '🛒',
titulo: 'PLANO ATUALIZADO',
descricao: `${plano.nome || `Plano ${numero}`} foi atualizado com sucesso.`,
detalhe: 'Alteração salva no planos.json.'
}) + `\n\n${painel(ctx, planos)}`)
  }
}
)
