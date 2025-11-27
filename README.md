# 🎲 Tabletop Mastering

> Sistema de gestión de partidas de juegos de mesa

[![Node](https://img.shields.io/badge/Node.js-20%2B-success)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-yellow)](LICENSE)

## 📖 Descripción

Aplicación web para gestionar partidas de juegos de mesa: organiza sesiones, registra resultados, lleva estadísticas y consulta historial.

**Características:**
- 🔐 Autenticación JWT
- 👥 Gestión de grupos con roles
- 🎮 Catálogo de juegos + integración BoardGameGeek
- 📊 Historial y estadísticas
- 🏆 Rankings (en desarrollo)

## 🚀 Inicio Rápido

### Docker (Recomendado)
```bash
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering
cp .env.example .env
docker compose up -d
```
Abre `http://localhost`

### Variables de Entorno (.env)
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=changeme
MONGO_DBNAME=tabletop_mastering
JWT_SECRET=tu_clave_secreta
JWT_EXPIRE=7d
```

### Desarrollo Local
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

- **[Backend](BACKEND_DOC.md)** - API, modelos, endpoints
- **[Frontend](FRONTEND_DOC.md)** - Componentes, rutas, servicios
- **[Guía Usuario](GUIA_USUARIO.md)** - Cómo usar la aplicación

## 🛠️ Stack Tecnológico

**Backend:** Node.js + Express + MongoDB + JWT  
**Frontend:** React 19 + Vite 7 + React Router v7  
**DevOps:** Docker + Docker Compose

## 📊 Estado del Proyecto

```
✅ Autenticación:  100%
✅ Grupos:         100%
✅ Juegos:         100%
✅ Frontend Base:   80%
🚧 Partidas:        30%
🚧 Estadísticas:    20%
```

## 👨‍💻 Autores

- [@Aranaaa00](https://github.com/Aaranaa00)
- [@Trevictus](https://github.com/Trevictus)
- [@Juanfu224](https://github.com/Juanfu224)

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE)

---

**⭐ Si te gusta el proyecto, dale una estrella ⭐**

*Proyecto educativo DAW - Hecho con ❤️ para la comunidad de juegos de mesa*