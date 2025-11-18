# 🎮 API de Gestión de Juegos - Documentación

## Descripción General

La API de juegos permite gestionar tanto juegos personalizados como juegos integrados desde BoardGameGeek (BGG). Soporta búsqueda, creación, edición, eliminación y sincronización con BGG.

**✨ Nuevo: Sistema de Caché MongoDB** - Los datos de BGG se cachean automáticamente durante 30 días para mejorar el rendimiento y reducir llamadas a la API externa.

## 🎯 Flujo Recomendado: Añadir Juego desde BGG

Para una mejor experiencia de usuario, sigue este flujo de 3 pasos:

### Paso 1: Búsqueda
```bash
GET /api/games/search-bgg?name=Catan
```
**Resultado:** Lista de juegos con `bggId`, `name` y `yearPublished`

### Paso 2: Preview (Vista Previa) ⭐
```bash
GET /api/games/bgg/13
```
**Resultado:** Detalles completos del juego (imagen, descripción, ratings, mecánicas, etc.)

**💡 Beneficios:**
- Ver imagen, descripción completa y valoraciones
- Confirmar que es el juego correcto antes de añadir
- Información cacheada = respuesta rápida (<100ms)
- Mejor UX para el usuario

### Paso 3: Añadir al Grupo
```bash
POST /api/games/add-from-bgg
Body: { "bggId": 13, "groupId": "...", "customNotes": "..." }
```
**Resultado:** Juego añadido a la colección del grupo

---

## Tipos de Juegos

### 1. Juegos de BGG (`source: 'bgg'`)
- Obtenidos desde la API de BoardGameGeek
- **Cacheados automáticamente en MongoDB (30 días)**
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

#### `GET /api/games/bgg/:bggId` ⭐ PREVIEW

Obtiene detalles completos de un juego específico de BGG por su ID.

**💡 Uso Recomendado:** Usar este endpoint después de la búsqueda para mostrar una vista previa completa del juego ANTES de añadirlo al grupo. Esto permite al usuario confirmar que es el juego correcto viendo la imagen, descripción, valoraciones y mecánicas.

**Autenticación:** Requerida

**URL Parameters:**
- `bggId` (number, requerido): ID del juego en BGG

**Query Parameters (opcional):**
- `forceRefresh` (boolean): Forzar actualización desde BGG ignorando caché

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

## 🗄️ Gestión de Caché de BGG

### 📊 Obtener Estadísticas de Caché

#### `GET /api/games/cache/stats`

Obtiene estadísticas del sistema de caché de BoardGameGeek.

**Autenticación:** Requerida

**Ejemplo de Request:**
```bash
GET /api/games/cache/stats
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "valid": 145,
    "expired": 5,
    "hitRate": "96.67%"
  }
}
```

**Campos de respuesta:**
- `total`: Total de entradas en caché
- `valid`: Entradas válidas (no expiradas)
- `expired`: Entradas expiradas pendientes de limpieza
- `hitRate`: Tasa de aciertos de caché

---

### 🗑️ Invalidar Caché de un Juego

#### `DELETE /api/games/cache/:bggId`

Elimina la entrada de caché para un juego específico de BGG.

**Autenticación:** Requerida

**Uso:** Útil cuando se necesita forzar actualización de un juego específico.

**URL Parameters:**
- `bggId` (number, requerido): ID del juego en BGG

**Ejemplo de Request:**
```bash
DELETE /api/games/cache/13
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Caché invalidada para el juego con bggId: 13"
}
```

---

### 🧹 Limpiar Toda la Caché

#### `DELETE /api/games/cache`

Elimina todas las entradas de caché de BGG.

**Autenticación:** Requerida

**⚠️ Precaución:** Esta operación elimina toda la caché y puede aumentar temporalmente las llamadas a la API de BGG.

