/*
 * TOKITO BOT V10 - card do Brasileirão, sem módulos nativos.
 * Capa: Boca Notícias | Dados: Tokito APIs | Dev: Dylan Modz
 */
const fs = require('fs')
const axios = require('axios')
const { PassThrough, Readable } = require('stream')
const PImage = require('pureimage')

const CAPA = 'https://images.boca.com.br/upload/imagens-resizes/ae4a7c11b147effb4792d4a8cf0a5eaa_858x483.png'
const W = 1500
const tex = (v, max = 60, vazio = '—') => String(v === undefined || v === null || v === '' ? vazio : v)
  .replace(/[\r\n\t]/g, ' ').trim().slice(0, max)
const pont = x => Number.isFinite(Number(x)) && x !== null && x !== '' ? Number(x).toLocaleString('pt-BR') : '—'
const sigla = x => x ? ' (' + tex(x, 6) + ')' : ''
const percentual = x => x === undefined || x === null || x === '' ? '—' :
  tex(x, 14).replace('%', '').replace('.', ',') + '%'
const saldo = x => x === undefined || x === null || x === '' ? '—' :
  (Number(x) > 0 ? '+' : '') + tex(x, 9)
const FONTES = [
  '/system/fonts/Roboto-Regular.ttf',
  '/system/fonts/RobotoStatic-Regular.ttf',
  '/system/fonts/NotoSans-Regular.ttf',
  '/data/data/com.termux/files/usr/share/fonts/TTF/DejaVuSans.ttf',
  '/data/data/com.termux/files/usr/share/fonts/DejaVuSans.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'
]
let fontePronta = false
function fonte() {
  if (fontePronta) return
  for (const arquivo of FONTES) {
    if (!fs.existsSync(arquivo)) continue
    try {
      PImage.registerFont(arquivo, 'TokitoCard').loadSync()
      fontePronta = true
      return
    } catch (e) {}
  }
  throw new Error('Fonte TTF do sistema não encontrada para gerar card.')
}
function retangulo(ctx,x,y,w,h,cor) {
  ctx.fillStyle = cor
  ctx.fillRect(x,y,w,h)
}
function texto(ctx,str,x,y,tamanho=24,cor='#f4f7fc') {
  ctx.font = tamanho + "pt 'TokitoCard'"
  ctx.fillStyle = cor
  ctx.fillText(tex(str,170,''),x,y)
}
async function desenharCapa(ctx){
  try {
    const resposta = await axios.get(CAPA, {
      responseType:'arraybuffer',timeout:10000,maxContentLength:5*1024*1024,
      validateStatus:()=>true
    })
    if(resposta.status!==200) return false
    const bytes=Buffer.from(resposta.data)
    const src=await PImage.decodePNGFromStream(Readable.from([bytes]))
    const ratio=W/src.width, altura=330/ratio
    const cropH=Math.min(src.height,altura)
    ctx.drawImage(src,0,Math.max(0,(src.height-cropH)/2),src.width,cropH,0,0,W,330)
    return true
  } catch(e) {
    console.log('[BRASILEIRÃO CAPA] Falha ao carregar imagem:',e?.message||e)
    return false
  }
}
async function gerar(resultado){
  const tabela=Array.isArray(resultado?.tabela)?resultado.tabela:[]
  if(!tabela.length) throw new Error('Classificação vazia.')
  fonte()
  const artilheiros=Array.isArray(resultado?.artilheiros)?resultado.artilheiros.slice(0,3):[]
  const jogos=Array.isArray(resultado?.rodada_atual)?resultado.rodada_atual.slice(0,10):[]
  const linhas=Math.ceil(tabela.length/2), topo=493, passo=91
  const fimTabela=topo+linhas*passo
  const temArtilharia=artilheiros.length>0
  const baseArtilharia=fimTabela+76
  const baseJogos=baseArtilharia+(temArtilharia?160:0)+30
  const quantidadeLinhasJogos=Math.ceil(jogos.length/2)
  const altura=Math.max(1600,baseJogos+(jogos.length?90+quantidadeLinhasJogos*61:0)+95)
  const canvas=PImage.make(W,altura)
  const ctx=canvas.getContext('2d')
  retangulo(ctx,0,0,W,altura,'#071226')
  retangulo(ctx,0,330,W,8,'#e2af47')
  if(!await desenharCapa(ctx)){
    retangulo(ctx,0,0,W,330,'#10305a')
    retangulo(ctx,0,322,W,8,'#e2af47')
    texto(ctx,'BRASILEIRÃO • SÉRIE A',95,195,65,'#f3f7ff')
    texto(ctx,'CAMPEONATO BRASILEIRO',100,257,28,'#f3c26e')
  }
  retangulo(ctx,0,338,W,155,'#0d1c37')
  texto(ctx,'BRASILEIRÃO SÉRIE A',56,403,49,'#ffffff')
  const lider=tabela[0]
  texto(ctx,'Temporada '+tex(resultado?.temporada,12,'2026')+
    '   •   '+tabela.length+' clubes   •   Líder: '+tex(lider?.nome,33)+
    ' ('+pont(lider?.pontos)+' pts)',58,460,26,'#f1bf68')
  texto(ctx,'CLASSIFICAÇÃO COMPLETA',60,topo+25,37,'#e9bf71')
  const xCol=[60,770], largura=675
  for(let i=0;i<tabela.length;i++){
    const item=tabela[i],col=Math.floor(i/linhas),linha=i%linhas
    const x=xCol[col],y=topo+53+linha*passo
    retangulo(ctx,x,y,largura,81,linha%2?'#101f3b':'#172743')
    retangulo(ctx,x,y,6,81,i<4?'#4abd8e':i>=16?'#e96b73':'#527ca5')
    const nome=tex(item?.nome,29,'Time')+sigla(item?.sigla)
    texto(ctx,String(item?.posicao||i+1).padStart(2,'0')+'º  '+nome,x+16,y+31,25,'#f3f5fd')
    texto(ctx,pont(item?.pontos)+' PTS',x+554,y+31,22,'#f5c877')
    const estat='J '+pont(item?.jogos)+'  V '+pont(item?.vitorias)+
      '  E '+pont(item?.empates)+'  D '+pont(item?.derrotas)+
      '   SG '+saldo(item?.saldo_gols)+'   AP '+percentual(item?.aproveitamento)
    texto(ctx,estat,x+16,y+65,17,'#bac9da')
  }
  if(temArtilharia){
    texto(ctx,'ARTILHARIA',60,baseArtilharia,35,'#f0be6d')
    artilheiros.forEach((j,i)=>{
      texto(ctx,(i+1)+'º  '+tex(j?.jogador,56,'Jogador')+' — '+pont(j?.gols)+' gols',
        65,baseArtilharia+43+i*33,22,'#f2f5fc')
    })
  }
  if(jogos.length){
    texto(ctx,'JOGOS DA RODADA',60,baseJogos+32,35,'#f0be6d')
    jogos.forEach((j,i)=>{
      const x=xCol[i%2],y=baseJogos+65+Math.floor(i/2)*61
      retangulo(ctx,x,y,largura,55,'#172743')
      texto(ctx,tex(j?.mandante,23,'Time')+' x '+tex(j?.visitante,23,'Time'),x+12,y+24,21,'#eff2fb')
      const data=tex(j?.data,22,''),hora=tex(j?.hora||j?.horario,12,'')
      const detalhes=[data,hora].filter(Boolean).join(' • ')
      texto(ctx,detalhes||'Horário não informado',x+12,y+48,16,'#b9cbe0')
    })
  }
  retangulo(ctx,0,altura-65,W,65,'#0d203e')
  texto(ctx,'TOKITO BOT V10  •  DADOS: TOKITO APIS  •  CAPA: BOCA NOTÍCIAS',60,altura-23,18,'#8daacc')
  // JPEG é mais leve que PNG para envio no WhatsApp, mantendo a arte num único arquivo.
  const partes=[]
  const stream=new PassThrough()
  stream.on('data',x=>partes.push(x))
  await PImage.encodeJPEGToStream(canvas,stream,88)
  return Buffer.concat(partes)
}
module.exports={gerar,CAPA}
