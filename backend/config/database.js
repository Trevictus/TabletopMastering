/**
 * @fileoverview Configuración de conexión a MongoDB
 * @description Establece y gestiona la conexión con la base de datos MongoDB
 * @module config/database
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Si no puede conectar a MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Opciones recomendadas para MongoDB
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Eventos de la conexión
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Error en la conexión de MongoDB: ${err}`);
});

module.exports = connectDB;
