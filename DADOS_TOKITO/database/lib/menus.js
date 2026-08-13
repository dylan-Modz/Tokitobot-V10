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

/*
* Decorações dos menus 
* Author: dylan Modz.
*/

exports.menu = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑂𝑈𝑇𝑅𝑂𝑆-𝑀𝐸𝑁𝑈𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menudown
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menujogos
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menubn
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menurpg
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menucoins
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menuff
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menulogos
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menualt
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menuadm
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}menudono
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐼𝑁𝑇𝐸𝐿𝐼𝐺𝐸̂𝑁𝐶𝐼𝐴-𝐴𝑅𝑇𝐼𝐹𝐼𝐶𝐼𝐴𝐿
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gemini
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gemini-pro
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tokito-ia
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}openai
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}perplexity
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}iaaudio
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}geminitts
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}totext
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐹𝐼𝐺𝑈𝑅𝐼𝑁𝐻𝐴𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}s
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}brat texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bratvid texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}take
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}roubar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rename nome|autor
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}packfig 
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figu 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figuemoji 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figuanime 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figuengracada 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figuriva 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figuflork 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figucoreana 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figubebe 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figuanimais 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figudesenho 5
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}figurimuru 5
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝐶̧𝑂̃𝐸𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}perfil
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}getperfil
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}getbio
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}getbanner
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ping
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}criador
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}idade 23/12/2007
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}totalcmd
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gerarlink 
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menuadm = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐺𝐸𝑅𝐸𝑁𝐶𝐼𝐴𝑅-𝐺𝑅𝑈𝑃𝑂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}grupo a/f
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}fechargp 22:00
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}abrirgp 07:00
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ban @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}promover @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rebaixar @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}limpar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}marcar mensagem
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}hidetag mensagem
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}totag mensagem
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}cita mensagem
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}citar mensagem
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}status
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑀𝑂𝐷𝐸𝑅𝐴𝐶̧𝐴̃𝑂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}adv @usuario motivo
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}deladv @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}advlist
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mute @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}desmute @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mutelist
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}blockcmd comando
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}unblockcmd comando
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}listblock
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}soadm 1/0
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐵𝐸𝑀-𝑉𝐼𝑁𝐷𝑂𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bemvindo
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bemvindo2
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bemvindo3
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}legendabv texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}legendasaiu texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}legendabv2 texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}legendasaiu2 texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}legendabv3 texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}legendasaiu3 texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}fundobv
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}fundosaiu
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delfundos
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}infobemvindos
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐴𝑁𝑇𝐼𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antifake 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antiddd 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antirroubo 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antinotas 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antipalavra 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addpalavra palavra
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delpalavra palavra
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}listapalavra
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antilinkeasy 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antilinkmedium 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antilinkhard 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antipay 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antibot 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antivideo 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antifoto 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antivisu 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antisticker 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}anticontato 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antilocalizacao 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antidocumento 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antiaudio 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antispam 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antistatus 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antimarcacao 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}anticanal 1/0
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑆𝐼𝑆𝑇𝐸𝑀𝐴𝑆-𝐴𝑈𝑇𝑂𝑀𝐴́𝑇𝐼𝐶𝑂𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ativar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}autodl 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}autosticker 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}autortext 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}multiprefix 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addprefix !
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modojogos 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modobn 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modorpg 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modocoins 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modoia 1 texto/audio
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐴𝑇𝐼𝑉𝐼𝐷𝐴𝐷𝐸𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}atividades
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}inativos 0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}inativos 5
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐴𝑃𝑅𝑂𝑉𝐴𝐶̧𝐴̃𝑂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}aprovacao 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}autoaprovacao 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pedidos
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}aprovarpedido número
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}aprovarpedidos
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}recusarpedido número
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}recusarpedidos
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐿𝐼𝑆𝑇𝐴-𝑁𝐸𝐺𝑅𝐴-𝐸-𝐷𝐷𝐷
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addddd 11
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delddd 11
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}listddd
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addlistanegra @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}dellistanegra @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}listanegra
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menudono = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐶𝑂𝑁𝐹𝐼𝐺𝑈𝑅𝐴𝐶̧𝑂̃𝐸𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}verificado
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}detector
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}nome-bot nome
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}nome-dono nome
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}numero-dono @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}dono1 @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}deldono número
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}donos
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}setchannel link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}setprefix !
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}fotomenu
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}botoes 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}reiniciar
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑆𝑌𝑆𝑇𝐸𝑀-𝑁𝑂-𝑃𝑅𝐸𝐹𝐼𝑋
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rgcmd palavra comando
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delcmd palavra
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}noprefix
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑆𝑌𝑆𝑇𝐸𝑀-𝐹𝐼𝐺𝑈𝑅𝐼𝑁𝐻𝐴𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rgfig comando
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delfig
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}listafig
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rgtake nome|autor
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rntake nome|autor
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}take
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}roubar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rename nome|autor
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑆𝑌𝑆𝑇𝐸𝑀-𝐴𝐿𝑈𝐺𝑈𝐸𝐿
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modoaluguel 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rgaluguel dias horas
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delaluguel
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}lista-aluguel
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}veraluguel
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}lojinha
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pixaluguel
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pixcodigo
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐺𝐸𝑅𝐸𝑁𝐶𝐼𝐴𝑅-𝐺𝑅𝑈𝑃𝑂𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}entrar link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}sairgp
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}sairall
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bangp
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}unbangp
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐴́𝑈𝐷𝐼𝑂-𝐷𝑂-𝑀𝐸𝑁𝑈
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}audio-menu
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}fundoaudio
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐵𝐿𝑂𝑄𝑈𝐸𝐼𝑂-𝐺𝐿𝑂𝐵𝐴𝐿
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}blockuser @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}unblockuser @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}antipv 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}visualizarmsg 1/0
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑉𝐼𝑃
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addvip @usuario/dias
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delvip @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}viplist
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}limparvip
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addcmdvip comando
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}delcmdvip comando
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}listcmdvip
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menudown = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑌𝑂𝑈𝑇𝑈𝐵𝐸
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}play música
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}play_audio música
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}playvideo música
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}playdoc música
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ytsearch pesquisa
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑅𝐸𝐷𝐸𝑆-𝑆𝑂𝐶𝐼𝐴𝐼𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tiktok link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tiktok_audio link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tiktok_foto link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}instagram link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}instagram_audio link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}facebook link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}face_audio link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}twitter link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}twitter_audio link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}kwai link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}kwaiaudio link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pinterestvideo link
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑀𝑈́𝑆𝐼𝐶𝐴
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}deezer música
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}soundcloud música
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}sound_audio música
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}applemusic link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}apple_audio link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}spotify link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}spotify_audio link
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐴𝑃𝑃𝑆-𝐸-𝐴𝑅𝑄𝑈𝐼𝑉𝑂𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mediafire link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mega link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gitclone link
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}aptoide app
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}happymod app
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}playstore app
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}capcut link
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menujogos = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐽𝑂𝐺𝑂𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}jogodavelha @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}dama @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}forca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}cacapalavras
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}adivinhe
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}quiz
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}Akinator 
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mines
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ppt pedra/papel/tesoura
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐽𝑂𝐺𝑂𝑆-𝐵𝑁
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}vab
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}eununca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}vord verdade/desafio
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑅𝐸𝑆𝐸𝑇𝐴𝑅-𝐽𝑂𝐺𝑂𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}resetvelha
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}resetdama
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}resetforca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}resetcaca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}resetadivinhe
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}resetquiz
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}resetmines
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menubn = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion, isModobn) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑀𝐸𝑁𝑈-𝐵𝑁 ${isModobn ? '🟢' : '🔴'}
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}vab
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}eununca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}vord verdade/desafio
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}chance pergunta
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}quando pergunta
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mencionar corno
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐶𝐴𝑆𝐴𝐿-𝑊𝐸𝐵
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}namorar @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}aceitar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}recusar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}cancelar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}terminar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}minhadupla
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}meunoivo
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}minhanoiva
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}casais
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}casar @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}meucasamento
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}divorciar
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑀𝐸𝐷𝐼𝐷𝑂𝑅𝐸𝑆-𝐸-𝑍𝑂𝐸𝐼𝑅𝐴
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}lindo @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}linda @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}fiel @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gay @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}feio @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}corno @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}vesgo @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bebado @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gado @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gostoso @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gostosa @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}sigma @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}fumar @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}beta @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}baiano @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}baiana @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}carioca @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}louco @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}louca @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}safada @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}safado @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}macaco @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}macaca @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}puta @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}nazista @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}dogolpe @usuario
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐼𝑁𝑇𝐸𝑅𝐴𝑇𝐼𝑉𝑂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}beijo @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}abraco @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tapa @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}chute @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}soco @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}matar @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}carinho @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}morder @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tirarft @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}lavarlouca @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}comer @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}capinarlote @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pgpeito @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pgpau @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}sentar @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pgbunda @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}leitada @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}boquete @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}cagar @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}surubao
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}casal @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}death @usuario
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐶𝐴𝐿𝐶𝑈𝐿𝐴𝐷𝑂𝑅𝐸𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}obesidade 70/1.75
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}contardias 31/03/2024
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑅𝐴𝑁𝐾'𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankgay
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankgado
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankcorno
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankgostoso
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankgostosa
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ranknazista
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankotaku
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankfumar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankpau
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ranksigma
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankbeta
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankbaiano
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankbaiana
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankcarioca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ranksafado
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ranksafada
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ranklouco
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ranklouca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankmacaco
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankmacaca
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankputa
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankcu
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankbct
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankfalido
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankcasal
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menurpg = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐿𝐸𝑉𝐸𝐿
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}level
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}ranklevel
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modorpg 1/0
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addxp @usuario 100
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tirarxp @usuario 100
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addlevel @usuario 1
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}tirarlevel @usuario 1
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑃𝐸𝑇𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}petshop
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}comprarpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}verpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}alimentarpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}carinhopet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}banhopet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}passearpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}dormirpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}acordarpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}apelidopet nome
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}venderpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankpets
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑃𝑂𝐾𝐸́𝑀𝑂𝑁
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}lojapokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}comprarpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}verpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}alimentarpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}apelidopokemon nome
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}evoluirpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}missaopokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}venderpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankpokemon
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menucoins = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑁-𝐶𝑂𝐼𝑁𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}coins
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}minerar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankcoins
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}doarcoins 100 @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}modocoins 1/0
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐶𝐼𝐷𝐴𝐷𝐸
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}registrarcidade nome
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}perfilcidade
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}trabalhar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}depositar valor
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}sacar valor
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}banco
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐺𝐸𝑅𝐸𝑁𝐶𝐼𝐴𝑅-𝐶𝑂𝐼𝑁𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}addcoins @usuario valor
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}removecoins @usuario valor
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menuff = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐿𝐼𝐾𝐸𝑆-𝐹𝐹
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}likes UID
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}autolike UID
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}autolike del UID
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝑆𝐴𝐿𝐴𝑆-𝐹𝐹
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}criarsala NOME|SENHA|12|1|BR
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}versala SESSION_ID
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}jogadoressala SESSION_ID
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}expulsarsala SESSION_ID|UID
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}iniciarsala SESSION_ID
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pararsala SESSION_ID
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}statussalas
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menulogos = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐿𝑂𝐺𝑂𝑆-1-𝑇𝐸𝑋𝑇𝑂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}darkgreen texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}glitch texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}write texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}advancedglow texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}typography texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pixelglitch texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}neonglitch texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}flag texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}flag3d texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}blackpink texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}glowing texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}underwater texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}cartoon texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}papercut texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}watercolor texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}gradient texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}galaxy texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}frozen texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}metal3d texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}naruto texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}amongus texto
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}comic3d texto
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐿𝑂𝐺𝑂𝑆-2-𝑇𝐸𝑋𝑇𝑂𝑆
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pornhub texto1|texto2
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}deadpool texto1|texto2
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}thor texto1|texto2
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}captainamerica texto1|texto2
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}

