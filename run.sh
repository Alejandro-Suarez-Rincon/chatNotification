#!/usr/bin/env bash

set -e

# ─── Colors ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Header ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║        💬  ChatRoom  Local           ║${NC}"
echo -e "${BLUE}${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# ─── Detect local IP ──────────────────────────────────────────────────────────
detect_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS: try en0 (WiFi), then en1
        ip=$(ipconfig getifaddr en0 2>/dev/null) \
            || ip=$(ipconfig getifaddr en1 2>/dev/null) \
            || ip="localhost"
    else
        # Linux
        ip=$(hostname -I 2>/dev/null | awk '{print $1}') || ip="localhost"
    fi
    echo "$ip"
}

LOCAL_IP=$(detect_ip)
echo -e "${CYAN}📡 IP local detectada:${NC} ${BOLD}$LOCAL_IP${NC}"

# ─── Setup .env ───────────────────────────────────────────────────────────────
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  Archivo .env no encontrado. Creándolo automáticamente...${NC}"
    cp .env.example .env

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|http://x.x.x.x:3000|http://$LOCAL_IP:3000|g" .env
        sed -i '' "s|http://x.x.x.x:4000|http://$LOCAL_IP:4000|g" .env
    else
        sed -i "s|http://x.x.x.x:3000|http://$LOCAL_IP:3000|g" .env
        sed -i "s|http://x.x.x.x:4000|http://$LOCAL_IP:4000|g" .env
    fi

    echo -e "${GREEN}✅ .env creado con IP: $LOCAL_IP${NC}"
else
    echo -e "${GREEN}✅ .env ya existe${NC}"
fi

# ─── Access instructions ──────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}${BOLD}─────────────────────────────────────────${NC}"
echo -e "${BOLD}  Cómo acceder al chat:${NC}"
echo -e "  Desde este equipo   → ${GREEN}http://localhost:3000${NC}"
echo -e "  Desde la misma WiFi → ${GREEN}http://$LOCAL_IP:3000${NC}"
echo ""
echo -e "  Si la IP cambió, edita ${YELLOW}.env${NC} y cambia:"
echo -e "    ${CYAN}SOCKET_ORIGIN${NC}         = http://<nueva-ip>:3000"
echo -e "    ${CYAN}NEXT_PUBLIC_SOCKET_URL${NC} = http://<nueva-ip>:4000"
echo -e "${BLUE}${BOLD}─────────────────────────────────────────${NC}"
echo ""

# ─── Docker or native ─────────────────────────────────────────────────────────

# Detect docker compose command (v2 plugin or v1 standalone)
DOCKER_COMPOSE=""
if command -v docker &>/dev/null; then
    if docker compose version &>/dev/null 2>&1; then
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose &>/dev/null; then
        DOCKER_COMPOSE="docker-compose"
    fi
fi

if [ -n "$DOCKER_COMPOSE" ]; then
    echo -e "${GREEN}🐳 Docker detectado. Usando Docker Compose...${NC}"

    # Check if images were already built
    CORE_IMAGE=$(docker images -q "chatnotification-core" 2>/dev/null || true)
    WEB_IMAGE=$(docker images -q "chatnotification-web" 2>/dev/null || true)

    if [ -z "$CORE_IMAGE" ] || [ -z "$WEB_IMAGE" ]; then
        echo -e "${YELLOW}🔨 Primera ejecución: construyendo imágenes (puede tardar unos minutos)...${NC}"
        $DOCKER_COMPOSE up --build
    else
        echo -e "${GREEN}▶️  Imágenes ya construidas. Iniciando servicios...${NC}"
        $DOCKER_COMPOSE up
    fi

else
    # ── Native fallback ──────────────────────────────────────────────────────
    echo -e "${YELLOW}⚠️  Docker no encontrado. Ejecutando de forma nativa...${NC}"
    echo ""

    # Check Node.js
    if ! command -v node &>/dev/null; then
        echo -e "${RED}❌ Node.js no está instalado. Instálalo desde https://nodejs.org${NC}"
        exit 1
    fi

    # Install deps if missing
    if [ ! -d "packages/core/node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
        (cd packages/core && npm install)
    fi

    if [ ! -d "packages/web/node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
        (cd packages/web && npm install)
    fi

    echo -e "${GREEN}🚀 Iniciando servicios...${NC}"
    echo -e "   Backend  → ${CYAN}http://localhost:4000${NC}"
    echo -e "   Frontend → ${CYAN}http://localhost:3000${NC}"
    echo ""
    echo -e "   Presiona ${BOLD}Ctrl+C${NC} para detener ambos servicios."
    echo ""

    # Run both services; kill both on Ctrl+C
    (cd packages/core && npm run dev) &
    CORE_PID=$!

    # Small delay so core starts before web
    sleep 2

    (cd packages/web && npm run dev) &
    WEB_PID=$!

    trap 'echo ""; echo -e "${YELLOW}Deteniendo servicios...${NC}"; kill $CORE_PID $WEB_PID 2>/dev/null; wait $CORE_PID $WEB_PID 2>/dev/null; echo -e "${GREEN}Listo.${NC}"' INT TERM

    wait $CORE_PID $WEB_PID
fi
