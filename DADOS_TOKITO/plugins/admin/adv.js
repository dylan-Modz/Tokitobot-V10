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

const adv = require('../../sistemas/advertencias')
const hierarquia = require('../../sistemas/hierarquia.js')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'adv',
comandos: ['adv', 'advertir', 'advertencia'],
categoria: 'admin',
info: {
descricao: 'Aplica uma advertência a um membro. Com 3 advertências o membro é removido.',
uso: 'adv @usuario motivo',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
const { isGroup, isGroupAdmins, isBotGroupAdmins, SoDono, menc_jid2, menc_prt, q, sender, dataGp, setGp, reply, mess, tokito, from, canalInfo, selo, normalizar } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isBotGroupAdmins)
return reply(mess.botadm())
const destino = normalizar((menc_jid2 || [])[0] || menc_prt || '')
if (!destino)
return reply(mess.advUso(ctx.prefix))

const permissao = await hierarquia.advertencia(ctx, destino)
if (!permissao.ok) {
if (permissao.motivo === 'sem_permissao')
return reply(mess.soadm())
if (permissao.motivo === 'proprio_usuario')
return reply(mess.advMesmo())
const mensagens = {
indisponivel: 'Não consegui consultar os cargos atuais do grupo. Nenhuma advertência foi aplicada.',
fora_do_grupo: 'O usuário não foi encontrado na lista atual de participantes do grupo.',
dono_protegido: 'O dono do grupo, os donos do bot e o próprio bot não podem receber advertências.',
admin_protegido: 'Apenas o dono do grupo ou do bot pode advertir administradores.'
}
return reply(mess.padraoAviso({
emoji: '🛡️',
titulo: 'ADV NÃO PERMITIDA',
descricao: mensagens[permissao.motivo] || 'Você não tem permissão para aplicar essa advertência.'
}))
}

const alvo = permissao.alvo
const motivo = String(q || '').replace(/@\S+/g, '').trim() || 'Não informado'
const r = adv.adicionar({
dataGp,
setGp,
grupo: from,
jid: alvo,
motivo,
autor: sender
})
let removido = false
if (r.remove) {
try {
const resposta = await tokito.groupParticipantsUpdate(from, [alvo], 'remove')
const status = Array.isArray(resposta) ? resposta[0]?.status : resposta?.status
removido = !status || /^2/.test(String(status))
} catch (error) {
console.log('[ADV] Falha ao remover após 3 advertências:', error?.message || error)
}
}
const aviso = mess.advAplicada(alvo, r.quantidade, r.limite, motivo, removido) +
(r.remove && !removido ? '\n> ⚠️ ׄ ( ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇᴍᴏᴠᴇʀ ᴏ ᴜsᴜᴀ́ʀɪᴏ. )' : '')
await tokito.sendMessage(from, {
text: aviso,
contextInfo: canalInfo([alvo, sender])
}, { quoted: selo })
}
}
)
