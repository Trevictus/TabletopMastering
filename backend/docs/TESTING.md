# 🧪 Guía de Testing - Backend

## 📋 Resumen

El backend cuenta con una suite completa de **179 tests automatizados** que garantizan la calidad y funcionalidad de toda la API:

- **163 tests** de la API de juegos
- **16 tests** de la API de grupos
- **Tests de caché** y sistema MongoDB

## 🚀 Ejecutar Tests

### ⚠️ Prerequisito: Servidor debe estar corriendo

**Antes de ejecutar cualquier test, asegúrate de que el servidor esté corriendo en otra terminal.**

### Opción 1: Paso a paso (Recomendado para aprender)

```bash
# Terminal 1: Iniciar servidor con mock
cd backend
USE_BGG_MOCK=true npx nodemon server.js

# Terminal 2: Ejecutar tests (una vez que el servidor esté corriendo)
cd backend
./tests/test-games-comprehensive.sh    # 163 tests de juegos
./tests/test-groups-comprehensive.sh   # 16 tests de grupos
./tests/test-final.sh                  # Tests de caché
```

### Opción 2: Comando rápido con npm

```bash
# Terminal 1: Iniciar servidor
npm run dev:mock

# Terminal 2: Ejecutar todos los tests de juegos
npm test
```

⚠️ **Nota importante:** El comando `npm test` requiere que el servidor ya esté corriendo en otra terminal.

## 📦 Scripts de Testing Disponibles

### `test-games-comprehensive.sh`
**Descripción:** Suite completa de tests de la API de juegos (163 tests)  
**Uso:** `./tests/test-games-comprehensive.sh`  
**Duración:** ~2-3 minutos  
**Cubre:**
- Búsqueda en BGG (6 tests)
- Detalles de BGG (4 tests)
- Hot List BGG (5 tests)
- Añadir desde BGG (8 tests)
- Crear juegos personalizados (18 tests)
- Listar juegos (12 tests)
- Obtener juego (4 tests)
- Actualizar juego (9 tests)
- Sincronizar con BGG (4 tests)
- Estadísticas de grupo (3 tests)
- Eliminar juego (4 tests)
- Autenticación y permisos (3 tests)

### `test-groups-comprehensive.sh`
**Descripción:** Tests de la API de grupos (16 tests)  
**Uso:** `./tests/test-groups-comprehensive.sh`  
**Duración:** ~30 segundos  
**Cubre:**
- Registro de usuarios (2 tests)
- Crear grupos (1 test)
- Listar grupos (1 test)
- Obtener detalles de grupo (1 test)
- Unirse a grupos con código (1 test)
- Listar miembros (1 test)
- Actualizar grupo (1 test)
- Regenerar código de invitación (1 test)
- Expulsar miembros (2 tests)
- Salir del grupo (2 tests)
- Eliminar grupo (2 tests)
- Permisos y validaciones (integradas)

### `test-final.sh`
**Descripción:** Verificación final del sistema de caché MongoDB  
**Uso:** `./test-final.sh`  
**Cubre:**
- Servidor funcionando
- Endpoints de caché
- Modelo BGGCache
- Integración MongoDB

## 📊 Resultados Esperados

### Output Exitoso

```bash
═══════════════════════════════════════════════════
  RESULTADOS DE TESTS
═══════════════════════════════════════════════════

  Total de tests:         163
  Tests exitosos:         163
  Tests fallidos:         0

╔═══════════════════════════════════════════════════╗
║                                                   ║
║       ✅ TODOS LOS TESTS PASARON! 🎉             ║
║                                                   ║
╚═══════════════════════════════════════════════════╝

  Tasa de éxito:          100%
```

## 🎭 Sistema de Mock de BGG

### ¿Qué es?

Un servicio mock que simula la API de BoardGameGeek sin hacer llamadas reales a su servidor.

### ✅ Ventajas

- **Más rápido:** No hay latencia de red
- **Más confiable:** Datos consistentes y predecibles
- **Sin límites:** No consume rate limits de BGG
- **Offline:** Funciona sin conexión a internet
- **Mejor CI/CD:** Ideal para integración continua

### 🔧 Cómo activarlo

```bash
# Variable de entorno
export USE_BGG_MOCK=true

# O al iniciar el servidor
USE_BGG_MOCK=true npm run dev

# O en el .env
USE_BGG_MOCK=true
```

### 🎮 Juegos incluidos en el mock

- **Catan** (ID: 13) - Juego clásico de estrategia
- **Gloomhaven** (ID: 174430) - Juego cooperativo complejo
- **Wingspan** (ID: 266192) - Juego de motor
- Y juegos genéricos para IDs desconocidos

## 🐛 Troubleshooting

### Error: "Servidor no disponible"

```bash
# 1. Verificar que MongoDB esté corriendo
sudo systemctl status mongodb
sudo systemctl start mongodb

# 2. Iniciar el servidor
npm run dev:mock
```

### Error: "Puerto 3000 en uso"

```bash
# Encontrar y matar el proceso
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 npm run dev:mock
```

### Error: "Token inválido o expirado"

Los tests crean sus propios usuarios y tokens automáticamente. Si ves este error:

```bash
# Limpiar la base de datos de test
mongo tabletop_mastering --eval "db.users.deleteMany({email: /test/})"

# Reiniciar el servidor y volver a ejecutar
```

### Tests fallan por timeout

```bash
# Verificar conexión a MongoDB
mongo --eval "db.stats()"

# Aumentar timeout en el script (si es necesario)
# Editar el archivo test-*.sh y aumentar los valores de timeout
```

## 🧪 Pruebas Manuales Paso a Paso

### Preparación

