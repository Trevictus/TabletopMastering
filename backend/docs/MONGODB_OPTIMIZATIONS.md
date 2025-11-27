# Optimizaciones de MongoDB - Backend TabletopMastering

## Resumen de Cambios

Este documento detalla las optimizaciones realizadas para mejorar el rendimiento de las consultas a MongoDB.

---

## 1. Índices Optimizados

### Match (Partidas)
```javascript
matchSchema.index({ group: 1, scheduledDate: -1 });      // Partidas por grupo ordenadas por fecha
matchSchema.index({ group: 1, status: 1, scheduledDate: -1 }); // Filtrar por grupo+estado+fecha
matchSchema.index({ game: 1, status: 1 });               // Estadísticas por juego
matchSchema.index({ 'players.user': 1, status: 1 });     // Partidas de un usuario por estado
matchSchema.index({ createdBy: 1, createdAt: -1 });      // Partidas creadas por usuario
matchSchema.index({ status: 1, scheduledDate: 1 });      // Próximas partidas programadas
matchSchema.index({ winner: 1 }, { sparse: true });      // Consultas de ganadores
```

### User (Usuarios)
```javascript
userSchema.index({ 'stats.totalPoints': -1 });           // Ranking global por puntos
userSchema.index({ groups: 1, 'stats.totalPoints': -1 }); // Ranking por grupo
userSchema.index({ isActive: 1, 'stats.totalPoints': -1 }); // Ranking de usuarios activos
userSchema.index({ 'stats.totalWins': -1 });             // Ranking por victorias
userSchema.index({ createdAt: -1 });                     // Usuarios más recientes
userSchema.index({ name: 'text' });                      // Búsqueda de texto en nombre
```

### Group (Grupos)
```javascript
groupSchema.index({ inviteCode: 1 }, { unique: true });  // Búsqueda por código de invitación
groupSchema.index({ admin: 1 });                         // Grupos de un administrador
groupSchema.index({ 'members.user': 1 });                // Búsqueda de grupos por miembro
groupSchema.index({ isActive: 1, createdAt: -1 });       // Listar grupos activos ordenados
groupSchema.index({ 'members.user': 1, isActive: 1 });   // Índice compuesto para grupos activos
groupSchema.index({ name: 'text', description: 'text' }); // Búsqueda de texto
groupSchema.index({ 'stats.totalMatches': -1 });         // Grupos más activos
```

### Game (Juegos)
```javascript
gameSchema.index({ name: 'text', description: 'text' }); // Búsqueda de texto completo
gameSchema.index({ group: 1, name: 1 });                 // Juegos por grupo ordenados
gameSchema.index({ group: 1, isActive: 1, createdAt: -1 }); // Juegos activos de grupo
gameSchema.index({ bggId: 1 }, { sparse: true });        // Búsqueda por ID de BGG
gameSchema.index({ source: 1, isActive: 1 });            // Filtrar por fuente
gameSchema.index({ 'rating.average': -1, isActive: 1 }); // Top rated
gameSchema.index({ addedBy: 1, group: 1, isActive: 1 }); // Juegos personales vs grupo
gameSchema.index({ 'stats.timesPlayed': -1, isActive: 1 }); // Juegos más jugados
gameSchema.index({ categories: 1 });                      // Filtrar por categoría
gameSchema.index({ minPlayers: 1, maxPlayers: 1 });      // Filtrar por número de jugadores
```

---

## 2. Optimizaciones de Consultas

### Uso de `.lean()`
- Devuelve objetos JavaScript planos en lugar de documentos Mongoose
- **Beneficio**: 2-5x más rápido para consultas de solo lectura
- Aplicado en: `matchService`, `rankingService`, `gameService`, `bggGameService`

### Uso de `.select()` (Proyecciones)
- Solo carga los campos necesarios de cada documento
- **Beneficio**: Reduce transferencia de datos y uso de memoria

Ejemplo:
```javascript
// Antes
const group = await Group.findById(groupId);

// Después (optimizado)
const group = await Group.findById(groupId)
  .select('members')
  .lean();
```

### Consultas en Paralelo con `Promise.all()`
```javascript
// Antes (secuencial)
const matches = await Match.find(filter)...;
const total = await Match.countDocuments(filter);

// Después (paralelo)
const [matches, total] = await Promise.all([
  Match.find(filter)...,
  Match.countDocuments(filter)
]);
```

### Operaciones Atómicas
```javascript
// Antes
const user = await User.findById(userId);
user.stats.totalPoints += points;
await user.save();

// Después (atómico)
await User.findByIdAndUpdate(userId, {
  $inc: { 'stats.totalPoints': points }
});
```

### Uso de `exists()` en lugar de `findOne()`
```javascript
// Antes
const existingGroup = await Group.findOne({ inviteCode });
if (!existingGroup) { ... }

// Después (más eficiente)
const exists = await Group.exists({ inviteCode });
if (!exists) { ... }
```

### Agregaciones Optimizadas con `$facet`
```javascript
// Antes: 6 consultas separadas
const totalGames = await Game.countDocuments(...);
const bggGames = await Game.countDocuments(...);
const topRated = await Game.find(...);
// ...

// Después: 1 sola agregación
const stats = await Game.aggregate([
  { $match: { group: groupId, isActive: true } },
  {
    $facet: {
      totals: [...],
      topRated: [...],
      mostPlayed: [...],
      categories: [...]
    }
  }
]);
```

---

## 3. Populate Optimizado

### Proyecciones en Populate
```javascript
// Antes
.populate('game')
.populate('players.user')

// Después
.populate({ path: 'game', select: 'name image -_id', options: { lean: true } })
.populate({ path: 'players.user', select: 'name avatar -_id', options: { lean: true } })
```

### Constantes de Populate Reutilizables
```javascript
const MATCH_POPULATE_LIST = [
  { path: 'game', select: 'name image -_id', options: { lean: true } },
  { path: 'group', select: 'name -_id', options: { lean: true } },
  { path: 'players.user', select: 'name avatar -_id', options: { lean: true } },
  { path: 'createdBy', select: 'name -_id', options: { lean: true } },
];
```

---

## 4. Scripts de Verificación

### Verificar Índices
```bash
docker exec -it tabletop-backend node scripts/verify-indexes.js
```

### Benchmark de Consultas
```bash
docker exec -it tabletop-backend node scripts/benchmark-queries.js
```

---

## 5. Impacto Esperado

| Optimización | Mejora Esperada |
|--------------|-----------------|
| Índices compuestos | 10-100x en queries filtradas |
| `.lean()` | 2-5x en consultas de lectura |
| Proyecciones | 20-50% menos transferencia |
| `Promise.all()` | 2x en consultas independientes |
| Operaciones atómicas | Más seguro y eficiente |
| Agregaciones $facet | N consultas → 1 consulta |

---

## 6. Buenas Prácticas

1. **Siempre usar `.lean()`** cuando no se necesite modificar documentos
2. **Siempre usar `.select()`** para limitar campos devueltos
3. **Usar índices compuestos** para queries frecuentes con múltiples filtros
4. **Usar `sparse: true`** en índices de campos opcionales
5. **Preferir operaciones atómicas** (`$inc`, `$set`, `$push`) sobre `save()`
6. **Usar `exists()`** en lugar de `findOne()` para verificaciones
7. **Paralelizar consultas independientes** con `Promise.all()`
8. **Usar agregaciones `$facet`** para múltiples estadísticas en una query
