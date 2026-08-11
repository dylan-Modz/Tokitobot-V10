/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "deldono",
  comandos: ["deldono"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando deldono.",
    "uso": "deldono",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        if (!q)
          return reply(mess.ownerSlotRequired())
        const numDono = Number(String(q).replace(/\D/g, ''))
        if (!Number.isInteger(numDono) || numDono < 1 || numDono > 6) {
          return reply(mess.ownerSlotInvalid())
        }
        const chave = `numero_dono${numDono}`
        const numeroAntigo = String(nescessario[chave] || '').replace(/\D/g, '')
        if (!numeroAntigo) {
          return reply(mess.ownerSlotNotRegistered(numDono))
        }
        nescessario[chave] = '.'
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
        await tokito.sendMessage(from, {
          text: mess.ownerRemoved(numeroAntigo),
          contextInfo: {
            ...newsletter,
            mentionedJid: [`${numeroAntigo}@s.whatsapp.net`]
          }
        }, {
          quoted: selo
        })
      }
    }
  }
}
