/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "listddd",
  comandos: ["listddd"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando listddd.",
    "uso": "listddd",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const lista = dataGp[0].funcoes.antiddd.listaProibidos
        return reply(mess.dddLista(lista))
      }
    }
  }
}
