module.exports = {
nome: 'infoplanos',
comandos: ['infoplanos'],
categoria: 'aluguel',

info: {
descricao: 'Mostra como editar os planos de aluguel.',
uso: 'infoplanos',
permissao: 'Dono',
categoria: 'aluguel'
},

async executar(ctx) {
with (ctx) {
if (!SoDono)
return reply(mess.onlyOwner())

return reply(mess.infoplanos(prefix))
}
}
}
