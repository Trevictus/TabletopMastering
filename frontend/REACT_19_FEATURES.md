# 🆕 React 19 - Nuevas Características Disponibles

## ✅ Tu proyecto ya usa React 19.2.0

Vite instaló automáticamente la última versión de React. Aquí están las nuevas características que puedes usar:

---

## 🚀 Características Principales de React 19

### 1. **Actions** - Simplifica formularios y mutaciones

```jsx
// ❌ Antes (React 18)
function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    try {
      const formData = new FormData(e.target);
      await login(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <button disabled={isPending}>
        {isPending ? 'Cargando...' : 'Login'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

// ✅ Ahora (React 19) - ¡Mucho más simple!
function LoginForm() {
  const [error, setError] = useState(null);
  
  async function loginAction(formData) {
    try {
      await login(formData);
    } catch (err) {
      setError(err.message);
    }
  }
  
  return (
    <form action={loginAction}>
      <input name="email" />
      <button>Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### 2. **useFormStatus** - Estado automático de formularios

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner" />
          Guardando...
        </>
      ) : (
        'Guardar'
      )}
    </button>
  );
}

// Uso
function MyForm() {
  async function submitAction(formData) {
    await saveData(formData);
  }
  
  return (
    <form action={submitAction}>
      <input name="name" />
      <SubmitButton /> {/* Se actualiza automáticamente */}
    </form>
  );
}
```

### 3. **useFormState** - Estado persistente en formularios

```jsx
import { useFormState } from 'react-dom';

function ContactForm() {
  const [state, formAction] = useFormState(
    async (prevState, formData) => {
      const response = await sendMessage(formData);
      if (response.error) {
        return { error: response.error };
      }
      return { success: true };
    },
    { error: null, success: false }
  );
  
  return (
    <form action={formAction}>
      <input name="message" />
      <button>Enviar</button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">¡Mensaje enviado!</p>}
    </form>
  );
}
```

### 4. **useOptimistic** - Updates optimistas

```jsx
import { useOptimistic } from 'react';

function MessageList({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      { ...newMessage, sending: true }
    ]
  );
  
  async function formAction(formData) {
    const message = formData.get('message');
    addOptimisticMessage({ text: message, id: Date.now() });
    await sendMessage(message);
  }
  
  return (
    <>
      <ul>
        {optimisticMessages.map(msg => (
          <li key={msg.id} className={msg.sending ? 'opacity-50' : ''}>
            {msg.text}
          </li>
        ))}
      </ul>
      <form action={formAction}>
        <input name="message" />
        <button>Enviar</button>
      </form>
    </>
  );
}
```

### 5. **use()** - Leer promesas y contextos

```jsx
import { use } from 'react';

// Con promesas
function UserProfile({ userPromise }) {
  const user = use(userPromise); // Suspende hasta que se resuelva
  return <h1>{user.name}</h1>;
}

// Con Context (alternativa a useContext)
function MyComponent() {
  const theme = use(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

### 6. **ref como prop** - Ya no necesitas forwardRef

```jsx
// ❌ Antes (React 18)
import { forwardRef } from 'react';

const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});

// ✅ Ahora (React 19) - ¡Más simple!
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### 7. **Metadatos en componentes**

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="author" content={post.author} />
      <meta name="description" content={post.excerpt} />
      <link rel="canonical" href={post.url} />
      
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
// React automáticamente mueve <title>, <meta>, <link> al <head>
```

### 8. **useActionState** - Reemplazo de useFormState

```jsx
import { useActionState } from 'react';

function UpdateName() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get('name'));
      if (error) {
        return error;
      }
      redirect('/profile');
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input name="name" />
      <button disabled={isPending}>Actualizar</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

---

## 📝 Ejemplo Práctico para Tabletop Mastering

### Formulario de Login con React 19

```jsx
// src/pages/auth/LoginPage.jsx
import { useActionState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner" />
          Iniciando sesión...
        </>
      ) : (
        'Iniciar Sesión'
      )}
    </button>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [error, loginAction] = useActionState(
    async (prevState, formData) => {
      try {
        const credentials = {
          email: formData.get('email'),
          password: formData.get('password'),
        };
        
        await login(credentials);
        navigate('/dashboard');
        return null;
      } catch (err) {
        return err.message || 'Error al iniciar sesión';
      }
    },
    null
  );
  
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '3rem auto' }}>
        <div className="card-header">
          <h2>🎲 Iniciar Sesión</h2>
        </div>
        <div className="card-body">
          <form action={loginAction}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Beneficios para tu proyecto

1. **Menos código boilerplate** - Ya no necesitas manejar estados de carga manualmente
2. **Mejor UX** - Updates optimistas y estados de formulario automáticos
3. **Más simple** - No más `forwardRef`, manejo de formularios más intuitivo
4. **Mejor performance** - Optimizaciones internas de React 19
5. **Server Components ready** - Preparado para RSC cuando los necesites

---

## 📚 Recursos

- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Actions Documentation](https://react.dev/reference/react/useActionState)
- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)

---

**¡Ya tienes React 19 instalado! 🎉**  
Puedes empezar a usar estas características cuando crees los componentes.
