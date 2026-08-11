/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "menulogos",
  comandos: ["menulogos"],
  categoria: "menus",
  info: {
    "descricao": "Executa o comando menulogos.",
    "uso": "menulogos",
    "categoria": "menus"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          await dylanModz(linguagem.menulogos(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion), '🎨', [
            {
              texto: mess.botaoMenu(),
              id: `${prefix}menu`
            }
          ])
        }
        catch (erro) {
          console.log('[MENU LOGOS]', erro?.message || erro)
          await reply(mess.error())
        }
      }
    }
  }
}
