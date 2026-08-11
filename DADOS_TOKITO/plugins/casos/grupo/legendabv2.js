/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "legendabv2",
  comandos: ["legendabv2", "legendasaiu2", "legendabv3", "legendasaiu3"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando legendabv2.",
    "uso": "legendabv2",
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
          const indice = command.endsWith('2') ? 1 : 2
          const campo = command.startsWith('legendabv') ? `legendabv${indice + 1}` : `legendasaiu${indice + 1}`
          dataGp[0].wellcome[indice][campo] = String(q).trim()
          setGp(dataGp)
          await reagir(from, '✅')
          return reply(mess.legendaModo(indice + 1, campo.startsWith('legendabv') ? 'entrada' : 'saída'))
        }
        catch (e) {
          console.log('Erro nas legendas extras do bem-vindo:', e)
          return reply(mess.error())
        }
      }
    }
  }
}
