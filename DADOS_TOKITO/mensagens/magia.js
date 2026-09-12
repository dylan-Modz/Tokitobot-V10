/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Sistema : RPG de Magia
 *  Dev     : Dylan Modz
 * ============================================================
 */

const linha = (emoji, titulo, valor) => `> *『 ${emoji} ${titulo} 』— ${valor}*`
const nome = valor => String(valor || '').trim() || 'Desconhecido'
const numero = valor => Number(valor || 0).toLocaleString('pt-BR')
const tempo = ms => {
  const total = Math.max(0, Math.ceil(Number(ms || 0) / 1000))
  const min = Math.floor(total / 60)
  const seg = total % 60
  return min ? `${min}m ${seg}s` : `${seg}s`
}

exports.magiaModoDesligado = prefix => `- 🔮 \`𝚁𝙿𝙶 𝙳𝙴 𝙼𝙰𝙶𝙸𝙰\`

${linha('⚠️', '𝚂𝚃𝙰𝚃𝚄𝚂', 'ᴏ ᴍᴏᴅᴏ ʀᴘɢ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ.')}
${linha('📌', '𝙰𝚃𝙸𝚅𝙰𝚁', `ᴜsᴇ ${prefix}modorpg 1.`)}`

exports.magiaNaoDesperta = prefix => `- ✨ \`𝙳𝙴𝚂𝙿𝙴𝚁𝚃𝙰𝚁 𝙼𝙰𝙶𝙸𝙰\`

${linha('🔒', '𝚂𝚃𝙰𝚃𝚄𝚂', 'sᴇᴜ ᴘᴏᴅᴇʀ ᴍᴀ́ɢɪᴄᴏ ᴀɪɴᴅᴀ ɴᴀ̃ᴏ ғᴏɪ ᴅᴇsᴘᴇʀᴛᴀᴅᴏ.')}
${linha('✨', '𝙲𝙾𝙼𝙴𝙲̧𝙰𝚁', `ᴜsᴇ ${prefix}despertarmagia.`)}`

exports.magiaJaDesperta = prefix => `- ✨ \`𝙼𝙰𝙶𝙸𝙰 𝙳𝙴𝚂𝙿𝙴𝚁𝚃𝙰\`

${linha('✅', '𝚂𝚃𝙰𝚃𝚄𝚂', 'ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴅᴇsᴘᴇʀᴛᴏᴜ sᴇᴜ ᴘᴏᴅᴇʀ.')}
${linha('🧙', '𝙿𝙴𝚁𝙵𝙸𝙻', `ᴜsᴇ ${prefix}magoperfil.`)}`

exports.magiaDespertada = m => `- ✨ \`𝙳𝙴𝚂𝙿𝙴𝚁𝚃𝙰𝚁 𝙼𝙰𝙶𝙸𝙰\`

${linha('✅', '𝚂𝚃𝙰𝚃𝚄𝚂', 'sᴇᴜ ᴘᴏᴅᴇʀ ᴍᴀ́ɢɪᴄᴏ ғᴏɪ ᴅᴇsᴘᴇʀᴛᴀᴅᴏ.')}
${linha('🧙', '𝙲𝙻𝙰𝚂𝚂𝙴', nome(m.classe))}
${linha('🌌', '𝙴𝙻𝙴𝙼𝙴𝙽𝚃𝙾', nome(m.elemento))}
${linha('🔮', '𝙼𝙰𝙽𝙰', `${m.mana}/${m.manaMax}`)}
${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', numero(m.cristais))}
${linha('📖', '𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾', 'Faísca Arcana')}`

