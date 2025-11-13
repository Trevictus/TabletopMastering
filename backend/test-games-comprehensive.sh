#!/bin/bash

# ========================================================================
# SUITE COMPLETA DE TESTS - API DE JUEGOS
# ========================================================================
# Tests exhaustivos de todos los endpoints con escenarios de éxito y error
# Incluye validación de express-validator y casos edge
# ========================================================================

# Activar modo MOCK para BGG Service
export USE_BGG_MOCK=true

BASE_URL="http://localhost:3000/api"
TOKEN=""
GROUP_ID=""
GAME_BGG_ID=""
GAME_CUSTOM_ID=""
BGG_TEST_ID=13  # Catan - ID conocido en BGG

# Contadores de tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ========================================================================
# FUNCIONES DE UTILIDAD
# ========================================================================

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_test() {
    echo -e "${CYAN}▶ TEST: $1${NC}"
}

print_success() {
    echo -e "${GREEN}  ✅ PASS: $1${NC}"
    ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
}

print_fail() {
    echo -e "${RED}  ❌ FAIL: $1${NC}"
    ((FAILED_TESTS++))
    ((TOTAL_TESTS++))
}

print_error() {
    echo -e "${RED}❌ ERROR CRÍTICO: $1${NC}\n"
}

print_info() {
    echo -e "${YELLOW}  ℹ️  $1${NC}"
}

# Función para hacer peticiones
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth=${4:-true}
    
    if [ "$auth" = true ]; then
        auth_header="Authorization: Bearer $TOKEN"
    else
        auth_header="Authorization: Bearer invalid_token"
    fi
    
    if [ -z "$data" ]; then
        curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "$auth_header" \
            -H "Content-Type: application/json"
    else
        curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "$auth_header" \
            -H "Content-Type: application/json" \
            -d "$data"
    fi
}

# Función para validar código de estado
assert_status() {
    local response=$1
    local expected=$2
    local message=$3
    
    local status=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$status" = "$expected" ]; then
        print_success "$message (Status: $status)"
        return 0
    else
        print_fail "$message - Expected: $expected, Got: $status"
        echo -e "${RED}  Response: ${body:0:200}${NC}"
        return 1
    fi
}

# Función para validar que contiene texto
assert_contains() {
    local response=$1
    local text=$2
    local message=$3
    
    local body=$(echo "$response" | sed '$d')
    
    if echo "$body" | grep -q "$text"; then
        print_success "$message"
        return 0
    else
        print_fail "$message - Text '$text' not found"
        echo -e "${RED}  Response: ${body:0:200}${NC}"
        return 1
    fi
}

# ========================================================================
# SETUP - VERIFICACIÓN Y AUTENTICACIÓN
# ========================================================================

print_header "SETUP - VERIFICACIÓN DEL SERVIDOR"

# Verificar servidor
health=$(curl -s http://localhost:3000/health 2>/dev/null)
if [ $? -eq 0 ]; then
    print_info "Servidor funcionando en http://localhost:3000"
else
    print_error "Servidor no disponible. Ejecuta: npm run dev"
    exit 1
fi

print_header "SETUP - AUTENTICACIÓN"

# Registrar usuario de prueba (si no existe)
timestamp=$(date +%s)
test_email="test_games_${timestamp}@example.com"

register_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test User Games\",
        \"email\": \"$test_email\",
        \"password\": \"12345678\"
    }")

