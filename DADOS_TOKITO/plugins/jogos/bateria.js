/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Jogo: Dino
 * Dev: Dylan Modz
 * ============================================================
 */

const crypto = require('crypto')
module.exports = {
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
    background:#fff;
}

body{
    display:flex;
    justify-content:center;
    align-items:flex-start;
    padding:10px;
}

canvas{
    display:block;
    width:100%;
    max-width:600px;
    height:auto;
    background:#fff;
    image-rendering:pixelated;
    image-rendering:crisp-edges;
    transition:filter .3s;
    touch-action:none;
}
</style>
</head>

<body>

<canvas id="c" width="600" height="150"></canvas>

<img
id="sprite"
style="display:none"
src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABNEAAABECAAAAACKI/xBAAAAAnRSTlMAAHaTzTgAAAoOSURBVHgB7J1bdqS4FkSDu7gPTYSh2AOATw1Pn6kBVA2FieiTrlesq6po8lgt0pj02b06E58HlRhXOCQBBcdxHMdxHOfDMeA7BfcIOI4VwISDKQhvK0O4H9iAobeFZSx8WIK0dqz4ztQRg1XdECNfX/CTGUDmNjJDP6MzuMnKKsQ0Y+Amyxnirurmx1KghAvWXoARAErEPUpAB/KzvK6YcAIl8lD2AtsCbENPS1XGwqMTSnvHhNOYgBV3mKlklKDqPUshMUIzsuzlOXFGW9AQS0C/lv/QMWrahOMoiKZL41HyUCRAdcKyDR0tVRkLD0+oV7Q7yLofm6w6rKbdrmNUL6NOyapMtGcUuixZ2WSHbsl+M97BoUX8TrpyrfGbJJ+saBQ0W9I6jnxF/ZO+4nqo66GQneo325keUjth7bFpX38MO6lbM+ZMaeOYETISzYzN9Wiy7shuyj4dI96JSQXuOMSlWcqkgQ2DSlVdUSIbWbVs2vJ41CvadDs0jTE63Y9NWO26r3x9MU3AzDGk1mQWZu2Bht6VaPzEXrl21gjyZRXNPnKFI8+TJnRKLEED24JNpaqqKBGx/C5oWLSlBR0+Pp4J5yM27YVydp8sX4p+SUGe661TuWE5Y78dtcDSX3u+oqWINjLmRm+wTsBUJWpK06pKaXZpJdbmhoH/LcByq6Rq+LMC+7Dl+OFjvzj2ObRJY/tOa1r/uUvDy9d9QaPz4utMP6ZDysxsPeScf3yly6bOfRbcemtPYESvpAn20GSS0efVKOGc4aNQgojj1ZnzvTEnkxqzOVfGllP3y9qnZ0S3pM2mK5jMwQcpiMb1ZVqdkBANl1aCFbBbdOR6Pvwgtjiu9vkx60jrXNpq15E8ywhz/2tbzGQQwQ4b59Zfe7aipVrSEhCP8mZG1UlzZ20tOgw9Hw6hrzCLZiyObqCkVauZFC0OPL8nqUrk/zHN1gopOfkzngH3fv8SQau20jtMQ09VUSmxQUS1OsZSDAWSwKNFq5SylzA6PhFf+Oo4x3m0pEuYKXb4s5WLAAaT1lwfc3Kr6CDZ6JD6hrUCWVhmjHFr3Nk17pxWjdGl/Yi9AuBrBqAbusmvGNNCyWpbhvPU82j1aDMi9Q04p8aLaQtiw7plXZ0A7TwDSojO/GsCiAnE6qAGhg45/eAu7csrunGcEUpEN5NsXYDlUY6Mie67UGPTPiiO1xl0vgLYvXt83glmvkux7ke6WdGzz7mKmiSQM2ufmPEoQUv9d2fu3jEazGqc79JUQjRxghoZT9FoiJnjzvbYtDJGOXOcoxUt4hMybAucE3nloJPOSJh5v6cm8gwFWrnn72aj1txnvR+5RrzoXy8kBOAStWBtw/foGvd1NnyX+h2a+LXQUH2XKAFT0uLpi9byzXg2vrzy9Z6eAZmqIUnHoaJ9PlIofwaAYQMWu6XituAE6vWBgifhla/Xp3ClqjpFESRdt5Z+WCIkQ68vHNBAXysZH3CmuufhInRurCagvLk6QNXpbwMDNvouu+Vn/fLeVo3rA084PzAYiwDtzB1jIB3Jmvuc0YqzQRk6W0d8LhIQ9gPkNhSpEGjr2HKW4XyOuznthx/M+8V/W5+7/vRZ9yARQ4L5a18IIBetJbN18/oGYNjRHwyHt6qiJSj9R25zZ55M7Uiq6u3qglDF2KmBCqqTVqhNO0bQSp+gxRJkV9fi68uP/z8TzgYd3tyw9bQOqBUtpmdd9wwlGoGKGzDstMR7LR1EtENp582d1z5jL3yGrc79y83pSsbBZHquNluXZd5DfteKbbhaLc+Ongp1tUslUUvDve1drSPuSFoE2o/8AIL6rspChrbqZkkb0N5yhNa2E3B95Bm2vN+8m/me3lE9WaGp3LbPPDc/u9VZoJFbZ+uoCvaMhAJEDTS2xOO/Tdzp+Xs6C3mG7fXhnXlR4gnx4rXU7dma/FTl0YS29beOjztTx6NOUF2aVrNEe/bZa4m6+nmuEJUAbnFP15xH+/7fHU/FYG6LG+SmVL5bmnFZ/Ho0J4WP4NK4KMCtS7u0p/Bo9ngnXbfWXnVu/DcNdGf9rRgfeab6sWfR1KXZ1Z0kY7+l3rIToQCImiD2U9y4FepFaHm44jpJjDTGlOmfxVbGHMc92nkEW/PrrRSKJiqjF4CiHaqBNqEuLPxDLsGL/+xcvFavbLph6W89TdHCw5wZCW2zXggfe4Sqcc2oBhYYSAc+EY4zGhM5/teid0osBSaaBC3F/vPAjvpxsdDx5Dp1jjsnI7Y+95hT5z+erpZkzB/dpY2wJS0FPfLH0/wsj/AhJS0FJuTaWOPbHWFbN/9VdCUSwtPW5g81j2aMZULDkbtLE+GSBKOCdGiCURtVTXFpp7KCuEtzl3braVVFQ+g/8n6eQil/X24MmjAIe+oYJNqwK2M8uU5mXc8652rXOY6vdZ6NvdyoiXZ1jBqNcC7o0tKVaw2XlltdGs0VUwsYGTpbxwPO1JXcU7gTGLYfrx0tx6tjsW/PsjHd14p2l+YOzXGPdirBDAwdLe9sAf54IEh86zLA2qQj64SGYp9EM674Dk9Rqy4tY58B2MRqVRZOIr2t44FnymfRzlyJSOHBLg2rOzSnn5vxjI3O1hHXxyVNb8zqt2mNi6OrGzR9egPfH1QLREQgFSDs17Ky/zOoS+O7wVJNfN1axjh108L93G8dH3umelx7gGMTCuLbbfJEQZEYha6KGTbN9l2r+zNn2xkwLnzorNWqsLVP0eaGXMZ74pLWDNXLL0N7+GRnAmdqwgNqE4O7tQkREQmp+zMoudWlATcMaIRN28ErA5nv9pF/6PtEnak/1r8H53lRR6bcfuYe0DrCcZxL3vdk19PHBZQz73u6AT0ODZWGbTAY33Ud0nEcZ3hg64gmZjiO81YiCkK1dXytBauO/wwzsmxBqc3VIhP6DVNw5FhFywDS24/cKeHRCdLfoTiO3zMw58+uYUX/HYD2BLETinY4Z5Bk6+jaFo79DFm3LG4Q+pr6r97I5pH7pRsllgiQUEJ7QsSRCdN2aYfjuEczNDnollPLSKm/7EhQ6pgQ2yUKpx3OaQTZOra2gf7P0M/Q3+ScTJlLX6KgECb49h02lFLudPzVzn0lNQwEURQdrfGuc9anX34AIzk21c/xHjLYCo/JU2W1kLTm/7BeP7kkSZIkZbj0JhHZgDdAg5UeAA6f9f8Ar//eMZqUxs8ggs7BhAEarPQAsPm+hwFus4SnG6Mx3pI0xwEX/syoMMDteO0x17QlCd5m/CbX0STs9m3RDggXBLpKWv5S83eSF787y1Wd5apuCcXDHFu0HL1wPGbhz6lL2WL2VYrtE6NPZW7usXAEy1WZ5epGInCMMLhTBsCQ5erTyhXVlAASQROIjO0FvHBFh+evzparEMvVsp8XMGZ5HuHL3cZGzpu884kxZtN/1HLVynL1uiRJkvQFUg1OaKSaqSkAAAAASUVORK5CYII=">

