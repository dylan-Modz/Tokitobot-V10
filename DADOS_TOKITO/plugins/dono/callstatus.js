/* TOKITO BOT V10 — status do VoIP da Stone */
'use strict'

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'callstatus',
  comandos: ['callstatus'],
  categoria: 'dono',
  info: {
    descricao: 'Mostra o estado real do motor VoIP experimental.',
    uso: 'callstatus',
    categoria: 'dono',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess?.onlyOwner?.() || 'Apenas o dono pode consultar o VoIP.')
    const calls = ctx.tokito?.calls
    if (!calls) return ctx.reply('📞 *STONE VOIP*\n> Motor não disponível na biblioteca instalada.')
    const estado = calls.getVoipStatus?.() || {}
    const recursos = calls.getCapabilities?.() || {}
    const sessao = String(ctx.tokito.user?.id || ctx.botNumber || 'bot')
    const atual = global.__TOKITO_PLAYCALL_ATIVAS__?.get(sessao)
    const linhas = [
      '📞 *𝚂𝚃𝙾𝙽𝙴 𝚅𝙾𝙸𝙿*',
      '> 🧩 Motor: ' + (estado.initialized ? 'iniciado (experimental)' : 'não iniciado'),
      '> 📞 Iniciar: ' + (recursos.startCall ? 'disponível' : 'indisponível'),
      '> 🎧 Arquivos de áudio: ' + (recursos.audioFiles ? 'disponível' : 'indisponível'),
      '> 🔊 Transmissão: ' + (recursos.liveAudio ? 'exposta (experimental)' : 'indisponível'),
      '> 🎵 PlayCall: ' + (atual?.fase || 'sem chamada ativa'),
      '> ⚠️ Disponibilidade não garante ligação conectada ou áudio entregue.'
    ]
    if (estado.error?.code) linhas.push('> ❌ Erro: ' + String(estado.error.code))
    return ctx.reply(linhas.join('\n'))
  }
})
