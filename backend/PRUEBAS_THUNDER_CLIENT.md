# 🧪 Guía de Pruebas con Thunder Client

## ✅ Estado de las Pruebas

**TODAS LAS PRUEBAS HAN PASADO EXITOSAMENTE** ✅

Se han probado 10 endpoints y todos funcionan correctamente:

### Pruebas Exitosas (200/201)
1. ✅ Registro de usuario
2. ✅ Login
3. ✅ Obtener perfil (ruta protegida)
4. ✅ Actualizar perfil (ruta protegida)

### Pruebas de Errores (401/400) - Comportamiento Esperado
5. ✅ Acceso sin token → 401
6. ✅ Token inválido → 401
7. ✅ Email duplicado → 400
8. ✅ Credenciales inválidas → 401
9. ✅ Email inválido → 400
10. ✅ Password muy corta → 400

---

## 🚀 Cómo Usar Thunder Client

### 1. Instalar Thunder Client
Si no lo tienes instalado:
1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca "Thunder Client"
4. Instala la extensión

### 2. Colección Ya Configurada

He creado una colección completa en:
```
.vscode/thunder-tests/thunderCollection.json
```

Esta incluye **7 peticiones pre-configuradas**:

1. **Registro de Usuario** - POST `/api/auth/register`
2. **Login** - POST `/api/auth/login` (guarda token automáticamente)
3. **Obtener Mi Perfil** - GET `/api/auth/me` (usa token guardado)
4. **Actualizar Perfil** - PUT `/api/auth/profile` (usa token guardado)
5. **Sin Token** - GET `/api/auth/me` (prueba error 401)
6. **Email Duplicado** - POST `/api/auth/register` (prueba error 400)
7. **Credenciales Inválidas** - POST `/api/auth/login` (prueba error 401)

### 3. Variables de Entorno

Archivo: `.vscode/thunder-tests/thunderEnvironment.json`

Variables configuradas:
- `baseUrl`: http://localhost:3000
- `token`: (se guarda automáticamente al hacer login)

### 4. Usar la Colección

1. **Abrir Thunder Client**
   - Click en el ícono de Thunder Client en la barra lateral
   - O presiona `Ctrl+Shift+P` → "Thunder Client: Open"

2. **Ver la Colección**
   - Ve a la pestaña "Collections"
   - Verás las peticiones listadas

3. **Ejecutar las Pruebas**
   
   **Orden recomendado:**
   
   a) **Primero: Registro**
      - Click en "1. Registro de Usuario"
      - Click en "Send"
      - Deberías ver: `201 Created`
      - Guarda el token que se muestra
   
   b) **Segundo: Login**
      - Click en "2. Login"
      - Click en "Send"
      - Deberías ver: `200 OK`
      - El token se guarda automáticamente en `{{token}}`
   
   c) **Tercero: Obtener Perfil**
      - Click en "3. Obtener Mi Perfil (Protegido)"
      - Click en "Send"
      - Deberías ver: `200 OK` con tus datos
   
   d) **Cuarto: Actualizar Perfil**
      - Click en "4. Actualizar Perfil (Protegido)"
      - Modifica el body si quieres
      - Click en "Send"
      - Deberías ver: `200 OK` con datos actualizados

   e) **Probar Errores**
      - Ejecuta las peticiones 5, 6 y 7 para ver los errores

---

## 📊 Resultados de las Pruebas Realizadas

