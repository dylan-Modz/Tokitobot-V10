/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "ban",
  comandos: ["ban"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando ban.",
    "uso": "ban",
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
          if (alvo === botNumber)
            return reply(mess.nobot())
          if (numerodono.includes(alvo))
            return reply(mess.nodono())
          await tokito.groupParticipantsUpdate(from, [alvo], 'remove')
          await tokito.sendMessage(from, {
            text: mess.banido(alvo),
            contextInfo: {
              ...newsletter,
              mentionedJid: [alvo]
            }
          }, { quoted: selo })
        }
        catch (e) {
          console.log('Erro no ban:', e)
          await reply(mess.falha())
        }
      }
    }
  }
}
