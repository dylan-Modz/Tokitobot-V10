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

const base = require('../funcoes/base.js')

const garantir = dados => {
if (!Array.isArray(dados) || !dados[0])
return dados
if (!dados[0].advertencias || typeof dados[0].advertencias !== 'object' || Array.isArray(dados[0].advertencias))
dados[0].advertencias = {}
return dados
}

const registro = (dados, jid) => {
garantir(dados)
const chave = base.normalizar(jid)
if (!dados[0].advertencias[chave])
dados[0].advertencias[chave] = {
quantidade: 0,
historico: []
}
const item = dados[0].advertencias[chave]
if (!Array.isArray(item.historico))
item.historico = []
item.quantidade = Number(item.quantidade || 0)
return {
chave,
item
}
}

const adicionar = ({ dataGp, setGp, grupo, jid, motivo = 'Violação das regras', autor = 'sistema' }) => {
let dados = Array.isArray(dataGp) ? dataGp : base.lerGrupo(grupo)
const { chave, item } = registro(dados, jid)
item.quantidade += 1
item.historico.push({
motivo: String(motivo || 'Violação das regras').slice(0, 300),
autor: String(autor || 'sistema'),
data: new Date().toISOString()
})
if (item.historico.length > 20)
item.historico = item.historico.slice(-20)
if (typeof setGp === 'function')
setGp(dados)
else if (grupo)
base.salvarGrupo(grupo, dados)
return {
jid: chave,
quantidade: item.quantidade,
limite: 3,
remove: item.quantidade >= 3,
item,
dados
}
}

const remover = ({ dataGp, setGp, grupo, jid, tudo = false }) => {
let dados = Array.isArray(dataGp) ? dataGp : base.lerGrupo(grupo)
garantir(dados)
const chave = base.normalizar(jid)
const item = dados[0].advertencias[chave]
if (!item)
return {
ok: false,
quantidade: 0
}
if (tudo || Number(item.quantidade || 0) <= 1)
delete dados[0].advertencias[chave]
else {
item.quantidade -= 1
if (Array.isArray(item.historico) && item.historico.length)
item.historico.pop()
}
if (typeof setGp === 'function')
setGp(dados)
else if (grupo)
base.salvarGrupo(grupo, dados)
return {
ok: true,
quantidade: Number(dados[0].advertencias[chave]?.quantidade || 0)
}
}

const listar = dataGp => {
garantir(dataGp)
return Object.entries(dataGp?.[0]?.advertencias || {}).map(([jid, item]) => ({
jid,
quantidade: Number(item?.quantidade || 0),
historico: Array.isArray(item?.historico) ? item.historico : []
})).filter(x => x.quantidade > 0).sort((a, b) => b.quantidade - a.quantidade)
}

module.exports = {
garantir,
adicionar,
remover,
listar
}
