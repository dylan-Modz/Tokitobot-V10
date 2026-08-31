"use strict";

const crypto = require("crypto");
const dylan = require("../../database/lib/comandos");

const HTML_GAME_PRIMITIVE = "GenAIaeacdsnwHtmlPrimitive";
const HTML_GAME_TRUSTED_SOURCES = ["nixel.dev"];

async function getBase64FromUrl(url) {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("data:image")) return url;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType =
            response.headers.get("content-type") ||
            "image/jpeg";

        return `data:${contentType};base64,${buffer.toString("base64")}`;
    } catch {
        return null;
    }
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function buildDinoHtml(data = {}) {
    const usuario = escapeHtml(
        data.usuario ||
        "Jogador"
    );

    const fotoUser = escapeHtml(
        data.fotoUser ||
        ""
    );

    const fotoVisual = fotoUser
        ? `<img src="${fotoUser}" class="avatar" alt="">`
        : `<div class="avatar avatar-fallback">🦖</div>`;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
>
<title>dino game</title>

<style>
* {
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    background: #0d1117;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    touch-action: manipulation;
}

body {
    display: flex;
    justify-content: center;
    padding: 4px;
}

.panel {
    width: 100%;
    max-width: 480px;
    padding: 10px;
    border-radius: 16px;
    background: linear-gradient(145deg, #161b22, #0d1117);
    border: 1px solid rgba(88, 166, 255, 0.25);
    position: relative;
    overflow: hidden;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-radius: 10px;
    background: rgba(22, 27, 34, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 8px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 8px;
}

.badge {
    padding: 2px 8px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2ea043, #238636);
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
}

.title {
    font-size: 11px;
    font-weight: 800;
    color: #58a6ff;
}

.user-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 160px;
}

.avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #58a6ff;
}

.avatar-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1f242c;
    font-size: 11px;
}

.username {
    font-size: 9px;
    font-weight: 700;
    color: #c9d1d9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.game-container {
    position: relative;
    width: 100%;
    background: #12161f;
    border-radius: 12px;
    border: 1px solid rgba(88, 166, 255, 0.2);
    overflow: hidden;
}

canvas#dinoCanvas {
    width: 100%;
    height: 160px;
    display: block;
}

.score-board {
    position: absolute;
    top: 8px;
    right: 12px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 11px;
    font-weight: bold;
    color: #8b949e;
    letter-spacing: 1px;
    pointer-events: none;
}

.score-board span {
    color: #58a6ff;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(13, 17, 23, 0.75);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    backdrop-filter: blur(2px);
    pointer-events: none;
}

.overlay-title {
    font-size: 16px;
    font-weight: 900;
    color: #f0f6fc;
    letter-spacing: 1px;
}

.overlay-sub {
    font-size: 10px;
    color: #7ee787;
    font-weight: 700;
    animation: pulse 1s infinite alternate;
}

@keyframes pulse {
    0% {
        opacity: 0.5;
        transform: scale(0.98);
    }

    100% {
        opacity: 1;
        transform: scale(1.02);
    }
}

.controls-hint {
    margin-top: 6px;
    text-align: center;
    font-size: 8px;
    color: #8b949e;
    letter-spacing: 0.5px;
}

.footer {
    padding-top: 6px;
    text-align: center;
    font-size: 7px;
    letter-spacing: 1px;
    color: #8b949e;
    opacity: 0.5;
}
</style>
</head>

<body>

<div class="panel">

    <div class="header">
        <div class="brand">
            <span class="badge">GAME</span>
            <span class="title">DINO RUNNER</span>
        </div>

        <div class="user-tag">
            ${fotoVisual}
            <span class="username">${usuario}</span>
        </div>
    </div>

    <div
        class="game-container"
        id="gameArea"
    >
        <div class="score-board">
            HI <span id="highScore">00000</span>
            |
            <span
                id="currentScore"
                style="color:#f0f6fc"
            >
                00000
            </span>
        </div>

        <canvas
            id="dinoCanvas"
            width="400"
            height="160"
        ></canvas>

        <div
            class="overlay"
            id="gameOverlay"
        >
            <div
                class="overlay-title"
                id="overlayTitle"
            >
                DINO RUNNER
            </div>

            <div
                class="overlay-sub"
                id="overlaySub"
            >
                TOQUE PARA JOGAR ⚡
            </div>
        </div>
    </div>

    <div class="controls-hint">
        Toque na tela para pular
    </div>

    <div class="footer">
        by Yoshirukkj
    </div>

