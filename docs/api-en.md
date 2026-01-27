# API Documentation — Tabletop Mastering

This reference describes the main backend endpoints, their functionality, parameters, and response examples.

---

## Authentication and JWT Usage

All protected endpoints require the header:

```
Authorization: Bearer <token>
```

Get the token by logging in or registering. Include it in each authenticated request.

---

## Status Codes and Common Errors

| Code | Meaning                    |
|------|----------------------------|
| 200  | OK (success)               |
| 201  | Created                    |
| 400  | Invalid request            |
| 401  | Not authenticated          |
| 403  | Forbidden (no permissions) |
| 404  | Not found                  |
| 409  | Conflict (duplicate)       |
| 500  | Internal server error      |

Errors return:
```json
{
  "success": false,
  "message": "Error description."
}
```

---

## Authentication

### POST /api/auth/register
- **Description:** Registers a new user.
- **Parameters:**
  - **Body:**
    - `name` (string, required)
    - `email` (string, required)
    - `password` (string, required)
- **Request Example:**
```json
{
  "name": "John",
  "email": "john@email.com",
  "password": "123456"
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John", "email": "john@email.com" },
    "token": "...jwt..."
  }
}
```
- **Errors (400):**
```json
{
  "success": false,
  "message": "Email is already registered."
}
```

---

### POST /api/auth/login
- **Description:** Logs in and returns a JWT token.
- **Parameters:**
  - **Body:**
    - `email` (string, required)
    - `password` (string, required)
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John", "email": "john@email.com" },
    "token": "...jwt..."
  }
}
```
- **Errors (401):**
```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

---

### GET /api/auth/me
- **Description:** Returns the authenticated user (requires JWT in Authorization header).
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "John", "email": "john@email.com" }
}
```
- **Errors (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

---

## Groups

### GET /api/groups
- **Description:** Returns the authenticated user's groups.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Group 1", "members": [ ... ] },
    ...
  ]
}
```

- **Pagination:** You can use `?page=1&limit=10` to paginate results if the endpoint supports it.

---

### POST /api/groups
- **Description:** Creates a new group.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `name` (string, required)
- **Response (201):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Group 1", "members": [ ... ] }
}
```

---

### PUT /api/groups/:id
- **Description:** Updates group data.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `name` (string, optional)
- **Response (200):**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "New name" }
}
```

---

### DELETE /api/groups/:id
- **Description:** Deletes a group.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "success": true,
  "message": "Group deleted."
}
```

---

## Games

### GET /api/games
- **Description:** Returns the game catalog.
- **Response (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Catan", ... },
    ...
  ]
}
```

- **Query Parameters:**
  - `search` (string, optional): Search by name.
  - `page` (number, optional): Results page.
  - `limit` (number, optional): Page size.

---

## Matches

### GET /api/matches
- **Description:** Returns the user's match history.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query params:**
  - `groupId` (string, optional): Filter by group.
  - `page`, `limit` (optional): Pagination.
- **Response (200):**
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
- **Description:** Creates a new match.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `gameId` (string, required)
  - `groupId` (string, required)
  - `players` (array, required)
- **Response (201):**
```json
{
  "success": true,
  "data": { "_id": "...", "game": "Catan", ... }
}
```

---

## Rankings

### GET /api/rankings
- **Description:** Returns global or group-specific ranking.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query params:**
  - `groupId` (string, optional): Ranking for a specific group.
- **Response (200):**
```json
{
  "success": true,
  "data": [
    { "user": "John", "points": 120 },
    ...
  ]
}
```

---

## Notes
- All endpoints requiring authentication use JWT in the `Authorization` header.
- Errors always return an object with `success: false` and a descriptive message.

---

**Authentication usage example with curl:**
```bash
curl -H "Authorization: Bearer <token>" https://tabletopmastering.games/api/groups
```
