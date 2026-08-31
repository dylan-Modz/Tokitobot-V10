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

function buildHtmlGameMessage(
    html,
    options = {}
) {
    if (
        typeof html !== "string" ||
        !html.trim()
    ) {
        throw new TypeError(
            "HTML do jogo inválido."
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
                                    "Tokito Game"
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

async function prepareUserData(
    socket,
    data = {}
) {
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

    return {
        ...data,
        fotoUser
    };
}

function buildSnakeHtml(data = {}) {
    const usuario =
        escapeHtml(
            data.usuario ||
            "Jogador"
        );

    const fotoUser =
        escapeHtml(
            data.fotoUser ||
            ""
        );

    const fotoVisual =
        fotoUser
            ? `<img src="${fotoUser}" class="avatar" alt="">`
            : `<div class="avatar avatar-fallback">🐍</div>`;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
>
<title>snake game</title>

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

canvas#snakeCanvas {
    width: 100%;
    height: auto;
    display: block;
    background: #10151e;
    touch-action: none;
}

.score-board {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 7px 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 10px;
    font-weight: 800;
    color: #8b949e;
    background: rgba(13, 17, 23, 0.65);
}

.score-board span {
    color: #58a6ff;
}

.overlay {
    position: absolute;
    inset: 32px 0 0 0;
    background: rgba(13, 17, 23, 0.78);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    pointer-events: none;
}

.overlay-title {
    font-size: 17px;
    font-weight: 900;
    color: #f0f6fc;
    letter-spacing: 1px;
}

.overlay-sub {
    font-size: 10px;
    color: #7ee787;
    font-weight: 700;
}

.controls {
    display: grid;
    grid-template-columns: repeat(3, 56px);
    grid-template-rows: repeat(2, 46px);
    justify-content: center;
    gap: 5px;
    margin-top: 9px;
}

.ctrl {
    border: 1px solid rgba(88, 166, 255, .25);
    border-radius: 10px;
    background: #161b22;
    color: #58a6ff;
    font-size: 18px;
    font-weight: 900;
    touch-action: manipulation;
}

.ctrl:active {
    background: #1f6feb;
    color: #fff;
}

.up {
    grid-column: 2;
    grid-row: 1;
}

.left {
    grid-column: 1;
    grid-row: 2;
}

.down {
    grid-column: 2;
    grid-row: 2;
}

.right {
    grid-column: 3;
    grid-row: 2;
}

.controls-hint {
    margin-top: 7px;
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
            <span class="title">SNAKE</span>
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
            <div>
                SCORE
                <span id="score">000</span>
            </div>

            <div>
                HI
                <span id="highScore">000</span>
            </div>
        </div>

        <canvas
            id="snakeCanvas"
            width="360"
            height="360"
        ></canvas>

        <div
            class="overlay"
            id="gameOverlay"
        >
            <div
                class="overlay-title"
                id="overlayTitle"
            >
                SNAKE
            </div>

            <div
                class="overlay-sub"
                id="overlaySub"
            >
                TOQUE OU USE AS SETAS 🐍
            </div>
        </div>
    </div>

    <div class="controls">
        <button class="ctrl up" data-dir="up">▲</button>
        <button class="ctrl left" data-dir="left">◀</button>
        <button class="ctrl down" data-dir="down">▼</button>
        <button class="ctrl right" data-dir="right">▶</button>
    </div>

    <div class="controls-hint">
        Coma as frutas e não bata no próprio corpo
    </div>

    <div class="footer">
        Tokito Games
    </div>

</div>

<script>
(function() {
    const canvas =
        document.getElementById("snakeCanvas");

    const ctx =
        canvas.getContext("2d");

    const overlay =
        document.getElementById("gameOverlay");

    const overlayTitle =
        document.getElementById("overlayTitle");

    const overlaySub =
        document.getElementById("overlaySub");

    const scoreEl =
        document.getElementById("score");

    const highScoreEl =
        document.getElementById("highScore");

    const GRID = 18;
    const CELL =
        canvas.width / GRID;

    let snake = [];
    let food = null;
    let direction = {
        x: 1,
        y: 0
    };

    let nextDirection = {
        x: 1,
        y: 0
    };

    let running = false;
    let score = 0;
    let highScore = 0;
    let timer = null;
    let speed = 125;

    try {
        highScore =
            parseInt(
                localStorage.getItem(
                    "tokito_snake_hi"
                ) || "0"
            ) || 0;
    } catch {
        highScore = 0;
    }

    highScoreEl.textContent =
        String(highScore).padStart(
            3,
            "0"
        );

    function randomCell() {
        return {
            x:
                Math.floor(
                    Math.random() * GRID
                ),
            y:
                Math.floor(
                    Math.random() * GRID
                )
        };
    }

    function sameCell(a, b) {
        return (
            a.x === b.x &&
            a.y === b.y
        );
    }

    function createFood() {
        let candidate;

        do {
            candidate =
                randomCell();
        } while (
            snake.some(
                part =>
                    sameCell(
                        part,
                        candidate
                    )
            )
        );

        food = candidate;
    }

    function reset() {
        snake = [
            { x: 8, y: 9 },
            { x: 7, y: 9 },
            { x: 6, y: 9 },
            { x: 5, y: 9 }
        ];

        direction = {
            x: 1,
            y: 0
        };

        nextDirection = {
            x: 1,
            y: 0
        };

        score = 0;
        speed = 125;

        scoreEl.textContent =
            "000";

        createFood();
        draw();
    }

    function startGame() {
        if (running) {
            return;
        }

        reset();

        running = true;

        overlay.style.display =
            "none";

        scheduleTick();
    }

    function scheduleTick() {
        clearTimeout(timer);

        timer =
            setTimeout(
                tick,
                speed
            );
    }

    function setDirection(
        x,
        y
    ) {
        if (!running) {
            startGame();
        }

        if (
            direction.x + x === 0 &&
            direction.y + y === 0
        ) {
            return;
        }

        nextDirection = {
            x,
            y
        };
    }

    function gameOver() {
        running = false;

        clearTimeout(timer);

        if (score > highScore) {
            highScore = score;

            try {
                localStorage.setItem(
                    "tokito_snake_hi",
                    highScore
                );
            } catch {
            }

            highScoreEl.textContent =
                String(highScore).padStart(
                    3,
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

    function tick() {
        if (!running) {
            return;
        }

        direction =
            nextDirection;

        const head =
            snake[0];

        const next = {
            x:
                (
                    head.x +
                    direction.x +
                    GRID
                ) %
                GRID,

            y:
                (
                    head.y +
                    direction.y +
                    GRID
                ) %
                GRID
        };

        if (
            snake.some(
                (part, index) =>
                    index > 0 &&
                    sameCell(
                        part,
                        next
                    )
            )
        ) {
            gameOver();
            return;
        }

        snake.unshift(
            next
        );

        if (
            sameCell(
                next,
                food
            )
        ) {
            score += 1;

            scoreEl.textContent =
                String(score).padStart(
                    3,
                    "0"
                );

            if (
                score % 5 === 0 &&
                speed > 65
            ) {
                speed -= 7;
            }

            createFood();
        } else {
            snake.pop();
        }

        draw();
        scheduleTick();
    }

    function drawGrid() {
        ctx.strokeStyle =
            "rgba(88,166,255,.05)";

        ctx.lineWidth =
            1;

        for (
            let i = 0;
            i <= GRID;
            i++
        ) {
            const pos =
                i * CELL;

            ctx.beginPath();
            ctx.moveTo(
                pos,
                0
            );

            ctx.lineTo(
                pos,
                canvas.height
            );

            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(
                0,
                pos
            );

            ctx.lineTo(
                canvas.width,
                pos
            );

            ctx.stroke();
        }
    }

    function draw() {
        ctx.fillStyle =
            "#10151e";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawGrid();

        if (food) {
            const fx =
                food.x * CELL;

            const fy =
                food.y * CELL;

            ctx.fillStyle =
                "#f85149";

            ctx.beginPath();

            ctx.arc(
                fx + CELL / 2,
                fy + CELL / 2,
                CELL * .34,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle =
                "#7ee787";

            ctx.fillRect(
                fx + CELL * .48,
                fy + CELL * .08,
                CELL * .12,
                CELL * .22
            );
        }

        snake.forEach(
            (part, index) => {
                const px =
                    part.x * CELL;

                const py =
                    part.y * CELL;

                ctx.fillStyle =
                    index === 0
                        ? "#58a6ff"
                        : "#2ea043";

                ctx.fillRect(
                    px + 2,
                    py + 2,
                    CELL - 4,
                    CELL - 4
                );

                if (
                    index === 0
                ) {
                    ctx.fillStyle =
                        "#0d1117";

                    ctx.fillRect(
                        px + CELL * .58,
                        py + CELL * .25,
                        3,
                        3
                    );

                    ctx.fillRect(
                        px + CELL * .58,
                        py + CELL * .62,
                        3,
                        3
                    );
                }
            }
        );
    }

    function handleDir(dir) {
        if (dir === "up") {
            setDirection(
                0,
                -1
            );
        }

        if (dir === "down") {
            setDirection(
                0,
                1
            );
        }

        if (dir === "left") {
            setDirection(
                -1,
                0
            );
        }

        if (dir === "right") {
            setDirection(
                1,
                0
            );
        }
    }

    document
        .querySelectorAll(
            ".ctrl"
        )
        .forEach(
            button => {
                const action =
                    event => {
                        event.preventDefault();

                        handleDir(
                            button.dataset.dir
                        );
                    };

                button.addEventListener(
                    "touchstart",
                    action,
                    {
                        passive: false
                    }
                );

                button.addEventListener(
                    "click",
                    action
                );
            }
        );

    document.addEventListener(
        "keydown",
        event => {
            const map = {
                ArrowUp:
                    "up",

                ArrowDown:
                    "down",

                ArrowLeft:
                    "left",

                ArrowRight:
                    "right"
            };

            if (
                map[event.code]
            ) {
                event.preventDefault();

                handleDir(
                    map[event.code]
                );
            }
        }
    );

    let touchStartX =
        null;

    let touchStartY =
        null;

    canvas.addEventListener(
        "touchstart",
        event => {
            const touch =
                event.touches[0];

            touchStartX =
                touch.clientX;

            touchStartY =
                touch.clientY;

            if (!running) {
                startGame();
            }
        },
        {
            passive: true
        }
    );

    canvas.addEventListener(
        "touchend",
        event => {
            if (
                touchStartX === null ||
                touchStartY === null
            ) {
                return;
            }

            const touch =
                event.changedTouches[0];

            const dx =
                touch.clientX -
                touchStartX;

            const dy =
                touch.clientY -
                touchStartY;

            touchStartX =
                null;

            touchStartY =
                null;

            if (
                Math.abs(dx) < 16 &&
                Math.abs(dy) < 16
            ) {
                return;
            }

            if (
                Math.abs(dx) >
                Math.abs(dy)
            ) {
                handleDir(
                    dx > 0
                        ? "right"
                        : "left"
                );
            } else {
                handleDir(
                    dy > 0
                        ? "down"
                        : "up"
                );
            }
        },
        {
            passive: true
        }
    );

    canvas.addEventListener(
        "click",
        () => {
            if (!running) {
                startGame();
            }
        }
    );

    reset();
})();
</script>

</body>
</html>
`;
}

async function sendSnakeGame(
    socket,
    jid,
    data = {},
    options = {}
) {
    if (
        !socket ||
        typeof socket.relayMessage !==
        "function"
    ) {
        throw new TypeError(
            "Socket do Baileys inválido."
        );
    }

    const finalData =
        await prepareUserData(
            socket,
            data
        );

    const html =
        buildSnakeHtml(
            finalData
        );

    const message =
        buildHtmlGameMessage(
            html,
            options
        );

    return socket.relayMessage(
        jid,
        message,
        {}
    );
}

dylan.setCommand({
    nome: "cobrinha",

    comandos: [
        "cobrinha",
        "snake"
    ],

    categoria: "jogos",

    info: {
        descricao:
            "Jogo da cobrinha interativo dentro do WhatsApp.",

        uso:
            "cobrinha",

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

            await sendSnakeGame(
                tokito,
                from,
                {
                    usuario,
                    sender
                },
                {
                    submessageText:
                        "Snake Game!"
                }
            );

            return true;
        } catch (error) {
            console.log(
                "[COBRINHA]",
                error?.stack ||
                error?.message ||
                error
            );

            return reply(
                `*❌ | Não foi possível abrir o jogo da cobrinha.*\n\n> ${
                    error?.message ||
                    "Erro desconhecido"
                }`
            );
        }
    }
});
