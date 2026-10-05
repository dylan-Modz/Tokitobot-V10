/*
 * Tokito Bot V10 - Agenda e reinício programado
 * Author: Dylan Modz
 */

const donoSistema = require('../../sistemas/dono')
const dylan = require('../../database/lib/comandos')

const formatarData = tempo => {
return new Date(
Number(tempo)
).toLocaleString(
'pt-BR',
{
timeZone: 'America/Fortaleza',
day: '2-digit',
month: '2-digit',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
}
)
}

const parseData = texto => {
const match =
String(texto || '').match(
/^(\d{2})\/(\d{2})\/(\d{4})\s+([01]\d|2[0-3]):([0-5]\d)$/
)

if (!match)
return null

const [, dia, mes, ano, hora, minuto] =
match

const ms = Date.UTC(
Number(ano),
Number(mes) - 1,
Number(dia),
Number(hora) + 3,
Number(minuto),
0,
0
)

const conferida =
new Date(ms).toLocaleString(
'pt-BR',
{
timeZone: 'America/Fortaleza',
day: '2-digit',
month: '2-digit',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
}
)

const esperado =
`${dia}/${mes}/${ano}, ${hora}:${minuto}`

if (
conferida.replace(' às ', ', ') !== esperado
)
return null

return ms
}

dylan.setCommand({
nome: 'agenda',
comandos: [
'agendar',
'agenda',
'delagenda',
'setrestart',
'checkrestart'
],
categoria: 'dono',
info: {
descricao: 'Agenda lembretes e reinícios automáticos.',
uso: 'agendar 25/10/2026 20:00 | descrição',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

if (ctx.command === 'setrestart') {
const valor =
String(ctx.q || '').trim()

if (
['0', 'off', 'desativar'].includes(
valor.toLowerCase()
)
) {
donoSistema.setRestart({
ativo: false,
destino: ctx.sender
})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🔄',
titulo: 'REINÍCIO PROGRAMADO',
descricao: 'O reinício automático foi desativado.'
})
)
}

if (
!/^([01]\d|2[0-3]):[0-5]\d$/.test(
valor
)
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🔄',
titulo: 'REINÍCIO PROGRAMADO',
uso: `${ctx.prefix}setrestart 04:00`,
exemplos: [
`${ctx.prefix}setrestart 0`
],
descricao: 'Informe um horário no formato HH:MM.'
})
)
}

donoSistema.setRestart({
ativo: true,
hora: valor,
destino: ctx.sender
})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🔄',
titulo: 'REINÍCIO PROGRAMADO',
descricao: `O bot será reiniciado diariamente às ${valor}.`
})
)
}

if (ctx.command === 'checkrestart') {
const cfg =
donoSistema.config().restart

if (!cfg?.ativo) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '🔄',
titulo: 'REINÍCIO PROGRAMADO',
descricao: 'Nenhum reinício automático está ativo.'
})
)
}

const proximo =
donoSistema.proximoRestart()

return ctx.reply(
ctx.mess.padraoInfo({
emoji: '🔄',
titulo: 'REINÍCIO PROGRAMADO',
linhas: [
{
rotulo: '⏰ 𝙷𝙾𝚁𝙰́𝚁𝙸𝙾',
valor: cfg.hora
},
{
rotulo: '📅 𝙿𝚁𝙾́𝚇𝙸𝙼𝙾',
valor: proximo
? formatarData(proximo)
: '—'
}
]
})
)
}

if (ctx.command === 'delagenda') {
const ref =
String(ctx.q || '').trim()

if (!ref) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '⏰',
titulo: 'REMOVER AGENDAMENTO',
uso: `${ctx.prefix}delagenda 1`,
descricao: 'Use o número mostrado em !agenda.'
})
)
}

const resultado =
donoSistema.removerAgenda(ref)

if (!resultado.ok) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '⏰',
titulo: 'AGENDAMENTO',
descricao: 'Agendamento não encontrado.'
})
)
}

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '⏰',
titulo: 'AGENDAMENTO REMOVIDO',
descricao: resultado.item.descricao
})
)
}

const q =
String(ctx.q || '').trim()

if (
ctx.command === 'agenda' ||
!q
) {
const lista =
donoSistema.listarAgendas()

if (!lista.length) {
return ctx.reply(
ctx.mess.padraoLista({
emoji: '⏰',
titulo: 'AGENDA DO DONO',
itens: [],
vazio: 'Nenhum agendamento pendente.'
})
)
}

return ctx.reply(
`- ⏰ \`𝙰𝙶𝙴𝙽𝙳𝙰 𝙳𝙾 𝙳𝙾𝙽𝙾\`

${lista.map((item, i) =>
`> ${i + 1}. ${formatarData(item.quando)}
> 📝 ׄ ( ${item.descricao} )`
).join('\n\n')}`
)
}

const partes =
q.split('|')

const dataTexto =
String(partes.shift() || '').trim()

const descricao =
partes.join('|').trim()

const quando =
parseData(dataTexto)

if (
!quando ||
quando <= Date.now() ||
!descricao
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '⏰',
titulo: 'AGENDAR',
uso: `${ctx.prefix}agendar 25/10/2026 20:00 | Renovar domínio`,
descricao: 'Informe uma data futura, horário e descrição.'
})
)
}

const resultado =
donoSistema.adicionarAgenda({
quando,
descricao,
destino: ctx.sender
})

if (!resultado.ok) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'AGENDAMENTO',
descricao: 'Não foi possível criar o agendamento.'
})
)
}

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '⏰',
titulo: 'AGENDAMENTO CRIADO',
descricao: `${formatarData(quando)} — ${descricao}`
})
)
}
})
