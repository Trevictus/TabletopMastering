FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Ejecutar Vite en modo desarrollo con acceso desde cualquier interfaz
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]