#!/bin/bash

################################################################################
# TEST: Juegos Personales y de Grupo sin Duplicados
################################################################################

# Verificar que Docker está corriendo
if ! curl -s http://localhost/api/auth/me > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "Ejecuta: docker compose up -d"
    exit 1
fi

API_URL="http://localhost/api"
TESTS=0
PASSED=0

echo ""
echo "================================================================================"
echo "TEST: Juegos Personales y de Grupo sin Duplicados"
echo "================================================================================"
echo ""

test_result() {
  ((TESTS++))
  if [ "$1" = "0" ]; then
    echo "✅ PASS: $2"
    ((PASSED++))
  else
    echo "❌ FAIL: $2"
  fi
}

# ============================================================================
# Registrar usuarios
# ============================================================================
echo ">>> Registrando usuarios..."

JUAN=$(curl -s -X POST "$API_URL/auth/register" -H "Content-Type: application/json" \
  -d "{\"name\": \"Juan\", \"email\": \"juan$(date +%s%N)@test.com\", \"password\": \"password123\"}")
JUAN_TOKEN=$(echo "$JUAN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

PEDRO=$(curl -s -X POST "$API_URL/auth/register" -H "Content-Type: application/json" \
  -d "{\"name\": \"Pedro\", \"email\": \"pedro$(date +%s%N)@test.com\", \"password\": \"password123\"}")
PEDRO_TOKEN=$(echo "$PEDRO" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

MARIA=$(curl -s -X POST "$API_URL/auth/register" -H "Content-Type: application/json" \
  -d "{\"name\": \"María\", \"email\": \"maria$(date +%s%N)@test.com\", \"password\": \"password123\"}")
MARIA_TOKEN=$(echo "$MARIA" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

[ -n "$JUAN_TOKEN" ] && [ -n "$PEDRO_TOKEN" ] && [ -n "$MARIA_TOKEN" ]
test_result $? "Registrar 3 usuarios"
echo ""

# ============================================================================
# BLOQUE 1: Crear juegos personales SIN grupo
# ============================================================================
echo ">>> BLOQUE 1: Crear juegos personales (sin grupo)"
echo ""

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JUAN_TOKEN" -d '{
  "name": "Catan", "description": "Clásico", "minPlayers": 2, 
  "maxPlayers": 4, "playingTime": 60}')
echo "$RESP" | grep -q '"success":true'
test_result $? "Juan crea juego personal SIN groupId"

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PEDRO_TOKEN" -d '{
  "name": "Catan", "minPlayers": 2, "maxPlayers": 4, "playingTime": 60}')
echo "$RESP" | grep -q '"success":true'
test_result $? "Pedro crea mismo juego personal (copias independientes)"

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" -d '{
  "name": "Catan", "minPlayers": 2, "maxPlayers": 4, "playingTime": 60}')
echo "$RESP" | grep -q '"success":true'
test_result $? "María crea primer juego personal"

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" -d '{
  "name": "Ticket to Ride", "minPlayers": 2, "maxPlayers": 5, "playingTime": 90}')
echo "$RESP" | grep -q '"success":true'
test_result $? "María crea segundo juego personal"

