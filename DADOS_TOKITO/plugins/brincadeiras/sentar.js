const criar = require('./_acao')

module.exports = criar({
  comandos: ['sentar', 'sentada', 'senta', 'sentadinha', 'lapada'],
  img: 'sentar',
  emoji: '😳',
  caption: ({ numero, autor }) => `@{autor} usou sentar em @{numero}.`
})
