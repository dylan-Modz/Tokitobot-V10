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

const r = require('../../sistemas/rpg/index')

const garantirCidade = u => u.cidade || (u.cidade = {
nome: null,
cargo: 'Desempregado',
idCargo: 'desempregado',
bairro: 'centro',
reputacao: 0,
energia: 100,
fome: 100,
saude: 100,
nivel: 1,
xp: 0,
saldoBanco: 0,
casa: null,
veiculo: null,
combustivel: 0,
durabilidadeVeiculo: 100,
parceiro: null,
presoAte: 0,
ultimoTrabalho: 0
})

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'registrarcidade',
comandos: ['registrarcidade', 'cidade', 'perfilcidade', 'cidadeperfil', 'trabalhar', 'depositar', 'sacar', 'banco'],
categoria: 'coins',
info: {
descricao: 'Sistema de cidade integrado aos N-Coins.',
uso: 'registrarcidade nome',
requisitos: 'Modo Coins',
categoria: 'coins'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!r.temCoins(ctx))
return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
const u = r.eco(ctx)
const c = garantirCidade(u)
if (ctx.command === 'registrarcidade' || (ctx.command === 'cidade' && !c.nome)) {
if (c.nome && ctx.command === 'registrarcidade')
return ctx.reply(ctx.mess.padraoAviso({
emoji: '🏙️',
titulo: 'PERFIL JÁ REGISTRADO',
descricao: `Você já possui um perfil na cidade como ${c.nome}.`
}))
c.nome = String(ctx.q || ctx.pushname || 'Cidadão').trim().slice(0, 30)
r.salvar(ctx)
return ctx.reply(ctx.mess.cidadeRegistrada(c.nome))
}
if (['perfilcidade', 'cidadeperfil', 'cidade'].includes(ctx.command)) {
if (!c.nome)
return ctx.reply(ctx.mess.padraoAviso({
emoji: '🏙️',
titulo: 'PERFIL NÃO REGISTRADO',
descricao: `Você ainda não se registrou na cidade. Use ${ctx.prefix}registrarcidade nome.`
}))
let foto = 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/6604x2f6a.jpg'
try {
foto = await ctx.tokito.profilePictureUrl(ctx.sender, 'image')
}
catch {
}
const parceiro = c.parceiro ? `@${String(c.parceiro).split('@')[0]}` : 'Nenhum'
const status = Number(c.presoAte || 0) > Date.now() ? 'Preso' : 'Livre'
const nivel = Number(c.nivel || 1)
const xp = Number(c.xp || 0)
const xpmax = nivel * 100
const patrimonio = Number(u.coins || 0) + Number(c.saldoBanco || 0)
const url = `${ctx.API_URL}/canvas/perfilcidade?apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}&foto=${encodeURIComponent(foto)}&nome=${encodeURIComponent(c.nome)}&bairro=${encodeURIComponent(c.bairro || 'Centro')}&cargo=${encodeURIComponent(c.cargo || 'Morador')}&carteira=${encodeURIComponent(u.coins || 0)}&banco=${encodeURIComponent(c.saldoBanco || 0)}&energia=${encodeURIComponent(c.energia || 0)}&fome=${encodeURIComponent(c.fome || 0)}&saude=${encodeURIComponent(c.saude || 0)}&casa=${encodeURIComponent(c.casa || 'Nenhuma')}&veiculo=${encodeURIComponent(c.veiculo || 'Nenhum')}&combustivel=${encodeURIComponent(c.combustivel || 0)}&durabilidade=${encodeURIComponent(c.durabilidadeVeiculo ?? 100)}&reputacao=${encodeURIComponent(c.reputacao || 0)}&nivel=${encodeURIComponent(nivel)}&xp=${encodeURIComponent(xp)}&xpmax=${encodeURIComponent(xpmax)}&parceiro=${encodeURIComponent(parceiro)}&status=${encodeURIComponent(status)}&patrimonio=${encodeURIComponent(patrimonio)}`
const caption = ctx.mess.cidadePerfil(ctx.sender, u)
try {
return await ctx.tokito.sendMessage(ctx.from, {
image: { url },
caption,
contextInfo: ctx.canalInfo([ctx.sender, ...(c.parceiro ? [c.parceiro] : [])])
}, { quoted: ctx.selo })
}
catch (error) {
console.log(
'[PERFIL CIDADE API]',
ctx.modulos.sanitizarErro(error, [ctx.API_KEY_TOKITO]) || 'Erro sem detalhes'
)

return ctx.reply(
ctx.mess.erroApi(ctx.API_URL)
)
}
}
if (ctx.command === 'trabalhar') {
const cd = 30 * 60 * 1000
if (Date.now() - Number(c.ultimoTrabalho || 0) < cd)
return ctx.reply(ctx.mess.coinsCooldown(Math.ceil((cd - (Date.now() - c.ultimoTrabalho)) / 1000)))
const ganho = Math.floor(Math.random() * 701) + 300
u.coins += ganho
c.cargo = c.cargo === 'Desempregado' ? 'Autônomo' : c.cargo
c.ultimoTrabalho = Date.now()
c.xp = Number(c.xp || 0) + 20
c.nivel = 1 + Math.floor(c.xp / 100)
r.salvar(ctx)
return ctx.reply(ctx.mess.cidadeTrabalho(ganho, u.coins))
}
const valor = Number(String(ctx.q || '').replace(/\D/g, ''))
if (ctx.command === 'depositar') {
if (!valor || u.coins < valor)
return ctx.reply(ctx.mess.cidadeBancoUso(ctx.prefix))
u.coins -= valor
c.saldoBanco += valor
r.salvar(ctx)
return ctx.reply(ctx.mess.cidadeBanco(c.saldoBanco, u.coins))
}
if (ctx.command === 'sacar') {
if (!valor || c.saldoBanco < valor)
return ctx.reply(ctx.mess.cidadeBancoUso(ctx.prefix))
c.saldoBanco -= valor
u.coins += valor
r.salvar(ctx)
return ctx.reply(ctx.mess.cidadeBanco(c.saldoBanco, u.coins))
}
return ctx.reply(ctx.mess.cidadeBanco(c.saldoBanco, u.coins))
}
}
)
