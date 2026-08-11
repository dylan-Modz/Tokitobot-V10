const client = require('./client')

const buscar = entrada => client.get('/api/mediafire', { url: entrada })

module.exports = { buscar }
