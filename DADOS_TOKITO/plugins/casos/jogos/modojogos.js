/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "modojogos",
  comandos: ["modojogos"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando modojogos.",
    "uso": "modojogos",
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
          return reply(mess.funcaoUso('🎮', '𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂', prefix, command, mess.modoJogosDescricao()))
        const ativo = modoJogosAtivo(from, dataGp)
        if (acao === '1' && ativo)
          return reply(mess.modoJogosJaAtivado())
        if (acao === '0' && !ativo)
          return reply(mess.modoJogosJaDesativado())
        if (!dataGp?.[0]?.funcoes)
          dataGp[0].funcoes = {}
        dataGp[0].funcoes.modojogos = acao === '1'
        setGp(dataGp)
        await reply(acao === '1'
          ? mess.funcaoAtivada('🎮', '𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂', mess.modoJogosDescricao())
          : mess.funcaoDesativada('🎮', '𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂', mess.modoJogosDesligadoDescricao()))
      }
    }
  }
}
