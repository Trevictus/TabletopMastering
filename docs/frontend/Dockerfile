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

# Health check para desarrollo (usar 127.0.0.1 para evitar IPv6)
HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5173 || exit 1

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

# Configuración de nginx para SPA
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
