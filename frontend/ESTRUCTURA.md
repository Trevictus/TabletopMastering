# 📋 Estructura del Frontend - Tabletop Mastering

## ✅ Configuración Completada

La aplicación React con Vite ha sido configurada exitosamente con la siguiente estructura profesional:

## 📁 Estructura de Carpetas

```
frontend/
│
├── src/
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── auth/               # Login, Register, Profile
│   │   ├── groups/             # GroupCard, GroupList, GroupForm
│   │   ├── games/              # GameCard, GameList, GameSearch
│   │   ├── matches/            # MatchCard, MatchCalendar, MatchForm
│   │   ├── common/             # Button, Card, Input, Modal, etc.
│   │   └── layout/             # Navbar, Footer, Sidebar
│   │
│   ├── pages/                  # Páginas completas
│   │   ├── auth/               # LoginPage, RegisterPage
│   │   ├── groups/             # GroupsPage, GroupDetailPage
│   │   ├── games/              # GamesPage, GameDetailPage
│   │   ├── matches/            # MatchesPage, CreateMatchPage
│   │   └── profile/            # ProfilePage, SettingsPage
│   │
│   ├── services/               # Servicios API ✅
│   │   ├── api.js             # Configuración de axios con interceptors
│   │   ├── authService.js     # register, login, logout, getProfile
│   │   ├── groupService.js    # CRUD de grupos, join, members
│   │   ├── gameService.js     # CRUD de juegos, BGG integration
│   │   └── matchService.js    # CRUD de partidas (preparado)
│   │
│   ├── context/                # Context API ✅
│   │   └── AuthContext.jsx    # Contexto global de autenticación
│   │
│   ├── hooks/                  # Custom hooks (vacío, preparado)
│   │
│   ├── utils/                  # Utilidades ✅
│   │   ├── validators.js      # Validaciones de formularios
│   │   ├── dateUtils.js       # Formateo de fechas
│   │   └── errorHandler.js    # Manejo de errores API
│   │
│   ├── styles/                 # Estilos globales ✅
│   │   ├── variables.css      # Variables CSS, reset, base styles
│   │   ├── components.css     # Botones, cards, forms, badges
│   │   └── layout.css         # Navbar, footer, sidebar, tables
│   │
│   ├── assets/                 # Recursos estáticos (preparado)
│   │
│   ├── App.jsx                 # Componente principal ✅
│   └── main.jsx                # Punto de entrada
│
├── .env                        # Variables de entorno ✅
├── .env.example                # Template de variables ✅
├── .gitignore                  # Archivos ignorados ✅
├── package.json                # Dependencias
├── vite.config.js              # Configuración de Vite
└── README.md                   # Documentación (pendiente)
```

## 🎯 Servicios API Implementados

### 1. **AuthService** ✅
```javascript
- register(userData)          // Registrar usuario
- login(credentials)          // Iniciar sesión
- logout()                    // Cerrar sesión
- getProfile()                // Obtener perfil
- updateProfile(profileData)  // Actualizar perfil
- isAuthenticated()           // Verificar autenticación
- getCurrentUser()            // Obtener usuario del localStorage
```

### 2. **GroupService** ✅
```javascript
- getMyGroups()                    // Listar mis grupos
- getGroupById(groupId)            // Detalle de grupo
- createGroup(groupData)           // Crear grupo
- joinGroup(inviteCode)            // Unirse con código
- getGroupMembers(groupId)         // Listar miembros
- updateGroup(groupId, data)       // Actualizar (admin)
- deleteGroup(groupId)             // Eliminar (admin)
```

### 3. **GameService** ✅
```javascript
- searchBGG(query)                    // Buscar en BGG
- getBGGDetails(bggId)                // Detalles de BGG
- getBGGHotList()                     // Lista popular BGG
- addFromBGG(bggId, groupId, notes)   // Importar de BGG
- createCustomGame(gameData)          // Crear personalizado
- getGames(params)                    // Listar juegos
- getGameById(gameId)                 // Detalle de juego
- updateGame(gameId, data)            // Actualizar juego
- syncWithBGG(gameId)                 // Sincronizar BGG
- deleteGame(gameId)                  // Eliminar juego
- getGroupStats(groupId)              // Estadísticas
```

### 4. **MatchService** ✅
```javascript
- getMatches(params)           // Listar partidas
- createMatch(matchData)       // Crear partida
- getMatchById(matchId)        // Detalle de partida
- updateMatch(matchId, data)   // Actualizar partida
- deleteMatch(matchId)         // Eliminar partida
```

## 🎨 Sistema de Estilos CSS

### Variables CSS (`variables.css`)
- ✅ Colores principales (primary, secondary)
- ✅ Colores de estado (success, warning, error, info)
- ✅ Colores de fondo y texto
- ✅ Sistema de espaciado consistente
- ✅ Tipografía responsiva
- ✅ Sombras y bordes
- ✅ Transiciones
- ✅ Z-index organizados
- ✅ Scrollbar personalizada

### Componentes (`components.css`)
- ✅ Botones (.btn-primary, .btn-secondary, .btn-outline, .btn-danger)
- ✅ Cards (.card, .card-header, .card-body, .card-footer)
- ✅ Formularios (.form-group, .form-control, .form-label)
- ✅ Badges (.badge-primary, .badge-success, etc.)
- ✅ Alerts (.alert-success, .alert-warning, etc.)
- ✅ Spinner de carga animado
- ✅ Modales (.modal-overlay, .modal-content)

