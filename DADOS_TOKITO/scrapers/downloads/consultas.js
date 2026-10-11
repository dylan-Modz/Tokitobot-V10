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

async function executar(ctx, tipo) {
  const busca = limpar(ctx.q, '', 150)
  const exemplos = {
    robloxstalker: 'PixelYoshi',
    wallpaper: 'sukuna',
    noticias: '',
    filme: 'interestelar',
    serie: 'breaking bad'
  }
  const requerBusca = tipo !== 'noticias'
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
    } else if (tipo === 'wallpaper') {
      dados = await consultar('/api/wallpaper-search', { query: busca, limite: 8 })
      lista = Array.isArray(dados?.resultado)
        ? dados.resultado.map(x => ({ imagem: link(x?.imagem || x?.url), titulo: x?.titulo }))
          .filter(x => x.imagem).slice(0, 8)
        : []
      if (!lista.length) return reportar(ctx, '𝚆𝙰𝙻𝙻𝙿𝙰𝙿𝙴𝚁', 'Nenhum wallpaper encontrado.')
      mensagem = inicio('𝚆𝙰𝙻𝙻𝙿𝙰𝙿𝙴𝚁', '🖼️', 'Resultados da pesquisa em álbum.')
      mensagem += campo('Pesquisa', busca, '\n> 🖼️ ' + lista.length + ' imagens encontradas.')
      if (lista.length === 1) {
        await enviar(ctx, mensagem, lista[0].imagem)
      } else {
        const album = await ctx.tokito.sendMessage(ctx.from, {
          album: { expectedImageCount: lista.length, expectedVideoCount: 0 },
          contextInfo: { ...(ctx.newsletter || {}), mentionedJid: ctx.sender ? [ctx.sender] : [] }
        }, { quoted: ctx.selo })
        if (!album?.key) throw new Error('Não foi possível criar o álbum.')
        for (let i = 0; i < lista.length; i++) {
          await ctx.tokito.sendMessage(ctx.from, {
            image: { url: lista[i].imagem },
            caption: i === 0 ? mensagem : undefined,
            albumParentKey: album.key,
            contextInfo: { ...(ctx.newsletter || {}), mentionedJid: ctx.sender ? [ctx.sender] : [] }
          })
          await new Promise(resolve => setTimeout(resolve, 120))
        }
      }
      await reagir(ctx, '✅')
      return
    } else if (tipo === 'noticias') {
      dados = await consultar('/api/noticias', { language: 'pt', country: 'BR' })
      lista = Array.isArray(dados?.resultado) ? dados.resultado.filter(x => x?.titulo).slice(0, 3) : []
      if (!lista.length) return reportar(ctx, '𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂', 'Nenhuma notícia disponível no momento.')
      mensagem = inicio('𝙽𝙾𝚃𝙸́𝙲𝙸𝙰𝚂 𝙳𝙾 𝙳𝙸𝙰', '📰', '🌎 Principais notícias do Brasil.')
      mensagem += lista.map((n, i) => campo('Notícia ' + String(i + 1).padStart(2, '0'), limpar(n.fonte, 'Brasil', 80), '\n> ' + limpar(n.titulo, 'Sem título', 240) + (n.publicado ? '\n> 📅 ' + limpar(n.publicado, '', 50) : '') + (link(n.url) ? '\n> 🔗 ' + link(n.url) : ''))).join('')
      mensagem += campo('Resultado', lista.length + (lista.length === 1 ? ' notícia exibida ✅' : ' notícias exibidas ✅'))
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

    await enviar(ctx, mensagem, foto)
    await reagir(ctx, '✅')
  } catch (e) {
    console.log('[CONSULTA ' + tipo + ']', e?.message || String(e))
    await reagir(ctx, '❌')
    return reportar(ctx, '𝙴𝚁𝚁𝙾 𝙽𝙰 𝙲𝙾𝙽𝚂𝚄𝙻𝚃𝙰', 'A API não conseguiu concluir este pedido. Tente novamente em instantes.')
  }
}
module.exports = { executar }
