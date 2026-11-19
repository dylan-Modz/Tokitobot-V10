import path from 'node:path'
import fs from 'node:fs'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { criarReceptorExperimentalStone } from '@stone-wpp/ofc'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sessao = path.resolve(__dirname, '..', 'database', 'stone-mobile-teste')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const titulo = nome => {
  console.log('\n❪🧊.ꯧ' + nome + 'ꯧ⸼🧊❫')
  console.log('┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓')
}
const fim = () => console.log('┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛')
const linha = (chave, icone, nome) => console.log('├̟⊹ ' + icone + ' 〔 ' + chave + ' 〕 ➢ ' + nome)
const info = frase => console.log('[ INFO - TOKITO ] - ' + frase)
const aviso = frase => console.log('[ AVISO - TOKITO ] - ' + frase)
const erro = frase => console.log('[ ERRO - TOKITO ] - ' + frase)
const pedir = async nome => String(await rl.question(nome + '\n╰━━➤ ') || '').trim()
const args = new Set(process.argv.slice(2))
const experimental = args.has('--android-experimental')

async function iniciar() {
  titulo('𝚃𝙴𝚂𝚃𝙴 𝙳𝙴 𝙼𝙸́𝙳𝙸𝙰 — 𝚂𝚃𝙾𝙽𝙴')
  linha('1', '📱', 'WhatsApp Normal')
  linha('2', '💼', 'WhatsApp Business')
  linha('0', '↩️', 'Voltar / Sair')
  fim()
  const escolha = await pedir('Escolha o tipo de WhatsApp:')
  if (escolha === '0') return
  if (!['1', '2'].includes(escolha)) {
    erro('Opção inválida.')
    return
  }
  const business = escolha === '2'
  const numero = String(await pedir('Digite o número com DDI (sem +):')).replace(/\D/g, '')
  if (!/^\d{11,15}$/.test(numero)) {
    erro('Número inválido. Exemplo: 5511999999999')
    return
  }
  if (experimental) {
    aviso('Transporte Android experimental selecionado.')
    aviso('Use somente uma sessão separada de testes. A conexão pode ser recusada.')
    const confirmar = await pedir('Digite TESTAR para continuar:')
    if (confirmar.toLocaleUpperCase('pt-BR') !== 'TESTAR') {
      aviso('Teste cancelado. Confirme com TESTAR para iniciar.')
      return
    }
  }
  fs.mkdirSync(sessao, { recursive: true, mode: 0o700 })
  info('Sessão isolada: DADOS_TOKITO/database/stone-mobile-teste')
  aviso('Mantenha esta pasta ao atualizar o ZIP. Substituir toda a instalacao apaga a sessao de teste.')
  aviso('Nunca copie a pasta qrcode da instalação principal para este teste.')
  if (sessao.startsWith('/sdcard/')) {
    aviso('O banco da sessao esta no armazenamento compartilhado Android. Evite compartilhar esse diretorio.')
  }
  let modoAtual = 'inicializando'
  const receptor = await criarReceptorExperimentalStone({
    diretorio: sessao,
    numero,
    business,
    tentarAndroidAposVinculo: experimental,
    avisar: info,
    evento: (tipo, dados) => {
      if (tipo === 'sessao') {
        info('Banco SQLite: ' + (dados.bancoExiste ? 'encontrado' : 'ainda nao criado'))
        info('Credenciais: ' + (dados.registrada ? 'sessao registrada' : 'nao registradas'))
        if (dados.falhaLeitura) erro('Falha ao ler sessao salva. Nao apague o banco SQLite.')
      }
      if (tipo === 'sessao-verificada') {
        if (dados.registrada && dados.bancoExiste && !dados.falhaLeitura) {
          info('Sessao CONFIRMADA no SQLite. Feche com Ctrl+C e abra novamente com a MESMA pasta.')
        } else {
          erro('Pareamento ocorreu, mas nao foi possivel confirmar as credenciais no SQLite.')
          aviso('Nao substitua o ZIP nem apague DADOS_TOKITO/database/stone-mobile-teste.')
        }
      }
      if (tipo === 'codigo') {
        const c = String(dados.codigo || '').replace(/\s|-/g, '')
        titulo('𝙲𝙾́𝙳𝙸𝙶𝙾 𝙳𝙴 𝙲𝙾𝙽𝙴𝚇𝙰̃𝙾')
        console.log('├̟⊹ 🔐 〔 ' + (c.match(/.{1,4}/g)?.join('-') || c) + ' 〕')
        fim()
        info('No WhatsApp: Aparelhos conectados > Conectar com número de telefone.')
      }
      if (tipo === 'midia') {
        console.log('[STONE RX MIDIA]', {
          tipo: dados.tipo, temChave: dados.temChave,
          temCaminho: dados.temCaminho, modo: modoAtual
        })
      }
      if (tipo === 'indisponivel') {
        console.log('[STONE RX INDISPONIVEL]', {
          tipo: dados.tipo, temChave: false, temCaminho: false, modo: modoAtual
        })
      }
      if (tipo === 'conexao') info('Status: ' + dados.status + (dados.motivo ? ' (' + dados.motivo + ')' : ''))
      if (tipo === 'pareado') info('Sessao vinculada salva. Reinicie o teste com --android-experimental se quiser tentar o transporte Android (nao garante modo principal).')
      if (tipo === 'erro-pareamento') erro(dados.mensagem)
    }
  })
  modoAtual = receptor.modo.modo
  info('Perfil de conexão: ' + modoAtual)
  if (experimental && modoAtual === 'vinculado') {
    aviso('Ainda nao existe sessao registrada: esta PRIMEIRA execucao usa modo vinculado.')
    aviso('Conclua o pareamento, encerre com Ctrl+C e execute novamente para testar o transporte Android.')
  }
  if (experimental && modoAtual === 'mobile-experimental') {
    aviso('Tentando transporte Android com credenciais de um dispositivo vinculado.')
    aviso('Isso NAO transforma a sessao em WhatsApp Android principal e pode ser rejeitado.')
  }
  if (!experimental && receptor.modo.modo === 'vinculado')
    aviso('Primeira sessão via pareamento. Modo Android exige credenciais válidas e teste explícito.')
  rl.close()
  await receptor.conectar()
}

try { await iniciar() }
catch (error) {
  erro(String(error?.message || error))
  process.exitCode = 1
} finally {
  rl.close()
}
