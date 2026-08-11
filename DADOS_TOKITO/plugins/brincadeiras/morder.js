const criar = require('./_acao')

module.exports = criar({
  comandos: ['morder', 'mordida', 'dentada', 'morde', 'abocanhar'],
  img: 'morder',
  emoji: '🦷',
  caption: ({ numero, autor }) => `@{autor} deu uma mordida em @{numero}.`
})
