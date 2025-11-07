#!/bin/bash

# 🎲 Script de Demostración - Tabletop Mastering API
# Este script demuestra todas las funcionalidades implementadas

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# URL base de la API
BASE_URL="http://localhost:3000"

# Función para imprimir encabezados
print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}  $1${NC}"
    echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

# Función para imprimir pasos
print_step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

# Función para imprimir éxito
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para imprimir error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para pausar
pause() {
    echo ""
    read -p "Presiona ENTER para continuar..."
    echo ""
}

# Verificar que el servidor esté corriendo
check_server() {
    print_step "Verificando que el servidor esté corriendo..."
    
    if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
        print_success "Servidor respondiendo en $BASE_URL"
        return 0
    else
        print_error "El servidor no está respondiendo"
        echo "Por favor, inicia el servidor con: cd backend && npm run dev"
        exit 1
    fi
}

# Limpiar terminal
clear

# Banner
echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║         🎲  TABLETOP MASTERING API  🎲               ║"
echo "║                                                       ║"
echo "║              Demostración Interactiva                ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "Este script demostrará todas las funcionalidades implementadas:"
echo "  1. Sistema de Autenticación"
echo "  2. Gestión de Usuarios"
echo "  3. Gestión de Grupos"
echo "  4. Seguridad y Validaciones"
echo ""

pause

# Verificar servidor
check_server

# ============================================================================
# DEMOSTRACIÓN 1: REGISTRO DE USUARIOS
# ============================================================================

print_header "1. REGISTRO DE USUARIOS"

print_step "Registrando Usuario 1: Carlos López (Admin del grupo)"
CARLOS_DATA=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos López",
    "email": "carlos.demo@example.com",
    "password": "123456"
  }')

if echo "$CARLOS_DATA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Carlos registrado exitosamente"
    CARLOS_ID=$(echo "$CARLOS_DATA" | jq -r '.data.user.id')
    CARLOS_TOKEN=$(echo "$CARLOS_DATA" | jq -r '.data.token')
    echo "  ID: $CARLOS_ID"
    echo "  Token: ${CARLOS_TOKEN:0:50}..."
else
    print_error "Error al registrar a Carlos"
    echo "$CARLOS_DATA" | jq .
fi

echo ""
print_step "Registrando Usuario 2: Ana García (Miembro)"
ANA_DATA=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana García",
    "email": "ana.demo@example.com",
    "password": "123456"
  }')

if echo "$ANA_DATA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Ana registrada exitosamente"
    ANA_ID=$(echo "$ANA_DATA" | jq -r '.data.user.id')
    ANA_TOKEN=$(echo "$ANA_DATA" | jq -r '.data.token')
    echo "  ID: $ANA_ID"
    echo "  Token: ${ANA_TOKEN:0:50}..."
else
    print_error "Error al registrar a Ana"
    echo "$ANA_DATA" | jq .
fi

echo ""
print_step "Registrando Usuario 3: Pedro Martínez (Miembro)"
PEDRO_DATA=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Martínez",
    "email": "pedro.demo@example.com",
    "password": "123456"
  }')

if echo "$PEDRO_DATA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Pedro registrado exitosamente"
    PEDRO_ID=$(echo "$PEDRO_DATA" | jq -r '.data.user.id')
    PEDRO_TOKEN=$(echo "$PEDRO_DATA" | jq -r '.data.token')
    echo "  ID: $PEDRO_ID"
    echo "  Token: ${PEDRO_TOKEN:0:50}..."
else
    print_error "Error al registrar a Pedro"
    echo "$PEDRO_DATA" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 2: LOGIN
# ============================================================================

print_header "2. INICIO DE SESIÓN"

print_step "Carlos inicia sesión..."
LOGIN_DATA=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos.demo@example.com",
    "password": "123456"
  }')

if echo "$LOGIN_DATA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Login exitoso"
    echo "$LOGIN_DATA" | jq '{
      message: .message,
      user: .data.user.name,
      email: .data.user.email,
      stats: .data.user.stats
    }'
else
    print_error "Error en el login"
    echo "$LOGIN_DATA" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 3: OBTENER PERFIL
# ============================================================================

print_header "3. OBTENER PERFIL DE USUARIO"

print_step "Carlos obtiene su perfil..."
PROFILE_DATA=$(curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $CARLOS_TOKEN")

if echo "$PROFILE_DATA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Perfil obtenido"
    echo "$PROFILE_DATA" | jq '{
      name: .data.name,
      email: .data.email,
      description: .data.description,
      stats: .data.stats,
      groups: .data.groups,
      createdAt: .data.createdAt
    }'
