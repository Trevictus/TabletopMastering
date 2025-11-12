# 🎬 Demo Interactiva

Esta guía explica cómo usar el script de demostración incluido en el proyecto.

---

## 📋 ¿Qué es el Script de Demo?

`demo.sh` es un script bash interactivo que demuestra **todas las funcionalidades** implementadas en Tabletop Mastering de forma automática.

### ✨ Características

- ✅ Ejecuta todas las funcionalidades paso a paso
- ✅ Crea usuarios de prueba automáticamente
- ✅ Muestra casos de éxito y error
- ✅ Output coloreado y fácil de seguir
- ✅ Pausas interactivas para revisar resultados
- ⏱️ Duración aproximada: 3-5 minutos

---

## 🚀 Cómo Ejecutar

### Requisitos Previos

1. Servidor backend corriendo en `http://localhost:3000`
2. `jq` instalado (para parsear JSON)
3. `curl` instalado (normalmente viene con el sistema)

### Instalar jq

**macOS:**
```bash
brew install jq
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install jq
```

**Windows (Git Bash):**
```bash
choco install jq
```

### Ejecutar el Script

```bash
# Dar permisos de ejecución
chmod +x demo.sh

# Ejecutar
./demo.sh
```

---

## 📖 ¿Qué Hace el Script?

### 1. Registro de Usuarios (3 usuarios)

Crea automáticamente:
- **Carlos López** - Administrador del grupo
- **Ana García** - Miembro
- **Pedro Martínez** - Miembro

### 2. Login y Autenticación

- Inicia sesión con cada usuario
- Obtiene tokens JWT
- Verifica que los tokens funcionan

### 3. Gestión de Perfil

- Obtiene perfil de usuario autenticado
- Actualiza información del perfil
- Muestra datos actualizados

### 4. Creación de Grupos

- Carlos crea el grupo "Los Estrategas"
- Genera código de invitación único
- Muestra detalles del grupo

### 5. Unirse a Grupos

- Ana se une usando el código de invitación
- Pedro se une al mismo grupo
- Verifica membresía de cada usuario

### 6. Gestión de Juegos

- Busca juegos en BoardGameGeek
- Importa juegos desde BGG
- Crea juegos personalizados
- Muestra estadísticas del grupo

### 7. Casos de Error y Validaciones

- Email duplicado
- Contraseña muy corta
- Token inválido
- Credenciales incorrectas
- Código de grupo inválido

---

## 📊 Output del Script

El script muestra información de cada operación:

```bash
═══════════════════════════════════════════════════
  1. REGISTRO DE USUARIOS
═══════════════════════════════════════════════════

▶ Registrando Usuario 1: Carlos López (Admin del grupo)
✅ Carlos registrado exitosamente
  ID: 6473e9f5a1b2c3d4e5f67890
  Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

▶ Registrando Usuario 2: Ana García (Miembro)
✅ Ana registrada exitosamente
  ID: 6473e9f5a1b2c3d4e5f67891
  Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

[...]
```

---

## 🎯 Personalizar el Script

Puedes modificar `demo.sh` para tus necesidades:

### Cambiar URL de la API

```bash
# En la línea 13
BASE_URL="http://tu-servidor.com:3000"
```

### Cambiar Datos de Usuarios

```bash
# En las líneas 96-110
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tu Nombre",
    "email": "tu@email.com",
    "password": "tu_password"
  }'
```

### Desactivar Pausas

```bash
# Comentar la línea de pause
# pause
```

### Guardar Resultados en Archivo

```bash
./demo.sh > resultados_demo.txt 2>&1
```

---

## 🧪 Verificar Resultados

Después de ejecutar el script, puedes verificar los datos en MongoDB:

```bash
mongosh

use tabletop_mastering

# Ver usuarios creados
db.users.find({email: {$regex: "demo"}}).pretty()

# Ver grupos creados
db.groups.find({name: "Los Estrategas"}).pretty()

# Ver juegos añadidos
db.games.find().pretty()
```

---

## 🔧 Solución de Problemas

### Error: "Servidor no está respondiendo"

```bash
# Verificar que el backend esté corriendo
cd backend
npm run dev
```

### Error: "jq: command not found"

```bash
# Instalar jq según tu sistema operativo
# Ver sección "Instalar jq" arriba
```

### Error: "Permission denied"

```bash
# Dar permisos de ejecución
chmod +x demo.sh
```

### Los usuarios ya existen

```bash
# Limpiar base de datos
mongosh

use tabletop_mastering
db.users.deleteMany({email: {$regex: "demo"}})
db.groups.deleteMany({name: "Los Estrategas"})
db.games.deleteMany({createdBy: {$exists: true}})
```

---

## 📋 Lista Completa de Operaciones

| # | Operación | Endpoint | Tipo |
|---|-----------|----------|------|
| 1 | Registro Carlos | `/api/auth/register` | POST |
| 2 | Registro Ana | `/api/auth/register` | POST |
| 3 | Registro Pedro | `/api/auth/register` | POST |
| 4 | Login Carlos | `/api/auth/login` | POST |
| 5 | Login Ana | `/api/auth/login` | POST |
| 6 | Perfil Carlos | `/api/auth/me` | GET |
| 7 | Actualizar perfil | `/api/auth/profile` | PUT |
| 8 | Crear grupo | `/api/groups` | POST |
| 9 | Listar grupos | `/api/groups` | GET |
| 10 | Ana se une | `/api/groups/:id/join` | POST |
| 11 | Pedro se une | `/api/groups/:id/join` | POST |
| 12 | Buscar en BGG | `/api/games/search-bgg` | GET |
| 13 | Añadir de BGG | `/api/games/add-from-bgg` | POST |
| 14 | Crear juego custom | `/api/games` | POST |
| 15 | Listar juegos | `/api/games` | GET |
| 16 | Estadísticas | `/api/games/stats/:groupId` | GET |
| 17 | Email duplicado (error) | `/api/auth/register` | POST |
| 18 | Password corta (error) | `/api/auth/register` | POST |
| 19 | Token inválido (error) | `/api/auth/me` | GET |
| 20 | Login fallido (error) | `/api/auth/login` | POST |

---

## 🎓 Propósito Educativo

Este script es útil para:

### Desarrolladores
- Ver todas las funcionalidades en acción
- Entender el flujo de la API
- Probar cambios rápidamente
- Debugging

### Evaluadores/Profesores
- Verificar funcionalidades implementadas
- Ver casos de éxito y error
- Comprobar validaciones
- Evaluar la robustez del sistema

### Usuarios Finales
- Entender cómo funciona la aplicación
- Ver ejemplos de uso
- Aprender sobre las funcionalidades

---

## 🚀 Alternativas

Si no quieres usar el script bash, tienes otras opciones:

### 1. Thunder Client (VS Code)

Colección pre-configurada en `.vscode/thunder-tests/`

1. Instalar extensión Thunder Client
2. Abrir Thunder Client
3. Ejecutar peticiones en orden

### 2. Postman

Importar colección desde Thunder Client o crear una nueva.

### 3. cURL Manual

Ver [API Tests](../../backend/API_TESTS.md) para ejemplos de cURL.

### 4. Frontend (cuando esté disponible)

Usar la interfaz web para interactuar con la API.

---

## 📚 Referencias

- [Inicio Rápido](./inicio-rapido.md)
- [Documentación de API](../api/introduccion.md)
- [Pruebas](../desarrollo/pruebas.md)

---

**¡Disfruta explorando Tabletop Mastering! 🎲**
