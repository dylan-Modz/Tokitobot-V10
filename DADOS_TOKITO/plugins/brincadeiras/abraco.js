const criar = require('./_acao')

module.exports = criar({
  comandos: ['abraco', 'abraço', 'abracar', 'abraçar', 'hug', 'abracinho', 'confortar'],
  img: 'abraco',
  emoji: '🤗',
  caption: ({ numero, autor }) => `@{autor} deu um abraço em @{numero} 💙.`
})
