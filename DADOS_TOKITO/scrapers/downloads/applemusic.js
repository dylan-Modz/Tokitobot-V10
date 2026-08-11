const client = require('./client')

const buscar = entrada => client.get('/api/applemusic-play', { text: entrada })

module.exports = { buscar }
