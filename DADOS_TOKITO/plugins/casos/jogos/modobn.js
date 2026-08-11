/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "modobn",
  comandos: ["modobn", "modobrincadeira", "modobrincadeiras"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando modobn.",
    "uso": "modobn",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        if (!isGroupAdmins)
          return reply(mess.soadm())
        if (!isBotGroupAdmins)
          return reply(mess.botadm())
        const acao = String(q || '').trim()
        if (!['0', '1'].includes(acao))
          return reply(mess.modoBnUso(prefix, command))
        if (acao === '1' && isModobn)
          return reply(mess.modoBnJaAtivado())
        if (acao === '0' && !isModobn)
          return reply(mess.modoBnJaDesativado())
        dataGp[0].jogos = acao === '1'
        setGp(dataGp)
        await reagir(from, acao === '1' ? '✅' : '❌')
        await reply(acao === '1' ? mess.modoBnAtivado() : mess.modoBnDesativado())
      }
    }
  }
}
