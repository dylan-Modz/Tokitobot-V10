const base = require('./base.js')
const mess = require('../database/lib/global.js')
const adv = require('../sistemas/advertencias.js')

module.exports = async (ctx, { emoji, titulo, descricao }) => {
  const { tokito, info, from, sender, newsletter, selo, dataGp, setGp } = ctx
  await base.esperar(300)
  await base.apagar(tokito, info)
  const r = adv.adicionar({
    dataGp,
    setGp,
    grupo: from,
    jid: sender,
    motivo: `${titulo}: ${descricao}`,
    autor: 'proteção automática'
  })
  let removido = false
  if (r.remove) {
    try {
      await tokito.groupParticipantsUpdate(from, [sender], 'remove')
      removido = true
    }
    catch (error) {
      console.log(`[${titulo}]`, error?.message || error)
    }
  }
  await tokito.sendMessage(from, {
    text: mess.protecaoAdv(emoji, titulo, sender, r.quantidade, descricao, removido),
    contextInfo: {
      ...newsletter,
      mentionedJid: [sender]
    }
  }, { quoted: selo }).catch(() => {
  })
  return true
}
