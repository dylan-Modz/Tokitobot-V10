const client = require('./client')

const url = entrada => client.url('/api/tiktok-video', { url: entrada })

module.exports = { url }
