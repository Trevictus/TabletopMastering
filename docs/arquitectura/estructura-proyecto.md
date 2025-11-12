# 📁 Estructura del Proyecto

## Visión General

```
TabletopMastering/
├── backend/              # API REST (Node.js + Express)
├── frontend/             # Interfaz de usuario (React + Vite)
├── docs/                 # Documentación completa
├── docs-old/             # Archivos antiguos de documentación (backup)
├── demo.sh               # Script de demostración interactiva
└── LICENSE               # Licencia MIT
```

## Backend (API REST)

```
backend/
├── config/
│   └── database.js           # Configuración de MongoDB
│
├── controllers/              # Lógica de negocio
│   ├── authController.js    # Autenticación y usuarios
│   ├── groupController.js   # Gestión de grupos
│   ├── gameController.js    # Gestión de juegos
│   └── matchController.js   # Gestión de partidas (WIP)
│
├── middlewares/              # Middleware de Express
│   ├── auth.js              # Verificación JWT
│   ├── validator.js         # Validaciones generales
│   ├── gameValidator.js     # Validaciones de juegos
│   └── errorHandler.js      # Manejo centralizado de errores
│
├── models/                   # Esquemas de Mongoose
│   ├── User.js              # Usuario
│   ├── Group.js             # Grupo
│   ├── Game.js              # Juego
│   └── Match.js             # Partida (WIP)
│
├── routes/                   # Definición de rutas
│   ├── authRoutes.js        # /api/auth/*
│   ├── groupRoutes.js       # /api/groups/*
│   ├── gameRoutes.js        # /api/games/*
│   └── matchRoutes.js       # /api/matches/* (WIP)
│
├── services/                 # Servicios externos
│   └── bggService.js        # Integración BoardGameGeek API
│
├── utils/                    # Utilidades
│   └── generateToken.js     # Generación de JWT
│
├── .env.example              # Plantilla de variables de entorno
├── package.json              # Dependencias y scripts
├── server.js                 # Punto de entrada
└── test-db-connection.js     # Script de prueba de BD
```

## Frontend (React)

```
frontend/
├── public/                   # Assets estáticos
│
├── src/
│   ├── assets/              # Imágenes, fonts, etc.
│   │
│   ├── components/          # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── common/         # Componentes comunes
│   │   ├── games/          # Componentes de juegos
│   │   ├── groups/         # Componentes de grupos
│   │   ├── layout/         # Layout (navbar, footer)
│   │   └── matches/        # Componentes de partidas
│   │
│   ├── context/             # Context API
│   │   └── AuthContext.jsx # Contexto de autenticación
│   │
│   ├── hooks/               # Custom hooks
│   │
│   ├── pages/               # Páginas/vistas principales
│   │   ├── auth/           # Login, registro
│   │   ├── games/          # Vista de juegos
│   │   ├── groups/         # Vista de grupos
│   │   ├── matches/        # Vista de partidas
│   │   └── profile/        # Perfil de usuario
│   │
│   ├── services/            # Servicios de API
│   │   ├── api.js          # Configuración base de axios
│   │   ├── authService.js  # Servicios de auth
│   │   ├── gameService.js  # Servicios de juegos
│   │   ├── groupService.js # Servicios de grupos
│   │   └── matchService.js # Servicios de partidas
│   │
│   ├── styles/              # Estilos CSS
│   │   ├── variables.css   # Variables CSS
│   │   ├── components.css  # Estilos de componentes
│   │   └── layout.css      # Estilos de layout
│   │
│   ├── utils/               # Utilidades
│   │   ├── dateUtils.js    # Utilidades de fechas
│   │   ├── errorHandler.js # Manejo de errores
│   │   └── validators.js   # Validadores
│   │
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos del App
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
│
├── .env.example              # Plantilla de variables
├── eslint.config.js          # Configuración ESLint
├── index.html                # HTML base
├── package.json              # Dependencias
└── vite.config.js            # Configuración de Vite
```

