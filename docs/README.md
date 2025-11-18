# 📚 Documentación de Tabletop Mastering

Bienvenido a la documentación completa del proyecto **Tabletop Mastering**, un sistema de gestión de partidas de juegos de mesa.

---

## 🎯 Inicio Rápido

¿Primera vez aquí? Te recomendamos este orden de lectura:

1. 📖 **[Visión General](./introduccion/vision-general.md)** - Entiende qué es el proyecto
2. 🚀 **[Instalación](./guias-inicio/instalacion.md)** - Instala y configura todo
3. ⚡ **[Inicio Rápido](./guias-inicio/inicio-rapido.md)** - Prueba en 5 minutos
4. 📊 **[Estado del Proyecto](./introduccion/estado-del-proyecto.md)** - Ve qué está implementado

---

## 📂 Estructura de la Documentación

### 🎬 Introducción

Conceptos básicos y contexto del proyecto.

- **[Visión General](./introduccion/vision-general.md)**
  - ¿Qué es Tabletop Mastering?
  - Usuarios objetivo
  - Características principales
  - Valor diferencial

- **[Problema y Solución](./introduccion/problema-y-solucion.md)**
  - Problema identificado
  - Evidencias de investigación
  - Cómo lo resuelve el proyecto

- **[Objetivos](./introduccion/objetivos.md)**
  - Objetivos SMART
  - MVP (Versión Mínima Viable)
  - Roadmap del proyecto

- **[Estado del Proyecto](./introduccion/estado-del-proyecto.md)**
  - Progreso actual
  - Módulos completados
  - Métricas y estadísticas
  - Próximos pasos

---

### 🚀 Guías de Inicio

Todo lo necesario para empezar a trabajar con el proyecto.

- **[Instalación](./guias-inicio/instalacion.md)**
  - Requisitos previos
  - Instalación paso a paso
  - Configuración de MongoDB
  - Verificación

- **[Configuración](./guias-inicio/configuracion.md)**
  - Variables de entorno
  - Configuración de base de datos
  - Configuración de seguridad
  - Docker y producción

- **[Inicio Rápido](./guias-inicio/inicio-rapido.md)**
  - Setup en 5 minutos
  - Primera prueba
  - Flujos comunes
  - Thunder Client

- **[Demo Interactiva](./guias-inicio/demo-interactiva.md)**
  - Script de demostración
  - Cómo ejecutarlo
  - Qué hace
  - Personalización

---

### 🏗️ Arquitectura

Diseño técnico y estructura del sistema.

- **[Stack Tecnológico](./arquitectura/stack-tecnologico.md)**
  - Backend: Node.js, Express, MongoDB
  - Frontend: React, Vite
  - Herramientas y librerías

- **[Estructura del Proyecto](./arquitectura/estructura-proyecto.md)**
  - Organización de carpetas
  - Convenciones de código
  - Patrones de diseño

- **[Base de Datos](./arquitectura/base-de-datos.md)**
  - Modelos de datos
  - Esquemas de Mongoose
  - Relaciones
  - Índices

---

### 🌐 API REST

Documentación completa de todos los endpoints.

- **[Introducción](./api/introduccion.md)**
  - Conceptos generales
  - Autenticación con JWT
  - Códigos de respuesta
  - Manejo de errores

- **[Documentación de API de Juegos](../backend/docs/GAMES_API_DOCS.md)**
  - Integración con BoardGameGeek
  - CRUD de juegos completo
  - Búsqueda y filtros
  - Estadísticas y sincronización
  - 163 tests automatizados

- **[Guía de Testing](../backend/docs/TESTING.md)**
  - Suite completa de 179 tests
  - Tests de API de juegos
  - Tests de API de grupos
  - Instrucciones de ejecución

---

### 👨‍💻 Desarrollo

Guías para contribuir y desarrollar.

- **[Guía de Contribución](./desarrollo/guia-contribucion.md)**
  - Cómo contribuir
  - Flujo de trabajo Git
  - Convenciones de código
  - Pull requests

- **[Pruebas](./desarrollo/pruebas.md)**
  - Testing de API
  - Thunder Client
  - Scripts de prueba
  - Casos de uso

- **[Buenas Prácticas](./desarrollo/buenas-practicas.md)**
  - Código limpio
  - Seguridad
  - Rendimiento
  - Documentación

- **[Herramientas](./desarrollo/herramientas.md)**
  - Thunder Client
  - Scripts útiles
  - Debugging
  - Linting

---

### 🎨 Frontend

Documentación de la interfaz de usuario.

- **[Introducción Frontend](./frontend/introduccion.md)**
  - Tecnologías (React 19, Vite 7)
  - Estructura de carpetas
  - Setup inicial

- **[Componentes](./frontend/componentes.md)**
  - Componentes principales
  - Componentes reutilizables
  - Props y estado

- **[Servicios](./frontend/servicios.md)**
  - Servicios de API
  - Gestión de autenticación
  - Manejo de errores

- **[Estilos](./frontend/estilos.md)**
  - Sistema de diseño
  - CSS Variables
  - Componentes estilizados

---

### 📎 Anexos

Recursos adicionales y referencias.

- **[Recursos](./anexos/recursos.md)**
  - Enlaces útiles
  - Documentación externa
  - Tutoriales
  - Comunidad

