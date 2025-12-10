# Documentación de la API — Tabletop Mastering

Esta referencia describe los principales endpoints del backend, su funcionalidad, parámetros y ejemplos de respuesta.

---

## Autenticación y uso de JWT

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

Obtén el token al hacer login o registro. Inclúyelo en cada petición autenticada.

---

## Códigos de estado y errores comunes

| Código | Significado                |
|--------|----------------------------|
| 200    | OK (éxito)                 |
| 201    | Creado                     |
| 400    | Petición inválida          |
| 401    | No autenticado             |
| 403    | Prohibido (sin permisos)   |
| 404    | No encontrado              |
| 409    | Conflicto (duplicado)      |
| 500    | Error interno del servidor |

Errores devuelven:
```json
{
  "success": false,
  "message": "Descripción del error."
}
```

---

## Autenticación

### POST /api/auth/register
- **Descripción:** Registra un nuevo usuario.
- **Parámetros:**
  - **Body:**
    - `name` (string, requerido)
    - `email` (string, requerido)
    - `password` (string, requerido)
- **Ejemplo de petición:**
```json
{
  "name": "Juan",
  "email": "juan@email.com",
  "password": "123456"
}
```
- **Respuesta (201):**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Juan", "email": "juan@email.com" },
    "token": "...jwt..."
  }
}
```
- **Errores (400):**
```json
{
  "success": false,
  "message": "El email ya está registrado."
}
```

---

### POST /api/auth/login
- **Descripción:** Inicia sesión y devuelve un token JWT.
- **Parámetros:**
  - **Body:**
    - `email` (string, requerido)
    - `password` (string, requerido)
- **Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Juan", "email": "juan@email.com" },
    "token": "...jwt..."
  }
}
```
- **Errores (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas."
}
```

---

### GET /api/auth/me
- **Descripción:** Devuelve el usuario autenticado (requiere JWT en header Authorization).
- **Headers:**
  - `Authorization: Bearer <token>`
- **Respuesta (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Juan", "email": "juan@email.com" }
}
```
- **Errores (401):**
```json
{
  "success": false,
  "message": "Token inválido o expirado."
}
```

---

## Grupos

### GET /api/groups
- **Descripción:** Devuelve los grupos del usuario autenticado.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Respuesta (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Grupo 1", "members": [ ... ] },
    ...
  ]
}
```

- **Paginación:** Puedes usar `?page=1&limit=10` para paginar resultados si el endpoint lo soporta.

---

### POST /api/groups
- **Descripción:** Crea un nuevo grupo.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `name` (string, requerido)
- **Respuesta (201):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Grupo 1", "members": [ ... ] }
}
```

---

### PUT /api/groups/:id
- **Descripción:** Actualiza los datos de un grupo.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `name` (string, opcional)
- **Respuesta (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Nuevo nombre" }
}
```

---

### DELETE /api/groups/:id
- **Descripción:** Elimina un grupo.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Respuesta (200):**
```json
{
  "success": true,
  "message": "Grupo eliminado."
}
```

---

## Juegos

### GET /api/games
- **Descripción:** Devuelve el catálogo de juegos.
- **Respuesta (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Catan", ... },
    ...
  ]
}
```

- **Parámetros de query:**
  - `search` (string, opcional): Buscar por nombre.
  - `page` (number, opcional): Página de resultados.
  - `limit` (number, opcional): Tamaño de página.

---

## Partidas

### GET /api/matches
- **Descripción:** Devuelve el historial de partidas del usuario.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query params:**
  - `groupId` (string, opcional): Filtrar por grupo.
  - `page`, `limit` (opcional): Paginación.
- **Respuesta (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "game": "Catan", "date": "2025-12-10", ... },
    ...
  ]
}
```

### POST /api/matches
- **Descripción:** Crea una nueva partida.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `gameId` (string, requerido)
  - `groupId` (string, requerido)
  - `players` (array, requerido)
- **Respuesta (201):**
```json
{
  "success": true,
  "data": { "_id": "...", "game": "Catan", ... }
}
```

---

## Rankings

### GET /api/rankings
- **Descripción:** Devuelve el ranking global o por grupo.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query params:**
  - `groupId` (string, opcional): Ranking de un grupo específico.
- **Respuesta (200):**
```json
{
  "success": true,
  "data": [
    { "user": "Juan", "points": 120 },
    ...
  ]
}
```

---

---

## Notas
- Todos los endpoints que requieren autenticación usan JWT en el header `Authorization`.
- Los errores devuelven siempre un objeto con `success: false` y un mensaje descriptivo.

---

**Ejemplo de uso de autenticación con curl:**
```bash
curl -H "Authorization: Bearer <token>" https://tabletopmastering.games/api/groups
```
