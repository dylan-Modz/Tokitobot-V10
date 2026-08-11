const criar = require('./_acao')

module.exports = criar({
  comandos: ['tirarft', 'tirarfoto', 'foto', 'fotografar', 'clique', 'selfie'],
  img: 'tirarft',
  emoji: '📸',
  caption: ({ numero, autor }) => `@{autor} tirou uma foto de @{numero}.`
})
