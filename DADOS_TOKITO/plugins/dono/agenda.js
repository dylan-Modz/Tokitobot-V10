/*
 * Tokito Bot V10 - Agenda do dono
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
'delagenda'
],
categoria: 'dono',
info: {
descricao: 'Agenda lembretes do dono.',
uso: 'agendar 25/10/2026 20:00 | descrição',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

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
