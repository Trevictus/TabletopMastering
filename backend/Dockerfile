# ============================================
# TABLETOP MASTERING - BACKEND DOCKERFILE
# Multi-stage build optimizado para desarrollo y producción
# ============================================

# ---- Base Stage ----
FROM node:22-alpine AS base

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache dumb-init wget

WORKDIR /app

# Copiar archivos de dependencias primero (mejor caché de capas)
COPY package*.json ./

# ---- Dependencies Stage ----
FROM base AS dependencies

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install && npm cache clean --force

# ---- Production Dependencies Stage ----
FROM base AS production-deps

# Instalar solo dependencias de producción
RUN npm install --omit=dev && npm cache clean --force

# ---- Development Stage ----
FROM base AS development

# Copiar dependencias desde el stage de dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    mkdir -p /app/uploads/games && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

# Health check optimizado con wget (más ligero que node)
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]

# ---- Production Stage ----
FROM base AS production

# Copiar solo dependencias de producción
COPY --from=production-deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    mkdir -p /app/uploads/games && \
    chown -R nodejs:nodejs /app

USER nodejs

# Variables de entorno de producción
ENV NODE_ENV=production

EXPOSE 5000

# Health check optimizado
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
