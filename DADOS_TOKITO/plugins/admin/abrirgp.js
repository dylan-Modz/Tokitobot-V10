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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "abrirgp",
comandos: ["abrirgp"],
categoria: "grupo",
info: {
"descricao": "Executa o comando abrirgp.",
"uso": "abrirgp",
"categoria": "grupo"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!isGroup)
return reply(mess.grupo())
if (!isGroupAdmins)
return reply(mess.adm())
if (!isBotGroupAdmins)
return reply(mess.botadm())
const hora = String(q || '').trim()
const regra = /^([01]\d|2[0-3]):[0-5]\d$/
if (!regra.test(hora))
return reply(mess.abrir(prefix))
const grupos = ler()
const atual = grupos[from] || {}
const ctx = mensagem?.extendedTextMessage?.contextInfo || mensagem?.imageMessage?.contextInfo || mensagem?.videoMessage?.contextInfo || {}
const marcada = extrair(ctx?.quotedMessage)
const imagem = marcada?.imageMessage
const video = marcada?.videoMessage
let midia = atual.abrirmidia || atual.midia || null
await reagir(from, '⏳')
if (video) {
const buffer = await getFileBuffer(video, 'video')
const nome = `${from.split('@')[0]}-a-${Date.now()}-${getRandom('.mp4')}`
const destino = path.join(pasta, nome)
fs.writeFileSync(destino, buffer)
apagar(midia)
midia = {
tipo: 'video',
arquivo: nome
}
}
else if (imagem) {
const buffer = await getFileBuffer(imagem, 'image')
const nome = `${from.split('@')[0]}-a-${Date.now()}-${getRandom('.jpg')}`
const destino = path.join(pasta, nome)
fs.writeFileSync(destino, buffer)
apagar(midia)
midia = {
tipo: 'image',
arquivo: nome
}
}
const novo = {
...atual,
nome: groupName,
ativo: true,
abrir: hora,
abrirmidia: midia,
ultimaAbertura: null
}
delete novo.midia
grupos[from] = novo
salvar(grupos)
processar().catch(() => {
})
await reagir(from, '✅')
return reply(mess.abrir(prefix, hora))
}
catch (error) {
console.log('❌ Erro no abrirgp:', error)
await reagir(from, '❌').catch(() => {
})
return reply(mess.error())
}
}
}
}
}
)
