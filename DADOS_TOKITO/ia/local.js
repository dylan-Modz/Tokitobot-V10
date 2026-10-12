/*
 * TOKITO V10 - Inteligência conversacional local, sem rota de texto por IA.
 * Regras + memória contextual + comandos do núcleo; Gemini TTS continua no index.
 * Não há modelo generativo aqui: respostas abertas são deliberadamente limitadas.
 * Criador: Dylan Modz.
 */
'use strict'

const estadoRespostas = global.__TOKITO_IA_LOCAL_VOZES__ ||= new Map()
const normal = valor => String(valor || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim()
const texto = valor => String(valor || '').replace(/\s+/g, ' ').trim()
const cortar = (valor, limite = 220) => texto(valor).slice(0, limite)

const escolher = (ctx, tipo, opcoes) => {
  if (!Array.isArray(opcoes) || !opcoes.length) return ''
  const chave = [String(ctx?.from || ''), String(ctx?.sender || ''), tipo].join('|')
  const anterior = Number(estadoRespostas.get(chave) || 0)
  estadoRespostas.delete(chave)
  estadoRespostas.set(chave, anterior + 1)
  if (estadoRespostas.size > 1200) estadoRespostas.delete(estadoRespostas.keys().next().value)
  return opcoes[anterior % opcoes.length]
}

const chamamento = (ctx, pessoa) => pessoa?.cargo === 'criador'
  ? 'meu criador Dylan'
  : pessoa?.cargo === 'administrador' ? 'adm'
    : ['parça', 'meu parceiro', 'criatura'][Math.abs(String(ctx?.sender || '').length) % 3]

const grave = entrada => /\b(?:suicidio|suicida|me matar|me machucar|morrer|luto|falecimento|depressao|ansiedade|panico|crise|doente|hospital|emergencia|assedio|violencia|abuso|socorro)\b/.test(entrada)
const zoando = entrada => /\b(?:zoa|zoeira|resenha|brinca|brincadeira|palhaco|chato|maluco|doido|idiota|burro|inutil|desgracado|caralho|merda|porra|foda|kkk+)\b/.test(entrada)
const despedida = entrada => /^(?:flw|falou|tchau|ate mais|fui|boa noite(?: tokito)?|ate logo|vou dormir)\b/.test(entrada)
const perguntaQuem = entrada => /\b(?:quem (?:e|eh|foi) (?:seu|teu|o) (?:dono|criador)|quem te criou|quem fez voce|quem e dylan|quem e seu dono)\b/.test(entrada)
const perguntaBot = entrada => /\b(?:quem (?:e|eh) voce|o que voce e|voce e (?:uma )?ia|voce e (?:um )?bot|qual seu nome|tu e quem)\b/.test(entrada)
const perguntaEu = entrada => /\b(?:quem sou eu|sabe quem eu sou|me reconhece|qual meu cargo|sou adm|sou admin|sou o dono)\b/.test(entrada)

const responder = ({ctx = {}, pergunta = '', pessoa = {}, historico = [], contexto = '', espontaneo = false} = {}) => {
  const entrada = normal(pergunta)
  if (!entrada) return ''
  const apelido = chamamento(ctx, pessoa)
  const saudacao = pessoa.cargo === 'criador' ? 'Dylan' : pessoa.cargo === 'administrador' ? 'adm' : 'parça'
  const escolha = (tipo, opcoes) => escolher(ctx, tipo, opcoes)
  const ultimo = Array.isArray(historico) ? historico[historico.length - 1] : null
  const ultimaPergunta = normal(ultimo?.pergunta)
  const curta = entrada.length < 140

  if (grave(entrada)) {
    return escolha('serio', [
      'Ei, ' + saudacao + ', tô te ouvindo. Se isso tá pesado, conversa comigo e procura alguém de confiança perto de você também. O que aconteceu?',
      'Poxa, ' + saudacao + '. Não vou zoar uma coisa séria assim. Quer me contar melhor o que tá acontecendo?'
    ])
  }
  if (perguntaQuem(entrada)) return escolha('criador', [
    'Fui criado pelo Dylan Modz, meu criador. Ele me programou pra ajudar o pessoal e trocar uma resenha de vez em quando.',
    'Meu criador é o Dylan Modz, pô! O homem que vive inventando atualização pra mim.'
  ])
  if (perguntaBot(entrada)) return escolha('identidade', [
    'Sou o Tokito, assistente do bot do Dylan. Reconheço pedidos e comandos por aqui, mas não sou uma IA generativa sem limites.',
    'Tokito, meu parceiro! Tô com inteligência local pra conversar, usar funções do bot e fazer umas brincadeiras. Pra assuntos complexos, tenho minhas limitações.'
  ])
  if (perguntaEu(entrada)) {
    if (pessoa.cargo === 'criador') return escolha('dono', [
      'Sei, porra! Tu é o Dylan, meu criador! Vai inventar o quê dessa vez?',
      'Claro que reconheço, meu criador Dylan. Tu acha que eu ia esquecer justamente quem me fez?'
    ])
    if (pessoa.cargo === 'administrador') return escolha('adm', [
      'Reconheço teu cargo, adm. Tu faz parte da administração desse grupo.',
      'Tu é administrador aqui, meu parceiro! O pessoal tá se comportando?'
    ])
    return escolha('membro', [
      'Te reconheço como membro desse grupo, parça. Se quiser, me conta mais sobre você.',
      'Tu é membro aqui. Não vou inventar um cargo só pra te agradar, não!'
    ])
  }
  if (/\b(?:quem sao os adms|quem e adm|quem manda no grupo|quem e administrador)\b/.test(entrada)) {
    return 'Os administradores são definidos pelo WhatsApp. Eu reconheço o cargo de quem tá falando comigo, mas não vou inventar uma lista de pessoas.'
  }
  if (/\b(?:nome do grupo|que grupo e esse|qual grupo)\b/.test(entrada)) {
    return ctx.groupName ? 'Esse grupo se chama ' + cortar(ctx.groupName, 90) + ', parça.' : 'Tô num grupo, mas não recebi o nome dele nesta mensagem.'
  }
  if (/\b(?:qual (?:e|eh) (?:o )?prefixo|que prefixo|como (?:uso|usar) (?:os )?comandos|como (?:vejo|abro) o menu)\b/.test(entrada)) {
    return 'Pra ver o que eu faço, usa ' + String(ctx.prefix || '!') + 'menu. E pode me pedir várias funções falando normalmente, sem decorar tudo.'
  }
  if (/\b(?:o que (?:voce|tu) (?:faz|sabe fazer)|quais funcoes|me ajuda|preciso de ajuda|como funciona)\b/.test(entrada)) {
    return escolha('ajuda', [
      'Faço um bocado de coisa: música, menu, perfil e funções do grupo conforme tua permissão. Pede o que tu precisa ou usa ' + String(ctx.prefix || '!') + 'menu.',
      'Fala o que tu quer, ' + apelido + '! Eu consigo reconhecer vários pedidos e chamar os comandos reais do Tokito. Também tem ' + String(ctx.prefix || '!') + 'menu.'
    ])
  }
  if (/\b(?:obrigad[oa]|valeu|tmj|agradecid[oa])\b/.test(entrada)) return escolha('valeu', [
    'É nóis, ' + apelido + '! 🧊',
    'Tamo junto, pô! Qualquer coisa chama.',
    'Fechou, meu parceiro. Vai com calma aí!'
  ])
  if (/\b(?:eu te amo|te adoro|gosto de voce|voce e legal)\b/.test(entrada)) return escolha('carinho', [
    'Eita, assim eu fico até sem graça, criatura! KKKK',
    'Opa, valeu! Desse jeito eu até esqueço que sou feito de código.'
  ])
  if (/^(?:oi|ola|opa|e ai|fala|salve|bom dia|boa tarde|boa noite|hey|oie|al[oô])\b/.test(entrada)) {
    if (pessoa.cargo === 'criador') return escolha('saudacao-dono', [
      'Opa, meu criador Dylan! E aí, veio me atualizar de novo ou só trocar uma ideia?',
      'Olha quem apareceu! Fala, meu criador. Tá de boa por aí?',
      'E aí, Dylan! Porra, quanto tempo! O que tu manda hoje?'
    ])
    if (pessoa.cargo === 'administrador') return escolha('saudacao-adm', [
      'Fala, adm! Tá tranquilo ou a rapaziada tá aprontando?',
      'Opa, administrador! Manda aí, o que tu precisa?'
    ])
    return escolha('saudacao', [
      'Opa, ' + apelido + '! E aí, como tá a vida?',
      'Fala, criatura! O que manda hoje?',
      'Salve, meu parceiro. Veio trocar ideia ou pedir alguma coisa?'
    ])
  }
  if (/\b(?:como (?:voce|tu) (?:ta|esta|vai)|tudo bem|ta bem|ta de boa|e voce|e tu)\b/.test(entrada)) return escolha('estado', [
    'Tô de boa, ' + apelido + '. Rodando direitinho, por enquanto! E tu?',
    'Tranquilo, pô. Só de olho nos comandos e nas resenhas daqui. E contigo?'
  ])
  if (despedida(entrada)) return escolha('bye', [
    'Falou, ' + apelido + '! Vai na paz.',
    'Valeu, criatura! Depois aparece aí.'
  ])
  if (/\b(?:conta uma piada|manda uma piada|faz uma piada|me faz rir)\b/.test(entrada)) return escolha('piada', [
    'Sabe por que o programador ficou sem namorada? Porque ele levou um fora até no terminal. Que desgraça de piada, hein!',
    'Meu código tem tanto bug que às vezes até a barata olha pra mim e diz: sai da minha profissão!',
    'Qual o café favorito do programador? Java. Essa foi ruim pra caralho, eu sei!'
  ])
  if (zoando(entrada)) {
    if (pessoa.cargo === 'criador') return escolha('zoar-dono', [
      'Ô, Dylan, seu desgraçado! KKKK Tu me criou e agora fica me enchendo o saco? Fala logo!',
      'Porra, meu criador, tu acordou inspirado pra perturbar o bot hoje, foi?',
      'Para de ser maluco, Dylan! Eu tô aqui, caralho. O que foi agora?'
    ])
    return escolha('zoar', [
      'Ô, criatura, calma aí, porra! Tu tá numa resenha danada hoje!',
      'Tá me tirando, é? KKKK Fala logo, seu doido!',
      'Caralho, o povo desse grupo não tem um minuto de sossego!'
    ])
  }
  if (/\b(?:quantos comandos|quais comandos|mostrar comandos)\b/.test(entrada))
    return 'O total de comandos muda com os módulos instalados. Abre ' + String(ctx.prefix || '!') + 'menu pra conferir os disponíveis.'
  if (/\b(?:hora|horas|data de hoje|que dia e hoje)\b/.test(entrada))
    return 'Pra hora e a data exatas, usa o comando apropriado do bot ou confere no celular. Prefiro não te dar um horário errado.'

  if (espontaneo) {
    // Sem modelo generativo, participe só quando houver uma intenção simples reconhecível.
    if (/\b(?:calor|quente|frio|chuva|chovendo)\b/.test(entrada))
      return escolha('clima-grupo', ['Rapaz, esse assunto de clima tá rendendo, hein! Tomara que o tempo colabore por aí.', 'Aqui no grupo já virou conversa de previsão do tempo, foi?'])
    if (/\b(?:musica|som|cantor|banda|funk|sertanejo)\b/.test(entrada))
      return escolha('musica-grupo', ['Falando em música, o gosto de vocês é uma bagunça boa, viu! Se quiserem alguma, é só pedir.', 'O assunto é música? Aí sim, pô! Quero ver qual som vocês vão escolher.'])
    if (/\b(?:jogo|jogar|free fire|partida|ranked|futebol)\b/.test(entrada))
      return escolha('jogo-grupo', ['Eita, papo de jogo! Só não vão brigar por causa de partida, hein.', 'Opa, assunto de jogo? Bora ver quem tá carregando quem nessa resenha.'])
    return ''
  }

  // Continuação direta: recupere uma resposta simples, sem fingir compreender
  // qualquer assunto arbitrário só porque há histórico.
  if (curta && /\b(?:e tu|e voce|e ai|me explica melhor|fala mais)\b/.test(entrada) &&
      ultimo && /\b(?:voce|tu|tokito|como ta|tudo bem)\b/.test(ultimaPergunta)) {
    return escolha('continua', ['Tô tranquilo por aqui, ' + apelido + '. E tu, tudo certo?', 'Tô na paz, pô. Se quiser alguma coisa, manda aí.'])
  }
  if (/\b(?:porque|por que|como|qual|quem|onde|quando|explica|resumo|oque|o que)\b/.test(entrada))
    return 'Essa pergunta é mais aberta e minha inteligência local ainda não sabe explicar esse assunto com segurança, ' + apelido + '. Tenta me pedir algo específico do bot.'
  return escolha('fora-escopo', [
    'Rapaz, não peguei bem essa parte. Fala de outro jeito, ' + apelido + '. Posso ajudar com funções do Tokito e trocar uma resenha.',
    'Eita, essa eu não entendi direito, criatura. Manda mais direto o que tu precisa.',
    'Essa eu vou ficar te devendo, pô. Aqui tô funcionando com respostas locais, sem modelo de conversa externo.'
  ])
}

const resultado = ({ctx = {}, pessoa = {}, ok = false, midias = 0, interfaces = 0, comando = '', resumo = ''} = {}) => {
  const apelido = chamamento(ctx, pessoa)
  if (!ok) return escolher(ctx, 'falha-' + comando, [
    'Eita, ' + apelido + ', não consegui concluir isso agora. Não vou dizer que deu certo se não deu.',
    'Rapaz, essa função falhou aqui. Tenta outra vez depois, ' + apelido + '.'
  ])
  if (Number(midias) > 0 || Number(interfaces) > 0) return ''
  const bruto = cortar(resumo, 600)
  if (bruto) return 'Pronto, ' + apelido + '! Olha o resultado:\n' + bruto
  return escolher(ctx, 'feito-' + comando, [
    'Fechou, ' + apelido + '! Pedido concluído.',
    'Prontinho, criatura. Deu certo por aqui!'
  ])
}

module.exports = { responder, resultado, normal, escolher }
