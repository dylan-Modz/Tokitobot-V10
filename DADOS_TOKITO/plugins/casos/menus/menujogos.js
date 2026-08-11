/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "menujogos",
  comandos: ["menujogos"],
  categoria: "menus",
  info: {
    "descricao": "Executa o comando menujogos.",
    "uso": "menujogos",
    "categoria": "menus"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          await dylanModz(linguagem.menujogos(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion), '🎮', [
            {
              texto: mess.botaoMenuBrincadeiras(),
              id: `${prefix}menubn`
            }
          ])
        }
        catch (e) {
          console.log('[MENU JOGOS]', e?.message || e)
          await reply(mess.error())
        }
      }
    }
  }
}
