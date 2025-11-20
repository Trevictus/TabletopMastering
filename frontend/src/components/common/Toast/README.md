# Sistema de Notificaciones Toast

Sistema completo de notificaciones toast para TabletopMastering. Proporciona feedback visual para operaciones exitosas, errores, advertencias e información.

## 📁 Estructura

```
frontend/src/
├── context/
│   └── ToastContext.jsx          # Contexto global de toasts
├── components/common/Toast/
│   ├── Toast.jsx                 # Componente individual de toast
│   ├── Toast.module.css          # Estilos del toast
│   ├── ToastContainer.jsx        # Contenedor de toasts
│   ├── ToastContainer.module.css # Estilos del contenedor
│   └── index.js                  # Exports
```

## 🚀 Uso Básico

### 1. Importar el hook

```jsx
import { useToast } from '../context/ToastContext';

function MiComponente() {
  const toast = useToast();
  
  // ... tu código
}
```

### 2. Mostrar notificaciones

```jsx
// Éxito
toast.success('Juego añadido correctamente');

// Error
toast.error('No se pudo cargar los datos');

// Advertencia
toast.warning('Esta acción no se puede deshacer');

// Información
toast.info('Se han guardado los cambios automáticamente');
```

## 📋 API Completa

### Tipos de Toast

#### `success(message, options?)`
Muestra un toast de éxito.

```jsx
toast.success('Operación completada');

// Con opciones
toast.success('Grupo creado', {
  title: 'Éxito',
  duration: 5000,
  action: {
    label: 'Ver grupo',
    onClick: () => navigate(`/groups/${groupId}`)
  }
});
```

#### `error(message, options?)`
Muestra un toast de error.

```jsx
toast.error('Error al guardar los cambios');

// Con título personalizado
toast.error('No se encontró el juego', {
  title: 'Error 404'
});
```

#### `warning(message, options?)`
Muestra un toast de advertencia.

```jsx
toast.warning('Estás a punto de eliminar este elemento');
```

#### `info(message, options?)`
Muestra un toast informativo.

```jsx
toast.info('Sincronizando con BoardGameGeek...');
```

#### `promise(promiseFn, messages)`
Maneja toasts para operaciones asíncronas automáticamente.

```jsx
await toast.promise(
  async () => {
    const result = await api.post('/games', gameData);
    return result.data;
  },
  {
    loading: 'Guardando juego...',
    success: (data) => `${data.name} añadido correctamente`,
    error: (err) => `Error: ${err.message}`,
  }
);
```

### Opciones

Todas las funciones aceptan un objeto `options`:

```typescript
{
  title?: string;        // Título del toast (por defecto según tipo)
  duration?: number;     // Duración en ms (0 = sin auto-close)
  action?: {            // Botón de acción opcional
    label: string;
    onClick: () => void;
  }
}
```

### Duraciones por Defecto

- `success`: 3000ms (3s)
- `error`: 5000ms (5s)
- `warning`: 4000ms (4s)
- `info`: 3000ms (3s)

### Funciones Adicionales

```jsx
// Remover un toast específico
const toastId = toast.success('Mensaje');
toast.remove(toastId);

// Limpiar todos los toasts
toast.clearAll();
```

## 🎨 Integración con useApi

El hook `useApi` tiene soporte integrado para toasts:

```jsx
const { data, loading, execute } = useApi(
  () => gameService.getGames(),
  {
    showErrorToast: true,      // Mostrar errores automáticamente
    showSuccessToast: true,    // Mostrar éxito automáticamente
    successMessage: 'Juegos cargados correctamente',
  }
);
```

### Mensajes Dinámicos

```jsx
const { execute } = useApi(
  (gameData) => gameService.createGame(gameData),
  {
    showSuccessToast: true,
    successMessage: (data) => `${data.name} añadido a tu colección`,
  }
);
```

## 📝 Ejemplos Completos

### Ejemplo 1: Formulario de Login

```jsx
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

function Login() {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await authService.login(credentials);
      toast.success('¡Bienvenido de nuevo!', {
        action: {
          label: 'Ir al dashboard',
          onClick: () => navigate('/dashboard')
        }
      });
    } catch (error) {
      toast.error(error.userMessage || 'Credenciales inválidas', {
        title: 'Error de autenticación'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos del formulario */}
    </form>
  );
}
```

### Ejemplo 2: Operación con Promise

