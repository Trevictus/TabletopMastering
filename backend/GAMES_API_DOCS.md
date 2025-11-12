# 🎮 API de Gestión de Juegos - Documentación

## Descripción General

La API de juegos permite gestionar tanto juegos personalizados como juegos integrados desde BoardGameGeek (BGG). Soporta búsqueda, creación, edición, eliminación y sincronización con BGG.

## Tipos de Juegos

### 1. Juegos de BGG (`source: 'bgg'`)
- Obtenidos desde la API de BoardGameGeek
- Información actualizable mediante sincronización
- Pueden ser globales (sin grupo) o añadidos a grupos específicos
- Edición limitada a campos personalizados

### 2. Juegos Personalizados (`source: 'custom'`)
- Creados manualmente por usuarios
- Siempre asociados a un grupo
- Edición completa de todos los campos

---

## Endpoints

### 🔍 Búsqueda en BGG

#### `GET /api/games/search-bgg`

Busca juegos en BoardGameGeek sin guardarlos en la base de datos.

**Autenticación:** Requerida

**Query Parameters:**
- `name` (string, requerido): Término de búsqueda
- `exact` (boolean, opcional): Búsqueda exacta (true/false)

**Ejemplo de Request:**
```bash
GET /api/games/search-bgg?name=Catan&exact=false
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "bggId": 13,
      "name": "Catan",
      "yearPublished": 1995
    },
    {
      "bggId": 278,
      "name": "Catan: Cities & Knights",
      "yearPublished": 1998
    }
  ]
}
```

---

#### `GET /api/games/bgg/:bggId`

Obtiene detalles completos de un juego específico de BGG por su ID.

**Autenticación:** Requerida

**URL Parameters:**
- `bggId` (number, requerido): ID del juego en BGG

**Ejemplo de Request:**
```bash
GET /api/games/bgg/13
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "bggId": 13,
    "name": "Catan",
    "description": "In Catan, players try to be the dominant force...",
    "image": "https://cf.geekdo-images.com/...",
    "thumbnail": "https://cf.geekdo-images.com/...",
    "yearPublished": 1995,
    "minPlayers": 3,
    "maxPlayers": 4,
    "playingTime": 120,
    "minPlayTime": 60,
    "maxPlayTime": 120,
    "categories": ["Negotiation", "Economic"],
    "mechanics": ["Dice Rolling", "Trading"],
    "designer": ["Klaus Teuber"],
    "publisher": ["Kosmos"],
    "rating": {
      "average": 7.2,
      "usersRated": 95000,
      "bayesAverage": 7.1
    },
    "source": "bgg",
    "bggLastSync": "2025-11-11T10:30:00.000Z"
  }
}
```

---

#### `GET /api/games/bgg/hot`

Obtiene la lista de juegos más populares de BGG (Hot List).

**Autenticación:** Requerida

**Query Parameters:**
- `limit` (number, opcional): Número de juegos a obtener (1-50, default: 10)

**Ejemplo de Request:**
```bash
GET /api/games/bgg/hot?limit=5
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "bggId": 342942,
      "rank": 1,
      "name": "Ark Nova",
      "yearPublished": 2021,
      "thumbnail": "https://..."
    }
  ]
}
```

---

### ➕ Añadir Juego desde BGG

#### `POST /api/games/add-from-bgg`

Añade un juego de BGG a la colección de un grupo.

**Autenticación:** Requerida

**Body Parameters:**
```json
{
  "bggId": 13,
  "groupId": "507f1f77bcf86cd799439011",
  "customNotes": "Juego favorito del grupo"
}
```

