/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "addlistanegra",
  comandos: ["addlistanegra"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando addlistanegra.",
    "uso": "addlistanegra",
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
        const alvo = alvoPorMarcacaoOuNumero()
        if (!alvo)
          return reply(mess.listaNegraUso(prefix, command))
        if (alvo === botNormalizado)
          return reply(mess.nobot())
        if (numerodono.includes(alvo))
          return reply(mess.nodono())
        if (dataGp[0].listanegra.includes(alvo))
          return reply(mess.listaNegraJaExiste(alvo))
        dataGp[0].listanegra.push(alvo)
        setGp(dataGp)
        await reagir(from, '✅')
        return reply(mess.listaNegraAdicionado(alvo), [alvo])
      }
    }
  }
}
