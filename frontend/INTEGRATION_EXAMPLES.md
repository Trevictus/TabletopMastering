# 💡 Ejemplos Prácticos de Integración

Este documento muestra cómo integrar el sistema de autenticación en componentes comunes de la aplicación.

---

## 1. Navbar con Usuario Autenticado

```jsx
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">TabletopMastering</Link>
      </div>

      <div className="navbar-menu">
        <Link to="/">Inicio</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Perfil</Link>
            
            <div className="navbar-user">
              <span>Hola, {user.name}</span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

---

## 2. Formulario de Registro

```jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage() {
  const { register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al cambiar inputs
    clearError();
    setValidationError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Registro exitoso, redirigir
      navigate('/dashboard');
    } catch (err) {
      // El error ya está en el contexto
      console.error('Error en registro:', err);
    }
  };

  return (
    <div className="register-page">
      <h1>Crear cuenta</h1>

      <form onSubmit={handleSubmit}>
        {(error || validationError) && (
          <div className="error-message">
            {validationError || error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
```

---

## 3. Dashboard con Datos del Usuario

```jsx
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // El token se añade automáticamente por el interceptor
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Bienvenido, {user.name}!</h1>
        <p>Email: {user.email}</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Partidas jugadas</h3>
          <p className="stat-number">{stats?.totalGames || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Victorias</h3>
          <p className="stat-number">{stats?.wins || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Grupos</h3>
          <p className="stat-number">{user.groups?.length || 0}</p>
        </div>
      </div>

      {user.groups && user.groups.length > 0 && (
        <div className="dashboard-groups">
          <h2>Tus grupos</h2>
          <ul>
            {user.groups.map((group) => (
              <li key={group.id || group._id}>
                <Link to={`/groups/${group.id || group._id}`}>
                  {group.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
```

---

## 4. Página de Perfil con Edición

```jsx
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function ProfilePage() {
  const { user, updateProfile, error, loading, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
    clearError();
    setSuccessMessage('');
  };

  return (
    <div className="profile-page">
      <h1>Mi Perfil</h1>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        {user.role && (
          <div className="form-group">
            <label>Rol</label>
            <input
              type="text"
              value={user.role}
              disabled
            />
          </div>
        )}

        <div className="form-actions">
          {isEditing ? (
            <>
              <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)}
            >
              Editar perfil
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
```

---

## 5. Componente con Validación de Roles

```jsx
import { useAuth } from '../context/AuthContext';
import { useAuthValidation } from '../hooks/useAuthValidation';

function AdminPanel() {
  const { user } = useAuth();
  const { hasRole } = useAuthValidation();

  if (!hasRole('admin')) {
    return (
      <div className="access-denied">
        <h1>Acceso denegado</h1>
        <p>No tienes permisos de administrador.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {user.name}</p>
      
      {/* Contenido admin */}
    </div>
  );
}

export default AdminPanel;
```

---

## 6. Hook Personalizado para Peticiones Autenticadas

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Hook personalizado para hacer peticiones autenticadas
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones de la petición
 */
function useAuthenticatedRequest(url, options = {}) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(url, options);
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
        console.error('Error en petición:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, isAuthenticated]);

  return { data, loading, error };
}

// Uso del hook
function MyComponent() {
  const { data, loading, error } = useAuthenticatedRequest('/api/my-data');

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No hay datos</p>;

  return <div>{/* Renderizar data */}</div>;
}
```

---

## 7. Componente de Carga Condicional

```jsx
import { useAuth } from '../context/AuthContext';

function ConditionalContent({ children, requireAuth = false, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || <p>Debes iniciar sesión para ver este contenido.</p>;
  }

  return <>{children}</>;
}

// Uso
function HomePage() {
  return (
    <div>
      <h1>Bienvenido</h1>
      
      <ConditionalContent requireAuth={false}>
        <p>Contenido público</p>
      </ConditionalContent>

      <ConditionalContent 
        requireAuth={true}
        fallback={<p>Inicia sesión para ver tus estadísticas</p>}
      >
        <UserStats />
      </ConditionalContent>
    </div>
  );
}
```

---

## 8. Formulario con Auto-guardado

```jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; // npm install lodash

function AutoSaveProfile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'

  // Función de guardado debounced (espera 1 segundo)
  const debouncedSave = useCallback(
    debounce(async (data) => {
      try {
        setSaveStatus('saving');
        await updateProfile(data);
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('error');
        console.error('Error al guardar:', err);
      }
    }, 1000),
    [updateProfile]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    debouncedSave(newData);
  };

  return (
    <div className="auto-save-form">
      <div className="save-indicator">
        {saveStatus === 'saving' && '💾 Guardando...'}
        {saveStatus === 'saved' && '✅ Guardado'}
        {saveStatus === 'error' && '❌ Error al guardar'}
      </div>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre"
      />

      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Biografía"
      />
    </div>
  );
}
```

---

## 9. Redirección Inteligente Post-Login

```jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function LoginPage() {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Obtener la ruta desde donde vino (si intentó acceder a ruta protegida)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(credentials);
      // Redirigir a la ruta original o a dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <h1>Iniciar sesión</h1>
      
      {location.state?.message && (
        <div className="info-message">
          {location.state.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ... campos del formulario ... */}
      </form>
    </div>
  );
}

// Y en ProtectedRoute
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Guardar la ruta actual para redirigir después del login
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          from: location,
          message: 'Debes iniciar sesión para acceder a esta página'
        }} 
      />
    );
  }

  return children;
}
```

---

## 10. Componente de Avatar del Usuario

```jsx
import { useAuth } from '../context/AuthContext';

function UserAvatar({ size = 'medium' }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-xl'
  };

  const initial = user.name?.charAt(0).toUpperCase() || 'U';
  
  return (
    <div 
      className={`user-avatar ${sizeClasses[size]}`}
      style={{
        backgroundColor: stringToColor(user.email || user.name),
      }}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

// Función helper para generar color desde string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

export default UserAvatar;
```

---

**Nota:** Estos ejemplos asumen que tienes instaladas las dependencias necesarias (`react-router-dom`, etc.) y que el backend tiene los endpoints correspondientes.

Para más información, consulta [`AUTHENTICATION.md`](./AUTHENTICATION.md).


