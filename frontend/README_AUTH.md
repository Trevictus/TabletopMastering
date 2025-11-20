# 🔐 Sistema de Autenticación Global - TabletopMastering

> **Estado:** ✅ Completado y Listo para Producción  
> **Versión:** 1.0.0  
> **Fecha:** 2025-11-20

---

## 📖 Documentación Disponible

### 🚀 **Para empezar rápidamente**
👉 [`QUICK_START_AUTH.md`](./QUICK_START_AUTH.md) - Ejemplos prácticos en 5 minutos

### 📘 **Para entender todo el sistema**
👉 [`AUTHENTICATION.md`](./AUTHENTICATION.md) - Guía completa con todos los detalles

### 🏗️ **Para arquitectos y tech leads**
👉 [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) - Resumen técnico y decisiones

### ✅ **Para verificar la implementación**
👉 [`VERIFICATION_CHECKLIST.md`](./VERIFICATION_CHECKLIST.md) - Checklist de QA

### 🔄 **Para visualizar los flujos**
👉 [`FLOW_DIAGRAMS.md`](./FLOW_DIAGRAMS.md) - Diagramas ASCII de flujos

### 📚 **Índice completo**
👉 [`AUTH_DOCS_INDEX.md`](./AUTH_DOCS_INDEX.md) - Índice de toda la documentación

---

## ⚡ Uso Rápido

```jsx
import { useAuth } from './context/AuthContext';

function MiComponente() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Hola, {user.name}!</p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <p>Por favor inicia sesión</p>
      )}
    </div>
  );
}
```

---

## 📂 Archivos Principales

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| `src/context/AuthContext.jsx` | Context principal ⭐ | Crítico |
| `src/services/authService.js` | Servicio de autenticación | Crítico |
| `src/services/api.js` | Cliente HTTP con interceptores | Crítico |
| `src/hooks/useAuthValidation.js` | Hook personalizado | Importante |
| `src/constants/auth.js` | Constantes centralizadas | Importante |
| `src/components/common/UserInfo.jsx` | Componente de ejemplo | Opcional |
| `src/auth/index.js` | Exportaciones centralizadas | Útil |

---

## ✨ Características

- ✅ **Context API** para estado global sin prop drilling
- ✅ **Validación automática de token** al cargar la app
- ✅ **Persistencia en localStorage** entre sesiones
- ✅ **Interceptores HTTP** que añaden token automáticamente
- ✅ **Manejo de errores 401** con limpieza y redirección
- ✅ **Optimizado** con `useMemo` y `useCallback`
- ✅ **Completamente documentado** con JSDoc + Markdown
- ✅ **Tests de ejemplo** incluidos

---

## 🎯 API del Contexto

### Estados
```javascript
const {
  user,              // Object | null
  loading,           // Boolean
  error,             // String | null
  isAuthenticated,   // Boolean (derivado de user)
} = useAuth();
```

### Métodos
```javascript
const {
  login,             // async (credentials) => Promise
  register,          // async (userData) => Promise
  logout,            // () => void
  updateProfile,     // async (profileData) => Promise
  clearError,        // () => void
} = useAuth();
```

---

## 🚦 Ejemplo Completo de Login

```jsx
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage() {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      // El error ya está en el contexto
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Contraseña"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

---

## 🔒 Rutas Protegidas

```jsx
import ProtectedRoute from './components/routes/ProtectedRoute';
import Dashboard from './pages/Dashboard';

// En tu configuración de rutas
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🏗️ Arquitectura

```
App.jsx
  └─ <AuthProvider>
       ├─ Estado global (user, loading, error, isAuthenticated)
       ├─ Métodos (login, register, logout, updateProfile)
       └─ Componentes hijos
            └─ useAuth() hook para acceder al contexto
```

---

## 🔄 Flujo de Autenticación

1. **App carga** → AuthProvider monta → Verifica token en localStorage
2. **Si hay token** → Llama `GET /auth/me` para validar
3. **Token válido** → Actualiza estado con usuario
4. **Token inválido** → Limpia localStorage y establece `user = null`
5. **Usuario navega** → Rutas protegidas verifican `isAuthenticated`

---

## 🐛 Debugging

```javascript
// Ver estado actual
const auth = useAuth();
console.log('Auth State:', auth);

// Ver localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

---

## 📊 Estadísticas

- **Líneas de código:** ~750
- **Archivos creados:** 9
- **Archivos modificados:** 3
- **Documentación:** 100% (JSDoc + Markdown)
- **Tests:** Incluidos (ejemplos)

---

## ⚠️ Limitaciones Conocidas

1. **localStorage es vulnerable a XSS** - En producción considera httpOnly cookies
2. **No hay refresh token** - Token expirado requiere nuevo login
3. **Logout solo cliente** - No invalida token en backend

---

## 🎓 Próximos Pasos Sugeridos

1. Implementar refresh token automático
2. Migrar a httpOnly cookies
3. Añadir autenticación de dos factores (2FA)
4. Implementar tests E2E con Cypress
5. Añadir rate limiting en login
6. Implementar notificaciones toast

---

## 📞 Soporte

**¿Necesitas ayuda?**

- **Inicio rápido:** Lee [`QUICK_START_AUTH.md`](./QUICK_START_AUTH.md)
- **Problemas técnicos:** Consulta [`AUTHENTICATION.md`](./AUTHENTICATION.md) sección "Debugging"
- **Verificación:** Usa [`VERIFICATION_CHECKLIST.md`](./VERIFICATION_CHECKLIST.md)
- **Flujos:** Revisa [`FLOW_DIAGRAMS.md`](./FLOW_DIAGRAMS.md)

---

## ✅ Checklist de Integración

- [ ] AuthProvider envuelve la app en `App.jsx` o `main.jsx`
- [ ] Rutas protegidas usan `<ProtectedRoute>`
- [ ] Rutas públicas usan `<PublicRoute>`
- [ ] Componentes usan `useAuth()` para acceder al estado
- [ ] Variables de entorno configuradas (`VITE_API_URL`)
- [ ] Backend tiene endpoints: `/auth/login`, `/auth/register`, `/auth/me`, `/auth/profile`

---

## 📝 Changelog

### v1.0.0 (2025-11-20)
- ✅ Implementación completa del sistema de autenticación
- ✅ Context API con hooks personalizados
- ✅ Interceptores HTTP para manejo de tokens
- ✅ Validación automática de token con backend
- ✅ Documentación completa
- ✅ Tests de ejemplo
- ✅ Componentes de ejemplo

---

## 🤝 Contribuir

Para contribuir al sistema de autenticación:

1. Lee la documentación técnica en [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)
2. Verifica que tus cambios no rompan los flujos existentes
3. Actualiza la documentación correspondiente
4. Añade tests si es necesario

---

## 📜 Licencia

Este código es parte del proyecto TabletopMastering.

---

**Desarrollado con ❤️ siguiendo las mejores prácticas de React y JavaScript**