TOKEN=$(echo "$register_response" | sed '$d' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    print_error "No se pudo obtener token de autenticación"
    exit 1
fi

print_info "Usuario de prueba creado: $test_email"
print_info "Token obtenido: ${TOKEN:0:30}..."

# Crear grupo de prueba
group_response=$(make_request POST "/groups" "{
    \"name\": \"Test Group - Comprehensive ${timestamp}\",
    \"description\": \"Grupo para tests exhaustivos\"
}")

GROUP_ID=$(echo "$group_response" | sed '$d' | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$GROUP_ID" ]; then
    print_error "No se pudo crear grupo de prueba"
    exit 1
fi

print_info "Grupo de prueba creado: $GROUP_ID"
echo ""

# ========================================================================
# TESTS DE BÚSQUEDA EN BGG
# ========================================================================

print_header "TEST SUITE 1: BÚSQUEDA EN BGG (GET /api/games/search-bgg)"

# Test 1.1: Búsqueda exitosa
print_test "Búsqueda exitosa con nombre válido"
response=$(make_request GET "/games/search-bgg?name=Catan&exact=false")
assert_status "$response" 200 "Búsqueda de 'Catan' exitosa"
assert_contains "$response" '"success":true' "Respuesta contiene success:true"
assert_contains "$response" '"bggId"' "Respuesta contiene bggId"
echo ""

# Test 1.2: Búsqueda exacta
print_test "Búsqueda exacta activada"
response=$(make_request GET "/games/search-bgg?name=Catan&exact=true")
assert_status "$response" 200 "Búsqueda exacta exitosa"
echo ""

# Test 1.3: Error - Sin parámetro name
print_test "Error: Sin parámetro 'name'"
response=$(make_request GET "/games/search-bgg?exact=false")
assert_status "$response" 400 "Error de validación sin 'name'"
assert_contains "$response" '"success":false' "Respuesta indica error"
echo ""

# Test 1.4: Error - name muy corto
print_test "Error: Parámetro 'name' muy corto (1 caracter)"
response=$(make_request GET "/games/search-bgg?name=a")
assert_status "$response" 400 "Error de validación - name muy corto"
assert_contains "$response" "al menos 2 caracteres" "Mensaje de error apropiado"
echo ""

# Test 1.5: Error - exact inválido
print_test "Error: Parámetro 'exact' inválido"
response=$(make_request GET "/games/search-bgg?name=Catan&exact=invalid")
assert_status "$response" 400 "Error de validación - exact inválido"
echo ""

# Test 1.6: Error - Sin autenticación
print_test "Error: Sin token de autenticación"
response=$(make_request GET "/games/search-bgg?name=Catan" "" false)
assert_status "$response" 401 "Error de autenticación"
echo ""

# ========================================================================
# TESTS DE DETALLES DE BGG
# ========================================================================

print_header "TEST SUITE 2: DETALLES DE BGG (GET /api/games/bgg/:bggId)"

# Test 2.1: Obtener detalles exitoso
print_test "Obtener detalles de juego válido (Catan - ID: $BGG_TEST_ID)"
response=$(make_request GET "/games/bgg/$BGG_TEST_ID")
assert_status "$response" 200 "Detalles obtenidos exitosamente"
assert_contains "$response" '"bggId":13' "Contiene bggId correcto"
assert_contains "$response" '"name"' "Contiene nombre del juego"
assert_contains "$response" '"source":"bgg"' "Source es BGG"
echo ""

# Test 2.2: Error - bggId inválido (texto)
print_test "Error: bggId inválido (texto en lugar de número)"
response=$(make_request GET "/games/bgg/abc")
assert_status "$response" 400 "Error de validación - bggId inválido"
assert_contains "$response" "ID de BGG inválido" "Mensaje de error apropiado"
echo ""

# Test 2.3: Error - bggId negativo
print_test "Error: bggId negativo"
response=$(make_request GET "/games/bgg/-1")
assert_status "$response" 400 "Error de validación - bggId negativo"
echo ""

# Test 2.4: Error - bggId inexistente
print_test "Error: bggId inexistente (99999999)"
response=$(make_request GET "/games/bgg/99999999")
# BGG puede retornar 404 o 500 dependiendo del caso
status=$(echo "$response" | tail -n1)
if [ "$status" = "404" ] || [ "$status" = "500" ]; then
    print_success "Error apropiado para bggId inexistente (Status: $status)"
    ((TOTAL_TESTS++))
    ((PASSED_TESTS++))
else
    print_fail "Expected 404 or 500, got $status"
    ((TOTAL_TESTS++))
    ((FAILED_TESTS++))
fi
echo ""

# ========================================================================
# TESTS DE HOT LIST BGG
# ========================================================================

print_header "TEST SUITE 3: HOT LIST BGG (GET /api/games/bgg/hot)"

# Test 3.1: Hot list exitosa con limit
print_test "Obtener hot list con limit=5"
response=$(make_request GET "/games/bgg/hot?limit=5")
assert_status "$response" 200 "Hot list obtenida exitosamente"
assert_contains "$response" '"success":true' "Respuesta exitosa"
echo ""

# Test 3.2: Hot list sin limit (default)
print_test "Obtener hot list sin especificar limit"
response=$(make_request GET "/games/bgg/hot")
assert_status "$response" 200 "Hot list con default limit"
echo ""

# Test 3.3: Error - limit fuera de rango (> 50)
print_test "Error: limit mayor a 50"
response=$(make_request GET "/games/bgg/hot?limit=100")
assert_status "$response" 400 "Error de validación - limit fuera de rango"
assert_contains "$response" "entre 1 y 50" "Mensaje de error apropiado"
echo ""

# Test 3.4: Error - limit negativo
print_test "Error: limit negativo"
response=$(make_request GET "/games/bgg/hot?limit=-5")
assert_status "$response" 400 "Error de validación - limit negativo"
echo ""

# Test 3.5: Error - limit no numérico
print_test "Error: limit no numérico"
response=$(make_request GET "/games/bgg/hot?limit=abc")
assert_status "$response" 400 "Error de validación - limit no numérico"
echo ""

# ========================================================================
# TESTS DE AÑADIR DESDE BGG
# ========================================================================

print_header "TEST SUITE 4: AÑADIR DESDE BGG (POST /api/games/add-from-bgg)"

# Test 4.1: Añadir juego exitosamente
print_test "Añadir juego de BGG al grupo exitosamente"
response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": $BGG_TEST_ID,
    \"groupId\": \"$GROUP_ID\",
    \"customNotes\": \"Juego añadido en test suite\"
}")
assert_status "$response" 201 "Juego de BGG añadido exitosamente"
assert_contains "$response" '"success":true' "Respuesta exitosa"
assert_contains "$response" '"source":"bgg"' "Source es BGG"

# Guardar ID para tests posteriores
GAME_BGG_ID=$(echo "$response" | sed '$d' | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
print_info "Game BGG ID creado: $GAME_BGG_ID"
echo ""

# Test 4.2: Error - bggId faltante
print_test "Error: Sin bggId"
response=$(make_request POST "/games/add-from-bgg" "{
    \"groupId\": \"$GROUP_ID\"
}")
assert_status "$response" 400 "Error de validación - bggId faltante"
assert_contains "$response" "BGG es obligatorio" "Mensaje de error apropiado"
echo ""

# Test 4.3: Error - groupId faltante
print_test "Error: Sin groupId"
response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": $BGG_TEST_ID
}")
assert_status "$response" 400 "Error de validación - groupId faltante"
assert_contains "$response" "grupo es obligatorio" "Mensaje de error apropiado"
echo ""

# Test 4.4: Error - bggId inválido (negativo)
print_test "Error: bggId inválido (negativo)"
response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": -1,
    \"groupId\": \"$GROUP_ID\"
}")
assert_status "$response" 400 "Error de validación - bggId inválido"
echo ""

