/*
 * TOKITO BOT V10 - pós-instalação
 * Author: Dylan Modz
 */

const deps = require('./deps')

const ausentes = deps.faltando()

if (ausentes.length) {
  console.error(`\x1b[41;97;1m ERRO - TOKITO \x1b[0m - Módulos ausentes após a instalação: ${ausentes.join(', ')}`)
  process.exitCode = 1
}
