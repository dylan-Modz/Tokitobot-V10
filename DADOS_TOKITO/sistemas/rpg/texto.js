const numero = valor => Number(valor || 0)

const dinheiro = valor => `${numero(valor).toLocaleString('pt-BR')} N-Coins`

const tempo = segundos => {
  const total = Math.max(0, Math.ceil(Number(segundos || 0)))
  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total % 3600) / 60)
  const resto = total % 60

  return [
    horas ? `${horas}h` : '',
    minutos ? `${minutos}m` : '',
    resto || (!horas && !minutos) ? `${resto}s` : ''
  ].filter(Boolean).join(' ')
}

const fonteTitulo = texto => {
  const mapa = {
    A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶',
    H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼', N: '𝙽',
    O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄',
    V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
    0: '𝟶', 1: '𝟷', 2: '𝟸', 3: '𝟹', 4: '𝟺',
    5: '𝟻', 6: '𝟼', 7: '𝟽', 8: '𝟾', 9: '𝟿'
  }

  return String(texto || 'Tokito RPG')
    .toUpperCase()
    .normalize('NFD')
    .split('')
    .map(letra => mapa[letra] || letra)
    .join('')
    .normalize('NFC')
}

const compacto = (_ctx, emoji = '🧊', titulo = 'Tokito RPG', linhas = []) => {
  const lista = (Array.isArray(linhas) ? linhas : []).filter(Boolean)
  const conteudo = lista.map((item, indice) => {
    const texto = typeof item === 'string'
      ? String(item).trim()
      : String(item?.texto || '').trim()

    const icone = typeof item === 'string' ? '' : String(item?.emoji || '').trim()

    if (!texto)
      return ''

    const partes = texto.split(':')
    if (partes.length > 1) {
      const nome = partes.shift().trim()
      const valor = partes.join(':').trim()
      return `- ${nome} — ( \`${valor}${icone ? ` ${icone}` : ''}\` )`
    }

    return indice === 0
      ? `> ${texto}${icone ? ` ${icone}` : ''}`
      : `> ${icone ? `${icone} ` : ''}${texto}`
  }).filter(Boolean).join('\n')

  return `• \`${fonteTitulo(titulo)}\` ${emoji}${conteudo ? `\n${conteudo}` : ''}`
}

const enviarComImagem = async (ctx, imagem, legenda, mencoes = []) => {
  const url = String(imagem || '').trim()
  const listaMencoes = (Array.isArray(mencoes) ? mencoes : [mencoes]).filter(Boolean)
  const contextInfo = typeof ctx.canalInfo === 'function'
    ? ctx.canalInfo(listaMencoes)
    : { mentionedJid: listaMencoes }

  if (!url)
    return ctx.reply(legenda, listaMencoes)

  try {
    return await ctx.tokito.sendMessage(ctx.from, {
      image: { url },
      caption: legenda,
      mentions: listaMencoes,
      contextInfo
    }, { quoted: ctx.selo })
  }
  catch {
    return ctx.reply(legenda, listaMencoes)
  }
}

module.exports = {
  compacto,
  dinheiro,
  tempo,
  enviarComImagem
}