JUAN_COUNT=$(curl -s -X GET "$API_URL/games" -H "Authorization: Bearer $JUAN_TOKEN" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$JUAN_COUNT" = "1" ]
test_result $? "Juan tiene exactamente 1 juego personal"

PEDRO_COUNT=$(curl -s -X GET "$API_URL/games" -H "Authorization: Bearer $PEDRO_TOKEN" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$PEDRO_COUNT" = "1" ]
test_result $? "Pedro tiene exactamente 1 juego personal"

MARIA_COUNT=$(curl -s -X GET "$API_URL/games" -H "Authorization: Bearer $MARIA_TOKEN" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$MARIA_COUNT" = "2" ]
test_result $? "María tiene exactamente 2 juegos personales"

echo ""

# ============================================================================
# BLOQUE 2: Crear grupo y agregar miembros
# ============================================================================
echo ">>> BLOQUE 2: Crear grupo y agregar juegos"
echo ""

GROUP=$(curl -s -X POST "$API_URL/groups" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JUAN_TOKEN" -d '{"name": "Grupo", "description": "Test"}')
# Extraer GROUP_ID usando Python para JSON parsing robusto
GROUP_ID=$(echo "$GROUP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('_id', ''))" 2>/dev/null)
INVITE_CODE=$(echo "$GROUP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('inviteCode', ''))" 2>/dev/null)

echo "$GROUP" | grep -q '"success":true'
test_result $? "Juan crea un grupo"

RESP=$(curl -s -X POST "$API_URL/groups/join" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PEDRO_TOKEN" -d "{\"inviteCode\": \"$INVITE_CODE\"}")
echo "$RESP" | grep -q '"success":true'
test_result $? "Pedro se une al grupo"

RESP=$(curl -s -X POST "$API_URL/groups/join" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" -d "{\"inviteCode\": \"$INVITE_CODE\"}")
echo "$RESP" | grep -q '"success":true'
test_result $? "María se une al grupo"

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JUAN_TOKEN" -d "{
  \"name\": \"Catan\", \"minPlayers\": 2, \"maxPlayers\": 4, 
  \"playingTime\": 60, \"groupId\": \"$GROUP_ID\"}")
echo "DEBUG GROUP_ID: $GROUP_ID" >&2
echo "DEBUG Response: $RESP" >&2
echo "$RESP" | grep -q '"success":true'
test_result $? "Juan agrega Catan AL grupo"

echo ""

# ============================================================================
# BLOQUE 3: Prevenir duplicados en grupo
# ============================================================================
echo ">>> BLOQUE 3: Prevenir duplicados en el grupo"
echo ""

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PEDRO_TOKEN" -d "{
  \"name\": \"Catan\", \"minPlayers\": 2, \"maxPlayers\": 4, 
  \"playingTime\": 60, \"groupId\": \"$GROUP_ID\"}")
echo "$RESP" | grep -q '"success":false'
test_result $? "Pedro NO puede agregar Catan duplicado al grupo"

echo "$RESP" | grep -q "ya está en la colección del grupo"
test_result $? "Mensaje de error correcto para duplicado"

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" -d "{
  \"name\": \"Ticket to Ride\", \"minPlayers\": 2, \"maxPlayers\": 5, 
  \"playingTime\": 90, \"groupId\": \"$GROUP_ID\"}")
echo "$RESP" | grep -q '"success":true'
test_result $? "María agrega Ticket to Ride diferente al grupo"

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JUAN_TOKEN" -d "{
  \"name\": \"Ticket to Ride\", \"minPlayers\": 2, \"maxPlayers\": 5, 
  \"playingTime\": 90, \"groupId\": \"$GROUP_ID\"}")
echo "$RESP" | grep -q '"success":false'
test_result $? "Juan NO puede agregar Ticket to Ride duplicado"

echo ""

# ============================================================================
# BLOQUE 4: Ver juegos del grupo sin duplicados
# ============================================================================
echo ">>> BLOQUE 4: Ver juegos del grupo (sin duplicados)"
echo ""

JUAN_GRP=$(curl -s -X GET "$API_URL/games?groupId=$GROUP_ID" -H "Authorization: Bearer $JUAN_TOKEN")
JUAN_GRP_COUNT=$(echo "$JUAN_GRP" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$JUAN_GRP_COUNT" = "2" ]
test_result $? "Juan ve exactamente 2 juegos en el grupo (sin duplicados)"

echo "$JUAN_GRP" | grep -q '"name":"Catan"'
test_result $? "El grupo contiene 'Catan'"

echo "$JUAN_GRP" | grep -q '"name":"Ticket to Ride"'
test_result $? "El grupo contiene 'Ticket to Ride'"

PEDRO_GRP=$(curl -s -X GET "$API_URL/games?groupId=$GROUP_ID" -H "Authorization: Bearer $PEDRO_TOKEN")
PEDRO_GRP_COUNT=$(echo "$PEDRO_GRP" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$PEDRO_GRP_COUNT" = "2" ]
test_result $? "Pedro ve exactamente 2 juegos (mismo que Juan)"

MARIA_GRP=$(curl -s -X GET "$API_URL/games?groupId=$GROUP_ID" -H "Authorization: Bearer $MARIA_TOKEN")
MARIA_GRP_COUNT=$(echo "$MARIA_GRP" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$MARIA_GRP_COUNT" = "2" ]
test_result $? "María ve exactamente 2 juegos en el grupo"

echo ""

# ============================================================================
# BLOQUE 5: Verificar independencia de juegos personales
# ============================================================================
echo ">>> BLOQUE 5: Independencia de juegos personales"
echo ""

JUAN_PERS=$(curl -s -X GET "$API_URL/games" -H "Authorization: Bearer $JUAN_TOKEN")
JUAN_PERS_COUNT=$(echo "$JUAN_PERS" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$JUAN_PERS_COUNT" = "1" ]
test_result $? "Juan sigue teniendo 1 juego personal (no afectado por grupo)"

PEDRO_PERS=$(curl -s -X GET "$API_URL/games" -H "Authorization: Bearer $PEDRO_TOKEN")
PEDRO_PERS_COUNT=$(echo "$PEDRO_PERS" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$PEDRO_PERS_COUNT" = "1" ]
test_result $? "Pedro sigue teniendo 1 juego personal"

MARIA_PERS=$(curl -s -X GET "$API_URL/games" -H "Authorization: Bearer $MARIA_TOKEN")
MARIA_PERS_COUNT=$(echo "$MARIA_PERS" | grep -o '"total":[0-9]*' | cut -d':' -f2)
[ "$MARIA_PERS_COUNT" = "2" ]
test_result $? "María sigue teniendo 2 juegos personales"

echo ""

# ============================================================================
# BLOQUE 6: Control de permisos
# ============================================================================
echo ">>> BLOQUE 6: Control de permisos"
echo ""

OTHER=$(curl -s -X POST "$API_URL/auth/register" -H "Content-Type: application/json" \
  -d "{\"name\": \"NoMiembro\", \"email\": \"nomiem$(date +%s%N)@test.com\", \"password\": \"password123\"}")
OTHER_TOKEN=$(echo "$OTHER" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

RESP=$(curl -s -X GET "$API_URL/games?groupId=$GROUP_ID" -H "Authorization: Bearer $OTHER_TOKEN")
echo "$RESP" | grep -q '"success":false'
test_result $? "Usuario NO miembro NO puede ver juegos del grupo"

RESP=$(curl -s -X POST "$API_URL/games" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OTHER_TOKEN" -d "{
  \"name\": \"Random\", \"minPlayers\": 2, \"maxPlayers\": 4, 
  \"playingTime\": 60, \"groupId\": \"$GROUP_ID\"}")
echo "$RESP" | grep -q '"success":false'
test_result $? "Usuario NO miembro NO puede agregar juegos al grupo"

echo ""

# ============================================================================
# RESUMEN
# ============================================================================

FAILED=$((TESTS - PASSED))
PERCENT=$((PASSED * 100 / TESTS))

echo "================================================================================"
echo "RESUMEN FINAL"
echo "================================================================================"
echo "Total Tests: $TESTS"
echo "✅ Pasados: $PASSED"
echo "❌ Fallidos: $FAILED"
echo "Porcentaje: $PERCENT%"
echo "================================================================================"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "✅ TODOS LOS TESTS PASARON"
  echo ""
  echo "Validación exitosa de:"
  echo "  • Usuarios pueden agregar juegos SIN estar en grupo"
  echo "  • Juegos personales son independientes por usuario"
  echo "  • Se previenen duplicados EN el grupo"
  echo "  • Miembros ven juegos del grupo sin duplicados"
  echo "  • Control de permisos correcto"
  echo ""
  exit 0
else
  echo "❌ ALGUNOS TESTS FALLARON"
  exit 1
fi
