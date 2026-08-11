const fs = require('fs')
const path = require('path')
const links = require('../../../INFO_DADOS/LOGOS/links_img.json')

module.exports = {
  nome: 'donos',
  comandos: ['donos'],
  categoria: 'dono',
  info: {
    descricao: 'Mostra o dono principal e os donos adicionais do bot.',
    uso: 'donos',
    categoria: 'dono',
    permissao: 'Todos'
  },
  async executar(ctx) {
    const { tokito, from, ownerNumber, ownerName, nescessario, mess, newsletter, selo, reagir } = ctx
    await reagir(from, '🎉').catch(() => {
    })
    const principal = String(ownerNumber || '').replace(/\D/g, '')
    const extras = [1, 2, 3, 4, 5, 6]
      .map(slot => ({
        slot,
        numero: String(nescessario[`numero_dono${slot}`] || '').replace(/\D/g, '')
      }))
      .filter(d => d.numero.length >= 10)
    const numeros = [...new Set([principal, ...extras.map(d => d.numero)].filter(n => n.length >= 10))]
    const mencoes = numeros.map(n => `${n}@s.whatsapp.net`)
    const caption = mess.donos(ownerName, principal, extras)
    const media = String(links.donos || '').trim()
    const base = {
      caption,
      contextInfo: {
        ...newsletter,
        mentionedJid: mencoes
      }
    }
    if (media) {
      try {
        const isHttp = /^https?:\/\//i.test(media)
        const local = isHttp ? null : path.resolve(process.cwd(), media)
        if (isHttp || (local && fs.existsSync(local))) {
          return await tokito.sendMessage(from, {
            ...base,
            video: isHttp ? { url: media } : fs.readFileSync(local),
            gifPlayback: true
          }, { quoted: selo })
        }
      }
      catch {
      }
    }
    const fallback = path.join(process.cwd(), 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'donos.mp4')
    if (fs.existsSync(fallback)) {
      return tokito.sendMessage(from, {
        ...base,
        video: fs.readFileSync(fallback),
        gifPlayback: true
      }, { quoted: selo })
    }
    return tokito.sendMessage(from, {
      text: caption,
      contextInfo: {
        ...newsletter,
        mentionedJid: mencoes
      }
    }, { quoted: selo })
  }
}
