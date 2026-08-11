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

(async () => {
const { Sticker } = require('../sticker.js')
const st = new Sticker()
st.options.edit = 'primas' // piramide | borda | primas | circle
st.addFile('https://i.stack.imgur.com/EMKmn.png')
st.metadata = {
pack: 'ZERO TWO BETA',
author: 'LUCAS MOD DOMINA',
emojis: ['😶']
}
await await st.start().then(console.log).catch(error => st.error(error))
})();
/*
—⟩ Nota:
    -⟩ Use o buffer/readFile pra não apagar a imagem (ex.: test.png);
        -⟩ Tanto também no "edit";
    -⟩ Pode adicionar (edit | addFile): URL, BUFFER ou FILE;
        -⟩ A proporção deve estar 400x400 com o desenho preto.
    -⟩ Use o "yarn" para baixar as bibliotecas;
————————————————————————————————
—⟩ Requisitos:
    -⟩ node-fetch (v.: 2.6.1)
    -⟩ imagemagick
    -⟩ ffmpeg + fluent-ffmpeg (v.: 2.1.2)
    -⟩ https + http
    -⟩ remove.bg
    -⟩ jimp
    -⟩ node-webpmux
    -⟩ file-type (v.: 16.5.3)
    -⟩ path
    -⟩ fs
*/
