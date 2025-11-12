# 🎲 Tabletop Mastering

> **Sistema completo de gestión de partidas de juegos de mesa**

[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo%20Activo-green)](https://github.com/Trevictus/TabletopMastering)
[![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)](https://github.com/Trevictus/TabletopMastering)
[![Node](https://img.shields.io/badge/Node.js-20%2B-success)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
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

- 🔐 **Autenticación completa** - JWT, registro, login, gestión de perfil
- 👥 **Gestión de grupos** - Crear, unirse, administrar con códigos únicos
- 🎮 **Catálogo de juegos** - Integración con BoardGameGeek API, juegos personalizados
- 🔍 **Búsqueda avanzada** - Filtros, paginación, estadísticas
- 🔒 **Seguridad robusta** - Bcrypt, validaciones, protección de rutas
- 📚 **Documentación completa** - API docs, guías, ejemplos

### ⏳ En Desarrollo

- 🎲 Módulo de partidas y calendario
- 📊 Estadísticas y rankings avanzados
- 🎨 Interfaz de usuario (React)
- 🔔 Sistema de notificaciones

---

## 🚀 Inicio Rápido

### Requisitos

- Node.js v20+
- MongoDB v7.0+
- npm v9+

### Instalación en 3 pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering

# 2. Instalar y configurar backend
cd backend
npm install
cp .env.example .env
# Edita .env con tu configuración

# 3. Iniciar
npm run dev
```

### Probar con Demo Interactiva

```bash
# Desde la raíz del proyecto
./demo.sh
```

📖 **[Guía de instalación completa →](docs/guias-inicio/instalacion.md)**

---

## 📊 Estado del Proyecto

```
████████████████████████░░░░░░░░░░░░ 60% Completado

✅ Autenticación:       100%
✅ Usuarios:            100%
✅ Grupos:              100%
✅ Juegos:              100% ⭐ Integración BGG
⏳ Partidas:             30%
⏳ Frontend:             10%
```

**[Ver estado detallado →](docs/introduccion/estado-del-proyecto.md)**

---

## 🛠️ Stack Tecnológico

### Backend
```
Node.js + Express + MongoDB
JWT + Bcrypt + Mongoose
BoardGameGeek API Integration
```

### Frontend
```
React 19 + Vite 7
Axios + Context API
CSS Variables
```

### Herramientas
```
Thunder Client
Docker
ESLint
Nodemon
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

### Autenticación
```http
POST   /api/auth/register    # Registrar usuario
POST   /api/auth/login       # Iniciar sesión
GET    /api/auth/me          # Obtener perfil
PUT    /api/auth/profile     # Actualizar perfil
```

### Grupos
```http
POST   /api/groups           # Crear grupo
GET    /api/groups           # Listar mis grupos
GET    /api/groups/:id       # Ver detalles
POST   /api/groups/:id/join  # Unirse con código
```

### Juegos
```http
GET    /api/games/search-bgg       # Buscar en BGG
POST   /api/games/add-from-bgg     # Importar desde BGG
POST   /api/games                  # Crear juego personalizado
GET    /api/games                  # Listar juegos
GET    /api/games/stats/:groupId   # Estadísticas
```

**[Ver documentación completa de API →](docs/api/introduccion.md)**

---

## 🧪 Testing

```bash
# Ejecutar demo interactiva
./demo.sh

# Usar Thunder Client (VS Code)
# Colección pre-configurada en .vscode/thunder-tests/

# Tests de API
cd backend
npm test
```

**Estado de tests:** ✅ 31/31 pasando (100%)

**[Guía de pruebas →](docs/desarrollo/pruebas.md)**

---

## 🏗️ Estructura del Proyecto

```
TabletopMastering/
├── backend/              # API REST (Node.js + Express)
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Esquemas de Mongoose
│   ├── routes/          # Definición de endpoints
│   ├── middlewares/     # Auth, validación, errores
│   ├── services/        # Integración BGG
│   └── config/          # Configuración
│
├── frontend/            # Interfaz de usuario (React)
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Vistas principales
│   │   ├── services/   # API calls
│   │   ├── context/    # Estado global
│   │   └── styles/     # CSS modular
│
├── docs/                # Documentación completa
│   ├── introduccion/
│   ├── guias-inicio/
│   ├── arquitectura/
│   ├── api/
│   ├── desarrollo/
│   ├── frontend/
│   └── anexos/
│
└── demo.sh              # Script de demostración
```

**[Estructura detallada →](docs/arquitectura/estructura-proyecto.md)**

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Lee la **[Guía de Contribución](docs/desarrollo/guia-contribucion.md)**
2. Haz fork del proyecto
3. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
4. Commit: `git commit -m 'feat: añade nueva funcionalidad'`
5. Push: `git push origin feature/nueva-funcionalidad`
6. Abre un Pull Request

---

## 🗺️ Roadmap

### ✅ Fase 1: Backend API (Completada)
- [x] Sistema de autenticación
- [x] Gestión de usuarios
- [x] Gestión de grupos
- [x] Gestión de juegos + BGG

### ⏳ Fase 2: Partidas (En progreso)
- [ ] Modelo de partidas
- [ ] CRUD completo
- [ ] Sistema de asistencias
- [ ] Registro de resultados

### 📅 Fase 3: Frontend (Planificada)
- [ ] Setup React + Vite
- [ ] Componentes principales
- [ ] Integración con API
- [ ] Sistema de rutas

### 🚀 Fase 4: Funcionalidades Avanzadas
- [ ] Estadísticas y rankings
- [ ] Sistema de logros
- [ ] Notificaciones
- [ ] Búsqueda avanzada

**[Roadmap completo →](docs/introduccion/objetivos.md)**

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Endpoints Implementados** | 26/35 (74%) |
| **Tests Pasando** | 31/31 (100%) |
| **Cobertura de Código** | ~85% |
| **Documentación** | 95% |
| **Tiempo Respuesta API** | <100ms promedio |
| **Integración BGG** | 100% funcional |

---

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt (10 rounds)
- ✅ Autenticación con JWT (7 días de expiración)
- ✅ Validación de datos con Express Validator
- ✅ Protección CORS configurada
- ✅ Sanitización de inputs
- ✅ Sin vulnerabilidades críticas detectadas

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Trevictus**
- GitHub: [@Trevictus](https://github.com/Trevictus)
- Proyecto: [TabletopMastering](https://github.com/Trevictus/TabletopMastering)

---

## 🙏 Agradecimientos

- Comunidad de juegos de mesa
- [BoardGameGeek](https://boardgamegeek.com/) por su increíble API
- Contribuidores y testers
- Comunidad open source

---

## 📞 Soporte

- 📖 [Documentación Completa](docs/README.md)
- 🐛 [Reportar Bug](https://github.com/Trevictus/TabletopMastering/issues)
- 💬 [Discusiones](https://github.com/Trevictus/TabletopMastering/discussions)

---

<div align="center">

**⭐ Si te gusta el proyecto, dale una estrella ⭐**

**🎲 ¡Felices partidas! 🎲**

---

*Hecho con ❤️ para la comunidad de juegos de mesa*

</div>
