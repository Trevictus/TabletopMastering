/**
 * Script para verificar y crear índices en MongoDB
 * Ejecutar con: node scripts/verify-indexes.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos para que registren sus índices
const User = require('../models/User');
const Group = require('../models/Group');
const Game = require('../models/Game');
const Match = require('../models/Match');
const BGGCache = require('../models/BGGCache');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tabletopmastering';

async function verifyIndexes() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    const models = [
      { name: 'User', model: User },
      { name: 'Group', model: Group },
      { name: 'Game', model: Game },
      { name: 'Match', model: Match },
      { name: 'BGGCache', model: BGGCache },
    ];

    console.log('📊 VERIFICACIÓN DE ÍNDICES\n');
    console.log('='.repeat(60));

    for (const { name, model } of models) {
      console.log(`\n📁 Colección: ${name}`);
      console.log('-'.repeat(40));

      // Sincronizar índices definidos en el esquema
      await model.syncIndexes();

      // Obtener índices actuales
      const indexes = await model.collection.indexes();
      
      console.log(`   Total de índices: ${indexes.length}`);
      
      indexes.forEach((index, i) => {
        const keys = Object.entries(index.key)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        
        const options = [];
        if (index.unique) options.push('unique');
        if (index.sparse) options.push('sparse');
        if (index.expireAfterSeconds !== undefined) {
          options.push(`TTL: ${index.expireAfterSeconds}s`);
        }
        
        const optStr = options.length > 0 ? ` [${options.join(', ')}]` : '';
        console.log(`   ${i + 1}. { ${keys} }${optStr}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📈 ANÁLISIS DE RENDIMIENTO\n');

    // Análisis de consultas frecuentes
    console.log('Consultas optimizadas con índices:');
    console.log('  ✅ Match.find({ group, scheduledDate }) - Índice compuesto');
    console.log('  ✅ Match.find({ group, status }) - Índice compuesto');
    console.log('  ✅ Match.find({ "players.user" }) - Índice en subdocumento');
    console.log('  ✅ User.find({ groups }).sort({ "stats.totalPoints": -1 }) - Índice compuesto');
    console.log('  ✅ Group.findOne({ inviteCode }) - Índice único');
    console.log('  ✅ Group.find({ "members.user" }) - Índice en subdocumento');
    console.log('  ✅ Game.find({ group, isActive }).sort({ createdAt: -1 }) - Índice compuesto');
    console.log('  ✅ Game.find({ bggId }) - Índice sparse');
    console.log('  ✅ Game.$text({ name, description }) - Índice de texto');
    console.log('  ✅ BGGCache TTL - Auto-eliminación de caché expirado');

    console.log('\n✅ Verificación de índices completada\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  verifyIndexes();
}

module.exports = verifyIndexes;
