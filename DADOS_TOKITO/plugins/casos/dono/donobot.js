/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "donobot",
  comandos: ["donobot", "numero-dono"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando donobot.",
    "uso": "donobot",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        let alvo = menc_os2 || menc_prt || String(q || '')
        if (Array.isArray(alvo))
          alvo = alvo[0]
        alvo = normalizar(alvo)
        let numero = String(alvo || '').split('@')[0].replace(/\D/g, '')
        if (!numero)
          numero = String(q || '').replace(/\D/g, '')
        if (!numero)
          return reply(mess.mainOwnerRequired(prefix))
        setting.ownerNumber = numero
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
        await tokito.sendMessage(from, {
          text: mess.mainOwnerChanged(numero),
          contextInfo: {
            ...newsletter,
            mentionedJid: [`${numero}@s.whatsapp.net`]
          }
        }, {
          quoted: selo
        })
      }
    }
  }
}
