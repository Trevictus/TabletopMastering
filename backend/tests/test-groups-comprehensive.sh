#!/bin/bash

# Script de pruebas completas para la API de Grupos
# Tabletop Mastering - Backend Tests

BASE_URL="http://localhost:3000/api"
TIMESTAMP=$(date +%s)
TOKEN=""
TOKEN2=""
USER1_ID=""
USER2_ID=""
GROUP_ID=""
INVITE_CODE=""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir headers
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
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
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_header "PRUEBAS COMPLETAS - API DE GRUPOS"

# 1. Registro de usuarios de prueba
print_header "1. REGISTRO DE USUARIOS"

echo "Registrando usuario 1 (Admin del grupo)..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Test",
    "email": "admin.groups'$TIMESTAMP'@test.com",
    "password": "test12345"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.data.token // .token // empty')
USER1_ID=$(echo $RESPONSE | jq -r '.data.user.id // .data.user._id // .data.id // .data._id // empty')

if [ -n "$TOKEN" ]; then
    print_success "Usuario 1 registrado correctamente"
    print_info "User1 ID: $USER1_ID"
else
    print_error "Error al registrar usuario 1"
    echo $RESPONSE
    exit 1
fi

echo "Registrando usuario 2 (Miembro del grupo)..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Member Test",
    "email": "member.groups'$TIMESTAMP'@test.com",
    "password": "test12345"
  }')

TOKEN2=$(echo $RESPONSE | jq -r '.data.token // .token // empty')
USER2_ID=$(echo $RESPONSE | jq -r '.data.user.id // .data.user._id // .data.id // .data._id // empty')

if [ -n "$TOKEN2" ]; then
    print_success "Usuario 2 registrado correctamente"
    print_info "User2 ID: $USER2_ID"
else
    print_error "Error al registrar usuario 2"
    echo $RESPONSE
    exit 1
fi

# 2. Crear grupo
print_header "2. CREAR GRUPO"

RESPONSE=$(curl -s -X POST "$BASE_URL/groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Grupo de Prueba",
    "description": "Grupo para testing completo",
    "settings": {
      "isPrivate": true,
      "maxMembers": 10
    }
  }')

GROUP_ID=$(echo $RESPONSE | jq -r '.data._id // empty')
INVITE_CODE=$(echo $RESPONSE | jq -r '.data.inviteCode // empty')

if [ -n "$GROUP_ID" ]; then
    print_success "Grupo creado correctamente"
    print_info "Group ID: $GROUP_ID"
    print_info "Invite Code: $INVITE_CODE"
else
    print_error "Error al crear grupo"
    echo $RESPONSE
    exit 1
fi

# 3. Listar mis grupos
print_header "3. LISTAR MIS GRUPOS"

RESPONSE=$(curl -s -X GET "$BASE_URL/groups" \
  -H "Authorization: Bearer $TOKEN")

COUNT=$(echo $RESPONSE | jq -r '.count // 0')

if [ "$COUNT" -ge 1 ]; then
    print_success "Grupos listados correctamente (count: $COUNT)"
else
    print_error "Error al listar grupos"
    echo $RESPONSE
fi

# 4. Obtener detalles del grupo
print_header "4. OBTENER DETALLES DEL GRUPO"

RESPONSE=$(curl -s -X GET "$BASE_URL/groups/$GROUP_ID" \
  -H "Authorization: Bearer $TOKEN")

GROUP_NAME=$(echo $RESPONSE | jq -r '.data.name // empty')

if [ "$GROUP_NAME" = "Grupo de Prueba" ]; then
    print_success "Detalles del grupo obtenidos correctamente"
else
    print_error "Error al obtener detalles del grupo"
    echo $RESPONSE
fi

# 5. Unirse al grupo con código
print_header "5. UNIRSE AL GRUPO CON CÓDIGO"

RESPONSE=$(curl -s -X POST "$BASE_URL/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{
    \"inviteCode\": \"$INVITE_CODE\"
  }")

SUCCESS=$(echo $RESPONSE | jq -r '.success | tostring')

if [ "$SUCCESS" = "true" ]; then
    print_success "Usuario 2 se unió al grupo correctamente"
else
    print_error "Error al unirse al grupo"
    echo $RESPONSE
fi

# 6. Listar miembros del grupo
print_header "6. LISTAR MIEMBROS DEL GRUPO"

RESPONSE=$(curl -s -X GET "$BASE_URL/groups/$GROUP_ID/members" \
  -H "Authorization: Bearer $TOKEN")

MEMBERS_COUNT=$(echo $RESPONSE | jq -r '.count // 0')

if [ "$MEMBERS_COUNT" -eq 2 ]; then
    print_success "Miembros listados correctamente (count: $MEMBERS_COUNT)"
else
    print_error "Error al listar miembros (esperado: 2, obtenido: $MEMBERS_COUNT)"
    echo $RESPONSE
fi

# 7. Actualizar grupo
print_header "7. ACTUALIZAR GRUPO"

RESPONSE=$(curl -s -X PUT "$BASE_URL/groups/$GROUP_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Grupo Actualizado",
    "description": "Descripción actualizada",
    "settings": {
      "maxMembers": 20
    }
  }')

UPDATED_NAME=$(echo $RESPONSE | jq -r '.data.name // empty')

if [ "$UPDATED_NAME" = "Grupo Actualizado" ]; then
    print_success "Grupo actualizado correctamente"
else
    print_error "Error al actualizar grupo"
    echo $RESPONSE
fi

# 8. Regenerar código de invitación
print_header "8. REGENERAR CÓDIGO DE INVITACIÓN"

