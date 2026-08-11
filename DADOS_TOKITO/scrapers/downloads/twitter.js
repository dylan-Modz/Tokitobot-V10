const client = require('./client')

const url = entrada => client.url('/api/twitter-video', { url: entrada })

module.exports = { url }
