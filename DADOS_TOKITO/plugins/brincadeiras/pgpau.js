const criar = require('./_acao')

module.exports = criar({
  comandos: ['pgpau', 'pegapau', 'pau', 'piupiu', 'madeira'],
  img: 'pgpau',
  emoji: '🙈',
  caption: ({ numero, autor }) => `@{autor} brincou com @{numero}.`
})
