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
// Monitor complementar integrado neste arquivo, sem criar modulos extras.
const floodPagamento = (() => {
const antiPay = require('../plugins/admin/filtro-antipay.js')
const mess = require('../mensagens/mensagens.js')
const JANELA_MS = 15000
const COOLDOWN_MS = 60000
const ALERTA_PAGAMENTO = 3
const REMOCAO_PAGAMENTO = 6
const ALERTA_CITACAO = 4
const REMOCAO_CITACAO = 8

const vistos = new Map()
const rajadas = new Map()
const avisos = new Map()
const moderacoes = new Map()
const diagnosticos = new Map()
const fontes = new Map()
const normal = value => base.normalizar(value)
const ids = membro => [
  membro?.id, membro?.jid, membro?.lid, membro?.phoneNumber,
  membro?.participant, membro?.participantAlt, membro?.participantPn
].map(normal).filter(Boolean)
const igualdade = (a, b) => {
  const x = normal(a), y = normal(b)
  return !!(x && y && x === y)
}

const atualizarDiagnostico = (grupo, tipo, razao) => {
  const anterior = diagnosticos.get(grupo) || {
    observadas: 0, candidatas: 0, alertas: 0, removidas: 0,
    semAutor: 0, desativadas: 0, foraPadrao: 0, duplicadas: 0,
    ultimaRazao: '-', ultimaRecepcao: 0
  }
  anterior.ultimaRecepcao = Date.now()
  anterior.ultimaRazao = razao || tipo
  if (tipo && Object.prototype.hasOwnProperty.call(anterior, tipo))
    anterior[tipo]++
  diagnosticos.set(grupo, anterior)
}

const diagnostico = grupo => ({
  observadas: 0, candidatas: 0, alertas: 0, removidas: 0,
  semAutor: 0, desativadas: 0, foraPadrao: 0, duplicadas: 0,
  ultimaRazao: 'nenhuma', ultimaRecepcao: 0,
  ...(diagnosticos.get(String(grupo || '')) || {}),
  fontes: fontes.get(String(grupo || '')) || { principal: 0, auxiliar: 0 }
})

const limpar = agora => {
  for (const [id, tempo] of vistos)
    if (agora - tempo > COOLDOWN_MS * 2) vistos.delete(id)
  for (const [id, tempo] of avisos)
    if (agora - tempo > COOLDOWN_MS) avisos.delete(id)
  for (const [id, tempo] of moderacoes)
    if (agora - tempo > COOLDOWN_MS) moderacoes.delete(id)
  for (const [id, eventos] of rajadas) {
    const recentes = eventos.filter(e => agora - e.tempo <= JANELA_MS)
    if (recentes.length) rajadas.set(id, recentes)
    else rajadas.delete(id)
  }
}

const contextoDaMensagem = mensagem => {
  const msg = base.desenrolar(mensagem)
  return msg?.extendedTextMessage?.contextInfo ||
    msg?.imageMessage?.contextInfo ||
    msg?.videoMessage?.contextInfo ||
    msg?.documentMessage?.contextInfo ||
    msg?.buttonsMessage?.contextInfo ||
    msg?.contextInfo || null
}

const assinaturaTexto = texto => String(texto || '')
  .normalize('NFKC')
  .replace(/[\u200b-\u200f\u2060\ufeff]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase()
  .slice(0, 450)

const classificar = mensagem => {
  if (!mensagem || typeof mensagem !== 'object') return null
  const contexto = contextoDaMensagem(mensagem)
  const citada = contexto?.quotedMessage
  const temCitacao = Boolean(citada || contexto?.stanzaId)
  const assinatura = assinaturaTexto(base.texto(mensagem))
  if (!assinatura) return null

  const pagamentoCitado = Boolean(citada && antiPay.detectarDireto(citada))
  const possuiLink = /(?:https?:\/\/|\bwww\.|\bt\.me\/|\bwhatsapp\.com\/)/i.test(assinatura)

  // A prévia de um pagamento citado pode não ser incluída no evento recebido.
  // Nesses casos, uma rajada promocional com link continua sendo analisada.
  const divulgacao = possuiLink && assinatura.length >= 45
  // Responder/selecionar um pagamento com um texto curto nunca configura ataque.
  // Rajadas deste filtro exigem divulgação repetida no texto enviado agora.
  if (!divulgacao) return null

  const tipo = pagamentoCitado ? 'pagamento' : temCitacao ? 'citacao' : 'divulgacao'
  return {
    tipo,
    familia: divulgacao ? 'promocao' : 'pagamento',
    assinatura,
    alerta: pagamentoCitado ? ALERTA_PAGAMENTO : ALERTA_CITACAO,
    remocao: pagamentoCitado ? REMOCAO_PAGAMENTO : REMOCAO_CITACAO
  }
}

const verificar = async (tokito, info, origem = 'principal') => {
  const chave = info?.key
  const grupo = String(chave?.remoteJid || '')
  if (!tokito || !grupo.endsWith('@g.us') || chave?.fromMe)
    return { verificado: false, motivo: 'fora-do-grupo' }

  const origemReal = origem === 'auxiliar' ? 'auxiliar' : 'principal'
  const contagem = fontes.get(grupo) || { principal: 0, auxiliar: 0 }
  contagem[origemReal]++
  fontes.set(grupo, contagem)
  atualizarDiagnostico(grupo, 'observadas', 'mensagem-recebida')
  const msgId = String(chave?.id || '')
  const autor = normal(chave?.participantAlt || chave?.senderAlt ||
    chave?.participant || info?.participant || info?.participantAlt || '')

  if (!msgId || !autor) {
    atualizarDiagnostico(grupo, 'semAutor', 'id-ou-autor-ausente')
    return { verificado: false, motivo: 'id-ou-autor-ausente' }
  }

  const config = base.config(grupo)
  if (config.antiinvisivel !== true && config.antipay !== true) {
    atualizarDiagnostico(grupo, 'desativadas', 'protecao-desativada')
    return { verificado: false, motivo: 'desativado' }
  }

  const tipo = classificar(info.message)
  if (!tipo || (tipo.tipo !== 'pagamento' && config.antiinvisivel !== true)) {
    atualizarDiagnostico(grupo, 'foraPadrao', 'sem-padrao-de-rajada')
    return { verificado: false, motivo: 'fora-do-padrao' }
  }

  atualizarDiagnostico(grupo, 'candidatas', tipo.tipo)
  const agora = Date.now()
  limpar(agora)
  const unica = `${grupo}|${msgId}`
  if (vistos.has(unica)) {
    atualizarDiagnostico(grupo, 'duplicadas', 'id-repetido')
    return { verificado: false, motivo: 'duplicado' }
  }
  vistos.set(unica, agora)

  const chaveAutor = `${grupo}|${autor}`
  // Agrupa pelo texto mesmo que a previsualizacao da citacao desapareca.
  const chaveRajada = `${chaveAutor}|${tipo.familia}|${tipo.assinatura}`
  const ultimos = (rajadas.get(chaveRajada) || [])
    .filter(e => agora - e.tempo <= JANELA_MS)
  ultimos.push({ tempo: agora, id: msgId })
  rajadas.set(chaveRajada, ultimos)

  const total = ultimos.length
  const modo = config.antiinvisivel === true &&
    config.antiinvisivelModo === 'remover' ? 'remover' : 'alerta'
  const limiteAlerta = tipo.familia === 'pagamento'
    ? ALERTA_PAGAMENTO : ALERTA_CITACAO
  const limiteRemocao = tipo.familia === 'pagamento'
    ? REMOCAO_PAGAMENTO : REMOCAO_CITACAO
  const podeAlertar = total >= limiteAlerta && !avisos.has(chaveAutor)
  const podeRemover = modo === 'remover' && total >= limiteRemocao &&
    !moderacoes.has(chaveAutor)
  if (!podeAlertar && !podeRemover)
    return { verificado: true, total, tipo: tipo.tipo }

  let removido = false
  let acao = 'registrado'
  let alvo = autor
  if (podeRemover) {
    moderacoes.set(chaveAutor, agora)
    try {
      const meta = await tokito.groupMetadata(grupo)
      const participantes = meta?.participants || []
      const autorIds = [
        chave?.participantAlt, chave?.senderAlt, chave?.participant,
        info?.participant, info?.participantAlt
      ].map(normal).filter(Boolean)
      const usuario = participantes.find(p => ids(p).some(jid => autorIds.includes(jid)))
      const botIds = [tokito.user?.id, tokito.user?.lid].map(normal).filter(Boolean)
      const bot = participantes.find(p => ids(p).some(jid => botIds.includes(jid)))
      const dono = normal(meta?.owner)
      const donoBot = runtimeSub.config?.() || {}
      const donosBot = [donoBot.ownerNumber, donoBot.owner].map(normal).filter(Boolean)
      const protegido = !usuario || usuario.admin === 'superadmin' ||
        ids(usuario).some(jid => igualdade(jid, dono) || botIds.includes(jid) ||
          donosBot.some(item => igualdade(item, jid)))
      alvo = usuario
        ? ids(usuario).find(jid => jid.endsWith('@s.whatsapp.net')) ||
          ids(usuario).find(jid => jid.endsWith('@lid')) || autor
        : autor
      const botAdmin = !!bot && ['admin', 'superadmin'].includes(bot.admin)
      if (!botAdmin) acao = 'semPermissao'
      else if (protegido) acao = 'protegido'
      else {
        if (usuario.admin === 'admin')
          await tokito.groupParticipantsUpdate(grupo, [alvo], 'demote')
        await tokito.groupParticipantsUpdate(grupo, [alvo], 'remove')
        removido = true
        acao = 'removido'
        rajadas.delete(chaveRajada)
        atualizarDiagnostico(grupo, 'removidas', 'removido')
      }
    } catch (erro) {
      acao = 'falha'
      console.warn('[ANTI-INVISIVEL] Falha na moderacao:', erro?.message || erro)
    }
  }

  if (podeAlertar || removido || acao !== 'registrado') {
    avisos.set(chaveAutor, agora)
    atualizarDiagnostico(grupo, 'alertas', 'alerta-enviado')
    const numero = base.numero(alvo || autor) || 'desconhecido'
    await tokito.sendMessage(grupo, {
      text: mess.antiInvisivelFloodPagamento(numero, total, tipo.tipo, modo, acao),
      mentions: alvo ? [alvo] : []
    }).catch(error => {
      console.warn('[ANTI-INVISIVEL] Aviso nao enviado:', error?.message || error)
    })
  }

  return { verificado: true, total, tipo: tipo.tipo, modo, removido, acao }
}

return { verificar, classificar, diagnostico }
})()

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
    const acao = removido ? 'removido'
      : podeRemover && !botAdmin ? 'semPermissao' : 'registrado'
    await tokito.sendMessage(grupo, {
      text: require('../mensagens/mensagens.js').antiInvisivelOcorrencia(
        numero, total, fortes, modo, acao
      ),
      ...(alvo ? { mentions: [alvo] } : {})
    }).catch(() => {})
  }

  if (erroRemocao)
    console.warn('[ANTI-INVISIVEL] Falha ao aplicar moderacao:', erroRemocao)

  return { registrado: true, total, fortes, modo, removido, protegido }
}

const receber = async (tokito, upsert, origem = 'principal') => {
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

    // Analisa tambem mensagens decifradas que repetem pagamentos citados.
    // O monitor usa a conexao principal e nunca cria mensagens artificiais.
    try {
      await floodPagamento.verificar(tokito, item, origem)
    } catch (erro) {
      console.warn('[ANTI-INVISIVEL FLOOD] Falha no monitoramento:', erro?.message || erro)
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

const diagnostico = grupo => floodPagamento.diagnostico(grupo)

module.exports = {
  registrar, receber, status, diagnostico,
  JANELA_MS, LIMITE_ALERTA, LIMITE_REMOCAO
}
