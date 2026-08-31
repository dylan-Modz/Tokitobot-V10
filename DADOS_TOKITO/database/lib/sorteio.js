/* Estado de execução compartilhado pelo núcleo e pela IA. */
const dados = require('../../sistemas/dados')

const ativo = () => {
  try {
    return dados.localLicenseStatus().ok === true
  } catch {
    return false
  }
}

module.exports = { ativo }
