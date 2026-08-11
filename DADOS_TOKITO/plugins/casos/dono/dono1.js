/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "dono1",
  comandos: ["dono1", "dono2", "dono3", "dono4", "dono5", "dono6"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando dono1.",
    "uso": "dono1",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        const chave = `numero_dono${command.replace('dono', '')}`
        const numeroAntigo = String(nescessario[chave] || '').replace(/\D/g, '')
        if (!q && !menc_os2) {
          if (!numeroAntigo)
            return reply(mess.ownerSlotEmpty())
          nescessario[chave] = '.'
          fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
          return tokito.sendMessage(from, {
            text: mess.ownerRemoved(numeroAntigo),
            contextInfo: {
              ...newsletter,
              mentionedJid: [`${numeroAntigo}@s.whatsapp.net`]
            }
          }, { quoted: selo })
        }
        let numeroNovo = menc_os2 ? String(menc_os2).split('@')[0] : String(q || '').replace(/\D/g, '')
        numeroNovo = numeroNovo.replace(/\D/g, '')
        if (!numeroNovo)
          return reply(mess.ownerNumberRequired())
        nescessario[chave] = numeroNovo
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
        await tokito.sendMessage(from, {
          text: mess.ownerAdded(numeroNovo),
          contextInfo: {
            ...newsletter,
            mentionedJid: [`${numeroNovo}@s.whatsapp.net`]
          }
        }, { quoted: selo })
      }
    }
  }
}
