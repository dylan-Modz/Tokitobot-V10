const client = require('./client')

const buscar = entrada => client.get('/api/pinterest-search', { text: entrada })

module.exports = { buscar }
