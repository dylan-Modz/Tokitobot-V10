/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "figu",
  comandos: [
    "figu",
    "figurinhas",
    "figuemoji",
    "figuanime",
    "figuengracada",
    "figuriva",
    "figuraiva",
    "figuflork",
    "figucoreana",
    "figubebe",
    "figuanimais",
    "figudesenho",
    "figurimuru"
  ],
  categoria: "outros",
  info: {
    "descricao": "Executa o comando figu.",
    "uso": "figu",
    "categoria": "outros"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          const quantidade = Number(args[0])
          const pacotes = {
            figu: {
              endpoint: 'figurinhas',
              nome: 'Figurinhas'
            },
            figurinhas: {
              endpoint: 'figurinhas',
              nome: 'Figurinhas'
            },
            figuemoji: {
              endpoint: 'figu_emoji',
              nome: 'Emojis'
            },
            figuanime: {
              endpoint: 'figu_anime',
              nome: 'Animes'
            },
            figuengracada: {
              endpoint: 'figu_engracadas',
              nome: 'Engraçadas'
            },
            figuriva: {
              endpoint: 'figu_raiva',
              nome: 'Raiva'
            },
            figuraiva: {
              endpoint: 'figu_raiva',
              nome: 'Raiva'
            },
            figuflork: {
              endpoint: 'figu_flork',
              nome: 'Flork'
            },
            figucoreana: {
              endpoint: 'figu_coreana',
              nome: 'Coreanas'
            },
            figubebe: {
              endpoint: 'figu_bebe',
              nome: 'Bebês'
            },
            figuanimais: {
              endpoint: 'figu_animais',
              nome: 'Animais'
            },
            figudesenho: {
              endpoint: 'figu_desenho',
              nome: 'Desenhos'
            },
            figurimuru: {
              endpoint: 'figu_rimuru',
              nome: 'Rimuru'
            }
          }
          if (!args[0] || !Number.isInteger(quantidade))
            return reply(mess.figuQuantidade({
              prefix,
              command
            }))
          if (quantidade < 1)
            return reply(mess.figuMinimo())
          if (quantidade > 10)
            return reply(mess.figuMaximo())
          const pacote = pacotes[command] || pacotes.figu
          const privado = Boolean(isGroup)
          const destino = privado ? (sender_ou_n || sender) : from
          await reagir(from, '🧊')
          await reply(mess.figuCarregando({
            quantidade,
            pacote: pacote.nome,
            privado
          }))
          for (let i = 0; i < quantidade; i++) {
            if (i > 0)
              await new Promise(resolve => setTimeout(resolve, 1500))
            const urlAtual = `${API_URL}/api/stickers/${pacote.endpoint}?apikey=${encodeURIComponent(API_KEY_TOKITO)}&cache=${Date.now()}-${i}`
            await tokito.sendMessage(destino, {
              sticker: { url: urlAtual },
              contextInfo: canalInfo([sender_ou_n || sender])
            }, destino === from ? { quoted: selo } : {})
          }
          await reagir(from, '✅')
          await reply(mess.figuSucesso({
            quantidade,
            pacote: pacote.nome,
            prefix,
            command,
            privado
          }))
        }
        catch (error) {
          console.log(
            'Erro ao enviar figurinhas:',
            modulos.sanitizarErro(error, [API_KEY_TOKITO])
          )

          await reagir(from, '❌')

          return reply(
            mess.erroApi(API_URL)
          )
        }
        return
      }
    }
  }
}
