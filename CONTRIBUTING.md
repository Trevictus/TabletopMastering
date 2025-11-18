# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Tabletop Mastering! Esta guía te ayudará a participar en el proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Convenciones de Código](#convenciones-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU-USUARIO/TabletopMastering.git
cd TabletopMastering
```

### 2. Crea una Rama

```bash
git checkout -b feature/nueva-caracteristica
# o
git checkout -b fix/correccion-bug
```

### 3. Instala las Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configura el Entorno

```bash
# Backend
cp backend/.env.example backend/.env
# Edita backend/.env con tus configuraciones

# Frontend
cp frontend/.env.example frontend/.env
# Edita frontend/.env con tus configuraciones
```

## 📁 Estructura del Proyecto

```
TabletopMastering/
├── backend/              # API REST con Node.js y Express
│   ├── docs/            # Documentación del backend
│   ├── tests/           # Tests automatizados
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de Mongoose
│   ├── routes/          # Definición de rutas
│   └── middlewares/     # Middleware personalizado
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas de la aplicación
│   │   ├── services/    # Servicios de API
│   │   └── context/     # Contextos de React
├── docs/                # Documentación general del proyecto
└── README.md            # Este archivo
```

## 🎨 Convenciones de Código

### JavaScript/Node.js

- **ESLint**: El proyecto usa ESLint para mantener la calidad del código
- **Prettier**: Formatea el código automáticamente
- **Nombres**: camelCase para variables y funciones, PascalCase para clases
- **Async/Await**: Preferir async/await sobre callbacks

```javascript
// ✅ Bueno
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error('Usuario no encontrado');
  }
};

// ❌ Evitar
function getUserProfile(userId, callback) {
  User.findById(userId, (err, user) => {
    if (err) callback(err);
    callback(null, user);
  });
}
```

### React

- **Functional Components**: Usar componentes funcionales con hooks
- **Naming**: PascalCase para componentes, camelCase para funciones
- **CSS Modules**: Usar CSS Modules para estilos de componentes

```jsx
// ✅ Bueno
const GameCard = ({ game }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className={styles.card}>
      <h3>{game.name}</h3>
    </div>
  );
};

export default GameCard;
```

### Commits

Usa mensajes de commit descriptivos siguiendo Conventional Commits:

```bash
# Formato
<tipo>(<alcance>): <descripción>

# Ejemplos
feat(games): añadir búsqueda por categoría
fix(auth): corregir validación de token expirado
docs(api): actualizar documentación de endpoints
test(groups): añadir tests de permisos
refactor(backend): reorganizar estructura de carpetas
```

**Tipos de commit:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `test`: Añadir o modificar tests
- `refactor`: Refactorización de código
- `style`: Cambios de formato (sin afectar funcionalidad)
- `chore`: Tareas de mantenimiento

## 🔄 Proceso de Pull Request

1. **Asegúrate de que los tests pasen**
   ```bash
   cd backend
   npm test
   ```

2. **Ejecuta el linter**
   ```bash
   npm run lint
   ```

3. **Formatea el código**
   ```bash
   npm run format
   ```

4. **Commit y Push**
   ```bash
   git add .
   git commit -m "feat(games): añadir filtro por jugadores"
   git push origin feature/nueva-caracteristica
   ```

5. **Crea el Pull Request**
   - Ve a GitHub y crea un PR desde tu rama
   - Describe los cambios realizados
   - Referencia issues relacionados si existen
   - Espera la revisión del código

### Checklist del PR

- [ ] El código sigue las convenciones del proyecto
- [ ] Los tests existentes siguen pasando
- [ ] Se añadieron tests para nuevas funcionalidades
- [ ] La documentación está actualizada
- [ ] Los commits siguen el formato establecido
- [ ] No hay conflictos con la rama main

## 🐛 Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

1. **Descripción clara** del problema
2. **Pasos para reproducir** el error
3. **Comportamiento esperado** vs **comportamiento actual**
4. **Screenshots** si aplica
5. **Entorno**: SO, versión de Node, navegador, etc.

### Plantilla de Bug Report

```markdown
## Descripción
Descripción clara y concisa del bug.

## Pasos para Reproducir
1. Ir a '...'
2. Hacer click en '...'
3. Observar error

## Comportamiento Esperado
Lo que debería suceder.

## Comportamiento Actual
Lo que está sucediendo.

## Screenshots
Si aplica, añade screenshots.

## Entorno
- SO: [ej. macOS 14.0]
- Node: [ej. 20.0.0]
- Navegador: [ej. Chrome 120]
```

## 💡 Sugerencias de Características

Para sugerir nuevas características, crea un issue con:

1. **Descripción** de la característica
2. **Motivación**: ¿Por qué es útil?
3. **Solución propuesta**: ¿Cómo funcionaría?
4. **Alternativas**: Otras formas de resolver el problema

## 📚 Recursos

- [Documentación del Proyecto](./docs/README.md)
- [API Documentation](./backend/docs/GAMES_API_DOCS.md)
- [Testing Guide](./backend/docs/TESTING.md)
- [Instalación](./docs/guias-inicio/instalacion.md)

## ❓ Preguntas

Si tienes preguntas sobre cómo contribuir, puedes:

1. Revisar la [documentación completa](./docs/README.md)
2. Crear un issue con la etiqueta "question"
3. Contactar al equipo de mantenimiento

---

¡Gracias por contribuir a Tabletop Mastering! 🎲
