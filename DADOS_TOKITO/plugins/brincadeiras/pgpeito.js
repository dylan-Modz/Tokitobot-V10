const criar = require('./_acao')

module.exports = criar({
  comandos: ['pgpeito', 'peito', 'peitos', 'pegapeito', 'apertarpeito'],
  img: 'pgpeito',
  emoji: '🙈',
  caption: ({ numero, autor }) => `@{autor} brincou com @{numero}.`
})
