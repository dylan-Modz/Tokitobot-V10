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
const dylan = require('../../database/lib/comandos')
const runtimeSub = require('../../sub/runtime.js')
const canalOficial = require('../../sistemas/canal-oficial')

const JID_CANAL = /^\d{8,25}@newsletter$/i
const TOKEN_CANAL = /^[A-Za-z0-9_-]{15,128}$/
const LINK_CANAL = /^https?:\/\/(?:www\.)?(?:whatsapp\.com|wa\.me)\/channel\/([A-Za-z0-9_-]{15,128})\/?(?:[?#][^\s]*)?$/i
const INATIVO = '0@newsletter'
const TEMPO_CONSULTA = 5000

const normalizarJid = valor => {
  const texto = String(valor || '').trim()
  if (JID_CANAL.test(texto)) return texto.toLowerCase()
  if (/^\d{8,25}$/.test(texto)) return texto + '@newsletter'
  return ''
}

const normalizarLink = valor => {
  const match = String(valor || '').trim().match(LINK_CANAL)
  if (!match) return ''
  const url = 'https://whatsapp.com/channel/' + match[1]
  return canalOficial.link({ channel: url, channeldl: INATIVO }) || url
}

const lerEntrada = texto => {
  const valor = String(texto || '').trim()
  if (!valor || /[\r\n]/.test(valor)) return null
  const partes = valor.split(/\s+/)
  if (partes.length > 2) return null
  const primeiro = partes[0]
  const jid = normalizarJid(primeiro)
  if (jid) {
    const link = partes[1] ? normalizarLink(partes[1]) : ''
    return partes[1] && !link ? null : { jid, link }
  }
  if (partes.length !== 1) return null
  const link = normalizarLink(primeiro) ||
    (TOKEN_CANAL.test(primeiro) ? normalizarLink('https://whatsapp.com/channel/' + primeiro) : '')
  return link ? { jid: '', link } : null
}

// Recupera o canal de uma mensagem realmente encaminhada e citada pelo dono.
// Não copia serverMessageId: ele identifica uma postagem, não o canal inteiro.
const canalCitado = ctx => {
  const quoted = ctx.ctxMsg?.quotedMessage ||
    ctx.info?.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
    ctx.mensagem?.extendedTextMessage?.contextInfo?.quotedMessage || {}
  const candidatos = [
    quoted.extendedTextMessage?.contextInfo?.forwardedNewsletterMessageInfo,
    quoted.imageMessage?.contextInfo?.forwardedNewsletterMessageInfo,
    quoted.videoMessage?.contextInfo?.forwardedNewsletterMessageInfo,
    quoted.documentMessage?.contextInfo?.forwardedNewsletterMessageInfo
  ]
  for (const item of candidatos) {
    const jid = normalizarJid(item?.newsletterJid)
    if (!jid) continue
    const nome = String(item.newsletterName || '').trim().slice(0, 120)
    const serverMessageId = Number(item.serverMessageId)
    return {
      jid, nome,
      serverMessageId: Number.isSafeInteger(serverMessageId) && serverMessageId > 0 && serverMessageId <= 2147483647
        ? serverMessageId : null
    }
  }
  return null
}

const salvarConfig = (ctx, alteracoes) => {
  const proxima = { ...ctx.setting, ...alteracoes }
  if (runtimeSub.isSubBot) {
    runtimeSub.updateSubConfig({
      channel: proxima.channel,
      channelLink: proxima.channelLink,
      channelName: proxima.channelName,
      channelServerMessageId: proxima.channelServerMessageId
    })
  } else {
    const arquivo = runtimeSub.GLOBAL_CONFIG
    const temp = arquivo + '.' + process.pid + '.tmp'
    try {
      fs.writeFileSync(temp, JSON.stringify(proxima, null, 2) + '\n')
      fs.renameSync(temp, arquivo)
    } finally {
      try { fs.rmSync(temp, { force: true }) } catch {}
    }
  }
  Object.assign(ctx.setting, alteracoes)
}

const consultarJid = async (tokito, token) => {
  if (typeof tokito?.newsletterMetadata !== 'function') return ''
  let timer
  try {
    const consulta = Promise.resolve().then(() => tokito.newsletterMetadata('invite', token))
    const limite = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('TIMEOUT_CANAL')), TEMPO_CONSULTA)
      timer.unref?.()
    })
    const meta = await Promise.race([consulta, limite])
    return normalizarJid(meta?.jid || meta?.id || meta?.result?.jid || meta?.result?.id)
  } catch {
    console.warn('[SETCHANNEL] Consulta de metadados indisponível; mantendo o link direto.')
    return ''
  } finally {
    if (timer) clearTimeout(timer)
  }
}

dylan.setCommand({
  nome: 'channel',
  comandos: ['channel', 'setchannel'],
  categoria: 'dono',
  info: {
    descricao: 'Configura o link ou JID do canal utilizado pelo bot.',
    uso: 'setchannel link | setchannel JID | setchannel 0',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())
    const entrada = String(ctx.q || '').trim()
    if (!entrada) return ctx.reply(ctx.mess.channelRequired(ctx.prefix, ctx.command))

    if (entrada === '0') {
      try {
        salvarConfig(ctx, { channeldl: INATIVO, channel: INATIVO, channelLink: '', channelName: '', channelServerMessageId: null })
        return ctx.reply(ctx.mess.channelDisabled())
      } catch (e) {
        console.warn('[SETCHANNEL] Falha ao desativar:', e?.code || 'erro')
        return ctx.reply(ctx.mess.padraoErro({
          titulo: 'ERRO AO DESATIVAR CANAL',
          descricao: 'Não foi possível salvar a configuração. Tente novamente.'
        }))
      }
    }

    const pedido = lerEntrada(entrada)
    if (!pedido) return ctx.reply(ctx.mess.padraoUso({
      emoji: '📢',
      titulo: 'LINK DO CANAL INVÁLIDO',
      uso: ctx.prefix + 'setchannel https://whatsapp.com/channel/CODIGO',
      descricao: 'Informe o link do canal, um JID @newsletter ou 0 para desativar.'
    }))

    const citado = canalCitado(ctx)
    // Para associar uma postagem ao link é necessário confirmar seu JID.
    // Não associar uma mensagem citada de outro canal ao link informado.
    let jid = pedido.jid
    if (!jid && pedido.link) jid = await consultarJid(ctx.tokito, pedido.link.split('/').pop())
    const link = pedido.link
    const mesmaOrigem = Boolean(jid && citado?.jid === jid)
    const nome = mesmaOrigem ? citado.nome : ''
    const channelServerMessageId = mesmaOrigem ? citado.serverMessageId : null

    try {
      salvarConfig(ctx, {
        channeldl: jid || INATIVO,
        channel: jid || link,
        channelLink: link,
        channelName: nome,
        channelServerMessageId
      })
      // Na V10.3.41 basta o JID real: não exigir ID de postagem citada.
      return ctx.reply(jid
        ? ctx.mess.channelEnabled(jid, link || jid)
        : ctx.mess.channelLinkEnabled(link))
    } catch (e) {
      console.warn('[SETCHANNEL] Falha ao gravar:', e?.code || 'erro')
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'ERRO AO SALVAR CANAL',
        descricao: 'Não foi possível gravar a configuração do canal.'
      }))
    }
  }
})
