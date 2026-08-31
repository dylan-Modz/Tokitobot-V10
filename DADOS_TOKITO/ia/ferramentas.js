/*
 * Adaptador de ferramentas do Agente Tokito.
 * Author: Dylan Modz
 *
 * O agente usa os plugins reais da base. Textos simples podem ser
 * reaproveitados pela IA para criar uma resposta natural, enquanto
 * mídias e interfaces reais do bot continuam sendo enviadas normalmente.
 */

const textoDe = conteudo => {
  if (!conteudo || typeof conteudo !== 'object') return ''

  return String(
    conteudo.text ||
    conteudo.caption ||
    conteudo?.interactiveMessage?.body?.text ||
    conteudo?.viewOnceMessage?.message?.interactiveMessage?.body?.text ||
    conteudo?.viewOnceMessageV2?.message?.interactiveMessage?.body?.text ||
    ''
  ).trim()
}

const temMidia = conteudo => Boolean(
  conteudo?.image ||
  conteudo?.video ||
  conteudo?.audio ||
  conteudo?.document ||
  conteudo?.sticker ||
  conteudo?.contacts ||
  conteudo?.location ||
  conteudo?.product ||
  conteudo?.poll
)

const temInterface = conteudo => Boolean(
  conteudo?.interactiveMessage ||
  conteudo?.viewOnceMessage?.message?.interactiveMessage ||
  conteudo?.viewOnceMessageV2?.message?.interactiveMessage ||
  conteudo?.buttonsMessage ||
  conteudo?.listMessage ||
  conteudo?.templateMessage ||
  conteudo?.pollCreationMessage ||
  conteudo?.pollCreationMessageV2 ||
  conteudo?.pollCreationMessageV3
)

const cortar = (texto, max = 3500) => {
  return String(texto || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

const parecePedirEntrada = texto => {
  const valor = String(texto || '').toLowerCase()

  return /\b(?:digite|informe|envie|mande|marque|mencione|use\s+[^\n]{0,40}|faltou|necess[aá]rio|obrigat[oó]rio|qual\s+(?:m[uú]sica|n[uú]mero|nome|prefixo|texto|link))\b/i.test(valor)
}

const executar = async (ctx, comando, args = [], opcoes = {}) => {
  const cmd = String(comando || '').trim().toLowerCase()
  const capturas = []

  let midias = 0
  let interfaces = 0

  const guardar = texto => {
    const valor = cortar(texto)

    if (valor && !capturas.includes(valor)) {
      capturas.push(valor)
    }
  }

  const real = ctx.tokito

  const socket = new Proxy(real, {
    get(alvo, prop) {
      if (prop === 'sendMessage') {
        return async (jid, conteudo = {}, options = {}) => {
          if (String(jid) !== String(ctx.from)) {
            return alvo.sendMessage(jid, conteudo, options)
          }

          guardar(textoDe(conteudo))

          if (opcoes.preservarSaida === true || temInterface(conteudo)) {
            interfaces++
            return alvo.sendMessage(jid, conteudo, options)
          }

          if (temMidia(conteudo)) {
            midias++

            const limpo = { ...conteudo }
            delete limpo.caption
            delete limpo.text

            return alvo.sendMessage(jid, limpo, options)
          }

          return {
            key: { id: `TOKITO-AGENT-${Date.now()}` },
            message: conteudo
          }
        }
      }

      if (prop === 'relayMessage') {
        return async (jid, mensagem = {}, options = {}) => {
          if (String(jid) !== String(ctx.from)) {
            return alvo.relayMessage(jid, mensagem, options)
          }

          guardar(textoDe(mensagem))

          if (opcoes.preservarSaida === true || temInterface(mensagem)) {
            interfaces++
            return alvo.relayMessage(jid, mensagem, options)
          }

          return { status: 'captured' }
        }
      }

      const valor = Reflect.get(alvo, prop)
      return typeof valor === 'function' ? valor.bind(alvo) : valor
    }
  })

  const lista = Array.isArray(args)
    ? args.map(valor => String(valor).trim()).filter(Boolean)
    : []

  const q = lista.join(' ')
  const alvo = opcoes.alvo ||
    (ctx.menc_jid2 || [])[0] ||
    ctx.quotedParticipant ||
    null

  const filho = {
    ...ctx,
    tokito: socket,
    command: cmd,
    args: lista,
    q,
    isCmd: true,
    origemIA: true,
    body: `${ctx.prefix}${cmd}${q ? ` ${q}` : ''}`,
    menc_os2: alvo || ctx.menc_os2,
    menc_jid2: alvo ? [alvo] : (ctx.menc_jid2 || []),
    reagir: async () => true,
    reply: async texto => {
      guardar(texto)

      if (opcoes.preservarSaida === true) {
        return real.sendMessage(
          ctx.from,
          { text: String(texto || '') },
          { quoted: ctx.selo }
        )
      }

      return {
        key: { id: `TOKITO-AGENT-REPLY-${Date.now()}` }
      }
    },
    mention: async texto => {
      guardar(texto)
      return {
        key: { id: `TOKITO-AGENT-MENTION-${Date.now()}` }
      }
    },
    botaozin: async texto => {
      guardar(texto)
      return {
        key: { id: `TOKITO-AGENT-BUTTON-${Date.now()}` }
      }
    }
  }

  const encontrado = ctx.plugins?.resolver?.(cmd)

  if (!encontrado) {
    return {
      ok: false,
      code: 'TOOL_NOT_FOUND',
      comando: cmd,
      textos: [],
      midias: 0,
      interfaces: 0,
      needsInput: false
    }
  }

  try {
    const executou = await ctx.plugins.executar(cmd, filho)
    const resumo = capturas.slice(-8).join('\n')

    return {
      ok: executou !== false,
      comando: cmd,
      textos: capturas.slice(-8),
      resumo,
      midias,
      interfaces,
      needsInput: !q && parecePedirEntrada(resumo)
    }
  } catch (error) {
    const resumo = capturas.slice(-8).join('\n')

    return {
      ok: false,
      code: 'TOOL_ERROR',
      comando: cmd,
      textos: capturas.slice(-8),
      resumo,
      midias,
      interfaces,
      needsInput: !q && parecePedirEntrada(resumo),
      erro: String(error?.message || error || 'Erro desconhecido').slice(0, 500)
    }
  }
}

module.exports = {
  executar
}