**Ejemplo de Request:**
```bash
DELETE /api/games/cache
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Toda la caché de BGG ha sido limpiada exitosamente"
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

1. **Caché de BGG**: 
   - Los datos de BGG se cachean automáticamente en MongoDB durante **30 días**
   - Las consultas repetidas se sirven desde caché (mucho más rápido)
   - El caché se actualiza automáticamente al expirar o puede invalidarse manualmente
   - MongoDB limpia automáticamente las entradas expiradas (TTL index)

2. **Sincronización**: 
   - Usa `PUT /api/games/:id/sync-bgg` para forzar actualización de datos
   - Usa `DELETE /api/games/cache/:bggId` para invalidar caché y forzar nueva consulta

3. **Soft Delete**: Los juegos eliminados no se borran, solo se marcan como inactivos

4. **Permisos**: Solo miembros del grupo pueden ver/gestionar sus juegos

5. **Límites**: La paginación tiene un límite máximo de 100 elementos por página

6. **Performance**:
   - Primera consulta: ~2-5 segundos (consulta BGG + guardado en caché)
   - Consultas posteriores: <100ms (desde caché MongoDB)
   - Cache hit rate esperado: >90% en uso normal

---

## 🧪 Testing de la API

La API de juegos cuenta con una **suite completa de tests** que garantiza su correcto funcionamiento.

### Ejecutar los Tests

```bash
# Opción 1: Usando npm scripts
npm run dev:mock     # Inicia servidor con mock de BGG
npm test            # Ejecuta la suite de tests

# Opción 2: Comando directo
USE_BGG_MOCK=true ./test-games-comprehensive.sh
```

### Cobertura de Tests

La suite incluye **163 tests automatizados** organizados en 12 suites:

#### ✅ Suite 1: Búsqueda en BGG (6 tests)
- Búsqueda exitosa con nombre válido
- Búsqueda exacta activada
- Validación: parámetro 'name' requerido
- Validación: 'name' mínimo 2 caracteres
- Validación: parámetro 'exact' booleano
- Error: sin token de autenticación

#### ✅ Suite 2: Detalles de BGG (4 tests)
- Obtener detalles de juego válido (Catan ID:13)
- Error: bggId inválido (texto en lugar de número)
- Error: bggId negativo
- Error: bggId inexistente

#### ✅ Suite 3: Hot List BGG (5 tests)
- Obtener hot list con limit=5
- Obtener hot list sin especificar limit
- Error: limit mayor a 50
- Error: limit negativo
- Error: limit no numérico

#### ✅ Suite 4: Añadir desde BGG (8 tests)
- Añadir juego de BGG al grupo exitosamente
- Error: sin bggId
- Error: sin groupId
- Error: bggId inválido (negativo)
- Error: groupId con formato inválido
- Error: customNotes exceden 500 caracteres
- Error: intentar añadir juego duplicado
- Error: grupo inexistente

#### ✅ Suite 5: Crear Juego Personalizado (18 tests)
- Crear juego personalizado completo
- Crear juego con solo campos obligatorios
- Error: sin nombre de juego
- Error: nombre muy corto (1 carácter)
- Error: nombre muy largo (>150 caracteres)
- Error: sin groupId
- Error: sin minPlayers
- Error: sin maxPlayers
- Error: maxPlayers < minPlayers
- Error: minPlayers con valor 0
- Error: playingTime negativo
- Error: descripción muy larga (>2000 caracteres)
- Error: dificultad con valor inválido
- Error: yearPublished muy en el futuro
- Error: yearPublished muy antiguo (<1800)
- Error: URL de imagen inválida
- Error: categories no es un array
- Error: mechanics no es un array

#### ✅ Suite 6: Listar Juegos (12 tests)
- Listar todos los juegos del grupo
- Filtrar juegos por source=bgg
- Filtrar juegos por source=custom
- Paginación: página 1 con limit 5
- Búsqueda por texto en nombre
- Listar juegos sin especificar grupo
- Error: groupId con formato inválido
- Error: source con valor inválido
- Error: page con valor negativo
- Error: page con valor 0
- Error: limit mayor a 100
- Error: limit con valor 0

#### ✅ Suite 7: Obtener Juego Individual (4 tests)
- Obtener detalles de juego personalizado
- Obtener detalles de juego de BGG
- Error: ID con formato inválido
- Error: juego con ID inexistente

#### ✅ Suite 8: Actualizar Juego (9 tests)
- Actualizar juego personalizado
- Actualizar solo el nombre del juego
- Error: ID inválido en URL
- Error: nombre actualizado muy corto
- Error: descripción actualizada muy larga
- Error: playingTime negativo en actualización
- Error: dificultad inválida en actualización
- Error: customNotes muy largas en actualización
- Error: actualizar juego inexistente

#### ✅ Suite 9: Sincronizar con BGG (4 tests)
- Sincronizar juego de BGG exitosamente
- Error: ID inválido para sincronización
- Error: intentar sincronizar juego custom (no BGG)
- Error: sincronizar juego inexistente

#### ✅ Suite 10: Estadísticas de Grupo (3 tests)
- Obtener estadísticas del grupo
- Error: groupId con formato inválido
- Error: estadísticas de grupo inexistente

#### ✅ Suite 11: Eliminar Juego (4 tests)
- Error: ID inválido para eliminación
- Error: eliminar juego inexistente
- Eliminar juego personalizado exitosamente
- Verificar que juego eliminado no se puede obtener (soft delete)

#### ✅ Suite 12: Autenticación y Autorización (3 tests)
- Error: búsqueda sin autenticación
- Error: token inválido
- Error: acceder a juegos de grupo al que no perteneces

### Sistema de Mock de BGG

Para los tests, se utiliza un **mock del servicio de BoardGameGeek** que:

- ✅ Elimina dependencia de la API externa de BGG
- ✅ Acelera la ejecución de tests (sin latencia de red)
- ✅ Proporciona datos consistentes y predecibles
- ✅ No consume rate limits de la API de BGG
- ✅ Permite tests offline

**Activar el mock:**

```bash
# En variables de entorno
USE_BGG_MOCK=true

