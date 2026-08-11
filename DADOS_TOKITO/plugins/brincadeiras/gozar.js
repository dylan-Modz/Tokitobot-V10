const criar = require('./_acao')

module.exports = criar({
  comandos: ['gozar', 'goza'],
  img: 'Gozar',
  emoji: '😈',
  caption: ({ numero, autor }) => `@{autor} usou a brincadeira gozar em @{numero}.`
})