exports.magiaMenu = prefix => `- 🔮 \`𝙼𝙴𝙽𝚄 𝙳𝙰 𝙼𝙰𝙶𝙸𝙰\`

${linha('🧙', '𝙿𝙴𝚁𝙵𝙸𝙻', `${prefix}magoperfil`)}
${linha('✨', '𝙳𝙴𝚂𝙿𝙴𝚁𝚃𝙰𝚁', `${prefix}despertarmagia`)}
${linha('🎓', '𝙲𝙻𝙰𝚂𝚂𝙴', `${prefix}classemagica`)}
${linha('🌌', '𝙴𝙻𝙴𝙼𝙴𝙽𝚃𝙾', `${prefix}elementomagico`)}
${linha('🔮', '𝙼𝙰𝙽𝙰', `${prefix}manamagica`)}
${linha('📚', '𝙶𝚁𝙸𝙼𝙾́𝚁𝙸𝙾', `${prefix}grimoriomagico`)}
${linha('🪄', '𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾𝚂', `${prefix}feiticosmagicos`)}
${linha('🧪', '𝙰𝙻𝚀𝚄𝙸𝙼𝙸𝙰', `${prefix}alquimiamagica`)}
${linha('🐉', '𝙵𝙰𝙼𝙸𝙻𝙸𝙰𝚁', `${prefix}familiarmagico`)}
${linha('⚔️', '𝙰𝚁𝙴𝙽𝙰', `${prefix}arenamagica`)}
${linha('🗼', '𝚃𝙾𝚁𝚁𝙴', `${prefix}torremagia`)}
${linha('🏰', '𝙶𝚄𝙸𝙻𝙳𝙰', `${prefix}guildamagica`)}
${linha('🏪', '𝙻𝙾𝙹𝙰', `${prefix}lojamagia`)}
${linha('🎁', '𝚁𝙴𝙲𝙾𝙼𝙿𝙴𝙽𝚂𝙰𝚂', `${prefix}diariomagico`)}
${linha('🏆', '𝚁𝙰𝙽𝙺', `${prefix}rankmagia`)}`

exports.magiaPerfil = ({ jid, m, poder, pos }) => `- 🧙 \`𝙿𝙴𝚁𝙵𝙸𝙻 𝙼𝙰́𝙶𝙸𝙲𝙾\`

${linha('👤', '𝙼𝙰𝙶𝙾', `@${String(jid || '').split('@')[0]}`)}
${linha('⭐', '𝙽𝙸́𝚅𝙴𝙻', numero(m.nivel))}
${linha('✨', '𝚇𝙿', numero(m.xp))}
${linha('🧙', '𝙲𝙻𝙰𝚂𝚂𝙴', nome(m.classe))}
${linha('🌌', '𝙴𝙻𝙴𝙼𝙴𝙽𝚃𝙾', nome(m.elemento))}
${linha('🔮', '𝙼𝙰𝙽𝙰', `${m.mana}/${m.manaMax}`)}
${linha('⚔️', '𝙿𝙾𝙳𝙴𝚁', numero(poder))}
${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', numero(m.cristais))}
${linha('🪙', '𝙾𝚄𝚁𝙾 𝙰𝚁𝙲𝙰𝙽𝙾', numero(m.ouroArcano))}
${linha('🏆', '𝚁𝙰𝙽𝙺', `#${pos || '-'}`)}`

exports.magiaLista = (titulo, itens, rodape = '') => `- 🔮 \`${titulo}\`

${itens.map(x => `> *『 • 』— ${x}*`).join('\n')}${rodape ? `\n\n${rodape}` : ''}`

exports.magiaClasseAtualizada = classe => `- 🎓 \`𝙲𝙻𝙰𝚂𝚂𝙴 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('✅', '𝙲𝙻𝙰𝚂𝚂𝙴', nome(classe))}
${linha('✨', '𝚂𝚃𝙰𝚃𝚄𝚂', 'sᴜᴀ ᴄʟᴀssᴇ ғᴏɪ ᴅᴇғɪɴɪᴅᴀ.')}`

