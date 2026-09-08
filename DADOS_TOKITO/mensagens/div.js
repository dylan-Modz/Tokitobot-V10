/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Mensagens da divulgação
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
    corpo
      .map(item => `> *『 ${emoji} 』— ${item}*`)
      .join('\n')
}

function painel({
  selecionados = 0,
  quantidade = 0,
  texto = false
} = {}) {
  return bloco(
    '📢',
    '𝙿𝙰𝙸𝙽𝙴𝙻 𝙳𝙴 𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾',
    [
      `ɢʀᴜᴘᴏs sᴇʟᴇᴄɪᴏɴᴀᴅᴏs: ${selecionados}`,
      `ǫᴜᴀɴᴛɪᴅᴀᴅᴇ ᴅᴀ ʀᴏᴅᴀᴅᴀ: ${quantidade || 'ɴᴀ̃ᴏ ᴅᴇғɪɴɪᴅᴀ'}`,
      `ᴍᴇɴsᴀɢᴇᴍ: ${texto ? 'ᴄᴏɴғɪɢᴜʀᴀᴅᴀ ✅' : 'ɴᴀ̃ᴏ ᴄᴏɴғɪɢᴜʀᴀᴅᴀ ❌'}`,
      'ᴇsᴄᴏʟʜᴀ ᴏs ɢʀᴜᴘᴏs ɴᴀ ʟɪsᴛᴀ ᴀʙᴀɪxᴏ.'
    ]
  )
}

function grupoSelecionado(nome, selecionado, total) {
  return bloco(
    selecionado ? '✅' : '▫️',
    selecionado ? '𝙶𝚁𝚄𝙿𝙾 𝚂𝙴𝙻𝙴𝙲𝙸𝙾𝙽𝙰𝙳𝙾' : '𝙶𝚁𝚄𝙿𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾',
    [
      nome,
      `ᴛᴏᴛᴀʟ sᴇʟᴇᴄɪᴏɴᴀᴅᴏ: ${total}`,
      total
        ? 'ᴇsᴄᴏʟʜᴀ ᴍᴀɪs ɢʀᴜᴘᴏs ᴏᴜ ᴅᴇғɪɴᴀ ᴀ ǫᴜᴀɴᴛɪᴅᴀᴅᴇ.'
        : 'sᴇʟᴇᴄɪᴏɴᴇ ᴘᴇʟᴏ ᴍᴇɴᴏs ᴜᴍ ɢʀᴜᴘᴏ.'
    ]
  )
}

function quantidade(valor, total) {
  return bloco(
    '🔢',
    '𝚀𝚄𝙰𝙽𝚃𝙸𝙳𝙰𝙳𝙴 𝙳𝙴𝙵𝙸𝙽𝙸𝙳𝙰',
    [
      `ᴇɴᴠɪᴀʀ ᴘᴀʀᴀ: ${valor} ɢʀᴜᴘᴏ(s)`,
      `sᴇʟᴇᴄɪᴏɴᴀᴅᴏs: ${total}`,
      'ᴄᴀᴅᴀ ɢʀᴜᴘᴏ ʀᴇᴄᴇʙᴇ ᴜᴍ ᴜ́ɴɪᴄᴏ ᴇɴᴠɪᴏ.'
    ]
  )
}

function mensagemSalva(texto) {
  return bloco(
    '✅',
    '𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾 𝚂𝙰𝙻𝚅𝙰',
    [texto]
  )
}

function status(config, runtime) {
  return bloco(
    '📊',
    '𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙰 𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾',
    [
      `ʀᴏᴅᴀɴᴅᴏ: ${runtime.executando ? 'sɪᴍ' : 'ɴᴀ̃ᴏ'}`,
      `ɢʀᴜᴘᴏs sᴇʟᴇᴄɪᴏɴᴀᴅᴏs: ${config.grupos.length}`,
      `ǫᴜᴀɴᴛɪᴅᴀᴅᴇ: ${config.quantidade || 'ɴᴀ̃ᴏ ᴅᴇғɪɴɪᴅᴀ'}`,
      `ᴍᴇɴsᴀɢᴇᴍ: ${config.texto ? 'ᴄᴏɴғɪɢᴜʀᴀᴅᴀ' : 'ɴᴀ̃ᴏ ᴄᴏɴғɪɢᴜʀᴀᴅᴀ'}`,
      `ᴇɴᴠɪᴀᴅᴏs: ${runtime.enviados}`,
      `ғᴀʟʜᴀs: ${runtime.falhas}`,
      `ʀᴇsᴛᴀɴᴛᴇs: ${runtime.restantes}`,
      `ᴜ́ʟᴛɪᴍᴏ ɢʀᴜᴘᴏ: ${runtime.ultimoGrupo || 'ɴᴇɴʜᴜᴍ'}`
    ]
  )
}

function inicio(quantidade) {
  return bloco(
    '🚀',
    '𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙰',
    [
      `ᴅᴇsᴛɪɴᴏs ᴅᴀ ʀᴏᴅᴀᴅᴀ: ${quantidade}`,
      'ᴄᴀᴅᴀ ɢʀᴜᴘᴏ ʀᴇᴄᴇʙᴇ ᴜᴍ ᴇɴᴠɪᴏ.',
      'ᴏs ᴍᴇᴍʙʀᴏs ᴅᴏ ɢʀᴜᴘᴏ sᴀ̃ᴏ ᴍᴀʀᴄᴀᴅᴏs ɴᴏ ᴍᴇsᴍᴏ ᴘᴀᴅʀᴀ̃ᴏ ᴅᴏ ᴛᴏᴛᴀɢ.'
    ]
  )
}

function fim(runtime) {
  return bloco(
    '✅',
    '𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙰',
    [
      `ᴇɴᴠɪᴀᴅᴏs: ${runtime.enviados}`,
      `ғᴀʟʜᴀs: ${runtime.falhas}`,
      `ʀᴇsᴛᴀɴᴛᴇs: ${runtime.restantes}`
    ]
  )
}

function erro(texto) {
  return bloco(
    '❌',
    '𝙴𝚁𝚁𝙾',
    [texto]
  )
}

function info(titulo, conteudo) {
  return bloco(
    'ℹ️',
    titulo,
    conteudo
  )
}

module.exports = {
  bloco,
  painel,
  grupoSelecionado,
  quantidade,
  mensagemSalva,
  status,
  inicio,
  fim,
  erro,
  info
}
