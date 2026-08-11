const client = require('./client')

const buscar = entrada => client.get('/api/gitclone', { url: entrada })

module.exports = { buscar }
