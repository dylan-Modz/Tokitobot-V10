/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "menudown",
  comandos: ["menudown"],
  categoria: "menus",
  info: {
    "descricao": "Executa o comando menudown.",
    "uso": "menudown",
    "categoria": "menus"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          await dylanModz(linguagem.menudown(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion), '🧊', [
            {
              texto: mess.botaoMenuJogos(),
              id: `${prefix}menujogos`
            }
          ])
        }
        catch (e) {
          console.log('[MENU DOWNLOAD]', e?.message || e)
          await reply(mess.error())
        }
      }
    }
  }
}