</div>

<script>
(function() {
    const canvas =
        document.getElementById("dinoCanvas");

    const ctx =
        canvas.getContext("2d");

    const overlay =
        document.getElementById("gameOverlay");

    const overlayTitle =
        document.getElementById("overlayTitle");

    const overlaySub =
        document.getElementById("overlaySub");

    const scoreEl =
        document.getElementById("currentScore");

    const highScoreEl =
        document.getElementById("highScore");

    let highScore = 0;

    try {
        highScore =
            parseInt(
                localStorage.getItem("dino_hi") ||
                "0"
            ) || 0;
    } catch (e) {
        highScore = 0;
    }

    let isRunning = false;
    let score = 0;
    let speed = 4;
    let frameCount = 0;

    highScoreEl.textContent =
        String(highScore).padStart(5, "0");

    const dino = {
        x: 30,
        y: 110,
        w: 20,
        h: 24,
        vy: 0,
        gravity: 0.6,
        jumpForce: -9.5,
        groundY: 110,
        isJumping: false,

        jump() {
            if (!this.isJumping) {
                this.vy = this.jumpForce;
                this.isJumping = true;
            }
        },

        update() {
            this.vy += this.gravity;
            this.y += this.vy;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.vy = 0;
                this.isJumping = false;
            }
        },

        draw() {
            ctx.fillStyle = "#7ee787";

            ctx.fillRect(
                this.x + 4,
                this.y,
                12,
                12
            );

            ctx.fillRect(
                this.x + 12,
                this.y + 2,
                4,
                3
            );

            ctx.fillStyle = "#12161f";

            ctx.fillRect(
                this.x + 12,
                this.y + 2,
                2,
                2
            );

            ctx.fillStyle = "#7ee787";

            ctx.fillRect(
                this.x,
                this.y + 10,
                16,
                10
            );

            ctx.fillRect(
                this.x - 4,
                this.y + 10,
                6,
                4
            );

            if (this.isJumping) {
                ctx.fillRect(
                    this.x + 2,
                    this.y + 20,
                    4,
                    4
                );

                ctx.fillRect(
                    this.x + 10,
                    this.y + 20,
                    4,
                    4
                );
            } else {
                if (
                    Math.floor(
                        frameCount / 6
                    ) % 2 === 0
                ) {
                    ctx.fillRect(
                        this.x + 2,
                        this.y + 20,
                        4,
                        4
                    );

                    ctx.fillRect(
                        this.x + 10,
                        this.y + 18,
                        4,
                        4
                    );
                } else {
                    ctx.fillRect(
                        this.x + 2,
                        this.y + 18,
                        4,
                        4
                    );

                    ctx.fillRect(
                        this.x + 10,
                        this.y + 20,
                        4,
                        4
                    );
                }
            }
        }
    };

    let obstacles = [];

    function spawnObstacle() {
        const type =
            Math.random() > 0.35
                ? "cactus"
                : "bird";

        if (type === "cactus") {
            const height =
                Math.random() > 0.5
                    ? 24
                    : 18;

            obstacles.push({
                x: canvas.width,
                y: 134 - height,
                w: 12,
                h: height,
                type: "cactus"
            });
        } else {
            const birdY =
                Math.random() > 0.5
                    ? 90
                    : 105;

            obstacles.push({
                x: canvas.width,
                y: birdY,
                w: 16,
                h: 12,
                type: "bird"
            });
        }
    }

    let clouds = [
        {
            x: 100,
            y: 30,
            speed: 0.5
        },
        {
            x: 280,
            y: 45,
            speed: 0.3
        }
    ];

    function drawScene() {
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.strokeStyle = "#30363d";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, 134);
        ctx.lineTo(canvas.width, 134);
        ctx.stroke();

        ctx.fillStyle = "#21262d";

        clouds.forEach(c => {
            if (isRunning) {
                c.x -= c.speed;
            }

            if (c.x < -30) {
                c.x = canvas.width + 20;
            }

            ctx.fillRect(
                c.x,
                c.y,
                24,
                8
            );

            ctx.fillRect(
                c.x + 4,
                c.y - 4,
                16,
                4
            );
        });

        ctx.fillStyle = "#484f58";

        for (
            let i = 0;
            i < canvas.width;
            i += 40
        ) {
            const dotX =
                (
                    i -
                    (frameCount * speed) % 40 +
                    canvas.width
                ) %
                canvas.width;

            ctx.fillRect(
                dotX,
                138,
                6,
                2
            );
        }
    }

    function resetGame() {
        score = 0;
        speed = 4.5;
        frameCount = 0;
        obstacles = [];

        dino.y = dino.groundY;
        dino.vy = 0;
        dino.isJumping = false;

        isRunning = true;

        overlay.style.display = "none";

        loop();
    }

    function gameOver() {
        isRunning = false;

        if (score > highScore) {
            highScore = score;

            try {
                localStorage.setItem(
                    "dino_hi",
                    highScore
                );
            } catch (e) {
            }

            highScoreEl.textContent =
                String(highScore).padStart(
                    5,
                    "0"
                );
        }

        overlayTitle.textContent =
            "GAME OVER";

        overlaySub.textContent =
            "TOQUE PARA JOGAR DE NOVO 🔄";

        overlay.style.display =
            "flex";
    }

    function loop() {
        if (!isRunning) {
            return;
        }

        frameCount++;

        score =
            Math.floor(
                frameCount / 4
            );

        scoreEl.textContent =
            String(score).padStart(
                5,
                "0"
            );

        if (
            frameCount % 300 === 0 &&
            speed < 9
        ) {
            speed += 0.4;
        }

        if (
            frameCount %
            Math.max(
                45,
                Math.floor(
                    90 - speed * 4
                )
            ) === 0
        ) {
            if (Math.random() > 0.3) {
                spawnObstacle();
            }
        }

        drawScene();

        dino.update();
        dino.draw();

        for (
            let i = obstacles.length - 1;
            i >= 0;
            i--
        ) {
            const obs =
                obstacles[i];

            obs.x -= speed;

            if (obs.type === "cactus") {
                ctx.fillStyle = "#f85149";

                ctx.fillRect(
                    obs.x,
                    obs.y,
                    obs.w,
                    obs.h
                );

                ctx.fillRect(
                    obs.x - 2,
                    obs.y + 4,
                    2,
                    6
                );

                ctx.fillRect(
                    obs.x + obs.w,
                    obs.y + 6,
                    2,
                    6
                );
            } else {
                ctx.fillStyle = "#e3b341";

                ctx.fillRect(
                    obs.x,
                    obs.y,
                    obs.w,
                    obs.h
                );

                const wingY =
                    (
                        Math.floor(
                            frameCount / 8
                        ) % 2 === 0
                    )
                        ? obs.y - 4
                        : obs.y + obs.h;

                ctx.fillRect(
                    obs.x + 4,
                    wingY,
                    6,
                    4
                );
            }

            if (
                dino.x < obs.x + obs.w &&
                dino.x + dino.w > obs.x &&
                dino.y < obs.y + obs.h &&
                dino.y + dino.h > obs.y
            ) {
                gameOver();
                return;
            }

            if (
                obs.x + obs.w < 0
            ) {
                obstacles.splice(
                    i,
                    1
                );
            }
        }

        requestAnimationFrame(
            loop
        );
    }

    function handleAction(e) {
        if (!isRunning) {
            resetGame();
        } else {
            dino.jump();
        }
    }

    window.addEventListener(
        "keydown",
        e => {
            if (
                e.code === "Space" ||
                e.code === "ArrowUp"
            ) {
                handleAction(e);
            }
        }
    );

    window.addEventListener(
        "touchstart",
        handleAction,
        {
            passive: true
        }
    );

    window.addEventListener(
        "mousedown",
        handleAction
    );

    drawScene();
    dino.draw();
})();
</script>

