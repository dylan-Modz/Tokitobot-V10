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

module.exports = {
nome: "perfil",
comandos: ["perfil", "profile"],
categoria: "info",
info: {
"descricao": "Executa o comando perfil.",
"uso": "perfil",
"categoria": "info"
},
async executar(ctx) {
with (ctx) {
{
try {
await reagir(from, '🍁')
const alvo = normalizar(mrc_ou_numero || sender_ou_n || sender)
const numero = String(alvo).split('@')[0].split(':')[0]
const membro = isGroup ? groupMembers.find(m => nJid(m?.id || m?.jid || m?.participant || m) === alvo) : null
const nick = alvo === sender ? pushname : membro?.notify || membro?.name || membro?.verifiedName || `Usuário ${numero.slice(-4)}`
const dono = numerodono.includes(alvo)
const vipAlvo = dono || vip.some(v => nJid(v?.id || v) === alvo)
const cargo = dono ? 'ᴍᴇsᴛʀᴇ' : membro?.admin === 'superadmin' ? 'ᴅᴏɴᴏ ᴅᴏ ɢʀᴜᴘᴏ' : membro?.admin === 'admin' ? 'ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ' : vipAlvo ? 'ᴠɪᴘ' : 'ᴍᴇᴍʙʀᴏ'
let jidBiz = alvo
if (alvo.endsWith('@lid') && typeof tokito.signalRepository?.lidMapping?.getPNForLID === 'function')
jidBiz = await tokito.signalRepository.lidMapping.getPNForLID(alvo).catch(() => alvo) || alvo
const foto = await tokito.profilePictureUrl(alvo, 'image').catch(() => 'https://raw.githubusercontent.com/dylanModz/uploadsgg/main/midias/imagens/9841648c3df.jpg')
const status = await tokito.fetchStatus(alvo).catch(() => null)
const bio = status?.status?.status || status?.status || status?.[0]?.status?.status || status?.[0]?.status || 'Privado ou sem recado'
const biz = await tokito.getBusinessProfile(jidBiz).catch(() => null)
const fundoPerfil = biz?.coverPhotoUrl || biz?.cover_photo?.url || foto
const idMensagem = String(info.key?.id || '')
const celular = idMensagem.length > 21 ? 'Android 🤣' : idMensagem.startsWith('3A') ? 'iOS 😂😂😅' : 'WhatsApp Web 😂☝🏼'
const nivelGado = Math.floor(Math.random() * 101)
const nivelPuta = Math.floor(Math.random() * 101)
const gostosura = Math.floor(Math.random() * 101)
const programa = Math.floor(Math.random() * 10000)
const cardPerfil = `${API_URL}/canvas/perfil?fundo=${encodeURIComponent(fundoPerfil)}&text=${encodeURIComponent(nick)}&subtext=${encodeURIComponent('Tokito Apis')}&logo=${encodeURIComponent(foto)}&cargo=${encodeURIComponent(cargo)}&vip=${encodeURIComponent(vipAlvo ? 'sɪᴍ ✅' : 'ɴᴀᴏ ❌')}&bio=${encodeURIComponent(bio)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
const texto = mess.perfilUsuario({
nick,
numero: `@${numero}`,
bio,
cargo,
vip: vipAlvo ? 'sɪᴍ ✅' : 'ɴᴀᴏ ❌',
chat: isGroup ? 'ɢʀᴜᴘᴏ' : 'ᴘʀɪᴠᴀᴅᴏ',
grupo: isGroup ? groupName : 'ᴄᴏɴᴠᴇʀsᴀ ᴘʀɪᴠᴀᴅᴀ',
nivelGado,
celular,
nivelPuta,
gostosura,
programa
})
const botoes = [
{
texto: '🍁﹚𝐏𝐈𝐍𝐆﹙🍁',
id: `${prefix}ping`
},
{
texto: '🩵﹚𝐌𝐄𝐍𝐔﹙🩵',
id: `${prefix}menu`
}
]
if (!isBotoes) {
await tokito.sendMessage(from, {
image: { url: cardPerfil },
caption: texto,
mentions: [alvo],
contextInfo: canalInfo([alvo])
}, { quoted: selo })
return
}
const media = await prepareWAMessageMedia({ image: { url: cardPerfil } }, { upload: tokito.waUploadToServer })
const msg = generateWAMessageFromContent(from, {
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
...canalInfo([alvo]),
mentionedJid: [alvo]
},
header: proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
imageMessage: media.imageMessage
}),
body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: enviarbuton(botoes)
})
})
}, {
quoted: selo,
userJid: tokito.user.id
})
await tokito.relayMessage(from, msg.message, { messageId: msg.key.id })
}
catch (e) {
console.log('[PERFIL API]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
reply(mess.erroApi(API_URL))
}
return
}
}
}
}
