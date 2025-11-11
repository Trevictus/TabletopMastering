# 🎲 Tabletop Mastering - Frontend

Frontend de la aplicación Tabletop Mastering construido con **React 18+** y **Vite 7+**.

## 📋 Descripción

Interfaz de usuario para el sistema de gestión de partidas de juegos de mesa. Conecta con la API REST del backend para gestionar usuarios, grupos, juegos y partidas.

## ✨ Características

- ⚡ **Vite** - Build tool ultra-rápido
- ⚛️ **React 19** - Última versión con Actions, useFormStatus, useOptimistic
- 🔐 **Autenticación JWT** - Sistema completo de auth
- 🎨 **CSS Variables** - Sistema de diseño consistente
- 📦 **Servicios API** - 31 métodos implementados
- 🔧 **Axios** - Cliente HTTP configurado
- 📱 **Responsive** - Diseño adaptable

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js v20+
- npm o yarn
- Backend corriendo en `http://localhost:3000`

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará en http://localhost:5173
```

### Producción

```bash
# Construir para producción
npm run build

# Vista previa de la build
npm run preview
```

## 📁 Estructura

```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas de la aplicación
├── services/       # Servicios API (31 métodos)
├── context/        # Context API
├── utils/          # Utilidades (11 funciones)
├── styles/         # Estilos CSS (~500 líneas)
├── hooks/          # Custom hooks
└── assets/         # Recursos estáticos
```

Ver **[ESTRUCTURA.md](./ESTRUCTURA.md)** para documentación completa.

## 🔌 Servicios API

- **authService** - Login, registro, perfil (7 métodos)
- **groupService** - CRUD de grupos (7 métodos)
- **gameService** - Juegos + BGG API (12 métodos)
- **matchService** - Partidas (5 métodos)

## 🎨 Sistema de Estilos

CSS modular con variables globales:
- **variables.css** - Colores, espaciado, tipografía
- **components.css** - Botones, cards, forms, badges
- **layout.css** - Navbar, footer, grid, tablas

## 🔐 Autenticación

Context API global con `AuthContext`:

```jsx
import { useAuth } from './context/AuthContext';

function MiComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();
  // ...
}
```

## 📚 Documentación

- **[ESTRUCTURA.md](./ESTRUCTURA.md)** - Guía completa de la estructura
- **[RESUMEN.md](./RESUMEN.md)** - Resumen ejecutivo
- **[SETUP_COMPLETADO.md](./SETUP_COMPLETADO.md)** - Detalles del setup

## 🛠️ Tecnologías

- React 19.2.0 ⭐ (última versión)
- Vite 7.2.2
- Axios 1.13.2
- Context API
- CSS3 (Variables + Grid + Flexbox)

## 📝 Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run preview  # Vista previa
npm run lint     # Linter
```

## 🔗 Backend API

**Base URL:** `http://localhost:3000/api`

Endpoints:
- `/auth/*` - Autenticación
- `/groups/*` - Grupos
- `/games/*` - Juegos
- `/matches/*` - Partidas

## 📄 Licencia

MIT - Ver archivo LICENSE para detalles.

---

**Versión:** 1.0.0  
**Última actualización:** 11 de noviembre de 2025