# O al iniciar el servidor
USE_BGG_MOCK=true npm run dev

# Los tests lo activan automáticamente
npm test
```

**Juegos incluidos en el mock:**

- **Catan** (ID: 13) - Juego clásico de estrategia
- **Gloomhaven** (ID: 174430) - Juego cooperativo complejo
- Juegos genéricos para IDs desconocidos

### Resultado Esperado

Al ejecutar la suite completa, deberías ver:

```bash
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RESUMEN DE EJECUCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

═══════════════════════════════════════════════════
  RESULTADOS DE TESTS
═══════════════════════════════════════════════════

  Total de tests:         163
  Tests exitosos:         163
  Tests fallidos:         0

╔═══════════════════════════════════════════════════╗
║                                                   ║
║       ✅ TODOS LOS TESTS PASARON! 🎉             ║
║                                                   ║
╚═══════════════════════════════════════════════════╝

  Tasa de éxito:          100%
```

### Validaciones Cubiertas

Los tests verifican:

- ✅ Autenticación JWT en todos los endpoints
- ✅ Autorización por grupo y roles
- ✅ Validación de parámetros de entrada (express-validator)
- ✅ Manejo de errores y casos edge
- ✅ Códigos de estado HTTP correctos
- ✅ Estructura de respuestas JSON
- ✅ Soft delete funcional
- ✅ Prevención de duplicados
- ✅ Límites y rangos de valores
- ✅ Tipos de datos correctos
- ✅ Longitudes de strings
- ✅ URLs y formatos válidos

### Troubleshooting de Tests

**Error: "Servidor no disponible"**
```bash
# Asegúrate de que MongoDB esté corriendo
sudo systemctl start mongodb

# Inicia el servidor antes de los tests
USE_BGG_MOCK=true npm run dev
```

**Error: "Puerto 3000 en uso"**
```bash
# Encuentra y detén el proceso
lsof -ti:3000 | xargs kill -9

# O usa otro puerto
PORT=3001 npm run dev
```

**Tests fallan por timeout**
```bash
# Aumenta el timeout en el script de tests
# O verifica la conexión a MongoDB
```

### Ejemplo de Test Individual

Si quieres probar manualmente un endpoint:

```bash
# 1. Inicia el servidor con mock
USE_BGG_MOCK=true npm run dev

# 2. Registra un usuario y obtén token
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"12345678"}'

# 3. Usa el token para buscar en BGG
curl -X GET "http://localhost:3000/api/games/search-bgg?name=Catan" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Deberías ver resultados del mock
{
  "success": true,
  "data": [...]
}
```

---

## 📖 Ejemplos de Uso Completos

### Ejemplo 1: Flujo Completo - Añadir Juego desde BGG (Recomendado)

```bash
# Paso 1: Buscar juego
curl -X GET "http://localhost:3000/api/games/search-bgg?name=Wingspan" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Respuesta: Lista de juegos con bggId
# { "success": true, "data": [{ "bggId": 266192, "name": "Wingspan", ... }] }

# Paso 2: Ver preview completo del juego seleccionado
curl -X GET "http://localhost:3000/api/games/bgg/266192" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Respuesta: Detalles completos (imagen, descripción, ratings, mecánicas)
# { "success": true, "data": { "bggId": 266192, "name": "Wingspan", 
#   "image": "https://...", "description": "...", "rating": {...}, ... } }

