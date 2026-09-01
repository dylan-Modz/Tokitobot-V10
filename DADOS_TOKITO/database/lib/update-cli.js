/*
 * ============================================================
 *          TOKITO BOT V10 - ATUALIZAÇÃO PELO TERMINAL
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const colors = require('colors')
const dados = require('../../sistemas/dados')

const ocultarSegredos = texto => {
  return String(texto || '')
    .replace(
      /\btokito_[A-Za-z0-9._-]+/gi,
      'tokito_********'
    )
    .replace(
      /(authorization\s*[:=]\s*(?:bearer\s+)?)[^\s]+/gi,
      '$1********'
    )
}

const info = texto =>
  console.log(
    colors.bgRed.white.bold(' INFO - TOKITO ') +
    colors.white(` - ${texto}`)
  )

const sucesso = texto =>
  console.log(
    colors.bgGreen.black.bold(' OK - TOKITO ') +
    colors.white(` - ${texto}`)
  )

const aviso = texto =>
  console.log(
    colors.bgYellow.black.bold(' AVISO - TOKITO ') +
    colors.white(` - ${texto}`)
  )

const erro = texto =>
  console.log(
    colors.bgRed.white.bold(' ERRO - TOKITO ') +
    colors.white(` - ${ocultarSegredos(texto)}`)
  )

async function main() {
  const auto = process.argv.includes('--auto')

  try {
    info('Verificando atualizações disponíveis...')

    const check = await dados.verificarUpdate()

    if (!check?.ok) {
      erro(
        check?.error ||
        'Não foi possível verificar atualizações.'
      )

      process.exitCode = 1
      return
    }

    const versaoAtual =
      check.local?.version ||
      'desconhecida'

    const novaVersao =
      check.remote?.version ||
      versaoAtual

    if (!check.available) {
      sucesso(
        `Tokito Bot V10 já está atualizado na versão ${versaoAtual}.`
      )

      process.exitCode = 0
      return
    }

    info(
      `Nova atualização disponível: ${versaoAtual} → ${novaVersao}.`
    )

    aviso(
      'Não desligue o bot durante a atualização.'
    )

    info(
      'Preparando instalação da nova versão...'
    )

    const resultado = await dados.instalarUpdate(
      texto => {
        const mensagem =
          String(texto || '').trim()

        if (!mensagem) {
          return
        }

        const menor =
          mensagem.toLowerCase()

        if (
          menor.includes('backup')
        ) {
          aviso(mensagem)
          return
        }

        if (
          menor.includes('depend') ||
          menor.includes('módulo') ||
          menor.includes('modulo')
        ) {
          aviso(mensagem)
          return
        }

        info(mensagem)
      }
    )

    if (!resultado?.updated) {
      sucesso(
        `Nenhuma atualização pendente. Versão atual: ${
          resultado?.version ||
          versaoAtual
        }.`
      )

      process.exitCode = 0
      return
    }

    const anterior =
      resultado.from ||
      versaoAtual

    const nova =
      resultado.version ||
      novaVersao

    const arquivos =
      Number(
        resultado.filesUpdated ||
        0
      )

    const removidos =
      Number(
        resultado.filesDeleted ||
        0
      )

    sucesso(
      `Atualização concluída: ${anterior} → ${nova}.`
    )

    sucesso(
      `${arquivos} arquivo(s) atualizado(s).`
    )

    if (removidos > 0) {
      sucesso(
        `${removidos} arquivo(s) removido(s).`
      )
    }

    info(
      'Atualização instalada com sucesso.'
    )

    aviso(
      'Reiniciando a Tokito com a nova versão...'
    )

    if (auto) {
      process.exitCode = 20
      return
    }

    process.exitCode = 0
  }
  catch (error) {
    erro(
      error?.message ||
      String(error)
    )

    aviso(
      'A atualização não foi concluída.'
    )

    aviso(
      'Os dados protegidos da Tokito foram preservados.'
    )

    process.exitCode = 1
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  main
}