# Test 4.5: Error - groupId inválido (no MongoID)
print_test "Error: groupId con formato inválido"
response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": $BGG_TEST_ID,
    \"groupId\": \"invalid_id\"
}")
assert_status "$response" 400 "Error de validación - groupId inválido"
assert_contains "$response" "ID de grupo inválido" "Mensaje de error apropiado"
echo ""

# Test 4.6: Error - customNotes muy largas
print_test "Error: customNotes exceden 500 caracteres"
long_notes=$(printf 'a%.0s' {1..501})
response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": $BGG_TEST_ID,
    \"groupId\": \"$GROUP_ID\",
    \"customNotes\": \"$long_notes\"
}")
assert_status "$response" 400 "Error de validación - customNotes muy largas"
assert_contains "$response" "500 caracteres" "Mensaje de error apropiado"
echo ""

# Test 4.7: Error - Juego duplicado
print_test "Error: Intentar añadir el mismo juego de BGG dos veces"
response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": $BGG_TEST_ID,
    \"groupId\": \"$GROUP_ID\"
}")
assert_status "$response" 400 "Error - juego duplicado"
assert_contains "$response" "ya está en la colección" "Mensaje de error apropiado"
echo ""

# Test 4.8: Error - Grupo inexistente
print_test "Error: Grupo inexistente"
response=$(make_request POST "/games/add-from-bgg" "{
    \"bggId\": 174430,
    \"groupId\": \"507f1f77bcf86cd799439011\"
}")
assert_status "$response" 404 "Error 404 - grupo no encontrado"
echo ""