exports.magiaElementoAtualizado = elemento => `- 🌌 \`𝙰𝙵𝙸𝙽𝙸𝙳𝙰𝙳𝙴 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('✅', '𝙴𝙻𝙴𝙼𝙴𝙽𝚃𝙾', nome(elemento))}
${linha('✨', '𝚂𝚃𝙰𝚃𝚄𝚂', 'sᴜᴀ ᴀғɪɴɪᴅᴀᴅᴇ ғᴏɪ ᴅᴇғɪɴɪᴅᴀ.')}`

exports.magiaMana = m => `- 🔮 \`𝙼𝙰𝙽𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('💠', '𝙰𝚃𝚄𝙰𝙻', `${m.mana}/${m.manaMax}`)}
${linha('⏳', '𝚁𝙴𝙶𝙴𝙽𝙴𝚁𝙰𝙲̧𝙰̃𝙾', '1 ᴘᴏɴᴛᴏ ᴘᴏʀ ᴍɪɴᴜᴛᴏ.')}
${linha('🧪', '𝙿𝙾𝙲̧𝙰̃𝙾', 'ᴜsᴇ pocaomagica mana.')}`

exports.magiaAprendida = f => `- 📖 \`𝙽𝙾𝚅𝙾 𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾\`

${linha('✅', '𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾', f.nome)}
${linha('🌌', '𝙴𝙻𝙴𝙼𝙴𝙽𝚃𝙾', f.elemento)}
${linha('👑', '𝚁𝙰𝚁𝙸𝙳𝙰𝙳𝙴', f.raridade)}
${linha('⚔️', '𝙿𝙾𝙳𝙴𝚁', numero(f.poder))}`

exports.magiaConjurada = ({ f, dano, mana, xp, alvo }) => `- 🪄 \`𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾 𝙲𝙾𝙽𝙹𝚄𝚁𝙰𝙳𝙾\`

${linha('✨', '𝙼𝙰𝙶𝙸𝙰', f.nome)}
${linha('🎯', '𝙰𝙻𝚅𝙾', alvo || 'Energia ambiente')}
${linha('💥', '𝙴𝙵𝙴𝙸𝚃𝙾', numero(dano))}
${linha('🔮', '𝙼𝙰𝙽𝙰', `-${f.custoMana} • ${mana} restante`)}
${linha('⭐', '𝚇𝙿', `+${xp}`)}`

exports.magiaEquipadas = lista => `- 🪄 \`𝙼𝙰𝙶𝙸𝙰𝚂 𝙴𝚀𝚄𝙸𝙿𝙰𝙳𝙰𝚂\`

${lista.length ? lista.map((x, i) => linha(`${i + 1}️⃣`, '𝚂𝙻𝙾𝚃', x)).join('\n') : linha('⚠️', '𝚂𝚃𝙰𝚃𝚄𝚂', 'ɴᴇɴʜᴜᴍᴀ ᴍᴀɢɪᴀ ᴇǫᴜɪᴘᴀᴅᴀ.')}`

exports.magiaMelhorada = (f, nivel, custo) => `- ⬆️ \`𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾 𝙼𝙴𝙻𝙷𝙾𝚁𝙰𝙳𝙾\`

${linha('✨', '𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾', f.nome)}
${linha('⭐', '𝙽𝙸́𝚅𝙴𝙻', nivel)}
${linha('💎', '𝙲𝚄𝚂𝚃𝙾', custo)}`

exports.magiaFundida = (a, b, bonus) => `- 🌀 \`𝙵𝚄𝚂𝙰̃𝙾 𝙰𝚁𝙲𝙰𝙽𝙰\`

${linha('🪄', '𝙱𝙰𝚂𝙴', a)}
${linha('🪄', '𝙲𝙰𝚃𝙰𝙻𝙸𝚂𝙰𝙳𝙾𝚁', b)}
${linha('⚔️', '𝙱𝙾̂𝙽𝚄𝚂', `+${bonus} ᴅᴇ ᴘᴏᴅᴇʀ ᴛᴇᴍᴘᴏʀᴀ́ʀɪᴏ`)}
${linha('💎', '𝙲𝚄𝚂𝚃𝙾', '75 ᴄʀɪsᴛᴀɪs')}`

