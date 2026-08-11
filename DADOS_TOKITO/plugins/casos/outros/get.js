/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "get",
  comandos: ["get"],
  categoria: "outros",
  info: {
    "descricao": "Executa o comando get.",
    "uso": "get",
    "categoria": "outros"
  },
  async executar(ctx) {
    with (ctx) {
      reply(JSON.stringify(info, null, 3))
    }
  }
}
