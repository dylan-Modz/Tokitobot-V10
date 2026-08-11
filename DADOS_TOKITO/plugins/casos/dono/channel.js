/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "channel",
  comandos: ["channel", "setchannel"],
  categoria: "dono",
  info: {
    "descricao": "Executa o comando channel.",
    "uso": "channel",
    "categoria": "dono"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!SoDono)
          return reply(mess.onlyOwner())
        const entradaCanal = String(q || '').trim()
        if (!entradaCanal)
          return reply(mess.channelRequired(prefix, command))
        if (entradaCanal === '0') {
          setting.channeldl = '0@newsletter'
          fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
          return reply(mess.channelDisabled())
        }
        try {
          let jidReal = entradaCanal.endsWith('@newsletter') ? entradaCanal : ''
          if (!jidReal) {
            const convite = entradaCanal
              .replace(/.*whatsapp\.com\/channel\//i, '')
              .replace(/.*wa\.me\/channel\//i, '')
              .split(/[\/?\s]/)[0]
            if (!convite)
              return reply(mess.error())
            const meta = await tokito.newsletterMetadata('invite', convite)
            jidReal = meta?.jid || meta?.id || ''
          }
          if (!jidReal)
            return reply(mess.error())
          setting.channeldl = jidReal
          fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
          await reply(mess.channelEnabled(jidReal, entradaCanal))
        }
        catch (e) {
          console.log('[SETCHANNEL ERRO]', e)
          await reply(mess.error())
        }
      }
    }
  }
}
