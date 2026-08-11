const client = require('./client')

const buscar = entrada => client.get('/api/capcut-download', { url: entrada })

module.exports = { buscar }
