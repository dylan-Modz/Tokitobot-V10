/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Jogo: Dino
 * Dev: Dylan Modz
 * ============================================================
 */

const crypto = require('crypto')
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
*{
    box-sizing:border-box;
    -webkit-tap-highlight-color:transparent;
    -webkit-user-select:none;
    user-select:none;
}

html,body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    min-height:100vh;
    overflow:hidden;
    background:#dff4ff;
}

body{
    display:flex;
    align-items:center;
    justify-content:center;
    padding:14px;
    touch-action:none;
    font-family:Arial,Helvetica,sans-serif;
}

#game{
    width:94vw;
    max-width:620px;
    overflow:hidden;
    border:3px solid #1687d9;
    border-radius:20px;
    background:#f7fcff;
    box-shadow:0 12px 30px rgba(0,91,160,.18);
    touch-action:none;
}

#top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    padding:11px 14px;
    background:#1687d9;
    color:#fff;
}

#title{
    font-size:15px;
    font-weight:900;
    letter-spacing:.4px;
}

#hint{
    font-size:10px;
    font-weight:800;
    opacity:.95;
}

canvas{
    display:block;
    width:100%;
    height:auto;
    background:#dff4ff;
    image-rendering:pixelated;
    image-rendering:crisp-edges;
    touch-action:none;
}

#jumpBtn{
    display:block;
    width:100%;
    min-height:62px;
    border:0;
    border-top:2px solid #b9e8ff;
    background:#eaf9ff;
    color:#096ba9;
    font-size:16px;
    font-weight:900;
    letter-spacing:.8px;
    touch-action:manipulation;
}

#jumpBtn:active{
    background:#c9efff;
}
</style>
</head>

<body>

<div id="game">
    <div id="top">
        <span id="title">🦖 DINO RUN</span>
        <span id="hint">TOQUE PARA PULAR</span>
    </div>

    <canvas
        id="c"
        width="600"
        height="220"
        ontouchstart="return window.dinoTap(event)"
        onclick="return window.dinoTap(event)">
    </canvas>

    <button
        id="jumpBtn"
        type="button"
        ontouchstart="return window.dinoTap(event)"
        onclick="return window.dinoTap(event)">
        ▲ PULAR
    </button>
</div>

<img
id="sprite"
style="display:none"
src="data:image/png;base64,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">

