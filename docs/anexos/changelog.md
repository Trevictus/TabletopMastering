# 📝 Changelog

Historial de cambios y versiones del proyecto Tabletop Mastering.

---

## [1.0.0] - 2025-11-12

### 🎉 Primera Versión Estable

#### ✨ Añadido

**Backend - Autenticación (100%)**
- Sistema completo de registro y login
- Autenticación con JWT (duración: 7 días)
- Gestión de perfil de usuario
- Encriptación de contraseñas con bcrypt
- Middleware de protección de rutas
- Validación de datos con Express Validator

**Backend - Grupos (100%)**
- CRUD completo de grupos
- Sistema de códigos de invitación únicos (8 caracteres)
- Roles: Administrador y Miembro
- Unirse a grupos mediante código
- Gestión de miembros
- Validación de permisos por rol

**Backend - Juegos (100%)**
- Integración completa con BoardGameGeek API
- Búsqueda de juegos en BGG
- Obtención de detalles completos desde BGG
- Hot List de juegos populares
- Importación automática desde BGG con caché (30 días)
- Creación de juegos personalizados
- CRUD completo de juegos
- Sistema de sincronización manual con BGG
- Filtrado y búsqueda avanzada
- Paginación configurable (1-100 elementos)
- Estadísticas por grupo (top juegos, categorías)
- Soporte para juegos globales y por grupo

**Documentación**
- Reorganización completa de la documentación
- Estructura modular en `/docs`
- Guías de instalación y configuración
- Documentación completa de API
- Guías de inicio rápido
- Scripts de demostración
- Ejemplos de uso con Thunder Client

**Seguridad**
- Todas las contraseñas hasheadas con bcrypt (10 rounds)
- Autenticación con tokens JWT
- Validación exhaustiva de inputs
- Protección CORS
- Sanitización de datos
- Manejo centralizado de errores

#### 🔧 Técnico

- Node.js v20+
- Express.js v4.21.1
- MongoDB + Mongoose v8.8.3
- React 19 (frontend base)
- Vite 7+ (build tool)
- Axios para HTTP requests
- XML2JS para parsear BGG API

#### 📊 Métricas

- 26 endpoints implementados
- 31 tests pasando (100%)
- Tiempo de respuesta promedio: <100ms
- 0 vulnerabilidades críticas
- Documentación: 95% completa

---

## [0.4.0] - 2025-11-11

### ✨ Módulo de Juegos

**Añadido**
- Integración completa con BoardGameGeek API
- Modelo de datos de juegos con campos de BGG
- 13 endpoints nuevos para gestión de juegos
- Sistema de caché para datos de BGG
- Diferenciación entre juegos de BGG y personalizados

**Documentación**
- Documentación completa del módulo de juegos
- Guías de uso de la integración BGG
- Ejemplos de búsqueda e importación

---

## [0.3.0] - 2025-11-07

### ✨ Módulo de Grupos

**Añadido**
- CRUD completo de grupos
- Sistema de códigos de invitación
- Gestión de miembros y roles
- 7 endpoints de grupos

**Documentación**
- Documentación de API de grupos
- Ejemplos de uso

**Tests**
- 6 tests de grupos
- Casos de éxito y error

---

## [0.2.0] - 2025-11-06

### ✨ Sistema de Autenticación

**Añadido**
- Registro de usuarios
- Login con JWT
- Gestión de perfil
- Middleware de autenticación
- Validación de datos

**Seguridad**
- Encriptación de contraseñas con bcrypt
- Tokens JWT con expiración
- Validación de inputs
- Protección de rutas sensibles

**Documentación**
- Documentación de endpoints de auth
- Ejemplos con cURL
- Colección de Thunder Client

**Tests**
- 4 tests de autenticación
- Casos de error y validación

---

## [0.1.0] - 2025-11-01

### 🎉 Setup Inicial del Proyecto

**Añadido**
- Configuración de backend con Express
- Conexión a MongoDB con Mongoose
- Modelos iniciales (User, Group, Game, Match)
- Estructura de carpetas MVC
- Configuración de variables de entorno
- Scripts de desarrollo

**Documentación**
- README inicial
- Guía de instalación básica
- Estructura del proyecto

---

## Formato

Este changelog sigue el formato de [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)
y el proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

### Tipos de Cambios

- **Añadido** - Para funcionalidades nuevas
- **Cambiado** - Para cambios en funcionalidades existentes
- **Deprecado** - Para funcionalidades que se eliminarán pronto
- **Eliminado** - Para funcionalidades eliminadas
- **Arreglado** - Para corrección de bugs
- **Seguridad** - Para vulnerabilidades

---

## Roadmap (Próximas Versiones)

### [1.1.0] - Planificado para Diciembre 2025

**Añadir**
- Módulo completo de partidas
- Sistema de calendario
- Confirmación de asistencias
- Registro de resultados

### [1.2.0] - Planificado para Enero 2026

**Añadir**
- Frontend completo con React
- Interfaz de usuario
- Dashboard
- Vistas de grupos y juegos

### [1.3.0] - Planificado para Febrero 2026

**Añadir**
- Sistema de estadísticas avanzadas
- Rankings y tablas de clasificación
- Gráficos y visualizaciones

### [2.0.0] - Planificado para Marzo 2026

**Añadir**
- Sistema de logros y badges
- Notificaciones
- Integración con redes sociales
- Versión móvil

---

**Última actualización:** 12 de noviembre de 2025
