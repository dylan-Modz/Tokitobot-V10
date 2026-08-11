/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "verificado",
  comandos: ["verificado", "selo"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando verificado.",
    "uso": "verificado",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(Res_SoDono)
        nescessario.verificado = !nescessario.verificado
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
        selo = nescessario.verificado ? SeloMeta : info
        if (nescessario.verificado) {
          await reply(mess.verifiedEnabled())
        }
        else {
          await reply(mess.verifiedDisabled())
        }
      }
    }
  }
}
