# 🚀 Guía Rápida de Despliegue - Tabletop Mastering Backend

## 📋 Checklist Pre-Despliegue

- [ ] MongoDB instalado y configurado
- [ ] Node.js v20+ instalado
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET generado de forma segura
- [ ] Dominio configurado (opcional pero recomendado)
- [ ] Certificado SSL (Let's Encrypt)

## ⚡ Despliegue Rápido con PM2 (Recomendado)

### 1. Preparación del Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Clonar y Configurar el Proyecto

```bash
# Clonar repositorio
cd /var/www
sudo git clone https://github.com/Trevictus/TabletopMastering.git
cd TabletopMastering/backend

# Instalar dependencias
npm install --production

# Crear archivo .env
sudo nano .env
```

**Contenido del .env:**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tabletop_mastering
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
CLIENT_URL=https://tu-frontend.com
USE_BGG_MOCK=false
```

```bash
# Proteger .env
chmod 600 .env
```

### 3. Instalar y Configurar PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicación
pm2 start server.js --name tabletop-backend

# Configurar inicio automático
pm2 startup
# COPIAR Y EJECUTAR EL COMANDO QUE MUESTRA PM2

pm2 save
```

### 4. Verificar que Funciona

```bash
# Ver logs
pm2 logs tabletop-backend

# Ver estado
pm2 status

# Probar API
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2025-11-18T..."
}
```

## 🌐 Configurar Nginx (Producción)

### 1. Instalar Nginx

```bash
sudo apt install nginx -y
```

### 2. Crear Configuración

```bash
sudo nano /etc/nginx/sites-available/tabletop-api
```

**Contenido:**
```nginx
server {
    listen 80;
    server_name api.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    access_log /var/log/nginx/tabletop-api-access.log;
    error_log /var/log/nginx/tabletop-api-error.log;
}
```

### 3. Activar Configuración

```bash
# Enlace simbólico
sudo ln -s /etc/nginx/sites-available/tabletop-api /etc/nginx/sites-enabled/

# Verificar
sudo nginx -t

# Reiniciar
sudo systemctl restart nginx
```

### 4. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot --nginx -d api.tu-dominio.com

# Verificar auto-renovación
sudo certbot renew --dry-run
```

## 🔧 Comandos Útiles de PM2

```bash
# Ver todos los procesos
pm2 list

# Ver logs en tiempo real
pm2 logs tabletop-backend

# Monitoreo en tiempo real
pm2 monit

# Reiniciar aplicación
pm2 restart tabletop-backend

# Detener aplicación
pm2 stop tabletop-backend

# Información detallada
pm2 info tabletop-backend

# Eliminar del PM2
pm2 delete tabletop-backend
```

## 🐛 Troubleshooting

### MongoDB no se conecta
```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod

# Ver logs de MongoDB
sudo journalctl -u mongod -n 50

# Reiniciar MongoDB
sudo systemctl restart mongod
```

### Puerto 3000 en uso
```bash
# Encontrar proceso
lsof -ti:3000

# Matar proceso
lsof -ti:3000 | xargs kill -9
```

### PM2 no guarda los procesos
```bash
# Re-ejecutar startup
pm2 unstartup
pm2 startup
# EJECUTAR EL COMANDO QUE MUESTRA

pm2 save
```

### Nginx no arranca
```bash
# Ver errores
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/error.log

# Reiniciar
sudo systemctl restart nginx
```

## 📊 Verificación Post-Despliegue

### Checklist

- [ ] MongoDB corriendo: `sudo systemctl status mongod`
- [ ] Backend corriendo: `pm2 status`
- [ ] Health check funciona: `curl http://localhost:3000/health`
- [ ] Nginx funciona: `sudo systemctl status nginx`
- [ ] API accesible desde fuera: `curl https://api.tu-dominio.com/health`
- [ ] SSL válido: Visitar `https://api.tu-dominio.com` en navegador
- [ ] Logs sin errores: `pm2 logs`

### Endpoints a Probar

```bash
# Health check
curl https://api.tu-dominio.com/health

# Registro de usuario
curl -X POST https://api.tu-dominio.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"12345678"}'

# Login
curl -X POST https://api.tu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'
```

## 📈 Monitoreo Continuo

### Setup de Monitoreo

```bash
# Ver logs de PM2 en tiempo real
pm2 logs --lines 50

# Monitor de recursos
pm2 monit

# Ver logs de Nginx
sudo tail -f /var/log/nginx/tabletop-api-access.log
sudo tail -f /var/log/nginx/tabletop-api-error.log
```

### Configurar Alertas (Opcional)

PM2 Plus para monitoreo avanzado:
```bash
pm2 link [secret_key] [public_key]
```

## 🔄 Actualización del Código

```bash
# Ir al directorio del proyecto
cd /var/www/TabletopMastering/backend

# Hacer backup de .env
cp .env .env.backup

# Actualizar código
git pull origin main

# Instalar nuevas dependencias (si las hay)
npm install --production

# Reiniciar con PM2
pm2 restart tabletop-backend

# Verificar logs
pm2 logs tabletop-backend --lines 50
```

## 🎯 Resumen Rápido

```bash
# 1. Instalar dependencias del sistema
sudo apt update && sudo apt install -y nodejs npm mongodb nginx

# 2. Clonar y configurar
git clone <repo>
cd backend
npm install --production
nano .env  # Configurar variables

# 3. PM2
sudo npm install -g pm2
pm2 start server.js --name tabletop-backend
pm2 startup
pm2 save

# 4. Nginx + SSL
sudo nano /etc/nginx/sites-available/tabletop-api  # Configurar
sudo ln -s /etc/nginx/sites-available/tabletop-api /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.tu-dominio.com

# 5. Verificar
curl https://api.tu-dominio.com/health
```

## 📚 Recursos Adicionales

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)

---

**¿Necesitas ayuda?** Revisa los logs con `pm2 logs` y `sudo journalctl -u mongod`
