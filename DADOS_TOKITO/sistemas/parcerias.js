/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Sistema de parcerias.
 * Dev: Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const path = require('path')

const pasta = path.join(__dirname, '..', 'database', 'parcerias')
const arquivo = path.join(pasta, 'parcerias.json')

const garantirArquivo = () => {
  if (!fs.existsSync(pasta))
    fs.mkdirSync(pasta, { recursive: true })

  if (!fs.existsSync(arquivo))
    fs.writeFileSync(arquivo, JSON.stringify({ grupos: {} }, null, 2) + '\n')
}

const normalizarUsuario = valor => {
  let texto = String(valor || '').trim()

  if (!texto)
    return ''

  if (texto.endsWith('@c.us'))
    texto = texto.replace('@c.us', '@s.whatsapp.net')

  if (texto.startsWith('@'))
    texto = texto.slice(1)

  if (texto.includes('@')) {
    const [usuarioBruto, servidorBruto] = texto.split('@')
    const usuario = String(usuarioBruto || '').split(':')[0].replace(/\D/g, '')
    const servidor = servidorBruto === 'lid' ? 'lid' : 's.whatsapp.net'

    return usuario ? `${usuario}@${servidor}` : ''
  }

  const numero = texto.replace(/\D/g, '')
  return numero ? `${numero}@s.whatsapp.net` : ''
}

const ler = () => {
  garantirArquivo()

  try {
    const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'))

    if (!dados || typeof dados !== 'object' || Array.isArray(dados))
      return { grupos: {} }

    if (!dados.grupos || typeof dados.grupos !== 'object' || Array.isArray(dados.grupos))
      dados.grupos = {}

    return dados
  }
  catch {
    return { grupos: {} }
  }
}

