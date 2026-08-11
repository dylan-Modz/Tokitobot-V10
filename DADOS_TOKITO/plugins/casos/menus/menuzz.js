/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "menuzz",
  comandos: ["menuzz"],
  categoria: "menus",
  info: {
    "descricao": "Executa o comando menuzz.",
    "uso": "menuzz",
    "categoria": "menus"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          await dylanModz(linguagem.menu(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion), '🧊', [
            {
              texto: mess.botaoMenuAdm(),
              id: `${prefix}menuadm`
            }
          ])
        }
        catch (e) {
          console.log('Erro no menu principal:', e)
          await reply(mess.error())
        }
      }
    }
  }
}
