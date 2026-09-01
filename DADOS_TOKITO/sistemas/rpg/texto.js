const numero = valor => Number(valor || 0)

const dinheiro = valor => `${numero(valor).toLocaleString('pt-BR')} N-Coins`

const compacto = (_ctx, emoji = '🧊', titulo = 'Tokito RPG', linhas = []) => {
  const conteudo = (Array.isArray(linhas) ? linhas : [])
    .filter(Boolean)
    .map(item => {
      if (typeof item === 'string')
        return `> *『 • 』— ${item}*`

      const icone = item?.emoji || '•'
      const texto = String(item?.texto || '').trim()

      return texto
        ? `> *『 ${icone} 』— ${texto}*`
        : ''
    })
    .filter(Boolean)
    .join('\n')

  return `- ${emoji} \`${String(titulo || 'Tokito RPG').toUpperCase()}\`${conteudo ? `\n\n${conteudo}` : ''}`
}

module.exports = {
  compacto,
  dinheiro
}
