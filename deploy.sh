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
readonly ENV_EXAMPLE="${SCRIPT_DIR}/.env.example.prod"
readonly COMPOSE_FILE="${SCRIPT_DIR}/docker-compose-prod.yml"
readonly CREDENTIALS_FILE="${SCRIPT_DIR}/.credentials"

# Colores para output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Flag para detectar si las credenciales de MongoDB cambiaron
MONGO_CREDENTIALS_CHANGED=false

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
    
    # Verificar que existe .env.example.prod
    if [ ! -f "$ENV_EXAMPLE" ]; then
        log_error "No se encontró archivo .env.example.prod"
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
    
    # Marcar que las credenciales han cambiado para limpiar el volumen de MongoDB
    MONGO_CREDENTIALS_CHANGED=true
    
    log_success "Archivo .env creado con claves seguras"
}

# Verifica si el volumen de MongoDB necesita ser recreado
# MongoDB solo crea el usuario root en la primera inicialización con volumen vacío
check_mongodb_volume() {
    if [ "$MONGO_CREDENTIALS_CHANGED" = true ]; then
        log_warning "Las credenciales de MongoDB han cambiado"
        
        # Verificar si el volumen existe
        if docker volume ls -q | grep -q "tabletop-mongodb-data"; then
            log_warning "Se encontró volumen existente: tabletop-mongodb-data"
            log_info "Intentando actualizar credenciales sin perder datos..."
            
            # Intentar crear/actualizar el usuario en MongoDB
            if update_mongodb_credentials; then
                log_success "Credenciales de MongoDB actualizadas correctamente"
                return 0
            fi
            
            # Si falla la actualización, ofrecer opciones
            echo ""
            echo -e "${YELLOW}⚠️  No se pudieron actualizar las credenciales automáticamente${NC}"
            echo -e "${YELLOW}   Opciones disponibles:${NC}"
            echo ""
            echo -e "   ${CYAN}1)${NC} Eliminar volumen y empezar desde cero (PERDERÁS TODOS LOS DATOS)"
            echo -e "   ${CYAN}2)${NC} Cancelar y restaurar credenciales antiguas del backup"
            echo ""
            read -p "Elige una opción (1/2): " option
            
            case $option in
                1)
                    log_warning "Eliminando volumen de MongoDB..."
                    docker volume rm tabletop-mongodb-data 2>/dev/null || true
                    log_success "Volumen eliminado. Se creará uno nuevo con las credenciales correctas"
                    ;;
                *)
                    log_error "Despliegue cancelado."
                    log_info "Restaura el archivo .env.backup con las credenciales antiguas"
                    exit 1
                    ;;
            esac
        fi
    fi
}

# Actualiza las credenciales de MongoDB sin perder datos
update_mongodb_credentials() {
    log_info "Iniciando contenedor de MongoDB temporalmente..."
    
    # Cargar las nuevas credenciales del .env
    local mongo_user
    local mongo_pass
    local mongo_db
    mongo_user=$(grep "^MONGO_USERNAME=" "$ENV_FILE" | cut -d'=' -f2)
    mongo_pass=$(grep "^MONGO_PASSWORD=" "$ENV_FILE" | cut -d'=' -f2)
    mongo_db=$(grep "^MONGO_DBNAME=" "$ENV_FILE" | cut -d'=' -f2)
    mongo_db=${mongo_db:-tabletop_mastering}
    
    # Iniciar solo MongoDB sin las variables de entorno de inicialización
    # para poder acceder sin autenticación y crear el usuario
    docker run -d --rm \
        --name tabletop-mongodb-temp \
        -v tabletop-mongodb-data:/data/db \
        mongo:8 \
        mongod --bind_ip_all >/dev/null 2>&1
    
    # Esperar a que MongoDB esté listo
    sleep 5
    
    # Intentar crear o actualizar el usuario
    local result
    result=$(docker exec tabletop-mongodb-temp mongosh --quiet --eval "
        try {
            // Intentar eliminar usuario existente si existe
            db.getSiblingDB('admin').dropUser('${mongo_user}');
        } catch(e) {}
        
        // Crear el nuevo usuario
        db.getSiblingDB('admin').createUser({
            user: '${mongo_user}',
            pwd: '${mongo_pass}',
            roles: [
                { role: 'root', db: 'admin' },
                { role: 'readWrite', db: '${mongo_db}' }
            ]
        });
        print('USER_CREATED_SUCCESS');
    " 2>&1)
    
    # Detener el contenedor temporal
    docker stop tabletop-mongodb-temp >/dev/null 2>&1 || true
    
    # Verificar si tuvo éxito
    if echo "$result" | grep -q "USER_CREATED_SUCCESS"; then
        return 0
    else
        log_warning "No se pudo crear el usuario: $result"
        return 1
    fi
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
    docker compose -f "$COMPOSE_FILE" down 2>/dev/null || true
    log_success "Contenedores detenidos"
}

build_images() {
    log_step "🔨 Paso 2/4: Construyendo imágenes de producción..."
    docker compose -f "$COMPOSE_FILE" build --no-cache
    log_success "Imágenes construidas"
}

start_services() {
    log_step "🚀 Paso 3/4: Iniciando servicios..."
    docker compose -f "$COMPOSE_FILE" up -d
    log_success "Servicios iniciados"
}

wait_for_services() {
    log_step "⏳ Paso 4/4: Esperando que los servicios estén listos..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker compose -f "$COMPOSE_FILE" ps | grep -q "healthy"; then
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
    docker compose -f "$COMPOSE_FILE" ps
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
    echo -e "   Ver logs:        ${CYAN}docker compose -f docker-compose-prod.yml logs -f${NC}"
    echo -e "   Solo backend:    ${CYAN}docker compose -f docker-compose-prod.yml logs -f backend${NC}"
    echo -e "   Detener:         ${CYAN}docker compose -f docker-compose-prod.yml down${NC}"
    echo -e "   Reiniciar:       ${CYAN}docker compose -f docker-compose-prod.yml restart${NC}"
    echo -e "   Estado:          ${CYAN}docker compose -f docker-compose-prod.yml ps${NC}"
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
    check_mongodb_volume  # Verificar si hay que recrear el volumen de MongoDB
    build_images
    start_services
    wait_for_services
    show_status
    show_summary
}

# Ejecutar
main "$@"
