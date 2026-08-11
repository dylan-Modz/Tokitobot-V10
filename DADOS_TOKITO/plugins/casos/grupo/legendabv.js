/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "legendabv",
  comandos: ["legendabv", "legendasaiu"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando legendabv.",
    "uso": "legendabv",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!isGroup)
            return reply(mess.sogrupo())
          if (!isGroupAdmins)
            return reply(mess.soadm())
          if (!isBotGroupAdmins)
            return reply(mess.botadm())
          if (!q)
            return reply(mess.tags(prefix, command))
          const campo = command === 'legendabv' ? 'legendabv' : 'legendasaiu'
          dataGp[0].name = groupName
          dataGp[0].wellcome[0][campo] = String(q).trim()
          setGp(dataGp)
          await reagir(from, '✅')
          return reply(mess.legenda(campo === 'legendabv' ? 'entrada' : 'saída'))
        }
        catch (e) {
          console.log('Erro na legenda do bem-vindo:', e)
          return reply(mess.error())
        }
      }
    }
  }
}
