const criar = require('./_acao')

module.exports = criar({
  comandos: ['capinarlote', 'capinar', 'lote', 'rocado', 'quintal'],
  img: 'capinarlote',
  emoji: '🌿',
  caption: ({ numero, autor }) => `@{autor} botou @{numero} para capinar um lote.`
})
