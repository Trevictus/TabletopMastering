# 🎮 Guía Rápida - Módulo de Juegos con BGG

## 🚀 Inicio Rápido (5 minutos)

### 1. Verificar que el servidor está corriendo

```bash
cd backend
npm run dev
```

Deberías ver:
```
╔═══════════════════════════════════════════════╗
║       🎲 TABLETOP MASTERING API 🎲           ║
╚═══════════════════════════════════════════════╝
🚀 Servidor corriendo en modo development
📡 Puerto: 3000
✅ MongoDB conectado
```

### 2. Ejecutar el script de pruebas

```bash
chmod +x ./test-games-api.sh
./test-games-api.sh
```

Este script:
- ✅ Crea un usuario de prueba
- ✅ Crea un grupo
- ✅ Busca juegos en BGG
- ✅ Añade un juego de BGG
- ✅ Crea un juego personalizado
- ✅ Prueba todos los endpoints
- ✅ Muestra estadísticas

---

## 🎯 Flujo de Trabajo Típico

### Escenario 1: Añadir un juego de BGG a tu grupo

```bash
# 1. Login y obtener token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu@email.com",
    "password": "tu_password"
  }'

# Guardar el token que devuelve
TOKEN="tu_token_aqui"

# 2. Buscar el juego en BGG
curl -X GET "http://localhost:3000/api/games/search-bgg?name=Wingspan" \
  -H "Authorization: Bearer $TOKEN"

# Respuesta: verás una lista de juegos con sus bggId

# 3. Añadir el juego a tu grupo
curl -X POST http://localhost:3000/api/games/add-from-bgg \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bggId": 266192,
    "groupId": "TU_GROUP_ID",
    "customNotes": "Juego que queremos probar"
  }'
```

### Escenario 2: Crear un juego personalizado

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Juego Custom",
    "description": "Un juego creado por nuestro grupo",
    "groupId": "TU_GROUP_ID",
    "minPlayers": 2,
    "maxPlayers": 6,
    "playingTime": 45,
    "categories": ["Estrategia", "Cartas"],
    "difficulty": "medio"
  }'
```

### Escenario 3: Ver los juegos de tu grupo

```bash
curl -X GET "http://localhost:3000/api/games?groupId=TU_GROUP_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 Ejemplos de Búsqueda

### Buscar "Catan"
```bash
curl -X GET "http://localhost:3000/api/games/search-bgg?name=Catan" \
  -H "Authorization: Bearer $TOKEN"
```

### Ver juegos populares (Hot List)
```bash
curl -X GET "http://localhost:3000/api/games/bgg/hot?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Filtrar solo juegos de BGG
```bash
curl -X GET "http://localhost:3000/api/games?groupId=TU_GROUP_ID&source=bgg" \
  -H "Authorization: Bearer $TOKEN"
```

### Buscar por texto
```bash
curl -X GET "http://localhost:3000/api/games?groupId=TU_GROUP_ID&search=estrategia" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Ver Estadísticas

```bash
curl -X GET "http://localhost:3000/api/games/stats/TU_GROUP_ID" \
  -H "Authorization: Bearer $TOKEN"
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "total": 25,
    "bySource": {
      "bgg": 18,
      "custom": 7
    },
    "topRated": [...],
    "mostPlayed": [...],
    "topCategories": [...]
  }
}
```

---

## ✏️ Actualizar Juegos

### Actualizar juego personalizado
```bash
curl -X PUT "http://localhost:3000/api/games/GAME_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Nueva descripción",
    "playingTime": 60,
    "difficulty": "difícil"
  }'
```

### Sincronizar juego de BGG
```bash
curl -X PUT "http://localhost:3000/api/games/GAME_ID/sync-bgg" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🗑️ Eliminar Juego

```bash
curl -X DELETE "http://localhost:3000/api/games/GAME_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Nota:** Es un soft delete, el juego se marca como inactivo pero no se borra.

---

## 🎨 Usando Thunder Client (VSCode)

1. Instala la extensión "Thunder Client" en VSCode
2. Abre Thunder Client desde la barra lateral
3. La colección "Games API - BGG Integration" ya está configurada
4. Variables a configurar:
   - `baseUrl`: http://localhost:3000/api
   - `token`: Tu JWT token (obtenido del login)
   - `groupId`: ID de tu grupo
   - `gameId`: ID de un juego

---

## 📝 Ejemplos de Juegos BGG Populares

| Juego | BGG ID | Descripción |
|-------|--------|-------------|
| Catan | 13 | Clásico de estrategia |
| Wingspan | 266192 | Construcción de motores |
| Gloomhaven | 174430 | RPG cooperativo |
| Azul | 230802 | Colocación de losetas |
| 7 Wonders | 68448 | Drafting de cartas |
| Ticket to Ride | 9209 | Colección de rutas |
| Pandemic | 30549 | Cooperativo |
| Carcassonne | 822 | Colocación de losetas |

Puedes buscar cualquiera:
```bash
curl -X GET "http://localhost:3000/api/games/search-bgg?name=Wingspan" \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚠️ Solución de Problemas

### El servidor no inicia
```bash
# Verificar que MongoDB está corriendo
docker ps | grep mongo

# Si no está corriendo
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Error 401 (Unauthorized)
- Verifica que incluiste el token en el header
- El token podría haber expirado (duración: 7 días)
- Haz login nuevamente

### Error 403 (Forbidden)
- Verifica que eres miembro del grupo
- Solo admin o creador puede editar/eliminar juegos

### BGG API muy lenta
- BGG puede tardar 5-10 segundos en responder
- Es normal en primera búsqueda
- Los datos se cachean localmente

---

## 📖 Documentación Completa

- **API Endpoints:** `backend/GAMES_API_DOCS.md`
- **Módulo:** `backend/GAMES_MODULE_README.md`
- **Implementación:** `GAMES_IMPLEMENTATION_SUMMARY.md`

---

## 🎯 Próximos Pasos

1. ✅ Añade algunos juegos de BGG a tu grupo
2. ✅ Crea juegos personalizados
3. ✅ Explora las estadísticas
4. ✅ Prueba la búsqueda y filtros
5. ⏳ Espera el módulo de Partidas para registrar juegos jugados

---

## 💡 Tips

1. **Cache de 30 días:** Los juegos de BGG se actualizan automáticamente cada 30 días
2. **Sincronización manual:** Usa `/sync-bgg` para actualizar cuando quieras
3. **Soft delete:** Los juegos eliminados no se borran, solo se ocultan
4. **Paginación:** Usa `page` y `limit` para grandes colecciones
5. **Búsqueda flexible:** La búsqueda por texto funciona en nombre, descripción y categorías

---

## 🆘 Ayuda Rápida

```bash
# Ver todos los comandos disponibles
cat backend/GAMES_API_DOCS.md

# Ejecutar tests
./test-games-api.sh

# Ver logs del servidor
# (en la terminal donde corre npm run dev)

# Health check
curl http://localhost:3000/health
```

---

**¡Disfruta gestionando tu colección de juegos! 🎲**
