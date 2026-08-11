const client = require('./client')

const url = (entrada, index = 0) => client.url('/api/tiktok-foto', {
  url: entrada,
  index
})

async function fotos(entrada) {
  const resposta = await client.axios.get(url(entrada, 0), {
    responseType: 'stream',
    timeout: 60000,
    validateStatus: () => true
  })
  const total = Math.min(20, Math.max(1, Number(resposta?.headers?.['x-total-fotos'] || 1)))
  if (resposta?.data?.destroy)
    resposta.data.destroy()
  return Array.from({ length: total }, (_, i) => url(entrada, i))
}

module.exports = {
  url,
  fotos
}