```jsx
import { useToast } from '../context/ToastContext';

function DeleteGameButton({ gameId, onDeleted }) {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await toast.promise(
        gameService.deleteGame(gameId),
        {
          loading: 'Eliminando juego...',
          success: 'Juego eliminado correctamente',
          error: 'No se pudo eliminar el juego',
        }
      );
      onDeleted();
    } catch (err) {
      // El error ya se mostró en el toast
    }
  };

  return (
    <button onClick={handleDelete}>
      Eliminar
    </button>
  );
}
```

### Ejemplo 3: Con useApi

```jsx
import useApi from '../hooks/useApi';
import { gameService } from '../services/gameService';

function GamesList() {
  const { data: games, loading, execute } = useApi(
    () => gameService.getGames(),
    {
      immediate: true,
      showErrorToast: true,  // Errores automáticos
      showSuccessToast: false,
    }
  );

  const handleRefresh = () => {
    execute();  // Los errores se mostrarán automáticamente
  };

  if (loading) return <Loading />;

  return (
    <div>
      <button onClick={handleRefresh}>Actualizar</button>
      {games?.map(game => <GameCard key={game._id} game={game} />)}
    </div>
  );
}
```

### Ejemplo 4: Validación de Formulario

```jsx
function AddGameForm() {
  const toast = useToast();
  const [formData, setFormData] = useState({});

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name) {
      errors.push('El nombre es obligatorio');
    }
    
    if (formData.players && formData.players < 1) {
      errors.push('Debe tener al menos 1 jugador');
    }

    if (errors.length > 0) {
      toast.warning(errors.join(', '), {
        title: 'Revisa el formulario',
        duration: 5000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await gameService.createGame(formData);
      toast.success('Juego añadido correctamente');
    } catch (error) {
      toast.error(error.userMessage);
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### Ejemplo 5: Toast con Acción

```jsx
function GroupInvitation({ invitation }) {
  const toast = useToast();

  const handleAccept = async () => {
    try {
      await groupService.acceptInvitation(invitation.id);
      
      toast.success('Te has unido al grupo', {
        action: {
          label: 'Ver grupo',
          onClick: () => navigate(`/groups/${invitation.groupId}`)
        }
      });
    } catch (error) {
      toast.error('No se pudo aceptar la invitación');
    }
  };

  return <button onClick={handleAccept}>Aceptar</button>;
}
```

## 🎨 Personalización

### Estilos CSS

Los toasts utilizan CSS Modules y CSS Variables para fácil personalización:

```css
/* Toast.module.css */
.toast {
  /* Personaliza el contenedor */
}

.success {
  border-left-color: #2d5016;  /* Color del borde */
}

.error {
  border-left-color: #dc2626;
}
```

### Variables CSS Globales

Puedes sobrescribir las variables en `variables.css`:

```css
:root {
  --border-radius: 0.5rem;
  --text-primary: #2a1f15;
  --text-secondary: #5c4f42;
}
```

## 🔧 Configuración Avanzada

### Desactivar Auto-close

```jsx
toast.info('Proceso en ejecución...', {
  duration: 0  // No se cierra automáticamente
});
```

### Acceso Programático

```jsx
const toastId = toast.success('Guardando...');

// Más tarde...
toast.remove(toastId);
```

## ♿ Accesibilidad

El sistema incluye soporte completo de accesibilidad:

- **ARIA roles**: `role="alert"` y `aria-live="polite"`
- **Teclado**: Presiona `Escape` para cerrar
- **Screen readers**: Anuncios automáticos de toasts

## 📱 Responsive

Los toasts son completamente responsive:

- Desktop: Esquina superior derecha, ancho fijo
- Tablet/Mobile: Se adapta al ancho de la pantalla
- Scroll automático si hay muchos toasts

## 🐛 Troubleshooting

### Los toasts no aparecen

Verifica que `ToastProvider` está en `App.jsx`:

```jsx
<ToastProvider>
  <YourApp />
  <ToastContainer />
</ToastProvider>
```

### Error: "useToast debe ser usado dentro de un ToastProvider"

El componente está fuera del provider. Muévelo dentro o ajusta la jerarquía.

### Los toasts se superponen

Verifica el z-index en `ToastContainer.module.css`:

```css
.container {
  z-index: 9999;
}
```

## 🔮 Próximas Mejoras

- [ ] Soporte para toasts persistentes
- [ ] Sonidos de notificación
- [ ] Animaciones personalizables
- [ ] Posicionamiento configurable
- [ ] Temas (claro/oscuro)
- [ ] Agrupación de toasts similares

## 📚 Referencias

- [ToastContext.jsx](../context/ToastContext.jsx) - Contexto global
- [Toast.jsx](./Toast.jsx) - Componente individual
- [useApi.js](../../hooks/useApi.js) - Integración con API
