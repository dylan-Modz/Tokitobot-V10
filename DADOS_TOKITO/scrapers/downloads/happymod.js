const client = require('./client')

const buscar = entrada => client.get('/api/happymod-search', { q: entrada })

module.exports = { buscar }
