#!/bin/bash

# Verificar que Docker está corriendo
if ! curl -s http://localhost/api/auth/me > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "Ejecuta: docker compose up -d"
    exit 1
fi

# Test para casos extremos del sistema de ranking
# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost/api"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  TEST DE CASOS EXTREMOS DE RANKING  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Función para imprimir
print_header() {
    echo -e "\n${YELLOW}>>> $1${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Función para extraer campo JSON
extract_json_field() {
    echo "$1" | grep -o "\"$2\":\"[^\"]*\"" | cut -d'"' -f4
}

# Función para extraer _id del objeto data
extract_data_id() {
    echo "$1" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('_id', ''))" 2>/dev/null || echo ""
}

TIMESTAMP=$(date +%s)

# 1. REGISTRAR USUARIOS
print_header "1. REGISTRANDO USUARIOS"

RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"User Edge 1\",
    \"email\": \"edge1${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

TOKEN=$(extract_json_field "$RESPONSE" "token")
USER1_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_success "Usuario 1: $USER1_ID"

RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"User Edge 2\",
    \"email\": \"edge2${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

USER2_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_success "Usuario 2: $USER2_ID"

RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"User Edge 3\",
    \"email\": \"edge3${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")

USER3_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_success "Usuario 3: $USER3_ID"

# 2. CREAR GRUPO
print_header "2. CREANDO GRUPO"

RESPONSE=$(curl -s -X POST "$BASE_URL/groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Grupo Edge Cases",
    "description": "Test",
    "isPublic": true
  }')

GROUP_ID=$(extract_data_id "$RESPONSE")
INVITE_CODE=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('inviteCode', ''))" 2>/dev/null || echo "")

print_success "Grupo: $GROUP_ID"
print_info "Código: $INVITE_CODE"

# Usuarios se unen
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"edge2${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")
USER2_TOKEN=$(extract_json_field "$LOGIN_RESPONSE" "token")

curl -s -X POST "$BASE_URL/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -d "{\"inviteCode\": \"$INVITE_CODE\"}" > /dev/null

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"edge3${TIMESTAMP}@test.com\",
    \"password\": \"password123\"
  }")
USER3_TOKEN=$(extract_json_field "$LOGIN_RESPONSE" "token")

curl -s -X POST "$BASE_URL/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER3_TOKEN" \
  -d "{\"inviteCode\": \"$INVITE_CODE\"}" > /dev/null

print_success "Miembros unidos"

# 3. CREAR JUEGO
print_header "3. CREANDO JUEGO"

RESPONSE=$(curl -s -X POST "$BASE_URL/games" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Juego Edge Test\",
    \"description\": \"Test\",
    \"minPlayers\": 2,
    \"maxPlayers\": 6,
    \"playingTime\": 60,
    \"groupId\": \"$GROUP_ID\"
  }")

GAME_ID=$(extract_data_id "$RESPONSE")
print_success "Juego: $GAME_ID"

# 4. TEST: PARTIDA SIN POSICIONES DEFINIDAS
print_header "4. TEST: Partida SIN posiciones definidas (solo puntos de participación)"

TOMORROW=$(date -d "+1 day" -I)

RESPONSE=$(curl -s -X POST "$BASE_URL/matches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"gameId\": \"$GAME_ID\",
    \"groupId\": \"$GROUP_ID\",
    \"scheduledDate\": \"${TOMORROW}T19:00:00Z\",
    \"playerIds\": [\"$USER1_ID\", \"$USER2_ID\", \"$USER3_ID\"]
  }")

MATCH1_ID=$(extract_data_id "$RESPONSE")
print_success "Partida creada: $MATCH1_ID"

