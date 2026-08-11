module.exports = {
  nome: 'dogolpe',
  comandos: ['dogolpe'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Descobre em qual golpe a pessoa é especialista.',
    uso: 'dogolpe @usuario',
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { isGroup, isModobn, reply, mess, prefix, menc_os2, tokito, from, canalInfo, selo } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    if (!menc_os2)
      return reply(`- 👤 Marque alguém.\n> ${prefix}dogolpe @usuario`)
    const g = ['iludir pessoas', 'ferir sentimentos', 'dar chifre', 'sumir e voltar como se nada tivesse acontecido']
    const x = g[Math.floor(Math.random() * g.length)]
    return tokito.sendMessage(from, {
      text: `😵‍💫 @${menc_os2.split('@')[0]} é especialista em *${x}*.`,
      contextInfo: canalInfo([menc_os2])
    }, { quoted: selo })
  }
}
