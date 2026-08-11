const client = require('./client')

const buscar = entrada => client.get('/api/youtube-search', { query: entrada })

module.exports = { buscar }
