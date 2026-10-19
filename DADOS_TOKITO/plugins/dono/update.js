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

const sistema = require('../../sistemas/dados')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'update',
comandos: ['update'],
categoria: 'dono',
info: {
descricao: 'Verifica, instala ou restaura atualizações oficiais do Tokito V10.',
uso: 'update check | diag | info | start | rollback',
permissao: 'Dono'
},

async executar(ctx) {
if (!ctx.SoDono && !ctx.info?.key?.fromMe) {
return ctx.reply(ctx.mess.onlyOwner())
}

const acao = String(ctx.args?.[0] || ctx.q || 'check')
.trim()
.split(/\s+/)[0]
.toLowerCase()

if (acao === 'diag' || acao === 'diagnostico') {
const check = await sistema.verificarUpdate()
const salvo = sistema.state()
const automatico = global.__TOKITO_UPDATE_NOTICE_LAST_CHECK__ || {}
const ultimaFalha = String(global.__TOKITO_UPDATE_NOTICE_LAST_ERROR__ || automatico.error || '').trim()
const telefoneConfigurado = String(ctx.ownerNumber || '').replace(/\D/g, '')
const ativo = Boolean(global.__TOKITO_UPDATE_NOTICE_TIMER__ && global.__TOKITO_UPDATE_SOCKET__)
const versaoLocal = check?.local?.version || '—'
const versaoRemota = check?.remote?.version || 'indisponível'
const fonte = check?.fonte || 'indisponível'
const notificada = salvo?.lastNotifiedPrincipalVersion || 'nenhuma'
const quando = automatico.at
  ? new Date(automatico.at).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })
  : 'ainda não executada'

return ctx.reply([
'- 🧊 \`𝙳𝙸𝙰𝙶𝙽𝙾́𝚂𝚃𝙸𝙲𝙾 𝙳𝙾 𝚄𝙿𝙳𝙰𝚃𝙴\`',
'',
'> 🤖 ׄ ( ᴠᴇʀsᴀ̃ᴏ ɪɴsᴛᴀʟᴀᴅᴀ: ' + versaoLocal + ' )',
'> ✨ ׄ ( ᴠᴇʀsᴀ̃ᴏ ɴᴏ ɢɪᴛʜᴜʙ: ' + versaoRemota + ' )',
'> 📡 ׄ ( ғᴏɴᴛᴇ: ' + fonte + ' )',
'> 📥 ׄ ( ᴀᴛᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ ᴘᴇɴᴅᴇɴᴛᴇ: ' + (check?.available ? 'SIM' : 'NÃO') + ' )',
'',
'- 🔔 \`𝙰𝚅𝙸𝚂𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙾\`',
'',
'> ⚙️ ׄ ( ᴍᴏɴɪᴛᴏʀ: ' + (ativo ? 'ATIVO' : 'INATIVO') + ' )',
'> 👤 ׄ ( ᴅᴏɴᴏ ᴄᴏɴғɪɢᴜʀᴀᴅᴏ: ' + (telefoneConfigurado.length >= 11 ? 'SIM' : 'NÃO') + ' )',
'> 📩 ׄ ( ᴜ́ʟᴛɪᴍᴀ ᴠᴇʀsᴀ̃ᴏ ɴᴏᴛɪғɪᴄᴀᴅᴀ: ' + notificada + ' )',
'> 🕒 ׄ ( ᴜ́ʟᴛɪᴍᴀ ᴄᴏɴsᴜʟᴛᴀ ᴀᴜᴛᴏᴍᴀ́ᴛɪᴄᴀ: ' + quando + ' )',
'> ⚠️ ׄ ( ᴜ́ʟᴛɪᴍᴏ ᴇʀʀᴏ: ' + (ultimaFalha || (check?.ok ? 'nenhum' : String(check?.error || 'consulta indisponível'))) + ' )',
'',
'> 🔎 ׄ ( Use ' + ctx.prefix + 'update check para verificar novamente. )'
].join('\n'))
}

if (acao === 'check' || acao === 'info') {
const check = await sistema.verificarUpdate()

if (!check.ok) {
if (check.reason === 'not_published') {
return ctx.reply(ctx.mess.updateNotPublished())
}

return ctx.reply(ctx.mess.updateCheckError())
}

const totalPendentes =
(Array.isArray(check.pendingFiles) ? check.pendingFiles.length : 0) +
(Array.isArray(check.pendingDelete) ? check.pendingDelete.length : 0)

if (check.available && check.incremental && !totalPendentes) {
return ctx.reply(ctx.mess.updateEmptyFiles(check.remote?.publicVersion || check.remote?.version))
}

return ctx.reply(ctx.mess.updateInfo({
instalada: check.local.publicVersion || check.local.version || '—',
disponivel: check.remote.publicVersion || check.remote.version || '—',
canal: check.remote.channel || 'stable',
modo: check.mode || (check.incremental ? 'incremental' : 'clean'),
disponivelAgora: check.available,
reparacao: check.repair === true,
changelog: Array.isArray(check.remote?.changelog)
? check.remote.changelog
: [],
arquivos: Array.isArray(check.pendingFiles)
? check.pendingFiles.map(item => item.path)
: [],
removidos: Array.isArray(check.pendingDelete)
? check.pendingDelete.map(item => item.path)
: [],
prefix: ctx.prefix
}))
}

if (acao === 'start') {
await ctx.reply(ctx.mess.updatePreparing())

try {
const result = await sistema.instalarUpdate(
texto => console.log(`[ UPDATE • TOKITO ] ${texto}`)
)

if (!result.updated) {
if (result.reason === 'empty_update') {
return ctx.reply(ctx.mess.updateEmptyFiles(result.remote?.publicVersion || result.remote?.version))
}

return ctx.reply(ctx.mess.updateAlreadyLatest(result.remote?.publicVersion || result.version))
}

await ctx.reply(ctx.mess.updateSuccess(
result.previousPublicVersion || result.from,
result.remote?.publicVersion || result.version,
result.filesUpdated || 0,
result.filesDeleted || 0
))

return setTimeout(() => process.exit(20), 1500)
} catch (error) {
const motivo = String(error?.message || '').trim()
console.log('[ UPDATE • TOKITO ]', motivo || error)
// Mostra apenas falhas técnicas conhecidas, sem expor credenciais ou URLs privadas.
const seguro = [
  /^A verificação de integridade falhou em [a-zA-Z0-9_./-]+\.$/,
  /^Não foi possível baixar [a-zA-Z0-9_./-]+\.$/,
  /^Arquivo protegido ou inválido na atualização: [a-zA-Z0-9_./-]+$/,
  /^A atualização publicada não possui arquivos para instalar\.$/
].some(regra => regra.test(motivo))
return ctx.reply(ctx.mess.updateError() +
  (seguro ? '\n\n> 🔎 ׄ ( ' + motivo + ' )' : ''))
}
}

if (acao === 'rollback') {
try {
const result = sistema.rollback()

await ctx.reply(ctx.mess.updateRollbackSuccess(result.version))

return setTimeout(() => process.exit(20), 1500)
} catch (error) {
console.log('[ ROLLBACK • TOKITO ]', error.message || error)
return ctx.reply(ctx.mess.updateRollbackError())
}
}

return ctx.reply(ctx.mess.updateUsage(ctx.prefix))
}
}
)
