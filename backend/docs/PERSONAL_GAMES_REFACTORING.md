# Refactorización: Juegos Personales y de Grupo

## 📋 Resumen

Refactorización para permitir que usuarios creen juegos **sin necesidad de estar en un grupo**. Los juegos personales (`group = null`) son independientes. Al unirse a grupos, los miembros ven la colección compartida sin duplicados.

**Status:** ✅ 26/26 tests pasando

---

## 🎯 Cambio Principal

| Antes | Después |
|-------|---------|
| Usuarios **debían estar en grupo** para agregar juegos | Usuarios crean juegos **personales** (sin grupo) |
| `group` requerido | `group` opcional (`default: null`) |
| Sin colecciones personales | Juegos personales vs de grupo separados |

---

## 🔧 Cambios de Código

### 1. Game.js (Modelo)
```javascript
// Campo group ahora opcional
group: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Group',
  default: null  // ← Cambio crítico
}
```

### 2. gameValidator.js
```javascript
// groupId es opcional
body('groupId')
  .optional()  // ← En createGameValidation y addFromBGGValidation
  .isMongoId().withMessage('ID de grupo inválido'),
```

### 3. gameController.js - Métodos Modificados

#### `createGame()` - Prevención de Duplicados
```javascript
if (groupId) {
  // Verificar acceso: admin O miembro
  const isAdmin = group.admin.toString() === req.user._id.toString();
  const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
  
  if (!isAdmin && !isMember) {
    return res.status(403).json({ message: 'No eres miembro' });
  }

  // Prevenir duplicados por nombre
  const existing = await Game.findOne({ name, group: groupId, isActive: true });
  if (existing) {
    return res.status(400).json({ message: 'Juego ya existe en el grupo' });
  }
}

// Crear con group opcional
const game = await Game.create({
  name, minPlayers, maxPlayers, playingTime,
  group: groupId || null,  // ← Crítico
  addedBy: req.user._id,
  source: 'custom',
  isActive: true,
});
```

#### `getGames()` - Filtrado por Contexto
```javascript
if (groupId) {
  // Verificar acceso
  const isAdmin = group.admin.toString() === req.user._id.toString();
  const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
  
  if (!isAdmin && !isMember) {
    return res.status(403).json({ message: 'No tienes acceso' });
  }
  
  filter.group = groupId;  // Juegos del grupo
} else {
  // Juegos personales
  filter.addedBy = req.user._id;
  filter.group = null;  // ← Explícito
}

// Deduplicar por bggId si es necesario
const games = deduplicationField 
  ? deduplicateGames(allGames, deduplicationField)
  : allGames;
```

#### Otros Métodos
- `addFromBGG()`: Mismo patrón (admin + isMember, prevención duplicados)
- `getGame()`, `syncBGGGame()`, `deleteGame()`: Verificación admin/miembro

---

## 📊 Flujos de Datos

### Juego Personal
```
Usuario crea "Catan" (sin groupId)
→ { name: "Catan", group: null, addedBy: userId }
→ Solo este usuario ve este juego
```

### Juego de Grupo
```
Admin crea "Catan" en grupo G
→ { name: "Catan", group: groupId, addedBy: adminId }
→ Todos los miembros de G ven este juego
→ Prevención de duplicados: otro usuario NO puede agregar "Catan" a G
```

---

## 🧪 Casos de Prueba (26/26 PASSING)

| BLOQUE | Tests | Validación |
|--------|-------|-----------|
| 1. Juegos Personales | 7 ✅ | Usuarios crean sin grupo, independencia |
| 2. Crear Grupo | 4 ✅ | Admin crea grupo, usuarios se unen, agrega juegos |
| 3. Prevenir Duplicados | 4 ✅ | No permite mismo juego 2x en grupo |
| 4. Ver sin Duplicados | 5 ✅ | Miembros ven conteo exacto y consistente |
| 5. Independencia | 3 ✅ | Juegos grupo NO afectan personales |
| 6. Permisos | 2 ✅ | No-miembro NO puede acceder |

---

## ⚠️ Puntos Críticos

### 1. Admin NO está en members[]
```javascript
// ✅ CORRECTO
const isAdmin = group.admin.toString() === userId;
const isMember = group.members.some(m => m.user.toString() === userId);

if (!isAdmin && !isMember) {
  // Denegar acceso
}
```

### 2. Usar null, no undefined
```javascript
// ✅ CORRECTO
game.group = groupId || null;

// ❌ INCORRECTO
game.group = groupId || undefined;  // Se ignora en Mongoose
```

### 3. Query explícita para personales
```javascript
// ✅ CORRECTO
filter.group = null;

// ❌ INCORRECTO
filter.group = { $exists: false };  // No coincide con null
```

---

## 📁 Archivos Modificados

| Archivo | Línea | Cambio |
|---------|-------|--------|
| `Game.js` | 120 | `group: default: null` |
| `gameValidator.js` | 18, 72 | `groupId` optional |
| `gameController.js` | 88-233 | `createGame()` con admin check + duplicados |
| `gameController.js` | 290-316 | `getGames()` filtrado |
| `gameController.js` | Varios | `getGame()`, `syncBGGGame()`, `deleteGame()` |
| `test-personal-games-and-groups.sh` | Todo | 26 tests completos |

---

## 🚀 Uso en API

### Crear Juego Personal
```bash
POST /api/games
{ "name": "Catan", "minPlayers": 2, "maxPlayers": 4, "playingTime": 60 }
# Sin groupId → juego personal (group = null)
```

### Crear Juego en Grupo
```bash
POST /api/games
{ "name": "Catan", "minPlayers": 2, "maxPlayers": 4, "playingTime": 60, 
  "groupId": "691f00a018251c5c4e84e7a8" }
# Con groupId → juego de grupo (debe ser admin/miembro)
```

### Ver Juegos Personales
```bash
GET /api/games
# Sin groupId → juegos con group = null del usuario
```

### Ver Juegos de Grupo
```bash
GET /api/games?groupId=691f00a018251c5c4e84e7a8
# Con groupId → juegos del grupo (debe ser admin/miembro)
```

---

## 📋 Estructura Datos

### Juego Personal
```json
{
  "name": "Catan",
  "addedBy": "userId",
  "group": null,
  "source": "custom",
  "isActive": true
}
```

### Juego de Grupo
```json
{
  "name": "Catan",
  "addedBy": "userId",
  "group": "groupId",
  "source": "custom",
  "isActive": true
}
```

---

## ✅ Validación Final

**Resultado:** 26/26 tests pasando (100%)

✅ Usuarios pueden agregar juegos SIN estar en grupo  
✅ Juegos personales son independientes  
✅ Se previenen duplicados EN el grupo  
✅ Miembros ven juegos sin duplicados  
✅ Control de permisos correcto  

---

**Documentación:** 20/11/2025  
**Versión:** 1.0 - Concisa
