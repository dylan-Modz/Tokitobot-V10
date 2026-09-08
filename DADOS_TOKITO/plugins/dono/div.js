/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Painel interativo da divulgação
 *  Dev    : Dylan Modz
 * ============================================================
 */

const dylan =
  require(
    '../../database/lib/comandos'
  )

const div =
  require(
    '../../sistemas/div'
  )

const msg =
  require(
    '../../mensagens/div'
  )

function cortar(
  texto,
  max = 60
) {
  const t =
    String(texto || '')
      .replace(
        /\s+/g,
        ' '
      )
      .trim()

  return t.length > max
    ? `${t.slice(
        0,
        max - 3
      )}...`
    : t
}

function garantirDono(ctx) {
  if (ctx.SoDono) {
    return true
  }

  if (
    ctx.mess &&
    typeof ctx.mess.onlyOwner ===
      'function'
  ) {
    ctx.reply(
      ctx.mess.onlyOwner()
    )

    return false
  }

  ctx.reply(
    msg.erro(
      'ᴇssᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇ́ ᴇxᴄʟᴜsɪᴠᴏ ᴅᴏ ᴅᴏɴᴏ.'
    )
  )

  return false
}

function listaGrupos(
  prefix,
  grupos,
  selecionados
) {
  const ids =
    new Set(
      selecionados.map(
        g => g.id
      )
    )

  return {
    title:
      '「 📢 」𝐆𝐑𝐔𝐏𝐎𝐒 𝐃𝐀 𝐃𝐈𝐕𝐔𝐋𝐆𝐀𝐂̧𝐀̃𝐎',

    sections: [
      {
        title:
          '📋 SELECIONE / REMOVA GRUPOS',

        highlight_label:
          `${selecionados.length} selecionado(s)`,

        rows:
          grupos
            .slice(
              0,
              50
            )
            .map(
              (g, i) => ({
                title:
                  `${
                    ids.has(g.id)
                      ? '✅'
                      : '▫️'
                  } ${cortar(
                    g.nome,
                    45
                  )}`,

                description:
                  `${
                    Number.isFinite(
                      g.participantes
                    )
                      ? `${g.participantes} membros • `
                      : ''
                  }toque para ${
                    ids.has(g.id)
                      ? 'remover'
                      : 'selecionar'
                  }`,

                id:
                  `${prefix}divselect ${
                    i + 1
                  }`
              })
            )
      }
    ]
  }
}

function listaQuantidade(
  prefix,
  total
) {
  const limite =
    Math.min(
      total,
      div.MAX_POR_RODADA
    )

  return {
    title:
      '「 🔢 」𝐐𝐔𝐀𝐍𝐓𝐈𝐃𝐀𝐃𝐄',

    sections: [
      {
        title:
          '🚀 QUANTOS GRUPOS NESTA RODADA?',

        highlight_label:
          `${total} selecionado(s)`,

        rows:
          Array.from(
            {
              length:
                limite
            },
            (_, i) => {
              const n =
                i + 1

              return {
                title:
                  `📢 Enviar para ${n} grupo${
                    n > 1
                      ? 's'
                      : ''
                  }`,

                description:
                  '1 envio visível por grupo selecionado',

                id:
                  `${prefix}divqtd ${n}`
              }
            }
          )
      }
    ]
  }
}

async function enviarInterativo(
  ctx,
  {
    texto,
    botoes
  }
) {
  const {
    tokito,
    from,
    proto,
    generateWAMessageFromContent,
    selo,
    NomeDoBot
  } = ctx

  const mensagem =
    generateWAMessageFromContent(
      from,
      {
        interactiveMessage:
          proto.Message.InteractiveMessage.create(
            {
              contextInfo:
                selo?.message
                  ? {
                      quotedMessage:
                        selo.message,

                      participant:
                        selo?.key
                          ?.participant ||
                        selo?.key
                          ?.remoteJid ||
                        ctx.sender,

                      stanzaId:
                        selo?.key?.id,

                      remoteJid:
                        selo?.key
                          ?.remoteJid ||
                        from
                    }
                  : {},

              body:
                proto.Message.InteractiveMessage.Body.create(
                  {
                    text:
                      texto
                  }
                ),

              footer:
                proto.Message.InteractiveMessage.Footer.create(
                  {
                    text:
                      NomeDoBot ||
                      'Tokito Bot V10'
                  }
                ),

              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.create(
                  {
                    buttons:
                      botoes,

                    messageParamsJson:
                      ''
                  }
                )
            }
          )
      },
      {
        quoted:
          selo ||
          ctx.info
      }
    )

  return tokito.relayMessage(
    from,
    mensagem.message,
    {
      messageId:
        mensagem.key.id
    }
  )
}

