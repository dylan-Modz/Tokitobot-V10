const criar = require('./_acao')

module.exports = criar({
  comandos: ['chute', 'chutar'],
  img: 'chutecmd',
  emoji: '🦵',
  caption: ({ numero, autor }) => `@{autor} deu um chute de brincadeira em @{numero}.`
})
