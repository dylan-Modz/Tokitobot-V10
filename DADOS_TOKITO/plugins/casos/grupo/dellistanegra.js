/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "dellistanegra",
  comandos: ["dellistanegra"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando dellistanegra.",
    "uso": "dellistanegra",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        if (!isGroupAdmins)
          return reply(mess.soadm())
        const alvo = alvoPorMarcacaoOuNumero()
        if (!alvo)
          return reply(mess.listaNegraUso(prefix, command))
        if (!dataGp[0].listanegra.includes(alvo))
          return reply(mess.listaNegraNaoExiste(alvo))
        dataGp[0].listanegra = dataGp[0].listanegra.filter(jid => jid !== alvo)
        setGp(dataGp)
        await reagir(from, '✅')
        return reply(mess.listaNegraRemovido(alvo), [alvo])
      }
    }
  }
}
