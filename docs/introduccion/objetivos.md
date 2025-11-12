# 🎯 Objetivos del Proyecto

## Objetivo General

Desarrollar una aplicación web que facilite la **organización, registro y análisis de partidas de juegos de mesa entre amigos**, mejorando la experiencia de juego mediante una gestión centralizada, visual y motivadora.

## 📋 Objetivos SMART

### 1. Específico (Specific)
Diseñar y desarrollar una **versión funcional (MVP)** de la plataforma **Tabletop Mastering** que permita a los usuarios:
- Crear perfiles personalizados
- Gestionar grupos de juego
- Catalogar juegos de mesa
- Programar y registrar partidas
- Visualizar estadísticas básicas

### 2. Medible (Measurable)
Conseguir que, en las pruebas iniciales:
- **5+ grupos de jugadores** utilicen la aplicación
- Durante **4 semanas consecutivas**
- Registrando un mínimo de **20 partidas totales**
- Añadiendo **10+ juegos diferentes** al catálogo
- Con **90%+ de satisfacción** en usabilidad

### 3. Alcanzable (Achievable)
Implementar el MVP con funcionalidades básicas en un **plazo de 3 meses**, utilizando:
- Tecnologías web estándar y probadas
- Recursos disponibles en el equipo
- Stack MERN (MongoDB, Express, React, Node.js)
- Integración con APIs públicas (BoardGameGeek)
- Infraestructura cloud accesible

### 4. Relevante (Relevant)
El proyecto responde a una **necesidad real** de grupos de jugadores que buscan:
- Centralizar información de partidas
- Evitar desorganización
- Fomentar motivación mediante estadísticas
- Mantener cohesión social del grupo
- Descubrir y catalogar juegos

### 5. Temporal (Time-bound)
- **31 de enero de 2026**: MVP completamente funcional
- **Febrero 2026**: Período de pruebas con usuarios beta
- **Marzo 2026**: Ajustes y mejoras basadas en feedback
- **Abril 2026**: Lanzamiento de la v1.0 estable

## 📊 Tabla Resumen de Objetivos SMART

| Criterio | Descripción | Métrica |
|----------|-------------|---------|
| **Específico** | MVP con gestión de juegos, partidas y resultados | 4 módulos principales |
| **Medible** | 5 grupos activos durante 4 semanas | 20 partidas, 10 juegos |
| **Alcanzable** | Implementación en 3 meses | Stack MERN estándar |
| **Relevante** | Necesidad real de jugadores | Validado con entrevistas |
| **Temporal** | MVP para 31/01/2026 | Pruebas Q1 2026 |

## 🎯 MVP - Versión Mínima Viable

El **MVP de Tabletop Mastering** se centra en las funciones esenciales para organizar y registrar partidas, priorizando **simplicidad, usabilidad y centralización**.

### Objetivo del MVP
Validar la propuesta principal: **centralizar la organización y registro de partidas** de forma sencilla, atractiva y colaborativa, antes de añadir funciones avanzadas.

### ✅ Funcionalidades Incluidas en el MVP

#### 1. Gestión de Usuarios
- ✅ Registro y autenticación de usuarios
- ✅ Perfil personalizable (nombre, avatar, bio)
- ✅ Sistema de sesiones con JWT
- ✅ Gestión de contraseñas segura

#### 2. Gestión de Grupos
- ✅ Crear y administrar grupos privados
- ✅ Sistema de códigos de invitación únicos
- ✅ Roles (administrador/miembro)
- ✅ Lista de miembros del grupo
- ✅ Configuración de grupo

#### 3. Gestión de Juegos
- ✅ Catálogo de juegos del grupo
- ✅ Integración con BoardGameGeek API
- ✅ Búsqueda de juegos
- ✅ Importar juegos desde BGG
- ✅ Crear juegos personalizados
- ✅ Información detallada (jugadores, duración, categorías)

#### 4. Gestión de Partidas
- ⏳ Programar nuevas partidas
- ⏳ Registrar resultados
- ⏳ Confirmar asistencias
- ⏳ Historial de partidas
- ⏳ Búsqueda y filtros

#### 5. Estadísticas Básicas
- ⏳ Partidas jugadas por usuario
- ⏳ Juegos más jugados
- ⏳ Ratio de victorias
- ⏳ Historial de grupo