exports.magiaArtefatoEquipado = a => `- 🗿 \`𝙰𝚁𝚃𝙴𝙵𝙰𝚃𝙾 𝙴𝚀𝚄𝙸𝙿𝙰𝙳𝙾\`

${linha('✅', '𝙸𝚃𝙴𝙼', a.nome)}
${linha('⚔️', '𝙱𝙾̂𝙽𝚄𝚂', `+${a.poder} ᴅᴇ ᴘᴏᴅᴇʀ`)}`

exports.magiaEncantado = (a, bonus, custo) => `- ✨ \`𝙴𝙽𝙲𝙰𝙽𝚃𝙰𝙼𝙴𝙽𝚃𝙾\`

${linha('🗿', '𝙰𝚁𝚃𝙴𝙵𝙰𝚃𝙾', a.nome)}
${linha('⚔️', '𝙴𝙽𝙲𝙰𝙽𝚃𝙾', `+${bonus}`)}
${linha('💎', '𝙲𝚄𝚂𝚃𝙾', custo)}`

exports.magiaPocao = (p, quantidade) => `- 🧪 \`𝙿𝙾𝙲̧𝙰̃𝙾 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('✅', '𝙿𝙾𝙲̧𝙰̃𝙾', p.nome)}
${linha('✨', '𝙴𝙵𝙴𝙸𝚃𝙾', p.efeito)}
${linha('🎒', '𝚁𝙴𝚂𝚃𝙰𝙽𝚃𝙴', quantidade)}`

exports.magiaFabricou = (p, quantidade) => `- ⚗️ \`𝙰𝙻𝚀𝚄𝙸𝙼𝙸𝙰\`

${linha('✅', '𝙲𝚁𝙸𝙰𝙳𝙾', p.nome)}
${linha('🎒', '𝚀𝚄𝙰𝙽𝚃𝙸𝙳𝙰𝙳𝙴', quantidade)}
${linha('💎', '𝙸𝙽𝚅𝙴𝙽𝚃𝙰́𝚁𝙸𝙾', 'ɪᴛᴇᴍ ᴀᴅɪᴄɪᴏɴᴀᴅᴏ.')}`

exports.magiaFamiliar = ({ f, nivel, ativo }) => `- 🐉 \`𝙵𝙰𝙼𝙸𝙻𝙸𝙰𝚁 𝙼𝙰́𝙶𝙸𝙲𝙾\`

${linha('🐾', '𝙲𝚁𝙸𝙰𝚃𝚄𝚁𝙰', f.nome)}
${linha('⭐', '𝙽𝙸́𝚅𝙴𝙻', nivel)}
${linha('⚔️', '𝙱𝙾̂𝙽𝚄𝚂', `+${f.poder} ᴅᴇ ᴘᴏᴅᴇʀ`)}
${linha('💠', '𝚂𝚃𝙰𝚃𝚄𝚂', ativo ? 'ᴀᴛɪᴠᴏ' : 'ɢᴜᴀʀᴅᴀᴅᴏ')}`

exports.magiaInvocou = f => `- 🌀 \`𝙸𝙽𝚅𝙾𝙲𝙰𝙲̧𝙰̃𝙾\`

${linha('🐉', '𝙲𝚁𝙸𝙰𝚃𝚄𝚁𝙰', f.nome)}
${linha('👑', '𝚁𝙰𝚁𝙸𝙳𝙰𝙳𝙴', f.raridade)}
${linha('⚔️', '𝙿𝙾𝙳𝙴𝚁', `+${f.poder}`)}`

