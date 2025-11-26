#!/bin/bash

# ====================================================
# Script de inicio con ngrok para TableTop Mastering
# ====================================================

set -e

echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║   🎲 TABLETOP MASTERING - INICIO NGROK 🎲    ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: No se encuentra el archivo .env${NC}"
    echo -e "${YELLOW}💡 Copia el archivo .env.example a .env y configura tu NGROK_AUTHTOKEN${NC}"
    exit 1
fi

# Verificar que existe el NGROK_AUTHTOKEN
source .env
if [ -z "$NGROK_AUTHTOKEN" ]; then
    echo -e "${RED}❌ Error: NGROK_AUTHTOKEN no está configurado en el archivo .env${NC}"
    echo -e "${YELLOW}💡 Obtén tu token en: https://dashboard.ngrok.com/get-started/your-authtoken${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Deteniendo contenedores anteriores...${NC}"
docker-compose down

echo ""
echo -e "${BLUE}🔨 Reconstruyendo imágenes (esto puede tomar unos minutos la primera vez)...${NC}"
docker-compose build --no-cache frontend

echo ""
echo -e "${BLUE}🚀 Iniciando servicios con Docker Compose...${NC}"
docker-compose up -d

echo ""
echo -e "${BLUE}⏳ Esperando a que los servicios estén listos...${NC}"
sleep 10

# Esperar a que nginx esté saludable
echo -e "${YELLOW}🔍 Verificando estado de los servicios...${NC}"
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker-compose ps | grep -q "tabletop-nginx.*healthy"; then
        echo -e "${GREEN}✅ Nginx está listo${NC}"
        break
    fi
    attempt=$((attempt + 1))
    echo -e "${YELLOW}   Intento $attempt/$max_attempts...${NC}"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}❌ Timeout esperando a que Nginx esté listo${NC}"
    exit 1
fi

# Esperar un poco más para que ngrok se conecte
sleep 5

echo ""
echo -e "${BLUE}🌐 Obteniendo URL pública de ngrok...${NC}"

# Obtener la URL de ngrok desde su API
max_attempts=10
attempt=0
NGROK_URL=""

while [ $attempt -lt $max_attempts ]; do
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -n 1)
    
    if [ ! -z "$NGROK_URL" ]; then
        break
    fi
    
    attempt=$((attempt + 1))
    echo -e "${YELLOW}   Intento $attempt/$max_attempts...${NC}"
    sleep 2
done

if [ -z "$NGROK_URL" ]; then
    echo -e "${RED}❌ No se pudo obtener la URL de ngrok${NC}"
    echo -e "${YELLOW}💡 Verifica que el contenedor de ngrok esté corriendo: docker-compose ps${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}⚙️  Configurando frontend con URL de ngrok...${NC}"

# Actualizar el archivo .env con la URL de ngrok
if [ -f .env ]; then
    # Eliminar VITE_API_URL si existe
    sed -i '/^VITE_API_URL=/d' .env
    # Eliminar CLIENT_URL si existe y actualizarlo
    sed -i '/^CLIENT_URL=/d' .env
fi

# Agregar las nuevas URLs
echo "VITE_API_URL=${NGROK_URL}/api" >> .env
echo "CLIENT_URL=${NGROK_URL}" >> .env

echo -e "${GREEN}✅ Variables de entorno actualizadas${NC}"

echo -e "${BLUE}🔄 Reiniciando frontend con nueva configuración...${NC}"

# Detener y eliminar el contenedor del frontend
docker-compose rm -sf frontend

# Iniciar el frontend con las nuevas variables de entorno
VITE_API_URL="${NGROK_URL}/api" docker-compose up -d frontend

echo -e "${BLUE}⏳ Esperando a que el frontend se reinicie...${NC}"
sleep 15

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║           ✅ APLICACIÓN INICIADA ✅           ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🌍 URL Pública (compartible):${NC}"
echo -e "${BLUE}   $NGROK_URL${NC}"
echo ""
echo -e "${GREEN}📊 Panel de ngrok:${NC}"
echo -e "${BLUE}   http://localhost:4040${NC}"
echo ""
echo -e "${GREEN}💻 Acceso local:${NC}"
echo -e "${BLUE}   http://localhost${NC}"
echo ""
echo -e "${YELLOW}📝 Notas importantes:${NC}"
echo "   • La URL pública es temporal y cambiará cada vez que reinicies"
echo "   • El frontend está configurado para usar: ${NGROK_URL}/api"
echo "   • Los datos en MongoDB se mantienen entre reinicios (volumen persistente)"
echo "   • Para detener todo: docker-compose down"
echo "   • Para ver logs: docker-compose logs -f"
echo ""
echo -e "${GREEN}🎮 ¡Disfruta de TableTop Mastering!${NC}"
echo ""
