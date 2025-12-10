# 🎲 Tabletop Mastering

https://tabletopmastering.games/

> Plataforma web para la gestión integral de partidas y grupos de juegos de mesa

[![Node](https://img.shields.io/badge/Node.js-20%2B-success)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-yellow)](LICENSE)

## 📖 Descripción

Tabletop Mastering es una aplicación web que permite organizar sesiones, registrar resultados, gestionar grupos y consultar estadísticas de juegos de mesa.  
Pensada para clubes, asociaciones y grupos de amigos que quieren llevar el control de sus partidas de forma sencilla y colaborativa.

**Funcionalidades principales:**
- Autenticación segura con JWT
- Gestión de grupos y roles
- Catálogo de juegos con integración BoardGameGeek
- Registro de partidas y resultados
- Historial y estadísticas personalizadas
- Rankings globales y por grupo
- Panel de administración y configuración
- Accesibilidad y cumplimiento legal (RGPD, LSSI-CE, WCAG 2.1)

## 🚀 Acceso y despliegue

La aplicación está disponible en producción en:

**https://tabletopmastering.games/**

No es necesario instalar ni configurar nada para usar la web.

### ¿Quieres desplegar tu propia instancia o contribuir?

Puedes usar Docker o el entorno de desarrollo local siguiendo estos pasos:

#### Docker (opcional para despliegue propio)
```bash
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering
cp .env.example .env
docker compose up -d
```
Accede a `http://localhost` en tu navegador.

#### Variables de entorno (.env)
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=changeme
MONGO_DBNAME=tabletop_mastering
JWT_SECRET=tu_clave_secreta
JWT_EXPIRE=7d
```

#### Desarrollo local
```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📚 Documentación

- [Legislación y Cumplimiento](docs/legislacion.md)
- [Recursos y APIs](docs/recursos.md)
- [Presupuesto y ROI](docs/presupuesto.md)

## 🛠️ Stack Tecnológico

- **Backend:** Node.js + Express + MongoDB + JWT
- **Frontend:** React 19 + Vite 7 + React Router v7
- **DevOps:** Docker + Docker Compose

## ✅ Estado del Proyecto

| Módulo         | Estado   |
|----------------|----------|
| Autenticación  | 100%     |
| Grupos         | 100%     |
| Juegos         | 100%     |
| Partidas       | 100%     |
| Estadísticas   | 100%     |
| Frontend Base  | 100%     |
| Accesibilidad  | 100%     |
| Legal          | 100%     |

Proyecto finalizado y validado en todos los sprints.  
Documentación, presupuesto y gestión de recursos actualizados.

## 👨‍💻 Autores

- [@Aaranaa00](https://github.com/Aaranaa00) — Desarrollo backend y frontend
- [@Trevictus](https://github.com/Trevictus) — Diseño, UX/UI y frontend
- [@Juanfu224](https://github.com/Juanfu224) — Scrum Master, DevOps y gestión

## 📄 Licencia

MIT License — Ver [LICENSE](LICENSE)

---

**⭐ Si te ha sido útil, comparte Tabletop Mastering con tu grupo y déjanos tu feedback.**

*Proyecto educativo DAW — Hecho con pasión y trabajo en equipo para la comunidad de juegos de mesa.*