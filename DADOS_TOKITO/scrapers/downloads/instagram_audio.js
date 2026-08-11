const client = require('./client')

const url = entrada => client.url('/api/insta-video', { url: entrada })

module.exports = { url }
