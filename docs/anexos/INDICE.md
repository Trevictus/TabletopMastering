# 📚 Índice de Documentación - Tabletop Mastering

## 🎯 Para Empezar

### Lectura Recomendada (En orden)

1. **[README.md](../README.md)** ⭐ **INICIO AQUÍ**
   - Resumen del proyecto
   - Estado actual
   - Inicio rápido
   - Endpoints disponibles

2. **[README_COMPLETO.md](../README_COMPLETO.md)** 📖 **GUÍA COMPLETA**
   - Instalación detallada
   - Configuración
   - Guía de uso
   - Ejemplos con cURL
   - Roadmap

3. **[DEMOSTRACION.md](../DEMOSTRACION.md)** 🎬 **DOCUMENTACIÓN TÉCNICA**
   - Arquitectura del sistema
   - Funcionalidades implementadas
   - Demostración paso a paso
   - Resultados de pruebas
   - Métricas y estadísticas

## 🧪 Documentación de Pruebas

4. **[backend/PRUEBAS_THUNDER_CLIENT.md](../backend/PRUEBAS_THUNDER_CLIENT.md)** ⚡
   - Guía de Thunder Client
   - Colección pre-configurada
   - Resultados de todas las pruebas
   - Casos de éxito y error

5. **[backend/API_TESTS.md](../backend/API_TESTS.md)** 📋
   - Documentación de tests de API
   - Casos de prueba

## 🎬 Herramientas Interactivas

6. **[demo.sh](../demo.sh)** 🚀 **SCRIPT DE DEMOSTRACIÓN**
   ```bash
   ./demo.sh
   ```
   - Demostración interactiva completa
   - Crea usuarios de prueba
   - Demuestra todas las funcionalidades

7. **[Thunder Client Collection](../.vscode/thunder-tests/)** ⚡
   - Colección pre-configurada
   - 7 peticiones listas para usar
   - Variables de entorno incluidas

## 📖 Documentación Técnica del Proyecto

8. **[docs/problema.md](problema.md)**
   - Definición del problema
   - Necesidades identificadas

9. **[docs/objetivos-enlace.md](objetivos-enlace.md)**
   - Objetivos del proyecto
   - Enlaces importantes

10. **[docs/viabilidad-tecnica.md](viabilidad-tecnica.md)**
    - Análisis de viabilidad técnica
    - Stack tecnológico

11. **[docs/recursos.md](recursos.md)**
    - Recursos utilizados
    - Referencias

## 🗂️ Documentación por Módulo

### Backend

#### Configuración
- `backend/config/database.js` - Configuración de MongoDB
- `backend/.env.example` - Variables de entorno

#### Modelos
- `backend/models/User.js` - Esquema de usuarios
- `backend/models/Group.js` - Esquema de grupos
- `backend/models/Game.js` - Esquema de juegos (pendiente)
- `backend/models/Match.js` - Esquema de partidas (pendiente)

#### Controladores
- `backend/controllers/authController.js` - Lógica de autenticación
- `backend/controllers/groupController.js` - Lógica de grupos

#### Middlewares
- `backend/middlewares/auth.js` - Protección de rutas
- `backend/middlewares/errorHandler.js` - Manejo de errores
- `backend/middlewares/validator.js` - Validación de datos

#### Rutas
- `backend/routes/authRoutes.js` - Rutas de autenticación
- `backend/routes/groupRoutes.js` - Rutas de grupos
- `backend/routes/gameRoutes.js` - Rutas de juegos (pendiente)
- `backend/routes/matchRoutes.js` - Rutas de partidas (pendiente)

## 🔍 Buscar Información Específica

### Por Tema

**Autenticación y Seguridad:**
- README.md → Sección "Seguridad"
- DEMOSTRACION.md → "Sistema de Seguridad"
- backend/middlewares/auth.js

**Grupos:**
- DEMOSTRACION.md → "Sistema de Grupos"
- backend/controllers/groupController.js
- backend/models/Group.js

**Pruebas:**
- PRUEBAS_THUNDER_CLIENT.md
- demo.sh
- .vscode/thunder-tests/

**Instalación:**
- README_COMPLETO.md → "Instalación y Ejecución"

**API Endpoints:**
- README.md → "Endpoints Disponibles"
- DEMOSTRACION.md → "Demostración Paso a Paso"

## 📊 Resumen del Proyecto

### Estado Actual
```
✅ Completado (40%):
  - Autenticación (100%)
  - Usuarios (100%)
  - Grupos (100%)
  - Base de Datos (100%)
  - Seguridad (100%)

⏳ Pendiente (60%):
  - Juegos (0%)
  - Partidas (0%)
  - Frontend (0%)
```

### Métricas
- **Endpoints implementados:** 8/20 (40%)
- **Pruebas pasadas:** 10/10 (100%)
- **Líneas de código:** ~1,200
- **Tiempo promedio de respuesta:** ~50ms

## 🎯 Guías Rápidas

### Para Desarrolladores
1. Leer [README_COMPLETO.md](../README_COMPLETO.md)
2. Configurar entorno de desarrollo
3. Revisar estructura en [DEMOSTRACION.md](../DEMOSTRACION.md)
4. Ver ejemplos de código en los controladores

### Para Testers
1. Leer [PRUEBAS_THUNDER_CLIENT.md](../backend/PRUEBAS_THUNDER_CLIENT.md)
2. Ejecutar `./demo.sh`
3. Usar Thunder Client con la colección pre-configurada

### Para Project Managers
1. Leer [README.md](../README.md) para resumen ejecutivo
2. Ver [DEMOSTRACION.md](../DEMOSTRACION.md) → "Resumen Ejecutivo"
3. Revisar roadmap en [README_COMPLETO.md](../README_COMPLETO.md)

## 📞 Soporte

Si tienes preguntas:
1. Revisa esta documentación
2. Busca en los archivos específicos del módulo
3. Ejecuta el script de demostración: `./demo.sh`
4. Abre un issue en GitHub

## 🔄 Actualización de Documentación

**Última actualización:** 7 de noviembre de 2025  
**Versión:** 1.0.0

Cuando se implementen nuevas funcionalidades, actualizar:
- [ ] README.md (resumen)
- [ ] README_COMPLETO.md (guía completa)
- [ ] DEMOSTRACION.md (documentación técnica)
- [ ] Este archivo (INDICE.md)
- [ ] Colección de Thunder Client
- [ ] Script demo.sh (si aplica)

---

🎲 **Tabletop Mastering** - Toda la documentación en un solo lugar
