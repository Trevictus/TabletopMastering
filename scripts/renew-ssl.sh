#!/bin/bash
# ============================================
# TABLETOP MASTERING - RENOVACIÓN DE CERTIFICADOS SSL
# Script para renovar certificados Let's Encrypt con Docker
# Ejecutado automáticamente por cron (2 veces al día)
# ============================================

set -e

# Configuración - detectar directorio del proyecto automáticamente
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Si estamos en /opt/tabletop-mastering, usar esa ruta
if [ -f "/opt/tabletop-mastering/docker-compose-prod.yml" ]; then
    PROJECT_DIR="/opt/tabletop-mastering"
fi

COMPOSE_FILE="${PROJECT_DIR}/docker-compose-prod.yml"
LOG_FILE="/var/log/certbot-renewal.log"
DOMAIN="tabletopmastering.games"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Verificar si el certificado necesita renovación (menos de 30 días)
check_cert_expiry() {
    local cert_file="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
    if [ ! -f "$cert_file" ]; then
        log "ERROR: Certificado no encontrado"
        return 1
    fi
    
    local expiry_date
    expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
    local expiry_epoch
    expiry_epoch=$(date -d "$expiry_date" +%s)
    local now_epoch
    now_epoch=$(date +%s)
    local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
    
    log "Días restantes del certificado: ${days_left}"
    
    if [ "$days_left" -lt 30 ]; then
        return 0  # Necesita renovación
    else
        return 1  # No necesita renovación
    fi
}

log "=== Iniciando verificación de certificados ==="

# Verificar si necesita renovación
if ! check_cert_expiry; then
    log "Certificado válido, no requiere renovación"
    exit 0
fi

log "Iniciando renovación de certificados..."

# Intentar renovar (certbot solo renueva si faltan menos de 30 días)
if certbot renew --quiet --deploy-hook "docker exec tabletop-nginx nginx -s reload 2>/dev/null || true"; then
    log "Certificados renovados exitosamente"
    
    # Recargar nginx para aplicar los nuevos certificados (por si el hook falló)
    if docker exec tabletop-nginx nginx -s reload 2>/dev/null; then
        log "Nginx recargado exitosamente"
    else
        log "ADVERTENCIA: No se pudo recargar nginx. Intentando reiniciar contenedor..."
        if [ -f "$COMPOSE_FILE" ]; then
            cd "$PROJECT_DIR" && docker compose -f "$COMPOSE_FILE" restart nginx
            log "Contenedor nginx reiniciado"
        fi
    fi
else
    log "ERROR: Fallo en la renovación de certificados"
    exit 1
fi

log "=== Renovación completada ==="