exports.menualt = (NomeDoBot, sender, isCargo, isChVip, hora, prefix, ownerName, baileysVersion) => {
return `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙾𝚃: ${NomeDoBot}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝚁𝙸𝙰𝙳𝙾𝚁: ${ownerName}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚄𝚂𝚄Á𝚁𝙸𝙾: @${sender.split('@')[0]}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙲𝙰𝚁𝙶𝙾: ${isCargo}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝚅𝙸𝙿: ${isChVip}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙷𝙾𝚁𝙰: ${hora}
┃࣪ ╎—̳͟͞͞ 🧊̸̸ 𝙱𝙰𝙸𝙻𝙴𝚈𝚂: ${baileysVersion}
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐴𝐿𝑇𝐸𝑅𝐴𝐷𝑂𝑅𝐸𝑆-𝐷𝐸-𝑉𝐼́𝐷𝐸𝑂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}videolento
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}videorapido
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}videocontrario
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├─ ⊹ 𖤐  𝐴𝐿𝑇𝐸𝑅𝐴𝐷𝑂𝑅𝐸𝑆-𝐷𝐸-𝐴́𝑈𝐷𝐼𝑂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}audiolento
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}audiorapido
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}speedup
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}slowed
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}grave
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}grave2
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}esquilo
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}estourar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bass
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}bass2
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}vozmenino
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`
}
