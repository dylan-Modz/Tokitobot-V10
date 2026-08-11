const client = require('./client')

const url = entrada => client.url('/api/pinterest-video', { url: entrada })

module.exports = { url }