**Campos:**
- `bggId` (number, requerido): ID del juego en BGG
- `groupId` (string, requerido): ID del grupo
- `customNotes` (string, opcional): Notas personalizadas (max 500 caracteres)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Juego añadido desde BGG exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bggId": 13,
    "name": "Catan",
    "source": "bgg",
    "group": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Grupo de Juegos"
    },
    "addedBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "customNotes": "Juego favorito del grupo",
    "createdAt": "2025-11-11T10:30:00.000Z"
  }
}
```

---

### 🎲 Crear Juego Personalizado

#### `POST /api/games`

Crea un juego personalizado asociado a un grupo.

**Autenticación:** Requerida

**Body Parameters:**
```json
{
  "name": "Mi Juego Custom",
  "description": "Descripción del juego",
  "groupId": "507f1f77bcf86cd799439011",
  "minPlayers": 2,
  "maxPlayers": 6,
  "playingTime": 90,
  "categories": ["Estrategia", "Familiar"],
  "mechanics": ["Gestión de mano", "Construcción de mazos"],
  "difficulty": "medio",
  "yearPublished": 2023,
  "image": "https://example.com/image.jpg",
  "customNotes": "Prototipo del grupo"
}
```

**Campos requeridos:**
- `name` (string): Nombre del juego (2-150 caracteres)
- `groupId` (string): ID del grupo
- `minPlayers` (number): Número mínimo de jugadores (≥1)
- `maxPlayers` (number): Número máximo de jugadores (≥minPlayers)

**Campos opcionales:**
- `description` (string): Descripción (max 2000 caracteres)
- `playingTime` (number): Duración en minutos
- `categories` (array): Categorías del juego
- `mechanics` (array): Mecánicas del juego
- `difficulty` (string): 'fácil', 'medio', 'difícil', 'experto'
- `yearPublished` (number): Año de publicación
- `image` (string): URL de la imagen
- `customNotes` (string): Notas personalizadas

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Juego personalizado creado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Mi Juego Custom",
    "source": "custom",
    "group": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Grupo de Juegos"
    },
    "addedBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Juan Pérez"
    }
  }
}
```

---

### 📋 Listar Juegos

#### `GET /api/games`

Lista juegos con filtros y paginación.

**Autenticación:** Requerida

**Query Parameters:**
- `groupId` (string, opcional): Filtrar por grupo
- `source` (string, opcional): Filtrar por fuente ('bgg' o 'custom')
- `search` (string, opcional): Búsqueda por texto
- `page` (number, opcional): Página (default: 1)
- `limit` (number, opcional): Límite por página (1-100, default: 20)

**Comportamiento:**
- Sin `groupId`: Devuelve solo juegos globales de BGG
- Con `groupId`: Devuelve juegos del grupo (requiere ser miembro)

**Ejemplos de Request:**

```bash
# Listar juegos de un grupo
GET /api/games?groupId=507f1f77bcf86cd799439011&page=1&limit=20
Authorization: Bearer {token}

# Buscar juegos por nombre
GET /api/games?groupId=507f1f77bcf86cd799439011&search=Catan
Authorization: Bearer {token}

# Filtrar solo juegos de BGG
GET /api/games?groupId=507f1f77bcf86cd799439011&source=bgg
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 15,
  "total": 45,
  "pages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Catan",
      "source": "bgg",
      "bggId": 13,
      "image": "https://...",
      "minPlayers": 3,
      "maxPlayers": 4,
      "playingTime": 120,
      "rating": {
        "average": 7.2
      },
      "group": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Grupo de Juegos"
      },
      "addedBy": {
        "name": "Juan Pérez"
      },
      "createdAt": "2025-11-11T10:30:00.000Z"
    }
  ]
}
```

---

### 🔍 Obtener Juego por ID

#### `GET /api/games/:id`

Obtiene los detalles completos de un juego específico.

**Autenticación:** Requerida

**URL Parameters:**
- `id` (string, requerido): ID del juego

**Ejemplo de Request:**
```bash
GET /api/games/507f1f77bcf86cd799439013
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Catan",
    "description": "...",
    "source": "bgg",
    "bggId": 13,
    "image": "https://...",
    "minPlayers": 3,
    "maxPlayers": 4,
    "playingTime": 120,
    "categories": ["Negotiation", "Economic"],
    "rating": {
      "average": 7.2,
      "usersRated": 95000
    },
    "group": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Grupo de Juegos",
      "avatar": "https://..."
    },
    "addedBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "avatar": "https://..."
    },
    "stats": {
      "timesPlayed": 5,
      "lastPlayed": "2025-11-01T18:00:00.000Z"
    },
    "createdAt": "2025-11-11T10:30:00.000Z"
  }
}
```

---

### ✏️ Actualizar Juego

#### `PUT /api/games/:id`

Actualiza un juego existente.

**Autenticación:** Requerida

**Permisos:**
- Admin del grupo o usuario que añadió el juego

**Campos editables:**

**Juegos BGG** (solo campos personalizados):
- `customNotes`
- `difficulty`
- `image`

**Juegos Custom** (todos los campos):
- `name`, `description`, `image`
- `minPlayers`, `maxPlayers`, `playingTime`
- `categories`, `mechanics`, `difficulty`
- `yearPublished`, `customNotes`

