const base = require('./base.js')
const mess = require('../database/lib/global.js')

module.exports = async ({ grupo, dataGp, setGp, campo, q, prefix, command, reply, emoji, titulo, descricao, desligado }) => {
  const acao = String(q || '').trim()
  if (!['0', '1'].includes(acao))
    return reply(mess.funcaoUso(emoji, titulo, prefix, command, descricao))
  if (Array.isArray(dataGp) && dataGp[0] && typeof setGp === 'function') {
    if (!dataGp[0].funcoes || typeof dataGp[0].funcoes !== 'object')
      dataGp[0].funcoes = {}
    dataGp[0].funcoes[campo] = acao === '1'
    setGp(dataGp)
  }
  else {
    base.alterar(grupo, campo, acao === '1')
  }
  return reply(acao === '1'
    ? mess.funcaoAtivada(emoji, titulo, descricao)
    : mess.funcaoDesativada(emoji, titulo, desligado || 'ᴇssᴀ ғᴜɴᴄ̧ᴀ̃ᴏ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.'))
}
