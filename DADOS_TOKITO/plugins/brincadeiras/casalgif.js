module.exports = {
  nome: 'casalgif',
  comandos: ['casalgif'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Sorteia um casal e gera o card animado.',
    uso: 'casalgif',
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { isGroup, isModobn, reply, mess, prefix, groupMembers, tokito, from, reagir, API_URL, API_KEY_TOKITO, canalInfo, selo } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    const membros = (groupMembers || []).map(x => x.id || x).filter(Boolean)
    if (membros.length < 2)
      return reply('- ❌ Preciso de pelo menos 2 membros.')
    await reagir(from, '💘').catch(() => {
    })
    const p1 = membros[Math.floor(Math.random() * membros.length)]
    let p2 = p1
    while (p2 === p1)
      p2 = membros[Math.floor(Math.random() * membros.length)]
    const n = Math.floor(Math.random() * 101)
    const foto = async (j) => tokito.profilePictureUrl(j, 'image').catch(() => 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/747wlpa89.jpg')
    const f1 = await foto(p1)
    const f2 = await foto(p2)
    const url = `${String(API_URL).replace(/\/$/, '')}/canvas/casal2-gif?foto1=${encodeURIComponent(f1)}&foto2=${encodeURIComponent(f2)}&porcentagem=${n}&apikey=${encodeURIComponent(API_KEY_TOKITO || '')}`
    try {
      return await tokito.sendMessage(from, {
        video: { url },
        mimetype: 'video/mp4',
        gifPlayback: true,
        caption: `💘 @${p1.split('@')[0]} + @${p2.split('@')[0]}: *${n}%*`,
        contextInfo: canalInfo([p1, p2])
      }, { quoted: selo })
    }
    catch (error) {
      console.log(
        '[CASAL GIF API]',
        ctx.modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
      )

      return reply(
        mess.erroApi(API_URL)
      )
    }
  }
}
