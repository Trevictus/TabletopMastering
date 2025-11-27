/**
 * Test End-to-End Completo del Backend
 * 
 * Flujo: Registro → Login → Crear Grupo → Crear Juego → Crear Partida → Registrar Resultado
 * 
 * Ejecutar con: node tests/e2e-complete-flow.test.js
 */

const http = require('http');
const https = require('https');

// Configuración
const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const USE_HTTPS = BASE_URL.startsWith('https');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Estado global del test
const testState = {
  user1Token: null,
  user1Id: null,
  user2Token: null,
  user2Id: null,
  groupId: null,
  inviteCode: null,
  gameId: null,
  matchId: null,
};

// Generador de datos únicos para tests
const timestamp = Date.now();
const testData = {
  user1: {
    name: `TestUser1_${timestamp}`,
    email: `testuser1_${timestamp}@test.com`,
    password: 'Test123456!',
  },
  user2: {
    name: `TestUser2_${timestamp}`,
    email: `testuser2_${timestamp}@test.com`,
    password: 'Test123456!',
  },
  group: {
    name: `TestGroup_${timestamp}`,
    description: 'Grupo de prueba E2E',
  },
  game: {
    name: `TestGame_${timestamp}`,
    description: 'Juego de prueba para tests E2E',
    minPlayers: 2,
    maxPlayers: 4,
    playingTime: 60,
    categories: ['Strategy'],
  },
};

/**
 * Función helper para hacer peticiones HTTP
 */
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const client = USE_HTTPS ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (USE_HTTPS ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Funciones de logging
 */
function logTest(testName) {
  console.log(`\n${colors.cyan}${colors.bold}▶ ${testName}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`  ${colors.green}✓ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`  ${colors.red}✗ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`  ${colors.yellow}ℹ ${message}${colors.reset}`);
}

/**
 * Función de aserción
 */
function assert(condition, successMsg, errorMsg) {
  if (condition) {
    logSuccess(successMsg);
    return true;
  } else {
    logError(errorMsg);
    return false;
  }
}

// ==================== TESTS ====================

/**
 * Test 1: Registro de Usuario 1 (Admin del grupo)
 */
async function testRegisterUser1() {
  logTest('1. Registro de Usuario 1 (Admin del grupo)');
  
  const res = await makeRequest('POST', '/api/auth/register', testData.user1);
  
  if (!assert(res.status === 201, `Status: ${res.status}`, `Status esperado 201, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.success === true, 'Registro exitoso', 'Registro falló')) {
    return false;
  }
  
  if (!assert(res.data.data?.token, 'Token recibido', 'No se recibió token')) {
    return false;
  }
  
  testState.user1Token = res.data.data.token;
  testState.user1Id = res.data.data.user.id;
  
  logInfo(`Usuario registrado: ${res.data.data.user.name} (ID: ${testState.user1Id})`);
  return true;
}

/**
 * Test 2: Registro de Usuario 2 (Miembro del grupo)
 */
async function testRegisterUser2() {
  logTest('2. Registro de Usuario 2 (Miembro del grupo)');
  
  const res = await makeRequest('POST', '/api/auth/register', testData.user2);
  
  if (!assert(res.status === 201, `Status: ${res.status}`, `Status esperado 201, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  testState.user2Token = res.data.data.token;
  testState.user2Id = res.data.data.user.id;
  
  logInfo(`Usuario registrado: ${res.data.data.user.name} (ID: ${testState.user2Id})`);
  return true;
}

/**
 * Test 3: Login del Usuario 1
 */
async function testLoginUser1() {
  logTest('3. Login de Usuario 1');
  
  const res = await makeRequest('POST', '/api/auth/login', {
    email: testData.user1.email,
    password: testData.user1.password,
  });
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.success === true, 'Login exitoso', 'Login falló')) {
    return false;
  }
  
  // Actualizar token por si cambió
  testState.user1Token = res.data.data.token;
  
  logInfo(`Login exitoso para: ${res.data.data.user.name}`);
  return true;
}

/**
 * Test 4: Obtener perfil del usuario autenticado
 */
async function testGetProfile() {
  logTest('4. Obtener perfil del usuario autenticado');
  
  const res = await makeRequest('GET', '/api/auth/me', null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.data?.email === testData.user1.email, 'Email correcto', 'Email incorrecto')) {
    return false;
  }
  
  logInfo(`Perfil obtenido: ${res.data.data.name}`);
  return true;
}

/**
 * Test 5: Crear un Grupo
 */
async function testCreateGroup() {
  logTest('5. Crear un Grupo');
  
  const res = await makeRequest('POST', '/api/groups', testData.group, testState.user1Token);
  
  if (!assert(res.status === 201, `Status: ${res.status}`, `Status esperado 201, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.success === true, 'Grupo creado', 'Creación de grupo falló')) {
    return false;
  }
  
  testState.groupId = res.data.data._id;
  testState.inviteCode = res.data.data.inviteCode;
  
  logInfo(`Grupo creado: ${res.data.data.name} (ID: ${testState.groupId})`);
  logInfo(`Código de invitación: ${testState.inviteCode}`);
  return true;
}

