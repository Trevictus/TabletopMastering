# 📚 Índice de Documentación - Backend

## 📖 Documentación Principal

### [QUICK_START.md](./QUICK_START.md) ⚡ **EMPIEZA AQUÍ**
**Descripción:** Guía de inicio rápido para desarrolladores  
**Contenido:**
- Primera instalación paso a paso
- Cómo iniciar el servidor (día a día)
- Verificar que todo funciona
- Ejecutar tests rápidamente
- Comandos útiles del día a día
- Pruebas manuales rápidas
- Solución de problemas comunes

**Cuándo consultar:** ¡Siempre que sea tu primera vez o necesites recordar cómo iniciar rápidamente!

---

### [README.md](./README.md)
**Descripción:** Guía principal del backend  
**Contenido:**
- Información general del proyecto
- Tecnologías utilizadas
- Instalación y configuración
- Ejecución en desarrollo
- Estructura del proyecto
- API Endpoints (resumen)
- Modelos de datos
- Autenticación

**Cuándo consultar:** Para entender el proyecto, instalarlo y configurarlo por primera vez.

---

### [DEPLOYMENT.md](./DEPLOYMENT.md)
**Descripción:** Guía completa de despliegue en producción  
**Contenido:**
- Checklist pre-despliegue
- Despliegue con PM2 (recomendado)
- Despliegue con systemd
- Despliegue con Docker
- Configuración de Nginx como proxy reverso
- Certificados SSL con Let's Encrypt
- Consideraciones de seguridad
- Monitoreo y logs
- Backup de MongoDB

**Cuándo consultar:** Cuando necesites desplegar el backend en un servidor de producción.

---

### [GAMES_API_DOCS.md](./GAMES_API_DOCS.md)
**Descripción:** Documentación completa de la API de juegos  
**Contenido:**
- Flujo recomendado para añadir juegos desde BGG
- Tipos de juegos (BGG vs Custom)
- Endpoints detallados con ejemplos:
  - Búsqueda en BGG
  - Preview de juegos
  - Añadir desde BGG
  - Crear juegos personalizados
  - Listar, actualizar, eliminar juegos
  - Sincronización con BGG
  - Estadísticas de grupo
  - Gestión de caché
- Ejemplos de uso completo
- Mejores prácticas para frontend

**Cuándo consultar:** Para implementar funcionalidades relacionadas con juegos en el frontend o entender cómo funciona la integración con BoardGameGeek.

---

### [TESTING.md](./TESTING.md)
**Descripción:** Guía completa de testing  
**Contenido:**
- Cómo ejecutar los tests (179 tests automatizados)
  - 163 tests de API de juegos
  - 16 tests de API de grupos
  - Tests de caché MongoDB
- Scripts de testing disponibles
- Pruebas manuales paso a paso
- Sistema de mock de BGG
- Troubleshooting de tests
- Escribir nuevos tests
- Cobertura de tests
- Integración continua

**Cuándo consultar:** Cuando necesites ejecutar tests, entender el sistema de testing, hacer pruebas manuales o crear nuevos tests.

---

## 🗂️ Organización de Archivos

```
backend/
├── QUICK_START.md           # ⚡ Guía de inicio rápido (EMPIEZA AQUÍ)
├── README.md                # 📘 Guía principal
├── DEPLOYMENT.md            # 🚀 Guía de despliegue
├── GAMES_API_DOCS.md        # 🎮 API de juegos (documentación completa)
├── TESTING.md               # 🧪 Guía de testing
├── DOC_INDEX.md             # 📚 Este archivo (índice de documentación)
│
├── config/                  # Configuración
├── controllers/             # Lógica de negocio
├── middlewares/             # Middlewares (auth, validación)
├── models/                  # Modelos de MongoDB
├── routes/                  # Definición de rutas
├── services/                # Servicios externos (BGG)
├── utils/                   # Utilidades
│
├── test-*.sh               # Scripts de testing
├── package.json            # Dependencias
├── server.js               # Punto de entrada
└── .env.example            # Ejemplo de variables de entorno
```

---

## 🎯 Guía Rápida por Escenarios

### Soy nuevo en el proyecto / Primera vez
1. **Lee [QUICK_START.md](./QUICK_START.md) primero** ⚡
2. Sigue los pasos de instalación
3. Inicia el servidor y verifica que funcione
4. Ejecuta los tests para confirmar
5. Después lee [README.md](./README.md) para más detalles

### Necesito iniciar el servidor rápido
1. Consulta [QUICK_START.md](./QUICK_START.md) - Sección "Iniciar el Servidor"
2. Comando: `USE_BGG_MOCK=true npx nodemon server.js`

### Quiero ejecutar tests
1. Consulta [QUICK_START.md](./QUICK_START.md) - Sección "Ejecutar Tests"
2. O lee [TESTING.md](./TESTING.md) para información detallada

### Necesito desplegar en producción
1. Lee [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Sigue el checklist pre-despliegue
3. Elige tu método de despliegue (PM2 recomendado)
4. Configura Nginx y SSL

### Voy a trabajar con la API de juegos
1. Consulta [GAMES_API_DOCS.md](./GAMES_API_DOCS.md)
2. Revisa el flujo recomendado (Búsqueda → Preview → Añadir)
3. Mira los ejemplos de código
4. Ejecuta los tests para entender el comportamiento

### Necesito hacer testing
1. Consulta [TESTING.md](./TESTING.md)
2. Ejecuta: `npm test`
3. Revisa los scripts disponibles: `test-*.sh`
4. Para tests específicos, consulta la guía de troubleshooting

---

## 📝 Notas Importantes

- ✅ La documentación está actualizada al 18 de noviembre de 2025
- ✅ Todos los tests pasan (179/179 exitosos)
  - 163 tests de API de juegos
  - 16 tests de API de grupos
- ✅ Sistema de caché MongoDB implementado para BGG
- ✅ Sistema de mock de BGG para testing sin consumir API real
- ⏳ Los controladores de Matches están pendientes de implementación

---

## 🔗 Recursos Adicionales

- **Documentación general del proyecto:** `/docs/README.md` (raíz del proyecto)
- **API de BoardGameGeek:** [BGG XML API](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- **Express.js:** [https://expressjs.com/](https://expressjs.com/)
- **MongoDB/Mongoose:** [https://mongoosejs.com/](https://mongoosejs.com/)
