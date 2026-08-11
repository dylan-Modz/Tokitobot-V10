const client = require('./client')

const url = entrada => client.url('/api/soundcloud-audio', { url: entrada })

module.exports = { url }
