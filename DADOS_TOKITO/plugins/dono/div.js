/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Painel de divulgação controlada por grupos
 *  Dev    : Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')
const div = require('../../sistemas/div')

function cortar(texto, max = 70) {
  const t = String(texto || '').replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 3)}...` : t
}

function listaGrupos(grupos, selecionados = new Set()) {
  if (!grupos.length) return '*Nenhum grupo encontrado.*'

  return grupos.map((g, i) => {
    const mark = selecionados.has(g.id) ? '✅' : '▫️'
    const membros = Number.isFinite(g.participantes) ? ` • ${g.participantes} membros` : ''
    return `${mark} *${i + 1}.* ${cortar(g.nome, 45)}${membros}\n> ${g.id}`
  }).join('\n\n')
}

function painel(prefix = '.') {
  return `*📢 | PAINEL DE DIVULGAÇÃO — TOKITO V10*\n\n` +
    `> *${prefix}divgrupos* — atualizar/listar grupos\n` +
    `> *${prefix}divadd 1 3* — selecionar grupos\n` +
    `> *${prefix}divrm 3* — remover seleção\n` +
    `> *${prefix}divlista* — grupos selecionados\n` +
    `> *${prefix}divmsg texto* — salvar divulgação\n` +
    `> *${prefix}divpreview* — prévia no chat atual\n` +
    `> *${prefix}divintervalo 20* — intervalo em segundos\n` +
    `> *${prefix}divenviar 5* — enviar para até 5 selecionados\n` +
    `> *${prefix}divstatus* — andamento da campanha\n` +
    `> *${prefix}divstop* — parar campanha\n` +
    `> *${prefix}divlimpar* — limpar configuração\n` +
    `> *${prefix}deivimento texto* — teste visível no chat atual\n\n` +
    `*Limite:* ${div.MAX_POR_RODADA} grupos por rodada\n` +
    `*Intervalo:* ${div.MIN_INTERVALO}-${div.MAX_INTERVALO}s`
}

dylan.setCommand({
  nome: 'div',
  comandos: [
    'div',
    'divgrupos',
    'divadd',
    'divrm',
    'divlista',
    'divmsg',
    'divpreview',
    'divintervalo',
    'divenviar',
    'divstatus',
    'divstop',
    'divlimpar',
    'deivimento'
  ],
  categoria: 'dono',
  info: {
    descricao: 'Sistema controlado de divulgação visível em grupos selecionados.',
    uso: 'div',
    permissao: 'Dono',
    categoria: 'dono'
  },

  async executar(ctx) {
    if (!ctx.SoDono) {
      if (ctx.mess && typeof ctx.mess.onlyOwner === 'function')
        return ctx.reply(ctx.mess.onlyOwner())

      return ctx.reply('*❌ | Comando exclusivo do dono.*')
    }

    const tokito = ctx.tokito
    const from = ctx.from
    const q = ctx.q
    const prefix = ctx.prefix || '.'
    const command = String(ctx.command || '').trim().toLowerCase()
    const reply = ctx.reply

    try {
      switch (command) {
        case 'div':
          return reply(painel(prefix))

        case 'divgrupos': {
          const grupos = await div.carregarGrupos(tokito)
          const state = div.ler()
          const selecionados = new Set(state.grupos.map(g => g.id))

          return reply(
            `*📋 | GRUPOS DO TOKITO*\n\n` +
            `${listaGrupos(grupos, selecionados)}\n\n` +
            `*Total:* ${grupos.length}\n` +
            `*Selecionados:* ${state.grupos.length}`
          )
        }

        case 'divadd': {
          if (!div.catalogoAtual().length)
            await div.carregarGrupos(tokito)

          const chaves = String(q || '').trim().split(/[\s,]+/).filter(Boolean)

          if (!chaves.length)
            return reply(`*❌ | Use:* ${prefix}divadd 1 3`)

          const r = div.adicionar(chaves)

          return reply(
            `*✅ | SELEÇÃO ATUALIZADA*\n\n` +
            `> Adicionados: *${r.adicionados.length}*\n` +
            `> Ignorados: *${r.ignorados.length}*\n` +
            `> Total selecionado: *${div.ler().grupos.length}*`
          )
        }

        case 'divrm': {
          if (!div.catalogoAtual().length)
            await div.carregarGrupos(tokito)

          const chaves = String(q || '').trim().split(/[\s,]+/).filter(Boolean)

          if (!chaves.length)
            return reply(`*❌ | Use:* ${prefix}divrm 1`)

          const r = div.remover(chaves)

          return reply(
            `*🗑️ | SELEÇÃO ATUALIZADA*\n\n` +
            `> Removidos: *${r.removidos.length}*\n` +
            `> Ignorados: *${r.ignorados.length}*\n` +
            `> Total selecionado: *${div.ler().grupos.length}*`
          )
        }

        case 'divlista': {
          const state = div.ler()

          if (!state.grupos.length)
            return reply('*📭 | Nenhum grupo selecionado.*')

          const texto = state.grupos
            .map((g, i) => `*${i + 1}.* ${cortar(g.nome, 55)}\n> ${g.id}`)
            .join('\n\n')

          return reply(
            `*✅ | GRUPOS SELECIONADOS*\n\n${texto}\n\n` +
            `*Total:* ${state.grupos.length}`
          )
        }

        case 'divmsg': {
          const texto = String(q || '').trim()

          if (!texto)
            return reply(`*❌ | Use:* ${prefix}divmsg seu texto de divulgação`)

          if (texto.length > 3500)
            return reply('*❌ | A mensagem ficou muito grande. Use até 3500 caracteres.*')

          div.definirTexto(texto)
          return reply(`*✅ | DIVULGAÇÃO SALVA*\n\n> ${cortar(texto, 450)}`)
        }

        case 'divpreview':
          await div.preview(tokito, from)
          return true

        case 'deivimento': {
          const texto = String(q || '').trim()

          if (!texto)
            return reply(`*❌ | Use:* ${prefix}deivimento seu texto`)

          await tokito.sendMessage(
            from,
            { text: texto },
            ctx.info ? { quoted: ctx.info } : undefined
          )

          return true
        }

        case 'divintervalo': {
          const state = div.definirIntervalo(String(q || '').trim())
          return reply(`*⏱️ | Intervalo definido para:* ${state.intervalo}s`)
        }

        case 'divenviar': {
          const quantidade = Number(String(q || '').trim())

          if (!Number.isInteger(quantidade))
            return reply(`*❌ | Use:* ${prefix}divenviar 5`)

          await reply(
            `*📢 | CAMPANHA INICIADA*\n\n` +
            `> Quantidade máxima: *${quantidade}*\n` +
            `> Intervalo: *${div.ler().intervalo}s*\n` +
            `> Para parar: *${prefix}divstop*`
          )

          const resultado = await div.enviar(tokito, quantidade)
          const s = resultado.runtime

          return reply(
            `*✅ | CAMPANHA FINALIZADA*\n\n` +
            `> Enviados: *${s.enviados}*\n` +
            `> Falhas: *${s.falhas}*\n` +
            `> Restantes: *${s.restantes}*`
          )
        }

        case 'divstatus': {
          const { config, runtime } = div.obterStatus()

          return reply(
            `*📊 | STATUS DA DIVULGAÇÃO*\n\n` +
            `> Rodando: *${runtime.executando ? 'Sim' : 'Não'}*\n` +
            `> Grupos selecionados: *${config.grupos.length}*\n` +
            `> Intervalo: *${config.intervalo}s*\n` +
            `> Mensagem: *${config.texto ? 'Configurada' : 'Não configurada'}*\n\n` +
            `*ÚLTIMA/ATUAL RODADA*\n` +
            `> Total: *${runtime.total}*\n` +
            `> Enviados: *${runtime.enviados}*\n` +
            `> Falhas: *${runtime.falhas}*\n` +
            `> Restantes: *${runtime.restantes}*\n` +
            `> Último grupo: *${runtime.ultimoGrupo || 'Nenhum'}*`
          )
        }

        case 'divstop': {
          const ok = div.parar()

          return reply(
            ok
              ? '*🛑 | Parada solicitada. A campanha será interrompida antes do próximo envio.*'
              : '*ℹ️ | Não existe campanha em andamento.*'
          )
        }

        case 'divlimpar':
          div.limpar()
          return reply('*🧹 | Configuração da divulgação limpa com sucesso.*')

        default:
          return reply(painel(prefix))
      }
    }
    catch (error) {
      console.log('[DIV]', error?.stack || error?.message || error)

      return reply(
        `*❌ | DIVULGAÇÃO*\n\n> ${error?.message || 'Não foi possível executar o comando.'}`
      )
    }
  }
})
