const test = require('node:test')
const assert = require('node:assert/strict')
const { advertencia } = require('../DADOS_TOKITO/sistemas/hierarquia.js')

const jid = id => id + '@s.whatsapp.net'
const integrantes = [
  { id: jid('111'), admin: 'superadmin' },
  { id: jid('222'), admin: 'admin' },
  { id: '333@lid', phoneNumber: jid('333'), admin: 'admin' },
  { id: jid('444'), admin: null },
  { id: jid('555'), admin: null },
  { id: jid('777'), admin: 'admin' }
]
const meta = { owner: jid('111'), participants: integrantes }

const contexto = (autor, opcoes = {}) => ({
  sender: jid(autor),
  SoDono: autor === '555',
  isSubBot: false,
  numerodono: [jid('555')],
  botNumber: jid('777'),
  from: '123@g.us',
  normalizar: value => String(value || '').toLowerCase(),
  tokito: { groupMetadata: async () => meta },
  ...opcoes
})

const casos = [
  ['membro não adverte ninguém', '444', jid('222'), 'sem_permissao'],
  ['membro não adverte membro', '444', jid('555'), 'sem_permissao'],
  ['admin pode advertir membro', '222', jid('444'), 'ok'],
  ['admin não adverte outro admin', '222', jid('333'), 'admin_protegido'],
  ['admin não adverte outro admin via LID', '222', '333@lid', 'admin_protegido'],
  ['admin não adverte dono do grupo', '222', jid('111'), 'dono_protegido'],
  ['admin não adverte dono do bot', '222', jid('555'), 'dono_protegido'],
  ['admin não adverte a si mesmo', '222', jid('222'), 'proprio_usuario'],
  ['admin não adverte o bot', '222', jid('777'), 'dono_protegido'],
  ['dono do bot pode advertir admin', '555', jid('333'), 'ok'],
  ['dono do grupo pode advertir admin', '111', jid('222'), 'ok'],
  ['dono do bot não adverte dono do grupo', '555', jid('111'), 'dono_protegido'],
  ['dono do grupo não adverte dono do bot', '111', jid('555'), 'dono_protegido'],
  ['usuário fora do grupo não recebe adv', '222', jid('999'), 'fora_do_grupo']
]

for (const [descricao, autor, alvo, esperado] of casos) {
  test(descricao, async () => {
    const resultado = await advertencia(contexto(autor), alvo)
    assert.equal(resultado.ok ? 'ok' : resultado.motivo, esperado)
  })
}

test('cargo exibido no cache não concede permissão sem admin real', async () => {
  const resultado = await advertencia(contexto('444', { isGroupAdmins: true }), jid('222'))
  assert.equal(resultado.motivo, 'sem_permissao')
})

test('falha ao buscar metadata nunca aplica advertência', async () => {
  const ctx = contexto('222', { tokito: { groupMetadata: async () => { throw Error('offline') } } })
  assert.equal((await advertencia(ctx, jid('444'))).motivo, 'indisponivel')
})

test('ausência de participantes nunca aplica advertência', async () => {
  const ctx = contexto('222', { tokito: { groupMetadata: async () => ({ participants: [] }) } })
  assert.equal((await advertencia(ctx, jid('444'))).motivo, 'indisponivel')
})