<script>
(function(){

'use strict';

const cv = document.getElementById('c');
const x = cv.getContext('2d', { alpha:false });
const sprite = document.getElementById('sprite');

x.imageSmoothingEnabled = false;

const W = 600;
const H = 150;
const GROUND_LINE = 127;

const TREX = {
    x: 848,
    y: 2,
    w: 44,
    h: 47,
    wDuck: 59,
    hDuck: 25
};

const GROUND_Y = H - TREX.h - 10;
const GROUND_Y_DUCK = H - TREX.hDuck - 10;

const CACTUS_SMALL = {
    x: 228,
    y: 2,
    w: 17,
    h: 35,
    groundY: 105
};

const CACTUS_LARGE = {
    x: 332,
    y: 2,
    w: 25,
    h: 50,
    groundY: 90
};

const PTERO = {
    x: 134,
    y: 2,
    w: 46,
    h: 40,
    ys: [100,75,50]
};

const CLOUD = {
    x: 86,
    y: 2,
    w: 46,
    h: 14
};

let night = false;
let distSinceInvert = 0;

let dino;
let obstacles;
let clouds;
let groundOffset;
let speed;
let score;
let hi = 0;
let gameOver;
let started;
let last = 0;
let spawnTimer;

function reset(){

    dino = {
        x:40,
        duck:false,
        y:GROUND_Y,
        vy:0,
        onGround:true,
        runFrame:0,
        runTimer:0
    };

    obstacles = [];

    clouds = [
        {x:200,y:30},
        {x:420,y:45},
        {x:560,y:20}
    ];

    groundOffset = 0;
    speed = 6;
    score = 0;
    gameOver = false;
    started = false;
    last = 0;
    night = false;
    distSinceInvert = 0;
    spawnTimer = 60;
}

function jump(){

    if(gameOver){
        reset();
        started = true;
        return;
    }

    started = true;

    if(dino.onGround && !dino.duck){
        dino.vy = -10;
        dino.onGround = false;
    }
}

function setDuck(v){

    if(!dino.onGround) return;

    dino.duck = v;
    dino.y = v ? GROUND_Y_DUCK : GROUND_Y;
}

document.addEventListener('keydown',function(e){

    if(e.code === 'Space' || e.code === 'ArrowUp'){
        e.preventDefault();
        jump();
    }

    if(e.code === 'ArrowDown'){
        e.preventDefault();
        setDuck(true);
    }

});

document.addEventListener('keyup',function(e){

    if(e.code === 'ArrowDown'){
        e.preventDefault();
        setDuck(false);
    }

});

document.body.addEventListener('pointerdown',function(e){

    e.preventDefault();
    jump();

},{passive:false});

function spawnObstacle(){

    const r = Math.random();

    if(r < .35){

        obstacles.push({
            type:'cs',
            x:W,
            w:CACTUS_SMALL.w,
            h:CACTUS_SMALL.h,
            y:CACTUS_SMALL.groundY
        });

    }else if(r < .70){

        obstacles.push({
            type:'cl',
            x:W,
            w:CACTUS_LARGE.w,
            h:CACTUS_LARGE.h,
            y:CACTUS_LARGE.groundY
        });

    }else{

        const y =
            PTERO.ys[
                Math.floor(Math.random()*PTERO.ys.length)
            ];

        obstacles.push({
            type:'pt',
            x:W,
            w:PTERO.w,
            h:PTERO.h,
            y:y,
            frame:0,
            frameTimer:0
        });

    }
}

function hit(a,b){

    return (
        a.x + 6 < b.x + b.w - 4 &&
        a.x + a.w - 6 > b.x + 4 &&
        a.y + 6 < b.y + b.h - 4 &&
        a.y + a.h - 6 > b.y + 4
    );

}

function drawDino(){

    let sx,sy,sw,sh;

    if(dino.duck){

        sw = TREX.wDuck;
        sh = TREX.hDuck;

        sx =
            TREX.x +
            (dino.onGround
                ? [264,323][Math.floor(dino.runFrame)%2]
                : 264);

        sy = TREX.y;

    }else if(!dino.onGround){

        sw = TREX.w;
        sh = TREX.h;
        sx = TREX.x;
        sy = TREX.y;

    }else{

        sw = TREX.w;
        sh = TREX.h;

        sx =
            started
                ? TREX.x + [88,132][Math.floor(dino.runFrame)%2]
                : TREX.x;

        sy = TREX.y;
    }

    x.drawImage(
        sprite,
        sx,sy,sw,sh,
        dino.x,dino.y,sw,sh
    );
}

function drawObstacle(o){

    if(o.type === 'cs'){

        x.drawImage(
            sprite,
            CACTUS_SMALL.x,
            CACTUS_SMALL.y,
            o.w,
            o.h,
            o.x,
            o.y,
            o.w,
            o.h
        );

    }else if(o.type === 'cl'){

        x.drawImage(
            sprite,
            CACTUS_LARGE.x,
            CACTUS_LARGE.y,
            o.w,
            o.h,
            o.x,
            o.y,
            o.w,
            o.h
        );

    }else{

        const fx =
            PTERO.x +
            (Math.floor(o.frame)%2)*PTERO.w;

        x.drawImage(
            sprite,
            fx,
            PTERO.y,
            o.w,
            o.h,
            o.x,
            o.y,
            o.w,
            o.h
        );
    }
}

function drawGround(){

    x.strokeStyle = '#535353';
    x.lineWidth = 2;

    x.setLineDash([2,6]);
    x.lineDashOffset = -groundOffset;

    x.beginPath();
    x.moveTo(0,GROUND_LINE);
    x.lineTo(W,GROUND_LINE);
    x.stroke();

    x.setLineDash([]);
}

function drawClouds(){

    clouds.forEach(function(c){

        x.drawImage(
            sprite,
            CLOUD.x,
            CLOUD.y,
            CLOUD.w,
            CLOUD.h,
            c.x,
            c.y,
            CLOUD.w,
            CLOUD.h
        );

    });
}

function drawScore(){

    x.fillStyle = '#535353';
    x.font = '16px monospace';
    x.textAlign = 'right';

    const s =
        String(Math.floor(score)).padStart(5,'0');

    const h =
        String(Math.floor(hi)).padStart(5,'0');

    x.fillText(
        hi > 0
            ? 'HI ' + h + '   ' + s
            : s,
        W - 10,
        22
    );

    x.textAlign = 'left';
}

function drawMessage(){

    x.fillStyle = '#535353';
    x.textAlign = 'center';

    if(gameOver){

        x.font = 'bold 18px monospace';
        x.fillText(
            'GAME OVER',
            W/2,
            55
        );

        x.font = '12px monospace';

        x.fillText(
            'toque ou espaço pra reiniciar',
            W/2,
            75
        );

    }else if(!started){

        x.font = '13px monospace';

        x.fillText(
            'toque na tela ou espaço pra começar',
            W/2,
            60
        );
    }

    x.textAlign = 'left';
}

function loop(t){

    if(!last) last = t;

    const dt =
        Math.min((t-last)/16.67,2);

    last = t;

    x.setTransform(1,0,0,1,0,0);

    x.fillStyle = '#fff';
    x.fillRect(0,0,W,H);

    drawClouds();

    if(started && !gameOver){

        groundOffset += speed*dt;

        dino.runTimer += dt;

        if(dino.runTimer > 5){

            dino.runFrame++;
            dino.runTimer = 0;
        }

        dino.vy += .6*dt;
        dino.y += dino.vy*dt;

        const floorY =
            dino.duck
                ? GROUND_Y_DUCK
                : GROUND_Y;

        if(dino.y >= floorY){

            dino.y = floorY;
            dino.vy = 0;
            dino.onGround = true;
        }

        clouds.forEach(function(c){

            c.x -= speed*.15*dt;

            if(c.x < -50){
                c.x = W + Math.random()*100;
            }

        });

        spawnTimer -= dt;

        if(spawnTimer <= 0){

            spawnObstacle();

            spawnTimer =
                Math.max(35,75-speed*2.2)
                + Math.random()*35;
        }

        obstacles.forEach(function(o){

            o.x -= speed*dt;

            if(o.type === 'pt'){

                o.frameTimer += dt;

                if(o.frameTimer > 12){

                    o.frame++;
                    o.frameTimer = 0;
                }
            }

        });

        obstacles =
            obstacles.filter(function(o){
                return o.x > -60;
            });

        speed =
            Math.min(
                13,
                speed + .0025*dt
            );

        score += dt*.12;

        if(score > hi){
            hi = score;
        }

        distSinceInvert += dt;

        if(distSinceInvert > 350){

            distSinceInvert = 0;
            night = !night;
        }

        const db = {
            x:dino.x,
            y:dino.y,
            w:dino.duck
                ? TREX.wDuck
                : TREX.w,
            h:dino.duck
                ? TREX.hDuck
                : TREX.h
        };

        for(const o of obstacles){

            if(hit(db,o)){

                gameOver = true;
                break;
            }
        }
    }

    drawGround();

    obstacles.forEach(drawObstacle);

    drawDino();

    drawScore();

    drawMessage();

    cv.style.filter =
        night
            ? 'invert(1)'
            : 'none';

    requestAnimationFrame(loop);
}

function start(){

    reset();

    x.fillStyle = '#fff';
    x.fillRect(0,0,W,H);

    drawGround();
    drawDino();
    drawScore();
    drawMessage();

    requestAnimationFrame(loop);
}

if(sprite.complete && sprite.naturalWidth > 0){

    start();

}else{

    sprite.onload = start;

    sprite.onerror = function(){

        x.fillStyle = '#fff';
        x.fillRect(0,0,W,H);

        x.fillStyle = '#535353';
        x.font = '13px monospace';
        x.textAlign = 'center';

        x.fillText(
            'Erro ao carregar o sprite',
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
}
