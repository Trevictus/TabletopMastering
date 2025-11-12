## 1. Análisis de requisitos funcionales

**Funcionalidades principales:**
- Gestión de partidas: crear, editar, eliminar y unirse.
- Gestión de usuarios: registro, inicio de sesión, perfil.
- Búsqueda y filtrado de partidas por juego, fecha o nivel.

**Priorización MoSCoW:**
- **Must have:** gestión de partidas, registro/inicio de sesión.
- **Should have:** perfil de usuario completo.
- **Could have:** filtros avanzados, notificaciones, personalización de partidas.
- **Won’t have:** integración con redes sociales por ahora.

**MVP (Producto Mínimo Viable):**
- Creación y gestión de partidas.
- Registro e inicio de sesión de usuarios.

---

## 2. Análisis de requisitos técnicos del stack MERN

- **MongoDB:** almacenamiento de usuarios, partidas y mensajes.  
- **Express:** backend RESTful para gestionar rutas y lógica del servidor.  
- **React:** frontend dinámico y responsive.  
- **Node.js:** entorno de ejecución del servidor.  

**Base de datos (MongoDB):**
```text
Usuarios
- id
- nombre
- email
- contraseña
- avatar

Partidas
- id
- nombre
- juego
- fecha
- jugadores [referencia a Usuarios]

```

## Arquitectura de la aplicación
Frontend (React)  --->  Backend (Node.js + Express + Socket.io)  --->  Base de datos (MongoDB)

## 4. Evaluación de capacidades del equipo

- **Habilidades actuales:**  
  El equipo cuenta con conocimientos en programación básica con JavaScript, HTML y CSS, además de nociones iniciales de bases de datos con MongoDB y desarrollo backend con Spring Boot.  

- **Lagunas de conocimiento:**  
  Aún no se domina ningún framework frontend o backend. Es necesario aprender React para el cliente y Express para el servidor, además de familiarizarse con el despliegue.  

- **Viabilidad:**  
  El proyecto es viable con una adecuada planificación, reparto de tareas y un periodo de aprendizaje progresivo para adquirir las tecnologías necesarias del stack MERN.

## 5. Análisis de riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-------------|
| Problemas de seguridad en la autenticación | Implementar JWT correctamente y cifrar contraseñas. |
| Limitaciones en la base de datos | Optimizar consultas, crear índices y realizar pruebas de rendimiento. |
| Fallos en el despliegue en la nube | Probar primero en entornos de test antes del despliegue final. |
| Desconocimiento de frameworks | Dedicar tiempo a la formación en React y Express antes de la implementación. |
| Falta de tiempo por curva de aprendizaje | Planificar las tareas por fases y priorizar el desarrollo del MVP. |
