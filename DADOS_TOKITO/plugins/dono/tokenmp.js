const fs = require('fs')
const path = require('path')

module.exports = {
  nome: 'tokenmp',
  comandos: ['tokenmp', 'settokenmp'],
  categoria: 'dono',
  info: {
    descricao: 'Configura o Access Token do Mercado Pago.',
    uso: 'tokenmp ACCESS_TOKEN',
    permissao: 'Dono/privado',
    categoria: 'dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    if (ctx.isGroup)
      return ctx.reply(ctx.mess.tokenMpPrivado())
    const token = String(ctx.q || '').trim()
    if (!token)
      return ctx.reply(ctx.mess.tokenMpUso(ctx.prefix))
    const arq = path.join(ctx.__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'config-all.json')
    const cfg = JSON.parse(fs.readFileSync(arq, 'utf8'))
    cfg.MP_TOKEN = token
    const tmp = arq + '.tmp'
    fs.writeFileSync(tmp, JSON.stringify(cfg, null, 2) + '\n')
    fs.renameSync(tmp, arq)
    if (ctx.setting && typeof ctx.setting === 'object')
      ctx.setting.MP_TOKEN = token
    return ctx.reply(ctx.mess.tokenMpSalvo())
  }
}
