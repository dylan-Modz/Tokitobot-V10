const client = require('./client')

const buscar = entrada => client.get('/api/deezer-play', {
  q: entrada,
  query: entrada
})

module.exports = { buscar }
