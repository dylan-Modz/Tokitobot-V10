/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Sistema da divulgação + payment
 *  Dev    : Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const path = require('path')

const {
  proto,
  generateWAMessageFromContent,
  jidNormalizedUser
} = require('../database/lib/exports.js')

const DB_FILE = path.join(
  __dirname,
  '..',
  'database',
  'div.json'
)

const MAX_POR_RODADA = 20
const INTERVALO_PADRAO = 15

function padrao() {
  return {
    texto: '',
    grupos: [],
    quantidade: 0,
    atualizadoEm: null
  }
}

function garantirBanco() {
  const pasta = path.dirname(DB_FILE)

  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(
      pasta,
      { recursive: true }
    )
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        padrao(),
        null,
        2
      )
    )
  }
}

function ler() {
  try {
    garantirBanco()

    const data = JSON.parse(
      fs.readFileSync(
        DB_FILE,
        'utf8'
      )
    )

    return {
      ...padrao(),
      ...(data && typeof data === 'object'
        ? data
        : {}),
      grupos: Array.isArray(data?.grupos)
        ? data.grupos
        : []
    }
  }
  catch {
    return padrao()
  }
}

function salvar(next) {
  garantirBanco()

  const data = {
    ...padrao(),
    ...next,
    grupos: Array.isArray(next?.grupos)
      ? next.grupos
      : [],
    atualizadoEm:
      new Date().toISOString()
  }

  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(
      data,
      null,
      2
    )
  )

  return data
}

const runtime =
  global.__TOKITO_DIV_V3__ ||
  {
    catalogo: [],
    executando: false,
    parar: false,

    status: {
      total: 0,
      enviados: 0,
      falhas: 0,
      restantes: 0,
      inicio: null,
      fim: null,
      ultimoGrupo: null,
      ultimoErro: null
    }
  }

global.__TOKITO_DIV_V3__ =
  runtime

function dormir(ms) {
  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  )
}

function nomeGrupo(g = {}) {
  return String(
    g.subject ||
    g.name ||
    g.id ||
    'Grupo'
  ).trim()
}

async function carregarGrupos(tokito) {
  if (
    !tokito ||
    typeof tokito.groupFetchAllParticipating !==
      'function'
  ) {
    throw new Error(
      'Não foi possível buscar os grupos nesta conexão.'
    )
  }

  const bruto =
    await tokito.groupFetchAllParticipating()

  const grupos =
    Object.values(bruto || {})
      .filter(
        g =>
          g?.id &&
          String(g.id)
            .endsWith('@g.us')
      )
      .map(g => ({
        id: g.id,
        nome: nomeGrupo(g),
        participantes:
          Array.isArray(
            g.participants
          )
            ? g.participants.length
            : null
      }))
      .sort(
        (a, b) =>
          a.nome.localeCompare(
            b.nome,
            'pt-BR'
          )
      )

  runtime.catalogo =
    grupos

  return grupos
}

function catalogoAtual() {
  return Array.isArray(
    runtime.catalogo
  )
    ? runtime.catalogo
    : []
}

function localizarGrupo(chave) {
  const catalogo =
    catalogoAtual()

  const texto =
    String(chave || '')
      .trim()

  if (!texto) return null

  if (/^\d+$/.test(texto)) {
    const idx =
      Number(texto) - 1

    return (
      catalogo[idx] ||
      null
    )
  }

  return (
    catalogo.find(
      g => g.id === texto
    ) ||
    null
  )
}

function alternarGrupo(chave) {
  const state = ler()

  const grupo =
    localizarGrupo(chave)

  if (!grupo) {
    throw new Error(
      'Grupo não encontrado na lista.'
    )
  }

  const existe =
    state.grupos.some(
      g => g.id === grupo.id
    )

  const grupos =
    existe
      ? state.grupos.filter(
          g =>
            g.id !== grupo.id
        )
      : [
          ...state.grupos,
          grupo
        ]

  const quantidade =
    Math.min(
      Number(
        state.quantidade || 0
      ),
      grupos.length
    )

  salvar({
    ...state,
    grupos,
    quantidade
  })

  return {
    grupo,
    selecionado: !existe,
    total: grupos.length
  }
}

