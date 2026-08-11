const criar = require('./_acao')

module.exports = criar({
  comandos: ['cagar', 'cagao', 'banheiro', 'tronco', 'privada'],
  img: 'cagar',
  emoji: '🚽',
  caption: ({ numero, autor }) => `@{autor} mandou @{numero} para o banheiro 😂.`
})
