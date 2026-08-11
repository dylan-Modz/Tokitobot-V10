const client = require('./client')

const url = entrada => client.url('/api/facebook', { url: entrada })

module.exports = { url }
