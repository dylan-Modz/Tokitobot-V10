module.exports = {
  nome: 'evento-mute',
  categoria: 'eventos',
  fase: 'pre',
  async evento(ctx) {
    const { isGroup, dataGp, sender, SoDono, isGroupAdmins, tokito, info, from, mess, canalInfo, selo } = ctx
    if (!isGroup || SoDono || isGroupAdmins)
      return false
    const lista = Array.isArray(dataGp?.[0]?.silenciados) ? dataGp[0].silenciados : []
    const item = lista.find(x => x.id === sender)
    if (!item)
      return false
    try {
      await tokito.sendMessage(from, { delete: info.key })
    }
    catch {
    }
    ;
    if (item.modo === 'ban') {
      let removido = false
      try {
        await tokito.groupParticipantsUpdate(from, [sender], 'remove')
        removido = true
      }
      catch {
      }
      ;
      dataGp[0].silenciados = lista.filter(x => x.id !== sender)
      ctx.setGp(dataGp)
      await tokito.sendMessage(from, {
        text: mess.muteBanDisparado(sender, removido),
        contextInfo: canalInfo([sender])
      }, { quoted: selo }).catch(() => {
      })
    }
    return true
  }
}
