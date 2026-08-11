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

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
if (k2 === undefined)
k2 = k
var desc = Object.getOwnPropertyDescriptor(m, k)
if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
desc = {
enumerable: true,
get: function() {
return m[k]
}
}
}
Object.defineProperty(o, k2, desc)
}) : (function(o, m, k, k2) {
if (k2 === undefined)
k2 = k
o[k2] = m[k]
}))

var __exportStar = (this && this.__exportStar) || function(m, exports) {
for (var p in m)
if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
__createBinding(exports, m, p)
}

Object.defineProperty(exports, "__esModule", { value: true })

__exportStar(require("./exif"), exports)

__exportStar(require("./convert"), exports)

__exportStar(require("./function"), exports)

__exportStar(require("./download"), exports)

__exportStar(require("./argsConfig"), exports)
