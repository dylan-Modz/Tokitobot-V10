const links = require('../../INFO_DADOS/LOGOS/links_img.json')

module.exports = cfg => ({
  nome: cfg.nomeComando || cfg.comandos[0],
  comandos: cfg.comandos,
  categoria: 'brincadeiras',
  info: {
    descricao: cfg.descricao || `Mede a porcentagem de ${cfg.nome}.`,
    uso: `${cfg.comandos[0]} [@usuario]`,
    categoria: 'brincadeiras',
    requisitos: 'Modo brincadeiras'
  },
  async executar(ctx) {
    const { tokito, from, sender, sender_ou_n, isGroup, isModobn, prefix, reply, reagir, mess, canalInfo, selo } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isModobn)
      return reply(mess.onlyGroupFun(prefix))
    const alvo = sender_ou_n || sender
    const numero = String(alvo || sender).split('@')[0]
    const valor = Math.floor(Math.random() * 111)
    await reagir(from, cfg.emoji || '🎲').catch(() => {
    })
    await tokito.sendMessage(from, {
      text: mess.bnBusca(cfg.nome, numero),
      contextInfo: canalInfo([alvo])
    }, { quoted: selo }).catch(() => {
    })
    setTimeout(async () => {
      try {
        const caption = mess.bnResultado(cfg.emoji || '🎲', cfg.titulo || cfg.nome, numero, cfg.texto || cfg.nome, valor)
        const media = String(links[cfg.img] || '').trim()
        if (media) {
          const campo = cfg.video ? {
            video: { url: media },
            gifPlayback: true,
            caption
          } : {
            image: { url: media },
            caption
          }
          await tokito.sendMessage(from, {
            ...campo,
            contextInfo: canalInfo([alvo])
          }, { quoted: selo })
        }
        else {
          await tokito.sendMessage(from, {
            text: caption,
            contextInfo: canalInfo([alvo])
          }, { quoted: selo })
        }
      }
      catch (error) {
        console.log('[PLUGIN BRINCADEIRA]', error?.message || error)
      }
    }, Number(cfg.delay ?? 1500))
  }
})