exports.magiaFamiliarEvoluiu = (f, nivel) => `- 🐲 \`𝙴𝚅𝙾𝙻𝚄𝙲̧𝙰̃𝙾 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('🐉', '𝙵𝙰𝙼𝙸𝙻𝙸𝙰𝚁', f.nome)}
${linha('⭐', '𝙽𝙸́𝚅𝙴𝙻', nivel)}
${linha('✨', '𝚂𝚃𝙰𝚃𝚄𝚂', 'ᴏ ᴠɪ́ɴᴄᴜʟᴏ ᴍᴀ́ɢɪᴄᴏ ғɪᴄᴏᴜ ᴍᴀɪs ғᴏʀᴛᴇ.')}`

exports.magiaCapturou = (f, sucesso) => `- 🐾 \`𝙲𝙰𝙿𝚃𝚄𝚁𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha(sucesso ? '✅' : '❌', '𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾', sucesso ? `${f.nome} ғᴏɪ ᴠɪɴᴄᴜʟᴀᴅᴏ ᴀᴏ sᴇᴜ ɢʀɪᴍᴏ́ʀɪᴏ.` : `${f.nome} ᴇsᴄᴀᴘᴏᴜ.`)}`

exports.magiaDuelo = ({ eu, alvo, meuPoder, poderAlvo, vencedor, recompensa }) => `- ⚔️ \`𝙳𝚄𝙴𝙻𝙾 𝙳𝙴 𝙼𝙰𝙶𝙾𝚂\`

${linha('🧙', '𝙼𝙰𝙶𝙾 𝟷', `@${String(eu).split('@')[0]} • ${meuPoder}`)}
${linha('🧙', '𝙼𝙰𝙶𝙾 𝟸', `@${String(alvo).split('@')[0]} • ${poderAlvo}`)}
${linha('🏆', '𝚅𝙴𝙽𝙲𝙴𝙳𝙾𝚁', `@${String(vencedor).split('@')[0]}`)}
${linha('💎', '𝚁𝙴𝙲𝙾𝙼𝙿𝙴𝙽𝚂𝙰', `+${recompensa} ᴄʀɪsᴛᴀɪs`)}`

exports.magiaBatalha = ({ inimigo, meuPoder, poderInimigo, venceu, xp, cristais }) => `- ⚔️ \`𝙱𝙰𝚃𝙰𝙻𝙷𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('👹', '𝙸𝙽𝙸𝙼𝙸𝙶𝙾', inimigo)}
${linha('🧙', '𝚂𝙴𝚄 𝙿𝙾𝙳𝙴𝚁', meuPoder)}
${linha('💀', '𝙿𝙾𝙳𝙴𝚁 𝙸𝙽𝙸𝙼𝙸𝙶𝙾', poderInimigo)}
${linha(venceu ? '🏆' : '💥', '𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾', venceu ? 'ᴠɪᴛᴏ́ʀɪᴀ' : 'ᴅᴇʀʀᴏᴛᴀ')}
${linha('⭐', '𝚇𝙿', `+${xp}`)}
${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', `+${cristais}`)}`

exports.magiaTorre = (andar, poder) => `- 🗼 \`𝚃𝙾𝚁𝚁𝙴 𝙰𝚁𝙲𝙰𝙽𝙰\`

${linha('🏰', '𝙰𝙽𝙳𝙰𝚁', andar)}
${linha('⚔️', '𝙿𝙾𝙳𝙴𝚁 𝚁𝙴𝙲𝙾𝙼𝙴𝙽𝙳𝙰𝙳𝙾', poder)}
${linha('📌', '𝙰𝚅𝙰𝙽𝙲̧𝙰𝚁', 'ᴜsᴇ andarmagia.')}`

