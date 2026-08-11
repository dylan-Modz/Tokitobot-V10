/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "menudono",
  comandos: ["menudono"],
  categoria: "menus",
  info: {
    "descricao": "Executa o comando menudono.",
    "uso": "menudono",
    "categoria": "menus"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        await dylanModz(linguagem.menudono(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion), '🧊', [
          {
            texto: mess.botaoMenuDownload(),
            id: `${prefix}menudown`
          }
        ])
      }
    }
  }
}
