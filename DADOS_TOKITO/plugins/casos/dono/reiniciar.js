/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "reiniciar",
  comandos: ["reiniciar", "r"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando reiniciar.",
    "uso": "reiniciar",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(Res_SoDono)
        await reply(mess.reiniciarBot())
        setTimeout(() => {
          process.exit(0)
        }, 1200)
      }
    }
  }
}