exports.magiaAndar = ({ andar, venceu, poderInimigo, xp, cristais }) => `- 🗼 \`𝙳𝙴𝚂𝙰𝙵𝙸𝙾 𝙳𝙰 𝚃𝙾𝚁𝚁𝙴\`

${linha('🏰', '𝙰𝙽𝙳𝙰𝚁', andar)}
${linha('👹', '𝙿𝙾𝙳𝙴𝚁 𝙸𝙽𝙸𝙼𝙸𝙶𝙾', poderInimigo)}
${linha(venceu ? '🏆' : '💥', '𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾', venceu ? 'ᴀɴᴅᴀʀ ᴄᴏɴǫᴜɪsᴛᴀᴅᴏ' : 'ᴠᴏᴄᴇ̂ ғᴏɪ ᴅᴇʀʀᴏᴛᴀᴅᴏ')}
${linha('⭐', '𝚇𝙿', `+${xp}`)}
${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', `+${cristais}`)}`

exports.magiaBoss = ({ boss, poderBoss, venceu, xp, cristais }) => `- 👹 \`𝙱𝙾𝚂𝚂 𝙼𝙰́𝙶𝙸𝙲𝙾\`

${linha('💀', '𝙲𝙷𝙴𝙵𝙴', boss)}
${linha('⚔️', '𝙿𝙾𝙳𝙴𝚁', poderBoss)}
${linha(venceu ? '🏆' : '💥', '𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾', venceu ? 'ʙᴏss ᴅᴇʀʀᴏᴛᴀᴅᴏ' : 'ᴏ ʙᴏss ᴠᴇɴᴄᴇᴜ')}
${linha('⭐', '𝚇𝙿', `+${xp}`)}
${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', `+${cristais}`)}`

exports.magiaRecompensa = ({ titulo, descricao, xp = 0, cristais = 0, ouro = 0 }) => `- ✨ \`${titulo}\`

${linha('📜', '𝙴𝚅𝙴𝙽𝚃𝙾', descricao)}
${linha('⭐', '𝚇𝙿', `+${xp}`)}
${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', `+${cristais}`)}
${linha('🪙', '𝙾𝚄𝚁𝙾', `+${ouro}`)}`

exports.magiaPortal = (origem, destino, custo) => `- 🌀 \`𝙿𝙾𝚁𝚃𝙰𝙻 𝙼𝙰́𝙶𝙸𝙲𝙾\`

${linha('📍', '𝙾𝚁𝙸𝙶𝙴𝙼', origem)}
${linha('🌌', '𝙳𝙴𝚂𝚃𝙸𝙽𝙾', destino)}
${linha('🔮', '𝙲𝚄𝚂𝚃𝙾', `${custo} ᴍᴀɴᴀ`)}`

exports.magiaGuilda = ({ nomeGuilda, membros, poder, dono }) => `- 🏰 \`𝙶𝚄𝙸𝙻𝙳𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('🛡️', '𝙽𝙾𝙼𝙴', nome(nomeGuilda))}
${linha('👑', '𝙻𝙸́𝙳𝙴𝚁', dono ? `@${String(dono).split('@')[0]}` : '-')}
${linha('👥', '𝙼𝙴𝙼𝙱𝚁𝙾𝚂', membros)}
${linha('⚔️', '𝙿𝙾𝙳𝙴𝚁', numero(poder))}`

exports.magiaGuildaCriada = (nomeGuilda, id) => `- 🏰 \`𝙶𝚄𝙸𝙻𝙳𝙰 𝙲𝚁𝙸𝙰𝙳𝙰\`

${linha('✅', '𝙽𝙾𝙼𝙴', nomeGuilda)}
${linha('🆔', '𝙸𝙳', id)}
${linha('👑', '𝚂𝚃𝙰𝚃𝚄𝚂', 'ᴠᴏᴄᴇ̂ ᴇ́ ᴏ ʟɪ́ᴅᴇʀ.')}`

exports.magiaGuildaEntrou = nomeGuilda => `- 🤝 \`𝙶𝚄𝙸𝙻𝙳𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('✅', '𝙶𝚄𝙸𝙻𝙳𝙰', nomeGuilda)}
${linha('👥', '𝚂𝚃𝙰𝚃𝚄𝚂', 'ᴠᴏᴄᴇ̂ ᴇɴᴛʀᴏᴜ ɴᴀ ɢᴜɪʟᴅᴀ.')}`

