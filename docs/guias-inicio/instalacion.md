# 🚀 Guía de Instalación

Esta guía te ayudará a instalar y configurar **Tabletop Mastering** en tu máquina local para desarrollo.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Software | Versión Mínima | Recomendada | Descarga |
|----------|---------------|-------------|----------|
| **Node.js** | v20.0.0 | v20+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.0.0 | v10+ | Incluido con Node.js |
| **MongoDB** | v7.0 | v8+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | v2.30+ | Última | [git-scm.com](https://git-scm.com/) |

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version
# Debe mostrar: v20.x.x o superior

# Verificar npm
npm --version
# Debe mostrar: 9.x.x o superior

# Verificar MongoDB
mongod --version
# Debe mostrar: v7.x.x o superior

# Verificar Git
git --version
# Debe mostrar: git version 2.30.x o superior
```

---

## 📥 1. Clonar el Repositorio

```bash
# Clonar con HTTPS
git clone https://github.com/Trevictus/TabletopMastering.git

# O clonar con SSH (si tienes configurado)
git clone git@github.com:Trevictus/TabletopMastering.git

# Entrar al directorio
cd TabletopMastering
```

---

## 🗄️ 2. Configurar MongoDB

Tienes dos opciones para ejecutar MongoDB:

### Opción A: Docker (Recomendado)

**Ventajas:** Instalación rápida, aislamiento, fácil de gestionar

```bash
# Descargar e iniciar MongoDB con Docker
docker run -d \
  -p 27017:27017 \
  --name tabletop-mongodb \
  -v mongodb_data:/data/db \
  mongo:latest

# Verificar que está corriendo
docker ps | grep tabletop-mongodb

# Para detener MongoDB
docker stop tabletop-mongodb

# Para reiniciar MongoDB
docker start tabletop-mongodb

# Para ver logs
docker logs tabletop-mongodb
```

### Opción B: Instalación Local

**Windows:**
1. Descargar desde [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Ejecutar el instalador
3. Iniciar como servicio o ejecutar `mongod`

**macOS:**
```bash
# Con Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Añadir repositorio
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verificar Conexión a MongoDB

```bash
# Conectarse a MongoDB
mongosh

# Deberías ver algo como:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017
# Using MongoDB: 7.x.x

# Salir
exit
```

---

## 🔧 3. Configurar Backend

### 3.1 Instalar Dependencias del Backend

```bash
cd backend
npm install
```

Esto instalará todas las dependencias necesarias:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- express-validator
- cors
- dotenv
- axios
- xml2js
- morgan
- nodemon (dev)

### 3.2 Configurar Variables de Entorno

```bash
# Crear archivo .env desde el ejemplo
cp .env.example .env

# O crearlo manualmente
nano .env
```

Contenido del archivo `.env`:

```env
# ========================================
# CONFIGURACIÓN DEL SERVIDOR
# ========================================
PORT=3000
NODE_ENV=development

# ========================================
# BASE DE DATOS MONGODB
# ========================================
# Para Docker (si usaste la opción A)
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering

# Para instalación local
# MONGODB_URI=mongodb://127.0.0.1:27017/tabletop_mastering

# Para MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tabletop_mastering

# ========================================
# JSON WEB TOKEN (JWT)
# ========================================
# ⚠️ IMPORTANTE: Cambia esto en producción
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion_123456
JWT_EXPIRE=7d

# ========================================
# CORS (Frontend URL)
# ========================================
CLIENT_URL=http://localhost:5173
```

### 3.3 Verificar Conexión a Base de Datos

```bash
# Ejecutar script de prueba
node test-db-connection.js
```

Deberías ver:
```
✅ Conectado a MongoDB exitosamente
📊 Base de datos: tabletop_mastering
🔌 Host: localhost:27017
```

---

## 🖼️ 4. Configurar Frontend (Opcional)

```bash
# Desde la raíz del proyecto
cd frontend

# Instalar dependencias
npm install
```

### 4.1 Configurar Variables de Entorno del Frontend

```bash
# Crear archivo .env
cp .env.example .env
```

Contenido del archivo `frontend/.env`:

```env
# URL del backend
VITE_API_URL=http://localhost:3000
```

---

## ✅ 5. Verificar Instalación

### 5.1 Iniciar el Backend

```bash
# Desde la carpeta backend
cd backend

# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

Deberías ver:

```
╔═══════════════════════════════════════════════╗
║       🎲 TABLETOP MASTERING API 🎲           ║
╚═══════════════════════════════════════════════╝
🚀 Servidor corriendo en modo development
📡 Puerto: 3000
✅ MongoDB conectado: mongodb://localhost:27017/tabletop_mastering
🌐 URL: http://localhost:3000
```

### 5.2 Probar la API

Abre otra terminal y ejecuta:

```bash
# Health check
curl http://localhost:3000/health

# Debería responder:
# {"status":"OK","timestamp":"...","uptime":...}

# Información de la API
curl http://localhost:3000/

# Debería responder con información del proyecto
```

### 5.3 Iniciar el Frontend (Opcional)

```bash
# Desde la carpeta frontend
cd frontend

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🧪 6. Ejecutar Demo Interactiva

Para probar todas las funcionalidades rápidamente:

```bash
# Desde la raíz del proyecto
chmod +x demo.sh
./demo.sh
```

Este script:
- ✅ Creará usuarios de prueba
- ✅ Creará grupos
- ✅ Demostrará todas las funcionalidades
- ✅ Mostrará casos de éxito y error
- ⏱️ Duración: ~3 minutos

---

## 🛠️ Comandos Útiles

### Backend

```bash
cd backend

# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start

# Linting
npm run lint

# Formato
npm run format

# Pruebas
npm test
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa de build
npm run preview

# Linting
npm run lint
```

### MongoDB

```bash
# Conectar a MongoDB
mongosh

# Ver bases de datos
show dbs

# Usar base de datos
use tabletop_mastering

# Ver colecciones
show collections

# Ver usuarios
db.users.find().pretty()

# Ver grupos
db.groups.find().pretty()

# Limpiar base de datos (¡cuidado!)
db.dropDatabase()
```

### Docker (si usas MongoDB con Docker)

```bash
# Iniciar MongoDB
docker start tabletop-mongodb

# Detener MongoDB
docker stop tabletop-mongodb

# Ver logs
docker logs tabletop-mongodb

# Acceder al shell de MongoDB
docker exec -it tabletop-mongodb mongosh

# Eliminar contenedor (¡cuidado!)
docker rm -f tabletop-mongodb

# Eliminar volumen de datos (¡cuidado!)
docker volume rm mongodb_data
```

---

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Verificar que el puerto 3000 no esté en uso
lsof -i :3000

# Matar proceso si es necesario
kill -9 <PID>

# O cambiar el puerto en .env
PORT=3001
```

### Error de conexión a MongoDB

```bash
# Verificar que MongoDB esté corriendo
# Para Docker:
docker ps | grep mongo

# Para instalación local:
sudo systemctl status mongod

# Verificar la URI en .env
echo $MONGODB_URI
```

### Error: Cannot find module

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de permisos en Linux/Mac

```bash
# Dar permisos al script
chmod +x demo.sh
chmod +x backend/test-db-connection.js
```

### Puerto 5173 en uso (Frontend)

```bash
# Vite automáticamente usará el siguiente puerto disponible
# O puedes especificar uno diferente en vite.config.js
```

---

## 📚 Próximos Pasos

Una vez instalado correctamente:

1. 📖 Lee la [Guía de Inicio Rápido](./inicio-rapido.md)
2. 🧪 Revisa la [Documentación de API](../api/introduccion.md)
3. 🎬 Ejecuta la [Demo Interactiva](./demo-interactiva.md)
4. 👨‍💻 Consulta la [Guía de Desarrollo](../desarrollo/guia-contribucion.md)

---

## 🆘 ¿Necesitas Ayuda?

- 📖 [Documentación Completa](../README.md)
- 🐛 [Reportar un Bug](https://github.com/Trevictus/TabletopMastering/issues)
- 💬 [Discusiones](https://github.com/Trevictus/TabletopMastering/discussions)

---

**¡Feliz desarrollo! 🎲**
