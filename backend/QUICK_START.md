# ⚡ Guía de Inicio Rápido - Backend

## 🎯 Para Desarrolladores Nuevos

### 1️⃣ Primera Vez - Instalación Completa

```bash
# 1. Ir al directorio del backend
cd /home/juanfu224/Documentos/MEGA/DAW/Proyecto/TableTopMastering/backend

# 2. Instalar dependencias
npm install

# 3. Verificar que MongoDB esté corriendo
sudo systemctl status mongod
# Si no está corriendo:
sudo systemctl start mongod

# 4. Verificar archivo .env (debe existir)
cat .env
# Si no existe, copiar del ejemplo:
cp .env.example .env

# 5. Probar conexión a base de datos
node test-db-connection.js
```

---

### 2️⃣ Iniciar el Servidor (Día a Día)

```bash
# Opción A: Modo desarrollo normal
cd backend
npx nodemon server.js

# Opción B: Modo desarrollo con mock de BGG (recomendado para testing)
cd backend
USE_BGG_MOCK=true npx nodemon server.js
```

**Verás esto cuando esté listo:**

```
╔═══════════════════════════════════════════════╗
║                                               ║
║       🎲 TABLETOP MASTERING API 🎲           ║
║                                               ║
╚═══════════════════════════════════════════════╝
🚀 Servidor corriendo en modo development
📡 Puerto: 3000
🌐 URL: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MongoDB conectado: 172.18.0.2
📊 Base de datos: tabletop_mastering
```

---

### 3️⃣ Verificar que Todo Funciona

**En una NUEVA terminal:**

```bash
# Verificar que el servidor responde
curl http://localhost:3000/health

# Debería devolver:
# {"success":true,"message":"Servidor funcionando correctamente",...}
```

---

## 🧪 Ejecutar Tests

### Opción 1: Tests Completos

```bash
# Terminal 1: Servidor debe estar corriendo
cd backend
USE_BGG_MOCK=true npx nodemon server.js

# Terminal 2: Ejecutar todos los tests
cd backend
./test-games-comprehensive.sh    # 163 tests (2-3 min)
./test-groups-comprehensive.sh   # 16 tests (30 seg)
./test-final.sh                  # Tests de caché
```

### Opción 2: Test Rápido con npm

```bash
# Terminal 1: Servidor corriendo
USE_BGG_MOCK=true npx nodemon server.js

# Terminal 2: Tests de juegos
npm test
```

---

## 🔧 Comandos Útiles del Día a Día

```bash
# Ver estado de MongoDB
sudo systemctl status mongod

# Iniciar/detener MongoDB
sudo systemctl start mongod
sudo systemctl stop mongod

# Ver qué está usando el puerto 3000
lsof -ti:3000

# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Detener el servidor si quedó en background
pkill -f "node server.js"

# Ver logs del servidor (si usas PM2)
pm2 logs

# Reiniciar servidor (si usas PM2)
pm2 restart tabletop-backend
```

---

## 🧪 Pruebas Manuales Rápidas

**Servidor debe estar corriendo primero!**

### 1. Verificar servidor
```bash
curl http://localhost:3000/health
```

### 2. Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }' | python3 -m json.tool
```

### 3. Guardar token y probar endpoint protegido
```bash
# Copia el token de la respuesta anterior
export TOKEN="tu_token_aquí"

# Buscar juego en BGG
curl http://localhost:3000/api/games/search-bgg?name=Catan \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## 🐛 Solución de Problemas Comunes

### ❌ "Cannot find module..."
```bash
# Instalar dependencias
npm install
```

### ❌ "Puerto 3000 ya en uso"
```bash
# Opción 1: Matar el proceso
lsof -ti:3000 | xargs kill -9

# Opción 2: Usar otro puerto
PORT=3001 npx nodemon server.js
```

### ❌ "MongoDB connection failed"
```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod
sudo systemctl start mongod

# Verificar la URI en .env
cat .env | grep MONGODB_URI
```

### ❌ "nodemon: command not found"
```bash
# Usar npx en lugar de llamar directamente
npx nodemon server.js

# O instalar globalmente (opcional)
npm install -g nodemon
```

### ❌ Tests fallan con "Servidor no disponible"
```bash
# 1. Asegúrate de que el servidor esté corriendo PRIMERO
USE_BGG_MOCK=true npx nodemon server.js

# 2. En otra terminal, ejecuta los tests
./test-games-comprehensive.sh
```

---

## 📚 Siguiente Paso

Una vez que tengas el servidor corriendo y los tests pasando:

1. Lee [TESTING.md](./TESTING.md) para pruebas detalladas
2. Consulta [GAMES_API_DOCS.md](./GAMES_API_DOCS.md) para API de juegos
3. Revisa [README.md](./README.md) para visión general del proyecto
4. Mira [DEPLOYMENT.md](./DEPLOYMENT.md) cuando necesites desplegar

---

## 💡 Tips

- **Usa el mock de BGG** durante desarrollo (`USE_BGG_MOCK=true`)
- **Deja el servidor corriendo** en una terminal mientras trabajas
- **Ejecuta tests** antes de hacer commit
- **Verifica el health endpoint** cuando algo no funcione

---

## 🆘 ¿Necesitas Ayuda?

- Consulta [DOC_INDEX.md](./DOC_INDEX.md) para índice completo de documentación
- Revisa la sección de Troubleshooting en [TESTING.md](./TESTING.md)
- Mira los ejemplos en [GAMES_API_DOCS.md](./GAMES_API_DOCS.md)
