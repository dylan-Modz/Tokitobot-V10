/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "prefixo",
  comandos: ["prefixo", "setprefix"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando prefixo.",
    "uso": "prefixo",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        const novoPrefixo = String(q || '').trim()
        if (!novoPrefixo)
          return reply(mess.prefixRequired())
        setting.prefix = novoPrefixo
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
        await reply(mess.prefixChanged(novoPrefixo))
      }
    }
  }
}
