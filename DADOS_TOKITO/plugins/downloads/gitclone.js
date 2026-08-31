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

const scraper = require('../../scrapers/downloads/gitclone')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "gitclone",
comandos: ["gitclone"],
categoria: "downloads",
info: {
"descricao": "Executa o comando gitclone.",
"uso": "gitclone",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.downloadUso({ tipo: 'LINK GITHUB', prefix, command, exemplo: 'https://github.com/usuario/repositorio' }))
await reagir(from, '📦')
await reply(mess.wait())
const dados = await scraper.buscar(q.trim())
const res = dados?.data || dados?.resultado || dados?.result
if (!dados?.status || !res)
return reply(mess.downloadNaoEncontrado('GITHUB'))
const nome = limpar(res?.name || 'repositorio')
const capa = achar(res?.image, res?.thumbnail)
const texto = mess.padraoInfo({
emoji: '📦',
titulo: 'GITCLONE',
linhas: [
{ rotulo: '📌 𝙽𝙾𝙼𝙴', valor: nome },
{ rotulo: '👨‍💻 𝙲𝚁𝙸𝙰𝙳𝙾𝚁', valor: res?.creator || 'Desconhecido' },
{ rotulo: '💻 𝙻𝙸𝙽𝙶𝚄𝙰𝙶𝙴𝙼', valor: res?.language || 'Desconhecida' },
{ rotulo: '⭐ 𝚂𝚃𝙰𝚁𝚂', valor: res?.stargazers || 0 }
]
})
if (capa)
await tokito.sendMessage(from, {
image: { url: capa },
caption: texto,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
else
await reply(texto)
if (res?.download)
await tokito.sendMessage(from, {
document: { url: res.download },
mimetype: 'application/zip',
fileName: `${nome}.zip`,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[GITCLONE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