async function abrirPainel(ctx) {
  const grupos =
    await div.carregarGrupos(
      ctx.tokito
    )

  const state =
    div.ler()

  if (!grupos.length) {
    return ctx.reply(
      msg.erro(
        'ɴᴇɴʜᴜᴍ ɢʀᴜᴘᴏ ғᴏɪ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.'
      )
    )
  }

  const botoes = [
    {
      name:
        'single_select',

      buttonParamsJson:
        JSON.stringify(
          listaGrupos(
            ctx.prefix || '.',
            grupos,
            state.grupos
          )
        )
    }
  ]

  if (
    state.grupos.length
  ) {
    botoes.push({
      name:
        'single_select',

      buttonParamsJson:
        JSON.stringify(
          listaQuantidade(
            ctx.prefix || '.',
            state.grupos.length
          )
        )
    })

    botoes.push({
      name:
        'quick_reply',

      buttonParamsJson:
        JSON.stringify({
          display_text:
            '🧹 LIMPAR SELEÇÃO',
          id:
            `${ctx.prefix || '.'}divselclear`
        })
    })
  }

  return enviarInterativo(
    ctx,
    {
      texto:
        msg.painel({
          selecionados:
            state.grupos.length,
          quantidade:
            state.quantidade,
          texto:
            Boolean(
              state.texto
            )
        }),

      botoes
    }
  )
}

async function aposSelecao(
  ctx,
  resultado
) {
  const grupos =
    div.catalogoAtual()

  const state =
    div.ler()

  const botoes = [
    {
      name:
        'single_select',

      buttonParamsJson:
        JSON.stringify(
          listaGrupos(
            ctx.prefix || '.',
            grupos,
            state.grupos
          )
        )
    }
  ]

  if (
    state.grupos.length
  ) {
    botoes.push({
      name:
        'single_select',

      buttonParamsJson:
        JSON.stringify(
          listaQuantidade(
            ctx.prefix || '.',
            state.grupos.length
          )
        )
    })
  }

  return enviarInterativo(
    ctx,
    {
      texto:
        msg.grupoSelecionado(
          resultado.grupo.nome,
          resultado.selecionado,
          resultado.total
        ),

      botoes
    }
  )
}

async function confirmarQuantidade(
  ctx,
  valor
) {
  const state =
    div.definirQuantidade(
      valor
    )

  return enviarInterativo(
    ctx,
    {
      texto:
        msg.quantidade(
          state.quantidade,
          state.grupos.length
        ),

      botoes: [
        {
          name:
            'quick_reply',

          buttonParamsJson:
            JSON.stringify({
              display_text:
                '🚀 ENVIAR AGORA',

              id:
                `${ctx.prefix || '.'}divenviar`
            })
        },

        {
          name:
            'quick_reply',

          buttonParamsJson:
            JSON.stringify({
              display_text:
                '📋 ALTERAR GRUPOS',

              id:
                `${ctx.prefix || '.'}div`
            })
        },

        {
          name:
            'quick_reply',

          buttonParamsJson:
            JSON.stringify({
              display_text:
                '🛑 CANCELAR',

              id:
                `${ctx.prefix || '.'}divselclear`
            })
        }
      ]
    }
  )
}