function definirQuantidade(valor) {
  const state = ler()

  const n =
    Number(valor)

  if (
    !Number.isInteger(n) ||
    n < 1
  ) {
    throw new Error(
      'Escolha uma quantidade válida.'
    )
  }

  if (!state.grupos.length) {
    throw new Error(
      'Selecione pelo menos um grupo.'
    )
  }

  if (
    n >
    state.grupos.length
  ) {
    throw new Error(
      `Você selecionou ${state.grupos.length} grupo(s). Escolha de 1 até ${state.grupos.length}.`
    )
  }

  if (
    n >
    MAX_POR_RODADA
  ) {
    throw new Error(
      `O máximo por rodada é ${MAX_POR_RODADA} grupos.`
    )
  }

  return salvar({
    ...state,
    quantidade: n
  })
}

function definirTexto(texto) {
  const state = ler()

  return salvar({
    ...state,
    texto:
      String(texto || '')
        .trim()
  })
}

function limparSelecao() {
  const state = ler()

  return salvar({
    ...state,
    grupos: [],
    quantidade: 0
  })
}

function limparTudo() {
  if (runtime.executando) {
    throw new Error(
      'Pare a divulgação antes de limpar.'
    )
  }

  return salvar(
    padrao()
  )
}

async function fotoPerfil(
  tokito,
  jid
) {
  if (
    !tokito ||
    !jid ||
    typeof tokito.profilePictureUrl !==
      'function'
  ) {
    return null
  }

  try {
    return await tokito.profilePictureUrl(
      jid,
      'image'
    )
  }
  catch {
    return null
  }
}

async function seloPayment(
  tokito,
  autorJid,
  nomeAutor,
  NomeDoBot
) {
  const foto =
    await fotoPerfil(
      tokito,
      autorJid
    )

  const selo = {
    title:
      `💳 PAYMENT • ${NomeDoBot || 'TOKITO'}`,
    body:
      `${nomeAutor || 'Dylan Modz'} • Divulgação`,
    mediaType: 1,
    renderLargerThumbnail:
      false,
    showAdAttribution:
      false
  }

  if (foto) {
    selo.thumbnailUrl =
      foto
  }

  return selo
}

/*
 * ============================================================
 *                    MARCAÇÃO TIPO TOTAG
 * ============================================================
 *
 * O totag da base usa:
 *   contextInfo: { mentionedJid: TDS_GP }
 *
 * Aqui fazemos a mesma coisa dentro do noteMessage do payment.
 * ============================================================
 */

async function membrosGrupo(
  tokito,
  jid
) {
  if (
    !String(jid || '')
      .endsWith('@g.us')
  ) {
    return []
  }

  const metadata =
    await tokito.groupMetadata(
      jid
    )

  const bot =
    jidNormalizedUser(
      tokito.user?.id || ''
    )

  return [
    ...new Set(
      (
        metadata?.participants ||
        []
      )
        .map(
          p =>
            p?.id ||
            p?.jid ||
            ''
        )
        .filter(Boolean)
        .map(jidNormalizedUser)
        .filter(
          jid =>
            jid &&
            jid !== bot
        )
    )
  ]
}

function montarPayment({
  texto,
  mencoes = [],
  selo = null
} = {}) {
  const contextInfo = {}

  if (
    Array.isArray(mencoes) &&
    mencoes.length
  ) {
    contextInfo.mentionedJid =
      mencoes
  }

  if (
    selo &&
    typeof selo === 'object'
  ) {
    contextInfo.externalAdReply =
      selo
  }

  return proto.Message.fromObject({
    requestPaymentMessage: {
      currencyCodeIso4217:
        'BRL',

      amount1000:
        0,

      noteMessage: {
        extendedTextMessage: {
          text:
            String(
              texto || ''
            ).trim(),

          contextInfo
        }
      }
    }
  })
}

