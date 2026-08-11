const client = require('./client')

const buscar = entrada => client.get('/api/spotify-play', {
  query: entrada,
  q: entrada
})

module.exports = { buscar }
