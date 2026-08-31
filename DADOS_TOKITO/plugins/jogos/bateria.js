/*
 * TOKITO BOT V10
 * Jogo: Bateria
 * Dev: Dylan Modz
 */

const crypto = require('crypto')

module.exports = {
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
<html lang="pt-BR">

<head>
<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
>

<style>

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  background:
    radial-gradient(
      circle at top,
      #182b40,
      #07111d 55%,
      #03070c
    );

  font-family: Arial, Helvetica, sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.game {
  width: min(100%, 620px);
  height: 100%;

  padding: 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 14px;
}

.title {
  color: #ffffff;

  font-size: 22px;
  font-weight: 800;
}

.subtitle {
  margin-top: 3px;

  color: #8da7bd;

  font-size: 11px;
}

.score-box {
  padding: 8px 12px;

  border: 1px solid rgba(255,255,255,.10);
  border-radius: 12px;

  background: rgba(255,255,255,.06);

  text-align: right;
}

.score-label {
  color: #7994aa;

  font-size: 9px;
  letter-spacing: 1px;
}

#score {
  color: #ffffff;

  font-size: 19px;
  font-weight: 800;
}

.display {
  min-height: 62px;

  margin-bottom: 14px;
  padding: 10px;

  border: 1px solid rgba(255,255,255,.09);
  border-radius: 16px;

  background: rgba(0,0,0,.22);

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
}

#status {
  color: #c7d8e7;

  font-size: 13px;
}

.pads {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 10px;
}

.pad {
  position: relative;

  height: 92px;

  border: 1px solid rgba(255,255,255,.13);
  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.11),
      rgba(255,255,255,.035)
    );

  box-shadow:
    inset 0 1px rgba(255,255,255,.12),
    0 8px 18px rgba(0,0,0,.22);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;

  touch-action: manipulation;

  transition:
    transform .08s,
    background .08s,
    box-shadow .08s;
}

.pad:active,
.pad.active {
  transform: scale(.94);

  background:
    linear-gradient(
      145deg,
      rgba(57,169,255,.45),
      rgba(23,92,151,.25)
    );

  box-shadow:
    inset 0 0 24px rgba(96,192,255,.30),
    0 0 18px rgba(74,174,255,.22);
}

.icon {
  font-size: 25px;

  margin-bottom: 5px;
}

.name {
  font-size: 11px;
  font-weight: 800;

  letter-spacing: .7px;
}

.key {
  margin-top: 3px;

  color: #7893aa;

  font-size: 8px;
}

.bottom {
  margin-top: 13px;

  display: flex;
  gap: 9px;
}

button {
  height: 43px;

  border: 0;
  border-radius: 13px;

  font-weight: 800;

  touch-action: manipulation;
}

#challenge {
  flex: 1;

  background:
    linear-gradient(
      135deg,
      #2196f3,
      #1565c0
    );

  color: #fff;
}

#reset {
  width: 95px;

  background: rgba(255,255,255,.08);

  border: 1px solid rgba(255,255,255,.10);

  color: #b8c9d8;
}

.combo {
  margin-top: 10px;

  text-align: center;

  color: #668096;

  font-size: 10px;
}

#combo {
  color: #5db8ff;

  font-weight: bold;
}

.flash {
  animation: flash .15s;
}

@keyframes flash {

  50% {
    filter: brightness(1.7);
  }

}

</style>
</head>

<body>

<div class="game">

  <div class="top">

    <div>

      <div class="title">
        🥁 Bateria Tokito
      </div>

      <div class="subtitle">
        toque nos pads e faça seu ritmo
      </div>

    </div>

    <div class="score-box">

      <div class="score-label">
        PONTOS
      </div>

      <div id="score">
        0
      </div>

    </div>

  </div>


  <div class="display">

    <div id="status">
      Toque em qualquer peça para começar 🎵
    </div>

  </div>


  <div class="pads">

    <div
      class="pad"
      data-drum="kick"
      data-key="a"
    >

      <div class="icon">
        🥁
      </div>

      <div class="name">
        BUMBO
      </div>

      <div class="key">
        A
      </div>

    </div>


    <div
      class="pad"
      data-drum="snare"
      data-key="s"
    >

      <div class="icon">
        🪘
      </div>

      <div class="name">
        CAIXA
      </div>

      <div class="key">
        S
      </div>

    </div>


    <div
      class="pad"
      data-drum="hat"
      data-key="d"
    >

      <div class="icon">
        ✨
      </div>

      <div class="name">
        HI-HAT
      </div>

      <div class="key">
        D
      </div>

    </div>


    <div
      class="pad"
      data-drum="tom"
      data-key="j"
    >

      <div class="icon">
        🔵
      </div>

      <div class="name">
        TOM
      </div>

      <div class="key">
        J
      </div>

    </div>


    <div
      class="pad"
      data-drum="clap"
      data-key="k"
    >

      <div class="icon">
        👏
      </div>

      <div class="name">
        CLAP
      </div>

      <div class="key">
        K
      </div>

    </div>


    <div
      class="pad"
      data-drum="crash"
      data-key="l"
    >

      <div class="icon">
        💥
      </div>

      <div class="name">
        PRATO
      </div>

      <div class="key">
        L
      </div>

    </div>

  </div>


  <div class="bottom">

    <button id="challenge">
      🎯 DESAFIO
    </button>

    <button id="reset">
      LIMPAR
    </button>

  </div>


  <div class="combo">
    COMBO:
    <span id="combo">
      0x
    </span>
  </div>

