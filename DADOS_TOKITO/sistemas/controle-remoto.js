'use strict';

const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const dados = require('./dados');

const CONFIG = path.resolve(__dirname, '..', 'INFO_DADOS', 'config-all.json');
const INTERVAL_MS = 45_000;
const RUNTIME_STARTED_AT = new Date().toISOString();

// Um processo iniciado diretamente por "node" não pode prometer reinício.
// PM2 (com autorestart ativo) ou supervisor explicitamente configurado é obrigatório.
function supervised() {
  return process.env.pm_id !== undefined || process.env.TOKITO_RESTART_ON_EXIT === '1';
}

function currentConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG, 'utf8')); }
  catch (_) { return {}; }
}

function validateCommand(command) {
  return Boolean(command && command.type === 'restart' &&
    /^b10ctl_[0-9a-f-]{36}$/.test(String(command.id || '')) &&
    Number.isFinite(Date.parse(command.expiresAt)) &&
    Date.parse(command.expiresAt) > Date.now());
}

function createControlAgent({ request = axios, license = dados, getConfig = currentConfig,
  isSupervised = supervised, exit = code => process.exit(code) } = {}) {
  let busy = false;
  let exiting = false;

  async function poll() {
    if (busy || exiting || !license.localLicenseStatus().ok) return false;
    const config = getConfig();
    const token = String(config.API_KEY_TOKITO || '').trim();
    const base = String(config.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '');
    const installationId = String(license.state().installationId || '');
    if (!token.startsWith('tokito_') || !/^tki_[A-Za-z0-9_-]{12,110}$/.test(installationId)) return false;
    if (!/^https:\/\//i.test(base) && !/^http:\/\/localhost(?::\d+)?$/i.test(base)) return false;

    busy = true;
    try {
      const headers = { Authorization: 'Bearer ' + token, 'User-Agent': 'TokitoBot-V10/controle' };
      const supported = isSupervised();
      const response = await request.get(base + '/api/bot/v10/control', {
        headers, params: { installationId, restartSupported: supported ? 'true' : 'false', runtimeStartedAt: RUNTIME_STARTED_AT },
        timeout: 12000, validateStatus: () => true
      });
      if (response.status !== 200 || !supported || !validateCommand(response.data?.command)) return false;
      const command = response.data.command;
      const confirmation = await request.post(base + '/api/bot/v10/control/ack',
        { installationId, commandId: command.id, state: 'accepted' },
        { headers, timeout: 12000, validateStatus: () => true });
      if (confirmation.status !== 200 || confirmation.data?.state !== 'accepted') return false;
      exiting = true;
      // O supervisor recebe o encerramento normal e inicia uma nova instância.
      // Nenhuma pasta de sessões, configuração ou arquivo do usuário é alterado.
      const timer = setTimeout(() => exit(0), 1000);
      timer.unref?.();
      return true;
    } catch (_) {
      return false; // Não derrubar o bot por falha de rede/serviço.
    } finally {
      busy = false;
    }
  }

  return { poll };
}

function start() {
  if (global.__TOKITO_REMOTE_CONTROL_TIMER__) return global.__TOKITO_REMOTE_CONTROL_TIMER__;
  const agent = createControlAgent();
  const first = setTimeout(() => { void agent.poll(); }, 15000);
  first.unref?.();
  const timer = setInterval(() => { void agent.poll(); }, INTERVAL_MS);
  timer.unref?.();
  global.__TOKITO_REMOTE_CONTROL_TIMER__ = timer;
  return timer;
}

module.exports = { createControlAgent, validateCommand, supervised, start };
