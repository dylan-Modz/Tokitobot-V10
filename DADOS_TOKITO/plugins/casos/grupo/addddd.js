/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "addddd",
  comandos: ["addddd"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando addddd.",
    "uso": "addddd",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        if (!isGroupAdmins)
          return reply(mess.soadm())
        const ddds = [
          ...new Set(String(q || '').split(/[\s,;|]+/).map(v => v.replace(/\D/g, '')).filter(v => /^\d{2}$/.test(v) && v !== '00'))
        ]
        if (!ddds.length)
          return reply(mess.dddUso(prefix, command))
        const lista = dataGp[0].funcoes.antiddd.listaProibidos
        const novos = ddds.filter(ddd => !lista.includes(ddd))
        if (!novos.length)
          return reply(mess.dddJaCadastrado(ddds))
        dataGp[0].funcoes.antiddd.listaProibidos = [...lista, ...novos]
        setGp(dataGp)
        await reagir(from, '✅')
        return reply(mess.dddAdicionado(novos))
      }
    }
  }
}
