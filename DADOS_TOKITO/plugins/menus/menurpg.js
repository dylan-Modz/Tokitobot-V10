const dylan = require('../../database/lib/comandos')

const extras = prefix => `
╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
├─ ⊹ 𖤐  𝙹𝙾𝚁𝙽𝙰𝙳𝙰-𝙴𝚇𝚃𝚁𝙰𝚂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}jornada
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}classe
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}classe guerreiro
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}aventura
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}descansarheroi
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}historia
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}torre
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}masmorra
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}boss
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}raid @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}arsenal
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}forjar
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}equipar espada
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}guilda
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}criarguilda Nome
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}entrarguilda id
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}sairguilda
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rankguilda
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
├─ ⊹ 𖤐  𝙻𝙴𝚅𝙴𝙻-𝙴𝚇𝚃𝚁𝙰𝚂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}rank
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}blocklevel @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}unblocklevel @usuario
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
├─ ⊹ 𖤐  𝙿𝙴𝚃𝚂-𝙴𝚇𝚃𝚁𝙰𝚂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}lojararos
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mercadopet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}comprarcomida racao
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}petmissao
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}petconstruir
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}petrealeza
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}petbatalha @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}evoluirpet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}eventopet
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}doarpet @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}diariopet
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡

╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
├─ ⊹ 𖤐  𝙿𝙾𝙺𝙴́𝙼𝙾𝙽-𝙴𝚇𝚃𝚁𝙰𝚂
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}mercadopokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}comprarcomidapokemon berry
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}inventariopokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}banhopokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}passearpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}carinhopokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}dormirpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}acordarpokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}eventopokemon
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}batalhapokemon @usuario
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}pokerealeza
┃࣪ ╎—̳͟͞͞ 🧊̸ ${prefix}diariopokemon
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`

dylan.setCommand({
  nome: 'menurpg',
  comandos: ['menurpg'],
  categoria: 'menus',
  info: {
    descricao: 'Mostra os comandos de RPG, Level, Pet e Pokémon.',
    uso: 'menurpg',
    categoria: 'menus'
  },

  async executar(ctx) {
    try {
      const base = ctx.linguagem.menurpg(
        ctx.NomeDoBot,
        ctx.sender,
        ctx.isCargo,
        ctx.isChVip,
        ctx.horaBR,
        ctx.prefix,
        ctx.ownerName,
        ctx.baileysVersion
      )

      return await ctx.dylanModz(
        `${base}\n${extras(ctx.prefix)}`,
        '🎮',
        [
          {
            texto: ctx.mess.botaoMenu(),
            id: `${ctx.prefix}menu`
          }
        ]
      )
    }
    catch (e) {
      console.log('[MENU RPG]', e?.message || e)
      return ctx.reply(ctx.mess.error())
    }
  }
})
