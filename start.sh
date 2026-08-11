#!/bin/bash

CYAN="\033[1;36m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

while true; do
  printf "${CYAN}🌫️ Iniciando ${GREEN}Tokito-Md${CYAN}, aguarde a conexão...${RESET}\n\n"

  if [ "$1" = "sim" ]; then
    node DADOS_TOKITO/connect.js sim
  elif [ "$1" = "não" ] || [ "$1" = "nao" ]; then
    node DADOS_TOKITO/connect.js não
  else
    node DADOS_TOKITO/connect.js
  fi

  codigo=$?

  if [ "$codigo" -eq 23 ]; then
    printf "\n${YELLOW}⚠️ A Tokito Base já está rodando em outra instância. Este inicializador será encerrado.${RESET}\n"
    exit 1
  fi

  if [ "$codigo" -eq 24 ]; then
    printf "\n${YELLOW}🔐 O Tokito V10 não pôde validar uma licença ativa. O inicializador será encerrado.${RESET}\n"
    exit 1
  fi

  printf "\n${YELLOW}🧊 Tokito-Md caiu, reiniciando...${RESET}\n"
  sleep 1
done