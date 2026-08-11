const criar = require('./_acao')

module.exports = criar({
  comandos: ['comer', 'nhac', 'devorar', 'jantou', 'amassar'],
  img: 'comer',
  emoji: '🍽️',
  caption: ({ numero, autor }) => `@{autor} acabou de comer @{numero}.`
})
