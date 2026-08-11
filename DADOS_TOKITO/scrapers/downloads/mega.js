const client = require('./client')

const buscar = entrada => client.get('/api/mega', { url: entrada })

module.exports = { buscar }
