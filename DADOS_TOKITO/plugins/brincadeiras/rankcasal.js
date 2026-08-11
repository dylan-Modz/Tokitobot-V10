const links = require('../../INFO_DADOS/LOGOS/links_img.json')

module.exports = {
  nome: 'rankcasal',
  comandos: ['rankcasalzin', 'rankcasais', 'rankcasal'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Sorteia os casais mais compatíveis do grupo.',
    uso: 'rankcasal',
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { isGroup, isModobn, reply, mess, prefix, membrosGrupo, groupMembers, tokito, from, canalInfo, selo } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    const m = [...new Set((membrosGrupo?.length ? membrosGrupo : (groupMembers || []).map(x => x.id || x)).filter(Boolean))]
    if (m.length < 2)
      return reply(mess.error())
    const men = []
    const lin = []
    for (let i = 0; i < Math.min(5, m.length); i++) {
      const a = m[Math.floor(Math.random() * m.length)]
      let b = a
      while (b === a)
        b = m[Math.floor(Math.random() * m.length)]
      men.push(a, b)
      lin.push(`『 ${i + 1}° 』— ${Math.floor(Math.random() * 101)}% • @${a.split('@')[0]} + @${b.split('@')[0]}`)
    }
    const caption = `- 💞 \`𝚁𝙰𝙽𝙺 𝙲𝙰𝚂𝙰𝙻\`\n\n${lin.join('\n')}`
    const media = String(links.rankcasal || '').trim()
    if (media)
      return tokito.sendMessage(from, {
        image: { url: media },
        caption,
        contextInfo: canalInfo(men)
      }, { quoted: selo })
    return tokito.sendMessage(from, {
      text: caption,
      contextInfo: canalInfo(men)
    }, { quoted: selo })
  }
}
