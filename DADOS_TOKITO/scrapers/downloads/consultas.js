/*
 * TOKITO BOT V10 • Consultas pela Tokito APIs
 * Uso interno dos novos comandos informativos.
 * Author: Dylan Modz
 */
const axios = require('axios')
const api = require('./client')

const limpar = (valor, padrao = 'Não informado', max = 350) => {
  const s = String(valor ?? '').replace(/\s+/g, ' ').trim()
  return s ? s.slice(0, max) : padrao
}
const numero = valor => {
  if (valor === null || valor === undefined || valor === '') return '—'
  const n = Number(valor)
  return Number.isFinite(n) ? n.toLocaleString('pt-BR') : limpar(valor, '—', 40)
}
const link = valor => /^https?:\/\/[^\s]+$/i.test(String(valor || '')) ? String(valor) : ''
const linha = (titulo, valor) => valor !== undefined && valor !== null && String(valor).trim() !== ''
  ? '\n> ' + titulo + ': ' + limpar(valor)
  : ''
const inicio = (titulo, emoji, detalhe) => '• ' + String.fromCharCode(96) + titulo + String.fromCharCode(96) + ' ' + emoji + '\n> ' + detalhe
const campo = (titulo, valor, extra = '') => '\n\n- ' + titulo + ' — ( ' + String.fromCharCode(96) + limpar(valor, '—', 140) + String.fromCharCode(96) + ' )' + extra

async function consultar(rota, params = {}) {
  const url = api.url(rota, params)
  const response = await axios.get(url, { timeout: 28000, validateStatus: () => true })
  const data = response.data
  if (response.status === 404) return null
  if (response.status !== 200) throw new Error('API HTTP ' + response.status)
  if (!data || typeof data !== 'object') throw new Error('Retorno inesperado da API')
  if (data.status === false) {
    const msg = String(data.resultado || data.message || '')
    if (/n[aã]o encontrad|nenhum|nenhuma|inexistente/i.test(msg)) return null
    throw new Error('API indisponível: ' + msg.slice(0, 80))
  }
  return data
}

const reportar = async (ctx, titulo, mensagem) => ctx.reply(
  inicio(titulo, '⚠️', mensagem)
)
const reagir = async (ctx, emoji) => {
  try { if (typeof ctx.reagir === 'function') await ctx.reagir(ctx.from, emoji) } catch {}
}
async function enviar(ctx, texto, imagem) {
  const img = link(imagem)
  if (img && ctx.tokito && typeof ctx.tokito.sendMessage === 'function') {
    try {
      return await ctx.tokito.sendMessage(ctx.from, {
        image: { url: img },
        caption: texto,
        contextInfo: { ...(ctx.newsletter || {}), mentionedJid: ctx.sender ? [ctx.sender] : [] }
      }, { quoted: ctx.selo })
    } catch (e) {
      console.log('[CONSULTA IMAGEM]', e?.message || String(e))
    }
  }
  return ctx.reply(texto)
}

const temas = {
  fantasia: 'fantasy', fantasy: 'fantasy',
  acao: 'action', 'ação': 'action', action: 'action',
  aventura: 'adventure', adventure: 'adventure',
  terror: 'horror', horror: 'horror',
  mitologia: 'mythology', mythology: 'mythology',
  natureza: 'nature', nature: 'nature',
  historico: 'historical', 'histórico': 'historical',
  estrategia: 'strategy', 'estratégia': 'strategy',
  ficcao: 'sci-fi', 'ficção': 'sci-fi', 'sci-fi': 'sci-fi'
}