<script>
(function(){

'use strict';

var cv = document.getElementById('c');
var ctx = cv.getContext('2d', { alpha:false });
var sprite = document.getElementById('sprite');
var scratch = document.createElement('canvas');
var sxctx = scratch.getContext('2d');

var W = 600;
var H = 220;
var GROUND = 170;

var TREX = {
    x:848,
    y:2,
    w:44,
    h:47,
    wDuck:59,
    hDuck:25
};

var CACTUS_SMALL = {
    x:228,
    y:2,
    w:17,
    h:35
};

var CACTUS_LARGE = {
    x:332,
    y:2,
    w:25,
    h:50
};

var PTERO = {
    x:134,
    y:2,
    w:46,
    h:40
};

var dino;
var obstacles;
var clouds;
var speed;
var score;
var hi = 0;
var gameOver;
var started;
var last = 0;
var spawnTimer;
var groundOffset;
var lastTouchTime = 0;

function dinoGroundY(){
    return GROUND - TREX.h;
}

function reset(){

    dino = {
        x:42,
        y:dinoGroundY(),
        vy:0,
        onGround:true,
        runFrame:0,
        runTimer:0
    };

    obstacles = [];

    clouds = [
        {x:110,y:48,s:1},
        {x:330,y:70,s:.8},
        {x:520,y:42,s:1.1}
    ];

    speed = 6;
    score = 0;
    gameOver = false;
    started = false;
    last = 0;
    spawnTimer = 70;
    groundOffset = 0;
}

function jump(){

    if(gameOver){
        reset();
        started = true;
        dino.vy = -10.8;
        dino.onGround = false;
        return;
    }

    started = true;

    if(dino.onGround){
        dino.vy = -10.8;
        dino.onGround = false;
    }
}

window.dinoTap = function(e){

    if(e){
        if(typeof e.preventDefault === 'function'){
            e.preventDefault();
        }

        if(typeof e.stopPropagation === 'function'){
            e.stopPropagation();
        }
    }

    var now = Date.now();
    var type = e && e.type ? e.type : '';

    if(type === 'touchstart'){
        lastTouchTime = now;
        jump();
        return false;
    }

    if(type === 'click' && now - lastTouchTime < 700){
        return false;
    }

    jump();
    return false;
};

document.addEventListener('keydown', function(e){

    if(e.code === 'Space' || e.code === 'ArrowUp'){
        e.preventDefault();
        jump();
    }
});

function spawnObstacle(){

    var r = Math.random();

    if(r < .42){

        obstacles.push({
            type:'small',
            x:W + 15,
            w:CACTUS_SMALL.w,
            h:CACTUS_SMALL.h,
            y:GROUND - CACTUS_SMALL.h
        });

    }else if(r < .82){

        obstacles.push({
            type:'large',
            x:W + 15,
            w:CACTUS_LARGE.w,
            h:CACTUS_LARGE.h,
            y:GROUND - CACTUS_LARGE.h
        });

    }else{

        var levels = [
            GROUND - 47,
            GROUND - 78,
            GROUND - 108
        ];

        obstacles.push({
            type:'ptero',
            x:W + 15,
            w:PTERO.w,
            h:PTERO.h,
            y:levels[Math.floor(Math.random()*levels.length)],
            frame:0,
            frameTimer:0
        });
    }
}

function hit(a,b){

    return (
        a.x + 7 < b.x + b.w - 4 &&
        a.x + a.w - 7 > b.x + 4 &&
        a.y + 7 < b.y + b.h - 4 &&
        a.y + a.h - 7 > b.y + 4
    );
}

function tintedSprite(
    srcX,srcY,srcW,srcH,
    dstX,dstY,dstW,dstH,
    color
){

    scratch.width = srcW;
    scratch.height = srcH;

    sxctx.clearRect(0,0,srcW,srcH);

    sxctx.globalCompositeOperation = 'source-over';

    sxctx.drawImage(
        sprite,
        srcX,srcY,srcW,srcH,
        0,0,srcW,srcH
    );

    sxctx.globalCompositeOperation = 'source-in';
    sxctx.fillStyle = color;
    sxctx.fillRect(0,0,srcW,srcH);

    sxctx.globalCompositeOperation = 'source-over';

    ctx.drawImage(
        scratch,
        0,0,srcW,srcH,
        dstX,dstY,dstW,dstH
    );
}

function drawCloud(c){

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = .92;

    var px = c.x;
    var py = c.y;
    var s = c.s;

    ctx.beginPath();
    ctx.arc(px,py,13*s,0,Math.PI*2);
    ctx.arc(px+17*s,py-6*s,17*s,0,Math.PI*2);
    ctx.arc(px+36*s,py,13*s,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
}

function drawDino(){

    var srcX;

    if(!dino.onGround){
        srcX = TREX.x;
    }else{
        srcX = TREX.x + [88,132][Math.floor(dino.runFrame)%2];
    }

    tintedSprite(
        srcX,
        TREX.y,
        TREX.w,
        TREX.h,
        dino.x,
        dino.y,
        TREX.w,
        TREX.h,
        '#1687d9'
    );
}

function drawObstacle(o){

    if(o.type === 'small'){

        tintedSprite(
            CACTUS_SMALL.x,
            CACTUS_SMALL.y,
            o.w,
            o.h,
            o.x,
            o.y,
            o.w,
            o.h,
            '#21a85b'
        );

    }else if(o.type === 'large'){

        tintedSprite(
            CACTUS_LARGE.x,
            CACTUS_LARGE.y,
            o.w,
            o.h,
            o.x,
            o.y,
            o.w,
            o.h,
            '#168f4d'
        );

    }else{

        var frameX =
            PTERO.x +
            (Math.floor(o.frame)%2)*PTERO.w;

        tintedSprite(
            frameX,
            PTERO.y,
            o.w,
            o.h,
            o.x,
            o.y,
            o.w,
            o.h,
            '#8b5cf6'
        );
    }
}

function drawBackground(){

    ctx.fillStyle = '#dff4ff';
    ctx.fillRect(0,0,W,H);

    ctx.fillStyle = '#ffd84f';
    ctx.beginPath();
    ctx.arc(525,43,23,0,Math.PI*2);
    ctx.fill();

    for(var i=0;i<clouds.length;i++){
        drawCloud(clouds[i]);
    }

    ctx.fillStyle = '#bceec9';
    ctx.fillRect(
        0,
        GROUND + 2,
        W,
        H - GROUND - 2
    );

    ctx.strokeStyle = '#1687d9';
    ctx.lineWidth = 3;
    ctx.setLineDash([7,7]);
    ctx.lineDashOffset = -groundOffset;

    ctx.beginPath();
    ctx.moveTo(0,GROUND);
    ctx.lineTo(W,GROUND);
    ctx.stroke();

    ctx.setLineDash([]);
}

function drawScore(){

    ctx.fillStyle = '#096ba9';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'right';

    var s = String(Math.floor(score));

    while(s.length < 5){
        s = '0' + s;
    }

    var h = String(Math.floor(hi));

    while(h.length < 5){
        h = '0' + h;
    }

    ctx.fillText(
        hi > 0
            ? 'HI ' + h + '   ' + s
            : s,
        W - 15,
        28
    );

    ctx.textAlign = 'left';
}

function drawMessage(){

    ctx.textAlign = 'center';

    if(gameOver){

        ctx.fillStyle = '#e04444';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(
            'GAME OVER',
            W/2,
            72
        );

        ctx.fillStyle = '#096ba9';
        ctx.font = 'bold 13px Arial';
        ctx.fillText(
            'toque para reiniciar',
            W/2,
            96
        );

    }else if(!started){

        ctx.fillStyle = '#096ba9';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(
            'TOQUE PARA COMEÇAR',
            W/2,
            82
        );

        ctx.font = '12px Arial';
        ctx.fillText(
            'pule dos obstáculos e faça seu recorde',
            W/2,
            104
        );
    }

    ctx.textAlign = 'left';
}

function loop(t){

    if(!last){
        last = t;
    }

    var dt = Math.min((t-last)/16.67,2);
    last = t;

    if(started && !gameOver){

        groundOffset += speed*dt;

        dino.runTimer += dt;

        if(dino.runTimer > 5){
            dino.runFrame++;
            dino.runTimer = 0;
        }

        dino.vy += .62*dt;
        dino.y += dino.vy*dt;

        if(dino.y >= dinoGroundY()){
            dino.y = dinoGroundY();
            dino.vy = 0;
            dino.onGround = true;
        }

        for(var c=0;c<clouds.length;c++){

            clouds[c].x -= speed*.12*dt;

            if(clouds[c].x < -70){
                clouds[c].x = W + Math.random()*90;
                clouds[c].y = 35 + Math.random()*48;
            }
        }

        spawnTimer -= dt;

        if(spawnTimer <= 0){

            spawnObstacle();

            spawnTimer =
                Math.max(38,78-speed*2)
                + Math.random()*38;
        }

        for(var j=0;j<obstacles.length;j++){

            obstacles[j].x -= speed*dt;

            if(obstacles[j].type === 'ptero'){

                obstacles[j].frameTimer += dt;

                if(obstacles[j].frameTimer > 12){
                    obstacles[j].frame++;
                    obstacles[j].frameTimer = 0;
                }
            }
        }

        obstacles = obstacles.filter(function(o){
            return o.x > -70;
        });

        speed = Math.min(
            13,
            speed + .0024*dt
        );

        score += dt*.12;

        if(score > hi){
            hi = score;
        }

        var db = {
            x:dino.x,
            y:dino.y,
            w:TREX.w,
            h:TREX.h
        };

        for(var k=0;k<obstacles.length;k++){

            if(hit(db,obstacles[k])){
                gameOver = true;
                break;
            }
        }
    }

    drawBackground();

    for(var z=0;z<obstacles.length;z++){
        drawObstacle(obstacles[z]);
    }

    drawDino();
    drawScore();
    drawMessage();

    requestAnimationFrame(loop);
}

function start(){

    reset();
    requestAnimationFrame(loop);
}

if(sprite.complete && sprite.naturalWidth > 0){

    start();

}else{

    sprite.onload = start;

    sprite.onerror = function(){

        ctx.fillStyle = '#dff4ff';
        ctx.fillRect(0,0,W,H);

        ctx.fillStyle = '#e04444';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';

        ctx.fillText(
            'Erro ao carregar o Dino',
            W/2,
            H/2
        );
    };
}

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
                    messageText: 'Dino'
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
            quoted: selo || info,
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
