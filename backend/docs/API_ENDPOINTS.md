# API Endpoints - TabletopMastering

**Base URL:** `http://localhost:5000/api`

## 🔐 Autenticación

| Método | Endpoint | Body |
|--------|----------|------|
| POST | `/auth/register` | `{name, email, password}` |
| POST | `/auth/login` | `{email, password}` |
| GET | `/auth/me` | - |
| PUT | `/auth/profile` | `{name?, avatar?, description?, quote?}` |

**Headers:** `Authorization: Bearer <token>` (todos excepto register/login)

---

## 🎲 Juegos (14 endpoints)

| Método | Endpoint | Body |
|--------|----------|------|
| GET | `/games/search-bgg?name=X` | - |
| GET | `/games/bgg/:bggId` | - |
| GET | `/games/bgg/hot?limit=10` | - |
| POST | `/games/add-from-bgg` | `{bggId, groupId?, customNotes?}` |
| POST | `/games` | `{name, minPlayers, maxPlayers, playingTime?, groupId?}` |
| GET | `/games?groupId=X&page=1&limit=20` | - |
| GET | `/games/:id` | - |
| PUT | `/games/:id` | `{name?, description?, customNotes?}` |
| PUT | `/games/:id/sync-bgg` | - |
| DELETE | `/games/:id` | - |
| GET | `/games/stats/:groupId` | - |
| GET | `/games/cache/stats` | - |
| DELETE | `/games/cache/:bggId` | - |
| DELETE | `/games/cache` | - |

---

## 👥 Grupos (10 endpoints)

| Método | Endpoint | Body |
|--------|----------|------|
| POST | `/groups` | `{name, description?, avatar?}` |
| GET | `/groups` | - |
| GET | `/groups/:id` | - |
| POST | `/groups/join` | `{inviteCode}` |
| PUT | `/groups/:id` | `{name?, description?, avatar?}` |
| PUT | `/groups/:id/invite-code` | - |
| GET | `/groups/:id/members` | - |
| DELETE | `/groups/:id/members/:userId` | - |
| DELETE | `/groups/:id/leave` | - |
| DELETE | `/groups/:id` | - |

---

## 🎯 Partidas (9 endpoints)

| Método | Endpoint | Body |
|--------|----------|------|
| POST | `/matches` | `{gameId, groupId, scheduledDate, location?, playerIds, notes?}` |
| GET | `/matches?groupId=X&status=X` | - |
| GET | `/matches/:id` | - |
| PUT | `/matches/:id` | `{scheduledDate?, location?, notes?}` |
| POST | `/matches/:id/confirm` | - |
| POST | `/matches/:id/finish` | `{winnerId, duration?, results[]}` |
| DELETE | `/matches/:id` | - |
| GET | `/matches/ranking/global` | - |
| GET | `/matches/ranking/group/:groupId` | - |

---

## ⚠️ HTTP Status Codes

| Código | Significado |
|--------|------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 📚 Ejemplo Práctico Completo: Crear Partida

### Escenario:
Crear una partida de Catan con 3 jugadores en el grupo "Mi Grupo de Juegos"

