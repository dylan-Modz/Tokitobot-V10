'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const scraperFile=path.join(__dirname,'..','..','scrapers','downloads','tiktoksearch.js');
const pluginFile=path.join(__dirname,'..','..','plugins','downloads','tiktoksearch.js');
const scraperSource=fs.readFileSync(scraperFile,'utf8');
const pluginSource=fs.readFileSync(pluginFile,'utf8');
const ids=['7351234567890123456','7351234567890123457','7351234567890123458'];

function fixture() {
  const requests=[];
  const data={
    0:[{id:ids[0],titulo:'Vídeo A',link:'https://www.tiktok.com/@perfil/video/'+ids[0]},
       {id:ids[1],titulo:'Vídeo B',link:'https://www.tiktok.com/@perfil/video/'+ids[1]}],
    20:[{id:ids[2],titulo:'Vídeo C',link:'https://www.tiktok.com/@perfil/video/'+ids[2]}]
  };
  const api={
    url(route,params){return 'https://tokito-apis.com.br'+route+'?url='+encodeURIComponent(params.url);},
    async get(route,params){
      requests.push({route,params});
      return {status:true,resultados:data[params.cursor]||[],cursor:params.cursor+20,mais_resultados:params.cursor===0};
    },
    axios:{
      async get(){throw Error('do not call CDN in this test');}
    }
  };
  const moduleObj={exports:{}};
  vm.runInNewContext(scraperSource,{
    module:moduleObj,exports:moduleObj.exports,URL,Buffer,Set,Map,Date,Math,
    require(id){if(id==='./client')return api;throw Error('Unexpected require '+id);}
  },{filename:scraperFile});
  const scraper=moduleObj.exports;
  const sent=[],responses=[],reactions=[];
  let command;
  vm.runInNewContext(pluginSource,{
    require(id){
      if(id==='../../scrapers/downloads/tiktoksearch')return scraper;
      if(id==='../../database/lib/comandos')return {setCommand(x){command=x;}};
      throw Error('Unexpected require '+id);
    },
    console:{log(){}},Buffer,Set,Math
  },{filename:pluginFile});
  scraper.obterVideo=async item=>Buffer.from(item.id);
  const createCtx=(chat,query)=>({
    q:query,from:chat,prefix:'/',command:'tiktoksearch',
    sender:'user@s.whatsapp.net',newsletter:{},selo:{},
    API_KEY_TOKITO:'secret',API_URL:'https://tokito-apis.com.br',
    mess:{
      downloadUso:()=> 'uso',wait:()=> 'aguarde',
      downloadNaoEncontrado:()=> 'nao encontrado',
      downloadSemMidia:()=> 'sem novos videos',
      erroApi:()=> 'erro'
    },
    modulos:{sanitizarErro:e=>String(e?.message||e)},
    itens:value=>value?.resultados||[],
    async reply(msg){responses.push({chat,msg});},
    async reagir(chat,emoji){reactions.push({chat,emoji});},
    tokito:{async sendMessage(chat,packet){sent.push({chat,id:packet.video.toString(),caption:packet.caption});}}
  });
  return{requests,sent,responses,reactions,command,createCtx,scraper};
}

test('scraper passa cursor/limite e reconhece mesmo vídeo por ID',async()=>{
  const f=fixture();
  await f.scraper.buscar('dance',{cursor:20,limite:15});
  assert.equal(f.requests[0].params.cursor,20);
  assert.equal(f.requests[0].params.limite,15);
  assert.equal(f.scraper.chaveVideo({id:ids[0],video:'https://cdn.exemplo.com/a?token=um'}),'id:'+ids[0]);
  assert.equal(f.scraper.chaveVideo({id:ids[0],video:'https://cdn.exemplo.com/a?token=dois'}),'id:'+ids[0]);
});

test('três chamadas iguais recebem três vídeos diferentes e avançam página',async()=>{
  const f=fixture();
  for(let i=0;i<3;i++) await f.command.executar(f.createCtx('grupo@g.us','dance'));
  assert.equal(f.sent.length,3);
  assert.equal(new Set(f.sent.map(x=>x.id)).size,3);
  assert.ok(f.requests.some(x=>x.params.cursor===20));
  assert.ok(f.sent.every(x=>x.caption.includes('𝚅𝙸́𝙳𝙴𝙾')));
  await f.command.executar(f.createCtx('grupo@g.us','dance'));
  assert.equal(f.sent.length,3,'não pode reenviar vídeo já visto');
  assert.ok(f.responses.some(x=>x.msg==='sem novos videos'));
});

test('histórico é por conversa; outro grupo pode receber resultado inicial',async()=>{
  const f=fixture();
  await f.command.executar(f.createCtx('grupo1@g.us','dance'));
  await f.command.executar(f.createCtx('grupo2@g.us','dance'));
  assert.equal(f.sent.length,2);
  assert.equal(f.scraper.sessaoBusca('grupo1@g.us','dance').vistos.size,1);
  assert.equal(f.scraper.sessaoBusca('grupo2@g.us','dance').vistos.size,1);
});

test('marca como visto somente após envio bem-sucedido',async()=>{
  const f=fixture();
  const ctx=f.createCtx('erro@g.us','dance');
  ctx.tokito.sendMessage=async()=>{throw Error('WhatsApp indisponível');};
  await f.command.executar(ctx);
  assert.equal(f.scraper.sessaoBusca('erro@g.us','dance').vistos.size,0);
});
