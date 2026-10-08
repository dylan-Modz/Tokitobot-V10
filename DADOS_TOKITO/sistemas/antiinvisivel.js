/*
 * Tokito Bot V10 - Monitor de mensagens invisiveis
 * Autor: Dylan Modz
 *
 * Falha de descriptografia nao comprova ataque.
 * O modo padrao apenas alerta; remocao exige ativacao explicita,
 * rajada excepcional e validacao das permissoes.
 */
const base = require('./grupos.js')
const { proto } = require('baileys')
const runtimeSub = require('../sub/runtime.js')

const JANELA_MS = 15000
const LIMITE_ALERTA = 4
const LIMITE_REMOCAO = 10
const MIN_SINAIS_FORTES = 2
const COOLDOWN_MS = 60000
const HISTORICO_MS = 120000

const historico = new Map()
const vistos = new Map()
const avisos = new Map()
const moderacoes = new Map()

const limpar = agora => {
  for (const [chave, tempo] of vistos)
    if (agora - tempo > HISTORICO_MS) vistos.delete(chave)
  for (const [chave, tempo] of avisos)
    if (agora - tempo > COOLDOWN_MS) avisos.delete(chave)
  for (const [chave, tempo] of moderacoes)
    if (agora - tempo > COOLDOWN_MS) moderacoes.delete(chave)
  for (const [chave, eventos] of historico) {
    const recentes = eventos.filter(e => agora - e.tempo <= JANELA_MS)
    if (recentes.length) historico.set(chave, recentes)
    else historico.delete(chave)
  }
}

const identidades = membro => [
  membro?.id, membro?.jid, membro?.lid, membro?.phoneNumber,
  membro?.participant, membro?.participantAlt, membro?.participantPn
].map(base.normalizar).filter(Boolean)

const mesmo = (a, b) => {
  const x = base.normalizar(a)
  const y = base.normalizar(b)
  return !!(x && y && x === y)
}

const localizar = (meta, valores) => {
  const procurados = valores.map(base.normalizar).filter(Boolean)
  return (meta?.participants || []).find(membro =>
    identidades(membro).some(jid => procurados.includes(jid))
  ) || null
}

const resolvido = (item, preferencias) => {
  const opcoes = [...identidades(item), ...preferencias.map(base.normalizar).filter(Boolean)]
  return opcoes.find(jid => jid.endsWith('@s.whatsapp.net')) ||
    opcoes.find(jid => jid.endsWith('@lid')) || ''
}