async function executar(ctx, tipo) {
  const busca = limpar(ctx.q, '', 150)
  const exemplos = {
    robloxstalker: 'PixelYoshi',
    brasileirao: '',
    wallpaper: 'sukuna',
    noticias: '',
    username: 'Yoshi fantasia',
    filme: 'interestelar',
    serie: 'breaking bad'
  }
  const requerBusca = !['brasileirao', 'noticias'].includes(tipo)
  if (requerBusca && !busca) {
    return ctx.reply(inicio('𝙲𝙾𝙼𝙰𝙽𝙳𝙾', '📌', 'Uso: ' + (ctx.prefix || '!') + tipo + ' ' + exemplos[tipo]))
  }
  await reagir(ctx, '🔎')
  try {
    let r, dados, lista, mensagem, foto

    if (tipo === 'robloxstalker') {
      dados = await consultar('/api/roblox-stalker', { username: busca.replace(/^@/, '') })
      r = dados?.resultado
      if (!r || typeof r !== 'object' || Array.isArray(r)) return reportar(ctx, '𝚁𝙾𝙱𝙻𝙾𝚇', 'Usuário não encontrado.')
      const presenca = Number(r.presenca?.userPresenceType || 0)
      const status = presenca === 2 ? 'Jogando 🎮' : presenca === 3 ? 'Roblox Studio 🛠️' : presenca === 1 ? 'Online 🟢' : 'Offline 🔴'
      mensagem = inicio('𝚁𝙾𝙱𝙻𝙾𝚇 𝚂𝚃𝙰𝙻𝙺', '🎮', 'Perfil encontrado com sucesso.')
      mensagem += campo('Usuário', '@' + limpar(r.nome, busca), '\n> Nome de exibição: ' + limpar(r.displayName || r.nome, '—'))
      mensagem += campo('Informações', 'Conta Roblox', '\n> 🆔 ID: ' + limpar(r.userId, '—', 35) + '\n> 👥 Amigos: ' + numero(r.amigos) + '\n> ❤️ Seguidores: ' + numero(r.seguidores) + '\n> 📌 Seguindo: ' + numero(r.seguindo))
      mensagem += campo('Status', status, '\n> ✅ Verificado: ' + (r.verificado ? 'Sim' : 'Não') + '\n> 🚫 Banido: ' + (r.banido ? 'Sim' : 'Não'))
      foto = r.avatar?.headshot || r.avatar?.fullBody || r.avatar?.bust
    } else if (tipo === 'brasileirao') {
      // A imagem vem do Boca Notícias. Todos os números continuam vindo da Tokito APIs.
      const imagemBrasileirao = 'https://images.boca.com.br/upload/imagens-resizes/ae4a7c11b147effb4792d4a8cf0a5eaa_858x483.png'
      dados = await consultar('/api/brasileirao')
      r = dados?.resultado
      if (!r || typeof r !== 'object' || Array.isArray(r)) {
        return reportar(ctx, '𝙱𝚁𝙰𝚂𝙸𝙻𝙴𝙸𝚁𝙰̃𝙾', 'Classificação indisponível.')
      }
      lista = Array.isArray(r.tabela) ? r.tabela : []
      if (!lista.length) {
        return reportar(ctx, '𝙱𝚁𝙰𝚂𝙸𝙻𝙴𝙸𝚁𝙰̃𝙾', 'Nenhum dado da classificação foi encontrado.')
      }

      const lider = lista[0]
      const pontuacao = valor => valor == null || valor === '' ? '—' : numero(valor)
      const golsSaldo = valor => {
        if (valor === null || valor === undefined || valor === '') return '—'
        const n = Number(valor)
        return Number.isFinite(n) ? (n > 0 ? '+' : '') + String(n) : limpar(valor, '—', 16)
      }
      const porcentagem = valor => {
        if (valor === null || valor === undefined || valor === '') return '—'
        const texto = limpar(valor, '—', 24)
        return texto === '—' ? texto : texto.endsWith('%') ? texto : texto + '%'
      }
      const detalhesTime = (time, indice) => {
        const posicao = limpar(time?.posicao, String(indice + 1), 4)
        const nome = limpar(time?.nome, 'Time', 60)
        const sigla = limpar(time?.sigla, '', 10)
        const clube = nome + (sigla ? ' (' + sigla + ')' : '')
        return [
          '- ' + posicao.padStart(2, '0') + 'º — ' + String.fromCharCode(96) + clube + String.fromCharCode(96),
          '> 🏆 ' + pontuacao(time?.pontos) + ' pontos | ⚽ ' + pontuacao(time?.jogos) + ' jogos',
          '> ✅ ' + pontuacao(time?.vitorias) + ' vitórias | 🤝 ' + pontuacao(time?.empates) + ' empates | ❌ ' + pontuacao(time?.derrotas) + ' derrotas',
          '> 🥅 Saldo: ' + golsSaldo(time?.saldo_gols) + ' | 📊 Aproveitamento: ' + porcentagem(time?.aproveitamento)
        ].join('\n')
      }
      mensagem = inicio(
        '𝙱𝚁𝙰𝚂𝙸𝙻𝙴𝙸𝚁𝙰̃𝙾 𝚂𝙴́𝚁𝙸𝙴 𝙰', '⚽',
        '🏆 ' + limpar(r.campeonato, 'Campeonato Brasileiro • Série A', 90)
      )
      mensagem += '\n\n- ' + String.fromCharCode(96) + '𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂' + String.fromCharCode(96) + ' 📋'
      mensagem += '\n> 📅 Temporada: ' + limpar(r.temporada, '—', 30)
      mensagem += '\n> 🥇 Líder: ' + limpar(lider?.nome, '—', 60) + ' — ' + pontuacao(lider?.pontos) + ' pontos'
      mensagem += '\n> ⚽ Times participantes: ' + lista.length
      mensagem += '\n\n- ' + String.fromCharCode(96) + '𝙲𝙻𝙰𝚂𝚂𝙸𝙵𝙸𝙲𝙰𝙲̧𝙰̃𝙾 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙰' + String.fromCharCode(96) + ' 📊'
      mensagem += '\n\n' + lista.map(detalhesTime).join('\n\n')

      const artilheiros = Array.isArray(r.artilheiros) ? r.artilheiros.slice(0, 3) : []
      if (artilheiros.length) {
        mensagem += '\n\n- ' + String.fromCharCode(96) + '𝙰𝚁𝚃𝙸𝙻𝙷𝙰𝚁𝙸𝙰' + String.fromCharCode(96) + ' ⚽'
        mensagem += '\n' + artilheiros.map((j, i) =>
          '> ' + ['🥇', '🥈', '🥉'][i] + ' ' + limpar(j?.jogador, 'Jogador', 70) +
          ' — ' + pontuacao(j?.gols) + ' gols'
        ).join('\n')
      }

      const jogos = Array.isArray(r.rodada_atual) ? r.rodada_atual.slice(0, 10) : []
      if (jogos.length) {
        mensagem += '\n\n- ' + String.fromCharCode(96) + '𝙹𝙾𝙶𝙾𝚂 𝙳𝙰 𝚁𝙾𝙳𝙰𝙳𝙰' + String.fromCharCode(96) + ' 🏟️'
        mensagem += '\n' + jogos.map(jogo => {
          const confronto = '> ⚽ ' + limpar(jogo?.mandante, 'Time', 50) +
            ' x ' + limpar(jogo?.visitante, 'Time', 50)
          const data = limpar(jogo?.data, '', 35)
          const hora = limpar(jogo?.hora || jogo?.horario, '', 20)
          const detalhes = [data ? '📅 ' + data : '', hora ? '⏰ ' + hora : ''].filter(Boolean)
          return confronto + (detalhes.length ? '\n> ' + detalhes.join(' | ') : '')
        }).join('\n')
      }
      // Como no V9: foto de capa + legenda com toda a tabela no estilo atual.
      foto = imagemBrasileirao
    } else if (tipo === 'wallpaper') {
      dados = await consultar('/api/wallpaper-search', { query: busca, limite: 5 })
      lista = Array.isArray(dados?.resultado) ? dados.resultado.filter(x => link(x?.imagem)).slice(0, 5) : []
      if (!lista.length) return reportar(ctx, '𝚆𝙰𝙻𝙻𝙿𝙰𝙿𝙴𝚁', 'Nenhuma imagem encontrada.')
      mensagem = inicio('𝚆𝙰𝙻𝙻𝙿𝙰𝙿𝙴𝚁', '🖼️', 'Imagem encontrada com sucesso.')
      mensagem += campo('Pesquisa', busca, '\n> 🖼️ Resultado: 1 de ' + lista.length)
      mensagem += campo('Imagem', 'Disponível ✅', '\n> Wallpaper enviado com sucesso.')
      // Em caso de falha ao baixar a primeira imagem, tenta as outras.
      for (const item of lista) {
        try {
          if (ctx.tokito && typeof ctx.tokito.sendMessage === 'function') {
            await ctx.tokito.sendMessage(ctx.from, {
              image: { url: item.imagem },
              caption: mensagem,
              contextInfo: { ...(ctx.newsletter || {}), mentionedJid: ctx.sender ? [ctx.sender] : [] }
            }, { quoted: ctx.selo })
            await reagir(ctx, '✅')
            return
          }
        } catch (e) { console.log('[WALLPAPER IMAGEM]', e?.message || String(e)) }
      }
      mensagem = inicio('𝚆𝙰𝙻𝙻𝙿𝙰𝙿𝙴𝚁', '🖼️', 'Imagem encontrada, mas o envio da mídia falhou.')
      mensagem += campo('Imagem', lista[0].imagem)
    } else if (tipo === 'noticias') {
      dados = await consultar('/api/noticias', { language: 'pt', country: 'BR' })
      lista = Array.isArray(dados?.resultado) ? dados.resultado.filter(x => x?.titulo).slice(0, 3) : []
      if (!lista.length) return reportar(ctx, '𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂', 'Nenhuma notícia disponível no momento.')
      mensagem = inicio('𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 𝙳𝙾 𝙳𝙸𝙰', '📰', '🌎 Principais notícias do Brasil.')
      mensagem += lista.map((n, i) => campo('Notícia ' + String(i + 1).padStart(2, '0'), limpar(n.fonte, 'Brasil', 80), '\n> ' + limpar(n.titulo, 'Sem título', 240) + (n.publicado ? '\n> 📅 ' + limpar(n.publicado, '', 50) : '') + (link(n.url) ? '\n> 🔗 ' + link(n.url) : ''))).join('')
      mensagem += campo('Resultado', lista.length + (lista.length === 1 ? ' notícia exibida ✅' : ' notícias exibidas ✅'))
    } else if (tipo === 'username') {
      const parts = busca.split(/\s+/)
      const last = parts.at(-1).toLowerCase()
      const tema = temas[last] || 'fantasy'
      const nome = temas[last] && parts.length > 1 ? parts.slice(0, -1).join(' ') : busca
      dados = await consultar('/api/username-generator', { name: nome, theme: tema, mode: 'instans' })
      lista = Array.isArray(dados?.resultado) ? dados.resultado.slice(0, 5) : []
      if (!lista.length) return reportar(ctx, '𝙽𝙸𝙲𝙺𝚂', 'Nenhum nome foi gerado.')
      mensagem = inicio('𝙽𝙸𝙲𝙺𝚂 𝙶𝙴𝚁𝙰𝙳𝙾𝚂', '✨', 'Seus nomes foram gerados.')
      mensagem += campo('Nome base', nome, '\n> 🎨 Tema: ' + limpar(temas[last] ? last : 'fantasia', '', 60))
      mensagem += campo('Sugestões', lista.length + ' nomes', '\n' + lista.map((n, i) => '> ' + String(i + 1).padStart(2, '0') + '. ' + limpar(typeof n === 'string' ? n : n?.username || n?.name || n?.nome, '—', 70)).join('\n'))
      mensagem += campo('Resultado', lista.length + ' nomes gerados ✅')
    } else if (tipo === 'filme' || tipo === 'serie') {
      dados = await consultar(tipo === 'filme' ? '/api/filme' : '/api/serie', { query: busca, limite: 5 })
      lista = Array.isArray(dados?.resultado) ? dados.resultado : []
      if (!lista.length) return reportar(ctx, tipo === 'filme' ? '𝙵𝙸𝙻𝙼𝙴' : '𝚂𝙴́𝚁𝙸𝙴', 'Nenhum resultado encontrado.')
      r = lista[0]
      mensagem = inicio(tipo === 'filme' ? '𝙵𝙸𝙻𝙼𝙴 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾' : '𝚂𝙴́𝚁𝙸𝙴 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰', tipo === 'filme' ? '🎬' : '📺', 'Resultado encontrado com sucesso.')
      mensagem += campo('Título', limpar(r.titulo, busca), '\n> 📅 Lançamento: ' + limpar(r.ano, '—', 40))
      if (r.elenco && r.elenco !== 'Não informado') mensagem += campo('Elenco', 'Atores principais', '\n> ' + limpar(r.elenco, '', 220))
      if (r.generos && r.generos !== 'Não informado') mensagem += campo('Gêneros', limpar(r.generos, '', 150))
      mensagem += campo('Informações', tipo === 'filme' ? 'Cinema 🎞️' : 'Televisão 📺', '\n> 🎥 Tipo: ' + (tipo === 'filme' ? 'Filme' : 'Série') + (r.id ? '\n> 🆔 ID: ' + limpar(r.id, '', 60) : ''))
      if (r.nota && r.nota !== 'Não informado') mensagem += '\n> ⭐ Nota: ' + limpar(r.nota, '', 20)
      if (r.descricao && r.descricao !== 'Não informado') mensagem += campo('Sinopse', limpar(r.descricao, '', 420))
      if (link(r.link)) mensagem += campo('Link', 'Ver informações 🔗', '\n> ' + link(r.link))
      foto = r.imagem
    } else {
      throw new Error('Tipo de consulta desconhecido: ' + tipo)
    }

    if (tipo === 'brasileirao') {
      // A imagem vai primeiro. A classificação completa sai em texto separado,
      // sem risco de extrapolar o limite de legenda do WhatsApp.
      if (link(foto) && ctx.tokito && typeof ctx.tokito.sendMessage === 'function') {
        try {
          await ctx.tokito.sendMessage(ctx.from, {
            image: { url: foto },
            caption: inicio('𝙱𝚁𝙰𝚂𝙸𝙻𝙴𝙸𝚁𝙰̃𝙾 𝚂𝙴́𝚁𝙸𝙴 𝙰', '⚽',
              '🏆 Confira a classificação completa na próxima mensagem.'),
            contextInfo: {
              ...(ctx.newsletter || {}),
              mentionedJid: ctx.sender ? [ctx.sender] : []
            }
          }, { quoted: ctx.selo })
        } catch (e) {
          console.log('[BRASILEIRÃO CAPA]', e?.message || String(e))
        }
      }
      await ctx.reply(mensagem)
    } else {
      await enviar(ctx, mensagem, foto)
    }
    await reagir(ctx, '✅')
  } catch (e) {
    console.log('[CONSULTA ' + tipo + ']', e?.message || String(e))
    await reagir(ctx, '❌')
    return reportar(ctx, '𝙴𝚁𝚁𝙾 𝙽𝙰 𝙲𝙾𝙽𝚂𝚄𝙻𝚃𝙰', 'A API não conseguiu concluir este pedido. Tente novamente em instantes.')
  }
}
module.exports = { executar }
