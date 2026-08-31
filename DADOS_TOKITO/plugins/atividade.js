const dados = valor => {
  const d = valor && typeof valor === 'object' ? valor : {}

  const resultado = {
    comandos: Number(d.comandos || 0),
    audios: Number(d.audios || 0),
    figurinhas: Number(d.figurinhas ?? d.figus ?? 0),
    documentos: Number(d.documentos || 0),
    fotos: Number(d.fotos ?? d.imagens ?? 0),
    videos: Number(d.videos || 0)
  }

  resultado.pontos =
    resultado.comandos +
    resultado.audios +
    resultado.figurinhas +
    resultado.documentos +
    resultado.fotos +
    resultado.videos

  return resultado
}

const paginar = (lista, tamanho = 8) => {
  const itens = Array.isArray(lista) ? lista : []
  const limite = Math.max(1, Number(tamanho) || 8)
  const paginas = []

  for (let i = 0; i < itens.length; i += limite)
    paginas.push(itens.slice(i, i + limite))

  return paginas.length ? paginas : [[]]
}

module.exports = {
  dados,
  paginar
}
