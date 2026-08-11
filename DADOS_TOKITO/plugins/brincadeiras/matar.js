const criar = require('./_acao')

module.exports = criar({
  comandos: ['matar', 'mata'],
  img: 'matar',
  emoji: '💀',
  caption: ({ numero, autor }) => `@{autor} acabou de derrotar @{numero} na brincadeira.`
})