else
    print_error "Error al obtener perfil"
    echo "$PROFILE_DATA" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 4: ACTUALIZAR PERFIL
# ============================================================================

print_header "4. ACTUALIZAR PERFIL"

print_step "Carlos actualiza su perfil..."
UPDATE_DATA=$(curl -s -X PUT "$BASE_URL/api/auth/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CARLOS_TOKEN" \
  -d '{
    "name": "Carlos López García",
    "description": "Jugador experimentado de juegos de estrategia. Organizador de eventos.",
    "quote": "¡El que tiene madera tiene victoria!",
    "avatar": "https://i.pravatar.cc/150?img=8"
  }')

if echo "$UPDATE_DATA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Perfil actualizado"
    echo "$UPDATE_DATA" | jq '{
      message: .message,
      name: .data.name,
      description: .data.description,
      quote: .data.quote
    }'
else
    print_error "Error al actualizar perfil"
    echo "$UPDATE_DATA" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 5: CREAR GRUPO
# ============================================================================

print_header "5. CREAR GRUPO"

print_step "Carlos crea el grupo 'Noches de Catan'..."
GROUP_DATA=$(curl -s -X POST "$BASE_URL/api/groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CARLOS_TOKEN" \
  -d '{
    "name": "Noches de Catan",
    "description": "Grupo semanal para jugar Catan y otros juegos de estrategia. Nos reunimos todos los viernes a las 20:00.",
    "avatar": "https://via.placeholder.com/200?text=Noches+de+Catan",
    "settings": {
      "allowInvites": true,
      "requireApproval": false
    }
  }')

if echo "$GROUP_DATA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Grupo creado exitosamente"
    GROUP_ID=$(echo "$GROUP_DATA" | jq -r '.data._id')
    INVITE_CODE=$(echo "$GROUP_DATA" | jq -r '.data.inviteCode')
    echo ""
    echo -e "${BOLD}Información del grupo:${NC}"
    echo "$GROUP_DATA" | jq '{
      message: .message,
      name: .data.name,
      description: .data.description,
      inviteCode: .data.inviteCode,
      admin: .data.admin,
      members: .data.members | length
    }'
    echo ""
    echo -e "${GREEN}${BOLD}📋 Código de invitación: $INVITE_CODE${NC}"
    echo ""
else
    print_error "Error al crear grupo"
    echo "$GROUP_DATA" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 6: UNIRSE A GRUPO
# ============================================================================

print_header "6. UNIRSE A GRUPO CON CÓDIGO DE INVITACIÓN"

print_step "Ana se une al grupo usando el código $INVITE_CODE..."
JOIN_ANA=$(curl -s -X POST "$BASE_URL/api/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANA_TOKEN" \
  -d "{
    \"inviteCode\": \"$INVITE_CODE\"
  }")

if echo "$JOIN_ANA" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Ana se unió al grupo"
    echo "$JOIN_ANA" | jq '{
      message: .message,
      group: .data.name,
      members: .data.members | length
    }'
else
    print_error "Error al unirse al grupo"
    echo "$JOIN_ANA" | jq .
fi

echo ""
print_step "Pedro se une al grupo usando el código $INVITE_CODE..."
JOIN_PEDRO=$(curl -s -X POST "$BASE_URL/api/groups/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PEDRO_TOKEN" \
  -d "{
    \"inviteCode\": \"$INVITE_CODE\"
  }")

if echo "$JOIN_PEDRO" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Pedro se unió al grupo"
    echo "$JOIN_PEDRO" | jq '{
      message: .message,
      group: .data.name,
      members: .data.members | length
    }'
else
    print_error "Error al unirse al grupo"
    echo "$JOIN_PEDRO" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 7: VER GRUPOS
# ============================================================================

print_header "7. LISTAR MIS GRUPOS"

print_step "Carlos lista sus grupos..."
MY_GROUPS=$(curl -s -X GET "$BASE_URL/api/groups" \
  -H "Authorization: Bearer $CARLOS_TOKEN")

if echo "$MY_GROUPS" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Grupos obtenidos"
    echo "$MY_GROUPS" | jq '{
      count: .count,
      groups: [.data[] | {
        name: .name,
        members: .members | length,
        inviteCode: .inviteCode,
        admin: .admin.name
      }]
    }'
else
    print_error "Error al obtener grupos"
    echo "$MY_GROUPS" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 8: VER DETALLES DEL GRUPO
# ============================================================================

print_header "8. VER DETALLES COMPLETOS DEL GRUPO"

print_step "Carlos ve los detalles del grupo..."
GROUP_DETAILS=$(curl -s -X GET "$BASE_URL/api/groups/$GROUP_ID" \
  -H "Authorization: Bearer $CARLOS_TOKEN")

