/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "viplist",
  comandos: ["viplist", "listavip"],
  categoria: "vip",
  info: {
    "descricao": "Executa o comando viplist.",
    "uso": "viplist",
    "categoria": "vip"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!vip.length)
          return reply('*📋 | ᴇxɪsᴛᴇᴍ 0 ᴜsᴜᴀʀɪᴏs ᴠɪᴘ.*')
        const mentionsVip = vip.map(v => v.id)
        const listaVip = vip.map((v, index) => {
          let expiracao = '*ᴠɪᴘ ɪɴғɪɴɪᴛᴏ*'
          if (v.infinito !== true) {
            const diasRestantes = v.expiraEm
              ? Math.max(0, Math.ceil((new Date(v.expiraEm).getTime() - Date.now()) / 86400000))
              : Number(v.dias || 0)
            const dataExpira = v.expiraEm
              ? new Date(v.expiraEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
              : 'ɴᴀᴏ ɪɴғᴏʀᴍᴀᴅᴀ'
            expiracao = `*${diasRestantes} ᴅɪᴀ${diasRestantes !== 1 ? 's' : ''}*\n• ᴅᴀᴛᴀ: ${dataExpira}`
          }
          return `*[${index + 1}]* - @${v.id.split('@')[0]}\n• ᴇxᴘɪʀᴀᴄᴀᴏ: ${expiracao}`
        }).join('\n––\n')
        await tokito.sendMessage(from, {
          text: `*[ᴛᴏᴛᴀʟ: ${vip.length}]* - ʟɪsᴛᴀ ᴅᴇ ᴜsᴜᴀʀɪᴏs ᴠɪᴘ:\n–\n${listaVip}`,
          contextInfo: {
            ...newsletter,
            mentionedJid: mentionsVip
          }
        }, { quoted: selo })
      }
    }
  }
}
