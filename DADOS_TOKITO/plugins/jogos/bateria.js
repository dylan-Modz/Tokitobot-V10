/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Jogo: Bateria
 * Dev: Dylan Modz
 * ============================================================
 */

const crypto = require('crypto')
const { generateWAMessageFromContent } = require('baileys')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'bateria',

  comandos: [
    'bateria',
    'drums',
    'bateriagame'
  ],

  categoria: 'jogos',

  info: {
    descricao: 'Abre uma bateria interativa dentro do WhatsApp.',
    uso: 'bateria',
    categoria: 'jogos'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const bateriaHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
*{
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
  box-sizing:border-box;
}
html,body{
  margin:0;
  padding:0;
  width:100%;
  min-height:100%;
  overflow:hidden;
  background:#ffffff;
}
body{
  display:flex;
  justify-content:center;
  align-items:flex-start;
  padding:8px;
}
canvas{
  display:block;
  width:100%;
  max-width:600px;
  height:auto;
  background:#0f1722;
  border-radius:12px;
  touch-action:none;
}
</style>
</head>
<body>
<canvas id="c" width="600" height="410"></canvas>
<script>
(function(){
'use strict';

var cv = document.getElementById('c');
var g = cv.getContext('2d');
var W = 600;
var H = 410;
var score = 0;
var hits = 0;
var audioContext = null;

var pads = [
  {name:'BUMBO', key:'A', x:28,  y:132, w:168, h:102, freq:85},
  {name:'CAIXA', key:'S', x:216, y:132, w:168, h:102, freq:180},
  {name:'HI-HAT',key:'D', x:404, y:132, w:168, h:102, freq:430},
  {name:'TOM',   key:'J', x:28,  y:254, w:168, h:102, freq:145},
  {name:'CLAP',  key:'K', x:216, y:254, w:168, h:102, freq:250},
  {name:'PRATO', key:'L', x:404, y:254, w:168, h:102, freq:610}
];

function roundedRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function drawPad(p,active){
  g.fillStyle = active ? '#2196f3' : '#1c2a38';
  roundedRect(g,p.x,p.y,p.w,p.h,15);
  g.fill();

  g.strokeStyle = active ? '#8bd3ff' : '#334b61';
  g.lineWidth = 2;
  roundedRect(g,p.x,p.y,p.w,p.h,15);
  g.stroke();

  g.fillStyle = '#ffffff';
  g.textAlign = 'center';
  g.font = 'bold 19px Arial';
  g.fillText(p.name,p.x+p.w/2,p.y+43);

  g.fillStyle = active ? '#ffffff' : '#8fa7bb';
  g.font = '12px Arial';
  g.fillText('TECLA '+p.key,p.x+p.w/2,p.y+69);
}

function render(){
  g.fillStyle = '#0f1722';
  g.fillRect(0,0,W,H);

  g.fillStyle = '#ffffff';
  g.textAlign = 'left';
  g.font = 'bold 26px Arial';
  g.fillText('BATERIA TOKITO',28,42);

  g.fillStyle = '#8fa7bb';
  g.font = '13px Arial';
  g.fillText('Toque nos pads para testar',28,66);

  g.textAlign = 'right';
  g.fillStyle = '#74c7ff';
  g.font = 'bold 16px Arial';
  g.fillText('PONTOS '+score,572,42);

  g.fillStyle = '#8fa7bb';
  g.font = '12px Arial';
  g.fillText('TOQUES '+hits,572,64);

  g.fillStyle = '#142230';
  roundedRect(g,28,84,544,34,10);
  g.fill();

  g.fillStyle = '#b9cddd';
  g.textAlign = 'center';
  g.font = '13px Arial';
  g.fillText('Bumbo • Caixa • Hi-Hat • Tom • Clap • Prato',300,106);

  for(var i=0;i<pads.length;i++) drawPad(pads[i],false);

  g.fillStyle = '#71889a';
  g.font = '11px Arial';
  g.textAlign = 'center';
  g.fillText('Se o som nao sair, os pads ainda devem acender normalmente.',300,389);
}

function getAudio(){
  try{
    if(!audioContext){
      var A = window.AudioContext || window.webkitAudioContext;
      if(A) audioContext = new A();
    }
    if(audioContext && audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }catch(e){
    return null;
  }
}

function beep(freq){
  try{
    var ac = getAudio();
    if(!ac) return;
    var now = ac.currentTime;
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq,now);
    gain.gain.setValueAtTime(0.22,now);
    gain.gain.exponentialRampToValueAtTime(0.001,now+0.12);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now+0.12);
  }catch(e){}
}

function activate(index){
  var p = pads[index];
  if(!p) return;

  hits += 1;
  score += 5;
  render();
  drawPad(p,true);
  beep(p.freq);

  setTimeout(function(){
    render();
  },110);
}

function pointFromEvent(e){
  var rect = cv.getBoundingClientRect();
  var clientX = 0;
  var clientY = 0;

  if(e.touches && e.touches.length){
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }else{
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x:(clientX-rect.left)*(cv.width/rect.width),
    y:(clientY-rect.top)*(cv.height/rect.height)
  };
}

function press(e){
  if(e && e.preventDefault) e.preventDefault();
  var pt = pointFromEvent(e);

  for(var i=0;i<pads.length;i++){
    var p = pads[i];
    if(pt.x>=p.x && pt.x<=p.x+p.w && pt.y>=p.y && pt.y<=p.y+p.h){
      activate(i);
      return false;
    }
  }
  return false;
}

cv.addEventListener('touchstart',press,{passive:false});
cv.addEventListener('mousedown',press,false);

window.addEventListener('keydown',function(e){
  var key = String(e.key || '').toUpperCase();
  for(var i=0;i<pads.length;i++){
    if(pads[i].key === key){
      if(e.preventDefault) e.preventDefault();
      activate(i);
      return;
    }
  }
});

render();
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
                  payload: bateriaHtml,
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
                    messageText: '🥁 Bateria Tokito'
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
          '[BATERIA]',
          error?.stack || error?.message || error
        )

        return reply(
          `*❌ | Não foi possível abrir o jogo de bateria.*\n\n> ${error?.message || 'Erro desconhecido'}`
        )
      }
    }
  }
})
