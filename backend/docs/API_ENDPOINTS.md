# API Endpoints - TabletopMastering

**Base URL:** `http://localhost:5000/api`

## Autenticación General

Todos los endpoints (excepto registro y login) requieren token JWT:
```
Authorization: Bearer <token>
```

## 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar usuario: `{name, email, password}` |
| POST | `/auth/login` | Login: `{email, password}` |
| GET | `/auth/me` | Obtener usuario actual |
| PUT | `/auth/profile` | Actualizar perfil: `{name?, avatar?, description?, quote?}` |

## 🎲 Juegos (11 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/games/search-bgg?name=X` | Buscar en BGG |
| GET | `/games/bgg/:bggId` | Detalles BGG |
| GET | `/games/bgg/hot?limit=10` | Juegos populares |
| POST | `/games/add-from-bgg` | Agregar desde BGG: `{bggId, groupId?, customNotes?}` |
| POST | `/games` | Crear custom: `{name, minPlayers, maxPlayers, playingTime?, description?, categories?, mechanics?, image?, groupId?, customNotes?}` |
| GET | `/games?groupId=X&source=X&search=X&page=1&limit=20` | Listar juegos |
| GET | `/games/:id` | Obtener juego |
| PUT | `/games/:id` | Actualizar juego |
| PUT | `/games/:id/sync-bgg` | Sincronizar con BGG |
| DELETE | `/games/:id` | Eliminar juego |
| GET | `/games/stats/:groupId` | Estadísticas grupo |
| GET | `/games/cache/stats` | Stats caché |
| DELETE | `/games/cache/:bggId` | Limpiar entrada caché |
| DELETE | `/games/cache` | Limpiar todo caché |

## 👥 Grupos (8 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/groups` | Crear: `{name, description?, avatar?, settings?}` |
| GET | `/groups` | Mis grupos |
| GET | `/groups/:id` | Detalles grupo (solo miembros) |
| POST | `/groups/join` | Unirse: `{inviteCode}` |
| PUT | `/groups/:id` | Actualizar (solo admin) |
| PUT | `/groups/:id/invite-code` | Regenerar código (solo admin) |
| GET | `/groups/:id/members` | Miembros grupo |
| DELETE | `/groups/:id/members/:userId` | Expulsar miembro (solo admin) |
| DELETE | `/groups/:id/leave` | Abandonar grupo |
| DELETE | `/groups/:id` | Eliminar grupo (solo admin) |

## 🎯 Partidas (8 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/matches` | Crear: `{gameId, groupId, scheduledDate, location?, playerIds, notes?}` |
| GET | `/matches?groupId=X&status=X&page=1&limit=20` | Listar partidas |
| GET | `/matches/:id` | Detalles partida |
| PUT | `/matches/:id` | Actualizar (solo creador/admin) |
| POST | `/matches/:id/confirm` | Confirmar asistencia |
| POST | `/matches/:id/finish` | Finalizar: `{winnerId, duration?, results: [{userId, position, score}]}` |
| DELETE | `/matches/:id` | Eliminar (no finalizadas) |
| GET | `/matches/ranking/global` | Ranking global |
| GET | `/matches/ranking/group/:groupId` | Ranking grupo (solo miembros) |

## ⚠️ HTTP Status

| Código | Significado |
|--------|------------|
| 200 | OK |
| 201 | Creado |
| 400 | Solicitud inválida |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | No encontrado |
| 500 | Error servidor |

## 🔑 Notas

1. **Autenticación**: JWT en header Authorization
2. **Expiración**: 24 horas
3. **CORS**: http://localhost:3000
4. **Rate limit**: 100 req/min por IP
5. **Paginación**: default 20 registros
6. **Orden**: desc por fecha creación

---
**Versión:** 1.0 | **Última actualización:** 20-11-2025
