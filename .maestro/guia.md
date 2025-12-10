# Tests E2E - Tabletop Mastering

Tests end-to-end automatizados con [Playwright](https://playwright.dev/) para la aplicación web.

## Prerrequisitos

- Node.js 18+
- npm

## Instalación

```bash
cd .maestro/e2e-tests
npm install
npx playwright install chromium
```

## Configuración

```bash
cp .env.example .env
```

Edita `.env` con credenciales válidas:
```
EMAIL=tu_usuario
PASSWORD=tu_contraseña
```

## Ejecución

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecutar tests (headless) |
| `npm run test:headed` | Ejecutar con navegador visible |
| `npm run test:debug` | Modo debug paso a paso |
| `npm run test:ui` | Interfaz visual de Playwright |
| `npm run report` | Ver último reporte HTML |

## Tests disponibles

### login.spec.js
- Login exitoso con credenciales válidas
- Mostrar error con credenciales inválidas

### navigation.spec.js
- Navegación completa por todas las pestañas tras login (Inicio → Grupos → Calendario → Juegos → Rankings → Historial → Perfil → Cerrar sesión)

## Estructura

```
e2e-tests/
├── .env              # Credenciales (no se sube al repo)
├── .env.example      # Plantilla de credenciales
├── package.json
├── playwright.config.js
└── tests/
    ├── login.spec.js
    └── navigation.spec.js
```
