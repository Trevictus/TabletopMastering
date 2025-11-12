## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js v20 o superior
- MongoDB corriendo (Docker recomendado)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

Variables necesarias:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

4. **Iniciar MongoDB (con Docker)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Iniciar el servidor**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en `http://localhost:3000`

### Verificar Instalación

```bash
# Health check
curl http://localhost:3000/health

# Verificar conexión a BD
node test-db-connection.js
```

## 🧪 Pruebas

### Método 1: Script de Demostración (Recomendado)

Ejecuta el script interactivo que demuestra todas las funcionalidades:

```bash
./demo.sh
```

Este script creará usuarios de prueba y demostrará:
- Registro y login
- Creación de grupos
- Unión a grupos
- Gestión de perfiles
- Validaciones y seguridad

### Método 2: Thunder Client

Thunder Client está pre-configurado con una colección completa:

1. Instalar extensión "Thunder Client" en VS Code
2. Abrir Thunder Client desde la barra lateral
3. La colección se carga automáticamente desde `.vscode/thunder-tests/`
4. Ejecutar las peticiones en orden

### Método 3: cURL

Ejemplos de uso con cURL:

**Registro:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
```

**Obtener Perfil:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 📖 Documentación de la API

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Obtener perfil | Sí |
| PUT | `/api/auth/profile` | Actualizar perfil | Sí |

### Grupos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/groups` | Crear grupo | Sí |
| GET | `/api/groups` | Listar mis grupos | Sí |
| GET | `/api/groups/:id` | Ver detalles de grupo | Sí |
| POST | `/api/groups/join` | Unirse a grupo | Sí |

**Documentación completa:** Ver [DEMOSTRACION.md](DEMOSTRACION.md)

## 🧪 Resultados de Pruebas

**10/10 pruebas pasadas exitosamente ✅**

| Prueba | Estado | Código |
|--------|--------|--------|
| Registro exitoso | ✅ | 201 |
| Login exitoso | ✅ | 200 |
| Obtener perfil | ✅ | 200 |
| Actualizar perfil | ✅ | 200 |
| Sin token | ✅ | 401 |
| Token inválido | ✅ | 401 |
| Email duplicado | ✅ | 400 |
| Credenciales inválidas | ✅ | 401 |
| Email inválido | ✅ | 400 |
| Password corta | ✅ | 400 |

**Tiempos de respuesta:**
- Registro: ~64ms
- Login: ~60ms
- Obtener perfil: ~15ms
- Actualizar perfil: ~8ms

## 🔒 Seguridad

- ✅ **Contraseñas encriptadas** con bcrypt (10 rounds)
- ✅ **JWT** para autenticación (expiración: 7 días)
- ✅ **Validación de datos** con Express Validator
- ✅ **Protección de rutas** con middleware
- ✅ **CORS** configurado
- ✅ **Sanitización de inputs**
- ✅ **Manejo de errores** sin exposición de detalles sensibles

## 📚 Recursos Adicionales

- **[DEMOSTRACION.md](DEMOSTRACION.md)** - Documentación completa del proyecto
- **[backend/API_TESTS.md](backend/API_TESTS.md)** - Tests de API
- **[backend/PRUEBAS_THUNDER_CLIENT.md](backend/PRUEBAS_THUNDER_CLIENT.md)** - Guía de Thunder Client
- **[docs/](docs/)** - Documentación técnica

## 🗺️ Roadmap

### Fase 2: Juegos (Siguiente)
- [ ] Modelo de juegos
- [ ] CRUD de juegos
- [ ] Búsqueda y filtros
- [ ] Asociación con grupos

### Fase 3: Partidas
- [ ] Modelo de partidas
- [ ] Programar partidas
- [ ] Confirmar asistencia
- [ ] Registrar resultados
- [ ] Historial

### Fase 4: Frontend
- [ ] Interfaz con React/Vue
- [ ] Dashboard
- [ ] Vista de grupos
- [ ] Calendario

### Fase 5: Mejoras
- [ ] Notificaciones
- [ ] Reset de password
- [ ] Subida de imágenes
- [ ] Estadísticas avanzadas
- [ ] Chat en tiempo real

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autores

- **Trevictus** - *Desarrollo inicial* - [GitHub](https://github.com/Trevictus)

## 🙏 Agradecimientos

- Comunidad de juegos de mesa
- Contribuidores de código abierto
- Testers y usuarios beta

---

**Estado:** 🟢 Funcional y listo para continuar  
**Última actualización:** 7 de noviembre de 2025  
**Versión:** 1.0.0

🎲 **¡Felices partidas!** 🎲
