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
    return valor.map(x => String(x || '').trim()).filter(Boolean)
  }

  return String(valor || '')
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean)
}

function bloco(emoji, titulo, conteudo = []) {
  const corpo = linhas(conteudo)

  if (!corpo.length) {
    return `- ${emoji} \`${titulo}\``
  }

  return `- ${emoji} \`${titulo}\`\n\n` +
    corpo.map(item => `> *『 ${emoji} 』— ${item}*`).join('\n')
}

function painel(selecionados = 0) {
  return bloco(
    '📢',
    '𝙿𝙰𝙸𝙽𝙴𝙻 𝙳𝙴 𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾',
    [
      `ɢʀᴜᴘᴏs sᴇʟᴇᴄɪᴏɴᴀᴅᴏs: ${selecionados}`,
      'sᴇʟᴇᴄɪᴏɴᴇ ᴏs ɢʀᴜᴘᴏs ɴᴀ ʟɪsᴛᴀ.',
      'ǫᴜᴀɴᴅᴏ ᴛᴇʀᴍɪɴᴀʀ, ᴛᴏǫᴜᴇ ᴇᴍ ᴄᴏɴᴛɪɴᴜᴀʀ.'
    ]
  )
}

function selecionado(nome, ativo, total) {
  return bloco(
    ativo ? '✅' : '▫️',
    ativo ? '𝙶𝚁𝚄𝙿𝙾 𝚂𝙴𝙻𝙴𝙲𝙸𝙾𝙽𝙰𝙳𝙾' : '𝙶𝚁𝚄𝙿𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾',
    [
      nome,
      `ᴛᴏᴛᴀʟ: ${total}`,
      'ᴠᴏᴄᴇ̂ ᴘᴏᴅᴇ ᴄᴏɴᴛɪɴᴜᴀʀ sᴇʟᴇᴄɪᴏɴᴀɴᴅᴏ.'
    ]
  )
}

function pedirTexto(total) {
  return bloco(
    '✏️',
    '𝙼𝙰𝙽𝙳𝙴 𝚂𝚄𝙰 𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾',
    [
      `ɢʀᴜᴘᴏs sᴇʟᴇᴄɪᴏɴᴀᴅᴏs: ${total}`,
      'ᴀɢᴏʀᴀ ᴍᴀɴᴅᴇ ᴏ ᴛᴇxᴛᴏ ɴᴏ ᴄʜᴀᴛ.',
      'ɴᴀ̃ᴏ ᴘʀᴇᴄɪsᴀ ᴜsᴀʀ ᴄᴏᴍᴀɴᴅᴏ.'
    ]
  )
}

function textoSalvo(texto, maximo) {
  return bloco(
    '✅',
    '𝚃𝙴𝚇𝚃𝙾 𝚂𝙰𝙻𝚅𝙾',
    [
      texto,
      `ᴀɢᴏʀᴀ ᴅɪɢɪᴛᴇ ᴜᴍ ɴᴜ́ᴍᴇʀᴏ ᴅᴇ 1 ᴀᴛᴇ́ ${maximo}.`,
      'ᴏ ɴᴜ́ᴍᴇʀᴏ ᴇ́ ᴀ ǫᴜᴀɴᴛɪᴅᴀᴅᴇ ᴅᴇ ɢʀᴜᴘᴏs ǫᴜᴇ ᴠᴀ̃ᴏ ʀᴇᴄᴇʙᴇʀ ᴏ ᴇɴᴠɪᴏ.'
    ]
  )
}

function iniciando(qtd) {
  return bloco(
    '🚀',
    '𝙴𝙽𝚅𝙸𝙾 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙾',
    [
      `ᴅᴇsᴛɪɴᴏs: ${qtd}`,
      '1 ᴍᴇɴsᴀɢᴇᴍ ᴘᴏʀ ɢʀᴜᴘᴏ.',
      'ᴍᴀʀᴄᴀᴄ̧ᴀ̃ᴏ ɢᴇʀᴀʟ ᴀᴛɪᴠᴀ.'
    ]
  )
}

function concluido(runtime) {
  return bloco(
    '✅',
    '𝙴𝙽𝚅𝙸𝙾 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙾',
    [
      `ᴇɴᴠɪᴀᴅᴏs: ${runtime.enviados}`,
      `ғᴀʟʜᴀs: ${runtime.falhas}`,
      `ʀᴇsᴛᴀɴᴛᴇs: ${runtime.restantes}`
    ]
  )
}

function status(config, runtime) {
  return bloco(
    '📊',
    '𝚂𝚃𝙰𝚃𝚄𝚂 𝙳𝙰 𝙳𝙸𝚅𝚄𝙻𝙶𝙰𝙲̧𝙰̃𝙾',
    [
      `ʀᴏᴅᴀɴᴅᴏ: ${runtime.executando ? 'sɪᴍ' : 'ɴᴀ̃ᴏ'}`,
      `ɢʀᴜᴘᴏs: ${config.grupos.length}`,
      `ǫᴜᴀɴᴛɪᴅᴀᴅᴇ: ${config.quantidade || 'ɴᴀ̃ᴏ ᴅᴇғɪɴɪᴅᴀ'}`,
      `ᴍᴇɴsᴀɢᴇᴍ: ${config.texto ? 'sᴀʟᴠᴀ' : 'ɴᴀ̃ᴏ sᴀʟᴠᴀ'}`,
      `ᴇɴᴠɪᴀᴅᴏs: ${runtime.enviados}`,
      `ғᴀʟʜᴀs: ${runtime.falhas}`,
      `ʀᴇsᴛᴀɴᴛᴇs: ${runtime.restantes}`
    ]
  )
}

function erro(texto) {
  return bloco('❌', '𝙴𝚁𝚁𝙾', [texto])
}

function info(titulo, texto) {
  return bloco('ℹ️', titulo, texto)
}

module.exports = {
  bloco,
  painel,
  selecionado,
  pedirTexto,
  textoSalvo,
  iniciando,
  concluido,
  status,
  erro,
  info
}
