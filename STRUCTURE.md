# 📂 Estructura del Proyecto

Organización completa del proyecto Tabletop Mastering siguiendo las mejores prácticas.

## 🌳 Árbol de Directorios

```
TabletopMastering/
│
├── 📄 README.md                    # Documentación principal del proyecto
├── 📄 CONTRIBUTING.md              # Guía para contribuidores
├── 📄 LICENSE                      # Licencia MIT
├── 📄 docker-compose.yml           # Orquestación de contenedores
├── 📄 nginx.conf                   # Configuración de Nginx
│
├── 📁 backend/                     # API REST - Node.js + Express
│   ├── 📄 README.md                   # Documentación del backend
│   ├── 📄 package.json                # Dependencias y scripts
│   ├── 📄 server.js                   # Punto de entrada del servidor
│   ├── 📄 Dockerfile                  # Imagen Docker del backend
│   │
│   ├── 📁 config/                     # Configuración
│   │   └── database.js                   # Conexión MongoDB
│   │
│   ├── 📁 controllers/                # Lógica de negocio
│   │   ├── authController.js             # Autenticación
│   │   ├── gameController.js             # Juegos
│   │   ├── groupController.js            # Grupos
│   │   └── cacheController.js            # Caché
│   │
│   ├── 📁 middlewares/                # Middleware personalizado
│   │   ├── auth.js                       # Autenticación JWT
│   │   ├── gameValidator.js              # Validación de juegos
│   │   ├── groupAuth.js                  # Autorización de grupos
│   │   ├── validator.js                  # Validación genérica
│   │   └── errorHandler.js               # Manejo de errores
│   │
│   ├── 📁 models/                     # Modelos de datos (Mongoose)
│   │   ├── User.js                       # Modelo de Usuario
│   │   ├── Game.js                       # Modelo de Juego
│   │   ├── Group.js                      # Modelo de Grupo
│   │   ├── Match.js                      # Modelo de Partida
│   │   └── BGGCache.js                   # Caché de BGG
│   │
│   ├── 📁 routes/                     # Rutas de la API
│   │   ├── authRoutes.js                 # /api/auth/*
│   │   ├── gameRoutes.js                 # /api/games/*
│   │   ├── groupRoutes.js                # /api/groups/*
│   │   └── matchRoutes.js                # /api/matches/*
│   │
│   ├── 📁 services/                   # Servicios externos
│   │   ├── bggService.js                 # Integración BGG
│   │   └── bggService.mock.js            # Mock para testing
│   │
│   ├── 📁 utils/                      # Utilidades
│   │   ├── generateToken.js              # JWT
│   │   └── groupHelpers.js               # Helpers
│   │
│   ├── 📁 tests/                      # ⭐ Tests automatizados
│   │   ├── test-db-connection.js         # Test de conexión
│   │   ├── test-games-comprehensive.sh   # 163 tests de juegos
│   │   └── test-groups-comprehensive.sh  # 16 tests de grupos
│   │
│   └── 📁 docs/                       # ⭐ Documentación técnica
│       ├── README.md                     # Índice de docs
│       ├── GAMES_API_DOCS.md             # API de juegos (completa)
│       └── TESTING.md                    # Guía de testing
│
├── 📁 frontend/                    # Aplicación React
│   ├── 📄 README.md                   # Documentación del frontend
│   ├── 📄 package.json                # Dependencias y scripts
│   ├── 📄 index.html                  # HTML principal
│   ├── 📄 vite.config.js              # Configuración Vite
│   ├── 📄 Dockerfile                  # Imagen Docker del frontend
│   │
│   ├── 📁 public/                     # Archivos estáticos
│   │
│   └── 📁 src/                        # Código fuente
│       ├── main.jsx                      # Punto de entrada
│       ├── App.jsx                       # Componente principal
│       │
│       ├── 📁 components/                # Componentes reutilizables
│       │   ├── 📁 common/                   # Componentes base
│       │   │   ├── Button.jsx                  # Botón
│       │   │   ├── Card.jsx                    # Tarjeta
│       │   │   ├── Input.jsx                   # Input
│       │   │   └── Loading.jsx                 # Loading
│       │   ├── 📁 layout/                   # Layout
│       │   │   └── Navbar.jsx                  # Barra de navegación
│       │   └── 📁 routes/                   # Rutas
│       │       ├── ProtectedRoute.jsx          # Ruta protegida
│       │       └── PublicRoute.jsx             # Ruta pública
│       │
│       ├── 📁 pages/                     # Páginas
│       │   ├── 📁 Home/                     # Página inicio
│       │   ├── 📁 Login/                    # Login
│       │   ├── 📁 Register/                 # Registro
│       │   ├── 📁 Dashboard/                # Dashboard
│       │   ├── 📁 Profile/                  # Perfil
│       │   └── 📁 NotFound/                 # 404
│       │
│       ├── 📁 context/                   # Contextos de React
│       │   └── AuthContext.jsx              # Contexto de autenticación
│       │
│       ├── 📁 services/                  # Servicios de API
│       │   ├── api.js                       # Configuración Axios
│       │   ├── authService.js               # Servicio de auth
│       │   ├── gameService.js               # Servicio de juegos
│       │   ├── groupService.js              # Servicio de grupos
│       │   └── matchService.js              # Servicio de partidas
│       │
│       ├── 📁 styles/                    # Estilos globales
│       │   ├── variables.css                # Variables CSS
│       │   ├── components.css               # Componentes
│       │   └── layout.css                   # Layout
│       │
│       └── 📁 utils/                     # Utilidades
│           ├── dateUtils.js                 # Utilidades de fechas
│           ├── errorHandler.js              # Manejo de errores
│           └── validators.js                # Validadores
│
└── 📁 docs/                        # ⭐ Documentación del proyecto
    ├── 📄 README.md                   # Índice general de documentación
    │
    ├── 📁 introduccion/               # Conceptos básicos
    │   ├── vision-general.md             # Qué es el proyecto
    │   ├── problema-y-solucion.md        # Problema que resuelve
    │   ├── objetivos.md                  # Objetivos SMART
    │   └── estado-del-proyecto.md        # Progreso actual
    │
    ├── 📁 guias-inicio/               # Guías de instalación
    │   ├── instalacion.md                # Setup completo
    │   ├── configuracion.md              # Configuración
    │   ├── inicio-rapido.md              # Quick start
    │   └── demo-interactiva.md           # Script de demo
    │
    ├── 📁 arquitectura/               # Diseño técnico
    │   ├── stack-tecnologico.md          # Tecnologías usadas
    │   ├── estructura-proyecto.md        # Organización
    │   └── base-de-datos.md              # Modelos de datos
    │
    ├── 📁 api/                        # Documentación de API
    │   └── introduccion.md               # Intro a la API REST
    │
    ├── 📁 desarrollo/                 # Guías de desarrollo
    │   └── pruebas.md                    # Testing
    │
    └── 📁 anexos/                     # Referencias
        ├── INDICE.md                     # Índice de anexos
        ├── recursos.md                   # Enlaces útiles
        ├── changelog.md                  # Cambios del proyecto
        ├── viabilidad-tecnica.md         # Análisis de viabilidad
        ├── decision-bgg-unica-fuente.md  # Decisiones de diseño
        ├── objetivos-enlace.md           # Objetivos enlazados
        └── problema.md                   # Análisis del problema
```