# ========================================================================
# TESTS DE CREAR JUEGO PERSONALIZADO
# ========================================================================

print_header "TEST SUITE 5: CREAR JUEGO PERSONALIZADO (POST /api/games)"

# Test 5.1: Crear juego personalizado exitosamente
print_test "Crear juego personalizado completo"
response=$(make_request POST "/games" "{
    \"name\": \"Mi Juego de Prueba\",
    \"description\": \"Descripción detallada del juego de prueba\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 6,
    \"playingTime\": 45,
    \"categories\": [\"Estrategia\", \"Cartas\"],
    \"mechanics\": [\"Draft\", \"Gestión de mano\"],
    \"difficulty\": \"medio\",
    \"yearPublished\": 2024,
    \"customNotes\": \"Prototipo del grupo\"
}")
assert_status "$response" 201 "Juego personalizado creado exitosamente"
assert_contains "$response" '"success":true' "Respuesta exitosa"
assert_contains "$response" '"source":"custom"' "Source es custom"

GAME_CUSTOM_ID=$(echo "$response" | sed '$d' | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
print_info "Game Custom ID creado: $GAME_CUSTOM_ID"
echo ""

# Test 5.2: Crear juego con campos mínimos
print_test "Crear juego con solo campos obligatorios"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Mínimo\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 1,
    \"maxPlayers\": 1
}")
assert_status "$response" 201 "Juego con campos mínimos creado"
echo ""

# Test 5.3: Error - Sin nombre
print_test "Error: Sin nombre de juego"
response=$(make_request POST "/games" "{
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4
}")
assert_status "$response" 400 "Error de validación - nombre faltante"
assert_contains "$response" "nombre.*obligatorio" "Mensaje de error apropiado"
echo ""

# Test 5.4: Error - Nombre muy corto
print_test "Error: Nombre muy corto (1 caracter)"
response=$(make_request POST "/games" "{
    \"name\": \"A\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4
}")
assert_status "$response" 400 "Error de validación - nombre muy corto"
assert_contains "$response" "entre 2 y 150 caracteres" "Mensaje de error apropiado"
echo ""

# Test 5.5: Error - Nombre muy largo
print_test "Error: Nombre muy largo (> 150 caracteres)"
long_name=$(printf 'a%.0s' {1..151})
response=$(make_request POST "/games" "{
    \"name\": \"$long_name\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4
}")
assert_status "$response" 400 "Error de validación - nombre muy largo"
echo ""

# Test 5.6: Error - Sin groupId
print_test "Error: Sin groupId"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4
}")
assert_status "$response" 400 "Error de validación - groupId faltante"
echo ""

# Test 5.7: Error - Sin minPlayers
print_test "Error: Sin minPlayers"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"maxPlayers\": 4
}")
assert_status "$response" 400 "Error de validación - minPlayers faltante"
echo ""

# Test 5.8: Error - Sin maxPlayers
print_test "Error: Sin maxPlayers"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2
}")
assert_status "$response" 400 "Error de validación - maxPlayers faltante"
echo ""

# Test 5.9: Error - maxPlayers < minPlayers
print_test "Error: maxPlayers menor que minPlayers"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 6,
    \"maxPlayers\": 2
}")
assert_status "$response" 400 "Error de validación - maxPlayers < minPlayers"
assert_contains "$response" "mayor o igual al mínimo" "Mensaje de error apropiado"
echo ""

# Test 5.10: Error - minPlayers negativo
print_test "Error: minPlayers con valor 0"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 0,
    \"maxPlayers\": 4
}")
assert_status "$response" 400 "Error de validación - minPlayers inválido"
echo ""

# Test 5.11: Error - playingTime negativo
print_test "Error: playingTime negativo"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4,
    \"playingTime\": -10
}")
assert_status "$response" 400 "Error de validación - playingTime negativo"
echo ""

# Test 5.12: Error - Descripción muy larga
print_test "Error: Descripción muy larga (> 2000 caracteres)"
long_desc=$(printf 'a%.0s' {1..2001})
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"description\": \"$long_desc\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4
}")
assert_status "$response" 400 "Error de validación - descripción muy larga"
assert_contains "$response" "2000 caracteres" "Mensaje de error apropiado"
echo ""

