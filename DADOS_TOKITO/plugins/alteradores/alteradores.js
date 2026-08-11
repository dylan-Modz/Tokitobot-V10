const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process')
const modulos = require('../../sistemas/modulos')

const mapa = {
  videolento: {
    tipo: 'video',
    vf: 'setpts=2.0*PTS',
    af: 'atempo=0.5'
  },
  videorapido: {
    tipo: 'video',
    vf: 'setpts=0.5*PTS',
    af: 'atempo=2.0'
  },
  videocontrario: {
    tipo: 'video',
    vf: 'reverse',
    af: 'areverse'
  },
  audiolento: {
    tipo: 'audio',
    af: 'atempo=0.7'
  },
  audiorapido: {
    tipo: 'audio',
    af: 'atempo=1.4'
  },
  speedup: {
    tipo: 'audio',
    af: 'atempo=1.35'
  },
  slowed: {
    tipo: 'audio',
    af: 'asetrate=44100*0.85,aresample=44100'
  },
  grave: {
    tipo: 'audio',
    af: 'asetrate=44100*0.85,aresample=44100'
  },
  grave2: {
    tipo: 'audio',
    af: 'asetrate=44100*0.7,aresample=44100'
  },
  esquilo: {
    tipo: 'audio',
    af: 'asetrate=44100*1.35,aresample=44100'
  },
  estourar: {
    tipo: 'audio',
    af: 'volume=8'
  },
  bass: {
    tipo: 'audio',
    af: 'bass=g=12'
  },
  bass2: {
    tipo: 'audio',
    af: 'bass=g=20'
  },
  vozmenino: {
    tipo: 'audio',
    af: 'asetrate=44100*1.25,aresample=44100'
  }
}

const ff = (args) => new Promise((res, rej) => {
  const p = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args])
  let e = ''
  p.stderr.on('data', d => e += d)
  p.on('error', rej)
  p.on('close', c => c === 0 ? res() : rej(new Error(e.trim() || `ffmpeg ${c}`)))
})

module.exports = {
  nome: 'videolento',
  comandos: Object.keys(mapa),
  categoria: 'alteradores',
  info: {
    descricao: 'Altera velocidade, grave, bass e voz usando FFmpeg local.',
    uso: 'videolento respondendo mídia'
  },
  async executar(ctx) {
    const cfg = mapa[ctx.command]
    const m = modulos.mediaAtual(ctx)
    const src = cfg.tipo === 'video' ? m.video : m.audio
    if (!src)
      return ctx.reply(`❌ Responda a ${cfg.tipo === 'video' ? 'um vídeo' : 'um áudio'}.`)
    const tipo = cfg.tipo === 'video' ? 'video' : 'audio'
    const b = await ctx.getFileBuffer(src, tipo)
    const base = path.join(os.tmpdir(), `tokito_${Date.now()}_${Math.random().toString(36).slice(2)}`)
    const inp = base + (cfg.tipo === 'video' ? '.mp4' : '.ogg')
    const out = base + (cfg.tipo === 'video' ? '.mp4' : '.mp3')
    fs.writeFileSync(inp, b)
    try {
      let args = ['-i', inp]
      if (cfg.tipo === 'audio')
        args.push('-af', cfg.af, '-vn', '-codec:a', 'libmp3lame', '-q:a', '3', out)
      else {
        if (cfg.vf)
          args.push('-vf', cfg.vf)
        if (cfg.af)
          args.push('-af', cfg.af)
        args.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-c:a', 'aac', '-movflags', '+faststart', out)
        try {
          await ff(args)
        }
        catch {
          args = [
            '-i',
            inp,
            '-vf',
            cfg.vf,
            '-an',
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-crf',
            '28',
            out
          ]
          await ff(args)
        }
        if (fs.existsSync(out)) {
          const data = fs.readFileSync(out)
          return ctx.tokito.sendMessage(ctx.from, {
            video: data,
            mimetype: 'video/mp4',
            caption: `🧊 ${ctx.command}`,
            contextInfo: ctx.canalInfo([ctx.sender])
          }, { quoted: ctx.selo })
        }
      }
      await ff(args)
      const data = fs.readFileSync(out)
      return ctx.tokito.sendMessage(ctx.from, {
        audio: data,
        mimetype: 'audio/mpeg',
        ptt: false,
        contextInfo: ctx.canalInfo([ctx.sender])
      }, { quoted: ctx.selo })
    }
    catch (e) {
      return ctx.reply(`❌ Erro no FFmpeg: ${e.message}`)
    }
    finally {
      for (const f of [inp, out])
        try {
          if (fs.existsSync(f))
            fs.unlinkSync(f)
        }
        catch {
        }
    }
  }
}
