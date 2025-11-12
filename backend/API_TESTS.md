# 🧪 Pruebas de API - Tabletop Mastering

Este archivo contiene ejemplos de peticiones HTTP para probar los endpoints de la API.

## Variables globales
```
BASE_URL = http://localhost:3000
TOKEN = <tu_token_jwt_aquí>
```

---

## 🏠 Health Check

### Verificar estado del servidor
```http
GET http://localhost:3000/health
```

### Información de la API
```http
GET http://localhost:3000/
```

---

## 🔐 Autenticación (`/api/auth`)

### 1. Registrar nuevo usuario
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

### 2. Iniciar sesión
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

⚠️ **Guarda el token para las siguientes peticiones**

### 3. Obtener mi perfil
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer <tu_token_aquí>
```

### 4. Actualizar perfil
```http
PUT http://localhost:3000/api/auth/profile
Content-Type: application/json
Authorization: Bearer <tu_token_aquí>

{
  "name": "Juan Pérez García",
  "description": "Amante de los juegos de estrategia",
  "quote": "¡A jugar se ha dicho!",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## 👥 Grupos (`/api/groups`)

### 1. Crear un grupo
```http
POST http://localhost:3000/api/groups
Content-Type: application/json
Authorization: Bearer <tu_token_aquí>

{
  "name": "Los Estrategas",
  "description": "Grupo de amigos que aman los juegos de mesa",
  "avatar": "https://example.com/group-avatar.jpg",
  "settings": {
    "isPrivate": true,
    "maxMembers": 10,
    "requireApproval": false
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Grupo creado exitosamente",
  "data": {
    "_id": "...",
    "name": "Los Estrategas",
    "inviteCode": "A1B2C3D4",
    ...
  }
}
```

⚠️ **Guarda el inviteCode para invitar a otros jugadores**

### 2. Obtener mis grupos
```http
GET http://localhost:3000/api/groups
Authorization: Bearer <tu_token_aquí>
```

### 3. Obtener un grupo específico
```http
GET http://localhost:3000/api/groups/<group_id>
Authorization: Bearer <tu_token_aquí>
```

### 4. Unirse a un grupo (con código de invitación)
```http
POST http://localhost:3000/api/groups/join
Content-Type: application/json
Authorization: Bearer <tu_token_aquí>

{
  "inviteCode": "A1B2C3D4"
}
```

---

## 🎲 Juegos (`/api/games`) - ⏳ Pendiente de implementar

```http
# Estas rutas están definidas pero sin controladores

POST http://localhost:3000/api/games
GET http://localhost:3000/api/games
GET http://localhost:3000/api/games/:id
PUT http://localhost:3000/api/games/:id
DELETE http://localhost:3000/api/games/:id
```

---

## 🎯 Partidas (`/api/matches`) - ⏳ Pendiente de implementar

```http
# Estas rutas están definidas pero sin controladores

POST http://localhost:3000/api/matches
GET http://localhost:3000/api/matches
GET http://localhost:3000/api/matches/:id
PUT http://localhost:3000/api/matches/:id
DELETE http://localhost:3000/api/matches/:id
POST http://localhost:3000/api/matches/:id/confirm
POST http://localhost:3000/api/matches/:id/finish
```

---

## 📝 Errores comunes

### 401 - No autorizado
```json
{
  "success": false,
  "message": "No autorizado, token no proporcionado"
}
```
**Solución:** Incluye el header `Authorization: Bearer <token>`

### 400 - Validación
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "email",
      "message": "Debe ser un email válido"
    }
  ]
}
```

### 404 - No encontrado
```json
{
  "success": false,
  "message": "Ruta no encontrada - /api/ruta/inexistente"
}
```

---

## 🧪 Ejemplo de flujo completo

1. **Registrar un usuario**
2. **Iniciar sesión** → Obtener token
3. **Crear un grupo** → Obtener inviteCode
4. **Otro usuario se registra e inicia sesión**
5. **Ese usuario se une al grupo** usando el inviteCode
6. **Obtener información del grupo** y ver los miembros

---

## 🛠️ Herramientas recomendadas

- **Postman** - Cliente HTTP visual
- **Thunder Client** - Extensión de VS Code
- **curl** - Línea de comandos
- **HTTPie** - Línea de comandos amigable

### Ejemplo con curl:
```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"juan@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"123456"}'

# Obtener perfil (con token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```
