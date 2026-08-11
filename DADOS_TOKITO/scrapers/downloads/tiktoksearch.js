const client = require('./client')

const buscar = entrada => client.get('/api/tiktok-search', { query: entrada })

module.exports = { buscar }
