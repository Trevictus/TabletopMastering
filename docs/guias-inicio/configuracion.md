# ⚙️ Configuración

Esta guía explica en detalle todas las opciones de configuración disponibles en Tabletop Mastering.

---

## 📁 Archivos de Configuración

### Backend

```
backend/
├── .env                    # Variables de entorno (NO commitear)
├── .env.example           # Plantilla de variables
├── config/
│   └── database.js        # Configuración de MongoDB
└── server.js              # Configuración de Express
```

### Frontend

```
frontend/
├── .env                    # Variables de entorno (NO commitear)
├── .env.example           # Plantilla de variables
└── vite.config.js         # Configuración de Vite
```

---

## 🔧 Variables de Entorno del Backend

### Archivo: `backend/.env`

#### Servidor

```env
# Puerto donde correrá el servidor
PORT=3000

# Entorno de ejecución: development | production | test
NODE_ENV=development
```

**Valores válidos para NODE_ENV:**
- `development` - Modo desarrollo (logs verbosos, sin optimizaciones)
- `production` - Modo producción (logs mínimos, optimizado)
- `test` - Modo testing (base de datos de pruebas)

#### Base de Datos

```env
# URI de conexión a MongoDB
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering
```

**Formatos de URI:**

**Local:**
```env
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering
MONGODB_URI=mongodb://127.0.0.1:27017/tabletop_mastering
```

**Docker:**
```env
# Usar 'host.docker.internal' si el backend está en Docker
MONGODB_URI=mongodb://host.docker.internal:27017/tabletop_mastering

# O la IP del contenedor de MongoDB
MONGODB_URI=mongodb://172.17.0.2:27017/tabletop_mastering
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/tabletop_mastering?retryWrites=true&w=majority
```

**Con autenticación:**
```env
MONGODB_URI=mongodb://username:password@localhost:27017/tabletop_mastering?authSource=admin
```

#### JSON Web Token (JWT)

```env
# Clave secreta para firmar tokens
# ⚠️ DEBE ser diferente en producción
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion

# Tiempo de expiración del token
JWT_EXPIRE=7d
```

**Valores válidos para JWT_EXPIRE:**
- `1h` - 1 hora
- `24h` - 24 horas
- `7d` - 7 días (recomendado)
- `30d` - 30 días
- `90d` - 90 días

**Generar JWT_SECRET seguro:**

```bash
# Con OpenSSL
openssl rand -base64 32

# Con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Con Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### CORS

```env
# URL del cliente frontend (para CORS)
CLIENT_URL=http://localhost:5173
```

**Múltiples URLs (separadas por coma):**
```env
CLIENT_URL=http://localhost:5173,http://localhost:3001,https://mi-app.com
```

#### Opcional: Rate Limiting

```env
# Límite de peticiones por ventana de tiempo
RATE_LIMIT_WINDOW_MS=900000      # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100      # 100 peticiones máx
```

#### Opcional: Logs

```env
# Nivel de logging: error | warn | info | debug
LOG_LEVEL=info

# Activar logs de Morgan en desarrollo
MORGAN_ENABLED=true
```

---

## 🎨 Variables de Entorno del Frontend

### Archivo: `frontend/.env`

```env
# URL de la API del backend
VITE_API_URL=http://localhost:3000

# Timeout para peticiones HTTP (ms)
VITE_API_TIMEOUT=10000

# Activar modo debug
VITE_DEBUG=true
```

---

## 🗄️ Configuración de Base de Datos

### Archivo: `backend/config/database.js`

```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Opciones de conexión
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,  // Timeout de conexión
      socketTimeoutMS: 45000,          // Timeout de socket
      family: 4                         // Usar IPv4
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};
```

### Opciones de Mongoose

| Opción | Valor | Descripción |
|--------|-------|-------------|
| `serverSelectionTimeoutMS` | 5000 | Tiempo máximo para conectar al servidor |
| `socketTimeoutMS` | 45000 | Tiempo máximo sin actividad antes de cerrar socket |
| `family` | 4 | Usar IPv4 (o 6 para IPv6) |
| `maxPoolSize` | 10 | Número máximo de conexiones en el pool |
| `minPoolSize` | 5 | Número mínimo de conexiones en el pool |

---

## 🌐 Configuración de Express

### CORS

**Archivo:** `backend/server.js`

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Body Parsers

```javascript
// JSON
app.use(express.json({ limit: '10mb' }));

// URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### Morgan (Logging HTTP)

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

**Formatos disponibles:**
- `dev` - Colorizado para desarrollo
- `combined` - Apache combined log format
- `common` - Apache common log format
- `short` - Más corto que default
- `tiny` - Mínimo output

---

## 🔐 Configuración de Seguridad

### Bcrypt (Hash de Contraseñas)

**Archivo:** `backend/models/User.js`

```javascript
const SALT_ROUNDS = 10;  // Coste de procesamiento

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**Valores recomendados para SALT_ROUNDS:**
- `10` - Balance entre seguridad y rendimiento (recomendado)
- `12` - Mayor seguridad, más lento
- `14` - Máxima seguridad, muy lento

### Headers de Seguridad

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## ⚡ Configuración de Vite (Frontend)

### Archivo: `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

---

## 🐳 Configuración para Docker

### Backend Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: tabletop_mastering

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/tabletop_mastering
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

**Usar:**
```bash
docker-compose up -d
```

---

## 🧪 Configuración para Testing

### Archivo: `backend/.env.test`

```env
NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering_test
JWT_SECRET=test_secret_key
JWT_EXPIRE=1h
CLIENT_URL=http://localhost:3000
```

**Cargar en tests:**
```javascript
require('dotenv').config({ path: '.env.test' });
```

---

## 📋 Plantilla Completa

### backend/.env.example

```env
# ========================================
# CONFIGURACIÓN DEL SERVIDOR
# ========================================
PORT=3000
NODE_ENV=development

# ========================================
# BASE DE DATOS MONGODB
# ========================================
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering

# ========================================
# JSON WEB TOKEN (JWT)
# ========================================
JWT_SECRET=CAMBIAR_ESTO_POR_UNA_CLAVE_SEGURA
JWT_EXPIRE=7d

# ========================================
# CORS (Frontend URL)
# ========================================
CLIENT_URL=http://localhost:5173

# ========================================
# OPCIONAL: RATE LIMITING
# ========================================
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX_REQUESTS=100

# ========================================
# OPCIONAL: LOGGING
# ========================================
# LOG_LEVEL=info
# MORGAN_ENABLED=true
```

---

## 🚨 Seguridad en Producción

### Checklist de Producción

- [ ] Cambiar `JWT_SECRET` por valor aleatorio y seguro
- [ ] Usar `NODE_ENV=production`
- [ ] Configurar MongoDB con autenticación
- [ ] Usar HTTPS (no HTTP)
- [ ] Configurar firewall
- [ ] Activar rate limiting
- [ ] Usar helmet para headers de seguridad
- [ ] No exponer `.env` en git (verificar `.gitignore`)
- [ ] Configurar backups de MongoDB
- [ ] Monitorizar logs y errores

### Generar configuración de producción

```bash
# Generar JWT_SECRET
openssl rand -base64 32

# Ejemplo de .env de producción
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tabletop
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
CLIENT_URL=https://mi-app.com
EOF
```

---

## 📚 Referencias

- [Guía de Instalación](./instalacion.md)
- [Inicio Rápido](./inicio-rapido.md)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de Vite](https://vitejs.dev/)
