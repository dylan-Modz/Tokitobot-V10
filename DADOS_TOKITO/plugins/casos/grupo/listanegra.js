/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "listanegra",
  comandos: ["listanegra"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando listanegra.",
    "uso": "listanegra",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const lista = dataGp[0].listanegra
        return reply(mess.listaNegraLista(lista), lista)
      }
    }
  }
}
