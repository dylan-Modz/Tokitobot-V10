const fs = require('fs')

const limpar = texto => {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const distancia = (a, b) => {
  a = limpar(a)
  b = limpar(b)
  if (!a.length)
    return b.length
  if (!b.length)
    return a.length
  if (a.length > b.length) {
    const troca = a
    a = b
    b = troca
  }
  const linha = Array.from({ length: a.length + 1 }, (_, i) => i)
  for (let i = 1; i <= b.length; i++) {
    let anterior = linha[0]
    linha[0] = i
    for (let j = 1; j <= a.length; j++) {
      const atual = linha[j]
      if (b[i - 1] === a[j - 1]) {
        linha[j] = anterior
      }
      else {
        linha[j] = Math.min(anterior, linha[j], linha[j - 1]) + 1
      }
      anterior = atual
    }
  }
  return linha[a.length]
}

const casos = arquivo => {
  try {
    const codigo = fs.readFileSync(arquivo, 'utf8')
    const regex = /case\s+(['"`])([^'"`]+)\1\s*:/g
    const vistos = new Set()
    const lista = []
    let item
    while ((item = regex.exec(codigo)) !== null) {
      const nome = String(item[2] || '').trim()
      const chave = limpar(nome)
      if (!chave || vistos.has(chave))
        continue
      vistos.add(chave)
      lista.push({
        nome,
        chave
      })
    }
    return lista
  }
  catch (error) {
    console.log('[SIMILAR]', error?.message || error)
    return []
  }
}

const similar = (lista = [], texto = '', minimo = 35) => {
  const busca = limpar(texto)
  if (!busca || !Array.isArray(lista) || !lista.length) {
    return {
      nome: '',
      porcentagem: 0
    }
  }
  let nome = ''
  let porcentagem = 0
  for (const item of lista) {
    const nomeItem = typeof item === 'string' ? item : item?.nome
    const chave = typeof item === 'string' ? limpar(item) : item?.chave || limpar(item?.nome)
    if (!chave)
      continue
    if (busca === chave) {
      return {
        nome: nomeItem,
        porcentagem: 100
      }
    }
    const tamanho = Math.max(busca.length, chave.length)
    const valor = (1 - distancia(busca, chave) / tamanho) * 100
    if (valor > porcentagem) {
      nome = nomeItem
      porcentagem = valor
    }
  }
  if (!nome || porcentagem < minimo) {
    return {
      nome: '',
      porcentagem: 0
    }
  }
  return {
    nome,
    porcentagem: Number(porcentagem.toFixed(1))
  }
}

similar.casos = casos

module.exports = similar
