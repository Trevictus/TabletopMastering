# 🚀 Guía Rápida: Sistema de Autenticación Global

## 📌 Inicio Rápido

### 1. Usar el hook `useAuth` en cualquier componente:

```jsx
import { useAuth } from './context/AuthContext';

function MiComponente() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <p>Cargando...</p>;
  
  return (
    <div>
      {isAuthenticated ? (
        <h1>Hola {user.name}</h1>
      ) : (
        <h1>Por favor inicia sesión</h1>
      )}
    </div>
  );
}
```

### 2. Implementar Login:

```jsx
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await login({
        email: formData.get('email'),
        password: formData.get('password')
      });
      navigate('/dashboard'); // Redirigir después de login exitoso
    } catch (err) {
      // El error ya está disponible en el contexto
      console.error(err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

### 3. Implementar Logout:

```jsx
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const { logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav>
      {isAuthenticated && (
        <>
          <span>Hola, {user.name}</span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      )}
    </nav>
  );
}
```

### 4. Proteger Rutas:

```jsx
// Ya está implementado en ProtectedRoute.jsx
import ProtectedRoute from './components/routes/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 🎯 API del Contexto

### Estados disponibles:
- `user` - Objeto con datos del usuario (null si no autenticado)
- `loading` - Boolean de estado de carga
- `error` - String con mensaje de error (null si no hay error)
- `isAuthenticated` - Boolean derivado de `user` (true si hay usuario)

### Métodos disponibles:
- `login(credentials)` - Inicia sesión
- `register(userData)` - Registra nuevo usuario
- `logout()` - Cierra sesión
- `updateProfile(data)` - Actualiza perfil
- `clearError()` - Limpia errores

## 📂 Archivos Clave

```
frontend/src/
├── context/
│   └── AuthContext.jsx          ← Contexto principal (USAR ESTE)
├── hooks/
│   └── useAuthValidation.js     ← Hook adicional (opcional)
├── services/
│   ├── authService.js           ← Servicio de autenticación
│   └── api.js                   ← Cliente HTTP (interceptores)
└── constants/
    └── auth.js                  ← Constantes (mensajes, rutas)
```

## ✅ Checklist de Implementación

- [x] AuthContext creado y mejorado
- [x] authService con métodos completos
- [x] Interceptor de axios para añadir token
- [x] Validación de token al cargar app
- [x] Estados de loading y error
- [x] Constantes centralizadas
- [x] Documentación completa
- [x] Ejemplo de componente (UserInfo)

## 🔑 Características Principales

✅ **Validación automática de token** - Al cargar la app, valida con backend  
✅ **Persistencia en localStorage** - La sesión persiste entre recargas  
✅ **Interceptores HTTP** - Token añadido automáticamente a peticiones  
✅ **Manejo de errores 401** - Limpia estado y redirige automáticamente  
✅ **Optimizado con memoización** - Evita re-renders innecesarios  
✅ **Completamente documentado** - JSDoc + guías en Markdown  

## 📖 Documentación Completa

Para más detalles, ver:
- **`AUTHENTICATION.md`** - Guía completa con todos los ejemplos
- **`IMPLEMENTATION_SUMMARY.md`** - Resumen técnico de la implementación

## 🐛 Debugging

```javascript
// Ver estado actual de autenticación
import { useAuth } from './context/AuthContext';

function Debug() {
  const auth = useAuth();
  console.log('Estado Auth:', auth);
  return null;
}

// Ver token y usuario en localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

## ⚡ Tips

1. **Siempre usar `useAuth()`** en lugar de acceder localStorage directamente
2. **Verificar `loading`** antes de mostrar contenido
3. **Manejar `error`** para mostrar mensajes al usuario
4. **Usar `clearError()`** antes de nuevas acciones
5. **El token se añade automáticamente** a todas las peticiones HTTP

## 🎓 Ejemplo Completo

Ver el componente `UserInfo.jsx` para un ejemplo completo funcional.

---

**¿Preguntas?** Consulta `AUTHENTICATION.md` para documentación detallada.

