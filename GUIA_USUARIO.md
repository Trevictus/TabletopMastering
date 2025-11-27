# Guía de Usuario - Tabletop Mastering

## ¿Qué es Tabletop Mastering?
Aplicación web para gestionar partidas de juegos de mesa en grupo: organiza sesiones, registra resultados, lleva estadísticas y consulta tu historial.

---

## Inicio Rápido

### 1. Acceder a la aplicación
Abre tu navegador en: `http://localhost` (o la URL proporcionada)

### 2. Crear cuenta
1. Click en **"Registrarse"**
2. Introduce: nombre, email y contraseña
3. Click en **"Crear cuenta"**
4. ¡Listo! Ya puedes iniciar sesión

### 3. Iniciar sesión
1. Click en **"Iniciar Sesión"**
2. Introduce email y contraseña
3. Click en **"Entrar"**

---

## Grupos

### Crear un grupo
1. Ve a **"Grupos"** en la barra superior
2. Click en **"Crear Grupo"**
3. Introduce:
   - Nombre del grupo
   - Descripción (opcional)
4. Click en **"Crear"**
5. Se genera un **código único** de 8 caracteres

### Unirse a un grupo
1. Ve a **"Grupos"**
2. Click en **"Unirse a Grupo"**
3. Introduce el código de 8 caracteres
4. Click en **"Unirse"**

### Roles en grupos
- **Admin**: Puede gestionar el grupo, añadir/eliminar juegos
- **Miembro**: Puede ver juegos y participar en partidas

---

## Juegos

### Ver catálogo
1. Ve a **"Juegos"** en la barra superior
2. Cambia entre:
   - **Mis Juegos**: Juegos personales
   - **[Nombre Grupo]**: Juegos del grupo seleccionado

### Buscar juegos en BoardGameGeek
1. En la sección Juegos, usa el **buscador**
2. Click en **"Filtros"** para refinar
3. Selecciona **"BGG"** para buscar en BoardGameGeek
4. Click en un juego para ver detalles
5. Click en **"Añadir a Mi Colección"**

### Añadir juego personalizado
1. Click en **"Añadir Juego"**
2. Rellena:
   - Nombre (obligatorio)
   - Descripción
   - Jugadores (mín/máx)
   - Duración
   - Categorías
3. Click en **"Guardar"**

### Filtrar juegos
1. Click en **"Filtros"**
2. Selecciona:
   - **Todos**: Todos los juegos
   - **BGG**: Solo de BoardGameGeek
   - **Personalizados**: Solo creados manualmente
3. Click en **"Limpiar"** para resetear

---

## Partidas (En desarrollo)

### Crear partida
1. Selecciona un juego
2. Click en **"Nueva Partida"**
3. Selecciona:
   - Fecha y hora
   - Jugadores participantes
4. Click en **"Crear"**

### Registrar resultados
1. Al finalizar la partida
2. Click en **"Registrar Resultados"**
3. Introduce puntuación de cada jugador
4. Click en **"Guardar"**

---

## Historial

### Ver historial de partidas
1. Ve a **"Historial"** en la barra superior
2. Visualiza:
   - **Total**: Partidas jugadas
   - **Ganadas**: Victorias
   - **Perdidas**: Derrotas
   - **% Victoria**: Tasa de éxito

### Filtrar historial
- **Todas**: Todas las partidas
- **Ganadas**: Solo victorias
- **Perdidas**: Solo derrotas

### Ordenar
- **Por Fecha**: Más recientes primero
- **Por Juego**: Alfabéticamente

---

## Rankings (Próximamente)

Consulta tu posición y la de otros jugadores:
- Por grupo
- Por juego específico
- General

---

## Perfil

### Ver perfil
1. Click en el icono de **perfil** (esquina superior derecha)
2. Selecciona **"Mi Perfil"**

### Editar perfil
1. En tu perfil, click en **"⚙️ Configurar Perfil"**
2. Edita:
   - **Nombre**: Tu nombre de usuario
   - **Email**: Tu correo electrónico
   - **Avatar**: Sube una imagen (JPG/PNG, máx 10MB)
3. Click en **"Guardar Cambios"**

### Cambiar avatar
1. Click en **"⚙️ Configurar Perfil"**
2. Click en **"Subir Imagen"** o arrastra imagen
3. Vista previa automática
4. Click en **"Guardar Cambios"**

**Nota**: Las imágenes se comprimen automáticamente para optimizar el rendimiento.

---

## 📅 Calendario (Próximamente)

Visualiza tus próximas partidas programadas en formato calendario.

---

## Preguntas Frecuentes

### ¿Cómo invito a mis amigos?
Comparte el **código del grupo** (8 caracteres). Lo encuentras en los detalles del grupo.

### ¿Puedo estar en varios grupos?
Sí, puedes unirte a tantos grupos como quieras.

### ¿Qué pasa si olvido mi contraseña?
Función de recuperación en desarrollo. Contacta al administrador del sistema.

### ¿Puedo eliminar un juego?
Solo el admin del grupo o quien añadió el juego puede eliminarlo.

### ¿Los datos están seguros?
Sí. Las contraseñas se cifran con Bcrypt y usamos JWT para autenticación.

### ¿Funciona en móvil?
Sí, la aplicación es responsive y funciona en tablets y móviles.

---

## 🆘 Soporte

### Reportar un problema
1. Contacta al administrador del sistema
2. O abre un issue en GitHub (si tienes acceso)

### Sugerencias
¡Tus ideas son bienvenidas! Compártelas con el equipo de desarrollo.

---

## 🎮 Consejos y Trucos

✅ **Organiza tus grupos**: Crea grupos separados para diferentes círculos de amigos
✅ **Usa BGG**: Aprovecha la integración para importar juegos con datos completos
✅ **Registra todas tus partidas**: Las estadísticas son más precisas con más datos
✅ **Comparte códigos de forma segura**: Solo comparte el código del grupo con personas de confianza
✅ **Actualiza tu perfil**: Un avatar y nombre reconocibles facilitan la interacción

---

**¡Disfruta organizando tus partidas! 🎲**
