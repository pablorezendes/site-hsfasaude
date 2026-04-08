#!/bin/bash

# ============================================
# Script de Deploy Automatizado - HSFA Saude
# ============================================
# Uso: ./deploy.sh [--skip-build] [--skip-pm2] [--skip-pull]
#
# Requisitos no .env:
#   GITHUB_TOKEN=ghp_xxxxx
#   GITHUB_REPO=pablorezendes/hsfasaude-site
#   DEPLOY_BRANCH=main  (opcional, default: main)

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Diretorio do projeto
PROJECT_DIR="/home/hsfasaude/htdocs/hsfasaude.com.br"

# Flags
SKIP_BUILD=false
SKIP_PM2=false
SKIP_PULL=false

for arg in "$@"; do
    case $arg in
        --skip-build) SKIP_BUILD=true; shift ;;
        --skip-pm2)   SKIP_PM2=true; shift ;;
        --skip-pull)  SKIP_PULL=true; shift ;;
        *) ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deploy HSFA Saude${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Ir para o diretorio do projeto
cd "$PROJECT_DIR"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Erro: Node.js nao esta instalado.${NC}"
    exit 1
fi
echo -e "${GREEN}Node.js: $(node -v)${NC}"

# Carregar .env
if [ ! -f ".env" ]; then
    echo -e "${RED}Erro: .env nao encontrado em $PROJECT_DIR${NC}"
    exit 1
fi

# Carregar variaveis de ambiente de forma segura
while IFS='=' read -r key value || [ -n "$key" ]; do
    if [[ -n "$key" && ! "$key" =~ ^[[:space:]]*# ]]; then
        key=$(echo "$key" | xargs)
        if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
            value="${value%\"}"
            value="${value#\"}"
            value="${value%\'}"
            value="${value#\'}"
            export "$key=$value"
        fi
    fi
done < .env
echo -e "${GREEN}.env carregado${NC}"

# Definir branch
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

# ========================================
# ETAPA 1: Puxar codigo do GitHub
# ========================================
if [ "$SKIP_PULL" = false ]; then
    echo ""
    echo -e "${BLUE}[1/4] Puxando codigo do GitHub...${NC}"

    if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_REPO" ]; then
        echo -e "${RED}Erro: GITHUB_TOKEN e GITHUB_REPO devem estar definidos no .env${NC}"
        echo -e "${YELLOW}Exemplo:${NC}"
        echo "  GITHUB_TOKEN=ghp_xxxxxxxxxxxx"
        echo "  GITHUB_REPO=pablorezendes/hsfasaude-site"
        exit 1
    fi

    REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git"

    # Se nao eh um repo git, inicializar
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}Inicializando repositorio git...${NC}"
        git init
        git remote add origin "$REPO_URL"
    else
        # Atualizar remote URL com token atual
        git remote set-url origin "$REPO_URL"
    fi

    # Buscar e resetar para o branch remoto
    echo -e "${YELLOW}Buscando atualizacoes do branch ${DEPLOY_BRANCH}...${NC}"
    git fetch origin "$DEPLOY_BRANCH"
    git reset --hard "origin/${DEPLOY_BRANCH}"
    git clean -fd --exclude=.env --exclude=node_modules --exclude=data --exclude=logs

    echo -e "${GREEN}Codigo atualizado para o ultimo commit do ${DEPLOY_BRANCH}${NC}"
else
    echo -e "${YELLOW}[1/4] Pull do GitHub pulado (--skip-pull)${NC}"
fi

# ========================================
# ETAPA 2: Instalar dependencias
# ========================================
echo ""
echo -e "${BLUE}[2/4] Instalando dependencias...${NC}"

# Instalar apenas dependencias de producao (nao precisa de vite/rollup no servidor)
npm install --omit=dev 2>&1 | tail -5

echo -e "${GREEN}Dependencias instaladas${NC}"

# ========================================
# ETAPA 3: Build (se necessario)
# ========================================
if [ "$SKIP_BUILD" = false ]; then
    echo ""
    echo -e "${BLUE}[3/4] Preparando arquivos de producao...${NC}"

    # Verificar se dist existe (ja vem do git com o build feito)
    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        echo -e "${GREEN}Pasta dist encontrada no repositorio${NC}"
    else
        echo -e "${YELLOW}Pasta dist nao encontrada. Tentando fazer build...${NC}"
        npm install --include=dev 2>&1 | tail -5
        npx vite build || npm run build
    fi

    # Copiar arquivos da pasta assinatura para dist
    if [ -d "public/assinatura" ]; then
        mkdir -p dist/assinatura
        cp -r public/assinatura/* dist/assinatura/ 2>/dev/null || true
        echo -e "${GREEN}Arquivos de assinatura copiados para dist${NC}"
    fi

    # Criar pastas necessarias
    mkdir -p data/assinaturas
    mkdir -p logs
    chmod 755 logs 2>/dev/null || true
    chmod 700 data/assinaturas 2>/dev/null || true

    echo -e "${GREEN}Arquivos de producao prontos${NC}"
else
    echo -e "${YELLOW}[3/4] Build pulado (--skip-build)${NC}"
fi

# ========================================
# ETAPA 4: Reiniciar PM2
# ========================================
if [ "$SKIP_PM2" = false ]; then
    echo ""
    echo -e "${BLUE}[4/4] Reiniciando aplicacao no PM2...${NC}"

    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}Instalando PM2...${NC}"
        npm install -g pm2
    fi

    if [ ! -f "server.js" ]; then
        echo -e "${RED}Erro: server.js nao encontrado${NC}"
        exit 1
    fi

    # Verificar config PM2
    ECOSYSTEM_FILE=""
    if [ -f "ecosystem.config.cjs" ]; then
        ECOSYSTEM_FILE="ecosystem.config.cjs"
    elif [ -f "ecosystem.config.js" ]; then
        ECOSYSTEM_FILE="ecosystem.config.js"
    fi

    # Reiniciar ou iniciar
    if pm2 list | grep -q "hsfasaude-site"; then
        pm2 restart hsfasaude-site --update-env
    else
        if [ -n "$ECOSYSTEM_FILE" ]; then
            pm2 start "$ECOSYSTEM_FILE" || pm2 start server.js --name hsfasaude-site
        else
            pm2 start server.js --name hsfasaude-site \
                --max-memory-restart 500M
        fi
    fi

    pm2 save

    # Verificar se esta online
    sleep 2
    if pm2 list | grep -q "hsfasaude-site.*online"; then
        echo -e "${GREEN}Aplicacao rodando no PM2${NC}"
    else
        echo -e "${RED}Erro: Aplicacao nao esta online${NC}"
        echo -e "${YELLOW}Verifique: pm2 logs hsfasaude-site${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}[4/4] PM2 pulado (--skip-pm2)${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Deploy concluido com sucesso!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$SKIP_PM2" = false ]; then
    pm2 status
    echo ""
fi

echo -e "${BLUE}Acesse: https://hsfasaude.com.br${NC}"
echo ""
