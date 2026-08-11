/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "botoes",
  comandos: ["botoes", "botoesbot"],
  categoria: "outros",
  info: {
    "descricao": "Executa o comando botoes.",
    "uso": "botoes",
    "categoria": "outros"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        const acao = String(q || '').trim()
        if (!['0', '1'].includes(acao))
          return reply(mess.botoesUso(prefix, command))
        if (acao === '1' && isBotoes)
          return reply(mess.botoesJaAtivados())
        if (acao === '0' && !isBotoes)
          return reply(mess.botoesJaDesativados())
        nescessario.botoes = acao === '1'
        fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
        await reagir(from, acao === '1' ? '✅' : '❌')
        await reply(acao === '1' ? mess.botoesAtivados() : mess.botoesDesativados())
      }
    }
  }
}
