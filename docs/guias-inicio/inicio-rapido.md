# ⚡ Inicio Rápido

¿Quieres empezar a usar Tabletop Mastering en menos de 5 minutos? ¡Sigue esta guía!

---

## 🎯 Requisitos Mínimos

- Node.js v20+
- MongoDB corriendo
- 5 minutos de tu tiempo ⏱️

---

## 🚀 Pasos Rápidos

### 1. Clonar e Instalar (2 minutos)

```bash
# Clonar repositorio
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering

# Instalar backend
cd backend
npm install
```

### 2. Configurar (1 minuto)

```bash
# Crear archivo .env
cat > .env << EOF
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering
JWT_SECRET=mi_secreto_temporal_123
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
EOF
```

### 3. Iniciar MongoDB

```bash
# Con Docker (opción rápida)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O si lo tienes instalado localmente
# mongod
```

### 4. Arrancar el Servidor (30 segundos)

```bash
# Desde la carpeta backend
npm run dev
```

Deberías ver:
```
🎲 TABLETOP MASTERING API 🎲
✅ MongoDB conectado
🚀 Servidor corriendo en: http://localhost:3000
```

### 5. ¡Probar! (1 minuto)

```bash
# En otra terminal, ejecutar demo
cd ..
chmod +x demo.sh
./demo.sh
```

---

## 🎮 Primera Prueba Manual

### Registrar un Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "password": "123456"
  }'
```

### Iniciar Sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@test.com",
    "password": "123456"
  }'
```

**¡Guarda el token que recibes!**

### Crear un Grupo

```bash
# Reemplaza TU_TOKEN con el token recibido
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "name": "Los Estrategas",
    "description": "Grupo de amigos jugadores"
  }'
```

---

## 🎯 Flujos de Trabajo Comunes

### Escenario 1: Añadir un juego desde BGG

```bash
# 1. Login (guarda el token)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"123456"}' \
  | jq -r '.data.token')

# 2. Buscar juego en BGG
curl -X GET "http://localhost:3000/api/games/search-bgg?name=Wingspan" \
  -H "Authorization: Bearer $TOKEN"

# 3. Añadir juego a tu grupo
curl -X POST http://localhost:3000/api/games/add-from-bgg \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bggId": 266192,
    "groupId": "TU_GROUP_ID"
  }'
```

### Escenario 2: Ver juegos de mi grupo

```bash
curl -X GET "http://localhost:3000/api/games?groupId=TU_GROUP_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Usar Thunder Client (VS Code)

Si usas VS Code, ya tienes todo configurado:

1. Instala la extensión "Thunder Client"
2. Abre Thunder Client desde la barra lateral
3. La colección se carga desde `.vscode/thunder-tests/`
4. Ejecuta las peticiones en orden:
   - Register User
   - Login
   - Create Group
   - Search Game BGG
   - Add Game from BGG

---

## 📱 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrar usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET` | `/api/auth/me` | Mi perfil |
| `POST` | `/api/groups` | Crear grupo |
| `GET` | `/api/groups` | Mis grupos |
| `GET` | `/api/games/search-bgg` | Buscar en BGG |
| `POST` | `/api/games/add-from-bgg` | Añadir de BGG |
| `GET` | `/api/games` | Listar juegos |

📖 **Documentación completa:** [API Docs](../api/introduccion.md)

---

## 🔍 Verificar que Todo Funciona

```bash
# Health check
curl http://localhost:3000/health
# Debe devolver: {"status":"OK",...}

# Info de la API
curl http://localhost:3000/
# Debe devolver info del proyecto
```

---

## 🎬 Demo Automática

La forma más rápida de ver todas las funcionalidades:

```bash
./demo.sh
```

Esto ejecutará automáticamente:
- ✅ Registro de usuarios
- ✅ Login
- ✅ Creación de grupos
- ✅ Búsqueda de juegos
- ✅ Casos de error y validaciones

**Duración:** ~3 minutos

---

## 🐛 ¿Algo no funciona?

### MongoDB no conecta
```bash
# Verificar que MongoDB está corriendo
docker ps | grep mongo
# o
sudo systemctl status mongod
```

### Puerto 3000 ocupado
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error "Cannot find module"
```bash
cd backend
rm -rf node_modules
npm install
```

---

## 📚 Siguientes Pasos

¡Ya tienes todo funcionando! Ahora puedes:

1. 📖 [Leer la documentación de API](../api/introduccion.md)
2. 🎮 [Ver cómo funcionan los juegos](../api/juegos.md)
3. 👨‍💻 [Aprender a contribuir](../desarrollo/guia-contribucion.md)
4. 🖼️ [Configurar el frontend](../../frontend/README.md)

---

## 💡 Consejos

- 🔑 Guarda siempre el token después del login
- 📝 Usa Thunder Client para no escribir curl manualmente
- 🎲 Prueba la integración con BGG buscando tus juegos favoritos
- 👥 Crea varios usuarios para probar la funcionalidad de grupos
- 📊 Revisa la documentación de API para ver todos los parámetros disponibles

---

**¡Listo para jugar! 🎲**
