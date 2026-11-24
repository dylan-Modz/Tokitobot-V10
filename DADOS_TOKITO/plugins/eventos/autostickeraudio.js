/*
 * TOKITO BOT V10 — evento de figurinha com áudio automática.
 * Author: Dylan Modz
 */
'use strict'

const sistema = require('../../sistemas/sticker-audio')
const recentes = new Map()
const JANELA_MS = 3 * 60 * 1000

module.exports = {
  prioridade: 75,
  nome: 'evento-autostickeraudio',
  categoria: 'eventos',
  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isCmd ||
        !ctx.dataGp?.[0]?.funcoes?.autostickeraudio ||
        !sistema.registrada()) return false

    // Apenas áudio novo recebido, nunca um áudio citado em mensagem de texto.
    const audio = ctx.mensagem?.audioMessage
    if (!audio) return false
    const id = String(ctx.info?.key?.id || '')
    const chave = id ? `${ctx.from}:${id}` : ''
    const agora = Date.now()
    for (const [key, instante] of recentes) {
      if (agora - instante > JANELA_MS) recentes.delete(key)
    }
    if (chave && recentes.has(chave)) return false
    if (chave) recentes.set(chave, agora)

    sistema.agendarSonora(async () => {
      try { await sistema.enviar(ctx, audio) }
      catch (e) { console.warn('[AUTOSTICKERAUDIO]', e?.code || 'FALHA') }
    })
    // Permite que outros eventos de áudio (como transcrição) continuem.
    return false
  }
}
