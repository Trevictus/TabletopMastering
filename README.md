# 🎲 Tabletop Mastering

**Sistema de gestión de partidas de juegos de mesa**

[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)](https://github.com/Trevictus/TabletopMastering)
[![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)](https://github.com/Trevictus/TabletopMastering)
[![Node](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.8-success)](https://www.mongodb.com/)

## 📋 Descripción

Tabletop Mastering es una aplicación web para gestionar grupos de juego, organizar partidas de juegos de mesa y llevar un registro de sesiones. Permite a los jugadores conectar, planificar eventos y mantener estadísticas de sus partidas.

## ✨ Funcionalidades Implementadas

### 🔐 Autenticación y Usuarios
- ✅ Registro de usuarios con validaciones
- ✅ Login con JWT (duración: 7 días)
- ✅ Gestión de perfil de usuario
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Protección de rutas con middleware

### 👥 Gestión de Grupos
- ✅ Crear grupos de juego
- ✅ Código de invitación único (8 caracteres)
- ✅ Unirse a grupos mediante código
- ✅ Ver detalles y miembros del grupo
- ✅ Roles: Admin y Miembro

### 🎯 Próximamente
- ⏳ Catálogo de juegos
- ⏳ Programación de partidas
- ⏳ Sistema de confirmación de asistencia
- ⏳ Registro de resultados y estadísticas
- ⏳ Notificaciones
- ⏳ Interfaz de usuario (Frontend)

## 🚀 Estado del Proyecto

```
████████████████░░░░░░░░░░░░░░░░░░░░ 40% Completado

✅ Autenticación:     100%
✅ Usuarios:          100%
✅ Grupos:            100%
⏳ Juegos:              0%
⏳ Partidas:            0%
```

## 🛠️ Tecnologías

**Backend:**
- Node.js v20+
- Express.js v4.21.1
- MongoDB + Mongoose v8.8.3
- JWT (jsonwebtoken v9.0.2)
- Bcrypt.js v2.4.3
- Express Validator v7.2.0

**Herramientas:**
- Nodemon (desarrollo)
- Thunder Client (testing)
- Morgan (logging)
- CORS

## 📁 Estructura del Proyecto

```
TableTopMastering/
├── backend/
│   ├── config/          # Configuración (BD)
│   ├── controllers/     # Lógica de negocio
│   ├── middlewares/     # Autenticación, validación
│   ├── models/          # Esquemas de Mongoose
│   ├── routes/          # Rutas de la API
│   ├── utils/           # Utilidades
│   └── server.js        # Servidor principal
├── docs/                # Documentación
├── .vscode/            
│   └── thunder-tests/   # Colección de pruebas
├── DEMOSTRACION.md      # Documentación completa
├── README_COMPLETO.md   # Guía de instalación
└── demo.sh              # Script de demostración
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Iniciar servidor
```bash
npm run dev
```

### 4. Ejecutar demostración
```bash
# En la raíz del proyecto
./demo.sh
```

## 📊 Endpoints Disponibles

### Autenticación
```
POST   /api/auth/register    # Registrar usuario
POST   /api/auth/login       # Iniciar sesión
GET    /api/auth/me          # Obtener perfil (protegido)
PUT    /api/auth/profile     # Actualizar perfil (protegido)
```

### Grupos
```
POST   /api/groups           # Crear grupo (protegido)
GET    /api/groups           # Listar mis grupos (protegido)
GET    /api/groups/:id       # Ver grupo (protegido)
POST   /api/groups/join      # Unirse a grupo (protegido)
```

## 🧪 Pruebas

**Estado:** ✅ 10/10 pruebas pasadas (100%)

- ✅ Registro y login
- ✅ Gestión de perfil
- ✅ Creación de grupos
- ✅ Unión a grupos
- ✅ Validaciones
- ✅ Seguridad

**Métodos de prueba:**
1. 🎬 Script interactivo: `./demo.sh`
2. ⚡ Thunder Client: Ver colección en `.vscode/thunder-tests/`
3. 📝 Documentación: Ver `DEMOSTRACION.md`

## 🔒 Seguridad

- ✅ Contraseñas hasheadas (bcrypt)
- ✅ Autenticación JWT
- ✅ Validación de datos
- ✅ Rutas protegidas
- ✅ CORS configurado

## 📚 Documentación

- **[DEMOSTRACION.md](DEMOSTRACION.md)** - Documentación completa y detallada
- **[README_COMPLETO.md](README_COMPLETO.md)** - Guía de instalación completa
- **[backend/PRUEBAS_THUNDER_CLIENT.md](backend/PRUEBAS_THUNDER_CLIENT.md)** - Guía de pruebas
- **[backend/API_TESTS.md](backend/API_TESTS.md)** - Tests de API

## 🎯 Próximos Pasos

1. **Implementar módulo de Juegos**
   - Catálogo de juegos
   - CRUD completo
   - Búsqueda y filtros

2. **Implementar módulo de Partidas**
   - Programar partidas
   - Confirmar asistencia
   - Registrar resultados

3. **Desarrollar Frontend**
   - Interfaz de usuario
   - Dashboard
   - Vista de grupos

## 📞 Recursos

- **API Base:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **MongoDB:** mongodb://localhost:27017/tabletop_mastering

## 👨‍💻 Desarrollo

```bash
# Modo desarrollo
npm run dev

# Verificar base de datos
node test-db-connection.js

# Ejecutar demostración
./demo.sh
```

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE)

---

**🎲 Tabletop Mastering - Organiza tus partidas de juegos de mesa 🎲**

*Estado: 🟢 Funcional | Versión: 1.0.0 | Última actualización: 7 Nov 2025*
```  
## Descripción general

**Tabletop-Mastering** es una aplicación web desarrollada con el stack **MERN (MongoDB, Express, React y Node.js)** cuyo objetivo es facilitar la organización y registro de partidas de juegos de mesa entre amigos.  
La plataforma permite gestionar el catálogo de juegos del grupo, planificar partidas desde un calendario interactivo y registrar los resultados de cada sesión, generando estadísticas, rankings y logros personalizados.

El propósito de **Tabletop-Mastering** es ofrecer una experiencia moderna, fluida y social para los jugadores, centralizando toda la información del grupo en una sola aplicación.  
Además, integra funcionalidades inteligentes como autocompletado de datos mediante API externas y un sistema de puntos y logros para mantener la motivación y la competitividad entre los miembros.

## 📄 Documentación del proyecto
| Documento | Descripción | Enlace |
|------------|--------------|--------|
| **Objetivos-enlace.md** | Contiene los requisitos funcionales y técnicos del proyecto. | [Ver documento](./docs/objetivos-enlace.md) |
| **Problema.md** | Incluye la arquitectura del sistema y los diagramas principales. | [Ver documento](./docs/problema.md) |
| **Recursos.md** | Expone el esquema y diagrama de la base de datos. | [Ver documento](./docs/recursos.md) |
| **Viabilidad-tecnica.md** | Análisis de riesgos, mitigaciones y capacidades del equipo. | [Ver documento](./docs/viabilidad-tecnica.md) |
> Todos los documentos se encuentran en la carpeta `/docs`.


## 🤝 Equipo formado por alumno(s):  
**Juan Felipe Arias Aguirrez** | Jeréz, 23 años, organizador y planificador.  
**Manuel Arana** | Jeréz, 25 años, desarrollador resolutivo y estructural.   
**Víctor Gómez Tejada** | Cádiz, 33 años, creativo y mediador en la dinámica grupal.
