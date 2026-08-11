const client = require('./client')

const buscar = entrada => client.get('/api/youtube-play', {
  query: entrada,
  q: entrada
})

module.exports = { buscar }
