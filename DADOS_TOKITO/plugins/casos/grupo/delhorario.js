/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "delhorario",
  comandos: ["delhorario"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando delhorario.",
    "uso": "delhorario",
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
          const grupos = ler()
          const dados = grupos[from]
          if (!dados)
            return reply(mess.semhorario())
          const midias = [
            dados.fecharmidia,
            dados.abrirmidia,
            dados.midiaFechar,
            dados.midiaAbrir,
            dados.fechar?.midia,
            dados.abrir?.midia,
            dados.midia
          ].filter(Boolean)
          const arquivos = new Set()
          for (const midia of midias) {
            if (!midia?.arquivo || arquivos.has(midia.arquivo))
              continue
            arquivos.add(midia.arquivo)
            apagar(midia)
          }
          delete grupos[from]
          salvar(grupos)
          await reagir(from, '✅')
          return reply(mess.apagado())
        }
        catch (error) {
          console.log('❌ Erro no delhorario:', error)
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.falha())
        }
      }
    }
  }
}