async function enviarPayment(
  tokito,
  jid,
  texto,
  opcoes = {}
) {
  const mensagemTexto =
    String(texto || '')
      .trim()

  if (!mensagemTexto) {
    throw new Error(
      'A mensagem da divulgação está vazia.'
    )
  }

  if (
    !tokito ||
    typeof tokito.relayMessage !==
      'function'
  ) {
    throw new Error(
      'relayMessage não está disponível.'
    )
  }

  const mencoes =
    opcoes.marcarTodos !== false
      ? await membrosGrupo(
          tokito,
          jid
        )
      : []

  const selo =
    await seloPayment(
      tokito,
      opcoes.autorJid,
      opcoes.nomeAutor,
      opcoes.NomeDoBot
    )

  const conteudo =
    montarPayment({
      texto: mensagemTexto,
      mencoes,
      selo
    })

  const mensagem =
    generateWAMessageFromContent(
      jid,
      conteudo,
      {
        userJid:
          tokito.user?.id,

        ...(opcoes.quoted
          ? {
              quoted:
                opcoes.quoted
            }
          : {})
      }
    )

  await tokito.relayMessage(
    jid,
    mensagem.message,
    {
      messageId:
        mensagem.key.id
    }
  )

  return {
    mensagem,
    mencoes
  }
}

async function enviar(
  tokito,
  opcoes = {}
) {
  if (runtime.executando) {
    throw new Error(
      'Já existe uma divulgação em andamento.'
    )
  }

  const state = ler()

  if (!state.texto) {
    throw new Error(
      'Defina a mensagem primeiro com divmsg.'
    )
  }

  if (!state.grupos.length) {
    throw new Error(
      'Selecione pelo menos um grupo.'
    )
  }

  const quantidade =
    Number(
      state.quantidade || 0
    )

  if (
    !Number.isInteger(
      quantidade
    ) ||
    quantidade < 1
  ) {
    throw new Error(
      'Escolha a quantidade no painel antes de enviar.'
    )
  }

  const fila =
    state.grupos.slice(
      0,
      Math.min(
        quantidade,
        MAX_POR_RODADA
      )
    )

  runtime.executando =
    true

  runtime.parar =
    false

  runtime.status = {
    total:
      fila.length,

    enviados:
      0,

    falhas:
      0,

    restantes:
      fila.length,

    inicio:
      new Date()
        .toISOString(),

    fim:
      null,

    ultimoGrupo:
      null,

    ultimoErro:
      null
  }

  try {
    for (
      let i = 0;
      i < fila.length;
      i++
    ) {
      if (
        runtime.parar
      ) {
        break
      }

      const grupo =
        fila[i]

      runtime.status.ultimoGrupo =
        grupo.nome

      try {
        await enviarPayment(
          tokito,
          grupo.id,
          state.texto,
          {
            marcarTodos: true,
            autorJid:
              opcoes.autorJid,
            nomeAutor:
              opcoes.nomeAutor,
            NomeDoBot:
              opcoes.NomeDoBot
          }
        )

        runtime.status.enviados++
      }
      catch (error) {
        runtime.status.falhas++

        runtime.status.ultimoErro =
          String(
            error?.message ||
            error
          )
      }

      runtime.status.restantes =
        Math.max(
          0,
          fila.length -
          (
            runtime.status.enviados +
            runtime.status.falhas
          )
        )

      if (
        i <
          fila.length - 1 &&
        !runtime.parar
      ) {
        await dormir(
          INTERVALO_PADRAO *
          1000
        )
      }
    }
  }
  finally {
    runtime.executando =
      false

    runtime.status.fim =
      new Date()
        .toISOString()
  }

  return obterStatus()
}

function parar() {
  if (!runtime.executando) {
    return false
  }

  runtime.parar =
    true

  return true
}

function obterStatus() {
  return {
    config:
      ler(),

    runtime: {
      ...runtime.status,
      executando:
        runtime.executando,
      parar:
        runtime.parar
    }
  }
}

module.exports = {
  DB_FILE,
  MAX_POR_RODADA,
  INTERVALO_PADRAO,

  ler,
  salvar,

  carregarGrupos,
  catalogoAtual,
  localizarGrupo,
  alternarGrupo,

  definirQuantidade,
  definirTexto,

  limparSelecao,
  limparTudo,

  membrosGrupo,
  seloPayment,
  montarPayment,
  enviarPayment,

  enviar,
  parar,
  obterStatus
}
