const fs = require('fs')
const path = require('path')

const getPlugins = () => require('../plugins')

const arquivo = path.join(__dirname, '..', 'INFO_DADOS', 'nescessario.json')

const garantir = cfg => {
  if (!Array.isArray(cfg.vipcmd))
    cfg.vipcmd = []
  if (!cfg.blockcmd || typeof cfg.blockcmd !== 'object' || Array.isArray(cfg.blockcmd))
    cfg.blockcmd = {}
  cfg.vipcmd = [...new Set(cfg.vipcmd.map(v => String(v || '').trim().toLowerCase()).filter(Boolean))]
  for (const jid of Object.keys(cfg.blockcmd)) {
    if (!Array.isArray(cfg.blockcmd[jid]))
      cfg.blockcmd[jid] = []
    cfg.blockcmd[jid] = [...new Set(cfg.blockcmd[jid].map(v => String(v || '').trim().toLowerCase()).filter(Boolean))]
    if (!cfg.blockcmd[jid].length)
      delete cfg.blockcmd[jid]
  }
  return cfg
}

const salvar = cfg => {
  garantir(cfg)
  const tmp = `${arquivo}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(cfg, null, 2) + '\n')
  fs.renameSync(tmp, arquivo)
}

const canonico = comando => {
  const plugins = getPlugins()
  const achado = typeof plugins.resolver === 'function' ? plugins.resolver(comando) : null
  return achado?.canonico || String(comando || '').trim().toLowerCase()
}

const addVip = (cfg, comando) => {
  const nome = canonico(comando)
  const plugins = getPlugins()
  if (!nome || typeof plugins.resolver !== 'function' || !plugins.resolver(comando))
    return {
      ok: false,
      motivo: 'inexistente',
      nome
    }
  garantir(cfg)
  if (cfg.vipcmd.includes(nome))
    return {
      ok: false,
      motivo: 'ja',
      nome
    }
  cfg.vipcmd.push(nome)
  salvar(cfg)
  return {
    ok: true,
    nome
  }
}

const delVip = (cfg, comando) => {
  const nome = canonico(comando)
  garantir(cfg)
  const antes = cfg.vipcmd.length
  cfg.vipcmd = cfg.vipcmd.filter(v => v !== nome)
  if (cfg.vipcmd.length === antes)
    return {
      ok: false,
      motivo: 'nao',
      nome
    }
  salvar(cfg)
  return {
    ok: true,
    nome
  }
}

const block = (cfg, grupo, comando) => {
  const nome = canonico(comando)
  const plugins = getPlugins()
  if (!nome || typeof plugins.resolver !== 'function' || !plugins.resolver(comando))
    return {
      ok: false,
      motivo: 'inexistente',
      nome
    }
  garantir(cfg)
  if (!Array.isArray(cfg.blockcmd[grupo]))
    cfg.blockcmd[grupo] = []
  if (cfg.blockcmd[grupo].includes(nome))
    return {
      ok: false,
      motivo: 'ja',
      nome
    }
  cfg.blockcmd[grupo].push(nome)
  salvar(cfg)
  return {
    ok: true,
    nome
  }
}

const unblock = (cfg, grupo, comando) => {
  const nome = canonico(comando)
  garantir(cfg)
  const lista = Array.isArray(cfg.blockcmd[grupo]) ? cfg.blockcmd[grupo] : []
  const antes = lista.length
  cfg.blockcmd[grupo] = lista.filter(v => v !== nome)
  if (!cfg.blockcmd[grupo].length)
    delete cfg.blockcmd[grupo]
  if (antes === (cfg.blockcmd[grupo]?.length || 0))
    return {
      ok: false,
      motivo: 'nao',
      nome
    }
  salvar(cfg)
  return {
    ok: true,
    nome
  }
}

const verificar = ({ cfg, command, isGroup, from, SoDono, isVip }) => {
  garantir(cfg)
  const nome = canonico(command)
  if (!nome)
    return {
      bloqueado: false,
      nome
    }
  if (!SoDono && cfg.vipcmd.includes(nome) && !isVip)
    return {
      bloqueado: true,
      tipo: 'vip',
      nome
    }
  if (isGroup && !SoDono && Array.isArray(cfg.blockcmd[from]) && cfg.blockcmd[from].includes(nome))
    return {
      bloqueado: true,
      tipo: 'grupo',
      nome
    }
  return {
    bloqueado: false,
    nome
  }
}

module.exports = {
  garantir,
  salvar,
  canonico,
  addVip,
  delVip,
  block,
  unblock,
  verificar
}