# Test 5.13: Error - Dificultad inválida
print_test "Error: Dificultad con valor inválido"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4,
    \"difficulty\": \"ultra-difícil\"
}")
assert_status "$response" 400 "Error de validación - dificultad inválida"
assert_contains "$response" "Dificultad inválida" "Mensaje de error apropiado"
echo ""

# Test 5.14: Error - yearPublished en el futuro lejano
print_test "Error: yearPublished muy en el futuro"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4,
    \"yearPublished\": 2100
}")
assert_status "$response" 400 "Error de validación - año inválido"
echo ""

# Test 5.15: Error - yearPublished antiguo
print_test "Error: yearPublished muy antiguo"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4,
    \"yearPublished\": 1700
}")
assert_status "$response" 400 "Error de validación - año muy antiguo"
echo ""

# Test 5.16: Error - Image URL inválida
print_test "Error: URL de imagen inválida"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4,
    \"image\": \"not-a-url\"
}")
assert_status "$response" 400 "Error de validación - URL inválida"
assert_contains "$response" "URL.*imagen.*válida" "Mensaje de error apropiado"
echo ""

# Test 5.17: Error - categories no es array
print_test "Error: categories no es un array"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4,
    \"categories\": \"Estrategia\"
}")
assert_status "$response" 400 "Error de validación - categories no array"
echo ""

# Test 5.18: Error - mechanics no es array
print_test "Error: mechanics no es un array"
response=$(make_request POST "/games" "{
    \"name\": \"Juego Test\",
    \"groupId\": \"$GROUP_ID\",
    \"minPlayers\": 2,
    \"maxPlayers\": 4,
    \"mechanics\": \"Draft\"
}")
assert_status "$response" 400 "Error de validación - mechanics no array"
echo ""

# ========================================================================
# TESTS DE LISTAR JUEGOS
# ========================================================================

print_header "TEST SUITE 6: LISTAR JUEGOS (GET /api/games)"

# Test 6.1: Listar todos los juegos del grupo
print_test "Listar todos los juegos del grupo"
response=$(make_request GET "/games?groupId=$GROUP_ID")
assert_status "$response" 200 "Listado exitoso"
assert_contains "$response" '"success":true' "Respuesta exitosa"
assert_contains "$response" '"total"' "Contiene total de juegos"
echo ""

# Test 6.2: Filtrar por source=bgg
print_test "Filtrar juegos por source=bgg"
response=$(make_request GET "/games?groupId=$GROUP_ID&source=bgg")
assert_status "$response" 200 "Filtrado por BGG exitoso"
assert_contains "$response" '"source":"bgg"' "Contiene juegos de BGG"
echo ""

# Test 6.3: Filtrar por source=custom
print_test "Filtrar juegos por source=custom"
response=$(make_request GET "/games?groupId=$GROUP_ID&source=custom")
assert_status "$response" 200 "Filtrado por custom exitoso"
assert_contains "$response" '"source":"custom"' "Contiene juegos personalizados"
echo ""

# Test 6.4: Paginación - página 1
print_test "Paginación: página 1 con limit 5"
response=$(make_request GET "/games?groupId=$GROUP_ID&page=1&limit=5")
assert_status "$response" 200 "Paginación exitosa"
assert_contains "$response" '"currentPage":1' "Página actual es 1"
echo ""

# Test 6.5: Búsqueda por texto
print_test "Búsqueda por texto en nombre"
response=$(make_request GET "/games?groupId=$GROUP_ID&search=Prueba")
assert_status "$response" 200 "Búsqueda por texto exitosa"
echo ""

# Test 6.6: Listar sin groupId
print_test "Listar juegos sin especificar grupo"
response=$(make_request GET "/games")
assert_status "$response" 200 "Listado general exitoso"
echo ""

# Test 6.7: Error - groupId inválido
print_test "Error: groupId con formato inválido"
response=$(make_request GET "/games?groupId=invalid")
assert_status "$response" 400 "Error de validación - groupId inválido"
echo ""

