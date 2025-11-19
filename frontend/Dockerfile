FROM node:lts-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5173

# Ejecutar Vite en modo desarrollo con host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]