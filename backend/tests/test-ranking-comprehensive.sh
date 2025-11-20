#!/bin/bash

# Verificar que Docker está corriendo
if ! curl -s http://localhost/api/auth/me > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "Ejecuta: docker compose up -d"
    exit 1
fi

# Script completo para probar la lógica de ranking
# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost/api"

# Variables globales
TOKEN=""
USER1_ID=""
USER2_ID=""
USER3_ID=""
USER4_ID=""
GROUP_ID=""
GAME_ID=""
MATCH_ID=""

# Generar timestamp único para evitar conflictos
TIMESTAMP=$(date +%s)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  TEST COMPLETO DE LÓGICA DE RANKING  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Función para imprimir encabezados
print_header() {
    echo -e "\n${YELLOW}>>> $1${NC}\n"
}

# Función para imprimir éxito
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Función para imprimir error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Función para imprimir info
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Función para extraer campo JSON
extract_json_field() {
    echo "$1" | grep -o "\"$2\":\"[^\"]*\"" | cut -d'"' -f4
}

# Función para extraer campo JSON numérico
extract_json_number() {
    echo "$1" | grep -o "\"$2\":[0-9]*" | cut -d':' -f2
}

# Función para extraer _id del objeto data
extract_data_id() {
    echo "$1" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('_id', ''))" 2>/dev/null || echo ""
}

# 1. REGISTRAR USUARIOS
print_header "1. REGISTRANDO USUARIOS DE PRUEBA"

# Usuario 1 - Será el ganador principal
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Usuario Ganador\",
    \"email\": \"ganador${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

TOKEN=$(extract_json_field "$RESPONSE" "token")
USER1_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$USER1_ID" ]; then
    print_success "Usuario 1 registrado: $USER1_ID"
else
    print_error "Error al registrar Usuario 1"
    exit 1
fi

# Usuario 2
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Usuario Segundo\",
    \"email\": \"segundo${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

USER2_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_success "Usuario 2 registrado: $USER2_ID"

# Usuario 3
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Usuario Tercero\",
    \"email\": \"tercero${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

USER3_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_success "Usuario 3 registrado: $USER3_ID"

# Usuario 4
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Usuario Cuarto\",
    \"email\": \"cuarto${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

USER4_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_success "Usuario 4 registrado: $USER4_ID"

# 2. CREAR GRUPO
print_header "2. CREANDO GRUPO DE PRUEBA"

RESPONSE=$(curl -s -X POST "$BASE_URL/groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Grupo Ranking Test",
    "description": "Grupo para probar ranking",
    "isPublic": true
  }')

GROUP_ID=$(extract_data_id "$RESPONSE")

if [ -n "$GROUP_ID" ]; then
    print_success "Grupo creado: $GROUP_ID"
else
    print_error "Error al crear grupo"
    echo "$RESPONSE"
    exit 1
fi

# Extraer el código de invitación
INVITE_CODE=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('inviteCode', ''))" 2>/dev/null || echo "")

if [ -n "$INVITE_CODE" ]; then
    print_info "Código de invitación: $INVITE_CODE"
else
    print_error "No se pudo obtener el código de invitación"
    exit 1
fi

# 3. AÑADIR MIEMBROS AL GRUPO (usando código de invitación)
print_header "3. AÑADIENDO MIEMBROS AL GRUPO"

# Guardar tokens de cada usuario
declare -A USER_TOKENS

# Usuario 2 se une
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"segundo${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")
USER2_TOKEN=$(extract_json_field "$LOGIN_RESPONSE" "token")

RESPONSE=$(curl -s -X POST "$BASE_URL/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -d "{
    \"inviteCode\": \"$INVITE_CODE\"
  }")
print_success "Usuario 2 unido al grupo"

# Usuario 3 se une
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"tercero${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")
USER3_TOKEN=$(extract_json_field "$LOGIN_RESPONSE" "token")