# Test 6.8: Error - source inválido
print_test "Error: source con valor inválido"
response=$(make_request GET "/games?groupId=$GROUP_ID&source=invalid")
assert_status "$response" 400 "Error de validación - source inválido"
assert_contains "$response" "bgg.*custom" "Mensaje indica valores válidos"
echo ""

# Test 6.9: Error - page negativa
print_test "Error: page con valor negativo"
response=$(make_request GET "/games?groupId=$GROUP_ID&page=-1")
assert_status "$response" 400 "Error de validación - page negativa"
echo ""

# Test 6.10: Error - page 0
print_test "Error: page con valor 0"
response=$(make_request GET "/games?groupId=$GROUP_ID&page=0")
assert_status "$response" 400 "Error de validación - page inválida"
echo ""

# Test 6.11: Error - limit > 100
print_test "Error: limit mayor a 100"
response=$(make_request GET "/games?groupId=$GROUP_ID&limit=150")
assert_status "$response" 400 "Error de validación - limit fuera de rango"
assert_contains "$response" "entre 1 y 100" "Mensaje de error apropiado"
echo ""

# Test 6.12: Error - limit 0
print_test "Error: limit con valor 0"
response=$(make_request GET "/games?groupId=$GROUP_ID&limit=0")
assert_status "$response" 400 "Error de validación - limit inválido"
echo ""

# ========================================================================
# TESTS DE OBTENER JUEGO INDIVIDUAL
# ========================================================================

print_header "TEST SUITE 7: OBTENER JUEGO (GET /api/games/:id)"

# Test 7.1: Obtener juego personalizado exitosamente
print_test "Obtener detalles de juego personalizado"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request GET "/games/$GAME_CUSTOM_ID")
    assert_status "$response" 200 "Juego obtenido exitosamente"
    assert_contains "$response" '"_id":"'$GAME_CUSTOM_ID'"' "ID correcto"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 7.2: Obtener juego de BGG exitosamente
print_test "Obtener detalles de juego de BGG"
if [ ! -z "$GAME_BGG_ID" ]; then
    response=$(make_request GET "/games/$GAME_BGG_ID")
    assert_status "$response" 200 "Juego de BGG obtenido exitosamente"
    assert_contains "$response" '"source":"bgg"' "Source es BGG"
else
    print_info "SKIP: No hay GAME_BGG_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 7.3: Error - ID inválido
print_test "Error: ID con formato inválido"
response=$(make_request GET "/games/invalid_id")
assert_status "$response" 400 "Error de validación - ID inválido"
assert_contains "$response" "ID inválido" "Mensaje de error apropiado"
echo ""

# Test 7.4: Error - Juego inexistente
print_test "Error: Juego con ID inexistente"
response=$(make_request GET "/games/507f1f77bcf86cd799439011")
assert_status "$response" 404 "Error 404 - juego no encontrado"
echo ""

# ========================================================================
# TESTS DE ACTUALIZAR JUEGO
# ========================================================================

print_header "TEST SUITE 8: ACTUALIZAR JUEGO (PUT /api/games/:id)"

# Test 8.1: Actualizar juego exitosamente
print_test "Actualizar juego personalizado"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"description\": \"Descripción actualizada desde test suite\",
        \"playingTime\": 60,
        \"difficulty\": \"difícil\"
    }")
    assert_status "$response" 200 "Juego actualizado exitosamente"
    assert_contains "$response" '"success":true' "Respuesta exitosa"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 8.2: Actualizar solo nombre
print_test "Actualizar solo el nombre del juego"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"name\": \"Nombre Actualizado\"
    }")
    assert_status "$response" 200 "Nombre actualizado"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 8.3: Error - ID inválido en URL
print_test "Error: ID inválido en URL"
response=$(make_request PUT "/games/invalid_id" "{
    \"name\": \"Test\"
}")
assert_status "$response" 400 "Error de validación - ID inválido"
echo ""

# Test 8.4: Error - Nombre muy corto
print_test "Error: Nombre actualizado muy corto"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"name\": \"A\"
    }")
    assert_status "$response" 400 "Error de validación - nombre muy corto"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 8.5: Error - Descripción muy larga
print_test "Error: Descripción actualizada muy larga"
long_desc=$(printf 'a%.0s' {1..2001})
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"description\": \"$long_desc\"
    }")
    assert_status "$response" 400 "Error de validación - descripción muy larga"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 8.6: Error - playingTime negativo
