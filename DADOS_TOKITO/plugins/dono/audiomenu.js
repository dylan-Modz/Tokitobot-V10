const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFile } = require('child_process')
const modulos = require('../../sistemas/modulos')

const ff = (entrada, saida) => new Promise((resolve, reject) => execFile('ffmpeg', [
  '-y',
  '-hide_banner',
  '-loglevel',
  'error',
  '-i',
  entrada,
  '-vn',
  '-acodec',
  'libmp3lame',
  '-q:a',
  '3',
  saida
], { maxBuffer: 20 * 1024 * 1024 }, (e, _o, err) => e ? reject(new Error(String(err || e.message))) : resolve()))

module.exports = {
  nome: 'audio-menu',
  comandos: ['audio-menu', 'fundoaudio'],
  categoria: 'dono',
  info: {
    descricao: 'Ativa o áudio de fundo dos menus e troca o áudio salvo.',
    uso: 'audio-menu | fundoaudio',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    const g = modulos.globalCfg()
    if (ctx.command === 'audio-menu') {
      const emoji = '🎵'
      const titulo = '𝙰́𝚄𝙳𝙸𝙾 𝙳𝙾 𝙼𝙴𝙽𝚄'
      const descricao = 'ᴇɴᴠɪᴀ ᴏ ᴀ́ᴜᴅɪᴏ ᴅᴇ ғᴜɴᴅᴏ ᴊᴜɴᴛᴏ ᴄᴏᴍ ᴏs ᴍᴇɴᴜs.'

      g.audioMenu = !g.audioMenu
      modulos.salvarGlobal(g)

      return ctx.reply(
        g.audioMenu
          ? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
          : ctx.mess.funcaoDesativada(emoji, titulo, descricao)
      )
    }
    const a = modulos.audioAtual(ctx)
    if (!a)
      return ctx.reply('❌ Envie ou responda a um áudio junto do comando.')
    const tmp = path.join(os.tmpdir(), `tokito-menu-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    const entrada = `${tmp}.bin`
    const saida = `${tmp}.mp3`
    try {
      const b = await ctx.getFileBuffer(a, 'audio')
      fs.writeFileSync(entrada, b)
      await ff(entrada, saida)
      if (!fs.existsSync(saida) || !fs.statSync(saida).size)
        throw new Error('O FFmpeg não gerou o MP3.')
      const dir = path.join(ctx.__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'menu-audio')
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true })
      const arq = path.join(dir, 'menu.mp3')
      fs.copyFileSync(saida, arq)
      g.audioMenuArquivo = path.relative(ctx.__dirname, arq).replace(/\\/g, '/')
      modulos.salvarGlobal(g)
      return ctx.reply('✅ Áudio de fundo dos menus atualizado em MP3.')
    }
    catch (e) {
      return ctx.reply(`❌ Erro ao salvar áudio: ${e.message}`)
    }
    finally {
      for (const f of [entrada, saida])
        try {
          if (fs.existsSync(f))
            fs.unlinkSync(f)
        }
        catch {
        }
    }
  }
}
