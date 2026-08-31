<div align="center">

<img src="https://readme-typing-svg.herokuapp.com/?font=mono&size=30&duration=2500&color=00BFFF&center=true&vCenter=true&lines=𝑻𝒐𝒌𝒊𝒕𝒐𝑩𝒐𝒕+🧊+V10;𝐂𝐑𝐈𝐀𝐃𝐎+𝐏𝐎𝐑+𝐃𝐘𝐋𝐀𝐍+𝐌𝐎𝐃𝐙;𝐁𝐎𝐓+𝐏𝐑𝐄𝐌𝐈𝐔𝐌;TOKITO+BOT+V10" alt="Typing SVG">

<h1 align="center">
<p>
<img src="https://raw.githubusercontent.com/vitincruz68-oss/uploads/main/4760kv.jpeg" alt="TOKITOBOT-V10" width="720">
</p>
</h1>

<p align="center">
<a href="#">
  <img title="VERSÃO MAIS RECENTE" src="https://img.shields.io/badge/VERSÃO•MAIS•RECENTE-00BFFF?style=for-the-badge">
</a>
</p>

<p align="center">
<img title="Autor" src="https://img.shields.io/badge/Autor-Dylan%20Modz-00BFFF?style=for-the-badge&logo=github&logoColor=white">
<img title="Versão" src="https://img.shields.io/badge/Versão-10.0.70-00BFFF?style=for-the-badge&logo=github&logoColor=white">
</p>

<p align="center">
  <a href="https://tokito-apis.com.br">
    <img src="https://img.shields.io/badge/TOKITO%20APIS-111111?style=for-the-badge&logo=googlechrome&logoColor=white">
  </a>

  <a href="https://whatsapp.com/channel/0029VbBbHVs7oQhTLxKWBW2q">
    <img src="https://img.shields.io/badge/CANAL-00BFFF?style=for-the-badge&logo=whatsapp&logoColor=white">
  </a>

  <a href="https://github.com/dylan-Modz/Tokitobot-V10">
    <img src="https://img.shields.io/badge/GITHUB-111111?style=for-the-badge&logo=github&logoColor=white">
  </a>
</p>

</div>

---

## 🧊 ATENÇÃO

> [!IMPORTANT]
> **O TokitoBot-V10 utiliza um sistema de acesso por key/token.**
>
> Para utilizar todos os recursos do bot, configure corretamente sua conta e seu token da Tokito APIs.

<details>
<summary><b>🧊 Ler mais...</b></summary>

<br>

> O sistema de acesso permite que o TokitoBot-V10 utilize os serviços integrados da Tokito APIs.
>
> As atualizações do bot podem ser feitas diretamente pelo terminal ou através do próprio sistema de atualização do WhatsApp.

</details>

---

<details>
<summary>

## 🧊 INICIAR POR HOSPEDAGEM

</summary>

<br>

Para utilizar o **TokitoBot-V10 em uma hospedagem**, você precisa possuir um servidor compatível com Node.js.

### 🧊 PASSO 1

Baixe o projeto:

```text
https://github.com/dylan-Modz/Tokitobot-V10
```

Ou utilize o ZIP disponibilizado pelo GitHub.

---

### 🧊 PASSO 2

Entre no painel da sua hospedagem e envie os arquivos do TokitoBot-V10.

Caso envie o arquivo `.zip`, extraia todos os arquivos.

---

### 🧊 PASSO 3

Certifique-se de que os arquivos principais estejam na raiz do servidor.

Exemplo:

```text
Tokitobot-V10/
├── package.json
├── tokito.js
└── DADOS_TOKITO/
```

---

### 🧊 PASSO 4

Instale as dependências utilizando:

```bash
npm install
```

Depois inicie:

```bash
npm start
```

Na primeira inicialização, configure os dados solicitados pelo TokitoBot-V10.

</details>

---

<details>
<summary>

## 🧊 INICIAR PELO TERMUX

</summary>

<br>

Execute **um comando por vez** e espere cada processo terminar.

---

### 🧊 1 - LIBERAR ARMAZENAMENTO

```bash
termux-setup-storage
```

Permita que o Termux tenha acesso aos arquivos do dispositivo.

---

### 🧊 2 - ATUALIZAR O TERMUX

```bash
pkg update -y && pkg upgrade -y
```

Caso apareça alguma confirmação durante a atualização, confirme para continuar.

---

### 🧊 3 - INSTALAR DEPENDÊNCIAS DO TERMINAL

```bash
pkg install -y ffmpeg nodejs-lts git
```

Esses pacotes são necessários para o funcionamento do TokitoBot-V10.

---

### 🧊 4 - BAIXAR O TOKITOBOT-V10

```bash
cd /sdcard && git clone https://github.com/dylan-Modz/Tokitobot-V10.git
```

---

### 🧊 5 - ENTRAR NA PASTA

```bash
cd /sdcard/Tokitobot-V10
```

---

### 🧊 6 - INSTALAR OS MÓDULOS

Como o bot está dentro do `/sdcard`, utilize:

```bash
npm install --no-bin-links
```

O `--no-bin-links` evita erros de permissão do Android relacionados à criação de links dentro do `node_modules`.

---

### 🧊 7 - INICIAR O BOT

```bash
npm start
```

Utilize esse comando sempre que quiser iniciar normalmente o TokitoBot-V10.

---

### 🧊 ATUALIZAR PELO TERMINAL

Quando houver uma atualização disponível, utilize:

```bash
npm start up
```

