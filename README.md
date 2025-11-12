# 🎲 Tabletop Mastering

> **Sistema completo de gestión de partidas de juegos de mesa**

[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo%20Activo-green)](https://github.com/Trevictus/TabletopMastering)
[![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)](https://github.com/Trevictus/TabletopMastering)
[![Node](https://img.shields.io/badge/Node.js-20%2B-success)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF)](https://vite.dev/)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-yellow)](LICENSE)

---

## 📖 Descripción

**Tabletop Mastering** es una aplicación web diseñada para grupos de jugadores de mesa que desean:

- 📅 Organizar y programar partidas
- 📊 Llevar registro de resultados y estadísticas
- 🎮 Gestionar catálogo de juegos con integración BoardGameGeek
- 👥 Administrar grupos con códigos de invitación
- 🏆 Ver rankings y progreso personal

---

## ✨ Características Destacadas

### ✅ Implementado

- 🔐 **Autenticación completa** - JWT con expiración de 7 días, bcrypt para contraseñas
- 👥 **Gestión de grupos** - Sistema de roles (Admin/Miembro), códigos únicos de 8 caracteres
- 🎮 **Catálogo de juegos** - Integración completa con BoardGameGeek API
  - Búsqueda en BGG con paginación
  - Importación automática de datos
  - Creación de juegos personalizados
  - Estadísticas por grupo
- 🔍 **Búsqueda avanzada** - Filtros múltiples, paginación eficiente
- 🔒 **Seguridad robusta** - Bcrypt (10 rounds), validaciones, protección de rutas, CORS
- 📚 **Documentación completa** - API docs, guías de instalación, ejemplos de uso
- 🐳 **Docker ready** - Dockerfiles para backend y frontend

### 🚧 En Desarrollo Activo

- 🎲 **Sistema de partidas** - Registro de partidas, asistencias, calendario (30% completado)
- 🎨 **Interfaz de usuario** - React 19 + Vite 7 + React Router v7 (50% completado)
  - ✅ Componentes base (Button, Input, Card, Loading)
  - ✅ Layout (Navbar)
  - ✅ Sistema de rutas (ProtectedRoute, PublicRoute)
  - ✅ Páginas principales (Home, Login, Register, Dashboard, Profile)
  - ✅ Context API para autenticación
  - 🚧 Integración completa con API

### ⏳ Planificado

- 📊 Estadísticas y rankings avanzados
- � Sistema de logros y badges
- 🔔 Sistema de notificaciones en tiempo real
- 📱 Progressive Web App (PWA)
- 🌐 Internacionalización (i18n)

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** v20.0.0 o superior
- **MongoDB** v7.0+ (local o MongoDB Atlas)
- **npm** v9+ o **yarn**
- **Git** para clonar el repositorio

### Instalación Rápida (3 Pasos)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering

# 2. ejecutar el backend
cd backend
npm install
npm run dev

# 3. (En otra terminal) Configurar y ejecutar el frontend
cd frontend
npm install
npm run dev
```

### Configuración del .env (Backend)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering
# O usa MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tabletop_mastering

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Demo Interactiva

```bash
# Ejecuta el script de demostración desde la raíz del proyecto
chmod +x demo.sh
./demo.sh
```

Este script te guiará por todas las funcionalidades del sistema.

📖 **[Guía de instalación completa →](docs/guias-inicio/instalacion.md)**  
📖 **[Inicio rápido detallado →](docs/guias-inicio/inicio-rapido.md)**

---

## 📊 Estado del Proyecto

**Última actualización:** 12 de noviembre de 2025

```
████████████████████████░░░░░░░░░░░░ 60% Completado

✅ Autenticación:       100% ⭐ JWT + Bcrypt
✅ Usuarios:            100% ⭐ Perfiles completos
✅ Grupos:              100% ⭐ Roles y códigos
✅ Juegos:              100% ⭐ Integración BGG
🚧 Partidas:             30% En desarrollo
🚧 Frontend:             50% React + Vite + Router
⏳ Estadísticas:         20% Planificado
⏳ Notificaciones:        0% Pendiente
```

**[Ver estado detallado →](docs/introduccion/estado-del-proyecto.md)**

---

## 🛠️ Stack Tecnológico

### Backend
```
Node.js 20+ + Express 4.21
MongoDB 8.8 + Mongoose
JWT + Bcrypt + Express Validator
BoardGameGeek API (XML)
Morgan para logging
```

### Frontend
```
React 19.2 + Vite 7.2
React Router v7.9
Axios + Context API
CSS Modules + Variables
React Icons
```

### DevOps & Herramientas
```
Docker + Dockerfiles
ESLint + Prettier
Nodemon para desarrollo
Thunder Client para testing API
Git + GitHub
```

---

## 📚 Documentación

Documentación completa disponible en **[`/docs`](docs/README.md)**

### 🎯 Lectura Recomendada

| Documento | Descripción |
|-----------|-------------|
| **[Visión General](docs/introduccion/vision-general.md)** | ¿Qué es el proyecto? |
| **[Instalación](docs/guias-inicio/instalacion.md)** | Setup completo paso a paso |
| **[Inicio Rápido](docs/guias-inicio/inicio-rapido.md)** | Empieza en 5 minutos |
| **[API Docs](docs/api/introduccion.md)** | Documentación de endpoints |
| **[Estado](docs/introduccion/estado-del-proyecto.md)** | Progreso y roadmap |

### 📖 Por Secciones

- **[Introducción](docs/introduccion/)** - Contexto y objetivos del proyecto
- **[Guías de Inicio](docs/guias-inicio/)** - Instalación y configuración
- **[Arquitectura](docs/arquitectura/)** - Diseño técnico del sistema
- **[API](docs/api/)** - Documentación completa de endpoints
- **[Desarrollo](docs/desarrollo/)** - Guías para contribuir
- **[Frontend](docs/frontend/)** - Documentación de la UI
- **[Anexos](docs/anexos/)** - Recursos y referencias

---

## 🌐 API Endpoints

### 🔐 Autenticación
```http
POST   /api/auth/register    # Registrar nuevo usuario
POST   /api/auth/login       # Iniciar sesión (JWT)
GET    /api/auth/me          # Obtener perfil actual (requiere auth)
PUT    /api/auth/profile     # Actualizar perfil (requiere auth)
```

### 👥 Grupos
```http
POST   /api/groups              # Crear grupo nuevo
GET    /api/groups              # Listar mis grupos
GET    /api/groups/:id          # Ver detalles del grupo
PUT    /api/groups/:id          # Actualizar grupo (solo admin)
DELETE /api/groups/:id          # Eliminar grupo (solo admin)
POST   /api/groups/:id/join     # Unirse con código
POST   /api/groups/:id/leave    # Salir del grupo
```

### 🎮 Juegos
```http
GET    /api/games/search-bgg/:query    # Buscar en BoardGameGeek
POST   /api/games/add-from-bgg         # Importar juego desde BGG
POST   /api/games                      # Crear juego personalizado
GET    /api/games                      # Listar juegos del grupo
GET    /api/games/:id                  # Ver detalles del juego
PUT    /api/games/:id                  # Actualizar juego
DELETE /api/games/:id                  # Eliminar juego
GET    /api/games/stats/:groupId       # Estadísticas de juegos
```

### 🎲 Partidas (En desarrollo)
```http
POST   /api/matches             # Crear partida
GET    /api/matches             # Listar partidas
GET    /api/matches/:id         # Ver detalles
PUT    /api/matches/:id         # Actualizar partida
DELETE /api/matches/:id         # Eliminar partida
```

**[Ver documentación completa de API →](backend/GAMES_API_DOCS.md)**

---

## 🧪 Testing y Validación

### Demo Interactiva
```bash
# Ejecutar script de demostración completo
chmod +x demo.sh
./demo.sh
```

### Testing Manual con Thunder Client
```bash
# Importar colección en VS Code
# Archivo: .vscode/thunder-tests/
# Incluye todas las peticiones pre-configuradas
```

### Tests Automatizados
```bash
# Backend
cd backend
npm test                        # Ejecutar tests
npm run test:coverage           # Con cobertura de código

# Frontend
cd frontend
npm test                        # Ejecutar tests de componentes
```

### Estado de Tests
- ✅ **API Tests**: Endpoints validados manualmente
- ✅ **Integración BGG**: Búsqueda e importación funcionando
- ✅ **Validaciones**: Express Validator en todos los endpoints
- 🚧 **Tests unitarios**: En desarrollo
- 🚧 **Tests E2E**: Planificado

**[Guía completa de pruebas →](docs/desarrollo/pruebas.md)**

---

## 🏗️ Estructura del Proyecto

```
TabletopMastering/
├── 📁 backend/              # API REST (Node.js + Express + MongoDB)
│   ├── 📁 controllers/      # Lógica de negocio
│   │   ├── authController.js
│   │   ├── gameController.js
│   │   └── groupController.js
│   ├── 📁 models/           # Esquemas de Mongoose
│   │   ├── User.js
│   │   ├── Group.js
│   │   ├── Game.js
│   │   └── Match.js
│   ├── 📁 routes/           # Definición de endpoints
│   │   ├── authRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── groupRoutes.js
│   │   └── matchRoutes.js
│   ├── 📁 middlewares/      # Auth, validación, errores
│   │   ├── auth.js
│   │   ├── validator.js
│   │   ├── gameValidator.js
│   │   └── errorHandler.js
│   ├── 📁 services/         # Servicios externos
│   │   └── bggService.js    # Integración BoardGameGeek
│   ├── 📁 config/           # Configuración
│   │   └── database.js
│   ├── 📁 utils/
│   │   └── generateToken.js
│   ├── 📄 server.js         # Punto de entrada
│   ├── 📄 package.json
│   └── 📄 Dockerfile
│
├── 📁 frontend/             # Interfaz de usuario (React + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/   # Componentes reutilizables
│   │   │   ├── common/      # Button, Input, Card, Loading
│   │   │   ├── layout/      # Navbar
│   │   │   └── routes/      # ProtectedRoute, PublicRoute
│   │   ├── 📁 pages/        # Vistas principales
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── Profile/
│   │   │   └── NotFound/
│   │   ├── 📁 services/     # Comunicación con API
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── gameService.js
│   │   │   ├── groupService.js
│   │   │   └── matchService.js
│   │   ├── 📁 context/      # Estado global
│   │   │   └── AuthContext.jsx
│   │   ├── 📁 styles/       # Estilos CSS
│   │   │   ├── variables.css
│   │   │   ├── components.css
│   │   │   └── layout.css
│   │   ├── 📁 utils/        # Utilidades
│   │   │   ├── validators.js
│   │   │   ├── errorHandler.js
│   │   │   └── dateUtils.js
│   │   ├── 📄 App.jsx       # Componente principal
│   │   └── 📄 main.jsx      # Punto de entrada
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 Dockerfile
│
├── 📁 docs/                 # Documentación completa
│   ├── 📁 introduccion/     # Visión general y objetivos
│   ├── 📁 guias-inicio/     # Instalación y configuración
│   ├── 📁 arquitectura/     # Diseño técnico
│   ├── 📁 api/              # Documentación de endpoints
│   ├── 📁 desarrollo/       # Guías para contribuir
│   └── 📁 anexos/           # Recursos adicionales
│
├── 📄 demo.sh               # Script de demostración
├── 📄 README.md             # Este archivo
└── 📄 LICENSE               # Licencia MIT
```

**[Estructura detallada →](docs/arquitectura/estructura-proyecto.md)**

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este es un proyecto educativo en desarrollo activo.

### 📋 Cómo Contribuir

1. **Fork** el repositorio
2. **Clona** tu fork localmente
   ```bash
   git clone https://github.com/tu-usuario/TabletopMastering.git
   ```
3. **Crea una rama** para tu feature
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
4. **Realiza tus cambios** siguiendo las convenciones del proyecto
5. **Commit** con mensajes descriptivos
   ```bash
   git commit -m 'feat: añade nueva funcionalidad X'
   ```
6. **Push** a tu fork
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
7. **Abre un Pull Request** describiendo los cambios

### 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `style:` - Formato, punto y coma, etc.
- `refactor:` - Refactorización de código
- `test:` - Añadir o modificar tests
- `chore:` - Mantenimiento, dependencias

### 🎯 Áreas de Contribución

- 🐛 **Bug fixes** - Reporta o corrige errores
- ✨ **Nuevas features** - Implementa funcionalidades del roadmap
- 📚 **Documentación** - Mejora o traduce docs
- 🧪 **Testing** - Añade tests unitarios o E2E
- 🎨 **UI/UX** - Mejora la interfaz de usuario
- ♿ **Accesibilidad** - Mejora la accesibilidad

### 📖 Recursos

- **[Guía de Contribución](docs/desarrollo/guia-contribucion.md)** (si existe)
- **[Código de Conducta](docs/CODE_OF_CONDUCT.md)** (planificado)
- **[Issues](https://github.com/Trevictus/TabletopMastering/issues)** - Tareas pendientes

---

## 🗺️ Roadmap

### ✅ Fase 1: Backend API Core (COMPLETADA - Nov 2025)
- [x] Sistema de autenticación con JWT
- [x] Gestión completa de usuarios y perfiles
- [x] Sistema de grupos con roles y códigos
- [x] Gestión de juegos con integración BoardGameGeek
- [x] Middleware de seguridad y validación
- [x] Documentación de API

### 🚧 Fase 2: Frontend Base (EN PROGRESO - Nov-Dic 2025)
- [x] Setup React 19 + Vite 7
- [x] Sistema de rutas con React Router v7
- [x] Componentes base reutilizables
- [x] Context API para autenticación
- [x] Páginas principales (Home, Login, Register, Dashboard, Profile)
- [ ] Integración completa con backend
- [ ] Componentes de gestión de grupos
- [ ] Componentes de catálogo de juegos
- [ ] Responsive design completo

### 📅 Fase 3: Sistema de Partidas (PLANIFICADA - Dic 2025-Ene 2026)
- [ ] Modelo de datos de partidas
- [ ] CRUD completo de partidas
- [ ] Sistema de asistencias y confirmaciones
- [ ] Registro detallado de resultados
- [ ] Calendario de partidas
- [ ] Historial de partidas por grupo/jugador

### 🚀 Fase 4: Funcionalidades Avanzadas (PLANIFICADA - Ene-Feb 2026)
- [ ] Sistema de estadísticas avanzadas
- [ ] Rankings y leaderboards
- [ ] Sistema de logros y badges
- [ ] Gráficos y visualizaciones
- [ ] Filtros y búsqueda avanzada
- [ ] Exportación de datos (PDF, CSV)

### 🎯 Fase 5: Mejoras y Optimización (PLANIFICADA - Feb-Mar 2026)
- [ ] Sistema de notificaciones en tiempo real
- [ ] Progressive Web App (PWA)
- [ ] Optimización de rendimiento
- [ ] Internacionalización (i18n)
- [ ] Tests E2E completos
- [ ] Despliegue en producción

**Fecha objetivo MVP:** 31 de enero de 2026  
**[Roadmap completo y detallado →](docs/introduccion/objetivos.md)**

---

## 📊 Métricas del Proyecto

| Categoría | Métrica | Valor | Estado |
|-----------|---------|-------|--------|
| **Backend** | Endpoints Implementados | 26+ endpoints | ✅ Funcional |
| **Backend** | Modelos de Datos | 4 modelos (User, Group, Game, Match) | ✅ Completo |
| **Backend** | Integraciones Externas | BGG API (XML) | ✅ Funcional |
| **Frontend** | Componentes | 15+ componentes | 🚧 En desarrollo |
| **Frontend** | Páginas | 6 páginas principales | ✅ Estructurado |
| **Frontend** | Servicios API | 4 servicios (auth, game, group, match) | ✅ Completo |
| **Seguridad** | Autenticación | JWT + Bcrypt | ✅ Implementado |
| **Seguridad** | Validación | Express Validator | ✅ Implementado |
| **Seguridad** | Protección CORS | Configurado | ✅ Activo |
| **Testing** | Cobertura | Manual con Thunder Client | 🚧 Parcial |
| **Documentación** | Completitud | 85%+ | ✅ Extensiva |
| **Performance** | Tiempo Respuesta API | <100ms promedio | ✅ Óptimo |
| **Código** | Líneas Backend | ~2000+ LOC | 📈 Creciendo |
| **Código** | Líneas Frontend | ~1500+ LOC | 📈 Creciendo |

### 📈 Progreso por Módulo

```
Backend API:         ████████████████████░░░░ 75%
Frontend:            ████████████░░░░░░░░░░░░ 50%
Base de Datos:       ████████████████████░░░░ 75%
Seguridad:           ████████████████████████ 100%
Integración BGG:     ████████████████████████ 100%
Documentación:       ████████████████████░░░░ 85%
Testing:             ███████████████░░░░░░░░░ 60%
```

---

## 🔒 Seguridad

El proyecto implementa múltiples capas de seguridad:

### 🔐 Autenticación y Autorización
- ✅ **JWT (JSON Web Tokens)** - Tokens con expiración de 7 días
- ✅ **Bcrypt** - Hashing de contraseñas con 10 salt rounds
- ✅ **Middleware de autenticación** - Protección de rutas sensibles
- ✅ **Sistema de roles** - Admin y Miembro en grupos

### 🛡️ Validación y Sanitización
- ✅ **Express Validator** - Validación de todos los inputs
- ✅ **Sanitización de datos** - Prevención de XSS
- ✅ **Validación de tipos** - MongoDB schema validation
- ✅ **Validación de permisos** - Middleware de autorización

### 🌐 Configuración de Red
- ✅ **CORS configurado** - Whitelist de orígenes permitidos
- ✅ **Headers de seguridad** - Protección contra ataques comunes
- ✅ **Rate limiting** - Prevención de DDoS (planificado)

### 🔍 Auditoría
- ✅ **Logging con Morgan** - Registro de todas las peticiones
- ✅ **Variables de entorno** - Secretos en .env
- ✅ **Sin vulnerabilidades críticas** - Dependencias actualizadas
- 🚧 **Análisis de seguridad** - Auditoría periódica planificada

**Política de seguridad:** Todas las contraseñas se hashean antes de almacenar, los tokens expiran automáticamente, y las rutas protegidas requieren autenticación válida.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

- GitHub: [@Trevictus](https://github.com/Trevictus)
- GitHub: [@Juanfu224](https://github.com/Juanfu224)
- GitHub: [@Aranaaa00](https://github.com/Aranaaa00)

### 🎓 Contexto del Proyecto

Este proyecto es parte del **Proyecto de Desarrollo de Aplicaciones Web (DAW)**, desarrollado como proyecto final educativo con el objetivo de:

- Aplicar conocimientos de desarrollo full-stack
- Implementar arquitectura MERN (MongoDB, Express, React, Node.js)
- Desarrollar una aplicación real con casos de uso prácticos
- Practicar metodologías ágiles y buenas prácticas de desarrollo
- Crear documentación técnica completa

---

## 🙏 Agradecimientos

- 🎲 **Comunidad de juegos de mesa** - Por la inspiración y feedback
- 📊 **[BoardGameGeek](https://boardgamegeek.com/)** - Por su increíble API y base de datos
- 💻 **Stack MERN** - MongoDB, Express, React, Node.js
- ⚡ **Vite Team** - Por el excelente build tool
- 🎨 **React Icons** - Por la librería de iconos
- 📚 **Open Source Community** - Por las herramientas y librerías
- 👥 **Testers y usuarios beta** - Por su tiempo y sugerencias

---

## 📞 Soporte y Contacto

### 📖 Documentación
- **[Documentación Completa](docs/README.md)** - Índice de toda la documentación
- **[Guía de Instalación](docs/guias-inicio/instalacion.md)** - Setup paso a paso
- **[FAQ](docs/anexos/faq.md)** - Preguntas frecuentes (planificado)

### 🐛 Reportar Problemas
- **[Reportar Bug](https://github.com/Trevictus/TabletopMastering/issues/new?template=bug_report.md)** - Informa de errores
- **[Solicitar Feature](https://github.com/Trevictus/TabletopMastering/issues/new?template=feature_request.md)** - Sugiere nuevas funcionalidades

### 💬 Comunidad
- **[Discussions](https://github.com/Trevictus/TabletopMastering/discussions)** - Preguntas y debates
- **[Issues](https://github.com/Trevictus/TabletopMastering/issues)** - Seguimiento de tareas

### 📧 Contacto Directo
Para consultas específicas, contacta a través de GitHub Issues o Discussions.

---

## 📈 Estado del Desarrollo

```
🟢 Backend API      - Funcional y estable
🟡 Frontend         - En desarrollo activo
🟡 Sistema Partidas - En implementación
🔴 Estadísticas     - Pendiente
🔴 Notificaciones   - Pendiente
```

**Última actualización:** 12 de noviembre de 2025  
**Próxima release estimada:** Diciembre 2025 (Frontend Beta)

---

<div align="center">

**⭐ Si te gusta el proyecto, dale una estrella ⭐**

**🎲 ¡Felices partidas! 🎲**

---

*Hecho con ❤️ para la comunidad de juegos de mesa*

</div>