/**
 * Test 6: Usuario 2 se une al grupo
 */
async function testJoinGroup() {
  logTest('6. Usuario 2 se une al Grupo');
  
  const res = await makeRequest('POST', '/api/groups/join', {
    inviteCode: testState.inviteCode,
  }, testState.user2Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.success === true, 'Usuario unido al grupo', 'Unión al grupo falló')) {
    return false;
  }
  
  logInfo(`Usuario 2 se unió al grupo exitosamente`);
  return true;
}

/**
 * Test 7: Obtener miembros del grupo
 */
async function testGetGroupMembers() {
  logTest('7. Obtener miembros del Grupo');
  
  const res = await makeRequest('GET', `/api/groups/${testState.groupId}/members`, null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  const memberCount = res.data.data?.length || 0;
  if (!assert(memberCount >= 2, `${memberCount} miembros en el grupo`, 'El grupo debería tener al menos 2 miembros')) {
    return false;
  }
  
  logInfo(`Miembros del grupo: ${res.data.data.map(m => m.user?.name || 'Unknown').join(', ')}`);
  return true;
}

/**
 * Test 8: Crear un Juego personalizado
 */
async function testCreateGame() {
  logTest('8. Crear un Juego personalizado');
  
  const gameData = {
    ...testData.game,
    groupId: testState.groupId,
  };
  
  const res = await makeRequest('POST', '/api/games', gameData, testState.user1Token);
  
  if (!assert(res.status === 201, `Status: ${res.status}`, `Status esperado 201, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.success === true, 'Juego creado', 'Creación de juego falló')) {
    return false;
  }
  
  testState.gameId = res.data.data._id;
  
  logInfo(`Juego creado: ${res.data.data.name} (ID: ${testState.gameId})`);
  return true;
}

/**
 * Test 9: Obtener lista de juegos
 */
async function testGetGames() {
  logTest('9. Obtener lista de Juegos');
  
  const res = await makeRequest('GET', `/api/games?groupId=${testState.groupId}`, null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  const gameCount = res.data.data?.length || 0;
  if (!assert(gameCount >= 1, `${gameCount} juego(s) encontrado(s)`, 'Debería haber al menos 1 juego')) {
    return false;
  }
  
  logInfo(`Juegos en el grupo: ${res.data.data.map(g => g.name).join(', ')}`);
  return true;
}

/**
 * Test 10: Obtener detalles de un juego específico
 */
async function testGetGameDetails() {
  logTest('10. Obtener detalles del Juego');
  
  const res = await makeRequest('GET', `/api/games/${testState.gameId}`, null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.data?.name === testData.game.name, 'Nombre del juego correcto', 'Nombre del juego incorrecto')) {
    return false;
  }
  
  logInfo(`Detalles: ${res.data.data.name} (${res.data.data.minPlayers}-${res.data.data.maxPlayers} jugadores)`);
  return true;
}

/**
 * Test 11: Crear una Partida
 */
async function testCreateMatch() {
  logTest('11. Crear una Partida');
  
  // Programar la partida para dentro de 1 hora
  const scheduledDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  
  const matchData = {
    gameId: testState.gameId,
    groupId: testState.groupId,
    scheduledDate: scheduledDate,
    location: 'Casa de Test',
    playerIds: [testState.user1Id, testState.user2Id],
    notes: 'Partida de prueba E2E',
  };
  
  const res = await makeRequest('POST', '/api/matches', matchData, testState.user1Token);
  
  if (!assert(res.status === 201, `Status: ${res.status}`, `Status esperado 201, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.success === true, 'Partida creada', 'Creación de partida falló')) {
    return false;
  }
  
  testState.matchId = res.data.data._id;
  
  logInfo(`Partida creada: ID ${testState.matchId}`);
  logInfo(`Fecha programada: ${new Date(scheduledDate).toLocaleString()}`);
  return true;
}

/**
 * Test 12: Obtener lista de partidas
 */
async function testGetMatches() {
  logTest('12. Obtener lista de Partidas');
  
  const res = await makeRequest('GET', `/api/matches?groupId=${testState.groupId}`, null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  const matchCount = res.data.data?.length || 0;
  if (!assert(matchCount >= 1, `${matchCount} partida(s) encontrada(s)`, 'Debería haber al menos 1 partida')) {
    return false;
  }
  
  logInfo(`Total de partidas en el grupo: ${matchCount}`);
  return true;
}

/**
 * Test 13: Obtener detalles de una partida específica
 */
async function testGetMatchDetails() {
  logTest('13. Obtener detalles de la Partida');
  
  const res = await makeRequest('GET', `/api/matches/${testState.matchId}`, null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.data?.status, 'Partida tiene estado', 'La partida no tiene estado')) {
    return false;
  }
  
  logInfo(`Estado de la partida: ${res.data.data.status}`);
  logInfo(`Jugadores: ${res.data.data.players?.length || 0}`);
  return true;
}

/**
 * Test 14: Confirmar asistencia a la partida (Usuario 2)
 */
async function testConfirmAttendance() {
  logTest('14. Confirmar asistencia a la Partida (Usuario 2)');
  
  const res = await makeRequest('POST', `/api/matches/${testState.matchId}/confirm`, {}, testState.user2Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  logInfo('Asistencia confirmada exitosamente');
  return true;
}

/**
 * Test 15: Finalizar partida y registrar resultados
 */
async function testFinishMatch() {
  logTest('15. Finalizar Partida y registrar resultados');
  
  const finishData = {
    winnerId: testState.user1Id,
    results: [
      { playerId: testState.user1Id, score: 100, position: 1 },
      { playerId: testState.user2Id, score: 75, position: 2 },
    ],
    duration: { value: 45, unit: 'minutos' },
    notes: 'Gran partida de prueba E2E',
  };
  
  const res = await makeRequest('POST', `/api/matches/${testState.matchId}/finish`, finishData, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  if (!assert(res.data.success === true, 'Partida finalizada', 'Finalización de partida falló')) {
    return false;
  }
  
  if (!assert(res.data.data?.status === 'finalizada', 'Estado: finalizada', `Estado incorrecto: ${res.data.data?.status}`)) {
    return false;
  }
  
  logInfo(`Partida finalizada - Ganador registrado`);
  logInfo(`Duración: ${finishData.duration.value} ${finishData.duration.unit}`);
  
  if (res.data.ranking) {
    logInfo(`Puntos del ranking actualizados`);
  }
  
  return true;
}

/**
 * Test 16: Verificar estadísticas del usuario
 */
async function testVerifyUserStats() {
  logTest('16. Verificar estadísticas del Usuario 1');
  
  const res = await makeRequest('GET', '/api/auth/me', null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  const stats = res.data.data?.stats;
  if (stats) {
    logInfo(`Partidas jugadas: ${stats.matchesPlayed || 0}`);
    logInfo(`Victorias: ${stats.wins || 0}`);
    logInfo(`Ratio de victorias: ${((stats.winRate || 0) * 100).toFixed(1)}%`);
  } else {
    logInfo('Estadísticas no disponibles en el perfil');
  }
  
  return true;
}

/**
 * Test 17: Obtener ranking del grupo
 */
async function testGetGroupRanking() {
  logTest('17. Obtener Ranking del Grupo');
  
  const res = await makeRequest('GET', `/api/matches/ranking/group/${testState.groupId}`, null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  const rankingData = res.data.data;
  if (Array.isArray(rankingData) && rankingData.length > 0) {
    logInfo(`Ranking del grupo (${rankingData.length} jugadores):`);
    rankingData.slice(0, 5).forEach((player, index) => {
      logInfo(`  ${index + 1}. ${player.name || player.user?.name || 'Usuario'}: ${player.points || player.totalPoints || 0} puntos`);
    });
  } else {
    logInfo('Ranking del grupo obtenido (sin datos de jugadores)');
  }
  
  return true;
}

/**
 * Test 18: Obtener estadísticas de juegos del grupo
 */
async function testGetGroupGameStats() {
  logTest('18. Obtener estadísticas de Juegos del Grupo');
  
  const res = await makeRequest('GET', `/api/games/stats/${testState.groupId}`, null, testState.user1Token);
  
  if (!assert(res.status === 200, `Status: ${res.status}`, `Status esperado 200, recibido ${res.status}`)) {
    logError(`Respuesta: ${JSON.stringify(res.data)}`);
    return false;
  }
  
  logInfo('Estadísticas de juegos obtenidas exitosamente');
  return true;
}

// ==================== TESTS DE LIMPIEZA (OPCIONAL) ====================

/**
 * Test de limpieza: Eliminar partida
 */
async function cleanupDeleteMatch() {
  logTest('🧹 Limpieza: Eliminar Partida de prueba');
  
  if (!testState.matchId) {
    logInfo('No hay partida para eliminar');
    return true;
  }
  
  const res = await makeRequest('DELETE', `/api/matches/${testState.matchId}`, null, testState.user1Token);
  
  if (res.status === 200) {
    logSuccess('Partida eliminada');
  } else {
    logInfo(`No se pudo eliminar la partida (status: ${res.status})`);
  }
  
  return true;
}

/**
 * Test de limpieza: Eliminar juego
 */
async function cleanupDeleteGame() {
  logTest('🧹 Limpieza: Eliminar Juego de prueba');
  
  if (!testState.gameId) {
    logInfo('No hay juego para eliminar');
    return true;
  }
  
  const res = await makeRequest('DELETE', `/api/games/${testState.gameId}`, null, testState.user1Token);
  
  if (res.status === 200) {
    logSuccess('Juego eliminado');
  } else {
    logInfo(`No se pudo eliminar el juego (status: ${res.status})`);
  }
  
  return true;
}

/**
 * Test de limpieza: Usuario 2 abandona el grupo
 */
async function cleanupUser2LeaveGroup() {
  logTest('🧹 Limpieza: Usuario 2 abandona el grupo');
  
  if (!testState.groupId || !testState.user2Token) {
    logInfo('No hay grupo o usuario 2 para procesar');
    return true;
  }
  
  const res = await makeRequest('DELETE', `/api/groups/${testState.groupId}/leave`, null, testState.user2Token);
  
  if (res.status === 200) {
    logSuccess('Usuario 2 abandonó el grupo');
  } else {
    logInfo(`No se pudo abandonar el grupo (status: ${res.status})`);
  }
  
  return true;
}

/**
 * Test de limpieza: Eliminar grupo
 */
async function cleanupDeleteGroup() {
  logTest('🧹 Limpieza: Eliminar Grupo de prueba');
  
  if (!testState.groupId) {
    logInfo('No hay grupo para eliminar');
    return true;
  }
  
  const res = await makeRequest('DELETE', `/api/groups/${testState.groupId}`, null, testState.user1Token);
  
  if (res.status === 200) {
    logSuccess('Grupo eliminado');
  } else {
    logInfo(`No se pudo eliminar el grupo (status: ${res.status})`);
  }
  
  return true;
}

// ==================== EJECUCIÓN PRINCIPAL ====================

async function runTests() {
  console.log(`\n${colors.bold}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  🎲 TEST END-TO-END COMPLETO - TABLETOP MASTERING${colors.reset}`);
  console.log(`${colors.bold}${'='.repeat(60)}${colors.reset}`);
  console.log(`\n${colors.yellow}URL Base: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.yellow}Timestamp: ${new Date().toISOString()}${colors.reset}`);
  
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  const tests = [
    // Flujo de autenticación
    { name: 'Registro Usuario 1', fn: testRegisterUser1 },
    { name: 'Registro Usuario 2', fn: testRegisterUser2 },
    { name: 'Login Usuario 1', fn: testLoginUser1 },
    { name: 'Obtener Perfil', fn: testGetProfile },
    
    // Flujo de grupos
    { name: 'Crear Grupo', fn: testCreateGroup },
    { name: 'Usuario 2 se une', fn: testJoinGroup },
    { name: 'Obtener Miembros', fn: testGetGroupMembers },
    
    // Flujo de juegos
    { name: 'Crear Juego', fn: testCreateGame },
    { name: 'Listar Juegos', fn: testGetGames },
    { name: 'Detalles del Juego', fn: testGetGameDetails },
    
    // Flujo de partidas
    { name: 'Crear Partida', fn: testCreateMatch },
    { name: 'Listar Partidas', fn: testGetMatches },
    { name: 'Detalles Partida', fn: testGetMatchDetails },
    { name: 'Confirmar Asistencia', fn: testConfirmAttendance },
    { name: 'Finalizar Partida', fn: testFinishMatch },
    
    // Verificaciones
    { name: 'Stats Usuario', fn: testVerifyUserStats },
    { name: 'Ranking Grupo', fn: testGetGroupRanking },
    { name: 'Stats Juegos Grupo', fn: testGetGroupGameStats },
  ];

  // Ejecutar tests principales
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.tests.push({ name: test.name, passed });
      if (passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      logError(`Error en test "${test.name}": ${error.message}`);
      results.tests.push({ name: test.name, passed: false, error: error.message });
      results.failed++;
    }
  }

  // Ejecutar limpieza (opcional)
  const shouldCleanup = process.env.CLEANUP !== 'false';
  if (shouldCleanup) {
    console.log(`\n${colors.bold}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}${colors.yellow}  🧹 LIMPIEZA DE DATOS DE PRUEBA${colors.reset}`);
    console.log(`${colors.bold}${'='.repeat(60)}${colors.reset}`);
    
    try {
      await cleanupDeleteMatch();
      await cleanupDeleteGame();
      await cleanupUser2LeaveGroup();
      await cleanupDeleteGroup();
    } catch (error) {
      logError(`Error en limpieza: ${error.message}`);
    }
  } else {
    logInfo('\n(Limpieza omitida - CLEANUP=false)');
  }

  // Resumen final
  console.log(`\n${colors.bold}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}  📊 RESUMEN DE RESULTADOS${colors.reset}`);
  console.log(`${'='.repeat(60)}`);
  
  const totalTests = results.passed + results.failed;
  const successRate = ((results.passed / totalTests) * 100).toFixed(1);
  
  console.log(`\n  Total de tests: ${totalTests}`);
  console.log(`  ${colors.green}✓ Pasados: ${results.passed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Fallidos: ${results.failed}${colors.reset}`);
  console.log(`  Tasa de éxito: ${successRate}%`);
  
  if (results.failed > 0) {
    console.log(`\n${colors.red}  Tests fallidos:${colors.reset}`);
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`    - ${t.name}${t.error ? `: ${t.error}` : ''}`);
    });
  }
  
  console.log(`\n${'='.repeat(60)}`);
  
  if (results.failed === 0) {
    console.log(`\n${colors.green}${colors.bold}  ✅ TODOS LOS TESTS PASARON EXITOSAMENTE${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}${colors.bold}  ❌ ALGUNOS TESTS FALLARON${colors.reset}\n`);
    process.exit(1);
  }
}

// Verificar conexión al servidor antes de ejecutar tests
async function checkServerConnection() {
  console.log(`\n${colors.yellow}Verificando conexión al servidor...${colors.reset}`);
  
  try {
    const res = await makeRequest('GET', '/health');
    if (res.status === 200) {
      console.log(`${colors.green}✓ Servidor disponible${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.red}✗ Servidor respondió con status ${res.status}${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ No se pudo conectar al servidor: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}  Asegúrate de que el servidor esté corriendo en ${BASE_URL}${colors.reset}\n`);
    return false;
  }
}

// Iniciar
(async () => {
  const serverAvailable = await checkServerConnection();
  if (!serverAvailable) {
    console.log(`${colors.red}Abortando tests - servidor no disponible${colors.reset}\n`);
    process.exit(1);
  }
  
  await runTests();
})();
