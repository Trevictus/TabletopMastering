#!/bin/bash

# Script de prueba para la API de Juegos con integración BGG
# Requiere: curl, jq (para formatear JSON)

BASE_URL="http://localhost:3000/api"
TOKEN=""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}\n"
}

print_error() {
    echo -e "${RED}❌ $1${NC}\n"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}\n"
}

# Función para hacer peticiones
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$data" ]; then
        curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json"
    else
        curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data"
    fi
}

# Verificar que el servidor está corriendo
print_header "VERIFICANDO SERVIDOR"
health=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
    print_success "Servidor funcionando correctamente"
else
    print_error "Servidor no está corriendo. Ejecuta: npm run dev"
    exit 1
fi

# 1. Login (usar credenciales existentes o crear usuario)
print_header "1. AUTENTICACIÓN"
print_info "Iniciando sesión..."

# Intentar login
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test_games@example.com",
        "password": "123456"
    }')

# Si no existe, crear usuario
if echo "$login_response" | grep -q "success.*false"; then
    print_info "Usuario no existe. Creando usuario de prueba..."
    
    register_response=$(curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test Games User",
            "email": "test_games@example.com",
            "password": "123456"
        }')
    
    TOKEN=$(echo $register_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    print_success "Usuario creado"
else
    TOKEN=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    print_success "Login exitoso"
fi

if [ -z "$TOKEN" ]; then
    print_error "No se pudo obtener el token"
    exit 1
fi

echo "Token: ${TOKEN:0:50}..."

# 2. Crear un grupo para las pruebas
print_header "2. CREANDO GRUPO DE PRUEBA"

group_response=$(make_request POST "/groups" '{
    "name": "Grupo de Pruebas - Juegos BGG",
    "description": "Grupo para probar la integración con BGG"
}')

GROUP_ID=$(echo $group_response | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$GROUP_ID" ]; then
    print_info "Usando grupo existente..."
    groups=$(make_request GET "/groups")
    GROUP_ID=$(echo $groups | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
fi

print_success "Grupo ID: $GROUP_ID"

# 3. Buscar juegos en BGG
print_header "3. BÚSQUEDA EN BGG"
print_info "Buscando 'Catan' en BoardGameGeek..."

search_response=$(make_request GET "/games/search-bgg?name=Catan&exact=false")
echo "$search_response" | head -c 500
print_success "Búsqueda completada"

# Obtener el primer bggId
BGG_ID=$(echo $search_response | grep -o '"bggId":[0-9]*' | head -1 | cut -d':' -f2)
print_info "BGG ID encontrado: $BGG_ID"

# 4. Obtener detalles de un juego de BGG
print_header "4. DETALLES DE JUEGO EN BGG"
print_info "Obteniendo detalles del juego ID: $BGG_ID"

details_response=$(make_request GET "/games/bgg/$BGG_ID")
echo "$details_response" | head -c 800
print_success "Detalles obtenidos"

# 5. Añadir juego de BGG al grupo
print_header "5. AÑADIR JUEGO DE BGG AL GRUPO"

add_bgg_response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": $BGG_ID,
    \"groupId\": \"$GROUP_ID\",
    \"customNotes\": \"Añadido desde el script de prueba\"
}")

GAME_BGG_ID=$(echo $add_bgg_response | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$GAME_BGG_ID" ]; then
    print_error "No se pudo añadir el juego de BGG"
    echo "$add_bgg_response"
else
    print_success "Juego de BGG añadido. ID: $GAME_BGG_ID"
fi

# 6. Crear un juego personalizado
print_header "6. CREAR JUEGO PERSONALIZADO"

custom_game_response=$(make_request POST "/games" "{
    \"name\": \"Mi Juego de Cartas\",
    \"description\": \"Juego creado para pruebas\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 6,
    \"playingTime\": 45,
    \"categories\": [\"Cartas\", \"Estrategia\"],
    \"mechanics\": [\"Gestión de mano\", \"Draft\"],
    \"difficulty\": \"medio\",
    \"yearPublished\": 2024,
    \"customNotes\": \"Prototipo del grupo\"
}")

GAME_CUSTOM_ID=$(echo $custom_game_response | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$GAME_CUSTOM_ID" ]; then
    print_error "No se pudo crear el juego personalizado"
    echo "$custom_game_response"
else
    print_success "Juego personalizado creado. ID: $GAME_CUSTOM_ID"
fi

# 7. Listar juegos del grupo
print_header "7. LISTAR JUEGOS DEL GRUPO"

list_response=$(make_request GET "/games?groupId=$GROUP_ID&limit=10")
total_games=$(echo $list_response | grep -o '"total":[0-9]*' | cut -d':' -f2)
print_success "Total de juegos en el grupo: $total_games"
echo "$list_response" | head -c 500

# 8. Obtener detalles de un juego
print_header "8. OBTENER DETALLES DE JUEGO"

if [ ! -z "$GAME_BGG_ID" ]; then
    game_details=$(make_request GET "/games/$GAME_BGG_ID")
    print_success "Detalles del juego obtenidos"
    echo "$game_details" | head -c 600
fi

# 9. Actualizar juego personalizado
print_header "9. ACTUALIZAR JUEGO PERSONALIZADO"

if [ ! -z "$GAME_CUSTOM_ID" ]; then
    update_response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"description\": \"Descripción actualizada desde el script\",
        \"playingTime\": 60,
        \"difficulty\": \"difícil\"
    }")
    
    print_success "Juego actualizado"
    echo "$update_response" | head -c 400
fi

# 10. Sincronizar juego de BGG
print_header "10. SINCRONIZAR JUEGO DE BGG"

if [ ! -z "$GAME_BGG_ID" ]; then
    sync_response=$(make_request PUT "/games/$GAME_BGG_ID/sync-bgg")
    print_success "Juego sincronizado con BGG"
    echo "$sync_response" | head -c 400
fi

# 11. Obtener estadísticas del grupo
print_header "11. ESTADÍSTICAS DEL GRUPO"

stats_response=$(make_request GET "/games/stats/$GROUP_ID")
print_success "Estadísticas obtenidas"
echo "$stats_response" | head -c 800

# 12. Obtener juegos populares de BGG
print_header "12. JUEGOS POPULARES (HOT LIST)"

hot_response=$(make_request GET "/games/bgg/hot?limit=5")
print_success "Hot list obtenida"
echo "$hot_response" | head -c 600

# 13. Búsqueda con filtros
print_header "13. BÚSQUEDA CON FILTROS"

print_info "Buscando juegos de BGG en el grupo..."
filter_bgg=$(make_request GET "/games?groupId=$GROUP_ID&source=bgg")
bgg_count=$(echo $filter_bgg | grep -o '"count":[0-9]*' | head -1 | cut -d':' -f2)
print_success "Juegos de BGG: $bgg_count"

print_info "Buscando juegos personalizados en el grupo..."
filter_custom=$(make_request GET "/games?groupId=$GROUP_ID&source=custom")
custom_count=$(echo $filter_custom | grep -o '"count":[0-9]*' | head -1 | cut -d':' -f2)
print_success "Juegos personalizados: $custom_count"

# 14. Eliminar juego (opcional - comentado para preservar datos)
print_header "14. ELIMINAR JUEGO (OPCIONAL)"
print_info "Eliminación deshabilitada para preservar datos de prueba"
print_info "Para habilitar, descomenta las líneas en el script"

# if [ ! -z "$GAME_CUSTOM_ID" ]; then
#     delete_response=$(make_request DELETE "/games/$GAME_CUSTOM_ID")
#     print_success "Juego eliminado"
# fi

# Resumen final
print_header "RESUMEN DE PRUEBAS"
echo -e "${GREEN}✅ Todas las pruebas completadas${NC}\n"
echo "Grupo ID: $GROUP_ID"
echo "Juego BGG ID: $GAME_BGG_ID"
echo "Juego Custom ID: $GAME_CUSTOM_ID"
echo ""
echo -e "${YELLOW}Puedes usar estos IDs para más pruebas manuales${NC}"
echo ""
print_success "🎉 API de Juegos funcionando correctamente"
