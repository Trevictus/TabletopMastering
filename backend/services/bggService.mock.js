/**
 * Mock del servicio BGG para tests
 * Este servicio simula las respuestas de BoardGameGeek sin hacer llamadas reales a la API
 */

class MockBGGService {
  constructor() {
    this.mockGames = {
      13: {
        bggId: 13,
        name: 'Catan',
        description: 'In Catan, players try to be the dominant force on the island of Catan by building settlements, cities, and roads. On each turn dice are rolled to determine what resources the island produces.',
        image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=400&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=150&h=150&fit=crop',
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
        rating: {
          average: 7.2,
          usersRated: 95000,
          bayesAverage: 7.1,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      },
      174430: {
        bggId: 174430,
        name: 'Gloomhaven',
        description: 'Gloomhaven is a game of Euro-inspired tactical combat in a persistent world of shifting motives.',
        image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=150&h=150&fit=crop',
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
        rating: {
          average: 8.7,
          usersRated: 75000,
          bayesAverage: 8.4,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      },
      167791: {
        bggId: 167791,
        name: 'Terraforming Mars',
        description: 'In the 2400s, mankind begins to terraform the planet Mars. Giant corporations, sponsored by the World Government on Earth, initiate huge projects to raise the temperature, oxygen level, and ocean coverage.',
        image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=400&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=150&h=150&fit=crop',
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
        rating: {
          average: 8.4,
          usersRated: 89000,
          bayesAverage: 8.2,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      },
      266192: {
        bggId: 266192,
        name: 'Wingspan',
        description: 'Wingspan is a competitive, medium-weight, card-driven, engine-building board game about birds.',
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=150&h=150&fit=crop',
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
        rating: {
          average: 8.0,
          usersRated: 98000,
          bayesAverage: 7.9,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      },
      169786: {
        bggId: 169786,
        name: 'Scythe',
        description: 'It is a time of unrest in 1920s Europa. The ashes from the first great war still darken the snow. Lead your faction to victory.',
        image: 'https://images.unsplash.com/photo-1611891487603-3c08c3e0e4d0?w=400&h=400&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1611891487603-3c08c3e0e4d0?w=150&h=150&fit=crop',
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
        rating: {
          average: 8.1,
          usersRated: 91000,
          bayesAverage: 7.9,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      },
      173346: {
        bggId: 173346,
        name: '7 Wonders Duel',
        description: 'Create the greatest civilization the Ancient World has ever known in this standalone 2-player version of 7 Wonders.',
        image: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=400&h=400&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=150&h=150&fit=crop',
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
        rating: {
          average: 8.1,
          usersRated: 74000,
          bayesAverage: 7.9,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      },
      161936: {
        bggId: 161936,
        name: 'Pandemic Legacy: Season 1',
        description: 'Pandemic Legacy is a cooperative campaign game where your actions and choices carry over between games.',
        image: 'https://images.unsplash.com/photo-1606503153255-59d2b98b1866?w=400&h=400&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1606503153255-59d2b98b1866?w=150&h=150&fit=crop',
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
        rating: {
          average: 8.6,
          usersRated: 96000,
          bayesAverage: 8.3,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      },
      // Juego genérico para IDs desconocidos
      default: {
        bggId: 0,
        name: 'Mock Board Game',
        description: 'This is a mock board game for testing purposes.',
        image: 'https://via.placeholder.com/300x400?text=Mock+Game',
        thumbnail: 'https://via.placeholder.com/150x200?text=Mock',
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
        rating: {
          average: 7.0,
          usersRated: 1000,
          bayesAverage: 6.8,
        },
        source: 'bgg',
        bggLastSync: new Date(),
      }
    };

    this.hotList = [
      { bggId: 13, rank: 1, name: 'Catan', yearPublished: 1995, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 174430, rank: 2, name: 'Gloomhaven', yearPublished: 2017, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 12333, rank: 3, name: 'Twilight Struggle', yearPublished: 2005, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 167791, rank: 4, name: 'Terraforming Mars', yearPublished: 2016, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 220308, rank: 5, name: 'Gaia Project', yearPublished: 2017, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 84876, rank: 6, name: 'The Castles of Burgundy', yearPublished: 2011, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 169786, rank: 7, name: 'Scythe', yearPublished: 2016, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 173346, rank: 8, name: '7 Wonders Duel', yearPublished: 2015, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 233078, rank: 9, name: 'Clank!: A Deck-Building Adventure', yearPublished: 2016, thumbnail: 'https://via.placeholder.com/150' },
      { bggId: 161936, rank: 10, name: 'Pandemic Legacy: Season 1', yearPublished: 2015, thumbnail: 'https://via.placeholder.com/150' },
    ];
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
    await this.sleep(100);

    const searchTerm = query.toLowerCase();
    const results = [];

    // Buscar en juegos predefinidos
    for (const [id, game] of Object.entries(this.mockGames)) {
      if (id === 'default') continue;
      
      const gameName = game.name.toLowerCase();
      
      if (exact) {
        if (gameName === searchTerm) {
          results.push({
            bggId: game.bggId,
            name: game.name,
            yearPublished: game.yearPublished,
            image: game.image,
            thumbnail: game.thumbnail,
          });
        }
      } else {
        if (gameName.includes(searchTerm)) {
          results.push({
            bggId: game.bggId,
            name: game.name,
            yearPublished: game.yearPublished,
            image: game.image,
            thumbnail: game.thumbnail,
          });
        }
      }
    }

    // Si no se encuentra nada, retornar resultados genéricos para búsqueda no exacta
    if (results.length === 0 && !exact) {
      results.push({
        bggId: 999,
        name: `${query} - Mock Result`,
        yearPublished: 2024,
        image: 'https://via.placeholder.com/300x400?text=Mock+Game',
        thumbnail: 'https://via.placeholder.com/150x200?text=Mock',
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
    await this.sleep(100);

    // Verificar si el juego existe en nuestra base de datos mock
    const game = this.mockGames[bggId];
    
    if (game) {
      return { ...game };
    }

    // Si no existe, verificar si es un ID muy alto (probablemente inexistente)
    if (bggId > 500000) {
      throw new Error('Juego no encontrado en BGG');
    }

    // Para IDs desconocidos, retornar un juego genérico
    return {
      ...this.mockGames.default,
      bggId: bggId,
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
    await this.sleep(100);

    return this.hotList.slice(0, limit);
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
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener estadísticas de la caché (mock)
   * @returns {Promise<Object>}
   */
  async getCacheStats() {
    const BGGCache = require('../models/BGGCache');
    return await BGGCache.getCacheStats();
  }

  /**
   * Invalidar caché de un juego (mock)
   * @param {number} bggId
   * @returns {Promise<void>}
   */
  async invalidateCache(bggId) {
    const BGGCache = require('../models/BGGCache');
    return await BGGCache.invalidateCache(bggId);
  }

  /**
   * Limpiar toda la caché (mock)
   * @returns {Promise<void>}
   */
  async clearCache() {
    const BGGCache = require('../models/BGGCache');
    return await BGGCache.clearCache();
  }

  /**
   * Simular delay de red
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new MockBGGService();