```bash
# Terminal 1: Iniciar servidor
cd backend
USE_BGG_MOCK=true npx nodemon server.js
```

Abre una **segunda terminal** para los siguientes comandos:

### Paso 1: Verificar servidor

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2025-11-18T..."
}
```

### Paso 2: Probar conexión a base de datos

```bash
cd backend
node tests/test-db-connection.js
```

**Salida esperada:**
```
✅ ¡CONEXIÓN EXITOSA!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  Host: 172.18.0.2
📊 Base de datos: tabletop_mastering
...
```

### Paso 3: Registrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Prueba",
    "email": "prueba@test.com",
    "password": "Test1234"
  }' | python3 -m json.tool
```

**Guarda el token** de la respuesta en una variable:

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
```

### Paso 4: Buscar juego en BGG

```bash
curl http://localhost:3000/api/games/search-bgg?name=Catan \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Paso 5: Crear un grupo

```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Mi Grupo de Prueba",
    "description": "Grupo para probar la API"
  }' | python3 -m json.tool
```

**Guarda el groupId:**

```bash
export GROUP_ID="691c5c7fac8ee34c830736d8"
```

### Paso 6: Añadir juego desde BGG al grupo

```bash
curl -X POST http://localhost:3000/api/games/add-from-bgg \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bggId": 13,
    "groupId": "'$GROUP_ID'"
  }' | python3 -m json.tool
```

### Paso 7: Listar juegos del grupo

```bash
curl "http://localhost:3000/api/games?groupId=$GROUP_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Paso 8: Crear juego personalizado

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Mi Juego Personalizado",
    "description": "Un juego inventado por mí",
    "minPlayers": 2,
    "maxPlayers": 4,
    "playingTime": 60,
    "groupId": "'$GROUP_ID'"
  }' | python3 -m json.tool
```

### Paso 9: Obtener estadísticas del grupo

```bash
curl "http://localhost:3000/api/games/stats/$GROUP_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Paso 10: Ver estadísticas de caché

```bash
curl http://localhost:3000/api/games/cache/stats \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### ✅ Limpieza

Al terminar las pruebas:

```bash
# Detener el servidor (en la terminal 1)
Ctrl + C

# O si está en background
pkill -f "node server.js"
```

## 📝 Escribir Nuevos Tests

### Estructura básica

```bash
# 1. Crear usuario de prueba y obtener token
REGISTER=$(curl -s -X POST http://localhost:3000/api/auth/register ...)
TOKEN=$(echo "$REGISTER" | python3 -c "...")

# 2. Hacer la petición al endpoint
RESPONSE=$(curl -s -X GET http://localhost:3000/api/games \
  -H "Authorization: Bearer $TOKEN")

# 3. Verificar la respuesta
SUCCESS=$(echo "$RESPONSE" | python3 -c "...")
if [ "$SUCCESS" = "True" ]; then
  echo "✅ Test pasado"
  ((PASSED++))
else
  echo "❌ Test fallido"
  ((FAILED++))
fi
```

### Mejores prácticas

1. **Usa el mock de BGG** para tests predecibles
2. **Limpia los datos** creados durante el test
3. **Verifica códigos de estado HTTP** además del contenido
4. **Prueba casos edge** (valores límite, errores esperados)
5. **Usa emails únicos** con timestamp para evitar conflictos

## 📈 Cobertura de Tests

### Autenticación y Autorización
- ✅ Registro de usuarios
- ✅ Login
- ✅ Tokens JWT
- ✅ Protección de endpoints
- ✅ Permisos por grupo
- ✅ Roles de usuario

### Validación de Datos
- ✅ Campos requeridos
- ✅ Tipos de datos
- ✅ Longitudes mínimas/máximas
- ✅ Formatos válidos (email, URLs)
- ✅ Rangos numéricos
- ✅ Validación de arrays

### Lógica de Negocio
- ✅ Prevención de duplicados
- ✅ Soft delete
- ✅ Relaciones entre entidades
- ✅ Cálculo de estadísticas
- ✅ Sincronización con BGG
- ✅ Sistema de caché

### Integración Externa
- ✅ API de BoardGameGeek (mock)
- ✅ MongoDB
- ✅ Express middleware
- ✅ JWT authentication

## 🔄 Integración Continua

### GitHub Actions (ejemplo)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd backend
          npm install
      
      - name: Run tests
        run: |
          cd backend
          USE_BGG_MOCK=true npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/tabletop_test
```

## 📊 Métricas de Calidad

### Estado Actual

- **Total de tests:** 163
- **Tasa de éxito:** 100%
- **Cobertura estimada:** ~85%
- **Tiempo de ejecución:** ~2-3 minutos

### Objetivos

- Mantener 100% de tests pasando
- Añadir tests para nuevas funcionalidades
- Mejorar cobertura a >90%
- Reducir tiempo de ejecución a <2 minutos

## 🔗 Recursos Adicionales

- **GAMES_API_DOCS.md** - Documentación completa de endpoints
- **README.md** - Guía general del proyecto
- **package.json** - Scripts de npm disponibles

## 💡 Tips

1. **Ejecuta los tests antes de hacer commit**
   ```bash
   npm test && git commit
   ```

2. **Usa watch mode para desarrollo**
   ```bash
   npm run dev:mock  # En una terminal
   # Los tests se pueden ejecutar repetidamente en otra
   ```

3. **Verifica un endpoint específico**
   ```bash
   # Edita el script de test y comenta los demás tests
   # O crea un test-custom.sh para pruebas rápidas
   ```

4. **Debugging de tests**
   ```bash
   # Añade echo de las respuestas completas
   echo "$RESPONSE" | python3 -m json.tool
   ```
