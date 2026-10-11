/* TOKITO BOT V10 • Brasileirao Série A • Author: Dylan Modz */
const axios = require('axios')
const dylan = require('../../database/lib/comandos')
const api = require('../../scrapers/downloads/client')

// Imagem ilustrativa do Boca Notícias; os resultados vêm somente da Tokito APIs.
const CAPA = 'https://images.boca.com.br/upload/imagens-resizes/ae4a7c11b147effb4792d4a8cf0a5eaa_858x483.png'

const texto = (valor, padrao = '—', max = 100) => {
  const limpo = String(valor ?? '').replace(/\s+/g, ' ').trim()
  return limpo ? limpo.slice(0, max) : padrao
}
const numero = valor => {
  if (valor === null || valor === undefined || valor === '') return '—'
  const n = Number(valor)
  return Number.isFinite(n) ? n.toLocaleString('pt-BR') : texto(valor, '—', 16)
}
const saldo = valor => {
  if (valor === null || valor === undefined || valor === '') return '—'
  const n = Number(valor)
  return Number.isFinite(n) ? (n > 0 ? '+' : '') + n : texto(valor, '—', 12)
}
const porcentagem = valor => {
  const s = texto(valor, '—', 16)
  return s === '—' ? s : s.endsWith('%') ? s : s + '%'
}
const codigo = valor => String.fromCharCode(96) + valor + String.fromCharCode(96)
const cabecalho = (titulo, emoji) => '- ' + codigo(titulo) + ' ' + emoji
const reagir = async (ctx, emoji) => {
  try {
    if (typeof ctx.reagir === 'function') await ctx.reagir(ctx.from, emoji)
  } catch {}
}
const timeLinha = (item, indice) => {
  const p = String(item?.posicao ?? indice + 1).padStart(2, '0')
  const nome = texto(item?.nome, 'Time', 55)
  const sigla = texto(item?.sigla, '', 8)
  return [
    '- ' + p + 'º — ' + codigo(nome + (sigla ? ' (' + sigla + ')' : '')),
    '> 🏆 ' + numero(item?.pontos) + ' pts | ⚽ ' + numero(item?.jogos) + ' jogos',
    '> ✅ ' + numero(item?.vitorias) + 'V | 🤝 ' + numero(item?.empates) +
      'E | ❌ ' + numero(item?.derrotas) + 'D',
    '> 🥅 SG: ' + saldo(item?.saldo_gols) +
      ' | 📊 AP: ' + porcentagem(item?.aproveitamento)
  ].join('\n')
}
function montar(info) {
  const tabela = Array.isArray(info?.tabela) ? info.tabela : []
  if (!tabela.length) return ''
  const lider = tabela[0]
  let mensagem = '• ' + codigo('𝙱𝚁𝙰𝚂𝙸𝙻𝙴𝙸𝚁𝙰̃𝙾 𝚂𝙴́𝚁𝙸𝙴 𝙰') + ' ⚽'
  mensagem += '\n> 🏆 ' + texto(info.campeonato, 'Campeonato Brasileiro • Série A', 90)
  mensagem += '\n\n' + cabecalho('𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂', '📋')
  mensagem += '\n> 📅 Temporada: ' + texto(info.temporada, '—', 20)
  mensagem += '\n> 🥇 Líder: ' + texto(lider.nome, '—', 55) +
    ' — ' + numero(lider.pontos) + ' pontos'
  mensagem += '\n> ⚽ Clubes: ' + tabela.length
  mensagem += '\n\n' + cabecalho('𝙲𝙻𝙰𝚂𝚂𝙸𝙵𝙸𝙲𝙰𝙲̧𝙰̃𝙾 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙰', '📊')
  mensagem += '\n\n' + tabela.map(timeLinha).join('\n\n')

  const artilheiros = Array.isArray(info.artilheiros) ? info.artilheiros.slice(0, 3) : []
  if (artilheiros.length) {
    mensagem += '\n\n' + cabecalho('𝙰𝚁𝚃𝙸𝙻𝙷𝙰𝚁𝙸𝙰', '⚽')
    mensagem += '\n' + artilheiros.map((a, i) =>
      '> ' + ['🥇', '🥈', '🥉'][i] + ' ' + texto(a?.jogador, 'Jogador', 55) +
      ' — ' + numero(a?.gols) + ' gols'
    ).join('\n')
  }

  const jogos = Array.isArray(info.rodada_atual) ? info.rodada_atual.slice(0, 10) : []
  if (jogos.length) {
    mensagem += '\n\n' + cabecalho('𝙹𝙾𝙶𝙾𝚂 𝙳𝙰 𝚁𝙾𝙳𝙰𝙳𝙰', '🏟️')
    mensagem += '\n' + jogos.map(j => {
      const confronto = '> ⚽ ' + texto(j?.mandante, 'Time', 45) +
        ' x ' + texto(j?.visitante, 'Time', 45)
      const data = texto(j?.data, '', 30)
      const hora = texto(j?.hora || j?.horario, '', 20)
      const estadio = texto(j?.estadio || j?.estádio, '', 50)
      const extras = [data ? '📅 ' + data : '', hora ? '⏰ ' + hora : '',
        estadio ? '🏟️ ' + estadio : ''].filter(Boolean)
      return confronto + (extras.length ? '\n> ' + extras.join(' | ') : '')
    }).join('\n')
    mensagem += '\n> 🕒 Horários conforme a API'
  }
  return mensagem
}

dylan.setCommand({
  nome: 'brasileirao',
  comandos: ['brasileirao'],
  categoria: 'info',
  info: {
    descricao: 'Mostra a classificação completa do Brasileirão com capa e legenda.',
    uso: 'brasileirao',
    categoria: 'info'
  },
  async executar(ctx) {
    await reagir(ctx, '⚽')
    let resultado
    try {
      const response = await axios.get(api.url('/api/brasileirao'), {
        timeout: 28000,
        validateStatus: () => true
      })
      if (response.status !== 200 || response.data?.status === false) {
        throw new Error('Tokito APIs retornou HTTP ' + response.status)
      }
      resultado = response.data?.resultado
      if (!Array.isArray(resultado?.tabela) || !resultado.tabela.length) {
        await reagir(ctx, '❌')
        return ctx.reply('• ' + codigo('𝙱𝚁𝙰𝚂𝙸𝙻𝙴𝙸𝚁𝙰̃𝙾') +
          ' ⚠️\n> A classificação está indisponível no momento.')
      }
    } catch (error) {
      console.log('[BRASILEIRAO API]', error?.message || String(error))
      await reagir(ctx, '❌')
      return ctx.reply('• ' + codigo('𝙱𝚁𝙰𝚂𝙸𝙻𝙴𝙸𝚁𝙰̃𝙾') +
        ' ⚠️\n> Não foi possível consultar a Tokito APIs agora.')
    }

    const legenda = montar(resultado)
    try {
      // Igual ao /play: UMA imagem com o resultado normal na legenda.
      await ctx.tokito.sendMessage(ctx.from, {
        image: { url: CAPA },
        caption: legenda,
        contextInfo: {
          ...(ctx.newsletter || {}),
          mentionedJid: ctx.sender ? [ctx.sender] : []
        }
      }, { quoted: ctx.selo })
      await reagir(ctx, '✅')
    } catch (error) {
      console.log('[BRASILEIRAO IMAGEM]', error?.message || String(error))
      await reagir(ctx, '⚠️')
      // Se a capa ficar fora do ar, nunca descarta o resultado válido.
      return ctx.reply(legenda)
    }
  }
})

module.exports = { montar, CAPA }