RESPONSE=$(curl -s -X POST "$BASE_URL/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER3_TOKEN" \
  -d "{
    \"inviteCode\": \"$INVITE_CODE\"
  }")
print_success "Usuario 3 unido al grupo"

# Usuario 4 se une
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"cuarto${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")
USER4_TOKEN=$(extract_json_field "$LOGIN_RESPONSE" "token")

RESPONSE=$(curl -s -X POST "$BASE_URL/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER4_TOKEN" \
  -d "{
    \"inviteCode\": \"$INVITE_CODE\"
  }")
print_success "Usuario 4 unido al grupo"

# 4. CREAR JUEGO PERSONALIZADO PARA EL GRUPO
print_header "4. CREANDO JUEGO PERSONALIZADO PARA EL GRUPO"

RESPONSE=$(curl -s -X POST "$BASE_URL/games" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Juego de Prueba Ranking\",
    \"description\": \"Juego para probar el sistema de ranking\",
    \"minPlayers\": 2,
    \"maxPlayers\": 6,
    \"playingTime\": 60,
    \"groupId\": \"$GROUP_ID\"
  }")

GAME_ID=$(extract_data_id "$RESPONSE")

if [ -n "$GAME_ID" ]; then
    print_success "Juego añadido: $GAME_ID"
else
    print_error "Error al añadir juego"
    echo "$RESPONSE"
    exit 1
fi

# 5. CREAR PARTIDA
print_header "5. CREANDO PARTIDA CON 4 JUGADORES"

TOMORROW=$(date -d "+1 day" -I)

RESPONSE=$(curl -s -X POST "$BASE_URL/matches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"gameId\": \"$GAME_ID\",
    \"groupId\": \"$GROUP_ID\",
    \"scheduledDate\": \"${TOMORROW}T19:00:00Z\",
    \"playerIds\": [\"$USER1_ID\", \"$USER2_ID\", \"$USER3_ID\", \"$USER4_ID\"],
    \"location\": \"Casa de pruebas\"
  }")

MATCH_ID=$(extract_data_id "$RESPONSE")

if [ -n "$MATCH_ID" ]; then
    print_success "Partida creada: $MATCH_ID"
else
    print_error "Error al crear partida"
    echo "$RESPONSE"
    exit 1
fi

# 6. VERIFICAR PUNTOS INICIALES
print_header "6. VERIFICANDO PUNTOS INICIALES (deben ser 0)"

for i in 1 2 3 4; do
    case $i in
        1) USER_ID=$USER1_ID; USER_NAME="Usuario 1" ;;
        2) USER_ID=$USER2_ID; USER_NAME="Usuario 2" ;;
        3) USER_ID=$USER3_ID; USER_NAME="Usuario 3" ;;
        4) USER_ID=$USER4_ID; USER_NAME="Usuario 4" ;;
    esac
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/auth/profile" \
      -H "Authorization: Bearer $TOKEN")
    
    # Login como cada usuario para ver sus stats
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$(echo $USER_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '')@test.com\",
        \"password\": \"password123\"
      }")
    
    POINTS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
    print_info "$USER_NAME - Puntos iniciales: $POINTS"
done

# 7. FINALIZAR PARTIDA CON RESULTADOS
print_header "7. FINALIZANDO PARTIDA Y REGISTRANDO RESULTADOS"

print_info "Asignando posiciones:"
print_info "  1° lugar (10 pts): Usuario 1 - $USER1_ID"
print_info "  2° lugar (5 pts):  Usuario 2 - $USER2_ID"
print_info "  3° lugar (2 pts):  Usuario 3 - $USER3_ID"
print_info "  4° lugar (1 pt):   Usuario 4 - $USER4_ID"

