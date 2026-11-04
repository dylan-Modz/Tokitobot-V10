/*
 * Tokito Bot V10 — hierarquia de advertências no grupo.
 * Confere permissões usando os participantes atuais do WhatsApp.
 */

const identificar = pessoa => {
  if (typeof pessoa === 'string') return [pessoa]
  if (!pessoa || typeof pessoa !== 'object') return []
  return [
    pessoa.phoneNumber,
    pessoa.participantPn,
    pessoa.pn,
    pessoa.jid,
    pessoa.id,
    pessoa.participant,
    pessoa.participantAlt,
    pessoa.lid
  ].filter(Boolean)
}

const chaves = (ctx, pessoa) => {
  const todas = new Set()
  for (const item of identificar(pessoa)) {
    const original = String(item || '').trim().toLowerCase().replace(/:\d+(?=@)/g, '')
    if (!original) continue
    const jid = /^\d+$/.test(original) ? original + '@s.whatsapp.net' : original
    todas.add(jid)
    try {
      const normal = String((ctx.normalizar || ctx.nJid)?.(jid) || jid).trim().toLowerCase()
      if (normal) todas.add(normal.replace(/:\d+(?=@)/g, ''))
    } catch {}
  }
  return todas
}

const mesmo = (ctx, pessoa, outra) => {
  const a = chaves(ctx, pessoa)
  for (const chave of chaves(ctx, outra)) if (a.has(chave)) return true
  return false
}

const encontrar = (ctx, participantes, jid) =>
  participantes.find(pessoa => mesmo(ctx, pessoa, jid))

const advertencia = async (ctx, alvo) => {
  if (!ctx?.tokito?.groupMetadata || !ctx?.from) return { ok: false, motivo: 'indisponivel' }

  let metadata
  try {
    metadata = await ctx.tokito.groupMetadata(ctx.from)
  } catch {
    return { ok: false, motivo: 'indisponivel' }
  }

  const participantes = metadata?.participants
  if (!Array.isArray(participantes) || !participantes.length)
    return { ok: false, motivo: 'indisponivel' }

  const alvoGrupo = encontrar(ctx, participantes, alvo)
  if (!alvoGrupo) return { ok: false, motivo: 'fora_do_grupo' }

  const autorGrupo = encontrar(ctx, participantes, ctx.sender)
  const autorDono = Boolean(
    ctx.SoDono ||
    autorGrupo?.admin === 'superadmin' ||
    (metadata.owner && mesmo(ctx, ctx.sender, metadata.owner))
  )
  const autorAdmin = Boolean(autorDono || ['admin', 'superadmin'].includes(autorGrupo?.admin))

  if (!autorAdmin) return { ok: false, motivo: 'sem_permissao' }
  if (mesmo(ctx, alvoGrupo, ctx.sender)) return { ok: false, motivo: 'proprio_usuario' }

  const donosBot = Array.isArray(ctx.numerodono) ? ctx.numerodono : []
  const donosSub = ctx.isSubBot
    ? [ctx.subOwner, ctx.runtimeSub?.ownerFromStore?.()].filter(Boolean)
    : []
  const donoGrupo = Boolean(
    alvoGrupo.admin === 'superadmin' ||
    (metadata.owner && mesmo(ctx, alvoGrupo, metadata.owner))
  )
  const protegido = Boolean(
    donoGrupo ||
    [...donosBot, ...donosSub].some(dono => mesmo(ctx, alvoGrupo, dono)) ||
    (ctx.botNumber && mesmo(ctx, alvoGrupo, ctx.botNumber))
  )
  if (protegido) return { ok: false, motivo: 'dono_protegido' }

  const alvoAdmin = ['admin', 'superadmin'].includes(alvoGrupo.admin)
  if (alvoAdmin && !autorDono) return { ok: false, motivo: 'admin_protegido' }

  const id = identificar(alvoGrupo)
    .map(item => String(item || '').trim())
    .find(item => item.endsWith('@s.whatsapp.net')) || alvo
  const jid = String((ctx.normalizar || ctx.nJid)?.(id) || id)

  return { ok: true, alvo: jid, alvoAdmin, autorDono }
}

module.exports = { advertencia }