dylan.setCommand({
  nome:
    'div',

  comandos: [
    'div',
    'divgrupos',
    'divselect',
    'divqtd',
    'divselclear',
    'divmsg',
    'divenviar',
    'divstatus',
    'divstop',
    'divlimpar',
    'deivimento'
  ],

  categoria:
    'dono',

  info: {
    descricao:
      'Painel de divulgação do Tokito.',

    uso:
      'div',

    permissao:
      'Dono',

    categoria:
      'dono'
  },

  async executar(ctx) {
    if (
      !garantirDono(ctx)
    ) {
      return
    }

    const {
      tokito,
      from,
      q,
      reply
    } = ctx

    const command =
      String(
        ctx.command || ''
      )
        .trim()
        .toLowerCase()

    try {
      switch (command) {
        case 'div':
        case 'divgrupos':
          return abrirPainel(
            ctx
          )

        case 'divselect': {
          if (
            !div.catalogoAtual()
              .length
          ) {
            await div.carregarGrupos(
              tokito
            )
          }

          const resultado =
            div.alternarGrupo(
              String(q || '')
                .trim()
            )

          return aposSelecao(
            ctx,
            resultado
          )
        }

        case 'divqtd':
          return confirmarQuantidade(
            ctx,
            String(q || '')
              .trim()
          )

        case 'divselclear':
          div.limparSelecao()

          return abrirPainel(
            ctx
          )

        case 'divmsg': {
          const texto =
            String(q || '')
              .trim()

          if (!texto) {
            return reply(
              msg.info(
                '𝙲𝙾𝙼𝙾 𝚄𝚂𝙰𝚁',
                `${
                  ctx.prefix || '.'
                }divmsg sua divulgação`
              )
            )
          }

          if (
            texto.length >
            3500
          ) {
            return reply(
              msg.erro(
                'ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴇ́ ᴍᴜɪᴛᴏ ɢʀᴀɴᴅᴇ.'
              )
            )
          }

          div.definirTexto(
            texto
          )

          return reply(
            msg.mensagemSalva(
              cortar(
                texto,
                500
              )
            )
          )
        }

        case 'deivimento': {
          const texto =
            String(q || '')
              .trim()

          if (!texto) {
            return reply(
              msg.info(
                '𝙲𝙾𝙼𝙾 𝚄𝚂𝙰𝚁',
                `${
                  ctx.prefix || '.'
                }deivimento texto`
              )
            )
          }

          await div.enviarPayment(
            tokito,
            from,
            texto,
            {
              marcarTodos:
                true,

              autorJid:
                ctx.sender,

              nomeAutor:
                ctx.pushname ||
                ctx.ownerName ||
                'Dylan Modz',

              NomeDoBot:
                ctx.NomeDoBot,

              quoted:
                ctx.selo ||
                ctx.info
            }
          )

          return true
        }

        case 'divenviar': {
          const state =
            div.ler()

          if (!state.texto) {
            return reply(
              msg.erro(
                `ᴅᴇғɪɴᴀ ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴄᴏᴍ ${
                  ctx.prefix || '.'
                }divmsg.`
              )
            )
          }

          if (
            !state.grupos.length
          ) {
            return abrirPainel(
              ctx
            )
          }

          if (
            !state.quantidade
          ) {
            return abrirPainel(
              ctx
            )
          }

          await reply(
            msg.inicio(
              state.quantidade
            )
          )

          const resultado =
            await div.enviar(
              tokito,
              {
                autorJid:
                  ctx.sender,

                nomeAutor:
                  ctx.pushname ||
                  ctx.ownerName ||
                  'Dylan Modz',

                NomeDoBot:
                  ctx.NomeDoBot
              }
            )

          return reply(
            msg.fim(
              resultado.runtime
            )
          )
        }

        case 'divstatus': {
          const {
            config,
            runtime
          } =
            div.obterStatus()

          return reply(
            msg.status(
              config,
              runtime
            )
          )
        }

        case 'divstop': {
          const ok =
            div.parar()

          return reply(
            msg.info(
              ok
                ? '𝙿𝙰𝚁𝙰𝙽𝙳𝙾'
                : '𝙽𝙰𝙳𝙰 𝚁𝙾𝙳𝙰𝙽𝙳𝙾',
              ok
                ? 'ᴀ ᴘᴀʀᴀᴅᴀ ғᴏɪ sᴏʟɪᴄɪᴛᴀᴅᴀ.'
                : 'ɴᴀ̃ᴏ ʜᴀ́ ᴅɪᴠᴜʟɢᴀᴄ̧ᴀ̃ᴏ ᴇᴍ ᴀɴᴅᴀᴍᴇɴᴛᴏ.'
            )
          )
        }

        case 'divlimpar':
          div.limparTudo()

          return reply(
            msg.info(
              '𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾 𝙻𝙸𝙼𝙿𝙰',
              'ᴍᴇɴsᴀɢᴇᴍ, ɢʀᴜᴘᴏs ᴇ ǫᴜᴀɴᴛɪᴅᴀᴅᴇ ғᴏʀᴀᴍ ʟɪᴍᴘᴏs.'
            )
          )

        default:
          return abrirPainel(
            ctx
          )
      }
    }
    catch (error) {
      console.log(
        '[DIV]',
        error?.stack ||
        error?.message ||
        error
      )

      return reply(
        msg.erro(
          error?.message ||
          'ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴇxᴇᴄᴜᴛᴀʀ ᴏ ᴄᴏᴍᴀɴᴅᴏ.'
        )
      )
    }
  }
})
