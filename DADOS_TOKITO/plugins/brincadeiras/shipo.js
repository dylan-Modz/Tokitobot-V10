module.exports = {
  nome: 'shipo',
  comandos: ['shipo'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Sorteia um par para a pessoa marcada.',
    uso: 'shipo @usuario',
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { isGroup, isModobn, reply, mess, prefix, menc_os2, groupMembers, tokito, from, canalInfo, selo } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    if (!menc_os2)
      return reply(`- 💘 Marque uma pessoa.\n> ${prefix}shipo @usuario`)
    const membros = (groupMembers || []).map(x => x.id || x).filter(x => x && x !== menc_os2)
    if (!membros.length)
      return reply(mess.error())
    const par = membros[Math.floor(Math.random() * membros.length)]
    const n = Math.floor(Math.random() * 101)
    return tokito.sendMessage(from, {
      text: `💘 Eu shipo @${menc_os2.split('@')[0]} com @${par.split('@')[0]} em *${n}%*!`,
      contextInfo: canalInfo([menc_os2, par])
    }, { quoted: selo })
  }
}
