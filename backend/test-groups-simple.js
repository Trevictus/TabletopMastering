/**
 * Script de prueba simple para la API de Grupos
 * Usar con: node test-groups-simple.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token1, token2, groupId, user2Id, inviteCode;

// Configuración de axios
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000;

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
};

function printHeader(text) {
  console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
}

function printSuccess(text) {
  console.log(`${colors.green}✓ ${text}${colors.reset}`);
}

function printError(text) {
  console.log(`${colors.red}✗ ${text}${colors.reset}`);
}

function printInfo(text) {
  console.log(`${colors.yellow}ℹ ${text}${colors.reset}`);
}

async function test() {
  try {
    printHeader('PRUEBAS COMPLETAS - API DE GRUPOS');

    // 1. Registro de usuarios
    printHeader('1. REGISTRO DE USUARIOS');
    
    try {
      const res1 = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Admin Test',
        email: `admin.groups.${Date.now()}@test.com`,
        password: 'test123',
      });
      token1 = res1.data.data.token;
      printSuccess('Usuario 1 (Admin) registrado correctamente');
    } catch (error) {
      printError(`Error al registrar usuario 1: ${error.response?.data?.message || error.message}`);
      process.exit(1);
    }

    try {
      const res2 = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Member Test',
        email: `member.groups.${Date.now()}@test.com`,
        password: 'test123',
      });
      token2 = res2.data.data.token;
      user2Id = res2.data.data.user.id;
      printSuccess('Usuario 2 (Member) registrado correctamente');
      printInfo(`User2 ID: ${user2Id}`);
    } catch (error) {
      printError(`Error al registrar usuario 2: ${error.response?.data?.message || error.message}`);
      process.exit(1);
    }

    // 2. Crear grupo
    printHeader('2. CREAR GRUPO');
    
    try {
      const res = await axios.post(
        `${BASE_URL}/groups`,
        {
          name: 'Grupo de Prueba',
          description: 'Grupo para testing completo',
          settings: {
            isPrivate: true,
            maxMembers: 10,
          },
        },
        { headers: { Authorization: `Bearer ${token1}` } }
      );
      groupId = res.data.data._id;
      inviteCode = res.data.data.inviteCode;
      printSuccess('Grupo creado correctamente');
      printInfo(`Group ID: ${groupId}`);
      printInfo(`Invite Code: ${inviteCode}`);
    } catch (error) {
      printError(`Error al crear grupo: ${error.response?.data?.message || error.message}`);
      process.exit(1);
    }

    // 3. Listar mis grupos
    printHeader('3. LISTAR MIS GRUPOS');
    
    try {
      const res = await axios.get(`${BASE_URL}/groups`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      printSuccess(`Grupos listados correctamente (count: ${res.data.count})`);
    } catch (error) {
      printError(`Error al listar grupos: ${error.response?.data?.message || error.message}`);
    }

    // 4. Obtener detalles del grupo
    printHeader('4. OBTENER DETALLES DEL GRUPO');
    
    try {
      const res = await axios.get(`${BASE_URL}/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      printSuccess('Detalles del grupo obtenidos correctamente');
    } catch (error) {
      printError(`Error al obtener detalles: ${error.response?.data?.message || error.message}`);
    }

    // 5. Unirse al grupo
    printHeader('5. UNIRSE AL GRUPO CON CÓDIGO');
    
    try {
      await axios.post(
        `${BASE_URL}/groups/join`,
        { inviteCode },
        { headers: { Authorization: `Bearer ${token2}` } }
      );
      printSuccess('Usuario 2 se unió al grupo correctamente');
    } catch (error) {
      printError(`Error al unirse: ${error.response?.data?.message || error.message}`);
    }

    // 6. Listar miembros
    printHeader('6. LISTAR MIEMBROS DEL GRUPO');
    
    try {
      const res = await axios.get(`${BASE_URL}/groups/${groupId}/members`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      printSuccess(`Miembros listados correctamente (count: ${res.data.count})`);
    } catch (error) {
      printError(`Error al listar miembros: ${error.response?.data?.message || error.message}`);
    }

    // 7. Actualizar grupo
    printHeader('7. ACTUALIZAR GRUPO');
    
    try {
      await axios.put(
        `${BASE_URL}/groups/${groupId}`,
        {
          name: 'Grupo Actualizado',
          description: 'Descripción actualizada',
          settings: { maxMembers: 20 },
        },
        { headers: { Authorization: `Bearer ${token1}` } }
      );
      printSuccess('Grupo actualizado correctamente');
    } catch (error) {
      printError(`Error al actualizar: ${error.response?.data?.message || error.message}`);
    }

    // 8. Regenerar código
    printHeader('8. REGENERAR CÓDIGO DE INVITACIÓN');
    
    try {
      const res = await axios.put(
        `${BASE_URL}/groups/${groupId}/invite-code`,
        {},
        { headers: { Authorization: `Bearer ${token1}` } }
      );
      const newCode = res.data.data.inviteCode;
      printSuccess('Código regenerado correctamente');
      printInfo(`Old code: ${inviteCode}`);
      printInfo(`New code: ${newCode}`);
      inviteCode = newCode;
    } catch (error) {
      printError(`Error al regenerar código: ${error.response?.data?.message || error.message}`);
    }

    // 9. Intentar expulsar sin permisos
    printHeader('9. INTENTAR EXPULSAR MIEMBRO (sin permisos)');
    
    try {
      await axios.delete(`${BASE_URL}/groups/${groupId}/members/${user2Id}`, {
        headers: { Authorization: `Bearer ${token2}` },
      });
      printError('Error: debería haber bloqueado la expulsión');
    } catch (error) {
      if (error.response?.status === 403) {
        printSuccess('Expulsión bloqueada correctamente (sin permisos)');
      } else {
        printError(`Error inesperado: ${error.response?.data?.message || error.message}`);
      }
    }

    // 10. Expulsar miembro como admin
    printHeader('10. EXPULSAR MIEMBRO (como admin)');
    
    try {
      await axios.delete(`${BASE_URL}/groups/${groupId}/members/${user2Id}`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      printSuccess('Miembro expulsado correctamente');
    } catch (error) {
      printError(`Error al expulsar: ${error.response?.data?.message || error.message}`);
    }

    // 11. Verificar expulsión
    printHeader('11. VERIFICAR EXPULSIÓN');
    
    try {
      const res = await axios.get(`${BASE_URL}/groups/${groupId}/members`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      if (res.data.count === 1) {
        printSuccess(`Expulsión verificada (count: ${res.data.count})`);
      } else {
        printError(`Error: count esperado 1, obtenido ${res.data.count}`);
      }
    } catch (error) {
      printError(`Error al verificar: ${error.response?.data?.message || error.message}`);
    }

    // 12. Unirse nuevamente
    printHeader('12. UNIRSE NUEVAMENTE AL GRUPO');
    
    try {
      await axios.post(
        `${BASE_URL}/groups/join`,
        { inviteCode },
        { headers: { Authorization: `Bearer ${token2}` } }
      );
      printSuccess('Usuario 2 se unió nuevamente al grupo');
    } catch (error) {
      printError(`Error al unirse: ${error.response?.data?.message || error.message}`);
    }

    // 13. Salir del grupo
    printHeader('13. SALIR DEL GRUPO');
    
    try {
      await axios.delete(`${BASE_URL}/groups/${groupId}/leave`, {
        headers: { Authorization: `Bearer ${token2}` },
      });
      printSuccess('Usuario 2 salió del grupo correctamente');
    } catch (error) {
      printError(`Error al salir: ${error.response?.data?.message || error.message}`);
    }

    // 14. Intentar salir como admin
    printHeader('14. INTENTAR SALIR COMO ADMIN');
    
    try {
      await axios.delete(`${BASE_URL}/groups/${groupId}/leave`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      printError('Error: admin no debería poder salir');
    } catch (error) {
      if (error.response?.status === 400) {
        printSuccess('Salida bloqueada correctamente (es admin)');
      } else {
        printError(`Error inesperado: ${error.response?.data?.message || error.message}`);
      }
    }

    // 15. Eliminar grupo
    printHeader('15. ELIMINAR GRUPO');
    
    try {
      await axios.delete(`${BASE_URL}/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      printSuccess('Grupo eliminado correctamente');
    } catch (error) {
      printError(`Error al eliminar: ${error.response?.data?.message || error.message}`);
    }

    // 16. Verificar eliminación
    printHeader('16. VERIFICAR ELIMINACIÓN');
    
    try {
      const res = await axios.get(`${BASE_URL}/groups`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      if (res.data.count === 0) {
        printSuccess('Grupo eliminado verificado (count: 0)');
      } else {
        printError(`Error: el grupo aún aparece en la lista (count: ${res.data.count})`);
      }
    } catch (error) {
      printError(`Error al verificar: ${error.response?.data?.message || error.message}`);
    }

    // Resumen
    printHeader('RESUMEN DE PRUEBAS');
    printSuccess('Todas las pruebas de la API de Grupos completadas');
    printInfo('Total de pruebas: 16');
    printInfo('Funcionalidades probadas:');
    console.log('  - Crear grupo');
    console.log('  - Listar grupos');
    console.log('  - Obtener detalles');
    console.log('  - Unirse con código');
    console.log('  - Listar miembros');
    console.log('  - Actualizar grupo');
    console.log('  - Regenerar código de invitación');
    console.log('  - Expulsar miembros');
    console.log('  - Salir del grupo');
    console.log('  - Eliminar grupo');
    console.log('  - Permisos y validaciones');

  } catch (error) {
    printError(`Error general: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar pruebas
test().catch(console.error);