</body>
</html>
`;
}

function buildHtmlDinoMessage(
    html,
    options = {}
) {
    if (
        typeof html !== "string" ||
        !html.trim()
    ) {
        throw new TypeError(
            "HTML do Dino inválido."
        );
    }

    const unifiedResponse = {
        response_id:
            crypto.randomUUID(),

        sections: [
            {
                view_model: {
                    primitive: {
                        __typename:
                            HTML_GAME_PRIMITIVE,

                        payload:
                            html.trim(),

                        trusted_sources: [
                            ...HTML_GAME_TRUSTED_SOURCES
                        ]
                    },

                    __typename:
                        "GenAISingleLayoutViewModel"
                }
            }
        ]
    };

    return {
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    submessages: [
                        {
                            messageType: 2,

                            messageText:
                                String(
                                    options.submessageText ||
                                    "Dino Game!"
                                )
                        }
                    ],

                    messageType: 1,

                    unifiedResponse: {
                        data:
                            Buffer.from(
                                JSON.stringify(
                                    unifiedResponse
                                ),
                                "utf8"
                            )
                    },

                    contextInfo: {
                        mentionedJid: [],
                        groupMentions: [],
                        statusAttributions: [],
                        forwardingScore: 1,
                        isForwarded: true,

                        forwardedAiBotMessageInfo: {
                            botJid:
                                "867051314767696@bot"
                        },

                        forwardOrigin: 4
                    }
                }
            }
        }
    };
}

async function sendHtmlDino(
    socket,
    jid,
    data = {},
    options = {}
) {
    if (!socket) {
        throw new Error(
            "Socket do Baileys não foi fornecido."
        );
    }

    if (
        typeof socket.relayMessage !==
        "function"
    ) {
        throw new TypeError(
            "socket.relayMessage() não está disponível."
        );
    }

    let fotoUser =
        data.fotoUser ||
        data.foto ||
        null;

    if (
        !fotoUser &&
        data.sender &&
        typeof socket.profilePictureUrl ===
        "function"
    ) {
        try {
            fotoUser =
                await socket.profilePictureUrl(
                    data.sender,
                    "image"
                );
        } catch {
            fotoUser = null;
        }
    }

    if (
        typeof fotoUser === "string" &&
        fotoUser.startsWith("http")
    ) {
        fotoUser =
            await getBase64FromUrl(
                fotoUser
            );
    }

    const finalData = {
        ...data,
        fotoUser
    };

    const html =
        buildDinoHtml(
            finalData
        );

    const message =
        buildHtmlDinoMessage(
            html,
            options
        );

    return await socket.relayMessage(
        jid,
        message,
        {}
    );
}

dylan.setCommand({
    nome: "dino",

    comandos: [
        "dino",
        "dinossauro",
        "trex"
    ],

    categoria: "jogos",

    info: {
        descricao:
            "Abre o jogo Dino Runner interativo dentro do WhatsApp.",

        uso:
            "dino",

        categoria:
            "jogos"
    },

    async executar(ctx) {
        const {
            tokito,
            from,
            sender,
            pushname,
            reply
        } = ctx;

        try {
            const usuario =
                String(
                    pushname ||
                    sender?.split("@")?.[0] ||
                    "Jogador"
                );

            await sendHtmlDino(
                tokito,
                from,
                {
                    usuario,
                    sender
                },
                {
                    submessageText:
                        "Dino Game!"
                }
            );

            return true;
        } catch (error) {
            console.log(
                "[DINO]",
                error?.stack ||
                error?.message ||
                error
            );

            return reply(
                `*❌ | Não foi possível abrir o Dino.*\n\n> ${
                    error?.message ||
                    "Erro desconhecido"
                }`
            );
        }
    }
});
