/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "criador",
  comandos: ["criador"],
  categoria: "info",
  info: {
    "descricao": "Executa o comando criador.",
    "uso": "criador",
    "categoria": "info"
  },
  async executar(ctx) {
    with (ctx) {
      {
        const numeroCriador = String(ownerNumber || '').replace(/\D/g, '')
        await reply(`*👑 | ᴄʀɪᴀᴅᴏʀ ᴅᴏ ʙᴏᴛ*

      *👤 | ɴᴏᴍᴇ:* ${ownerName}
      *📱 | ɴᴜᴍᴇʀᴏ:* +${numeroCriador}
      *🔗 | ᴄᴏɴᴛᴀᴛᴏ:* https://wa.me/${numeroCriador}`)
      }
    }
  }
}
