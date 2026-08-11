const axios = require('axios')
const fs = require('fs')
const path = require('path')

const CONFIG = path.join(__dirname, '..', 'INFO_DADOS', 'config-all.json')

const getToken = () => {
  try {
    return String(JSON.parse(fs.readFileSync(CONFIG, 'utf8'))?.MP_TOKEN || '').trim()
  }
  catch {
    return ''
  }
}

const tokenConfigurado = () => Boolean(getToken())

const exigirToken = () => {
  const token = getToken()
  if (!token) {
    const e = new Error('MP_TOKEN_NAO_CONFIGURADO')
    e.code = 'MP_TOKEN_NAO_CONFIGURADO'
    throw e
  }
  return token
}

async function criarPagamentoPix(valorCompra, descricao, idempotencyKey, pagador = {}) {
  const token = exigirToken()
  const valor = Number(valorCompra)
  if (!Number.isFinite(valor) || valor <= 0)
    throw new Error('VALOR_PIX_INVALIDO')
  const payment_data = {
    transaction_amount: Number(valor.toFixed(2)),
    description: String(descricao || 'Pagamento via PIX').slice(0, 120),
    payment_method_id: 'pix',
    payer: {
      email: String(pagador.email || 'cliente@email.com'),
      first_name: String(pagador.first_name || pagador.nome || 'Cliente').slice(0, 60),
      last_name: String(pagador.last_name || 'Tokito').slice(0, 60)
    }
  }
  try {
    const response = await axios.post('https://api.mercadopago.com/v1/payments', payment_data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': String(idempotencyKey)
      }
    })
    const pagamento = response.data || {}
    const trans = pagamento?.point_of_interaction?.transaction_data || {}
    return {
      id: pagamento.id,
      status: pagamento.status,
      status_detail: pagamento.status_detail,
      qr_code: trans.qr_code || '',
      qr_code_base64: trans.qr_code_base64 || '',
      ticket_url: trans.ticket_url || ''
    }
  }
  catch (error) {
    const e = new Error(error?.response?.data?.message || error?.message || 'Erro ao criar o pagamento')
    e.data = error?.response?.data
    throw e
  }
}

async function verificarPix(id) {
  const token = exigirToken()
  try {
    const response = await axios.get(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` } })
    const pagamento = response.data || {}
    return {
      id: pagamento.id,
      status: pagamento.status,
      status_detail: pagamento.status_detail,
      external_reference: pagamento.external_reference || null
    }
  }
  catch (error) {
    const e = new Error(error?.response?.data?.message || error?.message || 'Erro ao verificar o pagamento')
    e.data = error?.response?.data
    throw e
  }
}

module.exports = {
  criarPagamentoPix,
  verificarPix,
  tokenConfigurado,
  getToken
}
