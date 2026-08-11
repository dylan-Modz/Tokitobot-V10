const criar = require('./_acao')

module.exports = criar({
  comandos: ['carinho', 'cafune', 'cafuné', 'afago', 'mimo', 'chamego', 'acariciar'],
  img: 'carinho',
  emoji: '🥰',
  caption: ({ numero, autor }) => `@{autor} fez carinho em @{numero}.`
})
