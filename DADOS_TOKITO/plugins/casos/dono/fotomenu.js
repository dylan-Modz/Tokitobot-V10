/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "fotomenu",
  comandos: ["fotomenu", "fundomenu"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando fotomenu.",
    "uso": "fotomenu",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        const contexto = info.message?.extendedTextMessage?.contextInfo || info.message?.imageMessage?.contextInfo || info.message?.videoMessage?.contextInfo || {}
        const marcada = contexto.quotedMessage || mensagem || {}
        const midia = marcada?.ephemeralMessage?.message || marcada?.viewOnceMessage?.message || marcada?.viewOnceMessageV2?.message || marcada?.viewOnceMessageV2Extension?.message || marcada
        const video = midia?.videoMessage
        const imagem = midia?.imageMessage
        const videoPath = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
        const imagemPath = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.png')
        if (video) {
          await reagir(from, '⏳')
          const buffer = await getFileBuffer(video, 'video')
          if (fs.existsSync(imagemPath))
            fs.unlinkSync(imagemPath)
          fs.writeFileSync(videoPath, buffer)
          await reagir(from, '✅')
          return reply(mess.menuMediaSaved('video'))
        }
        if (imagem) {
          await reagir(from, '⏳')
          const buffer = await getFileBuffer(imagem, 'image')
          if (fs.existsSync(videoPath))
            fs.unlinkSync(videoPath)
          fs.writeFileSync(imagemPath, buffer)
          await reagir(from, '✅')
          return reply(mess.menuMediaSaved('image'))
        }
        await reply(mess.menuMediaRequired())
      }
    }
  }
}