RESPONSE=$(curl -s -X POST "$BASE_URL/matches/$MATCH_ID/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"winnerId\": \"$USER1_ID\",
    \"results\": [
      {\"userId\": \"$USER1_ID\", \"score\": 100, \"position\": 1},
      {\"userId\": \"$USER2_ID\", \"score\": 80, \"position\": 2},
      {\"userId\": \"$USER3_ID\", \"score\": 60, \"position\": 3},
      {\"userId\": \"$USER4_ID\", \"score\": 40, \"position\": 4}
    ],
    \"duration\": {\"value\": 120, \"unit\": \"minutos\"}
  }")

if echo "$RESPONSE" | grep -q "\"success\":true"; then
    print_success "Partida finalizada correctamente"
    
    # Mostrar reporte de ranking
    echo ""
    print_info "Reporte de actualización de ranking:"
    echo "$RESPONSE" | grep -o '"ranking":{[^}]*}' | sed 's/,/\n/g'
else
    print_error "Error al finalizar partida"
    echo "$RESPONSE"
    exit 1
fi

# 8. VERIFICAR PUNTOS ACTUALIZADOS
print_header "8. VERIFICANDO ACTUALIZACIÓN DE PUNTOS"

EXPECTED_POINTS=(10 5 2 1)
EMAILS=("ganador${TIMESTAMP}@test.com" "segundo${TIMESTAMP}@test.com" "tercero${TIMESTAMP}@test.com" "cuarto${TIMESTAMP}@test.com")

ALL_CORRECT=true

for i in 0 1 2 3; do
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"${EMAILS[$i]}\",
        \"password\": \"password123\"
      }")
    
    ACTUAL_POINTS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
    TOTAL_MATCHES=$(echo "$LOGIN_RESPONSE" | grep -o '"totalMatches":[0-9]*' | cut -d':' -f2)
    TOTAL_WINS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalWins":[0-9]*' | cut -d':' -f2)
    
    EXPECTED=${EXPECTED_POINTS[$i]}
    
    if [ "$ACTUAL_POINTS" = "$EXPECTED" ]; then
        print_success "Usuario $((i+1)): $ACTUAL_POINTS puntos (esperado: $EXPECTED) ✓"
        print_info "  Partidas: $TOTAL_MATCHES, Victorias: $TOTAL_WINS"
    else
        print_error "Usuario $((i+1)): $ACTUAL_POINTS puntos (esperado: $EXPECTED) ✗"
        ALL_CORRECT=false
    fi
done

# 9. VERIFICAR RANKING DEL GRUPO
print_header "9. VERIFICANDO RANKING DEL GRUPO"

RESPONSE=$(curl -s -X GET "$BASE_URL/matches/ranking/group/$GROUP_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "\"success\":true"; then
    print_success "Ranking del grupo obtenido correctamente"
else
    print_error "Error al obtener ranking del grupo"
fi

# 10. VERIFICAR RANKING GLOBAL
print_header "10. VERIFICANDO RANKING GLOBAL"

RESPONSE=$(curl -s -X GET "$BASE_URL/matches/ranking/global" \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "\"success\":true"; then
    print_success "Ranking global obtenido correctamente"
else
    print_error "Error al obtener ranking global"
fi

# 11. PRUEBA DE VALIDACIÓN DE POSICIONES DUPLICADAS
print_header "11. PROBANDO VALIDACIÓN DE POSICIONES DUPLICADAS"

# Crear otra partida
TOMORROW2=$(date -d "+2 days" -I)

RESPONSE=$(curl -s -X POST "$BASE_URL/matches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"gameId\": \"$GAME_ID\",
    \"groupId\": \"$GROUP_ID\",
    \"scheduledDate\": \"${TOMORROW2}T19:00:00Z\",
    \"playerIds\": [\"$USER1_ID\", \"$USER2_ID\"],
    \"location\": \"Casa de pruebas\"
  }")

MATCH2_ID=$(extract_data_id "$RESPONSE")

# Intentar finalizar con posiciones duplicadas (debe fallar)
RESPONSE=$(curl -s -X POST "$BASE_URL/matches/$MATCH2_ID/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"winnerId\": \"$USER1_ID\",
    \"results\": [
      {\"userId\": \"$USER1_ID\", \"score\": 100, \"position\": 1},
      {\"userId\": \"$USER2_ID\", \"score\": 80, \"position\": 1}
    ]
  }")

if echo "$RESPONSE" | grep -q "duplicadas"; then
    print_success "Validación de posiciones duplicadas funciona correctamente"
else
    print_error "La validación de posiciones duplicadas no está funcionando"
    echo "$RESPONSE"
fi

# 12. CREAR SEGUNDA PARTIDA VÁLIDA
print_header "12. CREANDO Y FINALIZANDO SEGUNDA PARTIDA"

RESPONSE=$(curl -s -X POST "$BASE_URL/matches/$MATCH2_ID/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"winnerId\": \"$USER2_ID\",
    \"results\": [
      {\"userId\": \"$USER2_ID\", \"score\": 100, \"position\": 1},
      {\"userId\": \"$USER1_ID\", \"score\": 80, \"position\": 2}
    ]
  }")

if echo "$RESPONSE" | grep -q "\"success\":true"; then
    print_success "Segunda partida finalizada (User2 gana)"
fi

# 13. VERIFICAR PUNTOS ACUMULADOS
print_header "13. VERIFICANDO PUNTOS ACUMULADOS DESPUÉS DE 2 PARTIDAS"

print_info "Usuario 1 debería tener: 10 (1era partida) + 5 (2da partida) = 15 puntos"
print_info "Usuario 2 debería tener: 5 (1era partida) + 10 (2da partida) = 15 puntos"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"ganador${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

USER1_POINTS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
USER1_WINS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalWins":[0-9]*' | cut -d':' -f2)

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"segundo${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

USER2_POINTS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
USER2_WINS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalWins":[0-9]*' | cut -d':' -f2)

if [ "$USER1_POINTS" = "15" ] && [ "$USER1_WINS" = "1" ]; then
    print_success "Usuario 1: $USER1_POINTS puntos, $USER1_WINS victoria ✓"
else
    print_error "Usuario 1: $USER1_POINTS puntos, $USER1_WINS victorias (esperado: 15 pts, 1 victoria)"
    ALL_CORRECT=false
fi

if [ "$USER2_POINTS" = "15" ] && [ "$USER2_WINS" = "1" ]; then
    print_success "Usuario 2: $USER2_POINTS puntos, $USER2_WINS victoria ✓"
else
    print_error "Usuario 2: $USER2_POINTS puntos, $USER2_WINS victorias (esperado: 15 pts, 1 victoria)"
    ALL_CORRECT=false
fi

# 14. RANKING FINAL
print_header "14. RANKING FINAL DEL GRUPO"

RESPONSE=$(curl -s -X GET "$BASE_URL/matches/ranking/group/$GROUP_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

# RESUMEN FINAL
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}       RESUMEN DE PRUEBAS              ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$ALL_CORRECT" = true ]; then
    print_success "TODAS LAS PRUEBAS PASARON CORRECTAMENTE"
    echo ""
    print_info "La lógica de ranking funciona correctamente:"
    echo "  ✓ Cálculo de puntos por posición"
    echo "  ✓ Actualización automática de estadísticas"
    echo "  ✓ Conteo de victorias"
    echo "  ✓ Validación de posiciones duplicadas"
    echo "  ✓ Puntos acumulados correctamente"
    echo "  ✓ Rankings funcionando (grupo y global)"
else
    print_error "ALGUNAS PRUEBAS FALLARON"
    echo ""
    print_info "Revisa los mensajes de error anteriores"
fi

echo ""
print_info "IDs creados durante la prueba:"
echo "  Grupo: $GROUP_ID"
echo "  Juego: $GAME_ID"
echo "  Usuario 1: $USER1_ID"
echo "  Usuario 2: $USER2_ID"
echo "  Usuario 3: $USER3_ID"
echo "  Usuario 4: $USER4_ID"
echo ""
