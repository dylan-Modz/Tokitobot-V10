const criar = require('./_acao')

module.exports = criar({
  comandos: ['boquete', 'bqt', 'oral', 'garganta', 'profunda'],
  img: 'boquete',
  emoji: '😳',
  caption: ({ numero, autor }) => `@{autor} usou a brincadeira em @{numero}.`
})
