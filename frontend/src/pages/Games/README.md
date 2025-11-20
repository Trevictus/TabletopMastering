# 🎮 Módulo de Gestión de Juegos

## Descripción

Módulo completo para la gestión de juegos de mesa con integración a BoardGameGeek (BGG). Permite buscar, añadir, sincronizar y gestionar juegos tanto desde BGG como personalizados.

## ✨ Características Implementadas

### Componentes

#### 1. **GroupContext** (`context/GroupContext.jsx`)
- Context API para gestión global de grupos
- Selección y persistencia de grupo activo
- Carga automática de grupos del usuario
- Sincronización con localStorage

#### 2. **Modal** (`components/common/Modal.jsx`)
- Componente modal reutilizable
- 3 tamaños: small, medium, large
- Cierre con ESC, backdrop o botón
- Animaciones de entrada/salida
- Fullscreen responsive en móvil

#### 3. **GameCard** (`components/games/GameCard.jsx`)
- Tarjeta visual de juego
- Badge de fuente (BGG/Custom)
- Rating con estrellas
- Información de jugadores y duración
- Categorías (máx 2 + contador)
- Acciones: eliminar, sincronizar
- Animaciones hover

#### 4. **AddGameModal** (`components/games/AddGameModal.jsx`)
- Modal completo con 3 modos:
  - **Búsqueda BGG**: Buscar y previsualizar
  - **Vista Previa**: Detalles completos antes de añadir
  - **Crear Personalizado**: Formulario completo

#### 5. **Games Page** (`pages/Games/Games.jsx`)
- Grid responsive de juegos
- Búsqueda en tiempo real (debounce 500ms)
- Filtros por fuente (Todos, BGG, Custom)
- Paginación (12 juegos por página)
- Selector de grupo
- Estados: loading, error, empty

## 🎨 Diseño Responsive

### Desktop (>1200px)
- Grid de 4-5 columnas
- Filtros horizontales
- Modal tamaño large

### Tablet (768-1200px)
- Grid de 3-4 columnas
- Filtros compactos

### Mobile (<768px)
- Grid de 1 columna
- Filtros en columna
- Modal fullscreen
- Botones fullwidth

## 🔧 Uso

### Navegar a la página
```jsx
import { Link } from 'react-router-dom';

<Link to="/games">Ver Catálogo de Juegos</Link>
```

### Usar GroupContext
```jsx
import { useGroup } from '../../context/GroupContext';

const { selectedGroup, groups, selectGroup, loadGroups } = useGroup();
```

### Usar Modal
```jsx
import { Modal } from '../../components/common';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Mi Modal"
  size="medium"
  footer={<Button>Confirmar</Button>}
>
  Contenido del modal
</Modal>
```

### Usar GameCard
```jsx
import { GameCard } from '../../components/games';

<GameCard
  game={gameObject}
  onDelete={handleDelete}
  onSync={handleSync}
  canDelete={true}
/>
```

## 🔌 Integración Backend

### Endpoints Utilizados
- `GET /api/games` - Listar juegos
- `GET /api/games/search-bgg` - Buscar en BGG
- `GET /api/games/bgg/:bggId` - Detalles BGG
- `POST /api/games/add-from-bgg` - Añadir desde BGG
- `POST /api/games` - Crear personalizado
- `PUT /api/games/:id/sync-bgg` - Sincronizar
- `DELETE /api/games/:id` - Eliminar

### Servicios
Todos los métodos de `gameService.js` están siendo utilizados:
- `searchBGG(query)`
- `getBGGDetails(bggId)`
- `addFromBGG(bggId, groupId, notes)`
- `createCustomGame(gameData)`
- `getGames(params)`
- `syncWithBGG(gameId)`
- `deleteGame(gameId)`

## 🎯 Flujo de Usuario

### Añadir Juego desde BGG
1. Usuario selecciona un grupo
2. Click en "Añadir Juego"
3. Busca juego por nombre
4. Selecciona de resultados
5. Ve vista previa completa
6. Confirma y añade

### Crear Juego Personalizado
1. Click en "Crear Juego Personalizado"
2. Completa formulario
3. Sistema valida
4. Juego se añade al catálogo

### Gestionar Juegos
1. Ver grid de juegos
2. Filtrar por fuente
3. Buscar por nombre
4. Sincronizar desde BGG
5. Eliminar (con confirmación)

## 📊 Estructura de Archivos Creados

```
frontend/src/
├── context/
│   └── GroupContext.jsx              ✅ NUEVO
│
├── components/
│   ├── common/
│   │   ├── Modal.jsx                 ✅ NUEVO
│   │   ├── Modal.module.css          ✅ NUEVO
│   │   └── index.js                  ✅ ACTUALIZADO
│   │
│   └── games/
│       ├── GameCard.jsx              ✅ NUEVO
│       ├── GameCard.module.css       ✅ NUEVO
│       ├── AddGameModal.jsx          ✅ NUEVO
│       ├── AddGameModal.module.css   ✅ NUEVO
│       └── index.js                  ✅ NUEVO
│
└── pages/
    ├── Games/
    │   ├── Games.jsx                 ✅ NUEVO
    │   └── Games.module.css          ✅ NUEVO
    │
    └── index.js                      ✅ ACTUALIZADO
```

**App.jsx**: ✅ Actualizado con GroupProvider y ruta `/games`

## ✅ Buenas Prácticas Aplicadas

### Código
- ✅ PropTypes para validación
- ✅ CSS Modules para estilos
- ✅ Hooks personalizados (useGroup)
- ✅ Context API para estado global
- ✅ Componentes funcionales
- ✅ JSDoc completo

### Performance
- ✅ Debounce en búsqueda (500ms)
- ✅ Lazy loading de imágenes
- ✅ Paginación
- ✅ Memoización con useMemo/useCallback

### UX
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Confirmaciones
- ✅ Feedback visual
- ✅ Animaciones suaves

### Accesibilidad
- ✅ Labels en inputs
- ✅ aria-label en botones
- ✅ Navegación por teclado
- ✅ Textos alternativos

## 🚀 Estado del Proyecto

**Versión:** 1.0.0  
**Estado:** ✅ Completo y funcional  
**Errores de compilación:** 0  
**Fecha:** 20 de noviembre de 2025

---

Desarrollado siguiendo las mejores prácticas de React, con integración completa al backend y diseño responsive.
