const criar = require('./_acao')

module.exports = criar({
  comandos: ['leitada'],
  img: 'leitada',
  emoji: '🥛',
  caption: ({ numero, autor }) => `@{autor} usou a brincadeira leitada em @{numero}.`
})
