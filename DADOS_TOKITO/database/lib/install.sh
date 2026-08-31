#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

info() {
  printf '\033[41;97;1m INFO - TOKITO \033[0m - %s\n' "$1"
}

ok() {
  printf '\033[42;30;1m OK - TOKITO \033[0m - %s\n' "$1"
}

aviso() {
  printf '\033[43;30;1m AVISO - TOKITO \033[0m - %s\n' "$1"
}

erro() {
  printf '\033[41;97;1m ERRO - TOKITO \033[0m - %s\n' "$1"
}

if ! command -v node >/dev/null 2>&1; then
  erro 'Node.js não foi encontrado.'
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  erro 'npm não foi encontrado.'
  exit 1
fi

# Permite dependências instaladas diretamente de repositórios Git,
# como a Baileys modificada da Tokito.
export npm_config_allow_git="root"

# Verifica silenciosamente se existe alguma dependência faltando.
if node DADOS_TOKITO/database/lib/deps.js >/dev/null 2>&1; then
  ok 'Todas as dependências já estão instaladas.'
  exit 0
fi

info 'Instalando dependências do Tokito Bot V10...'

case "$ROOT" in
  /sdcard|/sdcard/*|/storage/emulated/0|/storage/emulated/0/*)
    aviso 'Armazenamento Android detectado. O modo sem bin-links será utilizado.'
    ;;
esac

if node DADOS_TOKITO/database/lib/deps.js --install; then
  ok 'Dependências instaladas com sucesso.'
  exit 0
fi

erro 'Não foi possível instalar todas as dependências.'
exit 1