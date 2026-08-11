/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "nome-dono",
  comandos: ["nome-dono", "nick-dono"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando nome-dono.",
    "uso": "nome-dono",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        const novoNomeDono = String(q || '').trim()
        if (!novoNomeDono)
          return reply(mess.ownerNameRequired(prefix))
        setting.ownerName = novoNomeDono
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
        await reply(mess.ownerNameChanged(novoNomeDono))
      }
    }
  }
}
