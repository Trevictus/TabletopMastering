#!/bin/sh
# Script para parchear Vite y deshabilitar la verificación de host

echo "Parcheando Vite para deshabilitar verificación de host..."

# Buscar el archivo de servidor de Vite
VITE_SERVER_FILE="/app/node_modules/vite/dist/node/chunks/server.js"

if [ -f "$VITE_SERVER_FILE" ]; then
  echo "Archivo encontrado: $VITE_SERVER_FILE"
  
  # Crear backup
  cp "$VITE_SERVER_FILE" "$VITE_SERVER_FILE.backup"
  
  # Buscar y reemplazar la verificación de host
  # Buscar patrones comunes de verificación de host en Vite
  sed -i 's/throw new Error(`Blocked request/\/\/ throw new Error(`Blocked request/g' "$VITE_SERVER_FILE"
  sed -i 's/throw new Error("Blocked request/\/\/ throw new Error("Blocked request/g' "$VITE_SERVER_FILE"
  sed -i 's/throw new Error(.*Blocked request.*allowed.*)/\/\/ &/g' "$VITE_SERVER_FILE"
  
  echo "Vite parcheado exitosamente"
else
  echo "Advertencia: No se encontró el archivo $VITE_SERVER_FILE"
fi

# Ejecutar el comando original
exec "$@"
