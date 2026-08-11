const criar = require('./_acao')

module.exports = criar({
  comandos: ['lavarlouca', 'lavarpratos', 'lavaprato', 'pratos', 'pia'],
  img: 'lavarlouca',
  emoji: '🧽',
  caption: ({ numero, autor }) => `@{autor} botou @{numero} para lavar a louça.`
})