**Ejemplo de Request:**
```bash
PUT /api/games/507f1f77bcf86cd799439013
Authorization: Bearer {token}
Content-Type: application/json

{
  "customNotes": "Juego actualizado con expansión",
  "difficulty": "difícil"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Juego actualizado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Catan",
    "customNotes": "Juego actualizado con expansión",
    "difficulty": "difícil"
  }
}
```

---

### 🔄 Sincronizar Juego de BGG

#### `PUT /api/games/:id/sync-bgg`

Actualiza la información de un juego de BGG obteniendo los datos más recientes.

**Autenticación:** Requerida

**Nota:** Solo funciona con juegos de BGG (`source: 'bgg'`)

**Ejemplo de Request:**
```bash
PUT /api/games/507f1f77bcf86cd799439013/sync-bgg
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Juego sincronizado con BGG exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Catan (actualizado)",
    "rating": {
      "average": 7.3,
      "usersRated": 96000
    },
    "bggLastSync": "2025-11-11T12:00:00.000Z"
  }
}
```

---

### 🗑️ Eliminar Juego

#### `DELETE /api/games/:id`

Elimina un juego (soft delete - marca como inactivo).

**Autenticación:** Requerida

**Permisos:**
- Admin del grupo o usuario que añadió el juego

**Ejemplo de Request:**
```bash
DELETE /api/games/507f1f77bcf86cd799439013
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Juego eliminado exitosamente",
  "data": {}
}
```

---

### 📊 Estadísticas de Juegos del Grupo

#### `GET /api/games/stats/:groupId`

Obtiene estadísticas de los juegos de un grupo.

**Autenticación:** Requerida

**URL Parameters:**
- `groupId` (string, requerido): ID del grupo

**Ejemplo de Request:**
```bash
GET /api/games/stats/507f1f77bcf86cd799439011
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "bySource": {
      "bgg": 18,
      "custom": 7
    },
    "topRated": [
      {
        "_id": "...",
        "name": "Gloomhaven",
        "rating": { "average": 8.8 },
        "image": "https://..."
      }
    ],
    "mostPlayed": [
      {
        "_id": "...",
        "name": "Catan",
        "stats": { "timesPlayed": 15 },
        "image": "https://..."
      }
    ],
    "topCategories": [
      { "name": "Strategy", "count": 12 },
      { "name": "Economic", "count": 8 }
    ]
  }
}
```

---

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error en los parámetros enviados
- **401 Unauthorized**: Token inválido o no proporcionado
- **403 Forbidden**: Sin permisos para la operación
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

---

## Ejemplos de Uso Completo

### Flujo: Añadir un juego de BGG a un grupo

```bash
# 1. Buscar el juego en BGG
GET /api/games/search-bgg?name=Wingspan
Authorization: Bearer {token}

# Respuesta: bggId = 266192

# 2. Ver detalles completos (opcional)
GET /api/games/bgg/266192
Authorization: Bearer {token}

# 3. Añadir al grupo
POST /api/games/add-from-bgg
Authorization: Bearer {token}
Content-Type: application/json

{
  "bggId": 266192,
  "groupId": "507f1f77bcf86cd799439011",
  "customNotes": "Juego recomendado por María"
}

# 4. Verificar que se añadió
GET /api/games?groupId=507f1f77bcf86cd799439011&search=Wingspan
Authorization: Bearer {token}
```

### Flujo: Crear y gestionar un juego personalizado

```bash
# 1. Crear juego custom
POST /api/games
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mi Juego de Cartas",
  "description": "Juego creado por el grupo",
  "groupId": "507f1f77bcf86cd799439011",
  "minPlayers": 2,
  "maxPlayers": 4,
  "playingTime": 30,
  "categories": ["Cartas", "Familiar"],
  "difficulty": "fácil"
}

# 2. Editar el juego
PUT /api/games/507f1f77bcf86cd799439013
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Actualizado con nuevas reglas",
  "playingTime": 45
}

# 3. Ver estadísticas del grupo
GET /api/games/stats/507f1f77bcf86cd799439011
Authorization: Bearer {token}
```

---

## Notas Importantes

1. **Caché de BGG**: Los juegos de BGG se cachean localmente durante 30 días
2. **Sincronización**: Usa el endpoint de sincronización para actualizar datos
3. **Soft Delete**: Los juegos eliminados no se borran, solo se marcan como inactivos
4. **Permisos**: Solo miembros del grupo pueden ver/gestionar sus juegos
5. **Límites**: La paginación tiene un límite máximo de 100 elementos por página
