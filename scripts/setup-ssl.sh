#!/bin/bash
# ============================================
# TABLETOP MASTERING - CONFIGURACIÓN INICIAL SSL
# Ejecutar UNA SOLA VEZ para configurar Let's Encrypt
# ============================================

set -e

# Configuración
readonly DOMAIN="tabletopmastering.games"
readonly EMAIL="juanfu224@gmail.com"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colores
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

log_info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "\n${YELLOW}━━━━━━ $1 ━━━━━━${NC}"; }

# Verificar si se ejecuta como root o con sudo
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "Este script debe ejecutarse con sudo"
        echo -e "   Uso: ${CYAN}sudo $0${NC}"
        exit 1
    fi
}

# Verificar dependencias
check_dependencies() {
    log_step "Verificando dependencias"
    
    if ! command -v certbot &> /dev/null; then
        log_info "Instalando Certbot..."
        apt update && apt install -y certbot
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    log_success "Dependencias verificadas"
}

# Verificar si ya existen certificados
check_existing_certs() {
    if [ -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
        log_warning "Ya existen certificados para ${DOMAIN}"
        echo ""
        read -p "¿Deseas renovar/recrear los certificados? (s/N): " response
        if [[ ! "$response" =~ ^[Ss]$ ]]; then
            log_info "Operación cancelada"
            exit 0
        fi
        # Eliminar certificados existentes
        certbot delete --cert-name "$DOMAIN" --non-interactive 2>/dev/null || true
    fi
}

# Detener nginx para liberar puerto 80
stop_nginx() {
    log_step "Preparando entorno"
    
    if docker ps --format '{{.Names}}' | grep -q "tabletop-nginx"; then
        log_info "Deteniendo contenedor nginx..."
        docker stop tabletop-nginx 2>/dev/null || true
        log_success "Nginx detenido"
    else
        log_info "Nginx no está corriendo"
    fi
}

# Obtener certificado
obtain_certificate() {
    log_step "Obteniendo certificado SSL"
    
    log_info "Solicitando certificado para: ${DOMAIN}"
    log_info "Email de registro: ${EMAIL}"
    
    if certbot certonly \
        --standalone \
        -d "$DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive \
        --force-renewal; then
        log_success "Certificado obtenido exitosamente"
    else
        log_error "Error al obtener el certificado"
        exit 1
    fi
}

# Generar parámetros Diffie-Hellman
generate_dhparams() {
    log_step "Generando parámetros Diffie-Hellman"
    
    if [ -f "/etc/letsencrypt/ssl-dhparams.pem" ]; then
        log_info "Parámetros DH ya existen, omitiendo..."
    else
        log_info "Generando parámetros DH (esto puede tardar 1-2 minutos)..."
        openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
        log_success "Parámetros DH generados"
    fi
}

# Configurar renovación automática
setup_auto_renewal() {
    log_step "Configurando renovación automática"
    
    local renewal_script="${PROJECT_DIR}/scripts/renew-ssl.sh"
    local cron_file="/etc/cron.d/certbot-tabletop"
    
    # Hacer ejecutable el script de renovación
    chmod +x "$renewal_script"
    
    # Crear archivo cron
    cat > "$cron_file" << EOF
# Renovación automática de certificados SSL para TabletopMastering
# Se ejecuta dos veces al día (recomendado por Let's Encrypt)
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

0 3,15 * * * root ${renewal_script} >> /var/log/certbot-renewal.log 2>&1
EOF
    
    chmod 644 "$cron_file"
    log_success "Renovación automática configurada (3:00 AM y 3:00 PM)"
    
    # Verificar que cron está corriendo
    if systemctl is-active --quiet cron; then
        log_success "Servicio cron activo"
    else
        systemctl start cron
        systemctl enable cron
        log_success "Servicio cron iniciado"
    fi
}

# Verificar certificado
verify_certificate() {
    log_step "Verificando certificado"
    
    local cert_path="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
    
    if [ -f "$cert_path" ]; then
        log_info "Información del certificado:"
        echo ""
        openssl x509 -in "$cert_path" -noout -subject -dates | sed 's/^/   /'
        echo ""
        log_success "Certificado válido instalado"
    else
        log_error "No se encontró el certificado"
        exit 1
    fi
}

# Mostrar resumen
show_summary() {
    echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║        ✅ CONFIGURACIÓN SSL COMPLETADA                   ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    
    echo -e "\n${CYAN}📜 Certificados instalados en:${NC}"
    echo -e "   /etc/letsencrypt/live/${DOMAIN}/"
    
    echo -e "\n${CYAN}🔄 Renovación automática:${NC}"
    echo -e "   Configurada para ejecutarse 2 veces al día"
    echo -e "   Log: /var/log/certbot-renewal.log"
    
    echo -e "\n${YELLOW}📋 Siguiente paso:${NC}"
    echo -e "   Ejecuta el deploy para iniciar la aplicación con HTTPS:"
    echo -e "   ${CYAN}./deploy.sh${NC}"
    
    echo -e "\n${YELLOW}🔧 Comandos útiles:${NC}"
    echo -e "   Ver certificados:    ${CYAN}sudo certbot certificates${NC}"
    echo -e "   Renovar manual:      ${CYAN}sudo ${PROJECT_DIR}/scripts/renew-ssl.sh${NC}"
    echo -e "   Test renovación:     ${CYAN}sudo certbot renew --dry-run${NC}"
    echo ""
}

# Main
main() {
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     TABLETOP MASTERING - CONFIGURACIÓN SSL               ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    
    check_root
    check_dependencies
    check_existing_certs
    stop_nginx
    obtain_certificate
    generate_dhparams
    setup_auto_renewal
    verify_certificate
    show_summary
}

main "$@"