### Step 1: Obtener token (Login)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "securePass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjZlNzAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTczNzM2OTIwMH0.ABC...",
  "data": {
    "_id": "666e700000000000000000001",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Guardar token:** `TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`

---

### Step 2: Obtener IDs de los usuarios y grupo
```bash
# Obtener mi usuario actual
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "666e700000000000000000001",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "groups": ["666e700000000000000000010"]
  }
}
```

Usuarios en la partida:
- Juan Pérez: `666e700000000000000000001`
- Pedro García: `666e700000000000000000002`
- María López: `666e700000000000000000003`

Grupo (opcional):
- Mi Grupo de Juegos: `666e700000000000000000010`

---

### Step 3: Obtener ID del juego (Catan)
```bash
# Listar juegos del grupo
curl "http://localhost:5000/api/games?groupId=666e700000000000000000010" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "666e700000000000000000020",
      "name": "Catan",
      "minPlayers": 3,
      "maxPlayers": 4,
      "playingTime": 60
    }
  ]
}
```

ID del juego: `666e700000000000000000020`

---

### Step 4: Crear la partida
```bash
curl -X POST http://localhost:5000/api/matches \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "666e700000000000000000020",
    "groupId": "666e700000000000000000010",
    "scheduledDate": "2025-11-25T19:00:00.000Z",
    "location": "Casa de Juan",
    "playerIds": [
      "666e700000000000000000001",
      "666e700000000000000000002",
      "666e700000000000000000003"
    ],
    "notes": "Traer snacks"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Partida creada exitosamente",
  "data": {
    "_id": "666e700000000000000000030",
    "game": {
      "_id": "666e700000000000000000020",
      "name": "Catan",
      "minPlayers": 3,
      "maxPlayers": 4,
      "playingTime": 60
    },
    "group": {
      "_id": "666e700000000000000000010",
      "name": "Mi Grupo de Juegos"
    },
    "scheduledDate": "2025-11-25T19:00:00.000Z",
    "location": "Casa de Juan",
    "status": "programada",
    "notes": "Traer snacks",
    "players": [
      {
        "user": {
          "_id": "666e700000000000000000001",
          "name": "Juan Pérez",
          "email": "juan@example.com"
        },
        "confirmed": true,
        "score": null,
        "position": null,
        "pointsEarned": null
      },
      {
        "user": {
          "_id": "666e700000000000000000002",
          "name": "Pedro García",
          "email": "pedro@example.com"
        },
        "confirmed": false,
        "score": null,
        "position": null,
        "pointsEarned": null
      },
      {
        "user": {
          "_id": "666e700000000000000000003",
          "name": "María López",
          "email": "maria@example.com"
        },
        "confirmed": false,
        "score": null,
        "position": null,
        "pointsEarned": null
      }
    ],
    "createdBy": {
      "_id": "666e700000000000000000001",
      "name": "Juan Pérez"
    },
    "createdAt": "2025-11-20T15:30:00.000Z"
  }
}
```

**Guardar ID de partida:** `MATCH_ID="666e700000000000000000030"`

---

### Step 5: Los otros jugadores confirman asistencia
```bash
# Pedro confirma
curl -X POST http://localhost:5000/api/matches/666e700000000000000000030/confirm \
  -H "Authorization: Bearer $PEDRO_TOKEN"

# María confirma
curl -X POST http://localhost:5000/api/matches/666e700000000000000000030/confirm \
  -H "Authorization: Bearer $MARIA_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Asistencia confirmada"
}
```

---

### Step 6: Obtener detalles de la partida (verificar confirmaciones)
```bash
curl http://localhost:5000/api/matches/666e700000000000000000030 \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "666e700000000000000000030",
    "game": {
      "_id": "666e700000000000000000020",
      "name": "Catan"
    },
    "scheduledDate": "2025-11-25T19:00:00.000Z",
    "location": "Casa de Juan",
    "status": "programada",
    "players": [
      {
        "user": {"_id": "666e700000000000000000001", "name": "Juan Pérez"},
        "confirmed": true
      },
      {
        "user": {"_id": "666e700000000000000000002", "name": "Pedro García"},
        "confirmed": true
      },
      {
        "user": {"_id": "666e700000000000000000003", "name": "María López"},
        "confirmed": true
      }
    ]
  }
}
```

---

### Step 7: Finalizar la partida y registrar resultados
```bash
curl -X POST http://localhost:5000/api/matches/666e700000000000000000030/finish \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "winnerId": "666e700000000000000000001",
    "duration": 95,
    "results": [
      {
        "userId": "666e700000000000000000001",
        "position": 1,
        "score": 55
      },
      {
        "userId": "666e700000000000000000002",
        "position": 2,
        "score": 45
      },
      {
        "userId": "666e700000000000000000003",
        "position": 3,
        "score": 35
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Partida finalizada y resultados registrados",
  "data": {
    "_id": "666e700000000000000000030",
    "status": "finalizada",
    "duration": 95,
    "actualDate": "2025-11-25T20:35:00.000Z",
    "winner": {
      "_id": "666e700000000000000000001",
      "name": "Juan Pérez"
    },
    "players": [
      {
        "user": {"_id": "666e700000000000000000001", "name": "Juan Pérez"},
        "position": 1,
        "score": 55,
        "pointsEarned": 10
      },
      {
        "user": {"_id": "666e700000000000000000002", "name": "Pedro García"},
        "position": 2,
        "score": 45,
        "pointsEarned": 5
      },
      {
        "user": {"_id": "666e700000000000000000003", "name": "María López"},
        "position": 3,
        "score": 35,
        "pointsEarned": 2
      }
    ]
  }
}
```

---

### Step 8: Consultar ranking del grupo
```bash
curl http://localhost:5000/api/matches/ranking/group/666e700000000000000000010 \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": {
        "_id": "666e700000000000000000001",
        "name": "Juan Pérez"
      },
      "totalPoints": 10,
      "totalMatches": 1,
      "totalWins": 1,
      "winRate": "100.00"
    },
    {
      "user": {
        "_id": "666e700000000000000000002",
        "name": "Pedro García"
      },
      "totalPoints": 5,
      "totalMatches": 1,
      "totalWins": 0,
      "winRate": "0.00"
    },
    {
      "user": {
        "_id": "666e700000000000000000003",
        "name": "María López"
      },
      "totalPoints": 2,
      "totalMatches": 1,
      "totalWins": 0,
      "winRate": "0.00"
    }
  ]
}
```

---

**Versión:** 1.0 | **Última actualización:** 20-11-2025
