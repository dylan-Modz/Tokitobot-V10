const fs = require('fs')
const modulos = require('../../../sistemas/modulos')
const { writeExif2 } = require('../../../funcoes/js/exif2')

const st = ctx => ctx.ctxMsg?.quotedMessage?.stickerMessage || ctx.mensagem?.stickerMessage

const dados = s => {
  const [packname, author] = String(s || '').split('|').map(v => String(v || '').trim())
  return {
    packname: packname || 'TokitoBot-MD',
    author: author || 'Dylan Modz'
  }
}

module.exports = {
  nome: 'rgtake',
  comandos: ['rgtake', 'rntake', 'take', 'roubar', 'rename'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Registra e aplica nome/autor em figurinhas.',
    uso: 'rgtake nome|autor'
  },
  async executar(ctx) {
    const db = modulos.takes()
    const id = ctx.normalizar(ctx.sender)
    if (['rgtake', 'rntake'].includes(ctx.command)) {
      if (ctx.command === 'rntake' && !db[id])
        return ctx.reply(`❌ Você ainda não registrou um take. Use *${ctx.prefix}rgtake nome|autor* primeiro.`)
      const d = dados(ctx.q)
      db[id] = d
      modulos.salvarTakes(db)
      return ctx.reply(`✅ Take ${ctx.command === 'rntake' ? 'atualizado' : 'registrado'}:\n📦 ${d.packname}\n✍️ ${d.author}`)
    }
    const s = st(ctx)
    if (!s)
      return ctx.reply('❌ Responda a uma figurinha.')
    const buffer = await ctx.getFileBuffer(s, 'sticker')
    if (!buffer?.length)
      return ctx.reply('❌ Não consegui baixar a figurinha.')
    const d = ctx.command === 'rename' ? dados(ctx.q) : (db[id] || {
      packname: `🧊 ${ctx.NomeDoBot}`,
      author: ctx.pushname || 'Dylan Modz'
    })
    let arq
    try {
      arq = await writeExif2({
        data: buffer,
        mimetype: 'image/webp'
      }, d)
      await ctx.tokito.sendMessage(ctx.from, { sticker: { url: arq } }, { quoted: ctx.selo })
      return true
    }
    catch (e) {
      console.log('[TAKE]', e?.message || e)
      return ctx.reply(`❌ Não foi possível renomear a figurinha: ${e.message}`)
    }
    finally {
      try {
        if (arq && fs.existsSync(arq))
          fs.unlinkSync(arq)
      }
      catch {
      }
    }
  }
}
