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

function buildMemoryHtml(data = {}) {
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
            : `<div class="avatar avatar-fallback">🧠</div>`;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
>
<title>memory game</title>

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
    padding: 2px;
}

.panel {
    width: 100%;
    max-width: 480px;
    padding: 7px;
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
    padding: 5px 8px;
    border-radius: 10px;
    background: rgba(22, 27, 34, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 5px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 8px;
}

.badge {
    padding: 2px 8px;
    border-radius: 12px;
    background: linear-gradient(135deg, #8957e5, #6e40c9);
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
}

.title {
    font-size: 9px;
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
    font-size: 9px;
}

.username {
    font-size: 9px;
    font-weight: 700;
    color: #c9d1d9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-bottom: 5px;
}

.stat {
    padding: 4px 3px;
    border-radius: 9px;
    background: #12161f;
    border: 1px solid rgba(88,166,255,.14);
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 6px;
    color: #8b949e;
    font-weight: 800;
    letter-spacing: .5px;
}

.stat-value {
    display: block;
    margin-top: 1px;
    font-size: 9px;
    color: #58a6ff;
    font-weight: 900;
}

.board {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 5px;
    border-radius: 12px;
    background: #12161f;
    border: 1px solid rgba(88,166,255,.2);
}

.card {
    height: 40px;
    border: 1px solid rgba(88,166,255,.22);
    border-radius: 9px;
    background: linear-gradient(145deg, #1b2230, #11161f);
    color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 21px;
    font-weight: 900;
    cursor: pointer;
    transform: translateZ(0);
    touch-action: manipulation;
}

.card.open {
    color: #fff;
    background: linear-gradient(145deg, #1f6feb, #1158c7);
    border-color: rgba(121,192,255,.55);
}

.card.matched {
    color: #fff;
    background: linear-gradient(145deg, #2ea043, #238636);
    border-color: rgba(126,231,135,.55);
}

.card:active {
    transform: scale(.96);
}

.overlay {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: rgba(13, 17, 23, .82);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    pointer-events: none;
    z-index: 4;
}

.overlay-title {
    font-size: 15px;
    font-weight: 900;
    color: #f0f6fc;
    letter-spacing: 1px;
}

.overlay-sub {
    font-size: 9px;
    color: #d2a8ff;
    font-weight: 700;
}

.restart {
    width: 100%;
    margin-top: 5px;
    min-height: 32px;
    border: 1px solid rgba(88,166,255,.24);
    border-radius: 10px;
    background: #161b22;
    color: #58a6ff;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .5px;
    touch-action: manipulation;
}

.restart:active {
    background: #1f6feb;
    color: #fff;
}

.controls-hint {
    margin-top: 4px;
    text-align: center;
    font-size: 7px;
    color: #8b949e;
    letter-spacing: .4px;
}

.footer {
    padding-top: 3px;
    text-align: center;
    font-size: 6px;
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
            <span class="title">MEMORY</span>
        </div>

        <div class="user-tag">
            ${fotoVisual}
            <span class="username">${usuario}</span>
        </div>
    </div>

    <div class="stats">
        <div class="stat">
            <span class="stat-label">JOGADAS</span>
            <span class="stat-value" id="moves">0</span>
        </div>

        <div class="stat">
            <span class="stat-label">PARES</span>
            <span class="stat-value" id="pairs">0/8</span>
        </div>

        <div class="stat">
            <span class="stat-label">TEMPO</span>
            <span class="stat-value" id="time">00:00</span>
        </div>
    </div>

    <div
        class="board"
        id="board"
    >
        <div
            class="overlay"
            id="overlay"
        >
            <div
                class="overlay-title"
                id="overlayTitle"
            >
                MEMORY
            </div>

            <div
                class="overlay-sub"
                id="overlaySub"
            >
                TOQUE EM UMA CARTA PARA COMEÇAR 🧠
            </div>
        </div>
    </div>

    <button
        class="restart"
        id="restart"
        type="button"
    >
        🔄 NOVA PARTIDA
    </button>

    <div class="controls-hint">
        Encontre os 8 pares usando o menor número de jogadas
    </div>

    <div class="footer">
        Tokito Games
    </div>

</div>

<script>
(function() {
    const board =
        document.getElementById(
            "board"
        );

    const overlay =
        document.getElementById(
            "overlay"
        );

    const overlayTitle =
        document.getElementById(
            "overlayTitle"
        );

    const overlaySub =
        document.getElementById(
            "overlaySub"
        );

    const movesEl =
        document.getElementById(
            "moves"
        );

    const pairsEl =
        document.getElementById(
            "pairs"
        );

    const timeEl =
        document.getElementById(
            "time"
        );

    const restartBtn =
        document.getElementById(
            "restart"
        );

    const EMOJIS = [
        "🦖",
        "🧊",
        "🔥",
        "⚡",
        "🌙",
        "💎",
        "🎮",
        "👾"
    ];

    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lock = false;
    let moves = 0;
    let pairs = 0;
    let started = false;
    let startTime = 0;
    let timer = null;

    function shuffle(array) {
        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {
            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            const tmp =
                array[i];

            array[i] =
                array[j];

            array[j] =
                tmp;
        }

        return array;
    }

    function formatTime(ms) {
        const total =
            Math.floor(
                ms / 1000
            );

        const minutes =
            Math.floor(
                total / 60
            );

        const seconds =
            total % 60;

        return (
            String(minutes)
                .padStart(2, "0") +
            ":" +
            String(seconds)
                .padStart(2, "0")
        );
    }

    function updateTimer() {
        if (!started) {
            return;
        }

        timeEl.textContent =
            formatTime(
                Date.now() -
                startTime
            );
    }

    function startTimer() {
        if (started) {
            return;
        }

        started = true;
        startTime = Date.now();

        overlay.style.display =
            "none";

        timer =
            setInterval(
                updateTimer,
                500
            );
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function finishGame() {
        stopTimer();

        updateTimer();

        overlayTitle.textContent =
            "VOCÊ VENCEU! 🎉";

        overlaySub.textContent =
            moves +
            " jogadas • " +
            timeEl.textContent;

        overlay.style.display =
            "flex";

        overlay.style.pointerEvents =
            "none";
    }

    function updateStats() {
        movesEl.textContent =
            String(moves);

        pairsEl.textContent =
            pairs + "/8";
    }

    function closePair() {
        firstCard
            .classList
            .remove("open");

        secondCard
            .classList
            .remove("open");

        firstCard =
            null;

        secondCard =
            null;

        lock =
            false;
    }

    function matchPair() {
        firstCard
            .classList
            .remove("open");

        secondCard
            .classList
            .remove("open");

        firstCard
            .classList
            .add("matched");

        secondCard
            .classList
            .add("matched");

        firstCard =
            null;

        secondCard =
            null;

        pairs++;

        updateStats();

        lock =
            false;

        if (pairs === 8) {
            setTimeout(
                finishGame,
                350
            );
        }
    }

    function flipCard(card) {
        if (
            lock ||
            card.classList.contains(
                "matched"
            ) ||
            card === firstCard
        ) {
            return;
        }

        startTimer();

        card.classList.add(
            "open"
        );

        if (!firstCard) {
            firstCard =
                card;

            return;
        }

        secondCard =
            card;

        moves++;

        updateStats();

        lock =
            true;

        if (
            firstCard.dataset.value ===
            secondCard.dataset.value
        ) {
            setTimeout(
                matchPair,
                280
            );
        } else {
            setTimeout(
                closePair,
                650
            );
        }
    }

    function createCard(value) {
        const card =
            document.createElement(
                "button"
            );

        card.type =
            "button";

        card.className =
            "card";

        card.dataset.value =
            value;

        card.textContent =
            value;

        const action =
            event => {
                event.preventDefault();

                flipCard(
                    card
                );
            };

        card.addEventListener(
            "touchstart",
            action,
            {
                passive: false
            }
        );

        card.addEventListener(
            "click",
            action
        );

        return card;
    }

    function resetGame() {
        stopTimer();

        firstCard =
            null;

        secondCard =
            null;

        lock =
            false;

        moves =
            0;

        pairs =
            0;

        started =
            false;

        startTime =
            0;

        updateStats();

        timeEl.textContent =
            "00:00";

        overlayTitle.textContent =
            "MEMORY";

        overlaySub.textContent =
            "TOQUE EM UMA CARTA PARA COMEÇAR 🧠";

        overlay.style.display =
            "flex";

        const oldCards =
            board.querySelectorAll(
                ".card"
            );

        oldCards.forEach(
            card =>
                card.remove()
        );

        cards =
            shuffle(
                [
                    ...EMOJIS,
                    ...EMOJIS
                ]
            );

        cards.forEach(
            value => {
                const card =
                    createCard(
                        value
                    );

                board.insertBefore(
                    card,
                    overlay
                );
            }
        );
    }

    restartBtn.addEventListener(
        "touchstart",
        event => {
            event.preventDefault();
            resetGame();
        },
        {
            passive: false
        }
    );

    restartBtn.addEventListener(
        "click",
        resetGame
    );

    resetGame();
})();
</script>

</body>
</html>
`;
}

async function sendMemoryGame(
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
        buildMemoryHtml(
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
    nome: "memoria",

    comandos: [
        "memoria",
        "memory"
    ],

    categoria: "jogos",

    info: {
        descricao:
            "Jogo da memória interativo dentro do WhatsApp.",

        uso:
            "memoria",

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

            await sendMemoryGame(
                tokito,
                from,
                {
                    usuario,
                    sender
                },
                {
                    submessageText:
                        "Memory Game!"
                }
            );

            return true;
        } catch (error) {
            console.log(
                "[MEMORIA]",
                error?.stack ||
                error?.message ||
                error
            );

            return reply(
                `*❌ | Não foi possível abrir o jogo da memória.*\n\n> ${
                    error?.message ||
                    "Erro desconhecido"
                }`
            );
        }
    }
});
