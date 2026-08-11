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

"use strict"

Object.defineProperty(exports, "__esModule", { value: true })

exports.optionCutFfmpeg = void 0

exports.optionCutFfmpeg = (type, fps = 15, width, height) => {
switch (type) {
case 'square':
case 'quadrado':
return [
`-vcodec`,
`libwebp`,
`-vf`,
`crop=w='min(min(iw\,ih)\,${width})':h='min(min(iw\,ih)\,${height})',scale=640:640,setsar=1,fps=${fps}`,
`-loop`,
`0`,
`-ss`,
`00:00:00.0`,
`-t`,
`00:00:11.0`,
`-preset`,
`default`,
`-an`,
`-vsync`,
`0`,
`-s`,
`512:512`
]
case 'esticar':
case 'stretch':
return `-vcodec libwebp -filter:v fps=fps=${fps} -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 -ss 00:00:00 -t 00:00:11.0`.split(/ +/)
case 'readjust':
case 'reajustar':
return `-vcodec libwebp -filter:v fps=fps=${fps} -lossless 1 -loop 0 -preset default -an -vsync 0 -s 320:320`.split(/ +/)
case 'crop':
return [
`-vf`,
`crop=w='min(min(iw\,ih)\,${width})':h='min(min(iw\,ih)\,${height})',scale=640:640,setsar=1,fps=${fps}`,
`-loop`,
`0`,
`-preset`,
`default`,
`-an`,
`-vsync`,
`0`,
`-s`,
`640:640`
]
default:
return [
`-vcodec`,
`libwebp`,
`-vf`,
`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=${fps}, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
`-loop`,
`0`,
`-ss`,
`00:00:00`,
`-t`,
`00:00:11.0`
]
}
}
