# 🌊 Guía de Despliegue en DigitalOcean

Esta guía te llevará paso a paso para desplegar **Tabletop Mastering** en DigitalOcean usando App Platform.

---

## 📋 Requisitos Previos

- ✅ Cuenta de DigitalOcean ([Registrarse aquí](https://www.digitalocean.com/))
- ✅ Repositorio en GitHub
- ✅ Tarjeta de crédito para DigitalOcean (ofrecen $200 de crédito gratis)

---

## 💰 Costos Estimados

| Componente | Tamaño | Precio/mes |
|------------|--------|------------|
| Backend (App Platform) | Basic XXS | ~$5 |
| Frontend (App Platform) | Basic XXS | ~$5 |
| MongoDB | DB-S-1VCPU-1GB | ~$15 |
| Container Registry | - | Gratis (500 MB) |
| **Total estimado** | | **~$25/mes** |

> 💡 **Tip:** Puedes obtener $200 en créditos gratis por 60 días con código de referido

---

## 🚀 Paso 1: Preparar DigitalOcean

### 1.1 Crear Container Registry

```bash
# Ir a: https://cloud.digitalocean.com/registry
# Click en "Create a Container Registry"
# Nombre: tabletop-mastering (o el que prefieras)
# Plan: Starter (gratis hasta 500 MB)
```

### 1.2 Generar Access Token

1. Ve a **API** → **Tokens/Keys**
2. Click en **Generate New Token**
3. Nombre: `tabletop-github-actions`
4. Scopes: ✅ Read & Write
5. **Copia el token** (solo se muestra una vez)

### 1.3 Crear MongoDB Database

1. Ve a **Databases** → **Create Database Cluster**
2. Selecciona **MongoDB 7**
3. Plan: **Basic** ($15/mes)
4. Datacenter: Elige el más cercano a tus usuarios
5. Nombre: `tabletop-mongodb`
6. Click **Create Database Cluster**

⏱️ *Espera 5-10 minutos mientras se crea*

### 1.4 Configurar MongoDB

Una vez creado:

1. Ve a **Settings** → **Trusted Sources**
2. Agrega tu App Platform (lo haremos después)
3. Copia la **Connection String** (la necesitarás)

---

## 🔐 Paso 2: Configurar GitHub Secrets

Ve a tu repositorio en GitHub:

```
Settings → Secrets and variables → Actions → New repository secret
```

Agrega estos secrets:

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Token del paso 1.2 | Token de API |
| `DIGITALOCEAN_REGISTRY_NAME` | `tabletop-mastering` | Nombre de tu registry |
| `DIGITALOCEAN_APP_ID` | Lo obtendremos en paso 3 | ID de la app |
| `JWT_SECRET` | Generar aleatorio de 32+ caracteres | Secret para JWT |
| `VITE_API_URL` | `/api` | URL del API (relativa) |

### Generar JWT_SECRET seguro

```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 Paso 3: Crear App Platform

### 3.1 Opción A: Desde la interfaz web (Recomendado para primera vez)

1. Ve a **Apps** → **Create App**
2. Selecciona **GitHub** como source
3. Autoriza a DigitalOcean a acceder a tu repositorio
4. Selecciona el repositorio `TabletopMastering`
5. Branch: `main`
6. Autodeploy: ✅ Enabled
7. Click **Next**

### 3.2 Configurar los servicios

DigitalOcean detectará automáticamente los Dockerfiles. Configura:

#### Backend Service:
- **Name:** backend
- **Dockerfile:** `backend/Dockerfile.prod`
- **HTTP Port:** 5000
- **Health Check:** `/health`
- **Environment Variables:**
  ```
  NODE_ENV=production
  PORT=5000
  JWT_SECRET=${JWT_SECRET}
  JWT_EXPIRE=7d
  MONGODB_URI=mongodb+srv://usuario:password@host/database?retryWrites=true&w=majority
  CLIENT_URL=${APP_URL}
  ```
- **Instance Size:** Basic XXS ($5/mes)

#### Frontend Service:
- **Name:** frontend
- **Dockerfile:** `frontend/Dockerfile.prod`
- **HTTP Port:** 80
- **Build Args:**
  ```
  VITE_API_URL=/api
  ```
- **Instance Size:** Basic XXS ($5/mes)

### 3.3 Configurar rutas

- **Frontend:** `/` → frontend service
- **Backend:** `/api` → backend service

### 3.4 Configurar base de datos

1. En **Database**, selecciona **Previously Created DigitalOcean Database**
2. Selecciona tu cluster MongoDB
3. Click **Attach Database**

### 3.5 Crear la app

1. Click **Next** → **Create Resources**
2. ⏱️ Espera 5-10 minutos mientras se despliega
3. **Copia el App ID** de la URL (ej: `12345678-abcd-...`)
4. Agrega el `DIGITALOCEAN_APP_ID` a GitHub Secrets

---

## 🔄 Paso 4: Configurar CI/CD Automático

Los archivos ya están creados en tu proyecto:
- `.github/workflows/deploy.yml` - GitHub Actions
- `.do/app.yaml` - Configuración de App Platform

### 4.1 Actualizar app.yaml

Edita `.do/app.yaml` y actualiza:

```yaml
github:
  repo: TU_USUARIO/TabletopMastering  # Cambiar por tu usuario
  branch: main
```

### 4.2 Probar el deployment

```bash
# Hacer un commit y push
git add .
git commit -m "feat: add DigitalOcean deployment config"
git push origin main
```

Ve a **Actions** en GitHub para ver el progreso.

---

## ✅ Paso 5: Verificar el Despliegue

### 5.1 Verificar servicios

En tu App Platform dashboard:

1. ✅ Backend: `https://tu-app.ondigitalocean.app/api/health`
2. ✅ Frontend: `https://tu-app.ondigitalocean.app`
3. ✅ Database: Connected

### 5.2 Probar la aplicación

1. Abre tu URL de App Platform
2. Registra un usuario
3. Crea un grupo
4. Busca juegos de BGG

---

## 🌐 Paso 6: Configurar Dominio Propio (Opcional)

### 6.1 Agregar dominio

1. Ve a **Settings** → **Domains**
2. Click **Add Domain**
3. Ingresa tu dominio (ej: `tabletop.midominio.com`)
4. Click **Add Domain**

### 6.2 Configurar DNS

En tu proveedor de dominio, agrega:

```
Tipo: CNAME
Nombre: tabletop (o @)
Valor: [el CNAME que te da DigitalOcean]
TTL: 3600
```

⏱️ Espera 5-30 minutos para propagación DNS.

### 6.3 SSL/HTTPS

DigitalOcean genera automáticamente certificados Let's Encrypt. ✅

---

## 🔧 Mantenimiento y Monitoreo

### Ver logs

```bash
# Instalar doctl CLI
brew install doctl  # macOS
# o descargar de: https://github.com/digitalocean/doctl/releases

# Autenticar
doctl auth init

# Ver logs del backend
doctl apps logs YOUR_APP_ID --type RUN --component backend --follow

# Ver logs del frontend
doctl apps logs YOUR_APP_ID --type RUN --component frontend --follow
```

### Métricas

Ve a **Insights** en tu App Platform para ver:
- CPU usage
- Memory usage
- Request rate
- Response times

### Escalado

Para escalar:
1. Ve a **Components**
2. Selecciona el servicio
3. Click **Edit Plan**
4. Selecciona un tamaño mayor

---

## 🚨 Troubleshooting

### El deployment falla

1. **Revisa los logs:**
   ```bash
   doctl apps logs YOUR_APP_ID --type BUILD
   ```

2. **Verifica las variables de entorno:**
   - Settings → Environment Variables

3. **Verifica la conexión a MongoDB:**
   - Settings → Trusted Sources
   - Agrega la IP de tu App Platform

### 502 Bad Gateway

- El backend no está respondiendo
- Verifica health check: `/health`
- Revisa logs del backend

### Base de datos no conecta

- Verifica el `MONGODB_URI`
- Asegúrate de que App Platform está en Trusted Sources
- Verifica que el usuario/password son correctos

---

## 📊 Comandos Útiles

```bash
# Ver todas las apps
doctl apps list

# Ver detalles de una app
doctl apps get YOUR_APP_ID

# Ver deployments
doctl apps list-deployments YOUR_APP_ID

# Crear nuevo deployment manual
doctl apps create-deployment YOUR_APP_ID

# Ver configuración actual
doctl apps spec get YOUR_APP_ID
```

---

## 💡 Mejores Prácticas

1. ✅ **Usar variables de entorno** para secretos
2. ✅ **Habilitar auto-deploy** desde GitHub
3. ✅ **Configurar health checks** en todos los servicios
4. ✅ **Monitorear métricas** regularmente
5. ✅ **Hacer backups** de MongoDB periódicamente
6. ✅ **Usar dominios personalizados** para producción
7. ✅ **Revisar logs** ante cualquier problema

---

## 🎯 Próximos Pasos

- [ ] Configurar CDN para assets estáticos
- [ ] Implementar Redis para caching
- [ ] Configurar alertas de errores (ej: Sentry)
- [ ] Configurar backups automáticos de MongoDB
- [ ] Implementar monitoring avanzado (ej: Datadog)

---

## 📚 Recursos Adicionales

- [Documentación de App Platform](https://docs.digitalocean.com/products/app-platform/)
- [DigitalOcean Community](https://www.digitalocean.com/community)
- [doctl Documentation](https://docs.digitalocean.com/reference/doctl/)

---

## 💬 Soporte

Si encuentras problemas:

1. Revisa esta guía completa
2. Consulta los logs
3. Revisa GitHub Actions
4. Crea un issue en el repositorio
