'use strict'
// Apresentações oficiais — visual alinhado às mensagens do Tokito.
const { version } = require('../../package.json')
const nick = ctx => '@' + String(ctx.sender || '').split('@')[0]
const base = (ctx, title, intro, sections, outro) => [
  '- ' + title,
  '',
  '> 👋 ׄ ( ᴏʟᴀ́, ' + nick(ctx) + '! )',
  '> ' + intro,
  '',
  ...sections,
  '',
  outro
].join('\n')

exports.gitbot = ctx => base(ctx, '🤖 𝚃𝙾𝙺𝙸𝚃𝙾 𝙱𝙾𝚃 𝚅10 — 𝙾𝙵𝙸𝙲𝙸𝙰𝙻 💎',
  '💙 ׄ ( ᴏ ᴛᴏᴋɪᴛᴏ ʙᴏᴛ ᴠ10 ᴇ́ ᴜᴍ ʙᴏᴛ ᴍᴜʟᴛɪғᴜɴᴄɪᴏɴᴀʟ ᴘᴀʀᴀ ᴡʜᴀᴛsᴀᴘᴘ! )',
  [
    '- 🛡️ 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙲̧𝙰̃𝙾 𝙴 𝚂𝙴𝙶𝚄𝚁𝙰𝙽𝙲̧𝙰',
    '> ⚙️ Moderação, anti-link, boas-vindas, cargos e proteção de grupos.',
    '',
    '- 🤖 𝙸𝙽𝚃𝙴𝙻𝙸𝙶𝙴̂𝙽𝙲𝙸𝙰 𝙰𝚁𝚃𝙸𝙵𝙸𝙲𝙸𝙰𝙻',
    '> 🧠 Tokito IA, perguntas, conversas, comandos de IA e recursos de voz.',
    '',
    '- 🎮 𝙳𝙸𝚅𝙴𝚁𝚂𝙰̃𝙾 𝙴 𝚄𝚃𝙸𝙻𝙸𝙳𝙰𝙳𝙴𝚂',
    '> 🎵 Downloads de músicas e vídeos, figurinhas, jogos, RPG e economia.',
    '> 🔥 Ferramentas e consultas para Free Fire.',
    '',
    '- 📥 𝙸𝙽𝚂𝚃𝙰𝙻𝙰𝙲̧𝙰̃𝙾 𝙾𝙵𝙸𝙲𝙸𝙰𝙻',
    '> 🔗 https://github.com/dylan-Modz/Tokitobot-V10',
    '> 📦 Versão: ' + version + ' | 👑 Criador: Dylan Modz'
  ],
  '> 💙 Tokito Bot V10 — organização, criatividade e diversão!')

exports.site = ctx => base(ctx, '🌐 𝚃𝙾𝙺𝙸𝚃𝙾 𝙰𝙿𝙸𝚂 — 𝙾𝙵𝙸𝙲𝙸𝙰𝙻 💙',
  '💎 ׄ ( ᴜᴍᴀ ᴘʟᴀᴛᴀғᴏʀᴍᴀ ᴅᴇ ᴀᴘɪs, ғᴇʀʀᴀᴍᴇɴᴛᴀs ᴇ sᴇʀᴠɪᴄ̧ᴏs ᴘᴀʀᴀ sᴇᴜ ᴘʀᴏᴊᴇᴛᴏ! )',
  [
    '- 🔥 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴',
    '> ❤️ Likes por ID, Auto Like e histórico de envios.',
    '> 🎟️ Passe Booyah e serviços para jogadores.',
    '> 🎮 Salas, gerenciamento de participantes e consulta de jogador.',
    '',
    '- ⚡ 𝙰𝙿𝙸𝚂 𝙴 𝙵𝙴𝚁𝚁𝙰𝙼𝙴𝙽𝚃𝙰𝚂',
    '> 📥 Downloads, pesquisas, imagens, áudio e mídia.',
    '> 🤖 Tokito IA e recursos para integrar aos seus projetos.',
    '> 📚 Documentação, chave de API e painel de consumo.',
    '',
    '- 💎 𝙿𝙻𝙰𝚃𝙰𝙵𝙾𝚁𝙼𝙰',
    '> 🛍️ Loja, planos, carteira e pagamentos.',
    '> 👑 Perfis com banners, molduras, efeitos e selos.',
    '',
    '- 🌐 𝙰𝙲𝙴𝚂𝚂𝙾 𝙾𝙵𝙸𝙲𝙸𝙰𝙻',
    '> 🔗 https://tokito-apis.com.br'
  ],
  '> 💙 Tokito APIs — tecnologia para seus projetos!')

exports.stone = ctx => base(ctx, '💚 𝚂𝚃𝙾𝙽𝙴 𝚆𝙿𝙿 — 𝙾𝙵𝙸𝙲𝙸𝙰𝙻 ⚡',
  '💚 ׄ ( ᴜᴍᴀ ʙɪʙʟɪᴏᴛᴇᴄᴀ ɴᴏᴅᴇ.ᴊs ᴘᴀʀᴀ ʙᴏᴛs ᴇ ɪɴᴛᴇɢʀᴀᴄ̧ᴏ̃ᴇs ᴄᴏᴍ ᴏ ᴡʜᴀᴛsᴀᴘᴘ! )',
  [
    '- 📱 𝙱𝙸𝙱𝙻𝙸𝙾𝚃𝙴𝙲𝙰 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿',
    '> 🔐 Conexão por QR Code ou código de pareamento.',
    '> 💬 Mensagens, mídias, grupos, eventos e interações.',
    '> 🔄 Sessões, reconexão e automação para bots.',
    '',
    '- 🌐 𝙶𝙰𝚃𝙴𝚆𝙰𝚈 𝙴 𝚂𝚃𝚄𝙳𝙸𝙾',
    '> 🔌 Gateway HTTP para integrar aplicações externas.',
    '> 🖥️ Stone Studio: conexões, terminal e gerenciamento de sessões.',
    '',
    '- 📦 𝙿𝙰𝙲𝙾𝚃𝙴 𝙽𝙿𝙼',
    '> 📥 npm install @stone-wpp/ofc',
    '> 🔗 https://www.npmjs.com/package/@stone-wpp/ofc',
    '',
    '- 📚 𝙳𝙾𝙲𝚂 𝙴 𝙶𝙸𝚃𝙷𝚄𝙱',
    '> 🌐 https://stone-wpp.squareweb.app',
    '> 💻 https://github.com/dylan-Modz/stone-wpp-ofc'
  ],
  '> 💚 Stone WPP — conecte, desenvolva e evolua!')
