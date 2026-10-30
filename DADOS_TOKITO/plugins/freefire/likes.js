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


const fs = require('fs')
const path = require('path')
const runtimeSub = require('../../sub/runtime.js')
const h = require('./base')
const dylan = require('../../database/lib/comandos')

const ARQUIVO = runtimeSub.isSubBot
  ? path.join(runtimeSub.baseDir, 'sistemas', 'likes-envios.json')
  : path.join(__dirname, '..', '..', 'database', 'sistemas', 'likes-envios.json')
const ler = () => {
  try {
    const dados = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'))
    return dados && typeof dados === 'object' && !Array.isArray(dados) ? dados : {}
  } catch { return {} }
}
const salvar = (uid, dados) => {
  try {
    const historico = ler()
    const anterior = historico[uid] || {}
    historico[uid] = {
      nick: dados.nick,
      ultimo: dados.enviados,
      total: (Number(anterior.total) || 0) + dados.enviados,
      perfil: dados.depois,
      horario: new Date().toISOString()
    }
    fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true })
    const temporario = ARQUIVO + '.' + process.pid + '.tmp'
    fs.writeFileSync(temporario, JSON.stringify(historico, null, 2) + '\n')
    fs.renameSync(temporario, ARQUIVO)
    return historico[uid]
  } catch (err) {
    console.log('[LIKES HISTORICO]', err.message)
    return null
  }
}
const primeiro = (...xs) => xs.find(x => x !== null && x !== undefined && x !== '')
const numero = x => {
  if (x === null || x === undefined || x === '') return null
  const v = Number(x)
  return Number.isFinite(v) && v >= 0 ? v : null
}
const limpar = x => String(x ?? '').replace(/\s+/g, ' ').trim()
const crase = String.fromCharCode(96)
const linha = (emoji, nome, valor) => valor === null || valor === undefined || valor === '' 
  ? null : '> ' + emoji + ' ׄ ( ' + nome + ': ' + valor + ' )'
