const client = require('./client')

const buscar = entrada => client.get('/api/playstore', { query: entrada })

module.exports = { buscar }
