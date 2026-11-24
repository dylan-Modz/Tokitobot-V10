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

const fs = require('fs')
const modulos = require('../../sistemas/modulos')
const midiaCitada = require('../../sistemas/midia-citada')
const stickerAudio = require('../../sistemas/sticker-audio')
const { writeExif2 } = require('./exif2')
const dylan = require('../../database/lib/comandos')

const dados = (texto, padrao = '') => {
  const [nome, autor] = String(texto || '').split('|').map(v => v.trim())
  const packname = (nome || padrao).slice(0, 100)
  if (!packname) return null
  return {
    packname,
    // Um único nome informado => sem segunda marca visível/assinatura do bot.
    author: (autor || ' ').slice(0, 100)
  }
}

const fonteSticker = ctx => {
  const dados = midiaCitada.preparar(ctx)
  const stickers = midiaCitada.candidatos(dados.fontes, 'sticker')
  const sticker = stickers.find(item => item.audioMessage?.mediaKey) ||
    stickers[0] || null
  const identificado = dados.contexto?.stanzaId || ''
  // Em respostas a figurinhas, o WhatsApp pode enviar somente o WebP e
  // omitir o campo experimental do áudio. Recuperamos pelo ID original.
  const audio = sticker?.audioMessage?.mediaKey
    ? sticker.audioMessage
    : (dados.original?.message?.stickerMessage?.audioMessage ||
      stickerAudio.recuperarAudioMensagem(ctx.from, identificado))
  return { sticker, audio, identificado }
}

dylan.setCommand({
  nome: 'rgtake',
  comandos: ['rgtake', 'rntake', 'take', 'roubar', 'rename'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Registra e altera a marca de figurinhas comuns, animadas e sonoras.',
    uso: 'rgtake nome | rename nome|autor | take respondendo figurinha',
    permissao: 'Livre'
  },
  async executar(ctx) {
    const comando = String(ctx.command || '').toLowerCase()
    const db = modulos.takes()
    const id = ctx.normalizar(ctx.sender)
    if (comando === 'rgtake' || comando === 'rntake') {
      if (comando === 'rntake' && !db[id]) {
        return ctx.reply(ctx.mess.padraoAviso({
          emoji: '🧊', titulo: 'TAKE NÃO REGISTRADO',
          descricao: 'Registre primeiro com ' + ctx.prefix + 'rgtake nome.'
        }))
      }
      const marca = dados(ctx.q)
      if (!marca) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🧊', titulo: 'REGISTRAR MARCA',
          uso: ctx.prefix + comando + ' nome|autor',
          descricao: 'Informe só o nome se não quiser autor adicional.'
        }))
      }
      db[id] = marca
      modulos.salvarTakes(db)
      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '🧊',
        titulo: comando === 'rntake' ? 'TAKE ATUALIZADO' : 'TAKE REGISTRADO',
        descricao: 'Marca: ' + marca.packname,
        ...(marca.author.trim() ? { detalhe: 'Autor: ' + marca.author } : {})
      }))
    }

    const origem = fonteSticker(ctx)
    const sticker = origem.sticker
    if (!sticker) {
      return ctx.reply(ctx.mess.padraoUso({
        emoji: '🧊', titulo: 'RENOMEAR FIGURINHA',
        uso: comando === 'rename'
          ? ctx.prefix + 'rename nome|autor'
          : ctx.prefix + comando,
        descricao: 'Responda a uma figurinha. Figurinhas sonoras mantêm o áudio quando os dados originais estão disponíveis.'
      }))
    }

    const marca = comando === 'rename'
      ? (dados(ctx.q) || db[id] || dados('', ctx.pushname || 'Minha Marca'))
      : (db[id] || dados('', ctx.pushname || 'Minha Marca'))
    let arquivo
    try {
      const buffer = await ctx.getFileBuffer(sticker, 'sticker')
      if (!Buffer.isBuffer(buffer) || !buffer.length) {
        throw new Error('Não foi possível baixar a figurinha.')
      }
      // Apenas altera o EXIF: mantém todos os quadros da animação intactos.
      arquivo = await writeExif2({
        data: buffer,
        mimetype: 'image/webp'
      }, marca)
      const novoWebp = fs.readFileSync(arquivo)
      // Uma citação pode omitir o campo experimental e até o ID original.
      // O WebP baixado permite recuperar a trilha armazenada pela própria
      // emissão do /figaudio, sem usar outro áudio por engano.
      const audio = origem.audio ||
        stickerAudio.recuperarAudioPorFigurinha(ctx.from, buffer)
      if (audio) {
        // No figaudio o áudio fica nos metadados da StickerMessage,
        // e não dentro do WebP. Reenvia-o usando a rotina compartilhada.
        await stickerAudio.enviarComAudioExistente(ctx, {
          figurinha: novoWebp,
          audioMessage: audio,
          animada: sticker.isAnimated === true
        })
      } else if (sticker.hasAudio === true || sticker.isAudio === true) {
        throw new Error('O WhatsApp não forneceu os metadados do áudio dessa figurinha.')
      } else {
        // Sem indicação de áudio, mantém o fluxo normal. Não é possível
        // reconstruir som ausente apenas a partir dos bytes da figurinha.
        await ctx.tokito.sendMessage(ctx.from, {
          sticker: novoWebp,
          isAnimated: sticker.isAnimated === true
        }, { quoted: ctx.selo })
      }
      return true
    } catch (erro) {
      console.warn('[TAKE]', erro?.code || erro?.message || erro)
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'ERRO AO RENOMEAR',
        descricao: 'Não foi possível renomear essa figurinha.',
        detalhe: String(erro?.message || 'Falha ao processar figurinha.')
      }))
    } finally {
      if (arquivo) {
        try { fs.rmSync(arquivo, { force: true }) } catch {}
      }
    }
  }
})
