/* Tokito Bot V10 — adicionar Meta AI ao grupo | Dylan Modz */
const dylan = require('../../database/lib/comandos')

const META_AI = '867051314767696@bot'
const presente = lista => Array.isArray(lista) && lista.some(p =>
  String(p?.id || p?.jid || '').toLowerCase() === META_AI
)

dylan.setCommand({
  nome: 'addai',
  comandos: ['addai'],
  categoria: 'admin',
  info: {
    descricao: 'Tenta adicionar a Meta AI ao grupo pelo JID de bot informado.',
    uso: 'addai',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())
    if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm())

    const aviso = (titulo, descricao) => ctx.reply(ctx.mess.padraoAviso({
      emoji: '🤖', titulo, descricao
    }))

    if (typeof ctx.tokito?.groupParticipantsUpdate !== 'function') {
      return aviso('RECURSO INDISPONÍVEL',
        'A conexão atual não permite adicionar participantes ao grupo.')
    }

    try {
      const antes = typeof ctx.tokito.groupMetadata === 'function'
        ? await ctx.tokito.groupMetadata(ctx.from).catch(() => null) : null

      if (presente(antes?.participants)) {
        return aviso('META AI JÁ ESTÁ NO GRUPO',
          'A Meta AI já aparece na lista de participantes deste grupo.')
      }

      const resultado = await ctx.tokito.groupParticipantsUpdate(
        ctx.from, [META_AI], 'add'
      )

      const retorno = Array.isArray(resultado)
        ? resultado.find(p => String(p?.jid || '') === META_AI) || resultado[0]
        : null
      const status = String(retorno?.status || '')

      if (status && status !== '200') {
        const descricao = status === '409'
          ? 'O WhatsApp informou que esse participante já está no grupo.'
          : ['403', '408'].includes(status)
          ? 'O WhatsApp não permitiu adicionar a Meta AI diretamente ao grupo.'
          : status === '400' || status === '404'
          ? 'O WhatsApp não reconheceu ou não aceitou esse contato como participante.'
          : `O WhatsApp recusou a solicitação (status ${status}).`

        return aviso('NÃO FOI POSSÍVEL ADICIONAR', descricao)
      }

      const depois = typeof ctx.tokito.groupMetadata === 'function'
        ? await ctx.tokito.groupMetadata(ctx.from).catch(() => null) : null

      if (presente(depois?.participants)) {
        return ctx.reply(ctx.mess.padraoSucesso({
          emoji: '🤖',
          titulo: 'META AI ADICIONADA',
          descricao: 'A Meta AI foi adicionada ao grupo com sucesso!'
        }))
      }

      if (status === '200') {
        return aviso('SOLICITAÇÃO ACEITA',
          'O WhatsApp aceitou a solicitação, mas ainda não foi possível confirmar a Meta AI na lista de participantes.')
      }

      return aviso('ADIÇÃO NÃO CONFIRMADA',
        'O WhatsApp não confirmou a entrada da Meta AI. Esse tipo de conta pode não aceitar adição por bots.')
    } catch (error) {
      console.warn('[ADDAI]', error?.code || error?.message || 'falha na adição')
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'META AI NÃO ADICIONADA',
        descricao: 'Não consegui adicionar a Meta AI ao grupo. O WhatsApp pode bloquear essa operação.'
      }))
    }
  }
})