## Documentación

```
docs/
├── README.md                          # Índice principal
│
├── introduccion/                      # Contexto del proyecto
│   ├── vision-general.md             # Qué es, objetivos
│   ├── problema-y-solucion.md        # Problema que resuelve
│   ├── objetivos.md                  # Objetivos SMART, MVP
│   └── estado-del-proyecto.md        # Progreso actual
│
├── guias-inicio/                      # Primeros pasos
│   ├── instalacion.md                # Instalación completa
│   ├── configuracion.md              # Variables de entorno
│   ├── inicio-rapido.md              # Quick start
│   └── demo-interactiva.md           # Uso del demo.sh
│
├── arquitectura/                      # Diseño técnico
│   ├── stack-tecnologico.md          # Tecnologías usadas
│   ├── estructura-proyecto.md        # Este archivo
│   └── base-de-datos.md              # Modelos y esquemas
│
├── api/                               # Documentación de API
│   ├── introduccion.md               # Conceptos generales
│   ├── autenticacion.md              # Endpoints de auth
│   ├── grupos.md                     # Endpoints de grupos
│   ├── juegos.md                     # Endpoints de juegos
│   └── partidas.md                   # Endpoints de partidas
│
├── desarrollo/                        # Guías para desarrolladores
│   ├── guia-contribucion.md          # Cómo contribuir
│   ├── pruebas.md                    # Testing
│   ├── buenas-practicas.md           # Convenciones
│   └── herramientas.md               # Thunder Client, etc.
│
├── frontend/                          # Docs de frontend
│   ├── introduccion.md               # Overview
│   ├── componentes.md                # Componentes
│   ├── servicios.md                  # Servicios de API
│   └── estilos.md                    # Sistema de diseño
│
└── anexos/                            # Recursos adicionales
    ├── recursos.md                    # Enlaces útiles
    ├── viabilidad-tecnica.md          # Análisis técnico
    └── changelog.md                   # Historial de cambios
```

## Convenciones de Nombres

### Backend

- **Archivos**: camelCase (ej: `authController.js`)
- **Clases**: PascalCase (ej: `User`, `Group`)
- **Funciones**: camelCase (ej: `getUserById`)
- **Constantes**: UPPER_CASE (ej: `JWT_SECRET`)
- **Variables**: camelCase (ej: `userData`)

### Frontend

- **Componentes**: PascalCase (ej: `LoginForm.jsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useAuth`)
- **Utilidades**: camelCase (ej: `formatDate.js`)
- **Estilos**: kebab-case (ej: `auth-form.css`)

### Documentación

- **Archivos**: kebab-case (ej: `inicio-rapido.md`)
- **Imágenes**: kebab-case (ej: `arquitectura-sistema.png`)

## Patrones de Diseño

### Backend

- **MVC** (Model-View-Controller)
  - Models: Esquemas de datos
  - Controllers: Lógica de negocio
  - Routes: Rutas/endpoints (View implícita en API REST)

- **Middleware Pattern**
  - Autenticación
  - Validación
  - Manejo de errores

- **Service Pattern**
  - Servicios externos (BGG API)
  - Lógica compleja separada

### Frontend

- **Component-Based Architecture**
  - Componentes reutilizables
  - Separación de concerns
  - Props y composition

- **Context API**
  - Estado global
  - Evita prop drilling

- **Service Layer**
  - Separación de lógica de API
  - Reutilización de requests

## Puntos de Entrada

| Componente | Archivo | Puerto |
|------------|---------|--------|
| Backend API | `backend/server.js` | 3000 |
| Frontend Dev | `frontend/main.jsx` | 5173 |
| Documentación | `docs/README.md` | - |
| Demo | `demo.sh` | - |

## Referencias

- [Stack Tecnológico](./stack-tecnologico.md)
- [Base de Datos](./base-de-datos.md)
- [API - Introducción](../api/introduccion.md)
