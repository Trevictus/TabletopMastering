# Project Resources — TabletopMastering

## Backend

- **Main Technologies:** Node.js, Express, MongoDB, Mongoose
- **Key Dependencies:** axios, bcryptjs, cors, dotenv, express-validator, jsonwebtoken, morgan, multer, tough-cookie, xml2js
- **Server:** server.js
- **Database:** MongoDB (URI configured in `.env` as `MONGODB_URI`)
- **Main Environment Variables:**
  - `NODE_ENV`
  - `PORT`
  - `CLIENT_URL`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRE`
  - `USE_BGG_MOCK`
- **Internal Services:**
  - JWT Authentication
  - BoardGameGeek API Mock (`USE_BGG_MOCK=true` activates the mock)
- **External APIs:**
  - BoardGameGeek API (production only, mock in development)
  - BGG_API_URL (optional, in `.env`)

## Frontend

- **Main Technologies:** React, Vite, Zustand
- **Key Dependencies:** axios, prop-types, react, react-dom, react-icons, react-router-dom, zustand
- **Development Configuration:** Vite (`vite.config.js`)
- **Default Port:** 5173
- **Global State Management (Zustand):**
  - `stores/authStore.js`: Authentication state (user, login, logout, refreshUser)
  - `stores/groupStore.js`: Groups state (groups, selected group, CRUD)
  - `stores/toastStore.js`: Toast notification system (success, error, warning, info)
- **Implemented Services (Axios):**
  - `api.js`: Axios client for backend communication (interceptors, tokens, error handling)
  - `authService.js`: Registration, login, and session management
  - `gameService.js`: Game search and management (BoardGameGeek)
  - `groupService.js`: Groups and members management
  - `matchService.js`: Match management
  - `rankingService.js`: Global and group-specific rankings

## Credentials and Configuration

- **Sensitive Credentials** (JWT_SECRET, MONGODB_URI, etc.) are managed in the `.env` file (not included in the public repository).
- **Example Environment Variables:** See `backend/.env.example`

## Game Images and Resources

- **Official Images:** Public URLs of game covers (BoardGameAtlas S3, Wikimedia, etc.) configured in the BGG mock.

## Notes

- Credentials for external services are not stored in the repository.
- All services and APIs are documented in each module's files.
