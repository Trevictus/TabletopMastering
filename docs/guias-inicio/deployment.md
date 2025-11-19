# 🚀 Guía de Deployment

Guía rápida de referencia para desplegar Tabletop Mastering.

---

## 📦 Opciones de Deployment

### 1️⃣ DigitalOcean App Platform (Recomendado)
**Costo:** ~$25/mes | **Dificultad:** ⭐⭐☆☆☆

✅ Deploy automático desde GitHub  
✅ SSL/HTTPS automático  
✅ Escalado fácil  
✅ MongoDB integrado  

👉 **[Ver guía completa](./despliegue-digitalocean.md)**

---

### 2️⃣ Docker Compose en VPS

**Costo:** ~$6-12/mes | **Dificultad:** ⭐⭐⭐☆☆

Para desplegar en cualquier VPS (DigitalOcean Droplet, AWS EC2, etc.):

```bash
# 1. Conectar al servidor
ssh usuario@tu-servidor.com

# 2. Clonar repositorio
git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering

# 3. Configurar variables de entorno
cp .env.production.example .env.production
nano .env.production  # Editar valores

# 4. Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# 5. Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

**Configurar nginx y SSL:**
```bash
# Instalar certbot para SSL
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com
```

---

### 3️⃣ AWS / Azure / GCP

**Costo:** Variable | **Dificultad:** ⭐⭐⭐⭐☆

Opciones:
- **AWS:** ECS + Fargate + RDS
- **Azure:** App Service + Azure Database
- **GCP:** Cloud Run + Cloud SQL

Contacta para guía específica.

---

## 🔍 Comparación Rápida

| Característica | App Platform | VPS Docker | AWS/Azure |
|----------------|--------------|------------|-----------|
| **Precio inicial** | $25/mes | $6/mes | $30+/mes |
| **Setup tiempo** | 30 min | 2 horas | 4+ horas |
| **Auto-scaling** | ✅ Fácil | ❌ Manual | ✅ Avanzado |
| **SSL automático** | ✅ Sí | ❌ Manual | ✅ Sí |
| **CI/CD incluido** | ✅ Sí | ❌ Configurar | ⚠️ Parcial |
| **Monitoreo** | ✅ Básico | ❌ Manual | ✅ Avanzado |
| **Backups** | ✅ Automáticos | ❌ Manual | ✅ Automáticos |

---

## 🎯 Checklist Pre-Deployment

Antes de desplegar a producción:

- [ ] ✅ Generar `JWT_SECRET` aleatorio y seguro
- [ ] ✅ Configurar `MONGODB_URI` de producción
- [ ] ✅ Actualizar `CLIENT_URL` con dominio real
- [ ] ✅ Configurar variables de entorno en plataforma
- [ ] ✅ Probar build de producción localmente
- [ ] ✅ Configurar GitHub Secrets (si usas Actions)
- [ ] ✅ Configurar dominio y DNS
- [ ] ✅ Habilitar HTTPS/SSL
- [ ] ✅ Configurar backups de base de datos
- [ ] ✅ Probar la aplicación desplegada

---

## 🧪 Test Local de Producción

Probar el build de producción localmente:

```bash
# 1. Configurar variables
cp .env.production.example .env.production
# Editar .env.production con valores de prueba

# 2. Build y ejecutar
docker-compose -f docker-compose.prod.yml up --build

# 3. Probar
# Frontend: http://localhost
# Backend: http://localhost/api/health

# 4. Detener
docker-compose -f docker-compose.prod.yml down
```

---

## 📊 Monitoreo Post-Deployment

### Health Checks
```bash
# Backend health
curl https://tu-dominio.com/api/health

# Debería retornar:
# { "status": "ok", "mongodb": "connected" }
```

### Logs
```bash
# App Platform
doctl apps logs YOUR_APP_ID --follow

# Docker Compose
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Métricas a vigilar
- ✅ Response time < 200ms
- ✅ Error rate < 1%
- ✅ CPU usage < 70%
- ✅ Memory usage < 80%
- ✅ Database connections estables

---

## 🆘 Rollback Rápido

Si algo sale mal:

### App Platform:
```bash
# Ver deployments previos
doctl apps list-deployments YOUR_APP_ID

# Hacer rollback al deployment anterior
doctl apps create-deployment YOUR_APP_ID --previous
```

### Docker Compose:
```bash
# Volver a versión anterior
git checkout COMMIT_ANTERIOR
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📚 Recursos

- [Deployment DigitalOcean](./despliegue-digitalocean.md)
- [Configuración](./configuracion.md)
- [Instalación](./instalacion.md)

---

## 💡 Mejores Prácticas

1. **Siempre usa HTTPS en producción**
2. **Haz backups regulares de MongoDB**
3. **Monitorea logs y métricas**
4. **Usa variables de entorno para secretos**
5. **Mantén dependencias actualizadas**
6. **Implementa rate limiting**
7. **Configura alertas de errores**
8. **Documenta cada cambio**

---

**¿Necesitas ayuda?** Crea un issue en el repositorio.
