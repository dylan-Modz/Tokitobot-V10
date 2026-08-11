const criar = require('./_acao')

module.exports = criar({
  comandos: ['soco', 'socar'],
  img: 'soco',
  emoji: '🥊',
  caption: ({ numero, autor }) => `@{autor} deu um soco de brincadeira em @{numero}.`
})
