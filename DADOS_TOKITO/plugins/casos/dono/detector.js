/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "detector",
  comandos: ["detector"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando detector.",
    "uso": "detector",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        try {
          const acao = String(q || '').trim()
          if (!acao)
            return reply(mess.detectorUso(prefix))
          if (acao.toLowerCase() === 'status') {
            return reply(mess.detectorStatus(detector.status()))
          }
          if (['sair', 'off', '0'].includes(acao.toLowerCase())) {
            await detector.sair()
            return reply(mess.detectorSaiu())
          }
          const numero = acao.replace(/\D/g, '')
          if (numero.length < 11 || numero.length > 15)
            return reply(mess.detectorNumero(prefix))
          const dados = await detector.parear(numero, tokito)
          if (dados.registrado)
            return reply(mess.detectorConectado(dados.numero, dados.conectado))
          return reply(mess.detectorCodigo(numero, dados.codigo))
        }
        catch (error) {
          console.log('[DETECTOR]', error?.message || error)
          return reply(mess.detectorErro())
        }
      }
    }
  }
}