- **[Viabilidad Técnica](./anexos/viabilidad-tecnica.md)**
  - Análisis de viabilidad
  - Tecnologías evaluadas
  - Decisiones técnicas

- **[Changelog](./anexos/changelog.md)**
  - Historial de versiones
  - Cambios importantes
  - Migraciones

---

## 🔍 Navegación Rápida

### Por Rol

**🎓 Estudiante/Evaluador**
1. [Visión General](./introduccion/vision-general.md)
2. [Problema y Solución](./introduccion/problema-y-solucion.md)
3. [Objetivos](./introduccion/objetivos.md)
4. [Estado del Proyecto](./introduccion/estado-del-proyecto.md)
5. [Demo Interactiva](./guias-inicio/demo-interactiva.md)

**👨‍💻 Desarrollador**
1. [Instalación](./guias-inicio/instalacion.md)
2. [Configuración](./guias-inicio/configuracion.md)
3. [Estructura del Proyecto](./arquitectura/estructura-proyecto.md)
4. [API - Introducción](./api/introduccion.md)
5. [Guía de Contribución](./desarrollo/guia-contribucion.md)

**🔌 Integrador de API**
1. [API - Introducción](./api/introduccion.md)
2. [Instalación Backend](../backend/README.md)
3. [API de Juegos - Documentación Completa](../backend/docs/GAMES_API_DOCS.md)
4. [Guía de Testing](../backend/docs/TESTING.md)
5. [Pruebas](./desarrollo/pruebas.md)

**🎨 Frontend Developer**
1. [Instalación](./guias-inicio/instalacion.md)
2. [Frontend - Introducción](./frontend/introduccion.md)
3. [Componentes](./frontend/componentes.md)
4. [Servicios](./frontend/servicios.md)
5. [API - Introducción](./api/introduccion.md)

---

## 📊 Estado de la Documentación

| Sección | Estado | Completitud |
|---------|--------|-------------|
| **Introducción** | ✅ Completa | 100% |
| **Guías de Inicio** | ✅ Completa | 100% |
| **Arquitectura** | ✅ Completa | 100% |
| **API** | ✅ Completa | 95% |
| **Desarrollo** | ✅ Completa | 90% |
| **Frontend** | 🟡 Parcial | 60% |
| **Anexos** | ✅ Completa | 100% |

---

## 🗺️ Mapa del Proyecto

```
TabletopMastering/
├── 📖 Documentación (docs/)
│   ├── Introducción
│   ├── Guías de Inicio
│   ├── Arquitectura
│   ├── API
│   ├── Desarrollo
│   ├── Frontend
│   └── Anexos
│
├── ⚙️ Backend (backend/)
│   ├── Controllers - Lógica de negocio
│   ├── Models - Esquemas de datos
│   ├── Routes - Endpoints
│   ├── Middlewares - Validación y auth
│   └── Services - Integraciones (BGG)
│
└── 🎨 Frontend (frontend/)
    ├── Components - UI components
    ├── Pages - Vistas principales
    ├── Services - API calls
    ├── Context - Estado global
    └── Styles - CSS modular
```

---

## 🚀 Inicio Súper Rápido

```bash
# 1. Clonar
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering

# 2. Instalar y configurar backend
cd backend
npm install
cp .env.example .env
# Edita .env con tus valores

# 3. Iniciar MongoDB (Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 4. Iniciar backend
npm run dev

# 5. Probar (en otra terminal)
cd ..
./demo.sh
```

---

## 📚 Recursos Externos

### APIs y Servicios
- [BoardGameGeek API](https://boardgamegeek.com/wiki/page/BGG_XML_API2) - Integración de juegos

### Tecnologías
- [Node.js](https://nodejs.org/docs/) - Runtime de JavaScript
- [Express.js](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/docs/) - Base de datos
- [Mongoose](https://mongoosejs.com/docs/) - ODM para MongoDB
- [React](https://react.dev/) - Librería frontend
- [Vite](https://vitejs.dev/) - Build tool

### Herramientas
- [Thunder Client](https://www.thunderclient.com/) - Cliente REST para VS Code
- [Postman](https://www.postman.com/) - Alternativa para testing API

---

## 🤝 Contribuir

¿Quieres mejorar la documentación?

1. Haz fork del repositorio
2. Crea una rama: `git checkout -b docs/mejora-documentacion`
3. Haz tus cambios
4. Commit: `git commit -m "docs: mejora sección X"`
5. Push: `git push origin docs/mejora-documentacion`
6. Abre un Pull Request

Ver [Guía de Contribución](./desarrollo/guia-contribucion.md) para más detalles.

---

## 📞 Soporte

¿Necesitas ayuda?

- 📖 Lee la documentación completa
- 🐛 [Reporta un bug](https://github.com/Trevictus/TabletopMastering/issues)
- 💬 [Inicia una discusión](https://github.com/Trevictus/TabletopMastering/discussions)
- 📧 Contacta al equipo

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](../LICENSE) para más detalles.

---

## 🎲 ¡A Jugar!

Gracias por tu interés en Tabletop Mastering. ¡Esperamos que disfrutes usando y contribuyendo al proyecto!

**Versión de la documentación:** 1.0.0  
**Última actualización:** 12 de noviembre de 2025
