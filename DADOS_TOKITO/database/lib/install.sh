#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

info()  { printf '\033[41;97;1m INFO - TOKITO \033[0m - %s\n' "$1"; }
ok()    { printf '\033[42;30;1m OK - TOKITO \033[0m - %s\n' "$1"; }
aviso() { printf '\033[43;30;1m AVISO - TOKITO \033[0m - %s\n' "$1"; }
erro()  { printf '\033[41;97;1m ERRO - TOKITO \033[0m - %s\n' "$1"; }

if ! command -v node >/dev/null 2>&1; then
  erro 'Node.js não foi encontrado.'
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  erro 'npm não foi encontrado.'
  exit 1
fi

if [ -d node_modules ]; then
  ok 'node_modules já existe. Nenhuma instalação necessária.'
  exit 0
fi

info 'Instalando dependências do Tokito Bot V10...'

# Alguns armazenamentos Android não aceitam os symlinks de node_modules/.bin.
# Nesses casos instala no mesmo local com --no-bin-links, sem criar cópia escondida.
TESTE_ALVO=".tokito-link-target-$$"
TESTE_LINK=".tokito-link-test-$$"
printf 'ok' > "$TESTE_ALVO"
if ln -s "$TESTE_ALVO" "$TESTE_LINK" 2>/dev/null; then
  rm -f "$TESTE_LINK" "$TESTE_ALVO"
  npm install
else
  rm -f "$TESTE_LINK" "$TESTE_ALVO"
  aviso 'Este armazenamento não permite symlinks. Instalando sem bin-links.'
  npm install --no-bin-links
fi

ok 'Dependências instaladas com sucesso.'
