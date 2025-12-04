#!/bin/bash
# ============================================
# TABLETOP MASTERING - RENOVACIÓN DE CERTIFICADOS SSL
# Ejecutado automáticamente por cron (2 veces al día)
# ============================================

set -e

# Cargar configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config.sh"

LOG_FILE="/var/log/certbot-renewal.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Verificando renovación de certificados..."

# Certbot ya maneja internamente si necesita renovar (< 30 días)
# --deploy-hook solo se ejecuta si realmente se renovó
if certbot renew --quiet --deploy-hook "docker exec tabletop-nginx nginx -s reload 2>/dev/null || true"; then
    log "Verificación completada"
else
    log "ERROR: Fallo en certbot renew"
    exit 1
fi
