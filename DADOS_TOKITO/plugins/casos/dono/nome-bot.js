/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "nome-bot",
  comandos: ["nome-bot"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando nome-bot.",
    "uso": "nome-bot",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        const novoNome = String(q || '').trim()
        if (!novoNome)
          return reply(mess.botNameRequired(prefix))
        setting.NomeDoBot = novoNome
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
        await reply(mess.botNameChanged(novoNome))
      }
    }
  }
}
