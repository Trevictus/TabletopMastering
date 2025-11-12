# 🎮 Módulo de Gestión de Juegos

## Descripción

Módulo completo de gestión de juegos de mesa con integración a BoardGameGeek (BGG). Soporta tanto juegos personalizados creados por usuarios como juegos importados desde la base de datos de BGG.

## 🌟 Características

### Integración con BGG
- ✅ Búsqueda de juegos en BoardGameGeek
- ✅ Importación automática de datos completos
- ✅ Sincronización periódica (cache de 30 días)
- ✅ Hot List de juegos populares
- ✅ Validación de IDs de BGG

### Gestión de Juegos
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Juegos personalizados por grupo
- ✅ Juegos de BGG globales o por grupo
- ✅ Búsqueda y filtrado avanzado
- ✅ Paginación
- ✅ Estadísticas por grupo

### Campos de Información
- 📝 Nombre, descripción, imágenes
- 👥 Número de jugadores (min/max)
- ⏱️ Duración (min/max/promedio)
- 🏷️ Categorías y mecánicas
- 🎯 Dificultad
- 📅 Año de publicación
- 👤 Diseñadores y editores
- ⭐ Ratings de BGG
- 📊 Estadísticas de uso

## 📁 Estructura de Archivos

```
backend/
├── models/
│   └── Game.js                    # Modelo Mongoose con validaciones
├── controllers/
│   └── gameController.js          # Lógica de negocio (13 endpoints)
├── routes/
│   └── gameRoutes.js              # Definición de rutas
├── services/
│   └── bggService.js              # Servicio de integración con BGG
├── middlewares/
│   └── gameValidator.js           # Validaciones de requests
├── GAMES_API_DOCS.md              # Documentación completa de la API
└── test-games-api.sh              # Script de pruebas automatizadas
```

## 🔧 Instalación

Las dependencias ya están instaladas. Se añadieron:

```json
{
  "axios": "^1.x.x",      // Cliente HTTP para BGG API
  "xml2js": "^0.x.x"      // Parser XML -> JSON
}
```

## 🚀 Uso Rápido

### 1. Iniciar el servidor

```bash
cd backend
npm run dev
```

### 2. Ejecutar pruebas

```bash
./test-games-api.sh
```

Este script prueba automáticamente:
- ✅ Autenticación
- ✅ Creación de grupo
- ✅ Búsqueda en BGG
- ✅ Importación desde BGG
- ✅ Creación de juegos personalizados
- ✅ Listado y filtrado
- ✅ Actualización y sincronización
- ✅ Estadísticas

## 📚 API Endpoints

### Búsqueda y BGG

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/games/search-bgg?name=` | Buscar en BGG |
| GET | `/api/games/bgg/:bggId` | Detalles de BGG |
| GET | `/api/games/bgg/hot` | Hot List |

### Gestión de Juegos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/games/add-from-bgg` | Añadir de BGG |
| POST | `/api/games` | Crear personalizado |
| GET | `/api/games` | Listar con filtros |
| GET | `/api/games/:id` | Obtener detalle |
| PUT | `/api/games/:id` | Actualizar |
| PUT | `/api/games/:id/sync-bgg` | Sincronizar BGG |
| DELETE | `/api/games/:id` | Eliminar (soft) |
| GET | `/api/games/stats/:groupId` | Estadísticas |

📖 **Documentación completa:** [GAMES_API_DOCS.md](./GAMES_API_DOCS.md)

## 🔐 Autenticación

Todos los endpoints requieren autenticación JWT:

```bash
Authorization: Bearer {token}
```

## 🎯 Ejemplos de Uso

### Buscar y añadir un juego de BGG

```bash
# 1. Buscar en BGG
curl -X GET "http://localhost:3000/api/games/search-bgg?name=Wingspan" \
  -H "Authorization: Bearer {token}"

# Respuesta: bggId = 266192

# 2. Añadir al grupo
curl -X POST "http://localhost:3000/api/games/add-from-bgg" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "bggId": 266192,
    "groupId": "507f1f77bcf86cd799439011",
    "customNotes": "Juego recomendado"
  }'
```

### Crear juego personalizado

```bash
curl -X POST "http://localhost:3000/api/games" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Juego Custom",
    "groupId": "507f1f77bcf86cd799439011",
    "minPlayers": 2,
    "maxPlayers": 4,
    "playingTime": 60,
    "categories": ["Estrategia"],
    "difficulty": "medio"
  }'
```

### Listar juegos del grupo

```bash
curl -X GET "http://localhost:3000/api/games?groupId=507f1f77bcf86cd799439011&page=1&limit=20" \
  -H "Authorization: Bearer {token}"
```

## 🗄️ Modelo de Datos

### Campos Principales

