/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "menubn",
  comandos: ["menubn", "menubrincadeiras"],
  categoria: "menus",
  info: {
    "descricao": "Executa o comando menubn.",
    "uso": "menubn",
    "categoria": "menus"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          await dylanModz(linguagem.menubn(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion, isModobn), '🎭', [
            {
              texto: mess.botaoMenu(),
              id: `${prefix}menu`
            }
          ])
        }
        catch (e) {
          console.log('[MENU BRINCADEIRAS]', e?.message || e)
          await reply(mess.error())
        }
      }
    }
  }
}
