const client = require('./client')

const url = entrada => client.url('/api/downloads/spotify-mp3', { url: entrada })

module.exports = { url }
