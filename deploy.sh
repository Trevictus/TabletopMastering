#!/bin/bash
# ============================================
# TABLETOP MASTERING - SCRIPT DE DESPLIEGUE
# Despliega la aplicación en un servidor con Docker
# ============================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     TABLETOP MASTERING - DESPLIEGUE              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"

# Verificar que existe .env
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: No se encontró archivo .env${NC}"
    echo -e "${YELLOW}Por favor, crea el archivo .env con las variables necesarias.${NC}"
    echo -e "${YELLOW}Puedes usar .env.production como plantilla: cp .env.production .env${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📦 Paso 1: Deteniendo contenedores existentes...${NC}"
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

echo -e "\n${YELLOW}🔨 Paso 2: Construyendo imágenes de producción...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "\n${YELLOW}🚀 Paso 3: Iniciando servicios...${NC}"
docker compose -f docker-compose.prod.yml up -d

echo -e "\n${YELLOW}⏳ Paso 4: Esperando que los servicios estén listos...${NC}"
sleep 10

echo -e "\n${YELLOW}📊 Estado de los contenedores:${NC}"
docker compose -f docker-compose.prod.yml ps

echo -e "\n${GREEN}✅ ¡Despliegue completado!${NC}"
echo -e "${GREEN}La aplicación está disponible en: http://$(hostname -I | awk '{print $1}')${NC}"
echo -e "\n${YELLOW}Comandos útiles:${NC}"
echo -e "  Ver logs:        docker compose -f docker-compose.prod.yml logs -f"
echo -e "  Detener:         docker compose -f docker-compose.prod.yml down"
echo -e "  Reiniciar:       docker compose -f docker-compose.prod.yml restart"
echo -e "  Estado:          docker compose -f docker-compose.prod.yml ps"
