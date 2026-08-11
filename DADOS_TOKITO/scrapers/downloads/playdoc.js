const client = require('./client')

const buscar = entrada => client.get('/api/youtube-search', { query: entrada })

const url = entrada => client.url('/api/youtube-doc', { q: entrada })

module.exports = {
  buscar,
  url
}
