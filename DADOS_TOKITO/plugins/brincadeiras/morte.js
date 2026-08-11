const links = require('../../INFO_DADOS/LOGOS/links_img.json')

module.exports = {
  nome: 'morte',
  comandos: ['morte', 'death', 'morrer', 'preveridade', 'morteidade'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Faz a brincadeira de previsão de idade pelo nome.',
    uso: 'morte nome',
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { isGroup, isModobn, reply, mess, prefix, q, axios, tokito, from, canalInfo, sender, selo } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    const nome = String(q || '').trim().split(/\s+/)[0]
    if (!nome)
      return reply(`- 💀 ${prefix}morte nome`)
    let idade
    try {
      const r = await axios.get(`https://api.agify.io/?name=${encodeURIComponent(nome)}`, { timeout: 15000 })
      idade = r?.data?.age
    }
    catch {
    }
    ;
    if (!idade)
      idade = 40 + Math.floor(Math.random() * 61)
    const caption = `💀 Pessoas com o nome *${nome}* nessa brincadeira chegam a aproximadamente *${idade} anos*.`
    const media = String(links.deathcmd || '').trim()
    if (media)
      return tokito.sendMessage(from, {
        video: { url: media },
        gifPlayback: true,
        caption,
        contextInfo: canalInfo([sender])
      }, { quoted: selo })
    return reply(caption)
  }
}
