# 🎨 Frontend - Documentación Técnica

## Stack
- React 19.2 + Vite 7.2
- React Router v7.9
- Axios + Context API
- CSS Modules + Variables
- React Icons

## Estructura
```
frontend/src/
├── components/
│   ├── common/      # Button, Input, Card, Loading
│   ├── layout/      # Navbar
│   └── routes/      # ProtectedRoute, PublicRoute
├── pages/           # Home, Login, Register, Dashboard, Profile, Groups, Games, History
├── services/        # API communication
├── context/         # AuthContext, GroupContext
├── styles/          # CSS global y variables
└── App.jsx          # Router principal
```

## Rutas

### Públicas
```
/             # Landing page
/login        # Iniciar sesión
/register     # Registro
```

### Protegidas (requieren auth)
```
/home         # Dashboard principal
/profile      # Perfil usuario
/groups       # Lista grupos
/games        # Catálogo juegos
/rankings     # Rankings
/history      # Historial partidas
/calendar     # Calendario
```

## Componentes Principales

### Common
- **Button**: Variantes (primary, outline, danger), tamaños
- **Input**: Con icono, validación, error messages
- **Card**: Variantes (flat, elevated, outlined)
- **Loading**: Spinner con mensaje

### Layout
- **Navbar**: Navegación con iconos, rutas activas, logout

### Routes
- **ProtectedRoute**: Redirige a /login si no auth
- **PublicRoute**: Redirige a /home si ya auth

## Context API

### AuthContext
```javascript
{
  user: Object,
  isAuthenticated: Boolean,
  loading: Boolean,
  login: Function,
  logout: Function,
  register: Function,
  updateProfile: Function
}
```

### GroupContext
```javascript
{
  groups: Array,
  selectedGroup: Object,
  loading: Boolean,
  loadGroups: Function,
  selectGroup: Function,
  createGroup: Function,
  joinGroup: Function
}
```

## Servicios API

### authService
```javascript
register(userData)
login(credentials)
getProfile()
updateProfile(data)
```

### gameService
```javascript
getGames(params)
searchBGG(query)
addFromBGG(bggId, groupId)
createCustom(gameData)
deleteGame(id)
```

### groupService
```javascript
getGroups()
getGroup(id)
createGroup(data)
joinGroup(code)
leaveGroup(id)
```

### matchService
```javascript
getMatches(params)
createMatch(data)
updateMatch(id, data)
deleteMatch(id)
```

## Estilos

### Variables CSS
```css
:root {
  /* Colors */
  --primary: #8b4513;
  --secondary: #d4af37;
  --text-primary: #2d3748;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Layout */
  --border-radius: 8px;
  --box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

### CSS Modules
- Scoped styles por componente
- Evita conflictos de nombres
- Mejor performance

## Instalación
```bash
cd frontend
npm install
npm run dev          # Desarrollo (puerto 5173)
npm run build        # Build producción
npm run preview      # Preview build
```

## Características
- ✅ Autenticación JWT con persistencia
- ✅ Rutas protegidas
- ✅ Context API para estado global
- ✅ Componentes reutilizables
- ✅ CSS Modules
- ✅ React Icons
- ✅ Axios interceptors
- ✅ Error handling
- 🚧 Responsive design
- 🚧 PWA
