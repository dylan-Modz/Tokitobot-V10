/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Sistema de manutenção de comandos.
 * Dev: Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const path = require('path')

const arquivo = path.join(__dirname, '..', 'INFO_DADOS', 'manutencao.json')

const garantir = () => {
  const pasta = path.dirname(arquivo)

  if (!fs.existsSync(pasta))
    fs.mkdirSync(pasta, { recursive: true })

  if (!fs.existsSync(arquivo))
    fs.writeFileSync(arquivo, JSON.stringify({ comandos: {} }, null, 2) + '\n')
}

const normalizar = valor => String(valor || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ç/g, 'c')

const ler = () => {
  garantir()

  try {
    const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'))

    if (!dados || typeof dados !== 'object' || Array.isArray(dados))
      return { comandos: {} }

    if (!dados.comandos || typeof dados.comandos !== 'object' || Array.isArray(dados.comandos))
      dados.comandos = {}

    return dados
  }
  catch {
    return { comandos: {} }
  }
}

const salvar = dados => {
  garantir()

  const tmp = `${arquivo}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(dados, null, 2) + '\n')
  fs.renameSync(tmp, arquivo)
}

const adicionar = (comando, motivo = '') => {
  const nome = normalizar(comando)

  if (!nome)
    return { ok: false, motivo: 'vazio', nome }

  const dados = ler()

  if (dados.comandos[nome])
    return { ok: false, motivo: 'ja', nome, dados: dados.comandos[nome] }

  dados.comandos[nome] = {
    motivo: String(motivo || '').trim(),
    adicionadoEm: new Date().toISOString()
  }

  salvar(dados)

  return { ok: true, nome, dados: dados.comandos[nome] }
}

const remover = comando => {
  const nome = normalizar(comando)
  const dados = ler()

  if (!nome || !dados.comandos[nome])
    return { ok: false, motivo: 'nao', nome }

  const removido = dados.comandos[nome]
  delete dados.comandos[nome]
  salvar(dados)

  return { ok: true, nome, dados: removido }
}

const obter = comando => {
  const nome = normalizar(comando)
  const dados = ler()

  if (!nome || !dados.comandos[nome])
    return null

  return {
    nome,
    ...dados.comandos[nome]
  }
}

const ativo = comando => Boolean(obter(comando))

const listar = () => {
  const dados = ler()

  return Object.entries(dados.comandos)
    .map(([nome, info]) => ({
      nome,
      motivo: String(info?.motivo || '').trim(),
      adicionadoEm: info?.adicionadoEm || null
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

module.exports = {
  arquivo,
  normalizar,
  ler,
  salvar,
  adicionar,
  remover,
  obter,
  ativo,
  listar
}