# Finalizar sin posiciones
RESPONSE=$(curl -s -X POST "$BASE_URL/matches/$MATCH1_ID/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"results\": [
      {\"userId\": \"$USER1_ID\", \"score\": 100},
      {\"userId\": \"$USER2_ID\", \"score\": 80},
      {\"userId\": \"$USER3_ID\", \"score\": 60}
    ]
  }")

if echo "$RESPONSE" | grep -q "\"success\":true"; then
    print_success "Partida finalizada sin posiciones"
    
    # Verificar que todos tienen 1 punto
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"edge1${TIMESTAMP}@test.com\",
        \"password\": \"password123\"
      }")
    
    POINTS=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
    
    if [ "$POINTS" = "1" ]; then
        print_success "User1 tiene 1 punto (participación) ✓"
    else
        print_error "User1 tiene $POINTS puntos (esperado: 1)"
    fi
else
    print_error "Error al finalizar partida"
    echo "$RESPONSE"
fi

# 5. TEST: PARTIDA CON POSICIONES PARCIALES
print_header "5. TEST: Partida con ALGUNAS posiciones definidas"

TOMORROW2=$(date -d "+2 days" -I)

RESPONSE=$(curl -s -X POST "$BASE_URL/matches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"gameId\": \"$GAME_ID\",
    \"groupId\": \"$GROUP_ID\",
    \"scheduledDate\": \"${TOMORROW2}T19:00:00Z\",
    \"playerIds\": [\"$USER1_ID\", \"$USER2_ID\", \"$USER3_ID\"]
  }")

MATCH2_ID=$(extract_data_id "$RESPONSE")

# User1 y User2 con posiciones, User3 sin posición
RESPONSE=$(curl -s -X POST "$BASE_URL/matches/$MATCH2_ID/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"winnerId\": \"$USER1_ID\",
    \"results\": [
      {\"userId\": \"$USER1_ID\", \"score\": 100, \"position\": 1},
      {\"userId\": \"$USER2_ID\", \"score\": 80, \"position\": 2},
      {\"userId\": \"$USER3_ID\", \"score\": 60}
    ]
  }")

if echo "$RESPONSE" | grep -q "\"success\":true"; then
    print_success "Partida finalizada con posiciones parciales"
    
    # Verificar puntos
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"edge1${TIMESTAMP}@test.com\",
        \"password\": \"password123\"
      }")
    POINTS1=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
    
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"edge3${TIMESTAMP}@test.com\",
        \"password\": \"password123\"
      }")
    POINTS3=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
    
    print_info "User1 debería tener: 1 (partida 1) + 10 (partida 2) = 11 puntos"
    print_info "User3 debería tener: 1 (partida 1) + 1 (partida 2) = 2 puntos"
    
    if [ "$POINTS1" = "11" ]; then
        print_success "User1: $POINTS1 puntos ✓"
    else
        print_error "User1: $POINTS1 puntos (esperado: 11)"
    fi
    
    if [ "$POINTS3" = "2" ]; then
        print_success "User3: $POINTS3 puntos ✓"
    else
        print_error "User3: $POINTS3 puntos (esperado: 2)"
    fi
else
    print_error "Error al finalizar partida con posiciones parciales"
    echo "$RESPONSE"
fi

# 6. TEST: PARTIDA CON POSICIÓN > 4 (debe recibir punto de participación)
print_header "6. TEST: Partida con posición mayor a 4"

TOMORROW3=$(date -d "+3 days" -I)

RESPONSE=$(curl -s -X POST "$BASE_URL/matches" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"gameId\": \"$GAME_ID\",
    \"groupId\": \"$GROUP_ID\",
    \"scheduledDate\": \"${TOMORROW3}T19:00:00Z\",
    \"playerIds\": [\"$USER1_ID\", \"$USER2_ID\"]
  }")

MATCH3_ID=$(extract_data_id "$RESPONSE")

RESPONSE=$(curl -s -X POST "$BASE_URL/matches/$MATCH3_ID/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"winnerId\": \"$USER1_ID\",
    \"results\": [
      {\"userId\": \"$USER1_ID\", \"score\": 100, \"position\": 1},
      {\"userId\": \"$USER2_ID\", \"score\": 50, \"position\": 5}
    ]
  }")

if echo "$RESPONSE" | grep -q "\"success\":true"; then
    print_success "Partida con posición 5 finalizada"
    
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"edge2${TIMESTAMP}@test.com\",
        \"password\": \"password123\"
      }")
    POINTS2=$(echo "$LOGIN_RESPONSE" | grep -o '"totalPoints":[0-9]*' | cut -d':' -f2)
    
    print_info "User2 debería tener: 1 (partida 1) + 5 (partida 2) + 1 (partida 3, pos 5) = 7 puntos"
    
    if [ "$POINTS2" = "7" ]; then
        print_success "User2: $POINTS2 puntos (posición 5 = 1 punto) ✓"
    else
        print_error "User2: $POINTS2 puntos (esperado: 7)"
    fi
else
    print_error "Error al finalizar partida"
    echo "$RESPONSE"
fi

# RESUMEN
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}       RESUMEN DE CASOS EXTREMOS       ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Casos probados:"
echo "  ✓ Partida sin posiciones definidas"
echo "  ✓ Partida con algunas posiciones definidas"
echo "  ✓ Partida con posiciones > 4"
echo ""
