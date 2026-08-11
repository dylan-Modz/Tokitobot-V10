const client = require('./client')

const url = entrada => client.url('/api/kwai-video', { url: entrada })

module.exports = { url }
