# 🔌 Servicio de API Cliente

Configuración avanzada de Axios con interceptors, manejo de errores, retry automático y utilidades para peticiones HTTP.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Configuración](#configuración)
- [Interceptors](#interceptors)
- [Utilidades](#utilidades)
- [Hook useApi](#hook-useapi)
- [Manejo de Errores](#manejo-de-errores)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Best Practices](#best-practices)

---

## ✨ Características

### 1. **Autenticación Automática**
- Token JWT incluido automáticamente en todas las peticiones
- Manejo de sesiones expiradas
- Redirección automática a login

### 2. **Retry Automático**
- Reintentos automáticos en errores de red
- Exponential backoff (espera creciente entre reintentos)
- Máximo 2 reintentos por defecto

### 3. **Prevención de Duplicados**
- Cancelación de peticiones GET duplicadas
- Map de peticiones pendientes
- Optimización de recursos

### 4. **Logging Inteligente**
- Logs detallados en desarrollo
- Métricas de rendimiento (duración de peticiones)
- Códigos de colores (🚀 request, ✅ success, ❌ error)

### 5. **Manejo Centralizado de Errores**
- Clasificación automática de errores
- Mensajes en español
- Extracción de errores de validación

---

## ⚙️ Configuración

### Variables de Entorno

```env
VITE_API_URL=http://localhost/api
```

### Configuración Base

```javascript
const API_CONFIG = {
  baseURL: 'http://localhost/api',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

---

## 🔄 Interceptors

### Request Interceptor

**Responsabilidades:**
1. Añadir token de autenticación
2. Prevenir peticiones duplicadas (GET)
3. Añadir timestamps para métricas
4. Logging en desarrollo

```javascript
// Automáticamente añade el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

**Responsabilidades:**
1. Logging de respuestas exitosas
2. Manejo de errores 401 (sesión expirada)
3. Retry automático en errores de red
4. Cálculo de métricas de rendimiento

```javascript
// Manejo automático de errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión y redirigir
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🛠️ Utilidades

### `setAuthToken(token)`
Configura el token de autenticación.

```javascript
import { setAuthToken } from '@/services/api';

// Después del login
const response = await authService.login(credentials);
setAuthToken(response.data.token);
```

### `clearAuth()`
Limpia toda la autenticación y cancela peticiones pendientes.

```javascript
import { clearAuth } from '@/services/api';

// Al hacer logout
clearAuth();
navigate('/login');
```

### `cancelAllPendingRequests()`
Cancela todas las peticiones en progreso.

```javascript
import { cancelAllPendingRequests } from '@/services/api';

// Al cambiar de página
useEffect(() => {
  return () => cancelAllPendingRequests();
}, []);
```

### `isAuthenticated()`
Verifica si hay una sesión activa.

```javascript
import { isAuthenticated } from '@/services/api';

if (!isAuthenticated()) {
  navigate('/login');
}
```

---

## 🪝 Hook useApi

Hook personalizado para manejar peticiones de forma declarativa.

### Características

- ✅ Estado automático (loading, error, data)
- ✅ Cancelación automática al desmontar
- ✅ Cache opcional
- ✅ Retry manual
- ✅ Callbacks de éxito/error

### Uso Básico

```javascript
import useApi from '@/hooks/useApi';
import gameService from '@/services/gameService';

function GamesList() {
  const { data, loading, error, execute, retry } = useApi(
    () => gameService.getGames({ page: 1 }),
    { immediate: true }
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} onRetry={retry} />;

  return (
    <div>
      {data?.map(game => (
        <GameCard key={game._id} game={game} />
      ))}
    </div>
  );
}
```

### Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `immediate` | boolean | false | Ejecutar automáticamente al montar |
| `onSuccess` | function | null | Callback cuando la petición es exitosa |
| `onError` | function | null | Callback cuando hay un error |
| `initialData` | any | null | Datos iniciales |
| `cache` | boolean | false | Habilitar cache simple |
| `logErrors` | boolean | true | Mostrar errores en consola |

### Ejemplo Completo

```javascript
function CreateGame() {
  const { loading, error, execute } = useApi(
    (gameData) => gameService.createGame(gameData),
    {
      onSuccess: (data) => {
        console.log('Juego creado:', data);
        navigate('/games');
      },
      onError: (err) => {
        console.error('Error:', err.message);
      }
    }
  );

  const handleSubmit = async (formData) => {
    try {
      await execute(formData);
    } catch (err) {
      // Error ya manejado por onError
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos del formulario ... */}
      <button disabled={loading}>
        {loading ? 'Creando...' : 'Crear Juego'}
      </button>
      {error && <ErrorMessage error={error} />}
    </form>
  );
}
```

---

## ⚠️ Manejo de Errores

### apiErrorHandler

Utilidades para extraer y formatear errores de forma consistente.

### Tipos de Errores

```javascript
import { ErrorTypes } from '@/services/apiErrorHandler';

ErrorTypes.NETWORK          // Error de conexión
ErrorTypes.AUTHENTICATION   // Sesión expirada (401)
ErrorTypes.AUTHORIZATION    // Sin permisos (403)
ErrorTypes.VALIDATION       // Datos inválidos (400, 422)
ErrorTypes.NOT_FOUND        // Recurso no encontrado (404)
ErrorTypes.SERVER           // Error del servidor (500+)
ErrorTypes.TIMEOUT          // Timeout
ErrorTypes.CANCELLED        // Petición cancelada
ErrorTypes.UNKNOWN          // Error desconocido
```

### Funciones Principales

#### `formatError(error)`
Formatea un error para mostrar en la UI.

```javascript
import { formatError } from '@/services/apiErrorHandler';

try {
  await gameService.createGame(data);
} catch (error) {
  const formatted = formatError(error);
  
  console.log(formatted);
  // {
  //   type: 'validation',
  //   message: 'El nombre del juego es obligatorio',
  //   validationErrors: { name: 'Campo requerido' },
  //   status: 422
  // }
}
```

#### `getErrorMessage(error)`
Extrae el mensaje de error más relevante.

```javascript
import { getErrorMessage } from '@/services/apiErrorHandler';

try {
  await api.get('/games/123');
} catch (error) {
  const message = getErrorMessage(error);
  alert(message); // "El recurso solicitado no fue encontrado."
}
```

#### `getValidationErrors(error)`
Extrae errores de validación de campos.

```javascript
import { getValidationErrors } from '@/services/apiErrorHandler';

try {
  await gameService.createGame(invalidData);
} catch (error) {
  const errors = getValidationErrors(error);
  
  console.log(errors);
  // {
  //   name: 'El nombre es obligatorio',
  //   minPlayers: 'Debe haber al menos 1 jugador'
  // }
  
  setFieldErrors(errors);
}
```

#### `isRetryableError(error)`
Verifica si el error permite reintentar.

```javascript
import { isRetryableError } from '@/services/apiErrorHandler';

try {
  await gameService.getGames();
} catch (error) {
  if (isRetryableError(error)) {
    // Mostrar botón de reintentar
    setShowRetry(true);
  }
}
```

---

## 💡 Ejemplos de Uso

### 1. Crear un Servicio

```javascript
// services/gameService.js
import api from './api';

const gameService = {
  // GET - Listar juegos
  getGames: async (params = {}) => {
    const response = await api.get('/games', { params });
    return response.data;
  },

  // POST - Crear juego
  createGame: async (gameData) => {
    const response = await api.post('/games', gameData);
    return response.data;
  },

  // PUT - Actualizar juego
  updateGame: async (id, gameData) => {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  },

  // DELETE - Eliminar juego
  deleteGame: async (id) => {
    const response = await api.delete(`/games/${id}`);
    return response.data;
  },
};

export default gameService;
```

### 2. Uso en Componente con Hook

```javascript
import { useState } from 'react';
import useApi from '@/hooks/useApi';
import gameService from '@/services/gameService';

function GamesPage() {
  const [page, setPage] = useState(1);

  const { 
    data: games, 
    loading, 
    error, 
    execute: loadGames,
    retry 
  } = useApi(
    () => gameService.getGames({ page, limit: 12 }),
    { 
      immediate: true,
      cache: true 
    }
  );

  // Recargar cuando cambie la página
  useEffect(() => {
    loadGames();
  }, [page]);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorMessage 
        message={error.message}
        onRetry={retry}
      />
    );
  }

  return (
    <div>
      <GameGrid games={games.data} />
      <Pagination 
        page={page}
        totalPages={games.pages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### 3. Manejo de Formularios con Validación

```javascript
import { useState } from 'react';
import { formatError, getValidationErrors } from '@/services/apiErrorHandler';
import gameService from '@/services/gameService';

function CreateGameForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await gameService.createGame(formData);
      navigate('/games');
    } catch (error) {
      const formatted = formatError(error);
      
      // Errores de validación por campo
      const validationErrors = getValidationErrors(error);
      setErrors(validationErrors);
      
      // Error general
      alert(formatted.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
      />
      
      <Input
        name="minPlayers"
        type="number"
        value={formData.minPlayers}
        onChange={(e) => setFormData({ ...formData, minPlayers: e.target.value })}
        error={errors.minPlayers}
      />

      <Button type="submit" loading={loading}>
        Crear Juego
      </Button>
    </form>
  );
}
```

### 4. Peticiones Múltiples en Paralelo

```javascript
import { useState, useEffect } from 'react';
import gameService from '@/services/gameService';
import groupService from '@/services/groupService';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Ejecutar peticiones en paralelo
        const [games, groups, stats] = await Promise.all([
          gameService.getGames({ limit: 5 }),
          groupService.getMyGroups(),
          gameService.getStats()
        ]);

        setData({ games, groups, stats });
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ... render
}
```

---

## 🏆 Best Practices

### 1. **Siempre Manejar Errores**

```javascript
// ❌ MAL - Error no manejado
const data = await gameService.getGames();

// ✅ BIEN - Error manejado
try {
  const data = await gameService.getGames();
} catch (error) {
  console.error(error);
  // Mostrar mensaje al usuario
}
```

### 2. **Usar useApi para Operaciones GET**

```javascript
// ❌ MAL - Manejo manual
const [games, setGames] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  gameService.getGames()
    .then(data => setGames(data))
    .finally(() => setLoading(false));
}, []);

// ✅ BIEN - useApi
const { data: games, loading } = useApi(
  () => gameService.getGames(),
  { immediate: true }
);
```

### 3. **Cancelar Peticiones al Desmontar**

```javascript
// ✅ BIEN - useApi lo hace automáticamente
const { data, loading } = useApi(() => gameService.getGames());

// O manualmente
useEffect(() => {
  return () => cancelAllPendingRequests();
}, []);
```

### 4. **Mostrar Mensajes de Error Apropiados**

```javascript
import { getErrorMessage, ErrorTypes, isErrorType } from '@/services/apiErrorHandler';

try {
  await gameService.deleteGame(id);
} catch (error) {
  if (isErrorType(error, ErrorTypes.AUTHORIZATION)) {
    alert('No tienes permisos para eliminar este juego');
  } else {
    alert(getErrorMessage(error));
  }
}
```

### 5. **Usar Tokens de Cancelación para Búsquedas**

```javascript
import { useState, useEffect } from 'react';

function SearchGames() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const searchGames = async () => {
      try {
        const data = await gameService.searchBGG(query);
        setResults(data);
      } catch (error) {
        // Error de cancelación ignorado automáticamente
      }
    };

    // Debounce
    const timer = setTimeout(searchGames, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Buscar juegos..."
    />
  );
}
```

---

## 📚 Recursos Adicionales

- [Documentación de Axios](https://axios-http.com/)
- [React Hooks](https://react.dev/reference/react)
- [Error Handling Best Practices](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)

---

## 🔧 Troubleshooting

### Token no se incluye en las peticiones

**Solución:** Verifica que el token esté guardado correctamente:

```javascript
import { getAuthToken } from '@/services/api';
console.log('Token actual:', getAuthToken());
```

### Errores CORS

**Solución:** Verifica la configuración del backend y asegúrate de que el `VITE_API_URL` sea correcto.

### Peticiones duplicadas no se cancelan

**Solución:** La cancelación solo aplica a peticiones GET. Para otros métodos, implementa tu propia lógica de cancelación.

---

**Autor:** TabletopMastering Team  
**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025
