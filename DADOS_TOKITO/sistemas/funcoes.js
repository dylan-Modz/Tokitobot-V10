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

const base = require('./grupos.js')
const aprovacao = require('./aprovacao.js')
const antilink = require('../plugins/admin/filtro-antilink.js')
const x9 = require('./x9.js')
const antipay = require('../plugins/admin/filtro-antipay.js')
const antibot = require('../plugins/admin/filtro-antibot.js')
const antivideo = require('../plugins/admin/filtro-antivideo.js')
const antifoto = require('../plugins/admin/filtro-antifoto.js')
const antivisu = require('../plugins/admin/filtro-antivisu.js')
const antisticker = require('../plugins/admin/filtro-antisticker.js')
const anticontato = require('../plugins/admin/filtro-anticontato.js')
const antilocalizacao = require('../plugins/admin/filtro-antilocalizacao.js')
const antidocumento = require('../plugins/admin/filtro-antidocumento.js')
const antiaudio = require('../plugins/admin/filtro-antiaudio.js')
const antispam = require('../plugins/admin/filtro-antispam.js')
const antistatus = require('../plugins/admin/filtro-antistatus.js')
const antimarcacao = require('../plugins/admin/filtro-antimarcacao.js')
const anticanal = require('../plugins/admin/filtro-anticanal.js')
const jogos = require('../plugins/jogos/sistema.js')
const advertencias = require('./advertencias.js')

const processadas = global.__TOKITO_MENSAGENS_PROCESSADAS__ ||= new Map()

const duplicada = contexto => {
const info = contexto?.info
const id = String(info?.key?.id || '').trim()
const from = String(contexto?.from || info?.key?.remoteJid || '').trim()
if (!id || !from)
return false
// O mesmo evento pode chegar com participant, participantAlt ou wrappers diferentes.
// Por isso a trava usa somente o chat + ID real da mensagem.
const modo = info?.key?.isViewOnce === true ? 'visu' : 'msg'
const chave = `${from}:${id}:${modo}`
const agora = Date.now()
const anterior = processadas.get(chave) || 0
if (agora - anterior < 120000)
return true
processadas.set(chave, agora)
if (processadas.size > 5000) {
for (const [item, tempo] of processadas) {
if (agora - tempo > 120000)
processadas.delete(item)
}
}
return false
}

const iniciar = (tokito, prefix) => {
aprovacao.iniciar(tokito, prefix)
x9.iniciar(tokito)
}

const verificar = async (contexto) => {
if (duplicada(contexto))
return true
const config = contexto?.dataGp?.[0]?.funcoes || (contexto?.from ? base.config(contexto.from) : {})
const ctx = {
...contexto,
config
}
const qtdAdv = () => Number(ctx?.dataGp?.[0]?.advertencias?.[base.normalizar(ctx.sender)]?.quantidade || 0)
const rodar = async (mod, motivo, oficial = true) => {
const antes = qtdAdv()
const bateu = await mod.verificar(ctx)
if (!bateu)
return false
if (oficial && ctx.isGroup && !ctx.isGroupAdmins && !ctx.dono && ctx.sender && qtdAdv() === antes) {
const r = advertencias.adicionar({
dataGp: ctx.dataGp,
setGp: ctx.setGp,
grupo: ctx.from,
jid: ctx.sender,
motivo,
autor: 'proteção automática'
})
let removido = false
if (r.remove && ctx.isBotGroupAdmins) {
try {
await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'remove')
removido = true
}
catch {
}
}
await ctx.tokito.sendMessage(ctx.from, {
text: require('../mensagens/mensagens.js').advAutomaticaDetalhe(ctx.sender, r.quantidade, motivo, removido),
contextInfo: {
...(ctx.newsletter || {}),
mentionedJid: [ctx.sender]
}
}, { quoted: ctx.selo }).catch(() => {
})
}
return true
}
if (await rodar(antivisu, 'Envio de mídia de visualização única'))
return true
if (await rodar(antisticker, 'Envio de figurinha bloqueada'))
return true
if (await rodar(antipay, 'Envio de mensagem de pagamento bloqueada'))
return true
if (await rodar(antilink, 'Envio de link bloqueado'))
return true
if (await rodar(antibot, 'Detecção pelo sistema anti-bot'))
return true
if (await rodar(antistatus, 'Menção/divulgação por status bloqueada'))
return true
if (await rodar(antimarcacao, 'Marcação excessiva de membros'))
return true
if (await rodar(anticanal, 'Envio/divulgação de canal do WhatsApp'))
return true
if (await rodar(anticontato, 'Envio de contato bloqueado'))
return true
if (await rodar(antilocalizacao, 'Envio de localização bloqueada'))
return true
if (await rodar(antidocumento, 'Envio de documento bloqueado'))
return true
if (await rodar(antiaudio, 'Envio de áudio bloqueado'))
return true
if (await rodar(antifoto, 'Envio de foto bloqueada'))
return true
if (await rodar(antivideo, 'Envio de vídeo bloqueado'))
return true
if (await rodar(antispam, 'Spam de comandos', false))
return true
return false
}

module.exports = {
iniciar,
verificar,
base,
aprovacao,
antilink,
x9,
antipay,
antibot,
antivideo,
antifoto,
antivisu,
antisticker,
anticontato,
antilocalizacao,
antidocumento,
antiaudio,
antispam,
antistatus,
antimarcacao,
anticanal,
jogos
}
