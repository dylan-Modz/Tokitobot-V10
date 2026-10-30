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
const headers = ctx => ({
  'x-api-key': h.tokenLikes(ctx),
  'Content-Type': 'application/json'
})

dylan.setCommand({
  nome: 'likes',
  comandos: ['likes'],
  categoria: 'freefire',
  info: {
    descricao: 'Enviar likes manualmente para um UID do Free Fire.',
    uso: 'likes UID'
  },
  async executar(ctx) {
    try {
      const player_id = String(ctx.q || '').trim()
      if (!/^\d{5,24}$/.test(player_id)) return ctx.reply(ctx.mess.ffLikesUso(ctx.prefix))
      await ctx.reagir(ctx.from,'❤️')
      let data
      try {
        const resposta = await ctx.axios.post(ctx.API_URL+'/api/v1/likes',{player_id},
          {headers:headers(ctx),timeout:90000})
        data = resposta.data
      } catch (erro) {
        if (!erro?.response?.data || typeof erro.response.data !== 'object') throw erro
        data = erro.response.data
      }
      const conta = data?.data?.conta || {}
      const likes = data?.data?.likes || {}
      const limite = data?.data?.limite || {}
      const cota = data?.cota || {}
      const uid = String(primeiro(data?.uid,conta?.uid,data?.player_id,player_id))
      const nick = primeiro(data?.nick,conta?.nickname,data?.nickname,'N/A')
      const sucesso = data?.sucesso === true || data?.success === true

      // Resposta com libera_em após um envio confirmado não deve virar erro de espera.
      const adicionadosResposta = numero(primeiro(data?.likes_enviados, data?.data?.likes?.adicionados, data?.likes_added)) ?? 0
      if (emEspera(data) && !(sucesso && adicionadosResposta > 0)) {
        await ctx.reagir(ctx.from,'⏳')
        return ctx.reply(avisoEspera(data,uid))
      }
      if (!sucesso) {
        await ctx.reagir(ctx.from,'❌')
        return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
      }
      const antes = numero(primeiro(data?.likes_antes,likes?.antes,data?.likes_before)) ?? 0
      const enviados = numero(primeiro(data?.likes_enviados,likes?.adicionados,data?.likes_added)) ?? 0
      const depois = numero(primeiro(data?.likes_depois,likes?.depois,data?.likes_end)) ?? 0
      if (enviados <= 0) {
        await ctx.reagir(ctx.from,'⚠️')
        return ctx.reply(ctx.mess.padraoAviso({
          emoji:'❤️',titulo:'NENHUM LIKE ENVIADO',
          descricao:'Nenhum novo like confirmado nesta tentativa.',
          detalhe:h.retornoErro(data)
        }))
      }
      const salvo = salvar(uid,{nick,enviados,depois})
      const t = tempoEspera(data)
      const cotaLimite = numero(primeiro(cota?.limite,limite?.diario,data?.daily_limit))
      const cotaUsada = numero(primeiro(cota?.usadas,limite?.usados_hoje,data?.used_today))
      const cotaRestam = numero(primeiro(cota?.restam,limite?.restantes,data?.remaining_today))
      const texto = [
        '- ❤️ '+crase+'𝙻𝙸𝙺𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴'+crase,'',
        linha('🏷️','ɴɪᴄᴋ',nick),linha('🆔','ᴜɪᴅ',uid),'',
        linha('❤️','ᴀɴᴛᴇs',antes),
        linha('➕','ᴇɴᴠɪᴀᴅᴏs ᴀɢᴏʀᴀ',enviados),
        linha('📈','ᴅᴇᴘᴏɪs',depois),
        linha('📊','ᴛᴏᴛᴀʟ ᴇɴᴠɪᴀᴅᴏ ᴘᴏʀ ᴇsᴛᴇ ʙᴏᴛ',salvo?.total),
        '',linha('📊','ᴄᴏᴛᴀ',cotaLimite === null ? null : (cotaUsada ?? 0)+'/'+cotaLimite),
        linha('📥','ʀᴇsᴛᴀᴍ',cotaRestam),'',
        linha('⏳','ᴘʀᴏ́xɪᴍᴏ ᴇɴᴠɪᴏ',t.restante),
        linha('📅','ʟɪʙᴇʀᴀ ᴇᴍ',t.data),
        linha('🕒','ʜᴏʀᴀ́ʀɪᴏ',t.hora),
        '', '> ❤️ ׄ ( ✅ ʟɪᴋᴇs ᴇɴᴠɪᴀᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ! )'
      ].filter(x => x !== null && x !== undefined).join('\n')
      await ctx.reagir(ctx.from,'✅')
      return ctx.reply(texto)
    } catch (error) {
      console.log('[FREE FIRE LIKES]',ctx.modulos.sanitizarErro(error,[ctx.API_KEY_TOKITO]))
      await ctx.reagir(ctx.from,'❌').catch(()=>{})
      return ctx.reply(ctx.mess.erroApi(ctx.API_URL))
    }
  }
})
