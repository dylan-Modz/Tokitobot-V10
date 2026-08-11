const criar = require('./_acao')

module.exports = criar({
  comandos: ['beijo'],
  img: 'beijocmd',
  emoji: '💋',
  caption: ({ numero, autor }) => `@{autor} beijou @{numero} 💖.`
})