const textoDuracao = segundos => {
  const s = Math.max(0, Math.ceil(Number(segundos) || 0))
  const h = Math.floor(s / 3600)
  const min = Math.floor(s % 3600 / 60)
  const sec = s % 60
  return [h ? h + 'h' : null, min ? min + 'min' : null, !h && !min || sec ? sec + 's' : null].filter(Boolean).join(' ')
}
// A data e o prazo são provenientes exclusivamente da API; nunca presumir 24h.
const tempoEspera = data => {
  const horarioAPI = primeiro(data?.libera_em, data?.data?.libera_em, data?.data?.limite?.libera_em,
    data?.proximo_envio?.quando, data?.data?.proximo_envio?.quando)
  const dateAPI = horarioAPI ? new Date(horarioAPI) : null
  const temDataAPI = dateAPI && Number.isFinite(dateAPI.getTime())
  const segundos = primeiro(numero(data?.libera_em_segundos), numero(data?.data?.libera_em_segundos))
  const texto = limpar(primeiro(data?.tempo_restante, data?.data?.tempo_restante))
  const porSegundos = segundos === undefined ? null : new Date(Date.now() + segundos * 1000)
  const dataFinal = temDataAPI ? dateAPI : porSegundos
  const restante = texto || (segundos !== undefined ? textoDuracao(segundos) :
    dataFinal ? textoDuracao(Math.max(0, (dataFinal.getTime() - Date.now()) / 1000)) : null)
  if (!dataFinal) return { restante, data: null, hora: null }
  return {
    restante,
    data: new Intl.DateTimeFormat('pt-BR', { timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric' }).format(dataFinal),
    hora: new Intl.DateTimeFormat('pt-BR', { timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hour12:false }).format(dataFinal)
  }
}
const emEspera = data => {
  const cod = limpar(primeiro(data?.codigo, data?.code, data?.status, data?.data?.status)).toUpperCase()
  const msg = limpar(primeiro(data?.mensagem, data?.message, data?.erro, data?.error))
  return cod === 'ID_COOLDOWN' || cod === 'AGUARDANDO' ||
    Boolean(primeiro(data?.libera_em,data?.libera_em_segundos,data?.tempo_restante,data?.data?.libera_em,data?.data?.tempo_restante)) ||
    /j[aá]\s+recebeu|j[aá]\s+enviad|recebeu\s+likes|cooldown/i.test(msg)
}
const avisoEspera = (data, uid) => {
  const salvo = ler()[uid]
  const t = tempoEspera(data)
  const motivo = h.mensagemRetorno(data)
  const nome = limpar(primeiro(data?.nick,data?.nickname,data?.data?.conta?.nickname,salvo?.nick))
  const ultimo = primeiro(numero(data?.ultimo_envio?.likes_enviados),
    numero(data?.data?.ultimo_envio?.likes_enviados),numero(data?.likes_ultimo_envio),numero(salvo?.ultimo))
  const perfil = primeiro(numero(data?.likes_depois),numero(data?.data?.likes?.depois),numero(salvo?.perfil))
  return [
    '- ❤️ ' + crase + '𝙻𝙸𝙺𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴' + crase, '',
    linha('🏷️','ɴɪᴄᴋ',nome || null),linha('🆔','ᴜɪᴅ',uid),'',
    linha('❤️','ᴜ́ʟᴛɪᴍᴏ ᴇɴᴠɪᴏ',ultimo === undefined ? 'ɴᴀ̃ᴏ ɪɴғᴏʀᴍᴀᴅᴏ' : ultimo + ' ʟɪᴋᴇs'),
    linha('📊','ᴛᴏᴛᴀʟ ᴇɴᴠɪᴀᴅᴏ ᴘᴏʀ ᴇsᴛᴇ ʙᴏᴛ',salvo?.total === undefined ? null : salvo.total + ' ʟɪᴋᴇs'),
    linha('📈','ʟɪᴋᴇs ɴᴏ ᴘᴇʀғɪʟ (ᴜ́ʟᴛɪᴍᴏ ʀᴇɢɪsᴛʀᴏ)',perfil),
    linha('⚠️','ᴇʀʀᴏ',motivo || h.retornoErro(data)),'',
    linha('⏳','ғᴀʟᴛᴀᴍ',t.restante),
    linha('📅','ʟɪʙᴇʀᴀ ᴇᴍ',t.data),
    linha('🕒','ʜᴏʀᴀ́ʀɪᴏ',t.hora)
  ].filter(x => x !== null && x !== undefined).join('\n')
}
// O mesmo comprovante PNG disponível no histórico da Tokito APIs é enviado
// como foto; a chave fica apenas nos cabeçalhos HTTP, nunca na legenda/URL.
const MAX_RECEIPT_BYTES = 6 * 1024 * 1024
const imagensPng = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

const formatarNumero = valor => {
  const numeroSeguro = numero(valor)
  return numeroSeguro === null ? null : numeroSeguro.toLocaleString('pt-BR')
}
const dataPedido = valor => {
  const raw = String(valor ?? '').trim()
  const data = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw)
  // Não estimar horário, data ou fuso se o serviço não os informou.
  return data ? data[3] + '/' + data[2] + '/' + data[1] : null
}
const texto = valor => {
  if (valor === null || valor === undefined) return null
  const resultado = String(valor).replace(/\s+/g, ' ').trim()
  return resultado || null
}
const legendaEnvio = ({uid, nick, nivel, regiao, antes, enviados, depois, codigo, situacao, data}) => [
  '- ❤️ ' + crase + '𝙻𝙸𝙺𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴' + crase, '',
  linha('🏷️', 'ɴɪᴄᴋ', texto(nick)),
  linha('🆔', 'ᴜɪᴅ', uid),
  linha('⭐', 'ɴɪ́ᴠᴇʟ', formatarNumero(nivel)),
  linha('🌎', 'ʀᴇɢɪᴀ̃ᴏ', texto(regiao)),
  '',
  '- ❤️ ' + crase + '𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾 𝙳𝙾 𝙴𝙽𝚅𝙸𝙾' + crase, '',
  linha('❤️', 'ᴀɴᴛᴇs', formatarNumero(antes)),
  linha('➕', 'ʟɪᴋᴇs ᴇɴᴠɪᴀᴅᴏs', formatarNumero(enviados)),
  linha('📈', 'ᴅᴇᴘᴏɪs', formatarNumero(depois)),
  '',
  '- 🧾 ' + crase + '𝙳𝙰𝙳𝙾𝚂 𝙳𝙾 𝙿𝙴𝙳𝙸𝙳𝙾' + crase, '',
  linha('📦', 'ᴄᴏ́ᴅɪɢᴏ', texto(codigo)),
  linha('📌', 'sɪᴛᴜᴀᴄ̧ᴀ̃ᴏ', texto(situacao)),
  linha('📅', 'ᴅᴀᴛᴀ', dataPedido(data)),
  '',
  '> ❤️ ׄ ( ✅ ʟɪᴋᴇs ᴇɴᴠɪᴀᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ! )'
].filter((item, index, itens) =>
  item !== null && item !== undefined &&
  !(item === '' && (index === 0 || itens[index - 1] === ''))
).join('\n')

// Bloqueia redirecionamentos externos e caminhos que não sejam a imagem real
// de comprovante; nunca passa o token na URL.
const urlComprovante = (valor, apiBase) => {
  if (typeof valor !== 'string' || !valor.trim()) return null
  const base = new URL(apiBase)
  const url = new URL(valor, base)
  if (url.origin !== base.origin || url.protocol !== 'https:' ||
      url.username || url.password || url.search || url.hash ||
      !/^\/api\/v1\/likes\/receipts\/[A-Za-z0-9_-]{1,80}\.png$/.test(url.pathname)) {
    return null
  }
  return url.href
}

dylan.setCommand({
  nome: 'likes',
  comandos: ['likes'],
  categoria: 'freefire',
  info: {
    descricao: 'Enviar Likes Free Fire com comprovante PNG oficial e legenda completa.',
    uso: 'likes UID',
    categoria: 'freefire'
  },
  async executar(ctx) {
    const player_id = String(ctx.q || '').trim()
    if (!/^\d{5,24}$/.test(player_id)) return ctx.reply(ctx.mess.ffLikesUso(ctx.prefix))

    const token = String(h.tokenLikes(ctx) || '').trim()
    if (!token || token === 'TOKEN_LIKE_FF' || token === 'TOKEN_API_TOKITO') {
      return ctx.reply(ctx.mess.ffErro('Configure e ative a chave TOKEN_LIKE_FF no bot.'))
    }

    const base = String(ctx.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')
    const headers = {
      'x-api-key': token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    try {
      await ctx.reagir(ctx.from, '❤️').catch(() => {})
      let data
      try {
        const resposta = await ctx.axios.post(
          base + '/api/v1/likes',
          { player_id, formato: 'pt' },
          { headers, timeout: 100000 }
        )
        data = resposta.data
      } catch (error) {
        if (!error?.response?.data || typeof error.response.data !== 'object') throw error
        data = error.response.data
      }

      const conta = data?.data?.conta || {}
      const antigo = data?.data?.likes || {}
      const uid = String(primeiro(data?.uid, conta?.uid, data?.player_id, player_id))
      const nick = primeiro(data?.nick, conta?.nickname, data?.nickname)
      const antes = primeiro(numero(data?.likes_antes), numero(antigo.antes), numero(data?.likes_before))
      const enviados = primeiro(numero(data?.likes_enviados), numero(antigo.adicionados), numero(data?.likes_added)) ?? 0
      const depois = primeiro(numero(data?.likes_depois), numero(antigo.depois), numero(data?.likes_end))
      const sucesso = data?.sucesso === true || data?.success === true

      if (!sucesso) {
        if (emEspera(data)) {
          await ctx.reagir(ctx.from, '⏳').catch(() => {})
          return ctx.reply(avisoEspera(data, uid))
        }
        await ctx.reagir(ctx.from, '❌').catch(() => {})
        return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
      }

      if (enviados <= 0) {
        await ctx.reagir(ctx.from, '⚠️').catch(() => {})
        return ctx.reply(ctx.mess.padraoAviso({
          emoji: '❤️', titulo: 'NENHUM LIKE ENVIADO',
          descricao: 'Nenhum novo like confirmado nesta tentativa.',
          detalhe: h.retornoErro(data)
        }))
      }

      const pedido = data?.envio || {}
      const codigo = primeiro(data?.codigo, pedido.codigo, data?.orderId)
      const comprovante = primeiro(data?.comprovante, pedido.comprovante)
      const legenda = legendaEnvio({
        uid, nick, nivel: data?.nivel ?? conta?.nivel,
        regiao: primeiro(data?.regiao, data?.region, 'BR'),
        antes, enviados, depois, codigo,
        situacao: primeiro(data?.situacao, 'Concluído'),
        data: primeiro(data?.data, pedido.criado_em, data?.criado_em)
      })

      // Guardar somente depois de a API confirmar novos likes. NÃO repetir
      // POST de envio quando a imagem falhar: poderia duplicar os likes.
      salvar(uid, { nick, enviados, depois })

      // A rota PNG exige a MESMA chave da API de Likes, inclusive para pedidos
      // já concluídos no histórico. A imagem viaja como Buffer pelo WhatsApp.
      try {
        const destino = urlComprovante(comprovante, base)
        if (!destino) throw new Error('Endereço do comprovante inválido ou ausente.')
        const respostaImagem = await ctx.axios.get(destino, {
          headers: { 'x-api-key': token, Accept: 'image/png' },
          responseType: 'arraybuffer',
          timeout: 35000,
          maxRedirects: 0,
          maxContentLength: MAX_RECEIPT_BYTES,
          maxBodyLength: MAX_RECEIPT_BYTES
        })
        const png = Buffer.from(respostaImagem.data || [])
        if (png.length < 8 || png.length > MAX_RECEIPT_BYTES ||
            !png.subarray(0, 8).equals(imagensPng)) {
          throw new Error('O comprovante não retornou uma imagem PNG válida.')
        }
        await ctx.tokito.sendMessage(ctx.from, {
          image: png,
          caption: legenda,
          mimetype: 'image/png'
        }, { quoted: ctx.selo || ctx.info })
        await ctx.reagir(ctx.from, '✅').catch(() => {})
        return true
      } catch (error) {
        // O envio já foi confirmado: informar a falta do PNG sem tratar
        // como falha nos likes e sem tentar enviar os likes novamente.
        console.log('[LIKES COMPROVANTE]', String(error?.message || 'Imagem indisponível').slice(0, 160))
        await ctx.reagir(ctx.from, '⚠️').catch(() => {})
        return ctx.reply(legenda + '\n\n> 🧾 ׄ ( ⚠️ ᴄᴏᴍᴘʀᴏᴠᴀɴᴛᴇ ᴇᴍ ɪᴍᴀɢᴇᴍ ɪɴᴅɪsᴘᴏɴɪ́ᴠᴇʟ ɴᴇsᴛᴀ ᴛᴇɴᴛᴀᴛɪᴠᴀ. )')
      }
    } catch (error) {
      if (ctx.modulos?.sanitizarErro) {
        console.log('[FREE FIRE LIKES]', ctx.modulos.sanitizarErro(error, [token]))
      } else {
        console.log('[FREE FIRE LIKES]', String(error?.message || 'Erro ao consultar a API.').slice(0, 160))
      }
      await ctx.reagir(ctx.from, '❌').catch(() => {})
      return ctx.reply(ctx.mess.erroApi(base))
    }
  }
})
