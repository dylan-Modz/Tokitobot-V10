/*
 * TOKITO BOT V10 - verificação silenciosa de dependências
 * Author: Dylan Modz
 */

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const raiz = path.resolve(__dirname, '..', '..', '..')
const packageFile = path.join(raiz, 'package.json')

const lerPackage = () => {
  try {
    return JSON.parse(
      fs.readFileSync(packageFile, 'utf8')
    )
  } catch {
    return {
      dependencies: {}
    }
  }
}

const armazenamentoCompartilhadoAndroid = () => {
  const cwd = raiz.replace(/\\/g, '/')

  return (
    cwd === '/sdcard' ||
    cwd.startsWith('/sdcard/') ||
    cwd === '/storage/emulated/0' ||
    cwd.startsWith('/storage/emulated/0/')
  )
}

const faltando = () => {
  const pkg = lerPackage()

  const deps = Object.keys(
    pkg.dependencies || {}
  )

  return deps.filter((nome) => {
    try {
      require.resolve(
        nome,
        {
          paths: [raiz]
        }
      )

      return false
    } catch {
      return true
    }
  })
}

const instalar = (opcoes = {}) => {
  const force = opcoes.force === true

  const ausentes = faltando()

  if (!ausentes.length && !force) {
    return {
      ok: true,
      installed: false,
      missing: []
    }
  }

  if (ausentes.length) {
    console.log(
      `\x1b[43;30;1m AVISO - TOKITO \x1b[0m - Módulos ausentes: ${ausentes.join(', ')}`
    )
  }

  console.log(
    '\x1b[41;97;1m INFO - TOKITO \x1b[0m - Instalando as dependências necessárias...'
  )

  const comando =
    process.platform === 'win32'
      ? 'npm.cmd'
      : 'npm'

  const argumentos = [
    'install',
    '--allow-git=root',
    '--no-audit',
    '--no-fund',
    ...(armazenamentoCompartilhadoAndroid()
      ? ['--no-bin-links']
      : [])
  ]

  const run = spawnSync(
    comando,
    argumentos,
    {
      cwd: raiz,

      stdio: 'inherit',

      env: {
        ...process.env,
        npm_config_allow_git: 'root'
      }
    }
  )

  if (run.status !== 0) {
    return {
      ok: false,
      installed: false,
      missing: ausentes
    }
  }

  const restantes = faltando()

  return {
    ok: restantes.length === 0,
    installed: true,
    missing: restantes
  }
}

if (require.main === module) {
  const deveInstalar =
    process.argv.includes('--install')

  const force =
    process.argv.includes('--force')

  const ausentes = faltando()

  if (!ausentes.length && !force) {
    process.exit(0)
  }

  if (!deveInstalar) {
    console.log(
      ausentes.join('\n')
    )

    process.exit(10)
  }

  const resultado = instalar({
    force
  })

  if (!resultado.ok) {
    console.error(
      `\x1b[41;97;1m ERRO - TOKITO \x1b[0m - Ainda faltam módulos: ${resultado.missing.join(', ')}`
    )

    process.exit(1)
  }

  process.exit(0)
}

module.exports = {
  faltando,
  instalar
}