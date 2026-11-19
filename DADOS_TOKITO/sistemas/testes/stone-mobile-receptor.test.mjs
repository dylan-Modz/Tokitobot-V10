import test from 'node:test'
import assert from 'node:assert/strict'
import {
  inspecionarMidiaStone, decidirTransporteStone, perfilAndroidStone
} from '@stone-wpp/ofc'

test('imagem de visualização única com chave', () => {
  const msg = { message: { viewOnceMessageV2: { message: {
    imageMessage: { mediaKey: Uint8Array.of(1), directPath: '/arquivo' }
  } } } }
  assert.equal(inspecionarMidiaStone(msg)?.temChave, true)
  assert.equal(inspecionarMidiaStone(msg)?.temCaminho, true)
})
test('stub sem mídia não fabrica chave nem arquivo', () => {
  assert.equal(inspecionarMidiaStone({ message: {} }), null)
})
test('mensagem normal não é identificada como view-once', () => {
  assert.equal(inspecionarMidiaStone({ message: {
    imageMessage: { mediaKey: Uint8Array.of(1) }
  } }), null)
})
test('sessão sem credenciais mantém modo vinculado', () => {
  assert.equal(decidirTransporteStone(null).modo, 'vinculado')
})
test('credenciais Web não são transformadas automaticamente', () => {
  assert.equal(decidirTransporteStone({ meJid: '123@s.whatsapp.net' }).modo, 'vinculado')
})
test('opt-in autoriza teste mobile em sessão Web de teste', () => {
  assert.equal(decidirTransporteStone({ meJid: '123@s.whatsapp.net' },
    { tentarAndroidAposVinculo: true }).modo, 'mobile-experimental')
})
test('credenciais mobile são reconhecidas sem optar por modo experimental', () => {
  assert.equal(decidirTransporteStone({ meJid: '123@s.whatsapp.net',
    deviceInfo: { manufacturer: 'Google' } }).modo, 'mobile')
})
test('identificador de conta Business usa campo apropriado', () => {
  assert.equal(perfilAndroidStone({ business: true }).business, true)
})
