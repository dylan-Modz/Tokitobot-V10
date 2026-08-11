/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "promover",
  comandos: ["promover"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando promover.",
    "uso": "promover",
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
          let alvo = menc_os2 || menc_prt || String(q || '')
          if (Array.isArray(alvo))
            alvo = alvo[0]
          if (!String(alvo).includes('@')) {
            const numero = String(alvo).replace(/\D/g, '')
            alvo = numero ? `${numero}@s.whatsapp.net` : ''
          }
          alvo = normalizar(alvo)
          if (!alvo)
            return reply(mess.marque())
          const admins = groupAdmins.map(i => normalizar(i))
          if (admins.includes(alvo))
            return reply(mess.jaadm())
          await tokito.groupParticipantsUpdate(from, [alvo], 'promote')
          await tokito.sendMessage(from, {
            text: mess.promovido(alvo),
            contextInfo: {
              ...newsletter,
              mentionedJid: [alvo]
            }
          }, { quoted: selo })
        }
        catch (e) {
          console.log('Erro ao promover:', e)
          await reply(mess.falha())
        }
      }
    }
  }
}