## 🎯 Organización por Propósito

### 📚 Documentación

**Ubicación:** `/docs/` y `/backend/docs/`

- **Documentación General** (`/docs/`)
  - Introducción al proyecto
  - Guías de instalación y configuración
  - Arquitectura del sistema
  - Información de alto nivel

- **Documentación Técnica** (`/backend/docs/`)
  - API de Juegos completa
  - Guía de testing
  - Documentación específica del backend

### 🧪 Testing

**Ubicación:** `/backend/tests/`

Todos los tests están centralizados:
- Scripts de tests automatizados
- Tests de integración
- Tests de conexión

**Scripts NPM:**
```bash
npm test              # Ejecuta tests de juegos
npm run test:db       # Test de conexión DB
npm run test:games    # Tests de API de juegos
npm run test:groups   # Tests de API de grupos
```

### 📁 Código Fuente

- **Backend:** `/backend/` - API REST organizada en capas (MVC)
- **Frontend:** `/frontend/src/` - React con arquitectura de componentes

## 🔗 Enlaces Rápidos

| Recurso | Ubicación |
|---------|-----------|
| 📖 Documentación Principal | [docs/README.md](./docs/README.md) |
| 🔧 Backend README | [backend/README.md](./backend/README.md) |
| 🎮 API de Juegos | [backend/docs/GAMES_API_DOCS.md](./backend/docs/GAMES_API_DOCS.md) |
| 🧪 Guía de Testing | [backend/docs/TESTING.md](./backend/docs/TESTING.md) |
| 🤝 Guía de Contribución | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| 📊 Estado del Proyecto | [docs/introduccion/estado-del-proyecto.md](./docs/introduccion/estado-del-proyecto.md) |

## ✨ Mejores Prácticas Implementadas

✅ **Separación de responsabilidades**
- Tests en carpeta dedicada
- Documentación organizada por tipo
- Código fuente estructurado por capas

✅ **Convenciones de nombres**
- Carpetas en minúsculas
- Archivos descriptivos
- Estructura predecible

✅ **Documentación accesible**
- README en cada nivel
- Enlaces cruzados entre documentos
- Índices claros

✅ **Testing organizado**
- Scripts centralizados
- Comandos npm predefinidos
- Documentación de cobertura

✅ **Escalabilidad**
- Estructura modular
- Fácil de extender
- Mantenimiento simplificado

## 🚀 Navegación Rápida

### Para Nuevos Desarrolladores
1. Lee el [README principal](./README.md)
2. Revisa la [Visión General](./docs/introduccion/vision-general.md)
3. Sigue la [Guía de Instalación](./docs/guias-inicio/instalacion.md)
4. Lee la [Guía de Contribución](./CONTRIBUTING.md)

### Para Trabajar con el Backend
1. [Backend README](./backend/README.md)
2. [Documentación de API](./backend/docs/GAMES_API_DOCS.md)
3. [Guía de Testing](./backend/docs/TESTING.md)

### Para Trabajar con el Frontend
1. [Frontend README](./frontend/README.md)
2. [Estructura del Frontend](#frontend-en-el-árbol-de-directorios)

---

💡 **Tip:** Esta estructura sigue las mejores prácticas de organización de proyectos Node.js y React, facilitando la navegación y el mantenimiento del código.
