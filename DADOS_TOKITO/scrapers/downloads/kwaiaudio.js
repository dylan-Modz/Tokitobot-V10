const client = require('./client')

const url = entrada => client.url('/api/kwai-audio', { url: entrada })

module.exports = { url }