if echo "$GROUP_DETAILS" | jq -e '.success' > /dev/null 2>&1; then
    print_success "Detalles del grupo obtenidos"
    echo "$GROUP_DETAILS" | jq '{
      name: .data.name,
      description: .data.description,
      admin: .data.admin.name,
      members: [.data.members[] | {
        name: .user.name,
        email: .user.email,
        role: .role,
        joinedAt: .joinedAt
      }],
      settings: .data.settings
    }'
else
    print_error "Error al obtener detalles"
    echo "$GROUP_DETAILS" | jq .
fi

pause

# ============================================================================
# DEMOSTRACIÓN 9: CASOS DE ERROR - VALIDACIONES
# ============================================================================

print_header "9. DEMOSTRACIÓN DE VALIDACIONES Y SEGURIDAD"

print_step "Intento de acceso sin token (debe fallar)..."
NO_TOKEN=$(curl -s -X GET "$BASE_URL/api/auth/me")

if echo "$NO_TOKEN" | jq -e '.success == false' > /dev/null 2>&1; then
    print_success "Error controlado: $(echo "$NO_TOKEN" | jq -r '.message')"
else
    print_error "La validación de token no funcionó correctamente"
fi

echo ""
print_step "Intento de registro con email duplicado (debe fallar)..."
DUP_EMAIL=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Otro Usuario",
    "email": "carlos.demo@example.com",
    "password": "123456"
  }')

if echo "$DUP_EMAIL" | jq -e '.success == false' > /dev/null 2>&1; then
    print_success "Error controlado: $(echo "$DUP_EMAIL" | jq -r '.message')"
else
    print_error "La validación de email duplicado no funcionó"
fi

echo ""
print_step "Intento de login con contraseña incorrecta (debe fallar)..."
WRONG_PASS=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos.demo@example.com",
    "password": "incorrecta"
  }')

if echo "$WRONG_PASS" | jq -e '.success == false' > /dev/null 2>&1; then
    print_success "Error controlado: $(echo "$WRONG_PASS" | jq -r '.message')"
else
    print_error "La validación de contraseña no funcionó"
fi

echo ""
print_step "Intento de registro con email inválido (debe fallar)..."
INVALID_EMAIL=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "correo-invalido",
    "password": "123456"
  }')

if echo "$INVALID_EMAIL" | jq -e '.success == false' > /dev/null 2>&1; then
    print_success "Error controlado: Validación de formato de email"
    echo "$INVALID_EMAIL" | jq '.errors[]'
else
    print_error "La validación de formato de email no funcionó"
fi

pause

# ============================================================================
# RESUMEN FINAL
# ============================================================================

print_header "RESUMEN DE LA DEMOSTRACIÓN"

echo -e "${GREEN}${BOLD}✅ Funcionalidades Demostradas:${NC}"
echo ""
echo "  1. ✅ Registro de usuarios con validaciones"
echo "  2. ✅ Login y generación de tokens JWT"
echo "  3. ✅ Obtener perfil de usuario"
echo "  4. ✅ Actualizar perfil de usuario"
echo "  5. ✅ Crear grupos con código de invitación único"
echo "  6. ✅ Unirse a grupos mediante código"
echo "  7. ✅ Listar grupos del usuario"
echo "  8. ✅ Ver detalles completos del grupo"
echo "  9. ✅ Validaciones y seguridad"
echo ""
echo -e "${BLUE}${BOLD}🔒 Seguridad:${NC}"
echo "  ✓ Contraseñas encriptadas con bcrypt"
echo "  ✓ Autenticación JWT funcionando"
echo "  ✓ Rutas protegidas validadas"
echo "  ✓ Validaciones de datos implementadas"
echo ""
echo -e "${YELLOW}${BOLD}📊 Datos Creados:${NC}"
echo "  👥 Usuarios: 3 (Carlos, Ana, Pedro)"
echo "  🎲 Grupos: 1 (Noches de Catan)"
echo "  👨‍👩‍👦 Miembros en grupo: 3"
echo "  📋 Código de invitación: $INVITE_CODE"
echo ""
echo -e "${BOLD}Usuarios creados para pruebas:${NC}"
echo "  Email: carlos.demo@example.com | Password: 123456"
echo "  Email: ana.demo@example.com    | Password: 123456"
echo "  Email: pedro.demo@example.com  | Password: 123456"
echo ""
echo -e "${GREEN}${BOLD}🎉 ¡Demostración completada exitosamente!${NC}"
echo ""
echo "Puedes usar estos usuarios y el código de invitación"
echo "para seguir probando la API con Thunder Client."
echo ""