O TokitoBot-V10 executará o sistema de atualização pelo próprio terminal.

</details>

---

> [!CAUTION]
> O funcionamento no Termux depende do aparelho, da conexão com a internet e das permissões do Android.
>
> Para manter o bot online por longos períodos, é recomendado utilizar uma hospedagem ou VPS.

---

<details>
<summary>

## 🧊 VPS / LINUX

</summary>

<br>

Em uma VPS ou servidor Linux, instale:

```bash
sudo apt update
sudo apt install -y git ffmpeg
```

Instale também uma versão atual do Node.js.

Depois clone o projeto:

```bash
git clone https://github.com/dylan-Modz/Tokitobot-V10.git
```

Entre na pasta:

```bash
cd Tokitobot-V10
```

Instale os módulos:

```bash
npm install
```

Inicie:

```bash
npm start
```

</details>

---

## 🧊 COMANDOS DE INICIALIZAÇÃO

### Iniciar normalmente

```bash
npm start
```

### Atualizar o TokitoBot-V10

```bash
npm start up
```

O sistema também possui atualização diretamente pelo WhatsApp.

---

## 🧊 CONFIGURAÇÃO

Configure corretamente os dados do TokitoBot-V10.

Exemplo:

```json
{
  "prefix": "PREFIXO",
  "NomeDoBot": "𝑻𝒐𝒌𝒊𝒕𝒐𝑩𝒐𝒕-𝑽10-𝑴𝑫",
  "ownerName": "NICK_DONO",
  "channeldl": "120363421690941003@newsletter",
  "channel": "https://whatsapp.com/channel/0029VbBbHVs7oQhTLxKWBW2q",
  "API_URL": "https://tokito-apis.com.br",
  "API_KEY_TOKITO": "TOKEN_API_TOKITO",
  "ownerNumber": "NUMERO_DONO",
  "CREDENTIALS_USER": {},
  "MP_TOKEN": "TOKEN_MERCADO_PAGO",
  "TOKEN_SALA": "TOKEN_SALA",
  "TOKEN_LIKE_FF": "TOKEN_LIKE_FF"
}
```

> Nunca compartilhe publicamente tokens, sessões ou credenciais pessoais.

---

## 🧊 TOKITO APIS

O TokitoBot-V10 possui integração oficial com:

### Tokito APIs

```text
https://tokito-apis.com.br
```

A API é utilizada por diversos sistemas e comandos presentes no bot.

---

## 🧊 CANAL OFICIAL

Acompanhe novidades, avisos e atualizações do TokitoBot-V10:

```text
https://whatsapp.com/channel/0029VbBbHVs7oQhTLxKWBW2q
```

---

## 🧊 REQUISITOS

| Requisito | Recomendado |
| :--- | :--- |
| Node.js | 20 ou superior |
| RAM | 500 MB ou mais |
| Armazenamento | 1 GB ou mais |
| FFmpeg | Instalado |
| Git | Instalado |
| Internet | Conexão estável |

---

## 🧊 SISTEMAS

| Sistema | Função |
| :--- | :--- |
| Sistema de Plugins | Organização dos comandos |
| Sistema de IA | Recursos inteligentes integrados |
| Downloads | Download e pesquisa de mídias |
| Administração | Gerenciamento de grupos |
| Aluguel | Controle de grupos cadastrados |
| SaveGP | Registro de grupos |
| Atualização | Atualização automática do bot |
| Supervisor | Reinício automático em caso de queda |
| Menus | Menus organizados e personalizados |
| Brincadeiras | Diversos comandos para grupos |

---

## 🧊 ATUALIZAÇÕES

O TokitoBot-V10 possui sistema próprio de atualização.

Pelo terminal:

```bash
npm start up
```

O bot também pode verificar e instalar atualizações através dos comandos disponíveis no WhatsApp.

---

## 🧊 REGRAS

Ao utilizar o TokitoBot-V10:

- Não compartilhe sua key/token.
- Não venda ou revenda cópias não autorizadas do projeto.
- Não reivindique a autoria original do TokitoBot-V10.
- Não distribua versões modificadas se passando pelo desenvolvedor original.
- Respeite os créditos e os termos definidos pelo desenvolvedor.
- Não publique sessões, tokens ou credenciais privadas.

---

## 🧊 SOBRE O PROJETO

O **TokitoBot-V10** foi desenvolvido com foco em organização, personalização, desempenho e facilidade de atualização.

O projeto pode receber modificações e personalizações conforme a necessidade de cada usuário, respeitando os termos de utilização.

---

## 🧊 DESENVOLVEDOR

<div align="center">

<table>
<tr>

<td align="right" valign="middle">

<img src="https://github.com/dylanModz.png?size=120" width="120" height="120">

</td>

<td align="left" valign="middle">

<h2>
Dylan Modz
</h2>

<p>
Desenvolvedor principal do TokitoBot-V10.
</p>

<p>

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">

<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white">

<img src="https://img.shields.io/badge/Baileys-00BFFF?style=flat-square&logo=whatsapp&logoColor=white">

<img src="https://img.shields.io/badge/Shell-4EAA25?style=flat-square&logo=gnu-bash&logoColor=white">

</p>

</td>

</tr>
</table>

</div>

---

## 🧊 LICENSE

Os termos de utilização do TokitoBot-V10 estão disponíveis no arquivo de licença incluído no projeto.

---

<div align="center">

# 🧊 TOKITOBOT-V10

### Desenvolvido por Dylan Modz

**TokitoBot-V10 • WhatsApp Bot**

</div>
