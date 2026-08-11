const modulos = require('../../sistemas/modulos')
const ativar = require('../admin/ativar')
const sairall = require('../dono/sairall')

module.exports = {
  nome: 'evento-pendentes',
  categoria: 'eventos',
  fase: 'pre',

  async evento(ctx) {
    const chave = `${ctx.from}|${ctx.sender}`, txt = String(ctx.body || '').trim()


    const p = modulos.pendentesAtivar.get(chave)

    if (p) {
      if (p.expira < Date.now()) {
        modulos.pendentesAtivar.delete(chave)
      }

      else if (/^\d+$/.test(txt) && !ctx.isCmd) {
        const n = Number(txt)

        if (n === 0) {
          modulos.pendentesAtivar.delete(chave)
          await ctx.reply(ctx.mess.ativarCancelado())
          return true
        }

        const item = ativar.itens[n - 1]

        if (item) {
          const [sistema, nome] = item

          ativar.trocar(ctx, sistema)
          ctx.setGp(ctx.dataGp)

          p.expira = Date.now() + 120000
          modulos.pendentesAtivar.set(chave, p)

          await ctx.reply(
            ctx.mess.ativarAlterado(
              nome,
              ativar.ativo(ctx, sistema),
              ativar.painel(ctx)
            )
          )

          return true
        }
      }
    }



    const s = modulos.pendentesSairall.get(chave)

    if (s) {
      if (s.expira < Date.now()) {
        modulos.pendentesSairall.delete(chave)
      }

      else if (!ctx.isCmd) {

        

        if (s.confirmar && txt.toUpperCase() === 'SIM') {
          modulos.pendentesSairall.delete(chave)

          let ok = 0

          for (const g of s.grupos) {
            try {
              await ctx.tokito.groupLeave(g.id)
              ok++
            }
            catch {
            }
          }

          await ctx.reply(
`\`\`\`✅ 𝙾𝙿𝙴𝚁𝙰𝙲̧𝙰̃𝙾 𝙲𝙾𝙽𝙲𝙻𝚄𝙸́𝙳𝙰\`\`\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾𝚂\` 』— ${ok}
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— 🚪 ʙᴏᴛ ʀᴇᴍᴏᴠɪᴅᴏ

> *Saí de ${ok} grupo(s) com sucesso.*`
          ).catch(() => {})

          return true
        }



        if (/^\d+$/.test(txt)) {
          const n = Number(txt)

     

          if (n === 0) {
            modulos.pendentesSairall.delete(chave)

            await ctx.reply(
`\`\`\`❌ 𝙾𝙿𝙴𝚁𝙰𝙲̧𝙰̃𝙾 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙰\`\`\`

『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ᴘᴀɪɴᴇʟ ᴇɴᴄᴇʀʀᴀᴅᴏ

> *Nenhum grupo foi alterado.*`
            )

            return true
          }

 

          if (n === 99) {
            s.confirmar = true
            s.expira = Date.now() + 60000

            modulos.pendentesSairall.set(chave, s)

            await ctx.reply(
`\`\`\`⚠️ 𝙲𝙾𝙽𝙵𝙸𝚁𝙼𝙰𝙲̧𝙰̃𝙾\`\`\`

『 🚪 \`𝙰𝙲̧𝙰̃𝙾\` 』— sᴀɪʀ ᴅᴇ ᴛᴏᴅᴏs
『 👥 \`𝙶𝚁𝚄𝙿𝙾𝚂\` 』— ${s.grupos.length}
『 ⏳ \`𝚃𝙴𝙼𝙿𝙾\` 』— 60 sᴇɢᴜɴᴅᴏs

> *Essa ação fará o bot sair de TODOS os grupos.*

> Digite *SIM* para confirmar.`
            )

            return true
          }


          if (n === 98) {
            s.page++
            s.expira = Date.now() + 180000

            modulos.pendentesSairall.set(chave, s)

            await ctx.reply(
              sairall.render(s)
            )

            return true
          }


          if (n === 97) {
            s.page--
            s.expira = Date.now() + 180000

            modulos.pendentesSairall.set(chave, s)

            await ctx.reply(
              sairall.render(s)
            )

            return true
          }



          if (n >= 1 && n <= sairall.POR_PAGINA) {
            const idx = s.page * sairall.POR_PAGINA + (n - 1), g = s.grupos[idx]

            if (g) {
              try {
                await ctx.tokito.groupLeave(g.id)
              }
              catch (e) {
                await ctx.reply(
`\`\`\`❌ 𝙴𝚁𝚁𝙾 𝙰𝙾 𝚂𝙰𝙸𝚁\`\`\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${g.nome}
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ғᴀʟʜᴀ

> *Não consegui sair deste grupo.*
> ${e?.message || 'Erro desconhecido.'}`
                )

                return true
              }

              s.grupos = await sairall.carregar(ctx)

              const paginas = Math.max(
                1,
                Math.ceil(
                  s.grupos.length / sairall.POR_PAGINA
                )
              )

              if (s.page >= paginas) {
                s.page = paginas - 1
              }

              s.confirmar = false
              s.expira = Date.now() + 180000

              modulos.pendentesSairall.set(chave, s)

              await ctx.reply(
`\`\`\`✅ 𝙶𝚁𝚄𝙿𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`\`\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${g.nome}
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— 🚪 sᴀɪ́ ᴄᴏᴍ sᴜᴄᴇssᴏ

${sairall.render(s)}`
              )

              return true
            }
          }
        }
      }
    }

    return false
  }
}