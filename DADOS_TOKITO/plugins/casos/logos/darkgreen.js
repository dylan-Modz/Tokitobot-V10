/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "darkgreen",
  comandos: [
    "darkgreen",
    "glitch",
    "write",
    "advancedglow",
    "typography",
    "pixelglitch",
    "neonglitch",
    "flag",
    "flag3d",
    "deleting",
    "blackpink",
    "glowing",
    "underwater",
    "logomaker",
    "cartoon",
    "papercut",
    "watercolor",
    "affectclouds",
    "blackpinklogo",
    "gradient",
    "summerbeach",
    "luxurygold",
    "sandsummer",
    "galaxywallpaper",
    "1917",
    "markingneon",
    "royal",
    "freecreate",
    "galaxy",
    "lighteffects",
    "neondevil",
    "frozen",
    "metal3d",
    "ligatures",
    "sunset",
    "clouds",
    "colorido",
    "desfoque",
    "naruto",
    "amongus",
    "comic3d"
  ],
  categoria: "logos",
  info: {
    "descricao": "Executa o comando darkgreen.",
    "uso": "darkgreen",
    "categoria": "logos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q.trim())
            return reply(mess.usologo(prefix, command))
          await reagir(from, '🎨')
          const url = `${API_URL}/api/${command}?texto=${encodeURIComponent(q.trim())}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
          await tokito.sendMessage(from, {
            image: { url },
            caption: mess.logofeita(command),
            contextInfo: canalInfo([sender])
          }, {
            quoted: selo
          })
          await reagir(from, '✅')
        }
        catch (erro) {
          console.log('[ERRO LOGO]', modulos.sanitizarErro(erro, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