### Layout (`layout.css`)
- ✅ Navbar sticky con shadow
- ✅ Footer responsive
- ✅ Sidebar con menú
- ✅ Page container con flex
- ✅ Dashboard grid
- ✅ Stat cards
- ✅ Tablas con hover
- ✅ Empty states

## 🛠️ Utilidades Implementadas

### Validadores (`validators.js`)
```javascript
- validateEmail(email)           // Valida formato de email
- validatePassword(password)     // Mínimo 6 caracteres
- validateUsername(username)     // Mínimo 3 caracteres
- validateRequired(value)        // Campo no vacío
- validateInviteCode(code)       // 8 caracteres alfanuméricos
```

### Formateo de Fechas (`dateUtils.js`)
```javascript
- formatDate(date)        // "7 de noviembre de 2025"
- formatDateTime(date)    // "7 de noviembre de 2025, 14:30"
- timeAgo(date)          // "hace 2 horas", "hace 3 días"
```

### Manejo de Errores (`errorHandler.js`)
```javascript
- handleApiError(error)   // Extrae mensaje de error de axios
- showSuccess(message)    // Muestra notificación de éxito
- showError(message)      // Muestra notificación de error
```

## 🔐 Context API

### AuthContext ✅
Proporciona autenticación global:
```javascript
const { 
  user,              // Usuario actual
  loading,           // Estado de carga
  isAuthenticated,   // Boolean de autenticación
  login,             // Función de login
  register,          // Función de registro
  logout,            // Función de logout
  updateProfile      // Actualizar perfil
} = useAuth();
```

## 🔧 Configuración

### Axios con Interceptors ✅
- ✅ Auto-añade token JWT a las peticiones
- ✅ Maneja errores 401 (logout automático)
- ✅ Timeout de 10 segundos
- ✅ Base URL configurable desde .env

### Variables de Entorno ✅
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Tabletop Mastering
VITE_APP_VERSION=1.0.0
```

## 📦 Dependencias Instaladas

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "axios": "^1.7.9"
  },
  "devDependencies": {
    "vite": "^7.2.2",
    "@vitejs/plugin-react": "^4.3.4"
  }
}
```

## 🚀 Comandos Disponibles

```bash
npm run dev        # Servidor de desarrollo (localhost:5173)
npm run build      # Construir para producción
npm run preview    # Vista previa de producción
```

## ✅ Estado Actual

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Configuración base | ✅ | Vite + React configurado |
| Estructura de carpetas | ✅ | Organización profesional |
| Servicios API | ✅ | 4 servicios completos |
| Context API | ✅ | AuthContext implementado |
| Utilidades | ✅ | Validadores, formateo, errores |
| Sistema de estilos | ✅ | CSS completo y profesional |
| Variables de entorno | ✅ | Configuración de .env |
| Axios configurado | ✅ | Con interceptors |

## 📝 Próximos Pasos Sugeridos

1. ⏳ **Instalar React Router**
   ```bash
   npm install react-router-dom
   ```

2. ⏳ **Crear componentes comunes**
   - Button.jsx
   - Card.jsx
   - Input.jsx
   - Modal.jsx
   - Spinner.jsx

3. ⏳ **Crear componentes de layout**
   - Navbar.jsx
   - Footer.jsx
   - Sidebar.jsx

4. ⏳ **Crear páginas de autenticación**
   - LoginPage.jsx
   - RegisterPage.jsx

5. ⏳ **Configurar routing**
   - Rutas públicas y privadas
   - ProtectedRoute component

6. ⏳ **Instalar librería de iconos**
   ```bash
   npm install react-icons
   ```

7. ⏳ **Instalar librería de notificaciones**
   ```bash
   npm install react-hot-toast
   ```

## 📊 Integración con Backend

El frontend está preparado para conectar con el backend de Tabletop Mastering:

- **Backend URL:** `http://localhost:3000`
- **API Endpoint:** `http://localhost:3000/api`
- **Autenticación:** JWT Bearer Token
- **Módulos disponibles:** Auth, Groups, Games
- **Módulo pendiente:** Matches

## 🎯 Características del Setup

1. ✅ **Arquitectura escalable** - Separación clara de responsabilidades
2. ✅ **Reutilización** - Servicios y utilidades compartidas
3. ✅ **Mantenibilidad** - Código organizado y documentado
4. ✅ **Performance** - Vite para builds rápidos
5. ✅ **Seguridad** - Manejo de tokens y errores
6. ✅ **UX** - Sistema de estilos consistente
7. ✅ **DX** - Hot reload, estructura clara

## 🎨 Guía de Uso de Estilos

### Ejemplo de Botones
```jsx
<button className="btn btn-primary">Primario</button>
<button className="btn btn-secondary">Secundario</button>
<button className="btn btn-outline">Outline</button>
<button className="btn btn-danger">Peligro</button>
<button className="btn btn-sm">Pequeño</button>
<button className="btn btn-lg">Grande</button>
```

### Ejemplo de Card
```jsx
<div className="card">
  <div className="card-header">
    <h3>Título</h3>
  </div>
  <div className="card-body">
    Contenido
  </div>
  <div className="card-footer">
    <button className="btn btn-primary">Acción</button>
  </div>
</div>
```

### Ejemplo de Formulario
```jsx
<div className="form-group">
  <label className="form-label">Email</label>
  <input type="email" className="form-control" placeholder="tu@email.com" />
  <div className="form-help">Te enviaremos un código de verificación</div>
</div>
```

---

**¡La estructura del frontend está lista para comenzar a desarrollar componentes y páginas! 🚀**
