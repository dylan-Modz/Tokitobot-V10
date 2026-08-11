/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

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