print_test "Error: playingTime negativo en actualización"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"playingTime\": -30
    }")
    assert_status "$response" 400 "Error de validación - playingTime negativo"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 8.7: Error - Dificultad inválida
print_test "Error: Dificultad inválida en actualización"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"difficulty\": \"imposible\"
    }")
    assert_status "$response" 400 "Error de validación - dificultad inválida"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 8.8: Error - customNotes muy largas
print_test "Error: customNotes muy largas en actualización"
long_notes=$(printf 'a%.0s' {1..501})
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID" "{
        \"customNotes\": \"$long_notes\"
    }")
    assert_status "$response" 400 "Error de validación - customNotes muy largas"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 8.9: Error - Juego inexistente
print_test "Error: Actualizar juego inexistente"
response=$(make_request PUT "/games/507f1f77bcf86cd799439011" "{
    \"name\": \"Test\"
}")
assert_status "$response" 404 "Error 404 - juego no encontrado"
echo ""

# ========================================================================
# TESTS DE SINCRONIZAR CON BGG
# ========================================================================

print_header "TEST SUITE 9: SINCRONIZAR CON BGG (PUT /api/games/:id/sync-bgg)"

# Test 9.1: Sincronizar juego de BGG exitosamente
print_test "Sincronizar juego de BGG"
if [ ! -z "$GAME_BGG_ID" ]; then
    response=$(make_request PUT "/games/$GAME_BGG_ID/sync-bgg")
    assert_status "$response" 200 "Sincronización exitosa"
    assert_contains "$response" '"success":true' "Respuesta exitosa"
else
    print_info "SKIP: No hay GAME_BGG_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 9.2: Error - ID inválido
print_test "Error: ID inválido para sincronización"
response=$(make_request PUT "/games/invalid_id/sync-bgg")
assert_status "$response" 400 "Error de validación - ID inválido"
echo ""

# Test 9.3: Error - Intentar sincronizar juego personalizado
print_test "Error: Intentar sincronizar juego custom (no BGG)"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request PUT "/games/$GAME_CUSTOM_ID/sync-bgg")
    assert_status "$response" 400 "Error - juego no es de BGG"
    assert_contains "$response" "solo.*BGG" "Mensaje indica que solo funciona con BGG"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 9.4: Error - Juego inexistente
print_test "Error: Sincronizar juego inexistente"
response=$(make_request PUT "/games/507f1f77bcf86cd799439011/sync-bgg")
assert_status "$response" 404 "Error 404 - juego no encontrado"
echo ""

# ========================================================================
# TESTS DE ESTADÍSTICAS DE GRUPO
# ========================================================================

print_header "TEST SUITE 10: ESTADÍSTICAS DE GRUPO (GET /api/games/stats/:groupId)"

# Test 10.1: Obtener estadísticas exitosamente
print_test "Obtener estadísticas del grupo"
response=$(make_request GET "/games/stats/$GROUP_ID")
assert_status "$response" 200 "Estadísticas obtenidas exitosamente"
assert_contains "$response" '"success":true' "Respuesta exitosa"
assert_contains "$response" '"totalGames"' "Contiene totalGames"
echo ""

# Test 10.2: Error - groupId inválido
print_test "Error: groupId con formato inválido"
response=$(make_request GET "/games/stats/invalid_id")
assert_status "$response" 400 "Error de validación - groupId inválido"
echo ""

# Test 10.3: Error - Grupo inexistente
print_test "Error: Estadísticas de grupo inexistente"
response=$(make_request GET "/games/stats/507f1f77bcf86cd799439011")
assert_status "$response" 404 "Error 404 - grupo no encontrado"
echo ""

# ========================================================================
# TESTS DE ELIMINAR JUEGO
# ========================================================================

print_header "TEST SUITE 11: ELIMINAR JUEGO (DELETE /api/games/:id)"

# Test 11.1: Error - ID inválido
print_test "Error: ID inválido para eliminación"
response=$(make_request DELETE "/games/invalid_id")
assert_status "$response" 400 "Error de validación - ID inválido"
echo ""

# Test 11.2: Error - Juego inexistente
print_test "Error: Eliminar juego inexistente"
response=$(make_request DELETE "/games/507f1f77bcf86cd799439011")
assert_status "$response" 404 "Error 404 - juego no encontrado"
echo ""

