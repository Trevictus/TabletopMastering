require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
const Group = require('../models/Group');
const { addMemberToGroup } = require('../utils/groupHelpers');
const gameService = require('../services/gameService');

/**
 * Script para probar la funcionalidad de juegos en grupos
 * Crea un usuario de prueba, añade juegos personales y lo añade a un grupo
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/tabletop_mastering';

const TEST_USER = {
  name: 'Usuario Prueba',
  email: 'prueba@test.com',
  password: 'password123'
};

const TEST_GAMES = [
  {
    name: 'Ticket to Ride',
    description: 'Un juego de construcción de rutas ferroviarias',
    minPlayers: 2,
    maxPlayers: 5,
    playingTime: 60,
    source: 'custom',
    categories: ['Estrategia', 'Familiar'],
    difficulty: 'medio'
  },
  {
    name: 'Azul',
    description: 'Juego de colocación de azulejos',
    minPlayers: 2,
    maxPlayers: 4,
    playingTime: 45,
    source: 'custom',
    categories: ['Abstracto', 'Estrategia'],
    difficulty: 'fácil'
  },
  {
    name: 'Gloomhaven',
    description: 'Juego de campaña cooperativo',
    minPlayers: 1,
    maxPlayers: 4,
    playingTime: 120,
    source: 'custom',
    categories: ['Cooperativo', 'Estrategia'],
    difficulty: 'experto'
  }
];

async function main() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Conectado a MongoDB\n');

    // 1. Buscar o crear usuario de prueba
    console.log('👤 Buscando/creando usuario de prueba...');
    let testUser = await User.findOne({ email: TEST_USER.email });
    
    if (testUser) {
      console.log(`   Usuario existente encontrado: ${testUser.name} (${testUser._id})`);
    } else {
      testUser = await User.create(TEST_USER);
      console.log(`   ✅ Usuario creado: ${testUser.name} (${testUser._id})`);
    }

    // 2. Buscar el grupo "Los mataos"
    console.log('\n🎲 Buscando grupo "Los mataos"...');
    const group = await Group.findOne({ name: /Los mataos/i, isActive: true });
    
    if (!group) {
      throw new Error('No se encontró el grupo "Los mataos"');
    }
    console.log(`   ✅ Grupo encontrado: ${group.name} (${group._id})`);
    console.log(`   Miembros actuales: ${group.members.length}`);

    // 3. Añadir usuario al grupo si no es miembro
    console.log('\n➕ Añadiendo usuario al grupo...');
    if (group.isMember(testUser._id)) {
      console.log('   ⚠️  El usuario ya es miembro del grupo');
    } else {
      await addMemberToGroup(group, testUser._id, 'member');
      console.log('   ✅ Usuario añadido al grupo');
    }

    // 4. Verificar juegos existentes del usuario
    console.log('\n🎮 Verificando juegos existentes del usuario de prueba...');
    const existingGames = await Game.find({ 
      addedBy: testUser._id, 
      isActive: true 
    });
    console.log(`   Juegos existentes: ${existingGames.length}`);

    // 5. Crear juegos personales para el usuario de prueba
    console.log('\n📦 Creando juegos personales para el usuario de prueba...');
    const createdGames = [];
    
    for (const gameData of TEST_GAMES) {
      // Verificar si el juego ya existe
      const existing = await Game.findOne({
        name: gameData.name,
        addedBy: testUser._id,
        group: null,
        isActive: true
      });

      if (existing) {
        console.log(`   ⚠️  "${gameData.name}" ya existe, omitiendo...`);
        createdGames.push(existing);
      } else {
        const game = await Game.create({
          ...gameData,
          addedBy: testUser._id,
          group: null, // Juegos personales
          isActive: true
        });
        console.log(`   ✅ "${game.name}" creado`);
        createdGames.push(game);
      }
    }

    // 6. Verificar que los juegos aparezcan en la vista del grupo
    console.log('\n🔍 Verificando que los juegos aparezcan en la vista del grupo...');
    
    // Recargar el grupo para tener los miembros actualizados
    await group.populate('members.user', 'name email');
    
    const result = await gameService.getGames(
      testUser._id, // userId (no se usa realmente para la consulta del grupo)
      group._id,    // groupId
      { page: 1, limit: 50 }
    );

    console.log(`\n📊 RESULTADOS:`);
    console.log(`   Total de juegos en la vista del grupo: ${result.total}`);
    console.log(`   Juegos mostrados: ${result.count}`);
    console.log(`\n   Lista de juegos:`);
    
    result.games.forEach((game, index) => {
      const owner = game.owners?.length > 0 
        ? game.owners.map(o => o.name).join(', ')
        : game.addedBy?.name || 'Desconocido';
      const groupName = game.group?.name || 'personal';
      console.log(`   ${index + 1}. ${game.name} | Propietario(s): ${owner} | Grupo: ${groupName}`);
    });

    // 7. Verificar que los juegos del usuario de prueba estén incluidos
    const testUserGamesInGroup = result.games.filter(g => {
      const owners = g.owners || [];
      const addedBy = g.addedBy;
      return owners.some(o => o._id === testUser._id.toString()) || 
             addedBy?._id?.toString() === testUser._id.toString();
    });

    console.log(`\n✅ VERIFICACIÓN:`);
    console.log(`   Juegos del usuario de prueba en la vista: ${testUserGamesInGroup.length}`);
    
    if (testUserGamesInGroup.length >= createdGames.length) {
      console.log(`   ✅ ¡ÉXITO! Todos los juegos del usuario aparecen en la vista del grupo`);
    } else {
      console.log(`   ⚠️  Algunos juegos no aparecen. Esperados: ${createdGames.length}, Encontrados: ${testUserGamesInGroup.length}`);
    }

    // 8. Resumen final
    console.log(`\n📋 RESUMEN:`);
    console.log(`   Usuario de prueba: ${testUser.name} (${testUser.email})`);
    console.log(`   Grupo: ${group.name}`);
    console.log(`   Miembros del grupo: ${group.members.length}`);
    console.log(`   Juegos personales del usuario de prueba: ${createdGames.length}`);
    console.log(`   Total de juegos en vista del grupo: ${result.total}`);

    console.log('\n✅ Script completado exitosamente\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar el script
main();

