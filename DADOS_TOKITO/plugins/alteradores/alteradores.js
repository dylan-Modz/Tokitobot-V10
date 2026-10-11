/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

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

const ff = args => new Promise((resolve,reject) => {
const p=spawn('ffmpeg',['-nostdin','-y','-hide_banner','-loglevel','error',...args])
let e=''
p.stderr.on('data',d => {e=(e+String(d)).slice(-5000)})
p.once('error',reject)
p.once('close',c=>c===0?resolve():reject(new Error(e.trim()||'ffmpeg '+c)))
})

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'videolento',
comandos: Object.keys(mapa),
categoria: 'alteradores',
info: {
descricao: 'Altera velocidade, grave, bass e voz usando FFmpeg local.',
uso: 'videolento respondendo mídia'
},
async executar(ctx) {
const cfg=mapa[ctx.command]
if(!cfg)return ctx.reply('Efeito desconhecido.')
const media=modulos.mediaAtual(ctx)
const tipo=cfg.tipo==='video'?'video':'audio'
const origem=tipo==='video'?media.video:media.audio
if(!origem)return ctx.reply(ctx.mess.padraoUso({
emoji:tipo==='video'?'🎥':'🎧',
titulo:'MÍDIA NECESSÁRIA',
uso:ctx.prefix+ctx.command,
descricao:'Responda a '+(tipo==='video'?'um vídeo':'um áudio')+' para usar este comando.'
}))
let pasta
try {
pasta=fs.mkdtempSync(path.join(os.tmpdir(),'tokito-alterador-'))
const inp=path.join(pasta,tipo==='video'?'entrada.mp4':'entrada.ogg')
const out=path.join(pasta,tipo==='video'?'resultado.mp4':'resultado.mp3')
const buffer=await ctx.getFileBuffer(origem,tipo)
if(!buffer||!buffer.length)throw new Error('Mídia recebida vazia.')
fs.writeFileSync(inp,buffer)
if(tipo==='video'){
const base=['-i',inp,'-map','0:v:0','-map','0:a:0?',
...(cfg.vf?['-vf',cfg.vf]:[]),...(cfg.af?['-af',cfg.af]:[]),
'-c:v','libx264','-preset','veryfast','-crf','28',
'-pix_fmt','yuv420p','-c:a','aac','-movflags','+faststart',out]
try{await ff(base)}
catch(err){
if(fs.existsSync(out))fs.unlinkSync(out)
// Fallback para vídeo mudo ou áudio corrompido.
await ff(['-i',inp,'-map','0:v:0',...(cfg.vf?['-vf',cfg.vf]:[]),
'-an','-c:v','libx264','-preset','veryfast','-crf','28',
'-pix_fmt','yuv420p','-movflags','+faststart',out])
}
if(!fs.existsSync(out)||fs.statSync(out).size===0)throw new Error('Vídeo não gerado.')
return await ctx.tokito.sendMessage(ctx.from,{
video:fs.readFileSync(out),mimetype:'video/mp4',
contextInfo:ctx.canalInfo([ctx.sender])
},{quoted:ctx.selo})
}
await ff(['-i',inp,'-vn','-af',cfg.af,'-codec:a','libmp3lame','-q:a','3',out])
if(!fs.existsSync(out)||fs.statSync(out).size===0)throw new Error('Áudio não gerado.')
return await ctx.tokito.sendMessage(ctx.from,{
audio:fs.readFileSync(out),mimetype:'audio/mpeg',ptt:false,
contextInfo:ctx.canalInfo([ctx.sender])
},{quoted:ctx.selo})
}catch(e){
return ctx.reply(ctx.mess.padraoErro({titulo:'ERRO NO FFMPEG',
descricao:'Não foi possível processar a mídia.',detalhe:e.message||String(e)}))
}finally{
if(pasta)try{fs.rmSync(pasta,{recursive:true,force:true})}
catch(e){console.log('[FFMPEG LIMPEZA]',e.message||String(e))}
}
}
}
)
