const client = require('./client')

const buscar = entrada => client.get('/api/aptoide', { query: entrada })

module.exports = { buscar }
