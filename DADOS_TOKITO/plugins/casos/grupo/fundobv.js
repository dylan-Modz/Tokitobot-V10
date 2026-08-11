/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "fundobv",
  comandos: ["fundobv", "fundosaiu"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando fundobv.",
    "uso": "fundobv",
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
          const marcada = extrair(ctxMsg?.quotedMessage || mensagem)
          const video = marcada?.videoMessage
          const imagem = marcada?.imageMessage
          if (!video && !imagem)
            return reply(mess.midia())
          await reagir(from, '⏳')
          const tipo = video ? 'video' : 'image'
          const buffer = await getFileBuffer(video || imagem, tipo)
          const campo = command === 'fundobv' ? 'fundobv' : 'fundosaiu'
          dataGp[0].name = groupName
          dataGp[0].wellcome[0][campo] = buffer.toString('base64')
          dataGp[0].wellcome[0][`${campo}_tipo`] = tipo
          setGp(dataGp)
          await reagir(from, '✅')
          return reply(mess.fundo(campo === 'fundobv' ? 'entrada' : 'saída'))
        }
        catch (e) {
          console.log('Erro ao salvar fundo do bem-vindo:', e)
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.error())
        }
      }
    }
  }
}
