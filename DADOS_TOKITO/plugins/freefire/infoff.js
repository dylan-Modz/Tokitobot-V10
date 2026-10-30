/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Projeto disponibilizado gratuitamente para a comunidade.
 * É proibida a venda ou revenda deste código-fonte.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

const MAX_PNG = 6 * 1024 * 1024
const REGIOES = new Set(['BR', 'NA', 'SAC', 'US', 'IND', 'ID', 'SG', 'TH', 'VN', 'ME', 'EU', 'TW', 'CIS', 'PK', 'BD'])
const BQ = String.fromCharCode(96)

const texto = value => String(value ?? '').replace(/\s+/g, ' ').trim()
const numero = value => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n.toLocaleString('pt-BR') : null
}
const dataBR = value => {
  const raw = texto(value)
  if (!raw) return null
  const iso = raw.replace(' ', 'T').replace(/\s*UTC$/i, 'Z')
  const date = new Date(iso)
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date)
    : null
}
const linha = (emoji, nome, valor) => valor === null || valor === undefined || valor === ''
  ? null : '> ' + emoji + ' ׄ ( ' + nome + ': ' + valor + ' )'

const secao = (titulo, linhas) => {
  const validas = linhas.filter(Boolean)
  return validas.length ? [titulo, '', ...validas].join('\n') : null
}
const rank = valor => {
  const value = texto(valor)
  return value ? value.replace(/^Nao classificado$/i, 'Não classificado') : null
}

const legenda = (p, uid, regiao) => [
  secao('- 🎮 ' + BQ + '𝙸𝙽𝙵𝙾 𝙳𝙾 𝙹𝙾𝙶𝙰𝙳𝙾𝚁' + BQ, [
    linha('🏷️', 'ɴɪᴄᴋ', texto(p.nick) || null),
    linha('🆔', 'ᴜɪᴅ', texto(p.uid || uid)),
    linha('🌎', 'ʀᴇɢɪᴀ̃ᴏ', texto(p.regiao || regiao)),
    linha('⭐', 'ɴɪ́ᴠᴇʟ', numero(p.nivel)),
    linha('❤️', 'ʟɪᴋᴇs', numero(p.likes))
  ]),
  secao('- 🏆 ' + BQ + '𝚁𝙰𝙽𝙺 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴' + BQ, [
    linha('🎖️', 'ʀᴀɴᴋ ʙʀ', rank(p.rank?.br)),
    linha('📊', 'ᴘᴏɴᴛᴏs ʙʀ', numero(p.rank?.br_pontos)),
    linha('⚔️', 'ʀᴀɴᴋ ᴄs', rank(p.rank?.cs)),
    linha('🏅', 'ᴘᴏɴᴛᴏs ᴄs', numero(p.rank?.cs_pontos))
  ]),
  secao('- 🐾 ' + BQ + '𝙾𝚄𝚃𝚁𝙰𝚂 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂' + BQ, [
    linha('🐶', 'ɴɪ́ᴠᴇʟ ᴅᴏ ᴘᴇᴛ', numero(p.pet?.nivel)),
    linha('🛡️', 'ᴄʀᴇ́ᴅɪᴛᴏ', numero(p.credito?.pontuacao)),
    linha('💎', 'ᴅɪᴀᴍᴀɴᴛᴇs ɢᴀsᴛᴏs', numero(p.diamantes_gastos))
  ]),
  secao('- 📅 ' + BQ + '𝙳𝙰𝙳𝙾𝚂 𝙳𝙰 𝙲𝙾𝙽𝚃𝙰' + BQ, [
    linha('🗓️', 'ᴄʀɪᴀᴅᴀ ᴇᴍ', dataBR(p.conta_criada)),
    linha('🕒', 'ᴜ́ʟᴛɪᴍᴏ ᴀᴄᴇssᴏ', dataBR(p.ultimo_acesso)),
    linha('📝', 'ᴀssɪɴᴀᴛᴜʀᴀ', texto(p.assinatura) || null)
  ]),
  '> ✅ ׄ ( ᴊᴏɢᴀᴅᴏʀ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ! )'
].filter(Boolean).join('\n\n')