exports.magiaGuildaSaiu = nomeGuilda => `- 🚪 \`𝙶𝚄𝙸𝙻𝙳𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('✅', '𝙶𝚄𝙸𝙻𝙳𝙰', nomeGuilda)}
${linha('🚪', '𝚂𝚃𝙰𝚃𝚄𝚂', 'ᴠᴏᴄᴇ̂ sᴀɪᴜ ᴅᴀ ɢᴜɪʟᴅᴀ.')}`

exports.magiaCompra = (item, preco, saldo) => `- 🛍️ \`𝙲𝙾𝙼𝙿𝚁𝙰 𝙰𝚁𝙲𝙰𝙽𝙰\`

${linha('✅', '𝙸𝚃𝙴𝙼', item)}
${linha('🪙', '𝙿𝚁𝙴𝙲̧𝙾', preco)}
${linha('💰', '𝚂𝙰𝙻𝙳𝙾', saldo)}`

exports.magiaVenda = (item, valor, saldo) => `- 💰 \`𝚅𝙴𝙽𝙳𝙰 𝙰𝚁𝙲𝙰𝙽𝙰\`

${linha('✅', '𝙸𝚃𝙴𝙼', item)}
${linha('🪙', '𝚅𝙰𝙻𝙾𝚁', valor)}
${linha('💰', '𝚂𝙰𝙻𝙳𝙾', saldo)}`

exports.magiaLeilao = (item, lance, vencedor) => `- 🔨 \`𝙻𝙴𝙸𝙻𝙰̃𝙾 𝙼𝙰́𝙶𝙸𝙲𝙾\`

${linha('🗿', '𝙸𝚃𝙴𝙼', item)}
${linha('🪙', '𝙻𝙰𝙽𝙲𝙴', lance)}
${linha('🏆', '𝚅𝙴𝙽𝙲𝙴𝙳𝙾𝚁', vencedor)}`

exports.magiaDiario = ({ cristais, ouro, xp }) => `- 🎁 \`𝙱𝙾̂𝙽𝚄𝚂 𝙼𝙰́𝙶𝙸𝙲𝙾\`

${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', `+${cristais}`)}
${linha('🪙', '𝙾𝚄𝚁𝙾', `+${ouro}`)}
${linha('⭐', '𝚇𝙿', `+${xp}`)}`

exports.magiaBau = ({ raridade, cristais, ouro, item }) => `- 🎁 \`𝙱𝙰𝚄́ 𝙰𝚁𝙲𝙰𝙽𝙾\`

${linha('👑', '𝚁𝙰𝚁𝙸𝙳𝙰𝙳𝙴', raridade)}
${linha('💎', '𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂', `+${cristais}`)}
${linha('🪙', '𝙾𝚄𝚁𝙾', `+${ouro}`)}
${linha('🎁', '𝙸𝚃𝙴𝙼', item || 'Nenhum')}`

exports.magiaRoleta = ({ premio, valor }) => `- 🎡 \`𝚁𝙾𝙻𝙴𝚃𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰\`

${linha('🎁', '𝙿𝚁𝙴̂𝙼𝙸𝙾', premio)}
${linha('✨', '𝚅𝙰𝙻𝙾𝚁', valor)}`

exports.magiaCooldown = ms => `- ⏳ \`𝙰𝙶𝚄𝙰𝚁𝙳𝙴\`

${linha('⌛', '𝚃𝙴𝙼𝙿𝙾', `ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ ᴇᴍ ${tempo(ms)}.`)}`

exports.magiaErro = texto => `- ❌ \`𝙼𝙰𝙶𝙸𝙰\`

${linha('⚠️', '𝙰𝚅𝙸𝚂𝙾', texto)}`

exports.magiaSucesso = (titulo, texto) => `- ✅ \`${titulo}\`

${linha('✨', '𝚂𝚃𝙰𝚃𝚄𝚂', texto)}`
