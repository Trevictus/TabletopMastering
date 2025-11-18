# 🎲 Tabletop Mastering - Backend API

Backend de la aplicación Tabletop Mastering para la gestión de partidas de juegos de mesa.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar el proyecto](#ejecutar-el-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Modelos de datos](#modelos-de-datos)

📚 **Documentación adicional:**
- **[docs/](./docs/)** - 📖 Documentación completa del backend
  - **[GAMES_API_DOCS.md](./docs/GAMES_API_DOCS.md)** - 🎮 API de juegos
  - **[TESTING.md](./docs/TESTING.md)** - 🧪 Guía de testing

## 🚀 Tecnologías

- **Node.js** v24.11.0
- **Express.js** v4.21.1 - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** v8.8.3 - ODM para MongoDB
- **JWT** - Autenticación con JSON Web Tokens
- **bcryptjs** - Cifrado de contraseñas
- **express-validator** - Validación de datos
- **CORS** - Control de acceso entre orígenes
- **Morgan** - Logger HTTP
- **Nodemon** - Auto-reinicio en desarrollo

## 📦 Requisitos previos

- Node.js >= 20.0.0
- MongoDB 7.0 o superior
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio y navegar a la carpeta backend:

```bash
cd backend
```

2. Instalar las dependencias:

```bash
npm install
```

## ⚙️ Configuración

1. Copiar el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Editar el archivo `.env` con tus configuraciones:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Base de datos MongoDB
MONGODB_URI=mongodb://172.18.0.2:27017/tabletop_mastering

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

⚠️ **IMPORTANTE**: Cambia `JWT_SECRET` en producción por una clave segura.

## 🏃 Ejecutar el proyecto

### Modo desarrollo (con nodemon):

```bash
npx nodemon server.js
```

O usando el script npm:

```bash
npm run dev
```

### Modo desarrollo con mock de BGG (para testing):

```bash
USE_BGG_MOCK=true npx nodemon server.js
```

O usando el script npm:

```bash
npm run dev:mock
```

### Modo producción:

```bash
node server.js
```

O usando el script npm:

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### ✅ Verificar que el servidor funciona:

```bash
curl http://localhost:3000/health
```

### 🗄️ Probar conexión a MongoDB:

```bash
node tests/test-db-connection.js
```

### Linter y formateo:

```bash
npm run lint        # Revisar errores
npm run lint:fix    # Corregir errores automáticamente
npm run format      # Formatear código
```

## 📁 Estructura del proyecto

```
backend/
├── config/              # Configuración
│   └── database.js         # Configuración de MongoDB
├── controllers/         # Lógica de negocio
│   ├── authController.js   # Autenticación
│   ├── gameController.js   # Gestión de juegos
│   ├── groupController.js  # Gestión de grupos
│   └── cacheController.js  # Caché de BGG
├── middlewares/         # Middleware personalizado
│   ├── auth.js             # Autenticación JWT
│   ├── gameValidator.js    # Validación de juegos
│   ├── groupAuth.js        # Autorización de grupos
│   ├── validator.js        # Validación genérica
│   └── errorHandler.js     # Manejo de errores
├── models/              # Modelos de datos (Mongoose)
│   ├── User.js             # Usuario
│   ├── Game.js             # Juego
│   ├── Match.js            # Partida
│   ├── Group.js            # Grupo
│   └── BGGCache.js         # Caché de BGG
├── routes/              # Definición de rutas
│   ├── authRoutes.js       # Autenticación
│   ├── groupRoutes.js      # Grupos
│   ├── gameRoutes.js       # Juegos
│   └── matchRoutes.js      # Partidas (en desarrollo)
├── services/            # Servicios externos
│   ├── bggService.js       # Integración con BoardGameGeek
│   └── bggService.mock.js  # Mock para testing
├── utils/               # Utilidades
│   ├── generateToken.js    # Generación de JWT
│   └── groupHelpers.js     # Helpers de grupos
├── tests/               # Tests automatizados
│   ├── test-db-connection.js         # Test de conexión DB
│   ├── test-games-comprehensive.sh   # 163 tests de juegos
│   └── test-groups-comprehensive.sh  # 16 tests de grupos
├── docs/                # Documentación del backend
│   ├── README.md           # Índice de documentación
│   ├── GAMES_API_DOCS.md   # Documentación completa de API de juegos
│   └── TESTING.md          # Guía de testing
├── .env.example         # Ejemplo de variables de entorno
├── .eslintrc.json       # Configuración de ESLint
├── .prettierrc.json        # Configuración de Prettier
├── package.json            # Dependencias y scripts
├── server.js               # Punto de entrada
└── README.md               # Este archivo
```

## 🔌 API Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | ❌ |
| POST | `/login` | Iniciar sesión | ❌ |
| GET | `/me` | Obtener perfil del usuario | ✅ |
| PUT | `/profile` | Actualizar perfil | ✅ |

### Grupos (`/api/groups`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/` | Crear un grupo | ✅ |
| GET | `/` | Obtener mis grupos | ✅ |
| GET | `/:id` | Obtener un grupo | ✅ |
| POST | `/join` | Unirse a un grupo | ✅ |

### Juegos (`/api/games`)

Para más detalles sobre los endpoints de juegos, consulta [GAMES_API_DOCS.md](./GAMES_API_DOCS.md)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/search-bgg?name=query` | Buscar juegos en BGG | ✅ |
| GET | `/bgg/hot?limit=10` | Hot list de BGG | ✅ |
| GET | `/bgg/:bggId` | Detalles de juego BGG | ✅ |
| POST | `/add-from-bgg` | Añadir juego de BGG a grupo | ✅ |
| POST | `/` | Crear juego personalizado | ✅ |
| GET | `/` | Listar juegos | ✅ |
| GET | `/stats/:groupId` | Estadísticas de juegos del grupo | ✅ |
| GET | `/:id` | Obtener juego | ✅ |
| PUT | `/:id` | Actualizar juego | ✅ |
| PUT | `/:id/sync-bgg` | Sincronizar juego con BGG | ✅ |
| DELETE | `/:id` | Eliminar juego (soft delete) | ✅ |

### Partidas (`/api/matches`) - ⏳ Pendiente

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/` | Crear partida | ✅ |
| GET | `/` | Listar partidas | ✅ |
| GET | `/:id` | Obtener partida | ✅ |
| PUT | `/:id` | Actualizar partida | ✅ |
| DELETE | `/:id` | Cancelar partida | ✅ |
| POST | `/:id/confirm` | Confirmar asistencia | ✅ |
| POST | `/:id/finish` | Finalizar y registrar resultado | ✅ |

## 📊 Modelos de datos

### User (Usuario)
- `name`: Nombre del usuario
- `email`: Email único
- `password`: Contraseña hasheada
- `avatar`: URL de la imagen
- `description`: Descripción del perfil
- `quote`: Cita o frase
- `stats`: Estadísticas (partidas, victorias, puntos)
- `groups`: Referencias a grupos

### Game (Juego)
- `name`: Nombre del juego
- `description`: Descripción
- `image`: Imagen del juego
- `minPlayers` / `maxPlayers`: Rango de jugadores
- `duration`: Duración del juego
- `categories`: Categorías del juego
- `difficulty`: Nivel de dificultad
- `group`: Referencia al grupo
- `addedBy`: Usuario que lo añadió

### Match (Partida)
- `game`: Referencia al juego
- `group`: Referencia al grupo
- `scheduledDate`: Fecha programada
- `actualDate`: Fecha real de juego
- `status`: Estado (programada, en curso, finalizada, cancelada)
- `players`: Array de jugadores con puntuaciones
- `winner`: Referencia al ganador
- `duration`: Duración real de la partida

### Group (Grupo)
- `name`: Nombre del grupo
- `description`: Descripción
- `avatar`: Imagen del grupo
- `inviteCode`: Código único de invitación
- `admin`: Administrador del grupo
- `members`: Array de miembros con roles
- `settings`: Configuraciones del grupo
- `stats`: Estadísticas del grupo

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## ✅ Respuestas de la API

### Éxito:
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { }
}
```

### Error:
```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": []
}
```

## 📝 Notas

- ✅ La API de juegos está completamente implementada con integración a BoardGameGeek
- ✅ Sistema de caché MongoDB para mejorar rendimiento (consultas <100ms)
- ✅ Sistema de soft delete implementado
- ✅ Validación exhaustiva con express-validator
- ⏳ Los controladores de Matches están pendientes de implementación
- 🔒 Recuerda cambiar el `JWT_SECRET` en producción

## 👥 Equipo

- Manuel Arana
- Juan Felipe
- Víctor Gómez

## 📄 Licencia

MIT
