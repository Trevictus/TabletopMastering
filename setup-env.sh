#!/bin/bash
# ============================================
# TABLETOP MASTERING - SETUP DE VARIABLES DE ENTORNO
# Genera automáticamente el archivo .env con claves seguras
# ============================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     TABLETOP MASTERING - SETUP ENV               ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"

# Verificar que existe .env.example
if [ ! -f .env.example ]; then
    echo -e "${RED}❌ Error: No se encontró archivo .env.example${NC}"
    exit 1
fi

# Verificar si ya existe .env
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  Ya existe un archivo .env${NC}"
    read -p "¿Deseas sobrescribirlo? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Operación cancelada.${NC}"
        exit 0
    fi
    # Backup del .env existente
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✅ Backup creado del .env anterior${NC}"
fi

echo -e "\n${YELLOW}🔐 Generando claves seguras...${NC}"

# Generar claves seguras
# JWT_SECRET: 64 bytes en base64 (sin caracteres problemáticos)
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n' | tr -d '/' | tr -d '+' | tr -d '=' | head -c 64)

# MONGO_PASSWORD: 32 caracteres alfanuméricos
MONGO_PASSWORD=$(openssl rand -base64 32 | tr -d '\n' | tr -d '/' | tr -d '+' | tr -d '=' | head -c 32)

echo -e "${GREEN}✅ JWT_SECRET generado (64 caracteres)${NC}"
echo -e "${GREEN}✅ MONGO_PASSWORD generado (32 caracteres)${NC}"

echo -e "\n${YELLOW}📝 Creando archivo .env...${NC}"

# Copiar .env.example a .env
cp .env.example .env

# Reemplazar los placeholders con las claves generadas
# Usamos | como delimitador en sed para evitar problemas con /
sed -i "s|MONGO_PASSWORD=CAMBIA_ESTA_CONTRASENA_SEGURA_123!|MONGO_PASSWORD=${MONGO_PASSWORD}|g" .env
sed -i "s|JWT_SECRET=CAMBIA_ESTO_POR_UNA_CLAVE_SECRETA_MUY_LARGA_Y_SEGURA|JWT_SECRET=${JWT_SECRET}|g" .env

echo -e "${GREEN}✅ Archivo .env creado correctamente${NC}"

echo -e "\n${CYAN}════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📋 RESUMEN DE CONFIGURACIÓN:${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo -e "MONGO_PASSWORD: ${GREEN}${MONGO_PASSWORD}${NC}"
echo -e "JWT_SECRET:     ${GREEN}${JWT_SECRET}${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}⚠️  IMPORTANTE: Guarda estas claves en un lugar seguro.${NC}"
echo -e "${YELLOW}   Si las pierdes, necesitarás regenerarlas y los usuarios${NC}"
echo -e "${YELLOW}   existentes perderán sus sesiones.${NC}"

echo -e "\n${GREEN}✅ Setup completado. Ahora puedes ejecutar:${NC}"
echo -e "   ${CYAN}./deploy.sh${NC}  - Para desplegar la aplicación"
