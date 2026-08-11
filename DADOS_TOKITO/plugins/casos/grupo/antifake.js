/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "antifake",
  comandos: ["antifake"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando antifake.",
    "uso": "antifake",
    "categoria": "grupo"
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
          return reply(mess.funcaoUsoSimples(prefix, command))
        dataGp[0].funcoes.antifake = acao === '1'
        setGp(dataGp)
        await reagir(from, acao === '1' ? '✅' : '❌')
        return reply(mess.funcaoAlterada('ANTI-FAKE', acao === '1'))
      }
    }
  }
}
