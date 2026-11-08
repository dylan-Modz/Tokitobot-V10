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

const path = require('path')

const configPath = path.join(__dirname, '..', '..', 'INFO_DADOS', 'config-all.json')

const config = () => {
try {
delete require.cache[require.resolve(configPath)]
return require(configPath)
}
catch {
return {}
}
}

const tokenSala = ctx => {
const cfg = config()
return String(cfg.TOKEN_SALA || process.env.TOKEN_SALA || ctx.API_KEY_TOKITO || '').trim()
}

const tokenLikes = ctx => {
const cfg = config()
return String(cfg.TOKEN_LIKE_FF || process.env.TOKEN_LIKE_FF || ctx.API_KEY_TOKITO || '').trim()
}

// Preserva o motivo escrito pela API Tokito (campo "erro" no POST /api/v1/likes).
// Códigos técnicos em "error" só são mostrados quando a resposta não traz texto.
const mensagemRetorno = data => {
const opcoes = [
data?.erro, data?.mensagem, data?.message, data?.detail, data?.msg, data?.error,
data?.data?.erro, data?.data?.mensagem, data?.data?.message
]
const valor = opcoes.find(item => typeof item === 'string' && item.trim())
return valor ? valor.trim() : ''
}

const retornoErro = data => mensagemRetorno(data) || 'A API não informou o motivo da falha.'

const apiErro = (error, padrao = 'A API não informou o motivo da falha.') =>
mensagemRetorno(error?.response?.data) || String(error?.message || padrao)

const enviar = async (ctx, texto, botoes = [], mentions = []) => {
if (ctx.isBotoes && botoes.length)
return ctx.botaozin(texto, botoes, mentions)
return ctx.reply(texto, mentions)
}

const MODOS_SALA = Object.freeze([
  {id:'ap_padrao',nome:'AP Padrão',limite:8},
  {id:'gelo_inf',nome:'Gelo Infinito',limite:8},
  {id:'tatico',nome:'Modo Tático',limite:8},
  {id:'ap_fullcapa',nome:'Full Capa',limite:8},
  {id:'capa_3',nome:'Capa 3',limite:8},
  {id:'ap_uxd',nome:'AP UXD',limite:8},
  {id:'ap_7r',nome:'AP 7R',limite:8},
  {id:'br_padrao',nome:'Battle Royale',limite:48}
])

// Os comandos públicos usam a sala ativa do próprio grupo. O sessionId
// permanece privado e só é enviado à API pelo bot.
const botoesSala = (ctx, opcoes = ['ver','jogadores','imagem','iniciar','parar']) => {
  const mapa = {
    ver: {texto:'🔎 Ver sala',id:ctx.prefix+'versala'},
    jogadores: {texto:'👥 Ver jogadores',id:ctx.prefix+'jogadoressala'},
    imagem: {texto:'🖼️ Imagem da sala',id:ctx.prefix+'imagensala'},
    iniciar: {texto:'🚀 Iniciar partida',id:ctx.prefix+'iniciarsala'},
    parar: {texto:'⛔ Encerrar sala',id:ctx.prefix+'pararsala'},
    expulsar: {texto:'🚫 Expulsar jogador',id:ctx.prefix+'expulsarsala'}
  }
  return opcoes.map(x=>mapa[x]).filter(Boolean)
}

const menuListaSala = async (ctx, texto, titulo, linhas) => {
  const rows = linhas.map(item=>({
    title:String(item.texto).slice(0,50),
    description:String(item.descricao || '').slice(0,80),
    id:item.id
  }))
  if (ctx.isBotoes && ctx.proto?.Message?.InteractiveMessage &&
      typeof ctx.generateWAMessageFromContent==='function' &&
      typeof ctx.tokito?.relayMessage==='function') {
    try {
      const M=ctx.proto.Message.InteractiveMessage
      const mensagem=ctx.generateWAMessageFromContent(ctx.from,{
        interactiveMessage:M.create({
          contextInfo:typeof ctx.canalInfo==='function'?ctx.canalInfo([ctx.sender]):{},
          body:M.Body.create({text:texto}),
          footer:M.Footer.create({text:ctx.NomeDoBot || 'Tokito Bot'}),
          nativeFlowMessage:M.NativeFlowMessage.create({
            buttons:[{name:'single_select',buttonParamsJson:JSON.stringify({
              title:titulo,
              sections:[{title:'🎮 Escolha uma opção',rows}]
            })}]
          })
        })
      },{quoted:ctx.selo,userJid:ctx.tokito.user?.id})
      return await ctx.tokito.relayMessage(ctx.from,mensagem.message,{messageId:mensagem.key.id})
    }catch(e){console.log('[MENU SALAS] fallback:',e?.message)}
  }
  return ctx.reply(texto+'\n\n'+linhas.map(x=>x.texto+': '+x.id).join('\n'))
}

const dataBR = valor => {
if (!valor)
return 'N/A'
try {
return new Intl.DateTimeFormat('pt-BR', {
timeZone: 'America/Sao_Paulo',
day: '2-digit',
month: '2-digit',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
hour12: false
}).format(new Date(valor))
}
catch {
return 'N/A'
}
}

module.exports = {
config,
tokenSala,
tokenLikes,
apiErro,
retornoErro,
mensagemRetorno,
enviar,
botoesSala,
menuListaSala,
MODOS_SALA,
dataBR
}