```javascript
{
  // Información básica
  name: String (requerido, 2-150 caracteres),
  description: String (max 2000 caracteres),
  image: String (URL),
  thumbnail: String (URL),
  
  // Jugadores y tiempo
  minPlayers: Number (requerido, ≥1),
  maxPlayers: Number (requerido, ≥minPlayers),
  playingTime: Number,
  minPlayTime: Number,
  maxPlayTime: Number,
  
  // Clasificación
  categories: [String],
  mechanics: [String],
  difficulty: String ('fácil', 'medio', 'difícil', 'experto'),
  
  // Metadatos
  source: String ('bgg' | 'custom', requerido),
  bggId: Number (opcional, solo BGG),
  yearPublished: Number,
  designer: [String],
  publisher: [String],
  
  // Ratings (solo BGG)
  rating: {
    average: Number (0-10),
    usersRated: Number,
    bayesAverage: Number
  },
  
  // Asociaciones
  group: ObjectId (requerido para custom),
  addedBy: ObjectId (requerido),
  
  // Uso
  stats: {
    timesPlayed: Number,
    lastPlayed: Date
  },
  
  // Sistema
  customNotes: String (max 500),
  bggLastSync: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Tipos de Juegos

### 1. Juegos BGG (`source: 'bgg'`)

**Características:**
- Importados desde BoardGameGeek
- Datos completos automáticos
- Sincronización disponible
- Pueden ser globales o por grupo
- Edición limitada (solo campos personalizados)

**Campos editables:**
- `customNotes`
- `difficulty`
- `image` (personalización)

### 2. Juegos Personalizados (`source: 'custom'`)

**Características:**
- Creados manualmente
- Siempre asociados a un grupo
- Edición completa
- Sin sincronización BGG

**Campos editables:**
- Todos los campos principales

## 🔄 Sistema de Caché

Los juegos de BGG se cachean localmente:

- **Duración:** 30 días
- **Verificación:** Método `needsBGGUpdate()`
- **Sincronización manual:** Endpoint `/sync-bgg`
- **Timestamp:** Campo `bggLastSync`

```javascript
// Verificar si necesita actualización
if (game.needsBGGUpdate()) {
  // Sincronizar con BGG
}
```

## 🔒 Permisos

### Ver juegos
- ✅ Miembros del grupo (juegos del grupo)
- ✅ Cualquier usuario autenticado (juegos globales BGG)

### Crear juegos
- ✅ Miembros del grupo

### Editar juegos
- ✅ Admin del grupo
- ✅ Usuario que añadió el juego

### Eliminar juegos
- ✅ Admin del grupo
- ✅ Usuario que añadió el juego

## 📊 Estadísticas

El endpoint de estadísticas proporciona:

```javascript
{
  total: Number,              // Total de juegos
  bySource: {                 // Por fuente
    bgg: Number,
    custom: Number
  },
  topRated: [Game],           // Top 5 mejor valorados
  mostPlayed: [Game],         // Top 5 más jugados
  topCategories: [            // Top 10 categorías
    { name: String, count: Number }
  ]
}
```

## 🧪 Testing

### Script automatizado

```bash
./test-games-api.sh
```

Prueba todos los endpoints y funcionalidades.

### Pruebas manuales

Ver colección Thunder Client en `.vscode/thunder-tests/`

### Casos de prueba cubiertos

1. ✅ Búsqueda en BGG
2. ✅ Obtener detalles BGG
3. ✅ Hot List
4. ✅ Añadir desde BGG
5. ✅ Crear personalizado
6. ✅ Listar con filtros
7. ✅ Paginación
8. ✅ Obtener detalle
9. ✅ Actualizar (BGG y custom)
10. ✅ Sincronizar BGG
11. ✅ Eliminar (soft delete)
12. ✅ Estadísticas
13. ✅ Validaciones
14. ✅ Permisos

## 🐛 Manejo de Errores

### Errores comunes

| Código | Error | Solución |
|--------|-------|----------|
| 400 | Parámetros inválidos | Verificar formato de datos |
| 401 | No autenticado | Incluir token válido |
| 403 | Sin permisos | Verificar membresía del grupo |
| 404 | No encontrado | Verificar IDs |
| 500 | Error BGG API | Reintentar, BGG puede estar lento |

### Ejemplo de respuesta de error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "minPlayers",
      "message": "Debe haber al menos 1 jugador"
    }
  ]
}
```

## 📈 Rendimiento

### Optimizaciones implementadas

- ✅ Índices en MongoDB para búsquedas
- ✅ Paginación en listados
- ✅ Caché de juegos BGG (30 días)
- ✅ Populate selectivo
- ✅ Timeout en requests a BGG (10s)

### Índices MongoDB

```javascript
// Búsqueda de texto
{ name: 'text', description: 'text' }

// Búsquedas por grupo
{ group: 1, name: 1 }

// Búsquedas por BGG ID
{ bggId: 1 } // sparse

// Filtros
{ source: 1 }
{ 'rating.average': -1 }
```

## 🔮 Futuras Mejoras

- [ ] Importación masiva desde colección BGG
- [ ] Recomendaciones basadas en preferencias
- [ ] Integración con sistema de partidas
- [ ] Wishlist de juegos
- [ ] Valoraciones personales
- [ ] Expansiones y versiones
- [ ] Marketplace entre grupos
- [ ] Exportar colección a CSV/PDF

## 🤝 Integración con otros módulos

### Grupos
- Los juegos custom pertenecen a grupos
- Verificación de membresía
- Estadísticas por grupo

### Usuarios
- Campo `addedBy` registra creador
- Permisos basados en rol

### Partidas (futuro)
- Relación con `Match` model
- Estadísticas de uso
- Campo `stats.timesPlayed`

## 📞 Soporte

Para problemas o dudas:
1. Revisar [GAMES_API_DOCS.md](./GAMES_API_DOCS.md)
2. Ejecutar script de pruebas
3. Verificar logs del servidor
4. Consultar documentación de BGG API

## 📝 Notas Importantes

1. **BGG API puede ser lenta:** Espera 5-10 segundos en primera búsqueda
2. **Soft Delete:** Los juegos eliminados no se borran, solo se ocultan
3. **Cache:** Los datos de BGG se almacenan localmente para performance
4. **Permisos:** Solo miembros del grupo acceden a sus juegos
5. **Validaciones:** Todos los inputs están validados

---

**Estado:** ✅ Completamente funcional  
**Versión:** 1.0.0  
**Última actualización:** 11 de noviembre de 2025
