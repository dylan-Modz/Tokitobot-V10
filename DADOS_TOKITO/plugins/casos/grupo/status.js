/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "status",
  comandos: ["status", "statusgp", "statusfuncoes"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando status.",
    "uso": "status",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const funcoesGp = dataGp?.[0]?.funcoes || {}
        await reply(mess.statusFuncoes(NomeDoBot, groupName, funcoesGp, isWelkom, isModobn, isWelkom2, isWelkom3))
      }
    }
  }
}