const registrar = async (tokito, dados = {}) => {
  const grupo = String(dados.remoteJid || '')
  const id = String(dados.messageId || '')
  const autor = base.normalizar(dados.participantAlt || dados.participant)
  if (!tokito || !grupo.endsWith('@g.us') || !id || !autor)
    return { registrado: false, motivo: 'dados-ausentes' }

  const config = base.config(grupo)
  if (config.antiinvisivel !== true)
    return { registrado: false, motivo: 'desativado' }

  const agora = Date.now()
  limpar(agora)
  const chaveId = `${grupo}:${id}`
  if (vistos.has(chaveId)) {
    if (dados.decryptFail === 'hide') {
      for (const eventos of historico.values()) {
        const anterior = eventos.find(e => e.id === id)
        if (anterior) anterior.forte = true
      }
    }
    return { registrado: false, motivo: 'duplicado' }
  }
  vistos.set(chaveId, agora)

  const chaveAutor = `${grupo}|${autor}`
  const recentes = (historico.get(chaveAutor) || []).filter(e => agora - e.tempo <= JANELA_MS)
  recentes.push({ id, tempo: agora, forte: dados.decryptFail === 'hide' })
  historico.set(chaveAutor, recentes)

  const total = recentes.length
  const fortes = recentes.filter(e => e.forte).length
  const modo = config.antiinvisivelModo === 'remover' ? 'remover' : 'alerta'
  const podeRemover = modo === 'remover' && total >= LIMITE_REMOCAO && fortes >= MIN_SINAIS_FORTES && !moderacoes.has(chaveAutor)
  const podeAlertar = total >= LIMITE_ALERTA && !avisos.has(chaveAutor)
  if (!podeAlertar && !podeRemover)
    return { registrado: true, total, fortes }

  // Metadados so sao buscados depois de uma rajada, nunca para cada mensagem.
  let meta
  try {
    meta = await tokito.groupMetadata(grupo)
  } catch {
    return { registrado: true, total, motivo: 'metadados-indisponiveis' }
  }

  const identidadeAutor = [dados.participantAlt, dados.participant].filter(Boolean)
  const membro = localizar(meta, identidadeAutor)
  const alvo = membro ? resolvido(membro, identidadeAutor) : ''
  const proprio = localizar(meta, [tokito.user?.id, tokito.user?.lid])
  const botAdmin = !!proprio && ['admin', 'superadmin'].includes(proprio.admin)
  const donoGrupo = meta.owner || ''
  const donosConfigurados = [
    runtimeSub.config?.()?.ownerNumber,
    runtimeSub.config?.()?.owner
  ].map(base.normalizar).filter(Boolean)

  const protegido = !!membro && (
    membro.admin === 'superadmin' ||
    identidades(membro).some(jid => mesmo(jid, donoGrupo) ||
      donosConfigurados.some(dono => mesmo(dono, jid))) ||
    identidades(membro).some(jid => identidades(proprio).includes(jid))
  )

  const numero = base.numero(alvo || autor) || 'desconhecido'
  let removido = false
  let erroRemocao = ''

  if (podeRemover && alvo && botAdmin && !protegido) {
    moderacoes.set(chaveAutor, agora)
    try {
      if (['admin', 'superadmin'].includes(membro.admin))
        await tokito.groupParticipantsUpdate(grupo, [alvo], 'demote')
      await tokito.groupParticipantsUpdate(grupo, [alvo], 'remove')
      removido = true
      historico.delete(chaveAutor)
    } catch (erro) {
      erroRemocao = String(erro?.message || erro || 'erro de permissao').slice(0, 200)
    }
  }

  if (podeAlertar || removido) {
    avisos.set(chaveAutor, agora)
    const acao = removido
      ? 'Remocao automatica executada (modo remover).'
      : podeRemover && !botAdmin
        ? 'Sem permissao de administrador para aplicar a acao.'
        : 'Ocorrencia registrada; nenhuma punicao por falha isolada.'
    await tokito.sendMessage(grupo, {
      text: `🛡️ *TOKITO — ANTI-INVISÍVEL*

⚠️ Foram observadas ${total} falhas de descriptografia em 15 segundos.
👤 Usuário: @${numero}
🔍 Sinais adicionais: ${fortes}
⚙️ Modo: ${modo}
🛡️ Ação: ${acao}

Uma falha de descriptografia não comprova ataque.`,
      ...(alvo ? { mentions: [alvo] } : {})
    }).catch(() => {})
  }

  if (erroRemocao)
    console.warn('[ANTI-INVISIVEL] Falha ao aplicar moderacao:', erroRemocao)

  return { registrado: true, total, fortes, modo, removido, protegido }
}

const receber = async (tokito, upsert) => {
  if (!Array.isArray(upsert?.messages)) return
  const tipoCiphertext = proto.WebMessageInfo.StubType.CIPHERTEXT

  for (const item of upsert.messages) {
    const chave = item?.key
    if (!chave?.remoteJid?.endsWith('@g.us') || chave.fromMe || !chave.id)
      continue
    if (item?.messageStubType === tipoCiphertext) {
      await registrar(tokito, {
        remoteJid: chave.remoteJid,
        messageId: chave.id,
        participant: chave.participant,
        participantAlt: chave.participantAlt,
        decryptFail: null
      })
      continue
    }

    // Mensagem recuperada com o mesmo ID: descarta a suspeita anterior.
    if (!item?.message) continue
    const id = `${chave.remoteJid}:${chave.id}`
    if (!vistos.has(id)) continue
    vistos.delete(id)
    for (const [autor, eventos] of historico) {
      if (!autor.startsWith(`${chave.remoteJid}|`)) continue
      const recentes = eventos.filter(e => e.id !== chave.id)
      if (recentes.length) historico.set(autor, recentes)
      else historico.delete(autor)
    }
  }
}

const status = grupo => {
  const config = base.config(grupo)
  return {
    ativo: config.antiinvisivel === true,
    modo: config.antiinvisivelModo === 'remover' ? 'remover' : 'alerta',
    janelaMs: JANELA_MS,
    limiteAlerta: LIMITE_ALERTA,
    limiteRemocao: LIMITE_REMOCAO
  }
}

module.exports = {
  registrar, receber, status,
  JANELA_MS, LIMITE_ALERTA, LIMITE_REMOCAO
}