</div>


<script>

(function () {

  'use strict'

  const pads =
    [...document.querySelectorAll('.pad')]

  const scoreEl =
    document.getElementById('score')

  const comboEl =
    document.getElementById('combo')

  const statusEl =
    document.getElementById('status')

  const challengeButton =
    document.getElementById('challenge')

  const resetButton =
    document.getElementById('reset')


  let audioContext = null

  let score = 0
  let combo = 0

  let sequence = []
  let playerIndex = 0

  let challengeRunning = false
  let acceptingInput = true


  function getAudio() {

    if (!audioContext) {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext

      if (AudioContext) {
        audioContext =
          new AudioContext()
      }

    }

    if (
      audioContext &&
      audioContext.state === 'suspended'
    ) {
      audioContext.resume()
    }

    return audioContext
  }


  function oscillator(
    frequency,
    duration,
    type,
    volume,
    endFrequency
  ) {

    const ac = getAudio()

    if (!ac) {
      return
    }

    const now =
      ac.currentTime

    const osc =
      ac.createOscillator()

    const gain =
      ac.createGain()

    osc.type =
      type || 'sine'

    osc.frequency.setValueAtTime(
      frequency,
      now
    )

    if (endFrequency) {

      osc.frequency.exponentialRampToValueAtTime(
        endFrequency,
        now + duration
      )

    }

    gain.gain.setValueAtTime(
      volume,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    )

    osc.connect(gain)

    gain.connect(
      ac.destination
    )

    osc.start(now)

    osc.stop(
      now + duration
    )

  }


  function noise(
    duration,
    volume,
    highpass
  ) {

    const ac = getAudio()

    if (!ac) {
      return
    }

    const size =
      Math.floor(
        ac.sampleRate * duration
      )

    const buffer =
      ac.createBuffer(
        1,
        size,
        ac.sampleRate
      )

    const data =
      buffer.getChannelData(0)

    for (
      let i = 0;
      i < size;
      i++
    ) {

      data[i] =
        Math.random() * 2 - 1

    }

    const source =
      ac.createBufferSource()

    const filter =
      ac.createBiquadFilter()

    const gain =
      ac.createGain()

    source.buffer =
      buffer

    filter.type =
      'highpass'

    filter.frequency.value =
      highpass || 1000

    gain.gain.setValueAtTime(
      volume,
      ac.currentTime
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ac.currentTime + duration
    )

    source.connect(filter)

    filter.connect(gain)

    gain.connect(
      ac.destination
    )

    source.start()

  }


  function playSound(type) {

    switch (type) {

      case 'kick':

        oscillator(
          150,
          .32,
          'sine',
          .9,
          45
        )

        break


      case 'snare':

        noise(
          .18,
          .45,
          1200
        )

        oscillator(
          180,
          .10,
          'triangle',
          .20,
          110
        )

        break


      case 'hat':

        noise(
          .07,
          .25,
          6000
        )

        break


      case 'tom':

        oscillator(
          180,
          .25,
          'sine',
          .55,
          90
        )

        break


      case 'clap':

        noise(
          .10,
          .34,
          1600
        )

        setTimeout(
          function () {

            noise(
              .08,
              .25,
              1800
            )

          },
          45
        )

        break


      case 'crash':

        noise(
          .55,
          .28,
          3500
        )

        break

    }

  }


  function visualPad(type) {

    const pad =
      document.querySelector(
        '[data-drum="' +
        type +
        '"]'
      )

    if (!pad) {
      return
    }

    pad.classList.add(
      'active'
    )

    setTimeout(
      function () {

        pad.classList.remove(
          'active'
        )

      },
      120
    )

  }


  function updateHud() {

    scoreEl.textContent =
      String(score)

    comboEl.textContent =
      String(combo) + 'x'

  }


  function tap(type, player) {

    playSound(type)

    visualPad(type)

    if (!player) {
      return
    }

    if (!acceptingInput) {
      return
    }

    if (!challengeRunning) {

      score += 1

      statusEl.textContent =
        '🎵 Continue tocando!'

      updateHud()

      return
    }


    if (
      type ===
      sequence[playerIndex]
    ) {

      playerIndex++

      combo++

      score +=
        10 + combo

      updateHud()


      if (
        playerIndex >=
        sequence.length
      ) {

        challengeRunning =
          false

        acceptingInput =
          true

        statusEl.textContent =
          '🔥 Perfeito! Sequência completa! +' +
          String(sequence.length * 10) +
          ' pontos'

        challengeButton.textContent =
          '🎯 NOVO DESAFIO'

      }

    } else {

      combo = 0

      playerIndex = 0

      challengeRunning =
        false

      updateHud()

      statusEl.textContent =
        '❌ Errou a sequência! Tente novamente.'

      challengeButton.textContent =
        '🔄 TENTAR NOVAMENTE'

    }

  }


  pads.forEach(
    function (pad) {

      pad.addEventListener(
        'pointerdown',
        function (event) {

          event.preventDefault()

          tap(
            pad.dataset.drum,
            true
          )

        },
        {
          passive: false
        }
      )

    }
  )


  document.addEventListener(
    'keydown',
    function (event) {

      const key =
        String(
          event.key || ''
        ).toLowerCase()

      const pad =
        pads.find(
          function (item) {

            return (
              item.dataset.key ===
              key
            )

          }
        )

      if (!pad) {
        return
      }

      event.preventDefault()

      tap(
        pad.dataset.drum,
        true
      )

    }
  )


  function sleep(ms) {

    return new Promise(
      function (resolve) {

        setTimeout(
          resolve,
          ms
        )

      }
    )

  }


  async function showSequence() {

    acceptingInput =
      false

    playerIndex =
      0

    statusEl.textContent =
      '👀 Observe a sequência...'


    await sleep(600)


    for (
      const type
      of sequence
    ) {

      tap(
        type,
        false
      )

      await sleep(420)

    }


    await sleep(250)


    acceptingInput =
      true

    statusEl.textContent =
      '🥁 Agora repita a sequência!'

  }


  challengeButton.addEventListener(
    'click',
    async function () {

      const drums = [
        'kick',
        'snare',
        'hat',
        'tom',
        'clap',
        'crash'
      ]

      sequence = []

      const difficulty =
        Math.min(
          8,
          3 +
          Math.floor(
            score / 100
          )
        )


      for (
        let i = 0;
        i < difficulty;
        i++
      ) {

        sequence.push(
          drums[
            Math.floor(
              Math.random() *
              drums.length
            )
          ]
        )

      }

      challengeRunning =
        true

      combo =
        0

      updateHud()

      challengeButton.textContent =
        '🎯 DESAFIO ATIVO'

      await showSequence()

    }
  )


  resetButton.addEventListener(
    'click',
    function () {

      score =
        0

      combo =
        0

      sequence =
        []

      playerIndex =
        0

      challengeRunning =
        false

      acceptingInput =
        true

      statusEl.textContent =
        'Toque em qualquer peça para começar 🎵'

      challengeButton.textContent =
        '🎯 DESAFIO'

      updateHud()

    }
  )


  updateHud()

})()

