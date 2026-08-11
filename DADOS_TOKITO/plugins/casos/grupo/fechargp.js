/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "fechargp",
  comandos: ["fechargp"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando fechargp.",
    "uso": "fechargp",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!isGroup)
            return reply(mess.grupo())
          if (!isGroupAdmins)
            return reply(mess.adm())
          if (!isBotGroupAdmins)
            return reply(mess.botadm())
          const hora = String(q || '').trim()
          const regra = /^([01]\d|2[0-3]):[0-5]\d$/
          if (!regra.test(hora))
            return reply(mess.fechar(prefix))
          const grupos = ler()
          const atual = grupos[from] || {}
          const ctx = mensagem?.extendedTextMessage?.contextInfo || mensagem?.imageMessage?.contextInfo || mensagem?.videoMessage?.contextInfo || {}
          const marcada = extrair(ctx?.quotedMessage)
          const imagem = marcada?.imageMessage
          const video = marcada?.videoMessage
          let midia = atual.fecharmidia || null
          await reagir(from, '⏳')
          if (video) {
            const buffer = await getFileBuffer(video, 'video')
            const nome = `${from.split('@')[0]}-f-${Date.now()}-${getRandom('.mp4')}`
            const destino = path.join(pasta, nome)
            fs.writeFileSync(destino, buffer)
            apagar(midia)
            midia = {
              tipo: 'video',
              arquivo: nome
            }
          }
          else if (imagem) {
            const buffer = await getFileBuffer(imagem, 'image')
            const nome = `${from.split('@')[0]}-f-${Date.now()}-${getRandom('.jpg')}`
            const destino = path.join(pasta, nome)
            fs.writeFileSync(destino, buffer)
            apagar(midia)
            midia = {
              tipo: 'image',
              arquivo: nome
            }
          }
          grupos[from] = {
            ...atual,
            nome: groupName,
            ativo: true,
            fechar: hora,
            fecharmidia: midia,
            ultimoFechamento: null
          }
          salvar(grupos)
          processar().catch(() => {
          })
          await reagir(from, '✅')
          return reply(mess.fechar(prefix, hora))
        }
        catch (error) {
          console.log('❌ Erro no fechargp:', error)
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.error())
        }
      }
    }
  }
}
