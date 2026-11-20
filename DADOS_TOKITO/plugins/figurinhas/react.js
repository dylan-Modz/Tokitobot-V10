/*
 * TOKITO BOT V10 — REAÇÃO COM FIGURINHA
 * Recurso experimental: depende do cliente WhatsApp aceitar STICKER_ANNOTATION.
 * Author: Dylan Modz
 */

const fs = require('fs')
const path = require('path')
const { randomBytes } = require('crypto')
const { proto, prepareWAMessageMedia, generateWAMessageFromContent, jidNormalizedUser } = require('@stone-wpp/ofc')
const dylan = require('../../database/lib/comandos')

const arquivo = path.join(__dirname, '..', '..', 'database', 'sistemas', 'figreact.webp')
const meta = path.join(__dirname, '..', '..', 'database', 'sistemas', 'figreact.json')
const ativos = new Set()
const lerMeta = () => { try { return JSON.parse(fs.readFileSync(meta, 'utf8')) } catch { return {} } }
const espera = ms => new Promise(resolve => setTimeout(resolve, ms))
const marcado = ctx => ctx.ctxMsg?.quotedMessage?.stickerMessage || ctx.mensagem?.stickerMessage
const jid = valor => {
  try { return jidNormalizedUser(String(valor || '')) } catch { return String(valor || '') }
}
const aviso = (ctx, titulo, descricao) => ctx.reply(ctx.mess.padraoAviso({ emoji: '🧊', titulo, descricao }))
const erro = (ctx, titulo, descricao) => ctx.reply(ctx.mess.padraoErro({ titulo, descricao }))
const sucesso = (ctx, titulo, descricao) => ctx.reply(ctx.mess.padraoSucesso({ emoji: '🧊', titulo, descricao }))

