/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

function texto(valor, fallback = 'Não informado') {
  const saida = String(valor ?? '').trim()
  return saida || fallback
}

function limitar(valor, limite = 900) {
  const saida = texto(valor, '')

  if (saida.length <= limite) {
    return saida
  }

  return `${saida.slice(0, Math.max(0, limite - 3)).trim()}...`
}

function numero(valor) {
  const n = Number(valor)

  if (!Number.isFinite(n)) {
    return texto(valor, '0')
  }

  return n.toLocaleString('pt-BR')
}

function urlValida(valor) {
  try {
    const url = new URL(String(valor || '').trim())
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function pedacos(valor, tamanho = 3500) {
  const textoCompleto = String(valor || '')
  const partes = []
  let restante = textoCompleto

  while (restante.length > tamanho) {
    let corte = restante.lastIndexOf('\n', tamanho)

    if (corte < Math.floor(tamanho * 0.55)) {
      corte = tamanho
    }

    partes.push(restante.slice(0, corte))
    restante = restante.slice(corte).replace(/^\n+/, '')
  }

  if (restante) {
    partes.push(restante)
  }

  return partes
}

module.exports = {
  texto,
  limitar,
  numero,
  urlValida,
  pedacos
}
