const criar = require('./_acao')

module.exports = criar({
  comandos: ['pgbunda', 'bunda', 'pegabunda', 'raba', 'bumbum'],
  img: 'pgbunda',
  emoji: '🍑',
  caption: ({ numero, autor }) => `@{autor} brincou com @{numero}.`
})