function validarBanner(valor, apiUrl) {
  const url = new URL(String(valor || ''))
  const base = new URL(apiUrl)
  if (url.protocol !== 'https:' || url.origin !== base.origin ||
      url.username || url.password || url.search || url.hash ||
      !/^\/b\/\d{1,24}\.[A-Z]{2,3}\.[0-9a-z]{6,8}\.[A-Za-z0-9_-]{16}\.png$/.test(url.pathname)) {
    throw new Error('O endereço do banner retornado pela API é inválido.')
  }
  return url.href
}

dylan.setCommand({
  nome: 'infoff',
  comandos: ['infoff'],
  categoria: 'freefire',
  info: {
    descricao: 'Consulta os dados do Free Fire e envia o banner completo com a legenda.',
    uso: 'infoff UID [REGIAO]',
    categoria: 'freefire'
  },
  async executar(ctx) {
    const partes = texto(ctx.q).split(' ').filter(Boolean)
    const [uid, regiaoDigitada] = partes
    const regiao = (regiaoDigitada || 'BR').toUpperCase()
    if (partes.length > 2 || !/^\d{5,24}$/.test(uid || '') || !REGIOES.has(regiao)) {
      return ctx.reply('- 🎮 ' + BQ + '𝙸𝙽𝙵𝙾 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴' + BQ +
        '\n\n> 📋 ׄ ( ғᴏʀᴍᴀᴛᴏ: ' + ctx.prefix + 'infoff UID )' +
        '\n> 💡 ׄ ( ᴇxᴇᴍᴘʟᴏ: ' + ctx.prefix + 'infoff 32793023 )')
    }
    const token = texto(ctx.API_KEY_TOKITO)
    if (!token || token === 'TOKEN_API_TOKITO') {
      return ctx.reply(ctx.mess.ffErro('Configure o token da sua conta Tokito APIs antes de usar o Info FF.'))
    }

    const api = String(ctx.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')
    try {
      await ctx.reagir(ctx.from, '🔎')
      const response = await ctx.axios.get(api + '/api/v1/player/' + uid, {
        params: { region: regiao },
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
        timeout: 35000
      })
      const info = response.data
      if (!info || info.sucesso !== true || String(info.uid) !== uid) {
        return ctx.reply(ctx.mess.ffErro(info?.mensagem || info?.erro || 'Não foi possível consultar o jogador.'))
      }

      const imageUrl = validarBanner(info.banner, api)
      const imagem = await ctx.axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 35000,
        maxRedirects: 0,
        maxContentLength: MAX_PNG,
        maxBodyLength: MAX_PNG,
        headers: { Accept: 'image/png' }
      })
      const buffer = Buffer.from(imagem.data || [])
      const isPng = buffer.length >= 8 &&
        buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      if (!isPng || buffer.length > MAX_PNG) throw new Error('A imagem PNG do perfil está indisponível.')

      await ctx.tokito.sendMessage(ctx.from, {
        image: buffer,
        caption: legenda(info, uid, regiao),
        mimetype: 'image/png'
      }, { quoted: ctx.selo || ctx.info })
      await ctx.reagir(ctx.from, '✅')
      return true
    } catch (error) {
      const data = error?.response?.data
      const message = data && typeof data === 'object' && !Buffer.isBuffer(data)
        ? (data.mensagem || data.erro) : null
      if (ctx.modulos?.sanitizarErro) {
        console.log('[INFOFF]', ctx.modulos.sanitizarErro(error, [token]))
      } else {
        console.log('[INFOFF] Não foi possível consultar ou enviar a imagem.')
      }
      await ctx.reagir(ctx.from, '❌').catch(() => {})
      return ctx.reply(ctx.mess.ffErro(
        typeof message === 'string' && message.length < 200 ? message :
        'Não foi possível consultar o jogador ou carregar o banner. Confira seu plano e tente novamente.'
      ))
    }
  }
})
