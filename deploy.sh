#!/bin/bash
# ============================================
# TABLETOP MASTERING - SCRIPT DE DESPLIEGUE
# Despliega la aplicación en un servidor con Docker
# ============================================

set -e

# ============================================
# CONFIGURACIÓN
# ============================================
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ENV_FILE="${SCRIPT_DIR}/.env"
readonly ENV_EXAMPLE="${SCRIPT_DIR}/.env.example"
readonly CREDENTIALS_FILE="${SCRIPT_DIR}/.credentials"

# Colores para output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# ============================================
# FUNCIONES AUXILIARES
# ============================================

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "\n${YELLOW}$1${NC}"
}

# Genera una clave segura sin caracteres problemáticos
generate_secure_key() {
    local length=${1:-32}
    openssl rand -base64 $((length * 2)) | tr -d '\n/+=' | head -c "$length"
}

# Verifica si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ============================================
# VALIDACIONES
# ============================================

check_dependencies() {
    log_step "🔍 Verificando dependencias..."
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! command_exists openssl; then
        missing_deps+=("openssl")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Faltan dependencias: ${missing_deps[*]}"
        exit 1
    fi
    
    # Verificar que Docker está corriendo
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker no está corriendo. Inicia Docker e intenta de nuevo."
        exit 1
    fi
    
    log_success "Todas las dependencias están instaladas"
}

# ============================================
# GESTIÓN DE VARIABLES DE ENTORNO
# ============================================

setup_env() {
    log_step "🔐 Configurando variables de entorno..."
    
    # Verificar que existe .env.example
    if [ ! -f "$ENV_EXAMPLE" ]; then
        log_error "No se encontró archivo .env.example"
        exit 1
    fi
    
    # Si no existe .env, crearlo desde el ejemplo
    if [ ! -f "$ENV_FILE" ]; then
        log_info "Creando archivo .env desde plantilla..."
        create_env_file
    else
        # Verificar si tiene claves por defecto (inseguras)
        if grep -q "CAMBIA_ESTA_CONTRASENA_SEGURA" "$ENV_FILE" || \
           grep -q "CAMBIA_ESTO_POR_UNA_CLAVE" "$ENV_FILE"; then
            log_warning "Se detectaron claves por defecto en .env"
            log_info "Regenerando claves seguras..."
            create_env_file
        else
            log_success "Archivo .env existente con claves configuradas"
        fi
    fi
}

create_env_file() {
    # Backup si existe .env previo
    if [ -f "$ENV_FILE" ]; then
        local backup_file="${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$ENV_FILE" "$backup_file"
        log_info "Backup creado: $backup_file"
    fi
    
    # Generar claves seguras
    local jwt_secret
    local mongo_password
    jwt_secret=$(generate_secure_key 64)
    mongo_password=$(generate_secure_key 32)
    
    # Copiar plantilla y reemplazar claves
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    
    # Usar sed para reemplazar los placeholders
    sed -i "s|MONGO_PASSWORD=CAMBIA_ESTA_CONTRASENA_SEGURA_123!|MONGO_PASSWORD=${mongo_password}|g" "$ENV_FILE"
    sed -i "s|JWT_SECRET=CAMBIA_ESTO_POR_UNA_CLAVE_SECRETA_MUY_LARGA_Y_SEGURA|JWT_SECRET=${jwt_secret}|g" "$ENV_FILE"
    
    # Guardar credenciales en archivo separado (para referencia)
    save_credentials "$jwt_secret" "$mongo_password"
    
    log_success "Archivo .env creado con claves seguras"
}

save_credentials() {
    local jwt_secret=$1
    local mongo_password=$2
    
    cat > "$CREDENTIALS_FILE" << EOF
# ============================================
# CREDENCIALES GENERADAS - $(date)
# ============================================
# ⚠️  GUARDA ESTE ARCHIVO EN UN LUGAR SEGURO
# ⚠️  NO LO SUBAS A GIT (ya está en .gitignore)
# ============================================

JWT_SECRET=${jwt_secret}
MONGO_PASSWORD=${mongo_password}
EOF
    
    chmod 600 "$CREDENTIALS_FILE"
    log_info "Credenciales guardadas en: $CREDENTIALS_FILE"
}

# ============================================
# DESPLIEGUE
# ============================================

stop_containers() {
    log_step "📦 Paso 1/4: Deteniendo contenedores existentes..."
    docker compose down 2>/dev/null || true
    log_success "Contenedores detenidos"
}

build_images() {
    log_step "🔨 Paso 2/4: Construyendo imágenes de producción..."
    docker compose build --no-cache
    log_success "Imágenes construidas"
}

start_services() {
    log_step "🚀 Paso 3/4: Iniciando servicios..."
    docker compose up -d
    log_success "Servicios iniciados"
}

wait_for_services() {
    log_step "⏳ Paso 4/4: Esperando que los servicios estén listos..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker compose ps | grep -q "healthy"; then
            log_success "Servicios listos"
            return 0
        fi
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    echo ""
    log_warning "Timeout esperando servicios. Verificando estado..."
}

show_status() {
    echo -e "\n${CYAN}════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}📊 ESTADO DE LOS CONTENEDORES:${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
    docker compose ps
}

show_summary() {
    local server_ip
    server_ip=$(hostname -I | awk '{print $1}')
    
    echo -e "\n${GREEN}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✅ ¡DESPLIEGUE COMPLETADO!                   ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
    
    echo -e "\n${CYAN}🌐 La aplicación está disponible en:${NC}"
    echo -e "   http://${server_ip}"
    
    # Mostrar CLIENT_URL si está configurado
    if [ -f "$ENV_FILE" ]; then
        local client_url
        client_url=$(grep "^CLIENT_URL=" "$ENV_FILE" | cut -d'=' -f2)
        if [ -n "$client_url" ] && [ "$client_url" != "http://${server_ip}" ]; then
            echo -e "   ${client_url}"
        fi
    fi
    
    echo -e "\n${YELLOW}📋 Comandos útiles:${NC}"
    echo -e "   Ver logs:        ${CYAN}docker compose logs -f${NC}"
    echo -e "   Solo backend:    ${CYAN}docker compose logs -f backend${NC}"
    echo -e "   Detener:         ${CYAN}docker compose down${NC}"
    echo -e "   Reiniciar:       ${CYAN}docker compose restart${NC}"
    echo -e "   Estado:          ${CYAN}docker compose ps${NC}"
}

# ============================================
# MAIN
# ============================================

main() {
    echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     TABLETOP MASTERING - DESPLIEGUE              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
    
    # Cambiar al directorio del script
    cd "$SCRIPT_DIR"
    
    # Ejecutar pasos
    check_dependencies
    setup_env
    stop_containers
    build_images
    start_services
    wait_for_services
    show_status
    show_summary
}

# Ejecutar
main "$@"
