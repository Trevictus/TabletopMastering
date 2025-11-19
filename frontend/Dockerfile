FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5173

# Ejecutar Vite en modo desarrollo con host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]