### ❌ Funcionalidades NO Incluidas en el MVP

Estas características se implementarán en versiones posteriores:

- ❌ Sistema de logros y badges
- ❌ Rankings avanzados
- ❌ Notificaciones push
- ❌ Chat entre jugadores
- ❌ Integración con redes sociales
- ❌ Aplicación móvil nativa
- ❌ Modo offline
- ❌ Exportación de datos
- ❌ Personalización avanzada de temas

## 📈 Objetivos por Módulo

### Backend (API)
- ✅ 100% de endpoints de autenticación
- ✅ 100% de endpoints de grupos
- ✅ 100% de endpoints de juegos
- ⏳ 100% de endpoints de partidas
- ✅ Validación completa de datos
- ✅ Seguridad implementada
- ✅ Documentación de API

### Frontend
- ⏳ Sistema de rutas y navegación
- ⏳ Componentes reutilizables
- ⏳ Estado global con Context API
- ⏳ Formularios validados
- ⏳ Diseño responsive
- ⏳ Manejo de errores

### Base de Datos
- ✅ Esquema de usuarios
- ✅ Esquema de grupos
- ✅ Esquema de juegos
- ⏳ Esquema de partidas
- ✅ Relaciones entre colecciones
- ✅ Índices optimizados

## 🎓 Objetivos Académicos

Este proyecto demuestra competencias en:

### Desarrollo Backend
- Diseño e implementación de API REST
- Arquitectura MVC
- Gestión de bases de datos NoSQL
- Autenticación y autorización
- Validación de datos
- Manejo de errores

### Desarrollo Frontend
- Desarrollo con React 19
- Gestión de estado
- Consumo de APIs
- Diseño responsive
- Experiencia de usuario

### Integración
- Consumo de APIs externas
- Sistema de caché
- Sincronización de datos
- Parsing de XML/JSON

### DevOps y Testing
- Testing de API
- Documentación técnica
- Control de versiones (Git)
- Scripts de automatización

## 📊 Indicadores de Éxito

### Técnicos
- [ ] 95%+ de tests pasando
- [x] API completamente documentada
- [ ] Tiempo de respuesta < 200ms
- [x] 0 vulnerabilidades críticas
- [ ] Código con linting configurado

### Funcionales
- [x] 100% autenticación completada
- [x] 100% gestión de grupos completada
- [x] 100% gestión de juegos completada
- [ ] 100% gestión de partidas completada
- [ ] Frontend funcional

### Usuario
- [ ] 5+ grupos de prueba activos
- [ ] 20+ partidas registradas
- [ ] Feedback positivo de usuarios
- [ ] Menos de 3 bugs críticos reportados
- [ ] Tiempo de aprendizaje < 10 minutos

## 🚀 Roadmap

### Fase 1: Backend ✅ (Completada)
- [x] Configuración del proyecto
- [x] Sistema de autenticación
- [x] Gestión de usuarios
- [x] Gestión de grupos
- [x] Gestión de juegos + BGG
- [x] Documentación de API

### Fase 2: Partidas ⏳ (En desarrollo)
- [ ] Modelo de partidas
- [ ] CRUD de partidas
- [ ] Sistema de asistencias
- [ ] Registro de resultados
- [ ] Estadísticas básicas

### Fase 3: Frontend ⏳ (Pendiente)
- [ ] Configuración React + Vite
- [ ] Sistema de rutas
- [ ] Componentes principales
- [ ] Integración con API
- [ ] Testing frontend

### Fase 4: Pulido y Testing ⏳ (Pendiente)
- [ ] Tests automatizados
- [ ] Optimización de rendimiento
- [ ] Seguridad hardening
- [ ] Pruebas con usuarios
- [ ] Corrección de bugs

### Fase 5: Despliegue ⏳ (Pendiente)
- [ ] Configuración de servidor
- [ ] CI/CD pipeline
- [ ] Monitorización
- [ ] Backup automático
- [ ] Documentación de despliegue

## 📚 Referencias

- [Visión General](./vision-general.md)
- [Problema y Solución](./problema-y-solucion.md)
- [Estado del Proyecto](./estado-del-proyecto.md)
- [Guía de Instalación](../guias-inicio/instalacion.md)
