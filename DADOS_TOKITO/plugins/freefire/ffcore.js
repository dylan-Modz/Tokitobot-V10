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
// A sessão é obtida pelo grupo, nunca pedida em comandos ou exposta nos botões.
const botoesSala = (ctx, sessionId, opcoes = ['ver', 'jogadores', 'imagem', 'iniciar', 'parar']) => {
  if (!sessionId) return [];
  const mapa = {
    ver: { texto: ctx.mess.botaoVerSala(), id: ctx.prefix+'versala' },
    jogadores: { texto: ctx.mess.botaoJogadoresSala(), id: ctx.prefix+'jogadoressala' },
    imagem: { texto: '🖼️ Imagem da sala', id: ctx.prefix+'imagensala' },
    iniciar: { texto: ctx.mess.botaoIniciarSala(), id: ctx.prefix+'iniciarsala' },
    parar: { texto: ctx.mess.botaoPararSala(), id: ctx.prefix+'pararsala' }
  };
  return opcoes.map(x=>mapa[x]).filter(Boolean);
};
// Todas as ações em uma única lista: evita o limite de três quick-replies.
const enviarAcoesSala = async (ctx, texto) => {
  if (!ctx.isBotoes || !ctx.proto?.Message?.InteractiveMessage ||
      !ctx.generateWAMessageFromContent || !ctx.tokito?.relayMessage) {
    return enviar(ctx,texto,botoesSala(ctx,'active',['jogadores','imagem','iniciar']),[ctx.sender]);
  }
  try {
    const lista = {
      title:'🎮 AÇÕES DA SALA',
      sections:[{title:'🎮 SALA ATIVA NESTE GRUPO',rows:[
        {title:'🔎 Ver sala',description:'ID, senha e modo da sala criada',id:ctx.prefix+'versala'},
        {title:'👥 Ver jogadores',description:'Lista dos jogadores atuais',id:ctx.prefix+'jogadoressala'},
        {title:'🖼️ Imagem dos jogadores',description:'Quadro PNG da sala',id:ctx.prefix+'imagensala'},
        {title:'🚀 Iniciar partida',description:'Somente quem criou a sala',id:ctx.prefix+'iniciarsala'},
        {title:'⛔ Encerrar sala',description:'Somente quem criou a sala',id:ctx.prefix+'pararsala'}
      ]}]
    };
    const msg=ctx.generateWAMessageFromContent(ctx.from,{
      interactiveMessage:ctx.proto.Message.InteractiveMessage.create({
        contextInfo:typeof ctx.canalInfo==='function'?ctx.canalInfo([ctx.sender]):{},
        body:ctx.proto.Message.InteractiveMessage.Body.create({text:String(texto)}),
        footer:ctx.proto.Message.InteractiveMessage.Footer.create({text:'Escolha uma ação da sala'}),
        nativeFlowMessage:ctx.proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons:[{name:'single_select',buttonParamsJson:JSON.stringify(lista)}],
          messageParamsJson:''
        })
      })
    },{quoted:ctx.selo,userJid:ctx.tokito.user.id});
    return ctx.tokito.relayMessage(ctx.from,msg.message,{messageId:msg.key.id});
  } catch (error) {
    return enviar(ctx,texto,botoesSala(ctx,'active',['jogadores','imagem','iniciar']),[ctx.sender]);
  }
};

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
