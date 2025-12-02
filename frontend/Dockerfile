# ============================================
# TABLETOP MASTERING - FRONTEND DOCKERFILE
# Multi-stage build optimizado para desarrollo y producción
# ============================================

# ---- Base Stage ----
FROM node:22-alpine AS base

RUN apk add --no-cache wget

WORKDIR /app

# Copiar archivos de dependencias primero (mejor caché de capas)
COPY package*.json ./

# ---- Dependencies Stage ----
FROM base AS dependencies

# Instalar todas las dependencias
# Usamos npm install porque puede que no exista package-lock.json
RUN npm install && npm cache clean --force

# ---- Development Stage ----
FROM base AS development

# Copiar dependencias desde el stage de dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5173

# Health check para desarrollo
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5173 || exit 1

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- Build Stage ----
FROM dependencies AS build

# Copiar código fuente
COPY . .

# Argumentos de build para variables de entorno
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Construir la aplicación para producción
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine AS production

# Copiar assets construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA con proxy reverso al backend
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;\n\
    \n\
    # Proxy para API backend\n\
    location /api/ {\n\
        proxy_pass http://backend:5000/api/;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
        proxy_cache_bypass $http_upgrade;\n\
        proxy_read_timeout 86400;\n\
    }\n\
    \n\
    # Archivos estáticos con cache largo\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    \n\
    # SPA fallback\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