const salvar = dados => {
  garantirArquivo()

  const tmp = `${arquivo}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(dados, null, 2) + '\n')
  fs.renameSync(tmp, arquivo)
}

const grupoPadrao = () => ({
  ativo: false,
  contador: 0,
  contadorSolicitacao: 0,
  parcerias: [],
  solicitacoes: []
})

const normalizarGrupo = grupo => {
  const base = grupo && typeof grupo === 'object' && !Array.isArray(grupo)
    ? grupo
    : {}

  return {
    ...grupoPadrao(),
    ...base,
    ativo: base.ativo === true,
    contador: Number(base.contador || 0),
    contadorSolicitacao: Number(base.contadorSolicitacao || 0),
    parcerias: Array.isArray(base.parcerias) ? base.parcerias : [],
    solicitacoes: Array.isArray(base.solicitacoes) ? base.solicitacoes : []
  }
}

const obterGrupo = (dados, jid) => {
  const grupo = String(jid || '').trim()

  if (!grupo)
    return null

  dados.grupos[grupo] = normalizarGrupo(dados.grupos[grupo])
  return dados.grupos[grupo]
}

const gerarId = (grupo, tipo) => {
  if (tipo === 'solicitacao') {
    grupo.contadorSolicitacao += 1
    return `S${String(grupo.contadorSolicitacao).padStart(3, '0')}`
  }

  grupo.contador += 1
  return `P${String(grupo.contador).padStart(3, '0')}`
}

const expiraEm = dias => {
  const total = Number(dias || 0)

  if (!Number.isFinite(total) || total <= 0)
    return null

  return new Date(Date.now() + total * 86400000).toISOString()
}

const expirou = parceria => {
  if (!parceria?.expiraEm)
    return false

  const tempo = new Date(parceria.expiraEm).getTime()
  return Number.isFinite(tempo) && tempo <= Date.now()
}

const atualizarExpiradas = (dados, jid) => {
  const grupo = obterGrupo(dados, jid)

  if (!grupo)
    return false

  let mudou = false

  for (const parceria of grupo.parcerias) {
    if (parceria?.status === 'ativo' && expirou(parceria)) {
      parceria.status = 'expirado'
      parceria.bypass = false
      parceria.expiradoEm = new Date().toISOString()
      mudou = true
    }
  }

  return mudou
}

const modoAtivo = jid => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  return grupo?.ativo === true
}

const setModo = (jid, ativo) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)

  if (!grupo)
    return false

  grupo.ativo = ativo === true
  salvar(dados)
  return true
}

const buscarNoGrupo = (grupo, termo) => {
  const consulta = String(termo || '').trim()
  const usuario = normalizarUsuario(consulta)
  const consultaLower = consulta.toLowerCase()

  return grupo.parcerias.find(item => {
    if (!item)
      return false

    if (String(item.id || '').toLowerCase() === consultaLower)
      return true

    if (usuario && normalizarUsuario(item.responsavel) === usuario)
      return true

    return String(item.nome || '').trim().toLowerCase() === consultaLower
  }) || null
}

const buscar = (jid, termo) => {
  const dados = ler()
  const mudou = atualizarExpiradas(dados, jid)
  const grupo = obterGrupo(dados, jid)

  if (mudou)
    salvar(dados)

  if (!grupo)
    return null

  return buscarNoGrupo(grupo, termo)
}

const adicionar = ({
  grupo: jid,
  responsavel,
  nome,
  tipo = 'Parceiro',
  link = '',
  descricao = '',
  nivel = 'Padrão',
  dias = 0,
  bypass = true,
  criadoPor = ''
}) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const jidResponsavel = normalizarUsuario(responsavel)

  if (!grupo || !jidResponsavel)
    return { ok: false, motivo: 'usuario' }

  atualizarExpiradas(dados, jid)

  const existente = grupo.parcerias.find(item =>
    normalizarUsuario(item?.responsavel) === jidResponsavel &&
    ['ativo', 'suspenso'].includes(String(item?.status || ''))
  )

  if (existente)
    return { ok: false, motivo: 'ja', parceria: existente }

  const parceria = {
    id: gerarId(grupo, 'parceria'),
    nome: String(nome || '').trim() || `Parceiro ${grupo.contador}`,
    tipo: String(tipo || '').trim() || 'Parceiro',
    link: String(link || '').trim(),
    descricao: String(descricao || '').trim(),
    responsavel: jidResponsavel,
    nivel: String(nivel || '').trim() || 'Padrão',
    status: 'ativo',
    bypass: bypass !== false,
    criadoEm: new Date().toISOString(),
    criadoPor: normalizarUsuario(criadoPor) || String(criadoPor || '').trim() || null,
    expiraEm: expiraEm(dias),
    divulgacoes: 0,
    ultimaDivulgacao: null
  }

  grupo.parcerias.push(parceria)
  salvar(dados)

  return { ok: true, parceria }
}

const remover = (jid, termo) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)

  if (!grupo)
    return { ok: false, motivo: 'nao' }

  const parceria = buscarNoGrupo(grupo, termo)

  if (!parceria)
    return { ok: false, motivo: 'nao' }

  grupo.parcerias = grupo.parcerias.filter(item => item !== parceria)
  salvar(dados)

  return { ok: true, parceria }
}

const suspender = (jid, termo) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const parceria = grupo ? buscarNoGrupo(grupo, termo) : null

  if (!parceria)
    return { ok: false, motivo: 'nao' }

  if (parceria.status === 'suspenso')
    return { ok: false, motivo: 'ja', parceria }

  parceria.bypassAntesSuspensao = parceria.bypass !== false
  parceria.bypass = false
  parceria.status = 'suspenso'
  parceria.suspensoEm = new Date().toISOString()
  salvar(dados)

  return { ok: true, parceria }
}

const reativar = (jid, termo) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const parceria = grupo ? buscarNoGrupo(grupo, termo) : null

  if (!parceria)
    return { ok: false, motivo: 'nao' }

  parceria.status = 'ativo'
  parceria.bypass = parceria.bypassAntesSuspensao !== false
  parceria.reativadoEm = new Date().toISOString()

  if (expirou(parceria))
    parceria.expiraEm = null

  salvar(dados)

  return { ok: true, parceria }
}

const renovar = (jid, termo, dias) => {
  const totalDias = Number(dias)

  if (!Number.isInteger(totalDias) || totalDias < 0)
    return { ok: false, motivo: 'dias' }

  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const parceria = grupo ? buscarNoGrupo(grupo, termo) : null

  if (!parceria)
    return { ok: false, motivo: 'nao' }

  if (totalDias === 0) {
    parceria.expiraEm = null
  }
  else {
    const atual = parceria.expiraEm ? new Date(parceria.expiraEm).getTime() : 0
    const base = Number.isFinite(atual) && atual > Date.now() ? atual : Date.now()
    parceria.expiraEm = new Date(base + totalDias * 86400000).toISOString()
  }

  parceria.status = 'ativo'
  parceria.bypass = true
  parceria.renovadoEm = new Date().toISOString()
  salvar(dados)

  return { ok: true, parceria, dias: totalDias }
}

const alterarBypass = (jid, termo, ativo) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const parceria = grupo ? buscarNoGrupo(grupo, termo) : null

  if (!parceria)
    return { ok: false, motivo: 'nao' }

  parceria.bypass = ativo === true
  parceria.bypassAlteradoEm = new Date().toISOString()
  salvar(dados)

  return { ok: true, parceria }
}

const listar = (jid, somenteAtivas = true) => {
  const dados = ler()
  const mudou = atualizarExpiradas(dados, jid)
  const grupo = obterGrupo(dados, jid)

  if (mudou)
    salvar(dados)

  if (!grupo)
    return []

  if (!somenteAtivas)
    return [...grupo.parcerias]

  return grupo.parcerias.filter(item => item?.status === 'ativo')
}

const solicitar = ({ grupo: jid, responsavel, nome, tipo, link, descricao }) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const jidResponsavel = normalizarUsuario(responsavel)

  if (!grupo || !jidResponsavel)
    return { ok: false, motivo: 'usuario' }

  const pendente = grupo.solicitacoes.find(item =>
    item?.status === 'pendente' && normalizarUsuario(item?.responsavel) === jidResponsavel
  )

  if (pendente)
    return { ok: false, motivo: 'ja', solicitacao: pendente }

  const ativa = grupo.parcerias.find(item =>
    item?.status === 'ativo' && normalizarUsuario(item?.responsavel) === jidResponsavel
  )

  if (ativa)
    return { ok: false, motivo: 'parceiro', parceria: ativa }

  const solicitacao = {
    id: gerarId(grupo, 'solicitacao'),
    responsavel: jidResponsavel,
    nome: String(nome || '').trim() || 'Sem nome',
    tipo: String(tipo || '').trim() || 'Parceiro',
    link: String(link || '').trim(),
    descricao: String(descricao || '').trim(),
    status: 'pendente',
    criadoEm: new Date().toISOString()
  }

  grupo.solicitacoes.push(solicitacao)
  salvar(dados)

  return { ok: true, solicitacao }
}

const listarSolicitacoes = jid => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)

  if (!grupo)
    return []

  return grupo.solicitacoes.filter(item => item?.status === 'pendente')
}

const buscarSolicitacao = (grupo, id) => {
  const alvo = String(id || '').trim().toLowerCase()

  return grupo.solicitacoes.find(item =>
    String(item?.id || '').trim().toLowerCase() === alvo
  ) || null
}

const aprovarSolicitacao = (jid, id, dias = 0, nivel = 'Padrão', aprovadoPor = '') => {
  const totalDias = Number(dias)

  if (!Number.isInteger(totalDias) || totalDias < 0)
    return { ok: false, motivo: 'dias' }

  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const solicitacao = grupo ? buscarSolicitacao(grupo, id) : null

  if (!solicitacao || solicitacao.status !== 'pendente')
    return { ok: false, motivo: 'nao' }

  const existente = grupo.parcerias.find(item =>
    normalizarUsuario(item?.responsavel) === normalizarUsuario(solicitacao.responsavel) &&
    ['ativo', 'suspenso'].includes(String(item?.status || ''))
  )

  if (existente)
    return { ok: false, motivo: 'ja', parceria: existente }

  const parceria = {
    id: gerarId(grupo, 'parceria'),
    nome: solicitacao.nome,
    tipo: solicitacao.tipo,
    link: solicitacao.link,
    descricao: solicitacao.descricao,
    responsavel: normalizarUsuario(solicitacao.responsavel),
    nivel: String(nivel || '').trim() || 'Padrão',
    status: 'ativo',
    bypass: true,
    criadoEm: new Date().toISOString(),
    criadoPor: normalizarUsuario(aprovadoPor) || String(aprovadoPor || '').trim() || null,
    expiraEm: expiraEm(totalDias),
    divulgacoes: 0,
    ultimaDivulgacao: null,
    origemSolicitacao: solicitacao.id
  }

  solicitacao.status = 'aprovada'
  solicitacao.aprovadaEm = new Date().toISOString()
  solicitacao.parceriaId = parceria.id
  solicitacao.aprovadaPor = normalizarUsuario(aprovadoPor) || String(aprovadoPor || '').trim() || null

  grupo.parcerias.push(parceria)
  salvar(dados)

  return { ok: true, parceria, solicitacao }
}

const recusarSolicitacao = (jid, id, motivo = '', recusadoPor = '') => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const solicitacao = grupo ? buscarSolicitacao(grupo, id) : null

  if (!solicitacao || solicitacao.status !== 'pendente')
    return { ok: false, motivo: 'nao' }

  solicitacao.status = 'recusada'
  solicitacao.motivo = String(motivo || '').trim() || 'Sem motivo informado'
  solicitacao.recusadaEm = new Date().toISOString()
  solicitacao.recusadaPor = normalizarUsuario(recusadoPor) || String(recusadoPor || '').trim() || null
  salvar(dados)

  return { ok: true, solicitacao }
}

const registrarDivulgacao = (jid, termo) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)
  const parceria = grupo ? buscarNoGrupo(grupo, termo) : null

  if (!parceria)
    return { ok: false, motivo: 'nao' }

  parceria.divulgacoes = Number(parceria.divulgacoes || 0) + 1
  parceria.ultimaDivulgacao = new Date().toISOString()
  salvar(dados)

  return { ok: true, parceria }
}

const podeIgnorarAntiLink = (jid, usuario) => {
  const dados = ler()
  const grupo = obterGrupo(dados, jid)

  if (!grupo || grupo.ativo !== true)
    return false

  const mudou = atualizarExpiradas(dados, jid)
  const alvo = normalizarUsuario(usuario)

  if (mudou)
    salvar(dados)

  if (!alvo)
    return false

  return grupo.parcerias.some(item =>
    item?.status === 'ativo' &&
    item?.bypass === true &&
    normalizarUsuario(item?.responsavel) === alvo &&
    !expirou(item)
  )
}

const validadeTexto = parceria => {
  if (!parceria?.expiraEm)
    return 'Permanente'

  const data = new Date(parceria.expiraEm)

  if (Number.isNaN(data.getTime()))
    return 'Permanente'

  return data.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo'
  })
}

module.exports = {
  arquivo,
  normalizarUsuario,
  ler,
  salvar,
  modoAtivo,
  setModo,
  buscar,
  adicionar,
  remover,
  suspender,
  reativar,
  renovar,
  alterarBypass,
  listar,
  solicitar,
  listarSolicitacoes,
  aprovarSolicitacao,
  recusarSolicitacao,
  registrarDivulgacao,
  podeIgnorarAntiLink,
  validadeTexto
}
