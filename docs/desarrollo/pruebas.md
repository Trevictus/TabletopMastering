# 🧪 Pruebas

## Visión General

El proyecto incluye múltiples métodos para probar la API y validar su funcionamiento.

## Métodos de Testing

### 1. Script de Demostración Interactiva ⭐ Recomendado

```bash
./demo.sh
```

**Ventajas:**
- ✅ Prueba todo automáticamente
- ✅ Casos de éxito y error
- ✅ Output coloreado y fácil de seguir
- ✅ ~3 minutos de duración

**[Ver guía completa →](../guias-inicio/demo-interactiva.md)**

### 2. Thunder Client (VS Code)

Colección pre-configurada en `.vscode/thunder-tests/`

**Pasos:**
1. Instalar extensión "Thunder Client"
2. Abrir Thunder Client desde la barra lateral
3. La colección se carga automáticamente
4. Ejecutar peticiones en orden

### 3. cURL Manual

Ver ejemplos en `backend/API_TESTS.md`

```bash
# Ejemplo: Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

## Estado de las Pruebas

### Backend

| Módulo | Tests | Estado | Cobertura |
|--------|-------|--------|-----------|
| Autenticación | 4 | ✅ 100% | Alta |
| Grupos | 6 | ✅ 100% | Alta |
| Juegos | 13 | ✅ 100% | Alta |
| Seguridad | 8 | ✅ 100% | Alta |
| **TOTAL** | **31** | **✅ 100%** | **~85%** |

### Casos de Prueba

**Casos de Éxito:**
- ✅ Registro de usuario
- ✅ Login
- ✅ Obtener perfil
- ✅ Actualizar perfil
- ✅ Crear grupo
- ✅ Unirse a grupo
- ✅ Buscar juegos en BGG
- ✅ Añadir juegos

**Casos de Error:**
- ✅ Email duplicado
- ✅ Contraseña muy corta
- ✅ Token inválido
- ✅ Credenciales incorrectas
- ✅ Permisos insuficientes
- ✅ Código de grupo inválido

## Scripts de Testing

### Juegos

```bash
cd backend
./test-games-api.sh
```

Prueba todos los endpoints de juegos automáticamente.

### Base de Datos

```bash
cd backend
node test-db-connection.js
```

Verifica la conexión a MongoDB.

## Testing Manual

### Postman

Puedes importar la colección de Thunder Client a Postman si lo prefieres.

### Insomnia

Compatible con formatos estándar de colecciones REST.

## Referencias

- [Demo Interactiva](../guias-inicio/demo-interactiva.md)
- [API Tests Backend](../../backend/API_TESTS.md)
- [Documentación de API](../api/introduccion.md)
