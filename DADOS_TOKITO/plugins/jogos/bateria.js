/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Jogo: Dino
 * Dev: Dylan Modz
 * ============================================================
 */

const crypto = require('crypto')
const { generateWAMessageFromContent } = require('baileys')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'dino',

  comandos: [
    'dino',
    'dinossauro',
    'trex'
  ],

  categoria: 'jogos',

  info: {
    descricao: 'Abre o jogo do dinossauro dentro do WhatsApp.',
    uso: 'dino',
    categoria: 'jogos'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const dinoHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
html,body{margin:0;padding:0;width:100%;min-height:100%;overflow:hidden;background:#fff}
body{display:flex;justify-content:center;align-items:flex-start;padding:8px}
.wrap{width:100%;max-width:650px;background:#fff}
canvas{display:block;width:100%;height:auto;background:#fff;image-rendering:pixelated;image-rendering:crisp-edges;touch-action:none}
.hint{font:11px monospace;color:#777;text-align:center;margin-top:4px}
</style>
</head>
<body>
<div class="wrap">
<canvas id="c" width="600" height="160"></canvas>
<div class="hint">TOQUE PARA PULAR • ↓ PARA ABAIXAR</div>
</div>
<script>
(function(){
'use strict';
var cv=document.getElementById('c');
var ctx=cv.getContext('2d',{alpha:false});
ctx.imageSmoothingEnabled=false;
var W=600,H=160,GROUND=132;
var dino,obs,clouds,speed,score,hi,started,gameOver,last,spawn,night,nightTimer;
hi=0;

function reset(){
 dino={x:42,y:GROUND-43,w:38,h:43,vy:0,onGround:true,duck:false,frame:0,t:0};
 obs=[];
 clouds=[{x:150,y:28,s:1},{x:345,y:42,s:.8},{x:530,y:23,s:1.1}];
 speed=6;score=0;started=false;gameOver=false;last=0;spawn=72;night=false;nightTimer=0;
}
function jump(){
 if(gameOver){reset();started=true;return}
 started=true;
 if(dino.onGround){dino.duck=false;dino.h=43;dino.y=GROUND-dino.h;dino.vy=-10.8;dino.onGround=false}
}
function duck(v){
 if(!dino.onGround)return;
 dino.duck=v;dino.h=v?24:43;dino.w=v?52:38;dino.y=GROUND-dino.h;
}
function rect(x,y,w,h){ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function drawDino(){
 var x=dino.x,y=dino.y;
 ctx.fillStyle='#535353';
 if(dino.duck){
   rect(x+2,y+8,34,13);rect(x+30,y+3,19,15);rect(x+44,y+6,6,5);rect(x+10,y+20,7,4);rect(x+30,y+20,7,4);
   ctx.fillStyle=night?'#535353':'#fff';rect(x+42,y+6,2,2);return;
 }
 rect(x+9,y+8,18,23);rect(x+20,y+2,17,16);rect(x+33,y+7,7,5);rect(x+4,y+20,8,5);rect(x+2,y+24,7,4);
 rect(x+12,y+30,8,5);rect(x+17,y+34,5,8);
 var run=(Math.floor(dino.frame)%2===0);
 if(!dino.onGround){rect(x+12,y+36,5,7);rect(x+24,y+34,5,8)}
 else if(run){rect(x+10,y+36,5,7);rect(x+25,y+34,5,8)}
 else{rect(x+14,y+35,5,8);rect(x+27,y+37,7,4)}
 ctx.fillStyle=night?'#535353':'#fff';rect(x+29,y+5,3,3);rect(x+31,y+15,6,2);
}
function drawCactus(o){
 ctx.fillStyle='#535353';
 rect(o.x,o.y,o.w,o.h);
 if(o.big){rect(o.x-6,o.y+15,6,6);rect(o.x-9,o.y+10,4,12);rect(o.x+o.w,o.y+20,6,6);rect(o.x+o.w+4,o.y+13,4,13)}
 else{rect(o.x-4,o.y+13,4,5);rect(o.x-6,o.y+9,3,10);rect(o.x+o.w,o.y+16,4,5);rect(o.x+o.w+3,o.y+11,3,10)}
}
function drawPtero(o){
 ctx.fillStyle='#535353';var flap=Math.floor(o.frame)%2===0;
 rect(o.x+9,o.y+8,26,9);rect(o.x+31,o.y+5,12,7);rect(o.x+40,o.y+7,7,3);rect(o.x+3,o.y+12,10,5);
 if(flap){rect(o.x+12,o.y,17,7);rect(o.x+8,o.y+2,6,5)}else{rect(o.x+13,o.y+17,18,7);rect(o.x+8,o.y+18,7,5)}
 ctx.fillStyle=night?'#535353':'#fff';rect(o.x+37,o.y+7,2,2);
}
function drawCloud(c){
 ctx.strokeStyle='#aaa';ctx.lineWidth=1;ctx.beginPath();
 ctx.moveTo(c.x,c.y+9);ctx.bezierCurveTo(c.x+5,c.y+2,c.x+12,c.y+5,c.x+14,c.y+7);
 ctx.bezierCurveTo(c.x+17,c.y,c.x+29,c.y,c.x+32,c.y+8);
 ctx.bezierCurveTo(c.x+37,c.y+5,c.x+44,c.y+8,c.x+45,c.y+12);
 ctx.lineTo(c.x+3,c.y+12);ctx.stroke();
}
function drawGround(){
 ctx.strokeStyle='#777';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,GROUND+.5);ctx.lineTo(W,GROUND+.5);ctx.stroke();
 ctx.fillStyle='#999';for(var i=0;i<25;i++){var gx=((i*47-(score*speed*.55))%(W+50)+W+50)%(W+50)-20;rect(gx,GROUND+7+(i%3)*4,2+(i%4)*2,1)}
}
function drawScore(){
 ctx.fillStyle='#666';ctx.font='16px monospace';ctx.textAlign='right';
 var s=String(Math.floor(score)).padStart(5,'0'),h=String(Math.floor(hi)).padStart(5,'0');
 ctx.fillText((hi>0?'HI '+h+'   ':'')+s,W-10,22);ctx.textAlign='left';
}
function message(){
 ctx.fillStyle='#666';ctx.textAlign='center';
 if(gameOver){ctx.font='bold 18px monospace';ctx.fillText('GAME OVER',W/2,58);ctx.font='12px monospace';ctx.fillText('toque para reiniciar',W/2,78)}
 else if(!started){ctx.font='13px monospace';ctx.fillText('toque na tela para começar',W/2,64)}
 ctx.textAlign='left';
}
function spawnObstacle(){
 var r=Math.random();
 if(r<.4)obs.push({type:'c',x:W+5,w:11,h:30,y:GROUND-30,big:false});
 else if(r<.78)obs.push({type:'c',x:W+5,w:15,h:44,y:GROUND-44,big:true});
 else {var ys=[GROUND-38,GROUND-63,GROUND-86];obs.push({type:'p',x:W+5,w:47,h:25,y:ys[Math.floor(Math.random()*ys.length)],frame:0,t:0})}
}
function hit(a,b){var ax=a.x+5,ay=a.y+5,aw=a.w-10,ah=a.h-8,bx=b.x+3,by=b.y+3,bw=b.w-6,bh=b.h-6;return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by}
function loop(t){
 if(!last)last=t;var dt=Math.min((t-last)/16.67,2);last=t;
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=night?'#000':'#fff';ctx.fillRect(0,0,W,H);
 clouds.forEach(drawCloud);
 if(started&&!gameOver){
   dino.t+=dt;if(dino.t>5){dino.frame++;dino.t=0}
   dino.vy+=.62*dt;dino.y+=dino.vy*dt;
   var floor=GROUND-dino.h;if(dino.y>=floor){dino.y=floor;dino.vy=0;dino.onGround=true}
   clouds.forEach(function(c){c.x-=speed*.12*dt;if(c.x<-55)c.x=W+Math.random()*100});
   spawn-=dt;if(spawn<=0){spawnObstacle();spawn=Math.max(38,78-speed*2)+Math.random()*34}
   obs.forEach(function(o){o.x-=speed*dt;if(o.type==='p'){o.t+=dt;if(o.t>10){o.frame++;o.t=0}}});
   obs=obs.filter(function(o){return o.x>-70});
   score+=dt*.13;if(score>hi)hi=score;speed=Math.min(13,speed+.0024*dt);
   nightTimer+=dt;if(nightTimer>500){nightTimer=0;night=!night}
   for(var i=0;i<obs.length;i++){if(hit(dino,obs[i])){gameOver=true;break}}
 }
 drawGround();
 obs.forEach(function(o){if(o.type==='c')drawCactus(o);else drawPtero(o)});
 drawDino();drawScore();message();requestAnimationFrame(loop);
}
cv.addEventListener('pointerdown',function(e){if(e.preventDefault)e.preventDefault();jump()},{passive:false});
cv.addEventListener('touchstart',function(e){if(e.preventDefault)e.preventDefault();jump()},{passive:false});
document.addEventListener('keydown',function(e){if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();jump()}if(e.code==='ArrowDown'){e.preventDefault();duck(true)}});
document.addEventListener('keyup',function(e){if(e.code==='ArrowDown'){e.preventDefault();duck(false)}});
reset();requestAnimationFrame(loop);
})();
</script>
</body>
</html>`

        const unifiedData = {
          response_id: crypto.randomUUID(),
          sections: [
            {
              view_model: {
                primitive: {
                  __typename: 'GenAIaeacdsnwHtmlPrimitive',
                  payload: dinoHtml,
                  trusted_sources: ['zone.api.br']
                },
                __typename: 'GenAISingleLayoutViewModel'
              }
            }
          ]
        }

        const payload = {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
            botMetadata: {
              messageDisclaimerText: '',
              botResponseId: crypto.randomUUID(),
              verificationMetadata: {
                proofs: [
                  {
                    version: 1,
                    useCase: 1,
                    signature: 'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==',
                    certificateChain: [
                      'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg',
                      'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ=='
                    ]
                  }
                ]
              }
            }
          },

          botForwardedMessage: {
            message: {
              richResponseMessage: {
                messageType: 1,
                submessages: [
                  {
                    messageType: 2,
                    messageText: '🦖 Dino Tokito'
                  }
                ],
                unifiedResponse: {
                  data: Buffer
                    .from(JSON.stringify(unifiedData))
                    .toString('base64')
                },
                contextInfo: {
                  forwardingScore: 1,
                  isForwarded: true,
                  forwardedAiBotMessageInfo: {
                    botJid: '867051314767696@bot'
                  },
                  forwardOrigin: 4
                }
              }
            }
          }
        }

        const msg = generateWAMessageFromContent(
          from,
          payload,
          {
            quoted: info,
            userJid: tokito.user?.id
          }
        )

        await tokito.relayMessage(
          from,
          msg.message,
          {
            messageId: msg.key.id
          }
        )
      }
      catch (error) {
        console.log(
          '[DINO]',
          error?.stack || error?.message || error
        )

        return reply(
          `*❌ | Não foi possível abrir o jogo do Dino.*\n\n> ${error?.message || 'Erro desconhecido'}`
        )
      }
    }
  }
})
