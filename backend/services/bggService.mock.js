/**
 * Mock del servicio BGG para tests y desarrollo
 * Este servicio simula las respuestas de BoardGameGeek sin hacer llamadas reales a la API
 * 
 * @description Proporciona datos de prueba estáticos para desarrollo local cuando
 * la variable de entorno USE_BGG_MOCK=true está activa
 * @version 2.0.0
 * @author TableTopMastering Team
 */

// URLs de imágenes oficiales de BoardGameGeek (CDN estable y fiable)
const BGG_IMAGE_BASE = 'https://cf.geekdo-images.com';

/**
 * Configuración de imágenes por juego
 * Cada juego tiene su imagen y thumbnail oficial de BGG
 */
const GAME_IMAGES = Object.freeze({
  // Catan - Caja clásica naranja con la isla hexagonal
  13: {
    image: `${BGG_IMAGE_BASE}/images/pic2419375.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/8a9HeqFydO7Uun_le9bXWPnidcA=/fit-in/200x150/filters:strip_icc()/pic2419375.jpg`,
  },
  // Gloomhaven - Arte épico de fantasía oscura
  174430: {
    image: `${BGG_IMAGE_BASE}/images/pic2437871.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/e7GyV4PaNtwmalU-EQAGecwW-lg=/fit-in/200x150/filters:strip_icc()/pic2437871.jpg`,
  },
  // Terraforming Mars - Planeta rojo con corporaciones
  167791: {
    image: `${BGG_IMAGE_BASE}/images/pic3536616.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/QK96lPCkhOhdXNlHqGMIL5OGdec=/fit-in/200x150/filters:strip_icc()/pic3536616.jpg`,
  },
  // Wingspan - Ilustración artística de aves
  266192: {
    image: `${BGG_IMAGE_BASE}/images/pic4458123.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/-SBY5JNPxqPbF18u0Y-xDzqneiY=/fit-in/200x150/filters:strip_icc()/pic4458123.jpg`,
  },
  // Scythe - Mechs dieselpunk en Europa alternativa
  169786: {
    image: `${BGG_IMAGE_BASE}/images/pic3163924.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/ZpT5sYwbKwDpe7DNiKSOnKVijuk=/fit-in/200x150/filters:strip_icc()/pic3163924.jpg`,
  },
  // 7 Wonders Duel - Cartas y maravillas antiguas
  173346: {
    image: `${BGG_IMAGE_BASE}/images/pic3043377.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/LRIIr-_VEMfpHlVkHlbVqmlldzI=/fit-in/200x150/filters:strip_icc()/pic3043377.jpg`,
  },
  // Pandemic Legacy Season 1 - Mapa del mundo con virus
  161936: {
    image: `${BGG_IMAGE_BASE}/images/pic2452831.png`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/E6umhCSkeG4EcYjRaFtzWpMLmmE=/fit-in/200x150/filters:strip_icc()/pic2452831.png`,
  },
  // Twilight Struggle - Guerra Fría con mapa global
  12333: {
    image: `${BGG_IMAGE_BASE}/images/pic3530661.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/iNHKuGa_4ePTCWGTz0gNZuZGRkY=/fit-in/200x150/filters:strip_icc()/pic3530661.jpg`,
  },
  // Gaia Project - Planetas y facciones espaciales
  220308: {
    image: `${BGG_IMAGE_BASE}/images/pic3763556.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/VJd1HXHvdooPVjDMsXeobg8Vx0w=/fit-in/200x150/filters:strip_icc()/pic3763556.jpg`,
  },
  // The Castles of Burgundy - Tablero de azulejos medievales
  84876: {
    image: `${BGG_IMAGE_BASE}/images/pic1176894.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/C7m9cRB7JkMHqbDrDH7DzXv4PFA=/fit-in/200x150/filters:strip_icc()/pic1176894.jpg`,
  },
  // Clank! - Aventura en mazmorras con dragón
  233078: {
    image: `${BGG_IMAGE_BASE}/images/pic3180509.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/EYuq1JJ4y2kvQugOw1_kRdDifLQ=/fit-in/200x150/filters:strip_icc()/pic3180509.jpg`,
  },
  // Default - Placeholder genérico
  default: {
    image: `${BGG_IMAGE_BASE}/images/pic1657689.jpg`,
    thumbnail: `${BGG_IMAGE_BASE}/thumb/img/Bl1-4YYBRC0cSJOqNbgcvx-8lQY=/fit-in/200x150/filters:strip_icc()/pic1657689.jpg`,
  },
});

/**
 * Servicio Mock de BoardGameGeek
 * Proporciona una simulación completa de la API de BGG para desarrollo y testing
 */
class MockBGGService {
  /** @type {Map<number|string, Object>} Mapa de juegos mock */
  #mockGames;
  
  /** @type {Array<Object>} Lista de juegos populares */
  #hotList;

  constructor() {
    this.#initializeMockGames();
    this.#initializeHotList();
  }

  /**
   * Inicializa el mapa de juegos mock con datos actualizados
   * @private
   */
  #initializeMockGames() {
    this.#mockGames = new Map([
      [13, {
        bggId: 13,
        name: 'Catan',
        description: 'In Catan, players try to be the dominant force on the island of Catan by building settlements, cities, and roads. On each turn dice are rolled to determine what resources the island produces.',
        ...GAME_IMAGES[13],
        yearPublished: 1995,
        minPlayers: 2,
        maxPlayers: 4,
        playingTime: 120,
        minPlayTime: 60,
        maxPlayTime: 120,
        categories: ['Negotiation', 'Economic', 'Dice'],
        mechanics: ['Dice Rolling', 'Hand Management', 'Hexagon Grid', 'Network and Route Building', 'Trading'],
        designer: ['Klaus Teuber'],
        publisher: ['Kosmos', 'Mayfair Games'],
        rating: { average: 7.2, usersRated: 95000, bayesAverage: 7.1 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
      [174430, {
        bggId: 174430,
        name: 'Gloomhaven',
        description: 'Gloomhaven is a game of Euro-inspired tactical combat in a persistent world of shifting motives.',
        ...GAME_IMAGES[174430],
        yearPublished: 2017,
        minPlayers: 1,
        maxPlayers: 4,
        playingTime: 120,
        minPlayTime: 60,
        maxPlayTime: 120,
        categories: ['Adventure', 'Exploration', 'Fantasy', 'Fighting', 'Miniatures'],
        mechanics: ['Campaign / Battle Card Driven', 'Cooperative Game', 'Grid Movement', 'Hand Management', 'Modular Board', 'Role Playing', 'Simultaneous Action Selection', 'Storytelling', 'Variable Player Powers'],
        designer: ['Isaac Childres'],
        publisher: ['Cephalofair Games'],
        rating: { average: 8.7, usersRated: 75000, bayesAverage: 8.4 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
      [167791, {
        bggId: 167791,
        name: 'Terraforming Mars',
        description: 'In the 2400s, mankind begins to terraform the planet Mars. Giant corporations, sponsored by the World Government on Earth, initiate huge projects to raise the temperature, oxygen level, and ocean coverage.',
        ...GAME_IMAGES[167791],
        yearPublished: 2016,
        minPlayers: 1,
        maxPlayers: 5,
        playingTime: 120,
        minPlayTime: 90,
        maxPlayTime: 120,
        categories: ['Economic', 'Environmental', 'Industry / Manufacturing', 'Science Fiction', 'Territory Building'],
        mechanics: ['Card Drafting', 'Hand Management', 'Set Collection', 'Tile Placement', 'Variable Player Powers'],
        designer: ['Jacob Fryxelius'],
        publisher: ['FryxGames'],
        rating: { average: 8.4, usersRated: 89000, bayesAverage: 8.2 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
      [266192, {
        bggId: 266192,
        name: 'Wingspan',
        description: 'Wingspan is a competitive, medium-weight, card-driven, engine-building board game about birds.',
        ...GAME_IMAGES[266192],
        yearPublished: 2019,
        minPlayers: 1,
        maxPlayers: 5,
        playingTime: 70,
        minPlayTime: 40,
        maxPlayTime: 70,
        categories: ['Animals', 'Card Game', 'Educational'],
        mechanics: ['Card Drafting', 'Dice Rolling', 'End Game Bonuses', 'Hand Management', 'Set Collection'],
        designer: ['Elizabeth Hargrave'],
        publisher: ['Stonemaier Games'],
        rating: { average: 8.0, usersRated: 98000, bayesAverage: 7.9 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
      [169786, {
        bggId: 169786,
        name: 'Scythe',
        description: 'It is a time of unrest in 1920s Europa. The ashes from the first great war still darken the snow. Lead your faction to victory.',
        ...GAME_IMAGES[169786],
        yearPublished: 2016,
        minPlayers: 1,
        maxPlayers: 5,
        playingTime: 115,
        minPlayTime: 90,
        maxPlayTime: 115,
        categories: ['Economic', 'Fighting', 'Science Fiction', 'Territory Building'],
        mechanics: ['Area Control', 'Grid Movement', 'Simultaneous Action Selection', 'Variable Player Powers'],
        designer: ['Jamey Stegmaier'],
        publisher: ['Stonemaier Games'],
        rating: { average: 8.1, usersRated: 91000, bayesAverage: 7.9 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
      [173346, {
        bggId: 173346,
        name: '7 Wonders Duel',
        description: 'Create the greatest civilization the Ancient World has ever known in this standalone 2-player version of 7 Wonders.',
        ...GAME_IMAGES[173346],
        yearPublished: 2015,
        minPlayers: 2,
        maxPlayers: 2,
        playingTime: 30,
        minPlayTime: 30,
        maxPlayTime: 30,
        categories: ['Ancient', 'Card Game', 'City Building', 'Civilization'],
        mechanics: ['Card Drafting', 'Set Collection', 'Tug of War', 'Victory Points as a Resource'],
        designer: ['Antoine Bauza', 'Bruno Cathala'],
        publisher: ['Repos Production'],
        rating: { average: 8.1, usersRated: 74000, bayesAverage: 7.9 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
      [161936, {
        bggId: 161936,
        name: 'Pandemic Legacy: Season 1',
        description: 'Pandemic Legacy is a cooperative campaign game where your actions and choices carry over between games.',
        ...GAME_IMAGES[161936],
        yearPublished: 2015,
        minPlayers: 2,
        maxPlayers: 4,
        playingTime: 60,
        minPlayTime: 60,
        maxPlayTime: 60,
        categories: ['Medical'],
        mechanics: ['Action Point Allowance System', 'Campaign / Battle Card Driven', 'Cooperative Game', 'Hand Management', 'Point to Point Movement', 'Set Collection', 'Trading', 'Variable Player Powers'],
        designer: ['Rob Daviau', 'Matt Leacock'],
        publisher: ['Z-Man Games'],
        rating: { average: 8.6, usersRated: 96000, bayesAverage: 8.3 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
      ['default', {
        bggId: 0,
        name: 'Mock Board Game',
        description: 'This is a mock board game for testing purposes.',
        ...GAME_IMAGES.default,
        yearPublished: 2024,
        minPlayers: 2,
        maxPlayers: 4,
        playingTime: 60,
        minPlayTime: 30,
        maxPlayTime: 90,
        categories: ['Strategy'],
        mechanics: ['Hand Management'],
        designer: ['Mock Designer'],
        publisher: ['Mock Publisher'],
        rating: { average: 7.0, usersRated: 1000, bayesAverage: 6.8 },
        source: 'bgg',
        bggLastSync: new Date(),
      }],
    ]);
  }

  /**
   * Inicializa la lista de juegos populares (Hot List) con imágenes actualizadas
   * @private
   */
  #initializeHotList() {
    this.#hotList = Object.freeze([
      { bggId: 13, rank: 1, name: 'Catan', yearPublished: 1995, thumbnail: GAME_IMAGES[13].thumbnail },
      { bggId: 174430, rank: 2, name: 'Gloomhaven', yearPublished: 2017, thumbnail: GAME_IMAGES[174430].thumbnail },
      { bggId: 12333, rank: 3, name: 'Twilight Struggle', yearPublished: 2005, thumbnail: GAME_IMAGES[12333].thumbnail },
      { bggId: 167791, rank: 4, name: 'Terraforming Mars', yearPublished: 2016, thumbnail: GAME_IMAGES[167791].thumbnail },
      { bggId: 220308, rank: 5, name: 'Gaia Project', yearPublished: 2017, thumbnail: GAME_IMAGES[220308].thumbnail },
      { bggId: 84876, rank: 6, name: 'The Castles of Burgundy', yearPublished: 2011, thumbnail: GAME_IMAGES[84876].thumbnail },
      { bggId: 169786, rank: 7, name: 'Scythe', yearPublished: 2016, thumbnail: GAME_IMAGES[169786].thumbnail },
      { bggId: 173346, rank: 8, name: '7 Wonders Duel', yearPublished: 2015, thumbnail: GAME_IMAGES[173346].thumbnail },
      { bggId: 233078, rank: 9, name: 'Clank!: A Deck-Building Adventure', yearPublished: 2016, thumbnail: GAME_IMAGES[233078].thumbnail },
      { bggId: 161936, rank: 10, name: 'Pandemic Legacy: Season 1', yearPublished: 2015, thumbnail: GAME_IMAGES[161936].thumbnail },
    ]);
  }

  /**
   * Obtiene un juego del mapa interno
   * @param {number|string} bggId - ID del juego
   * @returns {Object|undefined} Datos del juego o undefined
   * @private
   */
  #getGame(bggId) {
    return this.#mockGames.get(Number(bggId)) ?? this.#mockGames.get(bggId);
  }

  /**
   * Buscar juegos en BGG por nombre (simulado)
   * @param {string} query - Término de búsqueda
   * @param {boolean} exact - Búsqueda exacta
   * @returns {Promise<Array>} - Lista de juegos encontrados
   */
  async searchGames(query, exact = false) {
    console.log(`[MOCK BGG] Searching for: "${query}", exact: ${exact}`);
    
    // Simular delay de red
    await this.#sleep(100);

    const searchTerm = query.toLowerCase();
    const results = [];

    // Buscar en juegos predefinidos usando iteración del Map
    for (const [id, game] of this.#mockGames) {
      if (id === 'default') continue;
      
      const gameName = game.name.toLowerCase();
      const isMatch = exact 
        ? gameName === searchTerm 
        : gameName.includes(searchTerm);
      
      if (isMatch) {
        results.push({
          bggId: game.bggId,
          name: game.name,
          yearPublished: game.yearPublished,
          image: game.image,
          thumbnail: game.thumbnail,
        });
      }
    }

    // Si no se encuentra nada, retornar resultados genéricos para búsqueda no exacta
    if (results.length === 0 && !exact) {
      const defaultGame = this.#mockGames.get('default');
      results.push({
        bggId: 999,
        name: `${query} - Mock Result`,
        yearPublished: 2024,
        image: defaultGame.image,
        thumbnail: defaultGame.thumbnail,
      });
    }

    return results;
  }

  /**
   * Obtener detalles completos de un juego por su ID de BGG (simulado)
   * @param {number} bggId - ID del juego en BGG
   * @returns {Promise<Object>} - Información completa del juego
   */
  async getGameDetails(bggId) {
    console.log(`[MOCK BGG] Getting details for bggId: ${bggId}`);
    
    // Simular delay de red
    await this.#sleep(100);

    // Verificar si el juego existe en nuestra base de datos mock
    const game = this.#getGame(bggId);
    
    if (game) {
      return { ...game };
    }

    // Si no existe, verificar si es un ID muy alto (probablemente inexistente)
    if (bggId > 500000) {
      throw new Error('Juego no encontrado en BGG');
    }

    // Para IDs desconocidos, retornar un juego genérico
    const defaultGame = this.#mockGames.get('default');
    return {
      ...defaultGame,
      bggId: Number(bggId),
      name: `Mock Game ${bggId}`,
    };
  }

  /**
   * Obtener juegos populares (Hot List) (simulado)
   * @param {number} limit - Número de juegos a obtener
   * @returns {Promise<Array>} - Lista de IDs de juegos populares
   */
  async getHotGames(limit = 10) {
    console.log(`[MOCK BGG] Getting hot games, limit: ${limit}`);
    
    // Simular delay de red
    await this.#sleep(100);

    return this.#hotList.slice(0, Math.min(limit, this.#hotList.length));
  }

  /**
   * Validar si un ID de BGG existe (simulado)
   * @param {number} bggId - ID a validar
   * @returns {Promise<boolean>} - true si existe
   */
  async validateBGGId(bggId) {
    try {
      await this.getGameDetails(bggId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtener estadísticas de la caché (mock)
   * @returns {Promise<Object>}
   */
  async getCacheStats() {
    const BGGCache = require('../models/BGGCache');
    return BGGCache.getCacheStats();
  }

  /**
   * Invalidar caché de un juego (mock)
   * @param {number} bggId
   * @returns {Promise<void>}
   */
  async invalidateCache(bggId) {
    const BGGCache = require('../models/BGGCache');
    return BGGCache.invalidateCache(bggId);
  }

  /**
   * Limpiar toda la caché (mock)
   * @returns {Promise<void>}
   */
  async clearCache() {
    const BGGCache = require('../models/BGGCache');
    return BGGCache.clearCache();
  }

  /**
   * Simular delay de red
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise<void>}
   * @private
   */
  #sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exportar instancia singleton
module.exports = new MockBGGService();
