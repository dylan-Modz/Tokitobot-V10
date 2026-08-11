module.exports = {
  nome: 'idade',

  comandos: [
    'idade'
  ],

  categoria: 'outros',

  info: {
    descricao: 'Calcula idade e tempo vivido pela data de nascimento.',
    uso: 'idade 23/12/2007'
  },

  async executar(ctx) {
    const nascimento = String(ctx.q || '').trim()
    const partes = nascimento.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

    if (!partes) {
      return ctx.reply(
        ctx.mess.idadeUso(ctx.prefix)
      )
    }

    const diaNascimento = Number(partes[1])
    const mesNascimento = Number(partes[2]) - 1
    const anoNascimento = Number(partes[3])
    const dataNascimento = new Date(anoNascimento, mesNascimento, diaNascimento)
    const agora = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Fortaleza'
      })
    )

    if (
      dataNascimento.getFullYear() !== anoNascimento ||
      dataNascimento.getMonth() !== mesNascimento ||
      dataNascimento.getDate() !== diaNascimento ||
      dataNascimento > agora
    ) {
      return ctx.reply(
        ctx.mess.idadeInvalida()
      )
    }

    let anos = agora.getFullYear() - anoNascimento
    let meses = agora.getMonth() - mesNascimento
    let dias = agora.getDate() - diaNascimento

    if (dias < 0) {
      meses--
      dias += new Date(
        agora.getFullYear(),
        agora.getMonth(),
        0
      ).getDate()
    }

    if (meses < 0) {
      anos--
      meses += 12
    }

    const diferenca = agora - dataNascimento
    const diasVividos = Math.floor(diferenca / 86400000)
    const horasVividas = Math.floor(diferenca / 3600000)
    const minutosVividos = Math.floor(diferenca / 60000)

    let proximoAniversario = new Date(
      agora.getFullYear(),
      mesNascimento,
      diaNascimento
    )

    const hoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    )

    if (proximoAniversario < hoje) {
      proximoAniversario = new Date(
        agora.getFullYear() + 1,
        mesNascimento,
        diaNascimento
      )
    }

    const faltam = Math.ceil(
      (proximoAniversario - agora) / 86400000
    )

    return ctx.reply(
      ctx.mess.idadeResultado({
        nascimento,
        anos,
        meses,
        dias,
        diasVividos,
        horasVividas,
        minutosVividos,
        faltam
      })
    )
  }
}