RESPONSE=$(curl -s -X PUT "$BASE_URL/groups/$GROUP_ID/invite-code" \
  -H "Authorization: Bearer $TOKEN")

NEW_INVITE_CODE=$(echo $RESPONSE | jq -r '.data.inviteCode // empty')

if [ -n "$NEW_INVITE_CODE" ] && [ "$NEW_INVITE_CODE" != "$INVITE_CODE" ]; then
    print_success "Código regenerado correctamente"
    print_info "Old code: $INVITE_CODE"
    print_info "New code: $NEW_INVITE_CODE"
else
    print_error "Error al regenerar código"
    echo $RESPONSE
fi

# 9. Intentar expulsar miembro (como miembro, debería fallar)
print_header "9. INTENTAR EXPULSAR MIEMBRO (sin permisos)"

RESPONSE=$(curl -s -X DELETE "$BASE_URL/groups/$GROUP_ID/members/$USER2_ID" \
  -H "Authorization: Bearer $TOKEN2")

SUCCESS=$(echo $RESPONSE | jq -r '.success | tostring')

# Si success es false, significa que la expulsión fue bloqueada correctamente
if [ "$SUCCESS" = "false" ]; then
    print_success "Expulsión bloqueada correctamente (sin permisos)"
else
    print_error "Error: debería haber bloqueado la expulsión"
    echo $RESPONSE
fi

# 10. Expulsar miembro (como admin)
print_header "10. EXPULSAR MIEMBRO (como admin)"

RESPONSE=$(curl -s -X DELETE "$BASE_URL/groups/$GROUP_ID/members/$USER2_ID" \
  -H "Authorization: Bearer $TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success | tostring')

if [ "$SUCCESS" = "true" ]; then
    print_success "Miembro expulsado correctamente"
else
    print_error "Error al expulsar miembro"
    echo $RESPONSE
fi

# 11. Verificar que el miembro fue expulsado
print_header "11. VERIFICAR EXPULSIÓN"

RESPONSE=$(curl -s -X GET "$BASE_URL/groups/$GROUP_ID/members" \
  -H "Authorization: Bearer $TOKEN")

MEMBERS_COUNT=$(echo $RESPONSE | jq -r '.count // 0')

if [ "$MEMBERS_COUNT" -eq 1 ]; then
    print_success "Miembro expulsado verificado (count: $MEMBERS_COUNT)"
else
    print_error "Error: el miembro no fue expulsado correctamente"
    echo $RESPONSE
fi

# 12. Unirse nuevamente
print_header "12. UNIRSE NUEVAMENTE AL GRUPO"

RESPONSE=$(curl -s -X POST "$BASE_URL/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{
    \"inviteCode\": \"$NEW_INVITE_CODE\"
  }")

SUCCESS=$(echo $RESPONSE | jq -r '.success | tostring')

if [ "$SUCCESS" = "true" ]; then
    print_success "Usuario 2 se unió nuevamente al grupo"
else
    print_error "Error al unirse nuevamente"
    echo $RESPONSE
fi

# 13. Salir del grupo (como miembro)
print_header "13. SALIR DEL GRUPO"

RESPONSE=$(curl -s -X DELETE "$BASE_URL/groups/$GROUP_ID/leave" \
  -H "Authorization: Bearer $TOKEN2")

SUCCESS=$(echo $RESPONSE | jq -r '.success | tostring')

if [ "$SUCCESS" = "true" ]; then
    print_success "Usuario 2 salió del grupo correctamente"
else
    print_error "Error al salir del grupo"
    echo $RESPONSE
fi

# 14. Intentar salir del grupo como admin (debería fallar)
print_header "14. INTENTAR SALIR COMO ADMIN"

RESPONSE=$(curl -s -X DELETE "$BASE_URL/groups/$GROUP_ID/leave" \
  -H "Authorization: Bearer $TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success | tostring')

# Si success es false, significa que la salida fue bloqueada correctamente
if [ "$SUCCESS" = "false" ]; then
    print_success "Salida bloqueada correctamente (es admin)"
else
    print_error "Error: admin no debería poder salir"
    echo $RESPONSE
fi

# 15. Eliminar grupo
print_header "15. ELIMINAR GRUPO"

RESPONSE=$(curl -s -X DELETE "$BASE_URL/groups/$GROUP_ID" \
  -H "Authorization: Bearer $TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success | tostring')

if [ "$SUCCESS" = "true" ]; then
    print_success "Grupo eliminado correctamente"
else
    print_error "Error al eliminar grupo"
    echo $RESPONSE
fi

# 16. Verificar que el grupo no aparece en la lista
print_header "16. VERIFICAR ELIMINACIÓN"

RESPONSE=$(curl -s -X GET "$BASE_URL/groups" \
  -H "Authorization: Bearer $TOKEN")

COUNT=$(echo $RESPONSE | jq -r '.count // -1')

if [ "$COUNT" -eq 0 ]; then
    print_success "Grupo eliminado verificado (count: 0)"
else
    print_error "Error: el grupo aún aparece en la lista"
    echo $RESPONSE
fi

# Resumen final
print_header "RESUMEN DE PRUEBAS"
print_success "Todas las pruebas de la API de Grupos completadas"
print_info "Total de pruebas: 16"
print_info "Funcionalidades probadas:"
echo "  - Crear grupo"
echo "  - Listar grupos"
echo "  - Obtener detalles"
echo "  - Unirse con código"
echo "  - Listar miembros"
echo "  - Actualizar grupo"
echo "  - Regenerar código de invitación"
echo "  - Expulsar miembros"
echo "  - Salir del grupo"
echo "  - Eliminar grupo"
echo "  - Permisos y validaciones"
