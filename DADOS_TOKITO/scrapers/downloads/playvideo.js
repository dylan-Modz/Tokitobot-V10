const client = require('./client')

const url = entrada => client.url('/api/youtube-video', { q: entrada })

module.exports = { url }
