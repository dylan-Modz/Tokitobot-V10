const client = require('./client')

const buscar = entrada => client.get('/api/soundcloud', {
  q: entrada,
  query: entrada
})

module.exports = { buscar }
