/*
 * ============================================================
 *            TOKITO BOT V10 - SUPERVISOR INTERNO
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const { spawn, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..', '..')
const CONNECT = path.join(ROOT, 'DADOS_TOKITO', 'connect.js')
const DEPS = path.join(ROOT, 'DADOS_TOKITO', 'database', 'lib', 'deps.js')
const UPDATE = path.join(ROOT, 'DADOS_TOKITO', 'database', 'lib', 'update-cli.js')

const MAX_CRASHES = 3
const CRASH_WINDOW_MS = 60 * 1000
const RESTART_DELAY_MS = 3000

let child = null
let stopping = false
const crashes = []

const info = texto => console.log(`\x1b[41;97;1m INFO - TOKITO \x1b[0m - ${texto}`)
const aviso = texto => console.log(`\x1b[43;30;1m AVISO - TOKITO \x1b[0m - ${texto}`)
const erro = texto => console.log(`\x1b[41;97;1m ERRO - TOKITO \x1b[0m - ${texto}`)

const executarNode = (arquivo, args = [], options = {}) => {
  return spawnSync(
    process.execPath,
    [arquivo, ...args],
    {
      cwd: ROOT,
      stdio: options.stdio || 'inherit',
      encoding: options.encoding || undefined,
      env: process.env
    }
  )
}

const garantirDependencias = () => {
  if (!fs.existsSync(DEPS)) {
    throw new Error('Verificador de dependências não encontrado.')
  }

  if (!fs.existsSync(path.join(ROOT, 'node_modules'))) {
    aviso('As dependências da Tokito ainda não estão instaladas.')

    const instalar = executarNode(DEPS, ['--install'])

    if (instalar.status !== 0) {
      throw new Error('Não foi possível instalar as dependências da Tokito.')
    }

    return true
  }

  const check = executarNode(DEPS, [], {
    stdio: 'pipe',
    encoding: 'utf8'
  })

  if (check.status === 0) {
    return false
  }

  if (check.status !== 10) {
    const detalhe = String(check.stderr || check.stdout || '').trim()
    throw new Error(detalhe || 'Falha ao verificar as dependências.')
  }

  aviso('Foram encontrados módulos ausentes na instalação.')

  const ausentes = String(check.stdout || '').trim()
  if (ausentes) {
    console.log(ausentes)
  }

  const instalar = executarNode(DEPS, ['--install'])

  if (instalar.status !== 0) {
    throw new Error('Não foi possível instalar as dependências ausentes.')
  }

  return true
}

const atualizar = () => {
  if (!fs.existsSync(UPDATE)) {
    throw new Error('Atualizador da Tokito não encontrado.')
  }

  const resultado = executarNode(UPDATE, ['--auto'])

  if (resultado.status !== 0 && resultado.status !== 20) {
    throw new Error(`Atualização encerrada com código ${resultado.status ?? 'desconhecido'}.`)
  }

  if (resultado.status === 20) {
    // O update pode ter alterado package.json/deps.js.
    // Revalida tudo antes de subir a conexão nova.
    garantirDependencias()
    return true
  }

  return false
}

const limparCrashesAntigos = () => {
  const limite = Date.now() - CRASH_WINDOW_MS

  while (crashes.length && crashes[0] < limite) {
    crashes.shift()
  }
}

const registrarCrash = () => {
  limparCrashesAntigos()
  crashes.push(Date.now())
  return crashes.length
}

const esperar = ms => new Promise(resolve => setTimeout(resolve, ms))

const iniciarConexao = args => {
  return new Promise(resolve => {
    child = spawn(
      process.execPath,
      [CONNECT, ...args],
      {
        cwd: ROOT,
        stdio: 'inherit',
        env: process.env
      }
    )

    child.once('error', error => {
      child = null
      resolve({ code: null, error })
    })

    child.once('exit', (code, signal) => {
      child = null
      resolve({ code, signal })
    })
  })
}

const encerrar = signal => {
  if (stopping) return
  stopping = true

  if (child && !child.killed) {
    child.kill(signal)
  }
}

process.once('SIGINT', () => encerrar('SIGINT'))
process.once('SIGTERM', () => encerrar('SIGTERM'))

async function supervisionar(args = []) {
  while (!stopping) {
    const resultado = await iniciarConexao(args)

    if (stopping) {
      return 0
    }

    if (resultado.error) {
      erro(`Não foi possível iniciar a Tokito: ${resultado.error.message}`)
    }

    const code = Number.isInteger(resultado.code) ? resultado.code : 1

    if ([0, 130, 143].includes(code)) {
      return code
    }

    if (code === 23) {
      aviso('A Tokito Base já está rodando em outra instância.')
      return 1
    }

    if (code === 24) {
      aviso('Não foi possível validar uma licença ativa.')
      return 1
    }

    if (code === 20) {
      aviso('Reinício solicitado pela Tokito. Iniciando novamente...')
      continue
    }

    const total = registrarCrash()

    if (total >= MAX_CRASHES) {
      erro(`A Tokito caiu ${total} vezes em menos de 1 minuto. Reinício automático pausado para evitar loop.`)
      return code || 1
    }

    aviso(`Tokito-Md encerrou com código ${code}. Reiniciando em ${RESTART_DELAY_MS / 1000} segundos...`)
    await esperar(RESTART_DELAY_MS)
  }

  return 0
}

async function main(args = []) {
  const entrada = Array.isArray(args) ? args.map(v => String(v)) : []
  const querUpdate = entrada.some(v => ['up', 'update'].includes(v.toLowerCase()))
  const argsConnect = entrada.filter(v => !['up', 'update'].includes(v.toLowerCase()))

  garantirDependencias()

  if (querUpdate) {
    atualizar()
  }

  const code = await supervisionar(argsConnect)
  process.exitCode = code
}

module.exports = {
  main,
  garantirDependencias,
  atualizar,
  supervisionar
}