</script>

</body>
</html>`


        const unifiedData = {
          response_id: crypto.randomUUID(),

          sections: [
            {
              view_model: {
                primitive: {
                  __typename:
                    'GenAIaeacdsnwHtmlPrimitive',

                  payload:
                    bateriaHtml,

                  trusted_sources: [
                    'zone.api.br'
                  ]
                },

                __typename:
                  'GenAISingleLayoutViewModel'
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

              botResponseId:
                crypto.randomUUID(),

              verificationMetadata: {
                proofs: [
                  {
                    version: 1,

                    useCase: 1,

                    signature:
                      'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==',

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
                    messageText:
                      '🥁 Bateria Tokito'
                  }
                ],

                unifiedResponse: {
                  data:
                    Buffer
                      .from(
                        JSON.stringify(
                          unifiedData
                        )
                      )
                      .toString(
                        'base64'
                      )
                },

                contextInfo: {
                  forwardingScore: 1,

                  isForwarded: true,

                  forwardedAiBotMessageInfo: {
                    botJid:
                      '867051314767696@bot'
                  },

                  forwardOrigin: 4
                }
              }
            }
          }
        }


        const msg =
          generateWAMessageFromContent(
            from,
            payload,
            {
              quoted:
                selo || info,

              userJid:
                tokito.user?.id
            }
          )


        await tokito.relayMessage(
          from,
          msg.message,
          {
            messageId:
              msg.key.id
          }
        )

      } catch (error) {

        console.log(
          '[BATERIA]',
          error?.stack ||
          error?.message ||
          error
        )

        return reply(
          `*❌ | Não foi possível abrir o jogo de bateria.*\n\n> ${error?.message || 'Erro desconhecido'}`
        )
      }
    }
  }
}