/* Núcleo compartilhado da Tokito V10. */
const dados = require('../../sistemas/dados')

const entrada = () => dados.validarInicio()
const ciclo = onBlocked => dados.iniciarSincronizacao(onBlocked)
const estado = () => dados.localLicenseStatus()

module.exports = { entrada, ciclo, estado }
