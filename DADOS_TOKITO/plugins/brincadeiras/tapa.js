const criar = require('./_acao')

module.exports = criar({
  comandos: ['tapa'],
  img: 'tapacmd',
  emoji: '👋',
  caption: ({ numero, autor }) => `@{autor} deu um tapa em @{numero}.`
})