# Paso 3: Usuario confirma → Añadir al grupo
curl -X POST "http://localhost:3000/api/games/add-from-bgg" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bggId": 266192,
    "groupId": "507f1f77bcf86cd799439011",
    "customNotes": "Recomendado por Ana"
  }'

# Respuesta: Juego añadido exitosamente
# { "success": true, "message": "Juego añadido desde BGG exitosamente", ... }
```

**💡 Ventajas de este flujo:**
- Usuario ve la imagen y descripción antes de añadir
- Confirma que es el juego correcto (evita errores)
- Caché hace que el paso 2 sea muy rápido (<100ms)
- Mejor experiencia de usuario

### Ejemplo 2: Crear Juego Personalizado

```bash
curl -X POST "http://localhost:3000/api/games" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Expansión Homebrew",
    "description": "Expansión creada por el grupo",
    "groupId": "507f1f77bcf86cd799439011",
    "minPlayers": 2,
    "maxPlayers": 4,
    "playingTime": 60,
    "difficulty": "medio",
    "categories": ["Estrategia"],
    "customNotes": "En fase de prueba"
  }'
```

### Ejemplo 3: Sincronizar Juego de BGG

```bash
# Actualizar datos desde BGG (ignorar caché)
curl -X PATCH "http://localhost:3000/api/games/507f1f77bcf86cd799439011/sync-bgg" \
  -H "Authorization: Bearer YOUR_TOKEN"

# El juego se actualiza con los datos más recientes de BGG
```

### Ejemplo 4: Gestión de Caché

```bash
# Ver estadísticas del caché
curl -X GET "http://localhost:3000/api/games/cache/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Invalidar caché de un juego específico
curl -X DELETE "http://localhost:3000/api/games/cache/266192" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Limpiar todo el caché (uso con precaución)
curl -X DELETE "http://localhost:3000/api/games/cache" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Mejores Prácticas

### Frontend - Implementación del Flujo con Preview

```javascript
// ✅ RECOMENDADO: Flujo con preview
async function addGameFromBGG() {
  // 1. Usuario busca
  const searchResults = await fetch('/api/games/search-bgg?name=Wingspan');
  
  // 2. Usuario selecciona un juego → Mostrar preview
  const gamePreview = await fetch(`/api/games/bgg/${selectedBggId}`);
  // Mostrar modal/card con: imagen, descripción, ratings, mecánicas
  
  // 3. Usuario confirma → Añadir al grupo
  const result = await fetch('/api/games/add-from-bgg', {
    method: 'POST',
    body: JSON.stringify({ 
      bggId: selectedBggId, 
      groupId: currentGroupId,
      customNotes: userNotes
    })
  });
}

// ❌ NO RECOMENDADO: Añadir directamente sin preview
async function addGameDirectly() {
  const searchResults = await fetch('/api/games/search-bgg?name=Wingspan');
  // Usuario selecciona → Añadir directamente (sin ver detalles)
  await fetch('/api/games/add-from-bgg', { 
    body: JSON.stringify({ bggId: selectedBggId }) 
  });
  // Problema: Usuario no vio la imagen ni confirmó que es el juego correcto
}
```

### Optimización de Rendimiento

```javascript
// Usar debounce en búsqueda para evitar llamadas excesivas
const debouncedSearch = debounce((query) => {
  fetch(`/api/games/search-bgg?name=${query}`);
}, 300); // Esperar 300ms después de que el usuario deje de escribir

// Precargar preview cuando el usuario hace hover sobre un resultado
function preloadGamePreview(bggId) {
  fetch(`/api/games/bgg/${bggId}`); // Caché en el navegador
}
```

---

## 📝 Notas Finales
  "count": 1,
  "data": [
    {
      "bggId": 13,
      "name": "Catan",
      "yearPublished": 1995
    }
  ]
}
```

---

## 📚 Recursos Adicionales

- [Documentación de Express Validator](https://express-validator.github.io/docs/)
- [API de BoardGameGeek XML](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/) - Decodificar y verificar tokens

---

## 🤝 Contribuir

Si encuentras algún bug o tienes sugerencias:

1. Ejecuta la suite de tests para verificar
2. Reporta el issue con los logs completos
3. Si propones cambios, asegúrate de que todos los tests pasen

```bash
# Antes de hacer commit
npm run lint        # Verifica el código
npm test           # Ejecuta todos los tests
```
