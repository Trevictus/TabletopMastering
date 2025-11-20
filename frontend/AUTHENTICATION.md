# Sistema de Autenticación Global

Este documento describe cómo usar el sistema de autenticación global implementado en la aplicación.

## 📋 Estructura

```
frontend/src/
├── context/
│   └── AuthContext.jsx          # Contexto global de autenticación
├── services/
│   ├── api.js                   # Cliente axios con interceptores
│   └── authService.js           # Servicio de autenticación
├── hooks/
│   └── useAuthValidation.js     # Hook personalizado para validaciones
├── constants/
│   └── auth.js                  # Constantes y configuraciones
└── components/
    └── routes/
        ├── ProtectedRoute.jsx   # Rutas protegidas
        └── PublicRoute.jsx      # Rutas públicas
```

## 🚀 Uso Básico

### 1. Acceder al contexto de autenticación

```jsx
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Hola, {user.name}!</p>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}
```

### 2. Iniciar sesión

```jsx
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function LoginForm() {
  const { login, error, loading } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      // Redirigir al dashboard o mostrar éxito
    } catch (err) {
      // El error ya está en el contexto
      console.error('Error al iniciar sesión:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

### 3. Registrar usuario

```jsx
const { register, error, loading } = useAuth();

const handleRegister = async (userData) => {
  try {
    await register(userData);
    // Usuario registrado y autenticado automáticamente
  } catch (err) {
    console.error('Error al registrar:', err);
  }
};
```

### 4. Cerrar sesión

```jsx
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  // Usuario desconectado, navegar a home
  navigate('/');
};
```

### 5. Actualizar perfil

```jsx
const { updateProfile, user } = useAuth();

const handleUpdateProfile = async (newData) => {
  try {
    await updateProfile(newData);
    // Perfil actualizado
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
  }
};
```

## 🔒 Rutas Protegidas

### Proteger una ruta (requiere autenticación)

```jsx
import ProtectedRoute from './components/routes/ProtectedRoute';
import Dashboard from './pages/Dashboard';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Ruta pública (solo para usuarios no autenticados)

```jsx
import PublicRoute from './components/routes/PublicRoute';
import Login from './pages/Login';

<Route 
  path="/login" 
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  } 
/>
```

## 🎯 Hook de Validación Personalizado

Para validaciones más complejas, usa `useAuthValidation`:

```jsx
import { useAuthValidation } from '../hooks/useAuthValidation';

function AdminPanel() {
  const { hasRole, user } = useAuthValidation();

  if (!hasRole('admin')) {
    return <div>No tienes permisos de administrador</div>;
  }

  return <div>Panel de Administración</div>;
}
```

### Métodos disponibles en useAuthValidation

- `requireAuth(redirectTo)`: Requiere autenticación, redirige si no está autenticado
- `requireGuest(redirectTo)`: Requiere NO estar autenticado, redirige si lo está
- `hasRole(role)`: Verifica si el usuario tiene un rol específico
- `belongsToGroup(groupId)`: Verifica si el usuario pertenece a un grupo

## 📊 Estado del Contexto

### Propiedades disponibles

```javascript
{
  // Estado
  user,              // Object | null - Datos del usuario autenticado
  loading,           // Boolean - Estado de carga
  error,             // String | null - Mensaje de error
  isAuthenticated,   // Boolean - Si el usuario está autenticado
  
  // Métodos
  login,             // Function(credentials) - Iniciar sesión
  register,          // Function(userData) - Registrar usuario
  logout,            // Function() - Cerrar sesión
  updateProfile,     // Function(profileData) - Actualizar perfil
  clearError,        // Function() - Limpiar errores
}
```

## 🔧 Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost/api
```

### Constantes personalizables

Edita `src/constants/auth.js` para personalizar:

- Mensajes de error
- Mensajes de éxito
- Rutas de redirección
- Roles de usuario
- Configuración de timeout

## 🛡️ Seguridad

### Buenas prácticas implementadas

1. **Validación de token con backend**: Al cargar la app, se valida el token llamando a `/auth/me`
2. **Token en localStorage**: Persistencia entre sesiones
3. **Interceptor de axios**: Añade automáticamente el token a todas las peticiones
4. **Manejo de errores 401**: Limpia el estado y redirige automáticamente
5. **Estado derivado**: `isAuthenticated` calculado automáticamente desde `user`
6. **Memoización**: Optimización con `useMemo` y `useCallback` para evitar re-renders
7. **Sincronización**: Datos del usuario actualizados desde el backend

### Limitaciones

- **No hay refresh token**: Los tokens expirados requieren nuevo login
- **localStorage**: Vulnerable a XSS (considera httpOnly cookies en producción)
- **No hay logout en backend**: El logout es solo del lado del cliente

## 📝 Ejemplo Completo

```jsx
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { user, loading, updateProfile, logout, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleUpdate = async (data) => {
    clearError(); // Limpiar errores previos
    try {
      await updateProfile(data);
      alert('Perfil actualizado');
    } catch (err) {
      // El error está en el contexto
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <h1>Perfil de {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
```

## 🐛 Debugging

Para depurar el estado de autenticación:

```jsx
const authState = useAuth();
console.log('Auth State:', authState);
```

Para ver el token actual:

```javascript
import authService from './services/authService';
console.log('Token:', authService.getToken());
console.log('User:', authService.getCurrentUser());
```

## 🔄 Flujo de Autenticación

1. **Carga inicial**: `AuthProvider` verifica si hay token en localStorage
2. **Validación**: Si existe token, llama a `/auth/me` para validarlo
3. **Éxito**: Actualiza estado con datos del usuario
4. **Error 401**: Limpia localStorage y establece `user` como `null`
5. **Navegación**: Las rutas protegidas verifican `isAuthenticated`

## 📚 Referencias

- React Context API: https://react.dev/reference/react/useContext
- Axios Interceptors: https://axios-http.com/docs/interceptors
- React Router Protected Routes: https://reactrouter.com/

