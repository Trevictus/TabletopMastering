# Recursos del Proyecto TabletopMastering

## Backend

- **Tecnologías principales:** Node.js, Express, MongoDB, Mongoose
- **Dependencias clave:** axios, bcryptjs, cors, dotenv, express-validator, jsonwebtoken, morgan, multer, tough-cookie, xml2js
- **Servidor:** server.js
- **Base de datos:** MongoDB (URI configurada en `.env` como `MONGODB_URI`)
- **Variables de entorno principales:**
  - `NODE_ENV`
  - `PORT`
  - `CLIENT_URL`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRE`
  - `USE_BGG_MOCK`
- **Servicios internos:**
  - Autenticación JWT
  - Mock de BoardGameGeek API (`USE_BGG_MOCK=true` activa el mock)
- **APIs externas:**
  - BoardGameGeek API (solo en producción, mock en desarrollo)
  - BGG_API_URL (opcional, en `.env`)

## Frontend

- **Tecnologías principales:** React, Vite
- **Dependencias clave:** axios, prop-types, react, react-dom, react-icons, react-router-dom
- **Configuración de desarrollo:** Vite (`vite.config.js`)
- **Puerto por defecto:** 5173
- **Servicios implementados:**
  - `api.js`: Cliente Axios para comunicación con backend
  - `authService.js`: Registro, login y gestión de sesión
  - `gameService.js`: Búsqueda y gestión de juegos (BoardGameGeek)
  - `groupService.js`: Gestión de grupos y miembros
  - `matchService.js`: Gestión de partidas
  - `rankingService.js`: Rankings globales y por grupo

## Credenciales y configuración

- **Las credenciales sensibles** (JWT_SECRET, MONGODB_URI, etc.) se gestionan en el archivo `.env` (no se incluyen en el repositorio público).
- **Variables de entorno de ejemplo:** Ver `backend/.env.example`

## Imágenes y recursos de juegos

- **Imágenes oficiales:** URLs públicas de portadas de juegos (BoardGameAtlas S3, Wikimedia, etc.) configuradas en el mock de BGG.

## Notas

- No se almacenan credenciales de servicios externos en el repositorio.
- Todos los servicios y APIs están documentados en los archivos de cada módulo.