# Test 11.3: Eliminar juego personalizado exitosamente
print_test "Eliminar juego personalizado"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request DELETE "/games/$GAME_CUSTOM_ID")
    assert_status "$response" 200 "Juego eliminado exitosamente"
    assert_contains "$response" '"success":true' "Respuesta exitosa"
    print_info "Juego $GAME_CUSTOM_ID eliminado"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# Test 11.4: Verificar que el juego eliminado no existe
print_test "Verificar que juego eliminado no se puede obtener"
if [ ! -z "$GAME_CUSTOM_ID" ]; then
    response=$(make_request GET "/games/$GAME_CUSTOM_ID")
    assert_status "$response" 404 "Juego ya no existe"
else
    print_info "SKIP: No hay GAME_CUSTOM_ID disponible"
    ((TOTAL_TESTS++))
fi
echo ""

# ========================================================================
# TESTS DE AUTENTICACIÓN Y AUTORIZACIÓN
# ========================================================================

print_header "TEST SUITE 12: AUTENTICACIÓN Y AUTORIZACIÓN"

# Test 12.1: Error - Sin token (todas las rutas requieren auth)
print_test "Error: Búsqueda sin autenticación"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/games/search-bgg?name=Test" \
    -H "Content-Type: application/json")
assert_status "$response" 401 "Error 401 - sin autenticación"
echo ""

# Test 12.2: Error - Token inválido
print_test "Error: Token inválido"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/games?groupId=$GROUP_ID" \
    -H "Authorization: Bearer invalid_token_12345" \
    -H "Content-Type: application/json")
assert_status "$response" 401 "Error 401 - token inválido"
echo ""

# Test 12.3: Error - Acceder a grupo de otro usuario
print_test "Error: Acceder a juegos de grupo al que no perteneces"
# Crear segundo usuario
timestamp2=$(date +%s)
test_email2="test_other_${timestamp2}@example.com"
register2=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Other User\",
        \"email\": \"$test_email2\",
        \"password\": \"12345678\"
    }")
TOKEN2=$(echo "$register2" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Intentar acceder con segundo usuario
if [ ! -z "$TOKEN2" ]; then
    response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/games?groupId=$GROUP_ID" \
        -H "Authorization: Bearer $TOKEN2" \
        -H "Content-Type: application/json")
    assert_status "$response" 403 "Error 403 - sin permiso"
else
    print_info "SKIP: No se pudo crear segundo usuario"
    ((TOTAL_TESTS++))
fi
echo ""

# ========================================================================
# RESUMEN FINAL
# ========================================================================

print_header "RESUMEN DE EJECUCIÓN"

echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  RESULTADOS DE TESTS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}\n"

echo -e "  Total de tests:         ${BLUE}$TOTAL_TESTS${NC}"
echo -e "  Tests exitosos:         ${GREEN}$PASSED_TESTS${NC}"
echo -e "  Tests fallidos:         ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                   ║${NC}"
    echo -e "${GREEN}║       ✅ TODOS LOS TESTS PASARON! 🎉             ║${NC}"
    echo -e "${GREEN}║                                                   ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}\n"
    exit_code=0
else
    echo -e "\n${RED}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                   ║${NC}"
    echo -e "${RED}║       ❌ ALGUNOS TESTS FALLARON                   ║${NC}"
    echo -e "${RED}║                                                   ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════╝${NC}\n"
    exit_code=1
fi

# Porcentaje de éxito
if [ $TOTAL_TESTS -gt 0 ]; then
    success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "  Tasa de éxito:          ${YELLOW}${success_rate}%${NC}\n"
fi

echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  RECURSOS CREADOS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}\n"

echo -e "  Usuario de prueba:      ${YELLOW}$test_email${NC}"
echo -e "  Grupo ID:               ${YELLOW}$GROUP_ID${NC}"
echo -e "  Juego BGG ID:           ${YELLOW}$GAME_BGG_ID${NC}"
echo -e "  Juego Custom ID:        ${YELLOW}$GAME_CUSTOM_ID${NC}"

echo -e "\n${CYAN}═══════════════════════════════════════════════════${NC}\n"

exit $exit_code
