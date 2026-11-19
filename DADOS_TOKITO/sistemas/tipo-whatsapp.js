'use strict'

// Seleção do tipo de WhatsApp no terminal. Continua sendo conexão por aparelho
// vinculado: identificação de navegador não é transporte mobile-primary.
const fs = require('fs')
const path = require('path')

const arquivo = sessao => path.join(sessao, 'tipo-whatsapp.json')

const tipoValido = valor => valor === 'normal' || valor === 'business'

const lerTipo = sessao => {
  try {
    const json = JSON.parse(fs.readFileSync(arquivo(sessao), 'utf8'))
    return tipoValido(json?.tipo) ? json.tipo : 'business'
  } catch {
    // Mantém a identificação de navegador original em sessões antigas.
    return 'business'
  }
}

const salvarTipo = (sessao, tipo) => {
  if (!tipoValido(tipo)) throw new Error('TIPO_WHATSAPP_INVALIDO')
  fs.mkdirSync(sessao, { recursive: true })
  const destino = arquivo(sessao)
  const temporario = destino + '.' + process.pid + '.tmp'
  fs.writeFileSync(temporario, JSON.stringify({ tipo }, null, 2) + '\n', { mode: 0o600 })
  fs.renameSync(temporario, destino)
  return tipo
}

const nomeTipo = tipo => tipo === 'normal' ? 'WhatsApp Normal' : 'WhatsApp Business'

// O perfil Android e usado somente APOS a sessao Web/companion registrar.
// '13' e 'SMB_ANDROID' sao nomes de browser na Stone, nao transportes mobile.
const navegador = (tipo, Browsers, registrado = false) => {
  if (!registrado) return ['Linux', 'Opera', '10.0.22631']
  if (!Browsers || typeof Browsers.android !== 'function') {
    throw new Error('STONE_BROWSER_ANDROID_INDISPONIVEL')
  }
  return tipo === 'business'
    ? Browsers.android('SMB_ANDROID')
    : Browsers.android('13')
}

module.exports = { lerTipo, salvarTipo, nomeTipo, navegador, tipoValido }
