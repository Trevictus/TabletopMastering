#!/bin/bash
# ============================================
# TABLETOP MASTERING - CONFIGURACIÓN INICIAL SSL
# Ejecutar UNA SOLA VEZ para configurar Let's Encrypt
# Uso: sudo ./scripts/setup-ssl.sh
# ============================================

set -e

# Cargar configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config.sh"

# Colores
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log_info()    { echo -e "${CYAN}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error()   { echo -e "${RED}❌ $1${NC}"; }

# Verificar root
[[ "$EUID" -ne 0 ]] && { log_error "Ejecutar con sudo: sudo $0"; exit 1; }

echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   TABLETOP MASTERING - CONFIGURACIÓN SSL         ${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"

# 1. Instalar certbot si no existe
if ! command -v certbot &> /dev/null; then
    log_info "Instalando Certbot..."
    apt update -qq && apt install -y certbot
fi
log_success "Certbot disponible"

# 2. Verificar certificados existentes
if [ -d "${SSL_CERT_PATH}" ]; then
    log_warning "Ya existen certificados para ${DOMAIN}"
    read -p "¿Recrear certificados? (s/N): " response
    [[ ! "$response" =~ ^[Ss]$ ]] && { log_info "Cancelado"; exit 0; }
    certbot delete --cert-name "$DOMAIN" --non-interactive 2>/dev/null || true
fi

# 3. Detener nginx si está corriendo
if docker ps --format '{{.Names}}' | grep -q "tabletop-nginx"; then
    log_info "Deteniendo nginx..."
    docker stop tabletop-nginx 2>/dev/null || true
fi

# 4. Obtener certificado
log_info "Obteniendo certificado para ${DOMAIN}..."
certbot certonly --standalone -d "$DOMAIN" --email "$SSL_EMAIL" --agree-tos --non-interactive
log_success "Certificado obtenido"

# 5. Generar parámetros DH (si no existen)
if [ ! -f "$SSL_DHPARAMS" ]; then
    log_info "Generando parámetros Diffie-Hellman (1-2 min)..."
    openssl dhparam -out "$SSL_DHPARAMS" 2048
    log_success "Parámetros DH generados"
fi

# 6. Ajustar permisos para Docker
chmod 755 /etc/letsencrypt/live/ /etc/letsencrypt/archive/

# 7. Configurar cron para renovación automática
cat > /etc/cron.d/certbot-tabletop << EOF
# Renovación automática SSL - TabletopMastering
0 3,15 * * * root ${SCRIPT_DIR}/renew-ssl.sh >> /var/log/certbot-renewal.log 2>&1
EOF
chmod 644 /etc/cron.d/certbot-tabletop
log_success "Renovación automática configurada"

# 8. Resumen
echo -e "\n${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ SSL CONFIGURADO CORRECTAMENTE               ${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "\n${CYAN}Siguiente paso:${NC} ./deploy.sh"
echo -e "${CYAN}Ver certificados:${NC} sudo certbot certificates"
echo ""
