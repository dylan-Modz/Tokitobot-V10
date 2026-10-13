'use strict'
const dylan = require('../../database/lib/comandos')
const fundos = require('../../sistemas/fundos')
dylan.setCommand({
  nome: 'fundoerro',
  comandos: ['fundoerro', 'fundoprefix'],
  categoria: 'dono',
  info: {
    descricao: 'Personaliza com foto, GIF ou vídeo o fundo dos avisos de comando inválido e prefixo.',
    uso: 'fundoerro | fundoprefix respondendo uma mídia, ou fundoerro 0 / fundoprefix 0',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())
    const tipo = ctx.command === 'fundoprefix' ? 'prefixo' : 'erro'
    const titulo = tipo === 'erro' ? '𝙵𝚄𝙽𝙳𝙾 𝙳𝙾 𝙴𝚁𝚁𝙾' : '𝙵𝚄𝙽𝙳𝙾 𝙳𝙾 𝙿𝚁𝙴𝙵𝙸𝚇𝙾'
    if (String(ctx.q || '').trim() === '0') {
      try {
        fundos.limpar(tipo)
        return ctx.reply('• `' + titulo + '` 🗑️\n> Fundo removido. O aviso voltará ao texto normal.')
      } catch (e) {
        console.log('[FUNDO REMOVER]', e.message)
        return ctx.reply('❌ Falha ao remover o fundo.')
      }
    }
    try {
      const salvo = await fundos.salvar(ctx, tipo)
      if (!salvo) return ctx.reply(
        '• `' + titulo + '` 🖼️\n' +
        '> Envie ou responda uma foto, GIF ou vídeo com ' + ctx.prefix + ctx.command + '.\n' +
        '> Para retirar o fundo, use ' + ctx.prefix + ctx.command + ' 0.'
      )
      await ctx.reagir(ctx.from, '✅').catch(() => {})
      return ctx.reply('• `' + titulo + '` ✅\n' +
        '- Mídia — ( `' + salvo + ' 🖼️` )\n' +
        '> Fundo atualizado com sucesso. Para remover: ' + ctx.prefix + ctx.command + ' 0.')
    } catch (e) {
      console.log('[FUNDO SALVAR]', e.message)
      return ctx.reply('• `' + titulo + '` ❌\n> Não foi possível salvar o fundo: ' + e.message)
    }
  }
})
