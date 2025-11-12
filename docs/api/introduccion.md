# 🌐 API REST - Introducción

Bienvenido a la documentación de la API REST de **Tabletop Mastering**.

---

## 📋 Información General

### URL Base

```
http://localhost:5000/api
```

### Formato de Datos

- **Request**: `application/json`
- **Response**: `application/json`

### Versionado

Actualmente la API está en la versión **v1.0**.

---

## 🔐 Autenticación

La API utiliza **JSON Web Tokens (JWT)** para la autenticación.

### Obtener un Token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "jugador123",
      "email": "usuario@example.com"
    }
  }
}
```

### Usar el Token

Incluye el token en el header `Authorization` de todas las peticiones protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo con cURL:**

```bash
curl -H "Authorization: Bearer TU_TOKEN" \
     http://localhost:5000/api/groups
```

---

## 📊 Códigos de Respuesta HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **200** | OK | Petición exitosa |
| **201** | Created | Recurso creado exitosamente |
| **400** | Bad Request | Datos inválidos en la petición |
| **401** | Unauthorized | Token inválido o no proporcionado |
| **403** | Forbidden | Sin permisos para esta acción |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: email ya existe) |
| **500** | Internal Server Error | Error del servidor |

---

## 📦 Estructura de Respuestas

Todas las respuestas de la API siguen una estructura consistente:

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    // Datos de la respuesta
  },
  "message": "Mensaje opcional"
}
```

### Respuesta con Error

```json
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "code": "ERROR_CODE",
    "details": [] // Detalles adicionales (opcional)
  }
}
```

### Ejemplo de Error de Validación

```json
{
  "success": false,
  "error": {
    "message": "Errores de validación",
    "details": [
      {
        "field": "email",
        "message": "El email no es válido"
      },
      {
        "field": "password",
        "message": "La contraseña debe tener al menos 6 caracteres"
      }
    ]
  }
}
```

---

## 🔄 Paginación

Los endpoints que devuelven listas soportan paginación mediante query parameters:

### Parámetros

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10, max: 100)

### Ejemplo

```bash
GET /api/games?page=2&limit=20
```

### Respuesta con Paginación

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 156,
      "pages": 8,
      "hasMore": true
    }
  }
}
```

---

## 🔍 Filtros y Búsqueda

Muchos endpoints soportan filtros mediante query parameters:

### Ejemplo: Búsqueda de Juegos

```bash
GET /api/games?search=catan&minPlayers=3&maxPlayers=4&sortBy=name
```

### Parámetros Comunes

- `search` - Búsqueda por texto
- `sortBy` - Campo para ordenar
- `order` - Orden: `asc` o `desc`

---

## ⚠️ Manejo de Errores

### Errores Comunes

#### 1. Token Expirado

```json
{
  "success": false,
  "error": {
    "message": "Token expirado",
    "code": "TOKEN_EXPIRED"
  }
}
```

**Solución**: Realizar login nuevamente para obtener un nuevo token.

#### 2. Token Inválido

```json
{
  "success": false,
  "error": {
    "message": "Token inválido",
    "code": "INVALID_TOKEN"
  }
}
```

**Solución**: Verificar que el token esté correctamente formateado.

#### 3. Permisos Insuficientes

```json
{
  "success": false,
  "error": {
    "message": "No tienes permisos para realizar esta acción",
    "code": "FORBIDDEN"
  }
}
```

**Solución**: Verificar que el usuario tenga los permisos necesarios.

---

## 🛠️ Rate Limiting

Para proteger la API, se implementan límites de velocidad:

- **Límite general**: 100 peticiones por 15 minutos
- **Endpoints de autenticación**: 5 intentos por 15 minutos

Si excedes el límite, recibirás un error `429 Too Many Requests`.

---

## 📚 Endpoints Disponibles

### Autenticación
- [Documentación de Autenticación](./autenticacion.md)

### Grupos
- [Documentación de Grupos](./grupos.md)

### Juegos
- [Documentación de Juegos](./juegos.md)

### Partidas
- [Documentación de Partidas](./partidas.md) ⏳ *En desarrollo*

---

## 🧪 Probar la API

### Thunder Client (VS Code)

1. Instala la extensión [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)
2. Importa la colección desde `backend/thunder-tests/`
3. Configura las variables de entorno
4. ¡Empieza a probar!

### cURL

```bash
# Registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jugador1",
    "email": "jugador1@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jugador1@example.com",
    "password": "password123"
  }'
```

---

## 📖 Recursos Adicionales

- [Guía de Instalación](../guias-inicio/instalacion.md)
- [Inicio Rápido](../guias-inicio/inicio-rapido.md)
- [Pruebas](../desarrollo/pruebas.md)

---

## 💡 Mejores Prácticas

1. **Siempre valida los datos** antes de enviarlos
2. **Maneja los errores** apropiadamente en tu cliente
3. **Almacena el token de forma segura** (nunca en localStorage para producción)
4. **Respeta los límites de velocidad**
5. **Usa HTTPS en producción**

---

**Siguiente**: [Autenticación →](./autenticacion.md)