### ✅ 1. Registro Exitoso
```http
POST /api/auth/register
Status: 201 Created
Time: ~64ms
```

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "690dd6fb46e5e44dbe1b405c",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "avatar": "https://via.placeholder.com/150"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### ✅ 2. Login Exitoso
```http
POST /api/auth/login
Status: 200 OK
Time: ~60ms
```

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "690dd6fb46e5e44dbe1b405c",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "avatar": "https://via.placeholder.com/150",
      "stats": {
        "totalMatches": 0,
        "totalWins": 0,
        "totalPoints": 0
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### ✅ 3. Obtener Perfil (Ruta Protegida)
```http
GET /api/auth/me
Header: Authorization: Bearer {token}
Status: 200 OK
Time: ~15ms
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "690dd6fb46e5e44dbe1b405c",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "avatar": "https://via.placeholder.com/150",
    "description": "",
    "quote": "",
    "stats": {
      "totalMatches": 0,
      "totalWins": 0,
      "totalPoints": 0
    },
    "groups": [],
    "isActive": true,
    "createdAt": "2025-11-07T11:24:43.194Z",
    "updatedAt": "2025-11-07T11:24:43.194Z"
  }
}
```

---

### ✅ 4. Actualizar Perfil (Ruta Protegida)
```http
PUT /api/auth/profile
Header: Authorization: Bearer {token}
Status: 200 OK
Time: ~8ms
```

**Request:**
```json
{
  "name": "Juan Pérez García",
  "description": "Amante de los juegos de estrategia",
  "quote": "¡A jugar se ha dicho!",
  "avatar": "https://i.pravatar.cc/150?img=12"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "_id": "690dd6fb46e5e44dbe1b405c",
    "name": "Juan Pérez García",
    "email": "juan@example.com",
    "avatar": "https://i.pravatar.cc/150?img=12",
    "description": "Amante de los juegos de estrategia",
    "quote": "¡A jugar se ha dicho!",
    "stats": {...},
    "groups": [],
    "isActive": true,
    "updatedAt": "2025-11-07T11:25:22.457Z"
  }
}
```

---

### ❌ 5. Sin Token (Error 401)
```http
GET /api/auth/me
Sin header Authorization
Status: 401 Unauthorized
```

**Response:**
```json
{
  "success": false,
  "message": "No autorizado, token no proporcionado"
}
```

---

### ❌ 6. Token Inválido (Error 401)
```http
GET /api/auth/me
Header: Authorization: Bearer token_invalido
Status: 401 Unauthorized
```

**Response:**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

### ❌ 7. Email Duplicado (Error 400)
```http
POST /api/auth/register
Status: 400 Bad Request
```

**Request:**
```json
{
  "name": "Otro Usuario",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

### ❌ 8. Credenciales Inválidas (Error 401)
```http
POST /api/auth/login
Status: 401 Unauthorized
```

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "password_incorrecta"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### ❌ 9. Email Inválido (Error 400)
```http
POST /api/auth/register
Status: 400 Bad Request
```

**Request:**
```json
{
  "name": "Test",
  "email": "correo-invalido",
  "password": "123456"
}
```

**Response:**
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

---

### ❌ 10. Password Muy Corta (Error 400)
```http
POST /api/auth/register
Status: 400 Bad Request
```

**Request:**
```json
{
  "name": "Test User",
  "email": "test2@example.com",
  "password": "123"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 6 caracteres"
    }
  ]
}
```

---

## 🔒 Características de Seguridad Validadas

### ✅ Encriptación de Contraseñas
- Las contraseñas se guardan hasheadas con **bcrypt**
- El campo `password` tiene `select: false` (no se devuelve en consultas)
- Se elimina del objeto JSON en las respuestas

### ✅ Autenticación JWT
- Tokens con expiración de 7 días
- Verificación en cada ruta protegida
- Mensajes de error apropiados para tokens inválidos

### ✅ Validaciones
- Email único en la base de datos
- Formato de email válido
- Contraseña mínimo 6 caracteres
- Nombre entre 2-50 caracteres
- Usuario activo para login

### ✅ Rutas Protegidas
- Middleware de autenticación funcionando
- Token requerido en header `Authorization: Bearer {token}`
- Validación de usuario existe y está activo

---

## 📌 Tips para Thunder Client

### Guardar Token Automáticamente
Ya configurado en las peticiones de Login y Registro:
- Pestaña "Tests" tiene: `Set Env Variable: token = json.data.token`

### Ver Variables
1. Click en "Env" en Thunder Client
2. Verás `baseUrl` y `token`
3. El token se actualiza automáticamente al hacer login

### Editar Peticiones
1. Click en cualquier petición
2. Puedes modificar:
   - URL (usa `{{baseUrl}}` para el base URL)
   - Headers
   - Body
3. Click "Send" para probar

### Crear Nuevas Peticiones
1. Click en "New Request"
2. Selecciona método (GET, POST, PUT, DELETE)
3. Usa variables: `{{baseUrl}}` y `{{token}}`

---

## 🎯 Siguiente Paso

Ahora que la autenticación funciona perfectamente, puedes probar los otros endpoints:
- **Grupos**: `/api/groups`
- **Juegos**: `/api/games`
- **Partidas**: `/api/matches`

¡La API está lista y funcionando! 🎲