dylan.setCommand({
  nome: 'react',
  comandos: ['react', 'rgreact', 'delreact', 'verreact'],
  categoria: 'dono',
  info: {
    descricao: 'Registra uma figurinha e tenta reagir a mensagens usando STICKER_ANNOTATION.',
    uso: 'rgreact | react 1-10 | verreact | delreact',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())

    try {
      if (ctx.command === 'rgreact') {
        if (ativos.size) return aviso(ctx, 'REAÇÃO EM ANDAMENTO', 'Aguarde o envio atual terminar.')
        const st = marcado(ctx)
        if (!st) return ctx.reply(ctx.mess.padraoUso({
          emoji: '🧊', titulo: 'REGISTRAR REAÇÃO',
          uso: `${ctx.prefix}rgreact`,
          descricao: 'Responda à figurinha que deseja utilizar nas reações.'
        }))
        if (st.isLottie) return aviso(ctx, 'FIGURINHA NÃO SUPORTADA', 'Use uma figurinha WebP comum.')
        const dados = await ctx.getFileBuffer(st, 'sticker')
        if (!Buffer.isBuffer(dados) || !dados.length || dados.length > 1024 * 1024 ||
          dados.toString('ascii', 0, 4) !== 'RIFF' || dados.toString('ascii', 8, 12) !== 'WEBP') {
          return erro(ctx, 'FIGURINHA INVÁLIDA', 'Não consegui obter uma figurinha WebP válida de até 1 MB.')
        }
        fs.mkdirSync(path.dirname(arquivo), { recursive: true })
        const temp = arquivo + '.tmp'
        try {
          fs.writeFileSync(temp, dados)
          fs.renameSync(temp, arquivo)
          fs.writeFileSync(meta, JSON.stringify({ isAnimated: st.isAnimated === true, width: Number(st.width) || 512, height: Number(st.height) || 512 }))
        } finally {
          if (fs.existsSync(temp)) fs.rmSync(temp, { force: true })
        }
        return sucesso(ctx, 'REAÇÃO REGISTRADA', `Sua figurinha foi salva! Responda a uma mensagem com ${ctx.prefix}react 10 para testar.`)
      }

      if (ctx.command === 'delreact') {
        if (ativos.size) return aviso(ctx, 'REAÇÃO EM ANDAMENTO', 'Aguarde o envio atual terminar.')
        if (!fs.existsSync(arquivo)) return aviso(ctx, 'SEM FIGURINHA', 'Nenhuma figurinha de reação está registrada.')
        fs.rmSync(arquivo, { force: true })
        fs.rmSync(meta, { force: true })
        return sucesso(ctx, 'REAÇÃO REMOVIDA', 'A figurinha de reação foi removida.')
      }

      if (!fs.existsSync(arquivo)) {
        return aviso(ctx, 'REAÇÃO NÃO CONFIGURADA', `Responda à figurinha desejada com ${ctx.prefix}rgreact primeiro.`)
      }

      if (ctx.command === 'verreact') {
        await ctx.tokito.sendMessage(ctx.from, { sticker: { url: arquivo }, isAnimated: lerMeta().isAnimated === true }, { quoted: ctx.selo })
        return true
      }

      const quantidade = Number(String(ctx.q || '').trim() || '1')
      if (!Number.isSafeInteger(quantidade) || quantidade < 1 || quantidade > 10) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🧊', titulo: 'REAGIR COM FIGURINHA',
          uso: `${ctx.prefix}react 10`,
          descricao: 'Responda a uma mensagem e escolha de 1 a 10 reações.'
        }))
      }

      const contexto = ctx.ctxMsg
      if (!contexto?.stanzaId || !contexto?.quotedMessage) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🧊', titulo: 'MARQUE UMA MENSAGEM',
          uso: `${ctx.prefix}react 10`,
          descricao: 'Responda à mensagem de outro participante.'
        }))
      }

      const participante = jid(contexto.participant || contexto.participantAlt || (ctx.isGroup ? '' : ctx.from))
      if (ctx.isGroup && !participante) {
        return erro(ctx, 'PARTICIPANTE NÃO IDENTIFICADO', 'Não consegui identificar o autor da mensagem respondida.')
      }
      const meus = [ctx.tokito.user?.id, ctx.tokito.user?.lid].filter(Boolean).map(jid)
      if (meus.includes(participante)) {
        return aviso(ctx, 'MENSAGEM DO BOT', 'Responda à mensagem de outro participante.')
      }

      const tipo = proto?.MessageAssociation?.AssociationType?.STICKER_ANNOTATION
      if (tipo === undefined || !proto?.Message?.fromObject || typeof prepareWAMessageMedia !== 'function' || typeof generateWAMessageFromContent !== 'function') {
        return erro(ctx, 'STONE WPP INCOMPATÍVEL', 'Esta versão não disponibiliza o protocolo de reação com figurinha.')
      }
      if (typeof ctx.tokito.waUploadToServer !== 'function' ||
        typeof ctx.tokito.relayMessage !== 'function') {
        return erro(ctx, 'CONEXÃO INCOMPATÍVEL', 'O envio de reações com figurinha não está disponível nesta conexão.')
      }
      if (ativos.has(ctx.from)) {
        return aviso(ctx, 'REAÇÃO EM ANDAMENTO', 'Aguarde o envio anterior terminar.')
      }

      ativos.add(ctx.from)
      let enviadas = 0
      try {
        const dados = fs.readFileSync(arquivo)
        const detalhes = lerMeta()
        const media = await prepareWAMessageMedia({
          sticker: dados, mimetype: 'image/webp',
          isAnimated: detalhes.isAnimated === true,
          width: Number(detalhes.width) || 512, height: Number(detalhes.height) || 512
        }, { upload: ctx.tokito.waUploadToServer })
        if (!media?.stickerMessage) throw new Error('A mídia não foi preparada para envio.')
        const alvo = {
          remoteJid: ctx.from,
          id: contexto.stanzaId,
          fromMe: false,
          ...(ctx.isGroup ? { participant: participante } : {})
        }
        for (let i = 0; i < quantidade; i++) {
          const conteudo = proto.Message.fromObject({
            messageContextInfo: {
              messageSecret: randomBytes(32),
              messageAssociation: { associationType: tipo, parentMessageKey: alvo }
            },
            associatedChildMessage: { message: { stickerMessage: media.stickerMessage } }
          })
          const msg = generateWAMessageFromContent(ctx.from, conteudo, {
            userJid: ctx.tokito.user?.id || ''
          })
          if (!msg?.key?.id || !msg?.message) throw new Error('Não foi possível preparar a reação.')
          await ctx.tokito.relayMessage(ctx.from, msg.message, {
            messageId: msg.key.id,
            additionalAttributes: { type: 'text' }
          })
          enviadas++
          if (i < quantidade - 1) await espera(650)
        }

        return sucesso(ctx, 'REAÇÕES ENVIADAS',
          `${enviadas} tentativa(s) enviada(s) ao WhatsApp. A exibição depende do suporte do aplicativo.`)
      } catch (e) {
        console.warn('[REACT]', e?.code || e?.message || 'falha')
        return erro(ctx, 'FALHA NA REAÇÃO',
          `${enviadas} de ${quantidade} tentativa(s) enviadas. O WhatsApp pode não aceitar esse recurso.`)
      } finally {
        ativos.delete(ctx.from)
      }
    } catch (e) {
      console.warn('[REACT]', e?.code || e?.message || 'erro')
      return erro(ctx, 'ERRO NA FIGURINHA', 'Não consegui registrar ou usar essa figurinha. Tente outra.')
    }
  }
})
