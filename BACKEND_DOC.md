# 📘 Backend - Documentación Técnica

## Stack
- Node.js 20+ + Express 4.21
- MongoDB 8.8 + Mongoose
- JWT + Bcrypt + Express Validator
- BoardGameGeek API (XML)

## Estructura
```
backend/
├── controllers/    # Lógica de negocio
├── models/         # Esquemas Mongoose (User, Group, Game, Match)
├── routes/         # Endpoints API
├── middlewares/    # Auth, validación, errores
├── services/       # BGG API integration
└── server.js       # Entry point
```

## API Endpoints

### Autenticación
```
POST   /api/auth/register    # Registro
POST   /api/auth/login       # Login (JWT 7 días)
GET    /api/auth/me          # Perfil actual
PUT    /api/auth/profile     # Actualizar perfil
```

### Grupos
```
POST   /api/groups           # Crear grupo
GET    /api/groups           # Listar grupos
GET    /api/groups/:id       # Detalles
PUT    /api/groups/:id       # Actualizar (admin)
DELETE /api/groups/:id       # Eliminar (admin)
POST   /api/groups/:id/join  # Unirse con código
POST   /api/groups/:id/leave # Salir
```

### Juegos
```
GET    /api/games/search-bgg/:query  # Buscar BGG
POST   /api/games/add-from-bgg       # Importar BGG
POST   /api/games                    # Crear personalizado
GET    /api/games                    # Listar
GET    /api/games/:id                # Detalles
PUT    /api/games/:id                # Actualizar
DELETE /api/games/:id                # Eliminar
GET    /api/games/stats/:groupId     # Estadísticas
```

### Partidas (En desarrollo)
```
POST   /api/matches          # Crear
GET    /api/matches          # Listar
GET    /api/matches/:id      # Detalles
PUT    /api/matches/:id      # Actualizar
DELETE /api/matches/:id      # Eliminar
```

## Modelos de Datos

### User
```javascript
{
  name: String (req),
  email: String (unique, req),
  password: String (hashed, req),
  avatar: String,
  createdAt: Date
}
```

### Group
```javascript
{
  name: String (req),
  description: String,
  code: String (unique, 8 chars),
  createdBy: ObjectId (User),
  members: [{ user: ObjectId, role: 'admin'|'member' }],
  createdAt: Date
}
```

### Game
```javascript
{
  bggId: Number,
  name: String (req),
  description: String,
  image: String,
  minPlayers: Number,
  maxPlayers: Number,
  playingTime: Number,
  yearPublished: Number,
  categories: [String],
  mechanics: [String],
  source: 'bgg'|'custom',
  group: ObjectId,
  addedBy: ObjectId (User)
}
```

### Match
```javascript
{
  game: ObjectId (req),
  group: ObjectId (req),
  playedAt: Date,
  duration: Number,
  results: [{ player: ObjectId, score: Number, placement: Number }],
  notes: String,
  status: 'scheduled'|'completed'|'cancelled'
}
```

## Seguridad
- **JWT**: Tokens 7 días expiración
- **Bcrypt**: 10 salt rounds
- **CORS**: Whitelist configurado
- **Validación**: Express Validator en todos endpoints
- **Roles**: Admin/Miembro en grupos

## Variables de Entorno (.env)
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=changeme
MONGO_DBNAME=tabletop_mastering
JWT_SECRET=tu_clave_secreta
JWT_EXPIRE=7d
PORT=3000
```

## Instalación
```bash
cd backend
npm install
cp .env.example .env
npm run dev          # Desarrollo
npm start            # Producción
```

## Testing
```bash
npm test             # Tests (en desarrollo)
```

## Integración BGG
- Búsqueda por nombre
- Importación automática de datos
- Cache de imágenes y metadata
- Parsing XML → JSON
