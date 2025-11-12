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
npm run dev
```

### Modo producción:

```bash
npm start
```

### Linter:

```bash
npm run lint        # Revisar errores
npm run lint:fix    # Corregir errores automáticamente
```

### Formatear código:

```bash
npm run format
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del proyecto

```
backend/
├── config/
│   └── database.js         # Configuración de MongoDB
├── controllers/
│   ├── authController.js   # Lógica de autenticación
│   └── groupController.js  # Lógica de grupos
├── middlewares/
│   ├── auth.js             # Middleware de autenticación JWT
│   ├── validator.js        # Validación de datos
│   └── errorHandler.js     # Manejo de errores
├── models/
│   ├── User.js             # Modelo de Usuario
│   ├── Game.js             # Modelo de Juego
│   ├── Match.js            # Modelo de Partida
│   └── Group.js            # Modelo de Grupo
├── routes/
│   ├── authRoutes.js       # Rutas de autenticación
│   ├── groupRoutes.js      # Rutas de grupos
│   ├── gameRoutes.js       # Rutas de juegos (pendiente)
│   └── matchRoutes.js      # Rutas de partidas (pendiente)
├── utils/
│   └── generateToken.js    # Utilidad para generar JWT
├── .env                    # Variables de entorno
├── .env.example            # Ejemplo de variables
├── .gitignore              # Archivos ignorados por Git
├── .eslintrc.json          # Configuración de ESLint
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

### Juegos (`/api/games`) - ⏳ Pendiente

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/` | Añadir juego | ✅ |
| GET | `/` | Listar juegos | ✅ |
| GET | `/:id` | Obtener juego | ✅ |
| PUT | `/:id` | Actualizar juego | ✅ |
| DELETE | `/:id` | Eliminar juego | ✅ |

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

## 🧪 Testing

```bash
npm test
```

*(Por implementar)*

## 📝 Notas

- Los controladores de Games y Matches están pendientes de implementación
- Las rutas están preparadas pero sin controladores
- Recuerda cambiar el `JWT_SECRET` en producción
- La base de datos se crea automáticamente al conectar

## 👥 Equipo

- Manuel Arana
- Juan Felipe
- Víctor Gómez

## 📄 Licencia

MIT
