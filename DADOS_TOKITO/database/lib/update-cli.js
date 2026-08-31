/*
 * TOKITO BOT V10 - atualização pelo terminal
 * Author: Dylan Modz
 */

const dados = require('../../sistemas/dados')

async function main() {
const auto = process.argv.includes('--auto')

try {
const check = await dados.verificarUpdate()

if (!check?.ok) {
if (!auto) console.log('Não foi possível verificar atualizações agora.')
return
}

if (!check.available) {
if (!auto) console.log(`Tokito V10 já está atualizado: ${check.local?.version || 'atual'}`)
return
}

console.log(`🧊 Atualização encontrada: ${check.local?.version || '—'} → ${check.remote?.version || '—'}`)
const result = await dados.instalarUpdate(texto => console.log(`[ UPDATE ] ${texto}`))

if (result?.updated) {
console.log(`✅ Tokito atualizado para ${result.version}.`)
if (auto) process.exitCode = 20
}
else
console.log('✅ Nenhum arquivo pendente para atualizar.')
} catch (error) {
console.log(`[ UPDATE ] ${error?.message || error}`)
if (!auto) process.exitCode = 1
}
}

main()
