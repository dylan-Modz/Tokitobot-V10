/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Mensagens do sistema de divulgação
 *  Dev    : Dylan Modz
 * ============================================================
 */

function linhas(valor) {
  if (Array.isArray(valor)) {
    return valor
      .map(item => String(item || '').trim())
      .filter(Boolean)
  }

  return String(valor || '')
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
}

function bloco(emoji, titulo, conteudo = []) {
  const corpo = linhas(conteudo)

  if (!corpo.length) {
    return `- ${emoji} \`${titulo}\``
  }

  return `- ${emoji} \`${titulo}\`\n\n` +
    corpo.map(item => `> ${emoji} ׄ ( ${item} )`).join('\n')
}

function painel(prefix, limites) {
  return bloco(
    '📢',
    '𝙿𝙰𝙸𝙽𝙴𝙻 𝙳𝙴 𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾',
    [
      `${prefix}divgrupos — ʟɪsᴛᴀʀ ᴏs ɢʀᴜᴘᴏs ᴅᴏ ʙᴏᴛ`,
      `${prefix}divadd 1 3 — ᴀᴅɪᴄɪᴏɴᴀʀ ɢʀᴜᴘᴏs`,
      `${prefix}divrm 3 — ʀᴇᴍᴏᴠᴇʀ ɢʀᴜᴘᴏ ᴅᴀ sᴇʟᴇᴄ̧ᴀ̃ᴏ`,
      `${prefix}divlista — ᴠᴇʀ ɢʀᴜᴘᴏs sᴇʟᴇᴄɪᴏɴᴀᴅᴏs`,
      `${prefix}divmsg texto — sᴀʟᴠᴀʀ ᴀ ᴅɪᴠᴜʟɢᴀᴄ̧ᴀ̃ᴏ`,
      `${prefix}divpreview — ᴘʀᴇ́ᴠɪᴀ ɴᴏ ᴄʜᴀᴛ ᴀᴛᴜᴀʟ`,
      `${prefix}divintervalo 20 — ᴅᴇғɪɴɪʀ ɪɴᴛᴇʀᴠᴀʟᴏ`,
      `${prefix}divenviar 5 — ɪɴɪᴄɪᴀʀ ᴇɴᴠɪᴏ`,
      `${prefix}divstatus — ᴠᴇʀ ᴏ ᴀɴᴅᴀᴍᴇɴᴛᴏ`,
      `${prefix}divstop — ᴘᴀʀᴀʀ ᴀ ᴄᴀᴍᴘᴀɴʜᴀ`,
      `${prefix}divlimpar — ʟɪᴍᴘᴀʀ ᴀ ᴄᴏɴғɪɢᴜʀᴀᴄ̧ᴀ̃ᴏ`,
      `${prefix}deivimento texto — ᴛᴇsᴛᴀʀ ᴏ ᴘᴀʏᴍᴇɴᴛ ɴᴏ ᴄʜᴀᴛ ᴀᴛᴜᴀʟ`,
      `ʟɪᴍɪᴛᴇ ᴘᴏʀ ʀᴏᴅᴀᴅᴀ: ${limites.maxPorRodada}`,
      `ɪɴᴛᴇʀᴠᴀʟᴏ: ${limites.minIntervalo}-${limites.maxIntervalo}s`
    ]
  )
}

function grupos(lista, selecionados, total) {
  const corpo = []

  for (let i = 0; i < lista.length; i++) {
    const g = lista[i]
    const marcado = selecionados.has(g.id) ? '✅' : '▫️'
    const membros = Number.isFinite(g.participantes)
      ? ` • ${g.participantes} ᴍᴇᴍʙʀᴏs`
      : ''

    corpo.push(`${marcado} ${i + 1}. ${g.nome}${membros}`)
    corpo.push(g.id)
  }

  corpo.push(`ᴛᴏᴛᴀʟ: ${total}`)
  corpo.push(`sᴇʟᴇᴄɪᴏɴᴀᴅᴏs: ${selecionados.size}`)

  return bloco('📋', '𝙶𝚁𝚄𝙿𝙾𝚂 𝙳𝙾 𝚃𝙾𝙺𝙸𝚃𝙾', corpo)
}

function selecao(adicionados, ignorados, total) {
  return bloco(
    '✅',
    '𝚂𝙴𝙻𝙴𝙲̧𝙰̃𝙾 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙰',
    [
      `ᴀᴅɪᴄɪᴏɴᴀᴅᴏs: ${adicionados}`,
      `ɪɢɴᴏʀᴀᴅᴏs: ${ignorados}`,
      `ᴛᴏᴛᴀʟ sᴇʟᴇᴄɪᴏɴᴀᴅᴏ: ${total}`
    ]
  )
}

function removidos(removidos, ignorados, total) {
  return bloco(
    '🗑️',
    '𝚂𝙴𝙻𝙴𝙲̧𝙰̃𝙾 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙰',
    [
      `ʀᴇᴍᴏᴠɪᴅᴏs: ${removidos}`,
      `ɪɢɴᴏʀᴀᴅᴏs: ${ignorados}`,
      `ᴛᴏᴛᴀʟ sᴇʟᴇᴄɪᴏɴᴀᴅᴏ: ${total}`
    ]
  )
}

function salva(texto) {
  return bloco(
    '✅',
    '𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾 𝚂𝙰𝙻𝚅𝙰',
    [texto]
  )
}

function uso(prefix, comando, exemplo) {
  return bloco(
    '⚠️',
    '𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙸𝙽𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙾',
    [`ᴜsᴇ: ${prefix}${comando}${exemplo ? ` ${exemplo}` : ''}`]
  )
}

function erro(texto) {
  return bloco(
    '❌',
    '𝙾𝙲𝙾𝚁𝚁𝙴𝚄 𝚄𝙼 𝙴𝚁𝚁𝙾',
    [texto]
  )
}

function info(titulo, corpo) {
  return bloco('ℹ️', titulo, corpo)
}

function sucesso(titulo, corpo) {
  return bloco('✅', titulo, corpo)
}

function status(config, runtime) {
  return bloco(
    '📊',
    '𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙰 𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾',
    [
      `ʀᴏᴅᴀɴᴅᴏ: ${runtime.executando ? 'sɪᴍ' : 'ɴᴀ̃ᴏ'}`,
      `ɢʀᴜᴘᴏs sᴇʟᴇᴄɪᴏɴᴀᴅᴏs: ${config.grupos.length}`,
      `ɪɴᴛᴇʀᴠᴀʟᴏ: ${config.intervalo}s`,
      `ᴍᴇɴsᴀɢᴇᴍ: ${config.texto ? 'ᴄᴏɴғɪɢᴜʀᴀᴅᴀ' : 'ɴᴀ̃ᴏ ᴄᴏɴғɪɢᴜʀᴀᴅᴀ'}`,
      `ᴛᴏᴛᴀʟ: ${runtime.total}`,
      `ᴇɴᴠɪᴀᴅᴏs: ${runtime.enviados}`,
      `ғᴀʟʜᴀs: ${runtime.falhas}`,
      `ʀᴇsᴛᴀɴᴛᴇs: ${runtime.restantes}`,
      `ᴜ́ʟᴛɪᴍᴏ ɢʀᴜᴘᴏ: ${runtime.ultimoGrupo || 'ɴᴇɴʜᴜᴍ'}`
    ]
  )
}

module.exports = {
  bloco,
  painel,
  grupos,
  selecao,
  removidos,
  salva,
  uso,
  erro,
  info,
  sucesso,
  status
}
