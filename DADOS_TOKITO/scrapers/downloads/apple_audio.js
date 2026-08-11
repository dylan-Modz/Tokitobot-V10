const client = require('./client')

const url = entrada => client.url('/api/applemusic-audio', { url: entrada })

module.exports = { url }
