const criar = require('./_acao')

module.exports = criar({
  comandos: ['surubao', 'suruba'],
  img: 'suruba',
  emoji: '🔥',
  caption: ({ numero, autor }) => `@{autor} chamou @{numero} para a brincadeira suruba.`
})
