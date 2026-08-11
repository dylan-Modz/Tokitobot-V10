module.exports = {
  nome: 'chance',
  comandos: [
    'chance',
    'probabilidade',
    'porcentagem',
    'chances',
    'possibilidade',
    'sera',
    'seraque',
    'randomchance',
    'medirchance',
    'chancezinha'
  ],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Calcula uma porcentagem aleatória para uma pergunta.',
    uso: 'chance pergunta ou @usuario',
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { isGroup, isModobn, reply, mess, prefix, q, menc_os2, tokito, from, selo, canalInfo, sender } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    if (!q?.trim() && !menc_os2)
      return reply(`- 🎲 Digite uma pergunta.\n> ${prefix}chance de eu ganhar hoje`)
    const n = Math.floor(Math.random() * 101)
    const alvo = menc_os2
    const texto = alvo ? `😵‍💫🌟 A chance de *@${alvo.split('@')[0]}* é de *${n}%*.` : `😵‍💫🌟 A chance de _“${q.trim()}”_ é de *${n}%*.`
    return tokito.sendMessage(from, {
      text: texto,
      contextInfo: canalInfo(alvo ? [sender, alvo] : [sender])
    }, { quoted: selo })
  }
}
