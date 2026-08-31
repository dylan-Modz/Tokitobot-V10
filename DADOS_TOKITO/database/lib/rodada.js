/* Estado rápido usado pelo carregador e execução dos módulos. */
const dados = require('../../sistemas/dados')

const ativo = () => {
  try {
    return dados.localLicenseStatus().ok === true
  } catch {
    return false
  }
}

module.exports = { ativo }
