'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createControlAgent, validateCommand } = require('../DADOS_TOKITO/sistemas/controle-remoto');

const command = () => ({ id: 'b10ctl_123e4567-e89b-12d3-a456-426614174000',
  type: 'restart', expiresAt: new Date(Date.now() + 120000).toISOString() });
const license = { localLicenseStatus: () => ({ ok: true }),
  state: () => ({ installationId: 'tki_abcdefghijklmnop' }) };
const config = () => ({ API_URL: 'https://tokito-apis.com.br', API_KEY_TOKITO: 'tokito_test123' });

test('somente comando tipado, identificado e não expirado é aceito', () => {
  assert.equal(validateCommand(command()), true);
  assert.equal(validateCommand({ ...command(), type: 'delete_files' }), false);
  assert.equal(validateCommand({ ...command(), id: 'anything' }), false);
  assert.equal(validateCommand({ ...command(), expiresAt: new Date(Date.now() - 1000).toISOString() }), false);
});

test('bot sem supervisor informa incapacidade e não reinicia', async () => {
  let ack = 0;
  const request = {
    get: async (_, opts) => {
      assert.equal(opts.params.restartSupported, 'false');
      return { status: 200, data: { command: command() } };
    },
    post: async () => { ack += 1; }
  };
  const agent = createControlAgent({ request, license, getConfig: config, isSupervised: () => false,
    exit: () => { throw new Error('Nunca deve encerrar'); } });
  assert.equal(await agent.poll(), false);
  assert.equal(ack, 0);
});

test('bot supervisionado exige confirmação antes de solicitar reinício', async () => {
  let ack = 0;
  const request = {
    get: async (_, opts) => {
      assert.equal(opts.params.restartSupported, 'true');
      return { status: 200, data: { command: command() } };
    },
    post: async (_, body) => {
      assert.equal(body.state, 'accepted');
      ack++;
      return { status: 409, data: { state: 'expired' } };
    }
  };
  const agent = createControlAgent({ request, license, getConfig: config, isSupervised: () => true,
    exit: () => { throw new Error('Nunca deve encerrar sem ACK'); } });
  assert.equal(await agent.poll(), false);
  assert.equal(ack, 1);
});

test('licença offline ou revogada não faz polling de controle remoto', async () => {
  const request = { get: async () => { throw new Error('Não deve consultar'); } };
  const agent = createControlAgent({ request, license: { localLicenseStatus: () => ({ ok: false }) },
    getConfig: config, isSupervised: () => true });
  assert.equal(await agent.poll(), false);
});
