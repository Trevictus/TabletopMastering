# Ejemplos de API - Matches CRUD

## 1. Registrar Usuario 1 (Juan)
**Guardar:** `token_juan`, `id_juan`

```json
POST http://localhost:3000/api/auth/register

{
  "name": "Juan test",
  "email": "juan@test.com",
  "password": "password123"
}
```

---

## 2. Registrar Usuario 2 (María)
**Guardar:** `token_maria`, `id_maria`

```json
POST http://localhost:3000/api/auth/register

{
  "name": "María test",
  "email": "maria@test.com",
  "password": "password123"
}
```

---

## 3. Crear Grupo
**Guardar:** `id_grupo`, `invite_code`

```json
PUT http://localhost:3000/api/groups
Authorization: Bearer {token_juan}

{
  "name": "Mi Grupo",
  "description": "Grupo de prueba para partidas"
}
```

---

## 4. Generar Código de Invitación
**Guardar:** `invite_code`

```json
PUT http://localhost:3000/api/groups/{id_grupo}/invite-code
Authorization: Bearer {token_juan}

{}
```

---

## 5. María se Une al Grupo
```json
POST http://localhost:3000/api/groups/join
Authorization: Bearer {token_maria}

{
  "inviteCode": "{invite_code}"
}
```

---

## 6. Crear Juego
**Guardar:** `id_juego`

```json
POST http://localhost:3000/api/games
Authorization: Bearer {token_juan}

{
  "name": "Catan",
  "groupId": "{id_grupo}"
}
```

---

## 7. Crear Partida
**Guardar:** `id_partida`

```json
POST http://localhost:3000/api/matches
Authorization: Bearer {token_juan}

{
  "gameId": "{id_juego}",
  "groupId": "{id_grupo}",
  "scheduledDate": "2025-11-20T19:00:00Z",
  "playerIds": ["{id_juan}", "{id_maria}"]
}
```

---

## 8. Listar Partidas del Grupo

```json
GET http://localhost:3000/api/matches?groupId={id_grupo}
Authorization: Bearer {token_juan}
```

---

## 9. Obtener una Partida

```json
GET http://localhost:3000/api/matches/{id_partida}
Authorization: Bearer {token_juan}
```

---

## 10. Editar Partida

```json
PUT http://localhost:3000/api/matches/{id_partida}
Authorization: Bearer {token_juan}

{
  "scheduledDate": "2025-11-21T20:00:00Z",
  "location": "Casa de Juan",
  "notes": "Partida en la sala"
}
```

---

## 11. Confirmar Asistencia (María)

```json
POST http://localhost:3000/api/matches/{id_partida}/confirm
Authorization: Bearer {token_maria}

{}
```

---

## 12. Registrar Resultados y Finalizar Partida

```json
POST http://localhost:3000/api/matches/{id_partida}/finish
Authorization: Bearer {token_juan}

{
  "winnerId": "{id_juan}",
  "duration": 120,
  "results": [
    {
      "userId": "{id_juan}",
      "score": 15,
      "position": 1,
      "pointsEarned": 10
    },
    {
      "userId": "{id_maria}",
      "score": 12,
      "position": 2,
      "pointsEarned": 5
    }
  ]
}
```

---

## 13. Eliminar Partida

```json
DELETE http://localhost:3000/api/matches/{id_partida}
Authorization: Bearer {token_juan}
```

---

## Variables a Guardar

| Variable | Valor | Dónde se obtiene |
|----------|-------|-----------------|
| `token_juan` | Bearer token | Respuesta del registro de Juan |
| `id_juan` | MongoDB ID | Respuesta del registro de Juan |
| `token_maria` | Bearer token | Respuesta del registro de María |
| `id_maria` | MongoDB ID | Respuesta del registro de María |
| `id_grupo` | MongoDB ID | Respuesta de crear grupo |
| `invite_code` | 8 caracteres | Respuesta de generar código |
| `id_juego` | MongoDB ID | Respuesta de crear juego |
| `id_partida` | MongoDB ID | Respuesta de crear partida |
