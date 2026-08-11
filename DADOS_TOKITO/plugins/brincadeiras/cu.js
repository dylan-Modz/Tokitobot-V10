const links = require('../../INFO_DADOS/LOGOS/links_img.json')

module.exports = {
  nome: 'cu',
  comandos: ['cu', 'bozo', 'profundidade', 'medircu', 'cm'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Brincadeira de medida aleatória.',
    uso: 'cu [@usuario]',
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { isGroup, isModobn, reply, mess, prefix, sender_ou_n, sender, tokito, from, canalInfo, selo } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    const alvo = sender_ou_n || sender
    const n = Math.floor(Math.random() * 111)
    const caption = `📏 @${alvo.split('@')[0]} tirou *${n} cm* na brincadeira.`
    const media = String(links.cu || '').trim()
    if (media)
      return tokito.sendMessage(from, {
        image: { url: media },
        caption,
        contextInfo: canalInfo([alvo])
      }, { quoted: selo })
    return tokito.sendMessage(from, {
      text: caption,
      contextInfo: canalInfo([alvo])
    }, { quoted: selo })
  }
}
