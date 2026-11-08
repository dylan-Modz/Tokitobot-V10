'use strict';
// Estado privado das salas por grupo. IDs de sessão não aparecem em mensagens.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..', '..', 'INFO_DADOS', 'salas_ativas');
const MONITOR_MS = 4000; // o fornecedor só oferece consulta; não é evento instantâneo
const watchers = new Map();
const locks = new Set();

function id(ctx) {
  if (!ctx?.isGroup || !String(ctx.from || '').endsWith('@g.us')) return '';
  const bot = String(ctx.tokito?.user?.id || '').split(':')[0].split('@')[0];
  if (!bot) return '';
  return crypto.createHash('sha256').update(bot + ':' + String(ctx.from)).digest('hex');
}
function arquivo(ctx) {
  const key = id(ctx);
  return key ? path.join(ROOT, key + '.json') : '';
}
function ler(ctx) {
  const file = arquivo(ctx);
  if (!file) return {};
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch (e) {
    if (e.code === 'ENOENT') return {};
    throw e;
  }
}
function salvar(ctx, value) {
  const file = arquivo(ctx);
  if (!file) throw Error('Use os comandos de sala dentro de um grupo.');
  fs.mkdirSync(ROOT, { recursive: true });
  const temp = file + '.' + process.pid + '.' + crypto.randomBytes(4).toString('hex') + '.tmp';
  try {
    fs.writeFileSync(temp, JSON.stringify(value), { mode: 0o600 });
    fs.renameSync(temp, file);
  } finally { try { fs.unlinkSync(temp); } catch (_) {} }
  return value;
}
function atualizar(ctx, fn) {
  const old = ler(ctx);
  const next = fn(old) || old;
  return salvar(ctx, next);
}
function pessoa(ctx) {
  return String(typeof ctx.nJid === 'function' ? ctx.nJid(ctx.sender) : ctx.sender || '').trim();
}
function dono(ctx, session) {
  const creator = String(session?.creator || '');
  const sender = pessoa(ctx);
  return Boolean(creator && sender && creator === sender);
}
function ativa(ctx) {
  const session = ler(ctx).active;
  return session && session.sessionId && !['ended','stopped','expired','finished','closed','cancelled'].includes(session.status)
    ? session : null;
}
function travar(ctx) {
  const key=id(ctx);
  if (!key || locks.has(key)) return false;
  locks.add(key); return true;
}
function destravar(ctx) { locks.delete(id(ctx)); }
function pararMonitor(ctx) {
  const key=id(ctx), watcher=watchers.get(key);
  if (watcher) { clearInterval(watcher.timer); watchers.delete(key); }
}
function encerrar(ctx, status='ended') {
  pararMonitor(ctx);
  atualizar(ctx, state => {
    if(state.active) state.active = { ...state.active, status };
    state.draft = null;
    return state;
  });
}
function mensagemJogador(player, session, amount, total) {
  const nickname=String(player.nickname || 'Jogador').replace(/[\r\n*_\x00-\x1f]/g,' ').slice(0,55);
  const uid=String(player.uid || '').replace(/\D/g,'').slice(0,24) || 'Indisponível';
  const team=String(player.team || 'N/A').replace(/[\r\n\x00-\x1f]/g,' ').slice(0,20);
  return [
    '- 🎮 \`𝙽𝙾𝚅𝙾 𝙹𝙾𝙶𝙰𝙳𝙾𝚁 𝙽𝙰 𝚂𝙰𝙻𝙰\`',
    '',
    '> 👤 ׄ ( ɴɪᴄᴋ: ' + nickname + ' )',
    '> 🆔 ׄ ( ᴜɪᴅ: ' + uid + ' )',
    '> 🔵 ׄ ( ᴛɪᴍᴇ: ' + team + ' )',
    '> 🎯 ׄ ( ᴍᴏᴅᴏ: ' + String(session.modeName || session.mode || '-') + ' )',
    '> 👥 ׄ ( ᴊᴏɢᴀᴅᴏʀᴇs: ' + total + '/' + (session.maxPlayers || 8) + ' )',
    '',
    '> ✅ ׄ ( ᴏ ᴊᴏɢᴀᴅᴏʀ ᴇɴᴛʀᴏᴜ ɴᴀ sᴀʟᴀ! )'
  ].join('\n');
}
function monitorar(ctx, token) {
  if (!ativa(ctx) || !token || !ctx?.tokito?.sendMessage || !ctx?.axios?.get) return;
  const key=id(ctx);
  pararMonitor(ctx);
  let running=false, failures=0, scans=0;
  const tick=async()=>{
    if (running || !watchers.has(key)) return;
    running=true;
    try {
      const session=ativa(ctx);
      if (!session) {pararMonitor(ctx);return;}
      if (failures && scans % (Math.min(5,failures+1)) !== 0) return;
      const {data}=await ctx.axios.get(ctx.API_URL+'/api/salas/jogadores',{
        params:{apikey:token,sessionId:session.sessionId},
        timeout:12000
      });
      if (!data?.success || !Array.isArray(data.players)) {
        if (data?.sessionEnded) {encerrar(ctx,'ended');return;}
        failures++;return;
      }
      failures=0;
      const players=data.players.filter(p=>p && /^\d{5,24}$/.test(String(p.uid||'')));
      const previous=new Set(Array.isArray(session.seen)?session.seen:[]);
      const newcomers=players.filter(p=>!previous.has(String(p.uid)));
      // Marca ANTES de enviar: evita avisos duplicados após uma falha no WhatsApp.
      const currentIds=players.map(p=>String(p.uid));
      const next = atualizar(ctx, state=>{
        if (state.active?.sessionId!==session.sessionId) return state;
        state.active.seen=currentIds;
        state.active.playerCount=players.length;
        return state;
      });
      if (next.active?.sessionId !==session.sessionId) return;
      for (const player of newcomers.slice(0,8)) {
        const caption=mensagemJogador(player, session, players.length, players.length);
        const avatar=String(player.avatar||'');
        if (/^https:\/\/tokito-apis\.com\.br\/api\/v1\/player\/imagem\/\d{6,18}\.png$/i.test(avatar)) {
          try {
            await ctx.tokito.sendMessage(ctx.from,{image:{url:avatar},caption});
            continue;
          } catch (_) {}
        }
        await ctx.tokito.sendMessage(ctx.from,{text:caption});
      }
      if (++scans % 5 === 0) {
        const status=await ctx.axios.get(ctx.API_URL+'/api/salas/info',{
          params:{apikey:token,sessionId:session.sessionId},timeout:10000
        }).catch(()=>null);
        const state=String(status?.data?.room?.status||'').toLowerCase();
        if(['started','ended','stopped','expired','finished','closed','cancelled'].includes(state)) encerrar(ctx,state);
      }
    } catch (error) {
      failures++;
      if([404,410].includes(Number(error?.response?.status))) encerrar(ctx,'expired');
    } finally {running=false;}
  };
  const timer=setInterval(tick,MONITOR_MS);
  timer.unref?.();
  watchers.set(key,{timer});
  void tick();
}
module.exports={id,ler,salvar,atualizar,pessoa,dono,ativa,travar,destravar,encerrar,pararMonitor,monitorar,MONITOR_MS};
