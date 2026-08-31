/*
 * TOKITO BOT V10 - ponte automática para versões antigas
 * Author: Dylan Modz
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..', '..')
const INFO = path.join(ROOT, 'DADOS_TOKITO', 'INFO_DADOS')
const UPDATE_FILE = path.join(INFO, 'update.json')
const STRUCTURE_FILE = path.join(INFO, 'update-structure.json')

const lerJson = (arquivo, fallback = {}) => {
  try {
    const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
    return dados && typeof dados === 'object' ? dados : fallback
  } catch {
    return fallback
  }
}

const pendente = () => {
  const update = lerJson(UPDATE_FILE, {})
  const migration = update?.migration || {}

  if (migration.required !== true || !migration.id) {
    return false
  }

  const estrutura = lerJson(STRUCTURE_FILE, {})

  return String(estrutura.id || '').trim() !==
    String(migration.id || '').trim()
}

async function main() {
  if (!pendente()) {
    process.exitCode = 0
    return
  }

  const dados = require('../../sistemas/dados')

  console.log(
    '\x1b[43;30;1m AVISO - TOKITO \x1b[0m - Estrutura antiga detectada. Preparando migração segura...'
  )

  try {
    const resultado = await dados.instalarUpdate(
      texto => console.log(`\x1b[41;97;1m UPDATE - TOKITO \x1b[0m - ${texto}`),
      {
        forceClean: true
      }
    )

    if (resultado?.updated) {
      console.log(
        '\x1b[42;30;1m OK - TOKITO \x1b[0m - Estrutura migrada para o atualizador novo.'
      )

      process.exitCode = 20
      return
    }

    process.exitCode = 0
  } catch (error) {
    console.error(
      `\x1b[41;97;1m ERRO - TOKITO \x1b[0m - Falha na migração: ${error?.message || error}`
    )

    process.exitCode = 1
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  pendente,
  main
}
