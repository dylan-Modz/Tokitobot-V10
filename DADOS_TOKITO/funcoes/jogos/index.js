const base = require('./base.js')
const adivinhe = require('./adivinhe.js')
const quiz = require('./quiz.js')
const forca = require('./forca.js')
const cacapalavras = require('./cacapalavras.js')
const mines = require('./mines.js')
const jogodavelha = require('./jogodavelha.js')
const dama = require('./dama.js')

async function verificar(ctx) {
  base.limparInativos()
  if (ctx.isCmd || !ctx.isGroup || !base.modoAtivo(ctx.from, ctx.dataGp))
    return false
  return await quiz.auto(ctx) ||
    await forca.auto(ctx) ||
    await adivinhe.auto(ctx) ||
    await cacapalavras.auto(ctx) ||
    await mines.auto(ctx) ||
    await jogodavelha.auto(ctx) ||
    await dama.auto(ctx)
}

module.exports = {
  modoAtivo: base.modoAtivo,
  limparInativos: base.limparInativos,
  verificar,
  onlyLetters: base.onlyLetters,
  mention: base.mention,
  sameJid: base.sameJid,
  enviarTexto: base.sendText,
  getAdivinheGame: adivinhe.getGame,
  saveAdivinheGame: adivinhe.saveGame,
  removeAdivinheGame: adivinhe.removeGame,
  criarAdivinheGame: adivinhe.criarGame,
  enviarAdivinhe: adivinhe.enviar,
  getQuizGame: quiz.getGame,
  saveQuizGame: quiz.saveGame,
  removeQuizGame: quiz.removeGame,
  criarQuizGame: quiz.criarGame,
  enviarQuiz: quiz.enviar,
  getForcaGame: forca.getGame,
  saveForcaGame: forca.saveGame,
  removeForcaGame: forca.removeGame,
  criarForcaGame: forca.criarGame,
  enviarForca: forca.enviar,
  getCacaGame: cacapalavras.getGame,
  saveCacaGame: cacapalavras.saveGame,
  removeCacaGame: cacapalavras.removeGame,
  criarCacaGame: cacapalavras.criarGame,
  enviarCaca: cacapalavras.enviar,
  getMinesGame: mines.getGame,
  saveMinesGame: mines.saveGame,
  removeMinesGame: mines.removeGame,
  criarMinesGame: mines.criarGame,
  enviarMines: mines.enviar,
  getVelhaGame: jogodavelha.getGame,
  saveVelhaGame: jogodavelha.saveGame,
  removeVelhaGame: jogodavelha.removeGame,
  criarTabuleiroVelha: jogodavelha.criarTabuleiro,
  enviarVelha: jogodavelha.enviar,
  getDamaGame: dama.getGame,
  saveDamaGame: dama.saveGame,
  removeDamaGame: dama.removeGame,
  criarTabuleiroDama: dama.criarTabuleiro,
  enviarDama: dama.enviar
}
