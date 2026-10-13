const dylan = require('../../database/lib/comandos')
const batalhas = require('../../sistemas/rpg/batalha-interativa')

dylan.setCommand({
  nome: 'batalhapokemon',
  comandos: ['batalhapokemon', 'batalhapoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Desafie um treinador e lute por turnos com 4 botões, narração e recompensas.',
    uso: 'batalhapokemon @usuario',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  executar: batalhas.executar
})
